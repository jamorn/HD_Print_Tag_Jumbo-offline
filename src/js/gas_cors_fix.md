# Google Apps Script CORS Fix

## ใน GAS Code ให้เพิ่ม:

```javascript
function doGet(e) {
  // เพิ่ม CORS headers
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Your data processing here
  const data = {
    // your pellets data
  };
  
  const jsonResponse = JSON.stringify(data);
  
  // Set CORS headers
  output.setContent(jsonResponse);
  
  return output;
}

// หรือใช้ doPost สำหรับ POST requests
function doPost(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
  
  // Your processing logic
  const data = processRequest(e);
  
  output.setContent(JSON.stringify(data));
  return output;
}
```

## ใน JavaScript เพิ่ม mode และ headers:

```javascript
const response = await fetch(GAS_URL, {
  method: 'GET',
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json',
  },
});
```