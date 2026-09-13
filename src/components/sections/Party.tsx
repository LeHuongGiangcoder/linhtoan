import { TimeVenue } from "@/components/sections/TimeVenue";
import { Agenda } from "@/components/sections/Agenda";
import { Dresscode } from "@/components/sections/Dresscode";
import { Rsvp } from "@/components/sections/Rsvp";
import { PARTIES } from "@/lib/content";

/**
 * Phần thân thiệp: Thời gian & Địa điểm → Chương trình → Dresscode → RSVP.
 *
 * Đám cưới chỉ còn một buổi tiệc, nên ở đây không còn nút chuyển buổi và cũng
 * không cần state — toàn bộ thân thiệp render trên server.
 */
export function Party() {
  return (
    <>
      <TimeVenue party={PARTIES.main} />
      <Agenda />
      <Dresscode />
      <Rsvp party={PARTIES.main} />
    </>
  );
}
