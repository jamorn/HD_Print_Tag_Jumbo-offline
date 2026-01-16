/**
 * Enhanced Form Component with Template Selector
 * Handles form rendering, validation, and submission with template selection
 */

import { 
    validateForm,
    isAllowedNumericKey,
    filterNumericInput
} from '../utils/validator.js';
import { saveToSession, getFromSession } from '../utils/storage.js';
import { TemplateSelector } from '../form/TemplateSelector.js';
import { getUnitConfig } from '../report/config/UnitConfig.js';

export class EnhancedFormComponent {
    constructor(options = {}) {
        this.formData = {};
        this.onSubmitCallback = null;
        this.currentUnit = options.defaultUnit || 'HDPE';
        this.templateSelector = null;
        this.controlPrintValue = 4; // Default: template2 (มอก.)
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
            <div class="rounded-xl overflow-hidden shadow-2xl transition-transform hover:scale-[1.005] duration-300 bg-[#030815] mb-6 border border-gray-700">
                <!-- Card Header -->
                <div class="bg-[#101828] p-4 flex items-center justify-between border-b border-gray-700">
                    <h2 class="text-xl font-semibold text-white">
                        ข้อมูลการผลิตและการตั้งค่า <span id="currentShiftDisplay" class="text-violet-400 text-sm">${shiftText}</span>
                    </h2>
                </div>

                <!-- Card Body -->
                <div class="p-6">
                    <!-- Section 1: Unit Selection -->
                    <p class="text-gray-200 font-bold mb-4 border-b pb-2 border-gray-700">1. เลือก Unit</p>
                    
                    <div class="mb-6">
                        <div class="flex gap-3">
                            <button type="button" class="unit-btn flex-1 py-2.5 px-4 border-2 border-gray-600 bg-gray-900 text-white rounded-lg hover:border-violet-500 transition duration-150 active" data-unit="HDPE">
                                HDPE
                            </button>
                            <button type="button" class="unit-btn flex-1 py-2.5 px-4 border-2 border-gray-600 bg-gray-900 text-white rounded-lg hover:border-violet-500 transition duration-150" data-unit="PP">
                                PP
                            </button>
                            <button type="button" class="unit-btn flex-1 py-2.5 px-4 border-2 border-gray-600 bg-gray-900 text-white rounded-lg hover:border-violet-500 transition duration-150" data-unit="PPC">
                                PPC
                            </button>
                        </div>
                    </div>

                    <!-- Section 2: Template Selection -->
                    <p class="text-gray-200 font-bold mb-4 border-b pb-2 border-gray-700">2. รูปแบบการพิมพ์</p>
                    
                    <div id="templateSelectorContainer" class="mb-6"></div>

                    <!-- Section 3: Form Fields -->
                    <p class="text-gray-200 font-bold mb-4 border-b pb-2 border-gray-700">3. ข้อมูลการผลิต</p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-4 mb-8">
                        <!-- Lot Field -->
                        <div class="col-span-1">
                            <label for="lot" class="block text-sm font-medium text-gray-300 mb-1">Lot</label>
                            <input type="text" 
                                   id="lot" 
                                   inputmode="numeric"
                                   placeholder="ใส่ Lot การผลิต"
                                   class="w-full p-2.5 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-violet-500 focus:border-violet-500 shadow-sm"
                                   maxlength="10">
                            <span id="lot-error" class="text-sm font-medium"></span>
                        </div>

                        <!-- Grade Field (Format: P901BK/750) -->
                        <div class="col-span-1">
                            <label for="grade" class="block text-sm font-medium text-gray-300 mb-1">Grade / Net Weight</label>
                            <select id="grade" 
                                    class="w-full p-2.5 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-violet-500 focus:border-violet-500 shadow-sm">
                                <option value="">เลือก Grade</option>
                            </select>
                            <span id="grade-error" class="text-red-500 text-sm hidden font-medium"></span>
                        </div>

                        <!-- Shift Field -->
                        <div class="col-span-1">
                            <label for="shift" class="block text-sm font-medium text-gray-300 mb-1">Shift</label>
                            <select id="shift" 
                                    name="shift" 
                                    class="w-full p-2.5 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-violet-500 focus:border-violet-500 shadow-sm">
                                <option value="M">กะเช้า</option>
                                <option value="E">กะบ่าย</option>
                                <option value="N">กะดึก</option>
                            </select>
                        </div>
                        
                        <!-- Date Field -->
                        <div class="col-span-1">
                            <label for="idate" class="block text-sm font-medium text-gray-300 mb-1">วันที่</label>
                            <input type="date" 
                                   id="idate" 
                                   class="w-full p-2.5 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-violet-500 focus:border-violet-500 shadow-sm">
                        </div>

                        <!-- From Page -->
                        <div class="col-span-1">
                            <label for="fromPage" class="block text-sm font-medium text-gray-300 mb-1">จากหน้า</label>
                            <input type="number" 
                                   id="fromPage" 
                                   placeholder="1"
                                   value="1"
                                   class="w-full p-2.5 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-violet-500 focus:border-violet-500 shadow-sm">
                        </div>

                        <!-- To Page -->
                        <div class="col-span-1">
                            <label for="toPage" class="block text-sm font-medium text-gray-300 mb-1">ถึงหน้า</label>
                            <input type="number" 
                                   id="toPage" 
                                   placeholder="30"
                                   value="30"
                                   class="w-full p-2.5 border border-gray-600 bg-gray-900 text-white rounded-lg focus:ring-violet-500 focus:border-violet-500 shadow-sm">
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex flex-col sm:flex-row gap-4 mt-6">
                        <button id="btn_submit" 
                                type="submit"
                                class="w-full py-3 px-4 bg-violet-600 text-white font-bold rounded-lg shadow-lg hover:bg-violet-700 transition duration-150 transform focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 active:bg-violet-800 focus:ring-offset-[#030815]">
                            สร้าง Tag
                        </button>
                        
                        <button id="btn_preview" 
                                type="button"
                                class="w-full py-3 px-4 bg-gray-700 text-white font-bold rounded-lg shadow-lg hover:bg-gray-600 transition duration-150 transform focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-[#030815]">
                            ดูตัวอย่าง
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Mount component and attach event listeners
     */
    mount(containerId) {
        const container = document.getElementById(containerId);
        if (!container) {
            console.error(`Container ${containerId} not found`);
            return;
        }

        container.innerHTML = this.render();
        this.attachEventListeners();
        this.initializeTemplateSelector();
        this.loadUnitData(this.currentUnit);
    }

    /**
     * Initialize template selector
     */
    initializeTemplateSelector() {
        const unitConfig = getUnitConfig(this.currentUnit);
        
        this.templateSelector = new TemplateSelector('templateSelectorContainer', {
            defaultUnit: this.currentUnit,
            defaultTemplate: unitConfig.defaultTemplate,
            onChange: (data) => {
                this.controlPrintValue = data.binaryValue;
                console.log(`Template changed: ${data.templateId}, Binary: ${data.binaryValue}`);
            }
        });
    }

    /**
     * Load unit data (grades in format: Grade/NetWeight)
     */
    loadUnitData(unit) {
        const unitConfig = getUnitConfig(unit);
        const gradeSelect = document.getElementById('grade');
        
        if (!gradeSelect || !unitConfig.gradeData) return;

        // Populate grade dropdown in format: Grade/NetWeight
        gradeSelect.innerHTML = '<option value="">เลือก Grade</option>';
        
        unitConfig.gradeData.forEach(item => {
            // Create option for each netweight variant
            item.netweightArray.forEach(weight => {
                const option = document.createElement('option');
                const gradeWithWeight = `${item.grade}/${weight}`;
                option.value = gradeWithWeight;
                option.textContent = gradeWithWeight;
                option.dataset.grade = item.grade;
                option.dataset.netweight = weight;
                option.dataset.description = item.description;
                gradeSelect.appendChild(option);
            });
        });

        // Set default value (first grade/weight combination)
        if (unitConfig.defaults?.grade && unitConfig.defaults?.netweight) {
            const defaultValue = `${unitConfig.defaults.grade}/${unitConfig.defaults.netweight}`;
            gradeSelect.value = defaultValue;
        } else if (gradeSelect.options.length > 1) {
            gradeSelect.selectedIndex = 1; // Select first real option
        }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Unit buttons
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const unit = e.target.dataset.unit;
                this.handleUnitChange(unit);
            });
        });

        // Grade change
        const gradeSelect = document.getElementById('grade');
        if (gradeSelect) {
            gradeSelect.addEventListener('change', (e) => {
                this.updateNetWeightOptions(e.target.value);
            });
        }

        // Submit button
        const submitBtn = document.getElementById('btn_submit');
        // Unit buttons
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const unit = e.target.dataset.unit;
                this.handleUnitChange(unit);
            });
        });
        // Set today's date
        const dateInput = document.getElementById('idate');
        if (dateInput) {
            dateInput.valueAsDate = new Date();
        }
    }

    /**
     * Handle unit change
     */
    handleUnitChange(unit) {
        // Update active button
        document.querySelectorAll('.unit-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.unit === unit);
            if (btn.dataset.unit === unit) {
                btn.classList.add('border-violet-500', 'bg-violet-900');
            } else {
                btn.classList.remove('border-violet-500', 'bg-violet-900');
            }
        });

        this.currentUnit = unit;
        this.templateSelector?.updateUnit(unit);
        this.loadUnitData(unit);
    }

    /**
     * Collect form data
     */
    collectFormData() {
        return {
            unit: this.currentUnit,
            lot: document.getElementById('lot')?.value || '',
            grade: document.getElementById('grade')?.value || '',
    /**
     * Collect form data
     */
    collectFormData() {
        const gradeSelect = document.getElementById('grade');
        const selectedOption = gradeSelect?.options[gradeSelect.selectedIndex];
        
        // Parse Grade/NetWeight format
        const gradeValue = selectedOption?.value || '';
        const gradeParts = gradeValue.split('/');
        
        return {
            unit: this.currentUnit,
            lot: document.getElementById('lot')?.value || '',
            gradeWithWeight: gradeValue, // Full format: P901BK/750
            grade: selectedOption?.dataset?.grade || gradeParts[0] || '',
            netweight: selectedOption?.dataset?.netweight || gradeParts[1] || '',
            shift: document.getElementById('shift')?.value || 'M',
            idate: document.getElementById('idate')?.value || '',
            fromPage: parseInt(document.getElementById('fromPage')?.value) || 1,
            toPage: parseInt(document.getElementById('toPage')?.value) || 30,
    handleSubmit() {
        const formData = this.collectFormData();
        
        // Basic validation
        if (!formData.lot || !formData.gradeWithWeight) {
            alert('กรุณากรอกข้อมูลให้ครบถ้วน (Lot และ Grade)');
            return;
        }

        console.log('Form submitted:', formData);
        
        if (this.onSubmitCallback) {
            this.onSubmitCallback(formData);
        }
    }

    /**
     * Handle preview
     */
    handlePreview() {
        const formData = this.collectFormData();
        console.log('Preview:', formData);
        
        // Open preview in new window/tab
        const previewUrl = `../html/report.html?preview=true`;
        localStorage.setItem('previewData', JSON.stringify(formData));
        window.open(previewUrl, '_blank');
    }

    /**
     * Set submit callback
     */
    onSubmit(callback) {
        this.onSubmitCallback = callback;
    }
}
