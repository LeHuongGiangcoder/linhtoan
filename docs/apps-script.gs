/**
 * Khánh Toàn & Khánh Linh — danh sách khách + RSVP, một tab duy nhất.
 *
 * Sheet vừa là nguồn danh sách khách (website đọc lên), vừa là nơi RSVP đổ về
 * (website ghi xuống). Cô dâu chú rể chỉ gõ một cột: Name. Script tự điền
 * No / Slug / Link.
 *
 * Cột của tab RSVP (tra theo TÊN ở hàng 1, không theo vị trí):
 *   No · Name · Slug · Link · Attending · Guests · Other · Meal Preferences ·
 *   Message · Updated
 *
 * Cài đặt: xem docs/RSVP_SETUP.md.
 */

/** Phải khớp CHÍNH XÁC tên tab dưới đáy spreadsheet, kể cả khoảng trắng. */
const SHEET_NAME = 'RSVP';

/**
 * Đổi thành một chuỗi ngẫu nhiên thật dài. Đây là thứ duy nhất canh cửa Web App
 * (Web App phải để "Anyone" mới gọi vào được), nên đừng commit giá trị thật lên
 * git — chỉ dán vào Apps Script và vào biến môi trường RSVP_SHARED_SECRET.
 */
const SECRET = 'CHANGE-ME-to-a-long-random-string';

/** Domain thật của thiệp — chỉ dùng để dựng cột Link. */
const SITE_ORIGIN = 'https://khanhlinhtoanpham.gloweb.site';

/**
 * Đoạn đường dẫn của buổi tiệc trong link riêng: SITE_ORIGIN/main/<slug>.
 * Phải khớp `partyFromPath` trong src/lib/guests.ts.
 *
 * ĐỔI SAU KHI ĐÃ GỬI LINK CHO KHÁCH LÀ HỎNG HẾT LINK CŨ.
 */
const EVENT_KEY = 'main';

const HEADERS = [
  'No', 'Name', 'Slug', 'Link',
  'Attending', 'Guests', 'Other', 'Meal Preferences', 'Message', 'Updated',
];

const FIRST_ROW = 2; // hàng 1 là header

/* ------------------------------------------------------------------ menu */

function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Wedding')
    .addItem('Tạo link cho khách mới', 'generateLinks')
    .addItem('Dựng lại sheet (chạy 1 lần)', 'setupSheet')
    .addItem('Kiểm tra dữ liệu gửi cho website', 'checkData')
    .addToUi();
}

/** Chạy tay khi vừa thêm khách và muốn thấy link ngay. */
function generateLinks() {
  const sheet = sheet_();
  const n = syncGuests_(sheet, columns_(sheet));
  SpreadsheetApp.getActiveSpreadsheet().toast(n + ' khách đã có link.', 'Wedding');
}

/** Chạy 1 lần lúc mới dựng: header, định dạng, độ rộng cột. */
function setupSheet() {
  const sheet = sheet_();
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setValues([HEADERS])
    .setFontWeight('bold');
  sheet.setFrozenRows(1);

  const col = columns_(sheet);
  const rows = sheet.getMaxRows() - 1;

  // Cột No là mã khách, phải là text — để dạng số thì 001 rút thành 1.
  sheet.getRange(FIRST_ROW, col.no, rows, 1).setNumberFormat('@');
  sheet.setColumnWidth(col.name, 220);
  sheet.setColumnWidth(col.link, 340);
  sheet.setColumnWidth(col['meal preferences'], 200);
  sheet.setColumnWidth(col.message, 320);

  SpreadsheetApp.getActiveSpreadsheet().toast('Sheet đã sẵn sàng.', 'Wedding');
}

/**
 * Hiện đúng thứ website sẽ nhận được — không đoán nữa.
 *
 * Chạy từ menu nên dùng code MỚI NHẤT ĐÃ SAVE, còn website thì dùng bản đã
 * Deploy. Nếu bảng này đúng mà thiệp vẫn sai, lỗi nằm ở chỗ deployment chưa
 * lên version mới, không phải ở dữ liệu trong sheet.
 */
function checkData() {
  const sheet = sheet_();
  const col = columns_(sheet);
  syncGuests_(sheet, col);
  const guests = readGuests_(sheet, col);

  const replied = guests.filter(function (g) { return g.attending !== null; });
  const coming = replied.filter(function (g) { return g.attending; });
  const seats = coming.reduce(function (sum, g) { return sum + g.guestCount; }, 0);

  const lines = guests.slice(0, 12).map(function (g) {
    const state = g.attending === null ? '—' : (g.attending ? 'YES ' + g.guestCount : 'NO');
    return g.code + '  ' + g.slug + '   ' + g.name + '   [' + state + ']';
  });

  const message =
    guests.length + ' khách · ' + replied.length + ' đã trả lời · ' +
    coming.length + ' đến (' + seats + ' người)\n\n' +
    'mã  slug  tên  [trả lời]\n' + lines.join('\n') +
    (guests.length > 12 ? '\n… còn ' + (guests.length - 12) + ' dòng' : '');

  SpreadsheetApp.getUi().alert('Dữ liệu gửi cho website', message,
    SpreadsheetApp.getUi().ButtonSet.OK);
}

/* -------------------------------------------------------------- endpoint */

/**
 * Một endpoint cho cả hai chiều:
 *   { secret, action: 'guests' }      → trả danh sách khách cho website
 *   { secret, slug, attending, … }    → ghi RSVP vào đúng hàng của khách đó
 */
function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000); // xếp hàng các phản hồi đồng thời

  try {
    const body = JSON.parse(e.postData.contents);

    if (body.secret !== SECRET) {
      return json({ ok: false, error: 'unauthorized' });
    }

    const sheet = sheet_();
    const col = columns_(sheet);
    // Khách mới gõ tay vào sheet chưa có slug — bù trước khi đọc hoặc ghi,
    // để cô dâu chú rể không phải nhớ bấm menu.
    syncGuests_(sheet, col);

    if (body.action === 'guests') {
      return json({ ok: true, guests: readGuests_(sheet, col) });
    }

    return json(writeRsvp_(sheet, col, body));
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/* ---------------------------------------------------------------- helpers */

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setValues([HEADERS])
      .setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Vị trí từng cột, tra theo TÊN ở hàng 1 chứ không theo thứ tự cố định.
 *
 * Nghĩa là kéo cột đi chỗ khác hay chèn thêm cột vào giữa, script vẫn chạy
 * đúng — miễn chữ ở hàng 1 giữ nguyên. Cột nào chưa tồn tại thì được tạo thêm
 * vào cuối, kèm chữ header, nên sheet cũ tự nâng cấp mà không mất dữ liệu.
 */
function columns_(sheet) {
  const width = Math.max(sheet.getLastColumn(), 1);
  const header = sheet.getRange(1, 1, 1, width).getValues()[0]
    .map(function (h) { return String(h).trim().toLowerCase(); });

  const col = {};
  let next = header.length + 1;

  HEADERS.forEach(function (name) {
    const at = header.indexOf(name.toLowerCase());
    if (at !== -1) {
      col[name.toLowerCase()] = at + 1;
    } else {
      sheet.getRange(1, next).setValue(name).setFontWeight('bold');
      col[name.toLowerCase()] = next;
      next++;
    }
  });
  return col;
}

/**
 * Số hàng dữ liệu hiện có (không tính header), đo theo CỘT NAME.
 *
 * Không dùng getLastRow() được: một ARRAYFORMULA ở cột nào đó đổ xuống hết cột,
 * và những ô nó trả về "" vẫn bị Apps Script tính là ô có nội dung —
 * getLastRow() sẽ nhảy xuống tận hàng 1000 và hàng RSVP mới bị nối vào đó, để
 * lại một khoảng trống khổng lồ giữa bảng. Cột Name do người gõ tay, nên nó
 * mới là mốc thật của danh sách.
 */
function dataRows_(sheet, col) {
  const last = sheet.getLastRow() - 1;
  if (last <= 0) return 0;

  const names = sheet.getRange(FIRST_ROW, col.name, last, 1).getValues();
  for (let i = names.length - 1; i >= 0; i--) {
    if (String(names[i][0]).trim()) return i + 1;
  }
  return 0;
}

/**
 * Điền No / Slug / Link cho mọi hàng đã có tên.
 *
 * Slug đã tồn tại thì KHÔNG bao giờ đổi — link đã gửi cho khách phải sống mãi,
 * kể cả khi sau này sửa lại chính tả cái tên.
 */
function syncGuests_(sheet, col) {
  const rows = dataRows_(sheet, col);
  if (rows === 0) return 0;

  const width = sheet.getLastColumn();
  const values = sheet.getRange(FIRST_ROW, 1, rows, width).getValues();

  const taken = {};
  values.forEach(function (row) {
    const slug = String(row[col.slug - 1]).trim();
    if (slug) taken[slug] = true;
  });

  // Ghi lại TỪNG CỘT một, không ghi cả hàng: những cột cô dâu chú rể để công
  // thức nằm xen giữa các cột script này quản, mà setValues() cả hàng sẽ đè
  // công thức bằng giá trị đọc được lúc đó.
  const nos = [];
  const slugs = [];
  const links = [];
  let noChanged = false;
  let slugChanged = false;
  let linkChanged = false;
  let counted = 0;

  values.forEach(function (row) {
    const name = String(row[col.name - 1]).trim();
    const currentNo = row[col.no - 1];
    const currentSlug = String(row[col.slug - 1]).trim();
    const currentLink = row[col.link - 1];

    if (!name) {
      // Hàng trống ở giữa danh sách — giữ nguyên, không đụng vào.
      nos.push([currentNo]);
      slugs.push([currentSlug]);
      links.push([currentLink]);
      return;
    }

    counted++;

    // Ba chữ số, lưu dạng text: 7 và 007 phải luôn là một.
    const no = code_(counted);
    if (String(currentNo).trim() !== no) noChanged = true;
    nos.push([no]);

    let slug = currentSlug;
    if (!slug) {
      slug = uniqueSlug_(slugify_(name), taken);
      taken[slug] = true;
      slugChanged = true;
    }
    slugs.push([slug]);

    // Link riêng = gốc site + /main/ + slug của khách.
    // Dấu / thừa ở cuối SITE_ORIGIN sinh ra link //… — vẫn tới nơi, nhưng qua
    // một cú redirect 308 mà trình duyệt trong app không phải lúc nào cũng theo.
    const link = SITE_ORIGIN.replace(/\/+$/, '') + '/' + EVENT_KEY + '/' + slug;
    if (currentLink !== link) linkChanged = true;
    links.push([link]);
  });

  if (noChanged) {
    sheet.getRange(FIRST_ROW, col.no, rows, 1)
      .setNumberFormat('@') // không có dòng này thì Sheets lưu 001 thành số 1
      .setValues(nos);
  }
  if (slugChanged) sheet.getRange(FIRST_ROW, col.slug, rows, 1).setValues(slugs);
  if (linkChanged) sheet.getRange(FIRST_ROW, col.link, rows, 1).setValues(links);

  return counted;
}

/** 7 → "007". */
function code_(n) {
  let out = String(n == null ? '' : n).trim();
  if (!out) return '';
  while (out.length < 3) out = '0' + out;
  return out;
}

/** Hai người trùng tên vẫn phải có hai link khác nhau. */
function uniqueSlug_(base, taken) {
  if (!base) base = 'guest';
  if (!taken[base]) return base;
  let n = 2;
  while (taken[base + '-' + n]) n++;
  return base + '-' + n;
}

/** "Ms. Trần Thị Bảo Ngọc" → "ms-tran-thi-bao-ngoc" */
function slugify_(value) {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // bỏ dấu thanh
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function readGuests_(sheet, col) {
  const rows = dataRows_(sheet, col);
  if (rows === 0) return [];

  return sheet.getRange(FIRST_ROW, 1, rows, sheet.getLastColumn())
    .getValues()
    .map(function (row) {
      const attending = String(row[col.attending - 1]).trim().toUpperCase();
      const guestCount = parseInt(row[col.guests - 1], 10);
      return {
        slug: String(row[col.slug - 1]).trim(),
        name: String(row[col.name - 1]).trim(),
        code: code_(String(row[col.no - 1]).trim().replace(/\D/g, '')),
        // Website đọc trường này để kiểm tra buổi tiệc trong link riêng.
        event: EVENT_KEY,
        // Phản hồi đã ghi trước đó, để khách quay lại thấy đúng trạng thái của
        // mình chứ không phải form trắng.
        attending: attending === 'YES' ? true : (attending === 'NO' ? false : null),
        guestCount: guestCount > 0 ? guestCount : 0,
        other: String(row[col.other - 1]).trim(),
        meal: String(row[col['meal preferences'] - 1]).trim(),
        message: String(row[col.message - 1]).trim(),
      };
    })
    .filter(function (g) { return g.slug && g.name; });
}

/**
 * Ghi phản hồi vào đúng hàng của khách. Đổi ý thì ghi đè, không sinh hàng mới.
 * Khách vào thẳng trang chủ (không qua link riêng) thì nối thêm một hàng mới.
 */
function writeRsvp_(sheet, col, body) {
  const slug = String(body.slug || '').trim();
  const answer = {};
  answer[col.attending] = body.attending ? 'YES' : 'NO';
  answer[col.guests] = body.attending ? (body.guestCount || 1) : 0;
  answer[col.other] = body.other || '';
  answer[col['meal preferences']] = body.meal || '';
  answer[col.message] = body.message || '';
  answer[col.updated] = new Date();

  const rows = dataRows_(sheet, col);
  const slugs = rows > 0
    ? sheet.getRange(FIRST_ROW, col.slug, rows, 1).getValues()
    : [];

  for (let i = 0; i < slugs.length; i++) {
    if (slug && String(slugs[i][0]).trim() === slug) {
      const at = FIRST_ROW + i;
      // Từng ô một: các cột trả lời không nhất thiết nằm cạnh nhau.
      Object.keys(answer).forEach(function (c) {
        sheet.getRange(at, Number(c)).setValue(answer[c]);
      });
      return { ok: true, row: at };
    }
  }

  // Không khớp slug nào: khách tự vào, chỉ có cái tên họ gõ.
  // Nối ngay dưới cái tên cuối cùng, không phải dưới ô cuối cùng có công thức.
  const at = FIRST_ROW + rows;
  sheet.getRange(at, col.name).setValue(body.name || '');
  Object.keys(answer).forEach(function (c) {
    sheet.getRange(at, Number(c)).setValue(answer[c]);
  });
  // Cấp luôn No / Slug / Link cho hàng vừa thêm.
  syncGuests_(sheet, col);
  return { ok: true, row: at };
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
