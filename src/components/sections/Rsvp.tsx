"use client";

import { useState, type FormEvent } from "react";
import { Decor } from "@/components/Decor";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";
import { PARTIES, type Party } from "@/lib/content";

type Attending = "yes" | "no";

/** Khách mở thiệp bằng link riêng /main/<slug>. */
export type RsvpGuest = { slug: string; name?: string };

type RsvpProps = { party?: Party; guest?: RsvpGuest };

export function Rsvp({ party = PARTIES.main, guest }: RsvpProps = {}) {
  const [attending, setAttending] = useState<Attending>("yes");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    const form = new FormData(e.currentTarget);
    const isComing = attending === "yes";
    setSending(true);
    setError(null);

    try {
      // Gửi qua route của chính site (src/app/api/rsvp) — route đó mới giữ
      // secret của Apps Script, trình duyệt không bao giờ thấy.
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: guest?.slug ?? "",
          name: String(form.get("name") ?? ""),
          attending: isComing,
          guestCount: isComing ? Number(form.get("guests") ?? 1) : 0,
          message: String(form.get("message") ?? ""),
          website: String(form.get("website") ?? ""),
        }),
      });
      const data: { ok?: boolean } | null = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(String(res.status));
      setSent(true);
    } catch {
      setError(
        "Chưa gửi được phản hồi, bạn thử lại giúp chúng mình nhé. Nếu vẫn không được, hãy nhắn trực tiếp cho cô dâu chú rể.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="rsvp" className="section section--fit section--bleed section--lily relative">
      {/* Cành hoa rum ôm góc trên trái: hoa vắt ngang phía trên tiêu đề, thân
          thả dọc mép trái rồi lẩn sau tấm giấy của form (decor z-0 dưới nội
          dung z-2) — như họa tiết góc của một tấm menu in. */}
      <Decor id="rsvp-lily" width="60%" top="1rem" left="0" className="motion-sway" />

      {/* `front` để hai đài hoa nằm trên tấm giấy của form (z-3 > .section-inner
          z-2) — không có nó thì tấm giấy che mất chân hoa. */}
      <Decor id="el-18" width="36%" bottom="0%" left="-10%" front />
      <Decor id="el-18" width="36%" bottom="0%" right="-10%" flip front />

      <div className="section-inner">
        <Reveal className="section-head">
          <p className="eyebrow">Xác nhận tham dự</p>
          <h2 className="display-2">Hồi âm</h2>
          <p className="eyebrow eyebrow--tight">{party.tab}</p>
          <Divider />
        </Reveal>

        {sent ? (
          <Reveal className="paper-panel center stack">
            <h3 className="display-3">Đã nhận được rồi!</h3>
            <p className="body-text">
              Cảm ơn bạn đã dành thời gian phản hồi. Chúng mình mong sớm được
              gặp bạn trong ngày trọng đại.
            </p>
            <div className="btn-row">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setSent(false)}
              >
                Gửi phản hồi khác
              </button>
            </div>
          </Reveal>
        ) : (
          <Reveal delay={1}>
            {/* Form nằm trên một tấm giấy riêng: mắt bám ngay vào khối cần
                điền thay vì trôi giữa nền giấy chung của cả section. */}
            <form className="paper-panel stack" onSubmit={handleSubmit}>
              <div className="field">
                <label className="field-label" htmlFor="rsvp-name">
                  Họ và tên
                </label>
                <input
                  id="rsvp-name"
                  name="name"
                  className="input"
                  placeholder="Nguyễn Văn A"
                  defaultValue={guest?.name ?? ""}
                  maxLength={120}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="field">
                <span className="field-label">Bạn sẽ tham dự chứ?</span>
                <div className="choice-group">
                  <button
                    type="button"
                    className="choice"
                    aria-pressed={attending === "yes"}
                    onClick={() => setAttending("yes")}
                  >
                    Có, chắc chắn
                  </button>
                  <button
                    type="button"
                    className="choice"
                    aria-pressed={attending === "no"}
                    onClick={() => setAttending("no")}
                  >
                    Rất tiếc
                  </button>
                </div>
              </div>

              {attending === "yes" && (
                <div className="field">
                  <label className="field-label" htmlFor="rsvp-guests">
                    Số người tham dự
                  </label>
                  <input
                    id="rsvp-guests"
                    name="guests"
                    className="input"
                    type="number"
                    min={1}
                    max={10}
                    defaultValue={1}
                  />
                </div>
              )}

              <div className="field">
                <label className="field-label" htmlFor="rsvp-message">
                  Lời chúc gửi cô dâu chú rể
                </label>
                <textarea
                  id="rsvp-message"
                  name="message"
                  className="input"
                  placeholder="Chúc hai bạn trăm năm hạnh phúc…"
                  maxLength={1000}
                />
              </div>

              {/* Ô bẫy chống spam: ẩn khỏi người dùng và trình đọc màn hình,
                  chỉ bot điền vào. Route /api/rsvp bỏ qua mọi phản hồi có ô này. */}
              <div className="rsvp-trap" aria-hidden>
                <label htmlFor="rsvp-website">Website</label>
                <input
                  id="rsvp-website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {error ? (
                <p className="rsvp-error" role="alert">
                  {error}
                </p>
              ) : null}

              <div className="btn-row pt-2">
                <button
                  type="submit"
                  className="btn btn--primary"
                  disabled={sending}
                >
                  {sending ? "Đang gửi…" : "Gửi xác nhận"}
                </button>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
