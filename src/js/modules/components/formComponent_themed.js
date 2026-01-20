/**
 * Form Component (Theme-Aware Version)
 * Handles form rendering, validation, and submission with CSS variable support
 */

import { 
    validateForm,
    validatePages,
    validateForPrintPreview,
    isAllowedNumericKey,
    filterNumericInput,
    calculateControlPrint,
    decodeControlPrint
} from '../utils/validator.js';
import { saveToSession, getFromSession } from '../utils/storage.js';
import { gradeHistory } from '../utils/gradeHistoryManager.js';
import { generateGradeOptions, getUnitConfig } from '../report/config/UnitConfig.js';

export class FormComponent {
    constructor() {
        this.formData = {};
        this.onSubmitCallback = null;
        this.currentUnit = 'HDPE'; // Default unit, will be updated from table selection
    }

    /**
     * Render form HTML
     * @returns {string} HTML string
     */
    render() {
        // Get shift display text from shift_compare.js if available
        const shiftText = window.currentShiftDisplay || '';
        
        // Get unit config for current unit
        const unitConfig = getUnitConfig(this.currentUnit);
        const maxLotLength = unitConfig.validation.lotLength;
        
        return `
            <!-- Main Card Form -->
            <div class="rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.005] duration-300 theme-card mb-6 border">
                <!-- Card Header -->
                <div class="theme-card-header p-4 flex items-center justify-between border-b theme-border">
                    <h2 class="text-xl font-semibold theme-text-primary">
                        ข้อมูลการผลิตและการตั้งค่า
                    </h2>
                    <div class="flex items-center gap-3">
                        <button id="gradeHistoryBtn" 
                                type="button"
                                class="px-4 py-2 rounded-lg font-semibold text-sm transition-all hover:opacity-80"
                                style="background-color: var(--secondary-color); color: white;"
                                title="ดูประวัติ Grade">
                            📋 ประวัติ
                        </button>
                        <h2 id="currentShiftDisplay" class="text-base font-semibold theme-text-primary">${shiftText}</h2>
                    </div>
                </div>

                <!-- Card Body -->
                <div class="p-6">
                    <!-- Section 1: Form Fields -->
                    <p class="theme-text-primary font-bold mb-4 border-b pb-2 theme-border">1. ข้อมูลการผลิต</p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 mb-8">
                        <!-- Lot Field -->
                        <div class="col-span-1">
                            <label for="lot" class="block text-sm font-medium theme-label mb-1">Lot</label>
                            <input type="text" 
                                   id="lot" 
                                   inputmode="numeric"
                                   placeholder="ใส่ Lot การผลิต"
                                   class="w-full p-2.5 border theme-input rounded-lg shadow-sm"
                                   maxlength="${maxLotLength}">
                            <span id="lot-error" class="text-sm font-medium"></span>
                        </div>

                        <!-- Grade Field -->
                        <div class="col-span-1">
                            <label for="grade" class="block text-sm font-medium theme-label mb-1">Grade</label>
                            <input type="text" 
                                   id="grade" 
                                   placeholder="Grade"
                                   class="w-full p-2.5 border theme-input rounded-lg shadow-sm cursor-not-allowed" 
                                   readonly>
                            <span id="grade-error" class="text-red-500 text-sm hidden font-medium"></span>
                        </div>
                        
                        <!-- Net Weight Field -->
                        <div class="col-span-1">
                            <label for="netweight" class="block text-sm font-medium theme-label mb-1">Net Weight</label>
                            <input type="number" 
                                   id="netweight" 
                                   placeholder="Net Weight"
                                   class="w-full p-2.5 border theme-input rounded-lg shadow-sm cursor-not-allowed" 
                                   readonly>
                            <span id="netweight-error" class="text-red-500 text-sm hidden font-medium"></span>
                        </div>

                        <!-- TIS Field -->
                        <div class="col-span-1">
                            <label for="tis" class="block text-sm font-medium theme-label mb-1">เครื่องหมาย มอก.</label>
                            <input type="text" 
                                   id="tis" 
                                   placeholder=""
                                   class="w-full p-2.5 border theme-input rounded-lg shadow-sm cursor-not-allowed" 
                                   readonly>
                        </div>

                        <!-- Shift Field -->
                        <div class="col-span-1">
                            <label for="shift" class="block text-sm font-medium theme-label mb-1">Shift</label>
                            <select id="shift" 
                                    name="shift" 
                                    class="w-full p-2.5 border theme-input rounded-lg shadow-sm">
                                <option value="M">กะเช้า</option>
                                <option value="E">กะบ่าย</option>
                                <option value="N">กะดึก</option>
                            </select>
                        </div>
                        
                        <!-- Date Field -->
                        <div class="col-span-1">
                            <label for="idate" class="block text-sm font-medium theme-label mb-1">Date</label>
                            <select id="idate" 
                                    name="idate" 
                                    class="w-full p-2.5 border theme-input rounded-lg shadow-sm">
                                ${(() => {
                                    const today = new Date().getDate();
                                    return Array.from({ length: 31 }, (_, i) => {
                                        const day = i + 1;
                                        const selected = day === today ? ' selected' : '';
                                        return `<option value="${day}"${selected}>${day}</option>`;
                                    }).join('');
                                })()}
                            </select>
                        </div>
                        
                        <!-- From Page Field -->
                        <div class="col-span-1">
                            <label for="frompage" class="block text-sm font-medium theme-label mb-1">From Page</label>
                            <input type="number" 
                                   id="frompage" 
                                   placeholder=""
                                   class="w-full p-2.5 border theme-input rounded-lg shadow-sm"
                                   min="1">
                            <span id="frompage-error" class="text-red-500 text-sm hidden font-medium"></span>
                        </div>

                        <!-- To Page Field -->
                        <div class="col-span-1">
                            <label for="topage" class="block text-sm font-medium theme-label mb-1">To Page</label>
                            <input type="number" 
                                   id="topage" 
                                   placeholder=""
                                   class="w-full p-2.5 border theme-input rounded-lg shadow-sm"
                                   min="1">
                            <span id="topage-error" class="text-red-500 text-sm hidden font-medium"></span>
                        </div>
                    </div>

                    <!-- Section 2: Template & Print Options -->
                    <p class="theme-text-primary font-bold mb-4 border-b pb-2 theme-border">2. การตั้งค่าการแสดงผล</p>

                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <!-- Template Dropdown -->
                        <div>
                            <label for="template_select" class="block text-sm font-medium theme-label mb-1">Template (โลโก้และตรา)</label>
                            <select id="template_select" 
                                    name="template" 
                                    class="w-full p-2.5 border theme-input rounded-lg shadow-sm">
                                <option value="template1">ไม่มีโลโก้ ไม่มีตรา</option>
                                <option value="template2">มี QR Code + มอก.</option>
                                <option value="template3" data-hdpe-only="true">มี QR Code + มอก. + SIRIM</option>
                            </select>
                            <span class="text-xs theme-text-secondary">*Template 3 สำหรับ HDPE เท่านั้น</span>
                        </div>

                        <!-- FT/LT Checkboxes -->
                        <div>
                            <label class="block text-sm font-medium theme-label mb-1">Control Print Markers</label>
                            <div class="flex gap-6 mt-2">
                                <label class="flex items-center theme-text-primary text-base cursor-pointer">
                                    <input type="checkbox" 
                                           id="ft" 
                                           name="ft_marker"
                                           class="form-checkbox h-5 w-5 rounded mr-2"
                                           style="accent-color: var(--primary-color);">
                                    <span>FT</span>
                                </label>

                                <label class="flex items-center theme-text-primary text-base cursor-pointer">
                                    <input type="checkbox" 
                                           id="lt" 
                                           name="lt_marker"
                                           class="form-checkbox h-5 w-5 rounded mr-2"
                                           style="accent-color: var(--primary-color);">
                                    <span>LT</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4 mt-6">
                        <button id="btn_hd_push" 
                                type="submit"
                                class="w-full py-3 px-4 theme-btn-primary font-bold rounded-lg shadow-lg transition duration-150 transform focus:outline-none focus:ring-2 focus:ring-offset-2"
                                style="--tw-ring-color: var(--primary-color);">
                            ยืนยันและบันทึกข้อมูลทั้งหมด
                        </button>
                        <button id="btn_view_report" 
                                type="button" 
                                disabled
                                class="w-full py-3 px-4 bg-gray-400 text-gray-600 font-bold rounded-lg shadow-lg cursor-not-allowed opacity-50">
                            Print Preview
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Initialize component
     * @param {function} onSubmit - Callback function for form submission
     */
    init(onSubmit) {
        this.onSubmitCallback = onSubmit;
        this.setupEventListeners();
        this.restoreFormData();
    }

    /**
     * Setup form event listeners
     */
    setupEventListeners() {
        const lotInput = document.getElementById('lot');
        const submitBtn = document.getElementById('btn_hd_push');
        const printBtn = document.getElementById('btn_view_report');

        // Lot input validation (keydown event)
        if (lotInput) {
            lotInput.addEventListener('keydown', (e) => {
                if (!isAllowedNumericKey(e)) {
                    e.preventDefault();
                }
            });

            // Show character count
            lotInput.addEventListener('input', (e) => {
                const unitConfig = getUnitConfig(this.currentUnit);
                const requiredLength = unitConfig.validation.lotLength;
                
                const value = filterNumericInput(e.target.value);
                // Limit to unit-specific length
                e.target.value = value.substring(0, requiredLength);
                
                const errorSpan = document.getElementById('lot-error');
                if (errorSpan) {
                    const length = e.target.value.length;
                    if (length === 0) {
                        errorSpan.textContent = '';
                    } else if (length < requiredLength) {
                        errorSpan.textContent = `${length}/${requiredLength} หลัก (${this.currentUnit})`;
                        errorSpan.style.color = '#ef4444'; // red - ไม่ครบ
                    } else if (length === requiredLength) {
                        errorSpan.textContent = `${length}/${requiredLength} หลัก ✓`;
                        errorSpan.style.color = '#22c55e'; // green - ครบแล้ว
                    }
                }
            });
        }

        // Form submission
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        }

        // Print preview button
        if (printBtn) {
            printBtn.addEventListener('click', () => {
                this.handlePrintPreview();
            });
        }

        // Grade History button
        const historyBtn = document.getElementById('gradeHistoryBtn');
        if (historyBtn) {
            historyBtn.addEventListener('click', () => {
                this.showGradeHistoryModal();
            });
        }

        // Template dropdown - filter options by unit
        const templateSelect = document.getElementById('template_select');
        if (templateSelect) {
            this.updateTemplateOptions();
        }

        // Auto-save form data on input
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => {
                this.saveFormData();
                this.resetPrintPreviewButton(); // Reset print button when data changes
            });
            input.addEventListener('input', () => {
                this.resetPrintPreviewButton(); // Reset print button on typing
            });
        });

        // Real-time validation for frompage and topage
        const frompageInput = document.getElementById('frompage');
        const topageInput = document.getElementById('topage');

        const validatePagesRealtime = () => {
            const frompageValue = frompageInput?.value || '';
            const topageValue = topageInput?.value || '';

            if (frompageValue || topageValue) {
                const validation = validatePages(frompageValue, topageValue);
                const frompageErrorSpan = document.getElementById('frompage-error');
                const topageErrorSpan = document.getElementById('topage-error');

                if (!validation.valid) {
                    // Show error on both fields for better UX
                    if (frompageErrorSpan) {
                        frompageErrorSpan.textContent = validation.message;
                        frompageErrorSpan.className = 'text-red-500 text-sm font-medium';
                        frompageErrorSpan.classList.remove('hidden');
                    }
                    if (topageErrorSpan) {
                        topageErrorSpan.textContent = validation.message;
                        topageErrorSpan.className = 'text-red-500 text-sm font-medium';
                        topageErrorSpan.classList.remove('hidden');
                    }
                } else {
                    // Clear pages validation errors if valid
                    if (frompageErrorSpan) {
                        frompageErrorSpan.textContent = '';
                        frompageErrorSpan.classList.add('hidden');
                    }
                    if (topageErrorSpan) {
                        topageErrorSpan.textContent = '';
                        topageErrorSpan.classList.add('hidden');
                    }
                }
            }
        };

        if (frompageInput) {
            frompageInput.addEventListener('input', validatePagesRealtime);
            frompageInput.addEventListener('blur', validatePagesRealtime);
        }

        if (topageInput) {
            topageInput.addEventListener('input', validatePagesRealtime);
            topageInput.addEventListener('blur', validatePagesRealtime);
        }
    }

    /**
     * Update template dropdown options based on current unit
     */
    updateTemplateOptions() {
        const templateSelect = document.getElementById('template_select');
        if (!templateSelect) return;

        const template3Option = templateSelect.querySelector('option[value="template3"]');
        
        if (this.currentUnit === 'HDPE') {
            // HDPE: Show all 3 options
            if (template3Option) {
                template3Option.disabled = false;
                template3Option.style.display = '';
            }
        } else {
            // PP, PPC: Hide template3
            if (template3Option) {
                template3Option.disabled = true;
                template3Option.style.display = 'none';
                
                // If template3 is currently selected, change to unit's default
                if (templateSelect.value === 'template3') {
                    templateSelect.value = this.getDefaultTemplate();
                    console.log(`🔄 Changed template from template3 to ${this.getDefaultTemplate()} for ${this.currentUnit}`);
                }
            }
        }
        
        console.log(`🎨 Template options updated for ${this.currentUnit}, current selection: ${templateSelect.value}`);
    }

    /**
     * Handle form submission
     */
    async handleSubmit() {
        const formData = this.getFormData();
        const validation = validateForm(formData, this.currentUnit);

        if (!validation.valid) {
            this.showValidationErrors(validation.errors);
            
            if (window.Swal) {
                await window.Swal.fire({
                    icon: 'error',
                    title: 'ข้อมูลไม่ถูกต้อง',
                    html: Object.values(validation.errors).map(err => `• ${err}`).join('<br>'),
                    confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()
                });
            }
            return;
        }

        // Clear validation errors
        this.clearValidationErrors();

        // Save to session storage
        this.saveFormData();

        // Save to grade history
        if (formData.grade && this.currentUnit) {
            gradeHistory.saveGradeHistory(this.currentUnit, formData.grade, formData);
            console.log(`💾 Saved grade history: ${this.currentUnit} / ${formData.grade}`);
        }

        // Call submit callback
        if (this.onSubmitCallback) {
            await this.onSubmitCallback(formData);
        }

        // Enable and mark Print Preview button as ready
        this.enablePrintPreviewWithCheckmark();
    }

    /**
     * Get form data
     * @returns {object} Form data
     */
    getFormData() {
        const templateSelect = document.getElementById('template_select');
        const ftCheckbox = document.getElementById('ft');
        const ltCheckbox = document.getElementById('lt');
        
        return {
            lot: document.getElementById('lot')?.value || '',
            grade: document.getElementById('grade')?.value || '',
            netweight: document.getElementById('netweight')?.value || '',
            tis: document.getElementById('tis')?.value || '',
            shift: document.getElementById('shift')?.value || 'M',
            idate: document.getElementById('idate')?.value || '1',
            frompage: document.getElementById('frompage')?.value || '',
            topage: document.getElementById('topage')?.value || '',
            template: templateSelect?.value || this.getDefaultTemplate(),
            controlprint: {
                ft: ftCheckbox?.checked || false,
                lt: ltCheckbox?.checked || false
            },
            unit: this.currentUnit || 'HDPE',
            title1: this.currentUnit,
            title2: this.getDefaultTitle2()
        };
    }

    /**
     * Populate form with data
     * @param {object} data - Data to populate
     */
    populateForm(data) {
        console.log('📝 Populating form with data:', data);
        
        // Update current unit if provided
        if (data.unit) {
            this.currentUnit = data.unit;
            console.log(`📦 Current unit set to: ${this.currentUnit}`);
            // Update template options based on unit
            this.updateTemplateOptions();
        }
        
        // Always try to load from grade history first (for lot, shift, pages, etc.)
        let finalData = { ...data };
        if (data.grade && this.currentUnit) {
            // First try to load history using the exact grade name (including SUB if present)
            let historyData = gradeHistory.loadGradeHistory(this.currentUnit, data.grade);
            
            // If SUB grade not found, try the base grade (without SUB)
            if (!historyData && data.grade.includes(' SUB')) {
                const baseGrade = data.grade.replace(/ SUB$/i, '');
                historyData = gradeHistory.loadGradeHistory(this.currentUnit, baseGrade);
                console.log(`📂 SUB grade not found, trying base grade ${baseGrade}:`, historyData);
            }
            
            if (historyData) {
                console.log(`📂 Loaded from history for ${data.grade}:`, historyData);
                // Merge: history as base, then override with new data
                finalData = { ...historyData, ...data };
            }
        }
        
        // Detect if this is a SUB grade
        const isSub = data.grade && (data.grade.includes(' SUB') || data.grade.includes(' SUB/'));
        
        // CRITICAL: autoTemplate always overrides (business rule, not saved yet)
        // For SUB grades, force template1
        if (isSub) {
            finalData.template = 'template1';
            console.log(`🔒 SUB grade detected - FORCED to template1`);
        } else if (data.autoTemplate) {
            finalData.template = data.autoTemplate;
            console.log(`🎯 Auto-template applied (temporary): ${data.autoTemplate}`);
        }
        
        // Override grade and netweight from clicked row (temporary, not saved)
        if (data.grade) finalData.grade = data.grade;
        if (data.netweight) finalData.netweight = data.netweight;
        
        // Handle TIS field - check for both TIS (from table) and tis (from history)
        if (data.TIS !== undefined) {
            finalData.tis = data.TIS;
        } else if (data.tis !== undefined) {
            finalData.tis = data.tis;
        } else {
            // Determine TIS based on grade name for SUB detection
            finalData.tis = isSub ? 'N' : 'Y';
        }
        
        // Set unit-specific defaults if not provided
        if (!finalData.title1) finalData.title1 = this.currentUnit;
        if (!finalData.title2) finalData.title2 = this.getDefaultTitle2();
        
        if (finalData.lot) document.getElementById('lot').value = finalData.lot;
        if (finalData.grade) document.getElementById('grade').value = finalData.grade;
        if (finalData.netweight) document.getElementById('netweight').value = finalData.netweight;
        if (finalData.tis) document.getElementById('tis').value = finalData.tis;
        // Auto-update shift to current shift (override history)
        if (typeof shift_table === 'function') {
            const currentShift = shift_table();
            document.getElementById('shift').value = currentShift;
            console.log(`🕐 Auto-updated shift to current: ${currentShift}`);
            
            // Update shift status message
            const statusMessages = {
                M: "ตอนนี้คือเวลาทำงานของกะเช้า",
                E: "ตอนนี้คือเวลาทำงานของกะบ่าย",
                N: "ตอนนี้คือเวลาทำงานของกะดึก"
            };
            const currentShiftDisplay = document.getElementById('currentShiftDisplay');
            if (currentShiftDisplay) {
                currentShiftDisplay.textContent = statusMessages[currentShift] || '';
            }
        } else if (finalData.shift) {
            document.getElementById('shift').value = finalData.shift;
        }
        
        // Auto-update date to today (override history)
        const idateElement = document.getElementById('idate');
        if (idateElement) {
            const today = new Date().getDate();
            idateElement.value = today;
            console.log(`📅 Auto-updated date to today: ${today}`);
        }
        
        // Handle fromPage/toPage (check both camelCase and lowercase)
        const fromPageValue = finalData.fromPage || finalData.frompage || '';
        const toPageValue = finalData.toPage || finalData.topage || '';
        
        if (fromPageValue) document.getElementById('frompage').value = fromPageValue;
        if (toPageValue) document.getElementById('topage').value = toPageValue;
        
        // Restore template selection with smart auto-selection
        const templateSelect = document.getElementById('template_select');
        if (templateSelect) {
            let templateValue = finalData.template;
            
            // If no template in data, auto-select based on grade type and TIS
            if (!templateValue && finalData.grade) {
                const unit = this.currentUnit || 'HDPE';
                const upperUnit = unit.toUpperCase();
                
                // Auto-select template based on business rules
                if (upperUnit === 'HDPE') {
                    templateValue = isSub ? 'template1' : 'template3';
                } else if (upperUnit === 'PP' || upperUnit === 'PPC') {
                    templateValue = isSub ? 'template1' : 'template2';
                }
                
                console.log(`🎯 Auto-selected template (no history): ${templateValue} for ${finalData.grade}`);
            }
            
            if (templateValue) {
                templateSelect.value = templateValue;
            }
            
            // CRITICAL: Disable template selection for SUB grades
            if (isSub) {
                templateSelect.disabled = true;
                templateSelect.style.cursor = 'not-allowed';
                templateSelect.style.opacity = '0.6';
                console.log('🔒 Template dropdown DISABLED for SUB grade');
            } else {
                templateSelect.disabled = false;
                templateSelect.style.cursor = 'pointer';
                templateSelect.style.opacity = '1';
            }
        }
        
        // Restore FT/LT checkboxes from object-based controlprint
        if (finalData.controlprint && typeof finalData.controlprint === 'object') {
            const ftCheckbox = document.getElementById('ft');
            const ltCheckbox = document.getElementById('lt');
            
            if (ftCheckbox) ftCheckbox.checked = finalData.controlprint.ft || false;
            if (ltCheckbox) ltCheckbox.checked = finalData.controlprint.lt || false;
            
            console.log('✅ Restored FT/LT from object:', finalData.controlprint);
        }
        // Legacy support: decode binary controlPrint if object not available
        else if (finalData.controlPrint !== undefined || finalData.controlprint !== undefined) {
            const controlValue = finalData.controlPrint || finalData.controlprint || 0;
            const checkboxStates = decodeControlPrint(controlValue);
            
            console.log(`🔓 Decoding legacy controlPrint: ${controlValue}`, checkboxStates);
            
            const ftCheckbox = document.getElementById('ft');
            const ltCheckbox = document.getElementById('lt');
            
            if (ftCheckbox) ftCheckbox.checked = checkboxStates.ft;
            if (ltCheckbox) ltCheckbox.checked = checkboxStates.lt;
        }
        
        // Store additional data for report (title1, title2, sirim data)
        const unitDefaults = {
            HDPE: {
                title1: 'HDPE',
                title2: 'HIGH DENSITY POLYETHYLENE'
            },
            PP: {
                title1: 'PP',
                title2: 'POLYPROPYLENE'
            },
            PPC: {
                title1: 'PPC',
                title2: 'POLYPROPYLENE COMPOUND'
            }
        };
        
        const defaults = unitDefaults[this.currentUnit] || unitDefaults.HDPE;
        
        this.additionalData = {
            title1: data.title1 || defaults.title1,
            title2: data.title2 || defaults.title2,
            sirim_title1: data.sirim_title1 || 'Certified to MS1058 : PART 1 : 2005',
            sirim_title2: data.sirim_title2 || 'Certified No. : PC004152',
            sirim_title3: data.sirim_title3 || 'Designation : PE100'
        };
        
        // Trigger lot input event to show character count
        const lotInput = document.getElementById('lot');
        if (lotInput) {
            lotInput.dispatchEvent(new Event('input'));
        }

        this.saveFormData();
    }

    /**
     * Save form data to session storage
     */
    saveFormData() {
        const formData = this.getFormData();
        // Merge with additional data if available
        const completeData = {
            ...formData,
            ...(this.additionalData || {})
        };
        const sessionKey = `${this.currentUnit.toLowerCase()}_form_data`;
        saveToSession(sessionKey, completeData);
    }

    /**
     * Restore form data from session storage or load last used grade
     */
    restoreFormData() {
        const sessionKey = `${this.currentUnit.toLowerCase()}_form_data`;
        const savedData = getFromSession(sessionKey);
        if (savedData) {
            console.log('📂 Checking session storage:', savedData);
            
            // CRITICAL: Don't restore SUB grades from session if not saved in history
            // SUB grades are temporary selections until user clicks Submit
            if (savedData.grade && savedData.grade.includes(' SUB')) {
                const baseGrade = savedData.grade.replace(/ SUB$/i, '');
                const historyData = gradeHistory.loadGradeHistory(this.currentUnit, savedData.grade);
                
                if (!historyData) {
                    console.log('⚠️ SUB grade not in history - ignoring session, loading base grade instead');
                    const baseHistory = gradeHistory.loadGradeHistory(this.currentUnit, baseGrade);
                    if (baseHistory) {
                        this.populateForm(baseHistory);
                        return;
                    }
                    // Fall through to load last used grade
                } else {
                    console.log('✅ SUB grade found in history - restoring from session');
                    this.populateForm(savedData);
                    return;
                }
            } else {
                // Normal grade (not SUB) - restore as usual
                console.log('📂 Restoring from session storage:', savedData);
                this.populateForm(savedData);
                return;
            }
        }
        
        // No session data - try to load last used grade for current unit
        console.log(`🔍 No session data, loading last used grade for ${this.currentUnit}`);
        const lastGrade = gradeHistory.getLastUsedGrade(this.currentUnit);
        
        // Validate lastGrade has required data
        if (lastGrade && lastGrade.grade && Object.keys(lastGrade).length > 0) {
            console.log(`✅ Auto-loading last used grade:`, lastGrade);
            
            // Show notification to user
            if (window.Swal) {
                window.Swal.fire({
                    icon: 'info',
                    title: 'โหลดข้อมูลล่าสุด',
                    html: `โหลดข้อมูล <strong>${lastGrade.grade}</strong> ล่าสุดจากประวัติ<br><small>คุณสามารถแก้ไขข้อมูลได้ตามต้องการ</small>`,
                    timer: 5000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end',
                    timerProgressBar: true
                });
            }
            
            // Populate form with last used grade data
            this.populateForm({
                ...lastGrade,
                unit: this.currentUnit
            });
        } else {
            console.log(`📭 No history found for ${this.currentUnit} - form will be empty`);
            // First time use or no history - form stays empty with placeholders
        }
    }

    /**
     * Show validation errors
     * @param {object} errors - Validation errors
     */
    showValidationErrors(errors) {
        // Clear all errors first
        this.clearValidationErrors();

        // Show errors
        Object.keys(errors).forEach(field => {
            // Special handling for pages validation
            if (field === 'pages') {
                // Show pages error on both frompage and topage fields
                const frompageErrorSpan = document.getElementById('frompage-error');
                const topageErrorSpan = document.getElementById('topage-error');
                
                if (frompageErrorSpan) {
                    frompageErrorSpan.textContent = errors[field];
                    frompageErrorSpan.className = 'text-red-500 text-sm font-medium';
                    frompageErrorSpan.classList.remove('hidden');
                }
                if (topageErrorSpan) {
                    topageErrorSpan.textContent = errors[field];
                    topageErrorSpan.className = 'text-red-500 text-sm font-medium';
                    topageErrorSpan.classList.remove('hidden');
                }
                return;
            }

            const errorSpan = document.getElementById(`${field}-error`);
            if (errorSpan) {
                errorSpan.textContent = errors[field];
                errorSpan.className = 'text-red-500 text-sm font-medium';
                errorSpan.classList.remove('hidden');
            }
        });
    }

    /**
     * Clear validation errors
     */
    clearValidationErrors() {
        const errorSpans = document.querySelectorAll('[id$="-error"]');
        errorSpans.forEach(span => {
            if (span.id !== 'lot-error') { // Keep lot character counter
                span.textContent = '';
                span.classList.add('hidden');
            }
        });
    }

    /**
     * Show Grade History Modal with search and pagination
     */
    showGradeHistoryModal() {
        const allGrades = gradeHistory.getAllGradesForUnit(this.currentUnit);
        
        if (allGrades.length === 0) {
            if (window.Swal) {
                window.Swal.fire({
                    icon: 'info',
                    title: 'ไม่มีประวัติ',
                    text: `ยังไม่มีประวัติการใช้งาน Grade สำหรับ ${this.currentUnit}`,
                    confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()
                });
            }
            return;
        }
        
        // Get theme colors
        const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
        const secondaryColor = getComputedStyle(document.documentElement).getPropertyValue('--secondary-color').trim();
        const bgPrimary = getComputedStyle(document.documentElement).getPropertyValue('--bg-primary').trim();
        const bgSecondary = getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim();
        const textPrimary = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
        const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
        
        // Pagination state
        let currentPage = 1;
        let searchTerm = '';
        const rowsPerPage = 10;
        
        // Filter and pagination functions
        const getFilteredGrades = () => {
            if (!searchTerm.trim()) return allGrades;
            return allGrades.filter(grade => 
                grade.toLowerCase().includes(searchTerm.toLowerCase())
            );
        };
        
        const getPaginatedGrades = (filteredGrades) => {
            const startIndex = (currentPage - 1) * rowsPerPage;
            const endIndex = startIndex + rowsPerPage;
            return filteredGrades.slice(startIndex, endIndex);
        };
        
        // Render table function
        const renderHistoryTable = () => {
            const filteredGrades = getFilteredGrades();
            const totalPages = Math.ceil(filteredGrades.length / rowsPerPage);
            const paginatedGrades = getPaginatedGrades(filteredGrades);
            
            // Adjust page if needed
            if (currentPage > totalPages && totalPages > 0) {
                currentPage = totalPages;
            }
            
            let html = `
                <style>
                    .search-box {
                        margin-bottom: 16px;
                        width: 100%;
                    }
                    .search-input {
                        width: 100%;
                        padding: 10px 16px;
                        border: 2px solid ${borderColor};
                        border-radius: 8px;
                        font-size: 14px;
                        color: ${textPrimary};
                        background: ${bgPrimary};
                        transition: border-color 0.2s;
                    }
                    .search-input:focus {
                        outline: none;
                        border-color: ${primaryColor};
                    }
                    .history-table-container {
                        background: ${bgPrimary};
                        color: ${textPrimary};
                        max-height: 500px;
                        overflow-y: auto;
                        border: 1px solid ${borderColor};
                        border-radius: 8px;
                        margin-bottom: 16px;
                    }
                    .history-table {
                        width: 100%;
                        border-collapse: collapse;
                    }
                    .history-table thead {
                        position: sticky;
                        top: 0;
                        background: ${bgSecondary};
                        color: ${textPrimary};
                        border-bottom: 2px solid ${borderColor};
                        z-index: 10;
                    }
                    .history-table th {
                        padding: 12px 8px;
                        text-align: left;
                        font-weight: 600;
                        font-size: 12px;
                        text-transform: uppercase;
                    }
                    .history-table td {
                        padding: 10px 8px;
                        border-bottom: 1px solid ${borderColor};
                        font-size: 14px;
                    }
                    .hover-row {
                        cursor: pointer;
                        transition: background-color 0.2s, transform 0.1s;
                    }
                    .hover-row:hover {
                        background: ${bgSecondary} !important;
                        transform: scale(1.005);
                    }
                    .pagination-container {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 12px 16px;
                        background: ${bgSecondary};
                        border-radius: 8px;
                        margin-top: 12px;
                    }
                    .pagination-info {
                        color: ${textPrimary};
                        font-size: 14px;
                        font-weight: 500;
                    }
                    .pagination-buttons {
                        display: flex;
                        gap: 10px;
                        align-items: center;
                    }
                    .page-btn {
                        background: ${secondaryColor};
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: opacity 0.2s;
                        min-width: 90px;
                        font-size: 13px;
                    }
                    .page-btn:hover:not(:disabled) {
                        opacity: 0.85;
                    }
                    .page-btn:disabled {
                        opacity: 0.4;
                        cursor: not-allowed;
                    }
                    .page-number {
                        color: ${textPrimary};
                        font-weight: 600;
                        padding: 0 12px;
                        font-size: 14px;
                    }
                    .no-results {
                        text-align: center;
                        padding: 60px 20px;
                        color: ${textPrimary};
                        font-size: 16px;
                    }
                    .load-btn {
                        background: ${secondaryColor};
                        color: white;
                        border: none;
                        padding: 6px 16px;
                        border-radius: 6px;
                        cursor: pointer;
                        font-weight: 500;
                        transition: opacity 0.2s;
                    }
                    .load-btn:hover {
                        opacity: 0.8;
                    }
                </style>
                
                <div class="search-box">
                    <input 
                        type="text" 
                        class="search-input" 
                        id="gradeSearchInput"
                        placeholder="🔍 ค้นหา Grade..." 
                        value="${searchTerm}"
                    />
                </div>
                
                <div class="history-table-container">`;
            
            if (paginatedGrades.length > 0) {
                html += `
                    <table class="history-table">
                        <thead>
                            <tr>
                                <th style="width: 8%; text-align: center;">#</th>
                                <th style="width: 28%;">Grade</th>
                                <th style="width: 15%; text-align: center;">Lot</th>
                                <th style="width: 12%; text-align: center;">น้ำหนัก</th>
                                <th style="width: 20%; text-align: center;">วันที่บันทึก</th>
                                <th style="width: 17%; text-align: center;">Action</th>
                            </tr>
                        </thead>
                        <tbody>`;
                
                paginatedGrades.forEach((grade, index) => {
                    const data = gradeHistory.loadGradeHistory(this.currentUnit, grade);
                    const timestamp = data ? new Date(data.timestamp).toLocaleString('th-TH', {
                        year: '2-digit',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : '-';
                    
                    const globalIndex = (currentPage - 1) * rowsPerPage + index + 1;
                    
                    html += `
                        <tr class="hover-row grade-history-row" data-grade="${grade}">
                            <td style="text-align: center; font-weight: 600; color: ${textPrimary};">${globalIndex}</td>
                            <td style="font-weight: 700; color: ${primaryColor};">${grade}</td>
                            <td style="text-align: center; color: ${textPrimary};">${data?.lot || '-'}</td>
                            <td style="text-align: center; color: ${textPrimary};">${data?.netweight || '-'}</td>
                            <td style="text-align: center; font-size: 13px; color: ${textPrimary};">${timestamp}</td>
                            <td style="text-align: center;">
                                <button class="load-btn load-grade-btn" data-grade="${grade}">
                                    โหลด
                                </button>
                            </td>
                        </tr>
                    `;
                });
                
                html += `
                        </tbody>
                    </table>`;
            } else {
                html += `
                    <div class="no-results">
                        ไม่พบ Grade ที่ค้นหา "${searchTerm}"
                    </div>`;
            }
            
            html += `</div>`;
            
            // Pagination controls (only show if more than 10 items)
            if (filteredGrades.length > rowsPerPage) {
                const startItem = (currentPage - 1) * rowsPerPage + 1;
                const endItem = Math.min(currentPage * rowsPerPage, filteredGrades.length);
                
                html += `
                    <div class="pagination-container">
                        <div class="pagination-info">
                            แสดง ${startItem}-${endItem} จาก ${filteredGrades.length} รายการ
                        </div>
                        <div class="pagination-buttons">
                            <button class="page-btn prev-btn" ${currentPage === 1 ? 'disabled' : ''}>
                                ← ก่อนหน้า
                            </button>
                            <span class="page-number">หน้า ${currentPage}/${totalPages}</span>
                            <button class="page-btn next-btn" ${currentPage >= totalPages ? 'disabled' : ''}>
                                ถัดไป →
                            </button>
                        </div>
                    </div>`;
            }
            
            html += `
                <div style="margin-top: 16px; padding: 12px; background: ${bgSecondary}; border-radius: 8px; text-align: center;">
                    <p style="color: ${textPrimary}; font-size: 13px; margin: 0;">
                        💡 คลิกที่แถวหรือปุ่ม "โหลด" เพื่อนำข้อมูลมาใส่ในฟอร์ม
                    </p>
                </div>`;
            
            return html;
        };
        
        // Show modal
        if (window.Swal) {
            window.Swal.fire({
                title: `📋 ประวัติ Grade - ${this.currentUnit}`,
                html: renderHistoryTable(),
                width: '900px',
                showConfirmButton: true,
                confirmButtonText: 'ปิด',
                confirmButtonColor: primaryColor,
                background: bgSecondary,
                color: textPrimary,
                didOpen: () => {
                    const modal = window.Swal.getHtmlContainer();
                    
                    // Attach event listeners
                    const attachListeners = () => {
                        // Search input
                        const searchInput = modal.querySelector('#gradeSearchInput');
                        if (searchInput) {
                            searchInput.addEventListener('input', (e) => {
                                // Remove Thai characters and convert to uppercase
                                let value = e.target.value;
                                value = value.replace(/[\u0e01-\u0e59]/g, ''); // Remove Thai characters
                                value = value.toUpperCase(); // Convert to uppercase
                                
                                // Update input value if changed
                                if (e.target.value !== value) {
                                    e.target.value = value;
                                }
                                
                                searchTerm = value;
                                currentPage = 1;
                                modal.innerHTML = renderHistoryTable();
                                attachListeners();
                            });
                            searchInput.focus();
                        }
                        
                        // Previous button
                        const prevBtn = modal.querySelector('.prev-btn');
                        if (prevBtn) {
                            prevBtn.addEventListener('click', () => {
                                if (currentPage > 1) {
                                    currentPage--;
                                    modal.innerHTML = renderHistoryTable();
                                    attachListeners();
                                }
                            });
                        }
                        
                        // Next button
                        const nextBtn = modal.querySelector('.next-btn');
                        if (nextBtn) {
                            nextBtn.addEventListener('click', () => {
                                const filteredGrades = getFilteredGrades();
                                const totalPages = Math.ceil(filteredGrades.length / rowsPerPage);
                                if (currentPage < totalPages) {
                                    currentPage++;
                                    modal.innerHTML = renderHistoryTable();
                                    attachListeners();
                                }
                            });
                        }
                        
                        // Load grade buttons and rows
                        modal.querySelectorAll('.load-grade-btn, .grade-history-row').forEach(btn => {
                            btn.addEventListener('click', (e) => {
                                e.stopPropagation();
                                const gradeName = btn.dataset.grade;
                                this.loadGradeFromHistory(gradeName);
                                window.Swal.close();
                            });
                        });
                    };
                    
                    attachListeners();
                }
            });
        }
    }

    /**
     * Load grade data from history
     * @param {string} gradeName - Grade name to load
     */
    loadGradeFromHistory(gradeName) {
        const data = gradeHistory.loadGradeHistory(this.currentUnit, gradeName);
        
        if (data) {
            console.log(`📂 Loading grade from history: ${gradeName}`, data);
            
            // Auto-update date and shift to current values when loading from history
            const currentShift = typeof shift_table === 'function' ? shift_table() : 'M';
            const today = new Date().getDate();
            
            this.populateForm({
                ...data,
                grade: gradeName,
                unit: this.currentUnit,
                shift: currentShift, // Override with current shift
                idate: today // Override with today's date
            });
            
            console.log(`🕐 Grade history loaded with current shift: ${currentShift} and date: ${today}`);
            
            if (window.Swal) {
                window.Swal.fire({
                    icon: 'success',
                    title: 'โหลดสำเร็จ',
                    text: `โหลดข้อมูล ${gradeName} เรียบร้อยแล้ว`,
                    timer: 4000,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            }
        }
    }

    /**
     * Handle print preview
     */
    handlePrintPreview() {
        const sessionKey = `${this.currentUnit.toLowerCase()}_form_data`;
        const savedData = getFromSession(sessionKey);
        
        // Validate data before print preview
        const validation = validateForPrintPreview(savedData, this.currentUnit);
        if (!validation.valid) {
            if (window.Swal) {
                window.Swal.fire({
                    icon: 'error',
                    title: 'ไม่สามารถแสดงรายงานได้',
                    text: validation.message,
                    confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()
                });
            } else {
                alert(validation.message);
            }
            return;
        }
        
        if (savedData && savedData.lot && savedData.grade) {
            console.log(`📄 Opening report for ${this.currentUnit}: ${savedData.grade}`);
            
            // Prepare data for report.html (NEW FORMAT)
            const reportData = {
                grade: savedData.grade,
                netweight: savedData.netweight,
                lot: savedData.lot,
                fromPage: savedData.frompage,
                toPage: savedData.topage,
                shift: savedData.shift,
                idate: savedData.idate,
                tis: savedData.tis,
                unit: this.currentUnit, // Use current unit instead of saved unit
                template: savedData.template || this.getDefaultTemplate(),
                controlprint: {
                    ft: savedData.controlprint?.ft || false,
                    lt: savedData.controlprint?.lt || false
                },
                title1: savedData.title1 || this.currentUnit,
                title2: savedData.title2 || this.getDefaultTitle2(),
                sirim_title1: savedData.sirim_title1 || 'Certified to MS1058 : PART 1 : 2005',
                sirim_title2: savedData.sirim_title2 || 'Certified No. : PC004152',
                sirim_title3: savedData.sirim_title3 || 'Designation : PE100'
            };
            
            // Save to sessionStorage for report.html
            sessionStorage.setItem('recent_hd_print', JSON.stringify(reportData));
            console.log('✅ Data saved to sessionStorage for report:', reportData);
            
            // Open report page (module-based format)
            window.open('report.html', '_blank');
        } else {
            if (window.Swal) {
                window.Swal.fire({
                    icon: 'warning',
                    title: 'ไม่พบข้อมูล',
                    text: 'กรุณา Submit ข้อมูลก่อนดูรายงาน',
                    confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim()
                });
            } else {
                alert('กรุณา Submit ข้อมูลก่อนดูรายงาน');
            }
        }
    }

    /**
     * Clear form data (reset to defaults)
     */
    clearFormData() {
        const form = document.getElementById('tagForm');
        if (!form) return;

        // Reset all input fields
        form.reset();

        // Clear validation errors
        this.clearValidationErrors();

        console.log('🧹 Form data cleared');
    }

    /**
     * Enable Print Preview button with checkmark after successful save
     */
    enablePrintPreviewWithCheckmark() {
        const printBtn = document.getElementById('btn_view_report');
        if (!printBtn) return;

        // Enable button
        printBtn.disabled = false;
        printBtn.classList.remove('bg-gray-400', 'text-gray-600', 'cursor-not-allowed', 'opacity-50');
        printBtn.classList.add('theme-btn-secondary');

        // Add checkmark and update text
        printBtn.innerHTML = `
            <span class="flex items-center justify-between w-full">
                <span class="flex-1 text-center">Print Preview</span>
                <span class="inline-flex items-center px-3 py-2 rounded-full text-sm font-medium bg-white text-gray-900 flex-shrink-0 ml-2">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                    </svg>
                </span>
            </span>
        `;

        console.log('✅ Print Preview button enabled with checkmark');
    }

    /**
     * Reset Print Preview button to disabled state when form data changes
     */
    resetPrintPreviewButton() {
        const printBtn = document.getElementById('btn_view_report');
        if (!printBtn) return;

        // Only reset if button was previously enabled (has checkmark)
        if (!printBtn.disabled && printBtn.innerHTML.includes('M5 13l4 4L19 7')) {
            // Disable button
            printBtn.disabled = true;
            printBtn.classList.remove('theme-btn-secondary');
            printBtn.classList.add('bg-gray-400', 'text-gray-600', 'cursor-not-allowed', 'opacity-50');

            // Reset text without checkmark
            printBtn.innerHTML = 'Print Preview';

            console.log('🔄 Print Preview button reset - data changed');
        }
    }

    /**
     * Get default title2 based on current unit
     */
    getDefaultTitle2() {
        switch (this.currentUnit) {
            case 'HDPE': return 'HIGH DENSITY POLYETHYLENE';
            case 'PP': return 'POLYPROPYLENE';  
            case 'PPC': return 'POLYPROPYLENE COMPOUND';
            default: return 'HIGH DENSITY POLYETHYLENE';
        }
    }

    /**
     * Get default template based on current unit
     */
    getDefaultTemplate() {
        switch (this.currentUnit) {
            case 'HDPE': return 'template3'; // HDPE has template3 as default
            case 'PP': 
            case 'PPC': return 'template2'; // PP/PPC have template2 as default
            default: return 'template1';
        }
    }
}
