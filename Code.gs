/**
 * 接收前端利用 fetch 發送過來的 POST 請求並寫入試算表
 * 完全避開過度工程與 GCP 複雜驗證
 */
function doPost(e) {
  try {
    // 自動獲取目前這份 Google 試算表中被啟用的第一個工作表
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // 解析前端透過 text/plain 傳過來的 JSON 字串物件
    var data = JSON.parse(e.postData.contents);
    
    // 自動在雲端生成當前寫入的精準時間戳記
    var timestamp = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
    
    // 動態附加到試算表的最新一列：[時間戳記, 食物名稱, 圖標名稱, API語錄]
    sheet.appendRow([
      timestamp, 
      data.name, 
      data.icon, 
      data.quote
    ]);
    
    // 回傳符合 CORS 安全規範的 JSON 回應，確保前端 fetch 能順利接收到 success 訊號
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    // 萬一發生異常，回傳錯誤訊息，方便通訊除錯
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
