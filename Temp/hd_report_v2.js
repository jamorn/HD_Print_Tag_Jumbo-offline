/* ========================================
   HD Report V2 - Template System
   ======================================== */

// Global Variables
let currentTemplate = 'template3';
let printData = null;
let guideVisible = false;

// Template Configurations
const TEMPLATES = {
  template1: {
    id: 'template1',
    name: 'Product Description Only',
    description: 'แสดงเฉพาะ Product Description (HDPE + HIGHT DENSITY POLYETHYLENE)',
    features: [
      'Product Title 1: HDPE',
      'Product Title 2: HIGHT DENSITY POLYETHYLENE',
      'No logos displayed'
    ],
    leftSection: {
      showProductDescription: true,
      showMfgLogo: false,
      showQRLogo: false,
      showSirimLogo: false,
      showSirimText: false
    }
  },
  template2: {
    id: 'template2',
    name: 'Description + Logos',
    description: 'แสดง Product Description + MFG Logo + QR Code',
    features: [
      'Product Title 1: HDPE',
      'Product Title 2: HIGHT DENSITY POLYETHYLENE',
      'MFG Logo (TIS2559-2544)',
      'QR Code (IRPC TIS)',
      'No Sirim certification'
    ],
    leftSection: {
      showProductDescription: true,
      showMfgLogo: true,
      showQRLogo: true,
      showSirimLogo: false,
      showSirimText: false
    }
  },
  template3: {
    id: 'template3',
    name: 'Full Certifications',
    description: 'แสดงครบทุกอย่าง: Description + All Logos + Sirim Certification',
    features: [
      'Product Title 1: HDPE',
      'Product Title 2: HIGHT DENSITY POLYETHYLENE',
      'MFG Logo (TIS2559-2544)',
      'QR Code (IRPC TIS)',
      'Sirim Logo',
      'Sirim Certification Text (3 lines)'
    ],
    leftSection: {
      showProductDescription: true,
      showMfgLogo: true,
      showQRLogo: true,
      showSirimLogo: true,
      showSirimText: true
    }
  }
};

// ========================================
// Initialize on Page Load
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  // Load data from sessionStorage
  loadPrintData();
  
  // Generate print pages
  if (printData) {
    generatePrintPages();
    updateSpecsContent();
  } else {
    showNoDataMessage();
  }
});

// ========================================
// Data Loading
// ========================================
function loadPrintData() {
  try {
    const storedData = sessionStorage.getItem('hd_pellet');
    if (storedData) {
      printData = JSON.parse(storedData);
      console.log('✅ Loaded print data:', printData);
    } else {
      console.warn('⚠️ No print data found in sessionStorage');
      // Use mock data for testing
      printData = getMockData();
    }
  } catch (error) {
    console.error('❌ Error loading print data:', error);
    printData = getMockData();
  }
}

function getMockData() {
  return {
    grade: 'P901BK/SB/18000',
    lot: '9258554555',
    netweight: '18000',
    title1: 'HDPE',
    title2: 'HIGHT DENSITY POLYETHYLENE',
    sirim_title1: 'Certified to MS1058 : PART 1 : 2005',
    sirim_title2: 'Certified No. : PC004152',
    sirim_title3: 'Designation : PE100',
    idate: '1',
    shift: 'M',
    fromPage: 1,
    toPage: 3,
    controlprint: '0', // No FT/LT by default
    tis: 'Y'
  };
}

function showNoDataMessage() {
  document.getElementById('printArea').innerHTML = `
    <div style="padding: 50px; text-align: center;">
      <h2>⚠️ ไม่พบข้อมูลสำหรับพิมพ์</h2>
      <p>กรุณากรอกข้อมูลในหน้าแรกและกด "Print Preview" อีกครั้ง</p>
      <button onclick="window.close()" style="padding: 10px 20px; font-size: 16px; cursor: pointer;">ปิดหน้าต่าง</button>
    </div>
  `;
}

// ========================================
// Template Management
// ========================================
function changeTemplate() {
  const select = document.getElementById('templateSelect');
  currentTemplate = select.value;
  console.log('🎨 Template changed to:', currentTemplate);
  
  // Regenerate pages with new template
  generatePrintPages();
}

// ========================================
// Print Page Generation
// ========================================
function generatePrintPages() {
  const fromPage = parseInt(printData.fromPage) || 1;
  const toPage = parseInt(printData.toPage) || 1;
  
  const printArea = document.getElementById('printArea');
  printArea.innerHTML = '';
  printArea.className = currentTemplate; // Apply template class
  
  // Generate each page
  for (let pageNum = fromPage; pageNum <= toPage; pageNum++) {
    const pageHTML = renderPage(pageNum);
    printArea.innerHTML += pageHTML;
  }
  
  console.log(`📄 Generated ${toPage - fromPage + 1} pages`);
}

function renderPage(pageNumber) {
  const control = parseInt(printData.controlprint, 10);
  const ftDisplay = (control & 2) !== 0 && pageNumber === parseInt(printData.fromPage, 10);
  const ltDisplay = (control & 1) !== 0 && pageNumber === parseInt(printData.toPage, 10);
  
  return `
    <div class="sheet">
      ${renderRightSection(pageNumber)}
      ${renderLeftSection()}
      ${ftDisplay ? renderFTMarker() : ''}
      ${ltDisplay ? renderLTMarker() : ''}
    </div>
  `;
}

// ========================================
// Right Section (Fixed Pattern)
// ========================================
function renderRightSection(pageNumber) {
  return `
    ${renderGrade()}
    ${renderLot()}
    ${renderNetWeight()}
    ${renderRunningNumber(pageNumber)}
  `;
}

function renderGrade() {
  const grade = printData.grade || 'N/A';
  
  // Special handling for P901BK/SB/xxxx pattern - only show P901BK/SB
  let displayGrade = grade;
  if (grade.startsWith("P901BK/SB/")) {
    const parts = grade.split("/");
    displayGrade = parts[0] + "/" + parts[1]; // P901BK/SB only
    // weightPart will be shown in NET WEIGHT field instead
  }
  
  // Dynamic font sizing based on grade length
  const gradeLength = displayGrade.length;
  let fontSize;
  
  if (gradeLength <= 10) fontSize = 60;
  else if (gradeLength <= 12) fontSize = 50;
  else if (gradeLength <= 15) fontSize = 42;
  else fontSize = 36;
  
  // Center alignment in right section: ใช้ right section width และ text-align: center
  return `<div style="
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
  ">${displayGrade}</div>`;
}

function renderLot() {
  const lot = printData.lot || 'N/A';
  return `<div style="position: absolute; left: 780px; top: 220px; font-size: 50px; color: black; margin: 0; text-align: left; white-space: nowrap;">${lot}</div>`;
}

function renderNetWeight() {
  // Always show net weight (removed P901BK/SB hide logic)
  const netweight = printData.netweight || 'N/A';
  return `<div style="position: absolute; left: 870px; top: 330px; font-size: 50px; color: black; margin: 0; text-align: left; white-space: nowrap;">${netweight}</div>`;
}

function renderRunningNumber(pageNumber) {
  const runningNumber = String(pageNumber).padStart(3, "0");
  const date = String(printData.idate).padStart(2, "0");
  const shift = printData.shift;
  
  const boxes = [];
  
  // Running number boxes
  for (let i = 0; i < runningNumber.length; i++) {
    boxes.push(`<div style="border: 2px solid black; width: 35px; height: 35px; display: inline-block; text-align: center; line-height: 31px; margin: 0 3px; font-size: 30px; vertical-align: top; font-family: Arial, sans-serif;">${runningNumber[i]}</div>`);
  }
  
  // Separator
  boxes.push(`<div style="display: inline-block; text-align: center; line-height: 31px; width: 15px; height: 35px; margin: 0 3px; font-size: 40px; vertical-align: top; font-family: Arial, sans-serif;">-</div>`);
  
  // Date boxes
  for (let i = 0; i < date.length; i++) {
    boxes.push(`<div style="border: 2px solid black; width: 35px; height: 35px; display: inline-block; text-align: center; line-height: 31px; margin: 0 3px; font-size: 30px; vertical-align: top; font-family: Arial, sans-serif;">${date[i]}</div>`);
  }
  
  // Separator
  boxes.push(`<div style="display: inline-block; text-align: center; line-height: 31px; width: 15px; height: 35px; margin: 0 3px; font-size: 40px; vertical-align: top; font-family: Arial, sans-serif;">-</div>`);
  
  // Shift box
  boxes.push(`<div style="border: 2px solid black; width: 35px; height: 35px; display: inline-block; text-align: center; line-height: 31px; margin: 0 3px; font-size: 30px; vertical-align: top; font-family: Arial, sans-serif;">${shift}</div>`);
  
  return `<div style="position: absolute; left: 775px; top: 448px; white-space: nowrap; font-size: 0;">${boxes.join('')}</div>`;
}

// ========================================
// Helper: Calculate Logo Positions
// ========================================
function getLogoPositions() {
  // Check current template to determine positioning
  const config = TEMPLATES[currentTemplate].leftSection;
  
  // Template 2: Description + Logos only (no Sirim) - Center the logos
  if (config.showMfgLogo && config.showQRLogo && !config.showSirimLogo) {
    return {
      mfgLeft: 140,    // ย้าย MFG มาตรงกลาง
      qrLeft: 270,     // ย้าย QR มาถัดจาก MFG
      sirimLeft: 320,  // ไม่แสดง
      sirimDetailLeft: 250
    };
  }
  
  // Default: Template 3 - All logos shown
  return {
    mfgLeft: 35,     // ตำแหน่งเดิม
    qrLeft: 180,     // ตำแหน่งเดิม
    sirimLeft: 320,  // ตำแหน่งเดิม
    sirimDetailLeft: 250
  };
}

// ========================================
// Left Section (Variable by Template)
// ========================================
function renderLeftSection() {
  const config = TEMPLATES[currentTemplate].leftSection;
  
  return `
    ${config.showProductDescription ? renderProductDescription() : ''}
    ${config.showMfgLogo ? renderMfgLogo() : ''}
    ${config.showQRLogo ? renderQRLogo() : ''}
    ${config.showSirimLogo ? renderSirimLogo() : ''}
    ${config.showSirimText ? renderSirimText() : ''}
  `;
}

function renderProductDescription() {
  const title1 = printData.title1 || 'HDPE';
  const title2 = printData.title2 || 'HIGHT DENSITY POLYETHYLENE';
  
  return `
    <div style="position: absolute; left: 172px; top: 240px; font-size: 60px; text-align: left; white-space: nowrap;">${title1}</div>
    <div style="position: absolute; left: 37px; top: 320px; font-size: 30px; text-align: left; white-space: nowrap;">${title2}</div>
  `;
}

function renderMfgLogo() {
  const config = TEMPLATES[currentTemplate].leftSection;
  if (!config.showMfgLogo) return ''; // Template doesn't want logo
  
  const positions = getLogoPositions();
  return `<div style="position: absolute; top: 430px; left: ${positions.mfgLeft}px;"><img src="images/TIS2559-2544.png" style="width: 120px !important;" /></div>`;
}

function renderQRLogo() {
  const config = TEMPLATES[currentTemplate].leftSection;
  if (!config.showQRLogo) return ''; // Template doesn't want logo
  
  const positions = getLogoPositions();
  return `<div style="position: absolute; top: 430px; left: ${positions.qrLeft}px;"><img src="images/irpc_tis.png" style="width: 110px !important;" /></div>`;
}

function renderSirimLogo() {
  const config = TEMPLATES[currentTemplate].leftSection;
  if (!config.showSirimLogo) return ''; // Template doesn't want logo
  
  const positions = getLogoPositions();
  return `<div style="position: absolute; top: 430px; left: ${positions.sirimLeft}px;"><img src="images/sirim_logo.png" style="width: 150px !important;" /></div>`;
}

function renderSirimText() {
  const config = TEMPLATES[currentTemplate].leftSection;
  if (!config.showSirimText) return ''; // Template doesn't want text
  
  const line1 = printData.sirim_title1 || '';
  const line2 = printData.sirim_title2 || '';
  const line3 = printData.sirim_title3 || '';
  
  const positions = getLogoPositions();
  return `
    <div style="position: absolute; top: 550px; left: ${positions.sirimDetailLeft}px; font-size: 10px; line-height: 1.3; font-family: Arial, Helvetica, sans-serif;">
      ${line1}<br>
      ${line2}<br>
      ${line3}
    </div>
  `;
}

function renderFTMarker() {
  return `<div style="position: absolute; top: 345px; left: 180px;"><p style="font-size: 50px; margin: 0;">(F/T)</p></div>`;
}

function renderLTMarker() {
  return `<div style="position: absolute; top: 345px; left: 180px;"><p style="font-size: 50px; margin: 0;">(L/T)</p></div>`;
}

// ========================================
// Help Panel Functions
// ========================================
function toggleGuide() {
  const panel = document.getElementById('guidePanel');
  guideVisible = !guideVisible;

  if (guideVisible) {
    panel.classList.add('show');
    updateSpecsContent();
  } else {
    panel.classList.remove('show');
  }
}

function closeGuide() {
  document.getElementById('guidePanel').classList.remove('show');
  guideVisible = false;
}

function switchTab(tabName) {
  // Hide all tabs
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  
  // Remove active class from all buttons
  document.querySelectorAll('.guide-tab').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Show selected tab
  document.getElementById(`tab-${tabName}`).style.display = 'block';
  
  // Add active class to clicked button
  event.target.classList.add('active');
}

function updateSpecsContent() {
  if (!printData) return;
  
  const fromPage = printData.fromPage || 1;
  const toPage = printData.toPage || 1;
  const sampleRunning = `${String(fromPage).padStart(3, '0')}-${String(printData.idate).padStart(2, '0')}-${printData.shift}`;
  
  // Calculate actual font size for current grade
  const gradeLength = (printData.grade || '').length;
  let gradeFontSize;
  if (gradeLength <= 10) gradeFontSize = '60px (45pt)';
  else if (gradeLength <= 12) gradeFontSize = '50px (38pt)';
  else if (gradeLength <= 15) gradeFontSize = '42px (32pt)';
  else gradeFontSize = '36px (27pt)';
  
  // Grade
  document.getElementById('spec-grade').innerHTML = 
    `<strong>Font:</strong> Arial, Helvetica<br>` +
    `<strong>Size:</strong> ${gradeFontSize}<br>` +
    `<strong>Weight:</strong> Bold<br>` +
    `<strong>Value:</strong> <code style="font-size: 13px;">${printData.grade || 'N/A'}</code><br>` +
    `<em>ชื่อผลิตภัณฑ์หลัก แสดงที่ด้านบน</em>`;
  
  // Net Weight
  document.getElementById('spec-netweight').innerHTML = 
    `<strong>Font:</strong> Arial, Helvetica<br>` +
    `<strong>Size:</strong> 50px (38pt)<br>` +
    `<strong>Weight:</strong> Bold<br>` +
    `<strong>Value:</strong> <code style="font-size: 13px;">${printData.netweight || 'N/A'}</code><br>` +
    `<em>น้ำหนักสุทธิ แสดงค่าต่ำกว่า Grade</em>`;
  
  // Running Number
  document.getElementById('spec-running').innerHTML = 
    `<strong>Font:</strong> Arial, sans-serif<br>` +
    `<strong>Size:</strong> 30px (23pt)<br>` +
    `<strong>Weight:</strong> Bold<br>` +
    `<strong>Format:</strong> XXX-DD-S<br>` +
    `<strong>From-To:</strong> <code style="font-size: 13px;">${fromPage}-${toPage}</code><br>` +
    `<strong>Sample:</strong> <code style="font-size: 13px;">${sampleRunning}</code><br>` +
    `<em>เลขหน้า-วันที่-กะ (ตัวอย่าง: 001-28-E)</em>`;
  
  // Product Description
  document.getElementById('spec-description').innerHTML = 
    `<strong>Font:</strong> Arial, Helvetica<br>` +
    `<strong>Size:</strong> Title1: 60px (45pt), Title2: 30px (23pt)<br>` +
    `<strong>Weight:</strong> Normal<br>` +
    `<strong>Title1:</strong> <code style="font-size: 13px;">${printData.title1 || 'HDPE'}</code><br>` +
    `<strong>Title2:</strong> <code style="font-size: 13px;">${printData.title2 || 'HIGHT DENSITY POLYETHYLENE'}</code><br>` +
    `<em>คำอธิบายผลิตภัณฑ์ 2 บรรทัด</em>`;
  
  // Sirim Certification
  const sirimInfo = printData.sirim_title1 ? 
    `<strong>Line 1:</strong> <code style="font-size: 11px;">${printData.sirim_title1}</code><br>` +
    `<strong>Line 2:</strong> <code style="font-size: 11px;">${printData.sirim_title2}</code><br>` +
    `<strong>Line 3:</strong> <code style="font-size: 11px;">${printData.sirim_title3}</code><br>` +
    `<em>ข้อมูลการรับรอง Sirim 3 บรรทัด</em>` :
    `<em>ไม่มีข้อมูล Sirim Certification</em>`;
  
  document.getElementById('spec-sirim').innerHTML = 
    `<strong>Font:</strong> Arial, Helvetica<br>` +
    `<strong>Size:</strong> 10px (8pt)<br>` +
    `<strong>Weight:</strong> Normal<br>` +
    sirimInfo;
}

// Event Listeners
document.addEventListener('click', function(event) {
  const panel = document.getElementById('guidePanel');
  const btn = document.querySelector('.print-guide-btn');
  
  if (!panel.contains(event.target) && !btn.contains(event.target)) {
    closeGuide();
  }
});

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeGuide();
  }
});

console.log('✅ HD Report V2 - Template System initialized');
