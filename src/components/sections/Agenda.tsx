import { Decor } from "@/components/Decor";
import { Reveal } from "@/components/Reveal";
import { AGENDA } from "@/lib/content";

export function Agenda() {
  return (
    <section id="agenda" className="section section--tall relative">
      {/* Đài phun nước & ly champagne làm nền hai bên */}
      <Decor id="16" width="46%" top="4%" left="-16%" />
      <Decor id="14" width="38%" bottom="6%" right="-13%" />

      <div className="section-inner">
        <Reveal className="section-head">
          <p className="eyebrow">Chương trình</p>
          <h2 className="display-2">Agenda</h2>
        </Reveal>

        <ol className="relative m-0 list-none p-0">
          {/* Đường trục thời gian */}
          <span
            aria-hidden
            className="absolute top-2 bottom-2 left-[4.25rem] w-px bg-[var(--color-line)]"
          />

          {AGENDA.map((item, i) => (
            <Reveal
              as="li"
              key={item.title}
              delay={(Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5)}
              className="relative grid grid-cols-[4.25rem_1fr] gap-x-6 pb-9 last:pb-0"
            >
              <div className="pt-1 text-right">
                <p className="date-text--xs">{item.time}</p>
                <p className="label mt-1 !text-[0.625rem] !tracking-[0.14em]">
                  {item.end}
                </p>
              </div>

              <div className="relative pl-6">
                <span
                  aria-hidden
                  className="absolute top-[0.6rem] -left-[0.3rem] h-[7px] w-[7px] rounded-full bg-[var(--color-olive)]"
                />
                <h3 className="display-3 !text-[1.375rem]">{item.title}</h3>
                <p className="body-text body-text--sm mt-1">{item.desc}</p>
              </div>
            </Reveal>
          ))}
        </ol>

        {/* Xe hoa khép lại phần agenda */}
        <Reveal delay={4} className="mt-12">
          <Decor
            id="18"
            width="72%"
            className="!relative !top-auto !right-auto !bottom-auto !left-auto mx-auto"
          />
        </Reveal>
      </div>
    </section>
  );
}
