/**
 * Mock Data - Initial data for testing and development
 * Supports multiple units: HDPE, LLDPE, PP, PPC
 */

const MockData = {
  /**
   * HDPE Unit Mock Data
   */
  HDPE: {
    // Example 1: P901BK/750 (ตรงกับรูปที่ user ส่งมา)
    p901bk750: {
      grade: 'P901BK/750',
      netweight: '750',
      lot: '7257896401',
      fromPage: '1',
      toPage: '3',
      shift: 'M',
      idate: '3',
      controlprint: {
        ft: true,
        lt: true
      },
      unit: 'HDPE',
      template: 'template3',
      title1: 'HDPE',
      title2: 'HIGHT DENSITY POLYETHYLENE',
      sirim_title1: 'Certified to MS1058 : PART 1 : 2005',
      sirim_title2: 'Certified No. : PC004152',
      sirim_title3: 'Designation : PE100'
    },

    // Example 2: P921BK/750
    p921bk750: {
      grade: 'P921BK/750',
      netweight: '750',
      lot: '9258554555',
      fromPage: '1',
      toPage: '3',
      shift: 'M',
      idate: '3',
      controlprint: {
        ft: false,
        lt: false
      },
      unit: 'HDPE',
      template: 'template3',
      title1: 'HDPE',
      title2: 'HIGH DENSITY POLYETHYLENE',
      sirim_title1: 'Certified to MS1058 : PART 1 : 2005',
      sirim_title2: 'Certified No. : PC004152',
      sirim_title3: 'Designation : PE100'
    },

    // Example 3: Heavy grade with 18000kg (P901BK/SB pattern)
    heavy18000: {
      grade: 'P901BK/SB/18000',
      netweight: '18000',
      lot: '9250000456',
      fromPage: '1',
      toPage: '5',
      shift: 'E',
      idate: '28',
      controlprint: {
        ft: true,
        lt: true
      },
      unit: 'HDPE',
      template: 'template3',
      title1: 'HDPE',
      title2: 'HIGH DENSITY POLYETHYLENE',
      sirim_title1: 'Certified to MS1058 : PART 1 : 2005',
      sirim_title2: 'Certified No. : PC004152',
      sirim_title3: 'Designation : PE100'
    },

    // Example 4: Natural color grade
    natural: {
      grade: 'P921NT/750',
      netweight: '750',
      lot: '9258887755',
      fromPage: '1',
      toPage: '2',
      shift: 'N',
      idate: '3',
      controlprint: {
        ft: false,
        lt: true
      },
      unit: 'HDPE',
      template: 'template2',
      title1: 'HDPE',
      title2: 'HIGH DENSITY POLYETHYLENE',
      sirim_title1: 'Certified to MS1058 : PART 1 : 2005',
      sirim_title2: 'Certified No. : PC004152',
      sirim_title3: 'Designation : PE100'
    },

    // Example 4: Injection grade
    injection: {
      grade: 'I055BK/750',
      netweight: '750',
      lot: '9255443322',
      fromPage: '1',
      toPage: '4',
      shift: 'M',
      idate: '3',
      controlprint: {
        ft: true,
        lt: true
      },
      unit: 'HDPE',
      template: 'template3',
      title1: 'HDPE',
      title2: 'HIGH DENSITY POLYETHYLENE',
      sirim_title1: 'Certified to MS1058 : PART 1 : 2005',
      sirim_title2: 'Certified No. : PC004152',
      sirim_title3: 'Designation : PE100'
    }
  },

  /**
   * PP Unit Mock Data
   */
  PP: {
    // Example 1: Standard grade
    regular750: {
      grade: '1105SC/750',
      netweight: '750',
      lot: '7258554555',
      fromPage: '1',
      toPage: '3',
      shift: 'M',
      idate: '3',
      controlprint: {
        ft: true,
        lt: true
      },
      unit: 'PP',
      template: 'template2',
      title1: 'PP',
      title2: 'POLYPROPYLENE'
    },

    // Example 2: Film grade heavy
    film18000: {
      grade: 'PP600BK/18000',
      netweight: '18000',
      lot: '7250000456',
      fromPage: '1',
      toPage: '5',
      shift: 'E',
      idate: '3',
      controlprint: {
        ft: true,
        lt: true
      },
      unit: 'PP',
      template: 'template2',
      title1: 'PP',
      title2: 'POLYPROPYLENE'
    }
  },

  /**
   * PPC Unit Mock Data
   */
  PPC: {
    // Example 1: Standard grade
    regular750: {
      grade: 'FL203D/750',
      netweight: '750',
      lot: '6258554555',
      fromPage: '1',
      toPage: '3',
      shift: 'M',
      idate: '3',
      controlprint: {
        ft: true,
        lt: true
      },
      unit: 'PPC',
      template: 'template2',
      title1: 'PPC',
      title2: 'POLYPROPYLENE COPOLYMER'
    },

    // Example 2: Random copolymer
    random: {
      grade: 'PPC400NT/750',
      netweight: '750',
      lot: '6258887755',
      fromPage: '1',
      toPage: '2',
      shift: 'E',
      idate: '3',
      controlprint: {
        ft: false,
        lt: true
      },
      unit: 'PPC',
      template: 'template2',
      title1: 'PPC',
      title2: 'POLYPROPYLENE COPOLYMER'
    }
  }
};

/**
 * Mock Data Manager - Helper functions for working with mock data
 */
class MockDataManager {
  constructor() {
    this.data = MockData;
  }

  /**
   * Get mock data for a specific unit and example
   * @param {string} unit - Unit name (HDPE, PP, PPC)
   * @param {string} example - Example name (regular750, heavy18000, etc.)
   * @returns {object} Mock data object
   */
  getMockData(unit, example = 'regular750') {
    if (!this.data[unit]) {
      console.warn(`Unit "${unit}" not found in mock data. Using HDPE.`);
      unit = 'HDPE';
    }

    const unitData = this.data[unit];
    
    // If example doesn't exist, use first available
    if (!unitData[example]) {
      const firstExample = Object.keys(unitData)[0];
      console.warn(`Example "${example}" not found. Using "${firstExample}".`);
      return unitData[firstExample];
    }

    return unitData[example];
  }

  /**
   * Get all examples for a unit
   * @param {string} unit - Unit name
   * @returns {array} Array of example names
   */
  getUnitExamples(unit) {
    if (!this.data[unit]) {
      console.warn(`Unit "${unit}" not found.`);
      return [];
    }
    return Object.keys(this.data[unit]);
  }

  /**
   * Get random mock data for a unit
   * @param {string} unit - Unit name
   * @returns {object} Random mock data
   */
  getRandomMockData(unit) {
    const examples = this.getUnitExamples(unit);
    if (examples.length === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * examples.length);
    return this.getMockData(unit, examples[randomIndex]);
  }

  /**
   * Load mock data into form
   * @param {object} formComponent - Form component instance
   * @param {string} unit - Unit name
   * @param {string} example - Example name
   */
  loadIntoForm(formComponent, unit, example) {
    const mockData = this.getMockData(unit, example);
    
    // Update form state
    formComponent.state.formData = { ...mockData };
    formComponent.state.unit = mockData.unit;
    formComponent.state.template = mockData.template;
    
    // Restore to UI
    formComponent.restoreFormState();
    
    console.log(`✅ Loaded mock data: ${unit} - ${example}`);
    return mockData;
  }

  /**
   * Save current form data as mock example
   * @param {object} formData - Current form data
   * @param {string} unit - Unit name
   * @param {string} exampleName - Name for this example
   */
  saveMockExample(formData, unit, exampleName) {
    if (!this.data[unit]) {
      this.data[unit] = {};
    }
    
    this.data[unit][exampleName] = { ...formData };
    console.log(`✅ Saved mock example: ${unit} - ${exampleName}`);
  }

  /**
   * Export mock data as JSON string
   * @returns {string} JSON string
   */
  exportJSON() {
    return JSON.stringify(this.data, null, 2);
  }

  /**
   * Print mock data summary to console
   */
  printSummary() {
    console.log('📦 Mock Data Summary:');
    console.log('═══════════════════════════════════════');
    
    Object.keys(this.data).forEach(unit => {
      const examples = Object.keys(this.data[unit]);
      console.log(`\n${unit} (${examples.length} examples):`);
      examples.forEach(example => {
        const data = this.data[unit][example];
        console.log(`  • ${example}: ${data.grade} (${data.netweight}kg)`);
      });
    });
    
    console.log('\n═══════════════════════════════════════');
  }
}

// Global utility functions
const MockUtils = {
  /**
   * Quick load mock data by unit
   */
  loadHDPE() {
    const manager = new MockDataManager();
    return manager.getMockData('HDPE', 'regular750');
  },
  
  loadPP() {
    const manager = new MockDataManager();
    return manager.getMockData('PP', 'regular750');
  },
  
  loadPPC() {
    const manager = new MockDataManager();
    return manager.getMockData('PPC', 'regular750');
  },

  /**
   * Load heavy weight example
   */
  loadHeavy(unit = 'HDPE') {
    const manager = new MockDataManager();
    return manager.getMockData(unit, 'heavy18000');
  }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MockData, MockDataManager, MockUtils };
} else {
  window.MockData = MockData;
  window.MockDataManager = MockDataManager;
  window.MockUtils = MockUtils;
}

// Console helper message
console.log('%c📦 Mock Data System Loaded', 'font-size: 14px; font-weight: bold; color: #2ecc71;');
console.log('%cQuick commands:', 'font-size: 12px; color: #666;');
console.log('  MockUtils.loadHDPE()  - Load HDPE example');
console.log('  MockUtils.loadPP()    - Load PP example');
console.log('  MockUtils.loadPPC()   - Load PPC example');
console.log('  new MockDataManager().printSummary() - Show all examples');
