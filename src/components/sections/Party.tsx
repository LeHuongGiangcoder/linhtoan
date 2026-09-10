"use client";

import { useState } from "react";
import { PartyTabs } from "@/components/PartyTabs";
import { TimeVenue } from "@/components/sections/TimeVenue";
import { Agenda } from "@/components/sections/Agenda";
import { Dresscode } from "@/components/sections/Dresscode";
import { Rsvp } from "@/components/sections/Rsvp";
import { PARTIES, type PartyId } from "@/lib/content";

/**
 * Phần thân thiệp — nội dung đổi theo buổi tiệc khách chọn.
 *
 * Tiệc thân mật có Thời gian & Địa điểm, Dresscode rồi tới RSVP; tiệc chính
 * có thêm Chương trình. Nút chuyển đặt ở cả hai đầu để khách đọc hết một buổi
 * là đổi được ngay, không phải cuộn ngược lên.
 *
 * `key` trên panel khiến React dựng lại cây con khi đổi tiệc: hiệu ứng reveal
 * và form RSVP đều bắt đầu lại từ đầu thay vì giữ trạng thái của buổi trước.
 */
export function Party() {
  const [party, setParty] = useState<PartyId>("intimate");
  const isMain = party === "main";

  return (
    <>
      <PartyTabs
        value={party}
        onChange={setParty}
        hint="Bạn muốn xem buổi tiệc nào?"
        className="party-tabs--top"
      />

      <div
        key={party}
        id={`party-panel-${party}`}
        role="tabpanel"
        aria-labelledby={`party-tab-${party}`}
      >
        <TimeVenue party={PARTIES[party]} />
        {isMain ? <Agenda /> : null}
        {/* Dresscode chung cho cả hai buổi — tông màu trang phục thì buổi nào
            cũng như nhau. */}
        <Dresscode />
        <Rsvp party={PARTIES[party]} />
      </div>

      <PartyTabs
        value={party}
        onChange={setParty}
        hint="Xem buổi tiệc còn lại"
        className="party-tabs--bottom"
      />
    </>
  );
}
