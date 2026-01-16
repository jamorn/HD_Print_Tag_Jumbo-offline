/**
 * Main Application - Modern Tag Printing System V2
 * Application controller that orchestrates all components and manages state
 */

import { BaseComponent } from './BaseComponent.js';
import { FormComponent } from './FormComponent.js';
import { FormComponentNoneMfg } from './FormComponentNoneMfg.js';
import { UnitConfig } from './UnitConfig.js';
import { StyleBuilder } from './StyleBuilder.js';
import { notifyTemplate } from './notify-template.js';

export class App extends BaseComponent {
  constructor(options = {}) {
    super({
      containerId: 'app',
      initialUnit: 'HDPE',
      theme: 'default',
      autoSave: true,
      debugMode: false,
      ...options
    });

    this.formComponent = null;
    this.formComponentNoneMfg = null; // Add NoneMfg form
    this.currentUnit = this.props.initialUnit;
    this.appState = {
      formData: {},
      unitConfig: null,
      previewConfig: {},
      lastSaved: null,
      isLoading: false
    };
    
    this.styleBuilder = new StyleBuilder();
    
    // Initialize template engine (non-module class)
    this.templateEngine = null;
    this.initializeTemplateEngine();
    
    this.initializeApp();
  }

  /**
   * Initialize template engine
   */
  initializeTemplateEngine() {
    // Template engine is a global class, initialized after script loads
    if (typeof TemplateEngine !== 'undefined') {
      this.templateEngine = new TemplateEngine({
        units: UnitConfig.UNITS
      });
      console.log('✅ Template engine initialized');
    } else {
      console.error('❌ TemplateEngine not loaded');
    }
  }

  /**
   * Initialize application
   */
  initializeApp() {
    this.loadUnitConfig();
    this.setupEventListeners();
    
    if (this.props.debugMode) {
      this.enableDebugMode();
    }
  }



  /**
   * Load initial unit configuration
   */
  loadUnitConfig() {
    try {
      this.appState.unitConfig = UnitConfig.UNITS[this.currentUnit];
      this.appState.formData = UnitConfig.UNITS[this.currentUnit]?.defaults || {};
    } catch (error) {
      console.error('Failed to load unit config:', error);
      this.showNotification('Failed to load unit configuration', 'error');
    }
  }

  /**
   * Setup global event listeners
   */
  setupEventListeners() {
    // Handle browser events
    window.addEventListener('beforeunload', (e) => {
      if (this.hasUnsavedChanges()) {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
      }
    });

    // Handle print events
    window.addEventListener('beforeprint', () => {
      this.handleBeforePrint();
    });

    window.addEventListener('afterprint', () => {
      this.handleAfterPrint();
    });

    // Handle resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 250);
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardShortcuts(e);
    });
  }

  /**
   * Render the main application
   */
  render() {
    // Apply purple theme to body
    document.body.className = 'theme-purple';
    
    const app = this.createElement('div', {
      className: 'app-container',
      'data-theme': 'purple',
      'data-unit': this.currentUnit
    });

    // Print area (main content)
    const printArea = this.renderPrintArea();
    app.appendChild(printArea);

    // Floating form panel
    const formPanel = this.renderFormPanel();
    app.appendChild(formPanel);

    // Setup navbar button listeners
    this.setupNavbarListeners();

    return app;
  }

  /**
   * Setup navbar button event listeners
   */
  setupNavbarListeners() {
    // Wait for DOM to be ready
    setTimeout(() => {
      const navFormBtn1 = document.getElementById('navFormBtn1');
      const navFormBtn2 = document.getElementById('navFormBtn2');
      const form1Container = document.getElementById('formContainer');
      
      if (navFormBtn1) {
        navFormBtn1.addEventListener('click', () => {
          // Show Form1, hide Form2
          if (form1Container) {
            form1Container.style.transform = 'translateX(0)';
            // Also expand form panel if collapsed
            const formPanel = form1Container.querySelector('.form-panel');
            if (formPanel) {
              formPanel.classList.remove('collapsed');
            }
          }
          const form2Container = document.getElementById('noneMfgFormContainer');
          if (form2Container) {
            form2Container.style.transform = 'translateX(100%)';
          }
          // Update active state
          navFormBtn1.classList.add('active');
          if (navFormBtn2) navFormBtn2.classList.remove('active');
        });
      }
      
      if (navFormBtn2) {
        navFormBtn2.addEventListener('click', () => {
          this.toggleNoneMfgForm();
          // Update active state
          navFormBtn2.classList.add('active');
          if (navFormBtn1) navFormBtn1.classList.remove('active');
        });
      }
      
      // No form active by default - wait for user to click navbar button
    }, 100);
  }

  /**
   * Render print area for tags
   */
  renderPrintArea() {
    const printArea = this.createElement('main', {
      className: 'print-container',
      id: 'printArea'
    });

    // Logo centered on purple background (no white panel)
    const logoImg = this.createElement('img', {
      src: 'images/polimaxx.jpg',
      alt: 'Polimaxx Logo',
      className: 'default-logo'
    });

    printArea.appendChild(logoImg);

    return printArea;
  }

  /**
   * Render floating form panel
   */
  renderFormPanel() {
    const formContainer = this.createElement('div', {
      className: 'no-print',
      id: 'formContainer'
    });
    
    // Position and style like Form2
    formContainer.style.cssText = `
      position: fixed;
      top: 60px;
      right: 0;
      width: 500px;
      max-width: 90vw;
      height: calc(100vh - 60px);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.5s ease-in-out;
      overflow: hidden;
    `;

    // Initialize form component
    this.formComponent = new FormComponent({
      units: UnitConfig.UNITS,
      defaultUnit: this.currentUnit.toUpperCase(),
      defaultTheme: 'blue',
      defaultTemplate: 'template3',
      containerSelector: '#formContainer'
    });

    // Make formComponent globally accessible
    window.formComponent = this.formComponent;

    // Insert form HTML
    formContainer.innerHTML = this.formComponent.render();

    // Initialize form after rendering (wait for DOM to be ready)
    setTimeout(() => {
      // Double-check DOM elements exist
      const gradeInput = document.getElementById('grade');
      if (!gradeInput) {
        console.warn('⚠️ Grade input not found, delaying initialization...');
        setTimeout(() => this.formComponent.initializeForm(), 100);
      } else {
        this.formComponent.initializeForm();
      }
      
      // Subscribe to form changes
      this.formComponent.subscribe((event) => this.handleFormEvent(event));
      
      // Attach button listeners
      this.attachButtonListeners();
    }, 50); // Increased from 0 to 50ms

    return formContainer;
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
        this.handleThemeChange(data);
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
    this.currentUnit = unitId;
    console.log(`Switched to unit: ${unitId}`);
  }

  /**
   * Handle theme change
   */
  handleThemeChange(theme) {
    document.body.className = `theme-${theme}`;
    console.log(`Theme changed to: ${theme}`);
  }

  /**
   * Handle template change
   */
  handleTemplateChange(templateId) {
    console.log('Template changed to:', templateId);
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
   * Generate preview
   */
  async generatePreview() {
    console.log('🎯 Generate Preview clicked!');
    
    try {
      // Get form data
      const formData = this.formComponent.getFormData();
      console.log('📋 Form data:', formData);
      
      // Validate
      const isValid = this.formComponent.validateAll();
      console.log('✓ Validation result:', isValid);
      
      if (!isValid) {
        throw new Error('กรุณากรอกข้อมูลให้ครบถ้วนก่อนสร้าง Preview');
      }

      // Get unit config
      const unitConfig = UnitConfig.UNITS[this.currentUnit];
      console.log('🔧 Unit config:', unitConfig);
      
      // Remove title1/title2 from formData to use defaults
      const { title1: _, title2: __, ...cleanFormData } = formData;
      
      // Merge with defaults
      const completeData = {
        ...unitConfig.defaults,
        ...cleanFormData,
        unit: this.currentUnit,
        unitConfig: unitConfig
      };
      
      console.log('✅ Complete data for rendering:', completeData);
      
      // Check template engine
      if (!this.templateEngine) {
        throw new Error('Template engine not initialized');
      }
      
      // Generate HTML using template engine
      const html = this.templateEngine.render(completeData);
      
      // Render to print area
      const printArea = document.getElementById('printArea');
      if (printArea) {
        printArea.innerHTML = html;
      }
      
      // Save to sessionStorage
      sessionStorage.setItem('last_preview', JSON.stringify(completeData));
      
      // Save to grade history
      if (completeData.grade) {
        this.formComponent.saveGradeHistory(completeData.grade, completeData);
      }
      
      console.log('✅ Preview generated successfully');

    } catch (error) {
      console.error('❌ Generation failed:', error);
      notifyTemplate.error(error.message);
    }
  }

  /**
   * Clear preview
   */
  clearPreview() {
    const printArea = document.getElementById('printArea');
    if (printArea) {
      // Show logo directly on purple background (no white panel)
      const logoImg = this.createElement('img', {
        src: 'images/polimaxx.jpg',
        alt: 'Polimaxx Logo',
        className: 'default-logo'
      });

      printArea.innerHTML = '';
      printArea.appendChild(logoImg);
    }
  }

  /**
   * Render floating action buttons (Modern Style - Based on Form Buttons)
   */
  renderFloatingButtons() {
    const container = this.createElement('div', {
      className: 'floating-buttons no-print'
    });

    // Print Button - Green gradient style matching form buttons
    const printBtn = this.createElement('button', {
      className: 'floating-btn print-btn',
      title: 'Print (Ctrl+P)',
      innerHTML: '🖨️'
    });
    
    // Apply inline styles for green gradient + animation
    Object.assign(printBtn.style, {
      background: 'linear-gradient(135deg, #28a745, #20c997)',
      border: 'none',
      borderRadius: '16px',
      width: '56px',
      height: '56px',
      color: 'white',
      fontSize: '28px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(40, 167, 69, 0.35)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: 'floatBtn 3s ease-in-out infinite'
    });
    
    printBtn.onclick = () => this.openPrintWindow();
    
    // Hover effects
    printBtn.addEventListener('mouseenter', () => {
      printBtn.style.transform = 'scale(1.1) rotate(-5deg)';
      printBtn.style.boxShadow = '0 12px 32px rgba(40, 167, 69, 0.45)';
    });
    printBtn.addEventListener('mouseleave', () => {
      printBtn.style.transform = 'scale(1) rotate(0deg)';
      printBtn.style.boxShadow = '0 8px 24px rgba(40, 167, 69, 0.35)';
    });

    // Help Button - Purple gradient style
    const helpBtn = this.createElement('button', {
      className: 'floating-btn help-btn',
      title: 'Help (F1)',
      innerHTML: '❓'
    });
    
    // Apply inline styles for purple gradient + animation
    Object.assign(helpBtn.style, {
      background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
      border: 'none',
      borderRadius: '16px',
      width: '56px',
      height: '56px',
      color: 'white',
      fontSize: '28px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 8px 24px rgba(139, 92, 246, 0.35)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      animation: 'floatBtn 3s ease-in-out infinite 0.5s'
    });
    
    helpBtn.onclick = () => {
      const helpPanel = document.getElementById('helpPanel');
      if (helpPanel) {
        helpPanel.classList.remove('hidden');
      }
    };
    
    // Hover effects
    helpBtn.addEventListener('mouseenter', () => {
      helpBtn.style.transform = 'scale(1.1) rotate(5deg)';
      helpBtn.style.boxShadow = '0 12px 32px rgba(139, 92, 246, 0.45)';
    });
    helpBtn.addEventListener('mouseleave', () => {
      helpBtn.style.transform = 'scale(1) rotate(0deg)';
      helpBtn.style.boxShadow = '0 8px 24px rgba(139, 92, 246, 0.35)';
    });

    container.appendChild(printBtn);
    container.appendChild(helpBtn);

    return container;
  }

  /**
   * Show help panel
   */
  showHelp() {
    console.log('Help panel - to be implemented');
  }

  /**
   * Render application header (deprecated - keeping for compatibility)
   */
  renderHeader() {
    const header = this.createElement('header', {
      className: 'app-header'
    });

    const headerContent = this.createElement('div', {
      className: 'header-content'
    });

    // Title section
    const titleSection = this.createElement('div', {
      className: 'header-title'
    });

    const title = this.createElement('h1', {
      textContent: 'Tag Printing System V2'
    });

    const subtitle = this.createElement('div', {
      className: 'header-subtitle',
      textContent: 'Modern Production Tag Generator'
    });

    titleSection.appendChild(title);
    titleSection.appendChild(subtitle);

    // Status section
    const statusSection = this.createElement('div', {
      className: 'header-status',
      id: 'header-status'
    });

    this.updateHeaderStatus();

    headerContent.appendChild(titleSection);
    headerContent.appendChild(statusSection);
    header.appendChild(headerContent);

    return header;
  }

  /**
   * Render main content area
   */
  renderMain() {
    const main = this.createElement('main', {
      className: 'app-main'
    });

    // Control panel (left side)
    const controlPanel = this.renderControlPanel();
    main.appendChild(controlPanel);

    // Preview area (right side)
    const previewArea = this.renderPreviewArea();
    main.appendChild(previewArea);

    return main;
  }

  /**
   * Render control panel
   */
  renderControlPanel() {
    const panel = this.createElement('aside', {
      className: 'control-panel'
    });

    // Panel header
    const panelHeader = this.createElement('div', {
      className: 'panel-header'
    });

    const panelTitle = this.createElement('h2', {
      textContent: 'Configuration'
    });

    panelHeader.appendChild(panelTitle);
    panel.appendChild(panelHeader);

    // Form container
    const formContainer = this.createElement('div', {
      className: 'form-container',
      id: 'form-container'
    });

    // Initialize form component
    this.formComponent = new FormComponent({
      units: UnitConfig,
      defaultUnit: this.currentUnit,
      defaultTheme: 'blue',
      defaultTemplate: 'template3',
      onSubmit: (formData, unitConfig) => this.handleFormSubmit(formData, unitConfig),
      onFieldChange: (fieldName, value, formData) => this.handleFieldChange(fieldName, value, formData),
      autoValidate: true,
      showValidation: true
    });

    this.formComponent.mount(formContainer);
    this.addChild(this.formComponent, 'form');

    panel.appendChild(formContainer);

    return panel;
  }

  /**
   * Render action buttons
   */
  renderActionButtons() {
    const actions = this.createElement('div', {
      className: 'action-buttons'
    });

    const generateBtn = this.createElement('button', {
      className: 'btn btn-primary btn-large',
      textContent: '📄 Generate Preview',
      onclick: () => this.generatePreview()
    });

    const saveBtn = this.createElement('button', {
      className: 'btn btn-secondary',
      textContent: '💾 Save Configuration',
      onclick: () => this.saveConfiguration()
    });

    const loadBtn = this.createElement('button', {
      className: 'btn btn-secondary',
      textContent: '📂 Load Configuration',
      onclick: () => this.loadConfiguration()
    });

    const resetBtn = this.createElement('button', {
      className: 'btn btn-warning',
      textContent: '🔄 Reset All',
      onclick: () => this.resetAll()
    });

    actions.appendChild(generateBtn);
    actions.appendChild(saveBtn);
    actions.appendChild(loadBtn);
    actions.appendChild(resetBtn);

    return actions;
  }

  /**
   * Render status display
   */
  renderStatusDisplay() {
    const status = this.createElement('div', {
      className: 'status-display',
      id: 'status-display'
    });

    this.updateStatusDisplay();
    return status;
  }



  /**
   * Render application footer
   */
  renderFooter() {
    const footer = this.createElement('footer', {
      className: 'app-footer'
    });

    const footerContent = this.createElement('div', {
      className: 'footer-content'
    });

    const footerInfo = this.createElement('div', {
      className: 'footer-info',
      textContent: 'Modern Tag Printing System'
    });

    const footerVersion = this.createElement('div', {
      className: 'footer-version',
      textContent: 'Version 2.0'
    });

    footerContent.appendChild(footerInfo);
    footerContent.appendChild(footerVersion);
    footer.appendChild(footerContent);

    return footer;
  }

  /**
   * Handle form submission
   */
  handleFormSubmit(formData, unitConfig) {
    this.appState.formData = { ...formData };
    this.appState.unitConfig = unitConfig;
    
    this.generatePreview();
    this.updateStatusDisplay();
    
    if (this.props.autoSave) {
      this.autoSave();
    }

    this.showNotification('Form data updated successfully', 'success');
  }

  /**
   * Handle field changes
   */
  handleFieldChange(fieldName, value, formData) {
    this.appState.formData = { ...formData };
    this.updateStatusDisplay();
  }

  /**
   * Validate form data
   */
  validateFormData() {
    if (!this.formComponent) return false;
    
    // validateAll() returns boolean directly
    return this.formComponent.validateAll();
  }

  /**
   * Update status display
   */
  updateStatusDisplay() {
    const statusEl = this.querySelector('#status-display');
    if (!statusEl) return;

    const isValid = this.formComponent ? this.formComponent.validateAll() : false;
    const errorCount = this.formComponent ? Object.keys(this.formComponent.state.errors).length : 0;

    statusEl.innerHTML = `
      <div class="status-item">
        <span class="status-label">Form Status:</span>
        <span class="status-value ${isValid ? 'text-success' : 'text-danger'}">
          ${isValid ? 'Valid' : `${errorCount} errors`}
        </span>
      </div>
      <div class="status-item">
        <span class="status-label">Unit:</span>
        <span class="status-value">${this.appState.unitConfig?.name || 'None'}</span>
      </div>
      <div class="status-item">
        <span class="status-label">Preview:</span>
        <span class="status-value ${previewState.hasValidData ? 'text-success' : 'text-muted'}">
          ${previewState.hasValidData ? `${previewState.pages} pages` : 'Not generated'}
        </span>
      </div>
      <div class="status-item">
        <span class="status-label">Last Saved:</span>
        <span class="status-value">${this.appState.lastSaved ? new Date(this.appState.lastSaved).toLocaleTimeString() : 'Never'}</span>
      </div>
    `;
  }

  /**
   * Update header status
   */
  updateHeaderStatus() {
    const statusEl = this.querySelector('#header-status');
    if (!statusEl) return;

    const isReady = this.validateFormData();
    const statusClass = isReady ? 'status-ready' : 'status-pending';
    const statusText = isReady ? 'Ready to Print' : 'Configuration Needed';

    statusEl.innerHTML = `
      <div class="status-badge ${statusClass}">
        <span class="status-indicator"></span>
        <span class="status-text">${statusText}</span>
      </div>
    `;
  }

  /**
   * Set loading state
   */
  setLoadingState(loading) {
    this.appState.isLoading = loading;
    
    if (loading) {
      this.addClass('loading');
    } else {
      this.removeClass('loading');
    }
  }

  /**
   * Debounced preview update
   */
  debouncePreviewUpdate() {
    if (this.previewUpdateTimeout) {
      clearTimeout(this.previewUpdateTimeout);
    }
    
    this.previewUpdateTimeout = setTimeout(() => {
      if (this.validateFormData()) {
        this.generatePreview();
      }
    }, 500);
  }

  /**
   * Save configuration to localStorage
   */
  saveConfiguration() {
    try {
      const config = {
        unitId: this.currentUnit,
        formData: this.appState.formData,
        previewConfig: this.appState.previewConfig,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('tagPrintingConfig', JSON.stringify(config));
      this.appState.lastSaved = new Date().toISOString();
      
      this.updateStatusDisplay();
      this.showNotification('Configuration saved successfully', 'success');
      
    } catch (error) {
      console.error('Failed to save configuration:', error);
      this.showNotification('Failed to save configuration', 'error');
    }
  }

  /**
   * Load configuration from localStorage
   */
  loadConfiguration() {
    try {
      const saved = localStorage.getItem('tagPrintingConfig');
      if (!saved) {
        this.showNotification('No saved configuration found', 'info');
        return;
      }

      const config = JSON.parse(saved);
      
      // Update unit if different
      if (config.unitId !== this.currentUnit) {
        this.switchUnit(config.unitId);
      }

      // Update form data
      if (this.formComponent) {
        this.formComponent.setFormData(config.formData);
      }

      // Update preview config
      if (config.previewConfig) {
        Object.entries(config.previewConfig).forEach(([key, value]) => {
          if (this.previewComponent) {
            this.previewComponent.updateConfig({ [key]: value });
          }
        });
      }

      this.appState.lastSaved = config.timestamp;
      this.updateStatusDisplay();
      this.showNotification('Configuration loaded successfully', 'success');
      
    } catch (error) {
      console.error('Failed to load configuration:', error);
      this.showNotification('Failed to load configuration', 'error');
    }
  }

  /**
   * Auto-save functionality
   */
  autoSave() {
    if (this.autoSaveTimeout) {
      clearTimeout(this.autoSaveTimeout);
    }
    
    this.autoSaveTimeout = setTimeout(() => {
      this.saveConfiguration();
    }, 2000);
  }

  /**
   * Reset all data
   */
  resetAll() {
    if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
      // Reset form
      if (this.formComponent) {
        this.formComponent.clearForm();
      }

      // Clear preview
      this.clearPreview();

      // Clear localStorage
      localStorage.removeItem('tagPrintingConfig');
      this.appState.lastSaved = null;

      this.updateStatusDisplay();
      this.showNotification('All data has been reset', 'info');
    }
  }

  /**
   * Switch production unit
   */
  switchUnit(unitId) {
    try {
      // Ensure unitId is uppercase
      const normalizedUnitId = unitId.toUpperCase();
      const newUnitConfig = UnitConfig.UNITS[normalizedUnitId];
      
      if (!newUnitConfig) {
        throw new Error(`Unit configuration not found for: ${unitId}`);
      }
      
      this.currentUnit = normalizedUnitId;
      this.appState.unitConfig = newUnitConfig;
      
      // DON'T reset formData - let FormComponent load from localStorage
      // this.appState.formData = newUnitConfig.defaults || {}; // ❌ OLD
      
      // Tell FormComponent to switch unit and reload history
      if (this.formComponent) {
        this.formComponent.switchUnit(normalizedUnitId);
      }

      // Update UI
      this.element.setAttribute('data-unit', normalizedUnitId);
      this.updateStatusDisplay();
      
      this.showNotification(`Switched to ${newUnitConfig.name}`, 'info');
      
    } catch (error) {
      console.error('Failed to switch unit:', error);
      this.showNotification('Failed to switch unit: ' + error.message, 'error');
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  handleKeyboardShortcuts(event) {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 's':
          event.preventDefault();
          this.saveConfiguration();
          break;
        case 'p':
          event.preventDefault();
          this.openPrintWindow();
          break;
        case 'Enter':
          if (event.shiftKey) {
            event.preventDefault();
            this.generatePreview();
          }
          break;
      }
    }
  }

  /**
   * Handle before print
   */
  handleBeforePrint() {
    console.log('Preparing for print...');
  }

  /**
   * Handle after print
   */
  handleAfterPrint() {
    console.log('Print completed');
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Responsive adjustments can be made here
    const width = window.innerWidth;
    
    if (width < 768) {
      this.addClass('mobile-layout');
    } else {
      this.removeClass('mobile-layout');
    }
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // This would integrate with a notification system
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // You could emit an event for external notification systems
    this.emit('notification', { message, type });
  }

  /**
   * Check for unsaved changes
   */
  hasUnsavedChanges() {
    // Simple check - could be more sophisticated
    const currentData = JSON.stringify(this.appState.formData);
    const savedData = localStorage.getItem('tagPrintingConfig');
    
    if (!savedData) return Object.keys(this.appState.formData).length > 0;
    
    try {
      const saved = JSON.parse(savedData);
      return currentData !== JSON.stringify(saved.formData);
    } catch {
      return true;
    }
  }

  /**
   * Enable debug mode
   */
  enableDebugMode() {
    this.addClass('debug-mode');
    
    // Add debug info to console
    window.tagPrintingApp = this;
    console.log('Debug mode enabled. Access app via window.tagPrintingApp');
    
    // Add debug panel (optional)
    this.renderDebugPanel();
  }

  /**
   * Render debug panel
   */
  renderDebugPanel() {
    const debugPanel = this.createElement('div', {
      id: 'debug-panel',
      className: 'debug-panel',
      innerHTML: `
        <h4>Debug Panel</h4>
        <button onclick="console.log(window.tagPrintingApp.debug())">Log App State</button>
        <button onclick="window.tagPrintingApp.showNotification('Test notification', 'info')">Test Notification</button>
      `,
      style: 'position: fixed; top: 10px; right: 10px; background: white; border: 1px solid #ccc; padding: 10px; z-index: 10000;'
    });
    
    document.body.appendChild(debugPanel);
  }

  /**
   * Open print window (new tab with rendered content)
   */
  /**
   * Open print dialog directly (no new window)
   */
  openPrintWindow() {
    console.log('🖨️ Opening print dialog...');
    
    try {
      // Check if preview exists
      const printArea = document.getElementById('printArea');
      if (!printArea || !printArea.innerHTML.trim()) {
        notifyTemplate.warning('กรุณา Generate Preview ก่อนพิมพ์');
        return;
      }
      
      // Wait for QR codes to finish generating
      console.log('⏳ Waiting for QR codes...');
      
      setTimeout(() => {
        const qrContainers = document.querySelectorAll('[id^="qr-logo-"]');
        console.log(`📋 Found ${qrContainers.length} QR code containers`);
        
        // Check if all QR codes have images
        let qrReady = true;
        qrContainers.forEach((container, index) => {
          const img = container.querySelector('img');
          if (!img) {
            console.warn(`⚠️ QR code ${index + 1} missing image`);
            qrReady = false;
          } else {
            console.log(`✅ QR code ${index + 1} ready`);
          }
        });
        
        if (qrReady || qrContainers.length === 0) {
          console.log('✅ All QR codes ready, opening print dialog...');
          window.print();
        } else {
          console.log('⏳ QR codes not ready, waiting longer...');
          setTimeout(() => {
            console.log('🖨️ Opening print dialog anyway...');
            window.print();
          }, 500);
        }
      }, 300);
      
    } catch (error) {
      console.error('❌ Print error:', error);
      notifyTemplate.error('เกิดข้อผิดพลาดในการพิมพ์');
    }
  }

  /**
   * Toggle NoneMfg Form (for green button)
   */
  toggleNoneMfgForm() {
    // Get both form containers
    let noneMfgContainer = document.getElementById('noneMfgFormContainer');
    const form1Container = document.getElementById('formContainer');
    
    if (!noneMfgContainer) {
      // Create NoneMfg form for the first time
      this.createNoneMfgForm();
      // Note: createNoneMfgForm() already handles showing form2 and hiding form1
      return;
    }
    
    // Check current state - if it's hidden (translateX(100%)) or visible (translateX(0))
    const currentTransform = noneMfgContainer.style.transform || 'translateX(100%)';
    const isHidden = currentTransform.includes('100%');
    
    if (isHidden) {
      // Show Form2, Hide Form1
      noneMfgContainer.style.transform = 'translateX(0)';
      if (form1Container) {
        form1Container.style.transform = 'translateX(100%)';
      }
    } else {
      // Hide Form2, Show Form1
      noneMfgContainer.style.transform = 'translateX(100%)';
      if (form1Container) {
        form1Container.style.transform = 'translateX(0)';
      }
    }
  }

  /**
   * Create NoneMfg Form Container
   */
  createNoneMfgForm() {
    const container = document.createElement('div');
    container.id = 'noneMfgFormContainer';
    container.className = 'no-print';
    // Position at same place as Form1 (right side) with slide animation
    // Add top: 60px to avoid covering navbar
    container.style.cssText = `
      position: fixed;
      top: 60px;
      right: 0;
      width: 400px;
      max-width: 90vw;
      height: calc(100vh - 60px);
      z-index: 1000;
      transform: translateX(100%);
      transition: transform 0.5s ease-in-out;
      overflow: hidden;
      border-left: 1px solid #cbd5e1;
    `;

    // Initialize NoneMfg form component
    this.formComponentNoneMfg = new FormComponentNoneMfg({
      units: UnitConfig.UNITS,
      defaultUnit: this.currentUnit.toUpperCase(),
      defaultTheme: 'purple',
      defaultTemplate: 'template1',
      containerSelector: '#noneMfgFormContainer'
    });

    // Make accessible globally
    window.formComponentNoneMfg = this.formComponentNoneMfg;

    // Insert form HTML
    container.innerHTML = this.formComponentNoneMfg.render();

    // Add to body
    document.body.appendChild(container);
    
    // Immediately slide in form2 and hide form1
    const form1Container = document.getElementById('formContainer');
    setTimeout(() => {
      container.style.transform = 'translateX(0)';
      if (form1Container) {
        form1Container.style.transform = 'translateX(100%)';
      }
    }, 10);
    
    // Add theme class to container
    setTimeout(() => {
      const formPanel = container.querySelector('.form-panel');
      if (formPanel) {
        formPanel.classList.add('theme-purple');
      }
    }, 10);

    // Initialize form after rendering (increase delay for DOM readiness)
    setTimeout(() => {
      console.log('🔧 [NoneMfg] Starting initialization...');
      this.formComponentNoneMfg.initializeForm();
      
      // Subscribe to form changes
      this.formComponentNoneMfg.subscribe((event) => this.handleNoneMfgFormEvent(event));
      
      // Attach button listeners for NoneMfg form
      this.attachNoneMfgButtonListeners();
      
      console.log('✅ NoneMfg Form created and initialized');
      console.log('📊 [NoneMfg] Current form data:', this.formComponentNoneMfg.state.formData);
    }, 100); // Increased from 50 to 100ms
  }

  /**
   * Handle NoneMfg form events
   */
  handleNoneMfgFormEvent(event) {
    console.log('[NoneMfg] Form event:', event);
    // Handle events similar to main form if needed
  }

  /**
   * Attach button listeners for NoneMfg form
   */
  attachNoneMfgButtonListeners() {
    const container = document.getElementById('noneMfgFormContainer');
    if (!container) return;

    const generateBtn = container.querySelector('#generateBtn');
    const clearBtn = container.querySelector('#clearBtn');
    const collapseBtn = container.querySelector('.collapse-btn');

    if (generateBtn) {
      generateBtn.addEventListener('click', () => this.generatePreview());
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.formComponentNoneMfg.clearForm();
        this.clearPreview();
      });
    }

    // Collapse button for NoneMfg form - slide out and show Form1
    if (collapseBtn) {
      collapseBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Slide out Form2
        container.style.transform = 'translateX(100%)';
        // Show Form1 back after animation
        setTimeout(() => {
          const form1Container = document.getElementById('formContainer');
          if (form1Container) {
            form1Container.style.transform = 'translateX(0)';
          }
        }, 500); // Match transition duration
      });
    }
  }

  /**
   * Get application state for debugging
   */
  debug() {
    return {
      appState: this.appState,
      currentUnit: this.currentUnit,
      formComponent: this.formComponent?.debug(),
      validation: this.formComponent ? { isValid: this.formComponent.validateAll() } : null
    };
  }

  /**
   * Initialize the application
   */
  static init(options = {}) {
    const app = new App(options);
    
    // Mount to DOM
    const container = document.getElementById(options.containerId || 'app');
    if (container) {
      app.mount(container);
      
      // Load saved configuration if available
      setTimeout(() => {
        const saved = localStorage.getItem('tagPrintingConfig');
        if (saved && options.autoLoad !== false) {
          app.loadConfiguration();
        }
      }, 100);
      
      return app;
    } else {
      throw new Error(`Container element with id '${options.containerId || 'app'}' not found`);
    }
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('app')) {
    try {
      const appInstance = App.init({
        debugMode: false,
        autoSave: true,
        autoLoad: true
      });
      
      // Expose to window for print button
      window.appInstance = appInstance;
      window.tagPrintingApp = appInstance;
      
      console.log('✅ App initialized and exposed to window');
      
    } catch (error) {
      console.error('Failed to initialize Tag Printing System:', error);
    }
  }
});