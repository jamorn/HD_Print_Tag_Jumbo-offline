/**
 * Template Configuration for Control Print
 * Based on React-like-V2 pattern: 3 templates, different availability per unit
 */

export const CONTROL_PRINT_TEMPLATES = [
    {
        id: 'template1',
        name: '📄 Description Only',
        description: 'เฉพาะคำอธิบายผลิตภัณฑ์',
        value: 0,
        icon: '📄',
        features: {
            ft: false,
            lt: false,
            tis: false,
            sirim: false
        },
        availableFor: ['HDPE', 'PP', 'PPC']  // All units
    },
    {
        id: 'template2',
        name: '📋 Description + Logos',
        description: 'คำอธิบาย + โลโก้ มอก.',
        value: 4,  // TIS only
        icon: '📋',
        features: {
            ft: false,
            lt: false,
            tis: true,
            sirim: false
        },
        availableFor: ['HDPE', 'PP', 'PPC']  // All units
    },
    {
        id: 'template3',
        name: '🎯 Full Certifications',
        description: 'ครบทุกตรา (มอก. + SIRIM)',
        value: 12,  // TIS + SIRIM
        icon: '🎯',
        features: {
            ft: false,
            lt: false,
            tis: true,
            sirim: true
        },
        availableFor: ['HDPE']  // HDPE only
    }
];

/**
 * Get template by ID
 * @param {string} templateId - Template ID
 * @returns {Object|null} Template object
 */
export function getTemplateById(templateId) {
    return CONTROL_PRINT_TEMPLATES.find(t => t.id === templateId) || null;
}

/**
 * Get template by value (binary)
 * @param {number} value - Binary control print value
 * @returns {Object|null} Template object
 */
export function getTemplateByValue(value) {
    return CONTROL_PRINT_TEMPLATES.find(t => t.value === value) || null;
}

/**
 * Get available templates for a specific unit
 * @param {string} unitCode - Unit code (HDPE, PP, PPC)
 * @returns {Array} Array of template objects
 */
export function getTemplatesForUnit(unitCode) {
    return CONTROL_PRINT_TEMPLATES.filter(template => 
        template.availableFor.includes(unitCode)
    );
}

/**
 * Convert template to control print value
 * @param {string} templateId - Template ID
 * @returns {number} Binary control print value
 */
export function templateToControlPrint(templateId) {
    const template = getTemplateById(templateId);
    return template ? template.value : 0;
}

/**
 * Convert control print value to template ID
 * @param {number} value - Binary control print value
 * @returns {string} Template ID or 'template1' as default
 */
export function controlPrintToTemplate(value) {
    const template = getTemplateByValue(value);
    return template ? template.id : 'template1';
}
