/**
 * @file Services_Units.js
 * @description Service layer for Units operations
 * @author HD_Print_Tag_System
 * @created 2025-12-11
 */

/**
 * Get all active units
 * @returns {Object} Result object with units data
 * @throws {Error} When sheets cannot be accessed or data is invalid
 */
function getUnitsService() {
  try {
    const sheet = getSheet('Units');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    const result = data.slice(1).map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    }).filter(unit => unit.status === true);
    
    return {
      success: true,
      data: result,
      count: result.length,
      timestamp: getNow()
    };
  } catch (error) {
    throw new Error('Failed to get units: ' + error.message);
  }
}

/**
 * Get unit by ID
 * @param {string} unitId - Unit ID to retrieve
 * @returns {Object} Result object with unit data
 * @throws {Error} When unit is not found
 */
function getUnitByIdService(unitId) {
  try {
    const sheet = getSheet('Units');
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const unitIdCol = COLUMNS.Units.unit_id;
    
    // Find unit row
    const unitRow = data.slice(1).find(row => row[unitIdCol] === unitId);
    
    if (!unitRow) {
      throw new Error('Unit not found: ' + unitId);
    }
    
    // Convert to object
    const unit = {};
    headers.forEach((header, index) => {
      unit[header] = unitRow[index];
    });
    
    return {
      success: true,
      data: unit,
      timestamp: getNow()
    };
  } catch (error) {
    throw new Error('Failed to get unit by ID: ' + error.message);
  }
}

/**
 * Create new unit
 * @param {Object} unitData - Unit data to create
 * @returns {Object} Result object with creation status
 * @throws {Error} When creation fails
 */
function createUnitService(unitData) {
  try {
    const sheet = getSheet('Units');
    const now = getNow();
    
    // Check if unit already exists
    const existingUnit = getUnitByIdService(unitData.unit_id);
    if (existingUnit.success) {
      throw new Error('Unit already exists: ' + unitData.unit_id);
    }
    
    // Prepare row data
    const rowData = [
      unitData.unit_id,
      unitData.unit_name,
      unitData.full_name,
      unitData.description || '',
      unitData.status !== false, // Default to true
      now,
      now
    ];
    
    // Add row
    sheet.appendRow(rowData);
    
    return {
      success: true,
      message: 'Unit created successfully',
      data: {
        unit_id: unitData.unit_id,
        created_at: now
      },
      timestamp: getNow()
    };
  } catch (error) {
    // If unit doesn't exist (which is what we want), continue with creation
    if (error.message.includes('Unit not found')) {
      const sheet = getSheet('Units');
      const now = getNow();
      
      const rowData = [
        unitData.unit_id,
        unitData.unit_name,
        unitData.full_name,
        unitData.description || '',
        unitData.status !== false,
        now,
        now
      ];
      
      sheet.appendRow(rowData);
      
      return {
        success: true,
        message: 'Unit created successfully',
        data: {
          unit_id: unitData.unit_id,
          created_at: now
        },
        timestamp: getNow()
      };
    }
    
    throw new Error('Failed to create unit: ' + error.message);
  }
}

/**
 * Update unit
 * @param {string} unitId - Unit ID to update
 * @param {Object} updateData - Data to update
 * @returns {Object} Result object with update status
 * @throws {Error} When update fails
 */
function updateUnitService(unitId, updateData) {
  try {
    const sheet = getSheet('Units');
    const data = sheet.getDataRange().getValues();
    const unitIdCol = COLUMNS.Units.unit_id;
    
    // Find unit row
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) {
      if (data[i][unitIdCol] === unitId) {
        rowIndex = i + 1; // Sheet rows are 1-indexed
        break;
      }
    }
    
    if (rowIndex === -1) {
      throw new Error('Unit not found: ' + unitId);
    }
    
    const now = getNow();
    
    // Update specific columns
    if (updateData.unit_name !== undefined) {
      sheet.getRange(rowIndex, COLUMNS.Units.unit_name + 1).setValue(updateData.unit_name);
    }
    if (updateData.full_name !== undefined) {
      sheet.getRange(rowIndex, COLUMNS.Units.full_name + 1).setValue(updateData.full_name);
    }
    if (updateData.description !== undefined) {
      sheet.getRange(rowIndex, COLUMNS.Units.description + 1).setValue(updateData.description);
    }
    if (updateData.status !== undefined) {
      sheet.getRange(rowIndex, COLUMNS.Units.status + 1).setValue(updateData.status);
    }
    
    // Always update modified timestamp
    sheet.getRange(rowIndex, COLUMNS.Units.updated_at + 1).setValue(now);
    
    return {
      success: true,
      message: 'Unit updated successfully',
      data: {
        unit_id: unitId,
        updated_at: now
      },
      timestamp: getNow()
    };
  } catch (error) {
    throw new Error('Failed to update unit: ' + error.message);
  }
}