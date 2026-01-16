# วิธีแก้ปัญหา Cache

ปัญหาที่เกิดคือ browser ยัง cache code เก่าอยู่

## วิธี Hard Refresh:

### Chrome/Edge:
1. กด `Ctrl + Shift + Delete`
2. เลือก "Cached images and files"
3. คลิก "Clear data"

หรือ

1. กด `Ctrl + F5` (Hard Refresh)
2. หรือกด `Ctrl + Shift + R`

### Alternative:
1. เปิด DevTools (F12)
2. คลิกขวาที่ปุ่ม Refresh
3. เลือก "Empty Cache and Hard Reload"

## สิ่งที่ควรเห็นหลัง refresh:

✅ **Navbar ด้านบน:**
- ปุ่ม "Form 1" (สีน้ำเงิน 📄)
- ปุ่ม "Form 2" (สีเขียว ⚡)

✅ **พื้นหลัง:**
- สีม่วงเต็มจอ
- Logo Polimaxx กลางหน้าจอ

✅ **ไม่มี:**
- ❌ Floating buttons ลอยอยู่
- ❌ Panel สีขาวบังหน้าจอ
- ❌ Form แสดงโดยอัตโนมัติ

## การใช้งาน:
1. คลิก "Form 1" → Form1 จะ slide in จากขวา
2. คลิก "Form 2" → Form2 จะ slide in, Form1 จะ slide out
3. Toggle ระหว่าง 2 forms ได้

---

## สรุปการแก้ไขทั้งหมด:

### ลบออก:
1. ✅ Extra green floating button (⚡)
2. ✅ Print/Help floating buttons
3. ✅ Panel สีขาวกลางหน้าจอ

### เพิ่มเข้ามา:
1. ✅ Fixed navbar ด้านบน
2. ✅ ปุ่ม Form 1 และ Form 2 ใน navbar
3. ✅ Slide animation สำหรับ toggle forms

### แก้ไข:
1. ✅ Form panels ใช้ semi-transparent background
2. ✅ Sheet background เป็น transparent (เห็นสีม่วง)
3. ✅ z-index: navbar < forms
4. ✅ Forms ซ่อนโดย default
