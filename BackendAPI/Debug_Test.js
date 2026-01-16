/**
 * @file Debug_Test.js
 * @description Debug and test functions for troubleshooting GAS issues
 * @author HD_Print_Tag_System
 * @created 2025-12-11
 * @updated 2025-12-11
 */

/**
 * Simple test function that doesn't use any external dependencies
 */
function testSimple() {
  Logger.log('[DEBUG SIMPLE] Starting simple test');
  
  const result = {
    success: true,
    message: "Simple test passed",
    timestamp: new Date().toISOString(),
    gasVersion: "Google Apps Script Working"
  };
  
  Logger.log('[DEBUG SIMPLE] Simple test completed successfully: ' + JSON.stringify(result));
  return result;
}

/**
 * Test basic utilities and timezone
 */
function testUtilities() {
  try {
    Logger.log('[DEBUG UTIL_START] Starting utilities test');
    
    const scriptTimeZone = Session.getScriptTimeZone();
    Logger.log('[DEBUG UTIL_TIMEZONE] Got script timezone: ' + scriptTimeZone);
    
    const currentTime = Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyy-MM-dd HH:mm:ss');
    Logger.log('[DEBUG UTIL_TIME] Formatted current time: ' + currentTime);
    
    const utcTime = new Date().toISOString();
    Logger.log('[DEBUG UTIL_UTC] Got UTC time: ' + utcTime);
    
    // Test our utility function
    let getNowResult = null;
    try {
      getNowResult = getNow();
      Logger.log('[DEBUG UTIL_GETNOW] getNow() function works: ' + getNowResult);
    } catch (getNowError) {
      Logger.log('[DEBUG UTIL_GETNOW_ERROR] getNow() function failed: ' + getNowError.message);
    }
    
    const result = {
      success: true,
      data: {
        scriptTimeZone: scriptTimeZone,
        currentTime: currentTime,
        utcTime: utcTime,
        getNowFunction: getNowResult
      },
      timestamp: new Date().toISOString()
    };
    
    Logger.log('[DEBUG UTIL_SUCCESS] Utilities test completed successfully');
    return result;
    
  } catch (error) {
    Logger.log('[DEBUG UTIL_ERROR] Utilities test failed: ' + error.message);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Test spreadsheet access step by step
 */
function testSpreadsheet() {
  try {
    Logger.log('[DEBUG SS_START] Starting spreadsheet test');
    
    const result = {
      success: true,
      steps: {},
      timestamp: new Date().toISOString()
    };

    // Step 1: Test SPREADSHEET_ID variable
    try {
      Logger.log('[DEBUG SS_STEP1] Testing SPREADSHEET_ID variable');
      const spreadsheetId = SPREADSHEET_ID;
      result.steps.step1_spreadsheetId = {
        success: true,
        value: spreadsheetId,
        message: "SPREADSHEET_ID variable accessible"
      };
      Logger.log('[DEBUG SS_STEP1_OK] SPREADSHEET_ID found: ' + spreadsheetId);
    } catch (error) {
      Logger.log('[DEBUG SS_STEP1_ERROR] SPREADSHEET_ID not accessible: ' + error.message);
      result.steps.step1_spreadsheetId = {
        success: false,
        error: error.message
      };
      return result;
    }

    // Step 2: Test SpreadsheetApp.openById
    try {
      Logger.log('[DEBUG SS_STEP2] Testing SpreadsheetApp.openById()');
      const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
      const name = spreadsheet.getName();
      const url = spreadsheet.getUrl();
      
      result.steps.step2_openById = {
        success: true,
        spreadsheetName: name,
        spreadsheetUrl: url,
        message: "Successfully opened spreadsheet"
      };
      Logger.log('[DEBUG SS_STEP2_OK] openById succeeded - Name: ' + name);
    } catch (error) {
      Logger.log('[DEBUG SS_STEP2_ERROR] openById failed: ' + error.message);
      result.steps.step2_openById = {
        success: false,
        error: error.message
      };
      return result;
    }

    // Step 3: Test getSpreadsheet function
    try {
      Logger.log('[DEBUG SS_STEP3] Testing getSpreadsheet() function');
      const spreadsheet = getSpreadsheet();
      const name = spreadsheet.getName();
      
      result.steps.step3_getSpreadsheet = {
        success: true,
        spreadsheetName: name,
        message: "getSpreadsheet() function works"
      };
      Logger.log('[DEBUG SS_STEP3_OK] getSpreadsheet() succeeded: ' + name);
    } catch (error) {
      Logger.log('[DEBUG SS_STEP3_ERROR] getSpreadsheet() failed: ' + error.message);
      result.steps.step3_getSpreadsheet = {
        success: false,
        error: error.message
      };
      return result;
    }

    // Step 4: List all sheets
    try {
      Logger.log('[DEBUG SS_STEP4] Testing sheet listing');
      const spreadsheet = getSpreadsheet();
      const sheets = spreadsheet.getSheets();
      const sheetNames = sheets.map(sheet => sheet.getName());
      
      result.steps.step4_listSheets = {
        success: true,
        totalSheets: sheets.length,
        sheetNames: sheetNames,
        message: "Successfully listed all sheets"
      };
      Logger.log('[DEBUG SS_STEP4_OK] Sheet listing succeeded - Count: ' + sheets.length + ', Names: ' + sheetNames.join(','));
    } catch (error) {
      Logger.log('[DEBUG SS_STEP4_ERROR] Sheet listing failed: ' + error.message);
      result.steps.step4_listSheets = {
        success: false,
        error: error.message
      };
      return result;
    }

    // Step 5: Test getSheet function
    try {
      Logger.log('[DEBUG SS_STEP5] Testing getSheet() for Grades');
      const gradesSheet = getSheet('Grades');
      const sheetName = gradesSheet.getName();
      const lastRow = gradesSheet.getLastRow();
      const lastColumn = gradesSheet.getLastColumn();
      
      result.steps.step5_getGradesSheet = {
        success: true,
        sheetName: sheetName,
        lastRow: lastRow,
        lastColumn: lastColumn,
        message: "Successfully accessed Grades sheet"
      };
      Logger.log('[DEBUG SS_STEP5_OK] getSheet(Grades) succeeded - Rows: ' + lastRow + ', Columns: ' + lastColumn);
    } catch (error) {
      Logger.log('[DEBUG SS_STEP5_ERROR] getSheet(Grades) failed: ' + error.message);
      result.steps.step5_getGradesSheet = {
        success: false,
        error: error.message
      };
    }

    Logger.log('[DEBUG SS_COMPLETE] Spreadsheet test completed');
    return result;

  } catch (error) {
    Logger.log('[DEBUG SS_FATAL_ERROR] Fatal error in spreadsheet test: ' + error.message);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Test data retrieval from Grades sheet
 */
function testGradesData() {
  const logs = [];
  
  try {
    logs.push(debugLog('GRADES_START', 'Starting Grades data test'));
    
    const result = {
      success: true,
      data: {},
      timestamp: new Date().toISOString(),
      logs: logs
    };

    // Get Grades sheet
    logs.push(debugLog('GRADES_GETSHEET', 'Getting Grades sheet'));
    const gradesSheet = getSheet('Grades');
    logs.push(debugLog('GRADES_GETSHEET_OK', 'Grades sheet obtained'));
    
    logs.push(debugLog('GRADES_GETDATA', 'Getting data range from Grades sheet'));
    const data = gradesSheet.getDataRange().getValues();
    const headers = data[0];
    logs.push(debugLog('GRADES_GETDATA_OK', 'Data retrieved', { totalRows: data.length, headers: headers }));
    
    result.data.headers = headers;
    result.data.totalRows = data.length;
    result.data.sampleData = data.slice(0, 3); // First 3 rows including header
    
    // Count by unit
    logs.push(debugLog('GRADES_COUNT', 'Counting grades by unit'));
    const unitCounts = {};
    data.slice(1).forEach((row, index) => {
      const unitId = row[1]; // unit_id is column index 1
      unitCounts[unitId] = (unitCounts[unitId] || 0) + 1;
      if (index < 5) { // Log first 5 rows for debugging
        logs.push(debugLog('GRADES_ROW', `Row ${index + 1}`, { unitId: unitId, gradeCode: row[2] }));
      }
    });
    
    result.data.unitCounts = unitCounts;
    logs.push(debugLog('GRADES_COUNT_OK', 'Unit counting completed', unitCounts));
    
    logs.push(debugLog('GRADES_SUCCESS', 'Grades data test completed successfully'));
    return result;

  } catch (error) {
    logs.push(debugLog('GRADES_ERROR', 'Grades data test failed', error.message));
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString(),
      logs: logs
    };
  }
}

/**
 * Test actual getGradeDataByUnit service with debug info
 */
function testGetGradeDataByUnitDebug(unitId = 'HDPE') {
  const logs = [];
  
  try {
    logs.push(debugLog('DEBUG_START', 'Starting getGradeDataByUnit debug test', { unitId }));
    
    const result = {
      success: true,
      debug: {},
      unitId: unitId,
      timestamp: new Date().toISOString(),
      logs: logs
    };

    // Step 1: Get grades
    logs.push(debugLog('DEBUG_GRADES', 'Getting Grades sheet'));
    const gradesSheet = getSheet('Grades');
    const gradesData = gradesSheet.getDataRange().getValues();
    const gradesHeaders = gradesData[0];
    logs.push(debugLog('DEBUG_GRADES_OK', 'Grades data retrieved', { rowCount: gradesData.length - 1 }));
    
    result.debug.gradesSheet = {
      headers: gradesHeaders,
      totalRows: gradesData.length - 1,
      sampleRow: gradesData[1] // First data row
    };

    // Step 2: Filter grades by unit
    logs.push(debugLog('DEBUG_FILTER', 'Filtering grades by unit', { unitId }));
    const grades = gradesData.slice(1).map(row => {
      const obj = {};
      gradesHeaders.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    }).filter(grade => grade.unit_id === unitId && grade.status === true);

    logs.push(debugLog('DEBUG_FILTER_OK', 'Grades filtered', { originalCount: gradesData.length - 1, filteredCount: grades.length }));
    result.debug.filteredGrades = {
      count: grades.length,
      sample: grades.slice(0, 2) // First 2 grades
    };

    // Step 3: Get NetWeights
    logs.push(debugLog('DEBUG_NETWEIGHTS', 'Getting NetWeights sheet'));
    const netWeightsSheet = getSheet('NetWeights');
    const netWeightsData = netWeightsSheet.getDataRange().getValues();
    logs.push(debugLog('DEBUG_NETWEIGHTS_OK', 'NetWeights data retrieved', { rowCount: netWeightsData.length - 1 }));
    
    result.debug.netWeightsSheet = {
      totalRows: netWeightsData.length - 1,
      sampleRow: netWeightsData[1]
    };

    // Step 4: Get GradeNetWeights
    logs.push(debugLog('DEBUG_GRADENETWEIGHTS', 'Getting GradeNetWeights sheet'));
    const gradeNetWeightsSheet = getSheet('GradeNetWeights');
    const gradeNetWeightsData = gradeNetWeightsSheet.getDataRange().getValues();
    logs.push(debugLog('DEBUG_GRADENETWEIGHTS_OK', 'GradeNetWeights data retrieved', { rowCount: gradeNetWeightsData.length - 1 }));
    
    result.debug.gradeNetWeightsSheet = {
      totalRows: gradeNetWeightsData.length - 1,
      sampleRow: gradeNetWeightsData[1]
    };

    // If we reach here, the basic data access works
    result.message = "All sheet access tests passed - issue may be in data processing";
    logs.push(debugLog('DEBUG_SUCCESS', 'Debug test completed successfully'));
    
    return result;

  } catch (error) {
    logs.push(debugLog('DEBUG_ERROR', 'Debug test failed', error.message));
    return {
      success: false,
      error: error.message,
      errorStep: "Failed during debug test",
      timestamp: new Date().toISOString(),
      logs: logs
    };
  }
}

/**
 * Test the complete getGradeDataByUnit flow
 */
function testCompleteFlow(unitId = 'HDPE') {
  const logs = [];
  
  try {
    logs.push(debugLog('COMPLETE_START', 'Starting complete flow test', { unitId }));
    
    // Use the actual service function
    const result = getGradeDataByUnitService(unitId);
    logs.push(debugLog('COMPLETE_SUCCESS', 'Complete flow test passed'));
    
    return {
      success: true,
      message: "Complete flow test passed",
      serviceResult: result,
      timestamp: new Date().toISOString(),
      logs: logs
    };
  } catch (error) {
    logs.push(debugLog('COMPLETE_ERROR', 'Complete flow test failed', error.message));
    return {
      success: false,
      error: error.message,
      errorStep: "Failed in actual service function",
      timestamp: new Date().toISOString(),
      logs: logs
    };
  }
}

/**
 * Run all tests in sequence with comprehensive logging
 */
function runAllDebugTests(unitId = 'HDPE') {
  const logs = [];
  const allResults = {};
  
  logs.push(debugLog('ALL_START', 'Starting all debug tests', { unitId }));
  
  // Test 1: Simple test
  try {
    logs.push(debugLog('ALL_TEST1', 'Running testSimple()'));
    allResults.test1_simple = testSimple();
    logs.push(debugLog('ALL_TEST1_OK', 'testSimple() completed'));
  } catch (error) {
    logs.push(debugLog('ALL_TEST1_ERROR', 'testSimple() failed', error.message));
    allResults.test1_simple = { success: false, error: error.message };
  }
  
  // Test 2: Utilities test
  try {
    logs.push(debugLog('ALL_TEST2', 'Running testUtilities()'));
    allResults.test2_utilities = testUtilities();
    logs.push(debugLog('ALL_TEST2_OK', 'testUtilities() completed'));
  } catch (error) {
    logs.push(debugLog('ALL_TEST2_ERROR', 'testUtilities() failed', error.message));
    allResults.test2_utilities = { success: false, error: error.message };
  }
  
  // Test 3: Spreadsheet test
  try {
    logs.push(debugLog('ALL_TEST3', 'Running testSpreadsheet()'));
    allResults.test3_spreadsheet = testSpreadsheet();
    logs.push(debugLog('ALL_TEST3_OK', 'testSpreadsheet() completed'));
  } catch (error) {
    logs.push(debugLog('ALL_TEST3_ERROR', 'testSpreadsheet() failed', error.message));
    allResults.test3_spreadsheet = { success: false, error: error.message };
  }
  
  // Test 4: Grades data test
  try {
    logs.push(debugLog('ALL_TEST4', 'Running testGradesData()'));
    allResults.test4_gradesData = testGradesData();
    logs.push(debugLog('ALL_TEST4_OK', 'testGradesData() completed'));
  } catch (error) {
    logs.push(debugLog('ALL_TEST4_ERROR', 'testGradesData() failed', error.message));
    allResults.test4_gradesData = { success: false, error: error.message };
  }
  
  // Test 5: Debug test
  try {
    logs.push(debugLog('ALL_TEST5', 'Running testGetGradeDataByUnitDebug()'));
    allResults.test5_debug = testGetGradeDataByUnitDebug(unitId);
    logs.push(debugLog('ALL_TEST5_OK', 'testGetGradeDataByUnitDebug() completed'));
  } catch (error) {
    logs.push(debugLog('ALL_TEST5_ERROR', 'testGetGradeDataByUnitDebug() failed', error.message));
    allResults.test5_debug = { success: false, error: error.message };
  }
  
  // Test 6: Complete flow test
  try {
    logs.push(debugLog('ALL_TEST6', 'Running testCompleteFlow()'));
    allResults.test6_completeFlow = testCompleteFlow(unitId);
    logs.push(debugLog('ALL_TEST6_OK', 'testCompleteFlow() completed'));
  } catch (error) {
    logs.push(debugLog('ALL_TEST6_ERROR', 'testCompleteFlow() failed', error.message));
    allResults.test6_completeFlow = { success: false, error: error.message };
  }
  
  logs.push(debugLog('ALL_COMPLETE', 'All debug tests completed'));
  
  return {
    success: true,
    message: "All debug tests completed",
    unitId: unitId,
    allResults: allResults,
    timestamp: new Date().toISOString(),
    logs: logs
  };
}

// ========================================
// WRAPPER FUNCTIONS สำหรับการทดสอบง่ายๆ
// ========================================

/**
 * Wrapper function สำหรับ testSimple() - ใช้ Logger.log แสดงผลลัพธ์
 */
function runTestSimple() {
  Logger.log('=== STARTING TEST SIMPLE ===');
  const result = testSimple();
  Logger.log('=== TEST SIMPLE RESULT ===');
  Logger.log(JSON.stringify(result, null, 2));
  Logger.log('=== TEST SIMPLE COMPLETED ===');
}

/**
 * Wrapper function สำหรับ testUtilities() - ใช้ Logger.log แสดงผลลัพธ์
 */
function runTestUtilities() {
  Logger.log('=== STARTING TEST UTILITIES ===');
  const result = testUtilities();
  Logger.log('=== TEST UTILITIES RESULT ===');
  Logger.log(JSON.stringify(result, null, 2));
  Logger.log('=== TEST UTILITIES COMPLETED ===');
}

/**
 * Wrapper function สำหรับ testSpreadsheet() - ใช้ Logger.log แสดงผลลัพธ์
 */
function runTestSpreadsheet() {
  Logger.log('=== STARTING TEST SPREADSHEET ===');
  const result = testSpreadsheet();
  Logger.log('=== TEST SPREADSHEET RESULT ===');
  Logger.log(JSON.stringify(result, null, 2));
  Logger.log('=== TEST SPREADSHEET COMPLETED ===');
}

/**
 * Wrapper function สำหรับ testGradesData() - ใช้ Logger.log แสดงผลลัพธ์
 */
function runTestGradesData() {
  Logger.log('=== STARTING TEST GRADES DATA ===');
  const result = testGradesData();
  Logger.log('=== TEST GRADES DATA RESULT ===');
  Logger.log(JSON.stringify(result, null, 2));
  Logger.log('=== TEST GRADES DATA COMPLETED ===');
}

/**
 * Wrapper function สำหรับ testCompleteFlow() - ใช้ Logger.log แสดงผลลัพธ์
 */
function runTestCompleteFlow() {
  Logger.log('=== STARTING TEST COMPLETE FLOW ===');
  const result = testCompleteFlow('HDPE');
  Logger.log('=== TEST COMPLETE FLOW RESULT ===');
  Logger.log(JSON.stringify(result, null, 2));
  Logger.log('=== TEST COMPLETE FLOW COMPLETED ===');
}

/**
 * Wrapper function สำหรับ runAllDebugTests() - ใช้ Logger.log แสดงผลลัพธ์
 */
function runAllTests() {
  Logger.log('=== STARTING ALL DEBUG TESTS ===');
  const result = runAllDebugTests('HDPE');
  Logger.log('=== ALL TESTS RESULT ===');
  Logger.log(JSON.stringify(result, null, 2));
  Logger.log('=== ALL TESTS COMPLETED ===');
}