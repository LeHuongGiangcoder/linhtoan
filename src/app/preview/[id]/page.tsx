// Route xem thử từng section khi phát triển — xoá trước khi deploy.
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/Hero";
import { TimeVenue } from "@/components/sections/TimeVenue";
import { Agenda } from "@/components/sections/Agenda";
import { Dresscode } from "@/components/sections/Dresscode";
import { Rsvp } from "@/components/sections/Rsvp";
import { ThankYou } from "@/components/sections/ThankYou";
import { Party } from "@/components/sections/Party";
import { PARTIES } from "@/lib/content";

const SECTIONS: Record<string, () => React.ReactNode> = {
  hero: Hero,
  "time-venue": TimeVenue,
  agenda: Agenda,
  dresscode: Dresscode,
  rsvp: Rsvp,
  /** Form hồi âm của một khách đã trả lời rồi — kiểm tra phần điền sẵn/sửa */
  "rsvp-edit": () => (
    <Rsvp
      guest={{
        slug: "nguyen-van-a",
        name: "Nguyễn Văn A",
        rsvp: {
          attending: true,
          guests: "Trên 1",
          companions: "Trần Thị B",
          message: "Chúc hai em trăm năm hạnh phúc!",
        },
      }}
    />
  ),
  "thank-you": ThankYou,
  /** Cả thân thiệp — mặc định là thiệp nhà trai */
  party: Party,
  /** Thiệp nhà gái: khác giờ, khác địa điểm, khác chương trình */
  "party-bride": () => <Party party="bride" />,
  "time-venue-bride": () => <TimeVenue party={PARTIES.bride} />,
  "agenda-bride": () => <Agenda agenda={PARTIES.bride.agenda} />,
};

export function generateStaticParams() {
  return Object.keys(SECTIONS).map((id) => ({ id }));
}

export default async function PreviewSection({
  params,
}: PageProps<"/preview/[id]">) {
  const { id } = await params;
  const Section = SECTIONS[id];
  if (!Section) notFound();
  return (
    <main>
      <Section />
    </main>
  );
}
