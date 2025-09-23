# Issue #002: Timer Has Incorrect Phases and Durations

## Priority: HIGH
**Component**: Timer
**Status**: Incorrectly Implemented
**File**: js/components/timer.js
**Impacts**: Assessment flow, time management, fairness

## Problem Description
The timer component currently has 7 phases with incorrect durations that don't match the official draaiboek. This breaks the entire 40-minute assessment structure.

## Expected Behavior (per Draaiboek)
Total duration: **40 minutes** with 5 phases:

| Phase | Duration | Description |
|-------|----------|-------------|
| Voorbereiding & Opstelling | 2 min | Teams take positions, introduction |
| Presentatie door RvB | 15 min | RvB presents analysis |
| Kruisverhoor - RvC | 5 min | Questions from Raad van Commissarissen |
| Kruisverhoor - Investeerders | 5 min | Questions from FutureGrowth Capital |
| Kruisverhoor - Toezichthouder | 5 min | Questions from AMM |
| Analyse & Conclusie | 5 min | Observers deliberate (2 min) + conclusions (3 min) |
| Feedback & Afronding | 3 min | Instructor feedback and transition |

## Current Behavior
```javascript
// INCORRECT implementation
this.phases = [
    { name: 'Introductie', duration: 120, color: 'blue' },
    { name: 'Presentatie RvB', duration: 480, color: 'green' },
    { name: 'Q&A Sessie', duration: 600, color: 'yellow' }, // Wrong: should be 3x5min
    { name: 'Discussie', duration: 480, color: 'orange' },  // Doesn't exist
    { name: 'Stemming', duration: 300, color: 'purple' },   // Doesn't exist
    { name: 'Reflectie', duration: 300, color: 'indigo' },  // Doesn't exist
    { name: 'Afsluiting', duration: 120, color: 'gray' }
];
```

## Proposed Solution

### Correct Timer Implementation
```javascript
class Timer {
    constructor() {
        this.phases = [
            {
                name: 'Voorbereiding & Opstelling',
                duration: 120, // 2 minutes
                color: 'gray',
                description: 'Teams nemen plaats, docent introduceert'
            },
            {
                name: 'RvB Presentatie',
                duration: 900, // 15 minutes
                color: 'blue',
                description: 'Presentatie economische analyse'
            },
            {
                name: 'Vragen RvC',
                duration: 300, // 5 minutes
                color: 'purple',
                description: 'Raad van Commissarissen stelt vragen'
            },
            {
                name: 'Vragen Investeerders',
                duration: 300, // 5 minutes
                color: 'green',
                description: 'FutureGrowth Capital stelt vragen'
            },
            {
                name: 'Vragen Toezichthouder',
                duration: 300, // 5 minutes
                color: 'orange',
                description: 'AMM stelt vragen'
            },
            {
                name: 'Analyse & Conclusies',
                duration: 300, // 5 minutes (2 min overleg + 3 min presentatie)
                color: 'indigo',
                description: 'Observers: 2 min overleg, 3 min conclusies'
            },
            {
                name: 'Docent Feedback',
                duration: 180, // 3 minutes
                color: 'red',
                description: 'Feedback en overgang naar volgende ronde'
            }
        ];

        this.totalTime = 2400; // 40 minutes total
    }
}
```

## Tests Required

### Unit Tests
```javascript
describe('Timer Phases', () => {
    test('Should have exactly 7 phases totaling 40 minutes', () => {
        const timer = new Timer();
        expect(timer.phases.length).toBe(7);
        const total = timer.phases.reduce((sum, phase) => sum + phase.duration, 0);
        expect(total).toBe(2400); // 40 minutes in seconds
    });

    test('RvB Presentation should be 15 minutes', () => {
        const timer = new Timer();
        const presentation = timer.phases.find(p => p.name.includes('RvB'));
        expect(presentation.duration).toBe(900);
    });

    test('Each stakeholder Q&A should be 5 minutes', () => {
        const timer = new Timer();
        const qaPhases = timer.phases.filter(p => p.name.includes('Vragen'));
        expect(qaPhases).toHaveLength(3);
        qaPhases.forEach(phase => {
            expect(phase.duration).toBe(300);
        });
    });

    test('Should transition between phases correctly', () => {
        const timer = new Timer();
        timer.start();

        // Fast-forward to phase 2
        timer.remainingTime = 2280; // 38 minutes remaining
        expect(timer.getCurrentPhase().name).toBe('RvB Presentatie');

        // Fast-forward to phase 3
        timer.remainingTime = 1380; // 23 minutes remaining
        expect(timer.getCurrentPhase().name).toBe('Vragen RvC');
    });
});
```

### Integration Tests
```javascript
describe('Timer Display Integration', () => {
    test('Should display phase name and time remaining', async () => {
        await page.goto('/toetsing.html#timer');
        await page.click('#start-timer');

        const phaseName = await page.$eval('.phase-name', el => el.textContent);
        expect(phaseName).toBe('Voorbereiding & Opstelling');

        const timeDisplay = await page.$eval('.time-remaining', el => el.textContent);
        expect(timeDisplay).toBe('02:00');
    });

    test('Should show warning when phase ending', async () => {
        await page.click('#start-timer');
        // Fast-forward to last 30 seconds of phase
        await page.evaluate(() => {
            timer.remainingPhaseTime = 30;
        });

        const warning = await page.$('.phase-warning');
        expect(warning).toBeTruthy();
        const warningClass = await warning.getAttribute('class');
        expect(warningClass).toContain('blinking');
    });

    test('Should play sound on phase transition', async () => {
        const audioPlayed = await page.evaluate(() => {
            let played = false;
            timer.audio.phaseChange.play = () => { played = true; };
            timer.transitionToNextPhase();
            return played;
        });
        expect(audioPlayed).toBe(true);
    });
});
```

### Visual Regression Tests
```javascript
describe('Timer Visual Display', () => {
    test('Should display progress bar correctly', async () => {
        await page.goto('/toetsing.html#timer');
        const screenshot = await page.screenshot({
            clip: { x: 0, y: 0, width: 800, height: 200 }
        });
        expect(screenshot).toMatchImageSnapshot();
    });

    test('Should color-code phases correctly', async () => {
        const colors = await page.evaluate(() => {
            return timer.phases.map(p => p.color);
        });
        expect(colors).toEqual(['gray', 'blue', 'purple', 'green', 'orange', 'indigo', 'red']);
    });
});
```

### Performance Tests
```javascript
describe('Timer Performance', () => {
    test('Should update without lag', async () => {
        const startTime = Date.now();
        await page.evaluate(() => {
            timer.start();
            for (let i = 0; i < 100; i++) {
                timer.tick();
            }
        });
        const endTime = Date.now();
        expect(endTime - startTime).toBeLessThan(200); // Should complete in under 200ms
    });
});
```

## Acceptance Criteria
- [ ] Timer has exactly 7 phases matching the draaiboek
- [ ] Total duration is exactly 40 minutes
- [ ] Phase transitions occur at correct times
- [ ] Visual indicators show current phase clearly
- [ ] Warning appears 30 seconds before phase end
- [ ] Sound plays on phase transition
- [ ] Timer can be paused/resumed
- [ ] Timer state persists on page refresh
- [ ] Instructor can manually advance phases
- [ ] Mobile view shows simplified display

## Breaking Changes
- Existing saved timer states will be invalid
- Need migration script for localStorage data
- UI components expecting old phase names need updates

## Dependencies
- Audio files for phase transitions
- Visual design for new phase colors
- Update to progress tracker component

## Technical Requirements
- Timer accuracy within 100ms
- No memory leaks during 2-hour sessions
- Works offline
- Syncs across tabs (if multiple windows open)