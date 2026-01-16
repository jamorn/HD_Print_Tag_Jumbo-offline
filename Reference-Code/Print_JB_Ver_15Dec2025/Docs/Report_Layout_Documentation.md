# Report Layout Documentation

## Overview
This document describes the layout calculations and positioning logic used in the `normal/report.html` page for generating HD Print Tags. The page uses A4 landscape format with dynamic positioning based on templates and content.

## Page Specifications

### Paper Size
- **Format**: A4 Landscape
- **Dimensions**: 297mm x 209mm
- **Pixel Dimensions** (at 96 DPI): 1122.5px x 789.9px
- **CSS Class**: `body.A4.landscape .sheet { width: 297mm; height: 209mm }`

### Font Specifications
- **Primary Font**: Arial (MS: Arial)
- **Weight**: Bold for grade elements
- **Rendering**: Anti-aliased for print quality

## Element Positioning Calculations

### Grade Positioning (Dynamic Centering)

#### Font Size Logic
```javascript
const gradeLength = displayGrade.length;
let fontSize = 60;

if (gradeLength <= 10) {
    fontSize = 60;  // 45pt
} else if (gradeLength <= 12) {
    fontSize = 50;  // 38pt
} else if (gradeLength <= 15) {
    fontSize = 42;  // ~32pt
} else {
    fontSize = 36;  // ~27pt
}
```

#### Position Calculation
```javascript
// Page width in pixels
const pageWidth = 1122.5;

// Character width ratio for Arial font
const charWidthRatio = 0.6;

// Calculate grade width
const gradeWidth = gradeLength * fontSize * charWidthRatio;

// Center position at 80% of page width
const centerX = pageWidth * 0.80;

// Calculate left position for centering
const gradeLeft = centerX - (gradeWidth / 2);

// Convert to right offset for CSS positioning
const rightOffset = pageWidth - gradeLeft - gradeWidth;

// Fixed top offset
const topOffset = -35;
```

**CSS Output**:
```css
position: absolute;
right: ${rightOffset}px;
top: ${topOffset}px;
font-size: ${fontSize}px;
color: black;
text-align: right;
white-space: nowrap;
font-weight: bold;
```

#### Manual Calculation Method (Alternative)
If you need to manually adjust the grade position for precise alignment:

##### Step 1: Measure Grade Element Width
1. Open the report page in browser (Live Server)
2. Press F12 → Select **Elements** tab → Click on the grade element (div containing grade text)
3. In **Computed** or **Box Model** tab → Check the **width** value (e.g., 300px for "P901BK/750" at font-size 60px)

##### Step 2: Calculate Center Position
- Page center (50%): 561.3px from left
- Desired left position = 561.3px - (grade width / 2)
- `rightOffset` = page width - desired left position

**Example Calculation**:
- Grade width: 300px
- Desired left position = 561.3 - (300/2) = 561.3 - 150 = 411.3px
- `rightOffset` = 1122.5 - 411.3 = 711.2px

##### Step 3: Update Code
Modify line 234 in `report.html`:
```javascript
// From:
${generateGradeHTML(data.grade, 30, -35)}

// To (adjusted value):
${generateGradeHTML(data.grade, 711, -35)}
```

**Note**: This manual method can be used for fine-tuning when the automatic calculation doesn't match the desired visual position.

### Logo Positioning (Template-Based)

#### Template Logic
- **Template 1**: No logos (basic template for SUB grades)
- **Template 2**: TIS + QR Code (for PP/PPC)
- **Template 3**: TIS + QR + SIRIM (for HDPE)

#### Logo Dimensions
- **TIS Logo**: 120px width
- **QR Code**: 110px width
- **SIRIM Logo**: 150px width
- **Spacing**: 15px between logos

#### Template 2 Positioning (TIS + QR)
```javascript
// Total logo width: 120 + 15 + 110 = 245px
// Left section width: 550px
// Center position: 550/2 = 275px
// Start position: 275 - (245/2) = 152.5px

const positions = {
    tisLeft: 152,      // TIS logo start
    qrLeft: 287,       // QR code start (152 + 120 + 15)
    sirimLeft: 0       // No SIRIM
};
```

#### Template 3 Positioning (TIS + QR + SIRIM)
```javascript
// Total width: 120 + 15 + 110 + 15 + 150 = 410px
// Center position: (550 - 410) / 2 = 70px

const positions = {
    tisLeft: 75,       // TIS logo start
    qrLeft: 210,       // QR code start (75 + 120 + 15)
    sirimLeft: 335     // SIRIM logo start (210 + 110 + 15)
};
```

### Other Elements

#### Lot Number
- **Position**: `left: 780px; top: 220px`
- **Font Size**: 50px
- **Alignment**: Left

#### Net Weight
- **Position**: Dynamic based on weight value
- **Base Position**: `left: 895px; top: 323px`
- **Adjustments**:
  - Weights ≥ 1000: `left -= 30px` (for comma formatting)
  - Additional fine-tuning: ±5px based on digit count
- **Font Size**: 50px
- **Alignment**: Left

#### Running Number Boxes
- **Position**: `left: 775px; top: 438px`
- **Format**: 001-10-M (Page-Date-Shift)
- **Box Class**: `.bno` (individual digits)

#### Title Elements
- **Title 1**: `left: 0px; top: 240px; font-size: 60px; width: 550px; text-align: center`
- **Title 2**: `left: 0px; top: 320px; font-size: 30px; width: 550px; text-align: center`

#### Control Elements (F/T, L/T)
- **F/T**: `right: 820px; top: 315px; font-size: 50px` (First page only)
- **L/T**: `right: 820px; top: 495px; font-size: 50px` (Last page only)

## Template-Specific Features

### Template 1 (Basic)
- No logos
- Basic information only
- Suitable for SUB grades

### Template 2 (Standard)
- TIS certification logo
- QR code for traceability
- Used for PP/PPC units

### Template 3 (Premium)
- Full certification suite
- TIS + QR + SIRIM logos
- Used for HDPE units
- Includes SIRIM certification details

## Print Settings
- **Margins**: None
- **Scale**: 100%
- **Background Graphics**: Must be enabled
- **Paper Size**: A4 Landscape

## Dynamic Calculations Summary
- Grade position: Calculated based on text length and font size
- Logo positions: Pre-calculated per template for optimal layout
- Weight positioning: Adjusted for number formatting
- All positions use absolute positioning for precise print output