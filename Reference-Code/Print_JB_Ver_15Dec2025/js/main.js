/**
 * HD Print Tag Jumbo - Normal Version (Non-Module)
 * Combined all modules into standalone JavaScript
 */

console.log('ðŸš€ HD Print Tag Jumbo - Normal Version Loading...');

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
        console.log('âœ… Theme Manager initialized');
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
            console.log('ðŸŽ¨ Theme modal opened');
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

        console.log('âœ… Specs values updated');
    } catch (error) {
        console.log('âš ï¸ Unable to update specs values:', error);
    }
}

function setupUnitSelector() {
    const unitButtons = document.querySelectorAll('.unit-btn');
    
    unitButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const selectedUnit = btn.dataset.unit;
            
            unitButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            console.log(`ðŸ“¦ Unit switched to: ${selectedUnit}`);
            
            const titleElement = document.querySelector('.header-title');
            if (titleElement) {
                titleElement.textContent = `${selectedUnit} Print Tag Jumbo`;
            }
            
            // Re-render table and form for new unit
            if (window.AppState) {
                window.AppState.currentUnit = selectedUnit;
                window.renderTable(selectedUnit);
                window.renderForm(selectedUnit);
            }
        });
    });
}

// ============================================================================
// ============================================================================

/**
 * Open history modal and display grade history
 */
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
    console.log('ðŸŽ¯ Initializing HD Print Tag Jumbo Application...');
    
    // Initialize default data if first time
    if (typeof DataInitializer !== 'undefined') {
        DataInitializer.initializeDefaultData()
            .then(function(result) {
                if (result.success) {
                    console.log('âœ… Default data initialized:', result.message);
                }
            })
            .catch(function(error) {
                console.warn('âš ï¸ Failed to initialize default data:', error);
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
    window.renderTable('HDPE');
    window.renderForm('HDPE');
    
    console.log('âœ… Application initialized successfully');
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
