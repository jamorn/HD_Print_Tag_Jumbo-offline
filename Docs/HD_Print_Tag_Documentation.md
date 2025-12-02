# HD Print Tag Jumbo - Technical Documentation

## Table of Contents
1. [Font Size Scaling Logic](#font-size-scaling-logic)
2. [Logo Positioning Logic](#logo-positioning-logic)
3. [CSS Print vs Preview Behavior](#css-print-vs-preview-behavior)
4. [Binary Control Print System](#binary-control-print-system)

---

## 1. Font Size Scaling Logic

### Problem Statement
การแสดง Grade ที่มีความยาว string ไม่เท่ากัน ทำให้เกิดปัญหา:
- Grade สั้น เช่น "P921BK/750" (10 ตัวอักษร) แสดงผลได้ดี
- Grade ยาว เช่น "AM3245PC SUB/750" (16 ตัวอักษร) จะล้นออกจากพื้นที่

### Solution Implementation

```javascript
function adjustGradePosition(grade, rightOffset = 150, topOffset = 200) {
  // คำนวณขนาด font ตามความยาวของ grade string
  const gradeLength = grade.length;
  let fontSize;
  
  if (gradeLength <= 10) {
    fontSize = 60; // ขนาดเดิมสำหรับ string สั้น
  } else if (gradeLength <= 12) {
    fontSize = 50; // ลดขนาดสำหรับ string ปานกลาง
  } else if (gradeLength <= 15) {
    fontSize = 42; // ลดขนาดสำหรับ string ยาว
  } else {
    fontSize = 36; // ขนาดเล็กที่สุดสำหรับ string ยาวมาก
  }
  
  return `...`;
}
```

### Font Size Scaling Table

| ความยาว String | Font Size | ตัวอย่าง Grade |
|:---------------|:----------|:-------------|
| ≤ 10 ตัวอักษร | 60px | "P921BK/750" |
| 11-12 ตัวอักษร | 50px | "P921BK-LS/750" |
| 13-15 ตัวอักษร | 42px | "AM3245PC/750" |
| ≥ 16 ตัวอักษร | 36px | "AM3245PC SUB/750" |

### Benefits
- **Responsive Display**: ปรับขนาดอัตโนมัติตามเนื้อหา
- **Consistent Layout**: รักษาการจัดวางไม่ให้เสียหาย
- **Print Compatibility**: ทำงานได้ดีทั้งในโหมด preview และ print

---

## 2. Logo Positioning Logic

### Problem Statement
เมื่อแสดง logo เพียงบางตัว ตำแหน่งที่คงเดิมจะทำให้ดูไม่สมดุล ต้องการจัดให้อยู่กึ่งกลางของกระดาษ

### Solution Implementation

```javascript
function getLogoPositions(controlprint) {
  const control = parseInt(controlprint, 10);
  
  // กรณีที่ 1: แสดงเฉพาะ Sirim (controlprint = 1)
  if (control === 1) {
    return {
      sirimLeft: 180,      // ย้ายมาตรงกลาง
      sirimDetailLeft: 130 // ปรับ detail ให้อยู่ตรงกลาง
    };
  }
  
  // กรณีที่ 2: แสดงเฉพาะ MFG+QR (controlprint = 2)  
  if (control === 2) {
    return {
      mfgLeft: 140,    // ย้าย MFG มาตรงกลาง
      qrLeft: 270,     // ย้าย QR มาถัดจาก MFG
    };
  }
  
  // กรณีที่ 3: แสดงทั้งหมด (controlprint = 3)
  return {
    mfgLeft: 35,     // ตำแหน่งเดิม
    qrLeft: 180,     // ตำแหน่งเดิม
    sirimLeft: 320,  // ตำแหน่งเดิม
    sirimDetailLeft: 250
  };
}
```

### Logo Position Mapping

#### Default Positions (controlprint = 3)
```
[MFG]      [QR]       [Sirim]
 35px     180px       320px
```

#### Center Positioning for Single Logo (controlprint = 1)
```
           [Sirim]
           180px
```

#### Center Positioning for Dual Logos (controlprint = 2)
```
       [MFG]    [QR]
       140px   270px
```

### Calculation Logic
- **A4 Landscape Width**: ~842px
- **Usable Area**: ~800px (excluding margins)
- **Center Point**: ~400px
- **Logo Spacing**: 130px between logos

---

## 3. CSS Print vs Preview Behavior

### Problem Statement
การแสดงผลในโหมด preview และ print (Ctrl+P) มีความแตกต่างกัน เนื่องจาก browser engines ประมวลผล CSS แตกต่างกัน

### CSS Media Query Implementation

```css
/* Print specific styles */
@media print {
  .print-guide-btn,
  .print-guide-panel {
    display: none !important;
  }
  
  /* ซ่อน background image ในโหมดพิมพ์และใช้พื้นหลังสีขาว */
  .sheet {
    background-image: none !important;
    background: white !important;
    background-color: white !important;
    page-break-after: avoid !important;
    page-break-inside: avoid !important;
  }
  
  /* ซ่อน background จากทุก elements ที่อาจมี background */
  body {
    background: white !important;
    background-image: none !important;
  }
  
  /* รับรองการแสดงผลของ Sirim Detail */
  div[style*="text-align: center"][style*="white-space: nowrap"] {
    display: block !important;
    visibility: visible !important;
    position: absolute !important;
  }
}
```

### Key Differences

| Aspect | Preview Mode | Print Mode |
|:-------|:-------------|:-----------|
| **Background Images** | แสดงตามปกติ | ซ่อนใน @media print |
| **Interactive Elements** | แสดงปุ่ม guide | ซ่อนในโหมดพิมพ์ |
| **Layout Engine** | Standard rendering | Print-optimized rendering |
| **CSS Flexbox** | ทำงานปกติ | อาจมีปัญหา ใช้ inline-block แทน |
| **Position Properties** | % based อาจไม่เสถียร | px based เสถียรกว่า |

### Best Practices for Print CSS
1. **Use Absolute Positioning**: `position: absolute` with `px` values
2. **Avoid Flexbox**: ใช้ `display: inline-block` แทน
3. **Force Visibility**: ใช้ `!important` เพื่อ override
4. **Page Break Control**: ใช้ `page-break-*` properties
5. **White Background**: บังคับใช้สีขาวในโหมดพิมพ์

---

## 4. Binary Control Print System

### Why Binary Control System?

#### Traditional Approach Problems
```javascript
// วิธีเดิม - ใช้ boolean แยกกัน
{
  showFT: true,
  showLT: false,
  showMFG: true,
  showSirim: true
}
```

**ปัญหา:**
- ใช้ memory มาก (4 properties)
- ยากต่อการจัดการ state
- ยากต่อการส่งผ่าน URL parameters

#### Binary Solution Benefits
```javascript
// วิธีใหม่ - ใช้ binary encoding
controlprint: "3" // = 0011 binary
```

**ข้อดี:**
- ใช้ memory เพียง 1 property
- ง่ายต่อการจัดการ state
- เหมาะสำหรับ URL parameters
- สามารถขยายได้ถึง 8 options (0-255)

### Binary 8421 System Explanation

#### Bit Position Mapping
```
Bit Position:  3  2  1  0
Binary Value:  8  4  2  1
Control:      FT LT MFG Sirim
```

#### Implementation Logic
```javascript
const control = parseInt(data.controlprint, 10);

// ใช้ Bitwise AND (&) เพื่อตรวจสอบแต่ละ bit
const ftDisplay = (control & 8) !== 0 ? "block" : "none";     // bit 3
const ltDisplay = (control & 4) !== 0 ? "block" : "none";     // bit 2  
const mfgDisplay = (control & 2) !== 0 ? "block" : "none";    // bit 1
const silimDisplay = (control & 1) !== 0 ? "block" : "none";  // bit 0
```

### Binary Control Examples

| controlprint | Binary | FT | LT | MFG | Sirim | Use Case |
|:-------------|:-------|:---|:---|:----|:------|:---------|
| 0 | 0000 | ❌ | ❌ | ❌ | ❌ | ไม่แสดง logo ใดๆ |
| 1 | 0001 | ❌ | ❌ | ❌ | ✅ | แสดงเฉพาะ Sirim |
| 2 | 0010 | ❌ | ❌ | ✅ | ❌ | แสดงเฉพาะ MFG |
| 3 | 0011 | ❌ | ❌ | ✅ | ✅ | แสดง MFG + Sirim |
| 4 | 0100 | ❌ | ✅ | ❌ | ❌ | แสดงเฉพาะ LT |
| 8 | 1000 | ✅ | ❌ | ❌ | ❌ | แสดงเฉพาะ FT |
| 15 | 1111 | ✅ | ✅ | ✅ | ✅ | แสดงทั้งหมด |

### Bitwise Operations Explained

#### AND Operation (&)
```javascript
control = 3  // 0011 binary
control & 2  // 0011 & 0010 = 0010 ≠ 0 → true (MFG แสดง)
control & 1  // 0011 & 0001 = 0001 ≠ 0 → true (Sirim แสดง)
control & 4  // 0011 & 0100 = 0000 = 0 → false (LT ไม่แสดง)
```

#### Why This Method is Superior
1. **Compact Storage**: เก็บ 4 boolean ใน 1 integer
2. **Fast Operations**: Bitwise operations เร็วมาก
3. **Extensible**: สามารถเพิ่ม options ได้ถึง 8 ตัว
4. **URL Friendly**: ส่งผ่าน query string ได้ง่าย
5. **Database Efficient**: เก็บใน database ใช้พื้นที่น้อย

### Real-world Usage Pattern
```javascript
// ใน index.html - user เลือก checkboxes
<input type="checkbox" value="8" name="controlprint"> FT
<input type="checkbox" value="4" name="controlprint"> LT  
<input type="checkbox" value="2" name="controlprint"> MFG
<input type="checkbox" value="1" name="controlprint"> Sirim

// JavaScript รวม values
const controlprint = checkedValues.reduce((sum, val) => sum + parseInt(val), 0);
// ส่งไป hd_report.html
sessionStorage.setItem('controlprint', controlprint.toString());
```

---

## Summary

ระบบ HD Print Tag Jumbo ใช้เทคนิคขั้นสูงหลายอย่าง:

1. **Dynamic Font Scaling**: ปรับขนาดตัวอักษรตามความยาว content
2. **Intelligent Positioning**: จัดตำแหน่ง elements ให้สมดุลอัตโนมัติ  
3. **Print-Optimized CSS**: รองรับทั้งโหมด preview และ print
4. **Binary Control System**: จัดการ state อย่างมีประสิทธิภาพ

ทั้งหมดนี้ทำให้ระบบมีความยืดหยุ่น ประสิทธิภาพสูง และง่ายต่อการบำรุงรักษา

---

*Document Version: 1.0*  
*Last Updated: October 14, 2025*  
*Author: AI Assistant*