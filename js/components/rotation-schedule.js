/**
 * Rotation Schedule Component - Manages team rotation across sessions and rounds
 * Implements the official assessment rotation schedule for 6 teams
 */

import stateManager from '../core/state-manager.js';

class RotationSchedule {
    constructor() {
        // Define the complete rotation schedule as per toetsprogramma
        this.schedule = {
            session1: {
                week: 6,
                title: 'Sessie 1 - Week 6',
                rounds: [
                    {
                        number: 1,
                        rvb: 'A',
                        rvc: 'B',
                        investeerders: 'C',
                        toezichthouder: 'D',
                        observers: ['E', 'F']
                    },
                    {
                        number: 2,
                        rvb: 'B',
                        rvc: 'C',
                        investeerders: 'D',
                        toezichthouder: 'E',
                        observers: ['F', 'A']
                    },
                    {
                        number: 3,
                        rvb: 'C',
                        rvc: 'D',
                        investeerders: 'E',
                        toezichthouder: 'F',
                        observers: ['A', 'B']
                    }
                ]
            },
            session2: {
                week: 7,
                title: 'Sessie 2 - Week 7',
                rounds: [
                    {
                        number: 4,
                        rvb: 'D',
                        rvc: 'E',
                        investeerders: 'F',
                        toezichthouder: 'A',
                        observers: ['B', 'C']
                    },
                    {
                        number: 5,
                        rvb: 'E',
                        rvc: 'F',
                        investeerders: 'A',
                        toezichthouder: 'B',
                        observers: ['C', 'D']
                    },
                    {
                        number: 6,
                        rvb: 'F',
                        rvc: 'A',
                        investeerders: 'B',
                        toezichthouder: 'C',
                        observers: ['D', 'E']
                    }
                ]
            }
        };

        this.currentRound = null;
        this.currentSession = null;
        this.userTeam = null;
        this.init();
    }

    /**
     * Initialize the component
     */
    init() {
        // Load saved state
        const savedSchedule = stateManager.get('schedule');
        if (savedSchedule) {
            this.currentRound = savedSchedule.currentRound;
            this.currentSession = savedSchedule.currentSession;
        }

        // Load user's team
        const team = stateManager.get('team');
        if (team && team.id) {
            this.userTeam = team.id;
        }
    }

    /**
     * Get team roles for a specific round
     */
    getTeamRoles(team, round) {
        // Find the round in either session
        let roundData = null;

        if (round <= 3) {
            roundData = this.schedule.session1.rounds[round - 1];
        } else if (round <= 6) {
            roundData = this.schedule.session2.rounds[round - 4];
        }

        if (!roundData) {
            return null;
        }

        // Determine the role for the team
        if (roundData.rvb === team) {
            return { role: 'RvB', presenting: true, focus: 'Presenteer jullie analyse' };
        } else if (roundData.rvc === team) {
            return { role: 'RvC', presenting: false, focus: 'Governance & risico vragen' };
        } else if (roundData.investeerders === team) {
            return { role: 'Investeerders', presenting: false, focus: 'ROI & groei vragen' };
        } else if (roundData.toezichthouder === team) {
            return { role: 'Toezichthouder', presenting: false, focus: 'Compliance & publiek belang' };
        } else if (roundData.observers.includes(team)) {
            return { role: 'Observer', presenting: false, focus: 'Evalueren & 1-min conclusie' };
        }

        return null;
    }

    /**
     * Get all roles for current round
     */
    getCurrentRoles() {
        if (!this.currentRound) {
            return null;
        }

        let roundData = null;
        if (this.currentRound <= 3) {
            roundData = this.schedule.session1.rounds[this.currentRound - 1];
        } else {
            roundData = this.schedule.session2.rounds[this.currentRound - 4];
        }

        return roundData;
    }

    /**
     * Get all roles for a specific team across all rounds
     */
    getTeamSchedule(team) {
        const schedule = [];

        // Session 1
        for (let i = 1; i <= 3; i++) {
            const role = this.getTeamRoles(team, i);
            schedule.push({
                session: 1,
                round: i,
                week: 6,
                ...role
            });
        }

        // Session 2
        for (let i = 4; i <= 6; i++) {
            const role = this.getTeamRoles(team, i);
            schedule.push({
                session: 2,
                round: i,
                week: 7,
                ...role
            });
        }

        return schedule;
    }

    /**
     * Get observer teams for a specific round
     */
    getObservers(round) {
        let roundData = null;

        if (round <= 3) {
            roundData = this.schedule.session1.rounds[round - 1];
        } else if (round <= 6) {
            roundData = this.schedule.session2.rounds[round - 4];
        }

        return roundData ? roundData.observers : [];
    }

    /**
     * Set current round (for instructor)
     */
    setCurrentRound(round, session) {
        this.currentRound = round;
        this.currentSession = session;

        // Save to state
        stateManager.set('schedule', {
            currentRound: round,
            currentSession: session
        });

        // Emit event for other components
        window.dispatchEvent(new CustomEvent('roundChanged', {
            detail: { round, session }
        }));
    }

    /**
     * Get role color for visual display
     */
    getRoleColor(role) {
        const colors = {
            'RvB': 'blue',
            'RvC': 'purple',
            'Investeerders': 'green',
            'Toezichthouder': 'orange',
            'Observer': 'gray'
        };
        return colors[role] || 'gray';
    }

    /**
     * Get role icon for visual display
     */
    getRoleIcon(role) {
        const icons = {
            'RvB': '👔',
            'RvC': '🏛️',
            'Investeerders': '💰',
            'Toezichthouder': '⚖️',
            'Observer': '👀'
        };
        return icons[role] || '❓';
    }

    /**
     * Render the rotation schedule
     */
    render() {
        const userSchedule = this.userTeam ? this.getTeamSchedule(this.userTeam) : null;

        return `
            <div class="rotation-schedule">
                <!-- Header -->
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Rotatieschema Assessment</h2>
                    <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                        Overzicht van alle rondes en rolverdeling voor De Strategische Arena
                    </p>
                </div>

                <!-- User Team Info -->
                ${this.userTeam ? `
                    <div class="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
                        <div class="flex items-center">
                            <div class="flex-shrink-0">
                                <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                                </svg>
                            </div>
                            <div class="ml-3">
                                <p class="text-sm text-blue-700">
                                    Jouw team: <strong>Team ${this.userTeam}</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                ` : ''}

                <!-- Current Round Indicator -->
                ${this.currentRound ? `
                    <div class="bg-green-50 border border-green-400 rounded-lg p-4 mb-6">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <span class="text-2xl mr-3">▶️</span>
                                <div>
                                    <h3 class="text-lg font-semibold text-green-900">Huidige Ronde</h3>
                                    <p class="text-green-700">Ronde ${this.currentRound} - Sessie ${this.currentSession}</p>
                                </div>
                            </div>
                            <button class="btn btn-primary btn-sm" onclick="rotationSchedule.showCurrentRoles()">
                                Toon Huidige Rollen
                            </button>
                        </div>
                    </div>
                ` : ''}

                <!-- Tab Navigation -->
                <div class="flex gap-2 mb-6 border-b">
                    <button class="tab-button active" data-tab="overview">
                        Volledig Schema
                    </button>
                    ${this.userTeam ? `
                        <button class="tab-button" data-tab="myteam">
                            Mijn Team
                        </button>
                    ` : ''}
                </div>

                <!-- Tab Content -->
                <div class="tab-content">
                    <!-- Overview Tab -->
                    <div id="overview-tab" class="tab-panel active">
                        ${this.renderOverviewTable()}
                    </div>

                    <!-- My Team Tab -->
                    ${this.userTeam ? `
                        <div id="myteam-tab" class="tab-panel">
                            ${this.renderTeamSchedule(this.userTeam)}
                        </div>
                    ` : ''}
                </div>

                <!-- Legend -->
                <div class="mt-8 p-4 bg-gray-50 rounded-lg">
                    <h3 class="font-semibold text-gray-900 mb-3">Legenda</h3>
                    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div class="flex items-center">
                            <span class="w-4 h-4 bg-blue-500 rounded mr-2"></span>
                            <span class="text-sm">RvB (Presenteert)</span>
                        </div>
                        <div class="flex items-center">
                            <span class="w-4 h-4 bg-purple-500 rounded mr-2"></span>
                            <span class="text-sm">RvC</span>
                        </div>
                        <div class="flex items-center">
                            <span class="w-4 h-4 bg-green-500 rounded mr-2"></span>
                            <span class="text-sm">Investeerders</span>
                        </div>
                        <div class="flex items-center">
                            <span class="w-4 h-4 bg-orange-500 rounded mr-2"></span>
                            <span class="text-sm">Toezichthouder</span>
                        </div>
                        <div class="flex items-center">
                            <span class="w-4 h-4 bg-gray-500 rounded mr-2"></span>
                            <span class="text-sm">Observer</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render overview table with all rounds
     */
    renderOverviewTable() {
        return `
            <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ronde
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                RvB
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                RvC
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Investeerders
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Toezichthouder
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Observers
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                        ${this.renderAllRounds()}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Render all rounds for overview table
     */
    renderAllRounds() {
        let html = '';

        // Session 1 header
        html += `
            <tr class="bg-blue-50">
                <td colspan="6" class="px-6 py-2 text-sm font-semibold text-blue-900">
                    Sessie 1 - Week 6
                </td>
            </tr>
        `;

        // Session 1 rounds
        this.schedule.session1.rounds.forEach(round => {
            html += this.renderRoundRow(round);
        });

        // Session 2 header
        html += `
            <tr class="bg-blue-50">
                <td colspan="6" class="px-6 py-2 text-sm font-semibold text-blue-900">
                    Sessie 2 - Week 7
                </td>
            </tr>
        `;

        // Session 2 rounds
        this.schedule.session2.rounds.forEach(round => {
            html += this.renderRoundRow(round);
        });

        return html;
    }

    /**
     * Render a single round row
     */
    renderRoundRow(round) {
        const isCurrentRound = this.currentRound === round.number;
        const rowClass = isCurrentRound ? 'bg-yellow-50 font-semibold' : '';

        return `
            <tr class="${rowClass}">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${isCurrentRound ? '▶️ ' : ''}Ronde ${round.number}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${this.renderTeamCell(round.rvb, 'RvB')}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${this.renderTeamCell(round.rvc, 'RvC')}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${this.renderTeamCell(round.investeerders, 'Investeerders')}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${this.renderTeamCell(round.toezichthouder, 'Toezichthouder')}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    ${round.observers.map(team =>
                        this.renderTeamCell(team, 'Observer')
                    ).join(', ')}
                </td>
            </tr>
        `;
    }

    /**
     * Render a team cell with highlighting
     */
    renderTeamCell(team, role) {
        const isUserTeam = team === this.userTeam;
        const icon = this.getRoleIcon(role);

        // Use static classes for Tailwind to pick them up
        const roleColors = {
            'RvB': 'bg-blue-100 text-blue-800',
            'RvC': 'bg-purple-100 text-purple-800',
            'Investeerders': 'bg-green-100 text-green-800',
            'Toezichthouder': 'bg-orange-100 text-orange-800',
            'Observer': 'bg-gray-100 text-gray-800'
        };

        const baseClasses = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`;
        const colorClasses = roleColors[role] || 'bg-gray-100 text-gray-800';
        const highlightClasses = isUserTeam ? 'ring-2 ring-offset-1 ring-blue-500' : '';

        return `
            <span class="${baseClasses} ${colorClasses} ${highlightClasses}">
                <span class="mr-1">${icon}</span>
                Team ${team}
            </span>
        `;
    }

    /**
     * Render session-specific table
     */
    renderSessionTable(sessionKey) {
        const session = this.schedule[sessionKey];

        return `
            <div class="space-y-6">
                <h3 class="text-xl font-semibold text-gray-900">
                    ${session.title}
                </h3>

                <div class="grid gap-6">
                    ${session.rounds.map(round => this.renderRoundCard(round)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render round card for session view
     */
    renderRoundCard(round) {
        const isCurrentRound = this.currentRound === round.number;

        return `
            <div class="border rounded-lg p-6 ${isCurrentRound ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                <div class="flex justify-between items-start mb-4">
                    <h4 class="text-lg font-semibold text-gray-900">
                        ${isCurrentRound ? '▶️ ' : ''}Ronde ${round.number}
                    </h4>
                    ${isCurrentRound ? `
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Actief
                        </span>
                    ` : ''}
                </div>

                <div class="grid md:grid-cols-2 gap-4">
                    <div>
                        <h5 class="font-medium text-gray-700 mb-2">Presenteert:</h5>
                        <div>${this.renderTeamCell(round.rvb, 'RvB')}</div>
                    </div>

                    <div>
                        <h5 class="font-medium text-gray-700 mb-2">Stakeholders:</h5>
                        <div class="space-y-1">
                            <div>${this.renderTeamCell(round.rvc, 'RvC')}</div>
                            <div>${this.renderTeamCell(round.investeerders, 'Investeerders')}</div>
                            <div>${this.renderTeamCell(round.toezichthouder, 'Toezichthouder')}</div>
                        </div>
                    </div>

                    <div class="md:col-span-2">
                        <h5 class="font-medium text-gray-700 mb-2">Observeren:</h5>
                        <div class="flex gap-2">
                            ${round.observers.map(team =>
                                this.renderTeamCell(team, 'Observer')
                            ).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Render team-specific schedule
     */
    renderTeamSchedule(team) {
        const schedule = this.getTeamSchedule(team);

        return `
            <div class="space-y-6">
                <h3 class="text-xl font-semibold text-gray-900">
                    Schema voor Team ${team}
                </h3>

                <div class="grid gap-4">
                    ${schedule.map(item => `
                        <div class="border rounded-lg p-4 ${this.currentRound === item.round ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}">
                            <div class="flex justify-between items-center">
                                <div>
                                    <h4 class="font-semibold text-gray-900">
                                        Ronde ${item.round} - Week ${item.week}
                                    </h4>
                                    <p class="text-sm text-gray-600 mt-1">
                                        Rol: <strong>${item.role}</strong>
                                    </p>
                                    <p class="text-sm text-gray-500 mt-1">
                                        ${item.focus}
                                    </p>
                                </div>
                                <div>
                                    ${this.getRoleIcon(item.role)}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>

                <!-- Summary -->
                <div class="bg-gray-50 rounded-lg p-4">
                    <h4 class="font-semibold text-gray-900 mb-2">Samenvatting</h4>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-gray-600">Presenteert:</span>
                            <strong class="ml-2">${schedule.filter(s => s.presenting).length}x</strong>
                        </div>
                        <div>
                            <span class="text-gray-600">Stakeholder:</span>
                            <strong class="ml-2">${schedule.filter(s => !s.presenting && s.role !== 'Observer').length}x</strong>
                        </div>
                        <div>
                            <span class="text-gray-600">Observer:</span>
                            <strong class="ml-2">${schedule.filter(s => s.role === 'Observer').length}x</strong>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Show current roles modal
     */
    showCurrentRoles() {
        const roles = this.getCurrentRoles();
        if (!roles) return;

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 overflow-y-auto';
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-600 bg-opacity-75" onclick="this.parentElement.parentElement.remove()"></div>
                <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">
                        Huidige Rollen - Ronde ${this.currentRound}
                    </h3>

                    <div class="space-y-3">
                        <div class="flex items-center justify-between p-3 bg-blue-50 rounded">
                            <span class="font-medium">RvB (Presenteert):</span>
                            <span class="font-bold">Team ${roles.rvb}</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-purple-50 rounded">
                            <span class="font-medium">RvC:</span>
                            <span class="font-bold">Team ${roles.rvc}</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-green-50 rounded">
                            <span class="font-medium">Investeerders:</span>
                            <span class="font-bold">Team ${roles.investeerders}</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-orange-50 rounded">
                            <span class="font-medium">Toezichthouder:</span>
                            <span class="font-bold">Team ${roles.toezichthouder}</span>
                        </div>
                        <div class="flex items-center justify-between p-3 bg-gray-50 rounded">
                            <span class="font-medium">Observers:</span>
                            <span class="font-bold">Teams ${roles.observers.join(' & ')}</span>
                        </div>
                    </div>

                    <button class="mt-6 btn btn-primary w-full" onclick="this.closest('.fixed').remove()">
                        Sluiten
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Export schedule to PDF
     */
    async exportToPDF() {
        try {
            // Use the PDF generator if available
            if (window.pdfGenerator) {
                const data = {
                    schedule: this.schedule,
                    userTeam: this.userTeam,
                    currentRound: this.currentRound
                };

                await window.pdfGenerator.generateRotationSchedule(data);
            } else {
                // Fallback to print
                window.print();
            }
        } catch (error) {
            console.error('Failed to export schedule:', error);
            this.showNotification('Fout bij exporteren', 'error');
        }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Tab switching
        document.addEventListener('click', (e) => {
            if (e.target.matches('.tab-button')) {
                const tab = e.target.dataset.tab;
                this.switchTab(tab);
            }
        });

        // Listen for round changes
        window.addEventListener('roundChanged', (e) => {
            this.currentRound = e.detail.round;
            this.currentSession = e.detail.session;
            this.updateDisplay();
        });
    }

    /**
     * Switch tabs
     */
    switchTab(tab) {
        // Update button states
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

        // Update panel visibility
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        document.getElementById(`${tab}-tab`).classList.add('active');
    }

    /**
     * Update display when data changes
     */
    updateDisplay() {
        const container = document.getElementById('view-container');
        if (container && container.querySelector('.rotation-schedule')) {
            container.innerHTML = this.render();
            this.attachEventListeners();
        }
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
const rotationSchedule = new RotationSchedule();

// Export for use in other modules
export default rotationSchedule;

// Also expose globally
if (typeof window !== 'undefined') {
    window.rotationSchedule = rotationSchedule;
}