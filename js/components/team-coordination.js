/**
 * Team Coordination Component - Coordinate with team members for assessment
 */

import stateManager from '../core/state-manager.js';

class TeamCoordination {
    constructor() {
        this.teamMembers = [];
        this.inviteCode = null;
        this.isTeamLeader = false;
        this.maxMembers = 6;
        this.minMembers = 4;
    }

    init() {
        // Load team data from state
        const team = stateManager.get('team');
        if (team) {
            this.teamMembers = team.members || [];
            this.inviteCode = team.inviteCode;
        }

        // Check if current user is team leader
        const userId = stateManager.get('user.studentNumber');
        if (this.teamMembers.length > 0 && this.teamMembers[0].studentNumber === userId) {
            this.isTeamLeader = true;
        }
    }

    render() {
        if (this.teamMembers.length === 0) {
            return this.renderTeamSetup();
        }

        return this.renderTeamDashboard();
    }

    renderTeamSetup() {
        return `
            <div class="team-coordination">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Team Coördinatie</h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        Werk samen met je teamleden voor een succesvolle assessment.
                        Vorm een team van 4-6 personen.
                    </p>
                </div>

                <!-- Team Options -->
                <div class="grid md:grid-cols-2 gap-6 mb-8">
                    <!-- Create Team -->
                    <div class="bg-white rounded-lg shadow-lg p-6">
                        <div class="text-center mb-4">
                            <span class="text-4xl">👥</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Nieuw Team Maken</h3>
                        <p class="text-gray-600 mb-4">
                            Start een nieuw team en nodig je teamleden uit.
                        </p>
                        <button class="btn btn-primary w-full" onclick="teamCoordination.showCreateTeamForm()">
                            Team Aanmaken
                        </button>
                    </div>

                    <!-- Join Team -->
                    <div class="bg-white rounded-lg shadow-lg p-6">
                        <div class="text-center mb-4">
                            <span class="text-4xl">🔗</span>
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">Team Joinen</h3>
                        <p class="text-gray-600 mb-4">
                            Voeg je bij een bestaand team met een uitnodigingscode.
                        </p>
                        <button class="btn btn-secondary w-full" onclick="teamCoordination.showJoinTeamForm()">
                            Met Code Joinen
                        </button>
                    </div>
                </div>

                <!-- Team Benefits -->
                <div class="bg-blue-50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-blue-900 mb-3">Voordelen van Teamwerk</h3>
                    <ul class="space-y-2 text-sm text-blue-800">
                        <li class="flex items-start">
                            <span class="text-blue-600 mr-2 mt-0.5">✓</span>
                            <span>Verdeel de rollen voor complete dekking</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 mr-2 mt-0.5">✓</span>
                            <span>Deel voorbereidingsmaterialen en notities</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 mr-2 mt-0.5">✓</span>
                            <span>Oefen samen met rollenspellen</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 mr-2 mt-0.5">✓</span>
                            <span>Zie elkaars voortgang en motiveer elkaar</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }

    renderTeamDashboard() {
        const teamProgress = this.calculateTeamProgress();
        const roleDistribution = this.getRoleDistribution();

        return `
            <div class="team-dashboard">
                <div class="mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-2">Team Dashboard</h2>
                    <div class="flex items-center gap-4">
                        <span class="badge badge-primary">Team Code: ${this.inviteCode}</span>
                        ${this.isTeamLeader ? '<span class="badge badge-warning">Team Leader</span>' : ''}
                    </div>
                </div>

                <!-- Team Stats -->
                <div class="grid md:grid-cols-4 gap-4 mb-8">
                    <div class="bg-white rounded-lg shadow p-4 text-center">
                        <div class="text-3xl font-bold text-primary-600">${this.teamMembers.length}</div>
                        <div class="text-sm text-gray-600">Teamleden</div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-4 text-center">
                        <div class="text-3xl font-bold text-green-600">${teamProgress}%</div>
                        <div class="text-sm text-gray-600">Gem. Voortgang</div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-4 text-center">
                        <div class="text-3xl font-bold text-yellow-600">${roleDistribution.filled}/${roleDistribution.total}</div>
                        <div class="text-sm text-gray-600">Rollen Bezet</div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-4 text-center">
                        <div class="text-3xl font-bold text-purple-600">${this.getDaysUntilAssessment()}</div>
                        <div class="text-sm text-gray-600">Dagen tot Assessment</div>
                    </div>
                </div>

                <!-- Team Members -->
                <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Teamleden</h3>
                    <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        ${this.teamMembers.map(member => this.renderMemberCard(member)).join('')}
                        ${this.renderAddMemberCard()}
                    </div>
                </div>

                <!-- Role Distribution -->
                <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Rolverdeling</h3>
                    ${this.renderRoleDistribution()}
                </div>

                <!-- Communication Templates -->
                <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Communicatie Templates</h3>
                    <div class="grid md:grid-cols-2 gap-4">
                        ${this.renderCommunicationTemplates()}
                    </div>
                </div>

                <!-- Team Actions -->
                <div class="bg-gray-50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">Team Acties</h3>
                    <div class="grid md:grid-cols-3 gap-3">
                        <button class="btn btn-primary" onclick="teamCoordination.scheduleSession()">
                            📅 Oefensessie Plannen
                        </button>
                        <button class="btn btn-secondary" onclick="teamCoordination.shareProgress()">
                            📊 Voortgang Delen
                        </button>
                        <button class="btn btn-ghost" onclick="teamCoordination.leaveTeam()">
                            🚪 Team Verlaten
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    renderMemberCard(member) {
        const progress = member.progress || 0;
        const roleIcon = this.getRoleIcon(member.role);
        const isOnline = this.checkIfOnline(member.lastActivity);

        return `
            <div class="bg-white border rounded-lg p-4">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex items-center">
                        <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                            <span class="text-lg font-bold">${member.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                            <h4 class="font-medium text-gray-900">${member.name}</h4>
                            <p class="text-sm text-gray-600">${member.studentNumber}</p>
                        </div>
                    </div>
                    <span class="w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-300'}"></span>
                </div>

                <div class="mb-3">
                    <span class="text-2xl mr-2">${roleIcon}</span>
                    <span class="text-sm font-medium">${this.getRoleName(member.role)}</span>
                </div>

                <div class="space-y-2">
                    <div>
                        <div class="flex justify-between text-sm mb-1">
                            <span class="text-gray-600">Voortgang</span>
                            <span class="font-medium">${progress}%</span>
                        </div>
                        <div class="progress h-2">
                            <div class="progress-bar h-2" style="width: ${progress}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderAddMemberCard() {
        if (this.teamMembers.length >= this.maxMembers) {
            return '';
        }

        return `
            <div class="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                 onclick="teamCoordination.inviteMember()">
                <div class="text-center">
                    <span class="text-4xl text-gray-400">+</span>
                    <p class="text-sm text-gray-600 mt-2">Lid Toevoegen</p>
                </div>
            </div>
        `;
    }

    renderRoleDistribution() {
        const roles = ['rvb', 'rvc', 'invest', 'toezicht', 'observer'];
        const assignedRoles = this.teamMembers.map(m => m.role).filter(Boolean);

        return `
            <div class="grid grid-cols-5 gap-3">
                ${roles.map(role => {
                    const isAssigned = assignedRoles.includes(role);
                    const member = this.teamMembers.find(m => m.role === role);

                    return `
                        <div class="text-center p-3 rounded-lg ${isAssigned ? 'bg-green-50' : 'bg-gray-50'}">
                            <div class="text-2xl mb-2">${this.getRoleIcon(role)}</div>
                            <div class="text-sm font-medium">${this.getRoleName(role)}</div>
                            ${member ? `
                                <div class="text-xs text-gray-600 mt-1">${member.name}</div>
                            ` : `
                                <div class="text-xs text-gray-400 mt-1">Niet bezet</div>
                            `}
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    renderCommunicationTemplates() {
        return `
            <!-- WhatsApp Template -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900 mb-2">WhatsApp Groep Bericht</h4>
                <div class="text-sm text-gray-600 mb-3">
                    <p>📚 Team Update - Assessment Voorbereiding</p>
                    <p>Status: ${this.calculateTeamProgress()}% voltooid</p>
                    <p>Volgende oefensessie: [datum]</p>
                    <p>Focus deze week: Q&A voorbereiding</p>
                </div>
                <button class="btn btn-sm btn-primary" onclick="teamCoordination.copyTemplate('whatsapp')">
                    📋 Kopiëren
                </button>
            </div>

            <!-- Email Template -->
            <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-semibold text-gray-900 mb-2">Email Template</h4>
                <div class="text-sm text-gray-600 mb-3">
                    <p><strong>Onderwerp:</strong> Assessment Team - Voortgangsupdate</p>
                    <p class="mt-2">Beste teamleden,</p>
                    <p>Hierbij een update over onze voorbereiding...</p>
                </div>
                <button class="btn btn-sm btn-primary" onclick="teamCoordination.copyTemplate('email')">
                    📋 Kopiëren
                </button>
            </div>
        `;
    }

    showCreateTeamForm() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 overflow-y-auto';
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-600 bg-opacity-75" onclick="teamCoordination.closeModal()"></div>
                <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Nieuw Team Aanmaken</h2>

                    <form onsubmit="event.preventDefault(); teamCoordination.createTeam();">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Team Naam
                            </label>
                            <input type="text" id="team-name" class="input" required
                                   placeholder="Bijv: De Strategen">
                        </div>

                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Jouw Naam
                            </label>
                            <input type="text" id="leader-name" class="input" required
                                   placeholder="Jouw volledige naam">
                        </div>

                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Studentnummer
                            </label>
                            <input type="text" id="leader-student-number" class="input" required
                                   placeholder="12345678">
                        </div>

                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Jouw Email
                            </label>
                            <input type="email" id="leader-email" class="input" required
                                   placeholder="naam@student.nl">
                        </div>

                        <div class="flex gap-3">
                            <button type="button" class="btn btn-ghost flex-1"
                                    onclick="teamCoordination.closeModal()">
                                Annuleren
                            </button>
                            <button type="submit" class="btn btn-primary flex-1">
                                Team Aanmaken
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    showJoinTeamForm() {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 overflow-y-auto';
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-600 bg-opacity-75" onclick="teamCoordination.closeModal()"></div>
                <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Team Joinen</h2>

                    <form onsubmit="event.preventDefault(); teamCoordination.joinTeam();">
                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Team Code
                            </label>
                            <input type="text" id="join-code" class="input text-center text-2xl font-mono" required
                                   placeholder="ABC123" maxlength="6" style="text-transform: uppercase;">
                        </div>

                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Jouw Naam
                            </label>
                            <input type="text" id="member-name" class="input" required
                                   placeholder="Jouw volledige naam">
                        </div>

                        <div class="mb-4">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Studentnummer
                            </label>
                            <input type="text" id="member-student-number" class="input" required
                                   placeholder="12345678">
                        </div>

                        <div class="mb-6">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Jouw Email
                            </label>
                            <input type="email" id="member-email" class="input" required
                                   placeholder="naam@student.nl">
                        </div>

                        <div class="flex gap-3">
                            <button type="button" class="btn btn-ghost flex-1"
                                    onclick="teamCoordination.closeModal()">
                                Annuleren
                            </button>
                            <button type="submit" class="btn btn-primary flex-1">
                                Join Team
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    createTeam() {
        const teamName = document.getElementById('team-name').value;
        const name = document.getElementById('leader-name').value;
        const studentNumber = document.getElementById('leader-student-number').value;
        const email = document.getElementById('leader-email').value;

        // Generate unique code
        this.inviteCode = this.generateInviteCode();

        // Create team leader member
        const leader = {
            name,
            studentNumber,
            email,
            role: stateManager.get('user.role') || null,
            progress: stateManager.get('progress.overall') || 0,
            lastActivity: new Date().toISOString(),
            isLeader: true
        };

        // Save to state
        this.teamMembers = [leader];
        this.isTeamLeader = true;

        stateManager.set('team', {
            name: teamName,
            inviteCode: this.inviteCode,
            members: this.teamMembers,
            messages: [],
            createdAt: new Date().toISOString()
        });

        // Save user info
        stateManager.set('user.name', name);
        stateManager.set('user.studentNumber', studentNumber);
        stateManager.set('user.email', email);
        stateManager.set('user.team', teamName);

        // Mark team coordination as complete
        stateManager.set('progress.modules.teamCoordination', true);

        this.closeModal();
        this.updateUI();
        this.showNotification(`Team "${teamName}" aangemaakt! Code: ${this.inviteCode}`, 'success');
    }

    joinTeam() {
        const code = document.getElementById('join-code').value.toUpperCase();
        const name = document.getElementById('member-name').value;
        const studentNumber = document.getElementById('member-student-number').value;
        const email = document.getElementById('member-email').value;

        // In a real app, this would validate the code against a backend
        // For now, we'll simulate joining a team
        this.inviteCode = code;

        const member = {
            name,
            studentNumber,
            email,
            role: stateManager.get('user.role') || null,
            progress: stateManager.get('progress.overall') || 0,
            lastActivity: new Date().toISOString(),
            isLeader: false
        };

        // Add to team (in real app, this would sync with backend)
        this.teamMembers.push(member);

        // Save to state
        stateManager.set('team', {
            inviteCode: this.inviteCode,
            members: this.teamMembers,
            messages: []
        });

        // Save user info
        stateManager.set('user.name', name);
        stateManager.set('user.studentNumber', studentNumber);
        stateManager.set('user.email', email);

        // Mark team coordination as complete
        stateManager.set('progress.modules.teamCoordination', true);

        this.closeModal();
        this.updateUI();
        this.showNotification(`Succesvol toegevoegd aan team met code ${code}!`, 'success');
    }

    inviteMember() {
        if (this.teamMembers.length >= this.maxMembers) {
            this.showNotification('Team is vol (max 6 leden)', 'warning');
            return;
        }

        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 overflow-y-auto';
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-600 bg-opacity-75" onclick="teamCoordination.closeModal()"></div>
                <div class="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Teamlid Uitnodigen</h2>

                    <div class="bg-primary-50 rounded-lg p-6 mb-4">
                        <p class="text-sm text-gray-600 mb-2">Deel deze code met je teamleden:</p>
                        <div class="text-4xl font-mono font-bold text-primary-600 text-center">
                            ${this.inviteCode}
                        </div>
                    </div>

                    <div class="space-y-3">
                        <button class="btn btn-primary w-full" onclick="teamCoordination.copyInviteCode()">
                            📋 Code Kopiëren
                        </button>
                        <button class="btn btn-secondary w-full" onclick="teamCoordination.shareViaWhatsApp()">
                            💬 Delen via WhatsApp
                        </button>
                        <button class="btn btn-ghost w-full" onclick="teamCoordination.closeModal()">
                            Sluiten
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    copyInviteCode() {
        navigator.clipboard.writeText(this.inviteCode).then(() => {
            this.showNotification('Code gekopieerd naar klembord!', 'success');
        });
    }

    shareViaWhatsApp() {
        const message = `Join ons assessment team! Gebruik code: ${this.inviteCode}`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    copyTemplate(type) {
        let template = '';

        if (type === 'whatsapp') {
            template = `📚 Team Update - Assessment Voorbereiding\n` +
                      `Status: ${this.calculateTeamProgress()}% voltooid\n` +
                      `Teamleden: ${this.teamMembers.length}/${this.maxMembers}\n` +
                      `Volgende oefensessie: [datum]\n` +
                      `Focus deze week: Q&A voorbereiding\n\n` +
                      `Team code: ${this.inviteCode}`;
        } else if (type === 'email') {
            template = `Onderwerp: Assessment Team - Voortgangsupdate\n\n` +
                      `Beste teamleden,\n\n` +
                      `Hierbij een update over onze voorbereiding voor het assessment.\n\n` +
                      `Huidige status:\n` +
                      `- Team voortgang: ${this.calculateTeamProgress()}%\n` +
                      `- Teamleden: ${this.teamMembers.length}/${this.maxMembers}\n` +
                      `- Rollen bezet: ${this.getRoleDistribution().filled}/${this.getRoleDistribution().total}\n\n` +
                      `Actiepunten:\n` +
                      `1. Voltooi je individuele voorbereiding\n` +
                      `2. Bereid je rol-specifieke presentatie voor\n` +
                      `3. Oefen de Q&A vragen\n\n` +
                      `Met vriendelijke groet,\n` +
                      `[Jouw naam]`;
        }

        navigator.clipboard.writeText(template).then(() => {
            this.showNotification('Template gekopieerd!', 'success');
        });
    }

    scheduleSession() {
        this.showNotification('Oefensessie planning komt binnenkort!', 'info');
    }

    shareProgress() {
        const progress = this.calculateTeamProgress();
        const message = `Team voortgang: ${progress}% voltooid!`;
        navigator.clipboard.writeText(message).then(() => {
            this.showNotification('Voortgang gekopieerd naar klembord!', 'success');
        });
    }

    leaveTeam() {
        const confirm = window.confirm('Weet je zeker dat je het team wilt verlaten?');
        if (!confirm) return;

        this.teamMembers = [];
        this.inviteCode = null;
        this.isTeamLeader = false;

        stateManager.set('team', {
            members: [],
            inviteCode: null,
            messages: []
        });

        this.updateUI();
        this.showNotification('Je hebt het team verlaten', 'info');
    }

    generateInviteCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    calculateTeamProgress() {
        if (this.teamMembers.length === 0) return 0;

        const totalProgress = this.teamMembers.reduce((sum, member) => {
            return sum + (member.progress || 0);
        }, 0);

        return Math.round(totalProgress / this.teamMembers.length);
    }

    getRoleDistribution() {
        const totalRoles = 5;
        const filledRoles = this.teamMembers.filter(m => m.role).length;

        return {
            total: totalRoles,
            filled: filledRoles
        };
    }

    getRoleIcon(role) {
        const icons = {
            'rvb': '🏢',
            'rvc': '👔',
            'invest': '💼',
            'toezicht': '⚖️',
            'observer': '👁️'
        };
        return icons[role] || '❓';
    }

    getRoleName(role) {
        const names = {
            'rvb': 'Raad van Bestuur',
            'rvc': 'Raad van Commissarissen',
            'invest': 'Investeerders',
            'toezicht': 'Toezichthouder',
            'observer': 'Observatoren'
        };
        return names[role] || 'Geen rol';
    }

    checkIfOnline(lastActivity) {
        if (!lastActivity) return false;

        const last = new Date(lastActivity);
        const now = new Date();
        const minutesSince = Math.floor((now - last) / (1000 * 60));

        return minutesSince < 5; // Online if active in last 5 minutes
    }

    getDaysUntilAssessment() {
        // Mock implementation - in real app would use actual assessment date
        return 14;
    }

    closeModal() {
        const modal = document.querySelector('.fixed.inset-0.z-50');
        if (modal) {
            modal.remove();
        }
    }

    updateUI() {
        const container = document.getElementById('view-container');
        if (container) {
            container.innerHTML = this.render();
        }
    }

    showNotification(message, type = 'info') {
        if (window.app && window.app.showNotification) {
            window.app.showNotification(message, type);
        }
    }
}

// Create singleton instance
const teamCoordination = new TeamCoordination();

// Export for use in other modules
export default teamCoordination;

// Also expose globally
if (typeof window !== 'undefined') {
    window.teamCoordination = teamCoordination;
}