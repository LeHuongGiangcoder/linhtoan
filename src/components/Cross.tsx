/** Dấu thánh giá nhỏ — dùng nối tên cô dâu chú rể và nối các mốc trong agenda. */
export function Cross({
  size = "1.15rem",
  className = "",
}: {
  size?: string;
  className?: string;
}) {
  return (
    <span aria-hidden className={`cross-mark ${className}`} style={{ fontSize: size }}>
      ✛
    </span>
  );
}
