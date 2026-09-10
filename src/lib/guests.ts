import { PARTY_ORDER, type PartyId } from "@/lib/content";

/**
 * Buổi tiệc nào thì xem được những gì.
 *
 * Khách tiệc thân mật được mời cả hai buổi nên thấy cả hai; khách tiệc chính
 * chỉ thấy tiệc chính. Quy tắc này phải khớp với `ACCESS` trong
 * docs/apps-script.gs — sửa một bên là phải sửa bên kia.
 */
export const PARTY_ACCESS: Record<PartyId, PartyId[]> = {
  intimate: PARTY_ORDER,
  main: ["main"],
};

/** Đoạn đầu của link riêng: /intimate/<slug> hoặc /main/<slug>. */
export function partyFromPath(value: string): PartyId | null {
  const key = value.trim().toLowerCase();
  return key === "intimate" || key === "main" ? key : null;
}

type Guest = { name: string; party: PartyId | null };

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
      // Danh sách khách đổi rất ít; cache 5 phút để mỗi lượt mở thiệp không
      // phải chờ Apps Script trả lời.
      next: { revalidate: 300 },
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
      const g = raw as { slug?: unknown; name?: unknown; event?: unknown };
      if (String(g.slug ?? "").toLowerCase() !== wanted) continue;
      return {
        name: String(g.name ?? "").trim(),
        party: partyFromPath(String(g.event ?? "")),
      };
    }
    return null;
  } catch {
    // Thiệp không được hỏng chỉ vì Sheet trục trặc.
    return null;
  }
}
