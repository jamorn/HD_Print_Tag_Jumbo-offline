/**
 * Google Apps Script - Create Sheets and Generate Data
 * สร้าง Sheets และ populate data จาก UnitConfig.js
 * 
 * Instructions:
 * 1. เปิด Google Apps Script (script.google.com)
 * 2. สร้าง project ใหม่
 * 3. แทนที่ code.gs ด้วย code นี้
 * 4. รัน function setupDatabase()
 */

// ข้อมูลจาก UnitConfig.js
const UNIT_DATA = {
  HDPE: {
    gradeData: [
      { "grade": "P901BK", "netweightArray": [750, 800, 900, 16500, 18000], "description": "Black Pipe Grade", "status": true, "sub": false },
      { "grade": "P921BK", "netweightArray": [750, 800], "description": "Black Pipe Grade", "status": true, "sub": false },
      { "grade": "P921NT", "netweightArray": [750], "description": "Natural Pipe Grade", "status": true, "sub": false },
      { "grade": "AM3245PC", "netweightArray": [750], "description": "Injection Grade", "status": true, "sub": true },
      { "grade": "P900BK", "netweightArray": [750], "description": "Black Pipe Grade", "status": true, "sub": true },
      { "grade": "P900NT", "netweightArray": [750], "description": "Natural Pipe Grade", "status": true, "sub": false },
      { "grade": "I055BK", "netweightArray": [750], "description": "Injection Black", "status": true, "sub": false },
      { "grade": "I055NT", "netweightArray": [750], "description": "Injection Natural", "status": true, "sub": false },
      { "grade": "B640BK", "netweightArray": [750], "description": "Blow Molding Black", "status": true, "sub": false },
      { "grade": "B640NT", "netweightArray": [750], "description": "Blow Molding Natural", "status": false, "sub": false }
    ]
  },
  
  PP: {
    gradeData: [
      { "grade": "1032L", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1100NK", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1100PK", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1100RC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1100S", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1100XC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1100YC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1100ZC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1102H", "netweightArray": [750, 800, 900, 16500, 18000], "description": "PP Standard Grade", "status": true, "sub": false },
      { "grade": "1102K", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1102M", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1105RC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1105SC", "netweightArray": [750, 800, 900, 16500, 18000], "description": "PP Standard Grade SC", "status": true, "sub": false },
      { "grade": "1105TC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1111R", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1120NK", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1125NA", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1126NK", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1140H", "netweightArray": [750, 800, 900], "description": "PP High Flow", "status": true, "sub": false },
      { "grade": "1140U", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1140VC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "1150H", "netweightArray": [750, 800, 900], "description": "PP High Stiffness", "status": true, "sub": false },
      { "grade": "1202J", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "2300K", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "2300NC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "2300NCA", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "2363LC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "2500H", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "2500M", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "2500PC", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "3312E", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "3325M", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "3340H", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "3340HMD", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "3375RM", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "3375SM", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false },
      { "grade": "3380SM", "netweightArray": [750, 800, 900], "description": "N/A", "status": true, "sub": false }
    ]
  },

  PPC: {
    gradeData: [
      { "grade": "B1101", "netweightArray": [750, 800, 900], "description": "PPC Block Copolymer", "status": true, "sub": false },
      { "grade": "BC03B", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
      { "grade": "BC03BS", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
      { "grade": "BC03BSW", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
      { "grade": "BC04NN", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
      { "grade": "BC05B", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
      { "grade": "BC09CHA", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
      { "grade": "BC3AWT", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
      { "grade": "BC3N", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
      { "grade": "BC3NSW", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
      { "grade": "F1003B", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
      { "grade": "FL203D", "netweightArray": [750, 800], "description": "PPC Standard Grade", "status": true, "sub": false },
      { "grade": "K1104", "netweightArray": [750, 800], "description": "PPC K Series", "status": true, "sub": false },
      { "grade": "K1111", "netweightArray": [750, 800], "description": "PPC K Series", "status": true, "sub": false },
      { "grade": "K4510B", "netweightArray": [750, 800, 900, 16500, 18000], "description": "PPC K4510 Black", "status": true, "sub": false },
      { "grade": "K4510ET", "netweightArray": [750, 800], "description": "PPC K4510 Enhanced", "status": true, "sub": false },
      { "grade": "K4520UB", "netweightArray": [750, 800], "description": "PPC K4520 Ultra Black", "status": true, "sub": false },
      { "grade": "K4527B", "netweightArray": [750, 800], "description": "PPC K4527 Black", "status": true, "sub": false },
      { "grade": "K4527ET", "netweightArray": [750, 800], "description": "PPC K4527 Enhanced", "status": true, "sub": false },
      { "grade": "K4527GR", "netweightArray": [750, 800], "description": "PPC K4527 Green", "status": true, "sub": false },
      { "grade": "NBC03HRA", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
      { "grade": "NBC03HRAM", "netweightArray": [750, 800], "description": "PPC Block Copolymer", "status": true, "sub": false },
      { "grade": "S1003", "netweightArray": [750, 800], "description": "PPC Standard Grade", "status": true, "sub": false }
    ]
  }
};

/**
 * Main function - สร้าง sheets และ populate data
 * รันฟังก์ชันนี้เพื่อสร้างระบบทั้งหมด
 */
function setupDatabase() {
  try {
    console.log('🚀 เริ่มสร้าง database...');
    
    // ใช้ spreadsheet ปัจจุบัน
    const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    const spreadsheetId = spreadsheet.getId();
    const spreadsheetUrl = spreadsheet.getUrl();
    
    console.log('📊 ใช้ spreadsheet ปัจจุบัน:', spreadsheetUrl);
    
    // สร้าง sheets ต่างๆ ก่อน
    createUnitsSheet(spreadsheet);
    createGradesSheet(spreadsheet);
    createNetWeightsSheet(spreadsheet);
    createGradeNetWeightsSheet(spreadsheet);
    
    // ลบ sheet เริ่มต้นหลังจากสร้าง sheets ใหม่แล้ว
    const sheets = spreadsheet.getSheets();
    const defaultSheet = sheets.find(sheet => sheet.getName() === 'Sheet1');
    if (defaultSheet && sheets.length > 1) {
      spreadsheet.deleteSheet(defaultSheet);
    }
    
    // Populate data
    populateUnitsData(spreadsheet);
    populateGradesData(spreadsheet);
    populateNetWeightsData(spreadsheet);
    populateGradeNetWeightsData(spreadsheet);
    
    // สร้าง API functions sheet
    createAPIFunctionsSheet(spreadsheet);
    
    console.log('✅ สร้าง database สำเร็จ!');
    console.log('📋 Spreadsheet ID:', spreadsheetId);
    console.log('🔗 URL:', spreadsheetUrl);
    
    return {
      success: true,
      spreadsheetId: spreadsheetId,
      url: spreadsheetUrl
    };
    
  } catch (error) {
    console.error('❌ เกิดข้อผิดพลาด:', error);
    return {
      success: false,
      error: error.toString()
    };
  }
}

/**
 * สร้าง Units sheet
 */
function createUnitsSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Units');
  
  // Header
  const headers = ['unit_id', 'unit_name', 'full_name', 'description', 'status', 'created_at', 'updated_at'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header
  formatHeader(sheet, headers.length);
  
  console.log('📄 สร้าง Units sheet แล้ว');
}

/**
 * สร้าง Grades sheet
 */
function createGradesSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('Grades');
  
  // Header
  const headers = ['grade_id', 'unit_id', 'grade_code', 'description', 'status', 'has_sub', 'created_at', 'updated_at'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header
  formatHeader(sheet, headers.length);
  
  console.log('📄 สร้าง Grades sheet แล้ว');
}

/**
 * สร้าง NetWeights sheet
 */
function createNetWeightsSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('NetWeights');
  
  // Header
  const headers = ['netweight_id', 'weight_value', 'is_active', 'created_at'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header
  formatHeader(sheet, headers.length);
  
  console.log('📄 สร้าง NetWeights sheet แล้ว');
}

/**
 * สร้าง GradeNetWeights sheet (junction table)
 */
function createGradeNetWeightsSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('GradeNetWeights');
  
  // Header
  const headers = ['id', 'grade_id', 'netweight_id', 'sort_order', 'is_active', 'created_at'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  
  // Format header
  formatHeader(sheet, headers.length);
  
  console.log('📄 สร้าง GradeNetWeights sheet แล้ว');
}

/**
 * Format header row
 */
function formatHeader(sheet, numCols) {
  const headerRange = sheet.getRange(1, 1, 1, numCols);
  headerRange.setBackground('#4285F4');
  headerRange.setFontColor('#FFFFFF');
  headerRange.setFontWeight('bold');
  headerRange.setHorizontalAlignment('center');
  
  // Freeze header row
  sheet.setFrozenRows(1);
  
  // Auto-resize columns
  for (let i = 1; i <= numCols; i++) {
    sheet.autoResizeColumn(i);
  }
}

/**
 * Populate Units data
 */
function populateUnitsData(spreadsheet) {
  const sheet = spreadsheet.getSheetByName('Units');
  const now = new Date();
  
  const unitsData = [
    ['HDPE', 'HDPE', 'High-Density Polyethylene', 'HDPE Pellet Production Unit', true, now, now],
    ['PP', 'PP', 'Polypropylene', 'PP Pellet Production Unit', true, now, now],
    ['PPC', 'PPC', 'Polypropylene Compound', 'PPC Pellet Production Unit', true, now, now]
  ];
  
  sheet.getRange(2, 1, unitsData.length, unitsData[0].length).setValues(unitsData);
  console.log('📊 เพิ่ม Units data แล้ว');
}

/**
 * Populate Grades data
 */
function populateGradesData(spreadsheet) {
  const sheet = spreadsheet.getSheetByName('Grades');
  const now = new Date();
  const gradesData = [];
  let gradeId = 1;
  
  // วนลูปแต่ละ unit
  Object.keys(UNIT_DATA).forEach(unitId => {
    const unitGrades = UNIT_DATA[unitId].gradeData;
    
    unitGrades.forEach(grade => {
      if (grade.status) { // เฉพาะ grade ที่ active
        gradesData.push([
          gradeId++,
          unitId,
          grade.grade,
          grade.description,
          grade.status,
          grade.sub,
          now,
          now
        ]);
      }
    });
  });
  
  sheet.getRange(2, 1, gradesData.length, gradesData[0].length).setValues(gradesData);
  console.log(`📊 เพิ่ม ${gradesData.length} Grades data แล้ว`);
}

/**
 * Populate NetWeights data
 */
function populateNetWeightsData(spreadsheet) {
  const sheet = spreadsheet.getSheetByName('NetWeights');
  const now = new Date();
  
  // รวบรวม netweight ทั้งหมดที่ไม่ซ้ำ
  const allNetWeights = new Set();
  
  Object.keys(UNIT_DATA).forEach(unitId => {
    const unitGrades = UNIT_DATA[unitId].gradeData;
    
    unitGrades.forEach(grade => {
      if (grade.status) {
        grade.netweightArray.forEach(weight => {
          allNetWeights.add(weight);
        });
      }
    });
  });
  
  // แปลงเป็น array และ sort
  const sortedWeights = Array.from(allNetWeights).sort((a, b) => a - b);
  
  const netWeightsData = sortedWeights.map((weight, index) => [
    index + 1, // netweight_id
    weight,    // weight_value
    true,      // is_active
    now        // created_at
  ]);
  
  sheet.getRange(2, 1, netWeightsData.length, netWeightsData[0].length).setValues(netWeightsData);
  console.log(`📊 เพิ่ม ${netWeightsData.length} NetWeights data แล้ว`);
}

/**
 * Populate GradeNetWeights data (junction table)
 */
function populateGradeNetWeightsData(spreadsheet) {
  const gradesSheet = spreadsheet.getSheetByName('Grades');
  const netWeightsSheet = spreadsheet.getSheetByName('NetWeights');
  const junctionSheet = spreadsheet.getSheetByName('GradeNetWeights');
  
  // อ่าน data จาก sheets
  const gradesData = gradesSheet.getDataRange().getValues().slice(1); // ข้าม header
  const netWeightsData = netWeightsSheet.getDataRange().getValues().slice(1);
  
  // สร้าง mapping
  const gradeMap = new Map();
  gradesData.forEach(row => {
    const [gradeId, unitId, gradeCode] = row;
    gradeMap.set(`${unitId}_${gradeCode}`, gradeId);
  });
  
  const netWeightMap = new Map();
  netWeightsData.forEach(row => {
    const [netweightId, weightValue] = row;
    netWeightMap.set(weightValue, netweightId);
  });
  
  const junctionData = [];
  const now = new Date();
  let junctionId = 1;
  
  // สร้าง junction records
  Object.keys(UNIT_DATA).forEach(unitId => {
    const unitGrades = UNIT_DATA[unitId].gradeData;
    
    unitGrades.forEach(grade => {
      if (grade.status) {
        const gradeId = gradeMap.get(`${unitId}_${grade.grade}`);
        
        grade.netweightArray.forEach((weight, index) => {
          const netweightId = netWeightMap.get(weight);
          
          if (gradeId && netweightId) {
            junctionData.push([
              junctionId++,
              gradeId,
              netweightId,
              index + 1, // sort_order
              true,       // is_active
              now         // created_at
            ]);
          }
        });
      }
    });
  });
  
  if (junctionData.length > 0) {
    junctionSheet.getRange(2, 1, junctionData.length, junctionData[0].length).setValues(junctionData);
  }
  
  console.log(`📊 เพิ่ม ${junctionData.length} GradeNetWeights data แล้ว`);
}

/**
 * สร้าง API Functions sheet สำหรับ reference
 */
function createAPIFunctionsSheet(spreadsheet) {
  const sheet = spreadsheet.insertSheet('API_Functions');
  
  // ใส่ข้อความแนะนำ
  const instructions = `
=== GOOGLE APPS SCRIPT API SETUP ===

คัดลอก code จากไฟล์ api_functions.js และใส่ใน Apps Script project นี้

หรือ copy functions เหล่านี้:
- getUnits()
- getGradesByUnit(unitId)  
- getNetWeightsByGrade(gradeId)
- addNetWeightToGrade(gradeId, weightValue, sortOrder)
- removeNetWeightFromGrade(gradeId, netweightId)
- doGet(e)
- doPost(e)

API Endpoints:
GET: ?action=getUnits
GET: ?action=getGradesByUnit&unitId=HDPE
GET: ?action=getNetWeightsByGrade&gradeId=1
POST: action=addNetWeightToGrade&gradeId=1&weightValue=1000
POST: action=removeNetWeightFromGrade&gradeId=1&netweightId=1
`;
  
  sheet.getRange('A1').setValue(instructions);
  sheet.getRange('A1').setWrap(true);
  sheet.setColumnWidth(1, 600);
  
  console.log('📄 สร้าง API Functions sheet แล้ว');
}

/**
 * ทดสอบ API functions
 */
function testAPI() {
  console.log('🧪 ทดสอบ API functions...');
  
  try {
    // ทดสอบ getUnits
    const units = getUnits();
    console.log('✅ Units:', units);
    
    // ทดสอบ getGradesByUnit
    const hdpeGrades = getGradesByUnit('HDPE');
    console.log('✅ HDPE Grades:', hdpeGrades.slice(0, 3)); // แสดงแค่ 3 รายการแรก
    
    // ทดสอบ getNetWeightsByGrade (ใช้ grade แรกของ HDPE)
    if (hdpeGrades.length > 0) {
      const netWeights = getNetWeightsByGrade(hdpeGrades[0].grade_id);
      console.log('✅ NetWeights for first HDPE grade:', netWeights);
    }
    
    console.log('🎉 ทดสอบ API สำเร็จ!');
    
  } catch (error) {
    console.error('❌ ทดสอบ API ล้มเหลว:', error);
  }
}

/**
 * Debug - ดูว่ามี sheets อะไรบ้าง
 */
function listCurrentSheets() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = spreadsheet.getSheets();
  
  console.log('📋 Sheets ทั้งหมดใน Spreadsheet นี้:');
  sheets.forEach((sheet, index) => {
    console.log(`${index + 1}. ${sheet.getName()} (${sheet.getLastRow()} rows)`);
  });
  
  return sheets.map(sheet => ({
    name: sheet.getName(),
    rows: sheet.getLastRow(),
    cols: sheet.getLastColumn()
  }));
}

/**
 * Reset database (ลบ data ทั้งหมดและสร้างใหม่)
 */
function resetDatabase() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  
  try {
    // ลบ sheets เก่า (ยกเว้น API_Functions)
    const sheetsToDelete = ['Units', 'Grades', 'NetWeights', 'GradeNetWeights'];
    
    sheetsToDelete.forEach(sheetName => {
      const sheet = spreadsheet.getSheetByName(sheetName);
      if (sheet) {
        spreadsheet.deleteSheet(sheet);
      }
    });
    
    // สร้างใหม่
    createUnitsSheet(spreadsheet);
    createGradesSheet(spreadsheet);
    createNetWeightsSheet(spreadsheet);
    createGradeNetWeightsSheet(spreadsheet);
    
    // Populate data ใหม่
    populateUnitsData(spreadsheet);
    populateGradesData(spreadsheet);
    populateNetWeightsData(spreadsheet);
    populateGradeNetWeightsData(spreadsheet);
    
    console.log('🔄 Reset database สำเร็จ!');
    
  } catch (error) {
    console.error('❌ Reset database ล้มเหลว:', error);
  }
}