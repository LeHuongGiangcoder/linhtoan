/**
 * Dựng ảnh xem trước khi chia sẻ lên mạng xã hội → public/og.jpg (1200x630).
 *
 * Ghép từ chính asset của thiệp chứ không chụp màn hình: chữ ký tên cô dâu
 * chú rể đã là ảnh sẵn (cắt từ bộ typography), nên không cần nạp font vào
 * trình dựng ảnh — thứ hay hỏng nhất khi sinh ảnh OG.
 *
 * Chạy lại khi đổi tên hoặc đổi nền:
 *   npm i --no-save sharp && node scripts/build-og-image.mjs
 */
import sharp from "sharp";

const W = 1200;
const H = 630;
const OUT = "public/og.jpg";

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
  const groom = await layer("public/assets/couple-groom.webp", 534);
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

  // Xếp dọc quanh tâm: bồ câu · tên cô dâu · hoa văn · tên chú rể
  const gapAfterDoves = 12;
  const gapAroundDivider = 18;
  const stack =
    doves.height +
    gapAfterDoves +
    bride.height +
    gapAroundDivider +
    divider.height +
    gapAroundDivider +
    groom.height;

  // Nhích lên một chút: dải hoa ở chân ảnh chiếm phần dưới.
  let y = Math.round((H - stack) / 2) - 62;
  const centre = (l) => Math.round((W - l.width) / 2);

  const composite = [];
  const put = (l, gap = 0) => {
    composite.push({ input: l.buf, left: centre(l), top: y });
    y += l.height + gap;
  };

  put(doves, gapAfterDoves);
  put(bride, gapAroundDivider);
  put(divider, gapAroundDivider);
  put(groom);

  // Dải bụi hoa trắng khép chân ảnh, thò ra ngoài hai mép cho khỏi hụt.
  composite.push({
    input: hem.buf,
    left: Math.round((W - hem.width) / 2),
    // Chỉ ló phần ngọn hoa lên khoảng 130px dưới đáy ảnh
    top: H - 130,
  });

  const info = await sharp(bg)
    .composite(composite)
    .jpeg({ quality: 86, chromaSubsampling: "4:4:4" })
    .toFile(OUT);

  console.log(`${OUT}  ${info.width}x${info.height}  ${(info.size / 1024) | 0}KB`);
};

main();
