/**
 * Style Builder - Modern Tag Printing System V2
 * CSS-in-JS utility for dynamic styling and theme management
 */

export class StyleBuilder {
  constructor() {
    this.styles = new Map();
    this.themes = new Map();
    this.currentTheme = 'default';
    this.setupDefaultTheme();
  }

  /**
   * Setup default theme
   */
  setupDefaultTheme() {
    this.registerTheme('default', {
      colors: {
        primary: '#2563eb',
        secondary: '#64748b',
        success: '#059669',
        warning: '#d97706',
        danger: '#dc2626',
        white: '#ffffff',
        black: '#000000',
        gray100: '#f8fafc',
        gray200: '#e2e8f0',
        gray300: '#cbd5e1',
        gray400: '#94a3b8',
        gray500: '#64748b',
        gray600: '#475569',
        gray700: '#334155',
        gray800: '#1e293b',
        gray900: '#0f172a'
      },
      typography: {
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSizes: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem'
        },
        fontWeights: {
          normal: '400',
          medium: '500',
          semibold: '600',
          bold: '700'
        },
        lineHeights: {
          tight: '1.25',
          normal: '1.5',
          relaxed: '1.75'
        }
      },
      spacing: {
        0: '0',
        1: '0.25rem',
        2: '0.5rem',
        3: '0.75rem',
        4: '1rem',
        5: '1.25rem',
        6: '1.5rem',
        8: '2rem',
        10: '2.5rem',
        12: '3rem'
      },
      borderRadius: {
        none: '0',
        sm: '0.125rem',
        base: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
        xl: '0.75rem',
        full: '9999px'
      },
      shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }
    });
  }

  /**
   * Register a new theme
   */
  registerTheme(name, theme) {
    this.themes.set(name, theme);
  }

  /**
   * Get current theme
   */
  getTheme() {
    return this.themes.get(this.currentTheme);
  }

  /**
   * Switch theme
   */
  setTheme(themeName) {
    if (!this.themes.has(themeName)) {
      throw new Error(`Theme '${themeName}' not found`);
    }
    this.currentTheme = themeName;
  }

  /**
   * Create a style object
   */
  create(styleId, styleObject) {
    const processedStyle = this.processStyle(styleObject);
    this.styles.set(styleId, processedStyle);
    return this.generateCSS(styleId, processedStyle);
  }

  /**
   * Update existing style
   */
  update(styleId, styleObject) {
    if (!this.styles.has(styleId)) {
      throw new Error(`Style '${styleId}' not found`);
    }
    
    const existingStyle = this.styles.get(styleId);
    const mergedStyle = this.mergeStyles(existingStyle, this.processStyle(styleObject));
    this.styles.set(styleId, mergedStyle);
    return this.generateCSS(styleId, mergedStyle);
  }

  /**
   * Process style object with theme values
   */
  processStyle(styleObject) {
    const theme = this.getTheme();
    const processed = {};

    Object.entries(styleObject).forEach(([property, value]) => {
      processed[property] = this.resolveValue(value, theme);
    });

    return processed;
  }

  /**
   * Resolve theme values and functions
   */
  resolveValue(value, theme) {
    if (typeof value === 'string') {
      // Theme color resolution
      if (value.startsWith('theme.colors.')) {
        const colorKey = value.replace('theme.colors.', '');
        return theme.colors[colorKey] || value;
      }
      
      // Theme spacing resolution
      if (value.startsWith('theme.spacing.')) {
        const spacingKey = value.replace('theme.spacing.', '');
        return theme.spacing[spacingKey] || value;
      }
      
      // Theme typography resolution
      if (value.startsWith('theme.typography.')) {
        const typographyPath = value.replace('theme.typography.', '').split('.');
        let result = theme.typography;
        for (const key of typographyPath) {
          result = result[key];
          if (!result) break;
        }
        return result || value;
      }
      
      // Theme shadow resolution
      if (value.startsWith('theme.shadows.')) {
        const shadowKey = value.replace('theme.shadows.', '');
        return theme.shadows[shadowKey] || value;
      }
      
      // Theme border radius resolution
      if (value.startsWith('theme.borderRadius.')) {
        const radiusKey = value.replace('theme.borderRadius.', '');
        return theme.borderRadius[radiusKey] || value;
      }
    }
    
    return value;
  }

  /**
   * Merge two style objects
   */
  mergeStyles(existing, newStyle) {
    return { ...existing, ...newStyle };
  }

  /**
   * Generate CSS string from style object
   */
  generateCSS(selector, styleObject) {
    const cssRules = Object.entries(styleObject)
      .map(([property, value]) => {
        const cssProperty = this.camelToKebab(property);
        return `  ${cssProperty}: ${value};`;
      })
      .join('\n');

    return `.${selector} {\n${cssRules}\n}`;
  }

  /**
   * Convert camelCase to kebab-case
   */
  camelToKebab(str) {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Create responsive styles
   */
  createResponsive(styleId, styles) {
    const breakpoints = {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    };

    let css = '';
    
    // Base styles
    if (styles.base) {
      css += this.create(styleId, styles.base);
    }

    // Responsive styles
    Object.entries(breakpoints).forEach(([breakpoint, width]) => {
      if (styles[breakpoint]) {
        const responsiveSelector = `${styleId}-${breakpoint}`;
        const responsiveCSS = this.generateCSS(responsiveSelector, this.processStyle(styles[breakpoint]));
        css += `\n@media (min-width: ${width}) {\n  ${responsiveCSS.replace(/\n/g, '\n  ')}\n}`;
      }
    });

    return css;
  }

  /**
   * Create animation styles
   */
  createAnimation(name, keyframes, options = {}) {
    const {
      duration = '0.3s',
      timingFunction = 'ease',
      delay = '0s',
      iterationCount = '1',
      direction = 'normal',
      fillMode = 'both'
    } = options;

    const keyframeCSS = Object.entries(keyframes)
      .map(([percentage, styles]) => {
        const styleCSS = Object.entries(this.processStyle(styles))
          .map(([prop, value]) => `${this.camelToKebab(prop)}: ${value}`)
          .join('; ');
        return `  ${percentage} { ${styleCSS}; }`;
      })
      .join('\n');

    const animationCSS = `@keyframes ${name} {\n${keyframeCSS}\n}`;
    
    const animationClass = `.animate-${name} {
  animation: ${name} ${duration} ${timingFunction} ${delay} ${iterationCount} ${direction} ${fillMode};
}`;

    return `${animationCSS}\n${animationClass}`;
  }

  /**
   * Create utility classes
   */
  createUtilities() {
    const theme = this.getTheme();
    let utilities = '';

    // Spacing utilities
    Object.entries(theme.spacing).forEach(([key, value]) => {
      utilities += `.m-${key} { margin: ${value}; }\n`;
      utilities += `.mt-${key} { margin-top: ${value}; }\n`;
      utilities += `.mr-${key} { margin-right: ${value}; }\n`;
      utilities += `.mb-${key} { margin-bottom: ${value}; }\n`;
      utilities += `.ml-${key} { margin-left: ${value}; }\n`;
      utilities += `.mx-${key} { margin-left: ${value}; margin-right: ${value}; }\n`;
      utilities += `.my-${key} { margin-top: ${value}; margin-bottom: ${value}; }\n`;
      
      utilities += `.p-${key} { padding: ${value}; }\n`;
      utilities += `.pt-${key} { padding-top: ${value}; }\n`;
      utilities += `.pr-${key} { padding-right: ${value}; }\n`;
      utilities += `.pb-${key} { padding-bottom: ${value}; }\n`;
      utilities += `.pl-${key} { padding-left: ${value}; }\n`;
      utilities += `.px-${key} { padding-left: ${value}; padding-right: ${value}; }\n`;
      utilities += `.py-${key} { padding-top: ${value}; padding-bottom: ${value}; }\n`;
    });

    // Color utilities
    Object.entries(theme.colors).forEach(([key, value]) => {
      utilities += `.text-${key} { color: ${value}; }\n`;
      utilities += `.bg-${key} { background-color: ${value}; }\n`;
      utilities += `.border-${key} { border-color: ${value}; }\n`;
    });

    return utilities;
  }

  /**
   * Inject styles into document
   */
  injectStyles(css, id = null) {
    const styleId = id || `style-${Date.now()}`;
    
    // Remove existing style with same ID
    const existingStyle = document.getElementById(styleId);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element
    const styleElement = document.createElement('style');
    styleElement.id = styleId;
    styleElement.textContent = css;
    document.head.appendChild(styleElement);
    
    return styleId;
  }

  /**
   * Create print-specific styles
   */
  createPrintStyles(styles) {
    const processedStyles = this.processStyle(styles);
    const css = Object.entries(processedStyles)
      .map(([selector, styleObj]) => {
        return this.generateCSS(selector, styleObj);
      })
      .join('\n');

    return `@media print {\n${css.replace(/\n/g, '\n  ')}\n}`;
  }

  /**
   * Generate unit-specific styles
   */
  generateUnitStyles(unitConfig) {
    const unitClass = `unit-${unitConfig.id}`;
    
    return this.create(unitClass, {
      '--unit-primary': unitConfig.color.primary,
      '--unit-secondary': unitConfig.color.secondary,
      '--unit-background': unitConfig.color.background,
      '--unit-gradient': unitConfig.color.gradient
    });
  }

  /**
   * Create tag layout styles
   */
  createTagLayoutStyles(layout, paperSize) {
    const tagWidth = paperSize.width / layout.columns;
    const tagHeight = paperSize.height / layout.rows;
    
    return this.create(`layout-${layout.id}`, {
      width: `${tagWidth}mm`,
      height: `${tagHeight}mm`,
      display: 'grid',
      gridTemplateColumns: `repeat(${layout.columns}, 1fr)`,
      gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
      gap: '0'
    });
  }

  /**
   * Get all registered styles
   */
  getAllStyles() {
    return Array.from(this.styles.entries());
  }

  /**
   * Clear all styles
   */
  clearStyles() {
    this.styles.clear();
  }

  /**
   * Export styles as CSS
   */
  exportCSS() {
    return Array.from(this.styles.entries())
      .map(([id, style]) => this.generateCSS(id, style))
      .join('\n\n');
  }
}