import { TimeVenue } from "@/components/sections/TimeVenue";
import { Agenda } from "@/components/sections/Agenda";
import { Dresscode } from "@/components/sections/Dresscode";
import { Rsvp, type RsvpGuest } from "@/components/sections/Rsvp";
import { DEFAULT_PARTY, PARTIES, type PartyId } from "@/lib/content";

/**
 * Phần thân thiệp: Thời gian & Địa điểm → Chương trình → Dresscode → RSVP.
 *
 * Khách không tự chọn buổi tiệc — nhà nào đã định sẵn trong Sheet — nên ở đây
 * không có nút chuyển và cũng không cần state: toàn bộ thân thiệp render trên
 * server.
 *
 * `guest` có khi thiệp mở bằng link riêng: form RSVP điền sẵn tên và ghi phản
 * hồi vào đúng hàng của khách đó trong Google Sheet.
 *
 * `party` là nhà của khách, đọc từ cột "Nhà" trong Sheet. Hai nhà chỉ khác
 * nhau ở phần Thời gian & Địa điểm và Chương trình; Dresscode dùng chung.
 */
export function Party({
  party = DEFAULT_PARTY,
  guest,
}: { party?: PartyId; guest?: RsvpGuest } = {}) {
  const p = PARTIES[party];

  return (
    <>
      <TimeVenue party={p} />
      <Agenda agenda={p.agenda} />
      <Dresscode />
      <Rsvp party={p} guest={guest} />
    </>
  );
}
