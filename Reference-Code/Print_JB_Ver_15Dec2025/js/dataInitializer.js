/**
 * Data Initializer (Non-Module Version)
 * โหลด default grade history เมื่อครั้งแรก หรือเมื่อ localStorage ว่าง
 */

var DataInitializer = (function() {
    var defaultDataUrl = './data/default-grade-history.json';
    var initializationKey = 'hd_print_initialized';
    
    /**
     * ตรวจสอบว่า localStorage ได้ถูก initialize แล้วหรือยัง
     */
    function isInitialized() {
        try {
            var initialized = localStorage.getItem(initializationKey);
            return initialized === 'true';
        } catch (e) {
            console.warn('Cannot check initialization status:', e);
            return false;
        }
    }
    
    /**
     * โหลดและติดตั้ง default data
     */
    function initializeDefaultData(force) {
        force = force || false;
        
        return new Promise(function(resolve, reject) {
            try {
                // ถ้าได้ initialize แล้วและไม่ force ให้ skip
                if (!force && isInitialized()) {
                    console.log('📦 Data already initialized, skipping...');
                    resolve({ success: true, message: 'Already initialized' });
                    return;
                }
                
                console.log('🚀 Initializing default grade history data...');
                
                // Fetch default data
                fetch(defaultDataUrl)
                    .then(function(response) {
                        if (!response.ok) {
                            throw new Error('HTTP error! status: ' + response.status);
                        }
                        return response.json();
                    })
                    .then(function(defaultData) {
                        console.log('📄 Default data loaded:', defaultData);
                        
                        // Install data to localStorage
                        var installedKeys = 0;
                        var metadata = defaultData._metadata || {};
                        
                        // Install grade history for each unit
                        Object.keys(defaultData).forEach(function(key) {
                            if (key.startsWith('grade_history_') || key === 'selectedTheme') {
                                try {
                                    // เฉพาะ force mode เท่านั้นที่จะ overwrite ข้อมูลเก่า
                                    var existingData = localStorage.getItem(key);
                                    if (!force && existingData) {
                                        console.log('⏭️ Skipping ' + key + ' (data exists)');
                                        return;
                                    }
                                    
                                    localStorage.setItem(key, JSON.stringify(defaultData[key]));
                                    installedKeys++;
                                    console.log('✅ Installed ' + key);
                                } catch (e) {
                                    console.warn('Failed to install ' + key + ':', e);
                                }
                            }
                        });
                        
                        // Mark as initialized
                        localStorage.setItem(initializationKey, 'true');
                        localStorage.setItem('hd_print_init_timestamp', new Date().toISOString());
                        localStorage.setItem('hd_print_init_version', metadata.version || '1.0.0');
                        
                        console.log('🎉 Initialization completed! Installed ' + installedKeys + ' keys');
                        resolve({
                            success: true,
                            message: 'Initialized with ' + installedKeys + ' grade histories',
                            metadata: metadata
                        });
                    })
                    .catch(function(error) {
                        console.error('❌ Failed to initialize default data:', error);
                        reject({
                            success: false,
                            error: error.message
                        });
                    });
                    
            } catch (error) {
                console.error('❌ Failed to initialize default data:', error);
                reject({
                    success: false,
                    error: error.message
                });
            }
        });
    }
    
    /**
     * รีเซ็ตข้อมูลทั้งหมดกลับเป็น default
     */
    function resetToDefaults() {
        return new Promise(function(resolve, reject) {
            try {
                console.log('🔄 Resetting to default data...');
                
                // Clear all existing data
                clearAllData();
                
                // Re-initialize with force
                initializeDefaultData(true)
                    .then(function(result) {
                        if (result.success) {
                            console.log('🎯 Reset completed successfully');
                            resolve({ success: true, message: 'Reset to defaults completed' });
                        } else {
                            reject(new Error(result.error));
                        }
                    })
                    .catch(function(error) {
                        reject(error);
                    });
                    
            } catch (error) {
                console.error('❌ Failed to reset data:', error);
                reject({ success: false, error: error.message });
            }
        });
    }
    
    /**
     * ลบข้อมูลทั้งหมด
     */
    function clearAllData() {
        try {
            var keysToRemove = [];
            
            // Find all HD Print Tag related keys
            for (var i = 0; i < localStorage.length; i++) {
                var key = localStorage.key(i);
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
            keysToRemove.forEach(function(key) {
                localStorage.removeItem(key);
                console.log('🗑️ Removed ' + key);
            });
            
            console.log('🧹 Cleared ' + keysToRemove.length + ' keys');
            return { success: true, removedKeys: keysToRemove.length };
            
        } catch (error) {
            console.error('❌ Failed to clear data:', error);
            return { success: false, error: error.message };
        }
    }
    
    /**
     * ส่งออกข้อมูลปัจจุบัน
     */
    function exportCurrentData() {
        return new Promise(function(resolve, reject) {
            try {
                var data = {
                    exportDate: new Date().toISOString(),
                    version: '1.0',
                    gradeHistory: {
                        HDPE: JSON.parse(localStorage.getItem('grade_history_HDPE') || '{}'),
                        PP: JSON.parse(localStorage.getItem('grade_history_PP') || '{}'),
                        PPC: JSON.parse(localStorage.getItem('grade_history_PPC') || '{}')
                    }
                };
                
                var jsonStr = JSON.stringify(data, null, 2);
                var blob = new Blob([jsonStr], { type: 'application/json' });
                var url = URL.createObjectURL(blob);
                
                var link = document.createElement('a');
                link.href = url;
                link.download = 'grade-history-backup-' + new Date().toISOString().split('T')[0] + '.json';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                console.log('✅ Data exported successfully');
                resolve({ success: true });
                
            } catch (error) {
                console.error('❌ Export failed:', error);
                reject({ success: false, error: error.message });
            }
        });
    }
    
    /**
     * นำเข้าข้อมูลจากไฟล์ JSON
     */
    function importDataFromFile(file) {
        return new Promise(function(resolve, reject) {
            try {
                var reader = new FileReader();
                
                reader.onload = function(e) {
                    try {
                        var importedData = JSON.parse(e.target.result);
                        
                        // Validate data structure
                        if (!importedData.gradeHistory) {
                            throw new Error('ไฟล์ไม่ถูกต้อง: ไม่พบข้อมูล gradeHistory');
                        }
                        
                        // Import data to localStorage
                        var units = ['HDPE', 'PP', 'PPC'];
                        var importedCount = 0;
                        
                        units.forEach(function(unit) {
                            if (importedData.gradeHistory[unit]) {
                                var key = 'grade_history_' + unit;
                                localStorage.setItem(key, JSON.stringify(importedData.gradeHistory[unit]));
                                importedCount++;
                                console.log('✅ Imported ' + key);
                            }
                        });
                        
                        console.log('🎉 Import completed! Imported ' + importedCount + ' units');
                        resolve({
                            success: true,
                            message: 'นำเข้าข้อมูล ' + importedCount + ' units สำเร็จ',
                            importedUnits: importedCount
                        });
                        
                    } catch (error) {
                        console.error('❌ Failed to parse JSON:', error);
                        reject({
                            success: false,
                            error: 'ไม่สามารถอ่านไฟล์ได้: ' + error.message
                        });
                    }
                };
                
                reader.onerror = function() {
                    reject({
                        success: false,
                        error: 'ไม่สามารถอ่านไฟล์ได้'
                    });
                };
                
                reader.readAsText(file);
                
            } catch (error) {
                console.error('❌ Import failed:', error);
                reject({ success: false, error: error.message });
            }
        });
    }
    
    // Public API
    return {
        isInitialized: isInitialized,
        initializeDefaultData: initializeDefaultData,
        resetToDefaults: resetToDefaults,
        clearAllData: clearAllData,
        exportCurrentData: exportCurrentData,
        importDataFromFile: importDataFromFile
    };
})();

console.log('✅ Data Initializer loaded');
