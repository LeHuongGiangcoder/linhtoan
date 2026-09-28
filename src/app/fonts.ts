import localFont from "next/font/local";
import { Cormorant_Garamond } from "next/font/google";

/** Heading — DFVN TAN Mon Cheri (Việt hoá, có dấu đầy đủ) */
export const moncheri = localFont({
  src: "../../public/font/DFVNTAN-MONCHERI 2/DFVN TAN - MON CHERI.otf",
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Didot", "Cormorant Garamond", "Georgia", "serif"],
});

/**
 * Chỉ dùng cho ngày giờ — Cormorant Garamond.
 *
 * Thay cho TAN Pearl: chữ số của TAN Pearl là dạng trang trí, số 6 và số 0 gần
 * như một nét nên "2026" hay bị đọc nhầm thành "2020". Cormorant Garamond giữ
 * đúng chất serif thanh mảnh, tương phản cao của khối chữ tên cô dâu chú rể,
 * nhưng chữ số là dạng lining rõ ràng — giãn chữ rộng là đọc được ngay.
 */
export const dateFont = Cormorant_Garamond({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  variable: "--font-date",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Didot", "Cormorant Garamond", "Georgia", "serif"],
});

/** Body — Alegreya */
export const alegreya = localFont({
  src: [
    {
      path: "../../public/font/Alegreya/static/Alegreya-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/font/Alegreya/static/Alegreya-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/font/Alegreya/static/Alegreya-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/font/Alegreya/static/Alegreya-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
  ],
  variable: "--font-body",
  display: "swap",
});
