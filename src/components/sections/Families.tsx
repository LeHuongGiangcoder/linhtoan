import { Decor } from "@/components/Decor";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";
import { FAMILIES } from "@/lib/content";

/**
 * Gia đình — tên bố mẹ hai bên, đứng ngay sau hero.
 *
 * Chỉ hiện ở tấm thiệp bật `families` (hiện là `groom2`); xem Party.tsx. Hai
 * bên xếp dọc chứ không chia hai cột: khung nội dung chỉ rộng 26rem, cắt đôi
 * ra là tên và địa chỉ vỡ dòng lung tung trên máy hẹp.
 */
function Side({
  label,
  father,
  mother,
  address,
  delay,
}: {
  label: string;
  father: string;
  mother: string;
  address: string;
  delay: 1 | 2 | 3 | 4 | 5;
}) {
  return (
    <Reveal delay={delay} className="family-side">
      <p className="eyebrow">{label}</p>
      <p className="family-name">{father}</p>
      <p className="family-name">{mother}</p>
      <p className="body-text body-text--sm family-address text-balance">
        {address}
      </p>
    </Reveal>
  );
}

export function Families() {
  return (
    <section id="families" className="section section--fit relative overflow-hidden">
      <Decor id="el-46" width="26%" top="6%" right="2%" className="motion-float" />

      <div className="section-inner text-center">
        <Reveal className="section-head">
          <p className="eyebrow">Trân trọng báo tin</p>
          <h2 className="display-2">Gia đình</h2>
          <Divider />
        </Reveal>

        <Side
          label={FAMILIES.groom.label}
          father={FAMILIES.groom.father}
          mother={FAMILIES.groom.mother}
          address={FAMILIES.groom.address}
          delay={1}
        />

        <Reveal delay={2}>
          <span className="family-rule" />
        </Reveal>

        <Side
          label={FAMILIES.bride.label}
          father={FAMILIES.bride.father}
          mother={FAMILIES.bride.mother}
          address={FAMILIES.bride.address}
          delay={3}
        />
      </div>
    </section>
  );
}
