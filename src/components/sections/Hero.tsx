import Image from "next/image";
import { Cross } from "@/components/Cross";
import { Decor } from "@/components/Decor";
import { Reveal } from "@/components/Reveal";
import { COUPLE_TYPO, LAYERS } from "@/lib/layers";
import { COUPLE, HERO } from "@/lib/content";

type HeroProps = {
  /** Tên khách lấy từ link riêng; bỏ trống thì dùng lời chào chung. */
  guestName?: string;
};

export function Hero({ guestName }: HeroProps) {
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
      <div className="section-inner flex flex-1 flex-col items-center justify-center pt-[7vh] pb-2 text-center">
        <Reveal className="max-w-[17.5rem]">
          <p className="guest-line">
            {HERO.greeting}, {guestName?.trim() || HERO.guest}
          </p>
        </Reveal>

        <Reveal delay={1} className="mt-3 max-w-[19rem]">
          <p className="invite-line">{HERO.invite}</p>
        </Reveal>

        <Reveal delay={2} className="mt-4 w-full">
          <Image
            src={COUPLE_TYPO.bride.src}
            alt={COUPLE.bride}
            width={COUPLE_TYPO.bride.w}
            height={COUPLE_TYPO.bride.h}
            priority
            sizes="(max-width: 640px) 74vw, 474px"
            className="mx-auto block h-auto w-[74%]"
          />
        </Reveal>

        <Reveal delay={3} className="my-1">
          <Cross />
        </Reveal>

        <Reveal delay={3} className="w-full">
          <Image
            src={COUPLE_TYPO.groom.src}
            alt={COUPLE.groom}
            width={COUPLE_TYPO.groom.w}
            height={COUPLE_TYPO.groom.h}
            priority
            sizes="(max-width: 640px) 71vw, 451px"
            className="mx-auto block h-auto w-[70.5%]"
          />
        </Reveal>

        <Reveal delay={4} className="mt-5">
          <p className="date-text">{COUPLE.dateDisplay}</p>
        </Reveal>

        <Reveal delay={5} className="mt-3">
          <p className="eyebrow">{COUPLE.city}</p>
        </Reveal>
      </div>

      {/* Tranh lễ đường — dải dưới cùng, neo đáy và tràn hết bề ngang */}
      <div className="relative h-[58svh] w-full shrink-0">
        <Decor id="7" width="38%" top="9%" right="4%" front />
        <Image
          src={LAYERS["6"].src}
          alt="Minh hoạ lễ đường cưới trong vườn"
          width={LAYERS["6"].w}
          height={LAYERS["6"].h}
          priority
          sizes="(max-width: 640px) 100vw, 640px"
          className="relative z-[1] block h-full w-full object-cover object-bottom [mask-image:linear-gradient(to_bottom,transparent,#000_14%)]"
        />
      </div>
    </section>
  );
}
