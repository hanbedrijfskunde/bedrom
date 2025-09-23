/**
 * Settings Component
 * Manages application settings and reset functionality
 */

import stateManager from '../core/state-manager.js';

class Settings {
    constructor() {
        this.isOpen = false;
        this.initialized = false;
    }

    /**
     * Initialize settings
     */
    init() {
        if (this.initialized) {
            console.log('[Settings] Already initialized');
            return;
        }

        // Add settings button to page if not exists
        this.createSettingsButton();

        // Create settings modal
        this.createSettingsModal();

        this.initialized = true;
        console.log('[Settings] Initialized');
    }

    /**
     * Create settings button
     */
    createSettingsButton() {
        // Check if button already exists
        let button = document.getElementById('settings-button');

        if (button) {
            // Button exists, just attach the event listener
            button.addEventListener('click', () => this.toggleSettings());
            return;
        }

        // Create new button if it doesn't exist
        button = document.createElement('button');
        button.id = 'settings-button';
        button.className = 'fixed bottom-6 left-6 z-40 bg-gray-600 hover:bg-gray-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110';
        button.setAttribute('aria-label', 'Instellingen');
        button.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
        `;

        button.addEventListener('click', () => this.toggleSettings());

        document.body.appendChild(button);
    }

    /**
     * Create settings modal
     */
    createSettingsModal() {
        // Check if modal already exists
        if (document.getElementById('settings-modal')) return;

        const modal = document.createElement('div');
        modal.id = 'settings-modal';
        modal.className = 'hidden fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4';
        modal.innerHTML = `
            <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div class="p-6 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <h2 class="text-2xl font-bold text-gray-900">Instellingen</h2>
                        <button id="close-settings" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <div class="p-6 space-y-6">
                    <!-- Progress Section -->
                    <div class="bg-gray-50 rounded-lg p-4">
                        <h3 class="text-lg font-semibold mb-3">Voortgang</h3>
                        <div id="progress-summary" class="text-sm text-gray-600 mb-3">
                            ${this.getProgressSummary()}
                        </div>
                    </div>
                    
                    <!-- Data Management Section -->
                    <div class="space-y-4">
                        <h3 class="text-lg font-semibold">Gegevensbeheer</h3>
                        
                        <!-- Export Progress Button -->
                        <button id="export-progress" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
                            </svg>
                            <span>Export Voortgang (JSON)</span>
                        </button>
                        
                        <!-- Import Progress Button -->
                        <div class="relative">
                            <input type="file" id="import-file" accept=".json" class="hidden">
                            <button id="import-progress" class="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                </svg>
                                <span>Import Voortgang (JSON)</span>
                            </button>
                        </div>
                        
                        <!-- Reset Button -->
                        <div class="pt-4 border-t border-gray-200">
                            <button id="reset-memory" class="btn btn-danger w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                </svg>
                                <span>Reset Alle Gegevens</span>
                            </button>
                            <p class="text-xs text-red-600 mt-2 text-center">
                                ⚠️ Waarschuwing: Dit verwijdert alle voortgang permanent
                            </p>
                        </div>
                    </div>
                    
                    <!-- Info Section -->
                    <div class="bg-blue-50 rounded-lg p-4 text-sm">
                        <h3 class="font-semibold text-blue-900 mb-2">Informatie</h3>
                        <ul class="space-y-1 text-blue-700">
                            <li>• Je gegevens worden lokaal opgeslagen</li>
                            <li>• Geen data wordt naar een server gestuurd</li>
                            <li>• Export je voortgang voor backup</li>
                            <li>• Import om voortgang te herstellen</li>
                        </ul>
                    </div>
                </div>
                
                <div class="p-6 border-t border-gray-200 bg-gray-50">
                    <button id="close-settings-bottom" class="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                        Sluiten
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        this.attachModalListeners();
    }

    /**
     * Attach modal event listeners
     */
    attachModalListeners() {
        // Close buttons
        document.getElementById('close-settings')?.addEventListener('click', () => this.closeSettings());
        document.getElementById('close-settings-bottom')?.addEventListener('click', () => this.closeSettings());
        
        // Close on backdrop click
        document.getElementById('settings-modal')?.addEventListener('click', (e) => {
            if (e.target.id === 'settings-modal') {
                this.closeSettings();
            }
        });
        
        // Reset button
        document.getElementById('reset-memory')?.addEventListener('click', () => this.handleReset());
        
        // Export button
        document.getElementById('export-progress')?.addEventListener('click', () => this.exportProgress());
        
        // Import button
        document.getElementById('import-progress')?.addEventListener('click', () => {
            document.getElementById('import-file')?.click();
        });
        
        // Import file change
        document.getElementById('import-file')?.addEventListener('change', (e) => this.importProgress(e));
        
        // Escape key to close
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSettings();
            }
        });
    }

    /**
     * Toggle settings modal
     */
    toggleSettings() {
        if (this.isOpen) {
            this.closeSettings();
        } else {
            this.openSettings();
        }
    }

    /**
     * Open settings modal
     */
    openSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.classList.remove('hidden');
            this.isOpen = true;
            
            // Update progress summary
            const summaryElement = document.getElementById('progress-summary');
            if (summaryElement) {
                summaryElement.innerHTML = this.getProgressSummary();
            }
            
            // Focus trap
            const firstButton = modal.querySelector('button');
            if (firstButton) firstButton.focus();
        }
    }

    /**
     * Close settings modal
     */
    closeSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.classList.add('hidden');
            this.isOpen = false;
            
            // Return focus to settings button
            document.getElementById('settings-button')?.focus();
        }
    }

    /**
     * Handle reset
     */
    handleReset() {
        const progress = this.calculateProgress();
        
        // Extra warning if progress is high
        if (progress.percentage > 80) {
            const extraConfirm = confirm(
                `Je hebt ${progress.percentage}% voortgang! Weet je ZEKER dat je alles wilt resetten?`
            );
            if (!extraConfirm) return;
        }
        
        // Show detailed confirmation
        const message = `
⚠️ WAARSCHUWING: Reset Geheugen

Dit zal het volgende permanent verwijderen:
• Je geselecteerde rol
• Alle voortgang (${progress.percentage}% voltooid)
• Team informatie
• Notities en antwoorden
• Q&A simulator resultaten

Weet je zeker dat je door wilt gaan?`;
        
        if (confirm(message)) {
            // Offer to export first
            if (progress.percentage > 0) {
                if (confirm('Wil je eerst een backup maken van je voortgang?')) {
                    this.exportProgress();
                    setTimeout(() => {
                        this.performReset();
                    }, 1000);
                    return;
                }
            }
            
            this.performReset();
        }
    }

    /**
     * Perform the actual reset
     */
    performReset() {
        // Clear all localStorage
        localStorage.clear();

        // Reset state manager
        stateManager.state = stateManager.getDefaultState();
        
        // Show success message
        this.showNotification('Alle gegevens zijn gereset', 'success');
        
        // Close settings
        this.closeSettings();
        
        // Reload page after short delay
        setTimeout(() => {
            window.location.hash = '#home';
            window.location.reload();
        }, 1500);
    }

    /**
     * Export progress to JSON
     */
    exportProgress() {
        const state = stateManager.state;
        const exportData = {
            version: '1.0',
            timestamp: new Date().toISOString(),
            data: state
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `strategische-arena-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        this.showNotification('Voortgang geëxporteerd', 'success');
    }

    /**
     * Import progress from JSON
     */
    importProgress(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                // Validate import data
                if (!importData.data || !importData.version) {
                    throw new Error('Ongeldig backup bestand');
                }
                
                // Confirm import
                if (confirm('Dit zal je huidige voortgang overschrijven. Doorgaan?')) {
                    // Import the state
                    stateManager.state = importData.data;
                    stateManager.saveState();
                    
                    this.showNotification('Voortgang geïmporteerd', 'success');
                    
                    // Reload page
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                }
            } catch (error) {
                console.error('Import failed:', error);
                this.showNotification('Import mislukt: ' + error.message, 'error');
            }
        };
        
        reader.readAsText(file);
        
        // Reset file input
        event.target.value = '';
    }

    /**
     * Get progress summary
     */
    getProgressSummary() {
        const progress = this.calculateProgress();
        const state = stateManager.state;
        
        return `
            <div class="space-y-2">
                <div class="flex justify-between">
                    <span>Algemene voortgang:</span>
                    <span class="font-semibold">${progress.percentage}%</span>
                </div>
                <div class="flex justify-between">
                    <span>Modules voltooid:</span>
                    <span class="font-semibold">${progress.completed}/${progress.total}</span>
                </div>
                <div class="flex justify-between">
                    <span>Geselecteerde rol:</span>
                    <span class="font-semibold">${state.user?.role || 'Geen'}</span>
                </div>
                <div class="flex justify-between">
                    <span>Team:</span>
                    <span class="font-semibold">${state.team?.name || 'Geen'}</span>
                </div>
            </div>
        `;
    }

    /**
     * Calculate progress
     */
    calculateProgress() {
        const modules = stateManager.state.progress?.modules || {};
        const total = Object.keys(modules).length || 1;
        const completed = Object.values(modules).filter(Boolean).length;
        const percentage = Math.round((completed / total) * 100);
        
        return { total, completed, percentage };
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' :
                       type === 'error' ? 'bg-red-500' :
                       type === 'warning' ? 'bg-yellow-500' :
                       'bg-blue-500';
        
        notification.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-[100] animate-fade-in`;
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                ${this.getNotificationIcon(type)}
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Get notification icon
     */
    getNotificationIcon(type) {
        switch (type) {
            case 'success':
                return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            case 'error':
                return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
            case 'warning':
                return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>';
            default:
                return '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';
        }
    }
}

// Export singleton instance
const settings = new Settings();
export default settings;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => settings.init());
} else {
    settings.init();
}