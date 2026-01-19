/**
 * Grade History Manager (Non-Module Version)
 * จัดการประวัติการใช้งาน Grade แยกตาม Unit (HDPE, PP, PPC)
 * ใช้ localStorage เก็บข้อมูล
 */

var GradeHistoryManager = (function() {
    var storagePrefix = 'grade_history';
    
    /**
     * บันทึก Grade History
     * @param {string} unit - Unit name (HDPE, PP, PPC)
     * @param {string} gradeWithSub - Grade name (may include SUB suffix)
     * @param {object} formData - Form data to save
     */
    function saveGradeHistory(unit, gradeWithSub, formData) {
        console.log('🔍 saveGradeHistory called:', { unit: unit, gradeWithSub: gradeWithSub, formData: formData });
        
        if (!gradeWithSub || gradeWithSub.trim() === '') {
            console.warn('⚠️ Grade is empty, skipping save');
            return;
        }
        
        if (!unit || unit.trim() === '') {
            console.warn('⚠️ Unit is empty, skipping save');
            return;
        }
        
        var historyKey = storagePrefix + '_' + unit;
        console.log('📝 Saving to key: ' + historyKey);
        
        var history = {};
        
        try {
            var stored = localStorage.getItem(historyKey);
            if (stored) {
                history = JSON.parse(stored);
                console.log('📦 Existing history:', history);
            } else {
                console.log('📭 No existing history for ' + unit);
            }
        } catch (e) {
            console.warn('Failed to load grade history:', e);
        }
        
        // Store grade-specific data
        var gradeData = {
            grade: gradeWithSub,
            lot: formData.lot || '',
            netweight: formData.netweight || '',
            fromPage: formData.fromPage || formData.frompage || '1',
            toPage: formData.toPage || formData.topage || '1',
            shift: formData.shift || 'M',
            idate: formData.idate || '',
            template: formData.template || 'template1',
            controlprint: formData.controlprint || { ft: false, lt: false },
            timestamp: new Date().toISOString()
        };
        
        history[gradeWithSub] = gradeData;
        
        console.log('✏️ Updated history with grade "' + gradeWithSub + '":', history);
        
        try {
            localStorage.setItem(historyKey, JSON.stringify(history));
            console.log('💾 Grade history saved [' + unit + ']: ' + gradeWithSub);
            console.log('📊 Total grades in ' + unit + ':', Object.keys(history).length);
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
    function loadGradeHistory(unit, grade) {
        if (!grade || grade.trim() === '') return null;
        if (!unit || unit.trim() === '') return null;
        
        var historyKey = storagePrefix + '_' + unit;
        
        try {
            var stored = localStorage.getItem(historyKey);
            if (!stored) return null;
            
            var history = JSON.parse(stored);
            var gradeData = history[grade];
            
            if (gradeData) {
                console.log('📂 Loaded history [' + unit + ']: ' + grade, gradeData);
                return gradeData;
            }
        } catch (e) {
            console.warn('Failed to load grade history:', e);
        }
        
        return null;
    }
    
    /**
     * ลบ Grade History
     * @param {string} unit - Unit name
     * @param {string} grade - Grade name
     */
    function deleteGradeHistory(unit, grade) {
        if (!grade || grade.trim() === '') return;
        if (!unit || unit.trim() === '') return;
        
        var historyKey = storagePrefix + '_' + unit;
        
        try {
            var stored = localStorage.getItem(historyKey);
            if (!stored) return;
            
            var history = JSON.parse(stored);
            if (history[grade]) {
                delete history[grade];
                localStorage.setItem(historyKey, JSON.stringify(history));
                console.log('🗑️ Deleted history [' + unit + ']: ' + grade);
            }
        } catch (e) {
            console.warn('Failed to delete grade history:', e);
        }
    }
    
    /**
     * ลบ History ทั้งหมดของ Unit
     * @param {string} unit - Unit name
     */
    function clearUnitHistory(unit) {
        if (!unit || unit.trim() === '') return;
        
        var historyKey = storagePrefix + '_' + unit;
        
        try {
            localStorage.removeItem(historyKey);
            console.log('🧹 Cleared all history for ' + unit);
        } catch (e) {
            console.warn('Failed to clear unit history:', e);
        }
    }
    
    /**
     * ดึงรายการ Grade ทั้งหมดของ Unit
     * @param {string} unit - Unit name
     * @returns {array} Array of grade names
     */
    function getGradeList(unit) {
        if (!unit || unit.trim() === '') return [];
        
        var historyKey = storagePrefix + '_' + unit;
        
        try {
            var stored = localStorage.getItem(historyKey);
            if (!stored) return [];
            
            var history = JSON.parse(stored);
            return Object.keys(history);
        } catch (e) {
            console.warn('Failed to get grade list:', e);
            return [];
        }
    }
    
    // Public API
    return {
        saveGradeHistory: saveGradeHistory,
        loadGradeHistory: loadGradeHistory,
        deleteGradeHistory: deleteGradeHistory,
        clearUnitHistory: clearUnitHistory,
        getGradeList: getGradeList
    };
})();

console.log('✅ Grade History Manager loaded');
