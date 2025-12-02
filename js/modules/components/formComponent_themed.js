/**
 * Form Component (Theme-Aware Version)
 * Handles form rendering, validation, and submission with CSS variable support
 */

import { 
    validateForm, 
    validateLot,
    isAllowedNumericKey,
    filterNumericInput,
    calculateControlPrint 
} from '../utils/validator.js';
import { saveToSession, getFromSession } from '../utils/storage.js';

export class FormComponent {
    constructor() {
        this.formData = {};
        this.onSubmitCallback = null;
    }

    /**
     * Render form HTML
     * @returns {string} HTML string
     */
    render() {
        // Get shift display text from shift_compare.js if available
        const shiftText = window.currentShiftDisplay || '';
        
        return `
            <!-- Main Card Form -->
            <div class="rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.005] duration-300 theme-card mb-6 border">
                <!-- Card Header -->
                <div class="theme-card-header p-4 flex items-center justify-between border-b theme-border">
                    <h2 class="text-xl font-semibold theme-text-primary">
                        ข้อมูลการผลิตและการตั้งค่า <span id="currentShiftDisplay" class="text-sm" style="color: white;">${shiftText}</span>
                    </h2>
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
                                   maxlength="10">
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
                                ${Array.from({ length: 31 }, (_, i) => `<option value="${i + 1}">${i + 1}</option>`).join('')}
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

                    <!-- Section 2: Checkboxes -->
                    <p class="theme-text-primary font-bold mb-4 border-b pb-2 theme-border">2. การตั้งค่าการแสดงผล</p>

                    <div class="flex flex-wrap gap-x-8 gap-y-4 mb-6">
                        <label class="flex items-center theme-text-primary text-base cursor-pointer">
                            <input type="checkbox" 
                                   id="ft" 
                                   name="controlprint" 
                                   value="8"
                                   class="form-checkbox h-5 w-5 rounded mr-3"
                                   style="accent-color: var(--primary-color);">
                            <span>FT</span>
                        </label>

                        <label class="flex items-center theme-text-primary text-base cursor-pointer">
                            <input type="checkbox" 
                                   id="lt" 
                                   name="controlprint" 
                                   value="4"
                                   class="form-checkbox h-5 w-5 rounded mr-3"
                                   style="accent-color: var(--primary-color);">
                            <span>LT</span>
                        </label>

                        <label class="flex items-center theme-text-primary text-base cursor-pointer">
                            <input type="checkbox" 
                                   id="mfg" 
                                   name="controlprint" 
                                   value="2" 
                                   checked
                                   class="form-checkbox h-5 w-5 rounded mr-3"
                                   style="accent-color: var(--primary-color);">
                            <span>เครื่องหมาย มอก.</span>
                        </label>

                        <label class="flex items-center theme-text-primary text-base cursor-pointer">
                            <input type="checkbox" 
                                   id="sirim" 
                                   name="controlprint" 
                                   value="1" 
                                   checked
                                   class="form-checkbox h-5 w-5 rounded mr-3"
                                   style="accent-color: var(--primary-color);">
                            <span>Sirim logo</span>
                        </label>
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
                const value = filterNumericInput(e.target.value);
                e.target.value = value;
                
                const errorSpan = document.getElementById('lot-error');
                if (errorSpan) {
                    const length = value.length;
                    if (length === 0) {
                        errorSpan.textContent = '';
                    } else if (length < 10) {
                        errorSpan.textContent = `${length}/10 หลัก`;
                        errorSpan.style.color = '#ef4444'; // red - ไม่ครบ
                    } else if (length === 10) {
                        errorSpan.textContent = `${length}/10 หลัก ✓`;
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

        // Auto-save form data on input
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            input.addEventListener('change', () => this.saveFormData());
        });
    }

    /**
     * Handle form submission
     */
    async handleSubmit() {
        const formData = this.getFormData();
        const validation = validateForm(formData);

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

        // Call submit callback
        if (this.onSubmitCallback) {
            await this.onSubmitCallback(formData);
        }
    }

    /**
     * Get form data
     * @returns {object} Form data
     */
    getFormData() {
        return {
            lot: document.getElementById('lot')?.value || '',
            grade: document.getElementById('grade')?.value || '',
            netweight: document.getElementById('netweight')?.value || '',
            tis: document.getElementById('tis')?.value || '',
            shift: document.getElementById('shift')?.value || 'M',
            idate: document.getElementById('idate')?.value || '1',
            frompage: document.getElementById('frompage')?.value || '',
            topage: document.getElementById('topage')?.value || '',
            controlPrint: calculateControlPrint({
                ft: document.getElementById('ft')?.checked || false,
                lt: document.getElementById('lt')?.checked || false,
                mfg: document.getElementById('mfg')?.checked || false,
                sirim: document.getElementById('sirim')?.checked || false
            })
        };
    }

    /**
     * Populate form with data
     * @param {object} data - Data to populate
     */
    populateForm(data) {
        if (data.lot) document.getElementById('lot').value = data.lot;
        if (data.grade) document.getElementById('grade').value = data.grade;
        if (data.netweight) document.getElementById('netweight').value = data.netweight;
        if (data.tis) document.getElementById('tis').value = data.tis;
        if (data.shift) document.getElementById('shift').value = data.shift;
        if (data.idate) document.getElementById('idate').value = data.idate;
        if (data.frompage) document.getElementById('frompage').value = data.frompage;
        if (data.topage) document.getElementById('topage').value = data.topage;
        
        // Store additional data for report (title1, title2, sirim data)
        this.additionalData = {
            title1: data.title1 || 'HDPE',
            title2: data.title2 || 'HIGHT DENSITY POLYETHYLENE',
            sirim_title1: data.sirim_title1 || 'Certified to MS1058 : PART 1 : 2005',
            sirim_title2: data.sirim_title2 || 'Certified No. : PC004152',
            sirim_title3: data.sirim_title3 || 'PE100'
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
        saveToSession('hdpe_form_data', completeData);
    }

    /**
     * Restore form data from session storage
     */
    restoreFormData() {
        const savedData = getFromSession('hdpe_form_data');
        if (savedData) {
            this.populateForm(savedData);
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
     * Handle print preview
     */
    handlePrintPreview() {
        const savedData = getFromSession('hdpe_form_data');
        if (savedData && savedData.lot && savedData.grade) {
            console.log('📄 Opening report for: ' + savedData.grade);
            
            // Prepare data in the format expected by hd_report.html
            const reportData = {
                grade: savedData.grade,
                netweight: savedData.netweight,
                lot: savedData.lot,
                fromPage: savedData.frompage,
                toPage: savedData.topage,
                shift: savedData.shift,
                idate: savedData.idate,
                tis: savedData.tis,
                controlprint: savedData.controlPrint,
                title1: savedData.title1 || 'HDPE',
                title2: savedData.title2 || 'HIGHT DENSITY POLYETHYLENE',
                sirim_title1: savedData.sirim_title1 || 'Certified to MS1058 : PART 1 : 2005',
                sirim_title2: savedData.sirim_title2 || 'Certified No. : PC004152',
                sirim_title3: savedData.sirim_title3 || 'PE100'
            };
            
            // Save to sessionStorage with the key that hd_report.html expects
            sessionStorage.setItem('recent_hd_print', JSON.stringify(reportData));
            console.log('✅ Data saved to sessionStorage for report');
            
            // Open report page
            window.open('hd_report.html', '_blank');
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
}
