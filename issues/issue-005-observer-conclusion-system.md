# Issue #005: Observer Conclusion System Incomplete

## Priority: MEDIUM
**Component**: Observer Feedback / Q&A Simulator
**Status**: Partially Implemented
**Impacts**: Peer feedback quality, assessment completeness

## Problem Description
The toetsprogramma specifies that observer teams must give a 1-minute conclusion after 2 minutes of deliberation. While observer forms exist, there's no system to manage the conclusion timing and collection.

## Expected Behavior (per Toetsprogramma)

### Observer Process (5 minutes total):
1. **2 minutes**: Teams deliberate and prepare conclusion
2. **3 minutes**: Each observer team presents 1-minute conclusion
   - Team 1: Minutes 0-1
   - Team 2: Minutes 1-2
   - Team 3 (if applicable): Minutes 2-3

### Conclusion Format:
"Op basis van de presentatie en de ondervraging, adviseren wij..."
- Option A: "te investeren"
- Option B: "de strategie aan te scherpen"
- Option C: "een diepgaander onderzoek te starten naar [specifiek onderwerp]"

## Current Behavior
- Observer scorecard exists but no timing system
- No structured conclusion collection
- No deliberation timer
- No turn management for multiple observer teams

## Proposed Solution

### 1. Observer Conclusion Manager
```javascript
// js/components/observer-conclusion.js
class ObserverConclusionManager {
    constructor() {
        this.state = 'waiting'; // waiting, deliberating, presenting, completed
        this.observerTeams = [];
        this.currentPresenter = null;
        this.conclusions = [];

        this.timers = {
            deliberation: 120, // 2 minutes
            perTeamPresentation: 60, // 1 minute each
            totalPresentation: 180 // 3 minutes max
        };
    }

    startDeliberation() {
        this.state = 'deliberating';
        this.startTimer('deliberation', 120, () => {
            this.startPresentations();
        });
    }

    startPresentations() {
        this.state = 'presenting';
        this.currentPresenter = 0;
        this.nextPresenter();
    }

    nextPresenter() {
        if (this.currentPresenter < this.observerTeams.length) {
            const team = this.observerTeams[this.currentPresenter];
            this.startTimer('presentation', 60, () => {
                this.saveConclusion(team);
                this.currentPresenter++;
                this.nextPresenter();
            });
        } else {
            this.complete();
        }
    }

    saveConclusion(team) {
        const conclusion = {
            team: team.id,
            advice: team.selectedAdvice,
            reasoning: team.reasoning,
            timestamp: Date.now()
        };
        this.conclusions.push(conclusion);
    }
}
```

### 2. Observer Deliberation Interface
```html
<div class="observer-conclusion-panel">
    <!-- Deliberation Phase -->
    <div class="deliberation-phase" v-if="state === 'deliberating'">
        <h3>Overleg Tijd</h3>
        <div class="timer-display">
            <span class="time-remaining">02:00</span>
            <p>Bereid jullie 1-minuut conclusie voor</p>
        </div>

        <div class="conclusion-builder">
            <h4>Ons Advies:</h4>
            <div class="advice-options">
                <label>
                    <input type="radio" name="advice" value="invest">
                    Te investeren
                </label>
                <label>
                    <input type="radio" name="advice" value="refine">
                    De strategie aan te scherpen
                </label>
                <label>
                    <input type="radio" name="advice" value="investigate">
                    Diepgaander onderzoek naar:
                    <input type="text" placeholder="specifiek onderwerp">
                </label>
            </div>

            <div class="reasoning-notes">
                <h4>Hoofdpunten (max 3):</h4>
                <ol>
                    <li><input type="text" placeholder="Punt 1"></li>
                    <li><input type="text" placeholder="Punt 2"></li>
                    <li><input type="text" placeholder="Punt 3"></li>
                </ol>
            </div>
        </div>
    </div>

    <!-- Presentation Phase -->
    <div class="presentation-phase" v-if="state === 'presenting'">
        <h3>Team <span class="current-team"></span> Presenteert</h3>
        <div class="presentation-timer">
            <span class="time-remaining">01:00</span>
            <div class="progress-bar"></div>
        </div>

        <div class="speaker-notes">
            <!-- Display prepared conclusion -->
        </div>

        <button class="next-team-btn" disabled>Volgende Team</button>
    </div>
</div>
```

## Tests Required

### Unit Tests
```javascript
describe('ObserverConclusionManager', () => {
    test('Should initialize with correct timers', () => {
        const manager = new ObserverConclusionManager();
        expect(manager.timers.deliberation).toBe(120);
        expect(manager.timers.perTeamPresentation).toBe(60);
    });

    test('Should transition from deliberation to presentation', (done) => {
        const manager = new ObserverConclusionManager();
        manager.observerTeams = [{ id: 'E' }, { id: 'F' }];

        manager.startDeliberation();
        expect(manager.state).toBe('deliberating');

        // Fast-forward timer
        jest.advanceTimersByTime(120000);

        setTimeout(() => {
            expect(manager.state).toBe('presenting');
            done();
        }, 100);
    });

    test('Should cycle through all observer teams', () => {
        const manager = new ObserverConclusionManager();
        manager.observerTeams = [
            { id: 'E', selectedAdvice: 'invest' },
            { id: 'F', selectedAdvice: 'refine' }
        ];

        manager.startPresentations();

        // First team
        expect(manager.currentPresenter).toBe(0);
        jest.advanceTimersByTime(60000);

        // Second team
        expect(manager.currentPresenter).toBe(1);
        jest.advanceTimersByTime(60000);

        // Completed
        expect(manager.state).toBe('completed');
        expect(manager.conclusions).toHaveLength(2);
    });

    test('Should save conclusions with timestamp', () => {
        const manager = new ObserverConclusionManager();
        const team = {
            id: 'E',
            selectedAdvice: 'investigate',
            reasoning: 'ESG implementation unclear'
        };

        manager.saveConclusion(team);

        expect(manager.conclusions[0]).toMatchObject({
            team: 'E',
            advice: 'investigate',
            reasoning: 'ESG implementation unclear'
        });
        expect(manager.conclusions[0].timestamp).toBeDefined();
    });
});
```

### Integration Tests
```javascript
describe('Observer Conclusion UI', () => {
    test('Should show deliberation timer', async () => {
        await page.goto('/toetsing.html#observer-conclusion');
        await page.click('#start-deliberation');

        const timer = await page.$('.deliberation-phase .time-remaining');
        expect(timer).toBeTruthy();

        const time = await timer.evaluate(el => el.textContent);
        expect(time).toBe('02:00');
    });

    test('Should enable advice selection during deliberation', async () => {
        await page.click('#start-deliberation');

        const radioButtons = await page.$$('input[name="advice"]');
        expect(radioButtons).toHaveLength(3);

        await page.click('input[value="invest"]');

        const selected = await page.$eval('input[name="advice"]:checked',
            el => el.value);
        expect(selected).toBe('invest');
    });

    test('Should show warning at 30 seconds', async () => {
        await page.click('#start-deliberation');

        // Fast-forward to 30 seconds remaining
        await page.evaluate(() => {
            observerManager.timers.deliberation = 30;
        });

        const warning = await page.$('.time-warning');
        expect(warning).toBeTruthy();

        const classes = await warning.getAttribute('class');
        expect(classes).toContain('blinking');
    });

    test('Should auto-advance presenter teams', async () => {
        await page.evaluate(() => {
            observerManager.observerTeams = [
                { id: 'E' }, { id: 'F' }
            ];
        });

        await page.click('#start-presentations');

        // First team
        let currentTeam = await page.$eval('.current-team', el => el.textContent);
        expect(currentTeam).toBe('E');

        // Wait for timer
        await page.waitForTimeout(60000);

        // Second team
        currentTeam = await page.$eval('.current-team', el => el.textContent);
        expect(currentTeam).toBe('F');
    });
});
```

### Accessibility Tests
```javascript
describe('Observer Conclusion Accessibility', () => {
    test('Should announce phase changes', async () => {
        await page.click('#start-deliberation');

        let announcement = await page.$eval('[aria-live="assertive"]',
            el => el.textContent);
        expect(announcement).toContain('Overlegtijd gestart');

        // After deliberation
        await page.evaluate(() => {
            observerManager.startPresentations();
        });

        announcement = await page.$eval('[aria-live="assertive"]',
            el => el.textContent);
        expect(announcement).toContain('Presentaties gestart');
    });

    test('Should have keyboard navigation for advice options', async () => {
        await page.click('#start-deliberation');
        await page.keyboard.press('Tab');

        const focused = await page.evaluate(() =>
            document.activeElement.value);
        expect(focused).toBe('invest');

        await page.keyboard.press('ArrowDown');
        const newFocus = await page.evaluate(() =>
            document.activeElement.value);
        expect(newFocus).toBe('refine');
    });
});
```

### Performance Tests
```javascript
describe('Observer Timer Performance', () => {
    test('Should update timer smoothly', async () => {
        const frameRates = [];

        await page.evaluateOnNewDocument(() => {
            let lastTime = 0;
            window.requestAnimationFrame = (callback) => {
                const currentTime = performance.now();
                const fps = 1000 / (currentTime - lastTime);
                frameRates.push(fps);
                lastTime = currentTime;
                callback();
            };
        });

        await page.click('#start-deliberation');
        await page.waitForTimeout(5000);

        const avgFps = frameRates.reduce((a, b) => a + b) / frameRates.length;
        expect(avgFps).toBeGreaterThan(30); // Minimum 30 FPS
    });
});
```

## Acceptance Criteria
- [ ] 2-minute deliberation timer works correctly
- [ ] Teams can select conclusion type
- [ ] Teams can add reasoning points
- [ ] Presentation order is clear
- [ ] Each team gets exactly 1 minute
- [ ] Timer shows warnings at 10 seconds
- [ ] Conclusions are saved automatically
- [ ] Instructor can skip/pause if needed
- [ ] Works on mobile devices
- [ ] Conclusions export to assessment report

## Dependencies
- Timer component for phase management
- State manager for conclusion storage
- Rotation schedule to identify observer teams
- Export service for reports

## Technical Requirements
- Timer accuracy within 100ms
- Auto-save every 10 seconds
- Supports 2-3 observer teams
- Audio cues for transitions
- Works offline

## UI/UX Requirements
- Large, clear timer display
- Color-coded phases (yellow=prep, green=present)
- Progress indicator for presentations
- Mobile-optimized interface
- Print view for conclusions