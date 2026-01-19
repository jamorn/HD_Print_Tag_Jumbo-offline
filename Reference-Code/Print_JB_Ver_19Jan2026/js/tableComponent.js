// Table Component (IIFE)
(function() {
    // ฟังก์ชัน renderTable
    window.renderTable = function(unit) {
        const container = document.getElementById('tableContainer');
        if (!container) return;
        const gradeOptions = window.generateGradeOptions(unit);
        console.log('🎯 generateGradeOptions called for unit:', unit, 'options length:', gradeOptions.length);
        if (gradeOptions.length > 0) {
            console.log('First option:', gradeOptions[0]);
        }
        console.log('🎯 generateGradeOptions called for unit:', unit, 'options length:', gradeOptions.length);
        if (gradeOptions.length > 0) {
            console.log('First option:', gradeOptions[0]);
        }
        // Generate table rows HTML
        let rowsHTML = '';
        gradeOptions.forEach((option, index) => {
            // Create badge/tag instead of checkbox for better visibility
            let badge;
            if (option.isSub) {
                // SUB grade - Red badge, red text
                badge = `<span class="px-3 py-1 rounded-full text-xs font-bold" 
                              style="background-color: #ef4444; color: white;">
                            SUB
                        </span>`;
            } else {
                // Premium grade - Green badge, normal text color
                badge = `<span class="px-3 py-1 rounded-full text-xs font-bold" 
                              style="background-color: #22c55e; color: white;">
                            TIS ✓
                        </span>`;
            }
            
            console.log('🎨 Rendering option:', option.grade, 'isSub:', option.isSub, 'badge:', badge.substring(0, 50) + '...');
            
                rowsHTML += `
                <tr class="border-b theme-border hover:bg-opacity-50 cursor-pointer grade-row transition-colors"
                    data-grade="${option.grade}"
                    data-netweight="${option.netweight}"
                    data-issub="${option.isSub}"
                    data-gradestring="${option.displayText}"
                    data-display="${option.displayText}">
                    <td class="px-6 py-4 font-semibold ${option.isSub ? 'sub-grade' : 'theme-text-primary'}">${option.displayText}</td>
                    <td class="px-6 py-4 text-center theme-text-primary">${badge}</td>
                </tr>
            `;
        });
        container.innerHTML = `
            <div class="rounded-xl overflow-hidden">
                <!-- Table Header -->
                <div class="p-4 flex items-center justify-between border-b theme-border" style="background-color: var(--bg-secondary);">
                    <h2 class="text-xl font-semibold theme-text-primary">รายการเม็ดพลาสติก (${unit})</h2>
                </div>
                <!-- Search Section -->
                <div class="p-5 border-b theme-border">
                    <label for="searchInput" class="block mb-3 text-sm font-semibold theme-text-primary">Search</label>
                    <div class="relative">
                        <div class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <svg class="w-5 h-5 theme-text-secondary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="text" 
                               id="searchInput" 
                               class="w-full pl-12 pr-4 py-3 border rounded-lg shadow-sm theme-input"
                               placeholder="ค้นหา Grade...">
                    </div>
                </div>
                <!-- Table -->
                <div class="relative overflow-x-auto overflow-y-auto" style="max-height: calc(100vh - 280px);">
                    <table class="w-full text-sm text-left">
                        <thead class="sticky top-0 border-b theme-border" style="background-color: var(--bg-secondary);">
                            <tr>
                                <th scope="col" class="px-6 py-4 font-bold text-base uppercase tracking-wider theme-text-primary">
                                    Product name
                                </th>
                                <th scope="col" class="px-6 py-4 font-bold text-base text-center uppercase tracking-wider theme-text-primary">
                                    TIS
                                </th>
                            </tr>
                        </thead>
                        <tbody id="tableBody">
                            ${rowsHTML}
                        </tbody>
                    </table>
                </div>
                <div class="p-4 border-t theme-border text-center theme-text-secondary text-sm" style="background-color: var(--bg-secondary);">
                    ทั้งหมด ${gradeOptions.length} รายการ
                </div>
            </div>
        `;
        // Setup search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            // Sanitize input to allow only English letters, numbers, and '/'
            searchInput.addEventListener('input', (e) => {
                let raw = e.target.value || '';
                let sanitized = raw.replace(/[^a-zA-Z0-9/]/g, '');
                // Convert to UPPERCASE for consistency
                sanitized = sanitized.toUpperCase();
                if (sanitized !== raw) {
                    e.target.value = sanitized; // update visible input
                    raw = sanitized;
                } else {
                    // ensure visible input is uppercase even if no illegal chars
                    if (e.target.value !== sanitized) e.target.value = sanitized;
                    raw = sanitized;
                }

                const searchTerm = raw; // already uppercase
                const rows = document.querySelectorAll('.grade-row');
                rows.forEach(row => {
                    const displayText = (row.dataset.display || '').toUpperCase();
                    if (displayText.includes(searchTerm)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                });
            });
        }
        // Setup row click handlers
        const rows = document.querySelectorAll('.grade-row');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                const grade = row.dataset.grade;
                const netweight = row.dataset.netweight;
                const isSub = row.dataset.issub === 'true';
                // gradestring now contains the displayText (normalized format), e.g. "AM3245PC SUB/750"
                const gradeString = row.dataset.gradestring;
                // Highlight selected row
                rows.forEach(r => r.style.backgroundColor = '');
                row.style.backgroundColor = 'var(--bg-secondary)';
                // Update form with full grade string
                window.updateFormWithSelection && window.updateFormWithSelection(grade, netweight, isSub, gradeString);
                console.log(`✅ Selected: ${gradeString}`);
            });
        });
    };
})();
