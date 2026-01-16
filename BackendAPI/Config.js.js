/**
 * @file Config.js
 * @description Configuration constants, sheet schemas, and utility functions for HD Print Tag Jumbo backend
 * @namespace CONFIG
 * @author HD_Print_Tag_System
 * @created 2025-12-11
 */

/**
 * Google Spreadsheet ID for HD Print Tag Database
 * @constant {string} // OLD URL var SPREADSHEET_ID = '1zBo34SFrziKjMCsLDq3AL-gBH8yDE0AavcLLzn8UAg';
 */
var SPREADSHEET_ID = '1zBo34SFrziKjMCsLJDq3AL-gBH8yDE0AavcLLzn8UAg';

/**
 * Sheet schema definitions for all sheets (headers, dataTypes)
 * @typedef {Object} SheetSchema
 * @property {string[]} headers - List of column names
 * @property {string[]} dataTypes - List of data types for each column
 */

/**
 * @type {Object.<string, SheetSchema>}
 */
var SHEET_SCHEMAS = {
  Units: {
    headers: ["unit_id","unit_name","full_name","description","status","created_at","updated_at"],
    dataTypes: ["string","string","string","string","boolean","object (Date)","object (Date)"]
  },
  Grades: {
    headers: ["grade_id","unit_id","grade_code","description","status","has_sub","created_at","updated_at"],
    dataTypes: ["number","string","string","string","boolean","boolean","object (Date)","object (Date)"]
  },
  NetWeights: {
    headers: ["netweight_id","weight_value","is_active","created_at"],
    dataTypes: ["number","number","boolean","object (Date)"]
  },
  GradeNetWeights: {
    headers: ["id","grade_id","netweight_id","sort_order","is_active","created_at"],
    dataTypes: ["number","number","number","number","boolean","object (Date)"]
  },
};

/**
 * Column index definitions for easy access
 * @type {Object.<string, Object.<string, number>>}
 */
var COLUMNS = {
  Units: {
    unit_id: 0,
    unit_name: 1,
    full_name: 2,
    description: 3,
    status: 4,
    created_at: 5,
    updated_at: 6
  },
  Grades: {
    grade_id: 0,
    unit_id: 1,
    grade_code: 2,
    description: 3,
    status: 4,
    has_sub: 5,
    created_at: 6,
    updated_at: 7
  },
  NetWeights: {
    netweight_id: 0,
    weight_value: 1,
    is_active: 2,
    created_at: 3
  },
  GradeNetWeights: {
    id: 0,
    grade_id: 1,
    netweight_id: 2,
    sort_order: 3,
    is_active: 4,
    created_at: 5
  }
};

/**
 * API Configuration
 */
var API_CONFIG = {
  VERSION: '1.0.0',
  CORS_ENABLED: true,
  DEFAULT_TIMEZONE: 'Asia/Bangkok',
  DATE_FORMAT: 'yyyy-MM-dd HH:mm:ss',
  MAX_RECORDS_PER_REQUEST: 1000
};

/**
 * Utility functions
 */

/**
 * Get spreadsheet instance
 * @returns {SpreadsheetApp.Spreadsheet} Spreadsheet instance
 * @throws {Error} When spreadsheet cannot be opened
 */
function getSpreadsheet() {
  try {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  } catch (error) {
    throw new Error('Unable to open spreadsheet: ' + error.message);
  }
}

/**
 * Get sheet by name with error handling
 * @param {string} sheetName - Name of the sheet
 * @returns {SpreadsheetApp.Sheet} Sheet instance
 * @throws {Error} When sheet is not found
 */
function getSheet(sheetName) {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('Sheet "' + sheetName + '" not found');
  }
  return sheet;
}

/**
 * Get current timestamp in Asia/Bangkok timezone
 * @returns {string} Formatted timestamp
 */
function getNow() {
  return Utilities.formatDate(new Date(), API_CONFIG.DEFAULT_TIMEZONE, API_CONFIG.DATE_FORMAT);
}

/**
 * Validate sheet data types
 * @param {string} sheetName - Sheet name to validate
 * @param {Array[]} data - Data to validate
 * @returns {boolean} True if valid
 */
function validateSheetData(sheetName, data) {
  const schema = SHEET_SCHEMAS[sheetName];
  if (!schema) {
    throw new Error('Schema not found for sheet: ' + sheetName);
  }
  
  // Add validation logic here if needed
  return true;
}