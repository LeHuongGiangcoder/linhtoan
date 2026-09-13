"use client";

import { useEffect, useState } from "react";

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Một dòng đếm ngược tới giờ làm lễ.
 *
 * Giờ hiện tại chỉ đọc sau khi mount: server dựng HTML trước đó vài giây, đọc
 * `Date.now()` lúc render là con số lệch với trình duyệt và React báo lỗi
 * hydrate. Trước khi mount hiện "--" giữ nguyên bề rộng dòng.
 */
export function Countdown({ to }: { to: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    // Nhịp đầu chạy ngay sau mount chứ không đợi hết giây đầu tiên.
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  const left = now === null ? null : Math.max(0, new Date(to).getTime() - now);

  if (left === 0) {
    return <p className="countdown countdown--done">Chúng mình đã về chung một nhà</p>;
  }

  const s = left === null ? null : Math.floor(left / 1000);
  const parts: [string, string][] = [
    [s === null ? "--" : String(Math.floor(s / 86400)), "ngày"],
    [s === null ? "--" : pad(Math.floor(s / 3600) % 24), "giờ"],
    [s === null ? "--" : pad(Math.floor(s / 60) % 60), "phút"],
    [s === null ? "--" : pad(s % 60), "giây"],
  ];

  return (
    <p className="countdown" aria-live="off">
      <span className="countdown-lead">Còn</span>
      {parts.map(([value, unit]) => (
        <span key={unit} className="countdown-part">
          <span className="countdown-num">{value}</span>
          <span className="countdown-unit">{unit}</span>
        </span>
      ))}
    </p>
  );
}
