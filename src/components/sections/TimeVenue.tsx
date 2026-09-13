import Image from "next/image";
import type { ReactNode } from "react";
import { Cross } from "@/components/Cross";
import { Divider } from "@/components/Divider";
import { MiniCalendar } from "@/components/MiniCalendar";
import { Reveal } from "@/components/Reveal";
import { ART } from "@/lib/layers";
import { PARTIES, type Party } from "@/lib/content";

function Head({
  eyebrow,
  title,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={`section-head ${className}`}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="display-2">{title}</h2>
      <Divider />
    </Reveal>
  );
}

/**
 * Thời gian & Địa điểm — một section, hai phần.
 *
 * Phần Thời gian nằm trọn trong khung vòm của tranh thiên nga: tranh trải hết
 * bề ngang trang, còn khối chữ được neo bằng % vào đúng lòng vòm, và cỡ chữ
 * tính theo bề ngang khung (cqw) — nên ở mọi màn hình chữ vẫn nằm gọn trong
 * vòm, không tràn ra viền hoa văn.
 *
 * Mặc định tiệc chính để route xem thử từng section vẫn gọi được không tham số.
 */
export function TimeVenue({ party = PARTIES.main }: { party?: Party } = {}) {
  const month = party.startsAt.slice(5, 7).replace(/^0/, "");
  const year = party.startsAt.slice(0, 4);

  return (
    <section id="time-venue" className="section section--time relative">
      <div className="time-frame">
        <Image
          src={ART["time-frame"].src}
          alt=""
          aria-hidden
          width={ART["time-frame"].w}
          height={ART["time-frame"].h}
          sizes="(max-width: 640px) 100vw, 640px"
          className="time-frame-art"
        />

        <div className="time-frame-content">
          <Reveal className="time-frame-head">
            <p className="time-eyebrow">Ghi nhớ ngày này</p>
            <h2 className="time-title">Thời gian</h2>
          </Reveal>

          <Reveal delay={1} className="time-frame-cal">
            <Cross size="1em" className="opacity-60" />
            <p className="time-month">
              Tháng {month} · {year}
            </p>
            <MiniCalendar startsAt={party.startsAt} />
            <p className="time-when">
              <span className="time-when-day">{party.weekday}</span>
              <span className="time-when-sep" aria-hidden>
                ·
              </span>
              <span className="time-when-hour">{party.time}</span>
            </p>
          </Reveal>
        </div>
      </div>

      <div className="section-inner">
        <Head eyebrow="Nơi gặp nhau" title="Địa điểm" className="mt-6" />

        <Reveal delay={1}>
          <Image
            src={ART.venue.src}
            alt={`Minh hoạ ${party.venue}`}
            width={ART.venue.w}
            height={ART.venue.h}
            sizes="(max-width: 640px) 100vw, 544px"
            className="venue-art"
          />
        </Reveal>

        <Reveal delay={2} className="venue-text">
          <p className="eyebrow eyebrow--tight">{party.event}</p>
          <h3 className="display-3 text-balance">{party.venue}</h3>
          {party.hall ? (
            <p className="body-text body-text--sm !text-[var(--color-olive)]">
              {party.hall}
            </p>
          ) : null}
          <p className="body-text body-text--sm text-balance">
            {party.address}
          </p>
        </Reveal>

        <Reveal delay={3} className="btn-row mt-8">
          <a
            className="btn btn--outline"
            href={party.mapUrl}
            target="_blank"
            rel="noreferrer noopener"
          >
            Xem bản đồ
          </a>
        </Reveal>
      </div>
    </section>
  );
}
