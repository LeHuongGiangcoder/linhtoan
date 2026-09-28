import { type PartyId } from "@/lib/content";

/** Đoạn đầu của link riêng: /main/<slug>. */
export function partyFromPath(value: string): PartyId | null {
  return value.trim().toLowerCase() === "main" ? "main" : null;
}

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

type Guest = { name: string; party: PartyId | null; rsvp: GuestRsvp };

/**
 * Tra tên khách theo slug từ Google Sheet.
 *
 * Chỉ chạy khi đã cấu hình RSVP_WEBHOOK_URL + RSVP_SHARED_SECRET. Chưa cấu
 * hình — hoặc Sheet lỗi, hoặc mạng chậm — thì trả về null và thiệp dùng lời
 * chào chung: link riêng vẫn mở đúng buổi tiệc vì buổi tiệc nằm ngay trong
 * đường dẫn, không phụ thuộc vào Sheet.
 */
export async function lookupGuest(slug: string): Promise<Guest | null> {
  const url = process.env.RSVP_WEBHOOK_URL;
  const secret = process.env.RSVP_SHARED_SECRET;
  if (!url || !secret || !slug) return null;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, action: "guests" }),
      // Cache để mỗi lượt mở thiệp không phải chờ Apps Script trả lời. Một
      // phút thôi chứ không lâu hơn: câu trả lời cũ của khách cũng đọc từ đây,
      // cache dài là khách vừa sửa xong, tải lại trang vẫn thấy đáp án cũ.
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;

    const data: unknown = await res.json();
    if (!data || typeof data !== "object" || !("guests" in data)) return null;

    const guests = (data as { guests?: unknown }).guests;
    if (!Array.isArray(guests)) return null;

    const wanted = slug.toLowerCase();
    for (const raw of guests) {
      if (!raw || typeof raw !== "object") continue;
      const g = raw as {
        slug?: unknown;
        name?: unknown;
        event?: unknown;
        attending?: unknown;
        guests?: unknown;
        other?: unknown;
        message?: unknown;
      };
      if (String(g.slug ?? "").toLowerCase() !== wanted) continue;
      return {
        name: String(g.name ?? "").trim(),
        party: partyFromPath(String(g.event ?? "")),
        rsvp: {
          attending: typeof g.attending === "boolean" ? g.attending : null,
          guests: String(g.guests ?? "").trim(),
          companions: String(g.other ?? "").trim(),
          message: String(g.message ?? "").trim(),
        },
      };
    }
    return null;
  } catch {
    // Thiệp không được hỏng chỉ vì Sheet trục trặc.
    return null;
  }
}
