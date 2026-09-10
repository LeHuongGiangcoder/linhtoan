"use client";

import { useState, type FormEvent } from "react";
import { Decor } from "@/components/Decor";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";
import { PARTIES, type Party } from "@/lib/content";

type Attending = "yes" | "no";

export function Rsvp({ party = PARTIES.intimate }: { party?: Party } = {}) {
  const [attending, setAttending] = useState<Attending>("yes");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    // TODO: nối endpoint thật (Google Sheet / n8n / API route) tại đây.
    await new Promise((r) => setTimeout(r, 600));
    setSending(false);
    setSent(true);
  }

  return (
    <section id="rsvp" className="section section--fit section--bleed relative">
      {/* `front` để hai đài hoa nằm trên tấm giấy của form (z-3 > .section-inner
          z-2) — không có nó thì tấm giấy che mất chân hoa. */}
      <Decor id="el-18" width="36%" bottom="0%" left="-10%" front />
      <Decor id="el-18" width="36%" bottom="0%" right="-10%" flip front />

      <div className="section-inner">
        <Reveal className="section-head">
          <p className="eyebrow">Xác nhận tham dự</p>
          <h2 className="display-2">R.S.V.P</h2>
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
                />
              </div>

              <input type="hidden" name="attending" value={attending} />
              {/* Ghi kèm buổi tiệc khách đang xem để phản hồi không bị lẫn */}
              <input type="hidden" name="party" value={party.id} />

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
