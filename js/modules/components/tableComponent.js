/**
 * Table Component
 * Handles pellet data table rendering, search, and row selection
 */

import { saveWithExpiry, getWithExpiry } from '../utils/storage.js';

export class TableComponent {
    constructor() {
        this.pellets = [];
        this.filteredPellets = [];
        this.currentPage = 1;
        this.itemsPerPage = 20;
        this.onRowClickCallback = null;
        
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
            <!-- Preloader -->
            <div id="preloader" class="mb-6 p-6 theme-card rounded-xl border theme-border shadow-2xl text-center ${this.pellets.length > 0 ? 'hidden' : ''}">
                <div class="inline-block w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-3" style="border-color: var(--primary-color); border-top-color: transparent;"></div>
                <p class="theme-text-primary font-semibold text-base">กำลังโหลดข้อมูล...</p>
            </div>

            <!-- Data Controls -->
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
        this.updateDataSourceInfo();
    }

    /**
     * Fetch pellet data from API or cache
     */
    async fetchData() {
        // Check cache first
        const cachedData = getWithExpiry(this.CACHE_KEY);
        if (cachedData) {
            console.log('📂 Using cached pellet data');
            this.pellets = cachedData.pellets || [];
            this.filteredPellets = [...this.pellets];
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
                    this.filteredPellets = [...this.pellets];
                    this.sortPellets();
                    
                    // Save to cache
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
            this.filteredPellets = [...this.pellets];
            this.sortPellets();
        }
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
                this.handleSearch(e.target.value);
            });
        }

        // Refresh
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
        const term = searchTerm.toLowerCase();
        this.filteredPellets = this.pellets.filter(pellet =>
            pellet.Grade.toLowerCase().includes(term)
        );
        this.currentPage = 1;
        this.renderTable();
    }

    /**
     * Handle data refresh
     */
    async handleRefresh() {
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
        if (!tbody) return;

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageData = this.filteredPellets.slice(startIndex, endIndex);

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
        return `
            <tr class="data-table-row theme-border border-b cursor-pointer transition-colors" 
                data-grade="${pellet.Grade}"
                style="border-bottom-color: var(--border-color);">
                <th scope="row" class="px-6 py-4 font-semibold text-base theme-text-primary whitespace-nowrap">
                    ${pellet.Grade}
                </th>
                <td class="px-6 py-4 text-center">
                    <input type="checkbox" 
                           class="tis-checkbox w-5 h-5 rounded cursor-not-allowed" 
                           style="accent-color: var(--primary-color);"
                           ${pellet.tis === 'Y' ? 'checked' : ''} 
                           disabled>
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

                // Get pellet data
                const grade = row.dataset.grade;
                const pellet = this.pellets.find(p => p.Grade === grade);
                
                if (pellet && this.onRowClickCallback) {
                    this.handleRowClick(pellet);
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
            tis: pellet.tis || 'N',
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
