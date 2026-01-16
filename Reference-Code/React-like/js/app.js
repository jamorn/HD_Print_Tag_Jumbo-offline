/**
 * Main Application - Orchestrates all components
 * React-like Tag Printing System
 */

class TagPrintingApp {
  constructor() {
    this.state = {
      isInitialized: false,
      currentData: null,
      isGenerating: false
    };

    // Initialize managers
    this.unitManager = new UnitConfigManager();
    this.themeManager = new ThemeManager();
    this.templateEngine = new TemplateEngine({
      units: UnitConfigurations
    });
    
    this.formComponent = null;
  }

  /**
   * Initialize the application
   */
  async init() {
    console.log('🚀 Initializing Tag Printing Application...');

    try {
      // Initialize systems
      this.unitManager.init();
      this.themeManager.init();

      // Initialize mock data manager
      this.mockManager = new MockDataManager();

      // Render form component
      this.renderFormComponent();

      // Attach global event listeners
      this.attachGlobalListeners();

      // Load any saved preview or use mock data
      this.loadSavedPreview();

      this.state.isInitialized = true;
      console.log('✅ Application initialized successfully');

      // Show welcome message
      this.showWelcome();

      // Show mock data info
      this.mockManager.printSummary();

    } catch (error) {
      console.error('❌ Application initialization failed:', error);
      this.showError('Failed to initialize application: ' + error.message);
    }
  }

  /**
   * Render form component
   */
  renderFormComponent() {
    const currentUnit = this.unitManager.getCurrentUnit();
    
    this.formComponent = new FormComponent({
      units: UnitConfigurations,
      defaultUnit: currentUnit.id,
      defaultTheme: this.themeManager.currentTheme,
      defaultTemplate: currentUnit.defaultTemplate
    });
    
    // Make formComponent globally accessible for onclick handlers
    window.formComponent = this.formComponent;

    // Insert form into DOM
    const formContainer = document.getElementById('formContainer');
    if (formContainer) {
      formContainer.innerHTML = this.formComponent.render();
      
      // Re-initialize form after rendering
      this.formComponent.initializeForm();
      
      // Subscribe to form changes
      this.formComponent.subscribe((event) => this.handleFormEvent(event));
    }

    // Attach button listeners
    this.attachButtonListeners();
  }

  /**
   * Attach button listeners
   */
  attachButtonListeners() {
    const generateBtn = document.getElementById('generateBtn');
    const clearBtn = document.getElementById('clearBtn');

    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generatePreview());
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.formComponent.clearForm();
        this.clearPreview();
      });
    }
  }

  /**
   * Handle form events
   */
  handleFormEvent(event) {
    const { event: eventType, data, formData } = event;

    switch (eventType) {
      case 'unitChange':
        this.handleUnitChange(data);
        break;
      case 'themeChange':
        this.themeManager.applyTheme(data);
        break;
      case 'templateChange':
        this.handleTemplateChange(data);
        break;
      case 'formClear':
        this.clearPreview();
        break;
    }
  }

  /**
   * Handle unit change
   */
  handleUnitChange(unitId) {
    this.unitManager.setUnit(unitId);
    const unitConfig = this.unitManager.getUnit(unitId);
    
    // ❌ Don't overwrite formData here - formComponent already handled it in handleUnitChange()
    // The formComponent already loaded data from sessionStorage or defaults
    // Just update the unit manager and log
    
    console.log(`Switched to unit: ${unitConfig.fullName}`);
    
    // Re-generate preview only if form is valid and has data
    if (this.state.currentData && this.formComponent.validateAll()) {
      this.generatePreview();
    }
  }
  
  /**
   * Handle template change
   */
  handleTemplateChange(templateId) {
    console.log('Template changed to:', templateId);
    
    // Re-generate preview with new template only if form is valid and has data
    if (this.state.currentData && this.formComponent.validateAll()) {
      this.generatePreview();
    }
  }

  /**
   * Generate preview
   */
  async generatePreview() {
    if (this.state.isGenerating) return;

    this.state.isGenerating = true;
    this.showLoading();

    try {
      // Get form data
      const formData = this.formComponent.getFormData();
      
      console.log('🔍 DEBUG: Checking headerComponent.js version...');
      console.log('🔍 HeaderComponent class exists:', typeof HeaderComponent !== 'undefined');
      
      // Validate
      if (!this.formComponent.validateAll()) {
        throw new Error('Please fix form errors before generating');
      }

      // Get unit config and merge defaults
      const unitConfig = this.unitManager.getCurrentUnit();
      
      // Remove title1 and title2 from formData to force using unit defaults
      const { title1: _, title2: __, ...cleanFormData } = formData;
      
      const completeData = {
        ...unitConfig.defaults,
        ...cleanFormData,
        unit: formData.unit,
        unitConfig: unitConfig // Pass unit config for template rendering
      };

      console.log('🔍 Current unit:', formData.unit);
      console.log('🔍 Unit defaults:', unitConfig.defaults);
      console.log('🔍 Complete data:', completeData);

      // Validate against unit rules
      const validation = this.unitManager.validateData(formData.unit, formData);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Generate HTML
      const html = this.templateEngine.render(completeData);

      // Render to print area
      const printArea = document.getElementById('printArea');
      if (printArea) {
        printArea.innerHTML = html;
      }

      // Save preview data
      this.state.currentData = completeData;
      sessionStorage.setItem('last_preview', JSON.stringify(completeData));

      // 💾 Save grade history to localStorage
      if (this.formComponent && completeData.grade) {
        this.formComponent.saveGradeHistory(completeData.grade, completeData);
      }

      // Show success
      this.showSuccess('Preview generated successfully! Ready to print.');

      console.log('✅ Preview generated:', completeData);

    } catch (error) {
      console.error('❌ Generation failed:', error);
      this.showError(error.message);
    } finally {
      this.state.isGenerating = false;
      this.hideLoading();
    }
  }

  /**
   * Clear preview
   */
  clearPreview() {
    const printArea = document.getElementById('printArea');
    if (printArea) {
      printArea.innerHTML = '';
    }
    
    this.state.currentData = null;
    sessionStorage.removeItem('last_preview');
    
    console.log('Preview cleared');
  }

  /**
   * Load saved preview
   */
  loadSavedPreview() {
    const saved = sessionStorage.getItem('last_preview');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.state.currentData = data;
        
        // Render saved preview
        const html = this.templateEngine.render(data);
        const printArea = document.getElementById('printArea');
        if (printArea) {
          printArea.innerHTML = html;
        }
        
        console.log('✅ Restored previous preview');
      } catch (error) {
        console.warn('⚠️ Failed to restore preview:', error);
        this.showEmptyPreview();
      }
    } else {
      // No saved data - show empty page with background
      console.log('📄 No saved preview found. Showing empty background.');
      this.showEmptyPreview();
    }
  }
  
  /**
   * Show empty preview with background image only
   */
  showEmptyPreview() {
    const printArea = document.getElementById('printArea');
    if (printArea) {
      printArea.innerHTML = `
        <section class="sheet A4 landscape tag-page" style="background-image: url(../images/polimaxx.jpg); background-size: cover; background-position: center;">
          <!-- Empty page with background only -->
        </section>
      `;
    }
    this.state.currentData = null;
  }

  /**
   * Load mock data preview
   */
  loadMockDataPreview() {
    if (!this.mockManager) return;
    
    const currentUnit = this.unitManager.getCurrentUnit();
    const mockData = this.mockManager.getMockData(currentUnit.id, 'regular750');
    
    if (mockData) {
      console.log('📦 Loading mock data for preview...');
      this.state.currentData = mockData;
      
      // Render mock preview
      const html = this.templateEngine.render(mockData);
      const printArea = document.getElementById('printArea');
      if (printArea) {
        printArea.innerHTML = html;
      }
      
      console.log('✅ Mock data preview loaded');
    }
  }

  /**
   * Attach global event listeners
   */
  attachGlobalListeners() {
    // Print shortcut (Ctrl+P)
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        window.print();
      }
      
      // Load mock data shortcuts
      if (e.ctrlKey && e.shiftKey) {
        switch(e.key) {
          case '1': // Ctrl+Shift+1: Load HDPE mock
            e.preventDefault();
            this.loadMockData('HDPE');
            break;
          case '3': // Ctrl+Shift+3: Load PP mock
            e.preventDefault();
            this.loadMockData('PP');
            break;
          case '4': // Ctrl+Shift+4: Load PPC mock
            e.preventDefault();
            this.loadMockData('PPC');
            break;
        }
      }
    });

    // Unit change event
    document.addEventListener('unitChange', (e) => {
      console.log('Unit changed:', e.detail);
    });

    // Theme change event
    document.addEventListener('themeChange', (e) => {
      console.log('Theme changed:', e.detail);
    });
  }

  /**
   * Load mock data into form and generate preview
   */
  loadMockData(unit, example = 'regular750') {
    if (!this.mockManager) return;
    
    const mockData = this.mockManager.loadIntoForm(this.formComponent, unit, example);
    
    // Auto-generate preview
    setTimeout(() => {
      this.generatePreview();
    }, 300);
    
    this.showSuccess(`Loaded mock data: ${unit} - ${example}`);
  }

  /**
   * Show loading state
   */
  showLoading() {
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.innerHTML = '⏳ Generating...';
    }
  }

  /**
   * Hide loading state
   */
  hideLoading() {
    const generateBtn = document.getElementById('generateBtn');
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.innerHTML = '✅ Generate Preview';
    }
  }

  /**
   * Show success message
   */
  showSuccess(message) {
    this.showNotification(message, 'success');
  }

  /**
   * Show error message
   */
  showError(message) {
    this.showNotification(message, 'error');
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      padding: 16px 24px;
      background: ${type === 'error' ? '#fee' : '#efe'};
      border: 2px solid ${type === 'error' ? '#fcc' : '#cfc'};
      color: ${type === 'error' ? '#c33' : '#3c3'};
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 9999;
      animation: slideDown 0.3s ease;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.style.animation = 'slideUp 0.3s ease';
      setTimeout(() => notification.remove(), 300);
    }, 5000);
  }

  /**
   * Show welcome message
   */
  showWelcome() {
    const currentUnit = this.unitManager.getCurrentUnit();
    const currentTheme = this.themeManager.getCurrentTheme();
    
    console.log(`
╔══════════════════════════════════════════════════════════╗
║   🏷️  Tag Printing System - React-like Architecture     ║
╠══════════════════════════════════════════════════════════╣
║  📦 Unit: ${currentUnit.fullName.padEnd(44)}   ║
║  🎨 Theme: ${currentTheme.name.padEnd(43)}   ║
║  📋 Ready to generate tags!                             ║
╚══════════════════════════════════════════════════════════╝
    `);
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TagPrintingApp();
  window.app.init();
});

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TagPrintingApp;
}
