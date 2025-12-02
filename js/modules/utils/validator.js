/**
 * Validator Utility Module
 * Centralized validation functions for HDPE Print Tag Jumbo
 */

/**
 * Validate lot number (must be exactly 10 digits)
 * @param {string} lot - Lot number to validate
 * @returns {object} { valid: boolean, message: string }
 */
export function validateLot(lot) {
    if (!lot || lot.trim() === '') {
        return { valid: false, message: 'กรุณากรอก Lot' };
    }
    
    // Remove any non-numeric characters
    const cleanLot = lot.replace(/\D/g, '');
    
    if (cleanLot.length !== 10) {
        return { 
            valid: false, 
            message: `Lot ต้องมี 10 หลัก (ปัจจุบัน: ${cleanLot.length} หลัก)` 
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
 * @returns {object} { valid: boolean, errors: object }
 */
export function validateForm(formData) {
    const errors = {};
    let valid = true;
    
    // Validate lot
    const lotResult = validateLot(formData.lot);
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
export function calculateControlPrint(controlPrint) {
    let value = 0;
    
    if (controlPrint.ft) value += 8;
    if (controlPrint.lt) value += 4;
    if (controlPrint.mfg) value += 2;
    if (controlPrint.sirim) value += 1;
    
    return value;
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
