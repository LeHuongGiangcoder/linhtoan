import { TimeVenue } from "@/components/sections/TimeVenue";
import { Agenda } from "@/components/sections/Agenda";
import { Dresscode } from "@/components/sections/Dresscode";
import { Rsvp, type RsvpGuest } from "@/components/sections/Rsvp";
import { PARTIES } from "@/lib/content";

/**
 * Phần thân thiệp: Thời gian & Địa điểm → Chương trình → Dresscode → RSVP.
 *
 * Đám cưới chỉ còn một buổi tiệc, nên ở đây không còn nút chuyển buổi và cũng
 * không cần state — toàn bộ thân thiệp render trên server.
 *
 * `guest` có khi thiệp mở bằng link riêng: form RSVP điền sẵn tên và ghi phản
 * hồi vào đúng hàng của khách đó trong Google Sheet.
 */
export function Party({ guest }: { guest?: RsvpGuest } = {}) {
  return (
    <>
      <TimeVenue party={PARTIES.main} />
      <Agenda />
      <Dresscode />
      <Rsvp party={PARTIES.main} guest={guest} />
    </>
  );
}
