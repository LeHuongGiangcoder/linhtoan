import { Hero } from "@/components/sections/Hero";
import { SaveTheDate } from "@/components/sections/SaveTheDate";
import { TimeVenue } from "@/components/sections/TimeVenue";
import { Agenda } from "@/components/sections/Agenda";
import { Dresscode } from "@/components/sections/Dresscode";
import { Rsvp } from "@/components/sections/Rsvp";
import { ThankYou } from "@/components/sections/ThankYou";

export default function Home() {
  return (
    <main>
      <Hero />
      <SaveTheDate />
      <TimeVenue />
      <Agenda />
      <Dresscode />
      <Rsvp />
      <ThankYou />
    </main>
  );
}
