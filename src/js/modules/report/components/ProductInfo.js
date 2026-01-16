/**
 * Product Info Component
 * Renders product information section
 */

import { formatLot, formatDate, formatPageRange } from '../utils/DataFormatter.js';
import { isFeatureEnabled } from '../config/ReportConfig.js';

/**
 * Render product information section
 * @param {Object} data - Product data
 * @returns {string} HTML string
 */
export function renderProductInfo(data) {
    const {
        lot,
        date,
        shift,
        fromPage,
        toPage,
        controlPrint = 0
    } = data;
    
    const showFT = isFeatureEnabled(controlPrint, 'FT');
    const showLT = isFeatureEnabled(controlPrint, 'LT');
    
    return `
<div class="product-info" style="padding: 20px; font-family: Arial, sans-serif;">
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 8px; font-weight: bold; width: 30%;">Lot Number:</td>
            <td style="padding: 8px; font-family: 'Courier New', monospace; font-weight: bold; font-size: 16px;">
                ${formatLot(lot)}
            </td>
        </tr>
        <tr>
            <td style="padding: 8px; font-weight: bold;">Manufacturing Date:</td>
            <td style="padding: 8px;">${formatDate(date)}</td>
        </tr>
        ${shift ? `
        <tr>
            <td style="padding: 8px; font-weight: bold;">Shift:</td>
            <td style="padding: 8px;">${shift}</td>
        </tr>
        ` : ''}
        ${(fromPage || toPage) ? `
        <tr>
            <td style="padding: 8px; font-weight: bold;">Page Range:</td>
            <td style="padding: 8px;">${formatPageRange(fromPage, toPage)}</td>
        </tr>
        ` : ''}
        ${showFT ? `
        <tr>
            <td style="padding: 8px; font-weight: bold; color: #4CAF50;">First Ton (FT):</td>
            <td style="padding: 8px; color: #4CAF50;">✓</td>
        </tr>
        ` : ''}
        ${showLT ? `
        <tr>
            <td style="padding: 8px; font-weight: bold;">Light Transmission:</td>
            <td style="padding: 8px;">&lt; 2%</td>
        </tr>
        ` : ''}
    </table>
</div>`;
}

/**
 * Render additional specifications
 * @param {Object} specs - Specifications object
 * @returns {string} HTML string
 */
export function renderSpecifications(specs) {
    if (!specs || Object.keys(specs).length === 0) return '';
    
    const rows = Object.entries(specs).map(([key, value]) => `
        <tr>
            <td style="padding: 8px; font-weight: bold;">${key}:</td>
            <td style="padding: 8px;">${value}</td>
        </tr>
    `).join('');
    
    return `
<div class="specifications" style="padding: 20px; margin-top: 20px; border-top: 1px solid #ddd;">
    <h3 style="font-size: 16px; font-weight: bold; margin-bottom: 10px;">Technical Specifications</h3>
    <table style="width: 100%; border-collapse: collapse;">
        ${rows}
    </table>
</div>`;
}
