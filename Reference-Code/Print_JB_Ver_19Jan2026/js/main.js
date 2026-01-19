/* Main JS copied from reference - truncated for brevity in repository copy. Use the full original file when building. */

console.log('HD Print Tag Jumbo - main.js (copied)');

// Initialize ThemeManager and UI on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof ThemeManager !== 'undefined' && ThemeManager.init) {
        ThemeManager.init();
    }
    if (typeof updateDateTime === 'function') updateDateTime();
});