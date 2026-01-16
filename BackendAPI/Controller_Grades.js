/**
 * @file Controller_Grades.js
 * @description Controller functions for Grades operations
 * @author HD_Print_Tag_System
 * @created 2025-12-11
 */

/**
 * Controller for getting grades by unit
 * @param {string} unitId - Unit ID to filter grades
 * @returns {Object} Result object with grades data
 */
function getGradesByUnitController(unitId) {
  try {
    if (!unitId) {
      throw new Error('Unit ID is required');
    }
    return getGradesByUnitService(unitId);
  } catch (error) {
    console.error('Error in getGradesByUnitController:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: getNow()
    };
  }
}

/**
 * Controller for getting grade data formatted for frontend UnitConfig
 * @param {string} unitId - Unit ID to filter grades
 * @returns {Object} Result object with grades data in UnitConfig format
 */
function getGradeDataByUnitController(unitId) {
  try {
    if (!unitId) {
      throw new Error('Unit ID is required');
    }
    return getGradeDataByUnitService(unitId);
  } catch (error) {
    console.error('Error in getGradeDataByUnitController:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: getNow()
    };
  }
}

/**
 * Controller for getting all grades
 * @returns {Object} Result object with all grades data
 */
function getAllGradesController() {
  try {
    return getAllGradesService();
  } catch (error) {
    console.error('Error in getAllGradesController:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: getNow()
    };
  }
}

/**
 * Controller for getting grade by ID
 * @param {number} gradeId - Grade ID to retrieve
 * @returns {Object} Result object with grade data
 */
function getGradeByIdController(gradeId) {
  try {
    if (!gradeId) {
      throw new Error('Grade ID is required');
    }
    return getGradeByIdService(gradeId);
  } catch (error) {
    console.error('Error in getGradeByIdController:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: getNow()
    };
  }
}

/**
 * Controller for creating new grade
 * @param {Object} gradeData - Grade data to create
 * @returns {Object} Result object with creation status
 */
function createGradeController(gradeData) {
  try {
    // Validate required fields
    const requiredFields = ['unit_id', 'grade_code', 'description'];
    for (let field of requiredFields) {
      if (!gradeData[field]) {
        throw new Error(`${field} is required`);
      }
    }
    
    return createGradeService(gradeData);
  } catch (error) {
    console.error('Error in createGradeController:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: getNow()
    };
  }
}