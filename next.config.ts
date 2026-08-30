import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Toàn bộ ảnh trong /public/assets đã được cắt nền, resize và nén WebP sẵn.
    // Tắt optimizer để tránh xử lý lại (và tránh việc dev server sinh bản 3840px).
    unoptimized: true,
  },
};

export default nextConfig;
