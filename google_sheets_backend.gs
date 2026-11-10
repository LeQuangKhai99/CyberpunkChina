/**
 * ============================================================================
 * PINYIN POP! - GOOGLE SHEETS FREE DATABASE BACKEND (GOOGLE APPS SCRIPT)
 * Giải pháp thay thế Supabase 100% MIỄN PHÍ VĨNH VIỄN trên Google Drive cá nhân
 * (Hỗ trợ cả Apps Script tạo từ Google Sheets lẫn tạo trực tiếp tại script.google.com)
 * ============================================================================
 * CÁCH LẤY ĐƯỜNG LINK WEB APP (/exec) ĐỂ DÁN VÀO WEB:
 * 1. Dán toàn bộ code này vào trang soạn thảo Apps Script và bấm Lưu (💾 Ctrl+S)
 * 2. Ở góc trên bên phải, bấm nút màu xanh "Deploy" (Triển khai) -> "New deployment" (Tạo triển khai mới)
 * 3. Bấm biểu tượng bánh răng ⚙️ cạnh chữ "Select type" -> Chọn "Web app" (Ứng dụng web)
 * 4. Thiết lập 2 mục quan trọng:
 *    - Execute as (Thực thi dưới dạng): Chọn "Me" (Tôi / email của bạn)
 *    - Who has access (Ai có quyền truy cập): BẮT BUỘC chọn "Anyone" (Bất kỳ ai)
 * 5. Bấm "Deploy" (Triển khai) -> Cấp quyền (Authorize access -> Advanced -> Go to project)
 * 6. Copy đường link "Web app URL" có dạng:
 *    https://script.google.com/macros/s/AKfycbx.../exec
 *    (Lưu ý: Link phải có đuôi "/exec", KHÔNG phải link "/edit" trên thanh địa chỉ trình duyệt)
 * ============================================================================
 */

function getOrCreateSpreadsheet() {
  // 1. Nếu tạo từ bên trong Google Sheets (Extensions -> Apps Script)
  let ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}
  if (ss) return ss;

  // 2. Nếu tạo trực tiếp tại script.google.com (Standalone Project):
  // Tự động tạo 1 file Google Sheet tên là "PinyinPop_Database" trong Google Drive của bạn!
  const props = PropertiesService.getScriptProperties();
  const savedId = props.getProperty('PINYIN_POP_SHEET_ID');
  if (savedId) {
    try {
      ss = SpreadsheetApp.openById(savedId);
      if (ss) return ss;
    } catch (e) {}
  }

  ss = SpreadsheetApp.create('PinyinPop_Database');
  props.setProperty('PINYIN_POP_SHEET_ID', ss.getId());
  return ss;
}

function ensureSheets() {
  const ss = getOrCreateSpreadsheet();
  let profilesSheet = ss.getSheetByName('profiles');
  if (!profilesSheet) {
    profilesSheet = ss.insertSheet('profiles');
    profilesSheet.appendRow(['id', 'email', 'display_name', 'role', 'password_hash', 'created_at', 'updated_at']);
  }
  let progressSheet = ss.getSheetByName('user_progress');
  if (!progressSheet) {
    progressSheet = ss.insertSheet('user_progress');
    progressSheet.appendRow(['user_id', 'json_payload', 'updated_at']);
  }
  return { ss, profilesSheet, progressSheet };
}

function doGet(e) {
  try {
    const { ss, profilesSheet, progressSheet } = ensureSheets();
    const action = (e && e.parameter && e.parameter.action) || 'ping';

    if (action === 'all') {
      const profiles = readProfiles(profilesSheet);
      const progress = readAllProgress(progressSheet);
      return jsonResponse({ ok: true, sheetUrl: ss.getUrl(), profiles, progress });
    }

    if (action === 'progress' && e.parameter.user_id) {
      const allProg = readAllProgress(progressSheet);
      const found = allProg.find(p => p.user_id === e.parameter.user_id) || null;
      return jsonResponse({ ok: true, data: found });
    }

    return jsonResponse({
      ok: true,
      status: 'Pinyin Pop Google Sheets DB Online',
      sheetUrl: ss.getUrl()
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function doPost(e) {
  try {
    const { profilesSheet, progressSheet } = ensureSheets();
    const body = JSON.parse(e.postData.contents || '{}');
    const action = body.action;

    if (action === 'upsert_profile') {
      const p = body.profile;
      upsertRow(profilesSheet, 0, p.id, [
        p.id,
        p.email || '',
        p.display_name || '',
        p.role || 'user',
        p.password_hash || '',
        p.created_at || new Date().toISOString(),
        new Date().toISOString()
      ]);
      return jsonResponse({ ok: true });
    }

    if (action === 'upsert_progress') {
      const prog = body.progress;
      upsertRow(progressSheet, 0, prog.user_id, [
        prog.user_id,
        JSON.stringify(prog),
        new Date().toISOString()
      ]);
      return jsonResponse({ ok: true });
    }

    return jsonResponse({ ok: false, error: 'Unknown action: ' + action });
  } catch (err) {
    return jsonResponse({ ok: false, error: err.toString() });
  }
}

function readProfiles(sheet) {
  const rows = sheet.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    out.push({
      id: String(rows[i][0]),
      email: String(rows[i][1] || ''),
      display_name: String(rows[i][2] || ''),
      role: String(rows[i][3] || 'user'),
      password_hash: String(rows[i][4] || ''),
      created_at: String(rows[i][5] || ''),
      updated_at: String(rows[i][6] || '')
    });
  }
  return out;
}

function readAllProgress(sheet) {
  const rows = sheet.getDataRange().getValues();
  const out = [];
  for (let i = 1; i < rows.length; i++) {
    if (!rows[i][0]) continue;
    try {
      const parsed = JSON.parse(rows[i][1] || '{}');
      parsed.user_id = String(rows[i][0]);
      parsed.updated_at = String(rows[i][2] || parsed.updated_at || '');
      out.push(parsed);
    } catch (e) {}
  }
  return out;
}

function upsertRow(sheet, keyColIndex, keyValue, rowValues) {
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (String(data[i][keyColIndex]) === String(keyValue)) {
      sheet.getRange(i + 1, 1, 1, rowValues.length).setValues([rowValues]);
      return;
    }
  }
  sheet.appendRow(rowValues);
}

function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
