/**
 * Mobile Navigation Component
 * Handles mobile-specific navigation, gestures, and bottom navigation
 */

import stateManager from '../core/state-manager.js';
import router from '../core/router.js';

class MobileNavigation {
    constructor() {
        this.isOpen = false;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.currentView = 'home';
        this.init();
    }

    /**
     * Initialize mobile navigation
     */
    init() {
        // Only initialize on mobile
        if (window.innerWidth > 768) return;

        this.createBottomNav();
        this.attachEventListeners();
        this.setupSwipeGestures();
    }

    /**
     * Create bottom navigation bar
     */
    createBottomNav() {
        // Check if bottom nav already exists
        if (document.getElementById('mobile-bottom-nav')) return;

        const bottomNav = document.createElement('nav');
        bottomNav.id = 'mobile-bottom-nav';
        bottomNav.className = 'mobile-bottom-nav';
        bottomNav.setAttribute('role', 'navigation');
        bottomNav.setAttribute('aria-label', 'Mobiele navigatie');

        const navItems = [
            { id: 'home', icon: '🏠', label: 'Home', view: 'home' },
            { id: 'roles', icon: '👥', label: 'Rollen', view: 'roles' },
            { id: 'prepare', icon: '📚', label: 'Materialen', view: 'materials' },
            { id: 'team', icon: '🤝', label: 'Team', view: 'team' },
            { id: 'timer', icon: '⏱', label: 'Timer', view: 'timer' }
        ];

        navItems.forEach(item => {
            const navLink = document.createElement('a');
            navLink.href = `#${item.view}`;
            navLink.className = 'mobile-nav-item';
            navLink.setAttribute('data-view', item.view);
            navLink.setAttribute('aria-label', item.label);
            
            navLink.innerHTML = `
                <span class="mobile-nav-icon">${item.icon}</span>
                <span class="mobile-nav-label">${item.label}</span>
            `;

            navLink.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateTo(item.view);
            });

            bottomNav.appendChild(navLink);
        });

        document.body.appendChild(bottomNav);
    }

    /**
     * Navigate to a view
     */
    navigateTo(view) {
        // Update active state
        this.updateActiveNavItem(view);
        
        // Navigate using router
        router.navigate(view);
        
        // Close mobile menu if open
        this.closeMobileMenu();
        
        // Update current view
        this.currentView = view;
        
        // Add haptic feedback on supported devices
        this.triggerHaptic();
    }

    /**
     * Update active navigation item
     */
    updateActiveNavItem(view) {
        const navItems = document.querySelectorAll('.mobile-nav-item');
        navItems.forEach(item => {
            if (item.dataset.view === view) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    /**
     * Setup swipe gestures
     */
    setupSwipeGestures() {
        const container = document.getElementById('view-container');
        if (!container) return;

        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        container.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
        }, { passive: true });
    }

    /**
     * Handle swipe gesture
     */
    handleSwipe(startX, startY, endX, endY) {
        const diffX = endX - startX;
        const diffY = endY - startY;
        const threshold = 50; // Minimum distance for swipe

        // Check if horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > threshold) {
            const views = ['home', 'roles', 'materials', 'team', 'timer'];
            const currentIndex = views.indexOf(this.currentView);

            if (diffX > 0 && currentIndex > 0) {
                // Swipe right - go to previous view
                this.navigateTo(views[currentIndex - 1]);
            } else if (diffX < 0 && currentIndex < views.length - 1) {
                // Swipe left - go to next view
                this.navigateTo(views[currentIndex + 1]);
            }
        }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Mobile menu toggle
        const menuButton = document.querySelector('[aria-label="Open menu"]');
        const closeButton = document.querySelector('[aria-label="Close menu"]');
        const mobileMenu = document.getElementById('mobile-menu');

        if (menuButton) {
            menuButton.addEventListener('click', () => {
                this.openMobileMenu();
            });
        }

        if (closeButton) {
            closeButton.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        }

        // Close menu on overlay click
        if (mobileMenu) {
            const overlay = mobileMenu.querySelector('.bg-gray-600');
            if (overlay) {
                overlay.addEventListener('click', () => {
                    this.closeMobileMenu();
                });
            }
        }

        // Handle orientation change
        window.addEventListener('orientationchange', () => {
            this.handleOrientationChange();
        });

        // Handle resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Prevent pull-to-refresh on certain elements
        document.addEventListener('touchmove', (e) => {
            if (e.target.closest('.no-pull-refresh')) {
                e.preventDefault();
            }
        }, { passive: false });
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('hidden');
            this.isOpen = true;
            document.body.style.overflow = 'hidden';
        }
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
            this.isOpen = false;
            document.body.style.overflow = '';
        }
    }

    /**
     * Handle orientation change
     */
    handleOrientationChange() {
        // Adjust layout for new orientation
        const orientation = window.orientation || 0;
        
        if (Math.abs(orientation) === 90) {
            // Landscape
            document.body.classList.add('landscape');
        } else {
            // Portrait
            document.body.classList.remove('landscape');
        }
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Remove mobile nav if screen is large
        if (window.innerWidth > 768) {
            const bottomNav = document.getElementById('mobile-bottom-nav');
            if (bottomNav) {
                bottomNav.remove();
            }
            this.closeMobileMenu();
        } else {
            // Re-create mobile nav if needed
            if (!document.getElementById('mobile-bottom-nav')) {
                this.createBottomNav();
            }
        }
    }

    /**
     * Trigger haptic feedback
     */
    triggerHaptic() {
        // Haptic feedback for supported devices
        if (window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(10);
        }
    }

    /**
     * Show loading indicator
     */
    showLoading() {
        const loader = document.createElement('div');
        loader.id = 'mobile-loader';
        loader.className = 'fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50';
        loader.innerHTML = `
            <div class="text-center">
                <div class="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                <p class="mt-4 text-gray-600">Laden...</p>
            </div>
        `;
        document.body.appendChild(loader);
    }

    /**
     * Hide loading indicator
     */
    hideLoading() {
        const loader = document.getElementById('mobile-loader');
        if (loader) {
            loader.remove();
        }
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `fixed bottom-20 left-4 right-4 p-4 rounded-lg shadow-lg z-50 animate-fade-in ${
            type === 'success' ? 'bg-green-500' :
            type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-yellow-500' :
            'bg-blue-500'
        } text-white`;
        toast.innerHTML = message;
        
        document.body.appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('animate-fade-out');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /**
     * Handle offline/online status
     */
    setupOfflineDetection() {
        window.addEventListener('online', () => {
            this.showToast('Verbinding hersteld', 'success');
        });

        window.addEventListener('offline', () => {
            this.showToast('Geen internetverbinding', 'warning');
        });
    }

    /**
     * Optimize for performance
     */
    optimizePerformance() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));

        // Debounce scroll events
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(() => {
                this.handleScroll();
            });
        }, { passive: true });
    }

    /**
     * Handle scroll events
     */
    handleScroll() {
        const scrollY = window.scrollY;
        const bottomNav = document.getElementById('mobile-bottom-nav');
        
        // Hide/show bottom nav based on scroll direction
        if (this.lastScrollY && scrollY > this.lastScrollY && scrollY > 100) {
            // Scrolling down
            if (bottomNav) {
                bottomNav.style.transform = 'translateY(100%)';
            }
        } else {
            // Scrolling up
            if (bottomNav) {
                bottomNav.style.transform = 'translateY(0)';
            }
        }
        
        this.lastScrollY = scrollY;
    }
}

// Export singleton instance
const mobileNavigation = new MobileNavigation();
export default mobileNavigation;