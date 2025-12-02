/**
 * Storage Utility Module
 * Handles localStorage and sessionStorage operations
 */

/**
 * Save data to localStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {boolean} Success status
 */
export function saveToLocal(key, value) {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error('Error saving to localStorage:', error);
        return false;
    }
}

/**
 * Get data from localStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key not found
 * @returns {any} Retrieved value or default
 */
export function getFromLocal(key, defaultValue = null) {
    try {
        const item = localStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
    } catch (error) {
        console.error('Error reading from localStorage:', error);
        return defaultValue;
    }
}

/**
 * Remove item from localStorage
 * @param {string} key - Storage key
 */
export function removeFromLocal(key) {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
}

/**
 * Clear all localStorage
 */
export function clearLocal() {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
}

/**
 * Save data to sessionStorage
 * @param {string} key - Storage key
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {boolean} Success status
 */
export function saveToSession(key, value) {
    try {
        const serialized = JSON.stringify(value);
        sessionStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error('Error saving to sessionStorage:', error);
        return false;
    }
}

/**
 * Get data from sessionStorage
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key not found
 * @returns {any} Retrieved value or default
 */
export function getFromSession(key, defaultValue = null) {
    try {
        const item = sessionStorage.getItem(key);
        if (item === null) return defaultValue;
        return JSON.parse(item);
    } catch (error) {
        console.error('Error reading from sessionStorage:', error);
        return defaultValue;
    }
}

/**
 * Remove item from sessionStorage
 * @param {string} key - Storage key
 */
export function removeFromSession(key) {
    try {
        sessionStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing from sessionStorage:', error);
    }
}

/**
 * Clear all sessionStorage
 */
export function clearSession() {
    try {
        sessionStorage.clear();
    } catch (error) {
        console.error('Error clearing sessionStorage:', error);
    }
}

/**
 * Save data with expiration time
 * @param {string} key - Storage key
 * @param {any} value - Value to store
 * @param {number} expiryMs - Expiration time in milliseconds
 * @returns {boolean} Success status
 */
export function saveWithExpiry(key, value, expiryMs) {
    const now = new Date().getTime();
    const item = {
        value: value,
        expiry: now + expiryMs
    };
    return saveToLocal(key, item);
}

/**
 * Get data with expiration check
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if expired or not found
 * @returns {any} Retrieved value or default
 */
export function getWithExpiry(key, defaultValue = null) {
    const item = getFromLocal(key);
    
    if (!item) {
        return defaultValue;
    }
    
    const now = new Date().getTime();
    
    // Check if expired
    if (now > item.expiry) {
        removeFromLocal(key);
        return defaultValue;
    }
    
    return item.value;
}

/**
 * Check if key exists in localStorage
 * @param {string} key - Storage key
 * @returns {boolean}
 */
export function hasInLocal(key) {
    return localStorage.getItem(key) !== null;
}

/**
 * Check if key exists in sessionStorage
 * @param {string} key - Storage key
 * @returns {boolean}
 */
export function hasInSession(key) {
    return sessionStorage.getItem(key) !== null;
}

/**
 * Get all keys from localStorage
 * @returns {string[]} Array of keys
 */
export function getAllLocalKeys() {
    return Object.keys(localStorage);
}

/**
 * Get all keys from sessionStorage
 * @returns {string[]} Array of keys
 */
export function getAllSessionKeys() {
    return Object.keys(sessionStorage);
}
