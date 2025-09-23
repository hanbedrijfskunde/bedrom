# API Documentation - De Strategische Arena

## Overview

De Strategische Arena is a client-side application with modular JavaScript components. This document describes the public APIs of each module.

## Core Modules

### StateManager

**Location:** `/js/core/state-manager.js`

#### Methods

##### `get(path)`
Get a value from state using dot notation.
```javascript
const role = stateManager.get('user.role');
// Returns: 'rvb' | 'rvc' | 'or' | 'invest' | 'toezicht' | null
```

##### `set(path, value)`
Set a value in state using dot notation.
```javascript
stateManager.set('user.name', 'Jan de Vries');
stateManager.set('progress.modules.roleSelection', true);
```

##### `on(event, callback)`
Subscribe to state changes.
```javascript
stateManager.on('state:changed', (data) => {
    console.log('State updated:', data);
});
```

##### `reset()`
Reset state to initial values and clear localStorage.
```javascript
stateManager.reset(); // Shows confirmation dialog
```

### Router

**Location:** `/js/core/router.js`

#### Methods

##### `navigate(route)`
Navigate to a specific route.
```javascript
router.navigate('roles'); // Goes to #roles
router.navigate('materials');
```

##### `getCurrentRoute()`
Get the current route.
```javascript
const currentRoute = router.getCurrentRoute();
// Returns: 'home' | 'roles' | 'materials' | 'team' | 'timer' | etc.
```

## Component APIs

### RoleSelection

**Location:** `/js/components/role-selection.js`

#### Methods

##### `selectRole(roleId)`
```javascript
roleSelection.selectRole('rvb');
// Valid roleIds: 'rvb', 'rvc', 'or', 'invest', 'toezicht'
```

##### `selectSubRole(subRole)`
```javascript
roleSelection.selectSubRole('CEO');
// Sub-roles depend on selected main role
```

##### `clearSelection()`
```javascript
roleSelection.clearSelection();
// Resets role selection
```

##### `getStatistics()`
```javascript
const stats = roleSelection.getStatistics();
// Returns: { totalRoles: 5, selectedRole: 'rvb', selectedSubRole: 'CEO', isComplete: true }
```

### PresentationTimer

**Location:** `/js/components/timer.js`

#### Properties
- `totalDuration`: 2400 (40 minutes in seconds)
- `timeRemaining`: Current time left in seconds
- `currentPhase`: Current phase index (0-6)
- `isRunning`: Boolean indicating if timer is active

#### Methods

##### `start()`
```javascript
timer.start(); // Starts the countdown
```

##### `pause()`
```javascript
timer.pause(); // Pauses the countdown
```

##### `reset()`
```javascript
timer.reset(); // Resets to 40:00
```

##### `getCurrentPhase()`
```javascript
const phase = timer.getCurrentPhase();
// Returns: { name: 'Introductie', duration: 180, index: 0 }
```

### ProgressTracker

**Location:** `/js/components/progress-tracker.js`

#### Methods

##### `updateModuleProgress(module, completed)`
```javascript
progressTracker.updateModuleProgress('roleSelection', true);
progressTracker.updateModuleProgress('materials', false);
```

##### `calculateOverallProgress()`
```javascript
const percentage = progressTracker.calculateOverallProgress();
// Returns: 0-100
```

##### `getMilestone()`
```javascript
const milestone = progressTracker.getMilestone();
// Returns: null | 25 | 50 | 75 | 100
```

### QASimulator

**Location:** `/js/components/qa-simulator.js`

#### Methods

##### `startSession(difficulty)`
```javascript
qaSimulator.startSession('medium');
// difficulty: 'easy' | 'medium' | 'hard'
```

##### `submitAnswer(answer)`
```javascript
qaSimulator.submitAnswer('Our strategy focuses on innovation...');
// Returns: { score: 85, feedback: 'Good answer!', keywords: ['strategy', 'innovation'] }
```

##### `getSessionStats()`
```javascript
const stats = qaSimulator.getSessionStats();
// Returns: { questionsAnswered: 5, averageScore: 78, timeSpent: 245 }
```

### TeamCoordination

**Location:** `/js/components/team-coordination.js`

#### Methods

##### `createTeam(name)`
```javascript
const team = teamCoordination.createTeam('Alpha Team');
// Returns: { id: 'abc123', name: 'Alpha Team', inviteCode: 'XYZ789', members: [] }
```

##### `joinTeam(inviteCode)`
```javascript
const success = teamCoordination.joinTeam('XYZ789');
// Returns: true | false
```

##### `addMember(member)`
```javascript
teamCoordination.addMember({
    name: 'Alice Johnson',
    role: 'rvb',
    subRole: 'CEO'
});
```

##### `assignRole(memberId, role)`
```javascript
teamCoordination.assignRole('member-123', 'rvc');
```

## Service APIs

### PDFGenerator

**Location:** `/js/services/pdf-generator.js`

#### Methods

##### `generatePreparationSummary(userData)`
```javascript
const result = await pdfGenerator.generatePreparationSummary({
    user: { name: 'Jan de Vries', role: 'rvb' },
    progress: { modules: { ... } },
    team: { name: 'Alpha', members: [...] }
});
// Returns: { success: true, fileName: 'strategische-arena-jan-de-vries.pdf' }
```

##### `generateRoleMaterials(role, materials)`
```javascript
const result = await pdfGenerator.generateRoleMaterials('rvb', [
    { title: 'Strategic Focus', content: '...' },
    { title: 'Key Metrics', content: '...' }
]);
// Returns: { success: true, fileName: 'strategische-arena-rvb-materialen.pdf' }
```

### OfflineManager

**Location:** `/js/services/offline-manager.js`

#### Properties
- `isOnline`: Boolean indicating connection status
- `registration`: ServiceWorker registration object

#### Methods

##### `checkForUpdates()`
```javascript
await offlineManager.checkForUpdates();
// Checks for service worker updates
```

##### `getCacheStats()`
```javascript
const stats = await offlineManager.getCacheStats();
// Returns: { usage: 1234567, quota: 50000000, percentUsed: '2.47' }
```

### AccessibilityService

**Location:** `/js/services/accessibility.js`

#### Methods

##### `announce(message, urgent)`
```javascript
accessibilityService.announce('Role selected', false);
accessibilityService.announce('Error occurred!', true);
```

##### `trapFocus(element)`
```javascript
const modal = document.querySelector('.modal');
accessibilityService.trapFocus(modal);
```

##### `releaseFocusTrap()`
```javascript
accessibilityService.releaseFocusTrap();
```

### PerformanceOptimizer

**Location:** `/js/services/performance-optimizer.js`

#### Methods

##### `getPerformanceReport()`
```javascript
const report = performanceOptimizer.getPerformanceReport();
// Returns: {
//   metrics: { lcp: 1250, fid: 45, cls: 0.05 },
//   resources: 42,
//   memory: { used: 15234567, total: 50000000 }
// }
```

##### `precacheResources(urls)`
```javascript
performanceOptimizer.precacheResources([
    '/data/additional-questions.json',
    '/images/new-icon.png'
]);
```

## Events

### State Events

```javascript
// Listen for state changes
stateManager.on('state:changed', (data) => {
    console.log('Path changed:', data.path);
    console.log('New value:', data.value);
});

stateManager.on('state:reset', () => {
    console.log('State was reset');
});
```

### Router Events

```javascript
// Listen for route changes
window.addEventListener('hashchange', (event) => {
    console.log('Route changed to:', window.location.hash);
});
```

### Progress Events

```javascript
// Listen for milestone achievements
stateManager.on('milestone:reached', (milestone) => {
    console.log('Milestone reached:', milestone); // 25, 50, 75, or 100
});
```

## Data Structures

### User Object
```typescript
interface User {
    name: string;
    role: 'rvb' | 'rvc' | 'or' | 'invest' | 'toezicht';
    subRole: string;
    email?: string;
}
```

### Progress Object
```typescript
interface Progress {
    modules: {
        roleSelection: boolean;
        materials: boolean;
        economicAnalysis: boolean;
        marketStructure: boolean;
        esgFactors: boolean;
        qaSimulator: boolean;
        teamCoordination: boolean;
        presentation: boolean;
    };
    lastUpdated: string; // ISO date
    pdfGenerated?: boolean;
}
```

### Team Object
```typescript
interface Team {
    id: string;
    name: string;
    inviteCode: string;
    members: TeamMember[];
    createdAt: string; // ISO date
}

interface TeamMember {
    id: string;
    name: string;
    role: string;
    subRole?: string;
    progress?: number;
}
```

### Question Object
```typescript
interface Question {
    id: number;
    category: string;
    difficulty: 'easy' | 'medium' | 'hard';
    role: string[];
    question: string;
    suggestedAnswer: string;
    timeLimit: number; // seconds
    keywords: string[];
}
```

## Error Handling

### Global Error Handler

```javascript
window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
    // Errors are logged but app continues to function
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});
```

### Module-specific Error Handling

```javascript
try {
    await pdfGenerator.generatePreparationSummary(userData);
} catch (error) {
    console.error('PDF generation failed:', error);
    // Show user-friendly error message
    showNotification('Could not generate PDF', 'error');
}
```

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| ES6 Modules | 61+ | 60+ | 11+ | 79+ |
| Service Worker | 40+ | 44+ | 11.1+ | 17+ |
| LocalStorage | 4+ | 3.5+ | 4+ | 12+ |
| IntersectionObserver | 51+ | 55+ | 12.1+ | 15+ |
| CSS Custom Properties | 49+ | 31+ | 9.1+ | 15+ |

## Performance Guidelines

1. **Lazy Loading**: Components are loaded on-demand
2. **Code Splitting**: Use dynamic imports for large modules
3. **Caching**: Service Worker caches all static assets
4. **Debouncing**: Scroll and resize events are debounced
5. **RequestIdleCallback**: Non-critical work is deferred

## Testing

Run tests using the test runner:
```javascript
// Navigate to /test-runner.html
// Or programmatically:
import testSuite from './tests/test-suite.js';
await testSuite.runAll();
```

---

*Last updated: 2025-01-23*