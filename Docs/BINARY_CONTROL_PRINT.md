# 🔢 Binary Control Print System (8-4-2-1)

## 📊 ภาพรวมระบบ

ระบบใช้ **Binary encoding** เพื่อเก็บสถานะของ 4 checkboxes ในตัวเลขเดียว (0-15)

---

## 🎯 Binary Mapping (8-4-2-1)

```
┌─────┬─────┬─────┬──────┐
│ FT  │ LT  │ MFG │ Sirim│
├─────┼─────┼─────┼──────┤
│  8  │  4  │  2  │   1  │
└─────┴─────┴─────┴──────┘
```

### **ตัวอย่าง:**

| Checkboxes | Binary | Decimal | Meaning |
|------------|--------|---------|---------|
| ☐ FT  ☐ LT  ☐ MFG  ☐ Sirim | `0000` | **0** | ไม่แสดงอะไรเลย |
| ☐ FT  ☐ LT  ☐ MFG  ☑ Sirim | `0001` | **1** | แสดงเฉพาะ Sirim |
| ☐ FT  ☐ LT  ☑ MFG  ☐ Sirim | `0010` | **2** | แสดงเฉพาะ MFG |
| ☐ FT  ☐ LT  ☑ MFG  ☑ Sirim | `0011` | **3** | แสดง MFG + Sirim |
| ☐ FT  ☑ LT  ☐ MFG  ☐ Sirim | `0100` | **4** | แสดงเฉพาะ LT |
| ☑ FT  ☐ LT  ☐ MFG  ☐ Sirim | `1000` | **8** | แสดงเฉพาะ FT |
| ☑ FT  ☑ LT  ☑ MFG  ☑ Sirim | `1111` | **15** | แสดงทุกอย่าง |

---

## 🔧 Implementation

### **1. Encode: Checkboxes → Number**

```javascript
// calculateControlPrint()
function calculateControlPrint(controlPrint) {
    let value = 0;
    
    if (controlPrint.ft) value += 8;     // bit 3
    if (controlPrint.lt) value += 4;     // bit 2
    if (controlPrint.mfg) value += 2;    // bit 1
    if (controlPrint.sirim) value += 1;  // bit 0
    
    return value;
}

// Example:
calculateControlPrint({
  ft: true,    // +8
  lt: false,   // +0
  mfg: true,   // +2
  sirim: true  // +1
})
// → Result: 11 (binary: 1011)
```

### **2. Decode: Number → Checkboxes**

```javascript
// decodeControlPrint()
function decodeControlPrint(value) {
    return {
        ft: (value & 8) !== 0,    // Check bit 3
        lt: (value & 4) !== 0,    // Check bit 2
        mfg: (value & 2) !== 0,   // Check bit 1
        sirim: (value & 1) !== 0  // Check bit 0
    };
}

// Example:
decodeControlPrint(11)
// → Result: { ft: true, lt: false, mfg: true, sirim: true }
```

---

## 📋 Bitwise Operations

### **AND Operation (`&`)**

```javascript
11 & 8 → 8  (not 0) → true   // FT checked
11 & 4 → 0           → false // LT unchecked
11 & 2 → 2  (not 0) → true   // MFG checked
11 & 1 → 1  (not 0) → true   // Sirim checked
```

**Binary breakdown:**
```
  1011  (11)
& 1000  (8)
------
  1000  → 8 (not 0) → FT = true

  1011  (11)
& 0100  (4)
------
  0000  → 0 → LT = false

  1011  (11)
& 0010  (2)
------
  0010  → 2 (not 0) → MFG = true

  1011  (11)
& 0001  (1)
------
  0001  → 1 (not 0) → Sirim = true
```

---

## 🔄 Grade History Integration

### **Save to History**

```javascript
// formComponent_themed.js → handleSubmit()
const formData = {
  grade: "P901BK/SB/18000",
  lot: "9250000456",
  controlPrint: calculateControlPrint({
    ft: true,
    lt: false,
    mfg: true,
    sirim: true
  }) // → 11
};

gradeHistory.saveGradeHistory('HDPE', 'P901BK/SB/18000', formData);
```

**localStorage:**
```json
{
  "grade_history_HDPE": {
    "P901BK/SB/18000": {
      "lot": "9250000456",
      "netweight": "18000",
      "fromPage": "1",
      "toPage": "5",
      "controlPrint": 11,
      "timestamp": "2025-12-08T10:30:00.000Z"
    }
  }
}
```

### **Load from History**

```javascript
// formComponent_themed.js → populateForm()
const historyData = gradeHistory.loadGradeHistory('HDPE', 'P901BK/SB/18000');
// historyData.controlPrint = 11

const checkboxStates = decodeControlPrint(11);
// → { ft: true, lt: false, mfg: true, sirim: true }

document.getElementById('ft').checked = checkboxStates.ft;       // ☑
document.getElementById('lt').checked = checkboxStates.lt;       // ☐
document.getElementById('mfg').checked = checkboxStates.mfg;     // ☑
document.getElementById('sirim').checked = checkboxStates.sirim; // ☑
```

---

## 🎨 Visual Example

**Before (Grade History saved with controlPrint: 11):**
```
User clicks "P901BK/SB/18000" from history
```

**After (Checkboxes restored):**
```html
<input type="checkbox" id="ft" checked>     ✓ FT
<input type="checkbox" id="lt">             ✗ LT
<input type="checkbox" id="mfg" checked>    ✓ MFG
<input type="checkbox" id="sirim" checked>  ✓ Sirim
```

---

## 📊 All 16 Possible Values

| Value | Binary | FT | LT | MFG | Sirim | Display |
|-------|--------|----|----|-----|-------|---------|
| 0 | 0000 | ☐ | ☐ | ☐ | ☐ | Nothing |
| 1 | 0001 | ☐ | ☐ | ☐ | ☑ | Sirim only |
| 2 | 0010 | ☐ | ☐ | ☑ | ☐ | MFG only |
| 3 | 0011 | ☐ | ☐ | ☑ | ☑ | MFG + Sirim |
| 4 | 0100 | ☐ | ☑ | ☐ | ☐ | LT only |
| 5 | 0101 | ☐ | ☑ | ☐ | ☑ | LT + Sirim |
| 6 | 0110 | ☐ | ☑ | ☑ | ☐ | LT + MFG |
| 7 | 0111 | ☐ | ☑ | ☑ | ☑ | LT + MFG + Sirim |
| 8 | 1000 | ☑ | ☐ | ☐ | ☐ | FT only |
| 9 | 1001 | ☑ | ☐ | ☐ | ☑ | FT + Sirim |
| 10 | 1010 | ☑ | ☐ | ☑ | ☐ | FT + MFG |
| 11 | 1011 | ☑ | ☐ | ☑ | ☑ | FT + MFG + Sirim |
| 12 | 1100 | ☑ | ☑ | ☐ | ☐ | FT + LT |
| 13 | 1101 | ☑ | ☑ | ☐ | ☑ | FT + LT + Sirim |
| 14 | 1110 | ☑ | ☑ | ☑ | ☐ | FT + LT + MFG |
| 15 | 1111 | ☑ | ☑ | ☑ | ☑ | Everything |

---

## 🔍 Debugging

### **Check controlPrint value in browser console:**

```javascript
// Get current form state
const formData = {
  ft: document.getElementById('ft').checked,
  lt: document.getElementById('lt').checked,
  mfg: document.getElementById('mfg').checked,
  sirim: document.getElementById('sirim').checked
};

const value = calculateControlPrint(formData);
console.log('Control Print Value:', value);

// Decode back
const decoded = decodeControlPrint(value);
console.log('Decoded:', decoded);
```

### **Check history in localStorage:**

```javascript
const history = JSON.parse(localStorage.getItem('grade_history_HDPE'));
console.log('Grade History:', history);

// Check specific grade
console.log('P901BK/SB/18000:', history['P901BK/SB/18000']);
```

---

## ⚙️ Files Modified

1. **`js/modules/utils/validator.js`**
   - Added `decodeControlPrint()` function

2. **`js/modules/components/formComponent_themed.js`**
   - Import `decodeControlPrint`
   - Decode `controlPrint` in `populateForm()`
   - Restore checkbox states from history

3. **`js/modules/utils/gradeHistoryManager.js`**
   - Store `controlPrint` (camelCase)
   - Support backward compatibility with `controlprint`

---

## 💡 Advantages of Binary System

1. **Space Efficient**: 4 booleans = 1 number (0-15)
2. **Fast Operations**: Bitwise operations are very fast
3. **Easy Storage**: Store single integer in database/localStorage
4. **Clear Logic**: Each bit represents one feature
5. **Extensible**: Can add more bits if needed (up to 32 bits in JS)

---

## 🚀 Future Extensions

If you need more checkboxes (e.g., 8 options):

```javascript
// 8 bits = 128-64-32-16-8-4-2-1
const extendedValue = 0
  | (checkbox1 ? 128 : 0)
  | (checkbox2 ? 64 : 0)
  | (checkbox3 ? 32 : 0)
  | (checkbox4 ? 16 : 0)
  | (ft ? 8 : 0)
  | (lt ? 4 : 0)
  | (mfg ? 2 : 0)
  | (sirim ? 1 : 0);
```

---

**Version:** 1.0.0  
**Last Updated:** December 8, 2025  
**Author:** GitHub Copilot
