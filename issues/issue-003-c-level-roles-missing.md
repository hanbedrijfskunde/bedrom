# Issue #003: C-Level Role Distribution Missing Within RvB Teams

## Priority: MEDIUM
**Component**: Team Coordination / Role Selection
**Status**: Not Implemented
**Impacts**: Presentation structure, individual accountability, grading

## Problem Description
The toetsprogramma specifies that RvB teams must have 4 distinct C-level roles (CEO, CFO, COO, CSO) with specific responsibilities. Currently, teams can select "RvB" but cannot distribute these sub-roles among team members.

## Expected Behavior (per Toetsprogramma)

### RvB Role Distribution:
1. **CEO (Chief Executive Officer)**
   - Leads presentation
   - Presents strategic overview
   - Manages time and transitions

2. **CFO (Chief Financial Officer)**
   - Macro-economic variables
   - Cost structures
   - Financial implications of ESG/True Pricing

3. **COO (Chief Operations Officer)**
   - Business column analysis
   - Market structure
   - Regulatory impact on operations

4. **CSO (Chief Sustainability Officer)**
   - Societal costs analysis
   - True Pricing presentation
   - ESG framework application

## Current Behavior
- Teams can only select "RvB" as a whole
- No individual role assignment
- No clear presentation structure
- No individual accountability tracking

## Proposed Solution

### 1. Extend Role Selection Component
```javascript
// js/components/role-selection.js extension
class RvBRoleDistribution {
    constructor(teamMembers) {
        this.roles = {
            CEO: {
                assigned: null,
                responsibilities: [
                    'Strategische visie presenteren',
                    'Presentatie leiden',
                    'Tijd bewaken'
                ]
            },
            CFO: {
                assigned: null,
                responsibilities: [
                    'Macro-economische analyse',
                    'Kostenstructuur uitleggen',
                    'Financiële impact ESG'
                ]
            },
            COO: {
                assigned: null,
                responsibilities: [
                    'Bedrijfskolom analyseren',
                    'Marktstructuur presenteren',
                    'Operationele impact'
                ]
            },
            CSO: {
                assigned: null,
                responsibilities: [
                    'Maatschappelijke kosten',
                    'True Pricing toelichten',
                    'ESG-framework'
                ]
            }
        };
    }

    assignRole(member, role) {
        if (!this.roles[role]) throw new Error('Invalid role');
        if (this.roles[role].assigned) throw new Error('Role already assigned');
        this.roles[role].assigned = member;
    }
}
```

### 2. UI for Role Distribution
```html
<!-- Role assignment modal -->
<div class="rvb-role-distribution">
    <h3>Verdeel C-Level Rollen</h3>
    <div class="role-grid">
        <div class="role-card" data-role="CEO">
            <h4>CEO</h4>
            <select class="member-select">
                <option>Kies teamlid...</option>
            </select>
            <ul class="responsibilities">
                <li>Strategische visie</li>
                <li>Presentatie leiden</li>
            </ul>
        </div>
        <!-- Repeat for CFO, COO, CSO -->
    </div>
</div>
```

## Tests Required

### Unit Tests
```javascript
describe('RvB Role Distribution', () => {
    test('Should have exactly 4 C-level roles', () => {
        const distribution = new RvBRoleDistribution();
        const roles = Object.keys(distribution.roles);
        expect(roles).toEqual(['CEO', 'CFO', 'COO', 'CSO']);
    });

    test('Should assign role to team member', () => {
        const distribution = new RvBRoleDistribution();
        const member = { id: '1', name: 'John Doe' };

        distribution.assignRole(member, 'CEO');
        expect(distribution.roles.CEO.assigned).toBe(member);
    });

    test('Should prevent duplicate role assignments', () => {
        const distribution = new RvBRoleDistribution();
        const member1 = { id: '1', name: 'John' };
        const member2 = { id: '2', name: 'Jane' };

        distribution.assignRole(member1, 'CEO');
        expect(() => {
            distribution.assignRole(member2, 'CEO');
        }).toThrow('Role already assigned');
    });

    test('Should validate all roles assigned before presentation', () => {
        const distribution = new RvBRoleDistribution();
        expect(distribution.isComplete()).toBe(false);

        // Assign all roles
        distribution.assignRole({ id: '1' }, 'CEO');
        distribution.assignRole({ id: '2' }, 'CFO');
        distribution.assignRole({ id: '3' }, 'COO');
        distribution.assignRole({ id: '4' }, 'CSO');

        expect(distribution.isComplete()).toBe(true);
    });
});
```

### Integration Tests
```javascript
describe('RvB Role Distribution UI', () => {
    test('Should show role distribution modal for RvB teams', async () => {
        await page.goto('/toetsing.html#team');
        await page.click('[data-role="rvb"]');

        const modal = await page.$('.rvb-role-distribution');
        expect(modal).toBeTruthy();
    });

    test('Should list all team members in dropdowns', async () => {
        await page.evaluate(() => {
            stateManager.set('team.members', [
                { id: '1', name: 'Alice' },
                { id: '2', name: 'Bob' },
                { id: '3', name: 'Charlie' },
                { id: '4', name: 'Diana' }
            ]);
        });

        const options = await page.$$eval('.member-select option',
            opts => opts.map(o => o.textContent));
        expect(options).toContain('Alice');
        expect(options).toContain('Bob');
        expect(options).toContain('Charlie');
        expect(options).toContain('Diana');
    });

    test('Should prevent starting without complete distribution', async () => {
        await page.click('#start-presentation');

        const error = await page.$eval('.error-message', el => el.textContent);
        expect(error).toContain('Alle C-level rollen moeten toegewezen zijn');
    });

    test('Should save role distribution to state', async () => {
        // Assign all roles
        await page.select('[data-role="CEO"] select', '1');
        await page.select('[data-role="CFO"] select', '2');
        await page.select('[data-role="COO"] select', '3');
        await page.select('[data-role="CSO"] select', '4');

        await page.click('#save-distribution');

        const saved = await page.evaluate(() => {
            return stateManager.get('team.rvbRoles');
        });

        expect(saved.CEO.assigned.id).toBe('1');
        expect(saved.CFO.assigned.id).toBe('2');
    });
});
```

### Accessibility Tests
```javascript
describe('Role Distribution Accessibility', () => {
    test('Should have proper ARIA labels', async () => {
        const selects = await page.$$('[role="combobox"]');
        for (const select of selects) {
            const label = await select.getAttribute('aria-label');
            expect(label).toMatch(/Selecteer teamlid voor \w+ rol/);
        }
    });

    test('Should announce role assignments', async () => {
        await page.select('[data-role="CEO"] select', '1');

        const announcement = await page.$eval('[aria-live="polite"]',
            el => el.textContent);
        expect(announcement).toContain('CEO rol toegewezen aan');
    });
});
```

### Visual Tests
```javascript
describe('Role Distribution Visual', () => {
    test('Should highlight assigned roles', async () => {
        await page.select('[data-role="CEO"] select', '1');

        const card = await page.$('[data-role="CEO"]');
        const classes = await card.getAttribute('class');
        expect(classes).toContain('role-assigned');
    });

    test('Should show completion indicator', async () => {
        // Assign 3 of 4 roles
        await page.select('[data-role="CEO"] select', '1');
        await page.select('[data-role="CFO"] select', '2');
        await page.select('[data-role="COO"] select', '3');

        const progress = await page.$eval('.distribution-progress',
            el => el.textContent);
        expect(progress).toBe('3/4 rollen toegewezen');
    });
});
```

## Acceptance Criteria
- [ ] RvB teams see role distribution interface
- [ ] All 4 C-level roles are available
- [ ] Each role shows clear responsibilities
- [ ] Team members can only have one role
- [ ] Each role can only be assigned once
- [ ] System validates complete distribution before starting
- [ ] Role assignments persist across sessions
- [ ] Individual performance can be tracked per role
- [ ] Role responsibilities are shown during presentation
- [ ] Mobile-friendly role selection interface

## Dependencies
- Team coordination component must be loaded
- State manager must track team members
- Timer component needs role-specific phase indicators

## Technical Requirements
- Role distribution saves to localStorage
- Changes sync across team member devices
- Supports teams of exactly 4 members
- Graceful handling of 3 or 5 member teams

## UI/UX Requirements
- Drag-and-drop interface for role assignment
- Visual confirmation of assignments
- Clear indication of missing assignments
- Role description tooltips
- Responsive card layout