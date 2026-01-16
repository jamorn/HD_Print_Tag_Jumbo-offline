/**
 * Header Component
 * Displays title, datetime, and shift information
 */

import { formatThaiDate } from '../utils/validator.js';

export class HeaderComponent {
    constructor() {
        this.dateTimeInterval = null;
        this.currentUnit = 'HDPE'; // Default unit
    }

    /**
     * Set current unit
     * @param {string} unit - Unit name (HDPE, PP, PPC)
     */
    setUnit(unit) {
        this.currentUnit = unit;
        this.updateTitle();
    }

    /**
     * Update title based on current unit
     */
    updateTitle() {
        const titleElement = document.querySelector('.header-title');
        if (titleElement) {
            titleElement.textContent = `${this.currentUnit} Print Tag Jumbo`;
        }
    }

    /**
     * Render header HTML
     * @returns {string} HTML string
     *  ออกเอาชั่วคราว <p class="theme-text-secondary text-base">Professional Production Management System</p>
     */
    render() {
        return `
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold theme-text-primary mb-3 header-title">
                    ${this.currentUnit} Print Tag Jumbo
                </h1>
             
                <p id="currentDateTime" class="text-sm mt-2 font-bold bg-white bg-opacity-90 px-4 py-2 rounded-lg inline-block shadow-sm" style="color: #1e40af;"></p>
            </div>
        `;
    }

    /**
     * Initialize component
     */
    init() {
        this.updateDateTime();
        this.dateTimeInterval = setInterval(() => this.updateDateTime(), 1000);
    }

    /**
     * Update datetime display
     */
    updateDateTime() {
        const element = document.getElementById('currentDateTime');
        if (element) {
            element.textContent = formatThaiDate();
        }
    }

    /**
     * Destroy component
     */
    destroy() {
        if (this.dateTimeInterval) {
            clearInterval(this.dateTimeInterval);
        }
    }
}
