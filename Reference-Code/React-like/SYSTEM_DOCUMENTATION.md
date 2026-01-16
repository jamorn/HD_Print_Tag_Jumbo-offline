# 🏷️ Tag Printing System - React-like Architecture

## 📋 System Overview
ระบบพิมพ์ป้ายสินค้า HDPE/PP/PPC แบบ React-like Architecture (Pure JavaScript - ไม่ใช้ Framework)

**Version:** 1.0.0  
**Last Updated:** December 3, 2025  
**Branch:** junboHD-Ver-02Dec2025

---

## 📦 Units Configuration

| Unit | Default Grade | QR Code | Templates | SIRIM Logo |
|------|--------------|---------|-----------|------------|
| **HDPE** | P901BK/SB/18000 | hdpe-qr-code.svg | 1, 2, 3 | ✅ Yes |
| **PP** | 1105SC/750 | pp-qr-code.svg | 1, 2 | ❌ No |
| **PPC** | FL203D/750 | pp-qr-code.svg | 1, 2 | ❌ No |

### Unit Details

#### HDPE (High Density Polyethylene)
- **Full Name:** High Density Polyethylene
- **Default Grade:** P901BK/SB/18000
- **Net Weight:** 18000 kg
- **QR Code:** `../images/svg/hdpe-qr-code.svg`
- **Available Templates:** Template 1, Template 2, Template 3
- **Default Template:** Template 3 (Full Certifications)
- **Logos:** MFG + QR + SIRIM
- **SIRIM Certification:** Yes
  - Title 1: Certified to MS1058 : PART 1 : 2005
  - Title 2: Certified No. : PC004152
  - Title 3: 

#### PP (Polypropylene)
- **Full Name:** Polypropylene
- **Default Grade:** 1105SC/750
- **Net Weight:** 750 kg
- **QR Code:** `../images/svg/pp-qr-code.svg`
- **Available Templates:** Template 1, Template 2
- **Default Template:** Template 2 (Description + Logos)
- **Logos:** MFG + QR only (NO SIRIM)
- **SIRIM Certification:** No

#### PPC (Polypropylene Copolymer)
- **Full Name:** Polypropylene Copolymer
- **Default Grade:** FL203D/750
- **Net Weight:** 750 kg
- **QR Code:** `../images/svg/pp-qr-code.svg`
- **Available Templates:** Template 1, Template 2
- **Default Template:** Template 2 (Description + Logos)
- **Logos:** MFG + QR only (NO SIRIM)
- **SIRIM Certification:** No

---

## 🎨 Template System

### Template 1: Description Only
- **Content:** Basic information only
- **Logos:** None
- **Use Case:** Minimal printing, cost-saving

### Template 2: Description + Logos
- **Content:** Basic information + Logos
- **Logos:** 
  - MFG/TIS Logo (left: 140px)
  - QR Code (left: 270px, unit-specific)
- **Position:** Centered layout
- **Use Case:** Standard printing with branding

### Template 3: Full Certifications (HDPE Only)
- **Content:** Full information + All logos + Certifications
- **Logos:**
  - MFG/TIS Logo (left: 35px)
  - QR Code (left: 180px)
  - SIRIM Logo (left: 320px)
  - SIRIM Details (left: 250px, top: 550px)
- **Use Case:** Complete certification documentation

---

## 💾 Data Storage System

### 1. Grade History (localStorage)
**Key:** `grade_history`

**Structure:**
```json
{
  "P901BK/SB": {
    "lot": "9254587745",
    "netweight": "18000",
    "fromPage": "1",
    "toPage": "18",
    "controlprint": { "ft": true, "lt": false },
    "unit": "HDPE",
    "timestamp": "2025-12-03T10:30:00.000Z"
  },
  "1105SC/750": {
    "lot": "7258554555",
    "netweight": "750",
    "fromPage": "1",
    "toPage": "3",
    "controlprint": { "ft": false, "lt": true },
    "unit": "PP",
    "timestamp": "2025-12-03T11:45:00.000Z"
  }
}
```

**Purpose:** 
- เก็บข้อมูลล่าสุดของแต่ละ Grade
- Auto-fill เมื่อเลือก Grade ซ้ำ
- แยก Grade ตาม Unit

### 2. Session Storage (sessionStorage)
**Keys:** 
- `form_data_HDPE`
- `form_data_PP`
- `form_data_PPC`
- `last_preview`

**Purpose:** เก็บข้อมูลชั่วคราวระหว่าง session

---

## 🔄 Form Data Flow

### การโหลดข้อมูลเมื่อเปิดหน้า / เปลี่ยน Unit

```
1. เปิดหน้าเว็บ / คลิก Unit Tab
   ↓
2. getInitialFormData(unit)
   ↓
3. หา Grade ล่าสุดจาก localStorage
   - getLastUsedGrade(unit)
   - กรองเฉพาะ Grade ของ Unit นี้
   - เลือก Grade ที่มี timestamp ล่าสุด
   ↓
4. ถ้าพบ Grade History
   → ใช้ข้อมูลจาก history (lot, netweight, pages, controlprint)
   ↓
5. ถ้าไม่พบ Grade History
   → ใช้ค่า init จาก unitConfig.defaults
   → HDPE: P901BK/SB/18000
   → PP: 1105SC/750
   → PPC: FL203D/750
   ↓
6. Shift ถูก override ด้วยเวลาปัจจุบันเสมอ
   → M (06:00-13:59)
   → E (14:00-21:59)
   → N (22:00-05:59)
   ↓
7. แสดงข้อมูลใน Form
```

### การบันทึกข้อมูล

```
1. User กรอกข้อมูล + คลิก Generate
   ↓
2. Validate ข้อมูล
   - Grade: ต้องไม่ว่าง
   - Lot: ต้องเป็นตัวเลข 10 หลัก
   - Pages: From ≤ To
   ↓
3. saveGradeHistory(grade, formData)
   - บันทึกลง localStorage
   - เพิ่ม timestamp
   - เพิ่ม unit field
   ↓
4. Generate Preview
   - Render HTML
   - บันทึกลง sessionStorage
```

---

## 🎯 Features

### ✅ Grade Autocomplete
- ข้อมูลจาก `hdpe_pellet.js` (17 grades)
- Block Thai characters (อนุญาตเฉพาะ a-z, A-Z, 0-9, /)
- Auto-fill Net Weight จาก Grade
- Load history เมื่อเลือก Grade ซ้ำ

### ✅ Lot Number Validation
- ตัวเลข 10 หลักเท่านั้น
- แสดง Counter สี:
  - 🔴 แดง: ยังไม่ครบ 10 หลัก
  - 🟢 เขียว + ✅: ครบ 10 หลัก

### ✅ Shift Auto-Selection
- คำนวณจากเวลาปัจจุบัน
- Override ค่าเดิมเสมอ (ไม่ restore จาก storage)
- Morning (M): 06:00-13:59
- Evening (E): 14:00-21:59
- Night (N): 22:00-05:59

### ✅ Net Weight Formatting
- แสดงเครื่องหมายคอมม่า
- ตัวอย่าง: 18000 → 18,000

### ✅ Template Switching
- Auto-regenerate preview เมื่อเปลี่ยน template
- ตรวจสอบ validation ก่อน regenerate
- แต่ละ Unit มี templates ที่แตกต่างกัน

### ✅ Unit-specific QR Code
- HDPE: `hdpe-qr-code.svg`
- PP: `pp-qr-code.svg`
- PPC: `pp-qr-code.svg`

### ✅ FT/LT Markers
- Position: `top: 345px, left: 180px`
- อยู่นอก sections (sheet level)
- แสดงตาม controlprint checkbox

---

## 📁 File Structure

```
React-like/
├── index.html                    # Main HTML
├── css/
│   ├── main.css                  # Main styles
│   ├── form.css                  # Form styles
│   └── print.css                 # Print styles
├── js/
│   ├── app.js                    # Main application
│   ├── config/
│   │   ├── unitConfig.js         # Unit configurations
│   │   └── mockData.js           # Mock data for testing
│   ├── components/
│   │   ├── formComponent.js      # Form component
│   │   ├── headerComponent.js    # Header component (Grade, Lot, etc.)
│   │   └── logoComponent.js      # Logo component
│   ├── templates/
│   │   └── templateEngine.js     # Template rendering engine
│   └── themes/
│       └── themeManager.js       # Theme management
└── images/
    ├── polimaxx.jpg              # Background image
    ├── TIS2559-2544.png          # MFG/TIS Logo
    ├── sirim_logo.png            # SIRIM Logo
    └── svg/
        ├── hdpe-qr-code.svg      # HDPE QR Code
        └── pp-qr-code.svg        # PP/PPC QR Code
```

---

## 🔧 Configuration Files

### unitConfig.js
- `UnitConfigurations`: Object ที่เก็บ config ของแต่ละ unit
- `UnitConfigManager`: Class สำหรับจัดการ unit switching

**Key Properties:**
- `defaults`: ค่าเริ่มต้น (grade, netweight, titles, qrCodeImage)
- `gradeData`: รายการ grades ที่ใช้ได้
- `availableTemplates`: templates ที่รองรับ
- `defaultTemplate`: template เริ่มต้น
- `hasLogo`: มี logo หรือไม่
- `hasSirimLogo`: มี SIRIM logo หรือไม่
- `validation`: กฎการ validate

### mockData.js
- `MockData`: ข้อมูลตัวอย่างสำหรับแต่ละ unit
- `MockDataManager`: Class สำหรับจัดการ mock data
- `MockUtils`: Utility functions

**Keyboard Shortcuts:**
- `Ctrl+Shift+1`: Load HDPE mock
- `Ctrl+Shift+3`: Load PP mock
- `Ctrl+Shift+4`: Load PPC mock

---

## 🎨 Logo Positioning

### Template 2 (Centered - 2 Logos)
```
MFG Logo:  left: 140px, top: 430px, width: 120px
QR Code:   left: 270px, top: 430px, width: 110px
```

### Template 3 (Full - 3 Logos, HDPE Only)
```
MFG Logo:       left: 35px,  top: 430px, width: 120px
QR Code:        left: 180px, top: 430px, width: 110px
SIRIM Logo:     left: 320px, top: 430px, width: 150px
SIRIM Details:  left: 250px, top: 550px
```

---

## 🚀 Usage Guide

### 1. เปิดใช้งานครั้งแรก
```
1. เลือก Unit (HDPE/PP/PPC)
2. ถ้ายังไม่มี history → Form จะแสดงค่า init
3. กรอกข้อมูล: Lot, Pages
4. คลิก Generate Preview
```

### 2. การใช้งานต่อเนื่อง
```
1. เลือก Unit → Form โหลดข้อมูล Grade ล่าสุดของ Unit นั้น
2. หรือเลือก Grade จาก autocomplete → โหลด history ของ Grade นั้น
3. แก้ไขข้อมูลตามต้องการ
4. Generate Preview
```

### 3. การสลับ Unit
```
1. คลิก Unit Tab อื่น (เช่น HDPE → PP)
2. ระบบบันทึกข้อมูล HDPE ปัจจุบัน
3. โหลดข้อมูล PP ล่าสุด
4. Template ปรับเป็น Template 2 อัตโนมัติ (ถ้าเดิมใช้ Template 3)
```

---

## ⚠️ Important Notes

### ข้อควรระวัง
1. **LLDPE Unit ถูกลบออกแล้ว** - ไม่มีในระบบ
2. **PP/PPC ไม่มี Template 3** - จะแสดงเฉพาะ Template 1, 2
3. **PP/PPC ไม่มี SIRIM Logo** - แสดงเฉพาะ MFG + QR
4. **Shift override ทุกครั้ง** - ไม่ restore จาก storage
5. **Grade History แยกตาม Unit** - HDPE grade จะไม่ปรากฏใน PP

### Data Validation
- **Lot:** ตัวเลข 10 หลักเท่านั้น
- **Grade:** ห้ามมีตัวอักษรไทย
- **Pages:** From ≤ To, ต้องเป็นตัวเลข ≥ 1
- **Net Weight:** Auto-fill จาก Grade (read-only)

---

## 🐛 Troubleshooting

### ปัญหา: Form ไม่โหลดข้อมูล
**วิธีแก้:**
1. ตรวจสอบ localStorage → `grade_history`
2. ตรวจสอบ console log: `📂 Loaded last grade data` หรือ `📝 No grade history`
3. Clear localStorage และ refresh

### ปัญหา: Template 3 หายไปใน PP/PPC
**คำตอบ:** ถูกต้อง - PP/PPC มีเฉพาะ Template 1, 2 เท่านั้น

### ปัญหา: SIRIM Logo ไม่แสดงใน PP/PPC
**คำตอบ:** ถูกต้อง - PP/PPC ไม่มี SIRIM certification

### ปัญหา: Shift ไม่ตรงกับเวลา
**วิธีแก้:** Refresh หน้าเว็บ - Shift จะ auto-update ตามเวลาปัจจุบัน

---

## 📊 Console Commands

### ตรวจสอบข้อมูล
```javascript
// ดู Grade History ทั้งหมด
JSON.parse(localStorage.getItem('grade_history'))

// ดู Mock Data Summary
new MockDataManager().printSummary()

// โหลด Mock Data
MockUtils.loadHDPE()
MockUtils.loadPP()
MockUtils.loadPPC()
```

### Clear Data
```javascript
// ลบ Grade History
localStorage.removeItem('grade_history')

// ลบ Session Data
sessionStorage.clear()
```

---

## 📝 Version History

### v1.0.0 (December 3, 2025)
- ✅ ลบ LLDPE unit ออกทั้งหมด
- ✅ PP/PPC ใช้ Grade init: 1105SC/750, FL203D/750
- ✅ PP/PPC ใช้ pp-qr-code.svg
- ✅ PP/PPC ไม่มี SIRIM logo (2 logos เท่านั้น)
- ✅ PP/PPC ตัด Template 3 ออก (เหลือ Template 1, 2)
- ✅ Grade History System พร้อม Auto-fill
- ✅ Unit-specific data loading
- ✅ Shift auto-override ตามเวลา
- ✅ Template auto-switch เมื่อเปลี่ยน Unit

---

## 👨‍💻 Development Notes

### Component Architecture
```
App (app.js)
├── UnitConfigManager
├── ThemeManager
├── TemplateEngine
└── FormComponent
    ├── HeaderComponent (Grade, Lot, NetWeight, FT/LT)
    └── LogoComponent (MFG, QR, SIRIM)
```

### Event Flow
```
User Action
  ↓
FormComponent (validate, save state)
  ↓
App.generatePreview()
  ↓
TemplateEngine.render()
  ↓
HeaderComponent + LogoComponent
  ↓
HTML Output → Print Area
```

---

**จัดทำโดย:** AI Assistant  
**วัตถุประสงค์:** เอกสารป้องกันการลืม, อ้างอิง configuration, troubleshooting  
**Last Review:** December 3, 2025
