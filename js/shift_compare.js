// เพิ่มการ export ฟังก์ชัน updateShift และ shift_table
export function shift_table() {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 14) return "M"; // กะเช้า
    if (hour >= 14 && hour < 22) return "E"; // กะบ่าย
    return "N"; // กะดึก
}

export function updateShift() {
    const shift = shift_table(); // คำนวณกะปัจจุบัน
    const shiftSelect = document.getElementById('shift'); // ดึง element <select>

    // ตั้งค่า value ของ <select> ให้ตรงกับกะปัจจุบัน
    shiftSelect.value = shift;

    // อัพเดทข้อความสถานะ
    const statusMessage = {
        M: "กะเช้า",
        E: "กะบ่าย",
        N: "กะดึก"
    };
    document.getElementById('statusMessage').textContent = 
        `เวลาขณะนี้อยู่ในช่วง: ${statusMessage[shift]} (${shift})`;
}

// เรียกใช้เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', function() {
    updateShift(); // ตั้งค่าเริ่มต้น
});

// อัพเดทกะทุก 10 วินาที
setInterval(updateShift, 10000);