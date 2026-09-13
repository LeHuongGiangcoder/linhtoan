import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Intro } from "@/components/Intro";
import { Hero } from "@/components/sections/Hero";
import { Party } from "@/components/sections/Party";
import { ThankYou } from "@/components/sections/ThankYou";
import { PARTIES } from "@/lib/content";
import { lookupGuest, partyFromPath } from "@/lib/guests";

/**
 * Link riêng của từng khách: /<buổi tiệc>/<slug>, do Apps Script sinh ra từ
 * Google Sheet (xem docs/RSVP_SETUP.md).
 *
 * Buổi tiệc nằm ngay trong đường dẫn nên thiệp mở đúng nội dung kể cả khi
 * chưa nối Sheet — Sheet chỉ dùng để lấy thêm tên khách cho lời chào.
 */
export async function generateMetadata({
  params,
}: PageProps<"/[event]/[slug]">): Promise<Metadata> {
  const { event, slug } = await params;
  const party = partyFromPath(event);
  if (!party) return {};

  const guest = await lookupGuest(slug);
  const p = PARTIES[party];
  // "29 . 11 . 2026" giãn chữ cho đẹp trên tấm vé, trong tiêu đề thì bỏ giãn.
  const date = p.dateShort.replace(/\s+/g, "");

  return {
    title: guest?.name
      ? `${guest.name} — ${p.tab} ${date}`
      : `${p.tab} — ${date}`,
    // Link riêng không nên lọt ra ngoài; thẻ xem trước vẫn hiện bình thường
    // khi khách gửi cho nhau qua Zalo/Messenger.
    robots: { index: false, follow: false },
  };
}

export default async function GuestInvitation({
  params,
}: PageProps<"/[event]/[slug]">) {
  const { event, slug } = await params;

  if (!partyFromPath(event)) notFound();

  const guest = await lookupGuest(slug);

  return (
    <>
      <Intro />
      <main>
        <Hero guestName={guest?.name} />
        {/* Slug lấy từ đường dẫn kể cả khi chưa tra được Sheet: Apps Script
            khớp slug thì ghi đúng hàng, không khớp thì nối hàng mới. */}
        <Party guest={{ slug, name: guest?.name }} />
        <ThankYou />
      </main>
    </>
  );
}
