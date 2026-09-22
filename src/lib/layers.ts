// Auto-generated từ public/assets/layers.json — kích thước gốc + vị trí trên canvas 3875x5462
export type LayerId = keyof typeof LAYERS;

export const LAYERS = {
  "6": { src: "/assets/hero-background.3e7fb7e2.webp", w: 1108, h: 1420, left: 0.0, top: 0.2725, width: 1.0, height: 0.6575 },
  "7": { src: "/assets/7.webp", w: 1013, h: 475, left: 0.0537, top: 0.2169, width: 0.8925, height: 0.2969 },
  "18": { src: "/assets/18.webp", w: 999, h: 510, left: 0.0599, top: 0.2044, width: 0.8802, height: 0.3187 },
  "19": { src: "/assets/19.webp", w: 1072, h: 762, left: 0.0115, top: 0.1319, width: 0.9445, height: 0.4763 },
  "37": { src: "/assets/hero-background.3e7fb7e2.webp", w: 1108, h: 1420, left: 0.06374, top: 0.16835, width: 0.87226, height: 0.79311 },
  "38": { src: "/assets/38.webp", w: 1437, h: 1700, left: 0.0, top: 0.12688, width: 1.0, height: 0.83925 },
  "39": { src: "/assets/39.webp", w: 573, h: 1700, left: 0.20103, top: 0.23947, width: 0.30581, height: 0.64372 },
  "40": { src: "/assets/40.webp", w: 573, h: 1700, left: 0.48439, top: 0.23947, width: 0.30581, height: 0.64372 },
} as const;

/**
 * Element rời từ bộ minh hoạ thứ hai — chỉ dùng làm decor nên không có toạ độ
 * trên canvas như LAYERS.
 *
 * Tiền tố `el-` là bắt buộc chứ không phải cho đẹp: `assets/18.webp` là xe hoa
 * còn `design/elements/18.png` là đài phun nước, trùng số nhưng khác hẳn hình.
 */
export const ELEMENTS = {
  "el-43": { src: "/assets/el-43.webp", w: 560, h: 967 },
  "el-44": { src: "/assets/el-44.webp", w: 560, h: 1404 },
  "el-45": { src: "/assets/el-45.webp", w: 900, h: 469 },
  /** Đài phun nước — khác với "18" trong LAYERS (xe hoa). */
  "el-18": { src: "/assets/el-18.webp", w: 700, h: 829 },
  "el-46": { src: "/assets/el-46.webp", w: 520, h: 400 },
  /** Dải bụi hoa trắng: 54.png lặp 5 lần, vuốt mép và chồng lấn để liền mạch. */
  "el-54-strip": { src: "/assets/el-54-strip.webp", w: 1700, h: 361 },

  /* Bộ asset dựng bằng scripts/build-hero-time-assets.mjs. */

  /** Hai góc hoa của hero — mép trên và mép ngoài cắt thẳng, đặt sát góc. */
  "hero-corner-left": { src: "/assets/hero-corner-left.970d9fd1.webp", w: 900, h: 712 },
  "hero-corner-right": { src: "/assets/hero-corner-right.5fdbea97.webp", w: 900, h: 778 },
  /** Khung vòm có đôi thiên nga — nền phần Thời gian. */
  "time-frame": { src: "/assets/time-frame.29be88d4.webp", w: 1280, h: 1804 },
  /** Minh hoạ Trung tâm Hội nghị Quốc gia. */
  venue: { src: "/assets/venue.f0e1a006.webp", w: 1100, h: 545 },
  /** Ruy băng thắt nơ: dải ngang ở trên, nơ bên phải, đuôi thả dọc mép phải. */
  ribbon: { src: "/assets/ribbon.c81e3f27.webp", w: 1181, h: 1136 },
  /** Cành hoa rum ôm góc: hoa vắt ngang phía trên, thân thả dọc bên trái. */
  "rsvp-lily": { src: "/assets/rsvp-lily.1b67fe58.webp", w: 900, h: 1046 },
} as const;

/** Mọi hình Decor có thể dùng — LAYERS chỉ khác ở chỗ có thêm toạ độ canvas. */
export const ART = { ...LAYERS, ...ELEMENTS };
export type ArtId = keyof typeof ART;

/** Cô dâu chú rể đi trên lối vào của tranh lễ đường.
 *  left/bottom/width tính theo canvas tranh 1108x1420, không phải theo section —
 *  ảnh tranh và lớp này phải nằm chung một khung thì mới khớp ở mọi bề ngang. */
export const COUPLE_WALKING = {
  src: "/assets/couple-walking.webp",
  w: 480,
  h: 582,
  left: 0.4208,
  bottom: 0.2324,
  width: 0.1625,
} as const;

/** Khối tên chú rể "and" cô dâu ở hero — dựng từ design/couple name hero.png.
 *
 *  File gốc không dùng thẳng được: nét màu đen trong khi cả site dùng olive, và
 *  sau chữ TOÀN có một mảng nền trắng đục (alpha 255) sẽ hiện thành ô trắng
 *  trên giấy kem. Cách dựng: độ đậm nét = (255 − độ sáng) × alpha gốc, nên nền
 *  trắng về trong suốt còn nét giữ nguyên khử răng cưa; tô lại bằng #544e30,
 *  cắt sát nét, thu về 1400px, webp q92, tên kèm 8 ký tự sha256 của file xuất.
 *
 *  CHƯA có trong scripts/build-hero-time-assets.mjs — đổi file gốc thì phải
 *  dựng lại tay theo đúng các bước trên. */
export const COUPLE_NAMES = {
  src: "/assets/couple-names.18863d19.webp",
  w: 1400,
  h: 894,
} as const;
