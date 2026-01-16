/**
 * Base Component - Modern Tag Printing System V2
 * Foundation class for all UI components with modern patterns
 */

import { StyleBuilder } from './StyleBuilder.js';

export class BaseComponent {
  constructor(options = {}) {
    this.id = options.id || this.generateId();
    this.element = null;
    this.children = new Map();
    this.state = {};
    this.props = { ...options };
    this.styleBuilder = new StyleBuilder();
    this.mounted = false;
    this.eventListeners = new Map();
    
    // Bind methods to maintain context
    this.render = this.render.bind(this);
    this.mount = this.mount.bind(this);
    this.unmount = this.unmount.bind(this);
    this.update = this.update.bind(this);
  }

  /**
   * Generate unique component ID
   */
  generateId() {
    return `component-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Initialize component (called before first render)
   */
  init() {
    // Override in subclasses for initialization logic
  }

  /**
   * Render component to DOM element
   * Must be implemented by subclasses
   */
  render() {
    throw new Error('render() method must be implemented by subclass');
  }

  /**
   * Mount component to DOM
   */
  mount(container) {
    if (this.mounted) {
      console.warn(`Component ${this.id} is already mounted`);
      return;
    }

    if (!this.element) {
      this.init();
      this.element = this.render();
    }

    if (container) {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      
      if (container && container.appendChild) {
        container.appendChild(this.element);
        this.mounted = true;
        this.onMount();
      } else {
        throw new Error('Invalid container provided for mounting');
      }
    }

    return this;
  }

  /**
   * Unmount component from DOM
   */
  unmount() {
    if (!this.mounted) return;

    this.onBeforeUnmount();
    
    // Remove event listeners
    this.removeAllEventListeners();
    
    // Unmount children first
    this.children.forEach(child => {
      if (child.unmount) {
        child.unmount();
      }
    });
    
    // Remove from DOM
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    
    this.mounted = false;
    this.onUnmount();
    
    return this;
  }

  /**
   * Update component state and re-render if needed
   */
  setState(newState, shouldRerender = true) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...newState };
    
    if (shouldRerender && this.mounted) {
      this.update();
    }
    
    this.onStateChange(oldState, this.state);
    return this;
  }

  /**
   * Update component props
   */
  setProps(newProps, shouldRerender = true) {
    const oldProps = { ...this.props };
    this.props = { ...this.props, ...newProps };
    
    if (shouldRerender && this.mounted) {
      this.update();
    }
    
    this.onPropsChange(oldProps, this.props);
    return this;
  }

  /**
   * Update component (re-render)
   */
  update() {
    if (!this.mounted || !this.element) return;

    const oldElement = this.element;
    const newElement = this.render();
    
    if (oldElement.parentNode) {
      oldElement.parentNode.replaceChild(newElement, oldElement);
      this.element = newElement;
      this.onUpdate();
    }
    
    return this;
  }

  /**
   * Create DOM element with attributes and children
   */
  createElement(tagName, attributes = {}, children = []) {
    const element = document.createElement(tagName);
    
    // Set attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'className') {
        element.className = value;
      } else if (key === 'innerHTML') {
        element.innerHTML = value;
      } else if (key === 'textContent') {
        element.textContent = value;
      } else if (key.startsWith('data-')) {
        element.setAttribute(key, value);
      } else if (key.startsWith('on') && typeof value === 'function') {
        // Event listener
        const eventType = key.toLowerCase().substring(2);
        this.addEventListener(element, eventType, value);
      } else {
        element.setAttribute(key, value);
      }
    });
    
    // Append children
    children.forEach(child => {
      if (typeof child === 'string') {
        element.appendChild(document.createTextNode(child));
      } else if (child instanceof HTMLElement) {
        element.appendChild(child);
      } else if (child && child.element) {
        element.appendChild(child.element);
      }
    });
    
    return element;
  }

  /**
   * Add event listener with automatic cleanup
   */
  addEventListener(element, eventType, handler, options = {}) {
    const wrappedHandler = (event) => {
      try {
        handler.call(this, event);
      } catch (error) {
        console.error(`Error in event handler for ${eventType}:`, error);
      }
    };
    
    element.addEventListener(eventType, wrappedHandler, options);
    
    // Store for cleanup
    if (!this.eventListeners.has(element)) {
      this.eventListeners.set(element, []);
    }
    this.eventListeners.get(element).push({
      eventType,
      handler: wrappedHandler,
      options
    });
    
    return this;
  }

  /**
   * Remove all event listeners
   */
  removeAllEventListeners() {
    this.eventListeners.forEach((listeners, element) => {
      listeners.forEach(({ eventType, handler, options }) => {
        element.removeEventListener(eventType, handler, options);
      });
    });
    this.eventListeners.clear();
  }

  /**
   * Add child component
   */
  addChild(child, key = null) {
    const childKey = key || child.id;
    this.children.set(childKey, child);
    return this;
  }

  /**
   * Remove child component
   */
  removeChild(key) {
    const child = this.children.get(key);
    if (child) {
      if (child.unmount) {
        child.unmount();
      }
      this.children.delete(key);
    }
    return this;
  }

  /**
   * Get child component
   */
  getChild(key) {
    return this.children.get(key);
  }

  /**
   * Find elements within component
   */
  querySelector(selector) {
    return this.element ? this.element.querySelector(selector) : null;
  }

  querySelectorAll(selector) {
    return this.element ? Array.from(this.element.querySelectorAll(selector)) : [];
  }

  /**
   * Add CSS class
   */
  addClass(className) {
    if (this.element && this.element.classList) {
      this.element.classList.add(className);
    }
    return this;
  }

  /**
   * Remove CSS class
   */
  removeClass(className) {
    if (this.element && this.element.classList) {
      this.element.classList.remove(className);
    }
    return this;
  }

  /**
   * Toggle CSS class
   */
  toggleClass(className, force = null) {
    if (this.element && this.element.classList) {
      return this.element.classList.toggle(className, force);
    }
    return false;
  }

  /**
   * Check if has CSS class
   */
  hasClass(className) {
    return this.element && this.element.classList ? 
      this.element.classList.contains(className) : false;
  }

  /**
   * Set CSS styles
   */
  setStyle(styles) {
    if (!this.element) return this;
    
    Object.entries(styles).forEach(([property, value]) => {
      this.element.style[property] = value;
    });
    
    return this;
  }

  /**
   * Show component
   */
  show() {
    if (this.element) {
      this.element.style.display = '';
      this.removeClass('hidden');
    }
    return this;
  }

  /**
   * Hide component
   */
  hide() {
    if (this.element) {
      this.element.style.display = 'none';
      this.addClass('hidden');
    }
    return this;
  }

  /**
   * Emit custom event
   */
  emit(eventType, detail = {}) {
    if (this.element) {
      const customEvent = new CustomEvent(eventType, {
        detail,
        bubbles: true,
        cancelable: true
      });
      this.element.dispatchEvent(customEvent);
    }
    return this;
  }

  /**
   * Lifecycle hooks - override in subclasses
   */
  onMount() {
    // Called after component is mounted to DOM
  }

  onBeforeUnmount() {
    // Called before component is unmounted
  }

  onUnmount() {
    // Called after component is unmounted
  }

  onUpdate() {
    // Called after component is updated
  }

  onStateChange(oldState, newState) {
    // Called when state changes
  }

  onPropsChange(oldProps, newProps) {
    // Called when props change
  }

  /**
   * Validation helpers
   */
  validateProps(schema) {
    const errors = [];
    
    Object.entries(schema).forEach(([key, rules]) => {
      const value = this.props[key];
      
      if (rules.required && (value === undefined || value === null)) {
        errors.push(`Property '${key}' is required`);
      }
      
      if (value !== undefined && rules.type && typeof value !== rules.type) {
        errors.push(`Property '${key}' must be of type '${rules.type}'`);
      }
      
      if (rules.validator && typeof rules.validator === 'function') {
        const validationResult = rules.validator(value);
        if (validationResult !== true) {
          errors.push(validationResult || `Property '${key}' is invalid`);
        }
      }
    });
    
    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Debug information
   */
  debug() {
    return {
      id: this.id,
      mounted: this.mounted,
      state: { ...this.state },
      props: { ...this.props },
      childrenCount: this.children.size,
      element: this.element,
      eventListeners: this.eventListeners.size
    };
  }

  /**
   * Destroy component completely
   */
  destroy() {
    this.unmount();
    this.children.clear();
    this.eventListeners.clear();
    this.element = null;
    this.state = {};
    this.props = {};
  }
}