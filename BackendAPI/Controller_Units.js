/**
 * @file Controller_Units.js
 * @description Controller functions for Units operations
 * @author HD_Print_Tag_System
 * @created 2025-12-11
 */

/**
 * Controller for getting all units
 * @returns {Object} Result object with units data
 */
function getUnitsController() {
  try {
    return getUnitsService();
  } catch (error) {
    console.error('Error in getUnitsController:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: getNow()
    };
  }
}

/**
 * Controller for getting unit by ID
 * @param {string} unitId - Unit ID to retrieve
 * @returns {Object} Result object with unit data
 */
function getUnitByIdController(unitId) {
  try {
    if (!unitId) {
      throw new Error('Unit ID is required');
    }
    return getUnitByIdService(unitId);
  } catch (error) {
    console.error('Error in getUnitByIdController:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: getNow()
    };
  }
}

/**
 * Controller for creating new unit
 * @param {Object} unitData - Unit data to create
 * @returns {Object} Result object with creation status
 */
function createUnitController(unitData) {
  try {
    // Validate required fields
    const requiredFields = ['unit_id', 'unit_name', 'full_name'];
    for (let field of requiredFields) {
      if (!unitData[field]) {
        throw new Error(`${field} is required`);
      }
    }
    
    return createUnitService(unitData);
  } catch (error) {
    console.error('Error in createUnitController:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: getNow()
    };
  }
}