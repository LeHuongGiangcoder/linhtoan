/**
 * Dựng ảnh xem trước khi chia sẻ lên mạng xã hội → public/og.<mã băm>.jpg
 * (1200x630), rồi tự sửa đường dẫn trong src/app/layout.tsx.
 *
 * Bố cục theo đúng thiệp: hai góc hoa của hero, chữ ký tên chú rể / cô dâu,
 * ngày cưới và địa điểm. Chữ được dựng bằng satori (bộ dựng ảnh OG có sẵn
 * trong Next) với chính các font của site, nên có dấu tiếng Việt đầy đủ.
 *
 * Tên file kèm mã băm nội dung: Facebook / Zalo lưu đệm ảnh xem trước theo
 * đường dẫn rất lâu, giữ nguyên tên thì đổi ảnh xong vẫn hiện ảnh cũ.
 *
 * Chạy lại khi đổi tên, ngày, địa điểm hoặc tranh:
 *   npm i --no-save sharp && node scripts/build-og-image.mjs
 */
import { createHash } from "node:crypto";
import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";
import React from "react";
import sharp from "sharp";

const W = 1200;
const H = 630;
const OUT_DIR = "public";
const LAYOUT = "src/app/layout.tsx";
const LAYERS = "src/lib/layers.ts";
const CONTENT = "src/lib/content.ts";

const OLIVE = "#544e30";
const OLIVE_SOFT = "#7a7458";

const h = React.createElement;

/** Đọc chuỗi `key: "value"` đầu tiên trong một file TS — đủ cho content/layers. */
async function pick(file, key) {
  const src = await readFile(file, "utf8");
  const m = src.match(new RegExp(`${key}\\s*:\\s*\\{\\s*src:\\s*"([^"]+)"|${key}:\\s*"([^"]*)"`));
  if (!m) throw new Error(`Không tìm thấy ${key} trong ${file}`);
  return m[1] ?? m[2];
}

/** Asset trong public/ → data URL PNG (satori không đọc WebP). */
async function asset(url, width) {
  const png = await sharp(`public${url}`).resize({ width: Math.round(width) }).png().toBuffer();
  const { height } = await sharp(png).metadata();
  return { src: `data:image/png;base64,${png.toString("base64")}`, width: Math.round(width), height };
}

const font = async (path) => {
  const buf = await readFile(path);
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
};

const main = async () => {
  const [dateDisplay, venue, hall] = await Promise.all([
    pick(CONTENT, "dateDisplay"),
    pick(CONTENT, "venue"),
    pick(CONTENT, "hall"),
  ]);

  const paper = await sharp("public/assets/background.webp").resize(W, H, { fit: "cover" }).png().toBuffer();

  const [cornerL, cornerR, groom, bride, divider] = await Promise.all([
    pick(LAYERS, `"hero-corner-left"`).then((u) => asset(u, 500)),
    pick(LAYERS, `"hero-corner-right"`).then((u) => asset(u, 500)),
    pick(LAYERS, "groom").then((u) => asset(u, 462)),
    pick(LAYERS, "bride").then((u) => asset(u, 461)),
    asset("/assets/divider.webp", 230),
  ]);

  const img = (a, style) => h("img", { src: a.src, width: a.width, height: a.height, style });

  // Dấu ✛ nối hai tên, vẽ bằng hai vạch — font thân bài không có ký tự này.
  const cross = h(
    "div",
    { style: { position: "relative", width: 18, height: 18, display: "flex", margin: "6px 0" } },
    h("div", { style: { position: "absolute", left: 8, top: 0, width: 2, height: 18, background: OLIVE_SOFT } }),
    h("div", { style: { position: "absolute", left: 0, top: 8, width: 18, height: 2, background: OLIVE_SOFT } }),
  );

  const tree = h(
    "div",
    {
      style: {
        width: W,
        height: H,
        display: "flex",
        position: "relative",
        backgroundImage: `url(data:image/png;base64,${paper.toString("base64")})`,
        backgroundSize: `${W}px ${H}px`,
      },
    },
    // Hai góc hoa: mép cắt thẳng nằm đúng mép ảnh, như trên hero.
    img(cornerL, { position: "absolute", left: 0, top: 0 }),
    img(cornerR, { position: "absolute", right: 0, top: 0 }),
    h(
      "div",
      {
        style: {
          position: "absolute",
          left: 0,
          right: 0,
          top: 104,
          bottom: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: OLIVE,
        },
      },
      h(
        "div",
        { style: { fontFamily: "Body", fontWeight: 600, fontSize: 19, letterSpacing: 7, color: OLIVE_SOFT, marginBottom: 14 } },
        "TRÂN TRỌNG KÍNH MỜI",
      ),
      img(groom, {}),
      cross,
      img(bride, {}),
      h("div", { style: { fontFamily: "Date", fontSize: 54, letterSpacing: 4, marginTop: 30, lineHeight: 1 } }, dateDisplay),
      img(divider, { marginTop: 14, marginBottom: 12 }),
      h(
        "div",
        { style: { fontFamily: "Body", fontWeight: 600, fontSize: 21, letterSpacing: 6 } },
        hall.toUpperCase(),
      ),
      h("div", { style: { fontFamily: "BodyItalic", fontSize: 22, color: OLIVE_SOFT, marginTop: 4 } }, `${venue} · Hà Nội`),
    ),
  );

  const res = new ImageResponse(tree, {
    width: W,
    height: H,
    fonts: [
      { name: "Date", data: await font("public/font/TAN-PEARL-Regular.otf") },
      { name: "Body", data: await font("public/font/Alegreya/static/Alegreya-SemiBold.ttf"), weight: 600 },
      { name: "BodyItalic", data: await font("public/font/Alegreya/static/Alegreya-Italic.ttf"), style: "italic" },
    ],
  });

  const data = await sharp(Buffer.from(await res.arrayBuffer()))
    .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
    .toBuffer();

  const file = `og.${createHash("sha256").update(data).digest("hex").slice(0, 8)}.jpg`;
  for (const old of await readdir(OUT_DIR)) {
    if (/^og(\.[0-9a-f]{8})?\.jpg$/.test(old) && old !== file) await unlink(`${OUT_DIR}/${old}`);
  }
  await writeFile(`${OUT_DIR}/${file}`, data);

  const layout = await readFile(LAYOUT, "utf8");
  const ref = /\/og(\.[0-9a-f]{8})?\.jpg/g;
  if (!ref.test(layout)) throw new Error(`${LAYOUT} không có đường dẫn /og*.jpg nào để cập nhật`);
  await writeFile(LAYOUT, layout.replace(ref, `/${file}`));

  console.log(`public/${file}  ${W}x${H}  ${(data.length / 1024) | 0}KB → ${LAYOUT}`);
};

main();
