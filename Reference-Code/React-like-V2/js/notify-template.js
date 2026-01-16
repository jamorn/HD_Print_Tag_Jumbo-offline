/**
 * 🔔 Notification Template System
 * สำหรับแสดง notifications แบบ unified ทั่วทั้งระบบ
 * รองรับ Dark Theme และ Customizable Positions & Effects
 * 1. fade
ลักษณะ: การแจ้งเตือนจะค่อยๆ ปรากฏขึ้นและจางหายไป
การใช้งาน: เหมาะสำหรับการแจ้งเตือนที่ต้องการความเรียบง่ายและไม่รบกวนผู้ใช้งานมากเกินไป
2. slide
ลักษณะ: การแจ้งเตือนจะเลื่อนเข้ามาจากด้านข้าง (เช่น จากขวาไปซ้าย) และเลื่อนออกไปในทิศทางตรงกันข้าม
การใช้งาน: เหมาะสำหรับการแจ้งเตือนที่ต้องการดึงดูดความสนใจเล็กน้อย
3. bounce
ลักษณะ: การแจ้งเตือนจะปรากฏขึ้นพร้อมกับการเด้ง (bounce) เล็กน้อย
การใช้งาน: เหมาะสำหรับการแจ้งเตือนที่ต้องการความโดดเด่น เช่น การแจ้งเตือนสำคัญ
4. shake
ลักษณะ: การแจ้งเตือนจะสั่นไปมา (shake) เพื่อดึงดูดความสนใจ
การใช้งาน: เหมาะสำหรับการแจ้งเตือนข้อผิดพลาด (error) หรือการแจ้งเตือนที่ต้องการให้ผู้ใช้สังเกตเห็นทันที
5. zoom
ลักษณะ: การแจ้งเตือนจะขยาย (zoom) จากจุดศูนย์กลางจนเต็มขนาด
การใช้งาน: เหมาะสำหรับการแจ้งเตือนที่ต้องการความโดดเด่นและดูทันสมัย
 */

class NotificationTemplate {
    constructor() {
        this.defaultConfig = {
            duration: 5000, // 5 seconds
            position: 'bottom-right', // เปลี่ยนเป็น bottom-right
            effect: 'fade', // fade, slide, bounce, shake, zoom
            showProgress: false,
            allowClose: true,
            stackable: true,
            maxStack: 3
        };
        
        this.notifications = [];
        this.init();
        
        console.log('🔔 [NotifyTemplate] Initialized');
    }

    init() {
        // Add required CSS styles
        this.addStyles();
        
        // Create notification container
        this.createContainer();
    }

    /**
     * 🎨 Add CSS styles for notifications
     */
    addStyles() {
        if (document.getElementById('notify-template-styles')) return;

        const style = document.createElement('style');
        style.id = 'notify-template-styles';
        style.textContent = `
            /* Notification Container */
            .notify-container {
                position: fixed;
                z-index: 9999;
                pointer-events: none;
            }
            
            /* Position Classes */
            .notify-center {
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
            
            .notify-top-right {
                top: 20px;
                right: 20px;
            }
            
            .notify-top-left {
                top: 20px;
                left: 20px;
            }
            
            .notify-bottom-right {
                bottom: 20px;
                right: 20px;
            }
            
            .notify-bottom-left {
                bottom: 20px;
                left: 20px;
            }
            
            .notify-top-center {
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
            }
            
            .notify-bottom-center {
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
            }

            /* Notification Item */
            .notify-item {
                pointer-events: auto;
                margin: 8px 0;
                border-radius: 8px;
                padding: 16px 20px;
                min-width: 300px;
                max-width: 500px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                position: relative;
                overflow: hidden;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }

            /* Dark Theme Colors */
            .notify-success {
                background: linear-gradient(135deg, #059669 0%, #047857 100%);
                color: #ffffff;
                border-color: rgba(6, 182, 212, 0.3);
            }

            .notify-error {
                background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
                color: #ffffff;
                border-color: rgba(239, 68, 68, 0.3);
            }

            .notify-warning {
                background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
                color: #ffffff;
                border-color: rgba(245, 158, 11, 0.3);
            }

            .notify-info {
                background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);
                color: #ffffff;
                border-color: rgba(14, 165, 233, 0.3);
            }

            /* Icons */
            .notify-icon {
                display: inline-block;
                width: 20px;
                height: 20px;
                margin-right: 12px;
                vertical-align: middle;
            }

            /* Close Button */
            .notify-close {
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 4px;
                width: 24px;
                height: 24px;
                cursor: pointer;
                color: white;
                font-size: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: background 0.2s;
            }

            .notify-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }

            /* Progress Bar */
            .notify-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: rgba(255, 255, 255, 0.3);
                transition: width linear;
            }

            /* Animation Effects */
            
            /* Fade Effect */
            .notify-fade-enter {
                opacity: 0;
                transform: scale(0.8);
            }
            
            .notify-fade-enter-active {
                opacity: 1;
                transform: scale(1);
                transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .notify-fade-exit {
                opacity: 1;
                transform: scale(1);
            }
            
            .notify-fade-exit-active {
                opacity: 0;
                transform: scale(0.8);
                transition: all 0.3s ease-in;
            }

            /* Slide Effect */
            .notify-slide-enter {
                opacity: 0;
                transform: translateX(100%);
            }
            
            .notify-slide-enter-active {
                opacity: 1;
                transform: translateX(0);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }
            
            .notify-slide-exit {
                opacity: 1;
                transform: translateX(0);
            }
            
            .notify-slide-exit-active {
                opacity: 0;
                transform: translateX(100%);
                transition: all 0.3s ease-in;
            }

            /* Bounce Effect */
            .notify-bounce-enter {
                opacity: 0;
                transform: scale(0.3) rotate(6deg);
            }
            
            .notify-bounce-enter-active {
                opacity: 1;
                transform: scale(1) rotate(0deg);
                transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }

            /* Shake Effect (for errors) */
            .notify-shake-enter {
                animation: shake 0.5s ease-in-out;
            }

            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }

            /* Zoom Effect */
            .notify-zoom-enter {
                opacity: 0;
                transform: scale(0);
            }
            
            .notify-zoom-enter-active {
                opacity: 1;
                transform: scale(1);
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            }

            /* Responsive */
            @media (max-width: 640px) {
                .notify-item {
                    min-width: 280px;
                    margin: 4px 8px;
                }
                
                .notify-top-right,
                .notify-top-left,
                .notify-bottom-right,
                .notify-bottom-left {
                    left: 10px;
                    right: 10px;
                    width: auto;
                }
            }
        `;
        
        document.head.appendChild(style);
    }

    /**
     * 📦 Create notification container
     */
    createContainer() {
        if (document.getElementById('notify-container')) return;

        const container = document.createElement('div');
        container.id = 'notify-container';
        container.className = 'notify-container notify-bottom-right'; // เปลี่ยนเป็น bottom-right
        document.body.appendChild(container);
    }

    /**
     * 🎯 Get position class
     */
    getPositionClass(position) {
        const positions = {
            'center': 'notify-center',
            'top-right': 'notify-top-right',
            'top-left': 'notify-top-left',
            'bottom-right': 'notify-bottom-right',
            'bottom-left': 'notify-bottom-left',
            'top-center': 'notify-top-center',
            'bottom-center': 'notify-bottom-center'
        };
        return positions[position] || positions['bottom-right'];
    }

    /**
     * 🎨 Get icon HTML
     */
    getIcon(type) {
        const icons = {
            success: `<svg class="notify-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
            </svg>`,
            error: `<svg class="notify-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>`,
            warning: `<svg class="notify-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>`,
            info: `<svg class="notify-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/>
            </svg>`
        };
        return icons[type] || icons.info;
    }

    /**
     * 🚀 Show notification
     * @param {string|Array} message - ข้อความที่จะแสดง (string หรือ array ของ messages)
     * @param {string} type - ประเภท: success, error, warning, info
     * @param {Object} options - ตัวเลือกเพิ่มเติม
     */
    show(message, type = 'info', options = {}) {
        // Format message if it's an array
        const formattedMessage = Array.isArray(message) 
            ? `<ul class="list-disc pl-5">${message.map(msg => `<li>${msg}</li>`).join('')}</ul>`
            : message;
        const config = { ...this.defaultConfig, ...options };
        const container = document.getElementById('notify-container');
        
        if (!container) {
            this.createContainer();
            return this.show(message, type, options);
        }

        // Update container position if changed
        container.className = `notify-container ${this.getPositionClass(config.position)}`;

        // Check stack limit
        if (config.stackable && this.notifications.length >= config.maxStack) {
            this.removeOldest();
        }

        // Create notification element
        const notification = this.createElement(formattedMessage, type, config);
        
        // Add to container
        if (config.position.includes('bottom')) {
            container.insertBefore(notification, container.firstChild);
        } else {
            container.appendChild(notification);
        }

        // Add to tracking array
        this.notifications.push({
            element: notification,
            id: notification.id,
            timer: null
        });

        // Apply enter animation
        this.applyEnterAnimation(notification, config.effect);

        // Set up progress bar
        if (config.showProgress) {
            this.startProgress(notification, config.duration);
        }

        // Set up auto removal
        if (config.duration > 0) {
            const timer = setTimeout(() => {
                this.remove(notification.id);
            }, config.duration);

            // Update timer reference
            const notifyObj = this.notifications.find(n => n.id === notification.id);
            if (notifyObj) notifyObj.timer = timer;
        }

        // Set up manual close
        if (config.allowClose) {
            const closeBtn = notification.querySelector('.notify-close');
            if (closeBtn) {
                closeBtn.addEventListener('click', () => {
                    this.remove(notification.id);
                });
            }
        }

        console.log(`🔔 [NotifyTemplate] Shown: ${type} - ${message}`);
        return notification.id;
    }

    /**
     * 🏗️ Create notification element
     */
    createElement(message, type, config) {
        const id = `notify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const notification = document.createElement('div');
        
        notification.id = id;
        notification.className = `notify-item notify-${type}`;
        
        notification.innerHTML = `
            ${this.getIcon(type)}
            <span class="notify-message">${message}</span>
            ${config.allowClose ? '<button class="notify-close">×</button>' : ''}
            ${config.showProgress ? '<div class="notify-progress"></div>' : ''}
        `;

        return notification;
    }

    /**
     * ✨ Apply enter animation
     */
    applyEnterAnimation(element, effect) {
        element.classList.add(`notify-${effect}-enter`);
        
        // Force reflow
        element.offsetHeight;
        
        // Add active class
        element.classList.add(`notify-${effect}-enter-active`);
        
        // Remove enter classes after animation
        setTimeout(() => {
            element.classList.remove(`notify-${effect}-enter`, `notify-${effect}-enter-active`);
        }, 600);
    }

    /**
     * 🏃‍♂️ Apply exit animation and remove
     */
    applyExitAnimation(element, effect, callback) {
        element.classList.add(`notify-${effect}-exit`);
        
        // Force reflow
        element.offsetHeight;
        
        // Add active class
        element.classList.add(`notify-${effect}-exit-active`);
        
        // Remove after animation
        setTimeout(() => {
            if (callback) callback();
        }, 300);
    }

    /**
     * 📊 Start progress bar animation
     */
    startProgress(element, duration) {
        const progressBar = element.querySelector('.notify-progress');
        if (progressBar) {
            progressBar.style.width = '100%';
            progressBar.style.transition = `width ${duration}ms linear`;
            
            setTimeout(() => {
                progressBar.style.width = '0%';
            }, 50);
        }
    }

    /**
     * 🗑️ Remove notification
     */
    remove(id) {
        const notifyObj = this.notifications.find(n => n.id === id);
        if (!notifyObj) return;

        // Clear timer
        if (notifyObj.timer) {
            clearTimeout(notifyObj.timer);
        }

        // Apply exit animation
        this.applyExitAnimation(notifyObj.element, 'fade', () => {
            // Remove from DOM
            if (notifyObj.element.parentNode) {
                notifyObj.element.parentNode.removeChild(notifyObj.element);
            }
            
            // Remove from tracking array
            this.notifications = this.notifications.filter(n => n.id !== id);
            
            console.log(`🗑️ [NotifyTemplate] Removed: ${id}`);
        });
    }

    /**
     * 🧹 Remove oldest notification
     */
    removeOldest() {
        if (this.notifications.length > 0) {
            this.remove(this.notifications[0].id);
        }
    }

    /**
     * 🚫 Clear all notifications
     */
    clear() {
        [...this.notifications].forEach(notify => {
            this.remove(notify.id);
        });
    }

    /**
     * 📝 Shorthand methods
     */
    success(message, options = {}) {
        return this.show(message, 'success', { effect: 'bounce', ...options });
    }

    error(message, options = {}) {
        return this.show(message, 'error', { effect: 'shake', duration: 8000, ...options });
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', { effect: 'slide', ...options });
    }

    info(message, options = {}) {
        return this.show(message, 'info', { effect: 'fade', ...options });
    }

    /**
     * 🎯 Utility methods
     */
    updatePosition(position) {
        const container = document.getElementById('notify-container');
        if (container) {
            container.className = `notify-container ${this.getPositionClass(position)}`;
        }
    }

    getActiveCount() {
        return this.notifications.length;
    }
}

// Export as ES6 module
export default NotificationTemplate;

// Create instance for direct usage
export const notifyTemplate = new NotificationTemplate();

// Shorthand export functions
export const showSuccess = (message, options) => notifyTemplate.success(message, options);
export const showError = (message, options) => notifyTemplate.error(message, options);
export const showWarning = (message, options) => notifyTemplate.warning(message, options);
export const showInfo = (message, options) => notifyTemplate.info(message, options);
export const showNotify = (message, type, options) => notifyTemplate.show(message, type, options);

console.log('🔔 [NotifyTemplate] Global notification system ready!');
console.log('📋 Available methods:');
console.log('  - showSuccess(message, options)');
console.log('  - showError(message, options)');  
console.log('  - showWarning(message, options)');
console.log('  - showInfo(message, options)');
console.log('  - showNotify(message, type, options)');
console.log('  - notifyTemplate.updatePosition(position)');
console.log('  - notifyTemplate.clear()');