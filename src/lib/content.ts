/** Toàn bộ nội dung hardcode — sửa ở đây là đổi cả site. */

export const COUPLE = {
  bride: "Khánh Linh",
  groom: "Toàn Phạm",
  dateDisplay: "11.29.26",
  dateFull: "Chủ Nhật, ngày 29 tháng 11 năm 2026",
  lunar: "Nhằm ngày 21 tháng 10 năm Bính Ngọ",
  city: "Hà Nội",
};

/** Dòng chào ở hero. `guest` là tên mặc định khi thiệp mở không kèm link riêng. */
export const HERO = {
  greeting: "Dear",
  guest: "Quý khách",
  invite: "We joyfully invite you to our wedding",
};

/** Hai buổi tiệc — khách tự chọn xem buổi nào bằng nút chuyển. */
export type PartyId = "intimate" | "main";

export type Party = {
  id: PartyId;
  /** Nhãn trên nút chuyển */
  tab: string;
  /** Chữ khắc trên tấm biển chạm nổi trong ảnh ghép */
  plaqueTitle: string;
  plaqueNote: string;
  /** Id ảnh trong ART — mỗi tiệc một kiểu biển */
  plaque: "tv-plaque-intimate" | "tv-plaque-main";
  /**
   * Lề trong của tấm biển, đo trên chính file ảnh: phần mặt phẳng viết được
   * nằm gọn trong khung hoa văn chạm nổi. Hai tấm khác hình nên khác lề.
   */
  plaqueInset: string;
  event: string;
  weekday: string;
  /** Dòng chữ lớn trên vé — giữ ngắn, mặt vé hẹp */
  dateScript: string;
  dateShort: string;
  /** TODO: giờ đãi tiệc chưa chốt, sửa lại khi có lịch chính thức. */
  time: string;
  hall: string;
  venue: string;
  address: string;
  city: string;
  mapUrl: string;
};

export const PARTIES: Record<PartyId, Party> = {
  intimate: {
    id: "intimate",
    tab: "Tiệc thân mật",
    plaqueTitle: "Intimate",
    plaqueNote: "Tiệc thân mật",
    plaque: "tv-plaque-intimate",
    plaqueInset: "17%",
    event: "Tiệc thân mật",
    weekday: "Thứ Bảy",
    dateScript: "21 Tháng 11",
    dateShort: "21 . 11 . 2026",
    time: "18:00",
    hall: "",
    venue: "InterContinental Hạ Long",
    address: "Bãi Cháy, TP. Hạ Long, Quảng Ninh",
    city: "Hạ Long",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=InterContinental+Halong+Bay+Resort",
  },
  main: {
    id: "main",
    tab: "Tiệc chính",
    plaqueTitle: "Main Party",
    plaqueNote: "Tiệc chính",
    plaque: "tv-plaque-main",
    plaqueInset: "27% 19% 29%",
    event: "Tiệc cưới",
    weekday: "Chủ Nhật",
    dateScript: "29 Tháng 11",
    dateShort: "29 . 11 . 2026",
    time: "10:30",
    hall: "",
    venue: "Trung tâm Hội nghị Quốc gia",
    address: "57 Phạm Hùng, Mễ Trì, Nam Từ Liêm, Hà Nội",
    city: "Hà Nội",
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=Trung+tam+Hoi+nghi+Quoc+gia+57+Pham+Hung+Ha+Noi",
  },
};

export const PARTY_ORDER: PartyId[] = ["intimate", "main"];

/** Chữ dựng đứng trên cuống vé — cuống hẹp nên giữ thật ngắn. */
export const TICKET_STUB = "Kính mời";

/** Chương trình — chỉ có ở tiệc chính. */
export const AGENDA = [
  {
    time: "10:30",
    title: "Welcome Guest",
    desc: "Chụp ảnh check-in photobooth sảnh ballroom cùng khách mời",
  },
  {
    time: "11:30",
    title: "Ceremony",
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
    { name: "Ivory", hex: "#f2ece0" },
    { name: "Blush", hex: "#e7c9bd" },
    { name: "Butter", hex: "#efe0ad" },
    { name: "Sage", hex: "#c7cfbc" },
    { name: "Sky", hex: "#cbd8e3" },
    { name: "Clay", hex: "#d9c3b0" },
  ],
};
