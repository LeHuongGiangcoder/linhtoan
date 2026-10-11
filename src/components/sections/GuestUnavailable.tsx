"use client";

import { Cross } from "@/components/Cross";
import { Divider } from "@/components/Divider";
import { Reveal } from "@/components/Reveal";

/**
 * Tấm chắn khi mở link riêng mà KHÔNG tra được danh sách khách.
 *
 * Vì sao không dựng đại tấm thiệp mặc định như trước: hai nhà tổ chức hai
 * ngày, hai nơi. Không biết khách thuộc nhà nào mà vẫn dựng thiệp là đang
 * đoán — đoán trúng thì chẳng ai khen, đoán trượt là khách nhà gái cầm trong
 * tay ngày 29.11 và địa chỉ Trung tâm Hội nghị Quốc gia, rồi đi sai ngày sai
 * chỗ. Thà nói thẳng là đang tải còn hơn.
 *
 * Chỉ dùng cho trạng thái `unavailable` (không đọc được Sheet) — tải lại là
 * có cơ hội khỏi. Slug gõ sai (`missing`) thì tải lại mấy cũng vậy, nên vẫn
 * cho xem thiệp chung.
 */
export function GuestUnavailable() {
  return (
    <section className="section section--fit relative">
      <div className="section-inner">
        <Reveal className="section-head">
          <span aria-hidden className="calla-divider" />
          <p className="eyebrow">Thiệp mời cưới</p>
          <h2 className="display-2">Đang tải</h2>
          <Divider />
        </Reveal>

        <Reveal delay={1} className="paper-panel center stack">
          <Cross size="1.1rem" className="mx-auto opacity-55" />
          <p className="body-text">
            Thiệp của quý khách chưa tải xong. Quý khách vui lòng tải lại trang
            giúp gia đình chúng tôi nhé.
          </p>
          <div className="btn-row">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => window.location.reload()}
            >
              Tải lại
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
