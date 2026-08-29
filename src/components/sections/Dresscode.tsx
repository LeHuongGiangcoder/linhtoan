import { Decor } from "@/components/Decor";
import { Reveal } from "@/components/Reveal";
import { DRESSCODE } from "@/lib/content";

export function Dresscode() {
  return (
    <section id="dresscode" className="section section--tall relative">
      {/* Hoa pastel: hồng đào, vàng bơ, cúc trắng */}
      <Decor id="21" width="52%" top="2%" right="-14%" />
      <Decor id="23" width="22%" top="26%" left="-6%" rotate={12} />
      <Decor id="22" width="40%" bottom="-4%" left="-12%" />
      <Decor id="24" width="30%" bottom="2%" right="-8%" flip />

      <div className="section-inner">
        <Reveal className="section-head">
          <p className="eyebrow">Cùng nhau đồng điệu</p>
          <h2 className="display-2">Dresscode</h2>
        </Reveal>

        <Reveal delay={1}>
          <p className="body-text center text-balance">{DRESSCODE.note}</p>
        </Reveal>

        <Reveal delay={2} className="mt-9">
          <ul className="m-0 grid grid-cols-3 gap-x-4 gap-y-6 p-0 list-none">
            {DRESSCODE.palette.map((c) => (
              <li key={c.name} className="flex flex-col items-center gap-2.5">
                <span
                  className="block h-14 w-14 rounded-full border border-[var(--color-line)]"
                  style={{
                    backgroundColor: c.hex,
                    boxShadow: "var(--shadow-lift)",
                  }}
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
