/** Nhãn thứ, đánh số theo `getUTCDay()`: 0 là Chủ Nhật. */
const WEEKDAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

const DAY = 86_400_000;

/**
 * Vài ngày quanh ngày cưới, ngày cưới nằm chính giữa.
 *
 * Đọc thẳng ngày/tháng/năm từ đầu chuỗi `startsAt` ("2026-11-29T10:30+07:00")
 * rồi tính bằng giờ UTC: không phụ thuộc múi giờ của máy chủ lẫn máy khách,
 * nên server và trình duyệt luôn dựng ra cùng một dải ngày.
 */
function daysAround(startsAt: string, around: number) {
  const [y, m, d] = startsAt.slice(0, 10).split("-").map(Number);
  const target = Date.UTC(y, m - 1, d);

  return Array.from({ length: around * 2 + 1 }, (_, i) => {
    const day = new Date(target + (i - around) * DAY);
    return {
      key: day.toISOString().slice(0, 10),
      label: WEEKDAYS[day.getUTCDay()],
      date: day.getUTCDate(),
      isTarget: i === around,
    };
  });
}

export function MiniCalendar({
  startsAt,
  around = 2,
}: {
  startsAt: string;
  /** Số ngày hiện ở mỗi bên ngày cưới */
  around?: number;
}) {
  const days = daysAround(startsAt, around);

  return (
    <div
      className="mini-cal"
      style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}
      role="img"
      aria-label={`Ngày cưới ${startsAt.slice(8, 10)}/${startsAt.slice(5, 7)}/${startsAt.slice(0, 4)}`}
    >
      {days.map(({ key, label }) => (
        <span key={`l-${key}`} className="mini-cal-label" aria-hidden>
          {label}
        </span>
      ))}
      {days.map(({ key, date, isTarget }) => (
        <span
          key={key}
          aria-hidden
          className={`mini-cal-day ${isTarget ? "mini-cal-day--target" : ""}`}
        >
          {isTarget ? (
            <svg viewBox="0 0 32 29" className="mini-cal-heart">
              <path d="M16 28.5C6.4 21.7 0 16.3 0 9.2 0 4 4 0 8.9 0c3 0 5.6 1.5 7.1 3.9C17.5 1.5 20.1 0 23.1 0 28 0 32 4 32 9.2c0 7.1-6.4 12.5-16 19.3Z" />
            </svg>
          ) : null}
          <span className="mini-cal-num">{date}</span>
        </span>
      ))}
    </div>
  );
}
