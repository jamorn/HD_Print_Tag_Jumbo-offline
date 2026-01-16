/**
 * Theme Manager Module
 * Handles theme switching and persistence for HDPE Print Tag Jumbo SPA
 */

const THEMES = {
    dark: {
        name: 'Dark Theme',
        primary: '#7c3aed', // violet-600
        secondary: '#10b981', // emerald-600
        bgPrimary: '#030815',
        bgSecondary: '#101828',
        borderColor: '#374151', // gray-700
        textPrimary: '#ffffff',
        textSecondary: '#9ca3af', // gray-400
        cssFile: 'src/css/themes/dark.css'
    },
    green: {
        name: 'Green Fresh',
        primary: '#4CAF50',
        secondary: '#81C784',
        bgPrimary: '#d1f7d3',
        bgSecondary: '#a5d6a7',
        borderColor: '#66bb6a',
        textPrimary: '#1b5e20',
        textSecondary: '#2e7d32',
        cssFile: 'src/css/themes/green.css'
    },
    purple: {
        name: 'Purple Dream',
        primary: '#9C27B0',
        secondary: '#BA68C8',
        bgPrimary: '#e5d1f7',
        bgSecondary: '#ce93d8',
        borderColor: '#ab47bc',
        textPrimary: '#4a148c',
        textSecondary: '#6a1b9a',
        cssFile: 'src/css/themes/purple.css'
    },
    pink: {
        name: 'Pink Vibrant',
        primary: '#F44336',
        secondary: '#EF5350',
        bgPrimary: '#f7d1d1',
        bgSecondary: '#ef9a9a',
        borderColor: '#e57373',
        textPrimary: '#b71c1c',
        textSecondary: '#c62828',
        cssFile: 'src/css/themes/pink.css'
    },
    blue: {
        name: 'Blue Sky',
        primary: '#2196F3',
        secondary: '#64B5F6',
        bgPrimary: '#d1e7f7',
        bgSecondary: '#90caf9',
        borderColor: '#42a5f5',
        textPrimary: '#0d47a1',
        textSecondary: '#1565c0',
        cssFile: 'src/css/themes/blue.css'
    }
};

const STORAGE_KEY = 'selectedTheme';
let currentTheme = 'dark';
let themeStyleElement = null;

/**
 * Initialize theme manager
 */
export function initThemeManager() {
    // Load saved theme or use default
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    currentTheme = savedTheme && THEMES[savedTheme] ? savedTheme : 'dark';
    
    // Create style element for theme CSS
    themeStyleElement = document.createElement('link');
    themeStyleElement.rel = 'stylesheet';
    themeStyleElement.id = 'theme-styles';
    document.head.appendChild(themeStyleElement);
    
    // Apply initial theme
    applyTheme(currentTheme);
}

/**
 * Apply theme by name
 * @param {string} themeName - Name of theme to apply
 */
export function applyTheme(themeName) {
    if (!THEMES[themeName]) {
        console.error(`Theme "${themeName}" not found`);
        return;
    }
    
    const theme = THEMES[themeName];
    currentTheme = themeName;
    
    // Update CSS variables
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primary);
    root.style.setProperty('--secondary-color', theme.secondary);
    root.style.setProperty('--bg-primary', theme.bgPrimary);
    root.style.setProperty('--bg-secondary', theme.bgSecondary);
    root.style.setProperty('--border-color', theme.borderColor);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    
    // Load theme CSS file
    if (themeStyleElement) {
        themeStyleElement.href = theme.cssFile;
    }
    
    // Save preference
    localStorage.setItem(STORAGE_KEY, themeName);
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { theme: themeName, config: theme } 
    }));
    
    console.log(`Theme applied: ${theme.name}`);
}

/**
 * Get current theme name
 * @returns {string}
 */
export function getCurrentTheme() {
    return currentTheme;
}

/**
 * Get theme configuration
 * @param {string} themeName - Optional theme name, defaults to current
 * @returns {object}
 */
export function getThemeConfig(themeName = null) {
    const name = themeName || currentTheme;
    return THEMES[name] || THEMES.dark;
}

/**
 * Get all available themes
 * @returns {object}
 */
export function getAllThemes() {
    return THEMES;
}

/**
 * Check if theme exists
 * @param {string} themeName
 * @returns {boolean}
 */
export function hasTheme(themeName) {
    return !!THEMES[themeName];
}
