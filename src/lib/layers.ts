// Auto-generated từ public/assets/layers.json — kích thước gốc + vị trí trên canvas 3875x5462
export type LayerId = keyof typeof LAYERS;

export const LAYERS = {
  "2": { src: "/assets/2.webp", w: 881, h: 987, left: 0.1145, top: 0.1638, width: 0.7762, height: 0.6169 },
  "3": { src: "/assets/3.webp", w: 1012, h: 679, left: 0.0652, top: 0.2687, width: 0.8916, height: 0.4244 },
  "4": { src: "/assets/4.webp", w: 1064, h: 909, left: 0.0335, top: 0.1925, width: 0.9374, height: 0.5681 },
  "5": { src: "/assets/5.webp", w: 965, h: 996, left: 0.0987, top: 0.1613, width: 0.8502, height: 0.6225 },
  "6": { src: "/assets/hero-background.webp", w: 1108, h: 1420, left: 0.0, top: 0.2725, width: 1.0, height: 0.6575 },
  "7": { src: "/assets/7.webp", w: 1013, h: 475, left: 0.0537, top: 0.2169, width: 0.8925, height: 0.2969 },
  "8": { src: "/assets/8.webp", w: 1135, h: 1461, left: 0.0, top: 0.0706, width: 1.0, height: 0.9131 },
  "9": { src: "/assets/9.webp", w: 956, h: 1339, left: 0.0784, top: 0.0706, width: 0.8423, height: 0.8369 },
  "10": { src: "/assets/10.webp", w: 831, h: 1073, left: 0.1383, top: 0.1181, width: 0.7322, height: 0.6706 },
  "11": { src: "/assets/11.webp", w: 847, h: 1005, left: 0.2044, top: 0.1575, width: 0.7463, height: 0.6281 },
  "12": { src: "/assets/12.webp", w: 1025, h: 1292, left: 0.0511, top: 0.1219, width: 0.9031, height: 0.8075 },
  "13": { src: "/assets/13.webp", w: 1135, h: 503, left: 0.0, top: 0.4331, width: 1.0, height: 0.3144 },
  "14": { src: "/assets/14.webp", w: 928, h: 1139, left: 0.1004, top: 0.025, width: 0.8176, height: 0.7119 },
  "15": { src: "/assets/15.webp", w: 1030, h: 1198, left: 0.0634, top: 0.0712, width: 0.9075, height: 0.7488 },
  "16": { src: "/assets/16.webp", w: 982, h: 1163, left: 0.0581, top: 0.1144, width: 0.8652, height: 0.7269 },
  "17": { src: "/assets/17.webp", w: 966, h: 1172, left: 0.089, top: 0.1075, width: 0.8511, height: 0.7325 },
  "18": { src: "/assets/18.webp", w: 999, h: 510, left: 0.0599, top: 0.2044, width: 0.8802, height: 0.3187 },
  "19": { src: "/assets/19.webp", w: 1072, h: 762, left: 0.0115, top: 0.1319, width: 0.9445, height: 0.4763 },
  "20": { src: "/assets/20.webp", w: 986, h: 843, left: 0.1004, top: 0.1406, width: 0.8687, height: 0.5269 },
  "21": { src: "/assets/21.webp", w: 1060, h: 860, left: 0.0388, top: 0.1737, width: 0.9339, height: 0.5375 },
  "22": { src: "/assets/22.webp", w: 1007, h: 1354, left: 0.0608, top: 0.1025, width: 0.8872, height: 0.8462 },
  "23": { src: "/assets/23.webp", w: 651, h: 1412, left: 0.2326, top: 0.055, width: 0.5736, height: 0.8825 },
  "24": { src: "/assets/24.webp", w: 997, h: 1367, left: 0.0661, top: 0.1081, width: 0.8784, height: 0.8544 },
  "37": { src: "/assets/hero-background.webp", w: 1108, h: 1420, left: 0.06374, top: 0.16835, width: 0.87226, height: 0.79311 },
  "38": { src: "/assets/38.webp", w: 1437, h: 1700, left: 0.0, top: 0.12688, width: 1.0, height: 0.83925 },
  "39": { src: "/assets/39.webp", w: 573, h: 1700, left: 0.20103, top: 0.23947, width: 0.30581, height: 0.64372 },
  "40": { src: "/assets/40.webp", w: 573, h: 1700, left: 0.48439, top: 0.23947, width: 0.30581, height: 0.64372 },
} as const;

/** Chữ ký tên cô dâu / chú rể — cắt từ public/couple typo.png.
 *  `width` = bề rộng so với canvas gốc 3875px, giữ đúng tỉ lệ giữa hai dòng. */
export const PAINTING = {
  swans: { src: "/assets/painting-swans.webp", w: 900, h: 1600 },
} as const;

/**
 * Element rời từ bộ minh hoạ thứ hai — chỉ dùng làm decor nên không có toạ độ
 * trên canvas như LAYERS.
 *
 * Tiền tố `el-` là bắt buộc chứ không phải cho đẹp: `assets/18.webp` là xe hoa
 * còn `element (1)/18.png` là đài phun nước, trùng số nhưng khác hẳn hình.
 */
export const ELEMENTS = {
  "el-41": { src: "/assets/el-41.webp", w: 800, h: 753 },
  "el-42": { src: "/assets/el-42.webp", w: 800, h: 772 },
  "el-43": { src: "/assets/el-43.webp", w: 560, h: 967 },
  "el-44": { src: "/assets/el-44.webp", w: 560, h: 1404 },
  "el-45": { src: "/assets/el-45.webp", w: 900, h: 469 },
  /** Đài phun nước — khác với "18" trong LAYERS (xe hoa). */
  "el-18": { src: "/assets/el-18.webp", w: 700, h: 829 },
  "el-46": { src: "/assets/el-46.webp", w: 520, h: 400 },
  /** Chùm cẩm tú cầu ba màu, ghép sẵn từ 37 + 38 + 39. */
  "el-hydrangea": { src: "/assets/el-hydrangea.webp", w: 700, h: 816 },
  /** Đôi thiên nga chụm đầu thành hình trái tim. */
  "el-swans": { src: "/assets/el-swans.webp", w: 560, h: 557 },
  /** Dải bụi hoa trắng: 54.png lặp 5 lần, vuốt mép và chồng lấn để liền mạch. */
  "el-54-strip": { src: "/assets/el-54-strip.webp", w: 1700, h: 361 },
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

export const COUPLE_TYPO = {
  bride: { src: "/assets/couple-bride.webp", w: 1400, h: 292, width: 0.8797 },
  groom: { src: "/assets/couple-groom.webp", w: 1400, h: 316, width: 0.8385 },
} as const;
