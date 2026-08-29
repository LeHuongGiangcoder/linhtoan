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

    const io = new IntersectionObserver(
      (entries) => {
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

    // Lưới an toàn: nếu observer không bắn (tab ẩn, trình duyệt lạ…),
    // vẫn hiện nội dung sau 1.5s.
    const fallback = window.setTimeout(() => {
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
