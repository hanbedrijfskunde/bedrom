/**
 * Timer Component - 40-minute assessment timer with 7 phases
 */

import stateManager from '../core/state-manager.js';

class Timer {
    constructor() {
        this.phases = [
            { name: 'Introductie', duration: 120, color: 'blue' },
            { name: 'Presentatie RvB', duration: 480, color: 'green' },
            { name: 'Q&A Sessie', duration: 600, color: 'yellow' },
            { name: 'Discussie', duration: 480, color: 'orange' },
            { name: 'Stemming', duration: 300, color: 'purple' },
            { name: 'Reflectie', duration: 300, color: 'indigo' },
            { name: 'Afsluiting', duration: 120, color: 'gray' }
        ];

        this.totalTime = 2400; // 40 minutes in seconds
        this.remainingTime = 2400;
        this.currentPhase = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.interval = null;

        // Audio for phase transitions
        this.audio = {
            phaseChange: new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBS6Fy'),
            complete: new Audio('data:audio/wav;base64,UklGRqAGAABXQVZFZm10IBAAAAABAAEAQfgAAEH4AAABAA gAZGF0YfoFAABFS0tLRUtLS0VLS0tLRUVLUktLRUtLRUtLS0VLS0tLRUtLS0VLS0tFS0tLRUtLRUtLS0VLS0tLUktLRUtLS0VLS0tFS0tLRUtLS0VLS0tFUktLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFRUtLS0VLS0tFS0tLRUtLS0VLS0tFRUtLS0VLS0tFS0tLRUtLS0VLS0tFRUtLS0VLS0VLS0tFS0tLRUtLRUtLS0VLS0tLRUtLS0VLS0tFRUtLS0VLUktFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFRUtFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLRUtLRUtLS0VLS0tFS0tLRUtLS0VLS0tFRUtLS0VLS0tFS0tLRUtLS0VLS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtFS0tLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0VLS0tFS0tLRUtLRUtLS0VFS0tLS0VLS0tFS0tLRUtLS0VLS0tLRUtLS0VLS0tFS0tLRUtLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VFS0tLRUtLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLRUtLS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tFS0tLRUtLS0VLS0tFS0tLRUtLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLUktLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tFS0tLRUtLS0VLS0tFS0tLRUtFS0tLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VFS0tLRUtLRUtLS0VLS0tFS0tLRUtLS0VLS0tFRUtLS0VLUktLS0VLS0tFS0tLRUtFS0tLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtFS0tLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0tLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLRUtLS0VLS0tFS0tLRUtLS0VLS0tFS0tLRUtLS0VLSw==')
        };

        this.init();
    }

    /**
     * Initialize the component
     */
    init() {
        // Load saved timer state
        const savedTimer = stateManager.get('timer');
        if (savedTimer) {
            this.remainingTime = savedTimer.remainingTime;
            this.currentPhase = savedTimer.currentPhase;
            this.isPaused = savedTimer.isPaused;
        }
    }

    /**
     * Render the timer component
     */
    render() {
        const currentPhaseName = this.phases[this.currentPhase].name;
        const phaseProgress = this.getPhaseProgress();

        return `
            <div class="timer-container">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Assessment Timer</h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        Oefen met de tijdsindeling van het assessment.
                        De timer simuleert de exacte 40 minuten en 7 fases van de echte sessie.
                    </p>
                </div>

                <!-- Main Timer Display -->
                <div class="bg-white rounded-lg shadow-xl p-8 mb-6">
                    <div class="text-center mb-8">
                        <div class="text-6xl font-bold text-gray-900 mb-2" id="timer-display">
                            ${this.formatTime(this.remainingTime)}
                        </div>
                        <div class="text-lg text-gray-600">
                            Totale tijd resterend
                        </div>
                    </div>

                    <!-- Current Phase -->
                    <div class="mb-6">
                        <div class="flex justify-between items-center mb-2">
                            <span class="text-sm font-medium text-gray-700">
                                Fase ${this.currentPhase + 1} van ${this.phases.length}
                            </span>
                            <span class="text-sm font-medium text-gray-700">
                                ${currentPhaseName}
                            </span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar bg-${this.phases[this.currentPhase].color}-500"
                                 style="width: ${phaseProgress}%"></div>
                        </div>
                        <div class="mt-2 text-sm text-gray-600 text-center">
                            ${this.formatTime(this.getPhaseRemainingTime())} resterend in deze fase
                        </div>
                    </div>

                    <!-- Control Buttons -->
                    <div class="flex justify-center gap-4 mb-6">
                        ${!this.isRunning ? `
                            <button class="btn btn-primary btn-lg" onclick="timer.start()">
                                <span class="mr-2">▶</span> Start Timer
                            </button>
                        ` : `
                            <button class="btn btn-secondary btn-lg" onclick="timer.pause()">
                                <span class="mr-2">${this.isPaused ? '▶' : '⏸'}</span>
                                ${this.isPaused ? 'Hervat' : 'Pauzeer'}
                            </button>
                            <button class="btn btn-ghost btn-lg" onclick="timer.stop()">
                                <span class="mr-2">⏹</span> Stop
                            </button>
                        `}
                        <button class="btn btn-ghost" onclick="timer.reset()">
                            <span class="mr-2">↻</span> Reset
                        </button>
                    </div>

                    <!-- Quick Actions -->
                    <div class="flex justify-center gap-2">
                        <button class="text-sm text-primary-600 hover:underline"
                                onclick="timer.skipPhase()">
                            Volgende fase →
                        </button>
                        <span class="text-gray-400">|</span>
                        <button class="text-sm text-primary-600 hover:underline"
                                onclick="timer.addMinute()">
                            +1 minuut
                        </button>
                        <span class="text-gray-400">|</span>
                        <button class="text-sm text-primary-600 hover:underline"
                                onclick="timer.subtractMinute()">
                            -1 minuut
                        </button>
                    </div>
                </div>

                <!-- Phase Overview -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Fase Overzicht</h3>
                    <div class="space-y-3">
                        ${this.phases.map((phase, index) => this.renderPhaseItem(phase, index)).join('')}
                    </div>
                </div>

                <!-- Timer Tips -->
                <div class="bg-blue-50 rounded-lg p-6 mt-6">
                    <h3 class="text-lg font-semibold text-blue-900 mb-3">Timer Tips</h3>
                    <ul class="space-y-2 text-sm text-blue-800">
                        <li class="flex items-start">
                            <span class="text-blue-600 mr-2 mt-0.5">💡</span>
                            <span>Oefen meerdere keren om vertrouwd te raken met de tijdsindeling</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 mr-2 mt-0.5">💡</span>
                            <span>Let op de overgang tussen fases - bereid je voor op de volgende fase</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 mr-2 mt-0.5">💡</span>
                            <span>Gebruik de pauze functie om aantekeningen te maken</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 mr-2 mt-0.5">💡</span>
                            <span>De Q&A sessie (fase 3) is de langste - besteed hier extra aandacht aan</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }

    /**
     * Render phase item
     */
    renderPhaseItem(phase, index) {
        const isActive = index === this.currentPhase;
        const isPassed = index < this.currentPhase;
        const duration = this.formatDuration(phase.duration);

        return `
            <div class="flex items-center justify-between p-3 rounded-lg
                        ${isActive ? 'bg-primary-50 border-2 border-primary-500' : ''}
                        ${isPassed ? 'opacity-50' : ''}">
                <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full flex items-center justify-center mr-3
                                ${isActive ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}">
                        ${isPassed ? '✓' : index + 1}
                    </div>
                    <div>
                        <h4 class="font-medium text-gray-900">${phase.name}</h4>
                        <span class="text-sm text-gray-600">${duration}</span>
                    </div>
                </div>
                ${isActive ? `
                    <span class="badge badge-primary">Actief</span>
                ` : isPassed ? `
                    <span class="text-green-600">✓</span>
                ` : ''}
            </div>
        `;
    }

    /**
     * Start the timer
     */
    start() {
        if (this.isRunning && !this.isPaused) return;

        this.isRunning = true;
        this.isPaused = false;

        // Save state
        this.saveState();

        // Start countdown
        this.interval = setInterval(() => {
            this.tick();
        }, 1000);

        // Show notification
        this.showNotification('Timer gestart', 'info');

        // Update UI
        this.updateDisplay();
    }

    /**
     * Pause the timer
     */
    pause() {
        if (!this.isRunning) return;

        if (this.isPaused) {
            // Resume
            this.isPaused = false;
            this.interval = setInterval(() => {
                this.tick();
            }, 1000);
            this.showNotification('Timer hervat', 'info');
        } else {
            // Pause
            this.isPaused = true;
            clearInterval(this.interval);
            this.showNotification('Timer gepauzeerd', 'info');
        }

        this.saveState();
        this.updateDisplay();
    }

    /**
     * Stop the timer
     */
    stop() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.interval);

        this.saveState();
        this.updateDisplay();

        this.showNotification('Timer gestopt', 'info');
    }

    /**
     * Reset the timer
     */
    reset() {
        const confirm = window.confirm('Weet je zeker dat je de timer wilt resetten?');
        if (!confirm) return;

        this.stop();
        this.remainingTime = this.totalTime;
        this.currentPhase = 0;

        this.saveState();
        this.updateDisplay();

        this.showNotification('Timer gereset', 'info');
    }

    /**
     * Timer tick
     */
    tick() {
        if (this.remainingTime <= 0) {
            this.complete();
            return;
        }

        this.remainingTime--;

        // Check for phase change
        const phaseTime = this.getPhaseElapsedTime();
        const phaseDuration = this.phases[this.currentPhase].duration;

        if (phaseTime >= phaseDuration && this.currentPhase < this.phases.length - 1) {
            this.nextPhase();
        }

        this.updateDisplay();
        this.saveState();
    }

    /**
     * Move to next phase
     */
    nextPhase() {
        if (this.currentPhase >= this.phases.length - 1) return;

        this.currentPhase++;

        // Play phase change sound
        if (this.audio.phaseChange) {
            this.audio.phaseChange.play().catch(() => {});
        }

        // Show notification
        const phase = this.phases[this.currentPhase];
        this.showNotification(`Nieuwe fase: ${phase.name}`, 'warning');

        this.updateDisplay();
    }

    /**
     * Skip to next phase
     */
    skipPhase() {
        if (this.currentPhase >= this.phases.length - 1) {
            this.showNotification('Dit is de laatste fase', 'info');
            return;
        }

        const phaseRemaining = this.getPhaseRemainingTime();
        this.remainingTime -= phaseRemaining;
        this.nextPhase();
    }

    /**
     * Add one minute
     */
    addMinute() {
        this.remainingTime = Math.min(this.remainingTime + 60, this.totalTime);
        this.updateDisplay();
        this.saveState();
    }

    /**
     * Subtract one minute
     */
    subtractMinute() {
        this.remainingTime = Math.max(this.remainingTime - 60, 0);
        this.updateDisplay();
        this.saveState();
    }

    /**
     * Complete the timer
     */
    complete() {
        this.stop();

        // Play complete sound
        if (this.audio.complete) {
            this.audio.complete.play().catch(() => {});
        }

        // Mark practice session as complete
        stateManager.set('progress.modules.practiceSession', true);

        // Show completion message
        this.showNotification('🎉 Timer voltooid! Goed gedaan!', 'success');

        // Update display
        this.updateDisplay();
    }

    /**
     * Get phase elapsed time
     */
    getPhaseElapsedTime() {
        let elapsed = this.totalTime - this.remainingTime;

        for (let i = 0; i < this.currentPhase; i++) {
            elapsed -= this.phases[i].duration;
        }

        return Math.max(0, elapsed);
    }

    /**
     * Get phase remaining time
     */
    getPhaseRemainingTime() {
        const elapsed = this.getPhaseElapsedTime();
        const duration = this.phases[this.currentPhase].duration;
        return Math.max(0, duration - elapsed);
    }

    /**
     * Get phase progress percentage
     */
    getPhaseProgress() {
        const elapsed = this.getPhaseElapsedTime();
        const duration = this.phases[this.currentPhase].duration;
        return Math.min(100, Math.round((elapsed / duration) * 100));
    }

    /**
     * Format time display
     */
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    /**
     * Format duration
     */
    formatDuration(seconds) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} ${minutes === 1 ? 'minuut' : 'minuten'}`;
    }

    /**
     * Update display
     */
    updateDisplay() {
        const display = document.getElementById('timer-display');
        if (display) {
            display.textContent = this.formatTime(this.remainingTime);
        }

        // Update progress bar
        const progressBar = document.querySelector('.timer-container .progress-bar');
        if (progressBar) {
            progressBar.style.width = `${this.getPhaseProgress()}%`;
        }
    }

    /**
     * Save timer state
     */
    saveState() {
        stateManager.set('timer', {
            remainingTime: this.remainingTime,
            currentPhase: this.currentPhase,
            isPaused: this.isPaused,
            isRunning: this.isRunning
        });
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        if (window.app && window.app.showNotification) {
            window.app.showNotification(message, type);
        }
    }
}

// Create singleton instance
const timer = new Timer();

// Export for use in other modules
export default timer;

// Also expose globally
if (typeof window !== 'undefined') {
    window.timer = timer;
}