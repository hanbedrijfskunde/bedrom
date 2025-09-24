/**
 * Defense Builder Component - Q&A Practice Tool for RvB Training
 * MVP Version - Phase 1
 */

class DefenseBuilder {
    constructor() {
        this.vragenbank = null;
        this.selectedQuestions = [];
        this.currentQuestionIndex = 0;
        this.currentSubQuestionIndex = 0;
        this.answers = {};
        this.storageKey = 'defense_builder';
        this.sessionStarted = false;
        this.questionCount = 10; // Default number of questions

        // Load saved state from localStorage
        this.loadState();
    }

    async init() {
        console.log('🚀 Initializing Defense Builder MVP...');

        try {
            // Load vragenbank
            const loaded = await this.loadVragenbank();

            if (!loaded) {
                console.error('Failed to load vragenbank, stopping initialization');
                return;
            }

            // Setup event listeners
            this.attachEventListeners();

            // Show start screen if not started yet
            if (!this.sessionStarted) {
                console.log('Showing start screen...');
                this.showStartScreen();
            } else {
                // Resume existing session
                console.log('Resuming existing session...');
                this.displayCurrentQuestion();
            }
        } catch (error) {
            console.error('Error in init():', error);
            this.showError(`Initialisatie fout: ${error.message}`);
        }
    }

    async loadVragenbank() {
        try {
            // Use relative path that works both locally and on GitHub Pages
            const basePath = window.location.pathname.includes('toetsing.html')
                ? window.location.pathname.replace('toetsing.html', '')
                : '/';
            const vraagbankPath = `${basePath}course-docs/toetsing/toetsing-vragenbank-uitgebreid.json`;

            console.log('Fetching vragenbank from', vraagbankPath);
            const response = await fetch(vraagbankPath);

            if (!response.ok) {
                throw new Error(`Failed to load vragenbank: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            console.log('Vragenbank data received:', data);

            this.vragenbank = data;
            console.log(`✅ Loaded ${this.vragenbank.vragen.length} questions`);

            return true;
        } catch (error) {
            console.error('Error loading vragenbank:', error);
            this.showError(`Kon vragenbank niet laden: ${error.message}`);
            return false;
        }
    }

    showStartScreen() {
        const container = document.getElementById('defense-builder-content');
        if (!container) return;

        const html = `
            <div class="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
                <h2 class="text-2xl font-bold text-gray-900 mb-6">🚀 Start je oefensessie</h2>

                <div class="mb-6">
                    <p class="text-gray-600 mb-4">
                        Kies hoeveel vragen je wilt oefenen. De vragen worden willekeurig geselecteerd uit de vragenbank van ${this.vragenbank.vragen.length} vragen.
                    </p>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Aantal vragen:
                    </label>
                    <div class="flex items-center gap-4">
                        <input
                            type="range"
                            id="question-count-slider"
                            min="5"
                            max="${Math.min(75, this.vragenbank.vragen.length)}"
                            value="${this.questionCount}"
                            step="5"
                            class="flex-1"
                        >
                        <span id="question-count-display" class="text-2xl font-bold text-blue-600 w-12 text-center">
                            ${this.questionCount}
                        </span>
                    </div>
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>5</span>
                        <span>${Math.min(75, this.vragenbank.vragen.length)}</span>
                    </div>
                </div>

                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Of kies een vooraf ingestelde set:
                    </label>
                    <div class="grid grid-cols-3 gap-3">
                        <button class="preset-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" data-count="5">
                            Quick (5)
                        </button>
                        <button class="preset-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" data-count="10">
                            Kort (10)
                        </button>
                        <button class="preset-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" data-count="20">
                            Normaal (20)
                        </button>
                        <button class="preset-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" data-count="40">
                            Uitgebreid (40)
                        </button>
                        <button class="preset-btn px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200" data-count="${this.vragenbank.vragen.length}">
                            Alle (${this.vragenbank.vragen.length})
                        </button>
                    </div>
                </div>

                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <p class="text-sm text-blue-800">
                        <strong>💡 Tip:</strong> Begin met een kleinere set om vertrouwd te raken met het format.
                        Je kunt altijd een nieuwe sessie starten met meer vragen.
                    </p>
                </div>

                <button id="start-session" class="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
                    🎯 Start Oefensessie
                </button>
            </div>
        `;

        container.innerHTML = html;
        this.attachStartScreenListeners();
    }

    attachStartScreenListeners() {
        // Slider listener
        const slider = document.getElementById('question-count-slider');
        const display = document.getElementById('question-count-display');

        if (slider && display) {
            slider.addEventListener('input', (e) => {
                this.questionCount = parseInt(e.target.value);
                display.textContent = this.questionCount;
            });
        }

        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const count = parseInt(e.target.dataset.count);
                this.questionCount = count;
                if (slider && display) {
                    slider.value = count;
                    display.textContent = count;
                }
            });
        });

        // Start button
        const startBtn = document.getElementById('start-session');
        if (startBtn) {
            startBtn.addEventListener('click', () => this.startSession());
        }
    }

    startSession() {
        console.log(`Starting session with ${this.questionCount} questions`);

        // Select random questions
        this.selectedQuestions = this.selectRandomQuestions(this.questionCount);
        this.currentQuestionIndex = 0;
        this.currentSubQuestionIndex = 0;
        this.sessionStarted = true;
        this.answers = {};

        // Save state
        this.saveState();

        // Display first question
        this.displayCurrentQuestion();
    }

    selectRandomQuestions(count) {
        const shuffled = [...this.vragenbank.vragen].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(count, shuffled.length));
    }

    displayCurrentQuestion() {
        if (this.currentQuestionIndex >= this.selectedQuestions.length) {
            this.showCompletionScreen();
            return;
        }

        const question = this.selectedQuestions[this.currentQuestionIndex];
        this.renderQuestion(question);
    }

    displayQuestion(questionId) {
        // Legacy support - redirect to displayCurrentQuestion
        this.displayCurrentQuestion();
    }

    renderQuestion(question) {
        const container = document.getElementById('defense-builder-content');
        if (!container) return;

        // Build HTML for question and sub-questions
        const deelvragen = question.deelvragen || [];
        const currentDeelvraag = deelvragen[this.currentSubQuestionIndex] || null;
        const progressPercent = ((this.currentQuestionIndex + 1) / this.selectedQuestions.length * 100);

        const html = `
            <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                <!-- Session Info Bar -->
                <div class="flex justify-between items-center mb-4 pb-4 border-b">
                    <h3 class="text-lg font-semibold text-gray-800">
                        🎯 Oefensessie: ${this.selectedQuestions.length} vragen
                    </h3>
                    <button id="new-session" class="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm">
                        🔄 Nieuwe sessie
                    </button>
                </div>

                <!-- Progress Bar -->
                <div class="mb-6">
                    <div class="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Vraag ${this.currentQuestionIndex + 1} van ${this.selectedQuestions.length}</span>
                        <span>Week ${question.week} - ${question.thema}</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-blue-600 h-2 rounded-full transition-all duration-300"
                             style="width: ${progressPercent}%">
                        </div>
                    </div>
                </div>

                <!-- Stakeholder Context -->
                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <span class="text-2xl">🎯</span>
                        </div>
                        <div class="ml-3">
                            <p class="text-sm font-medium text-blue-900">${question.rol}</p>
                            <p class="text-sm text-blue-800 italic mt-1">${question.context}</p>
                        </div>
                    </div>
                </div>

                <!-- Main Question -->
                <div class="mb-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">Hoofdvraag:</h3>
                    <p class="text-gray-700 leading-relaxed">${question.vraag}</p>
                </div>

                <!-- Sub Questions -->
                ${deelvragen.length > 0 ? `
                    <div class="mb-6">
                        <h4 class="text-md font-semibold text-gray-900 mb-3">
                            Deelvraag ${this.currentSubQuestionIndex + 1} van ${deelvragen.length}:
                        </h4>
                        ${currentDeelvraag ? `
                            <div class="bg-gray-50 rounded-lg p-4 mb-4">
                                <p class="text-gray-800 font-medium mb-2">
                                    ${currentDeelvraag.vraag}
                                </p>
                                <div class="text-sm text-gray-600">
                                    <span class="inline-block bg-gray-200 rounded px-2 py-1 mr-2">
                                        Type: ${currentDeelvraag.type}
                                    </span>
                                    ${currentDeelvraag.hints ? currentDeelvraag.hints.map(hint =>
                                        `<span class="inline-block bg-yellow-100 rounded px-2 py-1 mr-2 mt-2">
                                            💡 ${hint}
                                        </span>`
                                    ).join('') : ''}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}

                <!-- Answer Input -->
                <div class="mb-6">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                        Jouw antwoord:
                    </label>
                    <textarea
                        id="answer-input"
                        class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="6"
                        placeholder="Type hier je antwoord..."
                    >${this.getAnswer(currentDeelvraag?.id || `${question.id}_main`) || ''}</textarea>
                    <div class="flex justify-between mt-2 text-sm text-gray-500">
                        <span id="char-count">0 karakters</span>
                        <span>Min. 100 karakters aanbevolen</span>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-3">
                    <button id="save-answer"
                            class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                        💾 Opslaan
                    </button>

                    ${this.currentSubQuestionIndex > 0 ? `
                        <button id="prev-subquestion"
                                class="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                            ← Vorige deelvraag
                        </button>
                    ` : ''}

                    ${this.currentSubQuestionIndex < deelvragen.length - 1 ? `
                        <button id="next-subquestion"
                                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            Volgende deelvraag →
                        </button>
                    ` : ''}

                    ${this.currentSubQuestionIndex === deelvragen.length - 1 && this.currentQuestionIndex < this.selectedQuestions.length - 1 ? `
                        <button id="next-question"
                                class="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                            Volgende vraag →
                        </button>
                    ` : ''}

                    ${this.currentSubQuestionIndex === deelvragen.length - 1 && this.currentQuestionIndex === this.selectedQuestions.length - 1 ? `
                        <button id="complete-session"
                                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            ✅ Sessie afronden
                        </button>
                    ` : ''}

                    <button id="clear-storage"
                            class="ml-auto px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
                        🗑️ Wis alle antwoorden
                    </button>
                </div>

                <!-- Saved Notification -->
                <div id="save-notification"
                     class="hidden mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                    ✅ Antwoord opgeslagen!
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.attachQuestionEventListeners();
        this.updateCharCount();
    }

    attachEventListeners() {
        // This is called once on init
    }

    attachQuestionEventListeners() {
        // Save answer
        const saveBtn = document.getElementById('save-answer');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveCurrentAnswer());
        }

        // Character count
        const textarea = document.getElementById('answer-input');
        if (textarea) {
            textarea.addEventListener('input', () => this.updateCharCount());
        }

        // Navigation
        const prevSubBtn = document.getElementById('prev-subquestion');
        if (prevSubBtn) {
            prevSubBtn.addEventListener('click', () => this.navigateSubQuestion(-1));
        }

        const nextSubBtn = document.getElementById('next-subquestion');
        if (nextSubBtn) {
            nextSubBtn.addEventListener('click', () => this.navigateSubQuestion(1));
        }

        const nextQuestionBtn = document.getElementById('next-question');
        if (nextQuestionBtn) {
            nextQuestionBtn.addEventListener('click', () => this.navigateQuestion(1));
        }

        // Complete session
        const completeBtn = document.getElementById('complete-session');
        if (completeBtn) {
            completeBtn.addEventListener('click', () => this.showCompletionScreen());
        }

        // New session
        const newSessionBtn = document.getElementById('new-session');
        if (newSessionBtn) {
            newSessionBtn.addEventListener('click', () => this.startNewSession());
        }

        // Clear storage
        const clearBtn = document.getElementById('clear-storage');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.confirmClearStorage());
        }
    }

    saveCurrentAnswer() {
        const textarea = document.getElementById('answer-input');
        const question = this.selectedQuestions[this.currentQuestionIndex];
        const deelvragen = question.deelvragen || [];
        const currentDeelvraag = deelvragen[this.currentSubQuestionIndex];

        const answerId = currentDeelvraag ? currentDeelvraag.id : `${question.id}_main`;
        const answer = textarea.value.trim();

        if (answer.length < 10) {
            this.showNotification('Antwoord is te kort. Probeer meer detail toe te voegen.', 'warning');
            return;
        }

        // Save to memory and localStorage
        this.answers[answerId] = answer;
        this.saveState();

        this.showNotification('Antwoord opgeslagen!', 'success');
    }

    navigateSubQuestion(direction) {
        // Save current answer first
        this.saveCurrentAnswer();

        this.currentSubQuestionIndex += direction;
        this.displayCurrentQuestion();
    }

    navigateQuestion(direction) {
        // Save current answer first
        this.saveCurrentAnswer();

        this.currentQuestionIndex += direction;
        this.currentSubQuestionIndex = 0;
        this.displayCurrentQuestion();
    }

    updateCharCount() {
        const textarea = document.getElementById('answer-input');
        const counter = document.getElementById('char-count');
        if (textarea && counter) {
            const count = textarea.value.length;
            counter.textContent = `${count} karakters`;
            counter.className = count >= 100 ? 'text-green-600' : 'text-gray-500';
        }
    }

    getAnswer(answerId) {
        return this.answers[answerId] || '';
    }

    showNotification(message, type = 'success') {
        const notification = document.getElementById('save-notification');
        if (!notification) return;

        notification.textContent = type === 'success' ? `✅ ${message}` : `⚠️ ${message}`;
        notification.className = type === 'success'
            ? 'mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg'
            : 'mt-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-lg';

        notification.classList.remove('hidden');

        setTimeout(() => {
            notification.classList.add('hidden');
        }, 3000);
    }

    confirmClearStorage() {
        if (confirm('Weet je zeker dat je alle antwoorden wilt wissen? Dit kan niet ongedaan worden gemaakt.')) {
            this.clearStorage();
        }
    }

    showCompletionScreen() {
        const container = document.getElementById('defense-builder-content');
        if (!container) return;

        const answeredCount = Object.keys(this.answers).length;
        const totalPossible = this.selectedQuestions.reduce((acc, q) =>
            acc + 1 + (q.deelvragen ? q.deelvragen.length : 0), 0);

        const html = `
            <div class="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
                <h2 class="text-3xl font-bold text-green-600 mb-4">🎉 Sessie voltooid!</h2>

                <div class="mb-6">
                    <p class="text-xl text-gray-700 mb-4">
                        Je hebt ${this.selectedQuestions.length} vragen doorlopen.
                    </p>
                    <div class="bg-gray-100 rounded-lg p-4">
                        <div class="text-sm text-gray-600">Beantwoorde deelvragen:</div>
                        <div class="text-2xl font-bold text-blue-600">${answeredCount} / ${totalPossible}</div>
                    </div>
                </div>

                <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
                    <p class="text-sm text-blue-800">
                        <strong>💡 Volgende stappen:</strong><br>
                        • Bespreek je antwoorden met je team<br>
                        • Oefen het presenteren van je antwoorden<br>
                        • Identificeer kennishiaten voor verdere studie
                    </p>
                </div>

                <div class="flex gap-3 justify-center">
                    <button id="new-session-complete" class="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700">
                        🔄 Nieuwe sessie starten
                    </button>
                    <button id="export-answers" class="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
                        💾 Exporteer antwoorden
                    </button>
                </div>
            </div>
        `;

        container.innerHTML = html;

        // Attach event listeners
        const newSessionBtn = document.getElementById('new-session-complete');
        if (newSessionBtn) {
            newSessionBtn.addEventListener('click', () => this.startNewSession());
        }

        const exportBtn = document.getElementById('export-answers');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.exportAnswers());
        }
    }

    startNewSession() {
        // Reset session
        this.sessionStarted = false;
        this.selectedQuestions = [];
        this.currentQuestionIndex = 0;
        this.currentSubQuestionIndex = 0;
        this.answers = {};

        // Show start screen
        this.showStartScreen();
    }

    exportAnswers() {
        const exportData = {
            session_date: new Date().toISOString(),
            questions_count: this.selectedQuestions.length,
            answers: {}
        };

        // Collect all answers with question context
        this.selectedQuestions.forEach(question => {
            const questionKey = `Vraag ${question.id}: ${question.vraag}`;
            exportData.answers[questionKey] = {
                hoofdvraag: this.answers[`${question.id}_main`] || 'Niet beantwoord',
                deelvragen: {}
            };

            if (question.deelvragen) {
                question.deelvragen.forEach(dv => {
                    exportData.answers[questionKey].deelvragen[dv.vraag] =
                        this.answers[dv.id] || 'Niet beantwoord';
                });
            }
        });

        // Download as JSON
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportName = `defense-builder-answers-${new Date().getTime()}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportName);
        linkElement.click();

        this.showNotification('Antwoorden geëxporteerd!', 'success');
    }

    clearStorage() {
        this.answers = {};
        this.selectedQuestions = [];
        this.currentQuestionIndex = 0;
        this.currentSubQuestionIndex = 0;
        this.sessionStarted = false;
        localStorage.removeItem(this.storageKey);

        // Show start screen
        this.showStartScreen();
        this.showNotification('Alle antwoorden zijn gewist', 'success');
    }

    saveState() {
        const state = {
            answers: this.answers,
            selectedQuestions: this.selectedQuestions,
            currentQuestionIndex: this.currentQuestionIndex,
            currentSubQuestionIndex: this.currentSubQuestionIndex,
            sessionStarted: this.sessionStarted,
            questionCount: this.questionCount,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem(this.storageKey, JSON.stringify(state));
    }

    loadState() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            if (saved) {
                const state = JSON.parse(saved);
                this.answers = state.answers || {};
                this.selectedQuestions = state.selectedQuestions || [];
                this.currentQuestionIndex = state.currentQuestionIndex || 0;
                this.currentSubQuestionIndex = state.currentSubQuestionIndex || 0;
                this.sessionStarted = state.sessionStarted || false;
                this.questionCount = state.questionCount || 10;
                console.log('✅ Loaded saved state:', Object.keys(this.answers).length, 'answers');
            }
        } catch (error) {
            console.error('Error loading saved state:', error);
        }
    }

    showError(message) {
        const container = document.getElementById('defense-builder-content');
        if (container) {
            container.innerHTML = `
                <div class="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong>Error:</strong> ${message}
                </div>
            `;
        }
    }

    render() {
        return `
            <div class="defense-builder-container">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">
                        🎯 Economic Defense Builder
                    </h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        Oefen met het beantwoorden van boardroom vragen.
                        Bouw systematisch je verdediging op met deelvragen en bewaar je beste antwoorden.
                    </p>
                </div>

                <div id="defense-builder-content">
                    <div class="text-center py-8">
                        <div class="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full animate-spin">
                            <span class="text-2xl">⚙️</span>
                        </div>
                        <p class="mt-4 text-gray-600">Vragenbank wordt geladen...</p>
                    </div>
                </div>
            </div>
        `;
    }
}

export default new DefenseBuilder();