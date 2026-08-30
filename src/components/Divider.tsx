import Image from "next/image";

/**
 * Dải hoa văn ngăn cách. Đặt làm phần tử đầu tiên trong `.section-inner`
 * để khoảng cách tới heading luôn cố định (1.25rem).
 */
export function Divider() {
  return (
    <Image
      src="/assets/divider.webp"
      alt=""
      aria-hidden
      width={1200}
      height={58}
      sizes="208px"
      className="section-divider"
    />
  );
}
