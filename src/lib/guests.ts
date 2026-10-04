import { DEFAULT_PARTY, type PartyId } from "@/lib/content";

/**
 * Đoạn buổi tiệc trong link riêng: /main/<slug>.
 *
 * Giờ thiệp tách theo nhà, nhưng đoạn này vẫn là "main" cho MỌI khách — nhà
 * trai hay nhà gái đều dùng chung một đường dẫn. Đổi nó là hỏng toàn bộ link
 * đã gửi đi. Nhà nào thì đọc từ cột "Nhà" trong Sheet (xem `partyFromSide`).
 */
export const EVENT_KEY = "main";

export function isEventPath(value: string): boolean {
  return value.trim().toLowerCase() === EVENT_KEY;
}

/**
 * Cột "Nhà" trong Google Sheet → tấm thiệp khách sẽ thấy.
 *
 * Cô dâu chú rể gõ tay cột này nên nhận mọi cách viết thường gặp: "Nhà gái",
 * "gái", "Gai", "nữ", "bride"… Bỏ trống hoặc gõ gì không hiểu thì về thiệp
 * mặc định, vì thà sai địa điểm cho vài người còn hơn vỡ cả trang.
 */
export function partyFromSide(value: string): PartyId {
  const text = String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .trim()
    .toLowerCase();
  if (!text) return DEFAULT_PARTY;

  if (/\b(gai|nu|co dau|bride)\b/.test(text)) return "bride";
  if (/\b(trai|nam|chu re|groom)\b/.test(text)) return "groom";
  return DEFAULT_PARTY;
}

/**
 * Tên cache của danh sách khách. Route /api/rsvp gọi `revalidateTag` với tên
 * này ngay sau khi ghi xong, để khách vừa sửa phản hồi mà tải lại trang là
 * thấy đúng câu trả lời mới chứ không phải bản cũ còn trong cache.
 */
export const GUESTS_TAG = "guests";

/**
 * Danh sách khách gần như không đổi, nên giữ cache lâu: mỗi lượt gọi Apps
 * Script là một lần có thể chậm hoặc lỗi, mà lỗi thì thiệp phải chào chung
 * "Quý khách" thay vì tên khách. Cần mới hơn thì đã có `revalidateTag`.
 */
const TTL_SECONDS = 300;

/**
 * Apps Script chạy chậm — cold start, lại còn xếp hàng sau LockService khi có
 * người đang gửi RSVP. 6 giây (mốc cũ) là không đủ, và mỗi lần hết giờ là một
 * khách mở link riêng mà bị chào chung.
 */
const TIMEOUT_MS = 10_000;

/**
 * Phản hồi khách đã gửi lần trước, đọc ngược từ Sheet.
 *
 * `attending: null` nghĩa là chưa trả lời lần nào — form mở ra ở trạng thái
 * mặc định. Có giá trị thì form điền sẵn đúng câu trả lời cũ để khách sửa.
 */
export type GuestRsvp = {
  attending: boolean | null;
  /** "1" | "Trên 1" — đúng chữ khách đã chọn */
  guests: string;
  /** Tên người đi cùng */
  companions: string;
  message: string;
};

export type Guest = {
  /** Slug đã hạ về chữ thường — dùng để so khớp, không phân biệt hoa thường. */
  slug: string;
  name: string;
  /** Nhà trai hay nhà gái — quyết định giờ và địa điểm trên thiệp. */
  party: PartyId;
  rsvp: GuestRsvp;
};

/**
 * Danh sách đọc được gần nhất, giữ trong bộ nhớ của tiến trình.
 *
 * Lưới an toàn cuối cùng: Apps Script chậm hay lỗi một lượt thì vẫn còn tên
 * khách của lượt trước để chào, thay vì tụt về "Quý khách". Bộ nhớ này mất khi
 * máy chủ khởi động lại — nó bù cho sự cố nhất thời, không thay cache của Next.
 */
let lastGood: Guest[] | null = null;

function parseGuests(data: unknown): Guest[] | null {
  if (!data || typeof data !== "object" || !("guests" in data)) return null;

  const raw = (data as { guests?: unknown }).guests;
  if (!Array.isArray(raw)) return null;

  const out: Guest[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const g = item as Record<string, unknown>;
    const slug = String(g.slug ?? "").trim().toLowerCase();
    if (!slug) continue;

    out.push({
      slug,
      name: String(g.name ?? "").trim(),
      party: partyFromSide(String(g.side ?? "")),
      rsvp: {
        attending: typeof g.attending === "boolean" ? g.attending : null,
        guests: String(g.guests ?? "").trim(),
        companions: String(g.other ?? "").trim(),
        message: String(g.message ?? "").trim(),
      },
    });
  }
  return out;
}

/**
 * Cả danh sách khách từ Google Sheet.
 *
 * Chỉ chạy khi đã cấu hình RSVP_WEBHOOK_URL + RSVP_SHARED_SECRET. Chưa cấu
 * hình — hoặc Sheet lỗi, hoặc mạng chậm — thì trả về bản đọc được gần nhất,
 * và nếu chưa từng đọc được lần nào thì trả về null: thiệp dùng lời chào
 * chung, link riêng vẫn mở đúng buổi tiệc vì buổi tiệc nằm ngay trong đường
 * dẫn, không phụ thuộc vào Sheet.
 */
async function loadGuests(): Promise<Guest[] | null> {
  const url = process.env.RSVP_WEBHOOK_URL;
  const secret = process.env.RSVP_SHARED_SECRET;
  if (!url || !secret) return lastGood;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, action: "guests" }),
      next: { revalidate: TTL_SECONDS, tags: [GUESTS_TAG] },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) {
      console.error("Danh sách khách: Apps Script trả", res.status);
      return lastGood;
    }

    const guests = parseGuests(await res.json());
    if (!guests || guests.length === 0) {
      // Sheet trống thì đúng là không có khách nào; nhưng gặp trang HTML đăng
      // nhập (deploy sai quyền) cũng ra đây — giữ bản cũ cho chắc.
      console.error("Danh sách khách: Apps Script trả về dữ liệu không dùng được");
      return lastGood;
    }

    lastGood = guests;
    return guests;
  } catch (err) {
    // Thiệp không được hỏng chỉ vì Sheet trục trặc.
    console.error("Danh sách khách: không gọi được Apps Script", err);
    return lastGood;
  }
}

/**
 * Tra khách theo slug từ link riêng.
 *
 * So khớp không phân biệt hoa thường: link đã gửi cho khách có thể được gõ
 * lại hoặc sửa tay thành "Trang-va-Duy-Anh" trong khi Sheet lưu
 * "trang-va-duy-anh" — hai dạng đó phải là một người.
 */
export async function lookupGuest(slug: string): Promise<Guest | null> {
  const wanted = slug.trim().toLowerCase();
  if (!wanted) return null;

  const guests = await loadGuests();
  if (!guests) return null;

  return guests.find((g) => g.slug === wanted && g.name) ?? null;
}
