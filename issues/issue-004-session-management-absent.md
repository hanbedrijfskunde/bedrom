# Issue #004: Session Management System Absent

## Priority: HIGH
**Component**: Session Dashboard (New)
**Status**: Not Implemented
**Impacts**: Assessment day organization, progress tracking, instructor control

## Problem Description
The toetsprogramma defines 2 sessions (Week 6 and Week 7) with 3 rounds each, but there's no system to manage these sessions. Instructors cannot track which round is current, and students cannot see the overall session progress.

## Expected Behavior (per Toetsprogramma)

### Session Structure:
- **Session 1 (Week 6)**: Rounds 1, 2, 3
- **Session 2 (Week 7)**: Rounds 4, 5, 6
- **Duration**: 2 hours per session (3 x 40 minutes)
- **Break time**: Between rounds for team switches

### Session Flow:
1. Pre-session setup (attendance, tech check)
2. Round 1 (40 minutes)
3. 5-minute transition
4. Round 2 (40 minutes)
5. 5-minute transition
6. Round 3 (40 minutes)
7. Session wrap-up

## Current Behavior
- No session tracking
- No round management
- No break timers
- No progress overview
- No instructor controls

## Proposed Solution

### 1. Create Session Dashboard Component
```javascript
// js/components/session-dashboard.js
class SessionDashboard {
    constructor() {
        this.currentSession = null;
        this.currentRound = null;
        this.sessionState = 'not_started'; // not_started, in_progress, break, completed

        this.sessions = {
            1: {
                week: 6,
                date: null,
                rounds: [1, 2, 3],
                status: 'scheduled',
                startTime: null,
                endTime: null
            },
            2: {
                week: 7,
                date: null,
                rounds: [4, 5, 6],
                status: 'scheduled',
                startTime: null,
                endTime: null
            }
        };
    }

    startSession(sessionNumber) {
        this.currentSession = sessionNumber;
        this.currentRound = this.sessions[sessionNumber].rounds[0];
        this.sessionState = 'in_progress';
        this.sessions[sessionNumber].startTime = Date.now();
    }

    nextRound() {
        const rounds = this.sessions[this.currentSession].rounds;
        const currentIndex = rounds.indexOf(this.currentRound);

        if (currentIndex < rounds.length - 1) {
            this.currentRound = rounds[currentIndex + 1];
            this.sessionState = 'break';
            this.startBreakTimer();
        } else {
            this.completeSession();
        }
    }
}
```

### 2. Instructor Control Panel
```html
<div class="instructor-panel">
    <h2>Session Control</h2>

    <div class="session-selector">
        <button data-session="1">Start Sessie 1 (Week 6)</button>
        <button data-session="2">Start Sessie 2 (Week 7)</button>
    </div>

    <div class="current-status">
        <h3>Huidige Status</h3>
        <p>Sessie: <span id="current-session">-</span></p>
        <p>Ronde: <span id="current-round">-</span></p>
        <p>Fase: <span id="current-phase">-</span></p>
        <p>Tijd resterend: <span id="time-remaining">-</span></p>
    </div>

    <div class="controls">
        <button id="pause-session">Pauzeer</button>
        <button id="next-round">Volgende Ronde</button>
        <button id="end-session">Beëindig Sessie</button>
    </div>

    <div class="attendance">
        <h3>Aanwezigheid</h3>
        <div id="team-attendance"></div>
    </div>
</div>
```

## Tests Required

### Unit Tests
```javascript
describe('SessionDashboard', () => {
    test('Should initialize with 2 sessions', () => {
        const dashboard = new SessionDashboard();
        expect(Object.keys(dashboard.sessions)).toHaveLength(2);
        expect(dashboard.sessions[1].week).toBe(6);
        expect(dashboard.sessions[2].week).toBe(7);
    });

    test('Should start session correctly', () => {
        const dashboard = new SessionDashboard();
        dashboard.startSession(1);

        expect(dashboard.currentSession).toBe(1);
        expect(dashboard.currentRound).toBe(1);
        expect(dashboard.sessionState).toBe('in_progress');
        expect(dashboard.sessions[1].startTime).toBeDefined();
    });

    test('Should transition between rounds', () => {
        const dashboard = new SessionDashboard();
        dashboard.startSession(1);

        dashboard.nextRound();
        expect(dashboard.currentRound).toBe(2);
        expect(dashboard.sessionState).toBe('break');

        dashboard.endBreak();
        expect(dashboard.sessionState).toBe('in_progress');

        dashboard.nextRound();
        expect(dashboard.currentRound).toBe(3);
    });

    test('Should complete session after last round', () => {
        const dashboard = new SessionDashboard();
        dashboard.startSession(1);
        dashboard.currentRound = 3; // Jump to last round

        dashboard.nextRound();
        expect(dashboard.sessionState).toBe('completed');
        expect(dashboard.sessions[1].status).toBe('completed');
        expect(dashboard.sessions[1].endTime).toBeDefined();
    });

    test('Should calculate session duration', () => {
        const dashboard = new SessionDashboard();
        dashboard.startSession(1);

        // Simulate 2 hours passing
        dashboard.sessions[1].startTime = Date.now() - (120 * 60 * 1000);
        dashboard.completeSession();

        const duration = dashboard.getSessionDuration(1);
        expect(duration).toBeCloseTo(120, 1); // 120 minutes
    });
});
```

### Integration Tests
```javascript
describe('Session Dashboard Integration', () => {
    test('Should display session overview', async () => {
        await page.goto('/toetsing.html#dashboard');

        const session1 = await page.$('[data-session="1"]');
        const session2 = await page.$('[data-session="2"]');

        expect(session1).toBeTruthy();
        expect(session2).toBeTruthy();
    });

    test('Should start session when instructor clicks', async () => {
        await page.click('[data-session="1"]');

        const status = await page.$eval('#current-session', el => el.textContent);
        expect(status).toBe('1');

        const round = await page.$eval('#current-round', el => el.textContent);
        expect(round).toBe('1');
    });

    test('Should show break timer between rounds', async () => {
        await page.click('[data-session="1"]');

        // Complete first round
        await page.evaluate(() => {
            timer.completePhase();
        });

        await page.click('#next-round');

        const breakTimer = await page.$('.break-timer');
        expect(breakTimer).toBeTruthy();

        const breakTime = await page.$eval('.break-time', el => el.textContent);
        expect(breakTime).toBe('05:00');
    });

    test('Should track attendance', async () => {
        await page.evaluate(() => {
            stateManager.set('teams', [
                { id: 'A', present: true },
                { id: 'B', present: true },
                { id: 'C', present: false }
            ]);
        });

        const present = await page.$$eval('.team-present', els => els.length);
        expect(present).toBe(2);

        const absent = await page.$$eval('.team-absent', els => els.length);
        expect(absent).toBe(1);
    });
});
```

### Accessibility Tests
```javascript
describe('Session Dashboard Accessibility', () => {
    test('Should announce session state changes', async () => {
        await page.click('[data-session="1"]');

        const announcement = await page.$eval('[aria-live="assertive"]',
            el => el.textContent);
        expect(announcement).toContain('Sessie 1 gestart');
    });

    test('Should have keyboard navigation', async () => {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() =>
            document.activeElement.getAttribute('data-session'));
        expect(focused).toBe('1');

        await page.keyboard.press('Enter');
        const started = await page.evaluate(() =>
            sessionDashboard.currentSession);
        expect(started).toBe(1);
    });
});
```

### Performance Tests
```javascript
describe('Session Dashboard Performance', () => {
    test('Should handle rapid state changes', async () => {
        const dashboard = new SessionDashboard();
        const startTime = performance.now();

        for (let i = 0; i < 100; i++) {
            dashboard.updateState();
            dashboard.calculateProgress();
        }

        const endTime = performance.now();
        expect(endTime - startTime).toBeLessThan(100);
    });

    test('Should not leak memory during 2-hour session', async () => {
        const initialMemory = performance.memory.usedJSHeapSize;

        // Simulate 2-hour session
        for (let i = 0; i < 7200; i++) {
            dashboard.tick(); // Update every second
        }

        const finalMemory = performance.memory.usedJSHeapSize;
        const leak = finalMemory - initialMemory;
        expect(leak).toBeLessThan(10 * 1024 * 1024); // Less than 10MB
    });
});
```

## Acceptance Criteria
- [ ] Dashboard shows both sessions with status
- [ ] Instructor can start/pause/stop sessions
- [ ] Current round is clearly displayed
- [ ] Break timer shows between rounds
- [ ] Attendance can be tracked
- [ ] Progress bar shows session completion
- [ ] Time remaining is always visible
- [ ] Emergency stop button available
- [ ] Session data exports to CSV
- [ ] Works offline during session

## Dependencies
- Timer component for round timing
- Rotation schedule for team assignments
- State manager for persistence
- Export service for reporting

## Technical Requirements
- Real-time updates every second
- No lag during state transitions
- Session state persists on refresh
- Supports concurrent sessions (backup)
- Emergency recovery mode

## UI/UX Requirements
- Clear visual hierarchy
- Color-coded session states
- Large, touch-friendly controls
- High contrast mode
- Fullscreen presentation mode
- Print-friendly session summary