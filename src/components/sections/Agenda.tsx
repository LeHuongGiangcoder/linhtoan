import { Fragment } from "react";
import { Cross } from "@/components/Cross";
import { Decor } from "@/components/Decor";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";
import { AGENDA } from "@/lib/content";

export function Agenda() {
  return (
    <section id="agenda" className="section section--dense relative">
      {/* Hai cột rèm đứng trước, dải cẩm tú cầu xanh vẽ đè lên chân cột —
          thứ tự DOM quyết định lớp trên vì mọi .decor đều z-index 0. */}
      <Decor id="el-43" width="52%" top="36%" left="-16%" />
      <Decor id="el-44" width="46%" top="28%" right="-15%" />
      <Decor id="el-45" width="126%" bottom="-5%" left="-24%" />
      <Decor id="el-45" width="126%" bottom="-5%" right="-24%" flip />

      {/* Chân section tan dần vào nền kem thay vì cắt ngang một đường thẳng */}
      <div className="section-fade-bottom" aria-hidden />

      <div className="section-inner flex flex-col justify-center">
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

      </div>
    </section>
  );
}
