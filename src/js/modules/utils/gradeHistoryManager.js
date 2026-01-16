/**
 * Grade History Manager
 * จัดการประวัติการใช้งาน Grade แยกตาม Unit (HDPE, PP, PPC)
 * ใช้ localStorage เก็บข้อมูล
 */

export class GradeHistoryManager {
  constructor() {
    this.storagePrefix = 'grade_history';
  }

  /**
   * บันทึก Grade History
   * @param {string} unit - Unit name (HDPE, PP, PPC)
   * @param {string} gradeWithSub - Grade name (may include SUB suffix)
   * @param {object} formData - Form data to save
   */
  saveGradeHistory(unit, gradeWithSub, formData) {
    console.log('🔍 saveGradeHistory called:', { unit, gradeWithSub, formData });
    
    if (!gradeWithSub || gradeWithSub.trim() === '') {
      console.warn('⚠️ Grade is empty, skipping save');
      return;
    }

    if (!unit || unit.trim() === '') {
      console.warn('⚠️ Unit is empty, skipping save');
      return;
    }

    const historyKey = `${this.storagePrefix}_${unit}`;
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
    
    // Store grade-specific data using full grade name (with SUB if present)
    // This allows separate history for P900BK and P900BK SUB
    const gradeData = {
      lot: formData.lot || '',
      netweight: formData.netweight || '',
      fromPage: formData.fromPage || formData.frompage || '',
      toPage: formData.toPage || formData.topage || '',
      shift: formData.shift || '',
      idate: formData.idate || '',
      tis: formData.tis || '',
      controlPrint: formData.controlPrint || formData.controlprint || 0, // Support both cases
      timestamp: new Date().toISOString()
    };
    
    // This will overwrite if grade already exists (using full name with SUB)
    history[gradeWithSub] = gradeData;
    
    console.log(`✏️ Updated history with grade "${gradeWithSub}":`, history);
    
    try {
      localStorage.setItem(historyKey, JSON.stringify(history));
      console.log(`💾 Grade history saved [${unit}]: ${gradeWithSub}`);
      console.log(`📊 Total grades in ${unit}:`, Object.keys(history).length);
    } catch (e) {
      console.warn('Failed to save grade history:', e);
    }
  }

  /**
   * โหลด Grade History สำหรับ grade ที่เลือก
   * @param {string} unit - Unit name
   * @param {string} grade - Grade name
   * @returns {object|null} Grade data or null
   */
  loadGradeHistory(unit, grade) {
    if (!grade || grade.trim() === '') return null;
    if (!unit || unit.trim() === '') return null;
    
    const historyKey = `${this.storagePrefix}_${unit}`;
    
    try {
      const stored = localStorage.getItem(historyKey);
      if (!stored) return null;
      
      const history = JSON.parse(stored);
      const gradeData = history[grade];
      
      if (gradeData) {
        console.log(`📂 Loaded history [${unit}]: ${grade}`, gradeData);
        return gradeData;
      }
    } catch (e) {
      console.warn('Failed to load grade history:', e);
    }
    
    return null;
  }

  /**
   * ดึง Grade ล่าสุดที่ใช้งานจาก Unit ที่เลือก
   * @param {string} unit - Unit name (HDPE, PP, PPC)
   * @returns {object|null} Most recent grade data with grade name
   */
  getLastUsedGrade(unit) {
    try {
      const historyKey = `${this.storagePrefix}_${unit}`;
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
          lastGrade = { 
            grade: gradeKey,
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
   * ดึงรายการ Grade ทั้งหมดของ Unit
   * @param {string} unit - Unit name
   * @returns {array} Array of grade names sorted by timestamp (newest first)
   */
  getAllGradesForUnit(unit) {
    try {
      const historyKey = `${this.storagePrefix}_${unit}`;
      const stored = localStorage.getItem(historyKey);
      
      if (!stored) return [];
      
      const history = JSON.parse(stored);
      
      // Sort by timestamp (newest first)
      return Object.keys(history)
        .map(grade => ({
          grade,
          timestamp: new Date(history[grade].timestamp)
        }))
        .sort((a, b) => b.timestamp - a.timestamp)
        .map(item => item.grade);
    } catch (e) {
      console.warn('Failed to get all grades:', e);
      return [];
    }
  }

  /**
   * ล้าง history ของ unit ที่เลือก
   * @param {string} unit - Unit name
   */
  clearUnitHistory(unit) {
    try {
      const historyKey = `${this.storagePrefix}_${unit}`;
      localStorage.removeItem(historyKey);
      console.log(`🗑️ Cleared history for ${unit}`);
    } catch (e) {
      console.warn('Failed to clear history:', e);
    }
  }

  /**
   * ล้าง history ทั้งหมด
   */
  clearAllHistory() {
    try {
      ['HDPE', 'PP', 'PPC'].forEach(unit => {
        this.clearUnitHistory(unit);
      });
      console.log('🗑️ Cleared all grade history');
    } catch (e) {
      console.warn('Failed to clear all history:', e);
    }
  }
}

// Export singleton instance
export const gradeHistory = new GradeHistoryManager();
