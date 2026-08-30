import { Fragment } from "react";
import { Cross } from "@/components/Cross";
import { Decor } from "@/components/Decor";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";
import { AGENDA } from "@/lib/content";

export function Agenda() {
  return (
    <section id="agenda" className="section section--dense relative">
      <div className="section-inner">
        <Divider />

        <Reveal className="section-head">
          <p className="eyebrow">Chương trình</p>
          <h2 className="display-2">Agenda</h2>
        </Reveal>

        {/* Timeline canh giữa, các mốc nối nhau bằng dấu ✛ như phần tên couple */}
        <ol className="m-0 list-none p-0 text-center">
          {AGENDA.map((item, i) => (
            <Fragment key={item.title}>
              {i > 0 && (
                <li className="flex flex-col items-center gap-2.5">
                  <span className="rule !h-7" />
                  <Cross size="1rem" className="opacity-55" />
                  <span className="rule !h-7" />
                </li>
              )}

              <Reveal
                as="li"
                delay={Math.min(i + 1, 5) as 1 | 2 | 3 | 4 | 5}
                className="flex flex-col items-center"
              >
                <p className="date-text--xs">{item.time}</p>
                <h3 className="display-3 mt-3 !text-[1.5rem]">{item.title}</h3>
                <p className="body-text body-text--sm mt-2.5 max-w-[19rem] text-balance">
                  {item.desc}
                </p>
              </Reveal>
            </Fragment>
          ))}
        </ol>

        {/* Xe hoa khép lại phần agenda */}
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
