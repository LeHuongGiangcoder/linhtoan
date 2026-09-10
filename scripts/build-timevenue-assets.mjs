/**
 * Cắt bộ element cho section Time & Venue ra khỏi `design/element.png`
 * (một sheet 3875x5462 chứa tất cả element rời trên nền trong suốt).
 *
 * Chạy lại khi sheet đổi (sharp không nằm trong dependencies vì chỉ dùng lúc
 * dựng asset, không dùng lúc chạy web):
 *   npm i --no-save sharp && node scripts/build-timevenue-assets.mjs
 *
 * Toạ độ dưới đây lấy từ bounding box alpha của từng vùng liên thông trên
 * sheet — đo một lần rồi ghi cứng để lần chạy sau luôn ra đúng kết quả.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SHEET = "design/element.png";
const OUT = "public/assets";

/** Vùng của từng element trên sheet gốc. */
const REGIONS = {
  sprig: { left: 1322, top: 789, width: 886, height: 891 },
  calla: { left: 154, top: 1278, width: 728, height: 806 },
  ticket: { left: 948, top: 1584, width: 1284, height: 848 },
  blossoms: { left: 2824, top: 1688, width: 1002, height: 1857 },
  envelope: { left: 1240, top: 2224, width: 1532, height: 1291 },
  peony: { left: 156, top: 2296, width: 964, height: 1246 },
  news: { left: 828, top: 3728, width: 463, height: 1195 },
};

const webp = { quality: 92, effort: 5 };

/** Cắt một vùng khỏi sheet, trả về buffer PNG còn nguyên alpha. */
function region(name) {
  return sharp(SHEET).extract(REGIONS[name]).ensureAlpha();
}

/** Cắt sát mép theo alpha thật (sau khi đã xoá/che bớt pixel). */
async function trimAlpha(buf) {
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  let x0 = w,
    y0 = h,
    x1 = -1,
    y1 = -1;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * c + 3] <= 8) continue;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
  return sharp(buf)
    .extract({ left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 })
    .png()
    .toBuffer();
}

/**
 * Chỉ giữ những mảng alpha liên thông đủ lớn (>= ratio so với mảng lớn nhất).
 * Các element trên sheet nằm sát nhau nên hộp cắt của cái này thường liếm
 * phải một góc của cái kia — bỏ hết mọi mảng nhỏ là sạch.
 */
async function largestComponent(buf, ratio = 0.12) {
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  const n = w * h;
  const label = new Int32Array(n).fill(-1);
  const sizes = [];
  const stack = [];
  for (let s = 0; s < n; s++) {
    if (label[s] !== -1 || data[s * c + 3] <= 8) continue;
    const id = sizes.length;
    let count = 0;
    stack.length = 0;
    stack.push(s);
    label[s] = id;
    while (stack.length) {
      const p = stack.pop();
      count++;
      const x = p % w;
      const y = (p / w) | 0;
      const push = (q) => {
        if (label[q] === -1 && data[q * c + 3] > 8) {
          label[q] = id;
          stack.push(q);
        }
      };
      if (x > 0) push(p - 1);
      if (x < w - 1) push(p + 1);
      if (y > 0) push(p - w);
      if (y < h - 1) push(p + w);
    }
    sizes.push(count);
  }
  const biggest = Math.max(...sizes);
  const keep = sizes.map((s) => s >= biggest * ratio);
  for (let p = 0; p < n; p++) if (label[p] >= 0 && !keep[label[p]]) data[p * c + 3] = 0;
  return sharp(data, { raw: { width: w, height: h, channels: c } })
    .png()
    .toBuffer();
}

async function save(buf, name) {
  const info = await sharp(buf).webp(webp).toFile(`${OUT}/${name}.webp`);
  console.log(`${name}.webp  ${info.width}x${info.height}`);
  return info;
}

/* ── 1. Envelope: tách thành lớp sau (cả phong bì) và lớp trước (túi trước) ──
   Nắp phong bì mở lên trên, hai vạt bên gập xuống gặp nhau ở đáy chữ V.
   Nội dung được kẹp giữa hai lớp nên trông như thật sự nằm trong phong bì. */
async function envelope() {
  const { width: W, height: H } = REGIONS.envelope;
  const raw = await region("envelope").png().toBuffer();

  // Góc trên trái dính một mẩu đen của tấm vé — xoá theo độ sáng.
  const px = await sharp(raw).raw().toBuffer({ resolveWithObject: true });
  const { data, info } = px;
  const c = info.channels;
  for (let y = 0; y < Math.round(H * 0.12); y++)
    for (let x = 0; x < Math.round(W * 0.45); x++) {
      const i = (y * info.width + x) * c;
      const lum = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
      if (lum < 150) data[i + 3] = 0;
    }
  const clean = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: c },
  })
    .png()
    .toBuffer();

  // KHÔNG cắt sát mép hai lớp này: chúng phải nằm chồng khít lên nhau khi
  // hiển thị, nên cùng giữ nguyên khung 1532x1291 để một cặp left/top/width
  // duy nhất đặt đúng cả hai.
  await save(clean, "tv-envelope-back");

  // Đa giác túi trước: mép trên hai bên -> đáy chữ V -> hết đáy phong bì.
  // Toạ độ đo trên bản xem 640px rồi quy về tỉ lệ.
  const p = (fx, fy) => `${(fx * W).toFixed(0)},${(fy * H).toFixed(0)}`;
  const poly = [
    p(0.0, 0.3117), // mép trái, ngang chỗ nắp gập
    p(0.4375, 0.5975), // đáy chữ V bên trái
    p(0.5625, 0.5975), // đáy chữ V bên phải
    p(1.0, 0.3117), // mép phải
    p(1.0, 1.0),
    p(0.0, 1.0),
  ].join(" ");
  const mask = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">` +
      `<polygon points="${poly}" fill="#fff"/></svg>`,
  );
  const front = await sharp(clean)
    .composite([{ input: mask, blend: "dest-in" }])
    .png()
    .toBuffer();
  await save(front, "tv-envelope-front");
}

/* ── 2. Bó hoa trắng: mẩu báo cũ nằm đè lên nên phải tách bằng màu ────────
   Giấy báo là tông nâu ấm (r ≫ b), hoa thì trắng/kem hoặc xanh lá. */
async function blossoms() {
  const raw = await region("blossoms").png().toBuffer();
  const { data, info } = await sharp(raw)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: c } = info;
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * c;
      if (data[i + 3] === 0) continue;
      // Mẩu báo chỉ nằm ở góc trên phải; ngoài vùng đó không xét màu để hoa
      // kem không bị ăn nhầm.
      // Góc trên trái còn dính một mẩu khung oval, nằm cao hơn bông cao nhất.
      if (y < h * 0.19 && x < w * 0.32) {
        data[i + 3] = 0;
        continue;
      }
      if (x < w * 0.45 || y > h * 0.68) continue;
      const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
      if (r - b > 45 && r < 232 && r > g && g > b) data[i + 3] = 0;
    }
  const cut = await sharp(data, {
    raw: { width: w, height: h, channels: c },
  })
    .png()
    .toBuffer();
  await save(await trimAlpha(await largestComponent(cut)), "tv-blossoms");
}

/* ── 3. Tấm vé: xoay ngược 11° cho nằm ngang ─────────────────────────────
   Trên sheet tấm vé đã nghiêng sẵn. Giữ nguyên độ nghiêng đó thì mọi dòng
   chữ đặt lên vé cũng phải nghiêng theo — dựng thẳng ở đây rồi để CSS xoay
   cả cụm (vé + chữ) là gọn hơn nhiều. */
async function ticket() {
  const straight = await region("ticket")
    .rotate(11, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  await save(await trimAlpha(await largestComponent(straight)), "tv-ticket");
}

async function main() {
  await mkdir(OUT, { recursive: true });
  await envelope();
  await blossoms();
  await ticket();
  for (const [name, file] of [
    ["sprig", "tv-sprig"],
    ["calla", "tv-calla"],
    ["peony", "tv-peony"],
    ["news", "tv-news"],
  ]) {
    const cut = await largestComponent(await region(name).png().toBuffer());
    await save(await trimAlpha(cut), file);
  }

  // Hai tấm biển chạm nổi — mỗi tiệc một kiểu, chữ được viết đè lên bằng CSS.
  for (const [file, name] of [
    ["design/70.png", "tv-plaque-intimate"],
    ["design/71.png", "tv-plaque-main"],
  ]) {
    const cut = await trimAlpha(
      await largestComponent(await sharp(file).ensureAlpha().png().toBuffer()),
    );
    await save(await sharp(cut).resize({ width: 1100 }).png().toBuffer(), name);
  }

  // Dấu xi niêm phong — ảnh rời do khách gửi, chỉ cần cắt sát mép + nén.
  const seal = await trimAlpha(
    await sharp("design/wax seal.png").ensureAlpha().png().toBuffer(),
  );
  await save(await sharp(seal).resize({ width: 900 }).png().toBuffer(), "tv-seal");

  // Lá thư ghi địa điểm — tờ giấy 9 xoay ngang.
  const letter = await sharp("public/assets/9.webp")
    .rotate(90)
    .png()
    .toBuffer();
  await save(letter, "tv-letter");
}

main();
