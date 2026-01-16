/**
 * Theme System - Manages application themes
 * Supports: blue, green, pink, purple, dark
 */

const Themes = {
  blue: {
    name: 'Blue Purple',
    primary: '#667eea',
    secondary: '#764ba2',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    text: '#ffffff',
    textDark: '#333333'
  },
  
  green: {
    name: 'Green Fresh',
    primary: '#56ab2f',
    secondary: '#a8e063',
    gradient: 'linear-gradient(135deg, #56ab2f 0%, #a8e063 100%)',
    text: '#ffffff',
    textDark: '#333333'
  },
  
  pink: {
    name: 'Pink Rose',
    primary: '#ff6b9d',
    secondary: '#c06c84',
    gradient: 'linear-gradient(135deg, #ff6b9d 0%, #c06c84 100%)',
    text: '#ffffff',
    textDark: '#333333'
  },
  
  purple: {
    name: 'Purple Sunset',
    primary: '#c471ed',
    secondary: '#f7797d',
    gradient: 'linear-gradient(135deg, #c471ed 0%, #f7797d 100%)',
    text: '#ffffff',
    textDark: '#333333'
  },
  
  dark: {
    name: 'Dark Mode',
    primary: '#2c3e50',
    secondary: '#34495e',
    gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    text: '#ffffff',
    textDark: '#ecf0f1'
  }
};

/**
 * Theme Manager Class
 */
class ThemeManager {
  constructor(defaultTheme = 'blue') {
    this.currentTheme = defaultTheme;
    this.loadSavedTheme();
  }

  /**
   * Load saved theme from localStorage
   */
  loadSavedTheme() {
    const saved = localStorage.getItem('app_theme');
    if (saved && Themes[saved]) {
      this.currentTheme = saved;
    }
  }

  /**
   * Save theme to localStorage
   */
  saveTheme(themeName) {
    localStorage.setItem('app_theme', themeName);
  }

  /**
   * Get theme configuration
   */
  getTheme(themeName) {
    return Themes[themeName] || Themes.blue;
  }

  /**
   * Get current theme configuration
   */
  getCurrentTheme() {
    return this.getTheme(this.currentTheme);
  }

  /**
   * Apply theme to document
   */
  applyTheme(themeName) {
    if (!Themes[themeName]) {
      console.warn(`Theme "${themeName}" not found. Using default.`);
      themeName = 'blue';
    }

    this.currentTheme = themeName;
    this.saveTheme(themeName);

    const theme = this.getTheme(themeName);
    const root = document.documentElement;

    // Set CSS custom properties
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.style.setProperty('--theme-gradient', theme.gradient);
    root.style.setProperty('--theme-text', theme.text);
    root.style.setProperty('--theme-text-dark', theme.textDark);

    // Update body class
    document.body.className = document.body.className.replace(/theme-\w+/g, '');
    document.body.classList.add(`theme-${themeName}`);

    // Update theme-specific styles
    this.updateThemeStyles(theme);

    // Trigger theme change event
    document.dispatchEvent(new CustomEvent('themeChange', { 
      detail: { theme: themeName, config: theme } 
    }));
  }

  /**
   * Update dynamic theme styles
   */
  updateThemeStyles(theme) {
    // Remove existing theme style tag
    const existingStyle = document.getElementById('dynamic-theme-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style tag
    const style = document.createElement('style');
    style.id = 'dynamic-theme-styles';
    style.textContent = `
      body {
        background: ${theme.gradient} !important;
      }

      .form-header,
      .btn-primary,
      .form-toggle-btn,
      .print-guide-btn {
        background: ${theme.gradient} !important;
      }

      .form-input:focus,
      .form-select:focus {
        border-color: ${theme.primary} !important;
        box-shadow: 0 0 0 3px ${theme.primary}33 !important;
      }

      .unit-btn:hover,
      .template-card:hover {
        border-color: ${theme.primary} !important;
      }

      .unit-btn.active,
      .template-card.active {
        background: ${theme.primary} !important;
        border-color: ${theme.primary} !important;
        color: white !important;
      }

      .checkbox-label input[type="checkbox"]:checked {
        accent-color: ${theme.primary} !important;
      }

      .loading {
        color: ${theme.primary} !important;
      }

      .form-toggle-btn {
        box-shadow: 0 4px 16px ${theme.primary}66 !important;
      }

      .form-toggle-btn:hover {
        box-shadow: 0 6px 20px ${theme.primary}99 !important;
      }

      .print-controls {
        background: ${theme.primary}11 !important;
      }

      a, .link {
        color: ${theme.primary} !important;
      }

      .success {
        border-color: ${theme.primary} !important;
        background: ${theme.primary}11 !important;
      }

      /* Theme-specific form panel styles */
      .theme-dark .form-panel {
        background: #2c3e50;
        color: #ecf0f1;
      }

      .theme-dark .form-input,
      .theme-dark .form-select {
        background: #34495e;
        color: #ecf0f1;
        border-color: #4a5f7f;
      }

      .theme-dark .form-group label {
        color: #ecf0f1;
      }

      .theme-dark .section-label {
        color: #ecf0f1;
      }
    `;

    document.head.appendChild(style);
  }

  /**
   * Get all available themes
   */
  getAllThemes() {
    return Object.keys(Themes).map(key => ({
      id: key,
      name: Themes[key].name,
      config: Themes[key]
    }));
  }

  /**
   * Initialize theme system
   */
  init() {
    this.applyTheme(this.currentTheme);
    console.log(`🎨 Theme System initialized with "${this.currentTheme}" theme`);
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { Themes, ThemeManager };
} else {
  window.Themes = Themes;
  window.ThemeManager = ThemeManager;
}
