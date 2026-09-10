"use client";

import { PARTIES, PARTY_ORDER, type PartyId } from "@/lib/content";

type PartyTabsProps = {
  value: PartyId;
  onChange: (id: PartyId) => void;
  /** Những buổi tiệc khách này được xem. Chỉ một buổi thì không hiện nút. */
  options?: PartyId[];
  /** Dòng gợi ý phía trên — mỗi chỗ đặt nút một cách nói khác nhau. */
  hint?: string;
  className?: string;
};

/**
 * Nút chuyển giữa hai buổi tiệc.
 *
 * Dùng `role="tablist"` chứ không phải link: cả hai buổi nằm chung một trang,
 * bấm là đổi nội dung ngay tại chỗ chứ không điều hướng đi đâu.
 */
export function PartyTabs({
  value,
  onChange,
  options = PARTY_ORDER,
  hint,
  className = "",
}: PartyTabsProps) {
  // Khách chỉ được mời một buổi thì cái nút chuyển vừa thừa vừa tiết lộ là có
  // buổi khác mà họ không được mời.
  if (options.length < 2) return null;

  return (
    <div className={`party-tabs ${className}`}>
      {hint ? <p className="eyebrow">{hint}</p> : null}

      <div className="party-tabs-row" role="tablist" aria-label="Chọn buổi tiệc">
        {options.map((id) => (
          <button
            key={id}
            type="button"
            role="tab"
            id={`party-tab-${id}`}
            aria-selected={value === id}
            aria-controls={`party-panel-${id}`}
            className="party-tab"
            onClick={() => onChange(id)}
          >
            {PARTIES[id].tab}
          </button>
        ))}
      </div>
    </div>
  );
}
