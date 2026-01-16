(function() {
    // ฟังก์ชัน renderForm
    window.renderForm = function(unit) {
        const container = document.getElementById('formContainer');
        if (!container) return;
        const config = getUnitConfig(unit);
        
        // Get current shift from shift_compare.js (auto-select only on first load)
        let currentShift = 'M';
        let shiftText = '';
        
        // Check if this is initial page load (no shift selected yet)
        const isInitialLoad = !window.AppState?.shiftManuallySet;
        
        if (typeof shift_table === 'function' && isInitialLoad) {
            currentShift = shift_table();
            const statusMessage = {
                M: "ตอนนี้คือเวลาทำงานของกะเช้า",
                E: "ตอนนี้คือเวลาทำงานของกะบ่าย",
                N: "ตอนนี้คือเวลาทำงานของกะดึก"
            };
            shiftText = statusMessage[currentShift] || '';
        } else if (typeof shift_table === 'function') {
            // Show current time status but don't auto-select
            const timeBasedShift = shift_table();
            const statusMessage = {
                M: "ตอนนี้คือเวลาทำงานของกะเช้า",
                E: "ตอนนี้คือเวลาทำงานของกะบ่าย",
                N: "ตอนนี้คือเวลาทำงานของกะดึก"
            };
            shiftText = statusMessage[timeBasedShift] || '';
            
            // Preserve previously selected shift if exists
            const shiftSelect = document.getElementById('shift');
            if (shiftSelect) {
                currentShift = shiftSelect.value || currentShift;
            }
        }
        
        container.innerHTML = `
            <div class="rounded-xl overflow-hidden">
                <!-- Card Header -->
                <div class="p-4 flex items-center justify-between border-b theme-border" style="background-color: var(--bg-secondary);">
                    <h2 class="text-xl font-semibold theme-text-primary">
                        ข้อมูลการผลิตและการตั้งค่า
                    </h2>
                    <button type="button" id="history-btn" class="px-4 py-2 rounded-lg font-semibold text-white transition-all hover:opacity-90 flex items-center gap-2" style="background-color: var(--primary-color);" title="ดูประวัติการใช้งาน">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                        ประวัติ
                    </button>
                </div>
                
                <!-- Card Body -->
                <div class="p-6">
                    <!-- Section 1: Form Fields -->
                    <p class="theme-text-primary font-bold mb-4 border-b pb-2 theme-border">1. ข้อมูลการผลิต</p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <!-- Lot Field -->
                        <div>
                            <label for="lot" class="block text-sm font-medium mb-1 theme-text-primary">Lot</label>
                            <input type="text" 
                                   id="lot" 
                                   inputmode="numeric"
                                   placeholder="ใส่ Lot การผลิต"
                                   class="w-full p-2.5 border rounded-lg shadow-sm theme-input"
                                   maxlength="${config.validation.lotLength}">
                            <span id="lot-error" class="text-sm font-medium text-red-500"></span>
                        </div>
                        
                        <!-- Grade Field -->
                        <div>
                            <label for="grade" class="block text-sm font-medium mb-1 theme-text-primary">Grade</label>
                            <input type="text" 
                                   id="grade" 
                                   placeholder="เลือกจากตาราง"
                                   class="w-full p-2.5 border rounded-lg shadow-sm theme-input cursor-not-allowed" 
                                   readonly>
                        </div>
                        
                        <!-- Net Weight Field -->
                        <div>
                            <label for="netweight" class="block text-sm font-medium mb-1 theme-text-primary">Net Weight</label>
                            <input type="number" 
                                   id="netweight" 
                                   placeholder="Net Weight"
                                   class="w-full p-2.5 border rounded-lg shadow-sm theme-input cursor-not-allowed" 
                                   readonly>
                        </div>
                        
                        <!-- TIS Field -->
                        <div>
                            <label for="tis" class="block text-sm font-medium mb-1 theme-text-primary">เครื่องหมาย มอก.</label>
                            <input type="text" 
                                   id="tis" 
                                   value="${config.defaults.tis || 'Y'}"
                                   class="w-full p-2.5 border rounded-lg shadow-sm theme-input cursor-not-allowed" 
                                   readonly>
                        </div>
                    </div>
                    
                    <!-- Section 2: กะและวันที่ -->
                    <p class="theme-text-primary font-bold mb-4 border-b pb-2 theme-border">2. กะและวันที่</p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-2">
                        <div>
                            <label for="shift" class="block text-sm font-medium mb-1 theme-text-primary">กะ</label>
                            <select id="shift" class="w-full p-2.5 border rounded-lg shadow-sm theme-input shift-select">
                                <option value="M" ${currentShift === 'M' ? 'selected' : ''}>M (Morning)</option>
                                <option value="E" ${currentShift === 'E' ? 'selected' : ''}>E (Evening)</option>
                                <option value="N" ${currentShift === 'N' ? 'selected' : ''}>N (Night)</option>
                            </select>
                        </div>
                        
                        <div>
                            <label for="idate" class="block text-sm font-medium mb-1 theme-text-primary">วันที่</label>
                            <input type="number" 
                                   id="idate" 
                                   placeholder="10"
                                   value="${new Date().getDate()}"
                                   min="1"
                                   max="31"
                                   class="w-full p-2.5 border rounded-lg shadow-sm theme-input">
                        </div>
                    </div>
                    
                    <!-- Section 3: การตั้งค่าการพิมพ์ -->
                    <p class="theme-text-primary font-bold mb-4 border-b pb-2 theme-border">3. การตั้งค่าการพิมพ์</p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label for="frompage" class="block text-sm font-medium mb-1 theme-text-primary">จากหน้า</label>
                            <input type="number" 
                                   id="frompage" 
                                   placeholder="1"
                                   value="1"
                                   min="1"
                                   class="w-full p-2.5 border rounded-lg shadow-sm theme-input">
                            <span id="frompage-error" class="text-sm font-medium text-red-500"></span>
                        </div>
                        
                        <div>
                            <label for="topage" class="block text-sm font-medium mb-1 theme-text-primary">ถึงหน้า</label>
                            <input type="number" 
                                   id="topage" 
                                   placeholder="1"
                                   value="1"
                                   min="1"
                                   class="w-full p-2.5 border rounded-lg shadow-sm theme-input">
                            <span id="topage-error" class="text-sm font-medium text-red-500"></span>
                        </div>
                    </div>
                    
                    <!-- Section 4: Template Selection -->
                    <p class="theme-text-primary font-bold mb-4 border-b pb-2 theme-border">4. เลือก Template (โลโก้และตรา)</p>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6" id="templateOptions">
                        ${config.availableTemplates.map(template => {
                            const templateNames = {
                                'template1': 'ไม่มีโลโก้ ไม่มีตรา',
                                'template2': 'QR Code + มอก.',
                                'template3': 'QR + มอก. + SIRIM'
                            };
                            const displayName = templateNames[template] || template;
                            
                            return `
                            <label class="template-option cursor-pointer">
                                <input type="radio" name="template" value="${template}" 
                                       ${template === config.defaultTemplate ? 'checked' : ''}
                                       class="hidden template-radio">
                                <div class="p-4 border-2 rounded-lg transition-all template-card theme-border relative"
                                     style="background-color: var(--bg-secondary);">
                                    <div class="absolute top-2 right-2 template-check hidden">
                                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style="color: var(--primary-color);">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                        </svg>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-2xl mb-2">📄</div>
                                        <div class="font-semibold text-sm theme-text-primary">${displayName}</div>
                                    </div>
                                </div>
                            </label>
                            `;
                        }).join('')}
                    </div>
                    
                    <!-- Control Print Options -->
                    <div class="flex gap-4 mb-6">
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" id="ft-checkbox" class="w-4 h-4">
                            <span class="text-sm font-medium theme-text-primary">F/T (First Tag)</span>
                        </label>
                        <label class="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" id="lt-checkbox" class="w-4 h-4">
                            <span class="text-sm font-medium theme-text-primary">L/T (Last Tag)</span>
                        </label>
                    </div>
                    
                    <!-- Submit Button -->
                    <button id="generateBtn" 
                            class="w-full py-3 rounded-lg font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                            style="background-color: var(--primary-color);">
                        ยืนยันและแสดงตัวอย่างหน้าพิมพ์
                    </button>
                </div>
            </div>
        `;
        
        // Setup template selection styling
        const templateRadios = document.querySelectorAll('.template-radio');
        const templateCards = document.querySelectorAll('.template-card');
        
        function updateTemplateSelection() {
            const templateChecks = document.querySelectorAll('.template-check');
            templateRadios.forEach((radio, index) => {
                if (radio.checked) {
                    templateCards[index].style.borderColor = 'var(--primary-color)';
                    templateCards[index].style.backgroundColor = 'var(--bg-primary)';
                    // Show checkmark
                    if (templateChecks[index]) {
                        templateChecks[index].classList.remove('hidden');
                    }
                } else {
                    templateCards[index].style.borderColor = 'var(--border-color)';
                    templateCards[index].style.backgroundColor = 'var(--bg-secondary)';
                    // Hide checkmark
                    if (templateChecks[index]) {
                        templateChecks[index].classList.add('hidden');
                    }
                }
            });
        }
        
        templateRadios.forEach(radio => {
            radio.addEventListener('change', updateTemplateSelection);
        });
        updateTemplateSelection();

        // Update template options based on whether the selected grade is SUB-standard
        window.updateTemplateOptionsForGrade = function(isSub) {
            const templateRadios = document.querySelectorAll('.template-radio');
            const templateCards = document.querySelectorAll('.template-card');
            if (!templateRadios || !templateCards) return;

            templateRadios.forEach((radio, idx) => {
                // template1 should always be enabled; template2 and template3 become disabled for SUB grades
                const tpl = radio.value;
                if (isSub) {
                    if (tpl === 'template2' || tpl === 'template3') {
                        radio.disabled = true;
                        // visual: dim the card and remove pointer
                        templateCards[idx].style.opacity = '0.45';
                        templateCards[idx].style.pointerEvents = 'none';
                        templateCards[idx].setAttribute('title', 'SUB grade — only Template 1 allowed');
                    } else {
                        radio.disabled = false;
                        templateCards[idx].style.opacity = '';
                        templateCards[idx].style.pointerEvents = '';
                        templateCards[idx].removeAttribute('title');
                        // auto-select template1 when SUB
                        if (tpl === 'template1') {
                            radio.checked = true;
                            radio.dispatchEvent(new Event('change'));
                        }
                    }
                } else {
                    // non-SUB: ensure all available templates are enabled
                    radio.disabled = false;
                    templateCards[idx].style.opacity = '';
                    templateCards[idx].style.pointerEvents = '';
                }
            });
            updateTemplateSelection();
        };
        
        // Setup shift manual selection tracking
        const shiftSelect = document.getElementById('shift');
        if (shiftSelect) {
            shiftSelect.addEventListener('change', function() {
                // Mark that user has manually changed shift
                if (!window.AppState) window.AppState = {};
                window.AppState.shiftManuallySet = true;
                console.log('✅ User manually selected shift:', this.value);
            });
        }
        
        // Setup page validation
        const fromPageInput = document.getElementById('frompage');
        const toPageInput = document.getElementById('topage');
        const fromPageError = document.getElementById('frompage-error');
        const toPageError = document.getElementById('topage-error');
        
        function validatePages() {
            let isValid = true;
            
            if (fromPageInput && toPageInput) {
                const fromPage = parseInt(fromPageInput.value, 10);
                const toPage = parseInt(toPageInput.value, 10);
                
                // Clear previous errors
                if (fromPageError) fromPageError.textContent = '';
                if (toPageError) toPageError.textContent = '';
                
                // Validate fromPage >= 1
                if (fromPage < 1 || isNaN(fromPage)) {
                    if (fromPageError) fromPageError.textContent = 'ต้องมากกว่าหรือเท่ากับ 1';
                    fromPageInput.value = '1';
                    isValid = false;
                }
                
                // Validate toPage >= 1
                if (toPage < 1 || isNaN(toPage)) {
                    if (toPageError) toPageError.textContent = 'ต้องมากกว่าหรือเท่ากับ 1';
                    toPageInput.value = '1';
                    isValid = false;
                }
                
                // Validate fromPage <= toPage
                if (fromPage > toPage && fromPage >= 1 && toPage >= 1) {
                    if (fromPageError) fromPageError.textContent = 'จากหน้าต้องไม่มากกว่าถึงหน้า';
                    isValid = false;
                }
            }
            
            return isValid;
        }
        
        if (fromPageInput) {
            fromPageInput.addEventListener('input', function() {
                // Prevent negative values
                if (this.value && parseInt(this.value, 10) < 0) {
                    this.value = '1';
                }
                validatePages();
            });
            fromPageInput.addEventListener('blur', validatePages);
        }
        
        if (toPageInput) {
            toPageInput.addEventListener('input', function() {
                // Prevent negative values
                if (this.value && parseInt(this.value, 10) < 0) {
                    this.value = '1';
                }
                validatePages();
            });
            toPageInput.addEventListener('blur', validatePages);
        }
        
        // Setup generate button
        const generateBtn = document.getElementById('generateBtn');
        if (generateBtn) {
            generateBtn.addEventListener('click', handleFormSubmit);
        }
        
        // Setup history button
        setupHistoryButton();
        
        // Setup lot input validation
        const lotInput = document.getElementById('lot');
        if (lotInput) {
            lotInput.addEventListener('input', (e) => {
                const unit = window.AppState?.currentUnit || 'HDPE';
                const config = getUnitConfig(unit);
                e.target.value = e.target.value.replace(/\D/g, '').substring(0, config.validation.lotLength);
                validateLotField();
            });
        }
        
        // Setup shift update interval (every 10 seconds)
        if (typeof updateShift === 'function') {
            // Call updateShift to sync with shift_compare.js
            setTimeout(() => {
                updateShift();
            }, 100);
        }
        
        // หลังจาก render form เสร็จ ให้ auto-fill จากประวัติล่าสุด
        const historyKey = 'grade_history_' + unit;
        const historyData = localStorage.getItem(historyKey);
        if (historyData) {
            try {
                const history = JSON.parse(historyData);
                const grades = Object.keys(history);
                if (grades.length > 0) {
                    // หา entry ที่ timestamp มากสุด
                    const latestGrade = grades.reduce((latest, key) => {
                        if (!latest) return key;
                        const t1 = new Date(history[latest].timestamp || 0).getTime();
                        const t2 = new Date(history[key].timestamp || 0).getTime();
                        return t2 > t1 ? key : latest;
                    }, null);
                    const latestData = history[latestGrade];
                    // เติมค่าลง input
                    if (latestData) {
                        if (latestData.lot && latestData.lot.length === config.validation.lotLength) {
                            document.getElementById('lot').value = latestData.lot;
                        }
                        document.getElementById('grade').value = latestGrade || '';
                        document.getElementById('netweight').value = latestData.netweight || '';
                        document.getElementById('tis').value = latestData.tis || config.defaults.tis || '';
                        document.getElementById('shift').value = latestData.shift || '';
                        document.getElementById('idate').value = latestData.idate || latestData.date || '';
                        // ...เติม field อื่นๆ ตามที่มี...
                    }
                }
            } catch (e) {
                // ignore parse error
            }
        }

        // After prefilling from history (or initial render): ensure templates respect SUB status
        try {
            const currentGradeVal = document.getElementById('grade')?.value || '';
            const isSubInitial = /\bSUB\b/i.test(currentGradeVal);
            if (window.updateTemplateOptionsForGrade) {
                window.updateTemplateOptionsForGrade(isSubInitial);
            }
            // Also enforce TIS='N' for SUB initial grade (override history/default)
            const tisInput = document.getElementById('tis');
            if (tisInput) {
                tisInput.value = isSubInitial ? 'N' : (config.defaults.tis || 'Y');
            }
        } catch (e) {
            // ignore
        }
    };

    // ฟังก์ชัน updateFormWithSelection
    window.updateFormWithSelection = function(grade, netweight, isSub, gradeString) {
        const gradeInput = document.getElementById('grade');
        const netweightInput = document.getElementById('netweight');
        // Build canonical fullGrade. Prefer passed gradeString if it already contains SUB
        let fullGrade = '';
        if (gradeString && typeof gradeString === 'string' && gradeString.trim() !== '') {
            // If gradeString already contains 'SUB' or '/SB/' assume it's the desired display form
            fullGrade = gradeString.trim();
        } else {
            // Construct canonical form: SUB before package size when isSub
            if (isSub) {
                fullGrade = `${grade} SUB/${netweight}`;
            } else {
                fullGrade = `${grade}/${netweight}`;
            }
        }
        if (gradeInput) gradeInput.value = fullGrade;
        if (netweightInput) netweightInput.value = netweight;
        // Ensure TIS shows 'N' for SUB grades (inform user it's not premium)
        try {
            const unit = window.AppState?.currentUnit || 'HDPE';
            const cfg = getUnitConfig(unit);
            const tisInput = document.getElementById('tis');
            if (tisInput) {
                tisInput.value = isSub ? 'N' : (cfg.defaults.tis || 'Y');
            }
        } catch (e) {
            // ignore if config not available
        }
        window.updateLotPrefix && window.updateLotPrefix(parseInt(netweight, 10), fullGrade);
        window.updateTemplateOptionsForGrade && window.updateTemplateOptionsForGrade(isSub);
        if (typeof GradeHistoryManager !== 'undefined') {
            const currentUnit = document.querySelector('.unit-btn.active')?.dataset.unit || 'HDPE';
            const history = GradeHistoryManager.loadGradeHistory(currentUnit, fullGrade);
            if (history) {
                // Restore form fields from history
                const lotInput = document.getElementById('lot');
                const frompageInput = document.getElementById('frompage');
                const topageInput = document.getElementById('topage');
                const shiftRadios = document.querySelectorAll('.shift-radio');
                const idateInput = document.getElementById('idate');
                const templateRadios = document.querySelectorAll('.template-radio');
                const controlprintFT = document.getElementById('controlprint-ft');
                const controlprintLT = document.getElementById('controlprint-lt');
                // Only restore if lot is not already prefilled
                const config = getUnitConfig(currentUnit);
                const pattern = new RegExp(config.validation.lotPattern);
                if (lotInput && !pattern.test(lotInput.value)) {
                    lotInput.value = history.lot || lotInput.value;
                }
                if (frompageInput) frompageInput.value = history.fromPage || '1';
                if (topageInput) topageInput.value = history.toPage || '1';
                if (shiftRadios && history.shift) {
                    shiftRadios.forEach(radio => {
                        if (radio.value === history.shift) {
                            radio.checked = true;
                            radio.dispatchEvent(new Event('change'));
                        }
                    });
                }
                if (idateInput && history.idate) idateInput.value = history.idate;
                if (templateRadios && history.template && !isSub) {
                    templateRadios.forEach(radio => {
                        if (radio.value === history.template) {
                            radio.checked = true;
                            radio.dispatchEvent(new Event('change'));
                        }
                    });
                }
                if (controlprintFT && history.controlprint) controlprintFT.checked = history.controlprint.ft || false;
                if (controlprintLT && history.controlprint) controlprintLT.checked = history.controlprint.lt || false;
            }
        }
    };

    // ฟังก์ชัน handleFormSubmit
    window.handleFormSubmit = function() {
        const unit = window.AppState?.currentUnit || 'HDPE';
        const config = getUnitConfig(unit);
        
        // Collect form data
        const grade = document.getElementById('grade')?.value || '';
        const netweight = document.getElementById('netweight')?.value || '';
        const lot = document.getElementById('lot')?.value || '';
        const fromPage = document.getElementById('frompage')?.value || '1';
        const toPage = document.getElementById('topage')?.value || '1';
        const shift = document.getElementById('shift')?.value || 'M';
        const idate = document.getElementById('idate')?.value || '1';
        const template = document.querySelector('.template-radio:checked')?.value || config.defaultTemplate;
        const ft = document.getElementById('ft-checkbox')?.checked || false;
        const lt = document.getElementById('lt-checkbox')?.checked || false;
        
        // Validate
        if (!grade || !netweight) {
            if (window.Swal) {
                Swal.fire({
                    icon: 'warning',
                    title: 'กรุณาเลือก Grade',
                    text: 'กรุณาคลิกเลือก Grade จากตารางด้านซ้าย',
                    confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
                });
            } else {
                alert('กรุณาเลือก Grade จากตารางด้านซ้าย');
            }
            return;
        }
        
        const requiredLength = config.validation.lotLength;
        if (lot.length !== requiredLength) {
            if (window.Swal) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Lot ไม่ถูกต้อง',
                    text: 'กรุณาใส่ Lot ให้ครบ ' + requiredLength + ' หลัก',
                    confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
                });
            } else {
                alert('กรุณาใส่ Lot ให้ครบ ' + requiredLength + ' หลัก');
            }
            return;
        }
        
        // Validate page numbers
        const fromPageNum = parseInt(fromPage, 10);
        const toPageNum = parseInt(toPage, 10);
        
        if (fromPageNum < 1) {
            if (window.Swal) {
                Swal.fire({
                    icon: 'warning',
                    title: 'จากหน้าไม่ถูกต้อง',
                    text: 'จากหน้าต้องมากกว่าหรือเท่ากับ 1',
                    confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
                });
            } else {
                alert('จากหน้าต้องมากกว่าหรือเท่ากับ 1');
            }
            return;
        }
        
        if (toPageNum < 1) {
            if (window.Swal) {
                Swal.fire({
                    icon: 'warning',
                    title: 'ถึงหน้าไม่ถูกต้อง',
                    text: 'ถึงหน้าต้องมากกว่าหรือเท่ากับ 1',
                    confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
                });
            } else {
                alert('ถึงหน้าต้องมากกว่าหรือเท่ากับ 1');
            }
            return;
        }
        
        if (fromPageNum > toPageNum) {
            if (window.Swal) {
                Swal.fire({
                    icon: 'warning',
                    title: 'หน้าไม่ถูกต้อง',
                    text: 'จากหน้าต้องไม่มากกว่าถึงหน้า',
                    confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
                });
            } else {
                alert('จากหน้าต้องไม่มากกว่าถึงหน้า');
            }
            return;
        }
        
        // Prepare data
        const reportData = {
            unit: unit,
            grade: grade,  // This already contains full gradeString like P901BK/SB/16500
            netweight: netweight,
            lot: lot,
            fromPage: fromPage,
            toPage: toPage,
            shift: shift,
            idate: idate,
            template: template,
            controlprint: { ft, lt },
            title1: config.defaults.title1,
            title2: config.defaults.title2,
            sirim_title1: config.defaults.sirim_title1 || '',
            sirim_title2: config.defaults.sirim_title2 || '',
            sirim_title3: config.defaults.sirim_title3 || '',
            qrCodeUrl: config.defaults.qrCodeUrl || ''
        };
        
        // Save grade history
        if (typeof GradeHistoryManager !== 'undefined') {
            const historyData = {
                lot: lot,
                netweight: netweight,
                fromPage: fromPage,
                toPage: toPage,
                shift: shift,
                idate: idate,
                template: template,
                controlprint: { ft, lt }
            };
            GradeHistoryManager.saveGradeHistory(unit, grade, historyData);
        }
        
        // Save to sessionStorage
        sessionStorage.setItem('recent_hd_print', JSON.stringify(reportData));
        
        console.log('📄 Report data saved:', reportData);
        
        // Open report page
        window.open('./report.html', '_blank');
    };

    // ฟังก์ชัน updateLotPrefix
    window.updateLotPrefix = function(netweight, grade) {
        const lotInput = document.getElementById('lot');
        if (!lotInput) return;
        const currentYear = new Date().getFullYear();
        const twoDigitYear = currentYear.toString().slice(-2);
        const isSeabulk = netweight >= 16000;
        let lotPrefix;
        if (isSeabulk) {
            lotPrefix = '9' + twoDigitYear;
        } else {
            lotPrefix = netweight.toString().charAt(0) + twoDigitYear;
        }
        lotInput.value = lotPrefix;
    };

    // ฟังก์ชัน validateLotField
    window.validateLotField = function() {
        const lotInput = document.getElementById('lot');
        const lotError = document.getElementById('lot-error');
        if (!lotInput || !lotError) return false;
        const lot = lotInput.value;
        if (lot.length === 0) {
            lotError.textContent = '';
            return false;
        }
        const unit = window.AppState?.currentUnit || 'HDPE';
        const config = getUnitConfig(unit);
        const requiredLength = config.validation.lotLength;
        if (lot.length !== requiredLength) {
            lotError.textContent = '⚠️ Lot ต้องมี ' + requiredLength + ' หลัก';
            return false;
        }
        lotError.textContent = '';
        return true;
    };

    // ฟังก์ชัน setupHistoryButton
    window.setupHistoryButton = function() {
        const historyBtn = document.getElementById('history-btn');
        const historyModal = document.getElementById('history-modal');
        const closeHistoryModal = document.getElementById('close-history-modal');
        
        if (historyBtn && historyModal) {
            // Remove old listeners by cloning
            const newHistoryBtn = historyBtn.cloneNode(true);
            historyBtn.parentNode.replaceChild(newHistoryBtn, historyBtn);
            
            newHistoryBtn.addEventListener('click', () => {
                const currentUnit = window.AppState?.currentUnit || 'HDPE';
                openHistoryModal(currentUnit);
            });
            
            if (closeHistoryModal) {
                closeHistoryModal.addEventListener('click', () => {
                    historyModal.classList.add('hidden');
                });
            }
            
            historyModal.addEventListener('click', (e) => {
                if (e.target === historyModal) {
                    historyModal.classList.add('hidden');
                }
            });
        }
    };

    // ฟังก์ชัน openHistoryModal
    function openHistoryModal(unit) {
        const modal = document.getElementById('history-modal');
        const titleSpan = document.getElementById('history-unit-title');
        const tableBody = document.getElementById('history-table-body');
        
        if (!modal || !tableBody) return;
        
        // Update title
        if (titleSpan) {
            titleSpan.textContent = unit;
        }
        
        // Load and display history
        renderHistoryTable(unit);
        
        // Setup search
        setupHistorySearch();
        
        // Show modal
        modal.classList.remove('hidden');
    }

    // ฟังก์ชัน renderHistoryTable
    function renderHistoryTable(unit) {
        const tableBody = document.getElementById('history-table-body');
        if (!tableBody) return;
        
        const historyKey = 'grade_history_' + unit;
        const historyData = localStorage.getItem(historyKey);
        
        if (!historyData) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-4 py-8 text-center theme-text-secondary">
                        ไม่มีประวัติการใช้งาน
                    </td>
                </tr>
            `;
            return;
        }
        
        try {
            const history = JSON.parse(historyData);
            const grades = Object.keys(history);
            
            if (grades.length === 0) {
                tableBody.innerHTML = `
                    <tr>
                        <td colspan="6" class="px-4 py-8 text-center theme-text-secondary">
                            ไม่มีประวัติการใช้งาน
                        </td>
                    </tr>
                `;
                return;
            }
            
            // Sort by timestamp (newest first)
            grades.sort((a, b) => {
                const timeA = new Date(history[a].timestamp || 0).getTime();
                const timeB = new Date(history[b].timestamp || 0).getTime();
                return timeB - timeA;
            });
            
            let html = '';
            grades.forEach((grade, index) => {
                const data = history[grade];
                const timestamp = data.timestamp ? new Date(data.timestamp) : new Date();
                const dateStr = timestamp.toLocaleString('th-TH', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                html += `
                    <tr class="border-b theme-border hover:bg-opacity-50 cursor-pointer history-row" 
                        data-grade="${grade}"
                        style="transition: background-color 0.2s;">
                        <td class="px-4 py-3 text-center">${index + 1}</td>
                        <td class="px-4 py-3 font-semibold" style="color: var(--primary-color);">${grade}</td>
                        <td class="px-4 py-3 text-center">${data.lot || '-'}</td>
                        <td class="px-4 py-3 text-center">${parseInt(data.netweight || 0).toLocaleString()} KG</td>
                        <td class="px-4 py-3 text-center text-sm">${dateStr}</td>
                        <td class="px-4 py-3 text-center">
                            <button class="load-history-btn px-4 py-2 text-white rounded-lg font-semibold transition-all hover:opacity-90"
                                    style="background-color: var(--primary-color);"
                                    data-grade="${grade}">
                                โหลด
                            </button>
                        </td>
                    </tr>
                `;
            });
            
            tableBody.innerHTML = html;
            
            // Setup click handlers
            setupHistoryClickHandlers();
            
        } catch (e) {
            console.error('Failed to parse history:', e);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="px-4 py-8 text-center text-red-500">
                        เกิดข้อผิดพลาดในการโหลดข้อมูล
                    </td>
                </tr>
            `;
        }
    }

    // ฟังก์ชัน setupHistoryClickHandlers
    function setupHistoryClickHandlers() {
        const rows = document.querySelectorAll('.history-row');
        const loadBtns = document.querySelectorAll('.load-history-btn');
        
        rows.forEach(row => {
            row.addEventListener('click', (e) => {
                // Don't trigger if clicking the button
                if (e.target.classList.contains('load-history-btn')) return;
                
                const grade = row.dataset.grade;
                loadHistoryData(grade);
            });
        });
        
        loadBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const grade = btn.dataset.grade;
                loadHistoryData(grade);
            });
        });
    }

    // ฟังก์ชัน loadHistoryData
    function loadHistoryData(grade) {
        const currentUnit = window.AppState?.currentUnit || 'HDPE';
        
        if (typeof GradeHistoryManager !== 'undefined') {
            const history = GradeHistoryManager.loadGradeHistory(currentUnit, grade);
            
            if (history) {
                // Fill form with history data
                const gradeInput = document.getElementById('grade');
                const netweightInput = document.getElementById('netweight');
                const lotInput = document.getElementById('lot');
                const frompageInput = document.getElementById('frompage');
                const topageInput = document.getElementById('topage');
                const shiftSelect = document.getElementById('shift');
                const idateInput = document.getElementById('idate');
                const templateRadios = document.querySelectorAll('.template-radio');
                
                if (gradeInput) gradeInput.value = grade;
                if (netweightInput) netweightInput.value = history.netweight || '';
                if (lotInput) lotInput.value = history.lot || '';
                if (frompageInput) frompageInput.value = history.fromPage || '1';
                if (topageInput) topageInput.value = history.toPage || '1';
                if (shiftSelect) shiftSelect.value = history.shift || 'M';
                if (idateInput) idateInput.value = history.idate || new Date().getDate();
                // Enforce TIS for SUB grades: history may have Y, but SUB must show N to the user
                try {
                    const isSubFromGrade = /\bSUB\b/i.test(grade);
                    const tisInput = document.getElementById('tis');
                    if (tisInput) {
                        if (isSubFromGrade) {
                            tisInput.value = 'N';
                        } else {
                            tisInput.value = history.tis || getUnitConfig(currentUnit).defaults.tis || 'Y';
                        }
                    }
                } catch (e) {
                    // ignore
                }
                
                if (templateRadios && history.template) {
                    templateRadios.forEach(radio => {
                        if (radio.value === history.template) {
                            radio.checked = true;
                            radio.dispatchEvent(new Event('change'));
                        }
                    });
                }
                
                // Close modal
                const modal = document.getElementById('history-modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
                
                if (window.Swal) {
                    Swal.fire({
                        icon: 'success',
                        title: 'โหลดข้อมูลสำเร็จ',
                        text: 'นำข้อมูลจาก ' + grade + ' มาใส่ในฟอร์มแล้ว',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
                
                console.log('✅ Loaded history for:', grade);
            }
        }
    }

    // ฟังก์ชัน setupHistorySearch
    function setupHistorySearch() {
        const searchInput = document.getElementById('history-search');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', (e) => {
            // Filter input to allow only English letters, numbers, and "/", then uppercase
            let raw = e.target.value || '';
            let sanitized = raw.replace(/[^a-zA-Z0-9/]/g, '');
            sanitized = sanitized.toUpperCase();
            if (sanitized !== raw) {
                e.target.value = sanitized;
                raw = sanitized;
            } else {
                if (e.target.value !== sanitized) e.target.value = sanitized;
                raw = sanitized;
            }

            const searchTerm = raw; // uppercase
            const rows = document.querySelectorAll('.history-row');
            
            rows.forEach(row => {
                const grade = (row.dataset.grade || '').toUpperCase();
                if (grade.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    // ...เพิ่มฟังก์ชันอื่นๆ ที่เกี่ยวข้องกับฟอร์มตามต้องการ...
})();