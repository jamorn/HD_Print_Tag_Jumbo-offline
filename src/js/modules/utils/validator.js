/**
 * Validator Utility Module
 * Centralized validation functions for HDPE Print Tag Jumbo
 */

import { getUnitConfig } from '../report/config/UnitConfig.js';

/**
 * Validate lot number (length depends on unit: HDPE/PP=10 digits, PPC=8 digits)
 * @param {string} lot - Lot number to validate
 * @param {string} unit - Current unit (HDPE, PP, PPC)
 * @returns {object} { valid: boolean, message: string }
 */
export function validateLot(lot, unit = 'HDPE') {
    if (!lot || lot.trim() === '') {
        return { valid: false, message: 'กรุณากรอก Lot' };
    }

    // Derive effective unit: prefer UI selection first (so UI tab changes reflect immediately),
    // then the passed `unit` parameter, then fallback to HDPE.
    const uiUnit = (typeof document !== 'undefined' && document.querySelector('.unit-btn.active')?.dataset?.unit) || null;
    const effectiveUnit = (uiUnit && String(uiUnit).toUpperCase()) || (unit && String(unit).toUpperCase()) || 'HDPE';

    // Get unit-specific validation rules
    const unitConfig = getUnitConfig(effectiveUnit);
    const requiredLength = unitConfig.validation.lotLength;
    const pattern = unitConfig.validation.lotPattern;
    
    // Remove any non-numeric characters
    const cleanLot = lot.replace(/\D/g, '');
    
    if (cleanLot.length !== requiredLength) {
        return { 
            valid: false, 
            message: `Lot ต้องมี ${requiredLength} หลัก สำหรับ ${effectiveUnit} (ปัจจุบัน: ${cleanLot.length} หลัก)` 
        };
    }
    
    // Validate against unit-specific pattern
    if (!pattern.test(cleanLot)) {
        return { 
            valid: false, 
            message: `Lot ต้องเป็นตัวเลข ${requiredLength} หลักสำหรับ ${effectiveUnit}` 
        };
    }
    
    return { valid: true, message: '' };
}

/**
 * Validate grade (required field)
 * @param {string} grade - Grade to validate
 * @returns {object} { valid: boolean, message: string }
 */
export function validateGrade(grade) {
    if (!grade || grade.trim() === '') {
        return { valid: false, message: 'กรุณาเลือก Grade' };
    }
    
    return { valid: true, message: '' };
}

/**
 * Validate net weight (required, must be positive number)
 * @param {string|number} netWeight - Net weight to validate
 * @returns {object} { valid: boolean, message: string }
 */
export function validateNetWeight(netWeight) {
    if (!netWeight || netWeight === '') {
        return { valid: false, message: 'กรุณากรอก Net Weight' };
    }
    
    const weight = parseFloat(netWeight);
    
    if (isNaN(weight)) {
        return { valid: false, message: 'Net Weight ต้องเป็นตัวเลข' };
    }
    
    if (weight <= 0) {
        return { valid: false, message: 'Net Weight ต้องมากกว่า 0' };
    }
    
    return { valid: true, message: '' };
}

/**
 * Validate page numbers
 * @param {string|number} fromPage - Starting page number
 * @param {string|number} toPage - Ending page number
 * @returns {object} { valid: boolean, message: string }
 */
export function validatePages(fromPage, toPage) {
    // Check if both fields are filled
    if (!fromPage || fromPage === '') {
        return { valid: false, message: 'กรุณากรอก From Page' };
    }
    
    if (!toPage || toPage === '') {
        return { valid: false, message: 'กรุณากรอก To Page' };
    }
    
    const from = parseInt(fromPage);
    const to = parseInt(toPage);
    
    // Check if values are valid numbers
    if (isNaN(from) || isNaN(to)) {
        return { valid: false, message: 'หมายเลขหน้าต้องเป็นตัวเลข' };
    }
    
    // Check if values are positive
    if (from < 1 || to < 1) {
        return { valid: false, message: 'หมายเลขหน้าต้องมากกว่าหรือเท่ากับ 1' };
    }
    
    // Check if from <= to
    if (from > to) {
        return { valid: false, message: 'From Page ต้องน้อยกว่าหรือเท่ากับ To Page' };
    }
    
    return { valid: true, message: '' };
}

/**
 * Validate all form fields
 * @param {object} formData - Form data object
 * @param {string} unit - Current unit for unit-specific validation
 * @returns {object} { valid: boolean, errors: object }
 */
export function validateForm(formData, unit = 'HDPE') {
    const errors = {};
    let valid = true;
    
    // Validate lot (unit-specific)
    const lotResult = validateLot(formData.lot, unit);
    if (!lotResult.valid) {
        errors.lot = lotResult.message;
        valid = false;
    }
    
    // Validate grade
    const gradeResult = validateGrade(formData.grade);
    if (!gradeResult.valid) {
        errors.grade = gradeResult.message;
        valid = false;
    }
    
    // Validate net weight
    const netWeightResult = validateNetWeight(formData.netweight);
    if (!netWeightResult.valid) {
        errors.netweight = netWeightResult.message;
        valid = false;
    }
    
    // Validate pages
    const pagesResult = validatePages(formData.frompage, formData.topage);
    if (!pagesResult.valid) {
        errors.pages = pagesResult.message;
        valid = false;
    }
    
    return { valid, errors };
}

/**
 * Validate data before print preview (stricter validation)
 * @param {object} formData - Form data object
 * @param {string} unit - Current unit for unit-specific validation
 * @returns {object} { valid: boolean, message: string, details: object }
 */
export function validateForPrintPreview(formData, unit = 'HDPE') {
    const details = {};
    let valid = true;
    let message = '';

    // Check required fields
    if (!formData || !formData.lot || !formData.grade) {
        valid = false;
        message = 'กรุณา Submit ข้อมูลก่อนดูรายงาน';
        return { valid, message, details };
    }

    // Validate lot with detailed message (unit-specific)
    const lotResult = validateLot(formData.lot, unit);
    if (!lotResult.valid) {
        valid = false;
        details.lot = `Lot: "${formData.lot}" - ${lotResult.message}`;
    }

    // Validate grade
    const gradeResult = validateGrade(formData.grade);
    if (!gradeResult.valid) {
        valid = false;
        details.grade = `Grade: "${formData.grade}" - ${gradeResult.message}`;
    }

    // Validate net weight
    const netWeightResult = validateNetWeight(formData.netweight);
    if (!netWeightResult.valid) {
        valid = false;
        details.netweight = `Net Weight: "${formData.netweight}" - ${netWeightResult.message}`;
    }

    // Detailed page validation
    const fromPage = formData.frompage;
    const toPage = formData.topage;

    if (!fromPage || fromPage === '') {
        valid = false;
        details.frompage = 'From Page: ไม่ได้กรอกค่า';
    } else if (isNaN(parseInt(fromPage))) {
        valid = false;
        details.frompage = `From Page: "${fromPage}" - ไม่ใช่ตัวเลข`;
    } else if (parseInt(fromPage) < 1) {
        valid = false;
        details.frompage = `From Page: "${fromPage}" - ต้องมากกว่าหรือเท่ากับ 1`;
    }

    if (!toPage || toPage === '') {
        valid = false;
        details.topage = 'To Page: ไม่ได้กรอกค่า';
    } else if (isNaN(parseInt(toPage))) {
        valid = false;
        details.topage = `To Page: "${toPage}" - ไม่ใช่ตัวเลข`;
    } else if (parseInt(toPage) < 1) {
        valid = false;
        details.topage = `To Page: "${toPage}" - ต้องมากกว่าหรือเท่ากับ 1`;
    }

    // Check page range logic
    if (fromPage && toPage && !isNaN(parseInt(fromPage)) && !isNaN(parseInt(toPage))) {
        const from = parseInt(fromPage);
        const to = parseInt(toPage);
        if (from > to) {
            valid = false;
            details.pages = `Page Range: From Page (${fromPage}) มากกว่า To Page (${toPage})`;
        }
    }

    // Generate summary message
    if (!valid) {
        const errorList = Object.values(details);
        message = `ไม่สามารถแสดงรายงานได้:\n${errorList.join('\n')}`;
    }

    return { valid, message, details };
}

/**
 * Filter numeric input (allow only digits)
 * @param {string} value - Input value to filter
 * @returns {string} Filtered value
 */
export function filterNumericInput(value) {
    return value.replace(/\D/g, '');
}

/**
 * Check if key is allowed for numeric input
 * @param {KeyboardEvent} event - Keyboard event
 * @returns {boolean} True if key is allowed
 */
export function isAllowedNumericKey(event) {
    const allowedKeys = [
        'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
        'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
        'Home', 'End'
    ];
    
    // Allow Ctrl/Cmd combinations (for copy, paste, etc.)
    if (event.ctrlKey || event.metaKey) {
        return true;
    }
    
    // Allow special keys
    if (allowedKeys.includes(event.key)) {
        return true;
    }
    
    // Allow digits 0-9
    if (/^[0-9]$/.test(event.key)) {
        return true;
    }
    
    return false;
}

/**
 * Calculate control print value from checkboxes
 * @param {object} controlPrint - Object with checkbox values {ft, lt, mfg, sirim}
 * @returns {number} Control print value
 */
/**
 * Calculate control print value from checkboxes (Binary: 8-4-2-1)
 * @param {object} controlPrint - Object with ft, lt, mfg, sirim boolean values
 * @returns {number} Calculated control print value
 */
export function calculateControlPrint(controlPrint) {
    let value = 0;
    
    if (controlPrint.ft) value += 8;
    if (controlPrint.lt) value += 4;
    if (controlPrint.mfg) value += 2;
    if (controlPrint.sirim) value += 1;
    
    return value;
}

/**
 * Decode control print binary value back to checkbox states (Binary: 8-4-2-1)
 * @param {number} value - Control print binary value (0-15)
 * @returns {object} Object with ft, lt, mfg, sirim boolean values
 */
export function decodeControlPrint(value) {
    const numValue = parseInt(value, 10) || 0;
    
    return {
        ft: (numValue & 8) !== 0,    // bit 3 (8)
        lt: (numValue & 4) !== 0,    // bit 2 (4)
        mfg: (numValue & 2) !== 0,   // bit 1 (2)
        sirim: (numValue & 1) !== 0  // bit 0 (1)
    };
}

/**
 * Format Thai date
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
export function formatThaiDate(date = new Date()) {
    const thaiMonths = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
        'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543; // Buddhist year
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${day} ${month} ${year} | ${hours}:${minutes}:${seconds}`;
}
