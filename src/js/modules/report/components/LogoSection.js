/**
 * Logo Section Component
 * Renders logos and certifications
 * Supports both template-based and binary control print
 */

import { calculateLogoPositions, isFeatureEnabled } from '../config/ReportConfig.js';
import { generateQRData } from '../utils/DataFormatter.js';

/**
 * Render logo section
 * @param {Object} data - Report data
 * @param {Object} renderer - ReportRenderer instance with flags
 * @returns {string} HTML string
 */
export function renderLogoSection(data, renderer) {
    // Use renderer flags if available (new template mode)
    const showTIS = renderer?.showTIS ?? isFeatureEnabled(data.controlPrint || 0, 'TIS');
    const showQR = renderer?.showQR ?? showTIS;
    const showSIRIM = renderer?.showSIRIM ?? isFeatureEnabled(data.controlPrint || 0, 'SIRIM');
    
    if (!showTIS && !showSIRIM && !showQR) return '';
    
    // Calculate positions based on what's visible
    const positions = calculateLogoPositionsForTemplate(showTIS, showQR, showSIRIM);
    
    return `
<div class="logo-section" style="position: relative; padding: 30px 20px; min-height: 150px;">
    ${showTIS ? renderMFGLogo(positions.mfgLeft) : ''}
    ${showQR ? renderQRCode(data, positions.qrLeft) : ''}
    ${showSIRIM ? renderSIRIMLogo(positions.sirimLeft, data.unit || 'HDPE') : ''}
</div>`;
}

/**
 * Calculate logo positions based on template visibility
 * @param {boolean} showTIS - Show TIS logo
 * @param {boolean} showQR - Show QR code
 * @param {boolean} showSIRIM - Show SIRIM logo
 * @returns {Object} Position object
 */
function calculateLogoPositionsForTemplate(showTIS, showQR, showSIRIM) {
    // template1: No logos
    if (!showTIS && !showQR && !showSIRIM) {
        return { mfgLeft: null, qrLeft: null, sirimLeft: null };
    }
    
    // template2: QR + TIS (centered)
    if (showTIS && showQR && !showSIRIM) {
        return {
            mfgLeft: 140,  // TIS centered-left
            qrLeft: 270,   // QR centered-right
            sirimLeft: null
        };
    }
    
    // template3: QR + TIS + SIRIM (all 3)
    if (showTIS && showQR && showSIRIM) {
        return {
            mfgLeft: 35,    // TIS left
            qrLeft: 180,    // QR middle
            sirimLeft: 320  // SIRIM right
        };
    }
    
    // Fallback
    return { mfgLeft: 140, qrLeft: 270, sirimLeft: null };
}

/**
 * Render MFG logo
 * @param {number|null} left - Left position in px
 * @returns {string} HTML string
 */
function renderMFGLogo(left) {
    if (left === null) return '';
    
    return `
<div class="mfg-logo" style="position: absolute; left: ${left}px; top: 30px;">
    <img src="../images/mfg.png" alt="MFG Logo" style="width: 120px; height: auto;">
</div>`;
}

/**
 * Render QR code
 * @param {Object} data - Report data
 * @param {number|null} left - Left position in px
 * @returns {string} HTML string
 */
function renderQRCode(data, left) {
    if (left === null) return '';
    
    const qrData = generateQRData(data);
    const qrCodeId = `qr-code-${Date.now()}`;
    
    return `
<div class="qr-code" style="position: absolute; left: ${left}px; top: 30px;">
    <div id="${qrCodeId}" style="width: 100px; height: 100px;"></div>
    <script>
        // Generate QR code using qrcode.min.js
        if (typeof QRCode !== 'undefined') {
            new QRCode(document.getElementById('${qrCodeId}'), {
                text: '${qrData}',
                width: 100,
                height: 100
            });
        }
    </script>
</div>`;
}

/**
 * Render TIS logo
 * @param {number|null} left - Left position in px
 * @returns {string} HTML string
 */
function renderTISLogo(left) {
    if (left === null) return '';
    
    return `
<div class="tis-logo" style="position: absolute; left: ${left}px; top: 30px; text-align: center;">
    <img src="../images/TIS2559-2544.png" alt="TIS Logo" style="width: 80px; height: auto;">
    <p style="font-size: 10px; margin-top: 5px; font-weight: bold;">มอก. 2559-2544</p>
</div>`;
}

/**
 * Render SIRIM logo
 * @param {number|null} left - Left position in px
 * @param {string} unit - Product unit
 * @returns {string} HTML string
 */
function renderSIRIMLogo(left, unit) {
    if (left === null) return '';
    
    const isPE100 = unit === 'HDPE'; // Adjust based on actual PE100 logic
    
    return `
<div class="sirim-logo" style="position: absolute; left: ${left}px; top: 30px; text-align: center;">
    <img src="../images/sirim_logo.png" alt="SIRIM Logo" style="width: 90px; height: auto;">
    <div style="font-size: 9px; margin-top: 5px; line-height: 1.4;">
        <p style="margin: 2px 0;">Certified to MS1058 : PART 1 : 2005</p>
        <p style="margin: 2px 0;">Certified No. : PC004152</p>
        ${isPE100 ? '<p style="margin: 2px 0; font-weight: bold;">Designation : PE100</p>' : ''}
    </div>
</div>`;
}
