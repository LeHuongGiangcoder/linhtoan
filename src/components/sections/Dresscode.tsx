import { Decor } from "@/components/Decor";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";
import { DRESSCODE } from "@/lib/content";

export function Dresscode() {
  return (
    <section id="dresscode" className="section relative">
      <div className="section-inner">
        <Divider />

        <Reveal className="section-head">
          <p className="eyebrow">Cùng nhau đồng điệu</p>
          <h2 className="display-2">Dresscode</h2>
        </Reveal>

        <Reveal delay={1}>
          <p className="body-text center text-balance">{DRESSCODE.note}</p>
        </Reveal>

        <Reveal delay={2} className="mt-9 px-1">
          <ul className="swatch-grid">
            {DRESSCODE.palette.map((c) => (
              <li key={c.name} className="swatch">
                <span
                  className="swatch-dot"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="swatch-name">{c.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={3} className="mt-9 flex flex-col items-center gap-3">
          <span className="rule" />
          <p className="quote center text-balance">{DRESSCODE.avoid}</p>
        </Reveal>

        {/* Xe hoa khép lại phần dresscode */}
        <Reveal delay={4} className="mt-8">
          <Decor
            id="18"
            width="58%"
            className="!relative !top-auto !right-auto !bottom-auto !left-auto mx-auto"
          />
        </Reveal>
      </div>
    </section>
  );
}
