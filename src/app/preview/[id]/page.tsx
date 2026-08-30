// Route xem thử từng section khi phát triển — xoá trước khi deploy.
import { notFound } from "next/navigation";
import { Hero } from "@/components/sections/Hero";
import { TimeVenue } from "@/components/sections/TimeVenue";
import { Agenda } from "@/components/sections/Agenda";
import { Dresscode } from "@/components/sections/Dresscode";
import { Rsvp } from "@/components/sections/Rsvp";
import { ThankYou } from "@/components/sections/ThankYou";

const SECTIONS: Record<string, () => React.ReactNode> = {
  hero: Hero,
  "time-venue": TimeVenue,
  agenda: Agenda,
  dresscode: Dresscode,
  rsvp: Rsvp,
  "thank-you": ThankYou,
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
