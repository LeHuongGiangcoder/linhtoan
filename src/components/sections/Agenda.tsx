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
    <section
      id="agenda"
      className="section section--dense section--bleed relative z-[3] pb-[16rem]"
    >
      {/* Hai cột rèm đứng trước, dải cẩm tú cầu xanh vẽ đè lên chân cột —
          thứ tự DOM quyết định lớp trên vì mọi .decor đều z-index 0.
          Hai cột cùng bề rộng và đẩy hẳn ra mép để chừa chỗ cho nội dung. */}
      <Decor id="el-43" width="46%" bottom="9%" left="-23%" />
      <Decor id="el-44" width="46%" bottom="7%" right="-23%" />

      {/* Gấu section: dải cẩm tú cầu vuốt mờ chân vào nền giấy, ruy băng vắt
          ngang che đúng vùng vuốt đó. Ảnh hoa có mép dưới cắt thẳng — dải ruy
          băng mảnh và lượn sóng không tự che hết được, nên phải vuốt mờ trước.
          Hoa neo theo % chiều cao gấu (gấu cao theo bề ngang), nên chân hoa
          luôn nằm trong dải băng ở mọi màn hình. Hoa cũng trùm qua chân hai
          cột — cột đứng lơ lửng giữa nền giấy thì lộ ngay là ảnh dán.
          Đuôi ruy băng thả xuống section Trang phục: section này vì thế cho
          tràn dọc (section--bleed) và nằm lớp trên (z-[3]). */}
      <div className="section-hem section-hem--ribbon" aria-hidden>
        <Decor id="el-45" width="92%" left="-12%" bottom="45%" className="hem-flowers" />
        <Decor
          id="el-45"
          width="92%"
          right="-12%"
          bottom="45%"
          flip
          className="hem-flowers"
        />
        <Image
          src={ART.ribbon.src}
          alt=""
          width={ART.ribbon.w}
          height={ART.ribbon.h}
          sizes="(max-width: 640px) 105vw, 672px"
          className="hem-ribbon"
        />
      </div>

      <div className="section-inner flex flex-col justify-center">
        <Reveal className="section-head">
          {/* Hoa rum — dải phân cách giữa Địa điểm và Chương trình */}
          <span aria-hidden className="calla-divider" />
          <p className="eyebrow">Trình tự buổi tiệc</p>
          <h2 className="display-2">Chương trình</h2>
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
