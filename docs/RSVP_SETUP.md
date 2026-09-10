# Google Sheet = nguồn duy nhất

Một spreadsheet, một tab `RSVP`. Cô dâu chú rể gõ **tên khách** và **sự kiện**;
script dựng link riêng cho từng người, và website ghi phản hồi RSVP ngược lại
đúng hàng của người đó.

Điểm khác so với site Đức Anh & Diễm My: đám này có **hai sự kiện**, nên cột
`Event` quyết định link riêng của khách trỏ vào sự kiện nào.

| Cột | Ai điền | Ý nghĩa |
|-----|---------|---------|
| `No` | tự sinh | số thứ tự **và là mã khách** — 3 chữ số (`001`, `002`…) |
| `Name` | **bạn gõ** | tên hiện trên thiệp — có dấu tiếng Việt thoải mái |
| `Event` | **bạn chọn** | `Tiệc thân mật` hoặc `Tiệc chính`. **Bỏ trống = `Tiệc thân mật`** |
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
SITE_ORIGIN / <đường dẫn của sự kiện> / <slug của khách>

https://khanhlinhtoanpham.gloweb.site/intimate/anh-chi-nguyen-van-a
https://khanhlinhtoanpham.gloweb.site/main/ms-tran-thi-bao-ngoc
```

- `Slug` sinh ra một lần rồi **không bao giờ tự đổi** — link đã gửi cho khách
  sống mãi, kể cả khi sau này sửa lại chính tả cái tên. Muốn tự đặt link, cứ gõ
  tay vào cột `Slug` trước.
- `Link` thì **có** đổi: sửa ô `Event` là link được dựng lại sang đường dẫn của
  sự kiện kia, slug giữ nguyên. Nhớ gửi lại link mới cho khách đó.
- Slug là duy nhất trên toàn sheet, không phải trong từng sự kiện. Nhờ vậy
  website tra khách chỉ bằng slug là đủ, và khách bấm nhầm link của sự kiện kia
  vẫn ra đúng hàng của họ.

### Đổi tên hai sự kiện

Sửa mảng `EVENTS` ở đầu [`apps-script.gs`](apps-script.gs) — nó là nguồn duy
nhất cho cả link, cả dropdown trong sheet:

```js
const EVENTS = [
  { key: 'intimate', path: 'intimate', label: 'Tiệc thân mật',
    alias: [...], sees: ['intimate', 'main'] },
  { key: 'main',     path: 'main',     label: 'Tiệc chính',
    alias: [...], sees: ['main'] },
];
```

`alias` là các cách gõ khác vẫn hiểu là sự kiện đó — ô `Event` là dropdown,
nhưng người ta vẫn dán đè hoặc gõ tay, và một ô ghi `tiec` mà lặng lẽ ra link
của tiệc thân mật là kiểu lỗi không ai phát hiện cho tới khi khách đã tới nhầm chỗ.
Giá trị lạ hoàn toàn thì rơi về sự kiện đầu tiên — dùng menu **Kiểm tra dữ
liệu** để soát trước khi gửi thiệp.

> **Chốt `path` trước khi gửi thiệp đầu tiên.** Đổi `path` sau đó là hỏng toàn
> bộ link đã gửi. `key` và `label` thì đổi lúc nào cũng được.

### Ai xem được buổi nào

| `Event` trong sheet | Link mở ra | Thiệp hiện |
|---|---|---|
| `Tiệc thân mật` | `/intimate/<slug>` | **cả hai buổi**, có nút chuyển qua lại |
| `Tiệc chính` | `/main/<slug>` | **chỉ tiệc chính**, không có nút chuyển |

Khách chỉ được mời tiệc chính thì nút chuyển tự ẩn hẳn: để nút ở đó chỉ tổ
cho họ biết còn một buổi nữa mà mình không được mời.

Quy tắc này nằm ở hai chỗ và phải khớp nhau: `sees` trong `EVENTS` của
[`apps-script.gs`](apps-script.gs), và `PARTY_ACCESS` trong
`src/lib/guests.ts`. Sửa một bên nhớ sửa bên kia.


---

## 1. Tạo sheet và dán script

1. Mở spreadsheet `Khanh Linh & Pham Toan _ RSVP`, đảm bảo tab tên đúng là `RSVP`.
2. **Extensions → Apps Script**, xoá `myFunction` mẫu.
3. Dán toàn bộ nội dung [`docs/apps-script.gs`](apps-script.gs).
4. Sửa các hằng số ở đầu file:
   - `SECRET` — chuỗi ngẫu nhiên thật dài. Giữ lại, bước 3 cần đến.
   - `SITE_ORIGIN` — domain thật của site, dùng để dựng cột `Link`.
   - `SHEET_NAME` — tên tab, phải khớp chính xác tên dưới đáy sheet.
   - `EVENTS` — hai sự kiện, xem phần trên.
5. Lưu, chọn hàm `setupSheet` rồi bấm **Run** một lần (cấp quyền khi Google hỏi).
   Header, định dạng và dropdown `Event` được tạo xong.

## 2. Deploy Web App

1. **Deploy → New deployment → ⚙️ → Web app**.
2. *Execute as*: **Me**.
3. *Who has access*: **Anyone**.
   (Bắt buộc — server của website gọi vào ẩn danh. `SECRET` mới là thứ canh cửa.)
4. **Deploy**, cấp quyền, copy **Web app URL**.

> Mỗi lần sửa script phải **Deploy → Manage deployments → ✏️ → New version**,
> không thì code cũ vẫn chạy. Nếu sheet ghi `Tiệc chính` mà link vẫn ra tiệc thân mật,
> lỗi gần như chắc chắn nằm ở đây.

## 3. Trỏ website vào đó

`.env.local` cho máy local, và đúng hai biến này trong Vercel
(**Settings → Environment Variables**) cho production:

```bash
RSVP_WEBHOOK_URL="https://script.google.com/macros/s/AKfy…/exec"
RSVP_SHARED_SECRET="đúng chuỗi SECRET ở bước 1"
```

## 4. Menu Wedding trong sheet

| Mục | Làm gì |
|-----|--------|
| Tạo link cho khách mới | điền `No` / `Slug` / `Link` cho mọi hàng đã có tên |
| Dựng lại sheet | chạy 1 lần lúc mới dựng: header, định dạng, dropdown |
| Kiểm tra dữ liệu gửi cho website | hiện đúng thứ website nhận được, kèm số khách mỗi sự kiện |

## 5. Hai chiều của endpoint

```jsonc
// website đọc danh sách khách
{ "secret": "…", "action": "guests" }
// → { ok: true, events: [...], guests: [{ slug, name, code, event, eventPath, … }] }

// website ghi phản hồi
{ "secret": "…", "slug": "anh-chi-nguyen-van-a", "attending": true,
  "guestCount": 2, "other": "", "meal": "Chay", "message": "Chúc mừng!" }
// → { ok: true, row: 4 }
```

Ghi RSVP **không đụng vào ô `Event`** — sự kiện là do nhà trai nhà gái quyết,
không phải do khách chọn trong form. Khách vào thẳng trang RSVP không qua link
riêng thì được nối thành hàng mới, và `body.event` (nếu có) quyết định ô `Event`
của hàng đó.
