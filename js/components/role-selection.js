/**
 * Role Selection Component - Allows users to select their assessment role
 */

import stateManager from '../core/state-manager.js';

class RoleSelection {
    constructor() {
        this.roles = [
            {
                id: 'rvb',
                name: 'Raad van Bestuur',
                description: 'Presenteer en verdedig de economische analyse als CEO, CFO, COO of CSO.',
                icon: '🏢',
                color: 'blue',
                subRoles: ['CEO', 'CFO', 'COO', 'CSO'],
                tips: [
                    'Bereid een heldere presentatie voor met kernpunten',
                    'Ken je cijfers en onderbouwing uit je hoofd',
                    'Anticipeer op kritische vragen van stakeholders',
                    'Oefen je elevator pitch (30 seconden samenvatting)'
                ]
            },
            {
                id: 'rvc',
                name: 'Raad van Commissarissen',
                description: 'Toets de plannen op haalbaarheid, risico\'s en lange termijn visie.',
                icon: '👔',
                color: 'purple',
                subRoles: ['Strategie & Innovatie', 'ESG & Duurzaamheid', 'Digital & Technology', 'Audit Committee', 'Remuneratie', 'Governance'],
                tips: [
                    'Focus op strategische risico\'s en kansen',
                    'Stel kritische maar constructieve vragen',
                    'Denk vanuit aandeelhoudersperspectief',
                    'Let op governance en compliance aspecten'
                ]
            },
            {
                id: 'invest',
                name: 'Investeerders',
                description: 'Beoordeel de business case op rendement, risico en investeringspotentieel.',
                icon: '💼',
                color: 'green',
                subRoles: ['Pensioenfonds', 'Vreemd Vermogen', 'Value Investor', 'Hedge Fund', 'Activist Investor'],
                tips: [
                    'Bereken ROI en payback periode',
                    'Analyseer marktpotentieel en concurrentie',
                    'Identificeer key performance indicators',
                    'Evalueer exit strategieën'
                ]
            },
            {
                id: 'toezicht',
                name: 'Toezichthouder',
                description: 'Toets op regelgeving, maatschappelijke impact en duurzaamheid.',
                icon: '⚖️',
                color: 'orange',
                subRoles: ['AFM', 'ACM', 'AP', 'FNV', 'Milieudefensie', 'RVO/EIC'],
                tips: [
                    'Ken relevante wet- en regelgeving',
                    'Focus op ESG factoren',
                    'Beoordeel maatschappelijke impact',
                    'Check compliance en reporting vereisten'
                ]
            },
            {
                id: 'observer',
                name: 'Observatoren',
                description: 'Observeer het proces en geef constructieve feedback.',
                icon: '👁️',
                color: 'gray',
                subRoles: ['Proces Observer', 'Inhoud Observer', 'Communicatie Observer', 'Dynamiek Observer'],
                tips: [
                    'Maak gestructureerde notities',
                    'Let op groepsdynamiek en communicatie',
                    'Identificeer sterke punten en verbeterpunten',
                    'Bereid constructieve feedback voor'
                ]
            }
        ];

        this.selectedRole = null;
        this.selectedSubRole = null;
    }

    /**
     * Initialize the component
     */
    init() {
        // Load saved role from state
        const savedRole = stateManager.get('user.role');
        const savedSubRole = stateManager.get('user.subRole');

        if (savedRole) {
            this.selectedRole = savedRole;
            this.selectedSubRole = savedSubRole;
        }

        // Setup event listeners
        this.attachEventListeners();

        // Update UI
        this.updateUI();
    }

    /**
     * Render the role selection component
     */
    render() {
        return `
            <div class="role-selection-container">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Kies je Rol</h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        Selecteer de rol die je tijdens de assessment zult vervullen.
                        Elke rol heeft specifieke verantwoordelijkheden en voorbereidingsmateriaal.
                    </p>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    ${this.roles.map(role => this.renderRoleCard(role)).join('')}
                </div>

                <div id="role-details" class="hidden">
                    <!-- Role details will be inserted here -->
                </div>
            </div>
        `;
    }

    /**
     * Render a single role card
     */
    renderRoleCard(role) {
        const isSelected = this.selectedRole === role.id;
        const colorClasses = this.getRoleColorClasses(role.color);

        return `
            <div class="card card-role card-role-${role.id} ${isSelected ? 'card-selected' : ''}"
                 data-role-id="${role.id}">
                <div class="p-6">
                    <div class="flex items-center mb-4">
                        <div class="text-4xl mr-4">${role.icon}</div>
                        <div class="flex-1">
                            <h3 class="text-lg font-semibold text-gray-900">
                                ${role.name}
                            </h3>
                            ${isSelected ? '<span class="badge badge-primary ml-2">Geselecteerd</span>' : ''}
                        </div>
                    </div>
                    <p class="text-gray-600 text-sm mb-4">
                        ${role.description}
                    </p>
                    <div class="flex flex-wrap gap-1">
                        ${role.subRoles.slice(0, 2).map(subRole => `
                            <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                ${subRole}
                            </span>
                        `).join('')}
                        ${role.subRoles.length > 2 ? `
                            <span class="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                                +${role.subRoles.length - 2} meer
                            </span>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Select a role
     */
    selectRole(roleId) {
        const role = this.roles.find(r => r.id === roleId);
        if (!role) return;

        this.selectedRole = roleId;
        stateManager.set('user.role', roleId);

        // Update UI
        this.updateUI();
        this.showRoleDetails(role);

        // Show notification
        this.showNotification(`${role.name} geselecteerd als je rol`, 'success');
    }

    /**
     * Show detailed role information
     */
    showRoleDetails(role) {
        const detailsContainer = document.getElementById('role-details');
        if (!detailsContainer) return;

        detailsContainer.innerHTML = `
            <div class="bg-white rounded-lg shadow-lg p-6 mt-8">
                <div class="flex items-start justify-between mb-6">
                    <div>
                        <h3 class="text-2xl font-bold text-gray-900 flex items-center">
                            <span class="text-3xl mr-3">${role.icon}</span>
                            ${role.name}
                        </h3>
                        <p class="text-gray-600 mt-2">${role.description}</p>
                    </div>
                    <button class="btn btn-ghost" onclick="roleSelection.clearSelection()">
                        Wijzig rol
                    </button>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                    <!-- Sub-role selection -->
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-3">Kies je specifieke rol:</h4>
                        <div class="space-y-2">
                            ${role.subRoles.map((subRole, index) => `
                                <label class="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                    <input type="radio"
                                           name="subRole"
                                           value="${subRole}"
                                           class="radio mr-3"
                                           ${this.selectedSubRole === subRole ? 'checked' : ''}
                                           onchange="roleSelection.selectSubRole('${subRole}')">
                                    <span class="text-gray-700">${subRole}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Tips -->
                    <div>
                        <h4 class="font-semibold text-gray-900 mb-3">Voorbereidingstips:</h4>
                        <ul class="space-y-2">
                            ${role.tips.map(tip => `
                                <li class="flex items-start">
                                    <span class="text-green-600 mr-2 mt-0.5">✓</span>
                                    <span class="text-gray-600 text-sm">${tip}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>

                <!-- Action buttons -->
                <div class="mt-6 pt-6 border-t flex justify-between items-center">
                    <div class="text-sm text-gray-600">
                        ${this.selectedSubRole ?
                            `<span class="font-medium">Geselecteerd:</span> ${this.selectedSubRole}` :
                            'Selecteer een specifieke rol om door te gaan'
                        }
                    </div>
                    <button class="btn btn-primary ${!this.selectedSubRole ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${!this.selectedSubRole ? 'disabled' : ''}
                            onclick="roleSelection.confirmSelection()">
                        Bevestig selectie en ga verder
                    </button>
                </div>
            </div>
        `;

        detailsContainer.classList.remove('hidden');

        // Scroll to details
        detailsContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * Select a sub-role
     */
    selectSubRole(subRole) {
        this.selectedSubRole = subRole;
        stateManager.set('user.subRole', subRole);

        // Enable confirm button
        const confirmBtn = document.querySelector('[onclick="roleSelection.confirmSelection()"]');
        if (confirmBtn) {
            confirmBtn.classList.remove('opacity-50', 'cursor-not-allowed');
            confirmBtn.removeAttribute('disabled');
        }

        // Update status text
        const statusText = document.querySelector('#role-details .text-sm.text-gray-600');
        if (statusText) {
            statusText.innerHTML = `<span class="font-medium">Geselecteerd:</span> ${subRole}`;
        }
    }

    /**
     * Confirm role selection
     */
    confirmSelection() {
        if (!this.selectedRole || !this.selectedSubRole) {
            this.showNotification('Selecteer eerst een rol en sub-rol', 'warning');
            return;
        }

        // Mark role selection as complete
        stateManager.set('progress.modules.roleSelection', true);

        // Save selection
        stateManager.set('user.role', this.selectedRole);
        stateManager.set('user.subRole', this.selectedSubRole);

        // Show success message
        const role = this.roles.find(r => r.id === this.selectedRole);
        this.showNotification(
            `Rol bevestigd: ${role.name} - ${this.selectedSubRole}`,
            'success'
        );

        // Navigate to next section after delay
        setTimeout(() => {
            if (window.router) {
                window.router.navigate('/materialen');
            }
        }, 1500);
    }

    /**
     * Clear role selection
     */
    clearSelection() {
        this.selectedRole = null;
        this.selectedSubRole = null;

        stateManager.set('user.role', null);
        stateManager.set('user.subRole', null);
        stateManager.set('progress.modules.roleSelection', false);

        this.updateUI();

        // Hide details
        const detailsContainer = document.getElementById('role-details');
        if (detailsContainer) {
            detailsContainer.classList.add('hidden');
        }
    }

    /**
     * Update UI based on current selection
     */
    updateUI() {
        // Update role cards
        document.querySelectorAll('.card-role').forEach(card => {
            const roleId = card.dataset.roleId;
            if (roleId === this.selectedRole) {
                card.classList.add('card-selected');
            } else {
                card.classList.remove('card-selected');
            }
        });
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Remove any existing listener to prevent duplicates
        if (this.roleClickHandler) {
            document.removeEventListener('click', this.roleClickHandler);
        }

        // Create and store the handler
        this.roleClickHandler = (e) => {
            const roleCard = e.target.closest('[data-role-id]');
            if (roleCard) {
                const roleId = roleCard.dataset.roleId;
                this.selectRole(roleId);
            }
        };

        // Attach the new listener
        document.addEventListener('click', this.roleClickHandler);
    }

    /**
     * Get role color classes
     */
    getRoleColorClasses(color) {
        const colorMap = {
            'blue': 'border-blue-500 bg-blue-50',
            'purple': 'border-purple-500 bg-purple-50',
            'green': 'border-green-500 bg-green-50',
            'orange': 'border-orange-500 bg-orange-50',
            'gray': 'border-gray-500 bg-gray-50'
        };
        return colorMap[color] || colorMap['gray'];
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        // Debounce to prevent duplicate notifications
        if (this.notificationTimeout) {
            clearTimeout(this.notificationTimeout);
        }

        this.notificationTimeout = setTimeout(() => {
            // Use app's notification system if available
            if (window.app && window.app.showNotification) {
                window.app.showNotification(message, type);
            } else {
                console.log(`[${type}] ${message}`);
            }
        }, 100); // Small delay to debounce rapid calls
    }

    /**
     * Get role statistics
     */
    getStatistics() {
        return {
            totalRoles: this.roles.length,
            selectedRole: this.selectedRole,
            selectedSubRole: this.selectedSubRole,
            isComplete: !!(this.selectedRole && this.selectedSubRole)
        };
    }
}

// Create singleton instance
const roleSelection = new RoleSelection();

// Export for use in other modules
export default roleSelection;

// Also expose globally
if (typeof window !== 'undefined') {
    window.roleSelection = roleSelection;
}