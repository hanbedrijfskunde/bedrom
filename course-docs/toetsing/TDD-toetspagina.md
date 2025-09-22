# Technical Design Document (TDD) - De Strategische Arena Assessment Page

## 1. Executive Summary

### 1.1 Document Purpose
Dit Technical Design Document (TDD) biedt een complete technische blauwdruk voor de implementatie van "De Strategische Arena" assessment voorbereidingspagina. Het combineert frontend architectuur, UX design patterns, en implementatiestrategieën voor een robuuste, gebruiksvriendelijke applicatie.

### 1.2 Project Scope
- **Type**: Single-page web applicatie met offline capabilities
- **Gebruikers**: HBO Bedrijfskunde jaar 2 studenten en docenten
- **Platform**: Browser-based (desktop, tablet, mobile)
- **Timeline**: 6-8 weken development cyclus

### 1.3 Key Objectives
- Stress-reductie door intuïtieve gebruikerservaring
- Complete voorbereiding op boardroom simulatie assessment
- Offline toegankelijkheid voor essentiële functies
- Mobile-first responsive design
- WCAG 2.1 AA toegankelijkheid

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend Application                  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   UI Layer   │  │ State Layer  │  │ Service Layer│ │
│  │              │  │              │  │              │ │
│  │ - Components │◄─┤ - AppState   │◄─┤ - DataSync   │ │
│  │ - Templates  │  │ - Reducers   │  │ - Storage    │ │
│  │ - Styles     │  │ - Actions    │  │ - Offline    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
├─────────────────────────────────────────────────────────┤
│                    Browser APIs                         │
│  LocalStorage | IndexedDB | ServiceWorker | Cache API  │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Component Architecture

```javascript
// Main Application Structure
toetsing.html
├── js/
│   ├── core/
│   │   ├── app.js           // Main application controller
│   │   ├── state.js         // State management system
│   │   ├── router.js        // Client-side routing
│   │   └── storage.js       // Persistence layer
│   ├── components/
│   │   ├── role-selector.js     // Role selection component
│   │   ├── timer.js             // Presentation timer
│   │   ├── qa-simulator.js      // Q&A practice tool
│   │   ├── team-builder.js      // Team coordination
│   │   ├── pdf-generator.js     // PDF export functionality
│   │   └── progress-tracker.js  // Progress visualization
│   ├── services/
│   │   ├── data-sync.js        // Data synchronization
│   │   ├── notification.js     // Notification system
│   │   └── offline.js         // Offline functionality
│   └── utils/
│       ├── helpers.js          // Utility functions
│       ├── validators.js       // Input validation
│       └── formatters.js       // Data formatting
├── css/
│   └── custom.css             // Custom styles (if needed)
├── data/
│   ├── roles.json             // Role definitions
│   ├── questions.json         // Q&A question bank
│   └── scenarios.json         // Business scenarios
└── sw.js                      // Service Worker

```

### 2.3 Data Flow Architecture

```javascript
// Unidirectional Data Flow Pattern
User Action → Event Handler → State Action → State Update → UI Re-render
                                   ↓
                            Storage Sync → LocalStorage/IndexedDB
                                   ↓
                            Background Sync → Service Worker
```

## 3. Technical Stack & Dependencies

### 3.1 Core Technologies

```javascript
const TechnologyStack = {
  // Frontend Framework
  framework: 'Vanilla JavaScript (ES6+)',

  // Styling
  styling: {
    framework: 'Tailwind CSS 3.x',
    delivery: 'CDN',
    customization: 'tailwind.config.js'
  },

  // Libraries (Conditional Loading)
  libraries: {
    pdf: {
      name: 'jsPDF',
      version: '2.x',
      loading: 'dynamic',
      usage: 'PDF generation'
    },
    charts: {
      name: 'Chart.js',
      version: '4.x',
      loading: 'conditional',
      usage: 'Progress visualization'
    },
    icons: {
      name: 'Feather Icons',
      version: 'latest',
      loading: 'inline SVG',
      usage: 'UI icons'
    }
  },

  // Browser APIs
  apis: [
    'LocalStorage',
    'SessionStorage',
    'IndexedDB',
    'Service Worker',
    'Cache API',
    'Notification API',
    'Vibration API (mobile)'
  ]
};
```

### 3.2 Browser Support Matrix

| Browser | Minimum Version | Features |
|---------|----------------|----------|
| Chrome | 90+ | Full support |
| Firefox | 88+ | Full support |
| Safari | 14+ | Full support |
| Edge | 90+ | Full support |
| Mobile Chrome | 90+ | Full support + touch |
| Mobile Safari | 14+ | Full support + touch |

## 4. Component Specifications

### 4.1 Role Selection Component

```javascript
class RoleSelector {
  constructor(config) {
    this.roles = [
      {
        id: 'rvb',
        name: 'Raad van Bestuur',
        subRoles: ['CEO', 'CFO', 'COO', 'CSO'],
        color: '#3B82F6',
        icon: 'briefcase',
        description: 'Presenteer en verdedig de economische analyse',
        responsibilities: [
          '15 minuten presentatie',
          'Q&A verdediging',
          'Strategische besluitvorming'
        ]
      },
      {
        id: 'rvc',
        name: 'Raad van Commissarissen',
        color: '#9333EA',
        icon: 'shield',
        description: 'Toezicht en strategisch advies',
        focusAreas: [
          'Conjunctuurgevoeligheid',
          'Strategische positionering',
          'Governance'
        ]
      },
      {
        id: 'investeerders',
        name: 'FutureGrowth Capital',
        color: '#10B981',
        icon: 'trending-up',
        description: 'ROI en groeidpotentieel focus',
        focusAreas: [
          'Marktmacht',
          'Prijselasticiteit',
          'Innovatiekracht'
        ]
      },
      {
        id: 'toezichthouder',
        name: 'Autoriteit Markt & Maatschappij',
        color: '#F97316',
        icon: 'scale',
        description: 'Publiek belang en compliance',
        focusAreas: [
          'Overheidsregulering',
          'True Pricing',
          'CSRD/ESRS'
        ]
      },
      {
        id: 'observatoren',
        name: 'Analisten',
        color: '#6B7280',
        icon: 'eye',
        description: 'Peer-feedback en analyse',
        tasks: [
          'Actief luisteren',
          'Feedback formuleren',
          'Eindoordeel geven'
        ]
      }
    ];

    this.selectedRole = null;
    this.teamAssignment = null;
  }

  selectRole(roleId) {
    const role = this.roles.find(r => r.id === roleId);
    if (!role) throw new Error('Invalid role');

    this.selectedRole = role;
    this.saveToState();
    this.triggerAnimation();
    this.loadRoleContent();
  }

  loadRoleContent() {
    // Dynamically load role-specific content
    return fetch(`/data/roles/${this.selectedRole.id}.json`)
      .then(response => response.json())
      .then(data => this.renderRoleContent(data));
  }
}
```

### 4.2 Presentation Timer Component

```javascript
class PresentationTimer {
  constructor(config = {}) {
    this.phases = [
      { name: 'Setup', duration: 120, color: 'gray' },       // 2 min
      { name: 'Presentatie', duration: 900, color: 'blue' }, // 15 min
      { name: 'Q&A RvC', duration: 300, color: 'purple' },   // 5 min
      { name: 'Q&A Invest', duration: 300, color: 'green' }, // 5 min
      { name: 'Q&A Toezicht', duration: 300, color: 'orange' }, // 5 min
      { name: 'Feedback', duration: 300, color: 'gray' },    // 5 min
      { name: 'Afsluiting', duration: 180, color: 'blue' }   // 3 min
    ];

    this.currentPhase = 0;
    this.timeRemaining = this.phases[0].duration;
    this.isRunning = false;

    this.ui = {
      container: null,
      display: null,
      phaseIndicator: null,
      controls: null
    };

    this.notifications = {
      enabled: true,
      warnings: [300, 60, 30, 10], // seconds before phase end
      sound: true,
      vibration: true
    };
  }

  start() {
    if (this.isRunning) return;

    this.isRunning = true;
    this.interval = setInterval(() => this.tick(), 1000);
    this.updateUI();
    this.logEvent('timer_started');
  }

  tick() {
    this.timeRemaining--;

    // Check phase transition
    if (this.timeRemaining <= 0) {
      this.nextPhase();
    }

    // Check warnings
    if (this.notifications.warnings.includes(this.timeRemaining)) {
      this.triggerWarning(this.timeRemaining);
    }

    this.updateUI();
  }

  updateUI() {
    const phase = this.phases[this.currentPhase];
    const minutes = Math.floor(this.timeRemaining / 60);
    const seconds = this.timeRemaining % 60;

    // Update display
    this.ui.display.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    // Update visual state
    if (this.timeRemaining <= 60) {
      this.ui.container.classList.add('critical');
    } else if (this.timeRemaining <= 300) {
      this.ui.container.classList.add('warning');
    }

    // Update phase indicator
    this.ui.phaseIndicator.textContent = phase.name;
    this.ui.phaseIndicator.style.backgroundColor = phase.color;
  }

  triggerWarning(seconds) {
    // Visual warning
    this.ui.container.classList.add('pulse');

    // Audio warning
    if (this.notifications.sound) {
      this.playSound('warning');
    }

    // Haptic feedback (mobile)
    if (this.notifications.vibration && 'vibrate' in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    // Toast notification
    this.showToast(`${seconds} seconden remaining in ${this.phases[this.currentPhase].name}`);
  }
}
```

### 4.3 Q&A Simulator Component

```javascript
class QASimulator {
  constructor(questionBank) {
    this.questionBank = questionBank;
    this.session = {
      role: null,
      questions: [],
      responses: [],
      startTime: null,
      endTime: null,
      score: 0
    };

    this.config = {
      questionsPerSession: 10,
      timePerQuestion: 120, // seconds
      difficulty: 'adaptive', // easy, medium, hard, adaptive
      categories: ['all'] // filter by category
    };
  }

  async startSession(role, config = {}) {
    this.session.role = role;
    this.session.startTime = Date.now();
    this.config = { ...this.config, ...config };

    // Filter and select questions
    const questions = await this.selectQuestions(role);
    this.session.questions = questions;

    // Initialize first question
    this.currentQuestionIndex = 0;
    this.showQuestion(questions[0]);
  }

  selectQuestions(role) {
    // Filter by role relevance
    let filtered = this.questionBank.filter(q =>
      q.roles.includes(role.id) || q.roles.includes('all')
    );

    // Filter by categories
    if (!this.config.categories.includes('all')) {
      filtered = filtered.filter(q =>
        this.config.categories.some(cat => q.categories.includes(cat))
      );
    }

    // Adaptive difficulty
    if (this.config.difficulty === 'adaptive') {
      return this.selectAdaptiveQuestions(filtered);
    }

    // Fixed difficulty
    filtered = filtered.filter(q => q.difficulty === this.config.difficulty);

    // Random selection
    return this.shuffleArray(filtered).slice(0, this.config.questionsPerSession);
  }

  selectAdaptiveQuestions(questions) {
    const selected = [];
    const difficulties = ['easy', 'medium', 'hard'];
    let currentDifficulty = 0;

    for (let i = 0; i < this.config.questionsPerSession; i++) {
      const difficulty = difficulties[currentDifficulty];
      const available = questions.filter(q =>
        q.difficulty === difficulty && !selected.includes(q)
      );

      if (available.length > 0) {
        const question = available[Math.floor(Math.random() * available.length)];
        selected.push(question);

        // Adjust difficulty based on previous performance
        if (i > 0 && this.session.responses[i - 1]) {
          const lastResponse = this.session.responses[i - 1];
          if (lastResponse.correct && currentDifficulty < 2) {
            currentDifficulty++;
          } else if (!lastResponse.correct && currentDifficulty > 0) {
            currentDifficulty--;
          }
        }
      }
    }

    return selected;
  }

  submitResponse(response) {
    const question = this.session.questions[this.currentQuestionIndex];
    const isCorrect = this.evaluateResponse(question, response);

    const responseData = {
      questionId: question.id,
      response: response,
      correct: isCorrect,
      timeSpent: Date.now() - this.questionStartTime,
      timestamp: Date.now()
    };

    this.session.responses.push(responseData);

    // Show feedback
    this.showFeedback(question, responseData);

    // Update score
    if (isCorrect) {
      this.session.score += question.points || 1;
    }

    // Next question or complete
    if (this.currentQuestionIndex < this.session.questions.length - 1) {
      setTimeout(() => {
        this.currentQuestionIndex++;
        this.showQuestion(this.session.questions[this.currentQuestionIndex]);
      }, 2000);
    } else {
      this.completeSession();
    }
  }
}
```

### 4.4 Team Coordination Component

```javascript
class TeamCoordinator {
  constructor(config) {
    this.team = {
      id: null,
      name: null,
      members: [],
      roles: {},
      status: 'forming', // forming, preparing, ready, presenting
      progress: {}
    };

    this.communication = {
      messages: [],
      announcements: [],
      lastSync: null
    };
  }

  createTeam(teamData) {
    this.team = {
      ...this.team,
      ...teamData,
      id: this.generateTeamId(),
      created: Date.now()
    };

    this.saveToStorage();
    this.broadcastTeamUpdate();
  }

  assignRole(memberId, roleId) {
    // Check role availability
    const roleOccupied = Object.values(this.team.roles).includes(roleId);
    if (roleOccupied) {
      throw new Error('Role already assigned');
    }

    // Assign role
    this.team.roles[memberId] = roleId;

    // Update member status
    const member = this.team.members.find(m => m.id === memberId);
    if (member) {
      member.role = roleId;
      member.status = 'assigned';
    }

    this.checkTeamReadiness();
    this.saveToStorage();
    this.broadcastTeamUpdate();
  }

  checkTeamReadiness() {
    const allRolesAssigned = this.team.members.every(m => m.role);
    const minimumMembers = this.team.members.length >= 4;

    if (allRolesAssigned && minimumMembers) {
      this.team.status = 'ready';
      this.notifyTeamReady();
    }
  }

  updateMemberProgress(memberId, progress) {
    this.team.progress[memberId] = progress;

    // Calculate team progress
    const totalProgress = Object.values(this.team.progress).reduce((sum, p) => sum + p, 0);
    const avgProgress = totalProgress / this.team.members.length;

    this.team.overallProgress = avgProgress;
    this.updateProgressUI(avgProgress);
  }
}
```

### 4.5 PDF Generator Component

```javascript
class PDFGenerator {
  constructor() {
    this.jsPDF = null; // Lazy loaded
    this.templates = {
      'preparation': PreparationTemplate,
      'roleCard': RoleCardTemplate,
      'teamStrategy': TeamStrategyTemplate,
      'checklist': ChecklistTemplate,
      'feedback': FeedbackTemplate
    };
  }

  async generate(templateType, data) {
    // Lazy load jsPDF
    if (!this.jsPDF) {
      await this.loadJsPDF();
    }

    const template = this.templates[templateType];
    if (!template) {
      throw new Error(`Template ${templateType} not found`);
    }

    // Create PDF
    const doc = new this.jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Apply template
    await template.render(doc, data);

    // Save or preview
    return {
      download: () => doc.save(`${templateType}-${Date.now()}.pdf`),
      preview: () => doc.output('bloburl'),
      blob: () => doc.output('blob')
    };
  }

  async loadJsPDF() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
      script.onload = () => {
        this.jsPDF = window.jspdf.jsPDF;
        resolve();
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
}

class PreparationTemplate {
  static async render(doc, data) {
    const { user, role, progress, notes } = data;

    // Header
    doc.setFontSize(20);
    doc.text('De Strategische Arena', 20, 20);
    doc.setFontSize(16);
    doc.text('Voorbereidingsoverzicht', 20, 30);

    // User info
    doc.setFontSize(12);
    doc.text(`Naam: ${user.name}`, 20, 45);
    doc.text(`Rol: ${role.name}`, 20, 52);
    doc.text(`Datum: ${new Date().toLocaleDateString('nl-NL')}`, 20, 59);

    // Progress section
    doc.setFontSize(14);
    doc.text('Voortgang', 20, 75);
    doc.setFontSize(10);

    let yPos = 85;
    progress.forEach(item => {
      const status = item.completed ? '✓' : '○';
      doc.text(`${status} ${item.title}`, 25, yPos);
      yPos += 7;
    });

    // Notes section
    if (notes && notes.length > 0) {
      doc.addPage();
      doc.setFontSize(14);
      doc.text('Persoonlijke Notities', 20, 20);
      doc.setFontSize(10);

      yPos = 30;
      notes.forEach(note => {
        const lines = doc.splitTextToSize(note.content, 170);
        doc.text(lines, 20, yPos);
        yPos += lines.length * 5 + 5;

        if (yPos > 270) {
          doc.addPage();
          yPos = 20;
        }
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.text('Gegenereerd met De Strategische Arena Voorbereidingstool', 20, 290);
  }
}
```

## 5. State Management Design

### 5.1 Application State Structure

```javascript
const ApplicationState = {
  // User Context
  user: {
    id: 'uuid',
    name: 'string',
    email: 'string',
    studyGroup: 'string',
    created: 'timestamp',
    lastActive: 'timestamp'
  },

  // Progress Tracking
  progress: {
    overall: 0, // 0-100 percentage
    sections: {
      roleSelection: { completed: false, timestamp: null },
      materials: { completed: false, timestamp: null, items: [] },
      practice: { completed: false, timestamp: null, sessions: [] },
      team: { completed: false, timestamp: null },
      strategy: { completed: false, timestamp: null }
    },
    milestones: [],
    timeSpent: 0 // seconds
  },

  // Session Data
  session: {
    selectedRole: null,
    team: null,
    rotationSchedule: [],
    practiceResponses: [],
    notes: [],
    downloads: []
  },

  // UI State
  ui: {
    currentView: 'roleSelection', // roleSelection, preparation, practice, team
    activeModal: null,
    sidebarOpen: false,
    theme: 'light',
    fontSize: 'normal',
    loading: false,
    errors: []
  },

  // Cache
  cache: {
    questions: [],
    scenarios: [],
    materials: {},
    lastSync: null,
    version: '1.0.0'
  },

  // Preferences
  preferences: {
    notifications: true,
    sound: true,
    autoSave: true,
    language: 'nl',
    accessibility: {
      highContrast: false,
      reducedMotion: false,
      screenReader: false
    }
  }
};
```

### 5.2 State Management Implementation

```javascript
class StateManager {
  constructor() {
    this.state = this.loadInitialState();
    this.subscribers = [];
    this.middleware = [];
    this.history = [];
  }

  // Initialize state from storage or defaults
  loadInitialState() {
    const stored = localStorage.getItem('strategische-arena-state');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        return this.migrate(parsed);
      } catch (e) {
        console.error('Failed to parse stored state', e);
      }
    }
    return { ...ApplicationState };
  }

  // State updates with immutability
  dispatch(action) {
    // Run middleware
    for (const middleware of this.middleware) {
      action = middleware(action, this.state);
      if (!action) return; // Middleware can cancel action
    }

    // Store previous state for undo
    this.history.push(JSON.parse(JSON.stringify(this.state)));
    if (this.history.length > 20) {
      this.history.shift();
    }

    // Apply action
    const newState = this.reducer(this.state, action);

    // Update state
    this.state = newState;

    // Persist to storage
    this.persist();

    // Notify subscribers
    this.notify(action);
  }

  // Main reducer
  reducer(state, action) {
    switch (action.type) {
      case 'SELECT_ROLE':
        return {
          ...state,
          session: {
            ...state.session,
            selectedRole: action.payload
          },
          ui: {
            ...state.ui,
            currentView: 'preparation'
          }
        };

      case 'UPDATE_PROGRESS':
        return {
          ...state,
          progress: {
            ...state.progress,
            sections: {
              ...state.progress.sections,
              [action.payload.section]: action.payload.data
            },
            overall: this.calculateOverallProgress(state.progress.sections)
          }
        };

      case 'ADD_PRACTICE_RESPONSE':
        return {
          ...state,
          session: {
            ...state.session,
            practiceResponses: [
              ...state.session.practiceResponses,
              action.payload
            ]
          }
        };

      case 'SET_TEAM':
        return {
          ...state,
          session: {
            ...state.session,
            team: action.payload
          }
        };

      case 'UI_SET_VIEW':
        return {
          ...state,
          ui: {
            ...state.ui,
            currentView: action.payload,
            activeModal: null
          }
        };

      case 'UI_SHOW_MODAL':
        return {
          ...state,
          ui: {
            ...state.ui,
            activeModal: action.payload
          }
        };

      case 'UI_SET_LOADING':
        return {
          ...state,
          ui: {
            ...state.ui,
            loading: action.payload
          }
        };

      case 'CACHE_UPDATE':
        return {
          ...state,
          cache: {
            ...state.cache,
            [action.payload.key]: action.payload.value,
            lastSync: Date.now()
          }
        };

      default:
        return state;
    }
  }

  // Calculate overall progress
  calculateOverallProgress(sections) {
    const weights = {
      roleSelection: 10,
      materials: 30,
      practice: 30,
      team: 15,
      strategy: 15
    };

    let totalWeight = 0;
    let completedWeight = 0;

    for (const [key, data] of Object.entries(sections)) {
      totalWeight += weights[key] || 0;
      if (data.completed) {
        completedWeight += weights[key] || 0;
      }
    }

    return totalWeight > 0 ? Math.round((completedWeight / totalWeight) * 100) : 0;
  }

  // Persist to localStorage
  persist() {
    try {
      const serialized = JSON.stringify(this.state);
      localStorage.setItem('strategische-arena-state', serialized);
      localStorage.setItem('strategische-arena-version', this.state.cache.version);
      localStorage.setItem('strategische-arena-timestamp', Date.now().toString());
    } catch (e) {
      console.error('Failed to persist state', e);
    }
  }

  // Subscribe to state changes
  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  // Notify subscribers
  notify(action) {
    this.subscribers.forEach(callback => {
      try {
        callback(this.state, action);
      } catch (e) {
        console.error('Subscriber error', e);
      }
    });
  }

  // Add middleware
  use(middleware) {
    this.middleware.push(middleware);
  }

  // Undo last action
  undo() {
    if (this.history.length > 0) {
      this.state = this.history.pop();
      this.persist();
      this.notify({ type: 'UNDO' });
    }
  }

  // Reset state
  reset() {
    this.state = { ...ApplicationState };
    this.history = [];
    this.persist();
    this.notify({ type: 'RESET' });
  }

  // State migration for version updates
  migrate(state) {
    const currentVersion = '1.0.0';
    const stateVersion = state.cache?.version || '0.0.0';

    if (stateVersion === currentVersion) {
      return state;
    }

    // Migration logic for future versions
    console.log(`Migrating state from ${stateVersion} to ${currentVersion}`);

    return {
      ...ApplicationState,
      ...state,
      cache: {
        ...state.cache,
        version: currentVersion
      }
    };
  }
}
```

## 6. User Experience Design

### 6.1 Visual Design System

```css
/* Design Tokens */
:root {
  /* Colors - Primary Palette */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;
  --color-primary-600: #2563eb;
  --color-primary-700: #1d4ed8;
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  /* Colors - Role Specific */
  --color-role-rvb: #3b82f6;
  --color-role-rvc: #9333ea;
  --color-role-invest: #10b981;
  --color-role-toezicht: #f97316;
  --color-role-observer: #6b7280;

  /* Colors - Semantic */
  --color-success: #22c55e;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #06b6d4;

  /* Typography */
  --font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;

  /* Spacing */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;

  /* Animation */
  --duration-fast: 150ms;
  --duration-normal: 300ms;
  --duration-slow: 500ms;
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);

  /* Breakpoints */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
}
```

### 6.2 Interaction Patterns

```javascript
// Micro-interactions Library
const Interactions = {
  // Card selection animation
  cardSelect: (element) => {
    element.classList.add('transform', 'scale-105', 'shadow-xl');
    element.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
  },

  // Progress celebration
  progressMilestone: (percentage) => {
    if ([25, 50, 75, 100].includes(percentage)) {
      // Trigger confetti animation
      const confetti = document.createElement('div');
      confetti.className = 'confetti-container';
      document.body.appendChild(confetti);

      // Remove after animation
      setTimeout(() => confetti.remove(), 3000);
    }
  },

  // Loading states
  showSkeleton: (container) => {
    const skeleton = `
      <div class="animate-pulse">
        <div class="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    `;
    container.innerHTML = skeleton;
  },

  // Error recovery
  showError: (message, retry) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg z-50';
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <p class="text-red-800">${message}</p>
        ${retry ? '<button class="ml-4 text-red-600 underline">Opnieuw</button>' : ''}
      </div>
    `;
    document.body.appendChild(toast);

    // Auto-dismiss
    setTimeout(() => toast.remove(), 5000);
  },

  // Success feedback
  showSuccess: (message) => {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50';
    toast.innerHTML = `
      <div class="flex items-center gap-3">
        <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <p class="text-green-800">${message}</p>
      </div>
    `;
    document.body.appendChild(toast);

    // Haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(100);
    }

    // Auto-dismiss
    setTimeout(() => toast.remove(), 3000);
  }
};
```

### 6.3 Mobile Touch Interactions

```javascript
class TouchManager {
  constructor(element) {
    this.element = element;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;

    this.gestures = {
      swipeLeft: null,
      swipeRight: null,
      swipeUp: null,
      swipeDown: null,
      pinchZoom: null,
      longPress: null
    };

    this.init();
  }

  init() {
    // Touch start
    this.element.addEventListener('touchstart', (e) => {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;

      // Long press detection
      this.longPressTimer = setTimeout(() => {
        if (this.gestures.longPress) {
          this.gestures.longPress(e);
        }
      }, 500);
    }, { passive: true });

    // Touch move
    this.element.addEventListener('touchmove', (e) => {
      clearTimeout(this.longPressTimer);

      // Pinch zoom detection
      if (e.touches.length === 2) {
        this.handlePinchZoom(e);
      }
    }, { passive: true });

    // Touch end
    this.element.addEventListener('touchend', (e) => {
      clearTimeout(this.longPressTimer);

      this.touchEndX = e.changedTouches[0].clientX;
      this.touchEndY = e.changedTouches[0].clientY;

      this.handleSwipe();
    }, { passive: true });
  }

  handleSwipe() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    const threshold = 50;

    // Horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX > 0 && this.gestures.swipeRight) {
        this.gestures.swipeRight();
      } else if (deltaX < 0 && this.gestures.swipeLeft) {
        this.gestures.swipeLeft();
      }
    }

    // Vertical swipe
    else if (Math.abs(deltaY) > threshold) {
      if (deltaY > 0 && this.gestures.swipeDown) {
        this.gestures.swipeDown();
      } else if (deltaY < 0 && this.gestures.swipeUp) {
        this.gestures.swipeUp();
      }
    }
  }

  handlePinchZoom(e) {
    if (!this.gestures.pinchZoom) return;

    const touch1 = e.touches[0];
    const touch2 = e.touches[1];
    const distance = Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );

    if (!this.lastDistance) {
      this.lastDistance = distance;
      return;
    }

    const scale = distance / this.lastDistance;
    this.gestures.pinchZoom(scale);
    this.lastDistance = distance;
  }

  on(gesture, callback) {
    if (gesture in this.gestures) {
      this.gestures[gesture] = callback;
    }
  }
}
```

## 7. Offline & Performance Strategy

### 7.1 Service Worker Implementation

```javascript
// sw.js - Service Worker
const CACHE_NAME = 'strategische-arena-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/toetsing.html',
  '/js/core/app.js',
  '/js/core/state.js',
  '/js/components/role-selector.js',
  '/js/components/timer.js',
  '/css/custom.css',
  '/data/roles.json',
  '/data/questions.json',
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== STATIC_CACHE &&
                   cacheName !== DYNAMIC_CACHE;
          })
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache-first strategy for static assets
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(request).then((response) => {
        return response || fetch(request);
      })
    );
    return;
  }

  // Network-first strategy for API calls
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache if offline
          return caches.match(request);
        })
    );
    return;
  }

  // Stale-while-revalidate for everything else
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        // Update cache with fresh response
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      });

      // Return cached response immediately, update in background
      return cachedResponse || fetchPromise;
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  const db = await openDB();
  const pendingSync = await db.getAll('pending-sync');

  for (const item of pendingSync) {
    try {
      await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.data)
      });

      // Remove from pending after successful sync
      await db.delete('pending-sync', item.id);
    } catch (error) {
      console.error('Sync failed for item', item.id, error);
    }
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nieuwe update beschikbaar',
    icon: '/images/icon-192.png',
    badge: '/images/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('De Strategische Arena', options)
  );
});
```

### 7.2 Performance Optimization

```javascript
class PerformanceOptimizer {
  constructor() {
    this.metrics = {
      FCP: null,  // First Contentful Paint
      LCP: null,  // Largest Contentful Paint
      FID: null,  // First Input Delay
      CLS: null,  // Cumulative Layout Shift
      TTI: null   // Time to Interactive
    };

    this.init();
  }

  init() {
    // Observe performance metrics
    this.observeMetrics();

    // Lazy load images
    this.setupLazyLoading();

    // Code splitting
    this.setupCodeSplitting();

    // Resource hints
    this.addResourceHints();
  }

  observeMetrics() {
    // Largest Contentful Paint
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.metrics.LCP = lastEntry.renderTime || lastEntry.loadTime;
      this.reportMetrics();
    }).observe({ entryTypes: ['largest-contentful-paint'] });

    // First Input Delay
    new PerformanceObserver((entryList) => {
      const firstInput = entryList.getEntries()[0];
      this.metrics.FID = firstInput.processingStart - firstInput.startTime;
      this.reportMetrics();
    }).observe({ entryTypes: ['first-input'] });

    // Cumulative Layout Shift
    let clsValue = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      this.metrics.CLS = clsValue;
    }).observe({ entryTypes: ['layout-shift'] });
  }

  setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    // Observe all images with data-src
    document.querySelectorAll('img[data-src]').forEach((img) => {
      imageObserver.observe(img);
    });
  }

  setupCodeSplitting() {
    // Dynamic imports for heavy components
    const loadComponent = async (componentName) => {
      switch (componentName) {
        case 'pdf-generator':
          return await import('/js/components/pdf-generator.js');
        case 'qa-simulator':
          return await import('/js/components/qa-simulator.js');
        case 'team-builder':
          return await import('/js/components/team-builder.js');
        default:
          return null;
      }
    };

    // Load components on demand
    window.loadComponent = loadComponent;
  }

  addResourceHints() {
    // Preconnect to external origins
    const preconnect = (url) => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      document.head.appendChild(link);
    };

    preconnect('https://fonts.googleapis.com');
    preconnect('https://cdn.tailwindcss.com');

    // Prefetch next likely resources
    const prefetch = (url) => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = url;
      document.head.appendChild(link);
    };

    // Prefetch based on user journey
    if (window.location.pathname === '/toetsing.html') {
      prefetch('/data/questions.json');
      prefetch('/data/scenarios.json');
    }
  }

  reportMetrics() {
    // Send metrics to analytics
    if (window.gtag) {
      window.gtag('event', 'performance', {
        event_category: 'Web Vitals',
        event_label: 'FID',
        value: Math.round(this.metrics.FID),
        non_interaction: true
      });
    }

    // Console logging in development
    if (process.env.NODE_ENV === 'development') {
      console.table(this.metrics);
    }
  }
}
```

## 8. Accessibility Implementation

### 8.1 WCAG 2.1 AA Compliance

```javascript
class AccessibilityManager {
  constructor() {
    this.preferences = {
      reducedMotion: false,
      highContrast: false,
      fontSize: 'normal',
      screenReader: false
    };

    this.init();
  }

  init() {
    // Check user preferences
    this.checkPreferences();

    // Set up keyboard navigation
    this.setupKeyboardNavigation();

    // Add ARIA labels
    this.addAriaLabels();

    // Focus management
    this.setupFocusManagement();

    // Screen reader announcements
    this.setupAnnouncements();
  }

  checkPreferences() {
    // Reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.preferences.reducedMotion = prefersReducedMotion.matches;

    if (this.preferences.reducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    }

    // High contrast
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)');
    this.preferences.highContrast = prefersHighContrast.matches;

    if (this.preferences.highContrast) {
      document.documentElement.classList.add('high-contrast');
    }
  }

  setupKeyboardNavigation() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'sr-only focus:not-sr-only absolute top-0 left-0 p-4 bg-white z-50';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      // Alt + 1-5 for main sections
      if (e.altKey && e.key >= '1' && e.key <= '5') {
        const sections = ['role', 'materials', 'practice', 'team', 'help'];
        const section = sections[parseInt(e.key) - 1];
        this.navigateToSection(section);
      }

      // Escape to close modals
      if (e.key === 'Escape') {
        this.closeActiveModal();
      }

      // Space to pause/play timer
      if (e.key === ' ' && e.target.tagName !== 'BUTTON') {
        e.preventDefault();
        this.toggleTimer();
      }
    });
  }

  addAriaLabels() {
    // Main navigation
    const nav = document.querySelector('nav');
    nav.setAttribute('role', 'navigation');
    nav.setAttribute('aria-label', 'Hoofdnavigatie');

    // Timer
    const timer = document.querySelector('.timer');
    timer.setAttribute('role', 'timer');
    timer.setAttribute('aria-live', 'polite');
    timer.setAttribute('aria-label', 'Presentatie timer');

    // Progress indicators
    document.querySelectorAll('.progress-bar').forEach((bar) => {
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', '100');
      bar.setAttribute('aria-valuenow', bar.dataset.progress || '0');
    });

    // Role cards
    document.querySelectorAll('.role-card').forEach((card) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      card.setAttribute('aria-pressed', 'false');
    });
  }

  setupFocusManagement() {
    // Track focus for modal dialogs
    let previousFocus = null;

    // Modal open
    document.addEventListener('modal-open', (e) => {
      previousFocus = document.activeElement;
      const modal = e.detail.modal;

      // Focus first focusable element
      const focusable = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusable.length > 0) {
        focusable[0].focus();
      }

      // Trap focus within modal
      this.trapFocus(modal);
    });

    // Modal close
    document.addEventListener('modal-close', () => {
      if (previousFocus) {
        previousFocus.focus();
        previousFocus = null;
      }
    });
  }

  trapFocus(element) {
    const focusable = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusable[0];
    const lastFocusable = focusable[focusable.length - 1];

    element.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
          }
        } else {
          // Tab
          if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
          }
        }
      }
    });
  }

  setupAnnouncements() {
    // Create live region for announcements
    const announcer = document.createElement('div');
    announcer.setAttribute('role', 'status');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.id = 'announcer';
    document.body.appendChild(announcer);

    // Announce function
    window.announce = (message, priority = 'polite') => {
      const announcer = document.getElementById('announcer');
      announcer.setAttribute('aria-live', priority);
      announcer.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        announcer.textContent = '';
      }, 1000);
    };
  }
}
```

## 9. Testing Strategy

### 9.1 Unit Testing

```javascript
// tests/unit/state-manager.test.js
describe('StateManager', () => {
  let stateManager;

  beforeEach(() => {
    stateManager = new StateManager();
  });

  describe('Role Selection', () => {
    it('should update selected role in state', () => {
      const role = { id: 'rvb', name: 'Raad van Bestuur' };

      stateManager.dispatch({
        type: 'SELECT_ROLE',
        payload: role
      });

      expect(stateManager.state.session.selectedRole).toEqual(role);
    });

    it('should change view to preparation after role selection', () => {
      stateManager.dispatch({
        type: 'SELECT_ROLE',
        payload: { id: 'rvb' }
      });

      expect(stateManager.state.ui.currentView).toBe('preparation');
    });
  });

  describe('Progress Tracking', () => {
    it('should calculate overall progress correctly', () => {
      stateManager.dispatch({
        type: 'UPDATE_PROGRESS',
        payload: {
          section: 'roleSelection',
          data: { completed: true }
        }
      });

      expect(stateManager.state.progress.overall).toBe(10);
    });
  });
});

// tests/unit/timer.test.js
describe('PresentationTimer', () => {
  let timer;

  beforeEach(() => {
    timer = new PresentationTimer();
  });

  it('should start timer when start is called', () => {
    timer.start();
    expect(timer.isRunning).toBe(true);
  });

  it('should trigger warning at specified times', (done) => {
    timer.timeRemaining = 301;
    timer.notifications.warnings = [300];

    const warningSpy = jest.spyOn(timer, 'triggerWarning');

    timer.start();

    setTimeout(() => {
      expect(warningSpy).toHaveBeenCalledWith(300);
      done();
    }, 1100);
  });
});
```

### 9.2 Integration Testing

```javascript
// tests/integration/user-flow.test.js
describe('Complete User Flow', () => {
  let app;

  beforeEach(async () => {
    // Setup DOM
    document.body.innerHTML = await fetch('/toetsing.html').then(r => r.text());

    // Initialize app
    app = new App();
    await app.init();
  });

  it('should complete role selection flow', async () => {
    // Select role
    const roleCard = document.querySelector('[data-role="rvb"]');
    roleCard.click();

    // Confirm selection
    const confirmButton = document.querySelector('[data-action="confirm-role"]');
    confirmButton.click();

    // Check navigation
    await waitFor(() => {
      expect(app.state.ui.currentView).toBe('preparation');
    });

    // Check role in state
    expect(app.state.session.selectedRole.id).toBe('rvb');
  });

  it('should persist progress across page refresh', async () => {
    // Make progress
    app.stateManager.dispatch({
      type: 'UPDATE_PROGRESS',
      payload: {
        section: 'materials',
        data: { completed: true }
      }
    });

    // Simulate page refresh
    const savedState = localStorage.getItem('strategische-arena-state');

    // Reinitialize app
    const newApp = new App();
    await newApp.init();

    // Check progress persisted
    expect(newApp.state.progress.sections.materials.completed).toBe(true);
  });
});
```

### 9.3 E2E Testing

```javascript
// tests/e2e/assessment-preparation.spec.js
describe('Assessment Preparation E2E', () => {
  beforeEach(async () => {
    await page.goto('http://localhost:5502/toetsing.html');
  });

  it('should complete full preparation journey', async () => {
    // Role selection
    await page.click('[data-role="rvb"]');
    await page.click('[data-action="confirm-role"]');

    // Wait for preparation view
    await page.waitForSelector('.preparation-materials');

    // Complete first material
    await page.click('.material-item:first-child input[type="checkbox"]');

    // Check progress updated
    const progress = await page.$eval('.progress-bar', el => el.getAttribute('aria-valuenow'));
    expect(parseInt(progress)).toBeGreaterThan(0);

    // Start Q&A practice
    await page.click('[data-action="start-practice"]');
    await page.waitForSelector('.qa-simulator');

    // Answer question
    await page.click('.answer-option:first-child');
    await page.click('[data-action="submit-answer"]');

    // Generate PDF
    await page.click('[data-action="generate-pdf"]');

    // Check PDF generated
    const downloadPromise = page.waitForEvent('download');
    await page.click('[data-action="download-pdf"]');
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toContain('preparation');
  });

  it('should work offline after initial load', async () => {
    // Wait for service worker
    await page.waitForTimeout(2000);

    // Go offline
    await page.setOfflineMode(true);

    // Navigate should still work
    await page.reload();

    // Check app loads
    await page.waitForSelector('.role-selector');

    // Select role offline
    await page.click('[data-role="rvb"]');

    // Check works offline
    const selectedRole = await page.$eval('[data-role="rvb"]', el => el.classList.contains('selected'));
    expect(selectedRole).toBe(true);
  });
});
```

### 9.4 Accessibility Testing

```javascript
// tests/accessibility/wcag-compliance.test.js
describe('WCAG 2.1 AA Compliance', () => {
  it('should pass axe accessibility audit', async () => {
    await page.goto('http://localhost:5502/toetsing.html');

    const results = await new AxePuppeteer(page).analyze();
    expect(results.violations).toHaveLength(0);
  });

  it('should be fully keyboard navigable', async () => {
    await page.goto('http://localhost:5502/toetsing.html');

    // Tab through all elements
    let activeElement = await page.evaluate(() => document.activeElement.tagName);
    expect(activeElement).toBe('BODY');

    // Tab to skip link
    await page.keyboard.press('Tab');
    activeElement = await page.evaluate(() => document.activeElement.className);
    expect(activeElement).toContain('skip');

    // Tab through navigation
    await page.keyboard.press('Tab');
    activeElement = await page.evaluate(() => document.activeElement.getAttribute('role'));
    expect(activeElement).toBe('navigation');

    // Test role selection with keyboard
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // Check role selected
    const roleSelected = await page.evaluate(() => {
      return document.querySelector('[data-role="rvb"]').classList.contains('selected');
    });
    expect(roleSelected).toBe(true);
  });

  it('should have proper ARIA labels', async () => {
    await page.goto('http://localhost:5502/toetsing.html');

    // Check timer has ARIA label
    const timerLabel = await page.$eval('.timer', el => el.getAttribute('aria-label'));
    expect(timerLabel).toBe('Presentatie timer');

    // Check progress bars
    const progressBars = await page.$$eval('.progress-bar', bars => {
      return bars.map(bar => ({
        role: bar.getAttribute('role'),
        min: bar.getAttribute('aria-valuemin'),
        max: bar.getAttribute('aria-valuemax')
      }));
    });

    progressBars.forEach(bar => {
      expect(bar.role).toBe('progressbar');
      expect(bar.min).toBe('0');
      expect(bar.max).toBe('100');
    });
  });
});
```

## 10. Deployment & Maintenance

### 10.1 Build Configuration

```javascript
// build.config.js
module.exports = {
  input: 'src/toetsing.html',
  output: 'dist/',

  optimization: {
    minifyHTML: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
    removeEmptyAttributes: true,
    collapseWhitespace: true
  },

  assets: {
    images: {
      formats: ['webp', 'jpg'],
      sizes: [320, 640, 1024, 1920],
      lazy: true
    },
    fonts: {
      subset: true,
      formats: ['woff2', 'woff'],
      display: 'swap'
    }
  },

  pwa: {
    manifest: {
      name: 'De Strategische Arena',
      short_name: 'Arena',
      description: 'Assessment voorbereiding voor Business Economics',
      theme_color: '#3B82F6',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'any',
      icons: [
        {
          src: '/images/icon-192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/images/icon-512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    }
  },

  monitoring: {
    sentry: {
      dsn: process.env.SENTRY_DSN,
      environment: process.env.NODE_ENV
    },
    analytics: {
      gtag: process.env.GTAG_ID
    }
  }
};
```

### 10.2 Deployment Checklist

```markdown
## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing
- [ ] No console errors
- [ ] ESLint clean
- [ ] Code reviewed

### Performance
- [ ] Lighthouse score >90
- [ ] Bundle size <200KB
- [ ] Images optimized
- [ ] Fonts subsetted

### Accessibility
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigable
- [ ] Screen reader tested
- [ ] Color contrast verified

### Browser Testing
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+
- [ ] Mobile browsers

### Security
- [ ] CSP headers configured
- [ ] HTTPS enforced
- [ ] Input sanitization
- [ ] No sensitive data exposed

### Documentation
- [ ] README updated
- [ ] API documented
- [ ] Deployment guide
- [ ] User manual

### Monitoring
- [ ] Error tracking setup
- [ ] Analytics configured
- [ ] Performance monitoring
- [ ] Uptime monitoring
```

## 11. Conclusion

Dit Technical Design Document biedt een complete blauwdruk voor de implementatie van "De Strategische Arena" assessment voorbereidingspagina. De combinatie van robuuste technische architectuur, gebruiksvriendelijke UX patterns, en focus op performance en toegankelijkheid zorgt voor een applicatie die studenten effectief ondersteunt in hun voorbereiding.

### Key Success Factors
- **Stress-reductie**: Intuïtieve interface en progressive disclosure
- **Performance**: <3 seconden laadtijd, offline functionaliteit
- **Accessibility**: WCAG 2.1 AA compliant
- **Maintainability**: Modulaire architectuur en uitgebreide documentatie
- **Scalability**: Service Worker en efficient state management

### Next Steps
1. Development team kick-off en taakverdeling
2. Sprint planning volgens implementation phases
3. Continuous integration/deployment setup
4. User acceptance testing met studenten
5. Iterative improvements based on feedback

Dit document zal worden bijgewerkt gedurende de development cyclus om de laatste ontwikkelingen en learnings te reflecteren.