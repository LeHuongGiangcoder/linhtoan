import { Fragment } from "react";
import Image from "next/image";
import { Cross } from "@/components/Cross";
import { Decor } from "@/components/Decor";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";
import { AGENDA } from "@/lib/content";
import { ART } from "@/lib/layers";

export function Agenda() {
  return (
    <section id="agenda" className="section section--dense relative pb-[16rem]">
      {/* Hai cột rèm đứng trước, dải cẩm tú cầu xanh vẽ đè lên chân cột —
          thứ tự DOM quyết định lớp trên vì mọi .decor đều z-index 0.
          Hai cột cùng bề rộng và đẩy hẳn ra mép để chừa chỗ cho nội dung. */}
      <Decor id="el-43" width="46%" bottom="9%" left="-23%" />
      <Decor id="el-44" width="46%" bottom="7%" right="-23%" />

      {/* Gấu section: dải cẩm tú cầu ngồi ngay trên dải ren, mép dưới hoa và
          mép trên ren khít nhau (bottom: 100% của .section-hem, trừ 1px cho
          khỏi hở chỉ khi làm tròn). Hoa cũng trùm qua chân hai cột — cột đứng
          lơ lửng giữa nền giấy thì lộ ngay là ảnh dán. */}
      <div className="section-hem" aria-hidden>
        <Decor
          id="el-45"
          width="92%"
          left="-12%"
          bottom="calc(100% - 1px)"
        />
        <Decor
          id="el-45"
          width="92%"
          right="-12%"
          bottom="calc(100% - 1px)"
          flip
        />
        <Image
          src={ART["el-lace"].src}
          alt=""
          width={ART["el-lace"].w}
          height={ART["el-lace"].h}
          sizes="(max-width: 640px) 100vw, 640px"
          className="hem-lace"
        />
      </div>

      <div className="section-inner flex flex-col justify-center">
        <Reveal className="section-head">
          <p className="eyebrow">Chương trình</p>
          <h2 className="display-2">Agenda</h2>
          <Divider />
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
