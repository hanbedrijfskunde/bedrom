/**
 * Router - Client-side routing for De Strategische Arena
 * Handles navigation without page refreshes
 */

class Router {
    constructor() {
        this.routes = new Map();
        this.currentRoute = null;
        this.listeners = new Map();
        this.initialized = false;
    }

    /**
     * Initialize router with routes
     * @param {Object} routeConfig - Route configuration object
     */
    init(routeConfig) {
        if (this.initialized) {
            console.warn('Router already initialized');
            return;
        }

        // Store routes
        for (const [path, name] of Object.entries(routeConfig)) {
            this.routes.set(path, name);
        }

        // Setup event listeners
        this.setupListeners();

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            this.handleCurrentRoute();
        });

        this.initialized = true;
        console.log('Router initialized with routes:', Array.from(this.routes.keys()));
    }

    /**
     * Setup navigation listeners
     */
    setupListeners() {
        // Listen for clicks on all links
        document.addEventListener('click', (event) => {
            // Find closest link element
            const link = event.target.closest('a');
            if (!link) return;

            // Check if it's an internal link
            const href = link.getAttribute('href');
            if (!href) return;

            // Handle hash links
            if (href.startsWith('#')) {
                event.preventDefault();
                const path = href.substring(1);
                this.navigate(path);
                return;
            }

            // Handle relative links
            if (!href.startsWith('http') && !href.startsWith('//')) {
                event.preventDefault();
                this.navigate(href);
            }
        });
    }

    /**
     * Navigate to a route
     * @param {string} path - Route path
     */
    navigate(path) {
        // Normalize path
        path = this.normalizePath(path);

        // Check if route exists
        const routeName = this.getRouteName(path);
        if (!routeName && path !== '/') {
            console.warn(`Route not found: ${path}`);
            this.emit('route:not-found', path);
            return;
        }

        // Update URL without page refresh
        const newUrl = path === '/' ? window.location.pathname : `#${path}`;
        window.history.pushState({ path }, '', newUrl);

        // Update current route
        this.currentRoute = path;

        // Emit route change event
        this.emit('route:changed', routeName || 'home');

        // Scroll to top
        window.scrollTo(0, 0);
    }

    /**
     * Handle current route (on page load or popstate)
     */
    handleCurrentRoute() {
        const hash = window.location.hash;
        const path = hash ? hash.substring(1) : '/';

        this.currentRoute = path;
        const routeName = this.getRouteName(path);

        this.emit('route:changed', routeName || 'home');
    }

    /**
     * Get route name from path
     */
    getRouteName(path) {
        path = this.normalizePath(path);

        // Direct match
        if (this.routes.has(path)) {
            return this.routes.get(path);
        }

        // Try with leading slash
        if (this.routes.has('/' + path)) {
            return this.routes.get('/' + path);
        }

        // Try without leading slash
        if (path.startsWith('/') && this.routes.has(path.substring(1))) {
            return this.routes.get(path.substring(1));
        }

        return null;
    }

    /**
     * Get current path
     */
    getCurrentPath() {
        const hash = window.location.hash;
        return hash ? hash.substring(1) : '';
    }

    /**
     * Get current route name
     */
    getCurrentRouteName() {
        return this.getRouteName(this.getCurrentPath());
    }

    /**
     * Normalize path
     */
    normalizePath(path) {
        // Remove trailing slash except for root
        if (path !== '/' && path.endsWith('/')) {
            path = path.slice(0, -1);
        }

        // Ensure leading slash for non-empty paths
        if (path && !path.startsWith('/')) {
            path = '/' + path;
        }

        return path || '/';
    }

    /**
     * Go back in history
     */
    back() {
        window.history.back();
    }

    /**
     * Go forward in history
     */
    forward() {
        window.history.forward();
    }

    /**
     * Replace current route
     */
    replace(path) {
        path = this.normalizePath(path);
        const routeName = this.getRouteName(path);

        if (!routeName && path !== '/') {
            console.warn(`Route not found: ${path}`);
            return;
        }

        const newUrl = path === '/' ? window.location.pathname : `#${path}`;
        window.history.replaceState({ path }, '', newUrl);

        this.currentRoute = path;
        this.emit('route:changed', routeName || 'home');
    }

    /**
     * Add a route dynamically
     */
    addRoute(path, name) {
        this.routes.set(path, name);
    }

    /**
     * Remove a route
     */
    removeRoute(path) {
        this.routes.delete(path);
    }

    /**
     * Check if route exists
     */
    hasRoute(path) {
        path = this.normalizePath(path);
        return this.routes.has(path);
    }

    /**
     * Subscribe to router events
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(callback);

        // Return unsubscribe function
        return () => {
            const callbacks = this.listeners.get(event);
            if (callbacks) {
                callbacks.delete(callback);
            }
        };
    }

    /**
     * Emit an event
     */
    emit(event, data) {
        const callbacks = this.listeners.get(event);
        if (callbacks) {
            callbacks.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`Error in router listener for ${event}:`, error);
                }
            });
        }
    }

    /**
     * Get all routes
     */
    getRoutes() {
        return Array.from(this.routes.entries());
    }

    /**
     * Debug method
     */
    debug() {
        console.group('🔍 Router Debug');
        console.log('Routes:', this.getRoutes());
        console.log('Current Route:', this.currentRoute);
        console.log('Current Path:', this.getCurrentPath());
        console.log('Listeners:', Array.from(this.listeners.keys()));
        console.groupEnd();
    }
}

// Create singleton instance
const router = new Router();

// Export for use in other modules
export default router;

// Also expose globally for debugging
if (typeof window !== 'undefined') {
    window.router = router;
}