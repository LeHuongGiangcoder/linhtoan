import Image from "next/image";
import { Decor } from "@/components/Decor";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";
import { LAYERS } from "@/lib/layers";
import { COUPLE, VENUE } from "@/lib/content";

/**
 * Time & Venue — bố cục "thiệp trong phong bì":
 * phong bì (12) + dải ruy băng (13) nằm sau, tấm thiệp ren (9) ở giữa,
 * hai bông rum (10, 11) gác lên góc phải trên.
 */
export function TimeVenue() {
  return (
    <section id="time-venue" className="section relative">
      <div className="section-inner">
        <Divider />

        <Reveal className="section-head">
          <p className="eyebrow">Save the moment</p>
          <h2 className="display-2">Thông tin</h2>
        </Reveal>

        <Reveal delay={1}>
          <div className="relative mx-auto w-full max-w-[24rem] pt-[7%] pb-[16%]">
            {/* Phong bì */}
            <Decor id="12" width="98%" left="1%" top="10%" />
            {/* Ruy băng vắt qua chân phong bì */}
            <Decor id="13" width="128%" left="-14%" bottom="0%" front />

            {/* Tấm thiệp ren. Ren màu trắng nên phần nhô ra khỏi phong bì
                sẽ chìm vào nền giấy kem — .lace-card đổ bóng theo alpha
                để đường ren nổi lên đủ. */}
            <div className="relative z-[2] mx-auto w-[86%]">
              <Image
                src={LAYERS["9"].src}
                alt=""
                aria-hidden
                width={LAYERS["9"].w}
                height={LAYERS["9"].h}
                sizes="(max-width: 640px) 74vw, 320px"
                className="lace-card block h-auto w-full"
              />

              {/* Nội dung nằm trên mặt giấy */}
              <div className="absolute inset-0 flex flex-col items-center justify-center px-[13%] py-[12%] text-center">
                <p className="eyebrow eyebrow--tight">Trân trọng kính mời</p>

                <span className="rule my-2 !h-6" />

                <h3 className="display-3">{VENUE.event}</h3>

                <p className="date-text date-text--sm mt-3">
                  {COUPLE.dateDisplay}
                </p>

                <p className="label mt-2">{VENUE.time}</p>

                <span className="rule my-3 !h-6" />

                <p className="body-text body-text--sm !text-[var(--color-olive)]">
                  {VENUE.hall}
                  <br />
                  {VENUE.name}
                </p>

                <p className="body-text body-text--sm mt-1 text-balance">
                  {VENUE.address}
                </p>
              </div>
            </div>

            {/* Hai bông hoa rum gác góc phải trên của tấm thiệp */}
            <Decor id="10" width="30%" top="6%" right="-2%" rotate={8} front />
            <Decor
              id="11"
              width="27%"
              top="26%"
              right="-8%"
              rotate={22}
              front
            />
          </div>
        </Reveal>

        <Reveal delay={2} className="btn-row mt-8">
          <a
            className="btn btn--outline"
            href={VENUE.mapUrl}
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
