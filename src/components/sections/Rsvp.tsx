"use client";

import { useState, type FormEvent } from "react";
import { Decor } from "@/components/Decor";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";
import { PARTIES, type Party } from "@/lib/content";
import { type GuestRsvp } from "@/lib/guests";

type Attending = "yes" | "no";

/**
 * Số người đi — đúng hai lựa chọn, ghi nguyên chữ vào cột Guests của sheet.
 * Chọn "Trên 1" thì phải điền tên người đi cùng (ghi vào cột Other).
 */
const PARTY_SIZES = ["1", "Trên 1"] as const;
type PartySize = (typeof PARTY_SIZES)[number];

/** Lời chúc điền sẵn — khách chỉ cần gửi là đã có một câu tử tế. */
const DEFAULT_MESSAGE = "Trăm năm hạnh phúc";

/** Khách mở thiệp bằng link riêng /main/<slug>. */
export type RsvpGuest = {
  slug: string;
  name?: string;
  /** Phản hồi lần trước, đọc từ Google Sheet. */
  rsvp?: GuestRsvp;
};

type RsvpProps = { party?: Party; guest?: RsvpGuest };

function isPartySize(value: string): value is PartySize {
  return (PARTY_SIZES as readonly string[]).includes(value);
}

export function Rsvp({ party = PARTIES.main, guest }: RsvpProps = {}) {
  // Phản hồi cũ của khách (nếu có link riêng và đã từng gửi) là giá trị khởi
  // tạo của form — khách vào lại thấy đúng câu trả lời của mình và sửa trực
  // tiếp, thay vì phải điền lại từ đầu.
  const previous = guest?.rsvp;
  const answered = previous?.attending !== null && previous?.attending !== undefined;

  const [name, setName] = useState(guest?.name ?? "");
  const [attending, setAttending] = useState<Attending>(
    previous?.attending === false ? "no" : "yes",
  );
  const [partySize, setPartySize] = useState<PartySize>(
    previous?.guests && isPartySize(previous.guests) ? previous.guests : "1",
  );
  const [companions, setCompanions] = useState(previous?.companions ?? "");
  const [message, setMessage] = useState(previous?.message || DEFAULT_MESSAGE);

  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Đã gửi ít nhất một lần — lúc mở trang (đọc từ Sheet) hoặc ngay trong lượt
  // này. Quyết định chữ trên nút và dòng nhắc phía trên form.
  const [editing, setEditing] = useState(answered);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;

    const form = new FormData(e.currentTarget);
    const isComing = attending === "yes";
    const withCompanions = isComing && partySize === "Trên 1";
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
          name,
          attending: isComing,
          guests: isComing ? partySize : "",
          companions: withCompanions ? companions : "",
          message,
          website: String(form.get("website") ?? ""),
        }),
      });
      const data: { ok?: boolean } | null = await res.json().catch(() => null);
      if (!res.ok || !data?.ok) throw new Error(String(res.status));
      setSent(true);
      setEditing(true);
    } catch {
      setError(
        "Chưa gửi được phản hồi, quý khách thử lại giúp gia đình chúng tôi nhé. Nếu vẫn không được, xin nhắn trực tiếp cho cô dâu chú rể.",
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

        {/* key riêng cho hai tấm: không có key thì React dùng lại cùng một Reveal
            cho cả form lẫn lời cảm ơn, tấm cảm ơn không có hiệu ứng hiện riêng. */}
        {sent ? (
          <Reveal key="sent" className="paper-panel center stack">
            <h3 className="display-3">Đã nhận được rồi!</h3>
            <p className="body-text">
              Cảm ơn quý khách đã dành thời gian phản hồi. Gia đình chúng tôi
              mong sớm được gặp quý khách trong ngày trọng đại.
            </p>
            <div className="btn-row">
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={() => setSent(false)}
              >
                Sửa lại phản hồi
              </button>
            </div>
          </Reveal>
        ) : (
          <Reveal key="form" delay={1}>
            {/* Form nằm trên một tấm giấy riêng: mắt bám ngay vào khối cần
                điền thay vì trôi giữa nền giấy chung của cả section. */}
            <form className="paper-panel stack" onSubmit={handleSubmit}>
              {editing ? (
                <p className="rsvp-note">
                  Quý khách đã gửi phản hồi trước đó. Câu trả lời cũ được điền
                  sẵn bên dưới — sửa lại rồi gửi là gia đình chúng tôi ghi nhận
                  câu mới.
                </p>
              ) : null}

              <div className="field">
                <label className="field-label" htmlFor="rsvp-name">
                  Họ và tên
                </label>
                <input
                  id="rsvp-name"
                  name="name"
                  className="input"
                  placeholder="Nguyễn Văn A"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={120}
                  autoComplete="name"
                  required
                />
              </div>

              <div className="field">
                <span className="field-label">Quý khách sẽ tham dự chứ?</span>
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
                  <span className="field-label" id="rsvp-guests-label">
                    Số người tham dự
                  </span>
                  <div
                    className="choice-group"
                    role="group"
                    aria-labelledby="rsvp-guests-label"
                  >
                    {PARTY_SIZES.map((size) => (
                      <button
                        key={size}
                        type="button"
                        className="choice"
                        aria-pressed={partySize === size}
                        onClick={() => setPartySize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {attending === "yes" && partySize === "Trên 1" && (
                <div className="field">
                  <label className="field-label" htmlFor="rsvp-companions">
                    Điền tên người đi cùng
                  </label>
                  <textarea
                    id="rsvp-companions"
                    name="companions"
                    className="input input--short"
                    placeholder="VD: Nguyễn Văn B, Trần Thị C"
                    value={companions}
                    onChange={(e) => setCompanions(e.target.value)}
                    maxLength={300}
                    rows={2}
                    required
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
                  placeholder={DEFAULT_MESSAGE}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
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
                  {sending
                    ? "Đang gửi…"
                    : editing
                      ? "Cập nhật phản hồi"
                      : "Gửi xác nhận"}
                </button>
              </div>
            </form>
          </Reveal>
        )}
      </div>
    </section>
  );
}
