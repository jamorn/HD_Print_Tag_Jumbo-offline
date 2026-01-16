/**
 * Data Formatter Utility
 * Format data for report rendering
 */

/**
 * Format date to display format
 * @param {string} dateStr - Date string (DD/MM/YYYY or YYYY-MM-DD)
 * @returns {string} Formatted date
 */
export function formatDate(dateStr) {
    if (!dateStr) return '';
    
    // Handle DD/MM/YYYY format
    if (dateStr.includes('/')) {
        return dateStr;
    }
    
    // Handle YYYY-MM-DD format
    const parts = dateStr.split('-');
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    
    return dateStr;
}

/**
 * Format lot number
 * @param {string} lot - Lot number
 * @returns {string} Formatted lot number
 */
export function formatLot(lot) {
    return lot?.toString().trim() || '';
}

/**
 * Format net weight with unit
 * @param {number|string} weight - Weight value
 * @param {string} unit - Unit (kg, g, etc.)
 * @returns {string} Formatted weight
 */
export function formatNetWeight(weight, unit = 'kg') {
    if (!weight) return '';
    const numWeight = parseFloat(weight);
    return isNaN(numWeight) ? weight : `${numWeight} ${unit}`;
}

/**
 * Format grade/product name
 * @param {string} grade - Grade code
 * @returns {string} Formatted grade
 */
export function formatGrade(grade) {
    return grade?.toString().trim().toUpperCase() || '';
}

/**
 * Generate QR code data
 * @param {Object} data - Report data
 * @returns {string} QR code string
 */
export function generateQRData(data) {
    const parts = [
        data.grade || '',
        data.lot || '',
        data.netWeight || '',
        formatDate(data.date) || '',
        data.shift || ''
    ];
    return parts.filter(p => p).join('|');
}

/**
 * Format page range
 * @param {number} fromPage - Start page
 * @param {number} toPage - End page
 * @returns {string} Page range string
 */
export function formatPageRange(fromPage, toPage) {
    if (!fromPage && !toPage) return '';
    if (fromPage === toPage) return `Page ${fromPage}`;
    return `Pages ${fromPage}-${toPage}`;
}

/**
 * Validate report data
 * @param {Object} data - Report data
 * @returns {Object} Validation result {valid: boolean, errors: array}
 */
export function validateReportData(data) {
    const errors = [];
    
    if (!data.grade) errors.push('Grade is required');
    if (!data.lot) errors.push('Lot number is required');
    if (!data.netWeight) errors.push('Net weight is required');
    if (!data.date) errors.push('Date is required');
    
    return {
        valid: errors.length === 0,
        errors
    };
}
