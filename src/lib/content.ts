import type { Metadata } from "next";

/** Toàn bộ nội dung hardcode — sửa ở đây là đổi cả site. */

/**
 * Domain thật của thiệp. Dùng cho thẻ xem trước khi chia sẻ (Open Graph) —
 * Facebook / Zalo / iMessage đòi đường dẫn tuyệt đối, đường dẫn tương đối là
 * ảnh không hiện.
 *
 * PHẢI khớp với `SITE_ORIGIN` trong docs/apps-script.gs, nếu không link riêng
 * gửi cho khách sẽ trỏ sang một domain khác.
 */
export const SITE_URL = "https://linhtoan.gloweb.site";

/**
 * Ngày cưới KHÔNG nằm ở đây: hai nhà tổ chức hai ngày khác nhau, nên mọi mốc
 * ngày giờ đều thuộc về từng `Party`. Để sót một ngày dùng chung là khách một
 * bên đọc được ngày của bên kia.
 */
export const COUPLE = {
  groom: "Khánh Toàn",
  bride: "Khánh Linh",
  city: "Hà Nội",
};

/** Dòng chào ở hero. `guest` là tên mặc định khi thiệp mở không kèm link riêng. */
export const HERO = {
  greeting: "Kính gửi",
  guest: "Quý khách",
  invite:
    "Gia đình chúng tôi trân trọng kính mời quý khách cùng gia đình đến chung vui trong ngày cưới",
};

/**
 * Hai bên nhà, hai tấm thiệp — chỉ khác giờ và địa điểm, mọi phần còn lại
 * dùng chung.
 *
 * Khách thuộc nhà nào là do cột "Nhà" trong Google Sheet quyết định, KHÔNG
 * phải do đường dẫn: link riêng của mọi khách vẫn là /main/<slug> như cũ, nên
 * những link đã gửi đi trước khi tách thiệp vẫn sống nguyên.
 */
export type PartyId = "groom" | "bride";

/** Khách chưa ghi "Nhà", hoặc mở thẳng trang chủ, thì thấy tấm này. */
export const DEFAULT_PARTY: PartyId = "groom";

/** Một mốc trong phần Chương trình. */
export type AgendaItem = { time: string; title: string; desc: string };

export type Party = {
  id: PartyId;
  /** Nhãn ngắn của buổi tiệc, dùng ở tiêu đề phụ và tiêu đề trang */
  tab: string;
  event: string;
  weekday: string;
  /** "29 . 11 . 2026" — giãn chữ, dùng trên tấm vé ở phần Thời gian */
  dateShort: string;
  /** "29.11.2026" — không giãn, dùng ở hero và chân thiệp */
  dateDisplay: string;
  /** "Chủ Nhật, ngày 29 tháng 11 năm 2026" — dùng ở tiêu đề trang */
  dateFull: string;
  time: string;
  /**
   * Mốc giờ đầy đủ kèm múi giờ Việt Nam — lịch nhỏ và dòng tháng/năm ở phần
   * Thời gian tính từ đây. Đổi `time` hay ngày cưới thì nhớ sửa cả dòng này.
   */
  startsAt: string;
  hall: string;
  venue: string;
  address: string;
  city: string;
  mapUrl: string;
  /** Chương trình của riêng buổi tiệc này — giờ phải khớp với `time`. */
  agenda: AgendaItem[];
};

export const PARTIES: Record<PartyId, Party> = {
  /** Nhà trai — giữ nguyên như tấm thiệp trước khi tách. */
  groom: {
    id: "groom",
    tab: "Tiệc chính",
    event: "Tiệc cưới",
    weekday: "Chủ Nhật",
    dateShort: "29 . 11 . 2026",
    dateDisplay: "29.11.2026",
    dateFull: "Chủ Nhật, ngày 29 tháng 11 năm 2026",
    time: "11:00",
    startsAt: "2026-11-29T11:00:00+07:00",
    hall: "Sảnh Khánh Tiết",
    venue: "Trung tâm Hội nghị Quốc gia",
    address: "57 Phạm Hùng, Mễ Trì, Nam Từ Liêm, Hà Nội",
    city: "Hà Nội",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Trung+tam+Hoi+nghi+Quoc+gia+57+Pham+Hung+Ha+Noi",
    agenda: [
      {
        time: "10:30",
        title: "Chào đón khách mời",
        desc: "Chụp ảnh check-in photobooth sảnh ballroom cùng khách mời",
      },
      {
        time: "11:00",
        title: "Nghi thức lễ cưới",
        desc: "Cắt bánh, rót rượu — nghi thức làm lễ",
      },
      {
        time: "11:30",
        title: "Khai tiệc",
        desc: "Mở tiệc chiêu đãi và gửi lời cảm ơn tới quan khách",
      },
    ],
  },

  /** Nhà gái — trước nhà trai một ngày, khác cả giờ lẫn địa điểm. */
  bride: {
    id: "bride",
    tab: "Tiệc cưới",
    event: "Tiệc cưới",
    weekday: "Thứ Bảy",
    dateShort: "28 . 11 . 2026",
    dateDisplay: "28.11.2026",
    dateFull: "Thứ Bảy, ngày 28 tháng 11 năm 2026",
    time: "16:00",
    startsAt: "2026-11-28T16:00:00+07:00",
    hall: "",
    venue: "Nhà văn hoá Đồng Nanh",
    address: "Phường Chương Mỹ, Hà Nội",
    city: "Hà Nội",
    mapUrl: "https://maps.app.goo.gl/UdrFTAAeXmVhBWzz5",
    agenda: [
      {
        time: "15:30",
        title: "Chào đón khách mời",
        desc: "Chụp ảnh check-in cùng khách mời tại khu vực đón khách",
      },
      {
        time: "16:00",
        title: "Nghi thức lễ cưới",
        desc: "Cắt bánh, rót rượu — nghi thức làm lễ",
      },
      {
        time: "16:30",
        title: "Khai tiệc",
        desc: "Mở tiệc chiêu đãi và gửi lời cảm ơn tới quan khách",
      },
    ],
  },
};

/** Tên đôi uyên ương, dùng ở tiêu đề và thẻ xem trước. */
export const COUPLE_TITLE = `${COUPLE.groom} & ${COUPLE.bride}`;

/**
 * Dòng mô tả trong thẻ xem trước khi khách gửi link cho nhau qua Zalo /
 * Messenger / iMessage.
 *
 * Nhận `party` chứ không lấy cố định: khách nhà gái chia sẻ link mà ô preview
 * ghi địa điểm nhà trai thì chẳng khác gì mời sai chỗ.
 */
export function partyDescription(party: Party): string {
  // "29 . 11 . 2026" giãn chữ cho đẹp trên tấm vé, nhưng trong câu thì đọc rối.
  const date = party.dateShort.replace(/\s+/g, "");
  const place = party.hall ? `${party.hall}, ${party.venue}` : party.venue;
  return `Thiệp mời cưới của ${COUPLE_TITLE} — ${party.tab} ${date} tại ${place}.`;
}

/** Ảnh trong thẻ xem trước. Tên có hash nên đổi ảnh là phải sửa cả ở đây. */
const OG_IMAGE = {
  url: "/og.2f3777c6.jpg",
  width: 1200,
  height: 630,
  alt: `Thiệp mời cưới ${COUPLE_TITLE}`,
};

/**
 * Nguyên khối thẻ xem trước cho một buổi tiệc.
 *
 * Phải dựng CẢ KHỐI ở một chỗ: Next ghi đè `openGraph` theo nguyên khối chứ
 * không trộn từng trường, nên trang con chỉ khai `description` là mất sạch
 * ảnh, url, siteName của layout gốc — ô preview hiện trắng trơn.
 */
export function openGraphFor(party: Party): Metadata["openGraph"] {
  return {
    type: "website",
    locale: "vi_VN",
    siteName: COUPLE_TITLE,
    title: `${COUPLE_TITLE} — Lưu lại ngày này`,
    description: partyDescription(party),
    url: "/",
    images: [OG_IMAGE],
  };
}

/** Cùng lý do với `openGraphFor`: khai thiếu trường là mất cả thẻ. */
export function twitterFor(party: Party): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title: `${COUPLE_TITLE} — Lưu lại ngày này`,
    description: partyDescription(party),
    images: [OG_IMAGE.url],
  };
}

export const DRESSCODE = {
  note: "Trang phục: kính mong quý khách lựa chọn tông pastel dịu nhẹ để cùng gia đình chúng tôi hoàn thiện khung hình ngày trọng đại.",
  avoid: "Xin phép hạn chế tông trắng tinh và đen tuyền.",
  palette: [
    { name: "Trắng ngà", hex: "#f2ece0" },
    { name: "Hồng phấn", hex: "#e7c9bd" },
    { name: "Vàng bơ", hex: "#efe0ad" },
    { name: "Xanh lá nhạt", hex: "#c7cfbc" },
    { name: "Xanh trời", hex: "#cbd8e3" },
    { name: "Nâu đất", hex: "#d9c3b0" },
  ],
};
