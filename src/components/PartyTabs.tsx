"use client";

import { PARTIES, PARTY_ORDER, type PartyId } from "@/lib/content";

type PartyTabsProps = {
  value: PartyId;
  onChange: (id: PartyId) => void;
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
  hint,
  className = "",
}: PartyTabsProps) {
  return (
    <div className={`party-tabs ${className}`}>
      {hint ? <p className="eyebrow">{hint}</p> : null}

      <div className="party-tabs-row" role="tablist" aria-label="Chọn buổi tiệc">
        {PARTY_ORDER.map((id) => (
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
