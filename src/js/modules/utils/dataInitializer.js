/**
 * Data Initializer
 * โหลด default grade history เมื่อครั้งแรก หรือเมื่อ localStorage ว่าง
 */

export class DataInitializer {
  constructor() {
    this.defaultDataUrl = 'src/data/default-grade-history.json';
    this.initializationKey = 'hd_print_initialized';
  }

  /**
   * ตรวจสอบว่า localStorage ได้ถูก initialize แล้วหรือยัง
   */
  isInitialized() {
    try {
      const initialized = localStorage.getItem(this.initializationKey);
      return initialized === 'true';
    } catch (e) {
      console.warn('Cannot check initialization status:', e);
      return false;
    }
  }

  /**
   * โหลดและติดตั้ง default data
   */
  async initializeDefaultData(force = false) {
    try {
      // ถ้าได้ initialize แล้วและไม่ force ให้ skip
      if (!force && this.isInitialized()) {
        console.log('📦 Data already initialized, skipping...');
        return { success: true, message: 'Already initialized' };
      }

      console.log('🚀 Initializing default grade history data...');

      // Fetch default data
      const response = await fetch(this.defaultDataUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const defaultData = await response.json();
      console.log('📄 Default data loaded:', defaultData);

      // Install data to localStorage
      let installedKeys = 0;
      const metadata = defaultData._metadata || {};

      // Install grade history for each unit
      Object.keys(defaultData).forEach(key => {
        if (key.startsWith('grade_history_') || key === 'selectedTheme') {
          try {
            // เฉพาะ force mode เท่านั้นที่จะ overwrite ข้อมูลเก่า
            const existingData = localStorage.getItem(key);
            if (!force && existingData) {
              console.log(`⏭️ Skipping ${key} (data exists)`);
              return;
            }

            localStorage.setItem(key, JSON.stringify(defaultData[key]));
            installedKeys++;
            console.log(`✅ Installed ${key}`);
          } catch (e) {
            console.warn(`Failed to install ${key}:`, e);
          }
        }
      });

      // Mark as initialized
      localStorage.setItem(this.initializationKey, 'true');
      localStorage.setItem('hd_print_init_timestamp', new Date().toISOString());
      localStorage.setItem('hd_print_init_version', metadata.version || '1.0.0');

      console.log(`🎉 Initialization completed! Installed ${installedKeys} keys`);
      return {
        success: true,
        message: `Initialized with ${installedKeys} grade histories`,
        metadata: metadata
      };

    } catch (error) {
      console.error('❌ Failed to initialize default data:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * รีเซ็ตข้อมูลทั้งหมดกลับเป็น default
   */
  async resetToDefaults() {
    try {
      console.log('🔄 Resetting to default data...');
      
      // Clear all existing data
      this.clearAllData();
      
      // Re-initialize with force
      const result = await this.initializeDefaultData(true);
      
      if (result.success) {
        console.log('🎯 Reset completed successfully');
        return { success: true, message: 'Reset to defaults completed' };
      } else {
        throw new Error(result.error);
      }
      
    } catch (error) {
      console.error('❌ Failed to reset data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * ลบข้อมูลทั้งหมด
   */
  clearAllData() {
    try {
      const keysToRemove = [];
      
      // Find all HD Print Tag related keys
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('grade_history_') ||
          key.startsWith('hd_print_') ||
          key === 'selectedTheme' ||
          key === 'recent_hd_print'
        )) {
          keysToRemove.push(key);
        }
      }
      
      // Remove all found keys
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        console.log(`🗑️ Removed ${key}`);
      });
      
      console.log(`🧹 Cleared ${keysToRemove.length} keys`);
      return { success: true, removedKeys: keysToRemove.length };
      
    } catch (error) {
      console.error('❌ Failed to clear data:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * รายงานสถานะของ localStorage
   */
  getInitializationStatus() {
    try {
      const initialized = this.isInitialized();
      const timestamp = localStorage.getItem('hd_print_init_timestamp');
      const version = localStorage.getItem('hd_print_init_version');
      
      // นับ grade history keys
      let gradeHistoryCount = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('grade_history_')) {
          gradeHistoryCount++;
        }
      }
      
      return {
        initialized,
        timestamp,
        version,
        gradeHistoryCount,
        totalKeys: localStorage.length
      };
      
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Export ข้อมูล localStorage ปัจจุบันเป็น JSON
   */
  exportCurrentData() {
    try {
      const exportData = {};
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (
          key.startsWith('grade_history_') ||
          key === 'selectedTheme'
        )) {
          try {
            exportData[key] = JSON.parse(localStorage.getItem(key));
          } catch (e) {
            // If not JSON, store as string
            exportData[key] = localStorage.getItem(key);
          }
        }
      }
      
      // Add metadata
      exportData._metadata = {
        version: "1.0.0",
        exported: new Date().toISOString(),
        source: "user_data_export",
        totalKeys: Object.keys(exportData).length - 1
      };
      
      // Download as JSON file
      const dataStr = JSON.stringify(exportData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `hd-print-data-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('📥 Data exported successfully');
      return exportData;
      
    } catch (error) {
      console.error('Failed to export data:', error);
      return null;
    }
  }

  /**
   * Force refresh grade history for specific unit
   * @param {string} unit - Unit name (HDPE, PP, PPC)
   */
  async forceRefreshUnitHistory(unit) {
    try {
      console.log(`🔄 Force refreshing ${unit} grade history...`);

      // Fetch default data
      const response = await fetch(this.defaultDataUrl);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const defaultData = await response.json();
      const historyKey = `grade_history_${unit}`;
      
      if (defaultData[historyKey]) {
        // Remove old data and install new
        localStorage.removeItem(historyKey);
        localStorage.setItem(historyKey, JSON.stringify(defaultData[historyKey]));
        
        console.log(`✅ ${unit} grade history refreshed successfully`);
        return { 
          success: true, 
          message: `${unit} grade history updated with latest data`,
          data: defaultData[historyKey]
        };
      } else {
        console.warn(`⚠️ No default data found for ${unit}`);
        return { 
          success: false, 
          message: `No default data found for ${unit}`
        };
      }
    } catch (error) {
      console.error(`❌ Failed to refresh ${unit} grade history:`, error);
      return { 
        success: false, 
        message: error.message 
      };
    }
  }
}

// สร้าง global instance
export const dataInitializer = new DataInitializer();

// Export default instance พร้อม static-like methods
export default {
  async initializeDefaultData(force = false) {
    return await dataInitializer.initializeDefaultData(force);
  },
  
  async resetToDefaults() {
    return await dataInitializer.resetToDefaults();
  },
  
  async exportCurrentData() {
    return dataInitializer.exportCurrentData();
  },
  
  getInitializationStatus() {
    return dataInitializer.getInitializationStatus();
  },
  
  clearAllData() {
    return dataInitializer.clearAllData();
  },

  async forceRefreshUnitHistory(unit) {
    return await dataInitializer.forceRefreshUnitHistory(unit);
  }
};