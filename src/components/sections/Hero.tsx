import Image from "next/image";
import { Decor } from "@/components/Decor";
import { Reveal } from "@/components/Reveal";
import { LAYERS } from "@/lib/layers";
import { COUPLE } from "@/lib/content";

export function Hero() {
  return (
    <section id="hero" className="section section--flush relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Góc trên phải: lớp lá (5) nằm sau bông hoa (4) */}
      <Decor id="5" width="52%" top="-13%" right="-14%" rotate={-8} priority />
      <Decor id="4" width="40%" top="-10%" right="-6%" priority />

      {/* Chim bồ câu đưa thư — bên trái */}
      <Decor id="3" width="33%" top="6%" left="-10%" priority />

      {/* Khối chữ */}
      <div className="section-inner flex flex-col items-center pt-[11vh] text-center">
        <Reveal>
          <p className="eyebrow">The wedding of</p>
        </Reveal>

        <Reveal delay={1} className="mt-4 w-full">
          <h1 className="display-1">{COUPLE.bride}</h1>
        </Reveal>

        <Reveal delay={2} className="my-2.5">
          <span
            aria-hidden
            className="block text-[1.6rem] leading-none text-[var(--color-olive)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ✛
          </span>
        </Reveal>

        <Reveal delay={2} className="w-full">
          <h1 className="display-1">{COUPLE.groom}</h1>
        </Reveal>

        <Reveal delay={3} className="mt-6">
          <p className="date-text">{COUPLE.dateDisplay}</p>
        </Reveal>

        <Reveal delay={4} className="mt-4">
          <p className="eyebrow">{COUPLE.city}</p>
        </Reveal>
      </div>

      {/* Tranh lễ đường — tràn viền dưới */}
      <div className="relative mt-auto w-full pt-8">
        <Decor id="7" width="52%" top="-2%" right="2%" front />
        <Image
          src={LAYERS["6"].src}
          alt="Minh hoạ lễ đường cưới trong vườn"
          width={LAYERS["6"].w}
          height={LAYERS["6"].h}
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          className="relative z-[1] block h-auto w-full"
        />
      </div>
    </section>
  );
}
