/**
 * Main Application Controller
 * Initializes and coordinates all SPA components
 */

import { initThemeManager, applyTheme, getAllThemes } from './themeManager.js';
import { FormComponent } from './components/formComponent_themed.js';
import { TableComponent } from './components/tableComponent.js';
import { HeaderComponent } from './components/headerComponent.js';
import DataInitializer from './utils/dataInitializer.js';

class App {
    constructor() {
        this.components = {};
        this.state = {
            currentPage: 1,
            selectedRow: null,
            formData: {},
            currentUnit: 'HDPE' // Default unit
        };
    }

    /**
     * Initialize application
     */
    async init() {
        try {
            console.log('Initializing Multi-Unit Print Tag Jumbo SPA...');
            
            // Initialize default data first (if needed)
            await DataInitializer.initializeDefaultData();
            
            // Initialize theme manager
            initThemeManager();
            
            // Setup unit selector
            this.setupUnitSelector();
            
            // Setup theme switcher
            this.setupThemeSwitcher();
            
            // Setup data management controls
            this.setupDataManagementControls();
            
            // Initialize components
            await this.initComponents();
            
            // Load existing scripts (shift_compare.js will auto-run)
            this.initExistingScripts();
            
            console.log('Application initialized successfully');
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('เกิดข้อผิดพลาดในการโหลดระบบ');
        }
    }
    
    /**
     * Setup unit selector
     */
    setupUnitSelector() {
        const unitButtons = document.querySelectorAll('.unit-btn');
        
        unitButtons.forEach(btn => {
            btn.addEventListener('click', async () => {
                const selectedUnit = btn.dataset.unit;
                
                // Update active state
                unitButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Update state
                this.state.currentUnit = selectedUnit;
                console.log(`📦 Unit switched to: ${selectedUnit}`);
                
                // Update header title
                if (this.components.header) {
                    this.components.header.setUnit(selectedUnit);
                    console.log(`📋 Header updated for ${selectedUnit}`);
                }
                
                // Re-render table with new unit data (without destroying DOM)
                if (this.components.table) {
                    this.components.table.setUnit(selectedUnit);
                    console.log(`✅ Table updated for ${selectedUnit}`);
                }
                
                // Update form's current unit
                if (this.components.form) {
                    this.components.form.currentUnit = selectedUnit;
                    
                    // Clear and restore form data when switching units
                    if (typeof this.components.form.clearFormData === 'function') {
                        this.components.form.clearFormData();
                    }
                    if (typeof this.components.form.restoreFormData === 'function') {
                        this.components.form.restoreFormData();
                    }
                    
                    // Update template options AFTER restoring data to ensure proper filtering
                    if (typeof this.components.form.updateTemplateOptions === 'function') {
                        this.components.form.updateTemplateOptions();
                    }
                }
            });
        });
    }
    
    /**
     * Reload table for selected unit (DEPRECATED - use setUnit directly)
     */
    async reloadTableForUnit(unit) {
        console.warn('⚠️ reloadTableForUnit is deprecated, use setUnit() instead');
        if (!this.components.table) return;
        
        // Use setUnit method to properly update table
        this.components.table.setUnit(unit);
    }

    /**
     * Initialize all components
     */
    async initComponents() {
        const appContainer = document.getElementById('app');
        if (!appContainer) {
            throw new Error('App container not found');
        }

        // Clear container
        appContainer.innerHTML = '';

        // Create header component
        this.components.header = new HeaderComponent();
        const headerHTML = this.components.header.render();
        appContainer.insertAdjacentHTML('beforeend', headerHTML);
        this.components.header.init();
        
        // Create form component
        this.components.form = new FormComponent();
        const formHTML = this.components.form.render();
        appContainer.insertAdjacentHTML('beforeend', formHTML);
        this.components.form.init(this.handleFormSubmit.bind(this));
        
        // Create table component
        this.components.table = new TableComponent();
        const tableHTML = await this.components.table.render();
        appContainer.insertAdjacentHTML('beforeend', tableHTML);
        this.components.table.init(this.handleRowClick.bind(this));
        
        console.log('✅ All components initialized');
    }

    /**
     * Setup theme switcher modal
     */
    setupThemeSwitcher() {
        const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
        const themeModal = document.getElementById('theme-modal');
        const closeModalBtn = document.getElementById('close-theme-modal');
        const themeButtons = document.querySelectorAll('[data-theme]');
        
        const helpBtn = document.getElementById('help-btn');
        const helpModal = document.getElementById('help-modal');
        const closeHelpModalBtn = document.getElementById('close-help-modal');

        if (!themeSwitcherBtn || !themeModal) {
            console.warn('Theme switcher elements not found');
            return;
        }

        // Open theme modal
        themeSwitcherBtn.addEventListener('click', () => {
            themeModal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Show checkmark for current theme when modal opens
            const currentTheme = localStorage.getItem('selectedTheme') || 'dark';
            this.updateThemeCheckmarks(currentTheme);
        });

        // Close theme modal
        const closeModal = () => {
            themeModal.classList.add('hidden');
            document.body.style.overflow = 'auto';
        };

        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', closeModal);
        }

        // Close on overlay click
        themeModal.addEventListener('click', (e) => {
            if (e.target === themeModal) {
                closeModal();
            }
        });
        
        // Help modal controls
        if (helpBtn && helpModal) {
            helpBtn.addEventListener('click', () => {
                helpModal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
            
            if (closeHelpModalBtn) {
                closeHelpModalBtn.addEventListener('click', () => {
                    helpModal.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                });
            }
            
            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    helpModal.classList.add('hidden');
                    document.body.style.overflow = 'auto';
                }
            });
            
            // Tab switching
            const helpTabs = document.querySelectorAll('.help-tab');
            helpTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetTab = tab.dataset.tab;
                    
                    // Update active tab
                    helpTabs.forEach(t => {
                        t.classList.remove('active');
                        t.style.color = 'var(--text-secondary)';
                        t.style.borderColor = 'transparent';
                    });
                    tab.classList.add('active');
                    tab.style.color = 'var(--primary-color)';
                    tab.style.borderColor = 'var(--primary-color)';
                    
                    // Show/hide content
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.classList.add('hidden');
                    });
                    document.getElementById(`tab-${targetTab}`).classList.remove('hidden');
                    
                    // Update data stats when data tab is opened
                    if (targetTab === 'data') {
                        setTimeout(() => this.updateDataStats(), 100);
                    }
                });
            });
        }

        // Add click handlers
        themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const themeName = btn.dataset.theme;
                applyTheme(themeName);
                
                // Update checkmark visibility
                this.updateThemeCheckmarks(themeName);
                
                // Update active state
                themeButtons.forEach(b => {
                    b.classList.remove('ring-4', 'ring-violet-500', 'active');
                });
                btn.classList.add('active');
                
                // Close modal after selection
                setTimeout(closeModal, 300);
            });
            
            // Add hover effect for floating border
            btn.addEventListener('mouseenter', (e) => {
                this.moveFloatingBorder(e.currentTarget);
            });
        });
        
        // Hide border when mouse leaves grid area
        const gridContainer = document.querySelector('.grid');
        if (gridContainer) {
            gridContainer.addEventListener('mouseleave', () => {
                this.hideFloatingBorder();
            });
        }
    }

    /**
     * Initialize existing scripts
     */
    initExistingScripts() {
        // shift_compare.js is already loaded and will run automatically
        // SweetAlert2 is already loaded
        console.log('Existing scripts initialized');
    }

    /**
     * Handle form submission
     */
    async handleFormSubmit(formData) {
        console.log('Form submitted:', formData);
        this.state.formData = formData;
        
        // Enable print preview button with theme color
        const printBtn = document.getElementById('btn_view_report');
        if (printBtn) {
            printBtn.disabled = false;
            printBtn.className = "w-full py-3 px-4 theme-btn-secondary font-bold rounded-lg shadow-lg transition duration-150 transform focus:outline-none focus:ring-2 focus:ring-offset-2";
            printBtn.style.setProperty('--tw-ring-color', 'var(--secondary-color)');
        }
        
        // Show success message
        if (window.Swal) {
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
            await window.Swal.fire({
                icon: 'success',
                title: 'บันทึกสำเร็จ',
                text: 'ข้อมูลได้รับการบันทึกเรียบร้อยแล้ว',
                timer: 2000,
                showConfirmButton: false,
                confirmButtonColor: primaryColor
            });
        }
    }

    /**
     * Handle table row click
     */
    async handleRowClick(rowData) {
        console.log('Row clicked:', rowData);
        this.state.selectedRow = rowData;
        
        // Import generateGradeOptions
        const { generateGradeOptions } = await import('./report/config/UnitConfig.js');
        const gradeOptions = generateGradeOptions(rowData.unit || this.state.currentUnit);
        
        // Find all options for this base grade
        const baseGrade = rowData.Grade?.replace(/\s+SUB\/\d+$| SUB$/i, '').trim();
        const matchingOptions = gradeOptions.filter(opt => 
            opt.grade === baseGrade && 
            opt.netweight == rowData.NetWeight
        );
        
        console.log('🔍 Base grade:', baseGrade);
        console.log('🔍 Matching options:', matchingOptions);
        
        // Helper function to get auto template based on unit and grade type
        const getAutoTemplate = (unit, isSub) => {
            const upperUnit = unit?.toUpperCase();
            if (upperUnit === 'HDPE') {
                return isSub ? 'template1' : 'template3'; // SUB->template1, Premium->template3
            } else if (upperUnit === 'PP' || upperUnit === 'PPC') {
                return isSub ? 'template1' : 'template2'; // SUB->template1, Premium->template2
            }
            return 'template1'; // Fallback
        };
        
        // If only one option (no SUB variant), populate directly with auto template
        if (matchingOptions.length === 1) {
            if (this.components.form) {
                // Use isSub from rowData directly (more reliable than matching)
                const isSub = rowData.isSub !== undefined ? rowData.isSub : matchingOptions[0].isSub;
                const autoTemplate = getAutoTemplate(rowData.unit || this.state.currentUnit, isSub);
                console.log('🎯 Auto template (single option):', autoTemplate, 'isSub:', isSub, 'grade:', rowData.Grade);
                this.components.form.populateForm({
                    ...rowData,
                    autoTemplate: autoTemplate // Pass auto template to form
                });
            }
            return;
        }
        
        // If multiple options (has SUB), show selection modal
        if (matchingOptions.length > 1 && window.Swal) {
            const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim();
            
            const result = await window.Swal.fire({
                title: `เลือก Grade: ${baseGrade}/${rowData.NetWeight}`,
                html: `
                    <div style="display: flex; flex-direction: column; gap: 12px; padding: 20px 0;">
                        ${matchingOptions.map(opt => `
                            <button 
                                class="grade-option-btn"
                                data-display="${opt.displayText}"
                                data-is-sub="${opt.isSub}"
                                style="
                                    padding: 12px 20px;
                                    border: 2px solid ${opt.isSub ? '#f59e0b' : primaryColor};
                                    border-radius: 8px;
                                    background: ${opt.isSub ? '#fef3c7' : 'white'};
                                    color: ${opt.isSub ? '#92400e' : '#1f2937'};
                                    font-weight: 600;
                                    font-size: 16px;
                                    cursor: pointer;
                                    transition: all 0.2s;
                                "
                                onmouseover="this.style.transform='scale(1.02)'; this.style.boxShadow='0 4px 12px rgba(0,0,0,0.15)';"
                                onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='none';"
                            >
                                ${opt.isSub ? '⚠️ ' : '✅ '} ${opt.displayText}
                                <div style="font-size: 12px; opacity: 0.7; margin-top: 4px;">
                                    ${opt.isSub ? 'Sub-Standard Grade' : 'Premium Grade'}
                                </div>
                            </button>
                        `).join('')}
                    </div>
                `,
                showConfirmButton: false,
                showCancelButton: true,
                cancelButtonText: 'ยกเลิก',
                didOpen: () => {
                    const buttons = document.querySelectorAll('.grade-option-btn');
                    buttons.forEach(btn => {
                        btn.addEventListener('click', () => {
                            window.Swal.clickConfirm();
                            window.Swal.close();
                            const selectedGrade = btn.dataset.display;
                            const isSub = btn.dataset.isSub === 'true';
                            
                            // Auto select template based on grade type
                            const autoTemplate = getAutoTemplate(rowData.unit || this.state.currentUnit, isSub);
                            console.log('🎯 Auto template (modal selection):', autoTemplate, 'isSub:', isSub, 'unit:', rowData.unit || this.state.currentUnit);
                            
                            // Populate form with selected grade and auto template
                            if (this.components.form) {
                                this.components.form.populateForm({
                                    ...rowData,
                                    grade: selectedGrade,
                                    autoTemplate: autoTemplate
                                });
                            }
                        });
                    });
                }
            });
        } else {
            // Fallback if no Swal
            if (this.components.form) {
                const autoTemplate = getAutoTemplate(rowData.unit || this.state.currentUnit, false);
                this.components.form.populateForm({
                    ...rowData,
                    autoTemplate: autoTemplate
                });
            }
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        if (window.Swal) {
            window.Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: message
            });
        } else {
            alert(message);
        }
    }

    /**
     * Update theme checkmarks
     */
    updateThemeCheckmarks(activeTheme) {
        // Hide all checkmarks
        const allCheckmarks = [
            'theme-active-dark',
            'theme-active-green', 
            'theme-active-purple',
            'theme-active-pink',
            'theme-active-blue'
        ];
        
        allCheckmarks.forEach(className => {
            const elements = document.querySelectorAll(`.${className}`);
            elements.forEach(el => {
                el.classList.add('hidden');
                el.classList.remove('flex');
            });
        });
        
        // Show checkmark for active theme
        const activeCheckmark = document.querySelector(`.theme-active-${activeTheme}`);
        if (activeCheckmark) {
            activeCheckmark.classList.remove('hidden');
            activeCheckmark.classList.add('flex');
        }
    }

    /**
     * Move floating border to target button
     */
    moveFloatingBorder(targetButton) {
        const border = document.getElementById('theme-selector-border');
        if (!border) return;
        
        const buttonRect = targetButton.getBoundingClientRect();
        const gridContainer = targetButton.closest('.grid');
        if (!gridContainer) return;
        
        const gridRect = gridContainer.getBoundingClientRect();
        
        // Calculate position relative to grid container
        const left = buttonRect.left - gridRect.left;
        const top = buttonRect.top - gridRect.top;
        
        // Get theme color
        const theme = targetButton.dataset.theme;
        const colors = {
            dark: '#7c3aed',
            green: '#4CAF50',
            purple: '#9C27B0',
            pink: '#F44336',
            blue: '#2196F3'
        };
        
        // Update border
        border.setAttribute('width', buttonRect.width);
        border.setAttribute('height', buttonRect.height);
        border.style.left = `${left}px`;
        border.style.top = `${top}px`;
        border.querySelector('rect').setAttribute('stroke', colors[theme] || '#7c3aed');
        border.classList.add('active');
    }

    /**
     * Hide floating border
     */
    hideFloatingBorder() {
        const border = document.getElementById('theme-selector-border');
        if (border) {
            border.classList.remove('active');
        }
    }

    /**
     * Setup data management controls
     */
    setupDataManagementControls() {
        // Add event listeners for data management buttons
        const exportDataBtn = document.getElementById('export-data-btn');
        const resetDataBtn = document.getElementById('reset-data-btn');

        if (exportDataBtn) {
            exportDataBtn.addEventListener('click', async () => {
                try {
                    await DataInitializer.exportCurrentData();
                    this.showSuccess('ข้อมูลถูกส่งออกเป็นไฟล์ JSON เรียบร้อยแล้ว');
                } catch (error) {
                    console.error('Export failed:', error);
                    this.showError('เกิดข้อผิดพลาดในการส่งออกข้อมูล');
                }
            });
        }

        if (resetDataBtn) {
            resetDataBtn.addEventListener('click', async () => {
                // Show confirmation dialog
                const confirmed = await this.showConfirmDialog(
                    'รีเซ็ตข้อมูลทั้งหมด',
                    'คุณแน่ใจหรือไม่ที่จะรีเซ็ตข้อมูล Grade History ทั้งหมดกลับเป็นค่าเริ่มต้น?',
                    'รีเซ็ต',
                    'ยกเลิก'
                );

                if (confirmed) {
                    try {
                        await DataInitializer.resetToDefaults();
                        
                        // Refresh table components
                        if (this.components.table) {
                            this.components.table.render();
                        }
                        
                        // Update stats
                        this.updateDataStats();
                        
                        this.showSuccess('รีเซ็ตข้อมูลเป็นค่าเริ่มต้นเรียบร้อยแล้ว');
                    } catch (error) {
                        console.error('Reset failed:', error);
                        this.showError('เกิดข้อผิดพลาดในการรีเซ็ตข้อมูล');
                    }
                }
            });
        }
        
        // Update initial stats when tab opens
        this.updateDataStats();
    }

    /**
     * Update data statistics display
     */
    updateDataStats() {
        const hdpeCount = document.getElementById('hdpe-count');
        const ppCount = document.getElementById('pp-count');
        const ppcCount = document.getElementById('ppc-count');

        if (hdpeCount) {
            const hdpeData = JSON.parse(localStorage.getItem('grade_history_HDPE') || '[]');
            hdpeCount.textContent = hdpeData.length;
        }

        if (ppCount) {
            const ppData = JSON.parse(localStorage.getItem('grade_history_PP') || '[]');
            ppCount.textContent = ppData.length;
        }

        if (ppcCount) {
            const ppcData = JSON.parse(localStorage.getItem('grade_history_PPC') || '[]');
            ppcCount.textContent = ppcData.length;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
    
    // Expose debug functions to global scope for console access
    window.AppDebug = {
        async refreshPPCHistory() {
            console.log('🔄 Refreshing PPC grade history...');
            try {
                const result = await DataInitializer.forceRefreshUnitHistory('PPC');
                console.log('✅ PPC History refresh result:', result);
                if (result.success) {
                    // Force reload page to see changes
                    window.location.reload();
                }
                return result;
            } catch (error) {
                console.error('❌ Failed to refresh PPC history:', error);
                return { success: false, error: error.message };
            }
        },

        async clearPPCHistory() {
            console.log('🗑️ Clearing PPC grade history from localStorage...');
            try {
                localStorage.removeItem('grade_history_PPC');
                console.log('✅ PPC history cleared. Refreshing...');
                window.location.reload();
                return { success: true };
            } catch (error) {
                console.error('❌ Failed to clear PPC history:', error);
                return { success: false, error: error.message };
            }
        },

        showPPCHistory() {
            const ppcHistory = localStorage.getItem('grade_history_PPC');
            console.log('📊 Current PPC History:');
            if (ppcHistory) {
                console.log(JSON.parse(ppcHistory));
            } else {
                console.log('No PPC history found');
            }
            return ppcHistory ? JSON.parse(ppcHistory) : null;
        }
    };

    console.log('🛠️ Debug functions available in console:');
    console.log('  AppDebug.refreshPPCHistory() - Force refresh PPC history from default data');
    console.log('  AppDebug.clearPPCHistory() - Clear PPC history and reload');
    console.log('  AppDebug.showPPCHistory() - Show current PPC history');
});

export default App;
