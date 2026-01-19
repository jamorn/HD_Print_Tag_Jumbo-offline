// GradeHistoryManager (IIFE)
var GradeHistoryManager = (function() {
    // Save grade history for a unit and grade
    function saveGradeHistory(unit, grade, data) {
        var key = 'grade_history_' + unit;
        var history = {};
        try {
            var raw = localStorage.getItem(key);
            if (raw) history = JSON.parse(raw);
        } catch (e) {}
        data.timestamp = new Date().toISOString();
        history[grade] = data;
        localStorage.setItem(key, JSON.stringify(history));
    }

    // Load grade history for a unit and grade
    function loadGradeHistory(unit, grade) {
        var key = 'grade_history_' + unit;
        try {
            var raw = localStorage.getItem(key);
            if (raw) {
                var history = JSON.parse(raw);
                return history[grade] || null;
            }
        } catch (e) {}
        return null;
    }

    // Delete grade history for a unit and grade
    function deleteGradeHistory(unit, grade) {
        var key = 'grade_history_' + unit;
        try {
            var raw = localStorage.getItem(key);
            if (raw) {
                var history = JSON.parse(raw);
                delete history[grade];
                localStorage.setItem(key, JSON.stringify(history));
            }
        } catch (e) {}
    }

    return {
        saveGradeHistory: saveGradeHistory,
        loadGradeHistory: loadGradeHistory,
        deleteGradeHistory: deleteGradeHistory
    };
})();
