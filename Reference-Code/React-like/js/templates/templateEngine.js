/**
 * Template Engine - Handles rendering of different template layouts
 * Supports left/right section based templates
 */

class TemplateEngine {
  constructor(config) {
    this.config = config;
    this.templates = {
      template1: this.renderTemplate1.bind(this),
      template2: this.renderTemplate2.bind(this),
      template3: this.renderTemplate3.bind(this)
    };
  }

  /**
   * Template 1: Description Only (Minimal)
   * Left: Description & Basic Info
   * Right: Running numbers & markers
   */
  renderTemplate1(data, pageNumber) {
    const headerComp = new HeaderComponent(data);
    
    return `
      <section class="sheet A4 landscape tag-page">
        ${headerComp.renderDescription()}
        ${headerComp.renderGrade()}
        ${headerComp.renderLot()}
        ${headerComp.renderNetWeight()}
        ${headerComp.renderRunningNumber(pageNumber)}
        ${headerComp.renderMarkers(pageNumber)}
      </section>
    `;
  }

  /**
   * Template 2: Description + Logos
   * Left: Description & Basic Info
   * Right: Running numbers, markers & selected logos
   */
  renderTemplate2(data, pageNumber) {
    const headerComp = new HeaderComponent(data);
    const logoComp = new LogoComponent(this.config);
    
    // Pass unit config to logo component
    const dataWithConfig = {
      ...data,
      unitConfig: data.unitConfig || {}
    };
    
    return `
      <section class="sheet A4 landscape tag-page">
        ${logoComp.render('template2', dataWithConfig)}
        ${headerComp.renderDescription()}
        ${headerComp.renderGrade()}
        ${headerComp.renderLot()}
        ${headerComp.renderNetWeight()}
        ${headerComp.renderRunningNumber(pageNumber)}
        ${headerComp.renderMarkers(pageNumber)}
      </section>
    `;
  }

  /**
   * Template 3: Full Certifications
   * Left: Description & Basic Info  
   * Right: All elements including full certification logos
   */
  renderTemplate3(data, pageNumber) {
    const headerComp = new HeaderComponent(data);
    const logoComp = new LogoComponent(this.config);
    
    // Pass unit config to logo component
    const dataWithConfig = {
      ...data,
      unitConfig: data.unitConfig || {}
    };
    
    return `
      <section class="sheet A4 landscape tag-page">
        ${this.renderLeftFull(data)}
        ${logoComp.render('template3', dataWithConfig)}
        ${headerComp.renderGrade()}
        ${headerComp.renderLot()}
        ${headerComp.renderNetWeight()}
        ${headerComp.renderRunningNumber(pageNumber)}
        ${headerComp.renderMarkers(pageNumber)}
      </section>
    `;
  }

  /**
   * Render basic left section (for templates 1 & 2)
   */
  renderLeftBasic(data) {
    const { title1, title2 } = data;
    
    return `
      <div style="position: absolute; left: 0; top: 240px; width: 550px; font-size: 60px; text-align: center; white-space: nowrap;">
        ${title1 || 'HDPE'}
      </div>
      <div style="position: absolute; left: 0; top: 320px; width: 550px; font-size: 30px; text-align: center; white-space: nowrap;">
        ${title2 || 'HIGH DENSITY POLYETHYLENE'}
      </div>
    `;
  }

  /**
   * Render full left section (for template 3 with certifications)
   */
  renderLeftFull(data) {
    const { title1, title2, unit } = data;
    const unitConfig = this.config.units[unit] || {};
    
    return `
      <div style="position: absolute; left: 0; top: 240px; width: 550px; font-size: 60px; text-align: center; white-space: nowrap;">
        ${title1 || unitConfig.title1 || 'HDPE'}
      </div>
      <div style="position: absolute; left: 0; top: 320px; width: 550px; font-size: 30px; text-align: center; white-space: nowrap;">
        ${title2 || unitConfig.title2 || 'HIGH DENSITY POLYETHYLENE'}
      </div>
      ${this.renderAdditionalInfo(data)}
    `;
  }

  /**
   * Render additional info section for full template
   */
  renderAdditionalInfo(data) {
    const { additionalInfo } = data;
    if (!additionalInfo || additionalInfo.length === 0) return '';
    
    return `
      <div style="position: absolute; left: 50px; top: 400px;" class="additional-info">
        ${additionalInfo.map(info => `
          <p style="font-size: 16px; margin: 4px 0; color: #333;">${info}</p>
        `).join('')}
      </div>
    `;
  }

  /**
   * Add background image if specified
   */
  addBackgroundImage(data) {
    const { backgroundImage } = data;
    if (!backgroundImage) return '';
    
    return `
      <style>
        .sheet {
          background-image: url(${backgroundImage});
          background-size: cover;
          background-position: center;
        }
      </style>
    `;
  }

  /**
   * Generate pages from fromPage to toPage
   */
  generatePages(data) {
    const { fromPage, toPage, template } = data;
    const from = parseInt(fromPage);
    const to = parseInt(toPage);
    
    if (isNaN(from) || isNaN(to) || from < 1 || to < from) {
      throw new Error('Invalid page range');
    }
    
    const templateRenderer = this.templates[template] || this.templates.template3;
    const pages = [];
    
    for (let page = from; page <= to; page++) {
      pages.push(templateRenderer(data, page));
    }
    
    return pages.join('\n');
  }

  /**
   * Render complete output
   */
  render(data) {
    try {
      const pages = this.generatePages(data);
      const background = this.addBackgroundImage(data);
      
      return `
        ${background}
        ${pages}
      `;
    } catch (error) {
      console.error('Template rendering error:', error);
      return `
        <div class="error">
          <h3>❌ Template Rendering Error</h3>
          <p>${error.message}</p>
        </div>
      `;
    }
  }
}

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TemplateEngine;
}
