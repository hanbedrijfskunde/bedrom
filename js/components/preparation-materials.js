/**
 * Preparation Materials Component - Access to all preparation resources
 */

import stateManager from '../core/state-manager.js';
import { pdfGenerator } from '../services/pdf-generator.js';

class PreparationMaterials {
    constructor() {
        this.materials = [
            {
                id: 'economic-analysis',
                category: 'Economische Analyse',
                icon: '📊',
                items: [
                    {
                        title: 'Macro-economische Indicatoren',
                        type: 'document',
                        duration: '15 min',
                        description: 'Overzicht van belangrijke economische indicatoren',
                        content: [
                            'BBP groei en trends',
                            'Inflatie en monetair beleid',
                            'Werkloosheidscijfers',
                            'Handelsbalans en wisselkoersen'
                        ]
                    },
                    {
                        title: 'Marktstructuur Analyse',
                        type: 'interactive',
                        duration: '20 min',
                        description: 'Interactieve tool voor marktstructuur analyse',
                        content: [
                            'Monopolie vs. Oligopolie',
                            'Perfecte concurrentie',
                            'Monopolistische concurrentie',
                            'Marktmacht en prijszetting'
                        ]
                    },
                    {
                        title: 'SWOT Analyse Template',
                        type: 'template',
                        duration: '10 min',
                        description: 'Template voor het uitvoeren van een SWOT analyse',
                        content: [
                            'Strengths identificatie',
                            'Weaknesses analyse',
                            'Opportunities mapping',
                            'Threats assessment'
                        ]
                    }
                ]
            },
            {
                id: 'presentation-skills',
                category: 'Presentatie Vaardigheden',
                icon: '🎤',
                items: [
                    {
                        title: 'Elevator Pitch Training',
                        type: 'video',
                        duration: '10 min',
                        description: '30-seconden pitch voor je economische analyse',
                        content: [
                            'Hook statement',
                            'Problem identificatie',
                            'Oplossing presentatie',
                            'Call to action'
                        ]
                    },
                    {
                        title: 'Storytelling Technieken',
                        type: 'guide',
                        duration: '12 min',
                        description: 'Maak je presentatie memorabel met storytelling',
                        content: [
                            'De held reis structuur',
                            'Data visualisatie',
                            'Emotionele connectie',
                            'Concrete voorbeelden'
                        ]
                    },
                    {
                        title: 'Lichaamstaal & Stem',
                        type: 'checklist',
                        duration: '8 min',
                        description: 'Non-verbale communicatie tips',
                        content: [
                            'Houding en gebaren',
                            'Oogcontact technieken',
                            'Stemprojectie',
                            'Pauzeren voor effect'
                        ]
                    }
                ]
            },
            {
                id: 'qa-preparation',
                category: 'Q&A Voorbereiding',
                icon: '💬',
                items: [
                    {
                        title: 'Top 50 Verwachte Vragen',
                        type: 'quiz',
                        duration: '25 min',
                        description: 'Meest gestelde vragen tijdens assessments',
                        content: [
                            'Financiële onderbouwing',
                            'Risico management',
                            'Concurrentie analyse',
                            'Implementatie planning'
                        ]
                    },
                    {
                        title: 'STAR Methode',
                        type: 'framework',
                        duration: '15 min',
                        description: 'Gestructureerd antwoorden op gedragsvragen',
                        content: [
                            'Situation beschrijving',
                            'Task definitie',
                            'Action uitleg',
                            'Result presentatie'
                        ]
                    },
                    {
                        title: 'Moeilijke Vragen Handling',
                        type: 'strategy',
                        duration: '10 min',
                        description: 'Technieken voor lastige of onverwachte vragen',
                        content: [
                            'Bridge technieken',
                            'Reframing strategieën',
                            'Tijd kopen tactiek',
                            'Graceful deflection'
                        ]
                    }
                ]
            },
            {
                id: 'role-specific',
                category: 'Rol-specifiek Materiaal',
                icon: '👥',
                items: [
                    {
                        title: 'Assessment Formulieren',
                        type: 'forms',
                        duration: '5 min',
                        description: 'Printbare formulieren voor tijdens de toetsing',
                        content: [
                            'Kies je rol voor de juiste formulieren',
                            'Print formulieren vóór de sessie',
                            'Lever in bij teamleider na afloop',
                            'Teamleider verzamelt in plastic hoes'
                        ],
                        isAssessmentForm: true
                    },
                    {
                        title: 'Inleverinstructies',
                        type: 'instructions',
                        duration: '2 min',
                        description: 'Procedure voor documentinlevering',
                        content: [
                            'Vul formulieren volledig in tijdens ronde',
                            'Geef aan teamleider direct na presentatie',
                            'Teamleider verzamelt alle documenten',
                            'Inlevering in plastic hoes bij docent'
                        ]
                    },
                    {
                        title: 'Evaluatiecriteria Overzicht',
                        type: 'criteria',
                        duration: '10 min',
                        description: 'Alle 13 eindkwalificaties uitgelegd',
                        content: [
                            'Conjunctuur & macro-economie (1-2)',
                            'Markt & bedrijfskolom (3-5)',
                            'Financieel & innovatie (6-9)',
                            'Overheid & maatschappij (10-13)'
                        ]
                    }
                ]
            }
        ];

        this.completedItems = new Set();
        this.currentItem = null;
    }

    /**
     * Initialize the component
     */
    init() {
        // Load completed items from state
        const saved = stateManager.get('materials.completed');
        if (saved && Array.isArray(saved)) {
            this.completedItems = new Set(saved);
        }

        this.attachEventListeners();
        this.updateProgress();
    }

    /**
     * Render the preparation materials
     */
    render() {
        const progress = this.calculateProgress();
        const isDocent = new URLSearchParams(window.location.search).get('docent') === 'true';

        return `
            <div class="preparation-materials">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Voorbereidingsmaterialen</h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        Alle materialen die je nodig hebt voor een succesvolle assessment voorbereiding.
                    </p>
                </div>

                ${isDocent ? this.renderDocentSection() : ''}

                <!-- Progress Overview -->
                <div class="bg-white rounded-lg shadow p-6 mb-8">
                    <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold">Voortgang Materialen</h3>
                        <div class="flex items-center gap-2">
                            <button class="btn btn-secondary btn-sm ${progress.percentage < 50 ? 'opacity-50 cursor-not-allowed' : ''}"
                                    onclick="preparationMaterials.exportToPDF()"
                                    ${progress.percentage < 50 ? 'disabled' : ''}>
                                <span>📄</span> Export PDF
                            </button>
                            <span class="text-2xl">📚</span>
                        </div>
                    </div>
                    <div class="progress-container">
                        <div class="progress">
                            <div class="progress-bar" style="width: ${progress.percentage}%"></div>
                        </div>
                        <div class="progress-label mt-2">
                            <span>${progress.completed} van ${progress.total} items voltooid</span>
                            <span>${progress.percentage}%</span>
                        </div>
                    </div>
                    <div class="mt-4 text-sm text-gray-600">
                        Geschatte tijd resterend: ${this.estimateRemainingTime()} minuten
                    </div>
                    ${progress.percentage < 50 ? `
                        <div class="mt-3 text-xs text-amber-600 bg-amber-50 p-2 rounded">
                            ⚠️ PDF export beschikbaar vanaf 50% voortgang
                        </div>
                    ` : ''}
                </div>

                <!-- Filter Tabs -->
                <div class="flex gap-2 mb-6 overflow-x-auto pb-2">
                    <button class="btn btn-ghost btn-sm filter-active" data-filter="all">
                        Alles (${this.getTotalItems()})
                    </button>
                    ${this.materials.map(category => `
                        <button class="btn btn-ghost btn-sm" data-filter="${category.id}">
                            ${category.icon} ${category.category} (${category.items.length})
                        </button>
                    `).join('')}
                </div>

                <!-- Materials Grid -->
                <div class="materials-grid">
                    ${this.materials.map(category => this.renderCategory(category)).join('')}
                </div>

                <!-- Quick Actions -->
                <div class="fixed bottom-6 right-6 z-40">
                    <button class="btn btn-primary rounded-full shadow-lg p-4"
                            onclick="preparationMaterials.showQuickAccess()">
                        <span class="text-xl">⚡</span>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Render a material category
     */
    renderCategory(category) {
        return `
            <div class="material-category mb-8" data-category="${category.id}">
                <div class="flex items-center mb-4">
                    <span class="text-3xl mr-3">${category.icon}</span>
                    <h3 class="text-xl font-bold text-gray-900">${category.category}</h3>
                </div>
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    ${category.items.map(item => this.renderMaterialItem(item, category.id)).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Render a single material item
     */
    renderMaterialItem(item, categoryId) {
        const itemId = `${categoryId}-${item.title.toLowerCase().replace(/\s+/g, '-')}`;
        const isCompleted = this.completedItems.has(itemId);
        const typeIcon = this.getTypeIcon(item.type);
        const typeColor = this.getTypeColor(item.type);

        return `
            <div class="card ${isCompleted ? 'opacity-75' : ''} hover:shadow-lg transition-all cursor-pointer"
                 data-item-id="${itemId}"
                 onclick="preparationMaterials.openMaterial('${itemId}', ${JSON.stringify(item).replace(/"/g, '&quot;')})">
                <div class="p-6">
                    <div class="flex justify-between items-start mb-3">
                        <span class="text-2xl">${typeIcon}</span>
                        ${isCompleted ? '<span class="text-green-600">✓</span>' : ''}
                    </div>
                    <h4 class="font-semibold text-gray-900 mb-2">${item.title}</h4>
                    <p class="text-sm text-gray-600 mb-3">${item.description}</p>
                    <div class="flex items-center justify-between">
                        <span class="badge badge-${typeColor}">${item.type}</span>
                        <span class="text-sm text-gray-500">⏱ ${item.duration}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Open a material item
     */
    openMaterial(itemId, item) {
        this.currentItem = { id: itemId, ...item };

        // Check if this is an assessment form item
        if (item.isAssessmentForm) {
            this.openAssessmentFormsModal(item);
            return;
        }

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 overflow-y-auto';
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-600 bg-opacity-75" onclick="preparationMaterials.closeModal()"></div>
                <div class="relative bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
                    <div class="sticky top-0 bg-white border-b p-6 z-10">
                        <div class="flex justify-between items-start">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">${item.title}</h2>
                                <p class="text-gray-600 mt-1">${item.description}</p>
                            </div>
                            <button class="text-gray-400 hover:text-gray-600"
                                    onclick="preparationMaterials.closeModal()">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="p-6">
                        ${this.renderMaterialContent(item)}
                    </div>

                    <div class="sticky bottom-0 bg-gray-50 border-t p-6">
                        <div class="flex justify-between items-center">
                            <div class="text-sm text-gray-600">
                                <span class="mr-4">Type: ${item.type}</span>
                                <span>Duur: ${item.duration}</span>
                            </div>
                            <div class="flex gap-3">
                                <button class="btn btn-ghost" onclick="preparationMaterials.closeModal()">
                                    Sluiten
                                </button>
                                ${!this.completedItems.has(itemId) ? `
                                    <button class="btn btn-primary"
                                            onclick="preparationMaterials.markComplete('${itemId}')">
                                        Markeer als voltooid
                                    </button>
                                ` : `
                                    <button class="btn btn-secondary"
                                            onclick="preparationMaterials.markIncomplete('${itemId}')">
                                        Markeer als onvoltooid
                                    </button>
                                `}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Open assessment forms selection modal
     */
    openAssessmentFormsModal(item) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 overflow-y-auto';
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-600 bg-opacity-75" onclick="preparationMaterials.closeModal()"></div>
                <div class="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                    <div class="sticky top-0 bg-white border-b p-6 z-10">
                        <div class="flex justify-between items-start">
                            <div>
                                <h2 class="text-2xl font-bold text-gray-900">📋 Assessment Formulieren</h2>
                                <p class="text-gray-600 mt-1">Download de juiste formulieren voor jouw rol</p>
                            </div>
                            <button class="text-gray-400 hover:text-gray-600"
                                    onclick="preparationMaterials.closeModal()">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                          d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="p-6">
                        <!-- Submission Instructions Banner -->
                        <div class="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                            <div class="flex">
                                <div class="flex-shrink-0">
                                    <svg class="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <h3 class="text-sm font-medium text-amber-800">Belangrijke Inleverinstructies</h3>
                                    <div class="mt-2 text-sm text-amber-700">
                                        <ol class="list-decimal list-inside space-y-1">
                                            <li>Print alle formulieren voor jouw rol VÓÓR de sessie</li>
                                            <li>Vul formulieren volledig in tijdens jouw ronde</li>
                                            <li>Geef formulieren aan teamleider direct na de presentatie</li>
                                            <li>Teamleider verzamelt alle documenten in plastic hoes</li>
                                            <li>Teamleider levert complete set in bij docent</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Role Selection Grid -->
                        <h3 class="text-lg font-semibold mb-4">Selecteer je rol:</h3>
                        <div class="grid md:grid-cols-2 gap-4 mb-6">
                            ${this.renderAssessmentFormOptions()}
                        </div>

                        <!-- Instructor Requirements -->
                        <div class="bg-gray-50 rounded-lg p-4 mt-6">
                            <h4 class="font-semibold text-gray-900 mb-2">📌 Voor Docenten - Benodigdheden:</h4>
                            <ul class="text-sm text-gray-700 space-y-1">
                                <li>✓ Plastic hoezen (6 per sessie van 2 uur)</li>
                                <li>✓ Nietmachine of perforator</li>
                                <li>✓ Verzameldoos voor ingeleverde dossiers</li>
                                <li>✓ Presentielijst voor aftekenen</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    /**
     * Render assessment form download options
     */
    renderAssessmentFormOptions() {
        const roles = [
            {
                id: 'rvb',
                name: 'Raad van Bestuur (RvB)',
                icon: '👔',
                description: 'Presentatieteam - Alle 13 criteria',
                forms: ['Presentatie Checklist', 'Defense Matrix'],
                focus: 'Moet alle eindkwalificaties aantonen'
            },
            {
                id: 'rvc',
                name: 'Raad van Commissarissen (RvC)',
                icon: '🏛️',
                description: 'Toezicht & Governance',
                forms: ['Governance Assessment'],
                focus: 'Focus op criteria 1, 2, 4, 9, 13'
            },
            {
                id: 'invest',
                name: 'Investeerders',
                icon: '💰',
                description: 'FutureGrowth Capital',
                forms: ['Investment Analysis Sheet'],
                focus: 'Focus op criteria 6, 7, 8, 9'
            },
            {
                id: 'toezicht',
                name: 'Toezichthouder',
                icon: '⚖️',
                description: 'Autoriteit Markt & Maatschappij',
                forms: ['Compliance Assessment'],
                focus: 'Focus op criteria 10, 11, 12, 13'
            },
            {
                id: 'observer',
                name: 'Observator',
                icon: '👀',
                description: 'Peer evaluatie',
                forms: ['Comprehensive Scorecard'],
                focus: 'Beoordeelt alle 13 criteria'
            },
            {
                id: 'teamlead',
                name: 'Teamleider',
                icon: '📁',
                description: 'Document verzameling',
                forms: ['Verzamelformulier'],
                focus: 'VERPLICHT voor documentinlevering'
            }
        ];

        return roles.map(role => `
            <div class="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer ${role.id === 'teamlead' ? 'border-red-500 bg-red-50' : ''}"
                 onclick="preparationMaterials.downloadAssessmentForm('${role.id}')">
                <div class="flex items-start">
                    <span class="text-3xl mr-3">${role.icon}</span>
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900">${role.name}</h4>
                        <p class="text-sm text-gray-600 mt-1">${role.description}</p>
                        <p class="text-xs text-gray-500 mt-2">${role.focus}</p>
                        <div class="mt-3">
                            <span class="text-xs font-medium text-gray-700">Formulieren:</span>
                            <ul class="text-xs text-gray-600 mt-1">
                                ${role.forms.map(form => `<li>• ${form}</li>`).join('')}
                            </ul>
                        </div>
                        <button class="btn btn-primary btn-sm mt-3">
                            📥 Download PDF
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Download assessment form for specific role
     */
    async downloadAssessmentForm(role) {
        try {
            // Show loading state
            this.showNotification(`Formulieren voor ${role} worden gegenereerd...`, 'info');

            // Generate the PDF
            const result = await pdfGenerator.generateAssessmentForms(role, {
                role: role,
                date: new Date().toLocaleDateString('nl-NL')
            });

            // Track download
            stateManager.set(`materials.downloads.${role}`, new Date().toISOString());

            this.showNotification(`Formulieren succesvol gedownload!`, 'success');
        } catch (error) {
            console.error('Failed to generate assessment forms:', error);
            this.showNotification('Fout bij genereren formulieren', 'error');
        }
    }

    /**
     * Render material content based on type
     */
    renderMaterialContent(item) {
        let content = '<div class="space-y-4">';

        // Add type-specific content
        switch(item.type) {
            case 'forms':
                content += `
                    <div class="bg-blue-50 rounded-lg p-6">
                        <h3 class="font-semibold text-blue-900 mb-3">📋 Assessment Formulieren</h3>
                        <p class="text-blue-800 mb-4">Klik hier om de formulieren voor jouw rol te downloaden.</p>
                        <button class="btn btn-primary" onclick="preparationMaterials.openAssessmentFormsModal()">
                            Open Formulieren Selectie
                        </button>
                    </div>
                `;
                break;

            case 'instructions':
                content += `
                    <div class="bg-amber-50 rounded-lg p-6">
                        <h3 class="font-semibold text-amber-900 mb-3">📌 Inleverinstructies</h3>
                        <div class="text-amber-800 space-y-3">
                            <p><strong>Voor de sessie:</strong> Print alle benodigde formulieren</p>
                            <p><strong>Tijdens de sessie:</strong> Vul formulieren volledig in</p>
                            <p><strong>Na je presentatie:</strong> Geef aan teamleider</p>
                            <p><strong>Teamleider:</strong> Verzamel in plastic hoes → Lever in bij docent</p>
                        </div>
                    </div>
                `;
                break;

            case 'criteria':
                content += `
                    <div class="bg-green-50 rounded-lg p-6">
                        <h3 class="font-semibold text-green-900 mb-3">📊 13 Eindkwalificaties</h3>
                        <div class="text-green-800 space-y-2 text-sm">
                            <p><strong>1-2:</strong> Conjunctuur & macro-economie</p>
                            <p><strong>3-5:</strong> Markt, bedrijfskolom & B2C/B2B</p>
                            <p><strong>6-9:</strong> Elasticiteit, kosten, innovatie & marktvorm</p>
                            <p><strong>10-13:</strong> Overheid, brede welvaart, true pricing & CSRD</p>
                        </div>
                    </div>
                `;
                break;

            case 'video':
                content += `
                    <div class="bg-gray-100 rounded-lg aspect-video flex items-center justify-center">
                        <div class="text-center">
                            <span class="text-6xl mb-4 block">🎥</span>
                            <p class="text-gray-600">Video content placeholder</p>
                        </div>
                    </div>
                `;
                break;

            case 'quiz':
                content += `
                    <div class="bg-blue-50 rounded-lg p-6">
                        <h3 class="font-semibold text-blue-900 mb-3">Quiz Vragen</h3>
                        <p class="text-blue-800">Interactieve quiz content komt hier...</p>
                    </div>
                `;
                break;

            case 'template':
                content += `
                    <div class="bg-gray-50 rounded-lg p-6">
                        <h3 class="font-semibold text-gray-900 mb-3">Download Template</h3>
                        <button class="btn btn-primary">
                            📥 Download ${item.title}
                        </button>
                    </div>
                `;
                break;
        }

        // Add content points
        content += `
            <div>
                <h3 class="font-semibold text-gray-900 mb-3">Belangrijkste Punten:</h3>
                <ul class="space-y-2">
                    ${item.content.map(point => `
                        <li class="flex items-start">
                            <span class="text-primary-600 mr-2 mt-0.5">•</span>
                            <span class="text-gray-700">${point}</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        // Add notes section
        content += `
            <div>
                <h3 class="font-semibold text-gray-900 mb-3">Jouw Notities:</h3>
                <textarea class="input textarea"
                          placeholder="Maak hier je notities..."
                          rows="4"
                          id="material-notes"></textarea>
                <button class="btn btn-sm btn-ghost mt-2"
                        onclick="preparationMaterials.saveNotes('${item.id}')">
                    💾 Notities opslaan
                </button>
            </div>
        `;

        content += '</div>';
        return content;
    }

    /**
     * Close modal
     */
    closeModal() {
        const modal = document.querySelector('.fixed.inset-0.z-50');
        if (modal) {
            modal.remove();
        }
    }

    /**
     * Mark item as complete
     */
    markComplete(itemId) {
        this.completedItems.add(itemId);
        this.saveProgress();
        this.updateProgress();
        this.closeModal();

        // Update UI
        const card = document.querySelector(`[data-item-id="${itemId}"]`);
        if (card) {
            card.classList.add('opacity-75');
            const checkmark = document.createElement('span');
            checkmark.className = 'text-green-600';
            checkmark.textContent = '✓';
            card.querySelector('.flex.justify-between').appendChild(checkmark);
        }

        this.showNotification('Material gemarkeerd als voltooid', 'success');
    }

    /**
     * Mark item as incomplete
     */
    markIncomplete(itemId) {
        this.completedItems.delete(itemId);
        this.saveProgress();
        this.updateProgress();
        this.closeModal();

        this.showNotification('Material gemarkeerd als onvoltooid', 'info');
    }

    /**
     * Save progress to state
     */
    saveProgress() {
        const completedArray = Array.from(this.completedItems);
        stateManager.set('materials.completed', completedArray);
    }

    /**
     * Update overall progress
     */
    updateProgress() {
        const progress = this.calculateProgress();

        if (progress.percentage === 100) {
            stateManager.set('progress.modules.preparationMaterials', true);
        } else {
            stateManager.set('progress.modules.preparationMaterials', false);
        }
    }

    /**
     * Calculate progress
     */
    calculateProgress() {
        const total = this.getTotalItems();
        const completed = this.completedItems.size;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        return { total, completed, percentage };
    }

    /**
     * Get total number of items
     */
    getTotalItems() {
        return this.materials.reduce((sum, category) => sum + category.items.length, 0);
    }

    /**
     * Export to PDF
     */
    async exportToPDF() {
        const progress = this.calculateProgress();

        // Check if progress is sufficient
        if (progress.percentage < 50) {
            this.showNotification('Minimaal 50% voortgang vereist voor PDF export', 'warning');
            return;
        }

        try {
            // Gather user data from state
            const userData = {
                user: stateManager.get('user'),
                progress: stateManager.get('progress'),
                team: stateManager.get('team'),
                materials: {
                    completed: Array.from(this.completedItems),
                    total: this.getTotalItems()
                }
            };

            // Generate PDF
            const result = await pdfGenerator.generateWithUI('summary', userData);

            // Track PDF generation in progress
            stateManager.set('progress.pdfGenerated', true);
            stateManager.set('progress.lastPdfDate', new Date().toISOString());

        } catch (error) {
            console.error('PDF generation failed:', error);
            this.showNotification('Fout bij genereren PDF', 'error');
        }
    }

    /**
     * Export role-specific materials
     */
    async exportRoleMaterials() {
        const role = stateManager.get('user.role');

        if (!role) {
            this.showNotification('Selecteer eerst een rol', 'warning');
            return;
        }

        try {
            // Gather role-specific materials
            const roleMaterials = this.getRoleMaterials(role);

            // Generate PDF
            const result = await pdfGenerator.generateWithUI('materials', {
                role: role,
                materials: roleMaterials
            });

        } catch (error) {
            console.error('Role materials PDF generation failed:', error);
            this.showNotification('Fout bij genereren rolmaterialen PDF', 'error');
        }
    }

    /**
     * Get materials for specific role
     */
    getRoleMaterials(role) {
        const materials = [];

        // Add role-specific content based on role
        switch(role) {
            case 'rvb':
                materials.push({
                    title: 'Strategische Focus Punten',
                    content: 'Als Raad van Bestuur bent u verantwoordelijk voor: strategievorming, operationele beslissingen, stakeholder management, en waardecreatie. Focus op innovatie, marktpositie, en financiële prestaties.'
                });
                materials.push({
                    title: 'Verwachte Vragen',
                    content: 'Bereid u voor op vragen over: groeistrategie, kostenbeheersing, marktuitbreiding, digitale transformatie, en duurzaamheidsinitiatieven.'
                });
                break;
            case 'rvc':
                materials.push({
                    title: 'Toezicht Prioriteiten',
                    content: 'Als Raad van Commissarissen ligt uw focus op: governance, risicobeheer, compliance, lange termijn continuïteit, en toezicht op het bestuur.'
                });
                materials.push({
                    title: 'Aandachtsgebieden',
                    content: 'Let specifiek op: interne controle systemen, strategische risico\'s, remuneratie beleid, en onafhankelijkheid van toezicht.'
                });
                break;
            case 'or':
                materials.push({
                    title: 'Werknemersbelangen',
                    content: 'Als Ondernemingsraad vertegenwoordigt u: arbeidsvoorwaarden, werkgelegenheid, werkomstandigheden, en organisatiecultuur.'
                });
                materials.push({
                    title: 'Discussiepunten',
                    content: 'Belangrijke onderwerpen: reorganisaties, arbeidsvoorwaarden, werk-privé balans, ontwikkelingsmogelijkheden, en veiligheid.'
                });
                break;
            case 'invest':
                materials.push({
                    title: 'Investeringsfocus',
                    content: 'Als Investeerders richt u zich op: ROI, groeistrategieën, marktpositie, financiële gezondheid, en exit strategieën.'
                });
                materials.push({
                    title: 'Financiële Metrics',
                    content: 'Belangrijke KPI\'s: EBITDA, cash flow, marktaandeel, customer acquisition cost, en lifetime value.'
                });
                break;
            case 'toezicht':
                materials.push({
                    title: 'Regelgevingskader',
                    content: 'Als Toezichthouder bewaakt u: wettelijke compliance, consumentenbescherming, marktwerking, en maatschappelijk belang.'
                });
                materials.push({
                    title: 'Toezichtsprioriteiten',
                    content: 'Focus op: naleving regelgeving, transparantie, eerlijke concurrentie, en bescherming van stakeholder belangen.'
                });
                break;
        }

        // Add general materials for all roles
        materials.push({
            title: 'Presentatie Tips',
            content: 'Structureer uw presentatie helder, gebruik data ter ondersteuning, anticipeer op vragen, en houd rekening met de tijdslimiet van 40 minuten.'
        });

        return materials;
    }

    /**
     * Estimate remaining time
     */
    estimateRemainingTime() {
        let totalTime = 0;

        this.materials.forEach(category => {
            category.items.forEach(item => {
                const itemId = `${category.id}-${item.title.toLowerCase().replace(/\s+/g, '-')}`;
                if (!this.completedItems.has(itemId)) {
                    const duration = parseInt(item.duration) || 0;
                    totalTime += duration;
                }
            });
        });

        return totalTime;
    }

    /**
     * Show quick access menu
     */
    showQuickAccess() {
        // Implementation for quick access menu
        this.showNotification('Quick access menu - Coming soon!', 'info');
    }

    /**
     * Save notes
     */
    saveNotes(itemId) {
        const textarea = document.getElementById('material-notes');
        if (textarea) {
            const notes = textarea.value;
            stateManager.set(`materials.notes.${itemId}`, notes);
            this.showNotification('Notities opgeslagen', 'success');
        }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Filter functionality
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-filter]')) {
                const filter = e.target.dataset.filter;
                this.filterMaterials(filter);

                // Update active state
                document.querySelectorAll('[data-filter]').forEach(btn => {
                    btn.classList.remove('filter-active', 'btn-primary');
                    btn.classList.add('btn-ghost');
                });
                e.target.classList.remove('btn-ghost');
                e.target.classList.add('filter-active', 'btn-primary');
            }
        });
    }

    /**
     * Filter materials by category
     */
    filterMaterials(filter) {
        const categories = document.querySelectorAll('.material-category');

        categories.forEach(category => {
            if (filter === 'all' || category.dataset.category === filter) {
                category.style.display = 'block';
            } else {
                category.style.display = 'none';
            }
        });
    }

    /**
     * Get type icon
     */
    getTypeIcon(type) {
        const icons = {
            'document': '📄',
            'video': '🎥',
            'quiz': '❓',
            'interactive': '🎮',
            'template': '📋',
            'guide': '📖',
            'checklist': '✅',
            'framework': '🔧',
            'strategy': '🎯',
            'playbook': '📚',
            'perspective': '👁️',
            'compliance': '⚖️'
        };
        return icons[type] || '📄';
    }

    /**
     * Get type color
     */
    getTypeColor(type) {
        const colors = {
            'video': 'error',
            'quiz': 'warning',
            'interactive': 'success',
            'template': 'info'
        };
        return colors[type] || 'primary';
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        if (window.app && window.app.showNotification) {
            window.app.showNotification(message, type);
        }
    }

    /**
     * Render docent preparation section
     */
    renderDocentSection() {
        return `
            <div class="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 mb-8">
                <div class="flex items-start gap-3 mb-4">
                    <span class="text-3xl">👨‍🏫</span>
                    <div class="flex-1">
                        <h3 class="text-xl font-bold text-amber-900 mb-2">Docenten Voorbereiding - Assessment Checklist</h3>
                        <p class="text-amber-800 text-sm">Deze sectie is alleen zichtbaar voor docenten. Zorg dat alle items afgevinkt zijn vóór aanvang van het assessment.</p>
                    </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6 mt-6">
                    <!-- Sessie Voorbereiding -->
                    <div class="bg-white rounded-lg p-5">
                        <h4 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span class="text-lg">📋</span>
                            Sessie Voorbereiding
                        </h4>
                        <div class="space-y-3">
                            <label class="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input type="checkbox" class="mt-1 docent-checklist-item" data-item="plastic-hoezen">
                                <div class="flex-1">
                                    <div class="font-medium">Plastic hoezen</div>
                                    <div class="text-sm text-gray-600">6 stuks per sessie van 2 uur (1 per team)</div>
                                </div>
                            </label>
                            <label class="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input type="checkbox" class="mt-1 docent-checklist-item" data-item="nietmachine">
                                <div class="flex-1">
                                    <div class="font-medium">Nietmachine of perforator</div>
                                    <div class="text-sm text-gray-600">Voor het bundelen van documenten</div>
                                </div>
                            </label>
                            <label class="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input type="checkbox" class="mt-1 docent-checklist-item" data-item="verzameldoos">
                                <div class="flex-1">
                                    <div class="font-medium">Verzameldoos</div>
                                    <div class="text-sm text-gray-600">Voor ingeleverde dossiers (1 per sessie)</div>
                                </div>
                            </label>
                            <label class="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input type="checkbox" class="mt-1 docent-checklist-item" data-item="presentielijst">
                                <div class="flex-1">
                                    <div class="font-medium">Presentielijst</div>
                                    <div class="text-sm text-gray-600">Voor aftekenen aanwezigheid teams</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- Documentatie & Beoordeling -->
                    <div class="bg-white rounded-lg p-5">
                        <h4 class="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <span class="text-lg">📝</span>
                            Documentatie & Beoordeling
                        </h4>
                        <div class="space-y-3">
                            <label class="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input type="checkbox" class="mt-1 docent-checklist-item" data-item="beoordelingsformulieren">
                                <div class="flex-1">
                                    <div class="font-medium">Beoordelingsformulieren</div>
                                    <div class="text-sm text-gray-600">1 set per team (digitaal of print)</div>
                                </div>
                            </label>
                            <label class="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input type="checkbox" class="mt-1 docent-checklist-item" data-item="rotatieschema">
                                <div class="flex-1">
                                    <div class="font-medium">Rotatieschema geprint</div>
                                    <div class="text-sm text-gray-600">Voor overzicht tijdens sessie</div>
                                </div>
                            </label>
                            <label class="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input type="checkbox" class="mt-1 docent-checklist-item" data-item="timer">
                                <div class="flex-1">
                                    <div class="font-medium">Timer/klok</div>
                                    <div class="text-sm text-gray-600">Zichtbaar voor alle teams (40 min per ronde)</div>
                                </div>
                            </label>
                            <label class="flex items-start gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input type="checkbox" class="mt-1 docent-checklist-item" data-item="eindkwalificaties">
                                <div class="flex-1">
                                    <div class="font-medium">Eindkwalificaties lijst</div>
                                    <div class="text-sm text-gray-600">Voor referentie tijdens beoordeling</div>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions voor Docenten -->
                <div class="mt-6 flex flex-wrap gap-3">
                    <button class="btn btn-secondary" onclick="preparationMaterials.printRotationSchedule()">
                        <span>🖨️</span> Print Rotatieschema
                    </button>
                    <button class="btn btn-secondary" onclick="preparationMaterials.downloadAssessmentForms()">
                        <span>📄</span> Download Beoordelingsformulieren
                    </button>
                    <button class="btn btn-secondary" onclick="preparationMaterials.generatePresenceList()">
                        <span>✅</span> Genereer Presentielijst
                    </button>
                </div>

                <div class="mt-6 p-4 bg-amber-100 rounded-lg">
                    <h5 class="font-semibold text-amber-900 mb-2">💡 Pro Tip voor Docenten</h5>
                    <p class="text-sm text-amber-800">
                        Start 15 minuten vóór de eerste ronde met het uitdelen van materialen en het instrueren van de teamleiders.
                        Zorg dat elk team hun rotatieschema kent en weet welke rol zij in elke ronde vervullen.
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * Print rotation schedule
     */
    printRotationSchedule() {
        window.open('/toetsing.html#/schema?print=true', '_blank');
    }

    /**
     * Download assessment forms
     */
    downloadAssessmentForms() {
        // Trigger download of all assessment forms
        const roles = ['RvB', 'RvC', 'Investeerders', 'Toezichthouder', 'Observer', 'Teamleader'];
        roles.forEach(role => {
            pdfGenerator.generateAssessmentForms(role);
        });
    }

    /**
     * Generate presence list
     */
    generatePresenceList() {
        pdfGenerator.generatePresenceList();
    }
}

// Create singleton instance
const preparationMaterials = new PreparationMaterials();

// Export for use in other modules
export default preparationMaterials;

// Also expose globally
if (typeof window !== 'undefined') {
    window.preparationMaterials = preparationMaterials;
}