# Mock Data Usage Guide

## 📦 การใช้งาน Mock Data System

Mock Data System ช่วยให้คุณสามารถ init ค่าเริ่มต้นสำหรับทุก unit (HDPE, LLDPE, PP, PPC) ได้อย่างง่ายดาย

---

## 🚀 Quick Start

### 1. โหลด Mock Data แบบอัตโนมัติ

ระบบจะโหลด mock data ให้อัตโนมัติเมื่อ:
- เปิดหน้าเว็บครั้งแรก (ถ้าไม่มี saved preview)
- Switch unit ใหม่

### 2. ใช้ Keyboard Shortcuts

```
Ctrl+Shift+1  →  โหลด HDPE mock data
Ctrl+Shift+2  →  โหลด LLDPE mock data  
Ctrl+Shift+3  →  โหลด PP mock data
Ctrl+Shift+4  →  โหลด PPC mock data
```

### 3. ใช้ Console Commands

เปิด Developer Console (F12) และพิมพ์:

```javascript
// โหลด HDPE
MockUtils.loadHDPE()

// โหลด LLDPE
MockUtils.loadLLDPE()

// โหลด PP
MockUtils.loadPP()

// โหลด PPC
MockUtils.loadPPC()

// โหลด Heavy weight ของ unit ใดก็ได้
MockUtils.loadHeavy('HDPE')
MockUtils.loadHeavy('LLDPE')
```

---

## 🎯 Advanced Usage

### Load Specific Example

```javascript
const mockManager = new MockDataManager();

// โหลด example เฉพาะ
const data = mockManager.getMockData('HDPE', 'regular750');
const data = mockManager.getMockData('HDPE', 'heavy18000');
const data = mockManager.getMockData('HDPE', 'natural');
const data = mockManager.getMockData('HDPE', 'injection');
```

### Load into Form Automatically

```javascript
// โหลดเข้า form และ generate preview
window.app.loadMockData('HDPE', 'heavy18000');
window.app.loadMockData('LLDPE', 'film750');
window.app.loadMockData('PP', 'injection750');
```

### Get All Examples for a Unit

```javascript
const mockManager = new MockDataManager();
const examples = mockManager.getUnitExamples('HDPE');
console.log(examples);
// Output: ['regular750', 'heavy18000', 'natural', 'injection']
```

### Get Random Mock Data

```javascript
const mockManager = new MockDataManager();
const randomData = mockManager.getRandomMockData('HDPE');
```

### Print Summary

```javascript
const mockManager = new MockDataManager();
mockManager.printSummary();
```

Output:
```
📦 Mock Data Summary:
═══════════════════════════════════════

HDPE (4 examples):
  • regular750: P921BK/750 (750kg)
  • heavy18000: P901BK/SB/18000 (18000kg)
  • natural: P921NT/750 (750kg)
  • injection: I055BK/750 (750kg)

LLDPE (3 examples):
  • film750: L218BK/750 (750kg)
  • heavy18000: L220BK/18000 (18000kg)
  • natural: L218NT/750 (750kg)

...
```

---

## 📝 Available Mock Data

### HDPE Unit
- `regular750` - P921BK/750 (750kg) - Regular black pipe grade
- `heavy18000` - P901BK/SB/18000 (18,000kg) - Heavy duty pipe
- `natural` - P921NT/750 (750kg) - Natural color pipe
- `injection` - I055BK/750 (750kg) - Injection molding grade

### LLDPE Unit
- `film750` - L218BK/750 (750kg) - Film grade
- `heavy18000` - L220BK/18000 (18,000kg) - Heavy duty
- `natural` - L218NT/750 (750kg) - Natural color

### PP Unit
- `injection750` - PP525BK/750 (750kg) - Injection grade
- `film18000` - PP600BK/18000 (18,000kg) - Film grade
- `raffia` - PP550NT/750 (750kg) - Raffia grade

### PPC Unit
- `copolymer750` - PPC350BK/750 (750kg) - Copolymer grade
- `random` - PPC400NT/750 (750kg) - Random copolymer

---

## 🔧 Programmatic Usage

### In Form Component

```javascript
// Form component มี access ไปยัง mock data
this.formComponent.state.formData = MockUtils.loadHDPE();
this.formComponent.restoreFormState();
```

### In Application

```javascript
// Load และ generate preview
async loadAndPreview(unit, example) {
  const mockData = this.mockManager.getMockData(unit, example);
  this.state.currentData = mockData;
  
  const html = this.templateEngine.render(mockData);
  document.getElementById('printArea').innerHTML = html;
}

// ใช้งาน
window.app.loadAndPreview('HDPE', 'heavy18000');
```

---

## 💾 Save Custom Mock Data

### Save Current Form as Mock

```javascript
const mockManager = new MockDataManager();
const formData = window.app.formComponent.getFormData();

// บันทึกเป็น mock example ใหม่
mockManager.saveMockExample(formData, 'HDPE', 'myCustom');

// Export ทั้งหมดเป็น JSON
const json = mockManager.exportJSON();
console.log(json);
```

---

## 🎨 Mock Data Structure

แต่ละ mock data object มี structure ดังนี้:

```javascript
{
  grade: 'P921BK/750',           // Grade code
  netweight: '750',               // Net weight (kg)
  lot: '9258554555',             // Lot number (10 digits)
  fromPage: '1',                  // Starting page
  toPage: '3',                    // Ending page
  shift: 'M',                     // Shift (M/E/N)
  idate: '3',                     // Date (1-31)
  controlprint: {
    ft: true,                     // Show FT marker
    lt: true                      // Show LT marker
  },
  unit: 'HDPE',                   // Unit name
  template: 'template3',          // Template ID
  title1: 'HDPE',                 // Main title
  title2: 'HIGH DENSITY...',      // Subtitle
  sirim_title1: 'Certified...',   // Cert line 1
  sirim_title2: 'Certified...',   // Cert line 2
  sirim_title3: 'Designation : PE100'           // Cert line 3
}
```

---

## 🔄 Integration with Application

Mock Data System ถูก integrate กับ application ใน 3 จุด:

### 1. **Auto-load on Startup**
```javascript
// app.js - init()
this.mockManager = new MockDataManager();
this.loadSavedPreview(); // จะใช้ mock data ถ้าไม่มี saved data
```

### 2. **Keyboard Shortcuts**
```javascript
// app.js - attachGlobalListeners()
if (e.ctrlKey && e.shiftKey) {
  switch(e.key) {
    case '1': this.loadMockData('HDPE'); break;
    case '2': this.loadMockData('LLDPE'); break;
    case '3': this.loadMockData('PP'); break;
    case '4': this.loadMockData('PPC'); break;
  }
}
```

### 3. **Form Loading**
```javascript
// app.js - loadMockData()
loadMockData(unit, example) {
  const mockData = this.mockManager.loadIntoForm(
    this.formComponent, 
    unit, 
    example
  );
  this.generatePreview();
}
```

---

## 📚 Example Scenarios

### Scenario 1: Testing Different Grades

```javascript
// Test ทุก grade ของ HDPE
const mockManager = new MockDataManager();
const examples = mockManager.getUnitExamples('HDPE');

examples.forEach(example => {
  setTimeout(() => {
    window.app.loadMockData('HDPE', example);
  }, 2000);
});
```

### Scenario 2: Demo Mode

```javascript
// สุ่มแสดง mock data ทุกๆ 5 วินาที
const units = ['HDPE', 'LLDPE', 'PP', 'PPC'];
const mockManager = new MockDataManager();

setInterval(() => {
  const randomUnit = units[Math.floor(Math.random() * units.length)];
  const randomData = mockManager.getRandomMockData(randomUnit);
  window.app.state.currentData = randomData;
  window.app.generatePreview();
}, 5000);
```

### Scenario 3: Batch Testing

```javascript
// Test print สำหรับทุก unit
async function testAllUnits() {
  const units = ['HDPE', 'LLDPE', 'PP', 'PPC'];
  
  for (const unit of units) {
    await window.app.loadMockData(unit, 'regular750');
    await new Promise(resolve => setTimeout(resolve, 1000));
    window.print();
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
}

testAllUnits();
```

---

## 🎯 Tips & Best Practices

1. **ใช้ Mock Data สำหรับ Testing**
   - ทดสอบ layout กับ grade ต่างๆ
   - ทดสอบการ format netweight (750 vs 18,000)
   - ทดสอบ FT/LT markers

2. **ใช้ Keyboard Shortcuts**
   - รวดเร็วกว่าการกรอก form ด้วยมือ
   - เหมาะสำหรับการทดสอบซ้ำๆ

3. **Save Custom Examples**
   - บันทึก configuration ที่ใช้บ่อย
   - แชร์กับทีม

4. **Console Commands**
   - `MockUtils.loadHDPE()` - รวดเร็วที่สุด
   - `new MockDataManager().printSummary()` - ดูข้อมูลทั้งหมด

---

## 🐛 Troubleshooting

### Mock Data ไม่โหลด
```javascript
// Check ว่า mockManager มีอยู่
console.log(window.app.mockManager);

// Check mock data structure
console.log(MockData);

// Manually load
window.app.mockManager = new MockDataManager();
```

### Form ไม่ Update
```javascript
// Force restore form state
window.app.formComponent.restoreFormState();
```

### Preview ไม่แสดง
```javascript
// Force generate
window.app.generatePreview();
```

---

**Happy Testing! 🎉**
