import Image from "next/image";
import { Reveal } from "@/components/Reveal";
import { LAYERS } from "@/lib/layers";
import { COUPLE } from "@/lib/content";

/**
 * "Save the Date" — chữ nổi (letterpress) đặt trực tiếp trên nền giấy.
 * Ảnh 2.webp là chữ trắng có bóng nổi, không tint / không blur.
 */
export function SaveTheDate() {
  return (
    <section id="save-the-date" className="section section--tight relative">
      <div className="section-inner flex flex-col items-center">
        <Reveal className="w-full">
          <Image
            src={LAYERS["2"].src}
            alt="Save the Date"
            width={LAYERS["2"].w}
            height={LAYERS["2"].h}
            sizes="(max-width: 640px) 78vw, 460px"
            className="mx-auto block h-auto w-[78%] max-w-[26rem]"
          />
        </Reveal>

        <Reveal delay={2} className="mt-6 flex flex-col items-center gap-3">
          <span className="rule" />
          <p className="body-text body-text--sm center">
            {COUPLE.dateFull}
            <br />
            <span className="label">{COUPLE.lunar}</span>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
