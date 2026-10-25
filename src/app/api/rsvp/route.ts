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

import { revalidateTag } from "next/cache";
import { GUESTS_TAG } from "@/lib/guests";

const MAX_BODY = 5_000;
const MAX_NAME = 120;
const MAX_MESSAGE = 1_000;
const MAX_COMPANIONS = 300;
/** Hai lựa chọn của form, ghi nguyên chữ vào cột Guests. */
const PARTY_SIZES = ["1", "Trên 1"];
const SLUG = /^[a-z0-9-]{1,80}$/;

type Reply = { ok: true } | { ok: false; error: string };

const reply = (body: Reply, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  // Trần hai đầu như bên `loadGuests`: ký tự trắng thừa lúc dán vào Vercel là
  // đủ để Apps Script trả "unauthorized".
  const url = process.env.RSVP_WEBHOOK_URL?.trim();
  const secret = process.env.RSVP_SHARED_SECRET?.trim();
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

  // Không đến thì bỏ trống cả số người lẫn tên người đi cùng.
  const guests = attending ? input.guests : "";
  if (attending && (typeof guests !== "string" || !PARTY_SIZES.includes(guests))) {
    return reply({ ok: false, error: "invalid-guests" }, 400);
  }

  const companions =
    attending && guests === "Trên 1" && typeof input.companions === "string"
      ? input.companions.trim()
      : "";
  if (attending && guests === "Trên 1" && (!companions || companions.length > MAX_COMPANIONS)) {
    return reply({ ok: false, error: "invalid-companions" }, 400);
  }

  const message = typeof input.message === "string" ? input.message.trim() : "";
  if (message.length > MAX_MESSAGE) {
    return reply({ ok: false, error: "invalid-message" }, 400);
  }

  // Slug lấy từ link riêng — có thì Apps Script ghi đè đúng hàng của khách đó,
  // không có (khách mở trang chủ) thì nối thành hàng mới.
  //
  // Hạ về chữ thường TRƯỚC khi kiểm: link gửi cho khách có thể mang chữ hoa
  // ("/main/Trang-va-Duy-Anh"), mà so với khuôn chữ thường thì trượt, slug
  // thành rỗng và phản hồi bị ghi thành một hàng mới thay vì cập nhật đúng
  // hàng của khách đó.
  const rawSlug = typeof input.slug === "string" ? input.slug.trim().toLowerCase() : "";
  const slug = SLUG.test(rawSlug) ? rawSlug : "";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret,
        slug,
        name,
        attending,
        guests, // → cột Guests: "1" | "Trên 1"
        other: companions, // → cột Other: tên người đi cùng
        message,
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

    // Danh sách khách trong cache vừa cũ đi — nhưng đánh dấu kiểu "max", tức
    // là vẫn phục vụ bản cũ trong lúc lặng lẽ đọc lại ở nền.
    //
    // KHÔNG dùng `{ expire: 0 }` như trước: nó bắt lượt đọc kế tiếp phải chờ
    // Apps Script trả lời xong mới được render. Nghĩa là cứ một khách bấm gửi
    // là khách TIẾP THEO mở thiệp phải gánh nguyên một lượt gọi Apps Script —
    // gặp lúc script nguội (hay bị dồn) là quá hạn chờ, và khách đó bị chào
    // chung "Quý khách" kèm luôn buổi tiệc mặc định.
    //
    // Đổi lại: chính người vừa gửi nếu tải lại trang ngay có thể còn thấy câu
    // trả lời cũ một nhịp. Chấp nhận được — gửi xong form đã hiện tấm "Đã nhận
    // được rồi!" ngay tại chỗ, không ai phải tải lại để kiểm tra.
    revalidateTag(GUESTS_TAG, "max");

    return reply({ ok: true });
  } catch (err) {
    console.error("RSVP: không gọi được Apps Script", err);
    return reply({ ok: false, error: "upstream" }, 502);
  }
}
