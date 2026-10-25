import { cache } from "react";

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
 *
 * "trai2" (hay "nhà trai 2", "groom2") là thiệp nhà trai có thêm phần Gia
 * đình. Phải xét TRƯỚC "trai": chữ số dính liền nên `\btrai\b` không khớp
 * "trai2", và nếu để sau thì "nhà trai 2" rơi vào nhánh nhà trai thường.
 */
export function partyFromSide(value: string): PartyId {
  const text = String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/gi, "d")
    .trim()
    .toLowerCase();
  if (!text) return DEFAULT_PARTY;

  if (/\b(trai|nam|chu re|groom)\s*2\b/.test(text)) return "groom2";
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
 *
 * Chia làm hai lượt thay vì một lượt dài: cái hay trượt là cold start của Apps
 * Script, mà lượt gọi đầu chính là cái đánh thức nó — lượt thứ hai gần như
 * luôn gặp script đã nóng và trả lời trong một nốt nhạc. Tổng vẫn bị chặn dưới
 * hạn chạy của một function trên Vercel, nên không đổi một lỗi này lấy một lỗi
 * khác (504).
 */
const TIMEOUT_MS = 7_000;
const ATTEMPTS = 2;

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

/** Rút lý do Apps Script trả về, để log nói đúng chuyện gì đã xảy ra. */
function describe(payload: unknown): string {
  if (typeof payload !== "object" || payload === null) {
    return `kiểu dữ liệu lạ (${typeof payload})`;
  }
  const error = (payload as { error?: unknown }).error;
  if (typeof error === "string" && error) return `lỗi "${error}"`;
  return `thiếu mảng guests (các khoá: ${Object.keys(payload).join(", ") || "rỗng"})`;
}

/**
 * Kết quả tra một slug. Ba trạng thái, KHÔNG gộp làm một:
 *
 * - `found`       — có khách này, dựng thiệp riêng cho họ.
 * - `missing`     — đọc được danh sách nhưng không có slug này (gõ sai link,
 *                   hoặc hàng đã bị xoá). Tải lại bao nhiêu lần cũng vậy.
 * - `unavailable` — KHÔNG đọc được danh sách. Khách có thể hoàn toàn hợp lệ,
 *                   chỉ là lúc này không tra được.
 *
 * Trước đây cả ba đều trả `null` như nhau, nên trang không phân biệt được và
 * cứ dựng thiệp mặc định (nhà trai) cho tất cả — khách nhà gái rơi vào đúng
 * lúc Sheet trục trặc là thấy sai cả ngày lẫn địa điểm mà không hề hay biết.
 */
export type GuestLookup =
  | { status: "found"; guest: Guest }
  | { status: "missing" }
  | { status: "unavailable" };

/**
 * Cả danh sách khách từ Google Sheet.
 *
 * Chỉ chạy khi đã cấu hình RSVP_WEBHOOK_URL + RSVP_SHARED_SECRET. Chưa cấu
 * hình — hoặc Sheet lỗi, hoặc mạng chậm — thì trả về bản đọc được gần nhất,
 * và nếu chưa từng đọc được lần nào thì trả về null.
 *
 * Lúc đó thiệp chào chung "Quý khách" VÀ hiện buổi tiệc mặc định (nhà trai),
 * vì cả tên lẫn nhà đều nằm trong Sheet. Mất Sheet là khách nhà gái thấy sai
 * địa điểm, nên hỏng ở đây nghiêm trọng hơn trước khi tách thiệp.
 */
const loadGuests = cache(async function loadGuests(): Promise<Guest[] | null> {
  const url = process.env.RSVP_WEBHOOK_URL;
  const secret = process.env.RSVP_SHARED_SECRET;
  if (!url || !secret) return lastGood;

  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret, action: "guests" }),
        // `cache` phải khai thẳng: từ Next 16 fetch KHÔNG còn cache mặc định,
        // chỉ `next.revalidate` là đang dựa vào hành vi không ghi trong tài
        // liệu (tài liệu chỉ nói tới `cache: "force-cache"`, và nói rõ rằng
        // muốn cache một POST thì phải khai nó). Mất cache thì mỗi lượt khách
        // mở thiệp là một lượt gọi Apps Script — hỏng là hỏng hàng loạt.
        cache: "force-cache",
        next: { revalidate: TTL_SECONDS, tags: [GUESTS_TAG] },
        signal: AbortSignal.timeout(TIMEOUT_MS),
      });
      if (!res.ok) {
        console.error(
          `Danh sách khách: Apps Script trả ${res.status} (lượt ${attempt}/${ATTEMPTS})`,
        );
        continue;
      }

      const payload: unknown = await res.json();
      const guests = parseGuests(payload);
      if (!guests || guests.length === 0) {
        // Sheet trống thì đúng là không có khách nào; nhưng gặp trang HTML đăng
        // nhập (deploy sai quyền) cũng ra đây — giữ bản cũ cho chắc.
        //
        // In kèm lý do Apps Script tự khai: "unauthorized" là secret hai bên
        // lệch nhau, còn lỗi khác là script văng giữa chừng. Không có dòng này
        // thì log chỉ nói "không dùng được" và phải ngồi đoán.
        //
        // Không thử lại: sai secret hay deploy sai quyền thì lượt sau cũng y
        // hệt, chỉ tổ bắt khách chờ thêm một nhịp timeout nữa.
        console.error(
          "Danh sách khách: Apps Script trả về dữ liệu không dùng được —",
          describe(payload),
        );
        return lastGood;
      }

      lastGood = guests;
      return guests;
    } catch (err) {
      // Thiệp không được hỏng chỉ vì Sheet trục trặc.
      console.error(
        `Danh sách khách: không gọi được Apps Script (lượt ${attempt}/${ATTEMPTS})`,
        err,
      );
    }
  }

  return lastGood;
});

/**
 * Tra khách theo slug từ link riêng.
 *
 * So khớp không phân biệt hoa thường: link đã gửi cho khách có thể được gõ
 * lại hoặc sửa tay thành "Trang-va-Duy-Anh" trong khi Sheet lưu
 * "trang-va-duy-anh" — hai dạng đó phải là một người.
 */
export async function lookupGuest(slug: string): Promise<GuestLookup> {
  const wanted = slug.trim().toLowerCase();
  if (!wanted) return { status: "missing" };

  const guests = await loadGuests();
  if (!guests) return { status: "unavailable" };

  const guest = guests.find((g) => g.slug === wanted && g.name);
  return guest ? { status: "found", guest } : { status: "missing" };
}
