/**
 * Storage Manager - Enhanced storage handling for React-like V2
 * Manages localStorage and sessionStorage with better error handling and data validation
 */

class StorageManager {
  constructor() {
    this.version = '2.0';
    this.keys = {
      // Session Storage Keys (temporary data)
      FORM_DATA: 'form_data_v2',         // Current session form data
      LAST_PREVIEW: 'last_preview_v2',   // Last generated preview
      
      // Local Storage Keys (persistent data)  
      GRADE_HISTORY: 'grade_history_v2', // Grade usage history (all units)
      APP_THEME: 'app_theme_v2',         // Theme preference
      USER_PREFS: 'user_prefs_v2'        // User preferences
    };
    
    this.init();
  }

  /**
   * Initialize storage and migrate old data if needed
   */
  init() {
    console.log('🗄️ Initializing StorageManager V2');
    this.migrateOldData();
  }

  /**
   * Migrate data from V1 to V2 format
   */
  migrateOldData() {
    try {
      // Migrate theme
      const oldTheme = localStorage.getItem('app_theme');
      if (oldTheme && !localStorage.getItem(this.keys.APP_THEME)) {
        this.setTheme(oldTheme);
        console.log('📦 Migrated theme:', oldTheme);
      }

      // Migrate grade history from unit-specific keys
      const units = ['HDPE', 'PP', 'PPC'];
      let combinedHistory = {};

      units.forEach(unit => {
        const oldKey = `grade_history_${unit}`;
        const oldData = localStorage.getItem(oldKey);
        if (oldData) {
          try {
            const parsed = JSON.parse(oldData);
            Object.keys(parsed).forEach(grade => {
              const historyItem = parsed[grade];
              historyItem.unit = unit; // Add unit identifier
              combinedHistory[`${unit}:${grade}`] = historyItem;
            });
            console.log(`📦 Migrated grade history for ${unit}`);
          } catch (e) {
            console.warn(`⚠️ Failed to migrate ${oldKey}:`, e);
          }
        }
      });

      if (Object.keys(combinedHistory).length > 0) {
        localStorage.setItem(this.keys.GRADE_HISTORY, JSON.stringify(combinedHistory));
        console.log(`✅ Combined grade history: ${Object.keys(combinedHistory).length} entries`);
      }

    } catch (error) {
      console.warn('⚠️ Migration failed:', error);
    }
  }

  // === SESSION STORAGE METHODS (temporary data) ===

  /**
   * Save form data for current session
   */
  saveFormData(unit, formData, template, theme) {
    const sessionData = {
      unit,
      formData,
      template,
      theme,
      timestamp: new Date().toISOString(),
      version: this.version
    };

    try {
      const key = `${this.keys.FORM_DATA}_${unit}`;
      sessionStorage.setItem(key, JSON.stringify(sessionData));
      console.log(`💾 Form data saved for ${unit}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to save form data:', error);
      return false;
    }
  }

  /**
   * Load form data for unit from session
   */
  loadFormData(unit) {
    try {
      const key = `${this.keys.FORM_DATA}_${unit}`;
      const stored = sessionStorage.getItem(key);
      if (!stored) return null;

      const data = JSON.parse(stored);
      if (data.version !== this.version) {
        console.warn('⚠️ Version mismatch, ignoring session data');
        return null;
      }

      console.log(`📂 Form data loaded for ${unit}`);
      return data;
    } catch (error) {
      console.error('❌ Failed to load form data:', error);
      return null;
    }
  }

  /**
   * Save last preview data
   */
  savePreview(previewData) {
    try {
      const data = {
        ...previewData,
        timestamp: new Date().toISOString(),
        version: this.version
      };
      sessionStorage.setItem(this.keys.LAST_PREVIEW, JSON.stringify(data));
      console.log('💾 Preview data saved');
      return true;
    } catch (error) {
      console.error('❌ Failed to save preview:', error);
      return false;
    }
  }

  /**
   * Load last preview data
   */
  loadPreview() {
    try {
      const stored = sessionStorage.getItem(this.keys.LAST_PREVIEW);
      if (!stored) return null;

      const data = JSON.parse(stored);
      if (data.version !== this.version) {
        console.warn('⚠️ Preview version mismatch, ignoring');
        return null;
      }

      console.log('📂 Preview data loaded');
      return data;
    } catch (error) {
      console.error('❌ Failed to load preview:', error);
      return null;
    }
  }

  // === LOCAL STORAGE METHODS (persistent data) ===

  /**
   * Save grade history (persistent)
   */
  saveGradeHistory(unit, grade, formData) {
    if (!grade || !grade.trim()) return false;

    try {
      const historyKey = this.keys.GRADE_HISTORY;
      let history = {};
      
      const stored = localStorage.getItem(historyKey);
      if (stored) {
        history = JSON.parse(stored);
      }

      // Use composite key: unit:grade
      const key = `${unit}:${grade}`;
      history[key] = {
        unit,
        grade,
        lot: formData.lot || '',
        netweight: formData.netweight || '',
        fromPage: formData.fromPage || '1',
        toPage: formData.toPage || '1',
        controlprint: formData.controlprint || { ft: false, lt: false },
        timestamp: new Date().toISOString(),
        version: this.version
      };

      localStorage.setItem(historyKey, JSON.stringify(history));
      console.log(`💾 Grade history saved: ${unit}:${grade}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to save grade history:', error);
      return false;
    }
  }

  /**
   * Load grade history for specific unit and grade
   */
  loadGradeHistory(unit, grade) {
    if (!grade || !grade.trim()) return null;

    try {
      const stored = localStorage.getItem(this.keys.GRADE_HISTORY);
      if (!stored) return null;

      const history = JSON.parse(stored);
      const key = `${unit}:${grade}`;
      const gradeData = history[key];

      if (gradeData && gradeData.version === this.version) {
        console.log(`📂 Grade history loaded: ${unit}:${grade}`);
        return gradeData;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Failed to load grade history:', error);
      return null;
    }
  }

  /**
   * Get last used grade for unit
   */
  getLastUsedGrade(unit) {
    try {
      const stored = localStorage.getItem(this.keys.GRADE_HISTORY);
      if (!stored) return null;

      const history = JSON.parse(stored);
      let lastGrade = null;
      let lastTimestamp = null;

      // Find most recent grade for this unit
      Object.keys(history).forEach(key => {
        const data = history[key];
        if (data.unit === unit && data.version === this.version) {
          const timestamp = new Date(data.timestamp);
          if (!lastTimestamp || timestamp > lastTimestamp) {
            lastTimestamp = timestamp;
            lastGrade = data;
          }
        }
      });

      if (lastGrade) {
        console.log(`📂 Last used grade for ${unit}: ${lastGrade.grade}`);
      }
      
      return lastGrade;
    } catch (error) {
      console.error('❌ Failed to get last used grade:', error);
      return null;
    }
  }

  /**
   * Save theme preference
   */
  setTheme(themeName) {
    try {
      localStorage.setItem(this.keys.APP_THEME, themeName);
      console.log(`🎨 Theme saved: ${themeName}`);
      return true;
    } catch (error) {
      console.error('❌ Failed to save theme:', error);
      return false;
    }
  }

  /**
   * Load theme preference
   */
  getTheme() {
    try {
      const theme = localStorage.getItem(this.keys.APP_THEME);
      if (theme) {
        console.log(`🎨 Theme loaded: ${theme}`);
      }
      return theme || 'blue'; // Default theme
    } catch (error) {
      console.error('❌ Failed to load theme:', error);
      return 'blue';
    }
  }

  // === UTILITY METHODS ===

  /**
   * Clear all session data
   */
  clearSession() {
    try {
      const units = ['HDPE', 'PP', 'PPC'];
      units.forEach(unit => {
        sessionStorage.removeItem(`${this.keys.FORM_DATA}_${unit}`);
      });
      sessionStorage.removeItem(this.keys.LAST_PREVIEW);
      console.log('🗑️ Session data cleared');
    } catch (error) {
      console.error('❌ Failed to clear session:', error);
    }
  }

  /**
   * Clear all persistent data (with confirmation)
   */
  clearAllData() {
    if (confirm('⚠️ This will delete all saved data. Continue?')) {
      try {
        localStorage.removeItem(this.keys.GRADE_HISTORY);
        localStorage.removeItem(this.keys.APP_THEME);
        localStorage.removeItem(this.keys.USER_PREFS);
        this.clearSession();
        console.log('🗑️ All data cleared');
        return true;
      } catch (error) {
        console.error('❌ Failed to clear data:', error);
        return false;
      }
    }
    return false;
  }

  /**
   * Get storage usage summary
   */
  getStorageInfo() {
    const info = {
      session: {
        used: 0,
        items: 0
      },
      local: {
        used: 0,
        items: 0
      }
    };

    try {
      // Calculate sessionStorage usage
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        const value = sessionStorage.getItem(key);
        info.session.used += key.length + (value ? value.length : 0);
        info.session.items++;
      }

      // Calculate localStorage usage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        info.local.used += key.length + (value ? value.length : 0);
        info.local.items++;
      }

    } catch (error) {
      console.error('❌ Failed to calculate storage info:', error);
    }

    return info;
  }
}

// Export for use in other modules
window.StorageManager = StorageManager;