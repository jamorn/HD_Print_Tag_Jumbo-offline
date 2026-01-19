// Global functions สำหรับใช้ใน traditional script loading
function shift_table() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return "M"; // กะเช้า
    if (hour >= 14 && hour < 22) return "E"; // กะบ่าย
    return "N"; // กะดึก
}

function updateShift() {
    const shift = shift_table(); // คำนวณกะปัจจุบัน
    const shiftSelect = document.getElementById('shift'); // ดึง element <select>

    // ตั้งค่า value ของ <select> ให้ตรงกับกะปัจจุบัน
    if (shiftSelect) {
        shiftSelect.value = shift;
    }

    // อัพเดทข้อความแสดงกะปัจจุบัน
    const statusMessage = {
        M: "ตอนนี้คือเวลาทำงานของกะเช้า",
        E: "ตอนนี้คือเวลาทำงานของกะบ่าย",
        N: "ตอนนี้คือเวลาทำงานของกะดึก"
    };
    
    // แสดงใน label ของ Shift
    const currentShiftDisplay = document.getElementById('currentShiftDisplay');
    if (currentShiftDisplay) {
        currentShiftDisplay.textContent = statusMessage[shift] || '';
    }
}

// เรียกใช้เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', function() {
    updateShift(); // ตั้งค่าเริ่มต้น
});

// อัพเดทกะทุก 10 วินาที
setInterval(updateShift, 10000);