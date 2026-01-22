/**
 * Table Component
 * Handles pellet data table rendering, search, and row selection
 */

import { saveWithExpiry, getWithExpiry } from '../utils/storage.js';
import { getUnitConfig, generateGradeOptions } from '../report/config/UnitConfig.js';

export class TableComponent {
    constructor() {
        this.pellets = [];
        this.filteredPellets = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.onRowClickCallback = null;
        this.currentUnit = 'HDPE'; // Default unit
        
        // GAS API configuration
        this.GAS_API = 'https://script.google.com/macros/s/AKfycbyWY2vTrEFAIcw20YD69xFhwOWaLVD_sanHuArPpP4Y07SpFUOmNClZ8aUn8qVPlVJw/exec';
        this.CACHE_KEY = 'hdpe_pellet_cache';
        this.CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    }

    /**
     * Render table HTML
     * @returns {string} HTML string
     */
    async render() {
        // Fetch data first
        await this.fetchData();
        
        return `
        <div id="tableComponentContainer">
            <!-- Preloader -->
            <div id="preloader" class="mb-6 p-6 theme-card rounded-xl border theme-border shadow-2xl text-center ${this.pellets.length > 0 ? 'hidden' : ''}">
                <div class="inline-block w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-3" style="border-color: var(--primary-color); border-top-color: transparent;"></div>
                <p class="theme-text-primary font-semibold text-base">กำลังโหลดข้อมูล...</p>
            </div>

            <!-- Data Controls (DISABLED - Using UnitConfig)
            <div id="dataControls" class="mb-6 p-5 theme-card rounded-xl border theme-border shadow-2xl ${this.pellets.length === 0 ? 'hidden' : ''}">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div class="flex items-center space-x-3">
                        <span class="text-base font-semibold theme-text-primary">แหล่งข้อมูล:</span>
                        <span id="dataSource" class="px-4 py-2 rounded-full text-base font-semibold border" style="background-color: var(--bg-secondary); color: var(--text-primary); border-color: var(--border-color);"></span>
                    </div>
                    <button id="refreshDataBtn" 
                            class="font-bold rounded-lg px-6 py-3 transition-all transform hover:shadow-lg theme-btn-primary">
                        อัพเดทข้อมูล
                    </button>
                </div>
            </div>
            -->

            <!-- Data Table with Search -->
            <div class="rounded-xl overflow-hidden shadow-2xl theme-card border theme-border">
                <!-- Table Header -->
                <div class="theme-card-header p-4 flex items-center justify-between border-b theme-border">
                    <h2 class="text-xl font-semibold theme-text-primary">รายการเม็ดพลาสติก</h2>
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
                               class="w-full pl-12 pr-4 py-3 border theme-input rounded-lg shadow-sm"
                               placeholder="ค้นหา Grade...">
                    </div>
                </div>

                <!-- Table -->
                <div class="relative overflow-x-auto">
                    <table id="dataTable" class="w-full text-sm text-left dark-table">
                        <thead class="theme-card-header border-b theme-border">
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
                            <!-- Rows will be inserted here -->
                        </tbody>
                    </table>
                </div>

                <!-- Pagination -->
                <div class="flex items-center justify-between p-5 theme-card-header border-t theme-border">
                    <button id="prevPage" 
                            disabled
                            class="opacity-50 cursor-not-allowed font-bold rounded-lg px-6 py-3"
                            style="background-color: var(--bg-secondary); color: var(--text-secondary);">
                        ก่อนหน้า
                    </button>
                    <span id="pageInfo" class="text-base theme-text-primary font-bold">หน้า 1</span>
                    <button id="nextPage"
                            class="font-bold rounded-lg px-6 py-3 transition-all transform hover:shadow-lg theme-btn-primary">
                        ถัดไป
                    </button>
                </div>
            </div>
        </div>
        `;
    }

    /**
     * Initialize component
     * @param {function} onRowClick - Callback for row click
     */
    init(onRowClick) {
        this.onRowClickCallback = onRowClick;
        this.setupEventListeners();
        this.renderTable();
        // this.updateDataSourceInfo(); // DISABLED: Using UnitConfig
    }

    /**
     * Fetch pellet data from API or cache
     * TEMPORARILY USING UnitConfig INSTEAD OF GAS API FOR TESTING
     */
    async fetchData() {
        console.log('📦 Using UnitConfig data (GAS API disabled for testing)');
        
        // Generate mock data from UnitConfig for all units (including SUB variants)
        const allPellets = [];
        const units = ['HDPE', 'PP', 'PPC'];
        
        units.forEach(unitName => {
            const config = getUnitConfig(unitName);
            const gradeOptions = generateGradeOptions(unitName); // Use function that creates Premium + SUB variants
            
            gradeOptions.forEach(option => {
                const gradeDisplay = option.displayText; // Use displayText from generateGradeOptions
                
                allPellets.push({
                    Grade: gradeDisplay, // Full display text (e.g., "P900BK/750" or "P900BK SUB/750")
                    NetWeight: option.netweight,
                    TIS: option.isSub ? 'N' : (config.defaults.tis || 'Y'), // SUB grades don't have TIS certification
                    Plant_Owner: unitName,
                    unit: unitName,
                    description: option.description,
                    isSub: option.isSub,
                    baseGrade: option.grade // Store base grade for filtering
                });
            });
        });
        
        this.pellets = allPellets;
        console.log(`✅ Generated ${allPellets.length} pellet records from UnitConfig (including SUB variants)`);
        
        this.filterByUnit(); // Apply unit filter
        this.sortPellets();
        
        /* DISABLED: GAS API and Cache
        // Check cache first
        const cachedData = getWithExpiry(this.CACHE_KEY);
        if (cachedData) {
            console.log('📂 Using cached pellet data');
            this.pellets = cachedData.pellets || [];
            this.filterByUnit();
            this.sortPellets();
            return;
        }

        // Try to fetch from GAS API
        if (window.location.protocol !== 'file:') {
            try {
                console.log('🔄 Fetching pellet data from GAS API...');
                const response = await fetch(this.GAS_API);
                const data = await response.json();
                
                if (data && data.pellets) {
                    this.pellets = data.pellets;
                    this.filterByUnit();
                    this.sortPellets();
                    saveWithExpiry(this.CACHE_KEY, data, this.CACHE_DURATION);
                    console.log('✅ Data fetched and cached successfully');
                    return;
                }
            } catch (error) {
                console.error('❌ Failed to fetch from GAS API:', error);
            }
        }

        // Fallback to hdpe_pellet_data
        if (window.hdpe_pellet_data) {
            console.log('🔄 Using fallback data from hdpe_pellet.js');
            this.pellets = window.hdpe_pellet_data.pellets || [];
            this.filterByUnit();
            this.sortPellets();
        }
        */
    }
    
    /**
     * Filter pellets by current unit
     */
    filterByUnit() {
        console.log(`🔍 Filtering pellets for unit: ${this.currentUnit}`);
        console.log(`📊 Total pellets before filter: ${this.pellets.length}`);
        
        if (!this.pellets || this.pellets.length === 0) {
            console.error('❌ No pellets data available!');
            this.filteredPellets = [];
            return;
        }
        
        // Get unit config to check grade status
        const unitConfig = getUnitConfig(this.currentUnit);
        const activeGrades = new Set(
            unitConfig.gradeData
                .filter(g => g.status !== false) // Only include grades with status !== false
                .map(g => g.grade)
        );
        
        console.log(`✅ Active grades for ${this.currentUnit}:`, Array.from(activeGrades));
        
        this.filteredPellets = this.pellets.filter(pellet => {
            const matchUnit = pellet.Plant_Owner === this.currentUnit || pellet.unit === this.currentUnit;
            
            // Extract base grade (remove SUB suffix if exists)
            const gradeBase = pellet.Grade?.replace(/\s+SUB\/\d+$| SUB$/i, '').trim();
            // Also remove netweight from grade (e.g., "P900BK/750" -> "P900BK")
            const gradeOnly = gradeBase.split('/')[0];
            const isActive = activeGrades.has(gradeOnly);
            
            if (matchUnit && !isActive) {
                console.log(`⚠️ Grade ${gradeOnly} is not active, filtered out`);
            }
            
            return matchUnit && isActive;
        });
        
        console.log(`✅ Filtered ${this.filteredPellets.length} active items for unit: ${this.currentUnit}`);
    }

    /**
     * Sort pellets (frequently used grades first)
     */
    sortPellets() {
        const frequency = ["P901BK", "P921BK"];
        
        this.pellets.sort((a, b) => {
            const startsWithA = frequency.some(freq => a.Grade.startsWith(freq));
            const startsWithB = frequency.some(freq => b.Grade.startsWith(freq));

            if (startsWithA && !startsWithB) return -1;
            if (!startsWithA && startsWithB) return 1;
            return a.Grade.localeCompare(b.Grade);
        });

        this.filteredPellets = [...this.pellets];
    }

    /**
     * Set current unit and refresh table
     * @param {string} unit - Unit name (HDPE, PP, PPC)
     */
    setUnit(unit) {
        console.log(`📊 TableComponent.setUnit() called with: ${unit}`);
        this.currentUnit = unit;
        this.currentPage = 1; // Reset to first page
        
        // Clear search input when switching units
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        this.filterByUnit();
        this.renderTable();
        console.log(`✅ Table updated for unit: ${unit}, showing ${this.filteredPellets.length} items`);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        const searchInput = document.getElementById('searchInput');
        const refreshBtn = document.getElementById('refreshDataBtn');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');

        // Search
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                // Remove Thai characters and convert to uppercase
                let value = e.target.value;
                value = value.replace(/[ก-๙]/g, ''); // Remove Thai characters
                value = value.toUpperCase(); // Convert to uppercase
                
                // Update input value if changed
                if (e.target.value !== value) {
                    e.target.value = value;
                }
                
                this.handleSearch(value);
            });
        }

        // Refresh (DISABLED - button is commented out)
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.handleRefresh();
            });
        }

        // Pagination
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderTable();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const maxPages = Math.ceil(this.filteredPellets.length / this.itemsPerPage);
                if (this.currentPage < maxPages) {
                    this.currentPage++;
                    this.renderTable();
                }
            });
        }
    }

    /**
     * Handle search input
     * @param {string} searchTerm - Search term
     */
    handleSearch(searchTerm) {
        console.log(`🔍 Searching for: "${searchTerm}" in unit: ${this.currentUnit}`);
        
        // First filter by unit, then filter by search term
        this.filterByUnit(); // Re-apply unit filter first
        
        if (searchTerm && searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            this.filteredPellets = this.filteredPellets.filter(pellet =>
                pellet.Grade.toLowerCase().includes(term)
            );
            console.log(`🔍 Search results: ${this.filteredPellets.length} items found`);
        }
        
        this.currentPage = 1;
        this.renderTable();
    }

    /**
     * Handle data refresh
     * DISABLED: Using UnitConfig (no refresh needed)
     */ /* DISABLED
    async handleRefresh() {
        console.log('⚠️ Refresh disabled - using UnitConfig');
        return;
        
       
        const refreshBtn = document.getElementById('refreshDataBtn');
        if (refreshBtn) {
            refreshBtn.disabled = true;
            refreshBtn.textContent = '🔄 กำลังอัพเดท...';
        }

        // Clear cache
        localStorage.removeItem(this.CACHE_KEY);

        // Fetch fresh data
        await this.fetchData();
        this.renderTable();
        this.updateDataSourceInfo();

        if (refreshBtn) {
            refreshBtn.disabled = false;
            refreshBtn.textContent = 'อัพเดทข้อมูล';
        }

        if (window.Swal) {
            window.Swal.fire({
                icon: 'success',
                title: 'อัพเดทเรียบร้อย',
                text: `อัพเดทข้อมูล ${this.pellets.length} รายการ`,
                timer: 2000,
                showConfirmButton: false
            });
        }
    }

    /**
     * Render table rows
     */
    renderTable() {
        const tbody = document.getElementById('tableBody');
        if (!tbody) {
            console.error('❌ tableBody element not found!');
            return;
        }

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredPellets.slice(startIndex, endIndex);

        console.log(`🎨 Rendering table: page ${this.currentPage}, items ${startIndex}-${endIndex}, total filtered: ${this.filteredPellets.length}`);
        
        tbody.innerHTML = pageData.map(pellet => this.createRow(pellet)).join('');

        // Setup row click handlers
        this.setupRowHandlers();

        // Update pagination
        this.updatePagination();
    }

    /**
     * Create table row HTML
     * @param {object} pellet - Pellet data
     * @returns {string} Row HTML
     */
    createRow(pellet) {
        // Check if this is a SUB grade
        const isSub = pellet.Grade && (pellet.Grade.includes(' SUB') || pellet.Grade.includes('/SUB') || pellet.TIS === 'N');
        
        // Create badge/tag instead of checkbox for better visibility
        let badge;
        if (isSub) {
            // SUB grade - Red badge, red text (matching Reference-Code)
            badge = `<span class="px-3 py-1 rounded-full text-xs font-bold" 
                          style="background-color: #ef4444; color: white;">
                        SUB
                    </span>`;
        } else {
            // Premium grade - Green badge (matching Reference-Code)
            badge = `<span class="px-3 py-1 rounded-full text-xs font-bold" 
                          style="background-color: #22c55e; color: white;">
                        TIS ✓
                    </span>`;
        }
        
        return `
            <tr class="data-table-row theme-border border-b cursor-pointer transition-colors" 
                data-grade="${pellet.Grade}"
                data-netweight="${pellet.NetWeight}"
                style="border-bottom-color: var(--border-color);">
                <th scope="row" class="px-6 py-4 font-semibold text-base whitespace-nowrap ${isSub ? 'sub-grade' : ''}" 
                    style="${!isSub ? 'color: var(--text-primary);' : ''}">
                    ${pellet.Grade}
                </th>
                <td class="px-6 py-4 text-center">
                    ${badge}
                </td>
            </tr>
        `;
    }

    /**
     * Setup row click handlers
     */
    setupRowHandlers() {
        const rows = document.querySelectorAll('.data-table-row');
        rows.forEach(row => {
            row.addEventListener('click', () => {
                // Remove selection from other rows
                rows.forEach(r => {
                    r.classList.remove('selected-row');
                    r.style.backgroundColor = '';
                });
                
                // Add selection to clicked row
                row.classList.add('selected-row');
                row.style.backgroundColor = 'var(--selected-row)';

                // Get pellet data from full Grade string (e.g., "AM3245PC/750 SUB")
                const fullGrade = row.dataset.grade;
                console.log('🔍 Row clicked - fullGrade:', fullGrade);
                
                // Find pellet by matching full Grade string
                const pellet = this.pellets.find(p => p.Grade === fullGrade);
                console.log('🔍 Found pellet:', pellet);
                
                if (pellet && this.onRowClickCallback) {
                    // Extract base grade and netweight from full Grade string
                    // Format: "GRADE/NETWEIGHT" or "GRADE SUB/NETWEIGHT"
                    const gradeMatch = fullGrade.match(/^(.+?)(?:\/| SUB\/)(\d+)$/);
                    const baseGrade = gradeMatch ? gradeMatch[1] : pellet.baseGrade || pellet.Grade;
                    const extractedNetweight = gradeMatch ? gradeMatch[2] : String(pellet.NetWeight);
                    
                    console.log('🎯 Extracted - baseGrade:', baseGrade, 'netweight:', extractedNetweight);
                    
                    this.handleRowClick({
                        ...pellet,
                        Grade: fullGrade, // Keep full grade with SUB
                        netweight: extractedNetweight // Clean netweight number only
                    });
                }
            });
        });
    }

    /**
     * Handle row click
     * @param {object} pellet - Selected pellet data
     */
    handleRowClick(pellet) {
        // Calculate lot number
        const currentYear = new Date().getFullYear();
        const twoDigitYear = currentYear.toString().slice(-2);
        const netweight = pellet.Grade.split('/').pop();
        const lotStartWithNine = [1650, 1800, 16500, 18000];
        
        let lot;
        const netweightNum = parseInt(netweight, 10);
        
        if (!isNaN(netweightNum) && lotStartWithNine.includes(netweightNum)) {
            lot = "9" + twoDigitYear;
        } else if (!isNaN(netweightNum)) {
            lot = netweight.charAt(0) + twoDigitYear;
        } else {
            lot = netweight.charAt(0) + twoDigitYear;
        }

        // Prepare row data
        const rowData = {
            grade: pellet.Grade,
            netweight: netweight,
            lot: lot,
            tis: pellet.TIS || 'N', // Use uppercase TIS to match data structure
            // Prefer explicit pellet.unit (set when data was generated) so UI selection and
            // table data remain consistent; fallback to detectUnit only if missing.
            unit: pellet.unit || this.detectUnit(pellet.Grade), // Auto-detect unit from grade
            title1: pellet.title1 || '',
            title2: pellet.title2 || '',
            sirim_title1: pellet.sirim_title1 || '',
            sirim_title2: pellet.sirim_title2 || '',
            sirim_title3: pellet.sirim_title3 || ''
        };

        // Store in window for print preview
        window.selectedPelletData = rowData;

        // Call callback
        if (this.onRowClickCallback) {
            this.onRowClickCallback(rowData);
        }
    }

    /**
     * Detect unit (HDPE, PP, PPC) from grade name
     * @param {string} grade - Grade name
     * @returns {string} Unit name
     */
    detectUnit(grade) {
        const gradeUpper = grade.toUpperCase();
        
        // PP patterns
        if (gradeUpper.includes('PP') || gradeUpper.startsWith('1102') || gradeUpper.includes('HOMO')) {
            return 'PP';
        }
        
        // PPC patterns  
        if (gradeUpper.includes('PPC') || gradeUpper.includes('COPO') || gradeUpper.startsWith('3220')) {
            return 'PPC';
        }
        
        // Default to HDPE (P901, P921, etc.)
        return 'HDPE';
    }

    /**
     * Update pagination buttons
     */
    updatePagination() {
        const maxPages = Math.ceil(this.filteredPellets.length / this.itemsPerPage);
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const pageInfo = document.getElementById('pageInfo');

        if (pageInfo) {
            pageInfo.textContent = `หน้า ${this.currentPage} จาก ${maxPages}`;
        }

        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
            if (this.currentPage === 1) {
                prevBtn.className = 'cursor-not-allowed font-bold rounded-lg px-6 py-3';
                prevBtn.style.cssText = 'background-color: var(--bg-secondary); color: var(--text-secondary);';
            } else {
                prevBtn.className = 'theme-btn-primary font-bold rounded-lg px-6 py-3 transition-all transform hover:shadow-lg';
                prevBtn.style.cssText = '';
            }
        }

        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= maxPages;
            if (this.currentPage >= maxPages) {
                nextBtn.className = 'cursor-not-allowed font-bold rounded-lg px-6 py-3';
                nextBtn.style.cssText = 'background-color: var(--bg-secondary); color: var(--text-secondary);';
            } else {
                nextBtn.className = 'theme-btn-primary font-bold rounded-lg px-6 py-3 transition-all transform hover:shadow-lg';
                nextBtn.style.cssText = '';
            }
        }
    }

    /**
     * Update data source information
     */
    updateDataSourceInfo() {
        const dataSource = document.getElementById('dataSource');
        const preloader = document.getElementById('preloader');
        const dataControls = document.getElementById('dataControls');

        if (preloader) {
            preloader.classList.add('hidden');
        }

        if (dataControls) {
            dataControls.classList.remove('hidden');
        }

        if (dataSource) {
            const cached = getWithExpiry(this.CACHE_KEY);
            const source = cached ? 'Local Storage' : 'Fallback Data';
            dataSource.textContent = `📂 ${source} (${this.pellets.length} รายการ)`;
        }
    }
}
