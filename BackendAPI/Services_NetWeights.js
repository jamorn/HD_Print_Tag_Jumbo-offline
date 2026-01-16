/**
 * @file Services_NetWeights.js
 * @description Service layer for NetWeights and GradeNetWeights operations
 * @author HD_Print_Tag_System
 * @created 2025-12-11
 */

/**
 * Get netweights for a specific grade
 * @param {number} gradeId - Grade ID to get netweights for
 * @returns {Object} Result object with netweights data
 * @throws {Error} When sheets cannot be accessed or data is invalid
 */
function getNetWeightsByGradeService(gradeId) {
  try {
    const junctionSheet = getSheet('GradeNetWeights');
    const netWeightsSheet = getSheet('NetWeights');
    
    // Get junction data
    const junctionData = junctionSheet.getDataRange().getValues();
    const junctionHeaders = junctionData[0];
    
    const junctionRecords = junctionData.slice(1).map(row => {
      const obj = {};
      junctionHeaders.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    }).filter(record => 
      Number(record.grade_id) === Number(gradeId) && record.is_active === true
    ).sort((a, b) => a.sort_order - b.sort_order);
    
    // Get netweight details
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
    
    const result = junctionRecords.map(record => {
      const netWeight = netWeightsMap.get(record.netweight_id);
      return {
        netweight_id: record.netweight_id,
        weight_value: netWeight.weight_value,
        sort_order: record.sort_order,
        junction_id: record.id
      };
    });
    
    return {
      success: true,
      data: result,
      count: result.length,
      grade_id: Number(gradeId),
      timestamp: getNow()
    };
  } catch (error) {
    throw new Error('Failed to get netweights by grade: ' + error.message);
  }
}

/**
 * Add netweight to grade
 * @param {number} gradeId - Grade ID
 * @param {number} weightValue - Weight value to add
 * @param {number} sortOrder - Sort order (optional)
 * @returns {Object} Result object with operation status
 * @throws {Error} When operation fails
 */
function addNetWeightToGradeService(gradeId, weightValue, sortOrder) {
  try {
    // First, find or create the netweight
    let netweightId = findOrCreateNetWeight(weightValue);
    
    // Check if junction record already exists
    const junctionSheet = getSheet('GradeNetWeights');
    const junctionData = junctionSheet.getDataRange().getValues();
    
    const existingRecord = junctionData.slice(1).find(row => 
      Number(row[COLUMNS.GradeNetWeights.grade_id]) === Number(gradeId) && 
      Number(row[COLUMNS.GradeNetWeights.netweight_id]) === Number(netweightId) &&
      row[COLUMNS.GradeNetWeights.is_active] === true
    );
    
    if (existingRecord) {
      throw new Error('NetWeight already exists for this grade');
    }
    
    // Get next junction ID
    let maxId = 0;
    if (junctionData.length > 1) {
      for (let i = 1; i < junctionData.length; i++) {
        const currentId = Number(junctionData[i][COLUMNS.GradeNetWeights.id]);
        if (currentId > maxId) {
          maxId = currentId;
        }
      }
    }
    const newId = maxId + 1;
    
    // Determine sort order if not provided
    if (!sortOrder) {
      const existingSortOrders = junctionData.slice(1)
        .filter(row => 
          Number(row[COLUMNS.GradeNetWeights.grade_id]) === Number(gradeId) &&
          row[COLUMNS.GradeNetWeights.is_active] === true
        )
        .map(row => Number(row[COLUMNS.GradeNetWeights.sort_order]));
      
      sortOrder = existingSortOrders.length > 0 ? Math.max(...existingSortOrders) + 1 : 1;
    }
    
    const now = getNow();
    
    // Add junction record
    const rowData = [
      newId,
      Number(gradeId),
      netweightId,
      sortOrder,
      true,
      now
    ];
    
    junctionSheet.appendRow(rowData);
    
    return {
      success: true,
      message: 'NetWeight added to grade successfully',
      data: {
        junction_id: newId,
        grade_id: Number(gradeId),
        netweight_id: netweightId,
        weight_value: weightValue,
        sort_order: sortOrder
      },
      timestamp: getNow()
    };
  } catch (error) {
    throw new Error('Failed to add netweight to grade: ' + error.message);
  }
}

/**
 * Remove netweight from grade (soft delete)
 * @param {number} gradeId - Grade ID
 * @param {number} netweightId - NetWeight ID to remove
 * @returns {Object} Result object with operation status
 * @throws {Error} When operation fails
 */
function removeNetWeightFromGradeService(gradeId, netweightId) {
  try {
    const junctionSheet = getSheet('GradeNetWeights');
    const data = junctionSheet.getDataRange().getValues();
    
    // Find the junction record
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (Number(data[i][COLUMNS.GradeNetWeights.grade_id]) === Number(gradeId) && 
          Number(data[i][COLUMNS.GradeNetWeights.netweight_id]) === Number(netweightId) &&
          data[i][COLUMNS.GradeNetWeights.is_active] === true) {
        rowIndex = i + 1; // Sheet rows are 1-indexed
        break;
      }
    }
    
    if (rowIndex === -1) {
      throw new Error('NetWeight not found for this grade');
    }
    
    // Set is_active to false (soft delete)
    junctionSheet.getRange(rowIndex, COLUMNS.GradeNetWeights.is_active + 1).setValue(false);
    
    return {
      success: true,
      message: 'NetWeight removed from grade successfully',
      data: {
        grade_id: Number(gradeId),
        netweight_id: Number(netweightId)
      },
      timestamp: getNow()
    };
  } catch (error) {
    throw new Error('Failed to remove netweight from grade: ' + error.message);
  }
}

/**
 * Get all available netweights
 * @returns {Object} Result object with all netweights
 * @throws {Error} When operation fails
 */
function getAllNetWeightsService() {
  try {
    const sheet = getSheet('NetWeights');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const result = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    }).filter(netweight => netweight.is_active === true)
      .sort((a, b) => a.weight_value - b.weight_value);
    
    return {
      success: true,
      data: result,
      count: result.length,
      timestamp: getNow()
    };
  } catch (error) {
    throw new Error('Failed to get all netweights: ' + error.message);
  }
}

/**
 * Update sort order for netweights of a grade
 * @param {number} gradeId - Grade ID
 * @param {Array} netWeightOrders - Array of {netweightId, sortOrder} objects
 * @returns {Object} Result object with operation status
 * @throws {Error} When operation fails
 */
function updateNetWeightSortOrderService(gradeId, netWeightOrders) {
  try {
    const junctionSheet = getSheet('GradeNetWeights');
    const data = junctionSheet.getDataRange().getValues();
    
    let updatedCount = 0;
    
    for (let orderData of netWeightOrders) {
      // Find the junction record
      let rowIndex = -1;
      for (let i = 1; i < data.length; i++) {
        if (Number(data[i][COLUMNS.GradeNetWeights.grade_id]) === Number(gradeId) && 
            Number(data[i][COLUMNS.GradeNetWeights.netweight_id]) === Number(orderData.netweightId) &&
            data[i][COLUMNS.GradeNetWeights.is_active] === true) {
          rowIndex = i + 1; // Sheet rows are 1-indexed
          break;
        }
      }
      
      if (rowIndex !== -1) {
        junctionSheet.getRange(rowIndex, COLUMNS.GradeNetWeights.sort_order + 1)
          .setValue(Number(orderData.sortOrder));
        updatedCount++;
      }
    }
    
    return {
      success: true,
      message: `Updated sort order for ${updatedCount} netweights`,
      data: {
        grade_id: Number(gradeId),
        updated_count: updatedCount
      },
      timestamp: getNow()
    };
  } catch (error) {
    throw new Error('Failed to update netweight sort order: ' + error.message);
  }
}

/**
 * Helper function to find or create netweight
 * @param {number} weightValue - Weight value
 * @returns {number} NetWeight ID
 * @throws {Error} When operation fails
 */
function findOrCreateNetWeight(weightValue) {
  try {
    const sheet = getSheet('NetWeights');
    const data = sheet.getDataRange().getValues();
    
    // Check if netweight already exists
    const existingRow = data.slice(1).find(row => 
      Number(row[COLUMNS.NetWeights.weight_value]) === Number(weightValue) &&
      row[COLUMNS.NetWeights.is_active] === true
    );
    
    if (existingRow) {
      return existingRow[COLUMNS.NetWeights.netweight_id];
    }
    
    // Create new netweight
    let maxId = 0;
    if (data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        const currentId = Number(data[i][COLUMNS.NetWeights.netweight_id]);
        if (currentId > maxId) {
          maxId = currentId;
        }
      }
    }
    const newId = maxId + 1;
    
    const now = getNow();
    const rowData = [newId, Number(weightValue), true, now];
    
    sheet.appendRow(rowData);
    
    return newId;
  } catch (error) {
    throw new Error('Failed to find or create netweight: ' + error.message);
  }
}