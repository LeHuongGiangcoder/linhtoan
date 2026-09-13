# Google Sheet = nguồn duy nhất

Một spreadsheet, một tab `RSVP`. Cô dâu chú rể chỉ gõ **tên khách**; script
dựng link riêng cho từng người, và website ghi phản hồi RSVP ngược lại đúng
hàng của người đó.

Đám cưới chỉ có một buổi — Tiệc chính — nên sheet không có cột `Event`: mọi
link riêng đều trỏ vào `/main/<slug>`.

| Cột | Ai điền | Ý nghĩa |
|-----|---------|---------|
| `No` | tự sinh | số thứ tự **và là mã khách** — 3 chữ số (`001`, `002`…) |
| `Name` | **bạn gõ** | tên hiện trên thiệp — có dấu tiếng Việt thoải mái |
| `Slug` | tự sinh | phần đuôi URL, sinh từ tên |
| `Link` | tự sinh | link để gửi cho khách — copy thẳng từ đây |
| `Attending` | website ghi | `YES` / `NO` |
| `Guests` | website ghi | số người khách xác nhận |
| `Other` | website ghi | ghi chú thêm của khách |
| `Meal Preferences` | website ghi | yêu cầu về đồ ăn |
| `Message` | website ghi | lời chúc của khách |
| `Updated` | website ghi | lúc khách trả lời gần nhất |

Script chỉ ghi ba cột `No` / `Slug` / `Link`, mỗi cột một lần — nên **công thức
bạn để ở các cột khác không bị xoá** mỗi lần link được sinh ra.

Cột được tra theo **tên ở hàng 1**, không theo vị trí — kéo cột đi chỗ khác hay
chèn thêm cột vào giữa, script vẫn chạy đúng. Cột nào thiếu sẽ được tạo thêm
vào cuối khi script chạy lần đầu.

## Link riêng được dựng thế nào

```
SITE_ORIGIN / main / <slug của khách>

https://linhtoan.gloweb.site/main/anh-chi-nguyen-van-a
https://linhtoan.gloweb.site/main/ms-tran-thi-bao-ngoc
```

- `Slug` sinh ra một lần rồi **không bao giờ tự đổi** — link đã gửi cho khách
  sống mãi, kể cả khi sau này sửa lại chính tả cái tên. Muốn tự đặt link, cứ gõ
  tay vào cột `Slug` trước.
- Slug là duy nhất trên toàn sheet, nên website tra khách chỉ bằng slug là đủ.

> **Chốt đường dẫn `main` trước khi gửi thiệp đầu tiên.** Nó nằm ở hằng số
> `EVENT_KEY` trong [`apps-script.gs`](apps-script.gs) và phải khớp
> `partyFromPath` trong `src/lib/guests.ts` — đổi sau khi đã gửi link là hỏng
> toàn bộ link cũ.


---

## 1. Tạo sheet và dán script

1. Mở spreadsheet `Khanh Linh & Pham Toan _ RSVP`, đảm bảo tab tên đúng là `RSVP`.
2. **Extensions → Apps Script**, xoá `myFunction` mẫu.
3. Dán toàn bộ nội dung [`docs/apps-script.gs`](apps-script.gs).
4. Sửa các hằng số ở đầu file:
   - `SECRET` — chuỗi ngẫu nhiên thật dài. Giữ lại, bước 3 cần đến.
   - `SITE_ORIGIN` — domain thật của site, dùng để dựng cột `Link`.
   - `SHEET_NAME` — tên tab, phải khớp chính xác tên dưới đáy sheet.
5. Lưu, chọn hàm `setupSheet` rồi bấm **Run** một lần (cấp quyền khi Google hỏi).
   Header và định dạng được tạo xong.

## 2. Deploy Web App

1. **Deploy → New deployment → ⚙️ → Web app**.
2. *Execute as*: **Me**.
3. *Who has access*: **Anyone**.
   (Bắt buộc — server của website gọi vào ẩn danh. `SECRET` mới là thứ canh cửa.)
4. **Deploy**, cấp quyền, copy **Web app URL**.

> Mỗi lần sửa script phải **Deploy → Manage deployments → ✏️ → New version**,
> không thì code cũ vẫn chạy. Nếu sheet ghi một đằng mà link ra một nẻo, lỗi gần
> như chắc chắn nằm ở đây.

## 3. Trỏ website vào đó

`.env.local` cho máy local, và đúng hai biến này trong Vercel
(**Settings → Environment Variables**) cho production:

```bash
RSVP_WEBHOOK_URL="https://script.google.com/macros/s/AKfy…/exec"
RSVP_SHARED_SECRET="đúng chuỗi SECRET ở bước 1"
```

Form RSVP trên thiệp gửi về route `/api/rsvp` của chính site (`src/app/api/rsvp/route.ts`),
route đó mới gắn `RSVP_SHARED_SECRET` rồi chuyển sang Apps Script — trình duyệt của khách không
bao giờ thấy secret. Thiếu một trong hai biến trên thì form báo "Chưa gửi được phản hồi" thay vì
giả vờ thành công. Khách mở bằng link riêng thì phản hồi ghi đè đúng hàng của họ; mở trang chủ
thì thành hàng mới.

> Đổi biến môi trường trên Vercel xong phải **Redeploy** thì site mới đọc giá trị mới.

## 4. Menu Wedding trong sheet

| Mục | Làm gì |
|-----|--------|
| Tạo link cho khách mới | điền `No` / `Slug` / `Link` cho mọi hàng đã có tên |
| Dựng lại sheet | chạy 1 lần lúc mới dựng: header, định dạng, độ rộng cột |
| Kiểm tra dữ liệu gửi cho website | hiện đúng thứ website nhận được, kèm số khách đã trả lời / sẽ đến |

## 5. Hai chiều của endpoint

```jsonc
// website đọc danh sách khách
{ "secret": "…", "action": "guests" }
// → { ok: true, guests: [{ slug, name, code, event: "main", attending, guests, other, … }] }

// website ghi phản hồi
{ "secret": "…", "slug": "anh-chi-nguyen-van-a", "attending": true,
  "guests": "Trên 1", "other": "Nguyễn Văn B", "meal": "", "message": "Chúc mừng!" }
// → { ok: true, row: 4 }
```

Khách đổi ý thì phản hồi mới ghi đè lên đúng hàng cũ. Khách vào thẳng trang
chủ không qua link riêng thì được nối thành hàng mới, và script cấp luôn
`No` / `Slug` / `Link` cho hàng đó.
