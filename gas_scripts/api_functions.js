/**
 * API Functions for Google Apps Script
 * สำหรับใส่ใน Apps Script project เป็นไฟล์แยก
 */

// 1. ดึงข้อมูล units ทั้งหมด
function getUnits() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Units');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  }).filter(unit => unit.status);
}

// 2. ดึงข้อมูล grades ตาม unit
function getGradesByUnit(unitId) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Grades');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  
  return data.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  }).filter(grade => grade.unit_id === unitId && grade.status);
}

// 3. ดึงข้อมูล netweights ของ grade
function getNetWeightsByGrade(gradeId) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const junctionSheet = ss.getSheetByName('GradeNetWeights');
  const netWeightsSheet = ss.getSheetByName('NetWeights');
  
  // ดึง junction data
  const junctionData = junctionSheet.getDataRange().getValues();
  const junctionHeaders = junctionData[0];
  
  const junctionRecords = junctionData.slice(1).map(row => {
    const obj = {};
    junctionHeaders.forEach((header, index) => {
      obj[header] = row[index];
    });
    return obj;
  }).filter(record => record.grade_id === gradeId && record.is_active)
    .sort((a, b) => a.sort_order - b.sort_order);
  
  // ดึง netweight details
  const netWeightsData = netWeightsSheet.getDataRange().getValues();
  const netWeightsHeaders = netWeightsData[0];
  
  const netWeightsMap = new Map();
  netWeightsData.slice(1).forEach(row => {
    const obj = {};
    netWeightsHeaders.forEach((header, index) => {
      obj[header] = row[index];
    });
    netWeightsMap.set(obj.netweight_id, obj);
  });
  
  return junctionRecords.map(record => {
    const netWeight = netWeightsMap.get(record.netweight_id);
    return {
      netweight_id: record.netweight_id,
      weight_value: netWeight.weight_value,
      sort_order: record.sort_order
    };
  });
}

// 4. เพิ่ม netweight ใหม่สำหรับ grade
function addNetWeightToGrade(gradeId, weightValue, sortOrder) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // ตรวจสอบว่า netweight มีอยู่แล้วหรือไม่
  let netweightId = findOrCreateNetWeight(weightValue);
  
  // ตรวจสอบว่ามี junction record อยู่แล้วหรือไม่
  const junctionSheet = ss.getSheetByName('GradeNetWeights');
  const junctionData = junctionSheet.getDataRange().getValues();
  
  const existingRecord = junctionData.slice(1).find(row => 
    row[1] === gradeId && row[2] === netweightId
  );
  
  if (existingRecord) {
    throw new Error('NetWeight already exists for this grade');
  }
  
  // เพิ่ม junction record
  const newId = getNextId(junctionSheet);
  const now = new Date();
  
  junctionSheet.appendRow([
    newId,
    gradeId,
    netweightId,
    sortOrder || 999,
    true,
    now
  ]);
  
  return {
    success: true,
    id: newId,
    gradeId: gradeId,
    netweightId: netweightId,
    weightValue: weightValue
  };
}

// 5. ลบ netweight จาก grade
function removeNetWeightFromGrade(gradeId, netweightId) {
  const junctionSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('GradeNetWeights');
  const data = junctionSheet.getDataRange().getValues();
  
  // หา row ที่ต้องการลบ
  const targetRowIndex = data.findIndex((row, index) => 
    index > 0 && row[1] === gradeId && row[2] === netweightId
  );
  
  if (targetRowIndex === -1) {
    throw new Error('NetWeight not found for this grade');
  }
  
  // อัพเดท is_active เป็น false แทนการลบ
  junctionSheet.getRange(targetRowIndex + 1, 5).setValue(false);
  
  return {
    success: true,
    message: 'NetWeight removed from grade'
  };
}

// Helper functions
function findOrCreateNetWeight(weightValue) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('NetWeights');
  const data = sheet.getDataRange().getValues();
  
  // หาใน NetWeights ที่มีอยู่
  const existingRow = data.slice(1).find(row => row[1] === weightValue);
  
  if (existingRow) {
    return existingRow[0]; // return netweight_id
  }
  
  // สร้างใหม่ถ้าไม่มี
  const newId = getNextId(sheet);
  const now = new Date();
  
  sheet.appendRow([newId, weightValue, true, now]);
  
  return newId;
}

function getNextId(sheet) {
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return 1;
  
  const ids = data.slice(1).map(row => row[0]).filter(id => typeof id === 'number');
  return Math.max(...ids) + 1;
}

// Web API สำหรับเรียกใช้จาก web application
function doGet(e) {
  const action = e.parameter.action;
  
  try {
    switch(action) {
      case 'getUnits':
        return ContentService.createTextOutput(JSON.stringify(getUnits()))
          .setMimeType(ContentService.MimeType.JSON);
        
      case 'getGradesByUnit':
        const unitId = e.parameter.unitId;
        return ContentService.createTextOutput(JSON.stringify(getGradesByUnit(unitId)))
          .setMimeType(ContentService.MimeType.JSON);
          
      case 'getNetWeightsByGrade':
        const gradeId = parseInt(e.parameter.gradeId);
        return ContentService.createTextOutput(JSON.stringify(getNetWeightsByGrade(gradeId)))
          .setMimeType(ContentService.MimeType.JSON);
          
      default:
        return ContentService.createTextOutput(JSON.stringify({error: 'Invalid action'}))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doPost(e) {
  const action = e.parameter.action;
  
  try {
    switch(action) {
      case 'addNetWeightToGrade':
        const gradeId = parseInt(e.parameter.gradeId);
        const weightValue = parseInt(e.parameter.weightValue);
        const sortOrder = e.parameter.sortOrder ? parseInt(e.parameter.sortOrder) : undefined;
        
        const result = addNetWeightToGrade(gradeId, weightValue, sortOrder);
        return ContentService.createTextOutput(JSON.stringify(result))
          .setMimeType(ContentService.MimeType.JSON);
          
      case 'removeNetWeightFromGrade':
        const removeGradeId = parseInt(e.parameter.gradeId);
        const netweightId = parseInt(e.parameter.netweightId);
        
        const removeResult = removeNetWeightFromGrade(removeGradeId, netweightId);
        return ContentService.createTextOutput(JSON.stringify(removeResult))
          .setMimeType(ContentService.MimeType.JSON);
          
      default:
        return ContentService.createTextOutput(JSON.stringify({error: 'Invalid action'}))
          .setMimeType(ContentService.MimeType.JSON);
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}