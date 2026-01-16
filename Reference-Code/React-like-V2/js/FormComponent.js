/**
 * Form Component - React-like component for handling form input
 * Manages state, validation, and user interactions
 */

export class FormComponent {
  constructor(config) {
    this.config = config;
    this.containerSelector = config.containerSelector || 'body'; // Allow scoped queries
    
    console.log('🔍 FormComponent constructor - config.defaultUnit:', config.defaultUnit);
    
    // Initialize state without calling getInitialFormData first
    this.state = {
      unit: config.defaultUnit || 'HDPE',
      theme: 'purple', // Fixed theme - always purple
      template: config.defaultTemplate || 'template3',
      formData: {},
      errors: {},
      isCollapsed: false
    };
    
    console.log('🔍 FormComponent state.unit:', this.state.unit);
    
    // Now get initial form data after state is initialized
    this.state.formData = this.getInitialFormData();
    
    // Grade autocomplete data
    this.allGrades = [];
    this.selectedGradeData = null;
    this.isAutocompleteSelection = false;
    this.loadGradeData();
    
    this.listeners = [];
  }

  /**
   * Load grade data from unitConfig.js - unified format for all units
   */
  loadGradeData() {
    this.allGrades = [];
    
    // Generate expanded grade list from all units using netweightArray
    Object.keys(this.config.units).forEach(unitKey => {
      const unit = this.config.units[unitKey];
      
      if (unit.gradeData) {
        unit.gradeData.forEach(gradeItem => {
          // For HDPE (no status property) or active grades (status: true)
          if (gradeItem.netweightArray && (gradeItem.status !== false)) {
            gradeItem.netweightArray.forEach(netweight => {
              let gradeDisplay;
              
              // Extract base grade name (remove existing /netweight if present)
              let baseGrade = gradeItem.grade;
              if (baseGrade.includes('/')) {
                // Handle cases like "P901BK/SB/18000" or "P921BK/750"
                const parts = baseGrade.split('/');
                if (parts.length === 3 && parts[1] === 'SB') {
                  baseGrade = parts[0]; // P901BK/SB/18000 -> P901BK
                } else if (parts.length === 2 && !isNaN(parts[1])) {
                  baseGrade = parts[0]; // P921BK/750 -> P921BK
                }
              }
              
              // Generate display format
              if (netweight > 1000) {
                gradeDisplay = `${baseGrade}/SB/${netweight}`;
              } else {
                gradeDisplay = `${baseGrade}/${netweight}`;
              }
              
              this.allGrades.push({
                Grade: gradeDisplay,
                originalGrade: baseGrade,
                netweight: netweight.toString(),
                description: gradeItem.description,
                unit: unitKey,
                title1: unit.defaults?.title1 || unitKey,
                title2: unit.defaults?.title2 || unit.fullName
              });
            });
          }
        });
      }
    });
    
    console.log(`📊 Generated ${this.allGrades.length} grade variants for autocomplete from unitConfig.js`);
  }

  /**
   * Get initial form data from Grade History or unit defaults
   */
  getInitialFormData() {
    console.log(`🔍 Getting initial form data for unit: ${this.state.unit}`);
    
    // Try to get last used grade from Grade History for this unit
    const lastGrade = this.getLastUsedGrade(this.state.unit);
    
    if (lastGrade) {
      console.log(`📂 Loaded last grade data for ${this.state.unit}:`, lastGrade);
      // ✅ Use history data as-is (already formatted correctly)
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
    console.log(`🔍 Unit config for ${this.state.unit}:`, unitConfig);
    
    const defaults = unitConfig?.defaults || {};
    
    console.log(`📝 No grade history for ${this.state.unit}, using unit defaults:`, defaults);
    
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
      console.log(`🔢 Generated lot prefix from init: ${lotPrefix} (netweight: ${netweight}, year: ${twoDigitYear})`);
    }
    
    // 🔧 Format grade based on netweight (ONLY for defaults, not history)
    let formattedGrade = defaults.grade || '';
    const netweightNum = parseInt(defaults.netweight);
    
    if (formattedGrade && !isNaN(netweightNum)) {
      // Check if grade already includes netweight format
      if (!formattedGrade.includes('/')) {
        // Grade doesn't have format yet, need to add
        if (netweightNum >= 16000) {
          // Big bag: P901BK/SB (without number)
          formattedGrade = `${formattedGrade}/SB`;
        } else {
          // Small bag: P901BK/750 (with number)
          formattedGrade = `${formattedGrade}/${defaults.netweight}`;
        }
        console.log(`🎯 Formatted grade: "${defaults.grade}" -> "${formattedGrade}"`);
      } else {
        // Grade already has format (e.g., "P901BK/SB" or "P901BK/750")
        // Check if it needs cleanup (e.g., "P901BK/SB/18000" -> "P901BK/SB")
        const parts = formattedGrade.split('/');
        if (parts.length === 3 && parts[1] === 'SB') {
          // Has format "P901BK/SB/18000" -> keep only "P901BK/SB"
          formattedGrade = `${parts[0]}/SB`;
          console.log(`🧹 Cleaned SB grade: "${defaults.grade}" -> "${formattedGrade}"`);
        }
      }
    }
    
    const initData = {
      grade: formattedGrade,
      netweight: defaults.netweight || '',
      lot: lotPrefix,
      fromPage: '1',
      toPage: '1',
      shift: this.getDefaultShift(),
      idate: new Date().getDate().toString(),
      controlprint: { ft: false, lt: false }
    };
    
    console.log(`✅ Initial form data:`, initData);
    
    return initData;
  }
  
  /**
   * Get last used grade for a specific unit from Grade History
   * @param {string} unit - Unit name (HDPE, PP, PPC)
   * @returns {object|null} Last used grade data or null
   */
  getLastUsedGrade(unit) {
    try {
      const historyKey = `grade_history_${unit}`;
      console.log(`🔍 Looking for localStorage key: ${historyKey}`);
      
      const stored = localStorage.getItem(historyKey);
      if (!stored) {
        console.log(`📭 No grade history found for ${unit}`);
        return null;
      }
      
      console.log(`📦 Raw localStorage data for ${unit}:`, stored);
      const history = JSON.parse(stored);
      console.log(`📊 Parsed history:`, history);
      
      // Find the most recent grade from this unit's history
      let lastGrade = null;
      let lastTimestamp = null;
      
      Object.keys(history).forEach(gradeKey => {
        const data = history[gradeKey];
        const timestamp = new Date(data.timestamp);
        
        console.log(`  - Grade Key: ${gradeKey}, Timestamp: ${timestamp}`);
        
        if (!lastTimestamp || timestamp > lastTimestamp) {
          lastTimestamp = timestamp;
          
          // ✅ Use full grade format from history
          // Grade history already stores correctly formatted grades:
          // - "1102H/750", "P901BK/SB", etc.
          lastGrade = { 
            grade: gradeKey,  // Use full grade with netweight format
            ...data 
          };
        }
      });
      
      console.log(`✅ Most recent grade for ${unit}:`, lastGrade);
      return lastGrade;
    } catch (e) {
      console.warn('❌ Failed to get last used grade:', e);
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
    
    // Clear old sessionStorage data (cleanup)
    sessionStorage.removeItem(`form_data_${this.state.unit}`);
    console.log(`🧹 Cleared old sessionStorage for ${this.state.unit}`);
    
    // Wait for DOM to be fully ready and populated
    setTimeout(() => {
      // Verify grade input exists before restoring
      const gradeInput = document.getElementById('grade');
      if (!gradeInput) {
        console.error('❌ Grade input not found! Cannot restore form state.');
        return;
      }
      
      this.restoreFormState();
      
      // Save initial state to sessionStorage
      this.saveFormState();
      console.log(`💾 Saved initial state for ${this.state.unit}`);
    }, 100); // Increased delay to ensure DOM is ready
  }

  /**
   * Set form data programmatically
   */
  setFormData(formData) {
    if (!formData) return;
    
    Object.keys(formData).forEach(key => {
      const input = document.getElementById(key);
      if (input) {
        if (input.type === 'checkbox') {
          input.checked = formData[key];
        } else {
          input.value = formData[key];
        }
      }
    });
    
    this.state.formData = { ...this.state.formData, ...formData };
    this.saveFormState();
  }

  /**
   * Get form data
   */
  getFormData() {
    return this.state.formData;
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

    // Template cards
    document.querySelectorAll('.template-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const template = e.currentTarget.dataset.template;
        this.handleTemplateChange(template);
      });
    });

    // Form inputs - เพิ่ม netweight เข้าไปด้วย (แต่ไม่รวม grade เพราะมี handler พิเศษ)
    ['netweight', 'lot', 'fromPage', 'toPage', 'shift', 'idate'].forEach(field => {
      const input = document.getElementById(field);
      if (input) {
        input.addEventListener('input', (e) => this.handleInputChange(field, e.target.value));
        input.addEventListener('blur', (e) => this.validateField(field, e.target.value));
      }
    });
    
    // Grade input - special handling with autocomplete
    const gradeInput = document.getElementById('grade');
    if (gradeInput) {
      // Use handleGradeInput for both input event and autocomplete
      gradeInput.addEventListener('input', (e) => {
        // Convert to uppercase
        const upperValue = e.target.value.toUpperCase();
        e.target.value = upperValue;
        
        this.handleGradeInput(upperValue);
        // Also update state
        this.state.formData.grade = upperValue;
      });
      
      gradeInput.addEventListener('blur', (e) => this.validateField('grade', e.target.value));
      
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

    // Get container reference
    const container = document.querySelector(this.containerSelector);
    if (!container) {
      console.warn(`⚠️ Container not found: ${this.containerSelector}`);
      return;
    }

    // Print button
    const printBtn = container.querySelector('#printBtn');
    if (printBtn) {
      printBtn.addEventListener('click', () => this.handlePrint());
    }

    // Help button
    const helpBtn = container.querySelector('#helpBtn');
    if (helpBtn) {
      helpBtn.addEventListener('click', () => this.showHelp());
    }

    // Close button
    const closeBtn = container.querySelector('#closeFormBtn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.handleClose());
    }

    // Collapse button
    const collapseBtn = container.querySelector('.collapse-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', () => this.toggleCollapse());
    }
  }

  /**
   * Handle unit change (HDPE, PP, PPC)
   */
  handleUnitChange(unit) {
    console.log(`🔄 Unit change requested: ${unit}`);
    
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
    
    // Change to new unit (normalize to uppercase for config lookup)
    this.state.unit = unit.toUpperCase();
    
    // 🔄 Load from grade history FIRST (most recent data)
    const lastGrade = this.getLastUsedGrade(this.state.unit);
    
    if (lastGrade) {
      console.log(`📂 Loading from grade history for ${this.state.unit}:`, lastGrade);
      this.state.formData = {
        grade: lastGrade.grade || '',
        netweight: lastGrade.netweight || '',
        lot: lastGrade.lot || '',
        fromPage: lastGrade.fromPage || '1',
        toPage: lastGrade.toPage || '1',
        shift: this.getDefaultShift(),
        idate: new Date().getDate().toString(),
        controlprint: lastGrade.controlprint || { ft: false, lt: false }
      };
      
      // 🔍 Populate selectedGradeData from loaded grade for autocomplete
      if (lastGrade.grade && lastGrade.netweight) {
        this.selectedGradeData = this.allGrades.find(g => 
          g.Grade === lastGrade.grade && 
          g.netweight === lastGrade.netweight &&
          g.unit === this.state.unit
        );
        if (this.selectedGradeData) {
          console.log(`✅ Found matching grade data for autocomplete:`, this.selectedGradeData);
        } else {
          console.log(`⚠️ Grade "${lastGrade.grade}" not found in allGrades for unit ${this.state.unit}`);
        }
      }
    } else {
      // No grade history - use unit defaults
      this.state.formData = this.getInitialFormData();
      console.log(`📝 No history, loaded defaults for ${this.state.unit}`);
      
      // Try to populate selectedGradeData from defaults
      const unitConfig = this.config.units[unit];
      const defaultGrade = unitConfig?.defaults?.grade;
      const defaultNetweight = unitConfig?.defaults?.netweight;
      
      if (defaultGrade && defaultNetweight) {
        this.selectedGradeData = this.allGrades.find(g => 
          g.Grade.includes(defaultGrade) && 
          g.netweight === defaultNetweight &&
          g.unit === this.state.unit
        );
        if (this.selectedGradeData) {
          console.log(`✅ Found default grade data for autocomplete:`, this.selectedGradeData);
        }
      }
    }
    
    // Update UI buttons
    document.querySelectorAll('.unit-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.unit === this.state.unit.toLowerCase());
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
    
    console.log(`🔄 Switched to unit: ${this.state.unit} (template: ${this.state.template})`);
    
    // Notify listeners
    this.notifyListeners('unitChange', this.state.unit);
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
    
    // Reset lot when typing grade manually (not from autocomplete)
    if (field === 'grade') {
      // Check if this is manual typing or autocomplete selection
      if (!this.isAutocompleteSelection) {
        // Manual typing - reset lot and netweight
        const lotInput = document.getElementById('lot');
        const netweightInput = document.getElementById('netweight');
        
        if (lotInput) {
          lotInput.value = '';
          this.state.formData.lot = '';
          this.updateLotCounter('');
        }
        
        if (netweightInput) {
          netweightInput.value = '';
          this.state.formData.netweight = '';
        }
      }
      this.isAutocompleteSelection = false; // Reset flag
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
        return true;
      } else {
        this.state.errors[field] = result;
        this.showFieldError(field, result);
        return false;
      }
    }

    return true; // If no validator, consider it valid
  }

  /**
   * Handle grade input autocomplete
   */
  handleGradeInput(value) {
    console.log(`🔤 handleGradeInput called: value="${value}", flag=${this.isAutocompleteSelection}`);
    
    const autocompleteList = document.getElementById('gradeAutocomplete');
    
    // Reset autocomplete selection flag when user types manually
    this.isAutocompleteSelection = false;
    
    if (!value || value.length < 1) {
      if (autocompleteList) {
        autocompleteList.classList.remove('show');
        autocompleteList.style.display = 'none';
        autocompleteList.innerHTML = '';
        console.log(`  🚫 Value empty - hiding autocomplete`);
      }
      return;
    }
    
    // Filter grades for current unit only
    const searchTerm = value.toLowerCase();
    console.log(`  📋 allGrades count: ${this.allGrades?.length || 0}, current unit: ${this.state.unit}`);
    
    const matches = this.allGrades.filter(g => 
      g.unit === this.state.unit && g.Grade.toLowerCase().includes(searchTerm)
    ).slice(0, 5); // Limit to 5 results
    
    console.log(`  🔍 Found ${matches.length} matches for "${value}" in unit ${this.state.unit}`);
    
    if (matches.length === 0) {
      if (autocompleteList) {
        autocompleteList.innerHTML = '<div class="autocomplete-no-result">ไม่พบผลลัพธ์</div>';
        autocompleteList.classList.add('show');
      }
      return;
    }
    
    // Render autocomplete items
    if (autocompleteList) {
      console.log(`  ✅ autocompleteList element found:`, autocompleteList);
      
      autocompleteList.innerHTML = matches.map((grade, index) => {
        const highlighted = grade.Grade.replace(
          new RegExp(value, 'gi'), 
          match => `<strong>${match}</strong>`
        );
        return `<div class="autocomplete-item" data-grade="${grade.Grade}" onclick="formComponent.selectGrade('${grade.Grade}')">${highlighted}</div>`;
      }).join('');
      
      console.log(`  📝 Set innerHTML with ${matches.length} items`);
      console.log(`  👁️ Display style before: ${autocompleteList.style.display}`);
      
      autocompleteList.classList.add('show');
      autocompleteList.style.display = 'block'; // Force display
      
      console.log(`  ✨ Added 'show' class and set display:block`);
      console.log(`  👁️ Display style after: ${autocompleteList.style.display}`);
      console.log(`  📋 Classes: ${autocompleteList.className}`);
    } else {
      console.error(`  ❌ autocompleteList element NOT FOUND!`);
    }
  }

  /**
   * Select grade from autocomplete
   */
  selectGrade(gradeName) {
    const gradeInput = document.getElementById('grade');
    const autocompleteList = document.getElementById('gradeAutocomplete');
    
    // Set flag to prevent reset in handleInputChange
    this.isAutocompleteSelection = true;
    
    // Find full grade data
    this.selectedGradeData = this.allGrades.find(g => g.Grade === gradeName);
    
    if (this.selectedGradeData) {
      let displayGrade = this.selectedGradeData.Grade;
      const netweight = parseInt(this.selectedGradeData.netweight);
      
      console.log(`🔍 Selected grade from autocomplete: "${displayGrade}" (netweight: ${netweight})`);
      
      // 🎯 Format grade based on netweight:
      // - netweight >= 16000: "P901BK/SB" (without number)
      // - netweight < 16000: "P901BK/750" (with number)
      
      if (displayGrade.includes('/SB/')) {
        // Format: "P901BK/SB/18000" -> "P901BK/SB"
        const parts = displayGrade.split('/');
        if (parts.length === 3 && parts[1] === 'SB') {
          displayGrade = `${parts[0]}/SB`;
          console.log(`  ✂️ Trimmed SB grade: "${this.selectedGradeData.Grade}" -> "${displayGrade}"`);
        }
      } else if (netweight >= 16000) {
        // Big bag but not SB format yet: "P901BK/18000" -> "P901BK/SB"
        const parts = displayGrade.split('/');
        displayGrade = `${parts[0]}/SB`;
        console.log(`  🔄 Converted to SB format: "${this.selectedGradeData.Grade}" -> "${displayGrade}"`);
      } else {
        // Small bag: keep format "P901BK/750" or just base name
        const parts = displayGrade.split('/');
        if (parts.length >= 2 && !isNaN(parts[parts.length - 1])) {
          // Has number at end: "P901BK/750" or "P901BK/XX/750"
          displayGrade = `${parts[0]}/${parts[parts.length - 1]}`;
          console.log(`  ✅ Small bag format: "${this.selectedGradeData.Grade}" -> "${displayGrade}"`);
        }
      }
      
      gradeInput.value = displayGrade;
      this.state.formData.grade = displayGrade;
      
      // Set netweight from selectedGradeData
      if (netweight) {
        document.getElementById('netweight').value = netweight;
        this.state.formData.netweight = netweight.toString();
        
        // 🔄 เปลี่ยน grade → ลบ lot เดิม + สร้าง prefix ใหม่
        this.generateLotOnGradeChange(netweight);
      }
      
      // Update title1 and title2 from selectedGradeData or use unit defaults
      this.state.formData.title1 = this.selectedGradeData.title1 || this.config.units[this.state.unit]?.defaults?.title1 || this.state.unit;
      this.state.formData.title2 = this.selectedGradeData.title2 || this.config.units[this.state.unit]?.defaults?.title2 || this.config.units[this.state.unit]?.fullName;
      
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
    
    // Hide autocomplete list
    if (autocompleteList) {
      autocompleteList.classList.remove('show');
      autocompleteList.innerHTML = '';
      autocompleteList.style.display = 'none';
    }
    
    // Reset flag after a delay
    setTimeout(() => {
      this.isAutocompleteSelection = false;
    }, 100);
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
    
    // Clear previous errors
    this.state.errors = {};

    fields.forEach(field => {
      const input = document.getElementById(field);
      if (input) {
        const fieldValid = this.validateField(field, input.value);
        if (!fieldValid) {
          isValid = false;
        }
      }
    });

    console.log('🔍 Validation result:', isValid, 'Errors:', this.state.errors);
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
    console.log('🔍 saveGradeHistory called:', { grade, formData });
    
    if (!grade || grade.trim() === '') {
      console.warn('⚠️ Grade is empty, skipping save');
      return;
    }
    
    const unit = formData.unit || this.state.unit;
    const historyKey = `grade_history_${unit}`; // ใช้ key แยกตาม unit
    
    console.log(`📝 Saving to key: ${historyKey}`);
    
    let history = {};
    
    try {
      const stored = localStorage.getItem(historyKey);
      if (stored) {
        history = JSON.parse(stored);
        console.log(`📦 Existing history:`, history);
      } else {
        console.log(`📭 No existing history for ${unit}`);
      }
    } catch (e) {
      console.warn('Failed to load grade history:', e);
    }
    
    // Store grade-specific data
    const gradeData = {
      lot: formData.lot || '',
      netweight: formData.netweight || '',
      fromPage: formData.fromPage || '',
      toPage: formData.toPage || '',
      controlprint: formData.controlprint || { ft: false, lt: false },
      timestamp: new Date().toISOString()
    };
    
    history[grade] = gradeData;
    
    console.log(`✏️ Updated history with grade "${grade}":`, history);
    
    try {
      localStorage.setItem(historyKey, JSON.stringify(history));
      console.log(`💾 Grade history saved [${unit}]: ${grade}`);
      console.log(`📊 Total grades in ${unit}:`, Object.keys(history).length);
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
      { id: 'template1', icon: '📄', name: 'Description<br>Only' },
      { id: 'template2', icon: '📋', name: 'Description +<br>Logos' },
      { id: 'template3', icon: '🎯', name: 'Full<br>Certifications' }
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
   * Handle close button click
   */
  handleClose() {
    const formContainer = document.querySelector(this.containerSelector);
    if (formContainer) {
      formContainer.style.transform = 'translateX(100%)';
      
      // Update navbar button state - detect which form this is
      if (this.containerSelector.includes('noneMfg')) {
        // This is Form2
        const navBtn2 = document.getElementById('navFormBtn2');
        if (navBtn2) navBtn2.classList.remove('active');
      } else {
        // This is Form1
        const navBtn1 = document.getElementById('navFormBtn1');
        if (navBtn1) navBtn1.classList.remove('active');
      }
    }
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
   * Handle print button click
   * Opens print dialog directly (Ctrl+P)
   */
  handlePrint() {
    try {
      // Check if preview exists
      const printArea = document.getElementById('printArea');
      if (!printArea || !printArea.querySelector('.sheet')) {
        alert('กรุณา Generate Preview ก่อนพิมพ์');
        return;
      }
      
      // Trigger print dialog directly
      window.print();
      
      console.log('🖨️ Print dialog opened');
    } catch (error) {
      console.error('❌ Print failed:', error);
      alert('ไม่สามารถเปิดหน้าต่างพิมพ์ได้: ' + error.message);
    }
  }

  /**
   * Show help panel
   * Toggles help panel visibility (V1 style)
   */
  showHelp() {
    const helpPanel = document.getElementById('helpPanel');
    if (helpPanel) {
      helpPanel.classList.toggle('hidden');
      console.log('❓ Help panel toggled');
    } else {
      console.warn('⚠️ Help panel not found');
    }
  }

  /**
   * Save form state to sessionStorage (including template and theme)
   */
  saveFormState() {
    // Sync from DOM first to ensure we have latest values
    this.syncFromDOM();
    
    // Clean formData - keep only necessary fields
    const cleanFormData = {
      grade: this.state.formData.grade || '',
      netweight: this.state.formData.netweight || '',
      lot: this.state.formData.lot || '',
      fromPage: this.state.formData.fromPage || '1',
      toPage: this.state.formData.toPage || '1',
      shift: this.state.formData.shift || 'M',
      idate: this.state.formData.idate || new Date().getDate().toString(),
      controlprint: this.state.formData.controlprint || { ft: false, lt: false }
    };
    
    // Save complete state including template and theme
    const stateToSave = {
      formData: cleanFormData,
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
   * Switch to different unit and reload its history
   */
  switchUnit(newUnit) {
    console.log(`🔄 Switching unit from ${this.state.unit} to ${newUnit}`);
    
    // Save current form state before switching
    this.saveFormState();
    
    // Update state
    this.state.unit = newUnit;
    
    // Reload form data from new unit's history or defaults
    this.state.formData = this.getInitialFormData();
    
    // Reload grade data for autocomplete
    this.loadGradeData();
    
    // Restore form UI with new unit's data
    setTimeout(() => {
      this.restoreFormState();
      this.saveFormState();
      console.log(`✅ Switched to ${newUnit} and loaded history`);
    }, 50);
    
    this.notifyListeners('unitSwitch', { unit: newUnit });
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
          <h2>ฟอร์มข้อมูลการพิมพ์</h2>
          <div class="header-buttons">
            <button class="collapse-btn">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
              </svg>
            </button>
            <button class="close-btn" id="closeFormBtn" title="ปิดฟอร์ม">
              ✕
            </button>
          </div>
        </div>
        
        <div class="form-content">
          ${this.renderUnitSelector()}
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
        <label class="section-label">Unit Selection:</label>
        <div class="unit-buttons">
        ${units.map(unit => {
          const unitConfig = this.config.units[unit];
          const isActive = unit.toLowerCase() === this.state.unit.toLowerCase();
          return `
            <button class="unit-btn ${isActive ? 'active' : ''}" 
                    data-unit="${unit.toLowerCase()}">
              ${unit}
            </button>
          `;
        }).join('')}
        </div>
      </div>
    `;
  }

  renderTemplateSelector() {
    // Get available templates for current unit
    const unitConfig = this.config.units[this.state.unit];
    const availableTemplates = unitConfig?.availableTemplates || ['template1', 'template2', 'template3'];
    
    const templates = [
      { id: 'template1', icon: '📄', name: 'Description<br>Only' },
      { id: 'template2', icon: '📋', name: 'Description +<br>Logos' },
      { id: 'template3', icon: '🎯', name: 'Full<br>Certifications' }
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
      
      <div class="icon-buttons">
        <button class="icon-btn print-btn" id="printBtn" title="พิมพ์ป้าย">
          🖨️
        </button>
        <button class="icon-btn help-btn" id="helpBtn" title="คำแนะนำ">
          ❓
        </button>
      </div>
    `;
  }
}
