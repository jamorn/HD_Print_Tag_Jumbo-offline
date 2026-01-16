/**
 * Logo Component - Handles rendering of certification logos and details
 */

class LogoComponent {
  constructor(config) {
    this.config = config;
  }

  /**
   * Get logo positions based on template
   */
  getLogoPositions(template) {
    if (template === 'template1') {
      return { mfg: null, qr: null, sirim: null };
    }
    
    // Template 2: MFG + QR only (centered in left section)
    // Total logo width: 120 + 15 + 110 = 245px
    // Left section: 550px, center at 275px
    // Start: 275 - (245/2) = 152.5px
    // MFG: 152px, QR: 152 + 120 + 15 = 287px
    if (template === 'template2') {
      return {
        mfg: { left: 152, top: 430, width: 120 },
        qr: { left: 287, top: 430, width: 110 },
        sirim: null,
        sirimDetail: null
      };
    }
    
    // Template 3: All logos (centered in left section)
    // Total width: 120 + 15 + 110 + 15 + 150 = 410px
    // Center: (550-410)/2 = ~70px
    return {
      mfg: { left: 75, top: 430, width: 120 },
      qr: { left: 210, top: 430, width: 110 },
      sirim: { left: 335, top: 430, width: 150 },
      sirimDetail: { left: 280, top: 550 }
    };
  }

  /**
   * Render MFG logo
   */
  renderMfgLogo(position) {
    if (!position) return '';
    
    return `
      <div style="position: absolute; top: ${position.top}px; left: ${position.left}px;">
        <img src="images/mfg.png" 
             style="width: ${position.width}px !important;" 
             alt="MFG Logo" />
      </div>
    `;
  }

  /**
   * Render MFG/TIS text
   */
  renderMfgText(position, unit) {
    if (!position) return '';
    
    let tisText = '';
    if (unit === 'HDPE') {
      tisText = 'TIS. 2599-2544 (2011)';
    } else if (unit === 'PP' || unit === 'PPC') {
      tisText = 'TIS. 1360-2566';
    }
    
    const textTop = position.top + 120;
    
    return `
      <div style="position: absolute; top: ${textTop}px; left: ${position.left - 20}px; width: ${position.width + 40}px; text-align: center; font-size: 12px; font-weight: bold; font-family: Arial, Helvetica, sans-serif;">
        ${tisText}
      </div>
    `;
  }

  /**
   * Render QR Code
   */
  renderQRLogo(position, unitConfig = {}) {
    if (!position) return '';
    
    const qrUrl = unitConfig.defaults?.qrCodeUrl || unitConfig.qrCodeUrl || 'https://appdb.tisi.go.th/Q/i.php?d=1351525040';
    const containerId = `qr-logo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    setTimeout(() => {
      const container = document.getElementById(containerId);
      if (container && typeof QRCode !== 'undefined') {
        try {
          container.innerHTML = '';
          new QRCode(container, {
            text: qrUrl,
            width: position.width,
            height: position.width,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H
          });
          console.log('✅ QR Code generated:', qrUrl);
        } catch (error) {
          console.error('❌ QR Code error:', error);
        }
      }
    }, 100);
    
    return `
      <div id="${containerId}" style="position: absolute; top: ${position.top}px; left: ${position.left}px;">
      </div>
    `;
  }

  /**
   * Render SIRIM logo
   */
  renderSirimLogo(position) {
    if (!position) return '';
    
    return `
      <div style="position: absolute; top: ${position.top}px; left: ${position.left}px;">
        <img src="images/sirim_logo.png" 
             style="width: ${position.width}px !important;" 
             alt="SIRIM Logo" />
      </div>
    `;
  }

  /**
   * Render SIRIM details
   */
  renderSirimDetails(data, position) {
    if (!position) return '';
    
    const { sirim_title1, sirim_title2, sirim_title3 } = data;
    
    return `
      <div style="position: absolute; top: ${position.top}px; left: ${position.left + 25}px; width: 210px; text-align: center; font-size: 10px; line-height: 1.3; font-family: Arial, Helvetica, sans-serif;">
        ${sirim_title1 || ''}<br>
        ${sirim_title2 || ''}<br>
        ${sirim_title3 || ''}
      </div>
    `;
  }

  /**
   * Render all logos
   */
  render(template, data) {
    const positions = this.getLogoPositions(template);
    const unitConfig = data.unitConfig || {};
    const hasSirimLogo = unitConfig.hasSirimLogo !== false;
    const unit = data.unit || 'HDPE';
    
    return `
      <div class="logo-section">
        ${this.renderMfgLogo(positions.mfg)}
        ${this.renderMfgText(positions.mfg, unit)}
        ${this.renderQRLogo(positions.qr, unitConfig)}
        ${hasSirimLogo ? this.renderSirimLogo(positions.sirim) : ''}
        ${hasSirimLogo && positions.sirimDetail ? this.renderSirimDetails(data, positions.sirimDetail) : ''}
      </div>
    `;
  }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LogoComponent;
}
