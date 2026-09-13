"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** 1–5, tương ứng .reveal-d1 … .reveal-d5 */
  delay?: 1 | 2 | 3 | 4 | 5;
  as?: ElementType;
  className?: string;
};

/** Bọc nội dung để fade-up khi cuộn tới. Style nằm trong globals.css (.reveal). */
export function Reveal({
  children,
  delay,
  as: Tag = "div",
  className = "",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let reported = false;
    const io = new IntersectionObserver(
      (entries) => {
        reported = true;
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    io.observe(el);

    // Lưới an toàn: observer luôn báo một lần ngay sau observe(), kể cả khi
    // phần tử nằm ngoài màn hình. Chỉ khi không báo gì sau 1.5s (trình duyệt
    // lạ, observer hỏng) mới hiện thẳng nội dung.
    // Trước đây mốc 1.5s hiện TẤT CẢ phần tử — kể cả những thứ còn cách cả
    // chục màn hình — nên khách cuộn tới nơi thì hiệu ứng đã chạy xong từ lâu.
    const fallback = window.setTimeout(() => {
      if (reported) return;
      el.classList.add("is-visible");
      io.disconnect();
    }, 1500);

    return () => {
      window.clearTimeout(fallback);
      io.disconnect();
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${delay ? `reveal-d${delay}` : ""} ${className}`}
    >
      {children}
    </Tag>
  );
}
