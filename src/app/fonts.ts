import localFont from "next/font/local";

/** Heading — DFVN TAN Mon Cheri (Việt hoá, có dấu đầy đủ) */
export const moncheri = localFont({
  src: "../../public/font/DFVNTAN-MONCHERI 2/DFVN TAN - MON CHERI.otf",
  variable: "--font-display",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Didot", "Cormorant Garamond", "Georgia", "serif"],
});

/** Chỉ dùng cho ngày tháng — TAN Pearl */
export const tanPearl = localFont({
  src: "../../public/font/TAN-PEARL-Regular.otf",
  variable: "--font-date",
  display: "swap",
  adjustFontFallback: false,
  fallback: ["Didot", "Georgia", "serif"],
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
