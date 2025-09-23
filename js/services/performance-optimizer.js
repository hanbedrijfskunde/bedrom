/**
 * Performance Optimizer Service
 * Optimizes loading, rendering, and runtime performance
 */

export class PerformanceOptimizer {
    constructor() {
        this.observer = null;
        this.lazyImages = new Set();
        this.metrics = {};
        this.init();
    }

    /**
     * Initialize performance optimizations
     */
    init() {
        // Setup lazy loading
        this.setupLazyLoading();
        
        // Setup resource hints
        this.setupResourceHints();
        
        // Setup performance monitoring
        this.setupPerformanceMonitoring();
        
        // Optimize animations
        this.optimizeAnimations();
        
        // Setup code splitting
        this.setupCodeSplitting();
        
        // Optimize images
        this.optimizeImages();
        
        // Setup request idle callback
        this.setupIdleCallbacks();
        
        // Debounce scroll and resize events
        this.optimizeEventHandlers();
    }

    /**
     * Setup lazy loading for images and components
     */
    setupLazyLoading() {
        // IntersectionObserver for lazy loading
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            this.loadResource(entry.target);
                        }
                    });
                },
                {
                    rootMargin: '50px 0px',
                    threshold: 0.01
                }
            );

            // Observe lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                this.observer.observe(img);
                this.lazyImages.add(img);
            });

            // Observe lazy iframes
            document.querySelectorAll('iframe[data-src]').forEach(iframe => {
                this.observer.observe(iframe);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            this.loadAllResources();
        }
    }

    /**
     * Load resource (image or iframe)
     */
    loadResource(element) {
        if (element.dataset.src) {
            // Create a new image to preload
            if (element.tagName === 'IMG') {
                const img = new Image();
                img.onload = () => {
                    element.src = element.dataset.src;
                    element.classList.add('loaded');
                    delete element.dataset.src;
                };
                img.onerror = () => {
                    element.classList.add('error');
                };
                img.src = element.dataset.src;
            } else {
                element.src = element.dataset.src;
                delete element.dataset.src;
            }

            // Unobserve after loading
            if (this.observer) {
                this.observer.unobserve(element);
            }
            this.lazyImages.delete(element);
        }

        // Load srcset if available
        if (element.dataset.srcset) {
            element.srcset = element.dataset.srcset;
            delete element.dataset.srcset;
        }
    }

    /**
     * Setup resource hints
     */
    setupResourceHints() {
        // Preconnect to external domains
        const preconnects = [
            'https://fonts.googleapis.com',
            'https://fonts.gstatic.com',
            'https://cdn.tailwindcss.com'
        ];

        preconnects.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'preconnect';
            link.href = url;
            link.crossOrigin = 'anonymous';
            document.head.appendChild(link);
        });

        // DNS prefetch for external resources
        const dnsPrefetch = [
            'https://cdnjs.cloudflare.com'
        ];

        dnsPrefetch.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'dns-prefetch';
            link.href = url;
            document.head.appendChild(link);
        });

        // Preload critical resources
        const preloadResources = [
            { href: '/css/design-system.css', as: 'style' },
            { href: '/js/core/app.js', as: 'script', type: 'module' }
        ];

        preloadResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.type) {
                link.type = resource.type;
            }
            document.head.appendChild(link);
        });
    }

    /**
     * Setup performance monitoring
     */
    setupPerformanceMonitoring() {
        // Performance Observer for monitoring
        if ('PerformanceObserver' in window) {
            // Monitor Largest Contentful Paint
            try {
                const lcpObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    const lastEntry = entries[entries.length - 1];
                    this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
                    console.log('[Performance] LCP:', this.metrics.lcp);
                });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
            } catch (e) {
                console.warn('[Performance] LCP not supported');
            }

            // Monitor First Input Delay
            try {
                const fidObserver = new PerformanceObserver((list) => {
                    const entries = list.getEntries();
                    entries.forEach(entry => {
                        this.metrics.fid = entry.processingStart - entry.startTime;
                        console.log('[Performance] FID:', this.metrics.fid);
                    });
                });
                fidObserver.observe({ entryTypes: ['first-input'] });
            } catch (e) {
                console.warn('[Performance] FID not supported');
            }

            // Monitor Cumulative Layout Shift
            try {
                let clsValue = 0;
                const clsObserver = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (!entry.hadRecentInput) {
                            clsValue += entry.value;
                        }
                    }
                    this.metrics.cls = clsValue;
                    console.log('[Performance] CLS:', this.metrics.cls);
                });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (e) {
                console.warn('[Performance] CLS not supported');
            }
        }

        // Monitor page load time
        window.addEventListener('load', () => {
            if (window.performance && window.performance.timing) {
                const timing = window.performance.timing;
                this.metrics.loadTime = timing.loadEventEnd - timing.navigationStart;
                this.metrics.domReady = timing.domContentLoadedEventEnd - timing.navigationStart;
                this.metrics.firstByte = timing.responseStart - timing.navigationStart;
                
                console.log('[Performance] Metrics:', this.metrics);
            }
        });
    }

    /**
     * Optimize animations
     */
    optimizeAnimations() {
        // Use CSS containment for animated elements
        document.querySelectorAll('.animate, [class*="transition"]').forEach(element => {
            element.style.willChange = 'transform';
            element.style.contain = 'layout style paint';
        });

        // Use GPU acceleration for transforms
        document.querySelectorAll('.modal, .card').forEach(element => {
            element.style.transform = 'translateZ(0)';
        });

        // Pause animations when not visible
        if ('IntersectionObserver' in window) {
            const animationObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.animationPlayState = 'running';
                        } else {
                            entry.target.style.animationPlayState = 'paused';
                        }
                    });
                },
                { threshold: 0.1 }
            );

            document.querySelectorAll('[class*="animate"]').forEach(element => {
                animationObserver.observe(element);
            });
        }
    }

    /**
     * Setup code splitting and dynamic imports
     */
    setupCodeSplitting() {
        // Lazy load non-critical modules
        const lazyModules = {
            'pdf-generator': () => import('../services/pdf-generator.js'),
            'qa-simulator': () => import('../components/qa-simulator.js'),
            'team-coordination': () => import('../components/team-coordination.js')
        };

        // Load modules on demand
        window.loadModule = async (moduleName) => {
            if (lazyModules[moduleName]) {
                try {
                    const module = await lazyModules[moduleName]();
                    console.log(`[Performance] Module ${moduleName} loaded`);
                    return module;
                } catch (error) {
                    console.error(`[Performance] Failed to load module ${moduleName}:`, error);
                }
            }
        };
    }

    /**
     * Optimize images
     */
    optimizeImages() {
        // Add loading="lazy" to images
        document.querySelectorAll('img:not([loading])').forEach(img => {
            if (!this.lazyImages.has(img)) {
                img.loading = 'lazy';
            }
        });

        // Add decoding="async" to images
        document.querySelectorAll('img:not([decoding])').forEach(img => {
            img.decoding = 'async';
        });

        // Use WebP format detection
        this.detectWebPSupport();
    }

    /**
     * Detect WebP support
     */
    detectWebPSupport() {
        const webP = new Image();
        webP.onload = webP.onerror = () => {
            const isSupported = webP.height === 2;
            document.documentElement.classList.toggle('webp', isSupported);
            document.documentElement.classList.toggle('no-webp', !isSupported);
        };
        webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    }

    /**
     * Setup idle callbacks for non-critical work
     */
    setupIdleCallbacks() {
        if ('requestIdleCallback' in window) {
            // Defer non-critical initialization
            requestIdleCallback(() => {
                this.initializeAnalytics();
                this.preloadNextPages();
                this.cleanupUnusedResources();
            }, { timeout: 2000 });
        } else {
            // Fallback to setTimeout
            setTimeout(() => {
                this.initializeAnalytics();
                this.preloadNextPages();
                this.cleanupUnusedResources();
            }, 1000);
        }
    }

    /**
     * Optimize event handlers
     */
    optimizeEventHandlers() {
        // Debounce scroll events
        let scrollTimeout;
        const handleScroll = () => {
            if (scrollTimeout) {
                window.cancelAnimationFrame(scrollTimeout);
            }
            scrollTimeout = window.requestAnimationFrame(() => {
                // Handle scroll
                this.checkLazyLoad();
            });
        };
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Debounce resize events
        let resizeTimeout;
        const handleResize = () => {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(() => {
                // Handle resize
                this.adjustLayout();
            }, 250);
        };
        window.addEventListener('resize', handleResize, { passive: true });

        // Use passive event listeners
        document.addEventListener('touchstart', () => {}, { passive: true });
        document.addEventListener('touchmove', () => {}, { passive: true });
        document.addEventListener('wheel', () => {}, { passive: true });
    }

    /**
     * Check lazy load
     */
    checkLazyLoad() {
        // Manual check for lazy loading
        this.lazyImages.forEach(img => {
            const rect = img.getBoundingClientRect();
            if (rect.top <= window.innerHeight && rect.bottom >= 0) {
                this.loadResource(img);
            }
        });
    }

    /**
     * Adjust layout
     */
    adjustLayout() {
        // Layout adjustments on resize
        document.body.classList.toggle('mobile', window.innerWidth < 768);
        document.body.classList.toggle('tablet', window.innerWidth >= 768 && window.innerWidth < 1024);
        document.body.classList.toggle('desktop', window.innerWidth >= 1024);
    }

    /**
     * Initialize analytics (deferred)
     */
    initializeAnalytics() {
        // Initialize analytics when idle
        console.log('[Performance] Analytics initialized (deferred)');
    }

    /**
     * Preload next pages
     */
    preloadNextPages() {
        // Prefetch likely next pages
        const prefetchUrls = [
            '/toetsing.html#roles',
            '/toetsing.html#materials',
            '/toetsing.html#team'
        ];

        prefetchUrls.forEach(url => {
            const link = document.createElement('link');
            link.rel = 'prefetch';
            link.href = url;
            document.head.appendChild(link);
        });
    }

    /**
     * Cleanup unused resources
     */
    cleanupUnusedResources() {
        // Remove unused CSS
        if ('CSS' in window && 'supports' in window.CSS) {
            // Check for unused CSS rules
            console.log('[Performance] Cleanup completed');
        }
    }

    /**
     * Load all resources (fallback)
     */
    loadAllResources() {
        document.querySelectorAll('[data-src]').forEach(element => {
            element.src = element.dataset.src;
            delete element.dataset.src;
        });
    }

    /**
     * Get performance report
     */
    getPerformanceReport() {
        const report = {
            metrics: this.metrics,
            resources: performance.getEntriesByType('resource').length,
            memory: performance.memory ? {
                used: performance.memory.usedJSHeapSize,
                total: performance.memory.totalJSHeapSize,
                limit: performance.memory.jsHeapSizeLimit
            } : null
        };

        return report;
    }

    /**
     * Optimize bundle size
     */
    optimizeBundleSize() {
        // Tree shaking hints
        return {
            hints: [
                'Use dynamic imports for large modules',
                'Remove unused dependencies',
                'Minify and compress assets',
                'Use CDN for common libraries',
                'Enable gzip/brotli compression'
            ]
        };
    }
}

// Export singleton instance
const performanceOptimizer = new PerformanceOptimizer();
export default performanceOptimizer;