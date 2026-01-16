/**
 * @file Utils_Utilities.js
 * @description Utility functions for HD Print Tag Jumbo system
 * @author HD_Print_Tag_System
 * @created 2025-12-11
 */

/**
 * Test function for getNow utility
 */
function testGetNow() {
  console.log('getNow() => ' + getNow());
  return getNow();
}

/**
 * Get current timestamp in Bangkok timezone
 * @returns {string} Formatted timestamp
 */
function getNow() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm:ss");
}

/**
 * Get UTC+7 time (Bangkok/Jakarta timezone)
 * @returns {string} ISO 8601 formatted string with timezone offset
 */
function getUtcPlusSevenTime() {
  const now = new Date();
  const timeZone = 'Asia/Bangkok';
  const utcPlusSevenString = Utilities.formatDate(now, timeZone, 'yyyy-MM-dd\'T\'HH:mm:ssXXX');
  
  console.log('UTC+7 Time:', utcPlusSevenString);
  return utcPlusSevenString;
}

/**
 * Format date to specific format
 * @param {Date} date - Date to format
 * @param {string} format - Format string (default: 'yyyy-MM-dd HH:mm:ss')
 * @returns {string} Formatted date string
 */
function formatDate(date, format = 'yyyy-MM-dd HH:mm:ss') {
  return Utilities.formatDate(date, API_CONFIG.DEFAULT_TIMEZONE, format);
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate unique ID
 * @param {number} length - Length of ID (default: 8)
 * @returns {string} Random ID string
 */
function generateUniqueId(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Convert array to object using headers
 * @param {Array} headers - Array of header names
 * @param {Array} row - Array of values
 * @returns {Object} Object with header keys and row values
 */
function arrayToObject(headers, row) {
  const obj = {};
  headers.forEach((header, index) => {
    obj[header] = row[index];
  });
  return obj;
}

/**
 * Convert object to array using headers order
 * @param {Object} obj - Object to convert
 * @param {Array} headers - Array of header names in desired order
 * @returns {Array} Array of values in header order
 */
function objectToArray(obj, headers) {
  return headers.map(header => obj[header]);
}

/**
 * Deep clone an object
 * @param {Object} obj - Object to clone
 * @returns {Object} Deep cloned object
 */
function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Sanitize string for sheet usage
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
function sanitizeString(str) {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[\r\n\t]/g, ' ');
}

/**
 * Check if value is empty (null, undefined, empty string, or whitespace only)
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 */
function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

/**
 * Log error with context
 * @param {string} functionName - Name of function where error occurred
 * @param {Error} error - Error object
 * @param {Object} context - Additional context data
 */
function logError(functionName, error, context = {}) {
  const errorInfo = {
    timestamp: getNow(),
    function: functionName,
    error: error.message,
    stack: error.stack,
    context: context
  };
  
  console.error('Error Log:', JSON.stringify(errorInfo, null, 2));
}

/**
 * Create standardized API response
 * @param {boolean} success - Success status
 * @param {*} data - Response data
 * @param {string} message - Response message
 * @param {Object} meta - Additional metadata
 * @returns {Object} Standardized response object
 */
function createApiResponse(success, data = null, message = '', meta = {}) {
  const response = {
    success: success,
    timestamp: getNow(),
    ...meta
  };
  
  if (data !== null) {
    response.data = data;
  }
  
  if (message) {
    if (success) {
      response.message = message;
    } else {
      response.error = message;
    }
  }
  
  return response;
}

/**
 * Validate required parameters
 * @param {Object} params - Parameters object
 * @param {Array} required - Array of required parameter names
 * @throws {Error} If any required parameter is missing
 */
function validateRequiredParams(params, required) {
  const missing = [];
  
  for (let param of required) {
    if (isEmpty(params[param])) {
      missing.push(param);
    }
  }
  
  if (missing.length > 0) {
    throw new Error(`Missing required parameters: ${missing.join(', ')}`);
  }
}

/**
 * Get next available ID from sheet
 * @param {SpreadsheetApp.Sheet} sheet - Sheet to get next ID from
 * @param {number} idColumnIndex - Index of ID column (0-based)
 * @returns {number} Next available ID
 */
function getNextId(sheet, idColumnIndex = 0) {
  const data = sheet.getDataRange().getValues();
  let maxId = 0;
  
  if (data.length > 1) {
    for (let i = 1; i < data.length; i++) {
      const currentId = Number(data[i][idColumnIndex]);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
  }
  
  return maxId + 1;
}

/**
 * Test all utility functions
 */
function testUtilities() {
  console.log('Testing Utilities...');
  
  // Test getNow
  console.log('Current time:', getNow());
  
  // Test getUtcPlusSevenTime
  console.log('UTC+7 time:', getUtcPlusSevenTime());
  
  // Test email validation
  console.log('Valid email test:', isValidEmail('test@example.com'));
  console.log('Invalid email test:', isValidEmail('invalid-email'));
  
  // Test unique ID generation
  console.log('Generated ID:', generateUniqueId());
  
  // Test array/object conversion
  const headers = ['id', 'name', 'value'];
  const row = [1, 'test', 100];
  const obj = arrayToObject(headers, row);
  console.log('Array to object:', obj);
  console.log('Object to array:', objectToArray(obj, headers));
  
  // Test isEmpty
  console.log('isEmpty tests:');
  console.log('- null:', isEmpty(null));
  console.log('- empty string:', isEmpty(''));
  console.log('- whitespace:', isEmpty('   '));
  console.log('- valid string:', isEmpty('test'));
  console.log('- empty array:', isEmpty([]));
  console.log('- empty object:', isEmpty({}));
  
  console.log('Utilities test completed!');
}