/**
 * Dựng ảnh xem trước khi chia sẻ lên mạng xã hội → public/og.<mã băm>.jpg
 * (1200x630), rồi tự sửa đường dẫn trong src/app/layout.tsx.
 *
 * Tên file kèm mã băm nội dung: Facebook / Zalo lưu đệm ảnh xem trước theo
 * đường dẫn rất lâu, giữ nguyên tên `og.jpg` thì đổi ảnh xong vẫn hiện ảnh cũ.
 *
 * Ghép từ chính asset của thiệp chứ không chụp màn hình: chữ ký tên cô dâu
 * chú rể đã là ảnh sẵn (cắt từ bộ typography), nên không cần nạp font vào
 * trình dựng ảnh — thứ hay hỏng nhất khi sinh ảnh OG.
 *
 * Chạy lại khi đổi tên hoặc đổi nền:
 *   npm i --no-save sharp && node scripts/build-og-image.mjs
 */
import { createHash } from "node:crypto";
import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import sharp from "sharp";

const W = 1200;
const H = 630;
const OUT_DIR = "public";
const LAYOUT = "src/app/layout.tsx";

/** Đưa một asset về đúng bề rộng mong muốn, giữ nguyên tỉ lệ. */
async function layer(src, width) {
  const buf = await sharp(src).resize({ width: Math.round(width) }).png().toBuffer();
  const { height } = await sharp(buf).metadata();
  return { buf, width: Math.round(width), height };
}

const main = async () => {
  // Nền giấy: cắt "cover" từ ảnh nền gốc của site.
  const bg = await sharp("public/assets/background.webp")
    .resize(W, H, { fit: "cover", position: "centre" })
    .toBuffer();

  const bride = await layer("public/assets/couple-bride.webp", 560);
  const groom = await layer("public/assets/couple-groom.79a90bad.webp", 561);
  const doves = await layer("public/assets/19.webp", 200);
  const divider = await layer("public/assets/divider.webp", 260);
  // Dải bụi hoa phóng to hơn khổ ảnh rồi cắt lấy phần giữa: hai đầu dải được
  // vuốt trong suốt, để nguyên là hụt mất một mảng ở hai mép ảnh.
  const hemWide = await layer("public/assets/el-54-strip.webp", W * 1.2);
  const hem = {
    buf: await sharp(hemWide.buf)
      .extract({
        left: Math.round((hemWide.width - W) / 2),
        top: 0,
        width: W,
        height: hemWide.height,
      })
      .png()
      .toBuffer(),
    width: W,
    height: hemWide.height,
  };

  // Xếp dọc quanh tâm: bồ câu · tên chú rể · hoa văn · tên cô dâu
  const gapAfterDoves = 12;
  const gapAroundDivider = 18;
  const stack =
    doves.height +
    gapAfterDoves +
    groom.height +
    gapAroundDivider +
    divider.height +
    gapAroundDivider +
    bride.height;

  // Nhích lên một chút: dải hoa ở chân ảnh chiếm phần dưới.
  let y = Math.round((H - stack) / 2) - 62;
  const centre = (l) => Math.round((W - l.width) / 2);

  const composite = [];
  const put = (l, gap = 0) => {
    composite.push({ input: l.buf, left: centre(l), top: y });
    y += l.height + gap;
  };

  put(doves, gapAfterDoves);
  put(groom, gapAroundDivider);
  put(divider, gapAroundDivider);
  put(bride);

  // Dải bụi hoa trắng khép chân ảnh, thò ra ngoài hai mép cho khỏi hụt.
  composite.push({
    input: hem.buf,
    left: Math.round((W - hem.width) / 2),
    // Chỉ ló phần ngọn hoa lên khoảng 130px dưới đáy ảnh
    top: H - 130,
  });

  const { data, info } = await sharp(bg)
    .composite(composite)
    .jpeg({ quality: 86, chromaSubsampling: "4:4:4" })
    .toBuffer({ resolveWithObject: true });

  const file = `og.${createHash("sha256").update(data).digest("hex").slice(0, 8)}.jpg`;
  for (const old of await readdir(OUT_DIR)) {
    if (/^og(\.[0-9a-f]{8})?\.jpg$/.test(old) && old !== file) await unlink(`${OUT_DIR}/${old}`);
  }
  await writeFile(`${OUT_DIR}/${file}`, data);

  const layout = await readFile(LAYOUT, "utf8");
  const ref = /\/og(\.[0-9a-f]{8})?\.jpg/g;
  if (!ref.test(layout)) throw new Error(`${LAYOUT} không có đường dẫn /og*.jpg nào để cập nhật`);
  await writeFile(LAYOUT, layout.replace(ref, `/${file}`));

  console.log(`public/${file}  ${info.width}x${info.height}  ${(info.size / 1024) | 0}KB → ${LAYOUT}`);
};

main();
