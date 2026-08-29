import type { Metadata, Viewport } from "next";
import { alegreya, moncheri, tanPearl } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Khánh Linh & Toàn Phạm — 24.03.2028",
  description:
    "Thiệp mời cưới của Khánh Linh & Toàn Phạm — 24 tháng 03, 2028 tại Hà Nội.",
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
