/**
 * Main Application File - De Strategische Arena
 * Initializes all modules and manages application lifecycle
 */

import stateManager from './state-manager.js';
import router from './router.js';
import mobileNavigation from '../components/mobile-navigation.js';
import offlineManager from '../services/offline-manager.js';

class StrategischeArenaApp {
    constructor() {
        this.modules = new Map();
        this.initialized = false;
        this.isUpdatingUI = false; // Prevent recursive UI updates

        // Core configuration
        this.config = {
            appName: 'De Strategische Arena',
            version: '1.0.0',
            debug: window.location.hostname === 'localhost'
        };
    }

    /**
     * Initialize the application
     */
    async init() {
        if (this.initialized) {
            console.warn('Application already initialized');
            return;
        }

        try {
            // Log initialization
            this.log('🚀 Initializing De Strategische Arena...');

            // Setup error handling
            this.setupErrorHandling();

            // Initialize state management
            this.setupStateManagement();

            // Initialize router
            await this.setupRouter();

            // Load components
            await this.loadComponents();

            // Load settings component
            await this.loadSettings();

            // Setup UI event handlers
            this.setupEventListeners();

            // Check for saved progress
            this.checkSavedProgress();

            // Update UI with initial state
            this.updateUI();

            // Mark as initialized
            this.initialized = true;
            this.log('✅ Application initialized successfully');

            // Emit ready event
            document.dispatchEvent(new CustomEvent('app:ready', {
                detail: { app: this }
            }));

        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showError('Er is een fout opgetreden bij het laden van de applicatie.');
        }
    }

    /**
     * Setup state management listeners
     */
    setupStateManagement() {
        // Listen for state changes with error handling
        stateManager.on('state:changed', (change) => {
            try {
                this.log('State changed:', change);
                // Don't update UI if it's the progress.overall field (to prevent loops)
                if (change && change.path !== 'progress.overall') {
                    this.updateUI();
                }
            } catch (error) {
                console.error('Error handling state change:', error);
            }
        });

        // Listen for external updates (other tabs)
        stateManager.on('state:external-update', () => {
            try {
                this.log('State updated from another tab');
                this.updateUI();
                this.showNotification('Je voortgang is bijgewerkt vanuit een ander tabblad.', 'info');
            } catch (error) {
                console.error('Error handling external update:', error);
            }
        });

        // Listen for save events
        stateManager.on('state:saved', () => {
            this.log('State saved to LocalStorage');
        });

        // Listen for errors
        stateManager.on('state:save-error', (error) => {
            console.error('Failed to save state:', error);
            this.showNotification('Er is een fout opgetreden bij het opslaan van je voortgang.', 'error');
        });
    }

    /**
     * Setup router and navigation
     */
    async setupRouter() {
        // Initialize router with routes
        router.init({
            '/': 'home',
            '/voorbereiding': 'preparation',
            '/rollen': 'roles',
            '/team': 'team',
            '/materialen': 'materials',
            '/timer': 'timer',
            '/qa': 'qa-simulator',
            '/checklist': 'checklist',
            '/schema': 'schedule'
        });

        // Listen for route changes
        router.on('route:changed', (route) => {
            this.log('Route changed:', route);
            this.loadView(route);
        });

        // Handle initial route
        router.handleCurrentRoute();
    }

    /**
     * Load view based on route
     */
    async loadView(route) {
        const viewContainer = document.getElementById('view-container');
        if (!viewContainer) {
            console.error('View container not found');
            return;
        }

        // Show loading state
        viewContainer.innerHTML = this.getLoadingTemplate();

        try {
            let content = '';

            switch(route) {
                case 'home':
                    content = this.getHomeView();
                    break;
                case 'preparation':
                    content = this.getPreparationView();
                    break;
                case 'roles':
                    const RoleFunctionSelector = await this.getModule('role-function-selector');
                    content = RoleFunctionSelector ? RoleFunctionSelector.render() : this.getErrorView('Module niet gevonden');
                    break;
                case 'team':
                    const TeamManager = await this.getModule('team-manager');
                    content = TeamManager ? TeamManager.render() : this.getErrorView('Module niet gevonden');
                    break;
                case 'timer':
                    const Timer = await this.getModule('timer');
                    content = Timer ? Timer.render() : this.getErrorView('Module niet gevonden');
                    break;
                case 'schedule':
                    const RotationSchedule = await this.getModule('rotation-schedule');
                    content = RotationSchedule ? RotationSchedule.render() : this.getErrorView('Module niet gevonden');
                    break;
                case 'materials':
                    const PreparationMaterials = await this.getModule('preparation-materials');
                    content = PreparationMaterials ? PreparationMaterials.render() : this.getErrorView('Module niet gevonden');
                    break;
                default:
                    content = this.get404View();
            }

            viewContainer.innerHTML = content;

            // Attach navigation handlers to dynamically loaded buttons
            this.attachNavigationHandlers();

            // Initialize view-specific components
            this.initializeViewComponents(route);

        } catch (error) {
            console.error('Failed to load view:', error);
            viewContainer.innerHTML = this.getErrorView('Er is een fout opgetreden bij het laden van de pagina.');
        }
    }

    /**
     * Load all component modules
     */
    async loadComponents() {
        const components = [
            'role-selection',
            'role-function-selector',
            'progress-tracker',
            'timer',
            'team-coordination',
            'team-manager',
            'invitation-manager',
            'qa-simulator'
        ];

        for (const component of components) {
            try {
                const module = await import(`../components/${component}.js`);
                this.modules.set(component, module.default);
                this.log(`Loaded component: ${component}`);
            } catch (error) {
                console.error(`Failed to load component ${component}:`, error);
            }
        }
    }

    /**
     * Load settings component
     */
    async loadSettings() {
        try {
            const settingsModule = await import('../components/settings.js');
            const settings = settingsModule.default;
            this.modules.set('settings', settings);

            // Ensure settings is initialized
            if (settings && typeof settings.init === 'function') {
                settings.init();
            }

            this.log('Settings component loaded and initialized');
        } catch (error) {
            console.error('Failed to load settings:', error);
        }
    }

    /**
     * Get a loaded module
     */
    async getModule(name) {
        if (!this.modules.has(name)) {
            try {
                const module = await import(`../components/${name}.js`);
                this.modules.set(name, module.default);
            } catch (error) {
                console.error(`Failed to load module ${name}:`, error);
                return null;
            }
        }
        return this.modules.get(name);
    }

    /**
     * Setup global event listeners
     */
    setupEventListeners() {
        // Mobile menu toggle
        const menuButton = document.querySelector('[aria-label="Open menu"]');
        const closeButton = document.querySelector('[aria-label="Close menu"]');
        const mobileMenu = document.getElementById('mobile-menu');

        if (menuButton && mobileMenu) {
            menuButton.addEventListener('click', () => {
                mobileMenu.classList.remove('hidden');
                menuButton.setAttribute('aria-expanded', 'true');
            });
        }

        if (closeButton && mobileMenu) {
            closeButton.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                menuButton?.setAttribute('aria-expanded', 'false');
            });
        }

        // Navigation links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== '#') {
                    e.preventDefault();
                    router.navigate(href.substring(1));
                }
            });
        });

        // Start button
        const startButton = document.querySelector('.btn-primary');
        if (startButton && startButton.textContent.includes('Start')) {
            startButton.addEventListener('click', () => {
                router.navigate('/rollen');
            });
        }

        // Handle visibility change (tab switching)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.log('Tab became visible, refreshing state...');
                stateManager.loadState();
                this.updateUI();
            }
        });
    }

    /**
     * Attach navigation handlers to buttons with data-navigate attribute
     */
    attachNavigationHandlers() {
        const buttons = document.querySelectorAll('[data-navigate]');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const path = button.getAttribute('data-navigate');
                if (path && router) {
                    router.navigate(path);
                }
            });
        });
    }

    /**
     * Initialize view-specific components
     */
    initializeViewComponents(route) {
        // Re-attach event listeners for dynamically loaded content
        const viewContainer = document.getElementById('view-container');
        if (!viewContainer) return;

        // Initialize based on route
        switch(route) {
            case 'roles':
                this.initializeRoleFunctionSelector();
                break;
            case 'timer':
                this.initializeTimer();
                break;
            case 'team':
                this.initializeTeamManager();
                break;
            case 'schedule':
                this.initializeRotationSchedule();
                break;
            case 'materials':
                this.initializePreparationMaterials();
                break;
        }
    }

    /**
     * Initialize role selection component (legacy)
     */
    async initializeRoleSelection() {
        const RoleSelection = await this.getModule('role-selection');
        if (RoleSelection) {
            RoleSelection.init();
        }
    }

    /**
     * Initialize role function selector component
     */
    async initializeRoleFunctionSelector() {
        const RoleFunctionSelector = await this.getModule('role-function-selector');
        if (RoleFunctionSelector) {
            await RoleFunctionSelector.init();
            RoleFunctionSelector.attachEventListeners();
        }
    }

    /**
     * Initialize timer component
     */
    async initializeTimer() {
        const Timer = await this.getModule('timer');
        if (Timer) {
            Timer.init();
        }
    }

    /**
     * Initialize team coordination (legacy)
     */
    async initializeTeamCoordination() {
        const TeamCoordination = await this.getModule('team-coordination');
        if (TeamCoordination) {
            TeamCoordination.init();
        }
    }

    /**
     * Initialize team manager
     */
    async initializeTeamManager() {
        const TeamManager = await this.getModule('team-manager');
        if (TeamManager) {
            await TeamManager.init();
        }
    }

    /**
     * Initialize preparation materials
     */
    async initializePreparationMaterials() {
        const PreparationMaterials = await this.getModule('preparation-materials');
        if (PreparationMaterials && typeof PreparationMaterials.init === 'function') {
            PreparationMaterials.init();
        }
    }

    /**
     * Initialize rotation schedule
     */
    async initializeRotationSchedule() {
        const RotationSchedule = await this.getModule('rotation-schedule');
        if (RotationSchedule && typeof RotationSchedule.init === 'function') {
            RotationSchedule.init();
        }
        if (RotationSchedule && typeof RotationSchedule.attachEventListeners === 'function') {
            RotationSchedule.attachEventListeners();
        }
    }

    /**
     * Update UI based on current state
     */
    updateUI() {
        // Prevent recursive updates
        if (this.isUpdatingUI) {
            return;
        }

        this.isUpdatingUI = true;

        try {
            // Update progress bar
            const progressBar = document.querySelector('.progress-bar');
            const progressText = document.querySelector('.progress-text');
            const progress = stateManager.calculateProgress();

            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
            if (progressText) {
                progressText.textContent = `${progress}% voltooid`;
            }

            // Update navigation active state
            this.updateNavigationState();

            // Update user info if available
            this.updateUserInfo();
        } catch (error) {
            console.error('Error updating UI:', error);
        } finally {
            this.isUpdatingUI = false;
        }
    }

    /**
     * Update navigation active states
     */
    updateNavigationState() {
        const currentPath = router.getCurrentPath();
        document.querySelectorAll('nav a').forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${currentPath}` || (currentPath === '' && href === '#voorbereiding')) {
                link.classList.add('text-primary-600', 'font-semibold');
                link.classList.remove('text-gray-700');
            } else {
                link.classList.remove('text-primary-600', 'font-semibold');
                link.classList.add('text-gray-700');
            }
        });
    }

    /**
     * Update user info display
     */
    updateUserInfo() {
        const user = stateManager.get('user');
        if (user.name) {
            const userDisplay = document.getElementById('user-display');
            if (userDisplay) {
                userDisplay.textContent = `Welkom, ${user.name}`;
            }
        }
    }

    /**
     * Check for saved progress and show notification
     */
    checkSavedProgress() {
        const progress = stateManager.get('progress.overall');
        const lastActivity = stateManager.get('progress.lastActivity');

        if (progress > 0 && lastActivity) {
            const lastDate = new Date(lastActivity);
            const now = new Date();
            const hoursSince = Math.round((now - lastDate) / (1000 * 60 * 60));

            if (hoursSince < 24) {
                this.showNotification(
                    `Welkom terug! Je bent ${progress}% klaar met je voorbereiding.`,
                    'success'
                );
            }
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="flex items-center justify-between p-4 rounded-lg shadow-lg ${this.getNotificationClasses(type)}">
                <span>${message}</span>
                <button class="ml-4 text-white hover:opacity-75" onclick="this.parentElement.parentElement.remove()">
                    ✕
                </button>
            </div>
        `;

        // Add to container or create one
        let container = document.getElementById('notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'fixed top-4 right-4 z-50 space-y-2';
            document.body.appendChild(container);
        }

        container.appendChild(notification);

        // Auto-remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    /**
     * Get notification classes based on type
     */
    getNotificationClasses(type) {
        const classes = {
            'success': 'bg-green-600 text-white',
            'error': 'bg-red-600 text-white',
            'warning': 'bg-yellow-500 text-white',
            'info': 'bg-blue-600 text-white'
        };
        return classes[type] || classes['info'];
    }

    /**
     * Show error message
     */
    showError(message) {
        this.showNotification(message, 'error');
    }

    /**
     * Setup error handling
     */
    setupErrorHandling() {
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            if (this.config.debug) {
                this.showError(`Error: ${event.error.message}`);
            }
        });

        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            if (this.config.debug) {
                this.showError(`Unhandled promise rejection: ${event.reason}`);
            }
        });
    }

    /**
     * View templates
     */
    getLoadingTemplate() {
        return `
            <div class="flex items-center justify-center min-h-screen">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p class="text-gray-600">Laden...</p>
                </div>
            </div>
        `;
    }

    getHomeView() {
        return `
            <section class="text-center py-12 md:py-16">
                <h2 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Bereid je voor op De Strategische Arena
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
                    Een authentieke boardroom simulatie waar je als Raad van Bestuur je economische analyse presenteert en verdedigt tegenover kritische stakeholders.
                </p>
                <div class="flex flex-col sm:flex-row gap-4 justify-center">
                    <button class="btn btn-primary" data-navigate="/rollen">
                        Start Voorbereiding
                    </button>
                    <button class="btn btn-secondary" data-navigate="/materialen">
                        Bekijk Handleiding
                    </button>
                </div>
            </section>
        `;
    }

    getPreparationView() {
        return `
            <section class="py-8">
                <h2 class="text-3xl font-bold text-gray-900 mb-6">Voorbereiding</h2>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Preparation modules will be loaded here -->
                </div>
            </section>
        `;
    }

    getErrorView(message) {
        return `
            <div class="text-center py-12">
                <div class="text-red-600 text-6xl mb-4">⚠️</div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Er is een fout opgetreden</h2>
                <p class="text-gray-600">${message}</p>
            </div>
        `;
    }

    get404View() {
        return `
            <div class="text-center py-12">
                <div class="text-gray-400 text-6xl mb-4">404</div>
                <h2 class="text-2xl font-bold text-gray-900 mb-2">Pagina niet gevonden</h2>
                <p class="text-gray-600">De pagina die je zoekt bestaat niet.</p>
                <button class="btn btn-primary mt-6" data-navigate="/">
                    Terug naar home
                </button>
            </div>
        `;
    }

    /**
     * Debug logging
     */
    log(...args) {
        if (this.config.debug) {
            console.log('[StrategischeArena]', ...args);
        }
    }
}

// Create and export app instance
const app = new StrategischeArenaApp();
export default app;

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

// Expose globally for debugging
if (typeof window !== 'undefined') {
    window.app = app;
}