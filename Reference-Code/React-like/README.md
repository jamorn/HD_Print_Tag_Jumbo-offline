# Tag Printing System - React-like Architecture

## 📋 ภาพรวมระบบ

ระบบพิมพ์ป้ายสินค้าแบบ React-like Architecture ที่รองรับหลายหน่วยงาน (Multi-unit Support) พร้อม Template System และ Theme Customization

## 🎯 Features

### ✅ React-like Component Architecture
- **FormComponent** - จัดการฟอร์มและ validation
- **HeaderComponent** - แสดงข้อมูลหัวเอกสาร
- **LogoComponent** - จัดการการแสดงโลโก้และ certifications
- **TemplateEngine** - สร้าง layout แบบ left/right section

### 🎨 Theme System (5 Themes)
1. **Blue Purple** - ธีมหลัก (เริ่มต้น)
2. **Green Fresh** - สีเขียวสดใส
3. **Pink Rose** - สีชมพูอบอุ่น
4. **Purple Sunset** - สีม่วงพระอาทิตย์ตก
5. **Dark Mode** - ธีมสีเข้ม

### 📦 Multi-unit Support (3 Units)
1. **HDPE** - High Density Polyethylene
2. **LLDPE** - Linear Low Density Polyethylene  
3. **PP** - Polypropylene

แต่ละ Unit มี:
- Grade list เฉพาะของตัวเอง
- ค่า default ที่แตกต่างกัน
- Template preference
- Validation rules

### 📋 Template System (3 Templates)
1. **Template 1** - Description Only (ข้อมูลพื้นฐาน)
2. **Template 2** - Description + Logos (พร้อมโลโก้)
3. **Template 3** - Full Certifications (ครบทุกรายละเอียด)

## 🗂️ โครงสร้างโปรเจค

```
React-like/
├── index.html                  # หน้าหลัก
├── README.md                   # เอกสารนี้
├── css/
│   ├── main.css               # Styles หลัก
│   ├── form.css               # Form component styles
│   └── print.css              # Print-specific styles
├── js/
│   ├── app.js                 # Main application orchestrator
│   ├── components/
│   │   ├── formComponent.js   # Form component
│   │   ├── headerComponent.js # Header component
│   │   └── logoComponent.js   # Logo component
│   ├── templates/
│   │   └── templateEngine.js  # Template rendering engine
│   ├── themes/
│   │   └── themeManager.js    # Theme management system
│   └── config/
│       └── unitConfig.js      # Unit configurations
```

## 🚀 วิธีการใช้งาน

### 1. เปิดไฟล์
เปิด `index.html` ในเว็บเบราว์เซอร์

### 2. เลือก Unit
คลิกปุ่ม Unit ที่ต้องการ (HDPE, LLDPE, PP)

### 3. เลือก Theme
คลิกวงกลมสีเพื่อเปลี่ยน theme

### 4. เลือก Template
คลิกการ์ด Template ที่ต้องการ

### 5. กรอกข้อมูล
- **Grade**: เลือกจากรายการหรือพิมพ์เพื่อค้นหา
- **Net Weight**: จะถูกกรอกอัตโนมัติจาก Grade
- **Lot**: กรอกเลข 10 หลัก
- **From/To Page**: ระบุช่วงหน้า
- **Shift**: เลือกกะ (M/E/N)
- **Date**: เลือกวันที่

### 6. Print Controls
- ✅ **FT (First Tag)** - แสดง F/T ที่หน้าแรก
- ✅ **LT (Last Tag)** - แสดง L/T ที่หน้าสุดท้าย

### 7. Generate & Print
1. คลิก "✅ Generate Preview"
2. ตรวจสอบตัวอย่าง
3. กด `Ctrl+P` หรือคลิกปุ่ม 🖨️ เพื่อพิมพ์

## ⌨️ Keyboard Shortcuts

- `Ctrl + P` - พิมพ์
- `F1` - เปิด/ปิดคู่มือ

## 🎨 การปรับแต่ง

### เพิ่ม Unit ใหม่

แก้ไขไฟล์ `js/config/unitConfig.js`:

```javascript
UnitConfigurations.NEW_UNIT = {
  id: 'NEW_UNIT',
  name: 'New Unit',
  fullName: 'New Unit Full Name',
  description: 'Description',
  
  defaults: {
    title1: 'UNIT NAME',
    title2: 'UNIT DESCRIPTION',
    // ... other defaults
  },

  gradeData: [
    { grade: 'GRADE1', netweight: '750', description: 'Description' },
    // ... more grades
  ],

  availableTemplates: ['template1', 'template2', 'template3'],
  defaultTemplate: 'template3',

  validation: {
    lotLength: 10,
    lotPattern: /^\d{10}$/,
    requiredFields: ['grade', 'netweight', 'lot', 'fromPage', 'toPage', 'shift', 'idate']
  }
};
```

### เพิ่ม Theme ใหม่

แก้ไขไฟล์ `js/themes/themeManager.js`:

```javascript
Themes.newtheme = {
  name: 'New Theme Name',
  primary: '#hexcolor1',
  secondary: '#hexcolor2',
  gradient: 'linear-gradient(135deg, #hexcolor1 0%, #hexcolor2 100%)',
  text: '#ffffff',
  textDark: '#333333'
};
```

### สร้าง Template ใหม่

แก้ไขไฟล์ `js/templates/templateEngine.js`:

```javascript
renderTemplate4(data, pageNumber) {
  const headerComp = new HeaderComponent(data);
  const logoComp = new LogoComponent(this.config);
  
  return `
    <section class="sheet A4 landscape tag-page">
      <!-- Your custom template layout -->
    </section>
  `;
}
```

## 🔧 Technical Details

### Component Communication
- ใช้ **Event-driven architecture**
- Components สื่อสารผ่าน **Custom Events**
- **State Management** ใน FormComponent

### Data Flow
```
User Input → FormComponent → Validation → 
TemplateEngine → HTML Generation → Print Area
```

### Storage
- **sessionStorage**: เก็บข้อมูล preview ล่าสุด
- **localStorage**: เก็บ theme และ unit preference

### Validation
- **Client-side validation** ใน FormComponent
- **Unit-specific rules** จาก UnitConfig
- **Real-time feedback** ขณะพิมพ์

## 📦 Dependencies

- **normalize.css** - CSS reset
- **paper.css** - Print layout library
- ไม่ต้องใช้ framework เพิ่มเติม (Pure JavaScript)

## 🖨️ Print Settings

### Chrome / Edge
1. กด `Ctrl + P`
2. คลิก "More settings"
3. **Margin**: None
4. **Headers and footers**: ยกเลิกเลือก
5. **Background graphics**: เลือก

### Firefox
1. กด `Ctrl + P`
2. คลิก "Page Setup"
3. **Margins**: ตั้งค่าทั้งหมดเป็น 0
4. **Headers/Footers**: ตั้งค่าเป็น --blank--

## 🐛 Troubleshooting

### Grade ไม่แสดงใน autocomplete
- ตรวจสอบว่าเลือก Unit ที่ถูกต้อง
- ตรวจสอบ `gradeData` ใน unitConfig.js

### Theme ไม่เปลี่ยน
- ลองรีเฟรชหน้าเว็บ
- ตรวจสอบ console สำหรับ errors
- ล้าง localStorage และลองใหม่

### การพิมพ์ไม่ถูกต้อง
- ตรวจสอบ print settings ตามคำแนะนำข้างต้น
- ตรวจสอบ page orientation (ควรเป็น Landscape)
- ตรวจสอบ paper size (ควรเป็น A4)

## 📝 License

Internal use only - Jumbo HD Production

## 👨‍💻 Development

สร้างโดย: AI Assistant  
วันที่: December 2025  
Version: 1.0.0

## 🔮 Future Enhancements

- [ ] เพิ่ม QR Code generation
- [ ] Export to PDF
- [ ] Batch printing support
- [ ] เชื่อมต่อกับ Google Apps Script
- [ ] Real-time preview
- [ ] Custom template builder
- [ ] Multi-language support
- [ ] Print history

---

**Happy Printing! 🏷️✨**
