/**
 * Accessibility Service
 * Ensures WCAG 2.1 AA compliance and enhanced accessibility
 */

export class AccessibilityService {
    constructor() {
        this.announcer = null;
        this.skipLinks = [];
        this.focusTrap = null;
        this.init();
    }

    /**
     * Initialize accessibility features
     */
    init() {
        // Create live region for announcements
        this.createLiveRegion();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
        
        // Setup focus management
        this.setupFocusManagement();
        
        // Setup ARIA labels
        this.setupAriaLabels();
        
        // Setup reduced motion support
        this.setupReducedMotion();
        
        // Setup high contrast mode
        this.setupHighContrast();
        
        // Setup screen reader optimizations
        this.setupScreenReaderOptimizations();
    }

    /**
     * Create live region for screen reader announcements
     */
    createLiveRegion() {
        // Create polite announcer
        this.announcer = document.createElement('div');
        this.announcer.setAttribute('aria-live', 'polite');
        this.announcer.setAttribute('aria-atomic', 'true');
        this.announcer.className = 'sr-only';
        this.announcer.id = 'aria-announcer';
        document.body.appendChild(this.announcer);

        // Create assertive announcer for urgent messages
        this.urgentAnnouncer = document.createElement('div');
        this.urgentAnnouncer.setAttribute('aria-live', 'assertive');
        this.urgentAnnouncer.setAttribute('aria-atomic', 'true');
        this.urgentAnnouncer.className = 'sr-only';
        this.urgentAnnouncer.id = 'aria-urgent-announcer';
        document.body.appendChild(this.urgentAnnouncer);
    }

    /**
     * Announce message to screen readers
     */
    announce(message, urgent = false) {
        const announcer = urgent ? this.urgentAnnouncer : this.announcer;
        
        // Clear previous announcement
        announcer.textContent = '';
        
        // Set new announcement after a brief delay
        setTimeout(() => {
            announcer.textContent = message;
        }, 100);
        
        // Clear after announcement
        setTimeout(() => {
            announcer.textContent = '';
        }, 5000);
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (event) => {
            // Tab navigation enhancement
            if (event.key === 'Tab') {
                this.handleTabNavigation(event);
            }
            
            // Escape key handling
            if (event.key === 'Escape') {
                this.handleEscapeKey(event);
            }
            
            // Arrow key navigation for components
            if (event.key.startsWith('Arrow')) {
                this.handleArrowKeyNavigation(event);
            }
            
            // Space/Enter for button activation
            if (event.key === ' ' || event.key === 'Enter') {
                this.handleActivation(event);
            }
            
            // Keyboard shortcuts
            this.handleKeyboardShortcuts(event);
        });
    }

    /**
     * Handle tab navigation
     */
    handleTabNavigation(event) {
        // Get all focusable elements
        const focusableElements = this.getFocusableElements();
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        // If focus trap is active
        if (this.focusTrap) {
            const trapElements = this.getFocusableElements(this.focusTrap);
            if (trapElements.length > 0) {
                const first = trapElements[0];
                const last = trapElements[trapElements.length - 1];
                
                if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        }
    }

    /**
     * Handle escape key
     */
    handleEscapeKey(event) {
        // Close modals
        const openModal = document.querySelector('.modal:not(.hidden)');
        if (openModal) {
            event.preventDefault();
            this.closeModal(openModal);
        }
        
        // Close menus
        const openMenu = document.querySelector('[role="menu"]:not(.hidden)');
        if (openMenu) {
            event.preventDefault();
            this.closeMenu(openMenu);
        }
    }

    /**
     * Handle arrow key navigation
     */
    handleArrowKeyNavigation(event) {
        const target = event.target;
        
        // Radio group navigation
        if (target.type === 'radio') {
            this.handleRadioNavigation(event);
        }
        
        // Menu navigation
        if (target.closest('[role="menu"]')) {
            this.handleMenuNavigation(event);
        }
        
        // Tab navigation
        if (target.closest('[role="tablist"]')) {
            this.handleTablistNavigation(event);
        }
    }

    /**
     * Handle activation
     */
    handleActivation(event) {
        const target = event.target;
        
        // Activate buttons with Space key
        if (event.key === ' ' && target.tagName === 'BUTTON') {
            event.preventDefault();
            target.click();
        }
        
        // Activate links with Enter key
        if (event.key === 'Enter' && target.tagName === 'A') {
            // Default behavior is fine
        }
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboardShortcuts(event) {
        // Alt + H: Go to home
        if (event.altKey && event.key === 'h') {
            event.preventDefault();
            window.location.hash = '#home';
            this.announce('Navigated to home');
        }
        
        // Alt + S: Skip to main content
        if (event.altKey && event.key === 's') {
            event.preventDefault();
            const main = document.getElementById('main-content');
            if (main) {
                main.focus();
                main.scrollIntoView();
                this.announce('Skipped to main content');
            }
        }
        
        // Alt + T: Start timer
        if (event.altKey && event.key === 't') {
            event.preventDefault();
            window.location.hash = '#timer';
            this.announce('Timer opened');
        }
        
        // Alt + ?: Show keyboard shortcuts
        if (event.altKey && event.shiftKey && event.key === '?') {
            event.preventDefault();
            this.showKeyboardShortcuts();
        }
    }

    /**
     * Setup focus management
     */
    setupFocusManagement() {
        // Mark main content as focusable
        const main = document.getElementById('main-content');
        if (main) {
            main.setAttribute('tabindex', '-1');
        }
        
        // Restore focus after navigation
        window.addEventListener('hashchange', () => {
            this.restoreFocus();
        });
    }

    /**
     * Setup ARIA labels
     */
    setupAriaLabels() {
        // Add ARIA labels to navigation
        const nav = document.querySelector('nav');
        if (nav && !nav.hasAttribute('aria-label')) {
            nav.setAttribute('aria-label', 'Hoofdnavigatie');
        }
        
        // Add ARIA labels to sections
        document.querySelectorAll('section').forEach((section) => {
            if (!section.hasAttribute('aria-labelledby') && section.querySelector('h2')) {
                const heading = section.querySelector('h2');
                const headingId = heading.id || `heading-${Math.random().toString(36).substr(2, 9)}`;
                heading.id = headingId;
                section.setAttribute('aria-labelledby', headingId);
            }
        });
        
        // Add ARIA labels to form elements
        document.querySelectorAll('input, select, textarea').forEach((element) => {
            if (!element.hasAttribute('aria-label') && !element.hasAttribute('aria-labelledby')) {
                const label = element.parentElement.querySelector('label');
                if (label) {
                    const labelId = label.id || `label-${Math.random().toString(36).substr(2, 9)}`;
                    label.id = labelId;
                    element.setAttribute('aria-labelledby', labelId);
                }
            }
        });
        
        // Add ARIA descriptions for complex elements
        document.querySelectorAll('.progress').forEach((progress) => {
            if (!progress.hasAttribute('role')) {
                progress.setAttribute('role', 'progressbar');
                const value = progress.querySelector('.progress-bar')?.style.width || '0%';
                progress.setAttribute('aria-valuenow', parseInt(value));
                progress.setAttribute('aria-valuemin', '0');
                progress.setAttribute('aria-valuemax', '100');
            }
        });
    }

    /**
     * Setup reduced motion support
     */
    setupReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleReducedMotion = (event) => {
            if (event.matches) {
                document.documentElement.classList.add('reduce-motion');
                this.disableAnimations();
            } else {
                document.documentElement.classList.remove('reduce-motion');
                this.enableAnimations();
            }
        };
        
        handleReducedMotion(prefersReducedMotion);
        prefersReducedMotion.addEventListener('change', handleReducedMotion);
    }

    /**
     * Setup high contrast mode
     */
    setupHighContrast() {
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
        
        const handleHighContrast = (event) => {
            if (event.matches) {
                document.documentElement.classList.add('high-contrast');
            } else {
                document.documentElement.classList.remove('high-contrast');
            }
        };
        
        handleHighContrast(prefersHighContrast);
        prefersHighContrast.addEventListener('change', handleHighContrast);
    }

    /**
     * Setup screen reader optimizations
     */
    setupScreenReaderOptimizations() {
        // Add skip links
        this.createSkipLinks();
        
        // Add landmarks
        this.addLandmarks();
        
        // Add heading hierarchy
        this.checkHeadingHierarchy();
    }

    /**
     * Create skip links
     */
    createSkipLinks() {
        const skipLinksContainer = document.createElement('div');
        skipLinksContainer.className = 'skip-links';
        skipLinksContainer.innerHTML = `
            <a href="#main-content" class="skip-link">Skip to main content</a>
            <a href="#navigation" class="skip-link">Skip to navigation</a>
            <a href="#footer" class="skip-link">Skip to footer</a>
        `;
        
        document.body.insertBefore(skipLinksContainer, document.body.firstChild);
    }

    /**
     * Add landmarks
     */
    addLandmarks() {
        // Main landmark
        const main = document.querySelector('main');
        if (main && !main.hasAttribute('role')) {
            main.setAttribute('role', 'main');
        }
        
        // Navigation landmark
        const nav = document.querySelector('nav');
        if (nav && !nav.hasAttribute('role')) {
            nav.setAttribute('role', 'navigation');
        }
        
        // Footer landmark
        const footer = document.querySelector('footer');
        if (footer && !footer.hasAttribute('role')) {
            footer.setAttribute('role', 'contentinfo');
        }
    }

    /**
     * Check heading hierarchy
     */
    checkHeadingHierarchy() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        const issues = [];
        
        headings.forEach((heading) => {
            const level = parseInt(heading.tagName[1]);
            
            if (level > lastLevel + 1) {
                issues.push(`Heading level skipped: ${heading.textContent}`);
            }
            
            lastLevel = level;
        });
        
        if (issues.length > 0) {
            console.warn('[Accessibility] Heading hierarchy issues:', issues);
        }
    }

    /**
     * Get focusable elements
     */
    getFocusableElements(container = document) {
        const selector = [
            'a[href]',
            'button:not([disabled])',
            'input:not([disabled]):not([type="hidden"])',
            'textarea:not([disabled])',
            'select:not([disabled])',
            '[tabindex]:not([tabindex="-1"])',
            'audio[controls]',
            'video[controls]',
            '[contenteditable]'
        ].join(', ');
        
        return Array.from(container.querySelectorAll(selector));
    }

    /**
     * Trap focus in element
     */
    trapFocus(element) {
        this.focusTrap = element;
        const focusableElements = this.getFocusableElements(element);
        
        if (focusableElements.length > 0) {
            focusableElements[0].focus();
        }
    }

    /**
     * Release focus trap
     */
    releaseFocusTrap() {
        this.focusTrap = null;
    }

    /**
     * Close modal
     */
    closeModal(modal) {
        modal.classList.add('hidden');
        this.releaseFocusTrap();
        this.announce('Modal closed');
        
        // Return focus to trigger element
        const triggerId = modal.dataset.triggerId;
        if (triggerId) {
            const trigger = document.getElementById(triggerId);
            if (trigger) {
                trigger.focus();
            }
        }
    }

    /**
     * Show keyboard shortcuts
     */
    showKeyboardShortcuts() {
        const shortcuts = [
            { keys: 'Alt + H', action: 'Ga naar home' },
            { keys: 'Alt + S', action: 'Spring naar hoofdinhoud' },
            { keys: 'Alt + T', action: 'Open timer' },
            { keys: 'Alt + ?', action: 'Toon sneltoetsen' },
            { keys: 'Escape', action: 'Sluit modal/menu' },
            { keys: 'Tab', action: 'Navigeer naar volgende element' },
            { keys: 'Shift + Tab', action: 'Navigeer naar vorige element' },
            { keys: 'Enter', action: 'Activeer link of button' },
            { keys: 'Space', action: 'Activeer button of checkbox' },
            { keys: 'Arrow keys', action: 'Navigeer in menu of lijst' }
        ];
        
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-lg p-6 max-w-md w-full" role="dialog" aria-labelledby="shortcuts-title">
                <h2 id="shortcuts-title" class="text-xl font-bold mb-4">Sneltoetsen</h2>
                <dl class="space-y-2">
                    ${shortcuts.map(s => `
                        <div class="flex justify-between">
                            <dt class="font-medium">${s.keys}</dt>
                            <dd class="text-gray-600">${s.action}</dd>
                        </div>
                    `).join('')}
                </dl>
                <button class="mt-6 w-full btn btn-primary" onclick="this.closest('.fixed').remove()">Sluiten</button>
            </div>
        `;
        
        document.body.appendChild(modal);
        this.trapFocus(modal.querySelector('[role="dialog"]'));
        this.announce('Keyboard shortcuts dialog opened');
    }

    /**
     * Disable animations
     */
    disableAnimations() {
        const style = document.createElement('style');
        style.id = 'reduce-motion-styles';
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Enable animations
     */
    enableAnimations() {
        const style = document.getElementById('reduce-motion-styles');
        if (style) {
            style.remove();
        }
    }

    /**
     * Restore focus after navigation
     */
    restoreFocus() {
        const main = document.getElementById('main-content');
        if (main) {
            main.focus();
            this.announce('Page updated');
        }
    }
}

// Export singleton instance
const accessibilityService = new AccessibilityService();
export default accessibilityService;