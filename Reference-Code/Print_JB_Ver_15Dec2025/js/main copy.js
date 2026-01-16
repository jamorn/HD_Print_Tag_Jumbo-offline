/**
 * HD Print Tag Jumbo - Normal Version (Non-Module)
 * Combined all modules into standalone JavaScript
 */

console.log('🚀 HD Print Tag Jumbo - Normal Version Loading...');

// ============================================================================
// THEME MANAGER
// ============================================================================
const ThemeManager = (function() {
    const THEMES = {
        dark: {
            name: 'Dark Theme',
            primary: '#7c3aed',
            secondary: '#10b981',
            bgPrimary: '#030815',
            bgSecondary: '#101828',
            borderColor: '#374151',
            textPrimary: '#ffffff',
            textSecondary: '#9ca3af',
            cssFile: './css/themes/dark.css'
        },
        green: {
            name: 'Green Fresh',
            primary: '#4CAF50',
            secondary: '#81C784',
            bgPrimary: '#d1f7d3',
            bgSecondary: '#a5d6a7',
            borderColor: '#66bb6a',
            textPrimary: '#1b5e20',
            textSecondary: '#2e7d32',
            cssFile: './css/themes/green.css'
        },
        purple: {
            name: 'Purple Dream',
            primary: '#9C27B0',
            secondary: '#BA68C8',
            bgPrimary: '#e5d1f7',
            bgSecondary: '#ce93d8',
            borderColor: '#ab47bc',
            textPrimary: '#4a148c',
            textSecondary: '#6a1b9a',
            cssFile: './css/themes/purple.css'
        },
        pink: {
            name: 'Pink Vibrant',
            primary: '#F44336',
            secondary: '#EF5350',
            bgPrimary: '#f7d1d1',
            bgSecondary: '#ef9a9a',
            borderColor: '#e57373',
            textPrimary: '#b71c1c',
            textSecondary: '#c62828',
            cssFile: './css/themes/pink.css'
        },
        blue: {
            name: 'Blue Sky',
            primary: '#2196F3',
            secondary: '#64B5F6',
            bgPrimary: '#d1e7f7',
            bgSecondary: '#90caf9',
            borderColor: '#42a5f5',
            textPrimary: '#0d47a1',
            textSecondary: '#1565c0',
            cssFile: './css/themes/blue.css'
        }
    };

    const STORAGE_KEY = 'selectedTheme';
    let currentTheme = 'purple';

    function init() {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        currentTheme = savedTheme && THEMES[savedTheme] ? savedTheme : 'purple';
        applyTheme(currentTheme);
        console.log('✅ Theme Manager initialized');
    }

    function applyTheme(themeName) {
        if (!THEMES[themeName]) {
            console.error(`Theme "${themeName}" not found`);
            return;
        }

        const theme = THEMES[themeName];
        currentTheme = themeName;

        const root = document.documentElement;
        root.style.setProperty('--primary-color', theme.primary);
        root.style.setProperty('--secondary-color', theme.secondary);
        root.style.setProperty('--bg-primary', theme.bgPrimary);
        root.style.setProperty('--bg-secondary', theme.bgSecondary);
        root.style.setProperty('--border-color', theme.borderColor);
        root.style.setProperty('--text-primary', theme.textPrimary);
        root.style.setProperty('--text-secondary', theme.textSecondary);

        const themeStylesheet = document.getElementById('theme-stylesheet');
        if (themeStylesheet) {
            themeStylesheet.href = theme.cssFile;
        }

        localStorage.setItem(STORAGE_KEY, themeName);
        console.log(`Theme applied: ${theme.name}`);
    }

    return { init, applyTheme, getCurrentTheme: () => currentTheme };
})();

// ============================================================================
// UI HELPERS
// ============================================================================
function updateDateTime() {
    const element = document.getElementById('currentDateTime');
    if (element) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        element.textContent = now.toLocaleDateString('th-TH', options);
    }
    // Update shift status in header
    const shiftStatus = document.getElementById('shiftStatus');
    if (shiftStatus) {
        let text = '-';
        if (typeof shift_table === 'function') {
            const shift = shift_table();
            const statusMessage = {
                M: "ตอนนี้คือเวลาทำงานของกะเช้า",
                E: "ตอนนี้คือเวลาทำงานของกะบ่าย",
                N: "ตอนนี้คือเวลาทำงานของกะดึก"
            };
            text = statusMessage[shift] || '-';
        }
        shiftStatus.textContent = text;
    }
}

function setupModals() {
    // Theme Modal
    const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
    const themeModal = document.getElementById('theme-modal');
    const closeThemeModal = document.getElementById('close-theme-modal');
    const themeOptions = document.querySelectorAll('[data-theme]');

    if (themeSwitcherBtn && themeModal) {
        themeSwitcherBtn.addEventListener('click', () => {
            themeModal.classList.remove('hidden');
            console.log('🎨 Theme modal opened');
        });

        if (closeThemeModal) {
            closeThemeModal.addEventListener('click', () => {
                themeModal.classList.add('hidden');
            });
        }

        themeModal.addEventListener('click', (e) => {
            if (e.target === themeModal) {
                themeModal.classList.add('hidden');
            }
        });

        themeOptions.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                ThemeManager.applyTheme(theme);
                setTimeout(() => themeModal.classList.add('hidden'), 300);
            });
        });
    }

    // Help Modal
    const specsBtn = document.getElementById('specs-btn');
    const helpModal = document.getElementById('help-modal');
    const closeHelpModal = document.getElementById('close-help-modal');

    if (specsBtn && helpModal) {
        specsBtn.addEventListener('click', () => {
            helpModal.classList.remove('hidden');
            switchHelpTab('usage');
            updateSpecsValues();
        });

        if (closeHelpModal) {
            closeHelpModal.addEventListener('click', () => {
                helpModal.classList.add('hidden');
            });
        }

        helpModal.addEventListener('click', (e) => {
            if (e.target === helpModal) {
                helpModal.classList.add('hidden');
            }
        });

        const helpTabs = document.querySelectorAll('.help-tab');
        helpTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                switchHelpTab(tab.dataset.tab);
            });
        });
    }
}

function switchHelpTab(tabName) {
    const helpTabs = document.querySelectorAll('.help-tab');
    
    helpTabs.forEach(t => {
        if (t.dataset.tab === tabName) {
            t.style.background = 'var(--primary-color)';
            t.style.color = 'white';
            t.classList.add('active');
        } else {
            t.style.background = 'var(--bg-secondary)';
            t.style.color = 'var(--text-primary)';
            t.classList.remove('active');
        }
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    const targetTab = document.getElementById(`tab-${tabName}`);
    if (targetTab) {
        targetTab.classList.remove('hidden');
    }

    if (tabName === 'specs') {
        updateSpecsValues();
    }
    
    if (tabName === 'data') {
        updateDataStats();
    }
}

function updateSpecsValues() {
    try {
        const gradeInput = document.getElementById('grade');
        const netweightInput = document.getElementById('netweight');
        const lotInput = document.getElementById('lot');
        const fromPageInput = document.getElementById('frompage');
        const idateInput = document.getElementById('idate');
        const shiftInput = document.getElementById('shift');

        if (gradeInput && gradeInput.value) {
            document.getElementById('current-grade').textContent = gradeInput.value;
        } else {
            document.getElementById('current-grade').textContent = '-';
        }

        if (netweightInput && netweightInput.value) {
            const formatted = parseInt(netweightInput.value).toLocaleString('en-US');
            document.getElementById('current-netweight').textContent = formatted + ' KG';
        } else {
            document.getElementById('current-netweight').textContent = '-';
        }

        if (lotInput && lotInput.value) {
            document.getElementById('current-lot').textContent = lotInput.value;
        } else {
            document.getElementById('current-lot').textContent = '-';
        }

        if (fromPageInput && idateInput && shiftInput) {
            const page = String(fromPageInput.value || '1').padStart(3, '0');
            const date = String(idateInput.value || '10').padStart(2, '0');
            const shift = shiftInput.value || 'M';
            document.getElementById('current-running').textContent = `${page}-${date}-${shift}`;
        }

        const unitBtns = document.querySelectorAll('.unit-btn');
        unitBtns.forEach(btn => {
            if (btn.classList.contains('active')) {
                const unit = btn.dataset.unit || btn.textContent.trim();
                document.getElementById('current-unit').textContent = unit;
            }
        });

        console.log('✅ Specs values updated');
    } catch (error) {
        console.log('⚠️ Unable to update specs values:', error);
    }
}

function setupUnitSelector() {
    const unitButtons = document.querySelectorAll('.unit-btn');
    
    unitButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedUnit = btn.dataset.unit;
            
            unitButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            console.log(`📦 Unit switched to: ${selectedUnit}`);
            
            const titleElement = document.querySelector('.header-title');
            if (titleElement) {
                titleElement.textContent = `${selectedUnit} Print Tag Jumbo`;
            }
            
            // Re-render table and form for new unit
            if (window.AppState) {
                window.AppState.currentUnit = selectedUnit;
                renderTable(selectedUnit);
                renderForm(selectedUnit);
            }
        });
    });
}

// ============================================================================
// TABLE COMPONENT
// ============================================================================
function renderTable(unit) {
    const container = document.getElementById('tableContainer');
    if (!container) return;
    
    const gradeOptions = generateGradeOptions(unit);
    
    // Generate table rows HTML
    let rowsHTML = '';
    gradeOptions.forEach((option, index) => {
        const tisIcon = option.isSub ? '' : '✓';
        rowsHTML += `
            <tr class="border-b theme-border hover:bg-opacity-50 cursor-pointer grade-row transition-colors"
                data-grade="${option.grade}"
                data-netweight="${option.netweight}"
                data-issub="${option.isSub}"
                data-gradestring="${option.gradeString}"
                data-display="${option.displayText}">
                <td class="px-6 py-4 font-semibold theme-text-primary">${option.displayText}</td>
                <td class="px-6 py-4 text-center theme-text-primary">${tisIcon}</td>
            </tr>
        `;
    });
    
    container.innerHTML = `
        <div class="rounded-xl overflow-hidden">
            <!-- Table Header -->
            <div class="p-4 flex items-center justify-between border-b theme-border" style="background-color: var(--bg-secondary);">
                <h2 class="text-xl font-semibold theme-text-primary">รายการเม็ดพลาสติก (${unit})</h2>
            </div>

            <!-- Search Section -->
            <div class="p-5 border-b theme-border">
                <label for="searchInput" class="block mb-3 text-sm font-semibold theme-text-primary">Search</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <svg class="w-5 h-5 theme-text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                        </svg>
                    </div>
                    <input type="text" 
                           id="searchInput" 
                           class="w-full pl-12 pr-4 py-3 border rounded-lg shadow-sm theme-input"
                           placeholder="ค้นหา Grade...">
                </div>
            </div>

            <!-- Table -->
            <div class="relative overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 280px);">
                <table class="w-full text-sm text-left">
                    <thead class="sticky top-0 border-b theme-border" style="background-color: var(--bg-secondary);">
                        <tr>
                            <th scope="col" class="px-6 py-4 font-bold text-base uppercase tracking-wider theme-text-primary">
                                Product name
                            </th>
                            <th scope="col" class="px-6 py-4 font-bold text-base text-center uppercase tracking-wider theme-text-primary">
                                TIS
                            </th>
                        </tr>
                    </thead>
                    <tbody id="tableBody">
                        ${rowsHTML}
                    </tbody>
                </table>
            </div>
            
            <div class="p-4 border-t theme-border text-center theme-text-secondary text-sm" style="background-color: var(--bg-secondary);">
                ทั้งหมด ${gradeOptions.length} รายการ
            </div>
        </div>
    `;
    
    // Setup search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const rows = document.querySelectorAll('.grade-row');
            
            rows.forEach(row => {
                const displayText = row.dataset.display.toLowerCase();
                if (displayText.includes(searchTerm)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }
    
    // Setup row click handlers
    const rows = document.querySelectorAll('.grade-row');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            const grade = row.dataset.grade;
            const netweight = row.dataset.netweight;
            const isSub = row.dataset.issub === 'true';
            const gradeString = row.dataset.gradestring;
            
            // Highlight selected row
            rows.forEach(r => r.style.backgroundColor = '');
            row.style.backgroundColor = 'var(--bg-secondary)';
            
            // Update form with full grade string
            updateFormWithSelection(grade, netweight, isSub, gradeString);
            
            console.log(`✅ Selected: ${gradeString}${isSub ? ' SUB' : ''}`);
        });
    });
}

// ============================================================================
// FORM COMPONENT
// ============================================================================
function renderForm(unit) {
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
                               maxlength="10">
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
            e.target.value = e.target.value.replace(/\D/g, '').substring(0, 10);
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
                    document.getElementById('lot').value = latestData.lot || '';
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
}

/**
 * Setup history button (called after renderForm)
 */
function setupHistoryButton() {
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
}

function updateFormWithSelection(grade, netweight, isSub, gradeString) {
    const gradeInput = document.getElementById('grade');
    const netweightInput = document.getElementById('netweight');
    
    // Use full grade string (e.g., P901BK/SB/16500) if provided, otherwise construct it
    const fullGrade = gradeString || (isSub ? `${grade}/${netweight} SUB` : `${grade}/${netweight}`);
    
    if (gradeInput) {
        gradeInput.value = fullGrade;
    }
    if (netweightInput) {
        netweightInput.value = netweight;
    }
    
    // Auto-fill lot prefix based on netweight
    updateLotPrefix(parseInt(netweight, 10), fullGrade);
    
    // Update template options based on SUB status
    updateTemplateOptionsForGrade(isSub);
    
    // Load grade history
    if (typeof GradeHistoryManager !== 'undefined') {
        const currentUnit = document.querySelector('.unit-btn.active')?.dataset.unit || 'HDPE';
        const history = GradeHistoryManager.loadGradeHistory(currentUnit, fullGrade);
        
        if (history) {
            console.log('📂 Loading grade history:', history);
            
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
            if (lotInput && !lotInput.value.match(/^\d{10}$/)) {
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
            
            if (idateInput && history.idate) {
                idateInput.value = history.idate;
            }
            
            if (templateRadios && history.template && !isSub) {
                templateRadios.forEach(radio => {
                    if (radio.value === history.template) {
                        radio.checked = true;
                        radio.dispatchEvent(new Event('change'));
                    }
                });
            }
            
            if (controlprintFT && history.controlprint) {
                controlprintFT.checked = history.controlprint.ft || false;
            }
            if (controlprintLT && history.controlprint) {
                controlprintLT.checked = history.controlprint.lt || false;
            }
        }
    }
}

function updateTemplateOptionsForGrade(isSub) {
    const templateRadios = document.querySelectorAll('.template-radio');
    const templateOptions = document.querySelectorAll('.template-option');
    
    if (!templateRadios.length) return;
    
    templateRadios.forEach((radio, index) => {
        const templateValue = radio.value;
        const option = templateOptions[index];
        
        if (isSub) {
            // SUB grade: only template1 allowed
            if (templateValue === 'template1') {
                radio.disabled = false;
                radio.checked = true;
                if (option) {
                    option.style.opacity = '1';
                    option.style.cursor = 'pointer';
                }
            } else {
                radio.disabled = true;
                radio.checked = false;
                if (option) {
                    option.style.opacity = '0.5';
                    option.style.cursor = 'not-allowed';
                }
            }
        } else {
            // Premium grade: all templates available
            radio.disabled = false;
            if (option) {
                option.style.opacity = '1';
                option.style.cursor = 'pointer';
            }
        }
    });
    
    // Update visual selection
    const updateEvent = new Event('change');
    const checkedRadio = document.querySelector('.template-radio:checked');
    if (checkedRadio) {
        checkedRadio.dispatchEvent(updateEvent);
    }
}

function updateLotPrefix(netweight, grade) {
    const lotInput = document.getElementById('lot');
    if (!lotInput) return;
    
    const currentYear = new Date().getFullYear();
    const twoDigitYear = currentYear.toString().slice(-2);
    
    // Check if netweight >= 16000 (seabulk package)
    const isSeabulk = netweight >= 16000;
    
    let lotPrefix;
    if (isSeabulk) {
        // All seabulk packages (16500, 18000) use prefix '9'
        lotPrefix = '9' + twoDigitYear;
    } else {
        // Regular packages use first digit of netweight
        lotPrefix = netweight.toString().charAt(0) + twoDigitYear;
    }
    
    // Always update the prefix when selecting a new grade
    lotInput.value = lotPrefix;
}

function validateLotField() {
    const lotInput = document.getElementById('lot');
    const lotError = document.getElementById('lot-error');
    
    if (!lotInput || !lotError) return false;
    
    const lot = lotInput.value;
    
    if (lot.length === 0) {
        lotError.textContent = '';
        return false;
    }
    
    if (lot.length !== 10) {
        lotError.textContent = '⚠️ Lot ต้องมี 10 หลัก';
        return false;
    }
    
    lotError.textContent = '';
    return true;
}

function handleFormSubmit() {
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
    
    if (lot.length !== 10) {
        if (window.Swal) {
            Swal.fire({
                icon: 'warning',
                title: 'Lot ไม่ถูกต้อง',
                text: 'กรุณาใส่ Lot ให้ครบ 10 หลัก',
                confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
            });
        } else {
            alert('กรุณาใส่ Lot ให้ครบ 10 หลัก');
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
}

// ============================================================================
// GRADE HISTORY MODAL
// ============================================================================

/**
 * Open history modal and display grade history
 */
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

/**
 * Render history table
 */
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

/**
 * Setup click handlers for history items
 */
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

/**
 * Load history data into form
 */
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

/**
 * Setup history search
 */
function setupHistorySearch() {
    const searchInput = document.getElementById('history-search');
    if (!searchInput) return;
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const rows = document.querySelectorAll('.history-row');
        
        rows.forEach(row => {
            const grade = row.dataset.grade.toLowerCase();
            if (grade.includes(searchTerm)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });
}

// ============================================================================
// DATA MANAGEMENT
// ============================================================================

/**
 * Update data statistics display
 */
function updateDataStats() {
    const hdpeCount = document.getElementById('hdpe-count');
    const ppCount = document.getElementById('pp-count');
    const ppcCount = document.getElementById('ppc-count');

    if (hdpeCount) {
        const hdpeData = localStorage.getItem('grade_history_HDPE');
        const count = hdpeData ? Object.keys(JSON.parse(hdpeData)).length : 0;
        hdpeCount.textContent = count;
    }

    if (ppCount) {
        const ppData = localStorage.getItem('grade_history_PP');
        const count = ppData ? Object.keys(JSON.parse(ppData)).length : 0;
        ppCount.textContent = count;
    }

    if (ppcCount) {
        const ppcData = localStorage.getItem('grade_history_PPC');
        const count = ppcData ? Object.keys(JSON.parse(ppcData)).length : 0;
        ppcCount.textContent = count;
    }
}

/**
 * Import data from JSON file
 */
function importDataFromFile() {
    var fileInput = document.getElementById('import-file-input');
    if (!fileInput) return;
    
    fileInput.click();
}

/**
 * Handle file selection for import
 */
function handleFileImport(event) {
    var file = event.target.files[0];
    if (!file) return;
    
    if (!file.name.endsWith('.json')) {
        if (window.Swal) {
            Swal.fire({
                icon: 'error',
                title: 'ไฟล์ไม่ถูกต้อง',
                text: 'กรุณาเลือกไฟล์ JSON เท่านั้น',
                confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
            });
        }
        return;
    }
    
    if (typeof DataInitializer !== 'undefined') {
        DataInitializer.importDataFromFile(file)
            .then(function(result) {
                updateDataStats();
                
                if (window.Swal) {
                    Swal.fire({
                        icon: 'success',
                        title: 'นำเข้าข้อมูลสำเร็จ',
                        text: result.message,
                        confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
                    });
                }
                
                // Clear file input
                event.target.value = '';
            })
            .catch(function(error) {
                console.error('Import failed:', error);
                if (window.Swal) {
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        text: error.error || 'ไม่สามารถนำเข้าข้อมูลได้',
                        confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
                    });
                }
                
                // Clear file input
                event.target.value = '';
            });
    }
}

/**
 * Export current data as JSON file
 */
function exportCurrentData() {
    if (typeof DataInitializer !== 'undefined') {
        DataInitializer.exportCurrentData()
            .then(function() {
                if (window.Swal) {
                    Swal.fire({
                        icon: 'success',
                        title: 'ส่งออกข้อมูลสำเร็จ',
                        text: 'ข้อมูลถูกส่งออกเป็นไฟล์ JSON เรียบร้อยแล้ว',
                        confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
                    });
                }
            })
            .catch(function(error) {
                console.error('Export failed:', error);
                if (window.Swal) {
                    Swal.fire({
                        icon: 'error',
                        title: 'เกิดข้อผิดพลาด',
                        text: 'ไม่สามารถส่งออกข้อมูลได้',
                        confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
                    });
                }
            });
    }
}

/**
 * Reset data to defaults (clear all)
 */
function resetToDefaults() {
    if (window.Swal) {
        Swal.fire({
            title: 'รีเซ็ตข้อมูลทั้งหมด',
            text: 'คุณแน่ใจหรือไม่ที่จะรีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้น?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'รีเซ็ต',
            cancelButtonText: 'ยกเลิก'
        }).then(function(result) {
            if (result.isConfirmed) {
                if (typeof DataInitializer !== 'undefined') {
                    DataInitializer.resetToDefaults()
                        .then(function() {
                            updateDataStats();
                            
                            Swal.fire({
                                icon: 'success',
                                title: 'รีเซ็ตสำเร็จ',
                                text: 'ข้อมูลถูกรีเซ็ตกลับเป็นค่าเริ่มต้นแล้ว',
                                confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
                            });
                        })
                        .catch(function(error) {
                            console.error('Reset failed:', error);
                            Swal.fire({
                                icon: 'error',
                                title: 'เกิดข้อผิดพลาด',
                                text: 'ไม่สามารถรีเซ็ตข้อมูลได้',
                                confirmButtonColor: getComputedStyle(document.documentElement).getPropertyValue('--primary-color')
                            });
                        });
                }
            }
        });
    } else {
        if (confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูล Grade History ทั้งหมด?')) {
            if (typeof DataInitializer !== 'undefined') {
                DataInitializer.resetToDefaults()
                    .then(function() {
                        updateDataStats();
                        alert('รีเซ็ตข้อมูลสำเร็จ');
                    });
            }
        }
    }
}

/**
 * Setup data management button listeners
 */
function setupDataManagement() {
    const importBtn = document.getElementById('import-data-btn');
    const exportBtn = document.getElementById('export-data-btn');
    const resetBtn = document.getElementById('reset-data-btn');
    const fileInput = document.getElementById('import-file-input');
    
    if (importBtn) {
        importBtn.addEventListener('click', importDataFromFile);
    }
    
    if (fileInput) {
        fileInput.addEventListener('change', handleFileImport);
    }
    
    if (exportBtn) {
        exportBtn.addEventListener('click', exportCurrentData);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetToDefaults);
    }
}

// ============================================================================
// APPLICATION STATE
// ============================================================================
window.AppState = {
    currentUnit: 'HDPE',
    shiftManuallySet: false  // Reset on page load (F5)
};

// ============================================================================
// MAIN APPLICATION INITIALIZATION
// ============================================================================
function initApp() {
    console.log('🎯 Initializing HD Print Tag Jumbo Application...');
    
    // Initialize default data if first time
    if (typeof DataInitializer !== 'undefined') {
        DataInitializer.initializeDefaultData()
            .then(function(result) {
                if (result.success) {
                    console.log('✅ Default data initialized:', result.message);
                }
            })
            .catch(function(error) {
                console.warn('⚠️ Failed to initialize default data:', error);
            });
    }
    
    // Initialize theme
    ThemeManager.init();
    
    // Setup datetime update
    updateDateTime();
    setInterval(updateDateTime, 1000);
    
    // Setup modals
    setupModals();
    
    // Setup data management
    setupDataManagement();
    
    // Setup unit selector
    setupUnitSelector();
    
    // Render initial components
    renderTable('HDPE');
    renderForm('HDPE');
    
    console.log('✅ Application initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}