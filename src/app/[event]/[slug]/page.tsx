import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Intro } from "@/components/Intro";
import { GuestUnavailable } from "@/components/sections/GuestUnavailable";
import { Hero } from "@/components/sections/Hero";
import { Party } from "@/components/sections/Party";
import { ThankYou } from "@/components/sections/ThankYou";
import {
  COUPLE_TITLE,
  DEFAULT_PARTY,
  openGraphFor,
  PARTIES,
  partyDescription,
  twitterFor,
} from "@/lib/content";
import { isEventPath, lookupGuest } from "@/lib/guests";

/**
 * Link riêng của từng khách: /<buổi tiệc>/<slug>, do Apps Script sinh ra từ
 * Google Sheet (xem docs/RSVP_SETUP.md).
 *
 * Đoạn <buổi tiệc> luôn là "main" cho cả hai nhà. Nhà trai hay nhà gái là do
 * cột "Nhà" trong Sheet quyết định — nên khi KHÔNG đọc được Sheet, trang
 * không dựng thiệp nữa mà mời khách tải lại (xem GuestUnavailable). Đoán nhà
 * là đoán cả ngày lẫn địa điểm, đoán trượt thì khách đi sai chỗ.
 */
export async function generateMetadata({
  params,
}: PageProps<"/[event]/[slug]">): Promise<Metadata> {
  const { event, slug } = await params;
  if (!isEventPath(event)) return {};

  const found = await lookupGuest(slug);

  // Chưa tra được danh sách thì chưa biết nhà nào — đừng đi khoe ngày và địa
  // điểm của nhà trai trong ô xem trước khi chia sẻ.
  //
  // Phải ghi đè CẢ KHỐI openGraph/twitter, không bỏ trống: Next thay nguyên
  // khối chứ không trộn từng trường, nên khai thiếu là khối của layout gốc
  // (dựng theo nhà mặc định) còn nguyên — đúng cái địa điểm đang muốn giấu.
  if (found.status === "unavailable") {
    const neutral = `Thiệp mời cưới của ${COUPLE_TITLE}.`;
    return {
      title: COUPLE_TITLE,
      description: neutral,
      openGraph: {
        type: "website",
        locale: "vi_VN",
        siteName: COUPLE_TITLE,
        title: COUPLE_TITLE,
        description: neutral,
        url: "/",
      },
      twitter: { card: "summary", title: COUPLE_TITLE, description: neutral },
      robots: { index: false, follow: false },
    };
  }

  const guest = found.status === "found" ? found.guest : null;
  const p = PARTIES[guest?.party ?? DEFAULT_PARTY];
  // "29 . 11 . 2026" giãn chữ cho đẹp trên tấm vé, trong tiêu đề thì bỏ giãn.
  const date = p.dateShort.replace(/\s+/g, "");

  // Mô tả phải theo nhà của khách, nếu không khách nhà gái gửi link cho nhau
  // mà ô xem trước lại ghi địa điểm nhà trai. Layout gốc không biết nhà nào
  // nên chỉ có chỗ này ghi đè được.
  const description = partyDescription(p);

  return {
    title: guest?.name
      ? `${guest.name} — ${p.tab} ${date}`
      : `${p.tab} — ${date}`,
    description,
    openGraph: openGraphFor(p),
    twitter: twitterFor(p),
    // Link riêng không nên lọt ra ngoài; thẻ xem trước vẫn hiện bình thường
    // khi khách gửi cho nhau qua Zalo/Messenger.
    robots: { index: false, follow: false },
  };
}

export default async function GuestInvitation({
  params,
}: PageProps<"/[event]/[slug]">) {
  const { event, slug } = await params;

  if (!isEventPath(event)) notFound();

  const found = await lookupGuest(slug);

  // Không tra được danh sách: dừng lại và mời khách tải lại, KHÔNG dựng đại
  // thiệp nhà trai. Xem GuestUnavailable để biết vì sao đoán nhà là nguy hiểm.
  if (found.status === "unavailable") {
    return (
      <main>
        <GuestUnavailable />
      </main>
    );
  }

  // Còn lại là `found` (có khách) hoặc `missing` (gõ sai link / hàng đã xoá).
  // `missing` thì tải lại cũng thế, nên cứ cho xem thiệp chung như khi vào
  // thẳng trang chủ.
  const guest = found.status === "found" ? found.guest : null;

  return (
    <>
      <Intro />
      <main>
        <Hero guestName={guest?.name} party={guest?.party ?? DEFAULT_PARTY} />
        {/* Slug lấy từ đường dẫn kể cả khi chưa tra được Sheet: Apps Script
            khớp slug thì ghi đúng hàng, không khớp thì nối hàng mới.
            `rsvp` là câu trả lời lần trước — form điền sẵn để khách sửa. */}
        <Party
          party={guest?.party ?? DEFAULT_PARTY}
          guest={{
            // Slug chuẩn của khách nếu tra được, còn không thì lấy từ đường
            // dẫn — hạ về chữ thường cho khớp với slug lưu trong Sheet.
            slug: guest?.slug ?? slug.trim().toLowerCase(),
            name: guest?.name,
            rsvp: guest?.rsvp,
          }}
        />
        <ThankYou party={guest?.party ?? DEFAULT_PARTY} />
      </main>
    </>
  );
}
