/**
 * Dựng asset cho hero, Thời gian & Địa điểm, ruy băng và hoa rum RSVP từ các
 * file gốc trong `design/` → `public/assets/*.webp`. File gốc để ngoài
 * `public/` vì mọi thứ trong `public/` đều tải về được — mấy tấm gốc nặng
 * hàng chục MB.
 *
 * Tên file xuất ra kèm mã băm nội dung (`time-frame.3f9a1c2e.webp`) và script
 * tự sửa đường dẫn trong src/lib/layers.ts. Đổi tranh mà giữ nguyên tên file
 * thì trình duyệt cứ hiện tranh cũ đã lưu đệm; đổi tên theo nội dung thì tranh
 * mới luôn có đường dẫn mới.
 *
 * Chạy lại khi đổi file gốc (sharp không nằm trong dependencies vì chỉ dùng
 * lúc dựng asset, không dùng lúc chạy web):
 *   npm i --no-save sharp && node scripts/build-hero-time-assets.mjs
 */
import { createHash } from "node:crypto";
import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import sharp from "sharp";

const OUT = "public/assets";
const LAYERS_TS = "src/lib/layers.ts";
const webp = { quality: 90, effort: 5 };

/** name → tên file có mã băm vừa ghi ra */
const built = new Map();

/**
 * Hộp bao phần có nét thật theo kênh alpha.
 *
 * Không dùng `sharp().trim()`: file xuất từ trình vẽ còn lác đác điểm ảnh gần
 * trong suốt (alpha 1–40) rải tới tận đáy canvas, trim tính cả chúng nên hộp
 * bao phình ra gần bằng cả tấm.
 */
async function alphaBox(src, threshold = 40) {
  const { data, info } = await sharp(src)
    .ensureAlpha()
    .extractChannel(3)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  let x0 = W, y0 = H, x1 = -1, y1 = -1;
  for (let y = 0; y < H; y++) {
    const row = y * W;
    for (let x = 0; x < W; x++) {
      if (data[row + x] > threshold) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

async function save(pipeline, name) {
  const { data, info } = await pipeline.webp(webp).toBuffer({ resolveWithObject: true });
  const hash = createHash("sha256").update(data).digest("hex").slice(0, 8);
  const file = `${name}.${hash}.webp`;

  // Xoá mọi bản cũ của asset này (có hoặc không có mã băm) trước khi ghi bản mới.
  const stale = new RegExp(`^${name}(\\.[0-9a-f]{8})?\\.webp$`);
  for (const old of await readdir(OUT)) {
    if (stale.test(old) && old !== file) await unlink(`${OUT}/${old}`);
  }
  await writeFile(`${OUT}/${file}`, data);

  built.set(name, file);
  console.log(`${file}  ${info.width}x${info.height}  ${(info.size / 1024) | 0}KB`);
}

/** Cắt sát nét rồi thu về bề rộng cho sẵn. */
async function cut(src, name, width) {
  const box = await alphaBox(src);
  await save(sharp(src).extract(box).resize({ width, withoutEnlargement: true }), name);
}

// Tranh lễ đường của hero — cùng khung 1108x1420 với lớp cô dâu chú rể đi bộ
// (COUPLE_WALKING), đổi tranh mà đổi khung là lớp người lệch khỏi lối đi.
await save(sharp("design/hero.png"), "hero-background");

// Hai góc hoa của hero. Mép trên và mép ngoài bị cắt thẳng sẵn, nên phải đặt
// sát góc section để đường cắt nằm đúng mép màn hình.
await cut("design/hero-corner-left.png", "hero-corner-left", 900);
await cut("design/hero-corner-right.png", "hero-corner-right", 900);

// Khung vòm có đôi thiên nga — nền của phần Thời gian. Tranh kín cả tấm, chỉ
// thu nhỏ: trang rộng tối đa 640px, 1280px là đủ nét trên màn hình 2x.
await save(sharp("design/time section.png").flatten({ background: "#f6f4f0" }).resize({ width: 1280 }), "time-frame");

// Minh hoạ Trung tâm Hội nghị Quốc gia cho phần Địa điểm.
await cut("design/venue.png", "venue", 1100);

// Ruy băng thắt nơ — dải phân cách Chương trình → Trang phục.
await cut("design/ribbon.png", "ribbon", 1400);

// Cành hoa rum ôm góc trên trái section RSVP.
await cut("design/rsvp-lily.png", "rsvp-lily", 900);

// Trỏ layers.ts sang đúng tên file mới.
let layers = await readFile(LAYERS_TS, "utf8");
for (const [name, file] of built) {
  const ref = new RegExp(`/assets/${name}(\\.[0-9a-f]{8})?\\.webp`, "g");
  if (!ref.test(layers)) {
    console.warn(`!! ${LAYERS_TS} chưa khai báo /assets/${name}.webp — thêm tay rồi chạy lại.`);
    continue;
  }
  layers = layers.replace(ref, `/assets/${file}`);
}
await writeFile(LAYERS_TS, layers);
console.log(`${LAYERS_TS} đã cập nhật.`);
