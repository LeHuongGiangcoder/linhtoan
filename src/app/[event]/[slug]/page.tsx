import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Intro } from "@/components/Intro";
import { Hero } from "@/components/sections/Hero";
import { Party } from "@/components/sections/Party";
import { ThankYou } from "@/components/sections/ThankYou";
import { DEFAULT_PARTY, PARTIES } from "@/lib/content";
import { isEventPath, lookupGuest } from "@/lib/guests";

/**
 * Link riêng của từng khách: /<buổi tiệc>/<slug>, do Apps Script sinh ra từ
 * Google Sheet (xem docs/RSVP_SETUP.md).
 *
 * Đoạn <buổi tiệc> luôn là "main" cho cả hai nhà. Nhà trai hay nhà gái là do
 * cột "Nhà" trong Sheet quyết định, nên khi Sheet lỗi thì thiệp lùi về bản mặc
 * định (nhà trai) thay vì hỏng.
 */
export async function generateMetadata({
  params,
}: PageProps<"/[event]/[slug]">): Promise<Metadata> {
  const { event, slug } = await params;
  if (!isEventPath(event)) return {};

  const guest = await lookupGuest(slug);
  const p = PARTIES[guest?.party ?? DEFAULT_PARTY];
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

  if (!isEventPath(event)) notFound();

  const guest = await lookupGuest(slug);

  return (
    <>
      <Intro />
      <main>
        <Hero guestName={guest?.name} />
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
