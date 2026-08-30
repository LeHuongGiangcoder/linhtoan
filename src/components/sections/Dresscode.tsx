import { Decor } from "@/components/Decor";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";
import { DRESSCODE } from "@/lib/content";

export function Dresscode() {
  return (
    <section id="dresscode" className="section relative">
      {/* Hoa pastel: hồng đào, vàng bơ, cúc trắng */}
      <Decor id="21" width="52%" top="2%" right="-14%" />
      <Decor id="23" width="22%" top="26%" left="-6%" rotate={12} />
      <Decor id="22" width="40%" bottom="-4%" left="-12%" />
      <Decor id="24" width="30%" bottom="2%" right="-8%" flip />

      <div className="section-inner">
        <Divider />

        <Reveal className="section-head">
          <p className="eyebrow">Cùng nhau đồng điệu</p>
          <h2 className="display-2">Dresscode</h2>
        </Reveal>

        <Reveal delay={1}>
          <p className="body-text center text-balance">{DRESSCODE.note}</p>
        </Reveal>

        <Reveal delay={2} className="mt-9">
          <ul className="swatch-grid">
            {DRESSCODE.palette.map((c) => (
              <li key={c.name} className="swatch">
                <span
                  className="swatch-dot"
                  style={{ backgroundColor: c.hex }}
                />
                <span className="label !text-[0.625rem]">{c.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={3} className="mt-9 flex flex-col items-center gap-3">
          <span className="rule" />
          <p className="quote center text-balance">{DRESSCODE.avoid}</p>
        </Reveal>
      </div>
    </section>
  );
}
