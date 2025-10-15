/**
 * ===================================================================
 * ADVANCED TOOL WEBSITE - MAIN JAVASCRIPT
 * Modern, Accessible, and Performance-Optimized
 * ===================================================================
 */

'use strict';

/**
 * ===================================================================
 * THEME MANAGEMENT
 * Handles dark/light mode toggle with localStorage persistence
 * ===================================================================
 */

class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.themeToggle = null;
    this.init();
  }

  init() {
    // Apply saved theme immediately to prevent flash
    this.applyTheme(this.theme);
    
    // Initialize theme toggle when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initThemeToggle());
    } else {
      this.initThemeToggle();
    }
  }

  initThemeToggle() {
    this.themeToggle = document.querySelector('.theme-toggle');
    if (this.themeToggle) {
      this.updateThemeToggleIcon();
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.theme = theme;
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    const newTheme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    this.updateThemeToggleIcon();
    
    // Add smooth transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  updateThemeToggleIcon() {
    if (this.themeToggle) {
      const icon = this.theme === 'light' ? '🌙' : '☀️';
      const title = this.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
      this.themeToggle.innerHTML = icon;
      this.themeToggle.setAttribute('title', title);
      this.themeToggle.setAttribute('aria-label', title);
    }
  }
}

/**
 * ===================================================================
 * NAVIGATION MANAGER
 * Handles mobile menu, active links, and smooth scrolling
 * ===================================================================
 */

class NavigationManager {
  constructor() {
    this.mobileMenuToggle = null;
    this.navMenu = null;
    this.navLinks = [];
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initNavigation());
    } else {
      this.initNavigation();
    }
  }

  initNavigation() {
    this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    this.navMenu = document.querySelector('.nav-menu');
    this.navLinks = document.querySelectorAll('.nav-link');

    this.setupMobileMenu();
    this.setupActiveLinks();
    this.setupSmoothScrolling();
  }

  setupMobileMenu() {
    if (this.mobileMenuToggle && this.navMenu) {
      this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
      
      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.navbar')) {
          this.closeMobileMenu();
        }
      });

      // Close mobile menu when clicking on nav links
      this.navLinks.forEach(link => {
        link.addEventListener('click', () => this.closeMobileMenu());
      });
    }
  }

  toggleMobileMenu() {
    this.navMenu.classList.toggle('active');
    const isOpen = this.navMenu.classList.contains('active');
    
    // Update ARIA attributes for accessibility
    this.mobileMenuToggle.setAttribute('aria-expanded', isOpen);
    this.mobileMenuToggle.innerHTML = isOpen ? '✕' : '☰';
    
    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  closeMobileMenu() {
    if (this.navMenu.classList.contains('active')) {
      this.navMenu.classList.remove('active');
      this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
      this.mobileMenuToggle.innerHTML = '☰';
      document.body.style.overflow = '';
    }
  }

  setupActiveLinks() {
    const currentPath = window.location.pathname;
    
    this.navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      
      if (linkPath === currentPath || 
          (currentPath === '/' && linkPath.endsWith('index.html')) ||
          (currentPath.endsWith('index.html') && linkPath === '/')) {
        link.classList.add('active');
      }
    });
  }

  setupSmoothScrolling() {
    // Handle anchor links for smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        
        if (target) {
          const headerHeight = document.querySelector('.navbar').offsetHeight;
          const targetPosition = target.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }
}

/**
 * ===================================================================
 * ANIMATION OBSERVER
 * Handles scroll-based animations and intersection observer
 * ===================================================================
 */

class AnimationObserver {
  constructor() {
    this.observer = null;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupObserver());
    } else {
      this.setupObserver();
    }
  }

  setupObserver() {
    // Check if browser supports Intersection Observer
    if (!('IntersectionObserver' in window)) {
      // Fallback: just add animation classes immediately
      document.querySelectorAll('[data-animate]').forEach(el => {
        el.classList.add('fade-in');
      });
      return;
    }

    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, options);

    // Observe all elements with animation data attributes
    document.querySelectorAll('[data-animate]').forEach(el => {
      this.observer.observe(el);
    });
  }

  animateElement(element) {
    const animationType = element.getAttribute('data-animate');
    const delay = element.getAttribute('data-delay') || 0;

    setTimeout(() => {
      switch (animationType) {
        case 'fade-in':
          element.classList.add('fade-in');
          break;
        case 'slide-up':
          element.classList.add('slide-up');
          break;
        default:
          element.classList.add('fade-in');
      }
    }, parseInt(delay));
  }
}

/**
 * ===================================================================
 * FORM HANDLER
 * Handles form submissions and validation
 * ===================================================================
 */

class FormHandler {
  constructor() {
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupForms());
    } else {
      this.setupForms();
    }
  }

  setupForms() {
    const forms = document.querySelectorAll('form[data-form]');
    forms.forEach(form => {
      form.addEventListener('submit', (e) => this.handleSubmit(e, form));
    });

    // Setup real-time validation
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  async handleSubmit(event, form) {
    event.preventDefault();
    
    const formType = form.getAttribute('data-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;

    // Validate form
    if (!this.validateForm(form)) {
      return;
    }

    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    try {
      // Simulate form submission (replace with actual API call)
      await this.simulateFormSubmission(new FormData(form), formType);
      
      // Show success message
      this.showFormMessage(form, 'Thank you! Your message has been sent successfully.', 'success');
      form.reset();
      
    } catch (error) {
      // Show error message
      this.showFormMessage(form, 'Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      // Reset button state
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Clear previous errors
    this.clearFieldError(field);

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      errorMessage = 'This field is required.';
      isValid = false;
    }

    // Email validation
    else if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errorMessage = 'Please enter a valid email address.';
        isValid = false;
      }
    }

    // Phone validation
    else if (field.name === 'phone' && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        errorMessage = 'Please enter a valid phone number.';
        isValid = false;
      }
    }

    if (!isValid) {
      this.showFieldError(field, errorMessage);
    }

    return isValid;
  }

  showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
      errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.style.cssText = `
        color: var(--error-color);
        font-size: var(--font-size-sm);
        margin-top: 0.25rem;
      `;
      field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  showFormMessage(form, message, type) {
    let messageElement = form.querySelector('.form-message');
    
    if (!messageElement) {
      messageElement = document.createElement('div');
      messageElement.className = 'form-message';
      messageElement.style.cssText = `
        padding: 1rem;
        border-radius: var(--border-radius);
        margin-top: 1rem;
        font-weight: 500;
      `;
      form.appendChild(messageElement);
    }

    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    
    if (type === 'success') {
      messageElement.style.cssText += `
        background: rgba(16, 185, 129, 0.1);
        color: var(--success-color);
        border: 1px solid rgba(16, 185, 129, 0.2);
      `;
    } else {
      messageElement.style.cssText += `
        background: rgba(239, 68, 68, 0.1);
        color: var(--error-color);
        border: 1px solid rgba(239, 68, 68, 0.2);
      `;
    }

    // Auto-hide success messages
    if (type === 'success') {
      setTimeout(() => {
        messageElement.style.opacity = '0';
        setTimeout(() => messageElement.remove(), 300);
      }, 5000);
    }
  }

  async simulateFormSubmission(formData, formType) {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Simulate occasional errors for testing
    if (Math.random() > 0.9) {
      throw new Error('Simulated network error');
    }
    
    // In a real application, you would send the data to your backend
    console.log('Form submitted:', formType, Object.fromEntries(formData));
  }
}

/**
 * ===================================================================
 * UTILITY FUNCTIONS
 * Helper functions for common tasks
 * ===================================================================
 */

class Utils {
  /**
   * Debounce function to limit the rate of function execution
   */
  static debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func(...args);
    };
  }

  /**
   * Throttle function to limit function execution frequency
   */
  static throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /**
   * Check if element is in viewport
   */
  static isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  /**
   * Smooth scroll to element
   */
  static scrollToElement(element, offset = 0) {
    const targetPosition = element.offsetTop - offset;
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  /**
   * Format date for display
   */
  static formatDate(date, options = {}) {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
  }

  /**
   * Copy text to clipboard
   */
  static async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        return true;
      } catch (fallbackErr) {
        return false;
      } finally {
        document.body.removeChild(textArea);
      }
    }
  }
}

/**
 * ===================================================================
 * PERFORMANCE MONITOR
 * Monitor and optimize performance
 * ===================================================================
 */

class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    if ('PerformanceObserver' in window) {
      this.observePerformance();
    }
    
    // Monitor load times
    window.addEventListener('load', () => {
      this.logPageLoadTime();
    });
  }

  observePerformance() {
    // Monitor Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

    // Monitor First Input Delay
    const fidObserver = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
  }

  logPageLoadTime() {
    if ('performance' in window) {
      const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
      console.log('Page load time:', loadTime + 'ms');
    }
  }
}

/**
 * ===================================================================
 * ERROR HANDLER
 * Global error handling and logging
 * ===================================================================
 */

class ErrorHandler {
  constructor() {
    this.init();
  }

  init() {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      this.logError('JavaScript Error', event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Handle Promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('Unhandled Promise Rejection', event.reason);
    });
  }

  logError(type, error, details = {}) {
    console.error(`[${type}]`, error, details);
    
    // In production, you might want to send errors to a logging service
    // this.sendToLoggingService(type, error, details);
  }

  sendToLoggingService(type, error, details) {
    // Implementation for sending errors to external logging service
    // Example: Sentry, LogRocket, etc.
  }
}

/**
 * ===================================================================
 * APPLICATION INITIALIZER
 * Initialize all components when DOM is ready
 * ===================================================================
 */

class App {
  constructor() {
    this.components = {};
    this.init();
  }

  init() {
    // Initialize core components
    this.components.themeManager = new ThemeManager();
    this.components.navigationManager = new NavigationManager();
    this.components.animationObserver = new AnimationObserver();
    this.components.formHandler = new FormHandler();
    this.components.performanceMonitor = new PerformanceMonitor();
    this.components.errorHandler = new ErrorHandler();

    // Setup global event listeners
    this.setupGlobalEvents();
    
    console.log('🚀 Advanced Tool Website initialized successfully!');
  }

  setupGlobalEvents() {
    // Handle window resize
    const handleResize = Utils.throttle(() => {
      // Trigger any resize-dependent functionality
      window.dispatchEvent(new CustomEvent('optimizedResize'));
    }, 250);

    window.addEventListener('resize', handleResize);

    // Handle scroll events
    const handleScroll = Utils.throttle(() => {
      // Add scroll-dependent functionality here
      const scrollTop = window.pageYOffset;
      document.body.style.setProperty('--scroll-y', scrollTop + 'px');
    }, 16);

    window.addEventListener('scroll', handleScroll);
  }
}

/**
 * ===================================================================
 * INITIALIZE APPLICATION
 * Start the application when DOM is ready
 * ===================================================================
 */

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new App();
  });
} else {
  new App();
}

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App, ThemeManager, NavigationManager, Utils };
}