/**
 * Header Component - Displays page header with title and metadata
 */

class HeaderComponent {
  constructor(data) {
    this.data = data;
  }

  /**
   * Calculate appropriate font size based on grade length
   */
  getGradeFontSize(grade) {
    const length = grade.length;
    if (length <= 10) return 60;
    if (length <= 12) return 50;
    if (length <= 15) return 42;
    return 36;
  }

  /**
   * Render grade with special handling for P901BK/SB pattern
   */
  renderGrade() {
    const { grade } = this.data;
    
    // Special handling for P901BK/SB/xxxx pattern - only show P901BK/SB
    let displayGrade = grade;
    if (grade.startsWith('P901BK/SB/')) {
      const parts = grade.split('/');
      displayGrade = `${parts[0]}/${parts[1]}`; // P901BK/SB only
    }
    
    // Dynamic font sizing based on grade length
    const fontSize = this.getGradeFontSize(displayGrade);
    
    return `
      <div style="
        position: absolute; 
        right: 0; 
        top: 115px; 
        width: 540px; 
        font-size: ${fontSize}px; 
        color: black; 
        margin: 0; 
        text-align: center; 
        white-space: nowrap; 
        font-weight: bold;
      ">${displayGrade}</div>
    `;
  }

  /**
   * Render lot number
   */
  renderLot() {
    const { lot } = this.data;
    return `
      <div style="position: absolute; left: 780px; top: 210px; font-size: 50px; color: black; margin: 0; text-align: left; white-space: nowrap;">
        ${lot || 'N/A'}
      </div>
    `;
  }

  /**
   * Render net weight
   */
  renderNetWeight() {
    const { netweight } = this.data;
    
    // Format number with comma
    const formattedWeight = netweight ? 
      parseInt(netweight).toLocaleString('en-US') : 'N/A';
    
    // Adjust position based on netweight length
    let leftPosition = 895;
    let topPosition = 323;
    
    if (netweight && parseInt(netweight) >= 1000) {
      leftPosition = 865;
    }
    
    return `
      <div style="position: absolute; left: ${leftPosition}px; top: ${topPosition}px; font-size: 50px; color: black; margin: 0; text-align: left; white-space: nowrap;">
        ${formattedWeight}
      </div>
    `;
  }

  /**
   * Render running number with boxes
   */
  renderRunningNumber(pageNumber) {
    const { idate, shift } = this.data;
    const running = String(pageNumber).padStart(3, '0');
    const date = String(idate).padStart(2, '0');
    
    const boxes = [];
    
    // Running number boxes
    for (let i = 0; i < running.length; i++) {
      boxes.push(`<div style="border: 2px solid black; width: 35px; height: 35px; display: inline-block; text-align: center; line-height: 31px; margin: 0 3px; font-size: 30px; vertical-align: top; font-family: Arial, sans-serif;">${running[i]}</div>`);
    }
    
    boxes.push(`<div style="display: inline-block; text-align: center; line-height: 31px; width: 15px; height: 35px; margin: 0 3px; font-size: 40px; vertical-align: top; font-family: Arial, sans-serif;">-</div>`);
    
    // Date boxes
    for (let i = 0; i < date.length; i++) {
      boxes.push(`<div style="border: 2px solid black; width: 35px; height: 35px; display: inline-block; text-align: center; line-height: 31px; margin: 0 3px; font-size: 30px; vertical-align: top; font-family: Arial, sans-serif;">${date[i]}</div>`);
    }
    
    boxes.push(`<div style="display: inline-block; text-align: center; line-height: 31px; width: 15px; height: 35px; margin: 0 3px; font-size: 40px; vertical-align: top; font-family: Arial, sans-serif;">-</div>`);
    
    // Shift box
    boxes.push(`<div style="border: 2px solid black; width: 35px; height: 35px; display: inline-block; text-align: center; line-height: 31px; margin: 0 3px; font-size: 30px; vertical-align: top; font-family: Arial, sans-serif;">${shift}</div>`);
    
    return `
      <div style="position: absolute; left: 775px; top: 448px; white-space: nowrap; font-size: 0;">
        ${boxes.join('')}
      </div>
    `;
  }

  /**
   * Render title1 (unit name)
   */
  renderTitle1() {
    const { title1 } = this.data;
    const fontSize = 60;
    
    return `
      <div style="
        position: absolute; 
        left: 0; 
        top: 240px; 
        width: 550px;
        font-size: ${fontSize}px; 
        text-align: center; 
        white-space: nowrap;
        font-weight: normal;
      ">${title1 || 'HDPE'}</div>
    `;
  }

  /**
   * Render title2 (full product name)
   */
  renderTitle2() {
    const { title2 } = this.data;
    const fontSize = 30;
    
    return `
      <div style="
        position: absolute; 
        left: 0; 
        top: 320px; 
        width: 550px;
        font-size: ${fontSize}px; 
        text-align: center; 
        white-space: nowrap;
        font-weight: normal;
      ">${title2 || 'HIGH DENSITY POLYETHYLENE'}</div>
    `;
  }

  /**
   * Render description text
   */
  renderDescription() {
    return `
      ${this.renderTitle1()}
      ${this.renderTitle2()}
    `;
  }

  /**
   * Render FT/LT markers
   */
  renderMarkers(pageNumber) {
    const { fromPage, toPage, controlprint } = this.data;
    
    let ftDisplay, ltDisplay;
    
    if (typeof controlprint === 'object') {
      ftDisplay = controlprint.ft && pageNumber === parseInt(fromPage);
      ltDisplay = controlprint.lt && pageNumber === parseInt(toPage);
    } else {
      const control = parseInt(controlprint || 0);
      ftDisplay = (control & 2) !== 0 && pageNumber === parseInt(fromPage);
      ltDisplay = (control & 1) !== 0 && pageNumber === parseInt(toPage);
    }
    
    let result = '';
    if (ftDisplay) {
      result += `<div style="position: absolute; top: 345px; left: 0; width: 550px; text-align: center; font-size: 50px; margin: 0; white-space: nowrap;">(F/T)</div>`;
    }
    if (ltDisplay) {
      result += `<div style="position: absolute; top: 345px; left: 0; width: 550px; text-align: center; font-size: 50px; margin: 0; white-space: nowrap;">(L/T)</div>`;
    }
    
    return result;
  }

  /**
   * Render complete header
   */
  render(pageNumber) {
    return `
      <div class="header-section">
        ${this.renderGrade()}
        ${this.renderLot()}
        ${this.renderNetWeight()}
        ${this.renderRunningNumber(pageNumber)}
        ${this.renderDescription()}
        ${this.renderMarkers(pageNumber)}
      </div>
    `;
  }
}

// Export for ES6 modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeaderComponent;
}
