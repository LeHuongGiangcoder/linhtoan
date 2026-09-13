/**
 * Nhận phản hồi RSVP từ form và chuyển tiếp sang Apps Script của Google Sheet.
 *
 * Form không gọi thẳng Apps Script: RSVP_SHARED_SECRET là thứ duy nhất canh
 * cửa Web App (Web App phải để "Anyone"), gọi từ trình duyệt là lộ chuỗi bí
 * mật cho mọi người mở thiệp. Route này chạy trên server nên secret không bao
 * giờ rời khỏi máy chủ.
 *
 * Xem docs/RSVP_SETUP.md và hàm doPost / writeRsvp_ trong docs/apps-script.gs.
 */

const MAX_BODY = 5_000;
const MAX_NAME = 120;
const MAX_MESSAGE = 1_000;
const MAX_GUESTS = 10;
const SLUG = /^[a-z0-9-]{1,80}$/;

type Reply = { ok: true } | { ok: false; error: string };

const reply = (body: Reply, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  const url = process.env.RSVP_WEBHOOK_URL;
  const secret = process.env.RSVP_SHARED_SECRET;
  if (!url || !secret) {
    return reply({ ok: false, error: "not-configured" }, 503);
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY) return reply({ ok: false, error: "too-large" }, 413);

  let input: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") throw new Error();
    input = parsed as Record<string, unknown>;
  } catch {
    return reply({ ok: false, error: "bad-json" }, 400);
  }

  // Ô bẫy ẩn trong form: người thật không thấy nên không điền, bot điền hết
  // mọi ô. Trả "ok" để bot tưởng đã gửi được, nhưng không ghi gì vào sheet.
  if (typeof input.website === "string" && input.website.trim()) {
    return reply({ ok: true });
  }

  const name = typeof input.name === "string" ? input.name.trim() : "";
  if (!name || name.length > MAX_NAME) {
    return reply({ ok: false, error: "invalid-name" }, 400);
  }

  if (typeof input.attending !== "boolean") {
    return reply({ ok: false, error: "invalid-attending" }, 400);
  }
  const attending = input.attending;

  const count = Number(input.guestCount);
  const guestCount = attending
    ? Number.isInteger(count) && count >= 1 && count <= MAX_GUESTS
      ? count
      : null
    : 0;
  if (guestCount === null) {
    return reply({ ok: false, error: "invalid-guests" }, 400);
  }

  const message = typeof input.message === "string" ? input.message.trim() : "";
  if (message.length > MAX_MESSAGE) {
    return reply({ ok: false, error: "invalid-message" }, 400);
  }

  // Slug lấy từ link riêng — có thì Apps Script ghi đè đúng hàng của khách đó,
  // không có (khách mở trang chủ) thì nối thành hàng mới.
  const slug =
    typeof input.slug === "string" && SLUG.test(input.slug) ? input.slug : "";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        slug,
        name,
        attending,
        guestCount,
        message,
        other: "",
        meal: "",
      }),
      // Apps Script chậm, lại xếp hàng các lượt ghi đồng thời (LockService
      // chờ tới 20s) — cho dư thời gian thay vì báo lỗi oan.
      signal: AbortSignal.timeout(25_000),
      cache: "no-store",
    });

    // Deploy sai quyền truy cập thì Apps Script trả trang HTML đăng nhập,
    // không phải JSON — coi như lỗi, không để khách tưởng đã gửi được.
    const data: unknown = await res.json().catch(() => null);
    if (!res.ok || !data || (data as { ok?: unknown }).ok !== true) {
      const detail = (data as { error?: unknown } | null)?.error;
      console.error("RSVP: Apps Script từ chối", res.status, detail ?? "(không phải JSON)");
      return reply({ ok: false, error: "upstream" }, 502);
    }

    return reply({ ok: true });
  } catch (err) {
    console.error("RSVP: không gọi được Apps Script", err);
    return reply({ ok: false, error: "upstream" }, 502);
  }
}
