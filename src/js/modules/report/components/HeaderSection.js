/**
 * Header Section Component
 * Renders header section of the report
 */

import { formatGrade, formatNetWeight } from '../utils/DataFormatter.js';
import { getUnitConfig } from '../config/UnitConfig.js';

/**
 * Render header section
 * @param {Object} data - Report data
 * @param {string} data.grade - Product grade
 * @param {string} data.netWeight - Net weight
 * @param {string} data.unit - Product unit (HDPE, PP, PPC)
 * @returns {string} HTML string
 */
export function renderHeader(data) {
    const { grade, netWeight, unit = 'HDPE' } = data;
    const unitConfig = getUnitConfig(unit);
    const formattedGrade = formatGrade(grade);
    const formattedWeight = formatNetWeight(netWeight);
    
    return `
<div class="report-header" style="text-align: center; padding: 20px; border-bottom: 2px solid #333;">
    <h1 style="font-size: 24px; font-weight: bold; margin: 0; color: #333;">
        ${unitConfig.fullName}
    </h1>
    <h2 style="font-size: 20px; font-weight: bold; margin: 10px 0; color: #1b5e20;">
        Grade: ${formattedGrade}
    </h2>
    <p style="font-size: 18px; margin: 5px 0; color: #555;">
        Net Weight: ${formattedWeight}
    </p>
</div>`;
}

/**
 * Render product title section
 * @param {Object} data - Product data
 * @returns {string} HTML string
 */
export function renderProductTitle(data) {
    const { title1, title2, title3 } = data;
    
    if (!title1 && !title2 && !title3) return '';
    
    return `
<div class="product-title" style="padding: 15px; background: #f5f5f5;">
    ${title1 ? `<p style="margin: 5px 0; font-size: 14px; color: #333;">${title1}</p>` : ''}
    ${title2 ? `<p style="margin: 5px 0; font-size: 14px; color: #333;">${title2}</p>` : ''}
    ${title3 ? `<p style="margin: 5px 0; font-size: 14px; color: #333;">${title3}</p>` : ''}
</div>`;
}
