import Image from "next/image";
import { Decor } from "@/components/Decor";
import { Reveal } from "@/components/Reveal";
import { LAYERS } from "@/lib/layers";
import { COUPLE } from "@/lib/content";

export function Hero() {
  return (
    <section
      id="hero"
      className="section section--flush relative flex h-[100svh] flex-col overflow-hidden"
    >
      {/* Góc trên phải: lớp lá (5) nằm sau bông hoa (4) */}
      <Decor id="5" width="46%" top="-9%" right="-13%" rotate={-8} priority />
      <Decor id="4" width="35%" top="-6%" right="-5%" priority />

      {/* Chim bồ câu đưa thư — bên trái */}
      <Decor id="3" width="29%" top="7%" left="-8%" priority />

      {/* Khối chữ — chiếm phần trên, căn giữa khoảng trống còn lại */}
      <div className="section-inner flex flex-1 flex-col items-center justify-center pb-2 text-center">
        <Reveal>
          <p className="eyebrow">The wedding of</p>
        </Reveal>

        <Reveal delay={1} className="mt-3 w-full">
          <h1 className="display-1">{COUPLE.bride}</h1>
        </Reveal>

        <Reveal delay={2} className="my-3">
          <span
            aria-hidden
            className="block text-[1.15rem] leading-none text-[var(--color-olive)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ✛
          </span>
        </Reveal>

        <Reveal delay={2} className="w-full">
          <h1 className="display-1">{COUPLE.groom}</h1>
        </Reveal>

        <Reveal delay={3} className="mt-5">
          <p className="date-text">{COUPLE.dateDisplay}</p>
        </Reveal>

        <Reveal delay={4} className="mt-3">
          <p className="eyebrow">{COUPLE.city}</p>
        </Reveal>
      </div>

      {/* Tranh lễ đường — tràn viền dưới, luôn nằm trong 1 viewport */}
      <div className="relative -mx-[18%] -mt-[5%] w-[136%] shrink-0">
        <Decor id="7" width="40%" top="-1%" right="8%" front />
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
