// updateShift function will be loaded from global scope via shift_compare.js
// Note: This file uses legacy data fetching - consider migrating to UnitConfig.js

// ตรวจสอบว่า global variables ถูกโหลดแล้ว
console.log('🔍 Checking global variables...');
console.log('🔍 updateShift available:', typeof updateShift !== 'undefined');
console.log('⚠️ Legacy script: Consider migrating to UnitConfig.js system');

// GAS API URL
const GAS_API = 'https://script.google.com/macros/s/AKfycbyWY2vTrEFAIcw20YD69xFhwOWaLVD_sanHuArPpP4Y07SpFUOmNClZ8aUn8qVPlVJw/exec';
const PELLET_DATA_KEY = 'hdpe_pellet_cache';
const CACHE_EXPIRY_KEY = 'hdpe_pellet_cache_expiry';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 ชั่วโมง

// ตรวจสอบว่ามี id="statusMessage" ใน HTML
const statusMessageElement = document.getElementById('statusMessage');
if (!statusMessageElement) {
    console.error('Element with id="statusMessage" not found in the DOM.');
}

// ฟังก์ชันสำหรับจัดการ Local Storage
function savePelletDataToCache(data) {
    console.log('💾 Attempting to save data to cache...');
    console.log('💾 Data structure:', {
        hasPellets: !!data?.pellets,
        pelletsLength: data?.pellets?.length || 0,
        totalRecords: data?.total_expanded_records || 'unknown'
    });
    
    try {
        const now = new Date().getTime();
        localStorage.setItem(PELLET_DATA_KEY, JSON.stringify(data));
        localStorage.setItem(CACHE_EXPIRY_KEY, now.toString());
        console.log('💾 บันทึกข้อมูลใน Local Storage เรียบร้อย');
    } catch (error) {
        console.error('❌ Error saving to localStorage:', error);
    }
}

function getPelletDataFromCache() {
    const cachedData = localStorage.getItem(PELLET_DATA_KEY);
    const cacheTime = localStorage.getItem(CACHE_EXPIRY_KEY);
    
    if (!cachedData || !cacheTime) {
        console.log('📂 ไม่พบข้อมูลใน Local Storage');
        return null;
    }
    
    const now = new Date().getTime();
    const timeDiff = now - parseInt(cacheTime);
    
    if (timeDiff > CACHE_DURATION) {
        console.log('⏰ ข้อมูลใน Local Storage หมดอายุแล้ว');
        localStorage.removeItem(PELLET_DATA_KEY);
        localStorage.removeItem(CACHE_EXPIRY_KEY);
        return null;
    }
    
    console.log('📂 ใช้ข้อมูลจาก Local Storage');
    return JSON.parse(cachedData);
}

function clearPelletDataCache() {
    localStorage.removeItem(PELLET_DATA_KEY);
    localStorage.removeItem(CACHE_EXPIRY_KEY);
    console.log('🗑️ ลบข้อมูล cache แล้ว');
}

// ฟังก์ชันสำหรับเรียกข้อมูลจาก GAS API
async function fetchDataFromGAS(forceRefresh = false) {
    console.log('🔍 fetchDataFromGAS called with forceRefresh:', forceRefresh);
    
    // ตรวจสอบ cache ก่อน (ถ้าไม่ใช่ force refresh)
    if (!forceRefresh) {
        console.log('🔍 Checking cache...');
        const cachedData = getPelletDataFromCache();
        if (cachedData) {
            console.log('✅ Using cached data');
            updateDataSourceInfo('Local Storage', cachedData.pellets.length, false);
            return cachedData;
        }
        console.log('❌ No valid cache found');
    }
    
    try {
        console.log('🔄 กำลังเรียกข้อมูลจาก GAS API...');
        console.log('🌐 Current protocol:', window.location.protocol);
        console.log('🌐 GAS_API URL:', GAS_API);
        
        // ตรวจสอบ protocol หากเป็น file:// ให้ใช้ fallback ทันที
        if (window.location.protocol === 'file:') {
            console.log('⚠️ ตรวจพบ file:// protocol - ข้ามการเรียก API');
            console.log('🔄 Forcing fallback to local data...');
            throw new Error('File protocol detected - CORS will block API calls');
        }
        
        console.log('✅ Protocol check passed, proceeding with API call...');
        
        // แสดงข้อความ loading
        if (statusMessageElement) {
            console.log('📱 Updating status message element...');
            statusMessageElement.textContent = '🔄 กำลังโหลดข้อมูลจาก Google Apps Script API...';
            statusMessageElement.className = 'mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800';
            statusMessageElement.classList.remove('hidden');
        }
        
        // เพิ่ม timeout และ enhanced CORS options
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.log('⏰ API call timeout triggered');
            controller.abort();
        }, 15000); // 15 second timeout
        
        console.log('🌐 Making fetch request...');
        const response = await fetch(GAS_API, {
            method: 'GET',
            mode: 'cors', // เพิ่ม CORS mode
            cache: 'no-cache', // ป้องกัน cache issues
            credentials: 'omit', // ไม่ส่ง credentials
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        console.log('📡 Fetch response received, status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        console.log('📊 Parsing JSON response...');
        const data = await response.json();
        console.log('✅ เรียกข้อมูลจาก GAS API สำเร็จ');
        console.log(`📊 ได้รับข้อมูล ${data.total_expanded_records} รายการ`);
        
        // บันทึกข้อมูลใน Local Storage
        savePelletDataToCache(data);
        
        // แสดงข้อความสถานะสำเร็จ
        updateDataSourceInfo('Google Apps Script API', data.total_expanded_records, true);
        
        return data;
    } catch (error) {
        console.error('❌ ไม่สามารถเรียกข้อมูลจาก GAS API:', error);
        console.error('❌ Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        // แสดงข้อมูล error แบบละเอียด
        console.log('🔍 Analyzing error type...');
        let errorMessage = error.message;
        if (error.name === 'AbortError') {
            errorMessage = 'Timeout - การเรียก API ใช้เวลานานเกินไป';
            console.error('⏰ Timeout: การเรียก API ใช้เวลานานเกินไป');
        } else if (error.message.includes('CORS') || 
                   error.message.includes('Access to fetch') ||
                   error.message.includes('Cross-Origin') ||
                   error.message.includes('cors') ||
                   error.name === 'TypeError' ||
                   window.location.protocol === 'file:') {
            errorMessage = 'CORS Error - เปิดไฟล์โดยตรงหรือ Browser บล็อกการเรียก API';
            console.error('🚫 CORS Error: Browser block การเรียก API หรือเปิดไฟล์โดยตรง');
        } else if (error.message.includes('NetworkError') || error.message.includes('Failed to fetch')) {
            errorMessage = 'Network Error - ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต';
            console.error('🌐 Network Error: ปัญหาการเชื่อมต่อเครือข่าย');
        } else {
            console.error('❓ Unknown error type:', error.name, error.message);
        }
        
        console.log('📂 Fallback ไปใช้ข้อมูลจาก hdpe_pellet.js');
        console.log('🔍 hdpe_pellet_data available:', !!hdpe_pellet_data);
        console.log('🔍 hdpe_pellet_data.pellets length:', hdpe_pellet_data?.pellets?.length || 'undefined');
        
        // บันทึกข้อมูล fallback ลง Local Storage เหมือนกับ API
        try {
            savePelletDataToCache(hdpe_pellet_data);
            console.log('💾 บันทึกข้อมูล fallback ใน Local Storage เรียบร้อย');
        } catch (saveError) {
            console.error('❌ Error saving fallback data to cache:', saveError);
        }
        
        // แสดงข้อความสถานะ fallback
        updateDataSourceInfo('ไฟล์ท้องถิ่น (hdpe_pellet.js)', hdpe_pellet_data.pellets.length, false, errorMessage);
        
        console.log('✅ Returning fallback data');
        return hdpe_pellet_data; // fallback ไปใช้ข้อมูลท้องถิ่น
    }
}

// ฟังก์ชันสำหรับอัพเดทข้อมูลสถานะ
function updateDataSourceInfo(source, count, isOnline, errorMessage = null) {
    const dataControls = document.getElementById('dataControls');
    const dataSourceElement = document.getElementById('dataSource');
    const preloader = document.getElementById('preloader');
    
    // ซ่อน preloader
    if (preloader) {
        preloader.classList.add('hidden');
    }
    
    // แสดง data controls
    if (dataControls) {
        dataControls.classList.remove('hidden');
    }
    
    // อัพเดทข้อมูลแหล่งที่มา
    if (dataSourceElement) {
        const statusIcon = isOnline ? '🌐' : '📂';
        const statusColor = isOnline ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800';
        
        dataSourceElement.textContent = `${statusIcon} ${source} (${count} รายการ)`;
        dataSourceElement.className = `px-3 py-1 ${statusColor} rounded-full text-sm font-medium`;
    }
    
    // แสดงข้อความใน status message
    if (statusMessageElement) {
        if (errorMessage) {
            statusMessageElement.textContent = `⚠️ API ไม่สามารถเชื่อมต่อได้ - ใช้ข้อมูลจาก${source} (${count} รายการ) - เหตุผล: ${errorMessage}`;
            statusMessageElement.className = 'mb-4 p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800';
        } else if (isOnline) {
            statusMessageElement.textContent = `✅ อัพเดทข้อมูลจาก ${source} เรียบร้อย (${count} รายการ)`;
            statusMessageElement.className = 'mb-4 p-4 rounded-lg bg-green-50 border border-green-200 text-green-800';
        } else {
            statusMessageElement.textContent = `📂 ใช้ข้อมูลจาก ${source} (${count} รายการ) - ข้อมูลถูกเก็บใน Local Storage แล้ว`;
            statusMessageElement.className = 'mb-4 p-4 rounded-lg bg-blue-50 border border-blue-200 text-blue-800';
        }
        statusMessageElement.classList.remove('hidden');
        
        // ซ่อนข้อความหลังจาก 5 วินาที
        setTimeout(() => {
            if (statusMessageElement) {
                statusMessageElement.classList.add('hidden');
            }
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 DOM Content Loaded - Starting application...');
    console.log('🌐 Current location protocol:', window.location.protocol);
    console.log('🌐 Current location href:', window.location.href);
    
    const tableBody = document.querySelector('#dataTable tbody');
    const searchInput = document.querySelector('#searchInput');
    const refreshDataBtn = document.getElementById('refreshDataBtn');
    
    // เรียกข้อมูลจาก GAS API หรือ fallback ไปใช้ข้อมูลท้องถิ่น
    let dataSource;
    let pellets;
    
    try {
        console.log('🔄 Attempting to fetch data...');
        dataSource = await fetchDataFromGAS();
        pellets = dataSource.pellets;
        console.log('✅ Data fetch completed successfully');
    } catch (error) {
        console.error('❌ Error in data fetching:', error);
        // Fallback to local data if everything fails
        console.log('🆘 Emergency fallback to hdpe_pellet_data...');
        dataSource = hdpe_pellet_data;
        pellets = dataSource.pellets;
    }

    console.log('📊 Data source:', dataSource); // ตรวจสอบว่าข้อมูลถูกนำเข้ามา
    console.log('🔢 Total pellets:', pellets.length); // ตรวจสอบว่า pellets มีข้อมูล

    // ย้ายตัวแปร frequency ไปไว้ด้านบนเพื่อหลีกเลี่ยงการประกาศซ้ำ
    const frequency = ["P901BK", "P921BK"]; // รายการ Grade ที่ใช้งานบ่อย
    
    // Array สำหรับเก็บค่า netweight ที่ต้องการให้ lot ขึ้นต้นด้วย 9
    const lotStartWithNine = [1650, 1800, 16500, 18000]; // ค่าที่จะให้ขึ้นต้นด้วย 9

    // ปรับปรุงการจัดเรียงข้อมูล pellets โดยใช้ startsWith เพื่อตรวจสอบ Grade ที่ขึ้นต้นด้วยค่าจาก frequency
    pellets.sort((a, b) => {
        const startsWithA = frequency.some(freq => a.Grade.startsWith(freq));
        const startsWithB = frequency.some(freq => b.Grade.startsWith(freq));

        if (startsWithA && !startsWithB) return -1; // a ขึ้นต้นด้วยค่าจาก frequency แต่ b ไม่ขึ้นต้น
        if (!startsWithA && startsWithB) return 1;  // b ขึ้นต้นด้วยค่าจาก frequency แต่ a ไม่ขึ้นต้น
        return a.Grade.localeCompare(b.Grade); // จัดเรียงตามตัวอักษรหากไม่ขึ้นต้นด้วยค่าจาก frequency
    });

    // เพิ่มคอลัมน์ใหม่ในฟังก์ชันสร้างแถว
    const createRow = (pellet) => {
        const row = document.createElement('tr');
        row.className = 'data-table-row';
        row.innerHTML = `
        <th scope="row" class="px-6 py-4 font-semibold text-base text-white whitespace-nowrap">${pellet.Grade}</th>
        <td class="px-6 py-4 text-center">
            <input type="checkbox" class="tis-checkbox w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded cursor-not-allowed" ${pellet.tis === 'Y' ? 'checked' : ''} disabled>
        </td>
    `;

        return row;
    };

    // เพิ่มข้อมูลลงในตาราง
    pellets.forEach((pellet) => {
        const row = createRow(pellet);
        tableBody.appendChild(row);
    });

    // ฟังก์ชันค้นหา
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        const filteredData = pellets.filter((pellet) =>
            pellet.Grade.toLowerCase().includes(searchTerm)
        );
        renderTable(filteredData); // แสดงข้อมูลที่กรอง
    });

    // ฟังก์ชัน setupRowEventListeners เพื่อเพิ่ม event listeners ให้แถวในตาราง
    const setupRowEventListeners = () => {
        const tableRows = document.querySelectorAll('#dataTable tbody tr');
        tableRows.forEach(row => {
            row.addEventListener('click', () => {
                tableRows.forEach(r => r.classList.remove('selected')); // ลบคลาส selected จากแถวอื่น
                row.classList.add('selected'); // เพิ่มคลาส selected ให้แถวที่คลิก

                // รีเซ็ตข้อความใน lot-error
                const lotError = document.getElementById('lot-error');
                if (lotError) {
                    lotError.textContent = '';
                    lotError.style.color = ''; // รีเซ็ตสีข้อความ
                }

                // ดึงค่าจากแถวที่เลือก

                const currentYear = new Date().getFullYear();
                const twoDigitYear = currentYear.toString().slice(-2);
                console.log(twoDigitYear);
                const grade = row.cells[0].innerText;
                const netweight = grade.split('/').pop();
                console.log(typeof netweight); console.log("netweight " + netweight);
                console.log(typeof parseInt(netweight, 10));
                
                let lot;
                if (!isNaN(netweight)) {
                    let netweightNum = parseInt(netweight, 10);
                    console.log(netweightNum); // 750 900 1800
                    console.log(typeof netweightNum); // "number"
                    
                    // ตรวจสอบว่า netweight อยู่ใน array lotStartWithNine หรือไม่
                    if (lotStartWithNine.includes(netweightNum)) {
                        lot = "9" + twoDigitYear;
                        console.log(`netweight ${netweightNum} อยู่ใน array -> lot ขึ้นต้นด้วย 9`);
                    } else {
                        lot = netweight.charAt(0) + twoDigitYear;
                        console.log(`netweight ${netweightNum} ไม่อยู่ใน array -> lot ขึ้นต้นด้วย ${netweight.charAt(0)}`);
                    }
                } else {
                    console.log("ค่า netweight ไม่สามารถแปลงเป็นตัวเลขได้");
                    lot = netweight.charAt(0) + twoDigitYear; // fallback
                }
                const tisCheckbox = row.cells[1].querySelector('.tis-checkbox'); // ดึง checkbox
                const tis = tisCheckbox.checked ? 'Y' : 'N'; // ใช้ค่าจาก checkbox

                // ค้นหาข้อมูลจาก hdpe_pellet_data ที่มี Grade ตรงกัน
                const pelletData = pellets.find(pellet => pellet.Grade === grade);

                // ใส่ค่าลงในฟอร์ม
                document.getElementById('grade').value = grade;
                document.getElementById('netweight').value = netweight;
                document.getElementById('lot').value = lot;
                document.getElementById('tis').value = tis; // อัปเดตค่าจาก checkbox

                // เก็บข้อมูลเพิ่มเติมจาก pelletData เพื่อใช้ในภายหลัง
                if (pelletData) {
                    window.selectedPelletData = {
                        grade: grade,
                        netweight: netweight,
                        lot: lot,
                        tis: tis,
                        title1: pelletData.title1,
                        title2: pelletData.title2,
                        sirim_title1: pelletData.sirim_title1,
                        sirim_title2: pelletData.sirim_title2,
                        sirim_title3: pelletData.sirim_title3
                    };
                }

                console.log({ grade, netweight, lot, tis, pelletData }); // log ค่าเพื่อการตรวจสอบ
            });
        });
    };

    // เพิ่มการจัดเรียงข้อมูล Grade ที่ใช้งานบ่อยที่สุดก่อนการเรนเดอร์ตาราง
    const renderTable = (data) => {
        // จัดเรียงข้อมูลโดยนำ Grade ที่อยู่ใน frequency ขึ้นก่อน
        const sortedData = data.sort((a, b) => {
            const indexA = frequency.indexOf(a.Grade);
            const indexB = frequency.indexOf(b.Grade);

            if (indexA !== -1 && indexB === -1) return -1; // a อยู่ใน frequency แต่ b ไม่อยู่
            if (indexA === -1 && indexB !== -1) return 1;  // b อยู่ใน frequency แต่ a ไม่อยู่
            return 0; // ทั้งคู่ไม่อยう่ใน frequency หรืออยู่ใน frequency ทั้งคู่
        });

        tableBody.innerHTML = '';
        sortedData.forEach((pellet) => {
            const row = createRow(pellet);
            tableBody.appendChild(row);
        });

        // เพิ่ม event listeners หลังจากเรนเดอร์ตารางเสร็จ
        setupRowEventListeners();
    };

    // เรียกใช้ setupRowEventListeners ครั้งแรกเมื่อโหลดหน้า
    setupRowEventListeners();

    // Event listener สำหรับปุ่ม Refresh Data
    if (refreshDataBtn) {
        refreshDataBtn.addEventListener('click', async () => {
            refreshDataBtn.disabled = true;
            refreshDataBtn.textContent = '🔄 กำลังอัพเดท...';
            
            try {
                // ลบ cache และเรียกข้อมูลใหม่
                clearPelletDataCache();
                dataSource = await fetchDataFromGAS(true);
                pellets = dataSource.pellets;
                
                // เรนเดอร์ตารางใหม่
                renderTable(pellets);
                
                console.log('✅ อัพเดทข้อมูลเรียบร้อย');
            } catch (error) {
                console.error('❌ เกิดข้อผิดพลาดในการอัพเดทข้อมูล:', error);
            } finally {
                refreshDataBtn.disabled = false;
                refreshDataBtn.textContent = '🔄 อัพเดทข้อมูล';
            }
        });
    }

    // ใช้ SweetAlert2 สำหรับการแจ้งเตือน
    const Swal = window.Swal;

    // ลบ event listener สำหรับ onchange/oninput และตรวจสอบเฉพาะตอน submit
    const validateForm = () => {
        const requiredFields = [
            { id: 'lot', message: 'Lot ต้องมีความยาว 10 ตัว' },
            { id: 'grade', message: 'กรุณาเลือก Grade จาก ตารางด้านล่าง' },
            { id: 'netweight', message: 'กรุณากรอก Net Weight' },
            { id: 'frompage', message: 'กรุณากรอก From Page ให้ถูกต้อง (ค่ามากกว่าหรือเท่ากับ 1)' },
            { id: 'topage', message: 'กรุณากรอก To Page ให้ถูกต้อง (ค่ามากกว่าหรือเท่ากับ 1)' }
        ];

        for (const field of requiredFields) {
            const input = document.getElementById(field.id);
            if (!input || input.value.trim() === '') {
                Swal.fire({
                    icon: 'error',
                    title: 'ข้อผิดพลาด',
                    text: field.message
                });
                return false;
            }

            // ตรวจสอบความยาวของ Lot
            if (field.id === 'lot' && input.value.trim().length !== 10) {
                Swal.fire({
                    icon: 'error',
                    title: 'ข้อผิดพลาด',
                    text: 'Lot ต้องมีความยาว 10 ตัว'
                });
                return false;
            }

            // ตรวจสอบลำดับของ From Page และ To Page
            if ((field.id === 'frompage' || field.id === 'topage') && input.value.trim() !== '') {
                const fromPageField = document.getElementById('frompage');
                const toPageField = document.getElementById('topage');

                if (fromPageField && toPageField) {
                    const fromPageValue = parseInt(fromPageField.value);
                    const toPageValue = parseInt(toPageField.value);

                    // อนุญาตให้ From Page และ To Page เท่ากันได้
                    if (fromPageValue > toPageValue || fromPageValue < 1 || toPageValue < 1) {
                        Swal.fire({
                            icon: 'error',
                            title: 'ข้อผิดพลาด',
                            text: 'From Page ต้องน้อยกว่าหรือเท่ากับ To Page และค่าต้องมากกว่าหรือเท่ากับ 1'
                        });
                        return false;
                    }
                }
            }
        }

        return true;
    };

    // ฟังก์ชันสำหรับบันทึกข้อมูลใน sessionStorage
    const saveToSessionStorage = (data) => {
        sessionStorage.setItem('recent_hd_print', JSON.stringify(data));
    };

    // ฟังก์ชันสำหรับโหลดข้อมูลจาก sessionStorage
    const loadFromSessionStorage = () => {
        const data = sessionStorage.getItem('recent_hd_print');
        return data ? JSON.parse(data) : null;
    };

    // ฟังก์ชันสำหรับคำนวณค่า controlprint จาก checkbox
    const calculateControlPrint = () => {
        let controlprint = 0;
        const checkboxes = document.querySelectorAll('input[name="controlprint"]');

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                controlprint += parseInt(checkbox.value);
            }
        });

        return controlprint.toString();
    };

    // ฟังก์ชันสำหรับตั้งค่า checkbox จากค่า controlprint
    const setCheckboxesFromControlPrint = (controlprint) => {
        const value = parseInt(controlprint) || 3; // default เป็น 3 (mfg=2 + sirim=1)

        document.getElementById('ft').checked = (value & 8) !== 0;
        document.getElementById('lt').checked = (value & 4) !== 0;
        document.getElementById('mfg').checked = (value & 2) !== 0;
        document.getElementById('sirim').checked = (value & 1) !== 0;
    };

    // โหลดข้อมูลจาก sessionStorage เมื่อหน้าโหลด
    const savedData = loadFromSessionStorage();
    if (savedData) {
        document.getElementById('grade').value = savedData.grade || '';
        document.getElementById('netweight').value = savedData.netweight || '';
        document.getElementById('lot').value = savedData.lot || '';
        document.getElementById('frompage').value = savedData.fromPage || '';
        document.getElementById('topage').value = savedData.toPage || '';
        document.getElementById('shift').value = savedData.shift || '';
        document.getElementById('tis').value = savedData.tis || ''; // เติมค่า tis

        const idateSelect = document.getElementById('idate');
        if (idateSelect && savedData.idate) {
            idateSelect.value = savedData.idate; // ตั้งค่า idate เป็นค่าเดียว
        }

        // ตั้งค่า checkbox จากค่า controlprint
        if (savedData.controlprint) {
            setCheckboxesFromControlPrint(savedData.controlprint);
        } else {
            // ถ้าไม่มีค่า controlprint ใน savedData ให้ใช้ค่า default
            setCheckboxesFromControlPrint('3');
        }

        // เก็บข้อมูล pellet ที่บันทึกไว้
        if (savedData.title1) {
            window.selectedPelletData = {
                grade: savedData.grade,
                netweight: savedData.netweight,
                lot: savedData.lot,
                tis: savedData.tis,
                title1: savedData.title1,
                title2: savedData.title2,
                sirim_title1: savedData.sirim_title1,
                sirim_title2: savedData.sirim_title2,
                sirim_title3: savedData.sirim_title3
            };
        }
    } else {
        // ถ้าไม่มี savedData ให้ตั้งค่า default checkbox (mfg และ sirim เป็น true)
        setCheckboxesFromControlPrint('3');
    }

    // เปิดใช้งานปุ่ม "ดูรายงาน" หากมีข้อมูลใν sessionStorage
    const viewReportButton = document.getElementById('btn_view_report');
    if (viewReportButton && savedData) {
        viewReportButton.disabled = false;
    }

    // ตรวจสอบเฉพาะตอน submit
    const submitButton = document.getElementById('btn_hd_push');
    submitButton.addEventListener('click', (event) => {
        if (!validateForm()) {
            event.preventDefault(); // ป้องกันการส่งฟอร์มหากไม่ผ่านการตรวจสอบ
            return;
        }

        // เก็บข้อมูลฟอร์มใน sessionStorage
        const controlprint = calculateControlPrint();
        const selectedData = window.selectedPelletData || {};

        // Enhanced Grade Mapping - ค้นหาข้อมูลจาก hdpe_pellet.js
        const currentGrade = document.getElementById('grade').value;
        const pelletData = pellets.find(pellet => pellet.Grade === currentGrade);

        // Grade mapping validation
        console.log('🔍 Grade mapping: ' + currentGrade);

        // ใช้ข้อมูลจาก pelletData (จาก mapping) หรือ selectedData (จาก row click) หรือ fallback
        const mappedData = pelletData || selectedData || {};
        
        // Determine unit from grade
        let unit = 'HDPE';
        let qrCodeUrl = 'https://appdb.tisi.go.th/Q/i.php?d=1351525040';
        
        if (currentGrade.includes('PP') || currentGrade.includes('1105') || currentGrade.includes('1102')) {
            unit = 'PP';
            qrCodeUrl = 'https://appdb.tisi.go.th/Q/i.php?d=3828891212';
        } else if (currentGrade.includes('PPC')) {
            unit = 'PPC';
            qrCodeUrl = 'https://appdb.tisi.go.th/Q/i.php?d=3828891212';
        }

        const formData = {
            grade: currentGrade,
            netweight: document.getElementById('netweight').value,
            lot: document.getElementById('lot').value,
            fromPage: document.getElementById('frompage').value,
            toPage: document.getElementById('topage').value,
            shift: document.getElementById('shift').value,
            idate: document.getElementById('idate').value, // ส่งค่าเดียว
            tis: document.getElementById('tis').value, // เพิ่ม tis
            controlprint: controlprint, // เพิ่ม controlprint
            title1: mappedData.title1 || 'HDPE',
            title2: mappedData.title2 || 'HIGHT DENSITY POLYETHYLENE',
            sirim_title1: mappedData.sirim_title1 || 'Certified to MS1058 : PART 1 : 2005',
            sirim_title2: mappedData.sirim_title2 || 'Certified No. : PC004152',
            sirim_title3: mappedData.sirim_title3 || 'Designation : PE100',
            unit: unit,
            qrCodeUrl: qrCodeUrl
        };

        // Log mapping success
        console.log('✅ Grade mapped successfully');

        saveToSessionStorage(formData);

        // Log submission
        console.log('✅ Form submitted: ' + formData.grade + ' | Lot: ' + formData.lot);

        // เปิดใช้งานปุ่ม "ดูรายงาน" หลังจากบันทึกข้อมูล
        const viewReportBtn = document.getElementById('btn_view_report');
        if (viewReportBtn) {
            viewReportBtn.disabled = false;
        }

        // แสดงข้อความแจ้งเตือนพร้อมเปิดรายงาน
        Swal.fire({
            icon: 'success',
            title: 'บันทึกข้อมูลเรียบร้อย',
            text: 'กำลังเปิดหน้ารายงาน...',
            timer: 1500,
            showConfirmButton: false
        }).then(() => {
            // เปิดหน้ารายงานทันที
            window.location.href = 'report.html';
        });
    });

    // เพิ่ม event listener สำหรับปุ่ม "ดูรายงาน" (Hold ไว้ก่อน - แสดง log เท่านั้น)
    const viewReportBtn = document.getElementById('btn_view_report');
    if (viewReportBtn) {
        viewReportBtn.addEventListener('click', () => {
            const savedData = loadFromSessionStorage();
            if (savedData) {
                console.log('� Opening report for: ' + savedData.grade);

                // เปิด report ทันที
                window.location.href = 'report.html';

            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'ไม่พบข้อมูล',
                    text: 'กรุณา Submit ข้อมูลก่อนดูรายงาน'
                });
            }
        });
    }

    // Mustache functionality removed - using only HTML report

    // เรียกใช้ updateShift เมื่อโหลดหน้า
    updateShift(); // อัปเดต Shift อัตโนมัติเมื่อโหลดหน้า

    // ตั้งค่า id="idate" ให้เลือกวันที่ปัจจุบันอัตโนมัติ
    const today = new Date().getDate();
    const idateSelect = document.getElementById('idate');

    if (idateSelect) {
        const options = idateSelect.options;
        for (let i = 0; i < options.length; i++) {
            if (parseInt(options[i].value) === today) {
                options[i].selected = true;
                break;
            }
        }
    }
    console.log("idateSelect:", idateSelect);
    console.log("Options:", idateSelect ? idateSelect.options : "idateSelect not found");

    // เพิ่ม Two-way Data Binding เพื่อแสดงจำนวนตัวอักษรที่ป้อนใน lot
    const lotInput = document.getElementById('lot');
    const lotError = document.getElementById('lot-error');

    // ดักจับ keyboard ก่อนที่ตัวอักษรจะเข้า input
    lotInput.addEventListener('keydown', (e) => {
        const key = e.key;
        const currentValue = e.target.value;
        
        // อนุญาต: ตัวเลข 0-9, Backspace, Delete, Arrow keys, Tab, Enter
        const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Tab', 'Enter', 'Home', 'End'];
        
        // ตรวจสอบว่าเป็น Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
        if (e.ctrlKey || e.metaKey) {
            return; // อนุญาตให้ใช้ keyboard shortcuts
        }
        
        // ถ้าเป็นตัวเลข 0-9 และยังไม่เกิน 10 ตัว
        if (/^[0-9]$/.test(key)) {
            if (currentValue.length >= 10) {
                e.preventDefault(); // ป้องกันไม่ให้ใส่เกิน 10 ตัว
            }
            return;
        }
        
        // ถ้าเป็น key ที่อนุญาต
        if (allowedKeys.includes(key)) {
            return;
        }
        
        // ถ้าไม่ใช่ตัวเลขหรือ key ที่อนุญาต ให้ block
        e.preventDefault();
    });

    // อัพเดทการแสดงผลจำนวนตัวอักษร
    lotInput.addEventListener('input', (e) => {
        const length = e.target.value.length;
        
        // หากครบ 10 ตัว ให้เปลี่ยนข้อความเป็นสีเขียว
        if (length === 10) {
            lotError.className = 'text-green-500 text-sm font-semibold';
            lotError.textContent = `✅ คุณป้อน ${length} ตัว (ครบถ้วน)`;
        } else if (length > 0) {
            lotError.className = 'text-red-500 text-sm';
            lotError.textContent = `คุณป้อน ${length} ตัว`;
        } else {
            lotError.className = 'text-red-500 text-sm font-medium';
            lotError.textContent = '';
        }
    });

    function handlePackageSize(unit, grade) {
      const packageSizes = {
        HDPE: [750, 800, 900, 16500, 18000],
        PP: [750, 800, 900, 12000, 15000],
        PPC: [750, 800, 900, 10000, 20000]
      };

      const sizes = packageSizes[unit] || [];
      return sizes.map(size => {
        const suffix = size >= 16000 ? '/SB/' : '/';
        return `${grade}${suffix}${size}`;
      });
    }

    // Example usage
    const unit = 'PP';
    const grade = '1102H';
    const packageList = handlePackageSize(unit, grade);
    console.log(packageList); // ['1102H/750', '1102H/800', '1102H/900', '1102H/SB/12000', '1102H/SB/15000']
});
