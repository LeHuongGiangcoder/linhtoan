import type { Metadata, Viewport } from "next";
import { alegreya, dateFont, moncheri } from "./fonts";
import {
  COUPLE,
  COUPLE_TITLE,
  DEFAULT_PARTY,
  openGraphFor,
  PARTIES,
  partyDescription,
  SITE_URL,
  twitterFor,
} from "@/lib/content";
import "./globals.css";

const TITLE = COUPLE_TITLE;

/**
 * Mô tả mặc định, cho trang chủ và cho link nào chưa tra được khách. Link
 * riêng ghi đè bằng mô tả đúng nhà của khách — xem `generateMetadata` trong
 * app/[event]/[slug]/page.tsx.
 */
const DEFAULT = PARTIES[DEFAULT_PARTY];
const DESCRIPTION = partyDescription(DEFAULT);

export const metadata: Metadata = {
  // Bắt buộc để Next dựng đường dẫn tuyệt đối cho ảnh og — thiếu nó thì thẻ
  // xem trước trên Facebook / Zalo hiện trắng trơn.
  metadataBase: new URL(SITE_URL),
  title: `${TITLE} — ${COUPLE.dateFull}`,
  description: DESCRIPTION,
  openGraph: openGraphFor(DEFAULT),
  twitter: twitterFor(DEFAULT),
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
      className={`${moncheri.variable} ${dateFont.variable} ${alegreya.variable}`}
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
