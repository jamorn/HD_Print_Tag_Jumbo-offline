/**
 * @file Controller_NetWeights.js
 * @description Controller functions for NetWeights and GradeNetWeights operations
 * @author HD_Print_Tag_System
 * @created 2025-12-11
 */

/**
 * Controller for getting netweights by grade
 * @param {number} gradeId - Grade ID to get netweights for
 * @returns {Object} Result object with netweights data
 */
function getNetWeightsByGradeController(gradeId) {
  try {
    if (!gradeId) {
      throw new Error('Grade ID is required');
    }
    return getNetWeightsByGradeService(gradeId);
  } catch (error) {
    console.error('Error in getNetWeightsByGradeController:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: getNow()
    };
  }
}

/**
 * Controller for adding netweight to grade
 * @param {number} gradeId - Grade ID
 * @param {number} weightValue - Weight value to add
 * @param {number} sortOrder - Sort order (optional)
 * @returns {Object} Result object with operation status
 */
function addNetWeightToGradeController(gradeId, weightValue, sortOrder) {
  try {
    if (!gradeId || !weightValue) {
      throw new Error('Grade ID and weight value are required');
    }
    
    // Validate weight value is a number
    const weight = Number(weightValue);
    if (isNaN(weight) || weight <= 0) {
      throw new Error('Weight value must be a positive number');
    }
    
    return addNetWeightToGradeService(gradeId, weight, sortOrder);
  } catch (error) {
    console.error('Error in addNetWeightToGradeController:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: getNow()
    };
  }
}

/**
 * Controller for removing netweight from grade
 * @param {number} gradeId - Grade ID
 * @param {number} netweightId - NetWeight ID to remove
 * @returns {Object} Result object with operation status
 */
function removeNetWeightFromGradeController(gradeId, netweightId) {
  try {
    if (!gradeId || !netweightId) {
      throw new Error('Grade ID and NetWeight ID are required');
    }
    
    return removeNetWeightFromGradeService(gradeId, netweightId);
  } catch (error) {
    console.error('Error in removeNetWeightFromGradeController:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: getNow()
    };
  }
}

/**
 * Controller for getting all available netweights
 * @returns {Object} Result object with all netweights
 */
function getAllNetWeightsController() {
  try {
    return getAllNetWeightsService();
  } catch (error) {
    console.error('Error in getAllNetWeightsController:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: getNow()
    };
  }
}

/**
 * Controller for updating netweight sort order for a grade
 * @param {number} gradeId - Grade ID
 * @param {Array} netWeightOrders - Array of {netweightId, sortOrder} objects
 * @returns {Object} Result object with operation status
 */
function updateNetWeightSortOrderController(gradeId, netWeightOrders) {
  try {
    if (!gradeId || !Array.isArray(netWeightOrders)) {
      throw new Error('Grade ID and netweight orders array are required');
    }
    
    return updateNetWeightSortOrderService(gradeId, netWeightOrders);
  } catch (error) {
    console.error('Error in updateNetWeightSortOrderController:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: getNow()
    };
  }
}