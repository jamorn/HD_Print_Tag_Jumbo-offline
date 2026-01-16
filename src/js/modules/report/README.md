# Report Module Documentation

## Overview
โมดูลสำหรับการสร้างและพิมพ์รายงาน รองรับหลาย unit (HDPE, PP, PPC) พร้อมระบบ modular components

## โครงสร้างไฟล์

```
src/js/modules/report/
├── ReportRenderer.js          # Main renderer class
├── config/
│   ├── UnitConfig.js         # การตั้งค่าสำหรับแต่ละ unit
│   └── ReportConfig.js       # การตั้งค่า print control และ layout
├── components/
│   ├── HeaderSection.js      # Header และ product title
│   ├── ProductInfo.js        # ข้อมูลสินค้าและ specifications
│   └── LogoSection.js        # Logos และ certifications
└── utils/
    ├── DataFormatter.js      # Format ข้อมูลสำหรับแสดงผล
    └── PrintHelper.js        # Helper functions สำหรับการพิมพ์
```

## การใช้งาน

### 1. Basic Usage

```javascript
import { createReportRenderer, renderAndPreview } from './modules/report/ReportRenderer.js';

// สร้างข้อมูล report
const reportData = {
    unit: 'HDPE',              // หรือ 'PP', 'PPC'
    grade: 'P901BK/750',
    lot: '7257896524',
    netWeight: '750',
    date: '8/12/2025',
    shift: 'กะกลาง',
    fromPage: '1',
    toPage: '3',
    controlPrint: 12,          // Binary: TIS + SIRIM
    title1: 'Product Description',
    title2: 'Additional Info',
    title3: 'Made in Thailand'
};

// แสดง preview
renderAndPreview(reportData);
```

### 2. Control Print Flags

```javascript
import { PRINT_CONTROL } from './modules/report/config/ReportConfig.js';

// ใช้ binary flags
const controlPrint = 
    PRINT_CONTROL.FT |      // First Ton (1)
    PRINT_CONTROL.LT |      // Light Transmission (2)
    PRINT_CONTROL.TIS |     // TIS Logo (4)
    PRINT_CONTROL.SIRIM;    // SIRIM Logo (8)
    
// controlPrint = 15 (แสดงทั้งหมด)
```

### 3. Custom Renderer

```javascript
import { ReportRenderer } from './modules/report/ReportRenderer.js';

class HDPEReportRenderer extends ReportRenderer {
    renderCustomContent() {
        // Custom content สำหรับ HDPE
        return `<div>HDPE Specific Content</div>`;
    }
}

const renderer = new HDPEReportRenderer(reportData);
renderer.preview();
```

### 4. เปิดหน้า report.html

```javascript
// ส่งข้อมูลผ่าน URL parameters
const data = { unit: 'PP', grade: 'PP1234', ... };
const dataString = encodeURIComponent(JSON.stringify(data));
window.open(`report.html?data=${dataString}`, '_blank');

// หรือเก็บใน localStorage
localStorage.setItem('reportData', JSON.stringify(data));
window.open('report.html', '_blank');
```

## Unit Configuration

### HDPE
```javascript
{
    name: 'HDPE',
    fullName: 'High-Density Polyethylene',
    certifications: ['TIS', 'SIRIM', 'NSF']
}
```

### PP
```javascript
{
    name: 'PP',
    fullName: 'Polypropylene',
    certifications: ['TIS', 'SIRIM']
}
```

### PPC
```javascript
{
    name: 'PPC',
    fullName: 'Polypropylene Compound',
    certifications: ['TIS', 'SIRIM']
}
```

## API Reference

### ReportRenderer Methods

- `validate()` - ตรวจสอบความถูกต้องของข้อมูล
- `render()` - สร้าง HTML เต็มรูปแบบ
- `renderBody()` - สร้าง body content เท่านั้น
- `preview()` - เปิด preview ในหน้าต่างใหม่
- `print()` - พิมพ์โดยตรง

### Utility Functions

**DataFormatter**
- `formatDate(dateStr)` - Format วันที่
- `formatLot(lot)` - Format Lot number
- `formatNetWeight(weight, unit)` - Format น้ำหนัก
- `generateQRData(data)` - สร้างข้อมูล QR code
- `validateReportData(data)` - ตรวจสอบข้อมูล

**PrintHelper**
- `openPrintPreview(html, title)` - เปิด preview
- `printDirect(html)` - พิมพ์โดยตรง
- `generatePrintHTML(body, styles)` - สร้าง HTML สมบูรณ์

## ตัวอย่าง Control Print Values

| Value | Binary | Features |
|-------|--------|----------|
| 0     | 0000   | ไม่แสดงอะไร |
| 1     | 0001   | FT |
| 2     | 0010   | LT |
| 4     | 0100   | TIS |
| 8     | 1000   | SIRIM |
| 12    | 1100   | TIS + SIRIM |
| 15    | 1111   | All |

## การขยายระบบ

### เพิ่ม Unit ใหม่

1. แก้ไข `config/UnitConfig.js`:
```javascript
export const UNIT_CONFIG = {
    ...existing,
    NEWUNIT: {
        name: 'NEWUNIT',
        fullName: 'New Unit Full Name',
        // ... config
    }
};
```

2. สร้าง custom renderer ถ้าจำเป็น

### เพิ่ม Component ใหม่

สร้างไฟล์ใน `components/` folder:
```javascript
export function renderNewSection(data) {
    return `<div>...</div>`;
}
```

จากนั้น import และใช้ใน `ReportRenderer.js`

## Notes

- ใช้ ES6 modules (import/export)
- รองรับ responsive และ print-friendly
- QR code ต้องการ library `qrcode.min.js`
- ทุก component return HTML string

---

**Created**: 8 December 2025  
**Version**: 1.0.0
