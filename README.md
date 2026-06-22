# QuizMaker with Google Sheets

Paste MCQs → edit → quiz → scores auto-save to your Google Sheet.

## Setup Google Sheets (do this first)

1. Open Google Sheets → create a new sheet
2. Go to **Extensions → Apps Script**
3. Delete existing code, paste this:

```javascript
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Add header row if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Student Name", "Score", "Total", "Percentage", "Quiz Title", "Wrong Questions"]);
      sheet.getRange(1, 1, 1, 7).setFontWeight("bold");
    }
    
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      new Date(data.timestamp).toLocaleString("en-IN"),
      data.studentName || "Anonymous",
      data.score,
      data.total,
      data.percentage + "%",
      data.quizTitle || "Quiz",
      (data.answers || []).join(" | ")
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

4. Click **Deploy → New deployment**
5. Type: **Web app**
6. Execute as: **Me**
7. Who has access: **Anyone**
8. Click Deploy → copy the **Web app URL**

https://script.google.com/macros/s/AKfycbziVs91VVq_VfzMwqdCKpe0owHFbdJF3ow5RDa85Qy3ki1tPuofyamHELN4NCdkN2c2/exec

## Deploy on Render

1. Push this folder to GitHub
2. Go to render.com → New → Web Service
3. Connect your repo
4. Set:
   - Build command: `npm run build`
   - Start command: `npm start`
5. Under **Environment Variables**, add:
   - Key: `GOOGLE_SHEET_URL`
   - Value: (paste your Apps Script URL)
6. Deploy!

## Local development

```bash
# Terminal 1
cd server && npm install && GOOGLE_SHEET_URL=your_url node index.js

# Terminal 2
cd client && npm install && npm start
```
