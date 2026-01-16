/**
 * ฟังก์ชันสำหรับตรวจสอบชื่อ sheet ทั้งหมดในไฟล์
 * @returns {Array<string>} Array ของชื่อ sheet ทั้งหมด
 * @created 2025-10-25 AI Assistant
 */
function getAllSheetNames() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  const sheetNames = sheets.map(sheet => sheet.getName());
  
  Logger.log('All Sheet Names:');
  Logger.log(sheetNames);
  
  return sheetNames;
}

/**
 * ฟังก์ชันสำหรับตรวจสอบว่าชื่อ sheet ที่ระบุมีอยู่หรือไม่
 * @param {string} sheetName - ชื่อ sheet ที่ต้องการตรวจสอบ
 * @returns {boolean} true ถ้า sheet มีอยู่, false ถ้าไม่มี
 * @created 2025-10-25 AI Assistant
 */
function isSheetExists(sheetName) {
  if (!sheetName || typeof sheetName !== 'string') {
    Logger.log('Error: Sheet name is required and must be a string');
    return false;
  }
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  try {
    const sheet = spreadsheet.getSheetByName(sheetName);
    return sheet !== null;
  } catch (error) {
    Logger.log(`Error checking sheet "${sheetName}": ${error.message}`);
    return false;
  }
}

/**
 * ฟังก์ชันสำหรับตรวจสอบ Header และ Datatype ของ sheet เฉพาะที่ระบุ
 * @param {string} sheetName - ชื่อ sheet ที่ต้องการตรวจสอบ
 * @returns {Object|null} Object ที่มี sheetName, headers และ dataTypes หรือ null ถ้า sheet ไม่มี
 * @created 2025-10-25 AI Assistant
 */
function checkSpecificSheetDatatypes(sheetName) {
  // ตรวจสอบว่า parameter ถูกต้อง
  if (!sheetName || typeof sheetName !== 'string') {
    Logger.log('Error: Sheet name is required and must be a string');
    return null;
  }
  
  // ตรวจสอบว่า sheet มีอยู่จริง
  if (!isSheetExists(sheetName)) {
    const availableSheets = getAllSheetNames();
    Logger.log(`Error: Sheet "${sheetName}" not found!`);
    Logger.log(`Available sheets: ${availableSheets.join(', ')}`);
    return null;
  }
  
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);
  const lastCol = sheet.getLastColumn();
  const lastRow = sheet.getLastRow();

  let headers = [];
  let dataTypes = [];
  let status = "OK";

  if (lastCol > 0) {
    // 1. ดึงข้อมูล Header (แถวที่ 1)
    const headerRange = sheet.getRange(1, 1, 1, lastCol);
    headers = headerRange.getValues()[0].map(h => String(h).trim());

    // 2. ตรวจสอบ Datatype ในแถวที่ 2
    if (lastRow >= 2) {
      const dataRange = sheet.getRange(2, 1, 1, lastCol);
      const dataValues = dataRange.getValues()[0];
      
      dataTypes = dataValues.map(value => {
          let type = typeof value;
          if (type === 'object' && value instanceof Date) {
              return 'date';  // เปลี่ยนเป็น 'date' เพื่อใช้ใน Config.js
          } else if (type === 'object' && value !== null) {
              return 'object';
          }
          return type;
      });
      
    } else {
      status = "No data in row 2, only headers available.";
      dataTypes = headers.map(() => null);
    }
  } else {
    status = "Sheet is empty (No columns or rows).";
  }

  // สร้าง object สำหรับผลลัพธ์
  const sheetData = {
    sheetName: sheetName,
    status: status,
    headers: headers,
    dataTypes: dataTypes
  };

  Logger.log(`Sheet: ${sheetName}`);
  Logger.log(`Status: ${status}`);
  Logger.log(`Headers: ${headers.join(', ')}`);
  Logger.log(`Data Types: ${dataTypes.join(', ')}`);

  return sheetData;
}

/**
 * 🎯 MAIN FUNCTION สำหรับ GAS - สร้าง SHEET_SCHEMAS สำหรับ Config.js
 * @returns {string} JavaScript code ที่พร้อม copy ไปใส่ใน Config.js
 * @created 2025-10-25 AI Assistant
 */
function generateConfigSchemas() {
  Logger.log('='.repeat(80));
  Logger.log('🚀 GENERATING SHEET_SCHEMAS FOR CONFIG.JS');
  Logger.log('='.repeat(80));
  
  const results = checkSheetDatatypes();
  let configCode = 'var SHEET_SCHEMAS = {\n';
  
  results.forEach((sheet, index) => {
    if (sheet.status === "OK" && sheet.headers.length > 0) {
      // แปลง headers และ dataTypes เป็น format ที่ใช้ใน Config.js
      const headersStr = JSON.stringify(sheet.headers);
      const dataTypesStr = JSON.stringify(sheet.dataTypes);
      
      configCode += `  ${sheet.sheetName}: {\n`;
      configCode += `    headers: ${headersStr},\n`;
      configCode += `    dataTypes: ${dataTypesStr}\n`;
      configCode += `  }`;
      
      // เพิ่ม comma ถ้าไม่ใช่ sheet สุดท้าย
      if (index < results.length - 1) {
        configCode += ',';
      }
      configCode += '\n';
    }
  });
  
  configCode += '};';
  
  // แสดงผลใน Logger
  Logger.log('\n📋 COPY THIS CODE TO CONFIG.JS:');
  Logger.log('-'.repeat(50));
  Logger.log(configCode);
  Logger.log('-'.repeat(50));
  
  // แสดงสถิติ
  const validSheets = results.filter(sheet => sheet.status === "OK" && sheet.headers.length > 0);
  const emptySheets = results.filter(sheet => sheet.status !== "OK" || sheet.headers.length === 0);
  
  Logger.log(`\n📊 SUMMARY:`);
  Logger.log(`✅ Valid sheets: ${validSheets.length}`);
  Logger.log(`⚠️ Empty/Invalid sheets: ${emptySheets.length}`);
  
  if (emptySheets.length > 0) {
    Logger.log(`\n⚠️ EMPTY/INVALID SHEETS:`);
    emptySheets.forEach(sheet => {
      Logger.log(`   - ${sheet.sheetName}: ${sheet.status}`);
    });
  }
  
  return configCode;
}

/**
 * 🎯 UTILITY FUNCTION - เปรียบเทียบ schema กับ Config.js ปัจจุบัน
 * @param {Object} currentConfig - SHEET_SCHEMAS จาก Config.js ปัจจุบัน
 * @returns {Object} รายงานความแตกต่าง
 * @created 2025-10-25 AI Assistant
 */
function compareWithConfig(currentConfig) {
  const actualData = checkSheetDatatypes();
  const differences = [];
  
  actualData.forEach(sheet => {
    if (sheet.status === "OK" && sheet.headers.length > 0) {
      const configSchema = currentConfig[sheet.sheetName];
      
      if (!configSchema) {
        differences.push({
          sheet: sheet.sheetName,
          type: 'MISSING_IN_CONFIG',
          actual: sheet
        });
      } else {
        // เปรียบเทียบ headers
        const headersDiff = JSON.stringify(sheet.headers) !== JSON.stringify(configSchema.headers);
        const dataTypesDiff = JSON.stringify(sheet.dataTypes) !== JSON.stringify(configSchema.dataTypes);
        
        if (headersDiff || dataTypesDiff) {
          differences.push({
            sheet: sheet.sheetName,
            type: 'SCHEMA_MISMATCH',
            actual: sheet,
            config: configSchema,
            headersDiff: headersDiff,
            dataTypesDiff: dataTypesDiff
          });
        }
      }
    }
  });
  
  Logger.log('\n🔍 SCHEMA COMPARISON REPORT:');
  Logger.log('='.repeat(50));
  
  if (differences.length === 0) {
    Logger.log('✅ All schemas match perfectly!');
  } else {
    differences.forEach(diff => {
      Logger.log(`\n❌ ${diff.sheet}: ${diff.type}`);
      if (diff.type === 'SCHEMA_MISMATCH') {
        if (diff.headersDiff) {
          Logger.log(`   Headers differ:`);
          Logger.log(`   Actual: ${JSON.stringify(diff.actual.headers)}`);
          Logger.log(`   Config: ${JSON.stringify(diff.config.headers)}`);
        }
        if (diff.dataTypesDiff) {
          Logger.log(`   DataTypes differ:`);
          Logger.log(`   Actual: ${JSON.stringify(diff.actual.dataTypes)}`);
          Logger.log(`   Config: ${JSON.stringify(diff.config.dataTypes)}`);
        }
      }
    });
  }
  
  return differences;
}
function getcheckSheetDatatypes() {
  const results = checkSheetDatatypes();
  
  // แปลง JavaScript Object Array ให้เป็น JSON string
  // 'null, 2' ใช้สำหรับจัดรูปแบบ JSON ให้อ่านง่าย (Pretty-print)
  const jsonString = JSON.stringify(results, null, 2); 
  
  // บันทึก JSON string ลงใน Log
  Logger.log('JSON Data Structure:');
  Logger.log(jsonString);
  
  return jsonString; // คืนค่า JSON string ด้วย (ถ้าต้องการ)
}

/**
 * ฟังก์ชันสำหรับเรียกใช้และแสดงผลลัพธ์ของ sheet เฉพาะในรูปแบบ JSON Object String
 * @param {string} sheetName - ชื่อ sheet ที่ต้องการตรวจสอบ
 * @returns {string|null} JSON string ของข้อมูล sheet หรือ null ถ้า sheet ไม่มี
 */
function getSpecificSheetDatatypes(sheetName) {
  const result = checkSpecificSheetDatatypes(sheetName);
  
  if (result === null) {
    return null;
  }
  
  // แปลง JavaScript Object ให้เป็น JSON string
  const jsonString = JSON.stringify(result, null, 2);
  
  // บันทึก JSON string ลงใน Log
  Logger.log('JSON Data Structure for Specific Sheet:');
  Logger.log(jsonString);
  
  return jsonString;
}

/**
 * ตรวจสอบ Header (แถวที่ 1) และ Datatype ของแถวที่ 2 ในแต่ละชีต 
 * และคืนค่าเป็น Array ของ Object
 * @returns {Array<Object>} List ของ Object ที่มี sheetName, headers และ dataTypes
 */
function checkSheetDatatypes() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  const results = [];

  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i];
    const sheetName = sheet.getName();
    const lastCol = sheet.getLastColumn();
    const lastRow = sheet.getLastRow();

    let headers = [];
    let dataTypes = [];
    let status = "OK"; 

    if (lastCol > 0) {
      // 1. ดึงข้อมูล Header (แถวที่ 1)
      const headerRange = sheet.getRange(1, 1, 1, lastCol);
      headers = headerRange.getValues()[0].map(h => String(h).trim()); 

      // 2. ตรวจสอบ Datatype ในแถวที่ 2
      if (lastRow >= 2) {
        const dataRange = sheet.getRange(2, 1, 1, lastCol);
        const dataValues = dataRange.getValues()[0];
        
        dataTypes = dataValues.map(value => {
            let type = typeof value;
            if (type === 'object' && value instanceof Date) {
                return 'object (Date)'; 
            } else if (type === 'object' && value !== null) {
                return 'object';
            }
            return type;
        });
        
      } else {
        status = "No data in row 2, only headers available.";
        // ถ้าไม่มีข้อมูลในแถวที่ 2 ให้ระบุประเภทข้อมูลเป็น null ตามจำนวน Header
        dataTypes = headers.map(() => null); 
      }
    } else {
      status = "Sheet is empty (No columns or rows).";
    }

    // สร้าง object สำหรับผลลัพธ์
    const sheetData = {
      sheetName: sheetName,
      status: status,
      headers: headers,
      dataTypes: dataTypes
    };

    results.push(sheetData);
  }

  return results;
}