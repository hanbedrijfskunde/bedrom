/**
 * Q&A Simulator Component - Practice assessment questions with adaptive difficulty
 */

import stateManager from '../core/state-manager.js';

class QASimulator {
    constructor() {
        this.questions = [];
        this.allQuestions = [];
        this.currentQuestion = null;
        this.currentQuestionIndex = 0;
        this.sessionQuestions = [];
        this.sessionAnswers = [];
        this.isSessionActive = false;
        this.questionTimer = null;
        this.timeRemaining = 0;
        this.difficulty = 'medium';
        this.selectedCategories = [];
        this.questionsData = null;
    }

    async init() {
        // Load questions from JSON file
        await this.loadQuestions();

        // Load practice data from state
        const practice = stateManager.get('practice');
        if (practice) {
            this.sessionAnswers = practice.sessionHistory || [];
        }

        // Get user role
        const userRole = stateManager.get('user.role');
        if (userRole) {
            this.filterQuestionsByRole(userRole);
        }
    }

    async loadQuestions() {
        try {
            const response = await fetch('/data/questions.json');
            if (response.ok) {
                this.questionsData = await response.json();
                this.allQuestions = this.questionsData.questions;
                this.questions = [...this.allQuestions];
            }
        } catch (error) {
            console.error('Failed to load questions:', error);
            // Fallback questions if JSON fails to load
            this.allQuestions = this.getFallbackQuestions();
            this.questions = [...this.allQuestions];
        }
    }

    filterQuestionsByRole(role) {
        this.questions = this.allQuestions.filter(q =>
            q.role.includes(role) || q.role.includes('all')
        );
    }

    render() {
        if (this.isSessionActive && this.currentQuestion) {
            return this.renderQuestionView();
        }

        return this.renderStartView();
    }

    renderStartView() {
        const stats = this.getStatistics();

        return `
            <div class="qa-simulator">
                <div class="text-center mb-8">
                    <h2 class="text-3xl font-bold text-gray-900 mb-4">Q&A Simulator</h2>
                    <p class="text-lg text-gray-600 max-w-2xl mx-auto">
                        Oefen met veelvoorkomende assessment vragen.
                        De simulator past zich aan op basis van je antwoorden.
                    </p>
                </div>

                <!-- Statistics -->
                <div class="grid md:grid-cols-4 gap-4 mb-8">
                    <div class="bg-white rounded-lg shadow p-4 text-center">
                        <div class="text-3xl font-bold text-primary-600">${stats.totalAnswered}</div>
                        <div class="text-sm text-gray-600">Vragen beantwoord</div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-4 text-center">
                        <div class="text-3xl font-bold text-green-600">${stats.correctPercentage}%</div>
                        <div class="text-sm text-gray-600">Correct</div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-4 text-center">
                        <div class="text-3xl font-bold text-yellow-600">${stats.avgTime}s</div>
                        <div class="text-sm text-gray-600">Gem. tijd</div>
                    </div>
                    <div class="bg-white rounded-lg shadow p-4 text-center">
                        <div class="text-3xl font-bold text-purple-600">${stats.streak}</div>
                        <div class="text-sm text-gray-600">Beste reeks</div>
                    </div>
                </div>

                <!-- Configuration -->
                <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h3 class="text-xl font-bold text-gray-900 mb-4">Configuratie</h3>

                    <!-- Difficulty Selection -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Moeilijkheidsgraad
                        </label>
                        <div class="grid grid-cols-3 gap-2">
                            <button class="btn ${this.difficulty === 'easy' ? 'btn-primary' : 'btn-ghost'}"
                                    onclick="qaSimulator.setDifficulty('easy')">
                                Makkelijk
                            </button>
                            <button class="btn ${this.difficulty === 'medium' ? 'btn-primary' : 'btn-ghost'}"
                                    onclick="qaSimulator.setDifficulty('medium')">
                                Gemiddeld
                            </button>
                            <button class="btn ${this.difficulty === 'hard' ? 'btn-primary' : 'btn-ghost'}"
                                    onclick="qaSimulator.setDifficulty('hard')">
                                Moeilijk
                            </button>
                        </div>
                    </div>

                    <!-- Category Selection -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Categorieën (selecteer minimaal één)
                        </label>
                        <div class="grid md:grid-cols-3 gap-2">
                            ${this.renderCategoryButtons()}
                        </div>
                    </div>

                    <!-- Number of Questions -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Aantal vragen
                        </label>
                        <select class="input" id="question-count">
                            <option value="5">5 vragen (5 minuten)</option>
                            <option value="10" selected>10 vragen (10 minuten)</option>
                            <option value="15">15 vragen (15 minuten)</option>
                            <option value="20">20 vragen (20 minuten)</option>
                            <option value="25">25 vragen (25 minuten)</option>
                        </select>
                    </div>

                    <!-- Start Button -->
                    <div class="text-center">
                        <button class="btn btn-primary btn-lg" onclick="qaSimulator.startSession()">
                            <span class="mr-2">🚀</span> Start Q&A Sessie
                        </button>
                    </div>
                </div>

                <!-- Tips -->
                <div class="bg-blue-50 rounded-lg p-6">
                    <h3 class="text-lg font-semibold text-blue-900 mb-3">Tips voor succes</h3>
                    <ul class="space-y-2 text-sm text-blue-800">
                        <li class="flex items-start">
                            <span class="text-blue-600 mr-2 mt-0.5">💡</span>
                            <span>Lees de vraag zorgvuldig voordat je antwoordt</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 mr-2 mt-0.5">💡</span>
                            <span>Gebruik de STAR-methode voor gedragsvragen</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 mr-2 mt-0.5">💡</span>
                            <span>Wees specifiek en gebruik concrete voorbeelden</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-blue-600 mr-2 mt-0.5">💡</span>
                            <span>Oefen hardop om je presentatie te verbeteren</span>
                        </li>
                    </ul>
                </div>
            </div>
        `;
    }

    renderQuestionView() {
        const q = this.currentQuestion;
        const progress = ((this.currentQuestionIndex + 1) / this.sessionQuestions.length) * 100;

        return `
            <div class="qa-simulator-question">
                <!-- Header -->
                <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div class="flex justify-between items-center mb-4">
                        <div>
                            <span class="text-sm text-gray-600">Vraag ${this.currentQuestionIndex + 1} van ${this.sessionQuestions.length}</span>
                            <span class="ml-4 badge badge-${this.getDifficultyColor(q.difficulty)}">
                                ${q.difficulty}
                            </span>
                        </div>
                        <div class="text-right">
                            <div class="text-2xl font-bold text-gray-900" id="timer-display">
                                ${this.formatTime(this.timeRemaining)}
                            </div>
                            <div class="text-sm text-gray-600">Tijd resterend</div>
                        </div>
                    </div>

                    <!-- Progress Bar -->
                    <div class="progress">
                        <div class="progress-bar" style="width: ${progress}%"></div>
                    </div>
                </div>

                <!-- Question -->
                <div class="bg-white rounded-lg shadow-lg p-8 mb-6">
                    <div class="mb-4">
                        <span class="badge badge-primary">${this.getCategoryName(q.category)}</span>
                    </div>
                    <h3 class="text-2xl font-bold text-gray-900 mb-6">
                        ${q.question}
                    </h3>

                    <!-- Answer Area -->
                    <div class="mb-6">
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            Jouw antwoord:
                        </label>
                        <textarea class="input textarea"
                                  id="answer-input"
                                  rows="6"
                                  placeholder="Type hier je antwoord..."
                                  onkeyup="qaSimulator.updateAnswerLength()"></textarea>
                        <div class="mt-2 text-sm text-gray-600">
                            <span id="answer-length">0</span> woorden
                        </div>
                    </div>

                    <!-- Keywords to include -->
                    <div class="mb-6">
                        <div class="text-sm text-gray-600 mb-2">Probeer deze termen te gebruiken:</div>
                        <div class="flex flex-wrap gap-2">
                            ${q.keywords.map(keyword => `
                                <span class="badge badge-secondary" id="keyword-${keyword}">
                                    ${keyword}
                                </span>
                            `).join('')}
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex justify-between">
                        <button class="btn btn-ghost" onclick="qaSimulator.skipQuestion()">
                            Skip vraag →
                        </button>
                        <div class="space-x-3">
                            <button class="btn btn-secondary" onclick="qaSimulator.showHint()">
                                💡 Hint
                            </button>
                            <button class="btn btn-primary" onclick="qaSimulator.submitAnswer()">
                                Beantwoord
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Stop Session -->
                <div class="text-center">
                    <button class="btn btn-ghost text-red-600" onclick="qaSimulator.stopSession()">
                        Stop sessie
                    </button>
                </div>
            </div>
        `;
    }

    renderCategoryButtons() {
        const categories = this.getUniqueCategories();
        return categories.map(cat => `
            <button class="btn btn-sm ${this.selectedCategories.includes(cat) ? 'btn-primary' : 'btn-ghost'}"
                    onclick="qaSimulator.toggleCategory('${cat}')">
                ${this.getCategoryName(cat)}
            </button>
        `).join('');
    }

    getUniqueCategories() {
        return [...new Set(this.questions.map(q => q.category))];
    }

    getCategoryName(category) {
        return this.questionsData?.categories?.[category] || category;
    }

    setDifficulty(level) {
        this.difficulty = level;
        this.updateUI();
    }

    toggleCategory(category) {
        const index = this.selectedCategories.indexOf(category);
        if (index > -1) {
            this.selectedCategories.splice(index, 1);
        } else {
            this.selectedCategories.push(category);
        }
        this.updateUI();
    }

    startSession() {
        const count = parseInt(document.getElementById('question-count')?.value || 10);

        if (this.selectedCategories.length === 0) {
            this.showNotification('Selecteer minimaal één categorie', 'warning');
            return;
        }

        // Filter questions
        let availableQuestions = this.questions.filter(q =>
            (this.selectedCategories.includes(q.category)) &&
            (this.difficulty === 'all' || q.difficulty === this.difficulty)
        );

        if (availableQuestions.length < count) {
            // Add more questions if not enough
            availableQuestions = this.questions.filter(q =>
                this.selectedCategories.includes(q.category)
            );
        }

        // Shuffle and select questions
        this.sessionQuestions = this.shuffleArray(availableQuestions).slice(0, count);
        this.currentQuestionIndex = 0;
        this.sessionAnswers = [];
        this.isSessionActive = true;

        // Start first question
        this.loadQuestion(0);
    }

    loadQuestion(index) {
        if (index >= this.sessionQuestions.length) {
            this.endSession();
            return;
        }

        this.currentQuestion = this.sessionQuestions[index];
        this.currentQuestionIndex = index;

        // Start timer
        this.timeRemaining = this.currentQuestion.timeLimit || 60;
        this.startTimer();

        // Update UI
        this.updateUI();
    }

    startTimer() {
        this.stopTimer();
        this.questionTimer = setInterval(() => {
            this.timeRemaining--;
            this.updateTimerDisplay();

            if (this.timeRemaining <= 0) {
                this.submitAnswer(true);
            }
        }, 1000);
    }

    stopTimer() {
        if (this.questionTimer) {
            clearInterval(this.questionTimer);
            this.questionTimer = null;
        }
    }

    updateTimerDisplay() {
        const display = document.getElementById('timer-display');
        if (display) {
            display.textContent = this.formatTime(this.timeRemaining);

            if (this.timeRemaining < 10) {
                display.classList.add('text-red-600');
            }
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${String(secs).padStart(2, '0')}`;
    }

    updateAnswerLength() {
        const textarea = document.getElementById('answer-input');
        const lengthSpan = document.getElementById('answer-length');
        if (textarea && lengthSpan) {
            const words = textarea.value.trim().split(/\s+/).filter(w => w.length > 0);
            lengthSpan.textContent = words.length;

            // Highlight keywords
            this.highlightKeywords(textarea.value);
        }
    }

    highlightKeywords(text) {
        const lowerText = text.toLowerCase();
        this.currentQuestion.keywords.forEach(keyword => {
            const element = document.getElementById(`keyword-${keyword}`);
            if (element) {
                if (lowerText.includes(keyword.toLowerCase())) {
                    element.classList.add('bg-green-500', 'text-white');
                    element.classList.remove('badge-secondary');
                } else {
                    element.classList.remove('bg-green-500', 'text-white');
                    element.classList.add('badge-secondary');
                }
            }
        });
    }

    submitAnswer(timeout = false) {
        const textarea = document.getElementById('answer-input');
        const answer = textarea?.value || '';

        // Stop timer
        this.stopTimer();

        // Calculate score
        const timeUsed = this.currentQuestion.timeLimit - this.timeRemaining;
        const score = this.calculateScore(answer, timeUsed, timeout);

        // Save answer
        this.sessionAnswers.push({
            questionId: this.currentQuestion.id,
            answer: answer,
            score: score,
            timeUsed: timeUsed,
            timeout: timeout
        });

        // Show feedback
        this.showFeedback(score, answer);

        // Load next question after delay
        setTimeout(() => {
            this.loadQuestion(this.currentQuestionIndex + 1);
        }, 3000);
    }

    calculateScore(answer, timeUsed, timeout) {
        if (timeout) return 0;

        let score = 0;
        const lowerAnswer = answer.toLowerCase();

        // Check keyword usage
        const keywordsUsed = this.currentQuestion.keywords.filter(k =>
            lowerAnswer.includes(k.toLowerCase())
        );
        score += (keywordsUsed.length / this.currentQuestion.keywords.length) * 40;

        // Check answer length
        const wordCount = answer.trim().split(/\s+/).filter(w => w.length > 0).length;
        if (wordCount >= 50) score += 30;
        else if (wordCount >= 25) score += 20;
        else if (wordCount >= 10) score += 10;

        // Time bonus
        const timePercentage = (this.currentQuestion.timeLimit - timeUsed) / this.currentQuestion.timeLimit;
        score += timePercentage * 30;

        return Math.round(score);
    }

    showFeedback(score, answer) {
        let feedback = '';
        if (score >= 80) {
            feedback = 'Uitstekend antwoord! 🌟';
        } else if (score >= 60) {
            feedback = 'Goed antwoord! 👍';
        } else if (score >= 40) {
            feedback = 'Redelijk antwoord, kan beter 📈';
        } else {
            feedback = 'Oefen nog wat meer 💪';
        }

        this.showNotification(`Score: ${score}/100 - ${feedback}`, 'info');
    }

    skipQuestion() {
        this.submitAnswer();
    }

    showHint() {
        const hint = `Denk aan: ${this.currentQuestion.keywords.slice(0, 2).join(', ')}...`;
        this.showNotification(hint, 'info');
    }

    stopSession() {
        const confirm = window.confirm('Weet je zeker dat je de sessie wilt stoppen?');
        if (!confirm) return;

        this.stopTimer();
        this.endSession();
    }

    endSession() {
        this.isSessionActive = false;
        this.stopTimer();

        // Calculate session stats
        const totalScore = this.sessionAnswers.reduce((sum, a) => sum + a.score, 0);
        const avgScore = Math.round(totalScore / this.sessionAnswers.length);

        // Save to state
        const practice = stateManager.get('practice') || {};
        practice.questionsAnswered = (practice.questionsAnswered || 0) + this.sessionAnswers.length;
        practice.correctAnswers = (practice.correctAnswers || 0) +
            this.sessionAnswers.filter(a => a.score >= 60).length;
        practice.sessionHistory = [...(practice.sessionHistory || []), ...this.sessionAnswers];
        stateManager.set('practice', practice);

        // Mark module as complete if avg score > 60
        if (avgScore >= 60) {
            stateManager.set('progress.modules.qaSimulator', true);
        }

        // Show results
        this.showResults(avgScore);
    }

    showResults(avgScore) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 z-50 overflow-y-auto';
        modal.innerHTML = `
            <div class="flex items-center justify-center min-h-screen px-4">
                <div class="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
                <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Sessie Resultaten</h2>

                    <div class="text-center mb-6">
                        <div class="text-5xl font-bold text-primary-600 mb-2">${avgScore}/100</div>
                        <div class="text-lg text-gray-600">Gemiddelde score</div>
                    </div>

                    <div class="space-y-3 mb-6">
                        ${this.sessionAnswers.map((a, i) => `
                            <div class="flex justify-between items-center p-2 rounded ${a.score >= 60 ? 'bg-green-50' : 'bg-red-50'}">
                                <span>Vraag ${i + 1}</span>
                                <span class="font-semibold">${a.score}/100</span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="flex justify-end">
                        <button class="btn btn-primary" onclick="qaSimulator.closeResults()">
                            Sluiten
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    closeResults() {
        const modal = document.querySelector('.fixed.inset-0.z-50');
        if (modal) modal.remove();
        this.updateUI();
    }

    getStatistics() {
        const practice = stateManager.get('practice') || {};
        const totalAnswered = practice.questionsAnswered || 0;
        const correctAnswers = practice.correctAnswers || 0;
        const correctPercentage = totalAnswered > 0 ?
            Math.round((correctAnswers / totalAnswered) * 100) : 0;

        // Calculate average time
        const history = practice.sessionHistory || [];
        const avgTime = history.length > 0 ?
            Math.round(history.reduce((sum, a) => sum + a.timeUsed, 0) / history.length) : 0;

        // Calculate best streak
        let currentStreak = 0;
        let bestStreak = 0;
        history.forEach(a => {
            if (a.score >= 60) {
                currentStreak++;
                bestStreak = Math.max(bestStreak, currentStreak);
            } else {
                currentStreak = 0;
            }
        });

        return {
            totalAnswered,
            correctPercentage,
            avgTime,
            streak: bestStreak
        };
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

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    getDifficultyColor(difficulty) {
        const colors = {
            'easy': 'success',
            'medium': 'warning',
            'hard': 'error'
        };
        return colors[difficulty] || 'primary';
    }

    getFallbackQuestions() {
        return [
            {
                id: 1,
                category: 'general',
                difficulty: 'medium',
                role: ['all'],
                question: 'Wat is je strategie voor dit assessment?',
                suggestedAnswer: 'Focus op duidelijke communicatie en concrete voorbeelden.',
                timeLimit: 60,
                keywords: ['strategie', 'communicatie', 'voorbeelden']
            }
        ];
    }
}

// Create singleton instance
const qaSimulator = new QASimulator();

// Export for use in other modules
export default qaSimulator;

// Also expose globally
if (typeof window !== 'undefined') {
    window.qaSimulator = qaSimulator;
}