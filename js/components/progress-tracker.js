/**
 * Progress Tracker Component - Tracks and displays user progress
 */

import stateManager from '../core/state-manager.js';

class ProgressTracker {
    constructor() {
        this.modules = [
            {
                id: 'roleSelection',
                name: 'Rol Selectie',
                description: 'Kies je rol voor de assessment',
                icon: '👥',
                weight: 10
            },
            {
                id: 'caseAnalysis',
                name: 'Case Analyse',
                description: 'Analyseer de business case',
                icon: '📊',
                weight: 20
            },
            {
                id: 'preparationMaterials',
                name: 'Voorbereiding Materialen',
                description: 'Doorloop alle voorbereidingsmaterialen',
                icon: '📚',
                weight: 25
            },
            {
                id: 'teamCoordination',
                name: 'Team Coördinatie',
                description: 'Coördineer met je teamleden',
                icon: '🤝',
                weight: 15
            },
            {
                id: 'practiceSession',
                name: 'Oefensessie',
                description: 'Oefen met de timer en fases',
                icon: '⏱️',
                weight: 15
            },
            {
                id: 'qaSimulator',
                name: 'Q&A Simulator',
                description: 'Oefen mogelijke vragen',
                icon: '💬',
                weight: 10
            },
            {
                id: 'finalChecklist',
                name: 'Eindchecklist',
                description: 'Controleer of je klaar bent',
                icon: '✅',
                weight: 5
            }
        ];

        this.milestones = [
            { threshold: 25, name: 'Beginner', badge: '🌱' },
            { threshold: 50, name: 'Gevorderd', badge: '🌿' },
            { threshold: 75, name: 'Expert', badge: '🌳' },
            { threshold: 100, name: 'Klaar voor Assessment', badge: '🏆' }
        ];

        this.init();
    }

    /**
     * Initialize the component
     */
    init() {
        // Listen for progress updates
        stateManager.on('progress.modules.*', () => {
            this.updateProgress();
        });

        // Initial update
        this.updateProgress();
    }

    /**
     * Render the progress tracker
     */
    render() {
        const progress = this.calculateProgress();
        const milestone = this.getCurrentMilestone(progress.percentage);

        return `
            <div class="progress-tracker">
                <!-- Overall Progress -->
                <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-xl font-bold text-gray-900">Je Voortgang</h3>
                        <div class="flex items-center gap-2">
                            <span class="text-2xl">${milestone.badge}</span>
                            <span class="text-sm font-medium text-gray-600">${milestone.name}</span>
                        </div>
                    </div>

                    <div class="progress-container">
                        <div class="progress-label">
                            <span>Totale voortgang</span>
                            <span class="font-semibold">${progress.percentage}%</span>
                        </div>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${progress.percentage}%">
                                ${this.renderMilestones()}
                            </div>
                        </div>
                    </div>

                    <div class="mt-4 text-sm text-gray-600">
                        <span class="font-medium">${progress.completed}</span> van
                        <span class="font-medium">${progress.total}</span> onderdelen voltooid
                    </div>
                </div>

                <!-- Module Progress -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-6">Voortgang per Module</h3>
                    <div class="space-y-4">
                        ${this.modules.map(module => this.renderModuleProgress(module)).join('')}
                    </div>
                </div>

                <!-- Statistics -->
                ${this.renderStatistics()}
            </div>
        `;
    }

    /**
     * Render module progress item
     */
    renderModuleProgress(module) {
        const isComplete = stateManager.get(`progress.modules.${module.id}`);
        const statusClass = isComplete ? 'text-green-600' : 'text-gray-400';
        const statusIcon = isComplete ? '✓' : '○';

        return `
            <div class="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div class="flex items-center flex-1">
                    <span class="text-2xl mr-3">${module.icon}</span>
                    <div class="flex-1">
                        <div class="flex items-center">
                            <h4 class="font-medium text-gray-900">${module.name}</h4>
                            <span class="ml-2 ${statusClass}">${statusIcon}</span>
                        </div>
                        <p class="text-sm text-gray-600">${module.description}</p>
                    </div>
                </div>
                <div class="text-right">
                    <span class="text-sm font-medium text-gray-500">${module.weight}%</span>
                    ${isComplete ? `
                        <span class="block text-xs text-green-600 mt-1">Voltooid</span>
                    ` : `
                        <button class="block text-xs text-primary-600 mt-1 hover:underline"
                                onclick="progressTracker.startModule('${module.id}')">
                            Start →
                        </button>
                    `}
                </div>
            </div>
        `;
    }

    /**
     * Render milestones on progress bar
     */
    renderMilestones() {
        return `
            <div class="progress-milestones">
                ${this.milestones.map(milestone => `
                    <div class="progress-milestone" style="left: ${milestone.threshold}%"></div>
                `).join('')}
            </div>
        `;
    }

    /**
     * Render statistics
     */
    renderStatistics() {
        const stats = this.getStatistics();

        return `
            <div class="bg-white rounded-lg shadow-lg p-6 mt-6">
                <h3 class="text-xl font-bold text-gray-900 mb-4">Statistieken</h3>
                <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center">
                        <div class="text-3xl font-bold text-primary-600">${stats.timeSpent}</div>
                        <div class="text-sm text-gray-600">Tijd besteed</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-green-600">${stats.completed}</div>
                        <div class="text-sm text-gray-600">Voltooid</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-yellow-600">${stats.inProgress}</div>
                        <div class="text-sm text-gray-600">In uitvoering</div>
                    </div>
                    <div class="text-center">
                        <div class="text-3xl font-bold text-gray-400">${stats.remaining}</div>
                        <div class="text-sm text-gray-600">Nog te doen</div>
                    </div>
                </div>

                ${stats.streak > 0 ? `
                    <div class="mt-4 p-3 bg-yellow-50 rounded-lg">
                        <div class="flex items-center">
                            <span class="text-2xl mr-2">🔥</span>
                            <span class="text-sm font-medium text-yellow-800">
                                ${stats.streak} dagen op rij actief!
                            </span>
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    /**
     * Calculate overall progress
     */
    calculateProgress() {
        const modules = stateManager.get('progress.modules');
        let weightedProgress = 0;
        let completedCount = 0;

        this.modules.forEach(module => {
            if (modules[module.id]) {
                weightedProgress += module.weight;
                completedCount++;
            }
        });

        return {
            percentage: Math.round(weightedProgress),
            completed: completedCount,
            total: this.modules.length,
            weightedProgress
        };
    }

    /**
     * Get current milestone
     */
    getCurrentMilestone(percentage) {
        let currentMilestone = this.milestones[0];

        for (const milestone of this.milestones) {
            if (percentage >= milestone.threshold) {
                currentMilestone = milestone;
            } else {
                break;
            }
        }

        return currentMilestone;
    }

    /**
     * Update progress displays
     */
    updateProgress() {
        const progress = this.calculateProgress();

        // Update main progress bar
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = `${progress.percentage}%`;
        }

        // Update progress text
        const progressText = document.querySelector('.progress-text');
        if (progressText) {
            progressText.textContent = `${progress.percentage}% voltooid`;
        }

        // Don't update state manager here - it causes infinite loops
        // The state should be managed by the state manager itself
        // stateManager.set('progress.overall', progress.percentage);

        // Check for milestone achievements
        this.checkMilestoneAchievements(progress.percentage);
    }

    /**
     * Check and notify milestone achievements
     */
    checkMilestoneAchievements(percentage) {
        const lastPercentage = stateManager.get('progress.lastMilestone') || 0;

        this.milestones.forEach(milestone => {
            if (percentage >= milestone.threshold && lastPercentage < milestone.threshold) {
                this.celebrateMilestone(milestone);
                stateManager.set('progress.lastMilestone', milestone.threshold);
            }
        });
    }

    /**
     * Celebrate milestone achievement
     */
    celebrateMilestone(milestone) {
        // Show celebration notification
        if (window.app && window.app.showNotification) {
            window.app.showNotification(
                `🎉 Mijlpaal bereikt: ${milestone.name} ${milestone.badge}`,
                'success'
            );
        }

        // Add visual celebration effect
        this.showConfetti();
    }

    /**
     * Show confetti animation
     */
    showConfetti() {
        // Simple confetti effect
        const confettiContainer = document.createElement('div');
        confettiContainer.className = 'fixed inset-0 pointer-events-none z-50';
        confettiContainer.innerHTML = `
            <div class="confetti-animation">
                ${Array(20).fill().map(() => `
                    <div class="confetti-piece" style="
                        left: ${Math.random() * 100}%;
                        animation-delay: ${Math.random() * 2}s;
                        background: hsl(${Math.random() * 360}, 100%, 50%);
                    "></div>
                `).join('')}
            </div>
        `;

        document.body.appendChild(confettiContainer);

        // Remove after animation
        setTimeout(() => {
            confettiContainer.remove();
        }, 3000);
    }

    /**
     * Start a module
     */
    startModule(moduleId) {
        const module = this.modules.find(m => m.id === moduleId);
        if (!module) return;

        // Navigate to appropriate route
        const routeMap = {
            'roleSelection': '/rollen',
            'caseAnalysis': '/case',
            'preparationMaterials': '/materialen',
            'teamCoordination': '/team',
            'practiceSession': '/timer',
            'qaSimulator': '/qa',
            'finalChecklist': '/checklist'
        };

        const route = routeMap[moduleId];
        if (route && window.router) {
            window.router.navigate(route);
        }
    }

    /**
     * Mark module as complete
     */
    completeModule(moduleId) {
        stateManager.set(`progress.modules.${moduleId}`, true);
        this.updateProgress();

        const module = this.modules.find(m => m.id === moduleId);
        if (module && window.app) {
            window.app.showNotification(
                `${module.icon} ${module.name} voltooid!`,
                'success'
            );
        }
    }

    /**
     * Reset module progress
     */
    resetModule(moduleId) {
        stateManager.set(`progress.modules.${moduleId}`, false);
        this.updateProgress();
    }

    /**
     * Get statistics
     */
    getStatistics() {
        const modules = stateManager.get('progress.modules');
        const lastActivity = stateManager.get('progress.lastActivity');

        let completed = 0;
        let inProgress = 0;

        this.modules.forEach(module => {
            if (modules[module.id]) {
                completed++;
            }
        });

        const remaining = this.modules.length - completed - inProgress;

        // Calculate time spent (mock for now)
        const timeSpent = this.formatTime(
            completed * 900 + inProgress * 450 // 15 min per completed, 7.5 min per in progress
        );

        // Calculate streak
        const streak = this.calculateStreak(lastActivity);

        return {
            completed,
            inProgress,
            remaining,
            timeSpent,
            streak
        };
    }

    /**
     * Format time in minutes to readable string
     */
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);

        if (hours > 0) {
            return `${hours}u ${minutes}m`;
        }
        return `${minutes}m`;
    }

    /**
     * Calculate activity streak
     */
    calculateStreak(lastActivity) {
        if (!lastActivity) return 0;

        const last = new Date(lastActivity);
        const now = new Date();
        const daysDiff = Math.floor((now - last) / (1000 * 60 * 60 * 24));

        // If last activity was today or yesterday, maintain streak
        return daysDiff <= 1 ? 1 : 0;
    }

    /**
     * Export progress report
     */
    exportProgressReport() {
        const progress = this.calculateProgress();
        const stats = this.getStatistics();

        const report = {
            timestamp: new Date().toISOString(),
            overall_progress: progress.percentage,
            modules_completed: progress.completed,
            modules_total: progress.total,
            statistics: stats,
            module_details: this.modules.map(module => ({
                name: module.name,
                completed: stateManager.get(`progress.modules.${module.id}`) || false,
                weight: module.weight
            }))
        };

        return report;
    }
}

// Create singleton instance
const progressTracker = new ProgressTracker();

// Export for use in other modules
export default progressTracker;

// Also expose globally
if (typeof window !== 'undefined') {
    window.progressTracker = progressTracker;
}

// Add CSS for confetti animation
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes confetti-fall {
            0% {
                transform: translateY(-100vh) rotate(0deg);
                opacity: 1;
            }
            100% {
                transform: translateY(100vh) rotate(720deg);
                opacity: 0;
            }
        }

        .confetti-piece {
            position: absolute;
            width: 10px;
            height: 10px;
            animation: confetti-fall 3s linear forwards;
        }
    `;
    document.head.appendChild(style);
}