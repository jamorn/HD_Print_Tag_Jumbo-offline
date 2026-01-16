function testSpreadsheetId() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const actualId = activeSpreadsheet.getId();
  const configId = SPREADSHEET_ID;
  
  Logger.log('=== SPREADSHEET ID COMPARISON ===');
  Logger.log('Actual ID (from getActiveSpreadsheet): ' + actualId);
  Logger.log('Config ID (from SPREADSHEET_ID): ' + configId);
  Logger.log('IDs Match: ' + (actualId === configId));
  
  return {
    actualId: actualId,
    configId: configId,
    match: actualId === configId
  };
}

function testOpenById() {
  Logger.log('=== TESTING OPENBYID ===');
  
  try {
    // ทดสอบด้วย ID จาก Config
    Logger.log('Testing with SPREADSHEET_ID: ' + SPREADSHEET_ID);
    const spreadsheetFromConfig = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log('✅ openById with config ID SUCCESS');
    Logger.log('Name: ' + spreadsheetFromConfig.getName());
    
    return { success: true, name: spreadsheetFromConfig.getName() };
  } catch (error) {
    Logger.log('❌ openById with config ID FAILED: ' + error.message);
    
    // ทดสอบด้วย actual ID
    try {
      const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      const actualId = activeSpreadsheet.getId();
      
      Logger.log('Testing with actual ID: ' + actualId);
      const spreadsheetFromActual = SpreadsheetApp.openById(actualId);
      Logger.log('✅ openById with actual ID SUCCESS');
      
      return { 
        success: true, 
        error: 'Config ID is wrong',
        correctId: actualId,
        name: spreadsheetFromActual.getName() 
      };
    } catch (error2) {
      Logger.log('❌ openById with actual ID ALSO FAILED: ' + error2.message);
      return { 
        success: false, 
        error: error.message,
        actualError: error2.message 
      };
    }
  }
}
function compareSpreadsheetMethods() {
  Logger.log('=== COMPARING SPREADSHEET ACCESS METHODS ===');
  
  // Method 1: getActiveSpreadsheet
  try {
    const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
    Logger.log('✅ getActiveSpreadsheet() SUCCESS');
    Logger.log('ID: ' + activeSpreadsheet.getId());
    Logger.log('Name: ' + activeSpreadsheet.getName());
    Logger.log('URL: ' + activeSpreadsheet.getUrl());
  } catch (error) {
    Logger.log('❌ getActiveSpreadsheet() FAILED: ' + error.message);
  }
  
  // Method 2: openById
  try {
    const spreadsheetById = SpreadsheetApp.openById(SPREADSHEET_ID);
    Logger.log('✅ openById() SUCCESS');
    Logger.log('Name: ' + spreadsheetById.getName());
  } catch (error) {
    Logger.log('❌ openById() FAILED: ' + error.message);
  }
}
function debugSpreadsheetIds() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const actualId = activeSpreadsheet.getId();
  const configId = SPREADSHEET_ID;
  
  Logger.log('=== DETAILED ID COMPARISON ===');
  Logger.log('Actual ID Length: ' + actualId.length);
  Logger.log('Config ID Length: ' + configId.length);
  Logger.log('Actual ID Type: ' + typeof actualId);
  Logger.log('Config ID Type: ' + typeof configId);
  
  // แปลงเป็น char codes เพื่อดู invisible characters
  Logger.log('Actual ID char codes: ' + JSON.stringify(actualId.split('').map(c => c.charCodeAt(0))));
  Logger.log('Config ID char codes: ' + JSON.stringify(configId.split('').map(c => c.charCodeAt(0))));
  
  // ลองเปรียบเทียบแต่ละตัวอักษร
  for (let i = 0; i < Math.max(actualId.length, configId.length); i++) {
    if (actualId[i] !== configId[i]) {
      Logger.log(`Difference at position ${i}: actual="${actualId[i]}" (${actualId.charCodeAt(i)}) vs config="${configId[i]}" (${configId.charCodeAt(i)})`);
    }
  }
  
  // ลอง trim และ normalize
  const actualTrimmed = actualId.trim();
  const configTrimmed = configId.trim();
  Logger.log('After trim - Match: ' + (actualTrimmed === configTrimmed));
  
  return {
    actualId: actualId,
    configId: configId,
    actualLength: actualId.length,
    configLength: configId.length,
    actualType: typeof actualId,
    configType: typeof configId
  };
}
function fixSpreadsheetId() {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const correctId = activeSpreadsheet.getId();
  
  Logger.log('=== CORRECT SPREADSHEET_ID FOR CONFIG.JS.JS ===');
  Logger.log('Copy this line to Config.js.js:');
  Logger.log(`var SPREADSHEET_ID = '${correctId}';`);
  
  Logger.log('\nSpreadsheet Info:');
  Logger.log('ID: ' + correctId);
  Logger.log('Name: ' + activeSpreadsheet.getName());
  Logger.log('URL: ' + activeSpreadsheet.getUrl());
  
  return correctId;
}