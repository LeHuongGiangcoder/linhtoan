/** Toàn bộ nội dung hardcode — sửa ở đây là đổi cả site. */

/**
 * Domain thật của thiệp. Dùng cho thẻ xem trước khi chia sẻ (Open Graph) —
 * Facebook / Zalo / iMessage đòi đường dẫn tuyệt đối, đường dẫn tương đối là
 * ảnh không hiện.
 *
 * PHẢI khớp với `SITE_ORIGIN` trong docs/apps-script.gs, nếu không link riêng
 * gửi cho khách sẽ trỏ sang một domain khác.
 */
export const SITE_URL = "https://khanhlinhtoanpham.gloweb.site";

export const COUPLE = {
  groom: "Khánh Toàn",
  bride: "Khánh Linh",
  dateDisplay: "29.11.2026",
  dateFull: "Chủ Nhật, ngày 29 tháng 11 năm 2026",
  lunar: "Nhằm ngày 21 tháng 10 năm Bính Ngọ",
  city: "Hà Nội",
};

/** Dòng chào ở hero. `guest` là tên mặc định khi thiệp mở không kèm link riêng. */
export const HERO = {
  greeting: "Kính gửi",
  guest: "Quý khách",
  invite: "Chúng mình trân trọng kính mời bạn đến chung vui trong ngày cưới",
};

/**
 * Buổi tiệc của đám cưới. Chỉ còn tiệc chính — `PARTIES` vẫn là một `Record`
 * để thêm lại một buổi nữa chỉ là thêm một khoá.
 */
export type PartyId = "main";

export type Party = {
  id: PartyId;
  /** Nhãn ngắn của buổi tiệc, dùng ở tiêu đề phụ và tiêu đề trang */
  tab: string;
  event: string;
  weekday: string;
  dateShort: string;
  /** TODO: giờ đãi tiệc chưa chốt, sửa lại khi có lịch chính thức. */
  time: string;
  /**
   * Mốc giờ đầy đủ kèm múi giờ Việt Nam — lịch nhỏ và đồng hồ đếm ngược đều
   * tính từ đây. Đổi `time` hay ngày cưới thì nhớ sửa cả dòng này.
   */
  startsAt: string;
  hall: string;
  venue: string;
  address: string;
  city: string;
  mapUrl: string;
};

export const PARTIES: Record<PartyId, Party> = {
  main: {
    id: "main",
    tab: "Tiệc chính",
    event: "Tiệc cưới",
    weekday: "Chủ Nhật",
    dateShort: "29 . 11 . 2026",
    time: "10:30",
    startsAt: "2026-11-29T10:30:00+07:00",
    hall: "",
    venue: "Trung tâm Hội nghị Quốc gia",
    address: "57 Phạm Hùng, Mễ Trì, Nam Từ Liêm, Hà Nội",
    city: "Hà Nội",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Trung+tam+Hoi+nghi+Quoc+gia+57+Pham+Hung+Ha+Noi",
  },
};

/** Chương trình buổi tiệc. */
export const AGENDA = [
  {
    time: "10:30",
    title: "Chào đón khách mời",
    desc: "Chụp ảnh check-in photobooth sảnh ballroom cùng khách mời",
  },
  {
    time: "11:30",
    title: "Nghi thức lễ cưới",
    desc: "Cắt bánh, rót rượu — nghi thức làm lễ",
  },
  {
    time: "11:45",
    title: "Khai tiệc",
    desc: "Mở tiệc chiêu đãi và gửi lời cảm ơn tới quan khách",
  },
];

export const DRESSCODE = {
  note: "Kính mong quý khách lựa chọn trang phục theo tông pastel dịu nhẹ để cùng chúng mình hoàn thiện khung hình ngày trọng đại.",
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
