# 📋 Grade History Feature - User Guide

## ✨ ฟีเจอร์ใหม่: ระบบจัดเก็บประวัติ Grade

ระบบจะจดจำข้อมูลที่คุณเคยใช้งานสำหรับแต่ละ Grade และนำกลับมาใช้ใหม่ได้อัตโนมัติ

---

## 🎯 ความสามารถหลัก

### 1️⃣ **บันทึกประวัติอัตโนมัติ**
- ทุกครั้งที่กด "ยืนยันและบันทึกข้อมูล" ระบบจะบันทึก:
  - Lot Number
  - Net Weight
  - From Page / To Page
  - Shift
  - Date
  - Control Print settings (FT, LT, MFG, Sirim)
- จัดเก็บแยกตาม **Unit** (HDPE, PP, PPC)
- เก็บใน **localStorage** ของ browser

### 2️⃣ **โหลดข้อมูลล่าสุดอัตโนมัติ**
เมื่อเปิดหน้าใหม่ (ไม่มี session data):
- ระบบจะโหลดข้อมูล Grade ล่าสุดที่ใช้งาน
- แสดงการแจ้งเตือนด้านบนขวา (Toast)
- คุณสามารถแก้ไขข้อมูลได้ตามต้องการ

### 3️⃣ **ดูประวัติทั้งหมด**
คลิกปุ่ม **📋 ประวัติ** ที่มุมขวาบนของฟอร์ม:
- แสดงรายการ Grade ทั้งหมดที่เคยใช้งาน
- เรียงลำดับจากล่าสุดไปเก่าสุด
- แสดงข้อมูล: Lot, Net Weight, วันที่บันทึก
- คลิกแถวใดก็ได้เพื่อโหลดข้อมูล

### 4️⃣ **โหลดประวัติจากตาราง**
เมื่อคลิกเลือก Grade จากตาราง:
- ระบบจะค้นหาประวัติ Grade นั้นอัตโนมัติ
- นำข้อมูลเดิมมาใส่ในฟอร์ม (ถ้ามี)
- ไม่ต้องกรอกข้อมูลซ้ำ

---

## 📊 ตัวอย่างการใช้งาน

### **กรณีที่ 1: ใช้ Grade ซ้ำ**
```
1. เลือก P901BK/SB/18000 จากตาราง
2. ระบบโหลดข้อมูลล่าสุด:
   - Lot: 9250000456
   - From Page: 1
   - To Page: 5
   - Shift: E
3. แก้ไขเฉพาะ Lot เป็น 9250000789
4. กดยืนยัน → บันทึกเป็นประวัติใหม่
```

### **กรณีที่ 2: เปิดหน้าใหม่**
```
1. เปิด browser ใหม่
2. ระบบแสดง Toast: "โหลดข้อมูล P901BK/SB/18000 ล่าสุดจากประวัติ"
3. ข้อมูลทั้งหมดพร้อมใช้งาน
4. กรอกเฉพาะ Lot ใหม่
```

### **กรณีที่ 3: ดูประวัติทั้งหมด**
```
1. คลิกปุ่ม 📋 ประวัติ
2. เห็นรายการ:
   #1 P901BK/SB/18000 | Lot: 925... | 08/12/2025 15:30
   #2 P921BK/750       | Lot: 720... | 07/12/2025 10:15
3. คลิกแถว #2 เพื่อโหลด P921BK/750
```

---

## 🔧 รายละเอียดทางเทคนิค

### **localStorage Structure**
```javascript
// Key format
grade_history_{unit}

// Example: grade_history_HDPE
{
  "P901BK/SB/18000": {
    "lot": "9250000456",
    "netweight": "18000",
    "fromPage": "1",
    "toPage": "5",
    "shift": "E",
    "idate": "28",
    "tis": "Y",
    "controlprint": 3,
    "timestamp": "2025-12-08T10:30:00.000Z"
  },
  "P921BK/750": {
    ...
  }
}
```

### **Auto-detect Unit**
ระบบจะตรวจจับ Unit จาก Grade name:
- **HDPE**: P901BK, P921BK, P801BK, etc.
- **PP**: 1102H, PP-HOMO, PP750, etc.
- **PPC**: 3220MPC, PPC-COPO, etc.

---

## ⚙️ Files Modified

1. **`js/modules/utils/gradeHistoryManager.js`** (NEW)
   - Grade History Manager class
   - Methods: save, load, getLastUsedGrade, clearHistory

2. **`js/modules/components/formComponent_themed.js`** (UPDATED)
   - Import gradeHistory module
   - Save history on form submit
   - Load history when populating form
   - Auto-load last used grade on init
   - Show history modal

3. **`js/modules/components/tableComponent.js`** (UPDATED)
   - Add unit detection (detectUnit method)
   - Include unit in rowData

---

## 🎨 UI Components Added

### **📋 ประวัติ Button**
- Location: Form header (top-right)
- Color: Secondary theme color
- Function: Open history modal

### **History Modal**
- Table with Grade, Lot, Net Weight, Date columns
- "โหลด" button for each row
- Click anywhere on row to load data
- Responsive design

### **Toast Notification**
- Auto-load notification on page load
- Shows Grade name being loaded
- 3-second auto-dismiss

---

## 💡 Best Practices

1. **ใช้ Grade ซ้ำบ่อย**: ระบบจะจำค่าเดิม ไม่ต้องกรอกใหม่
2. **เปลี่ยน Unit**: ประวัติแยกตาม Unit (HDPE/PP/PPC)
3. **ตรวจสอบข้อมูล**: ก่อนกดยืนยัน ควรตรวจสอบค่าที่โหลดมา
4. **ล้าง Cache**: ถ้าต้องการเริ่มใหม่ ล้าง localStorage ใน DevTools

---

## 🐛 Troubleshooting

**Q: ประวัติไม่แสดง?**
- ตรวจสอบว่ามีการกดยืนยันข้อมูลแล้วหรือไม่
- ลองเปิด DevTools → Application → Local Storage → ดู `grade_history_HDPE`

**Q: โหลดข้อมูลผิด Grade?**
- ตรวจสอบ Unit ที่ detect ได้ถูกต้องหรือไม่
- บาง Grade อาจมีชื่อคล้ายกัน ระบบใช้ timestamp ล่าสุด

**Q: ต้องการลบประวัติ?**
```javascript
// In browser console
localStorage.removeItem('grade_history_HDPE');
localStorage.removeItem('grade_history_PP');
localStorage.removeItem('grade_history_PPC');
```

---

## 🚀 Future Enhancements

- [ ] Export history to Excel
- [ ] Search/Filter in history modal
- [ ] Delete individual history entry
- [ ] Import/Export history for backup
- [ ] Statistics: Most used grades
- [ ] History limit (max 100 entries per unit)

---

## 📞 Support

หากพบปัญหาหรือมีข้อเสนอแนะ กรุณาติดต่อทีมพัฒนา

**Version:** 1.0.0  
**Last Updated:** December 8, 2025  
**Compatible with:** Chrome, Edge, Firefox (latest versions)
