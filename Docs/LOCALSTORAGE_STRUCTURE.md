# 💾 Grade History - localStorage Structure

## 📊 ภาพรวม

ระบบ Grade History เก็บข้อมูลใน **localStorage** ของ browser โดยแยกตาม Unit (HDPE, PP, PPC)

---

## 🔑 localStorage Keys

```javascript
grade_history_HDPE   // ประวัติ HDPE grades
grade_history_PP     // ประวัติ PP grades  
grade_history_PPC    // ประวัติ PPC grades
```

---

## 📋 Data Structure

### **Top Level: Object with Grade Names as Keys**

```json
{
  "P901BK/SB/18000": { ...gradeData },
  "P921BK/750": { ...gradeData },
  "P801BK/1650": { ...gradeData }
}
```

### **Grade Data: Properties**

```javascript
{
  lot: string,           // Lot number (10 digits)
  netweight: string,     // Net weight value
  fromPage: string,      // Starting page number
  toPage: string,        // Ending page number
  shift: string,         // Shift (M/E/N)
  idate: string,         // Date (1-31)
  tis: string,           // TIS certification (Y/N)
  controlPrint: number,  // Binary control print (0-15)
  timestamp: string      // ISO 8601 timestamp
}
```

---

## 🎯 Complete Example

### **localStorage Content**

```json
// Key: "grade_history_HDPE"
{
  "P901BK/SB/18000": {
    "lot": "9254852418",
    "netweight": "18000",
    "fromPage": "1",
    "toPage": "5",
    "shift": "E",
    "idate": "8",
    "tis": "Y",
    "controlPrint": 11,
    "timestamp": "2025-12-08T08:54:22.123Z"
  },
  "P921BK/750": {
    "lot": "7258752122",
    "netweight": "750",
    "fromPage": "1",
    "toPage": "10",
    "shift": "M",
    "idate": "8",
    "tis": "Y",
    "controlPrint": 3,
    "timestamp": "2025-12-08T10:04:00.456Z"
  }
}
```

---

## 🔍 Field Details

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| **lot** | `string` | Lot number (10 digits) | `"9254852418"` |
| **netweight** | `string` | Net weight from grade | `"18000"` or `"750"` |
| **fromPage** | `string` | Starting page | `"1"` |
| **toPage** | `string` | Ending page | `"5"` |
| **shift** | `string` | Production shift | `"M"`, `"E"`, or `"N"` |
| **idate** | `string` | Date (day of month) | `"8"` (1-31) |
| **tis** | `string` | TIS certification | `"Y"` or `"N"` |
| **controlPrint** | `number` | Checkbox binary value | `0-15` (see Binary doc) |
| **timestamp** | `string` | ISO 8601 datetime | `"2025-12-08T08:54:22.123Z"` |

---

## 🎨 Visual Representation

```
localStorage
├── grade_history_HDPE
│   ├── P901BK/SB/18000 ────┐
│   │   ├── lot             │
│   │   ├── netweight       │ Grade Data Object
│   │   ├── fromPage        │
│   │   ├── toPage          │
│   │   ├── shift           │
│   │   ├── idate           │
│   │   ├── tis             │
│   │   ├── controlPrint    │
│   │   └── timestamp ──────┘
│   │
│   ├── P921BK/750
│   └── P801BK/1650
│
├── grade_history_PP
│   ├── 1102H/750
│   └── PP-HOMO/1000
│
└── grade_history_PPC
    └── 3220MPC/750
```

---

## 💻 JavaScript Access Examples

### **1. Read All Grades for HDPE**

```javascript
const historyKey = 'grade_history_HDPE';
const stored = localStorage.getItem(historyKey);

if (stored) {
  const history = JSON.parse(stored);
  console.log('All HDPE grades:', Object.keys(history));
  // → ["P901BK/SB/18000", "P921BK/750"]
}
```

### **2. Read Specific Grade**

```javascript
const history = JSON.parse(localStorage.getItem('grade_history_HDPE'));
const gradeData = history['P901BK/SB/18000'];

console.log('Lot:', gradeData.lot);           // "9254852418"
console.log('Net Weight:', gradeData.netweight); // "18000"
console.log('Control Print:', gradeData.controlPrint); // 11
```

### **3. Add New Grade**

```javascript
const historyKey = 'grade_history_HDPE';
let history = JSON.parse(localStorage.getItem(historyKey) || '{}');

history['P801BK/1650'] = {
  lot: "1250000123",
  netweight: "1650",
  fromPage: "1",
  toPage: "8",
  shift: "N",
  idate: "9",
  tis: "Y",
  controlPrint: 15,
  timestamp: new Date().toISOString()
};

localStorage.setItem(historyKey, JSON.stringify(history));
```

### **4. Get Most Recent Grade**

```javascript
const history = JSON.parse(localStorage.getItem('grade_history_HDPE'));

let mostRecent = null;
let latestTime = null;

Object.keys(history).forEach(grade => {
  const timestamp = new Date(history[grade].timestamp);
  if (!latestTime || timestamp > latestTime) {
    latestTime = timestamp;
    mostRecent = { grade, ...history[grade] };
  }
});

console.log('Most recent:', mostRecent);
```

### **5. Delete Specific Grade**

```javascript
const history = JSON.parse(localStorage.getItem('grade_history_HDPE'));
delete history['P921BK/750'];
localStorage.setItem('grade_history_HDPE', JSON.stringify(history));
```

### **6. Clear All HDPE History**

```javascript
localStorage.removeItem('grade_history_HDPE');
```

---

## 🔄 Data Flow

### **Save Flow (User submits form)**

```
1. User fills form
   ├── Grade: P901BK/SB/18000
   ├── Lot: 9254852418
   ├── From Page: 1
   ├── To Page: 5
   └── Checkboxes: FT ☑, LT ☐, MFG ☑, Sirim ☑

2. Click "ยืนยันและบันทึก"

3. calculateControlPrint()
   → 8 + 0 + 2 + 1 = 11

4. gradeHistory.saveGradeHistory()
   ├── Read existing: localStorage.getItem('grade_history_HDPE')
   ├── Parse JSON
   ├── Add/Update: history['P901BK/SB/18000'] = {...}
   └── Save: localStorage.setItem()

5. Stored in localStorage ✅
```

### **Load Flow (User clicks grade from table)**

```
1. User clicks "P901BK/SB/18000" from table

2. tableComponent.handleRowClick()
   └── Calls formComponent.populateForm({ grade, unit, ... })

3. formComponent.populateForm()
   ├── gradeHistory.loadGradeHistory('HDPE', 'P901BK/SB/18000')
   │   ├── localStorage.getItem('grade_history_HDPE')
   │   ├── Parse JSON
   │   └── Return: history['P901BK/SB/18000']
   │
   ├── Populate text fields (lot, fromPage, toPage, etc.)
   │
   └── decodeControlPrint(11)
       ├── 11 & 8 → FT ☑
       ├── 11 & 4 → LT ☐
       ├── 11 & 2 → MFG ☑
       └── 11 & 1 → Sirim ☑

4. Form populated with history data ✅
```

---

## 🛠️ Developer Tools Inspection

### **Chrome DevTools → Application Tab**

```
Application
  └── Storage
      └── Local Storage
          └── file:// (or your domain)
              ├── grade_history_HDPE: "{"P901BK/SB/18000":{...}}"
              ├── grade_history_PP: "{"1102H/750":{...}}"
              └── grade_history_PPC: "{}"
```

### **Console Commands**

```javascript
// View all localStorage
console.table(localStorage);

// View HDPE history (formatted)
console.log(JSON.parse(localStorage.getItem('grade_history_HDPE')));

// Count grades in HDPE
const hdpe = JSON.parse(localStorage.getItem('grade_history_HDPE') || '{}');
console.log('Total HDPE grades:', Object.keys(hdpe).length);

// Get storage size
const size = new Blob([localStorage.getItem('grade_history_HDPE')]).size;
console.log('Storage size:', size, 'bytes');
```

---

## 📏 Storage Limits

- **localStorage limit**: ~5-10 MB per domain (browser-dependent)
- **Each grade entry**: ~200-300 bytes
- **Estimated capacity**: ~10,000-20,000 grade entries

---

## ⚙️ Implementation Files

| File | Responsibility |
|------|---------------|
| **gradeHistoryManager.js** | Save, Load, Get methods |
| **formComponent_themed.js** | Populate form, Decode controlPrint |
| **tableComponent.js** | Detect unit, Pass data to form |

---

## 🔐 Data Persistence

✅ **Persistent**: Data remains after:
- Browser restart
- Tab close/reopen
- Page refresh

❌ **Not persistent**: Data lost after:
- Clear browsing data
- Incognito/Private mode close
- Manual localStorage clear

---

## 🚀 Future Enhancements

- [ ] Add data compression (reduce storage size)
- [ ] Export to JSON file (backup)
- [ ] Import from JSON file (restore)
- [ ] Sync across devices (cloud storage)
- [ ] Auto-cleanup old entries (>6 months)

---

**Version:** 1.0.0  
**Last Updated:** December 8, 2025  
**Storage Format:** JSON
