import type { Metadata, Viewport } from "next";
import { alegreya, moncheri, tanPearl } from "./fonts";
import { COUPLE, PARTIES, SITE_URL } from "@/lib/content";
import "./globals.css";

const TITLE = `${COUPLE.groom} & ${COUPLE.bride}`;

/** "29 . 11 . 2026" giãn chữ cho đẹp trên tấm vé, nhưng trong câu thì đọc rối. */
const compact = (date: string) => date.replace(/\s+/g, "");

const DESCRIPTION =
  `Thiệp mời cưới của ${TITLE} — ` +
  `${PARTIES.main.tab} ${compact(PARTIES.main.dateShort)} tại ` +
  `${PARTIES.main.hall ? `${PARTIES.main.hall}, ` : ""}${PARTIES.main.venue}.`;

export const metadata: Metadata = {
  // Bắt buộc để Next dựng đường dẫn tuyệt đối cho ảnh og — thiếu nó thì thẻ
  // xem trước trên Facebook / Zalo hiện trắng trơn.
  metadataBase: new URL(SITE_URL),
  title: `${TITLE} — ${COUPLE.dateFull}`,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: TITLE,
    title: `${TITLE} — Lưu lại ngày này`,
    description: DESCRIPTION,
    url: "/",
    images: [
      {
        url: "/og.2f3777c6.jpg",
        width: 1200,
        height: 630,
        alt: `Thiệp mời cưới ${TITLE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} — Lưu lại ngày này`,
    description: DESCRIPTION,
    images: ["/og.2f3777c6.jpg"],
  },
  robots: {
    // Thiệp riêng: đừng để Google đánh chỉ mục rồi người lạ tìm ra được.
    index: false,
    follow: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#f6f4f0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${moncheri.variable} ${tanPearl.variable} ${alegreya.variable}`}
    >
      <head>
        {/* Không có JS thì bỏ hẳn hiệu ứng reveal để nội dung luôn hiển thị */}
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body>
        <div className="page-shell">{children}</div>
      </body>
    </html>
  );
}
