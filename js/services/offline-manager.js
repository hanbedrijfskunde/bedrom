/**
 * Offline Manager Service
 * Handles service worker registration and offline functionality
 */

export class OfflineManager {
    constructor() {
        this.isOnline = navigator.onLine;
        this.registration = null;
        this.updateAvailable = false;
        this.init();
    }

    /**
     * Initialize offline functionality
     */
    async init() {
        if ('serviceWorker' in navigator) {
            try {
                // Register service worker
                this.registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/'
                });
                
                console.log('[OfflineManager] Service Worker registered:', this.registration);
                
                // Check for updates
                this.checkForUpdates();
                
                // Setup event listeners
                this.setupEventListeners();
                
                // Setup offline detection
                this.setupOfflineDetection();
                
            } catch (error) {
                console.error('[OfflineManager] Service Worker registration failed:', error);
            }
        } else {
            console.log('[OfflineManager] Service Workers not supported');
        }
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Listen for service worker updates
        if (this.registration) {
            this.registration.addEventListener('updatefound', () => {
                const newWorker = this.registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.updateAvailable = true;
                        this.showUpdateNotification();
                    }
                });
            });
        }

        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            this.handleServiceWorkerMessage(event.data);
        });

        // Listen for controller change
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
        });
    }

    /**
     * Setup offline/online detection
     */
    setupOfflineDetection() {
        // Online event
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.handleOnline();
        });

        // Offline event
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.handleOffline();
        });

        // Initial status
        if (!navigator.onLine) {
            this.handleOffline();
        }
    }

    /**
     * Handle online status
     */
    handleOnline() {
        console.log('[OfflineManager] Back online');
        
        // Remove offline indicator
        this.removeOfflineIndicator();
        
        // Show online notification
        this.showNotification('Verbinding hersteld', 'success');
        
        // Sync any queued data
        this.syncQueuedData();
        
        // Trigger background sync
        if (this.registration && this.registration.sync) {
            this.registration.sync.register('sync-progress');
        }
    }

    /**
     * Handle offline status
     */
    handleOffline() {
        console.log('[OfflineManager] Gone offline');
        
        // Show offline indicator
        this.showOfflineIndicator();
        
        // Show offline notification
        this.showNotification('Je werkt nu offline', 'warning');
    }

    /**
     * Show offline indicator
     */
    showOfflineIndicator() {
        // Remove existing indicator
        this.removeOfflineIndicator();
        
        const indicator = document.createElement('div');
        indicator.id = 'offline-indicator';
        indicator.className = 'fixed top-0 left-0 right-0 bg-yellow-500 text-white text-center py-2 z-50 animate-fade-in';
        indicator.innerHTML = `
            <div class="flex items-center justify-center space-x-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"></path>
                </svg>
                <span class="text-sm font-medium">Offline modus - Wijzigingen worden lokaal opgeslagen</span>
            </div>
        `;
        document.body.appendChild(indicator);
    }

    /**
     * Remove offline indicator
     */
    removeOfflineIndicator() {
        const indicator = document.getElementById('offline-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    /**
     * Show update notification
     */
    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed bottom-4 right-4 bg-blue-500 text-white rounded-lg shadow-lg p-4 z-50 animate-fade-in max-w-sm';
        notification.innerHTML = `
            <h3 class="font-semibold mb-2">Update beschikbaar</h3>
            <p class="text-sm mb-3">Een nieuwe versie van de applicatie is beschikbaar.</p>
            <div class="flex space-x-2">
                <button id="update-btn" class="bg-white text-blue-500 px-3 py-1 rounded text-sm font-medium hover:bg-blue-50">
                    Update nu
                </button>
                <button id="dismiss-btn" class="text-white hover:text-blue-100 px-3 py-1 text-sm">
                    Later
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Handle update button
        document.getElementById('update-btn').addEventListener('click', () => {
            this.applyUpdate();
        });
        
        // Handle dismiss button
        document.getElementById('dismiss-btn').addEventListener('click', () => {
            notification.remove();
        });
    }

    /**
     * Apply service worker update
     */
    applyUpdate() {
        if (this.registration && this.registration.waiting) {
            // Tell service worker to skip waiting
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
    }

    /**
     * Check for service worker updates
     */
    async checkForUpdates() {
        if (this.registration) {
            try {
                await this.registration.update();
            } catch (error) {
                console.error('[OfflineManager] Update check failed:', error);
            }
        }
    }

    /**
     * Handle messages from service worker
     */
    handleServiceWorkerMessage(data) {
        switch (data.type) {
            case 'SYNC_REQUIRED':
                this.syncQueuedData();
                break;
            case 'CACHE_UPDATED':
                console.log('[OfflineManager] Cache updated');
                break;
            default:
                console.log('[OfflineManager] Unknown message:', data);
        }
    }

    /**
     * Sync queued data when online
     */
    async syncQueuedData() {
        // Get queued data from localStorage
        const queuedData = this.getQueuedData();
        
        if (!queuedData || queuedData.length === 0) {
            return;
        }
        
        console.log('[OfflineManager] Syncing queued data:', queuedData.length, 'items');
        
        // Process each queued item
        for (const item of queuedData) {
            try {
                // Send to server (when API is available)
                // await this.sendToServer(item);
                
                // For now, just log
                console.log('[OfflineManager] Would sync:', item);
            } catch (error) {
                console.error('[OfflineManager] Sync failed for item:', error);
            }
        }
        
        // Clear queue after successful sync
        this.clearQueuedData();
    }

    /**
     * Get queued data from localStorage
     */
    getQueuedData() {
        const data = localStorage.getItem('offline_queue');
        return data ? JSON.parse(data) : [];
    }

    /**
     * Add data to offline queue
     */
    queueData(data) {
        const queue = this.getQueuedData();
        queue.push({
            ...data,
            timestamp: Date.now()
        });
        localStorage.setItem('offline_queue', JSON.stringify(queue));
    }

    /**
     * Clear queued data
     */
    clearQueuedData() {
        localStorage.removeItem('offline_queue');
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' :
                       type === 'warning' ? 'bg-yellow-500' :
                       type === 'error' ? 'bg-red-500' :
                       'bg-blue-500';
        
        notification.className = `fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                ${this.getNotificationIcon(type)}
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.classList.add('animate-fade-out');
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    /**
     * Get notification icon
     */
    getNotificationIcon(type) {
        switch (type) {
            case 'success':
                return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            case 'warning':
                return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
            case 'error':
                return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
            default:
                return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        }
    }

    /**
     * Precache important resources
     */
    async precacheResources(urls) {
        if (this.registration && this.registration.active) {
            this.registration.active.postMessage({
                type: 'CACHE_URLS',
                urls: urls
            });
        }
    }

    /**
     * Get cache statistics
     */
    async getCacheStats() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            const percentUsed = (estimate.usage / estimate.quota * 100).toFixed(2);
            
            return {
                usage: estimate.usage,
                quota: estimate.quota,
                percentUsed: percentUsed
            };
        }
        return null;
    }
}

// Export singleton instance
const offlineManager = new OfflineManager();
export default offlineManager;