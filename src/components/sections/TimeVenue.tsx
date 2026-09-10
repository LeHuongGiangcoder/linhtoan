import Image from "next/image";
import type { ReactNode } from "react";
import { Decor } from "@/components/Decor";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";
import { ART, PAINTING } from "@/lib/layers";
import { PARTIES, TICKET_STUB, type Party } from "@/lib/content";

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
 * Thời gian & Địa điểm — một section, hai phần trên cùng nền giấy.
 *
 * Phần Thời gian dựng lại kiểu ảnh ghép "thiệp trong phong bì": phong bì mở
 * được tách sẵn thành hai lớp (lưng và túi trước), mọi thứ khác kẹp ở giữa
 * nên trông đúng như vừa rút ra khỏi bì thư. Toàn bộ toạ độ tính theo % của
 * `.collage` (tỉ lệ cố định), vì vậy bố cục không đổi theo bề ngang màn hình.
 *
 * Mặc định `intimate` để route xem thử từng section vẫn gọi được không tham số.
 */
export function TimeVenue({ party = PARTIES.intimate }: { party?: Party } = {}) {
  return (
    <section id="time-venue" className="section relative">
      {/* Tranh sơn dầu mờ phía sau toàn bộ section — đôi thiên nga trên sông. */}
      <div className="section-painting" aria-hidden>
        <Image
          src={PAINTING.swans.src}
          alt=""
          width={PAINTING.swans.w}
          height={PAINTING.swans.h}
          sizes="(max-width: 640px) 100vw, 640px"
        />
      </div>

      <div className="section-inner">
        <Head eyebrow="Save the date" title="Thời gian" />

        <Reveal delay={1}>
          <div className="collage">
            {/* Lớp dưới cùng: hai mẩu báo cũ thò ra hai bên phong bì. Không
                đặt zIndex nên chúng nằm ở z-0, dưới mọi thứ còn lại. */}
            <Decor id="tv-news" width="17%" left="3%" top="47%" rotate={-16} />
            <Decor
              id="tv-news"
              width="15%"
              right="3%"
              top="49%"
              rotate={14}
              flip
            />

            {/* Nhành bạch diệp thò lên khỏi miệng phong bì */}
            <Decor id="tv-sprig" width="31%" left="29%" top="12%" />

            {/* Lưng phong bì — nắp mở, thấy lòng bì */}
            <Decor
              id="tv-envelope-back"
              width="82%"
              left="9%"
              top="40%"
              style={{ zIndex: 1 }}
            />

            {/* Tấm biển chạm nổi khắc tên buổi tiệc — mỗi tiệc một kiểu biển */}
            <div
              className="plaque"
              style={{
                left: "26%",
                top: "18%",
                width: "46%",
                zIndex: 3,
                transform: "rotate(-3deg)",
              }}
            >
              <Image
                key={party.plaque}
                src={ART[party.plaque].src}
                alt=""
                aria-hidden
                width={ART[party.plaque].w}
                height={ART[party.plaque].h}
                sizes="(max-width: 640px) 46vw, 180px"
              />
              <div
                className="plaque-text"
                style={{ padding: party.plaqueInset }}
              >
                <span className="plaque-title">{party.plaqueTitle}</span>
                <span className="plaque-note">{party.plaqueNote}</span>
              </div>
            </div>

            {/* Tấm vé — nơi ghi ngày giờ. zIndex cao nhất trong ảnh ghép: vé
                nằm trên cả túi trước phong bì nên vắt hẳn ra ngoài miệng bì,
                đúng kiểu vừa rút vé ra khỏi thiệp. */}
            <div
              className="ticket"
              style={{
                left: "30%",
                top: "46%",
                width: "52%",
                zIndex: 9,
                transform: "rotate(-11deg)",
              }}
            >
              <Image
                src={ART["tv-ticket"].src}
                alt=""
                aria-hidden
                width={ART["tv-ticket"].w}
                height={ART["tv-ticket"].h}
                sizes="(max-width: 640px) 52vw, 200px"
              />
              <div className="ticket-face">
                <p className="ticket-line">{party.weekday}</p>
                <p className="ticket-script">{party.dateScript}</p>
                <p className="ticket-line">{party.dateShort}</p>
                <p className="ticket-line">
                  {party.time} · {party.city}
                </p>
              </div>
              <div className="ticket-stub">
                <span>{TICKET_STUB}</span>
              </div>
            </div>

            {/* Hai bông rum gác lên mép vé */}
            <Decor
              id="tv-calla"
              width="19%"
              left="20%"
              top="50%"
              rotate={-8}
              style={{ zIndex: 10 }}
            />

            {/* Túi trước của phong bì — trùng khít lớp lưng, phủ lên chân thiệp */}
            <Decor
              id="tv-envelope-front"
              width="82%"
              left="9%"
              top="40%"
              style={{ zIndex: 6 }}
            />

            {/* Hoa gác hai chân phong bì, nằm trên cùng */}
            <Decor
              id="tv-peony"
              width="29%"
              left="1%"
              bottom="0%"
              style={{ zIndex: 7 }}
            />
            <Decor
              id="tv-blossoms"
              width="20%"
              right="1%"
              bottom="3%"
              style={{ zIndex: 7 }}
            />

            {/* Dấu xi gắn giữa mặt phong bì, thay cho chữ lồng */}
            <Decor
              id="tv-seal"
              width="15%"
              left="43%"
              bottom="12%"
              rotate={-6}
              style={{ zIndex: 8 }}
            />
          </div>
        </Reveal>

        <Head eyebrow="Nơi gặp nhau" title="Địa điểm" className="mt-14" />

        <Reveal delay={1}>
          <div className="letter">
            <Image
              src={ART["tv-letter"].src}
              alt=""
              aria-hidden
              width={ART["tv-letter"].w}
              height={ART["tv-letter"].h}
              sizes="(max-width: 640px) 92vw, 352px"
            />

            <div className="letter-text">
              <p className="eyebrow eyebrow--tight">{party.event}</p>
              {/* Tên địa điểm dài (2 dòng) nên hạ cỡ chữ để nằm gọn trong
                  khung ren của tờ giấy */}
              <h3 className="display-3 text-balance !text-[1.2rem]">
                {party.venue}
              </h3>
              {party.hall ? (
                <p className="body-text body-text--sm !text-[var(--color-olive)]">
                  {party.hall}
                </p>
              ) : null}
              <p className="body-text body-text--sm text-balance">
                {party.address}
              </p>
            </div>

            {/* Dấu xi niêm phong góc trên phải lá thư */}
            <Decor
              id="tv-seal"
              width="17%"
              right="6%"
              top="-9%"
              rotate={7}
              style={{ zIndex: 3 }}
            />
          </div>
        </Reveal>

        <Reveal delay={2} className="btn-row mt-8">
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
