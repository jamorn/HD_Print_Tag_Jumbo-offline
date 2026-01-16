/**
 * Report Configuration
 * Configuration for report rendering (control print flags, layout, etc.)
 * Supports both binary (8421) and object {ft, lt} formats
 */

export const PRINT_CONTROL = {
    FT: 1,      // First Ton
    LT: 2,      // Light Transmission
    TIS: 4,     // Thailand Industrial Standard
    SIRIM: 8    // SIRIM Certification
};

export const REPORT_CONFIG = {
    // Logo positions based on controlPrint value
    logoPositions: {
        1: { mfgLeft: null, qrLeft: null, sirimLeft: 180 },      // Only SIRIM
        2: { mfgLeft: 160, qrLeft: 295, sirimLeft: null },       // Only TIS
        3: { mfgLeft: 75, qrLeft: 210, sirimLeft: 335 }          // Both TIS + SIRIM
    },
    
    // Default fonts
    fonts: {
        header: 'Arial, Helvetica, sans-serif',
        body: 'Arial, Helvetica, sans-serif',
        mono: 'Courier New, monospace'
    },
    
    // Font sizes (in pt)
    fontSizes: {
        grade: 20,
        netWeight: 18,
        lot: 16,
        shift: 14,
        description: 12,
        certification: 10
    },
    
    // Logo sizes
    logoSizes: {
        mfg: { width: 120, height: 40 },
        qr: { width: 100, height: 100 },
        tis: { width: 80, height: 80 },
        sirim: { width: 90, height: 90 }
    }
};

/**
 * Normalize control print to binary format
 * Accepts both binary number (8421) and object {ft, lt} formats
 * @param {number|Object} controlPrint - Control print value (binary or object)
 * @returns {number} Binary control print value
 */
export function normalizeControlPrint(controlPrint) {
    // Already binary number
    if (typeof controlPrint === 'number') {
        return controlPrint;
    }
    
    // Object format {ft: true, lt: false} - React-like-V2 style
    if (typeof controlPrint === 'object' && controlPrint !== null) {
        let binary = 0;
        if (controlPrint.ft) binary |= PRINT_CONTROL.FT;
        if (controlPrint.lt) binary |= PRINT_CONTROL.LT;
        // Note: TIS and SIRIM not in React-like-V2 object format
        // They should be specified separately or as binary
        return binary;
    }
    
    return 0;
}

/**
 * Calculate logo positions based on control print value
 * @param {number|Object} controlPrint - Binary control print value or object
 * @returns {Object} Logo positions
 */
export function calculateLogoPositions(controlPrint) {
    const binary = normalizeControlPrint(controlPrint);
    
    // Determine which logos to show
    const showTIS = (binary & PRINT_CONTROL.TIS) !== 0;
    const showSIRIM = (binary & PRINT_CONTROL.SIRIM) !== 0;
    
    let key = 0;
    if (showTIS && !showSIRIM) key = 2;
    else if (!showTIS && showSIRIM) key = 1;
    else if (showTIS && showSIRIM) key = 3;
    
    return REPORT_CONFIG.logoPositions[key] || { mfgLeft: 0, qrLeft: 0, sirimLeft: 0 };
}

/**
 * Check if feature is enabled in control print
 * @param {number|Object} controlPrint - Binary control print value or object
 * @param {string} feature - Feature name (FT, LT, TIS, SIRIM)
 * @returns {boolean} True if enabled
 */
export function isFeatureEnabled(controlPrint, feature) {
    const binary = normalizeControlPrint(controlPrint);
    const flag = PRINT_CONTROL[feature];
    return flag ? (binary & flag) !== 0 : false;
}
