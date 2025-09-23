/**
 * State Manager - Centralized state management for De Strategische Arena
 * Handles all application state with LocalStorage persistence
 */

class StateManager {
    constructor() {
        this.storageKey = 'strategische_arena_state';
        this.listeners = new Map();
        this.state = this.loadState();

        // Auto-save state changes to LocalStorage
        this.saveDebounceTimer = null;

        // Listen for storage events (cross-tab synchronization)
        window.addEventListener('storage', this.handleStorageChange.bind(this));
    }

    /**
     * Default state structure
     */
    getDefaultState() {
        return {
            user: {
                name: '',
                studentNumber: '',
                email: '',
                team: '',
                role: null // 'rvb', 'rvc', 'invest', 'toezicht', 'observer'
            },
            progress: {
                overall: 0,
                modules: {
                    roleSelection: false,
                    caseAnalysis: false,
                    preparationMaterials: false,
                    teamCoordination: false,
                    practiceSession: false,
                    qaSimulator: false,
                    finalChecklist: false
                },
                lastActivity: null
            },
            timer: {
                totalTime: 2400, // 40 minutes in seconds
                remainingTime: 2400,
                currentPhase: 0,
                isPaused: true,
                phases: [
                    { name: 'Introductie', duration: 120 },
                    { name: 'Presentatie RvB', duration: 480 },
                    { name: 'Q&A Sessie', duration: 600 },
                    { name: 'Discussie', duration: 480 },
                    { name: 'Stemming', duration: 300 },
                    { name: 'Reflectie', duration: 300 },
                    { name: 'Afsluiting', duration: 120 }
                ]
            },
            team: {
                members: [],
                inviteCode: null,
                messages: []
            },
            practice: {
                questionsAnswered: 0,
                correctAnswers: 0,
                sessionHistory: []
            },
            settings: {
                theme: 'light',
                language: 'nl',
                notifications: true,
                autoSave: true
            }
        };
    }

    /**
     * Load state from LocalStorage or return default
     */
    loadState() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                // Merge with default to ensure all properties exist
                return this.mergeDeep(this.getDefaultState(), parsed);
            }
        } catch (error) {
            console.error('Error loading state:', error);
        }
        return this.getDefaultState();
    }

    /**
     * Save state to LocalStorage
     */
    saveState() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.state));
            this.emit('state:saved', this.state);
        } catch (error) {
            console.error('Error saving state:', error);
            this.emit('state:save-error', error);
        }
    }

    /**
     * Debounced save to prevent excessive writes
     */
    debouncedSave() {
        clearTimeout(this.saveDebounceTimer);
        this.saveDebounceTimer = setTimeout(() => {
            this.saveState();
        }, 500);
    }

    /**
     * Get a value from state using dot notation
     * @param {string} path - Path like 'user.role' or 'progress.overall'
     */
    get(path) {
        if (!path) return this.state;

        return path.split('.').reduce((current, key) => {
            return current?.[key];
        }, this.state);
    }

    /**
     * Set a value in state using dot notation
     * @param {string} path - Path like 'user.role'
     * @param {any} value - Value to set
     */
    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();

        // Navigate to the parent object
        let current = this.state;
        for (const key of keys) {
            if (!current[key] || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }

        // Set the value
        const oldValue = current[lastKey];
        current[lastKey] = value;

        // Update timestamp
        this.state.progress.lastActivity = new Date().toISOString();

        // Emit change event
        this.emit('state:changed', {
            path,
            oldValue,
            newValue: value
        });

        // Auto-save if enabled
        if (this.state.settings.autoSave) {
            this.debouncedSave();
        }
    }

    /**
     * Update multiple values at once
     * @param {Object} updates - Object with paths as keys and values
     */
    update(updates) {
        for (const [path, value] of Object.entries(updates)) {
            this.set(path, value);
        }
    }

    /**
     * Reset state to default
     */
    reset() {
        const confirmReset = confirm('Weet je zeker dat je alle voortgang wilt resetten?');
        if (confirmReset) {
            this.state = this.getDefaultState();
            this.saveState();
            this.emit('state:reset', this.state);
        }
    }

    /**
     * Reset specific module
     */
    resetModule(moduleName) {
        const defaultState = this.getDefaultState();
        if (defaultState[moduleName]) {
            this.state[moduleName] = defaultState[moduleName];
            this.saveState();
            this.emit('state:module-reset', moduleName);
        }
    }

    /**
     * Subscribe to state changes
     * @param {string} event - Event name or path to watch
     * @param {Function} callback - Function to call on change
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
                    console.error(`Error in listener for ${event}:`, error);
                }
            });
        }

        // Also emit wildcard for debugging
        const wildcardCallbacks = this.listeners.get('*');
        if (wildcardCallbacks) {
            wildcardCallbacks.forEach(callback => {
                callback({ event, data });
            });
        }
    }

    /**
     * Handle storage changes from other tabs
     */
    handleStorageChange(event) {
        if (event.key === this.storageKey && event.newValue) {
            try {
                const newState = JSON.parse(event.newValue);
                this.state = this.mergeDeep(this.getDefaultState(), newState);
                this.emit('state:external-update', this.state);
            } catch (error) {
                console.error('Error syncing state from storage:', error);
            }
        }
    }

    /**
     * Export state as JSON
     */
    exportState() {
        const dataStr = JSON.stringify(this.state, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        const exportFileDefaultName = `strategische-arena-${Date.now()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    /**
     * Import state from JSON
     */
    importState(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    this.state = this.mergeDeep(this.getDefaultState(), imported);
                    this.saveState();
                    this.emit('state:imported', this.state);
                    resolve(this.state);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    }

    /**
     * Reset state to initial values
     */
    reset() {
        // Show confirmation dialog
        if (!confirm('Weet je zeker dat je alle voortgang wilt resetten? Dit kan niet ongedaan worden gemaakt.')) {
            return false;
        }

        // Clear localStorage
        localStorage.removeItem(this.storageKey);

        // Reset to initial state
        this.state = this.getInitialState();

        // Notify all listeners
        this.emit('state:reset');

        // Reload the page to ensure clean state
        window.location.reload();

        return true;
    }

    /**
     * Deep merge utility
     */
    mergeDeep(target, source) {
        const output = Object.assign({}, target);
        if (this.isObject(target) && this.isObject(source)) {
            Object.keys(source).forEach(key => {
                if (this.isObject(source[key])) {
                    if (!(key in target)) {
                        Object.assign(output, { [key]: source[key] });
                    } else {
                        output[key] = this.mergeDeep(target[key], source[key]);
                    }
                } else {
                    Object.assign(output, { [key]: source[key] });
                }
            });
        }
        return output;
    }

    /**
     * Check if value is object
     */
    isObject(item) {
        return item && typeof item === 'object' && !Array.isArray(item);
    }

    /**
     * Calculate overall progress (pure function - does not modify state)
     */
    calculateProgress() {
        const modules = this.state.progress.modules;
        const completed = Object.values(modules).filter(Boolean).length;
        const total = Object.keys(modules).length;
        const percentage = Math.round((completed / total) * 100);

        // Don't set state here - just return the value
        // The caller can decide whether to update state
        return percentage;
    }

    /**
     * Update progress in state
     */
    updateProgress() {
        const percentage = this.calculateProgress();
        // Only update if the value has changed
        if (this.state.progress.overall !== percentage) {
            this.set('progress.overall', percentage);
        }
        return percentage;
    }

    /**
     * Debug method to log current state
     */
    debug() {
        console.group('🔍 State Manager Debug');
        console.log('Current State:', this.state);
        console.log('Listeners:', Array.from(this.listeners.keys()));
        console.log('Storage Key:', this.storageKey);
        console.groupEnd();
    }
}

// Create singleton instance
const stateManager = new StateManager();

// Export for use in other modules
export default stateManager;

// Also expose globally for debugging
if (typeof window !== 'undefined') {
    window.stateManager = stateManager;
}