/**
 * @file Services_Grades.js
 * @description Service layer for Grades operations
 * @author HD_Print_Tag_System
 * @created 2025-12-11
 */

/**
 * Get grades by unit
 * @param {string} unitId - Unit ID to filter grades
 * @returns {Object} Result object with grades data
 * @throws {Error} When sheets cannot be accessed or data is invalid
 */
function getGradesByUnitService(unitId) {
  try {
    const sheet = getSheet('Grades');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const result = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    }).filter(grade => grade.unit_id === unitId && grade.status === true);
    
    return {
      success: true,
      data: result,
      count: result.length,
      unit_id: unitId,
      timestamp: getNow()
    };
  } catch (error) {
    throw new Error('Failed to get grades by unit: ' + error.message);
  }
}

/**
 * Get grade data formatted for frontend UnitConfig
 * @param {string} unitId - Unit ID to filter grades
 * @returns {Object} Result object with grades data in UnitConfig format
 * @throws {Error} When sheets cannot be accessed or data is invalid
 */
function getGradeDataByUnitService(unitId) {
  try {
    // Get grades data
    const gradesSheet = getSheet('Grades');
    const gradesData = gradesSheet.getDataRange().getValues();
    const gradesHeaders = gradesData[0];
    
    // Get netweights data
    const netWeightsSheet = getSheet('NetWeights');
    const netWeightsData = netWeightsSheet.getDataRange().getValues();
    const netWeightsHeaders = netWeightsData[0];
    
    // Get grade-netweight relationships
    const gradeNetWeightsSheet = getSheet('GradeNetWeights');
    const gradeNetWeightsData = gradeNetWeightsSheet.getDataRange().getValues();
    const gradeNetWeightsHeaders = gradeNetWeightsData[0];
    
    // Convert to objects
    const grades = gradesData.slice(1).map(row => {
      const obj = {};
      gradesHeaders.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    }).filter(grade => grade.unit_id === unitId && grade.status === true);
    
    const netWeights = netWeightsData.slice(1).map(row => {
      const obj = {};
      netWeightsHeaders.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    }).filter(nw => nw.is_active === true);
    
    const gradeNetWeights = gradeNetWeightsData.slice(1).map(row => {
      const obj = {};
      gradeNetWeightsHeaders.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    }).filter(gnw => gnw.is_active === true);
    
    // Transform to UnitConfig format
    const gradeData = grades.map(grade => {
      // Get netweights for this grade
      const gradeNetWeightIds = gradeNetWeights
        .filter(gnw => gnw.grade_id === grade.grade_id)
        .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
        .map(gnw => gnw.netweight_id);
      
      const netweightArray = gradeNetWeightIds.map(nwId => {
        const nw = netWeights.find(nw => nw.netweight_id === nwId);
        return nw ? nw.weight_value : null;
      }).filter(weight => weight !== null);
      
      return {
        grade: grade.grade_code,
        netweightArray: netweightArray.length > 0 ? netweightArray : [750], // Default to 750 if no netweights
        description: grade.description || 'N/A',
        status: grade.status === true,
        sub: grade.has_sub === true
      };
    });
    
    return {
      success: true,
      data: gradeData,
      count: gradeData.length,
      unit_id: unitId,
      format: 'UnitConfig',
      timestamp: getNow()
    };
  } catch (error) {
    throw new Error('Failed to get grade data by unit: ' + error.message);
  }
}

/**
 * Get all grades
 * @returns {Object} Result object with all grades data
 * @throws {Error} When sheets cannot be accessed
 */
function getAllGradesService() {
  try {
    const sheet = getSheet('Grades');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const result = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    }).filter(grade => grade.status === true);
    
    return {
      success: true,
      data: result,
      count: result.length,
      timestamp: getNow()
    };
  } catch (error) {
    throw new Error('Failed to get all grades: ' + error.message);
  }
}

/**
 * Get grade by ID
 * @param {number} gradeId - Grade ID to retrieve
 * @returns {Object} Result object with grade data
 * @throws {Error} When grade is not found
 */
function getGradeByIdService(gradeId) {
  try {
    const sheet = getSheet('Grades');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const gradeIdCol = COLUMNS.Grades.grade_id;
    
    // Find grade row
    const gradeRow = data.slice(1).find(row => row[gradeIdCol] === Number(gradeId));
    
    if (!gradeRow) {
      throw new Error('Grade not found: ' + gradeId);
    }
    
    // Convert to object
    const grade = {};
    headers.forEach((header, index) => {
      grade[header] = gradeRow[index];
    });
    
    return {
      success: true,
      data: grade,
      timestamp: getNow()
    };
  } catch (error) {
    throw new Error('Failed to get grade by ID: ' + error.message);
  }
}

/**
 * Create new grade
 * @param {Object} gradeData - Grade data to create
 * @returns {Object} Result object with creation status
 * @throws {Error} When creation fails
 */
function createGradeService(gradeData) {
  try {
    const sheet = getSheet('Grades');
    const now = getNow();
    
    // Get next grade ID
    const data = sheet.getDataRange().getValues();
    let maxId = 0;
    if (data.length > 1) {
      for (let i = 1; i < data.length; i++) {
        const currentId = Number(data[i][COLUMNS.Grades.grade_id]);
        if (currentId > maxId) {
          maxId = currentId;
        }
      }
    }
    const newGradeId = maxId + 1;
    
    // Check if grade code already exists for this unit
    const existingGrade = data.slice(1).find(row => 
      row[COLUMNS.Grades.unit_id] === gradeData.unit_id && 
      row[COLUMNS.Grades.grade_code] === gradeData.grade_code
    );
    
    if (existingGrade) {
      throw new Error(`Grade ${gradeData.grade_code} already exists for unit ${gradeData.unit_id}`);
    }
    
    // Prepare row data
    const rowData = [
      newGradeId,
      gradeData.unit_id,
      gradeData.grade_code,
      gradeData.description || '',
      gradeData.status !== false, // Default to true
      gradeData.has_sub || false,
      now,
      now
    ];
    
    // Add row
    sheet.appendRow(rowData);
    
    return {
      success: true,
      message: 'Grade created successfully',
      data: {
        grade_id: newGradeId,
        unit_id: gradeData.unit_id,
        grade_code: gradeData.grade_code,
        created_at: now
      },
      timestamp: getNow()
    };
  } catch (error) {
    throw new Error('Failed to create grade: ' + error.message);
  }
}

/**
 * Update grade
 * @param {number} gradeId - Grade ID to update
 * @param {Object} updateData - Data to update
 * @returns {Object} Result object with update status
 * @throws {Error} When update fails
 */
function updateGradeService(gradeId, updateData) {
  try {
    const sheet = getSheet('Grades');
    const data = sheet.getDataRange().getValues();
    const gradeIdCol = COLUMNS.Grades.grade_id;
    
    // Find grade row
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (Number(data[i][gradeIdCol]) === Number(gradeId)) {
        rowIndex = i + 1; // Sheet rows are 1-indexed
        break;
      }
    }
    
    if (rowIndex === -1) {
      throw new Error('Grade not found: ' + gradeId);
    }
    
    const now = getNow();
    
    // Update specific columns
    if (updateData.grade_code !== undefined) {
      sheet.getRange(rowIndex, COLUMNS.Grades.grade_code + 1).setValue(updateData.grade_code);
    }
    if (updateData.description !== undefined) {
      sheet.getRange(rowIndex, COLUMNS.Grades.description + 1).setValue(updateData.description);
    }
    if (updateData.status !== undefined) {
      sheet.getRange(rowIndex, COLUMNS.Grades.status + 1).setValue(updateData.status);
    }
    if (updateData.has_sub !== undefined) {
      sheet.getRange(rowIndex, COLUMNS.Grades.has_sub + 1).setValue(updateData.has_sub);
    }
    
    // Always update modified timestamp
    sheet.getRange(rowIndex, COLUMNS.Grades.updated_at + 1).setValue(now);
    
    return {
      success: true,
      message: 'Grade updated successfully',
      data: {
        grade_id: Number(gradeId),
        updated_at: now
      },
      timestamp: getNow()
    };
  } catch (error) {
    throw new Error('Failed to update grade: ' + error.message);
  }
}

/**
 * Delete grade (soft delete)
 * @param {number} gradeId - Grade ID to delete
 * @returns {Object} Result object with delete status
 * @throws {Error} When delete fails
 */
function deleteGradeService(gradeId) {
  try {
    return updateGradeService(gradeId, { status: false });
  } catch (error) {
    throw new Error('Failed to delete grade: ' + error.message);
  }
}