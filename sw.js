/**
 * Service Worker for De Strategische Arena
 * Enables offline functionality and caching
 */

const CACHE_NAME = 'strategische-arena-v9';
const RUNTIME_CACHE = 'runtime-cache-v9';

// Assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/toetsing.html',
    '/css/design-system.css',
    '/css/components.css',
    '/css/mobile.css',
    '/js/core/app.js',
    '/js/core/state-manager.js',
    '/js/core/router.js',
    '/js/components/role-selection.js',
    '/js/components/timer.js',
    '/js/components/preparation-materials.js',
    '/js/components/progress-tracker.js',
    '/js/components/qa-simulator.js',
    '/js/components/team-coordination.js',
    '/js/components/mobile-navigation.js',
    '/js/services/pdf-generator.js',
    '/data/questions.json',
    '/manifest.json'
];

// External CDN resources to cache
const CDN_ASSETS = [
    // Tailwind CDN removed - causes CORS issues in some environments
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2'
];

/**
 * Install Event - Cache static assets
 */
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install event');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(async (cache) => {
                console.log('[ServiceWorker] Caching static assets');

                // Cache resources individually to handle failures gracefully
                const resourcesToCache = STATIC_ASSETS.concat(CDN_ASSETS);
                const cachePromises = resourcesToCache.map(async (url) => {
                    try {
                        // Skip manifest.json in GitHub Codespaces environment
                        if (url.includes('manifest.json') && self.location.hostname.includes('github.dev')) {
                            console.log('[ServiceWorker] Skipping manifest.json in dev environment');
                            return;
                        }

                        const response = await fetch(url);
                        if (response.ok) {
                            await cache.put(url, response);
                            console.log('[ServiceWorker] Cached:', url);
                        } else {
                            console.warn(`[ServiceWorker] Failed to cache ${url}: Status ${response.status}`);
                        }
                    } catch (error) {
                        console.warn(`[ServiceWorker] Failed to cache ${url}:`, error.message);
                    }
                });

                // Wait for all cache attempts to complete (success or failure)
                await Promise.allSettled(cachePromises);
            })
            .then(() => self.skipWaiting())
            .catch((error) => {
                console.error('[ServiceWorker] Installation error:', error);
            })
    );
});

/**
 * Activate Event - Clean old caches
 */
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate event');
    
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                        console.log('[ServiceWorker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

/**
 * Fetch Event - Serve from cache when offline
 */
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Skip chrome-extension and other non-http(s) protocols
    if (!url.protocol.startsWith('http')) {
        return;
    }

    // Network First strategy for API calls
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Clone the response before caching
                    const responseToCache = response.clone();
                    caches.open(RUNTIME_CACHE).then((cache) => {
                        cache.put(request, responseToCache);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(request);
                })
        );
        return;
    }

    // Cache First strategy for static assets
    event.respondWith(
        caches.match(request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(request).then((response) => {
                // Don't cache non-successful responses
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }

                // Clone the response
                const responseToCache = response.clone();

                caches.open(RUNTIME_CACHE).then((cache) => {
                    cache.put(request, responseToCache);
                });

                return response;
            });
        }).catch((error) => {
            console.log('[ServiceWorker] Fetch failed for:', request.url, error.message);

            // Offline fallback page for documents
            if (request.destination === 'document') {
                return caches.match('/toetsing.html');
            }

            // For manifest.json, return a minimal valid manifest
            if (request.url.includes('manifest.json')) {
                return new Response(
                    JSON.stringify({
                        name: 'De Strategische Arena',
                        short_name: 'Arena',
                        start_url: '/',
                        display: 'standalone',
                        theme_color: '#3b82f6',
                        background_color: '#f3f4f6'
                    }),
                    {
                        status: 200,
                        statusText: 'OK',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }
                );
            }

            // Return empty 404 response for other failed resources
            return new Response('', {
                status: 404,
                statusText: 'Not Found'
            });
        })
    );
});

/**
 * Background Sync - Queue actions when offline
 */
self.addEventListener('sync', (event) => {
    console.log('[ServiceWorker] Background sync event');
    
    if (event.tag === 'sync-progress') {
        event.waitUntil(syncProgress());
    }
});

/**
 * Push Notifications (if needed in future)
 */
self.addEventListener('push', (event) => {
    console.log('[ServiceWorker] Push event');
    
    const options = {
        body: event.data ? event.data.text() : 'Nieuwe update beschikbaar',
        icon: '/images/icon-192.png',
        badge: '/images/badge-72.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Open De Strategische Arena'
            },
            {
                action: 'close',
                title: 'Sluiten'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('De Strategische Arena', options)
    );
});

/**
 * Notification Click Handler
 */
self.addEventListener('notificationclick', (event) => {
    console.log('[ServiceWorker] Notification click');
    
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

/**
 * Message Handler for cache updates
 */
self.addEventListener('message', (event) => {
    if (event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(RUNTIME_CACHE).then((cache) => {
                return cache.addAll(event.data.urls);
            })
        );
    }
});

/**
 * Sync progress data when back online
 */
async function syncProgress() {
    try {
        // Get all clients
        const allClients = await clients.matchAll();
        
        for (const client of allClients) {
            // Send message to sync
            client.postMessage({
                type: 'SYNC_REQUIRED',
                timestamp: Date.now()
            });
        }
        
        return Promise.resolve();
    } catch (error) {
        console.error('[ServiceWorker] Sync failed:', error);
        return Promise.reject(error);
    }
}

/**
 * Cache versioning and cleanup
 */
function cleanupOldCaches() {
    const cacheWhitelist = [CACHE_NAME, RUNTIME_CACHE];
    
    return caches.keys().then((cacheNames) => {
        return Promise.all(
            cacheNames.map((cacheName) => {
                if (!cacheWhitelist.includes(cacheName)) {
                    console.log('[ServiceWorker] Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                }
            })
        );
    });
}

/**
 * Periodic cache cleanup (every 7 days)
 */
setInterval(() => {
    cleanupOldCaches();
}, 7 * 24 * 60 * 60 * 1000);