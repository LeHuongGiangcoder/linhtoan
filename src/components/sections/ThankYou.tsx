import { Decor } from "@/components/Decor";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";
import { COUPLE } from "@/lib/content";

/** Thank you — chỉ giữ đôi bồ câu, phần còn lại để trống cho thoáng. */
export function ThankYou() {
  return (
    <section id="thank-you" className="section relative overflow-hidden">
      {/* Bụi hoa trắng chân section: hai lớp lệch nhau cho dày, lớp sau lật
          gương và tụt xuống để không lộ ra là cùng một dải lặp lại. */}
      <Decor id="el-54-strip" width="152%" bottom="-7%" left="-31%" flip />
      <Decor id="el-54-strip" width="118%" bottom="-2%" left="-9%" />
      <Decor id="el-46" width="34%" bottom="16%" left="0%" />

      <div className="section-inner flex flex-col items-center text-center">
        <Divider />

        <Reveal>
          <Decor
            id="19"
            width="9rem"
            className="!relative !top-auto !right-auto !bottom-auto !left-auto mx-auto"
          />
        </Reveal>

        <Reveal delay={1} className="section-head mt-5">
          <p className="eyebrow">Thank you</p>
          <h2 className="display-2">Cảm ơn bạn</h2>
        </Reveal>

        <Reveal delay={2}>
          <p className="body-text center text-balance">
            Sự hiện diện của bạn là món quà ý nghĩa nhất với chúng mình. Cảm ơn
            vì đã đồng hành và chúc phúc cho chặng đường phía trước.
          </p>
        </Reveal>

        <Reveal delay={3} className="mt-8 flex flex-col items-center gap-3">
          <span className="rule !h-8" />
          <p className="display-2">L &amp; T</p>
          <p className="date-text date-text--hero">{COUPLE.dateDisplay}</p>
          <p className="eyebrow">{COUPLE.city}</p>
        </Reveal>
      </div>
    </section>
  );
}
