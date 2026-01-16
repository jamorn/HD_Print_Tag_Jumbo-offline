/**
 * Form Component - React-like component for handling form input
 * Manages state, validation, and user interactions
 */

class FormComponent {
  constructor(config) {
    this.config = config;
    
    // Initialize state without calling getInitialFormData first
    this.state = {
      unit: config.defaultUnit || 'HDPE',
      theme: config.defaultTheme || 'blue',
      template: config.defaultTemplate || 'template3',
      formData: {},
      errors: {},
      isCollapsed: false
    };
    
    // Now get initial form data after state is initialized
    this.state.formData = this.getInitialFormData();
    
    // Grade autocomplete data
    this.allGrades = [];
    this.selectedGradeData = null;
    this.loadGradeData();
    
    this.listeners = [];
    this.initializeForm();
  }
  
  /**
   * Load grade data from hdpe_pellet.js
   */
  loadGradeData() {
    if (typeof hdpe_pellet_data !== 'undefined') {
      this.allGrades = hdpe_pellet_data.pellets || [];
      console.log(`📊 Loaded ${this.allGrades.length} grades for autocomplete`);
    } else {
      console.warn('⚠️ hdpe_pellet_data not found');
    }
  }

  /**
   * Get initial form data from Grade History or unit defaults
   */
  getInitialFormData() {
    // Try to get last used grade from Grade History for this unit
    const lastGrade = this.getLastUsedGrade(this.state.unit);
    
    if (lastGrade) {
      console.log(`📂 Loaded last grade data for ${this.state.unit}:`, lastGrade);
      return {
        grade: lastGrade.grade || '',
        netweight: lastGrade.netweight || '',
        lot: lastGrade.lot || '',
        fromPage: lastGrade.fromPage || '1',
        toPage: lastGrade.toPage || '1',
        shift: this.getDefaultShift(),
        idate: new Date().getDate().toString(),
        controlprint: lastGrade.controlprint || { ft: false, lt: false }
      };
    }
    
    // No grade history - use unit defaults from config
    const unitConfig = this.config.units[this.state.unit];
    const defaults = unitConfig?.defaults || {};
    
    console.log(`📝 No grade history for ${this.state.unit}, using unit defaults`);
    
    // Generate lot prefix from init netweight
    let lotPrefix = '';
    if (defaults.netweight) {
      const netweight = parseInt(defaults.netweight);
      const currentYear = new Date().getFullYear();
      const twoDigitYear = currentYear.toString().slice(-2);
      const lotStartWithNine = [1650, 1800, 16500, 18000];
      
      // SB grades always start with 9
      const isSBGrade = defaults.grade && defaults.grade.includes('/SB/');
      
      if (isSBGrade || lotStartWithNine.includes(netweight)) {
        lotPrefix = '9' + twoDigitYear;
      } else {
        lotPrefix = netweight.toString().charAt(0) + twoDigitYear;
      }
      console.log(`🔢 Generated lot prefix from init: ${lotPrefix}`);
    }
    
    return {
      grade: defaults.grade || '',
      netweight: defaults.netweight || '',
      lot: lotPrefix,
      fromPage: '1',
      toPage: '1',
      shift: this.getDefaultShift(),
      idate: new Date().getDate().toString(),
      controlprint: { ft: false, lt: false }
    };
  }
  
  /**
   * Get last used grade for a specific unit from Grade History
   * @param {string} unit - Unit name (HDPE, PP, PPC)
   * @returns {object|null} Last used grade data or null
   */
  getLastUsedGrade(unit) {
    try {
      const historyKey = `grade_history_${unit}`; // ใช้ key เฉพาะของ unit
      const stored = localStorage.getItem(historyKey);
      if (!stored) return null;
      
      const history = JSON.parse(stored);
      
      // Find the most recent grade from this unit's history
      let lastGrade = null;
      let lastTimestamp = null;
      
      Object.keys(history).forEach(grade => {
        const data = history[grade];
        const timestamp = new Date(data.timestamp);
        
        if (!lastTimestamp || timestamp > lastTimestamp) {
          lastTimestamp = timestamp;
          lastGrade = { grade, ...data };
        }
      });
      
      return lastGrade;
    } catch (e) {
      console.warn('Failed to get last used grade:', e);
      return null;
    }
  }
  
  /**
   * Get default shift based on current time
   */
  getDefaultShift() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return 'M';      // กะเช้า (06:00-13:59)
    if (hour >= 14 && hour < 22) return 'E';     // กะบ่าย (14:00-21:59)
    return 'N';                                   // กะดึก (22:00-05:59)
  }

  /**
   * Initialize form and attach event listeners
   */
  initializeForm() {
    this.populateDateDropdown();
    this.populateShiftDropdown();
    this.attachEventListeners();
    
    // Wait for next tick to ensure DOM is fully ready
    setTimeout(() => {
      this.restoreFormState();
      
      // Save initial state to sessionStorage (important for first load)
      this.saveFormState();
      console.log(`💾 Saved initial state for ${this.state.unit}`);
    }, 0);
  }

  /**
   * Populate date dropdown with days 1-31
   */
  populateDateDropdown() {
    const select = document.getElementById('idate');
    if (!select) return;
    
    select.innerHTML = '';
    const currentDate = new Date().getDate();
    
    for (let i = 1; i <= 31; i++) {
      const option = document.createElement('option');
      option.value = i.toString();
      option.textContent = i.toString().padStart(2, '0');
      if (i === currentDate) {
        option.selected = true;
      }
      select.appendChild(option);
    }
  }
  
  /**
   * Populate shift dropdown and auto-select based on current time
   */
  populateShiftDropdown() {
    const select = document.getElementById('shift');
    if (!select) return;
    
    const currentShift = this.getDefaultShift();
    
    // Set the selected value
    select.value = currentShift;
    
    console.log(`⏰ Auto-selected shift: ${currentShift} (based on current time)`);
  }

  /**
   * Attach all event listeners
   */
  attachEventListeners() {
    // Unit buttons
    document.querySelectorAll('.unit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleUnitChange(e.target.dataset.unit));
    });

    // Theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.handleThemeChange(e.target.dataset.theme));
    });

    // Template cards
    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const template = e.currentTarget.dataset.template;
        this.handleTemplateChange(template);
      });
    });

    // Form inputs - เพิ่ม netweight เข้าไปด้วย
    ['grade', 'netweight', 'lot', 'fromPage', 'toPage', 'shift', 'idate'].forEach(field => {
      const input = document.getElementById(field);
      if (input) {
        input.addEventListener('input', (e) => this.handleInputChange(field, e.target.value));
        input.addEventListener('blur', (e) => this.validateField(field, e.target.value));
      }
    });
    
    // Grade input - block Thai characters (allow only a-z, A-Z, 0-9, /)
    const gradeInput = document.getElementById('grade');
    if (gradeInput) {
      gradeInput.addEventListener('input', (e) => this.handleGradeInput(e.target.value));
      
      gradeInput.addEventListener('keydown', (e) => {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Home', 'End'];
        
        // Allow Ctrl/Cmd shortcuts
        if (e.ctrlKey || e.metaKey) return;
        
        // Allow a-z, A-Z, 0-9, /
        if (/^[a-zA-Z0-9/]$/.test(e.key)) return;
        
        // Allow special keys
        if (allowedKeys.includes(e.key)) return;
        
        // Block everything else (including Thai characters)
        e.preventDefault();
      });
    }
    
    // Close autocomplete when clicking outside
    document.addEventListener('click', (e) => {
      const autocompleteList = document.getElementById('gradeAutocomplete');
      if (gradeInput && autocompleteList && !gradeInput.contains(e.target) && !autocompleteList.contains(e.target)) {
        autocompleteList.classList.remove('show');
      }
    });

    // Lot character counter
    const lotInput = document.getElementById('lot');
    if (lotInput) {
      lotInput.addEventListener('input', (e) => this.updateLotCounter(e.target.value));
      
      // Only allow numbers in lot
      lotInput.addEventListener('keydown', (e) => {
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
        if (e.ctrlKey || e.metaKey) return;
        if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
          e.preventDefault();
        }
        if (/^[0-9]$/.test(e.key) && e.target.value.length >= 10) {
          e.preventDefault();
        }
      });
    }

    // Checkboxes
    ['ft', 'lt'].forEach(checkbox => {
      const input = document.getElementById(checkbox);
      if (input) {
        input.addEventListener('change', (e) => {
          this.state.formData.controlprint[checkbox] = e.target.checked;
          this.saveFormState();
        });
      }
    });

    // Collapse button
    const collapseBtn = document.querySelector('.collapse-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => this.toggleCollapse());
    }
  }

  /**
   * Handle unit change (HDPE, PP, PPC)
   */
  handleUnitChange(unit) {
    // Save current unit's state before switching
    this.saveFormState();
    
    // Clear selected grade data (prevent data from previous unit sticking)
    this.selectedGradeData = null;
    
    // Clear autocomplete
    const autocompleteList = document.getElementById('gradeAutocomplete');
    if (autocompleteList) {
      autocompleteList.classList.remove('show');
      autocompleteList.innerHTML = '';
    }
    
    // Change to new unit
    this.state.unit = unit;
    
    // 🔄 Try to load from sessionStorage first (keep user's input when switching tabs)
    const sessionKey = `form_data_${unit}`;
    const savedData = sessionStorage.getItem(sessionKey);
    
    if (savedData) {
      // User has already entered data for this unit in this session
      const parsed = JSON.parse(savedData);
      
      // Check if it's new format (object with formData, template, theme)
      if (parsed.formData) {
        this.state.formData = parsed.formData;
        this.state.template = parsed.template || this.state.template;
        this.state.theme = parsed.theme || this.state.theme;
      } else {
        // Old format (just formData)
        this.state.formData = parsed;
      }
      
      console.log(`📂 Restored saved data for ${unit} from session (template: ${this.state.template})`);
    } else {
      // No session data - load from grade history or unit defaults
      this.state.formData = this.getInitialFormData();
      console.log(`📝 Loaded initial data for ${unit}`);
    }
    
    // Update UI buttons
    document.querySelectorAll('.unit-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.unit === unit);
    });
    
    // Update theme UI
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === this.state.theme);
    });
    
    // Update template selector to show only available templates for this unit
    const unitConfig = this.config.units[unit];
    if (unitConfig && unitConfig.availableTemplates) {
      const currentTemplate = this.state.template;
      // If current template not available in new unit, switch to default
      if (!unitConfig.availableTemplates.includes(currentTemplate)) {
        this.state.template = unitConfig.defaultTemplate || 'template2';
      }
    }
    
    // Re-render template selector to update available options and highlight active template
    this.updateTemplateSelector();
    
    // Restore form state (populate inputs)
    this.restoreFormState();
    
    console.log(`🔄 Switched to unit: ${unit} (template: ${this.state.template})`);
    
    // Notify listeners
    this.notifyListeners('unitChange', unit);
  }

  /**
   * Handle theme change
   */
  handleThemeChange(theme) {
    this.state.theme = theme;
    
    // Update UI
    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
    
    // Apply theme to body
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${theme}`);
    
    this.notifyListeners('themeChange', theme);
  }

  /**
   * Handle template change
   */
  handleTemplateChange(template) {
    this.state.template = template;
    
    // Update UI
    document.querySelectorAll('.template-card').forEach(card => {
      card.classList.toggle('active', card.dataset.template === template);
    });
    
    this.notifyListeners('templateChange', template);
  }

  /**
   * Handle input change
   */
  handleInputChange(field, value) {
    this.state.formData[field] = value;
    
    // Auto-populate netweight from grade for certain units
    if (field === 'grade' && this.config.units[this.state.unit]?.gradeData) {
      const gradeData = this.config.units[this.state.unit].gradeData.find(
        g => g.grade === value
      );
      if (gradeData) {
        this.state.formData.netweight = gradeData.netweight;
        const netweightInput = document.getElementById('netweight');
        if (netweightInput) netweightInput.value = gradeData.netweight;
      }
    }
    
    this.saveFormState();
  }

  /**
   * Validate individual field
   */
  validateField(field, value) {
    const validators = {
      grade: (v) => v.trim() !== '' || 'Grade is required',
      lot: (v) => {
        if (!v) return 'Lot is required';
        if (v.length !== 10) return 'Lot must be exactly 10 characters';
        return true;
      },
      fromPage: (v) => {
        const num = parseInt(v);
        if (isNaN(num) || num < 1) return 'Invalid page number';
        return true;
      },
      toPage: (v) => {
        const num = parseInt(v);
        const from = parseInt(this.state.formData.fromPage);
        if (isNaN(num) || num < 1) return 'Invalid page number';
        if (num < from) return 'To page must be >= from page';
        return true;
      }
    };

    const validator = validators[field];
    if (validator) {
      const result = validator(value);
      if (result === true) {
        delete this.state.errors[field];
        this.removeFieldError(field);
      } else {
        this.state.errors[field] = result;
        this.showFieldError(field, result);
      }
    }

    return Object.keys(this.state.errors).length === 0;
  }

  /**
   * Handle grade input autocomplete
   */
  handleGradeInput(value) {
    const autocompleteList = document.getElementById('gradeAutocomplete');
    
    if (!value || value.length < 1) {
      autocompleteList.classList.remove('show');
      return;
    }
    
    // Filter grades
    const searchTerm = value.toLowerCase();
    const matches = this.allGrades.filter(g => 
      g.Grade.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // Limit to 5 results
    
    if (matches.length === 0) {
      autocompleteList.innerHTML = '<div class="autocomplete-no-result">ไม่พบผลลัพธ์</div>';
      autocompleteList.classList.add('show');
      return;
    }
    
    // Render autocomplete items
    autocompleteList.innerHTML = matches.map((grade, index) => {
      const highlighted = grade.Grade.replace(
        new RegExp(value, 'gi'), 
        match => `<strong>${match}</strong>`
      );
      return `<div class="autocomplete-item" data-grade="${grade.Grade}" onclick="formComponent.selectGrade('${grade.Grade}')">${highlighted}</div>`;
    }).join('');
    
    autocompleteList.classList.add('show');
  }

  /**
   * Select grade from autocomplete
   */
  selectGrade(gradeName) {
    const gradeInput = document.getElementById('grade');
    const autocompleteList = document.getElementById('gradeAutocomplete');
    
    // Find full grade data
    this.selectedGradeData = this.allGrades.find(g => g.Grade === gradeName);
    
    if (this.selectedGradeData) {
      let displayGrade = this.selectedGradeData.Grade;
      
      // Special handling: Grades containing "*SB*" - show only xxxx/SB format
      if (displayGrade.includes('/SB/')) {
        const parts = displayGrade.split('/');
        if (parts.length === 3) {
          // P901BK/SB/18000 -> P901BK/SB
          displayGrade = parts[0] + '/SB';
        }
      } else {
        // For non-SB grades, check if format is xxxx/yyyy/netweight
        const parts = displayGrade.split('/');
        if (parts.length === 3 && !isNaN(parts[2])) {
          // xxxx/yyyy/18000 -> xxxx/yyyy
          displayGrade = parts[0] + '/' + parts[1];
        }
      }
      
      gradeInput.value = displayGrade;
      this.state.formData.grade = displayGrade;
      
      // Extract net weight from ORIGINAL grade (e.g., P901BK/SB/18000 -> 18000)
      const parts = this.selectedGradeData.Grade.split('/');
      const netweight = parts[parts.length - 1];
      
      if (!isNaN(netweight)) {
        document.getElementById('netweight').value = netweight;
        this.state.formData.netweight = netweight;
        
        // 🔄 เปลี่ยน grade → ลบ lot เดิม + สร้าง prefix ใหม่
        this.generateLotOnGradeChange(parseInt(netweight));
      }
      
      // Update title1 and title2
      this.state.formData.title1 = this.selectedGradeData.title1 || 'HDPE';
      this.state.formData.title2 = this.selectedGradeData.title2 || 'HIGH DENSITY POLYETHYLENE';
      
      // 📂 Load grade history if available
      const history = this.loadGradeHistory(displayGrade);
      if (history) {
        // Populate form with historical data
        const lotInput = document.getElementById('lot');
        const fromPageInput = document.getElementById('fromPage');
        const toPageInput = document.getElementById('toPage');
        
        if (lotInput && history.lot) {
          lotInput.value = history.lot;
          this.state.formData.lot = history.lot;
          this.updateLotCounter(history.lot);
        }
        
        if (fromPageInput && history.fromPage) {
          fromPageInput.value = history.fromPage;
          this.state.formData.fromPage = history.fromPage;
        }
        
        if (toPageInput && history.toPage) {
          toPageInput.value = history.toPage;
          this.state.formData.toPage = history.toPage;
        }
        
        console.log(`✨ Auto-filled from grade history: ${displayGrade}`);
      }
      
      console.log('✅ Selected grade:', this.selectedGradeData);
      console.log('📝 Display grade:', displayGrade);
      
      this.saveFormState();
    }
    
    autocompleteList.classList.remove('show');
  }

  /**
   * Auto-generate lot based on net weight
   */
  generateLot(netweight) {
    const lotInput = document.getElementById('lot');
    const currentYear = new Date().getFullYear();
    const twoDigitYear = currentYear.toString().slice(-2);
    
    // Array of netweights that should start with 9
    const lotStartWithNine = [1650, 1800, 16500, 18000];
    
    // SB grades always start with 9
    const isSBGrade = this.state.formData.grade && this.state.formData.grade.includes('/SB/');
    
    let lotPrefix;
    if (isSBGrade || lotStartWithNine.includes(netweight)) {
      lotPrefix = '9' + twoDigitYear;
    } else {
      lotPrefix = netweight.toString().charAt(0) + twoDigitYear;
    }
    
    // If lot is empty or user hasn't customized it, set the prefix
    if (!lotInput.value || lotInput.value.length < 3) {
      lotInput.value = lotPrefix;
      this.state.formData.lot = lotPrefix;
      this.updateLotCounter(lotPrefix);
      this.saveFormState();
    }
  }

  /**
   * Generate lot prefix when grade changes (ลบ lot เดิม + สร้างใหม่)
   */
  generateLotOnGradeChange(netweight) {
    const lotInput = document.getElementById('lot');
    const currentYear = new Date().getFullYear();
    const twoDigitYear = currentYear.toString().slice(-2);
    
    // Array of netweights that should start with 9
    const lotStartWithNine = [1650, 1800, 16500, 18000];
    
    // SB grades always start with 9
    const isSBGrade = this.state.formData.grade && this.state.formData.grade.includes('/SB/');
    
    let lotPrefix;
    if (isSBGrade || lotStartWithNine.includes(netweight)) {
      lotPrefix = '9' + twoDigitYear;
    } else {
      lotPrefix = netweight.toString().charAt(0) + twoDigitYear;
    }
    
    // เปลี่ยน grade → ลบ lot เดิมออก แล้วใส่ prefix ใหม่
    lotInput.value = lotPrefix;
    this.state.formData.lot = lotPrefix;
    this.updateLotCounter(lotPrefix);
    this.saveFormState();
    
    console.log(`🔄 Grade changed → Reset lot to prefix: ${lotPrefix}`);
  }

  /**
   * Validate all fields
   */
  validateAll() {
    const fields = ['grade', 'lot', 'fromPage', 'toPage'];
    let isValid = true;

    fields.forEach(field => {
      const input = document.getElementById(field);
      if (input && !this.validateField(field, input.value)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Show field error
   */
  showFieldError(field, message) {
    const input = document.getElementById(field);
    if (!input) return;

    input.classList.add('error');
    
    let errorDiv = input.parentElement.querySelector('.field-error');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'field-error form-hint';
      errorDiv.style.color = '#e74c3c';
      input.parentElement.appendChild(errorDiv);
    }
    errorDiv.textContent = message;
  }

  /**
   * Remove field error
   */
  removeFieldError(field) {
    const input = document.getElementById(field);
    if (!input) return;

    input.classList.remove('error');
    const errorDiv = input.parentElement.querySelector('.field-error');
    if (errorDiv) errorDiv.remove();
  }

  /**
   * Update lot character counter
   */
  updateLotCounter(value) {
    const counter = document.getElementById('lot-counter');
    if (!counter) return;

    const length = value.length;
    
    if (length === 10) {
      // ครบ 10 ตัว → สีเขียว + เครื่องหมาย ✅
      counter.textContent = `✅ ${length}/10 characters (ครบถ้วน)`;
      counter.style.color = '#28a745'; // เขียว
    } else if (length > 0) {
      // ยังไม่ครบ 10 ตัว → สีแดง
      counter.textContent = `${length}/10 characters`;
      counter.style.color = '#dc3545'; // แดง
    } else {
      // ว่างเปล่า → สีเทา
      counter.textContent = '0/10 characters';
      counter.style.color = '#6c757d'; // เทา
    }
  }

  /**
   * Save grade-specific history to localStorage (unit-specific key)
   */
  saveGradeHistory(grade, formData) {
    if (!grade || grade.trim() === '') return;
    
    const unit = formData.unit || this.state.unit;
    const historyKey = `grade_history_${unit}`; // ใช้ key แยกตาม unit
    let history = {};
    
    try {
      const stored = localStorage.getItem(historyKey);
      if (stored) history = JSON.parse(stored);
    } catch (e) {
      console.warn('Failed to load grade history:', e);
    }
    
    // Store grade-specific data
    history[grade] = {
      lot: formData.lot || '',
      netweight: formData.netweight || '',
      fromPage: formData.fromPage || '',
      toPage: formData.toPage || '',
      controlprint: formData.controlprint || { ft: false, lt: false },
      timestamp: new Date().toISOString()
    };
    
    try {
      localStorage.setItem(historyKey, JSON.stringify(history));
      console.log(`💾 Grade history saved [${unit}]: ${grade}`);
    } catch (e) {
      console.warn('Failed to save grade history:', e);
    }
  }

  /**
   * Load grade-specific history from localStorage (unit-specific key)
   */
  loadGradeHistory(grade) {
    if (!grade || grade.trim() === '') return null;
    
    const historyKey = `grade_history_${this.state.unit}`; // ใช้ key ของ unit ปัจจุบัน
    
    try {
      const stored = localStorage.getItem(historyKey);
      if (!stored) return null;
      
      const history = JSON.parse(stored);
      const gradeData = history[grade];
      
      if (gradeData) {
        console.log(`📂 Loaded history [${this.state.unit}]: ${grade}`);
        return gradeData;
      }
    } catch (e) {
      console.warn('Failed to load grade history:', e);
    }
    
    return null;
  }

  /**
   * Update template selector UI based on current unit
   */
  updateTemplateSelector() {
    const templateSelector = document.querySelector('.template-selector');
    if (!templateSelector) return;
    
    // Get available templates for current unit
    const unitConfig = this.config.units[this.state.unit];
    const availableTemplates = unitConfig?.availableTemplates || ['template1', 'template2', 'template3'];
    
    const templates = [
      { id: 'template1', icon: '📄', name: 'Description Only' },
      { id: 'template2', icon: '📋', name: 'Description + Logos' },
      { id: 'template3', icon: '🎯', name: 'Full Certifications' }
    ];

    // Filter to show only available templates for this unit
    const filteredTemplates = templates.filter(t => availableTemplates.includes(t.id));

    // Re-render template cards
    templateSelector.innerHTML = filteredTemplates.map(template => `
      <div class="template-card ${template.id === this.state.template ? 'active' : ''}" 
           data-template="${template.id}">
        <div class="template-icon">${template.icon}</div>
        <div class="template-name">${template.name}</div>
      </div>
    `).join('');
    
    // Re-attach event listeners to new template cards
    templateSelector.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const template = e.currentTarget.dataset.template;
        this.handleTemplateChange(template);
      });
    });
    
    console.log(`🎨 Template selector updated for ${this.state.unit}: ${availableTemplates.join(', ')}`);
  }

  /**
   * Toggle form collapse state
   */
  toggleCollapse() {
    this.state.isCollapsed = !this.state.isCollapsed;
    const panel = document.querySelector('.form-panel');
    if (panel) {
      panel.classList.toggle('collapsed', this.state.isCollapsed);
    }
  }

  /**
   * Save form state to sessionStorage (including template and theme)
   */
  saveFormState() {
    // Sync from DOM first to ensure we have latest values
    this.syncFromDOM();
    
    // Save complete state including template and theme
    const stateToSave = {
      formData: this.state.formData,
      template: this.state.template,
      theme: this.state.theme
    };
    
    sessionStorage.setItem(
      `form_data_${this.state.unit}`,
      JSON.stringify(stateToSave)
    );
    
    console.log(`💾 Saved state for ${this.state.unit}:`, stateToSave);
  }

  /**
   * Restore form state from state object
   */
  restoreFormState() {
    const data = this.state.formData;
    
    console.log(`🔄 Restoring form state for ${this.state.unit}:`, data);

    // Restore input values
    Object.keys(data).forEach(key => {
      if (key === 'controlprint') return;
      const input = document.getElementById(key);
      if (input) {
        const value = data[key] !== undefined && data[key] !== null ? data[key] : '';
        input.value = value;
        console.log(`  ✓ ${key}: "${value}"`);
      } else {
        console.warn(`  ✗ Input not found: ${key}`);
      }
    });
    
    // Always override Shift with current time-based value
    const shiftInput = document.getElementById('shift');
    if (shiftInput) {
      const currentShift = this.getDefaultShift();
      shiftInput.value = currentShift;
      this.state.formData.shift = currentShift; // Update state too
      console.log(`⏰ Shift auto-updated to: ${currentShift}`);
    }

    // Restore checkboxes
    if (data.controlprint) {
      Object.keys(data.controlprint).forEach(key => {
        const checkbox = document.getElementById(key);
        if (checkbox) {
          checkbox.checked = data.controlprint[key];
          console.log(`  ✓ Checkbox ${key}: ${data.controlprint[key]}`);
        }
      });
    }

    // Update lot counter after restoring
    if (data.lot) {
      this.updateLotCounter(data.lot);
    } else {
      this.updateLotCounter(''); // Reset counter if no lot
    }
    
    console.log(`📋 Form state restored for ${this.state.unit}`, data);
  }

  /**
   * Clear form
   */
  clearForm() {
    this.state.formData = {
      grade: '',
      netweight: '',
      lot: '',
      fromPage: '1',
      toPage: '1',
      shift: this.getDefaultShift(),
      idate: new Date().getDate().toString(),
      controlprint: { ft: false, lt: false }
    };

    this.restoreFormState();
    this.state.errors = {};
    
    // Remove all error displays
    document.querySelectorAll('.field-error').forEach(el => el.remove());
    document.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
    
    // Clear selected grade data
    this.selectedGradeData = null;
    
    this.saveFormState();
    this.notifyListeners('formClear');
  }

  /**
   * Get form data
   */
  getFormData() {
    // Sync from DOM to ensure we have latest values
    this.syncFromDOM();
    
    return {
      ...this.state.formData,
      unit: this.state.unit,
      theme: this.state.theme,
      template: this.state.template,
      // Include selected grade data if available
      title1: this.selectedGradeData?.title1 || this.state.formData.title1 || 'HDPE',
      title2: this.selectedGradeData?.title2 || this.state.formData.title2 || 'HIGH DENSITY POLYETHYLENE',
      sirim_title1: this.selectedGradeData?.sirim_title1 || this.state.formData.sirim_title1 || 'Certified to MS1058 : PART 1 : 2005',
      sirim_title2: this.selectedGradeData?.sirim_title2 || this.state.formData.sirim_title2 || 'Certified No. : PC004152',
      sirim_title3: this.selectedGradeData?.sirim_title3 || this.state.formData.sirim_title3 || 'Designation : PE100',
      tis: this.selectedGradeData?.tis || this.state.formData.tis || 'Y'
    };
  }
  
  /**
   * Sync form data from DOM inputs
   */
  syncFromDOM() {
    const fields = ['grade', 'netweight', 'lot', 'fromPage', 'toPage', 'shift', 'idate'];
    
    fields.forEach(field => {
      const input = document.getElementById(field);
      if (input && input.value !== undefined) {
        this.state.formData[field] = input.value;
      }
    });
    
    // Sync checkboxes
    const ftCheckbox = document.getElementById('ft');
    const ltCheckbox = document.getElementById('lt');
    if (ftCheckbox && ltCheckbox) {
      this.state.formData.controlprint = {
        ft: ftCheckbox.checked,
        lt: ltCheckbox.checked
      };
    }
  }

  /**
   * Subscribe to form changes
   */
  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  /**
   * Notify all listeners
   */
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      callback({ event, data, formData: this.getFormData() });
    });
  }

  /**
   * Render the form component HTML
   */
  render() {
    return `
      <div class="form-panel" id="formPanel">
        <div class="form-header">
          <h2>📝 ฟอร์มข้อมูลการพิมพ์</h2>
          <button class="collapse-btn">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>
        </div>
        
        <div class="form-content">
          ${this.renderUnitSelector()}
          ${this.renderThemeSelector()}
          ${this.renderTemplateSelector()}
          ${this.renderFormFields()}
          ${this.renderPrintControls()}
          ${this.renderActionButtons()}
        </div>
      </div>
    `;
  }

  renderUnitSelector() {
    const units = Object.keys(this.config.units);
    return `
      <div class="unit-selector">
        ${units.map(unit => `
          <button class="unit-btn ${unit === this.state.unit ? 'active' : ''}" 
                  data-unit="${unit}">
            ${this.config.units[unit].name}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderThemeSelector() {
    const themes = ['blue', 'green', 'pink', 'purple', 'dark'];
    return `
      <div class="theme-selector">
        <label class="section-label">🎨 Theme:</label>
        ${themes.map(theme => `
          <button class="theme-btn ${theme} ${theme === this.state.theme ? 'active' : ''}" 
                  data-theme="${theme}"
                  title="${theme.charAt(0).toUpperCase() + theme.slice(1)}">
          </button>
        `).join('')}
      </div>
    `;
  }

  renderTemplateSelector() {
    // Get available templates for current unit
    const unitConfig = this.config.units[this.state.unit];
    const availableTemplates = unitConfig?.availableTemplates || ['template1', 'template2', 'template3'];
    
    const templates = [
      { id: 'template1', icon: '📄', name: 'Description Only' },
      { id: 'template2', icon: '📋', name: 'Description + Logos' },
      { id: 'template3', icon: '🎯', name: 'Full Certifications' }
    ];

    // Filter to show only available templates for this unit
    const filteredTemplates = templates.filter(t => availableTemplates.includes(t.id));

    return `
      <div class="template-selector">
        ${filteredTemplates.map(template => `
          <div class="template-card ${template.id === this.state.template ? 'active' : ''}" 
               data-template="${template.id}">
            <div class="template-icon">${template.icon}</div>
            <div class="template-name">${template.name}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  renderFormFields() {
    return `
      <div class="form-grid">
        <div class="form-group">
          <label for="grade">Grade <span class="required">*</span></label>
          <div class="autocomplete-wrapper">
            <input type="text" id="grade" class="form-input" 
                   placeholder="Type to search Grade..." autocomplete="off">
            <div id="gradeAutocomplete" class="autocomplete-list"></div>
          </div>
        </div>

        <div class="form-group">
          <label for="netweight">Net Weight (KG.) <span class="required">*</span></label>
          <input type="text" id="netweight" class="form-input" 
                 placeholder="18000" readonly>
        </div>

        <div class="form-group">
          <label for="lot">Lot <span class="required">*</span></label>
          <input type="text" id="lot" class="form-input" 
                 placeholder="9258554555" maxlength="10">
          <small id="lot-counter" class="form-hint">0/10 characters</small>
        </div>

        <div class="form-group">
          <label for="fromPage">From Page <span class="required">*</span></label>
          <input type="number" id="fromPage" class="form-input" 
                 placeholder="1" min="1" value="1">
        </div>

        <div class="form-group">
          <label for="toPage">To Page <span class="required">*</span></label>
          <input type="number" id="toPage" class="form-input" 
                 placeholder="3" min="1" value="3">
        </div>

        <div class="form-group">
          <label for="shift">Shift <span class="required">*</span></label>
          <select id="shift" class="form-input">
            <option value="M">M (Morning)</option>
            <option value="E">E (Evening)</option>
            <option value="N">N (Night)</option>
          </select>
        </div>

        <div class="form-group">
          <label for="idate">Date <span class="required">*</span></label>
          <select id="idate" class="form-input"></select>
        </div>
      </div>
    `;
  }

  renderPrintControls() {
    return `
      <div class="print-controls">
        <label class="section-label">Print Controls:</label>
        <div class="checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" id="ft">
            <span>FT (First Tag)</span>
          </label>
          <label class="checkbox-label">
            <input type="checkbox" id="lt">
            <span>LT (Last Tag)</span>
          </label>
        </div>
        <small class="form-hint" style="margin-top: 8px; display: block;">
          💡 Logos display according to selected Template
        </small>
      </div>
    `;
  }

  renderActionButtons() {
    return `
      <div class="action-buttons">
        <button class="btn btn-primary" id="generateBtn">
          ✅ Generate Preview
        </button>
        <button class="btn btn-secondary" id="clearBtn">
          🔄 Clear Form
        </button>
      </div>
    `;
  }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FormComponent;
}
