// UI Helpers (IIFE)
(function() {
    window.updateDateTime = function() {
        const element = document.getElementById('currentDateTime');
        if (element) {
            const now = new Date();
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            };
            element.textContent = now.toLocaleDateString('th-TH', options);
        }
        // Update shift status in header
        const shiftStatus = document.getElementById('shiftStatus');
        if (shiftStatus) {
            let text = '-';
            if (typeof shift_table === 'function') {
                const shift = shift_table();
                const statusMessage = {
                    M: "ตอนนี้คือเวลาทำงานของกะเช้า",
                    E: "ตอนนี้คือเวลาทำงานของกะบ่าย",
                    N: "ตอนนี้คือเวลาทำงานของกะดึก"
                };
                text = statusMessage[shift] || '-';
            }
            shiftStatus.textContent = text;
        }
    };

    window.setupModals = function() {
        // Theme Modal
        const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
        const themeModal = document.getElementById('theme-modal');
        const closeThemeModal = document.getElementById('close-theme-modal');
        const themeOptions = document.querySelectorAll('[data-theme]');

        if (themeSwitcherBtn && themeModal) {
            themeSwitcherBtn.addEventListener('click', () => {
                themeModal.classList.remove('hidden');
                console.log('🎨 Theme modal opened');
            });

            if (closeThemeModal) {
                closeThemeModal.addEventListener('click', () => {
                    themeModal.classList.add('hidden');
                });
            }

            themeModal.addEventListener('click', (e) => {
                if (e.target === themeModal) {
                    themeModal.classList.add('hidden');
                }
            });

            themeOptions.forEach(btn => {
                btn.addEventListener('click', () => {
                    const theme = btn.dataset.theme;
                    ThemeManager.applyTheme(theme);
                    setTimeout(() => themeModal.classList.add('hidden'), 300);
                });
            });
        }

        // Help Modal
        const specsBtn = document.getElementById('specs-btn');
        const helpModal = document.getElementById('help-modal');
        const closeHelpModal = document.getElementById('close-help-modal');

        if (specsBtn && helpModal) {
            specsBtn.addEventListener('click', () => {
                helpModal.classList.remove('hidden');
                window.switchHelpTab('usage');
                window.updateSpecsValues && window.updateSpecsValues();
            });

            if (closeHelpModal) {
                closeHelpModal.addEventListener('click', () => {
                    helpModal.classList.add('hidden');
                });
            }

            helpModal.addEventListener('click', (e) => {
                if (e.target === helpModal) {
                    helpModal.classList.add('hidden');
                }
            });

            const helpTabs = document.querySelectorAll('.help-tab');
            helpTabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    window.switchHelpTab(tab.dataset.tab);
                });
            });
        }
    };

    window.switchHelpTab = function(tabName) {
        const helpTabs = document.querySelectorAll('.help-tab');
        helpTabs.forEach(t => {
            if (t.dataset.tab === tabName) {
                t.style.background = 'var(--primary-color)';
                t.style.color = 'white';
                t.classList.add('active');
            } else {
                t.style.background = 'var(--bg-secondary)';
                t.style.color = 'var(--text-primary)';
                t.classList.remove('active');
            }
        });
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.add('hidden');
        });
        const targetTab = document.getElementById(`tab-${tabName}`);
        if (targetTab) {
            targetTab.classList.remove('hidden');
        }
        if (tabName === 'specs' && window.updateSpecsValues) {
            window.updateSpecsValues();
        }
        if (tabName === 'data' && window.updateDataStats) {
            window.updateDataStats();
        }
    };
})();
