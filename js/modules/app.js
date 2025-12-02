/**
 * Main Application Controller
 * Initializes and coordinates all SPA components
 */

import { initThemeManager, applyTheme, getAllThemes } from './themeManager.js';
import { FormComponent } from './components/formComponent_themed.js';
import { TableComponent } from './components/tableComponent.js';
import { HeaderComponent } from './components/headerComponent.js';

class App {
    constructor() {
        this.components = {};
        this.state = {
            currentPage: 1,
            selectedRow: null,
            formData: {}
        };
    }

    /**
     * Initialize application
     */
    async init() {
        try {
            console.log('Initializing HDPE Print Tag Jumbo SPA...');
            
            // Initialize theme manager
            initThemeManager();
            
            // Setup theme switcher
            this.setupThemeSwitcher();
            
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
     * Initialize all components
     */
    async initComponents() {
        const appContainer = document.getElementById('app');
        if (!appContainer) {
            throw new Error('App container not found');
        }

        // Create header component
        this.components.header = new HeaderComponent();
        const headerHTML = this.components.header.render();
        
        // Create form component
        this.components.form = new FormComponent();
        const formHTML = this.components.form.render();
        
        // Create table component
        this.components.table = new TableComponent();
        const tableHTML = await this.components.table.render();
        
        // Inject components into DOM
        appContainer.innerHTML = `
            ${headerHTML}
            ${formHTML}
            ${tableHTML}
        `;
        
        // Initialize component event handlers
        this.components.header.init();
        this.components.form.init(this.handleFormSubmit.bind(this));
        this.components.table.init(this.handleRowClick.bind(this));
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
    handleRowClick(rowData) {
        console.log('Row clicked:', rowData);
        this.state.selectedRow = rowData;
        
        // Populate form with row data
        if (this.components.form) {
            this.components.form.populateForm(rowData);
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
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});

export default App;
