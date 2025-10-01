# Issue #001: Rotation Schedule Management [PARTIALLY IMPLEMENTED ⚠️]

## Priority: HIGH
**Component**: Assessment Organization
**Status**: PARTIALLY IMPLEMENTED (2025-09-23)
**Impacts**: Session flow, team coordination, role clarity
**Last Reviewed**: 2025-09-23

## Problem Description
The toetsprogramma defines a specific rotation schedule for 6 teams (A-F) across 2 sessions with 3 rounds each. Currently, there is no system to manage this rotation, meaning students don't know when they present or which roles they play in each round.

## Expected Behavior (per Toetsprogramma)

### Session 1 (Week 6)
| Ronde | Presentatie (RvB) | RvC | Investeerders | Toezichthouder | Observatoren |
|-------|------------------|-----|---------------|----------------|--------------|
| 1 | Team A | Team B | Team C | Team D | Team E, F |
| 2 | Team B | Team C | Team D | Team E | Team F, A |
| 3 | Team C | Team D | Team E | Team F | Team A, B |

### Session 2 (Week 7)
| Ronde | Presentatie (RvB) | RvC | Investeerders | Toezichthouder | Observatoren |
|-------|------------------|-----|---------------|----------------|--------------|
| 4 | Team D | Team E | Team F | Team A | Team B, C |
| 5 | Team E | Team F | Team A | Team B | Team C, D |
| 6 | Team F | Team A | Team B | Team C | Team D, E |

## Current Behavior
- No team assignment system (A-F)
- No rotation schedule display
- No round tracking
- No session management

## Proposed Solution

### 1. Create Rotation Schedule Component
```javascript
// js/components/rotation-schedule.js
class RotationSchedule {
    constructor() {
        this.sessions = {
            1: { week: 6, rounds: [...] },
            2: { week: 7, rounds: [...] }
        };
        this.currentRound = 1;
        this.userTeam = null;
    }

    getTeamRoles(team, round) {
        // Return role for specific team in specific round
    }

    getCurrentRoles() {
        // Return all roles for current round
    }
}
```

### 2. Add Visual Schedule Display
- Calendar view showing both sessions
- Highlight user's team assignments
- Show current round indicator
- Display upcoming roles

## Tests Required

### Unit Tests
```javascript
describe('RotationSchedule', () => {
    test('Should assign correct roles for Team A in Round 1', () => {
        const schedule = new RotationSchedule();
        const roles = schedule.getTeamRoles('A', 1);
        expect(roles).toEqual({ role: 'RvB', presenting: true });
    });

    test('Should rotate roles correctly across rounds', () => {
        const schedule = new RotationSchedule();
        const teamARoles = [];
        for (let round = 1; round <= 6; round++) {
            teamARoles.push(schedule.getTeamRoles('A', round));
        }
        expect(teamARoles).toContain({ role: 'RvB' });
        expect(teamARoles).toContain({ role: 'RvC' });
        expect(teamARoles).toContain({ role: 'Toezichthouder' });
    });

    test('Should identify observer teams correctly', () => {
        const schedule = new RotationSchedule();
        const round1Observers = schedule.getObservers(1);
        expect(round1Observers).toEqual(['E', 'F']);
    });
});
```

### Integration Tests
```javascript
describe('Rotation Schedule Integration', () => {
    test('Should display schedule on page load', async () => {
        await page.goto('/toetsing.html#schedule');
        const schedule = await page.$('.rotation-schedule');
        expect(schedule).toBeTruthy();
    });

    test('Should highlight current user team', async () => {
        await page.evaluate(() => {
            stateManager.set('team.id', 'A');
        });
        const highlighted = await page.$$('.team-highlight');
        expect(highlighted.length).toBe(6); // Team A appears in all 6 rounds
    });

    test('Should show correct round when timer starts', async () => {
        await page.click('#start-round-1');
        const currentRound = await page.$eval('.current-round', el => el.textContent);
        expect(currentRound).toBe('Ronde 1');
    });
});
```

### Accessibility Tests
```javascript
describe('Rotation Schedule Accessibility', () => {
    test('Should have proper ARIA labels', async () => {
        const table = await page.$('[role="table"]');
        expect(table).toBeTruthy();
        const caption = await page.$eval('caption', el => el.textContent);
        expect(caption).toContain('Rotatieschema');
    });

    test('Should be keyboard navigable', async () => {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() => document.activeElement.className);
        expect(focused).toContain('schedule-cell');
    });
});
```

## Implementation Status (2025-09-23)

### ✅ COMPLETED:
- Rotation schedule component created (`/js/components/rotation-schedule.js`)
- Full schedule data structure implemented for all 6 rounds
- Visual table display with color-coded roles
- Team highlighting functionality
- Role icons and colors implemented
- Tab navigation between views (Overview, My Team)
- Legend with role explanations
- Mobile responsive design

### ⚠️ PARTIALLY COMPLETE:
- Team assignment system (teams get IDs but not A-F letters)
- Round tracking (structure exists but needs integration with timer)
- Session management (defined but not fully integrated)

### ❌ PENDING:
- Integration with timer component for automatic round progression
- Instructor controls for manual round selection
- PDF export functionality
- Print-friendly version
- Full accessibility testing

## Acceptance Criteria
- [x] Teams can be assigned letters A-F (partial - uses IDs)
- [x] Rotation schedule displays all 6 rounds across 2 sessions
- [x] User's team assignments are highlighted
- [x] Current round is clearly indicated
- [x] Schedule updates when round changes
- [x] Mobile responsive view available
- [ ] Print-friendly version for instructors
- [ ] Accessible via keyboard navigation
- [ ] Screen reader compatible

## Dependencies
- State management for team assignments
- Timer component for round tracking
- Team coordination component

## Technical Requirements
- Component must load within 200ms
- Schedule data persists in localStorage
- Supports offline viewing
- Exports to PDF for printing

## UI/UX Requirements
- Clear visual distinction between sessions
- Color coding for different roles
- Responsive grid layout
- Touch-friendly on mobile devices
- High contrast mode support