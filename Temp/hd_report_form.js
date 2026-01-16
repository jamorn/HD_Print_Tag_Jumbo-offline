/* ========================================
   HD Report Form - Autocomplete & Form Logic
   ======================================== */

// Global Variables
let allGrades = [];
let selectedGradeData = null;

// ========================================
// Initialize Form
// ========================================
document.addEventListener('DOMContentLoaded', function() {
  console.log('🚀 Form initialized');
  
  // Load grades from hdpe_pellet.js
  if (typeof hdpe_pellet_data !== 'undefined') {
    allGrades = hdpe_pellet_data.pellets || [];
    console.log(`📊 Loaded ${allGrades.length} grades`);
  }
  
  // Initialize date selector
  initializeDateSelector();
  
  // Initialize shift selector with auto-detect
  initializeShiftSelector();
  
  // Initialize lot counter
  initializeLotCounter();
  
  // Load saved data if exists
  loadSavedData();
});

// ========================================
// Date Selector
// ========================================
function initializeDateSelector() {
  const idateSelect = document.getElementById('idate');
  const today = new Date().getDate();
  
  // Generate 1-31 days
  for (let i = 1; i <= 31; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i;
    if (i === today) {
      option.selected = true;
    }
    idateSelect.appendChild(option);
  }
}

// ========================================
// Shift Selector with Auto-detect
// ========================================
function initializeShiftSelector() {
  const shiftSelect = document.getElementById('shift');
  const currentHour = new Date().getHours();
  
  // Shift logic from shift_compare.js
  let defaultShift;
  if (currentHour >= 6 && currentHour < 14) {
    defaultShift = 'M'; // กะเช้า (06:00-13:59)
  } else if (currentHour >= 14 && currentHour < 22) {
    defaultShift = 'E'; // กะบ่าย (14:00-21:59)
  } else {
    defaultShift = 'N'; // กะดึก (22:00-05:59)
  }
  
  shiftSelect.value = defaultShift;
  console.log(`⏰ Auto-selected shift: ${defaultShift} (Hour: ${currentHour})`);
}

// ========================================
// Lot Counter
// ========================================
function initializeLotCounter() {
  const lotInput = document.getElementById('lot');
  const lotCounter = document.getElementById('lot-counter');
  
  lotInput.addEventListener('input', function(e) {
    const length = e.target.value.length;
    
    if (length === 10) {
      lotCounter.textContent = `✅ ${length}/10 ตัว (ครบถ้วน)`;
      lotCounter.style.color = '#28a745';
    } else if (length > 0) {
      lotCounter.textContent = `${length}/10 ตัว`;
      lotCounter.style.color = '#dc3545';
    } else {
      lotCounter.textContent = '';
    }
  });
  
  // Only allow numbers
  lotInput.addEventListener('keydown', function(e) {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
    
    if (e.ctrlKey || e.metaKey) return; // Allow Ctrl+A, Ctrl+C, etc.
    
    if (!/^[0-9]$/.test(e.key) && !allowedKeys.includes(e.key)) {
      e.preventDefault();
    }
    
    if (/^[0-9]$/.test(e.key) && e.target.value.length >= 10) {
      e.preventDefault();
    }
  });
}

// ========================================
// Grade Autocomplete
// ========================================
function validateGradeInput(e) {
  const key = e.key;
  
  // Allow: a-z, A-Z, 0-9, /, Backspace, Delete, Arrow keys, Tab, Enter, Ctrl+A, Ctrl+C, etc.
  const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Home', 'End'];
  
  // Allow Ctrl/Cmd shortcuts
  if (e.ctrlKey || e.metaKey) {
    return;
  }
  
  // Allow a-z, A-Z, 0-9, /
  if (/^[a-zA-Z0-9/]$/.test(key)) {
    return;
  }
  
  // Allow special keys
  if (allowedKeys.includes(key)) {
    return;
  }
  
  // Block everything else (including Thai characters)
  e.preventDefault();
}

function handleGradeInput(value) {
  const autocompleteList = document.getElementById('gradeAutocomplete');
  
  if (!value || value.length < 1) {
    autocompleteList.classList.remove('show');
    return;
  }
  
  // Filter grades
  const searchTerm = value.toLowerCase();
  const matches = allGrades.filter(g => 
    g.Grade.toLowerCase().includes(searchTerm)
  ).slice(0, 5); // Limit to 5 results
  
  if (matches.length === 0) {
    autocompleteList.innerHTML = '<div class="autocomplete-no-result">ไม่พบผลลัพธ์</div>';
    autocompleteList.classList.add('show');
    return;
  }
  
  // Render autocomplete items
  autocompleteList.innerHTML = matches.map((grade, index) => {
    const highlighted = grade.Grade.replace(
      new RegExp(value, 'gi'), 
      match => `<strong>${match}</strong>`
    );
    return `<div class="autocomplete-item" data-index="${index}" onclick="selectGrade('${grade.Grade}')">${highlighted}</div>`;
  }).join('');
  
  autocompleteList.classList.add('show');
}

function selectGrade(gradeName) {
  const gradeInput = document.getElementById('grade');
  const autocompleteList = document.getElementById('gradeAutocomplete');
  
  // Find full grade data
  selectedGradeData = allGrades.find(g => g.Grade === gradeName);
  
  if (selectedGradeData) {
    let displayGrade = selectedGradeData.Grade;
    
    // Special handling: Grade containing "SB" - trim to xxxx/xxxxx only
    if (displayGrade.includes('SB') && displayGrade.includes('/')) {
      const parts = displayGrade.split('/');
      if (parts.length === 3) {
        // xxxx/SB/18000 -> xxxx/SB
        displayGrade = parts[0] + '/' + parts[1];
      } else if (parts.length === 2) {
        // xxxx/750 -> keep as is
        displayGrade = displayGrade;
      }
    }
    
    gradeInput.value = displayGrade;
    
    // Extract net weight from ORIGINAL grade (e.g., P901BK/SB/18000 -> 18000)
    const parts = selectedGradeData.Grade.split('/');
    const netweight = parts[parts.length - 1];
    
    if (!isNaN(netweight)) {
      document.getElementById('netweight').value = netweight;
      
      // Auto-generate Lot based on netweight
      generateLot(parseInt(netweight));
    }
    
    console.log('✅ Selected grade:', selectedGradeData);
    console.log('📝 Display grade:', displayGrade);
  }
  
  autocompleteList.classList.remove('show');
}

function generateLot(netweight) {
  const lotInput = document.getElementById('lot');
  const currentYear = new Date().getFullYear();
  const twoDigitYear = currentYear.toString().slice(-2);
  
  // Array of netweights that should start with 9
  const lotStartWithNine = [1650, 1800, 16500, 18000];
  
  let lotPrefix;
  if (lotStartWithNine.includes(netweight)) {
    lotPrefix = '9' + twoDigitYear;
  } else {
    lotPrefix = netweight.toString().charAt(0) + twoDigitYear;
  }
  
  // If lot is empty or user hasn't customized it, set the prefix
  if (!lotInput.value || lotInput.value.length < 3) {
    lotInput.value = lotPrefix;
  }
}

// Close autocomplete when clicking outside
document.addEventListener('click', function(e) {
  const gradeInput = document.getElementById('grade');
  const autocompleteList = document.getElementById('gradeAutocomplete');
  
  if (!gradeInput.contains(e.target) && !autocompleteList.contains(e.target)) {
    autocompleteList.classList.remove('show');
  }
});

// ========================================
// Form Actions
// ========================================
function submitAndGenerate() {
  // Validate form
  if (!validateForm()) {
    return;
  }
  
  // Calculate controlprint
  const controlprint = calculateControlPrint();
  
  // Get form data
  const formData = {
    grade: document.getElementById('grade').value,
    netweight: document.getElementById('netweight').value,
    lot: document.getElementById('lot').value,
    fromPage: document.getElementById('frompage').value,
    toPage: document.getElementById('topage').value,
    shift: document.getElementById('shift').value,
    idate: document.getElementById('idate').value,
    tis: selectedGradeData?.tis || 'Y',
    controlprint: controlprint,
    title1: selectedGradeData?.title1 || 'HDPE',
    title2: selectedGradeData?.title2 || 'HIGHT DENSITY POLYETHYLENE',
    sirim_title1: selectedGradeData?.sirim_title1 || 'Certified to MS1058 : PART 1 : 2005',
    sirim_title2: selectedGradeData?.sirim_title2 || 'Certified No. : PC004152',
    sirim_title3: selectedGradeData?.sirim_title3 || 'Designation : PE100'
  };
  
  // Save to sessionStorage with key 'hd_pellet'
  sessionStorage.setItem('hd_pellet', JSON.stringify(formData));
  
  console.log('✅ Form submitted:', formData);
  
  // Reload print data and regenerate
  printData = formData;
  generatePrintPages();
  
  // Hide form panel after generating
  const formPanel = document.getElementById('formPanel');
  formPanel.classList.remove('show');
  
  // Show success message
  showMessage('✅ สร้างตัวอย่างเรียบร้อย', 'success');
}

function clearForm() {
  document.getElementById('grade').value = '';
  document.getElementById('netweight').value = '';
  document.getElementById('lot').value = '';
  document.getElementById('frompage').value = '1';
  document.getElementById('topage').value = '3';
  
  // Reset shift to current time (not hardcoded 'M')
  initializeShiftSelector();
  
  // Reset date to today
  const today = new Date().getDate();
  document.getElementById('idate').value = today;
  
  // Reset checkboxes to default (none)
  document.getElementById('ft').checked = false;
  document.getElementById('lt').checked = false;
  
  selectedGradeData = null;
  
  // Clear sessionStorage
  sessionStorage.removeItem('hd_pellet');
  
  console.log('🔄 Form cleared');
  showMessage('🔄 ล้างฟอร์มเรียบร้อย', 'info');
}

function validateForm() {
  const grade = document.getElementById('grade').value.trim();
  const netweight = document.getElementById('netweight').value.trim();
  const lot = document.getElementById('lot').value.trim();
  const frompage = parseInt(document.getElementById('frompage').value);
  const topage = parseInt(document.getElementById('topage').value);
  
  if (!grade) {
    showMessage('❌ กรุณาเลือก Grade', 'error');
    return false;
  }
  
  if (!netweight) {
    showMessage('❌ กรุณากรอก Net Weight', 'error');
    return false;
  }
  
  if (lot.length !== 10) {
    showMessage('❌ Lot ต้องมี 10 ตัวอักษร', 'error');
    return false;
  }
  
  if (frompage < 1 || topage < 1) {
    showMessage('❌ From/To Page ต้องมากกว่าหรือเท่ากับ 1', 'error');
    return false;
  }
  
  if (frompage > topage) {
    showMessage('❌ From Page ต้องน้อยกว่าหรือเท่ากับ To Page', 'error');
    return false;
  }
  
  return true;
}

function calculateControlPrint() {
  let controlprint = 0;
  
  // FT = bit 2, LT = bit 1
  if (document.getElementById('ft').checked) controlprint += 2;
  if (document.getElementById('lt').checked) controlprint += 1;
  
  return controlprint.toString();
}

function showMessage(message, type) {
  // Simple console log for now
  console.log(`${type.toUpperCase()}: ${message}`);
  
  // TODO: Implement toast notification or alert
  if (type === 'error') {
    alert(message);
  }
}

function loadSavedData() {
  const savedData = sessionStorage.getItem('hd_pellet');
  
  if (!savedData) return;
  
  try {
    const data = JSON.parse(savedData);
    
    document.getElementById('grade').value = data.grade || '';
    document.getElementById('netweight').value = data.netweight || '';
    document.getElementById('lot').value = data.lot || '';
    document.getElementById('frompage').value = data.fromPage || '1';
    document.getElementById('topage').value = data.toPage || '3';
    document.getElementById('shift').value = data.shift || 'M';
    document.getElementById('idate').value = data.idate || new Date().getDate();
    
    // Set checkboxes (FT=2, LT=1)
    const controlprint = parseInt(data.controlprint || '0');
    document.getElementById('ft').checked = (controlprint & 2) !== 0;
    document.getElementById('lt').checked = (controlprint & 1) !== 0;
    
    // Find and set selected grade data
    if (data.grade) {
      selectedGradeData = allGrades.find(g => g.Grade === data.grade) || {
        Grade: data.grade,
        tis: data.tis,
        title1: data.title1,
        title2: data.title2,
        sirim_title1: data.sirim_title1,
        sirim_title2: data.sirim_title2,
        sirim_title3: data.sirim_title3
      };
    }
    
    console.log('📂 Loaded saved data');
  } catch (error) {
    console.error('❌ Error loading saved data:', error);
  }
}

// ========================================
// Form Panel Toggle
// ========================================
function toggleFormPanel() {
  const formPanel = document.getElementById('formPanel');
  formPanel.classList.toggle('show');
}

// Function for collapse header (not used for main toggle)
function toggleFormContent() {
  const formContent = document.getElementById('formContent');
  const collapseIcon = document.getElementById('collapse-icon');
  const collapseBtn = document.querySelector('.collapse-btn');
  
  if (formContent.classList.contains('hidden')) {
    formContent.classList.remove('hidden');
    collapseBtn.classList.remove('collapsed');
  } else {
    formContent.classList.add('hidden');
    collapseBtn.classList.add('collapsed');
  }
}

console.log('✅ HD Report Form initialized');
