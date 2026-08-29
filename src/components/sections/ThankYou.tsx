import { Decor } from "@/components/Decor";
import { Reveal } from "@/components/Reveal";
import { COUPLE } from "@/lib/content";

export function ThankYou() {
  return (
    <section id="thank-you" className="section section--tall relative overflow-hidden">
      <Decor id="15" width="46%" bottom="-6%" left="-16%" />
      <Decor id="13" width="140%" bottom="12%" left="-20%" opacity={0.9} />

      <div className="section-inner center stack">
        <Reveal>
          <Decor
            id="19"
            width="60%"
            className="!relative !top-auto !right-auto !bottom-auto !left-auto mx-auto"
          />
        </Reveal>

        <Reveal delay={1} className="section-head !mb-0">
          <p className="eyebrow">Thank you</p>
          <h2 className="display-2">Cảm ơn bạn</h2>
        </Reveal>

        <Reveal delay={2}>
          <p className="body-text center text-balance">
            Sự hiện diện của bạn là món quà ý nghĩa nhất với chúng mình. Cảm ơn
            vì đã đồng hành và chúc phúc cho chặng đường phía trước.
          </p>
        </Reveal>

        <Reveal delay={3} className="flex flex-col items-center gap-4 pt-2">
          <span className="rule" />
          <p className="display-3">
            {COUPLE.bride} <span className="text-[0.7em]">✛</span>{" "}
            {COUPLE.groom}
          </p>
          <p className="date-text date-text--sm">{COUPLE.dateDisplay}</p>
          <p className="eyebrow">{COUPLE.city}</p>
        </Reveal>
      </div>
    </section>
  );
}
