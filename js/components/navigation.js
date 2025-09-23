/**
 * Navigation Component - Handles navigation menu and breadcrumbs
 */

import stateManager from '../core/state-manager.js';
import router from '../core/router.js';

class Navigation {
    constructor() {
        this.navItems = [
            { path: 'voorbereiding', label: 'Voorbereiding', icon: '📚' },
            { path: 'rollen', label: 'Rollen', icon: '👥' },
            { path: 'team', label: 'Team', icon: '🤝' },
            { path: 'materialen', label: 'Materialen', icon: '📄' },
            { path: 'timer', label: 'Timer', icon: '⏱️' },
            { path: 'qa', label: 'Q&A Simulator', icon: '💬' },
            { path: 'checklist', label: 'Checklist', icon: '✅' }
        ];

        this.init();
    }

    init() {
        this.setupBreadcrumbs();
        this.setupNavigationIndicators();
        this.updateActiveStates();

        // Listen for route changes
        router.on('route:changed', () => {
            this.updateActiveStates();
            this.updateBreadcrumbs();
        });

        // Listen for progress updates
        stateManager.on('state:changed', (change) => {
            if (change.path && change.path.startsWith('progress.modules')) {
                this.updateNavigationIndicators();
            }
        });
    }

    /**
     * Setup breadcrumb navigation
     */
    setupBreadcrumbs() {
        const breadcrumbContainer = document.getElementById('breadcrumbs');
        if (!breadcrumbContainer) {
            // Create breadcrumb container if it doesn't exist
            const header = document.querySelector('header nav');
            if (header) {
                const breadcrumbDiv = document.createElement('div');
                breadcrumbDiv.id = 'breadcrumbs';
                breadcrumbDiv.className = 'py-2 text-sm text-gray-600';
                header.appendChild(breadcrumbDiv);
            }
        }
    }

    /**
     * Update breadcrumb trail
     */
    updateBreadcrumbs() {
        const container = document.getElementById('breadcrumbs');
        if (!container) return;

        const currentPath = router.getCurrentPath();
        const breadcrumbs = ['Home'];

        // Find current nav item
        const currentItem = this.navItems.find(item => item.path === currentPath);
        if (currentItem) {
            breadcrumbs.push(currentItem.label);
        }

        // Generate breadcrumb HTML
        const breadcrumbHTML = breadcrumbs
            .map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                const path = index === 0 ? '/' : this.navItems[index - 1]?.path;

                if (isLast) {
                    return `<span class="font-semibold text-gray-900">${crumb}</span>`;
                } else {
                    return `
                        <a href="#${path || ''}" class="hover:text-primary-600 transition-colors">
                            ${crumb}
                        </a>
                        <span class="mx-2">/</span>
                    `;
                }
            })
            .join('');

        container.innerHTML = `
            <div class="flex items-center">
                ${breadcrumbHTML}
            </div>
        `;
    }

    /**
     * Setup navigation progress indicators
     */
    setupNavigationIndicators() {
        // Add progress indicators to nav items
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            const path = href.replace('#', '');
            const moduleKey = this.getModuleKeyFromPath(path);

            if (moduleKey) {
                const isComplete = stateManager.get(`progress.modules.${moduleKey}`);
                this.updateLinkIndicator(link, isComplete);
            }
        });
    }

    /**
     * Update navigation progress indicators
     */
    updateNavigationIndicators() {
        const navLinks = document.querySelectorAll('nav a');
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            const path = href.replace('#', '');
            const moduleKey = this.getModuleKeyFromPath(path);

            if (moduleKey) {
                const isComplete = stateManager.get(`progress.modules.${moduleKey}`);
                this.updateLinkIndicator(link, isComplete);
            }
        });
    }

    /**
     * Update link with completion indicator
     */
    updateLinkIndicator(link, isComplete) {
        // Remove existing indicator
        const existingIndicator = link.querySelector('.nav-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        // Add new indicator if complete
        if (isComplete) {
            const indicator = document.createElement('span');
            indicator.className = 'nav-indicator ml-1 text-green-600';
            indicator.innerHTML = '✓';
            link.appendChild(indicator);
        }
    }

    /**
     * Get module key from navigation path
     */
    getModuleKeyFromPath(path) {
        const pathToModule = {
            'rollen': 'roleSelection',
            'materialen': 'preparationMaterials',
            'team': 'teamCoordination',
            'timer': 'practiceSession',
            'qa': 'qaSimulator',
            'checklist': 'finalChecklist'
        };

        return pathToModule[path];
    }

    /**
     * Update active navigation states
     */
    updateActiveStates() {
        const currentPath = router.getCurrentPath();

        // Update desktop navigation
        document.querySelectorAll('nav a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            const path = href.replace('#', '');

            if (path === currentPath) {
                link.classList.add('text-primary-600', 'font-semibold');
                link.classList.remove('text-gray-700');
            } else {
                link.classList.remove('text-primary-600', 'font-semibold');
                link.classList.add('text-gray-700');
            }
        });

        // Update mobile navigation
        document.querySelectorAll('#mobile-menu a').forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            const path = href.replace('#', '');

            if (path === currentPath) {
                link.classList.add('text-primary-600', 'font-semibold');
                link.classList.remove('text-gray-700');
            } else {
                link.classList.remove('text-primary-600', 'font-semibold');
                link.classList.add('text-gray-700');
            }
        });
    }

    /**
     * Generate navigation menu HTML
     */
    generateNavMenu() {
        const progress = stateManager.get('progress.modules');

        return this.navItems.map(item => {
            const moduleKey = this.getModuleKeyFromPath(item.path);
            const isComplete = moduleKey ? progress[moduleKey] : false;
            const checkmark = isComplete ? '<span class="text-green-600 ml-1">✓</span>' : '';

            return `
                <a href="#${item.path}"
                   class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-primary-600 rounded-lg transition-all">
                    <span class="mr-3 text-xl">${item.icon}</span>
                    <span>${item.label}</span>
                    ${checkmark}
                </a>
            `;
        }).join('');
    }

    /**
     * Generate mobile navigation menu
     */
    generateMobileMenu() {
        return `
            <div class="fixed inset-0 z-50 lg:hidden" id="mobile-navigation">
                <div class="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
                <nav class="fixed top-0 right-0 bottom-0 flex flex-col w-5/6 max-w-sm py-6 px-6 bg-white border-l overflow-y-auto">
                    <div class="flex justify-between items-center mb-8">
                        <h2 class="text-xl font-semibold">Menu</h2>
                        <button type="button"
                                class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                                onclick="navigation.closeMobileMenu()">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div class="flex flex-col space-y-2">
                        ${this.generateNavMenu()}
                    </div>
                </nav>
            </div>
        `;
    }

    /**
     * Open mobile menu
     */
    openMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('hidden');
        }
    }

    /**
     * Close mobile menu
     */
    closeMobileMenu() {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.add('hidden');
        }
    }

    /**
     * Generate navigation progress summary
     */
    getProgressSummary() {
        const modules = stateManager.get('progress.modules');
        const completed = Object.values(modules).filter(Boolean).length;
        const total = Object.keys(modules).length;

        return {
            completed,
            total,
            percentage: Math.round((completed / total) * 100)
        };
    }

    /**
     * Show navigation help
     */
    showHelp() {
        const helpContent = `
            <div class="p-6">
                <h3 class="text-lg font-semibold mb-4">Navigatie Help</h3>
                <div class="space-y-3 text-sm text-gray-600">
                    <p>• Klik op een menu-item om naar dat onderdeel te gaan</p>
                    <p>• Groene vinkjes geven voltooide onderdelen aan</p>
                    <p>• Je voortgang wordt automatisch opgeslagen</p>
                    <p>• Gebruik de pijltjestoetsen voor snelle navigatie</p>
                </div>
            </div>
        `;

        // You can implement a modal or tooltip to show this help
        console.log('Navigation help:', helpContent);
    }

    /**
     * Setup keyboard navigation
     */
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Only handle if no input is focused
            if (document.activeElement.tagName === 'INPUT' ||
                document.activeElement.tagName === 'TEXTAREA') {
                return;
            }

            switch(e.key) {
                case 'ArrowLeft':
                    this.navigatePrevious();
                    break;
                case 'ArrowRight':
                    this.navigateNext();
                    break;
                case '?':
                    if (e.shiftKey) {
                        this.showHelp();
                    }
                    break;
            }
        });
    }

    /**
     * Navigate to previous item
     */
    navigatePrevious() {
        const currentPath = router.getCurrentPath();
        const currentIndex = this.navItems.findIndex(item => item.path === currentPath);

        if (currentIndex > 0) {
            router.navigate(this.navItems[currentIndex - 1].path);
        }
    }

    /**
     * Navigate to next item
     */
    navigateNext() {
        const currentPath = router.getCurrentPath();
        const currentIndex = this.navItems.findIndex(item => item.path === currentPath);

        if (currentIndex < this.navItems.length - 1) {
            router.navigate(this.navItems[currentIndex + 1].path);
        }
    }
}

// Create singleton instance
const navigation = new Navigation();

// Export for use in other modules
export default navigation;

// Also expose globally for debugging
if (typeof window !== 'undefined') {
    window.navigation = navigation;
}