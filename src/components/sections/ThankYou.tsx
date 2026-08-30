import Image from "next/image";
import { Decor } from "@/components/Decor";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";
import { LAYERS } from "@/lib/layers";
import { COUPLE } from "@/lib/content";

/**
 * Thank you — chữ nổi "SAVE THE DATE" (2.webp) làm nền chìm,
 * heading chính layer đè lên trên.
 */
export function ThankYou() {
  return (
    <section
      id="thank-you"
      className="section relative justify-center overflow-hidden"
    >
      <Decor id="15" width="42%" bottom="-4%" left="-15%" />
      <Decor id="13" width="132%" bottom="16%" left="-18%" />

      <div className="section-inner">
        <Divider />

        {/* Nền chữ nổi + nội dung chồng lên */}
        <div className="relative flex flex-col items-center">
          <Image
            src={LAYERS["2"].src}
            alt="Save the Date"
            width={LAYERS["2"].w}
            height={LAYERS["2"].h}
            sizes="(max-width: 640px) 92vw, 420px"
            className="pointer-events-none absolute top-1/2 left-1/2 w-[104%] max-w-none -translate-x-1/2 -translate-y-1/2 select-none"
          />

          <div className="relative z-[2] flex flex-col items-center py-6 text-center">
            <Reveal>
              <Decor
                id="19"
                width="9rem"
                className="!relative !top-auto !right-auto !bottom-auto !left-auto mx-auto"
              />
            </Reveal>

            <Reveal delay={1} className="mt-4 flex flex-col items-center gap-2">
              <p className="eyebrow">Thank you</p>
              <h2 className="display-2">Cảm ơn bạn</h2>
            </Reveal>

            <Reveal delay={2} className="mt-5">
              <p className="body-text center text-balance">
                Sự hiện diện của bạn là món quà ý nghĩa nhất với chúng mình.
                Cảm ơn vì đã đồng hành và chúc phúc cho chặng đường phía trước.
              </p>
            </Reveal>

            <Reveal delay={3} className="mt-7 flex flex-col items-center gap-3">
              <span className="rule !h-8" />
              <p className="display-2">L &amp; T</p>
              <p className="date-text date-text--sm">{COUPLE.dateDisplay}</p>
              <p className="eyebrow">{COUPLE.city}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
