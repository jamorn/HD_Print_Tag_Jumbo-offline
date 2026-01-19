/* Main JS copied from reference - truncated for brevity in repository copy. Use the full original file when building. */

console.log('HD Print Tag Jumbo - main.js (copied)');

// Initialize ThemeManager and UI on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof ThemeManager !== 'undefined' && ThemeManager.init) {
        ThemeManager.init();
    }
    if (typeof updateDateTime === 'function') updateDateTime();

    // Ensure global AppState
    if (!window.AppState) window.AppState = {};
    // Default unit
    window.AppState.currentUnit = window.AppState.currentUnit || 'HDPE';

    // Initial render
    if (typeof renderTable === 'function') {
        try { renderTable(window.AppState.currentUnit); } catch (e) { console.warn('renderTable failed', e); }
    }
    if (typeof renderForm === 'function') {
        try { renderForm(window.AppState.currentUnit); } catch (e) { console.warn('renderForm failed', e); }
    }

    // Wire unit buttons
    const unitButtons = document.querySelectorAll('.unit-btn');
    unitButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            unitButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const unit = btn.dataset.unit;
            window.AppState.currentUnit = unit;
            if (typeof renderTable === 'function') renderTable(unit);
            if (typeof renderForm === 'function') renderForm(unit);
        });
    });
});