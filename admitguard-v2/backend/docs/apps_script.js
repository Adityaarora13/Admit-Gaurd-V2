/**
 * AdmitGuard v2 - Google Sheets Webhook
 * 
 * Deployment Instructions:
 * 1. Open a Google Sheet.
 * 2. Go to Extensions > Apps Script.
 * 3. Paste this code.
 * 4. Run `setupHeaders` once to create the header row.
 * 5. Click 'Deploy' > 'New Deployment'.
 * 6. Select 'Web App'.
 * 7. Set 'Execute as' to 'Me'.
 * 8. Set 'Who has access' to 'Anyone'.
 * 9. Copy the Web App URL and set it as GOOGLE_SHEETS_WEBHOOK_URL in your .env file.
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
    if (!sheet) {
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Sheet1");
    }
    
    var data = JSON.parse(e.postData.contents);
    
    // Define column order to match the flattened record from the backend
    var headers = [
      "full_name", "email", "phone", "date_of_birth", "aadhaar_number",
      "education_levels", "ug_institution", "ug_stream", "ug_year", "ug_score_normalized",
      "total_work_months", "relevant_work_months", "current_status", "experience_bucket",
      "screening_score", "interview_status",
      "risk_score", "category", "anomalies",
      "validation_tier", "flags",
      "exceptions_count", "exceptions_summary",
      "completeness_pct", "submitted_at"
    ];
    
    var row = headers.map(function(header) {
      return data[header] || "";
    });
    
    sheet.appendRow(row);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Helper to set up headers on first run.
 */
function setupHeaders() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sheet1");
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet("Sheet1");
  }
  
  var headers = [
    "Full Name", "Email", "Phone", "DOB", "Aadhaar",
    "Education Levels", "UG Institution", "UG Stream", "UG Year", "UG Score (Norm)",
    "Total Work Months", "Relevant Work Months", "Status", "Exp Bucket",
    "Screening Score", "Interview Status",
    "Risk Score", "Category", "Anomalies",
    "Validation Tier", "Flags",
    "Exceptions Count", "Exceptions Summary",
    "Completeness %", "Submitted At"
  ];
  
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
}
