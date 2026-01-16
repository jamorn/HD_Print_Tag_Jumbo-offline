/**
 * FormComponentNoneMfg - Simplified Form for None Manufacturing Mode
 * Used with green button ⚡
 * - Fixed Template 1 only
 * - No Print Controls (FT/LT)
 * - Separate localStorage: grade_history_noneMfg_{unit}
 */

import { FormComponent } from './FormComponent.js';

export class FormComponentNoneMfg extends FormComponent {
  constructor(options = {}) {
    // Force template1 and override localStorage prefix
    super({
      ...options,
      defaultTemplate: 'template1',
      storagePrefix: 'noneMfg' // Will create grade_history_noneMfg_{unit}
    });
    
    this.isNoneMfgMode = true;
  }

  /**
   * Override: Use noneMfg prefix for localStorage
   */
  getLastUsedGrade(unit) {
    try {
      const historyKey = `grade_history_noneMfg_${unit}`;
      console.log(`🔍 [NoneMfg] Looking for localStorage key: ${historyKey}`);
      
      const stored = localStorage.getItem(historyKey);
      if (!stored) {
        console.log(`📭 [NoneMfg] No grade history found for ${unit}`);
        return null;
      }
      
      const history = JSON.parse(stored);
      let lastGrade = null;
      let lastTimestamp = null;
      
      Object.keys(history).forEach(gradeKey => {
        const data = history[gradeKey];
        const timestamp = new Date(data.timestamp);
        
        if (!lastTimestamp || timestamp > lastTimestamp) {
          lastTimestamp = timestamp;
          lastGrade = { 
            grade: gradeKey,
            ...data 
          };
        }
      });
      
      console.log(`✅ [NoneMfg] Most recent grade for ${unit}:`, lastGrade);
      return lastGrade;
    } catch (e) {
      console.warn('❌ [NoneMfg] Failed to get last used grade:', e);
      return null;
    }
  }

  /**
   * Override: Get initial form data (with defaults fallback)
   */
  getInitialFormData() {
    console.log(`🔍 [NoneMfg] Getting initial form data for unit: ${this.state.unit}`);
    
    // Try to get last used grade from NoneMfg history
    const lastGrade = this.getLastUsedGrade(this.state.unit);
    
    if (lastGrade) {
      console.log(`📂 [NoneMfg] Loaded last grade data:`, lastGrade);
      return {
        grade: lastGrade.grade || '',
        netweight: lastGrade.netweight || '',
        lot: lastGrade.lot || '',
        fromPage: lastGrade.fromPage || '1',
        toPage: lastGrade.toPage || '1',
        shift: this.getDefaultShift(),
        idate: new Date().getDate().toString(),
        controlprint: { ft: false, lt: false }
      };
    }
    
    // No history → Use UnitConfig defaults
    const unitConfig = this.config.units[this.state.unit];
    const defaults = unitConfig?.defaults || {};
    
    console.log(`📝 [NoneMfg] No history, using unit defaults:`, defaults);
    
    // Generate lot prefix from defaults
    let lotPrefix = '';
    if (defaults.netweight) {
      const netweight = parseInt(defaults.netweight);
      const currentYear = new Date().getFullYear();
      const twoDigitYear = currentYear.toString().slice(-2);
      const lotStartWithNine = [1650, 1800, 16500, 18000];
      const isSBGrade = defaults.grade && defaults.grade.includes('/SB/');
      
      if (isSBGrade || lotStartWithNine.includes(netweight)) {
        lotPrefix = '9' + twoDigitYear;
      } else {
        lotPrefix = netweight.toString().charAt(0) + twoDigitYear;
      }
    }
    
    // Format grade based on netweight
    let formattedGrade = defaults.grade || '';
    const netweightNum = parseInt(defaults.netweight);
    
    if (formattedGrade && !isNaN(netweightNum)) {
      if (!formattedGrade.includes('/')) {
        if (netweightNum >= 16000) {
          formattedGrade = `${formattedGrade}/SB`;
        } else {
          formattedGrade = `${formattedGrade}/${defaults.netweight}`;
        }
      }
    }
    
    return {
      grade: formattedGrade,
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
   * Override: Save to noneMfg localStorage
   */
  saveGradeHistory(grade, formData) {
    try {
      const unit = this.state.currentUnit;
      const historyKey = `grade_history_noneMfg_${unit}`;
      
      let history = {};
      const stored = localStorage.getItem(historyKey);
      if (stored) {
        history = JSON.parse(stored);
      }
      
      history[grade] = {
        ...formData,
        timestamp: new Date().toISOString()
      };
      
      localStorage.setItem(historyKey, JSON.stringify(history));
      console.log(`💾 [NoneMfg] Saved grade history for ${unit}:`, grade);
    } catch (e) {
      console.error('❌ [NoneMfg] Failed to save grade history:', e);
    }
  }

  /**
   * Override: Don't render template selector (fixed to template1)
   */
  renderTemplateSelector() {
    return `
      <input type="hidden" id="template" value="template1">
      <!-- Template 1 (Description Only) is fixed for NoneMfg mode -->
    `;
  }

  /**
   * Override: Don't render Print Controls (no FT/LT)
   */
  renderPrintControls() {
    return `
      <input type="hidden" id="ft" value="false">
      <input type="hidden" id="lt" value="false">
      <!-- Print Controls hidden for NoneMfg mode -->
    `;
  }

  /**
   * Override: Attach event listeners (skip checkboxes)
   */
  attachEventListeners() {
    // Call parent method first
    super.attachEventListeners();
    
    // No need to attach FT/LT checkbox listeners since they don't exist
    console.log('✅ [NoneMfg] Event listeners attached (no Print Controls)');
  }

  /**
   * Override: Get form data (ensure template1 and no FT/LT)
   */
  getFormData() {
    const data = super.getFormData();
    
    // Force template1 and disable FT/LT
    data.template = 'template1';
    data.controlprint = {
      ft: false,
      lt: false
    };
    
    return data;
  }

  /**
   * Override: Save form state to sessionStorage with noneMfg prefix
   */
  saveFormState() {
    try {
      const unit = this.state.currentUnit;
      const key = `form_state_noneMfg_${unit}`;
      const state = {
        formData: this.state.formData,
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem(key, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save NoneMfg form state:', e);
    }
  }

  /**
   * Override: Restore form state from sessionStorage
   */
  restoreFormState() {
    try {
      const unit = this.state.currentUnit;
      const key = `form_state_noneMfg_${unit}`;
      const stored = sessionStorage.getItem(key);
      
      if (stored) {
        const state = JSON.parse(stored);
        this.state.formData = state.formData;
        console.log(`✅ [NoneMfg] Restored form state for ${unit}`);
        return true;
      }
    } catch (e) {
      console.warn('Failed to restore NoneMfg form state:', e);
    }
    return false;
  }

  /**
   * Override render to add close button to header
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
          ${this.renderActionButtons()}
        </div>
      </div>
    `;
  }

  /**
   * Override initializeForm to add close button listener for Form2
   */
  initializeForm() {
    super.initializeForm();
    
    // Note: Close button listener is now handled in parent class attachEventListeners
    // No need to add duplicate listener here
  }
}

// Export for ES6 modules
export default FormComponentNoneMfg;
