/**
 * @file Code.js
 * @description Main entry point for HD Print Tag Jumbo Google Apps Script API
 * @author HD_Print_Tag_System
 * @created 2025-12-11
 */

// Controller Functions
function getPublicEndpoints() {
  const endpoints = [
    'healthCheck',
    'getUnits',
    'getGradesByUnit',
    'getAllGrades',
    'getNetWeightsByGrade',
    'getAllNetWeights',
    'getGradeDataByUnit',
    'addNetWeightToGrade',
    'removeNetWeightFromGrade',
    'updateNetWeightSortOrder',
    'getUnitById',
    'getGradeById',
    'createUnit',
    'createGrade',
    'updateUnit',
    'updateGrade',
    'deleteGrade'
  ];
  
  return endpoints;
}

// Utility Functions
function createCorsResponse(data, statusCode = 200) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

// Authentication verification function (simplified for now)
function verifyAuthentication(token) {
  if (!token) {
    return { isValid: false, error: 'Authentication token is required' };
  }
  
  if (typeof token === 'string' && token.length > 10) {
    return { isValid: true, userId: 'system' };
  }
  
  return { isValid: false, error: 'Invalid authentication token' };
}

// Main GET endpoint handler
function doGet(e) {
  try {
    const params = e.parameter;
    const action = params.action;
    
    if (!action) {
      return createCorsResponse({
        success: false,
        error: 'Action parameter is required',
        timestamp: getNow()
      });
    }
    
    const publicEndpoints = getPublicEndpoints();
    
    if (!publicEndpoints.includes(action)) {
      return createCorsResponse({
        success: false,
        error: 'Invalid or unauthorized action specified for GET request',
        timestamp: getNow()
      });
    }
    
    let result;
    switch (action) {
      case 'healthCheck':
        result = healthCheck();
        break;
        
      case 'getUnits':
        result = getUnitsController();
        break;
        
      case 'getGradesByUnit':
        if (!params.unitId) {
          throw new Error('unitId parameter is required');
        }
        result = getGradesByUnitController(params.unitId);
        break;
        
      case 'getAllGrades':
        result = getAllGradesController();
        break;
        
      case 'getNetWeightsByGrade':
        if (!params.gradeId) {
          throw new Error('gradeId parameter is required');
        }
        result = getNetWeightsByGradeController(params.gradeId);
        break;
        
      case 'getAllNetWeights':
        result = getAllNetWeightsController();
        break;
        
      case 'getGradeDataByUnit':
        if (!params.unitId) {
          throw new Error('unitId parameter is required');
        }
        result = getGradeDataByUnitController(params.unitId);
        break;
        
      case 'getUnitById':
        if (!params.unitId) {
          throw new Error('unitId parameter is required');
        }
        result = getUnitByIdController(params.unitId);
        break;
        
      case 'getGradeById':
        if (!params.gradeId) {
          throw new Error('gradeId parameter is required');
        }
        result = getGradeByIdController(params.gradeId);
        break;
        
      default:
        throw new Error('Action not implemented: ' + action);
    }
    
    return createCorsResponse(result);
    
  } catch (error) {
    console.error('doGet Error:', error);
    return createCorsResponse({
      success: false,
      error: error.message,
      timestamp: getNow()
    }, 500);
  }
}

// Main POST endpoint handler
function doPost(e) {
  try {
    const params = e.parameter;
    const action = params.action;
    
    if (!action) {
      return createCorsResponse({
        success: false,
        error: 'Action parameter is required',
        timestamp: getNow()
      });
    }
    
    let result;
    switch (action) {
      case 'addNetWeightToGrade':
        if (!params.gradeId || !params.weightValue) {
          throw new Error('gradeId and weightValue parameters are required');
        }
        result = addNetWeightToGradeController(
          params.gradeId, 
          params.weightValue, 
          params.sortOrder
        );
        break;
        
      case 'removeNetWeightFromGrade':
        if (!params.gradeId || !params.netweightId) {
          throw new Error('gradeId and netweightId parameters are required');
        }
        result = removeNetWeightFromGradeController(params.gradeId, params.netweightId);
        break;
        
      case 'updateNetWeightSortOrder':
        if (!params.gradeId || !params.netWeightOrders) {
          throw new Error('gradeId and netWeightOrders parameters are required');
        }
        try {
          const orders = JSON.parse(params.netWeightOrders);
          result = updateNetWeightSortOrderController(params.gradeId, orders);
        } catch (parseError) {
          throw new Error('Invalid netWeightOrders JSON format');
        }
        break;
        
      case 'createUnit':
        if (!params.unitData) {
          throw new Error('unitData parameter is required');
        }
        try {
          const unitData = JSON.parse(params.unitData);
          result = createUnitController(unitData);
        } catch (parseError) {
          throw new Error('Invalid unitData JSON format');
        }
        break;
        
      case 'createGrade':
        if (!params.gradeData) {
          throw new Error('gradeData parameter is required');
        }
        try {
          const gradeData = JSON.parse(params.gradeData);
          result = createGradeController(gradeData);
        } catch (parseError) {
          throw new Error('Invalid gradeData JSON format');
        }
        break;
        
      default:
        throw new Error('Action not implemented for POST: ' + action);
    }
    
    return createCorsResponse(result);
    
  } catch (error) {
    console.error('doPost Error:', error);
    return createCorsResponse({
      success: false,
      error: error.message,
      timestamp: getNow()
    }, 500);
  }
}

// Health check function
function healthCheck() {
  try {
    const spreadsheet = getSpreadsheet();
    const sheets = ['Units', 'Grades', 'NetWeights', 'GradeNetWeights'];
    
    const sheetsStatus = {};
    for (let sheetName of sheets) {
      try {
        const sheet = getSheet(sheetName);
        sheetsStatus[sheetName] = {
          exists: true,
          rowCount: sheet.getLastRow(),
          colCount: sheet.getLastColumn()
        };
      } catch (error) {
        sheetsStatus[sheetName] = {
          exists: false,
          error: error.message
        };
      }
    }
    
    return {
      success: true,
      status: 'healthy',
      spreadsheetId: SPREADSHEET_ID,
      sheets: sheetsStatus,
      timestamp: getNow()
    };
  } catch (error) {
    return {
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: getNow()
    };
  }
}