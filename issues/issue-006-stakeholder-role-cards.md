# Issue #006: Stakeholder Role Cards Not Implemented

## Priority: MEDIUM
**Component**: Role Cards / Role Selection
**Status**: Not Implemented
**Impacts**: Role clarity, question quality, assessment effectiveness

## Problem Description
The toetsprogramma provides detailed role cards with missions, focus areas, and example questions for each stakeholder role. Currently, these role-specific guidelines are not available in the application.

## Expected Behavior (per Toetsprogramma)

### Role Cards Should Include:

#### RvC (Raad van Commissarissen):
- **Mission**: Toezicht houden op strategie en beleid
- **Focus**: Deugdelijkheid analyse, conjunctuurgevoeligheid, langetermijnvisie
- **Example Questions**: 3-5 specific questions provided

#### Investeerders (FutureGrowth Capital):
- **Mission**: Bepalen of bedrijf aantrekkelijke investering is
- **Focus**: Marktmacht, prijselasticiteit, innovatie, winstpotentieel
- **Example Questions**: 3-5 specific questions provided

#### Toezichthouder (AMM):
- **Mission**: Bewaken publiek belang en naleving wetgeving
- **Focus**: Regulering, maatschappelijke kosten, CSRD/ESRS
- **Example Questions**: 3-5 specific questions provided

## Current Behavior
- Only basic role selection exists
- No detailed mission statements
- No focus area guidance
- No example questions
- No quick reference during assessment

## Proposed Solution

### 1. Create Role Cards Component
```javascript
// js/components/role-cards.js
class RoleCards {
    constructor() {
        this.cards = {
            rvc: {
                title: 'Raad van Commissarissen',
                mission: 'Toezicht houden op de strategie en het beleid van de RvB. Is de analyse die zij presenteren wel robuust en toekomstbestendig?',
                focusAreas: [
                    'Deugdelijkheid van de macro-economische analyse',
                    'Begrip van de conjunctuurgevoeligheid',
                    'Langetermijnvisie',
                    'Risicobeheersing'
                ],
                exampleQuestions: [
                    'U stelt dat de sector gevoelig is voor inflatie. Hoe heeft u dit risico afgedekt in uw strategie voor de komende twee jaar?',
                    'Uw analyse van de bedrijfskolom is helder, maar welke strategische afhankelijkheden ziet u die een bedreiging vormen voor uw continuïteit?',
                    'In uw ESG-analyse focust u op X. Waarom beschouwt u Y, wat in de sector als een groot risico wordt gezien, als minder relevant?'
                ],
                criteria: [1, 2, 4, 9, 13],
                color: 'purple',
                icon: '🏛️'
            },
            investeerders: {
                title: 'Investeringsmaatschappij "FutureGrowth Capital"',
                mission: 'Bepalen of dit bedrijf een aantrekkelijke investering is. Jullie willen rendement zien en zoeken naar groei, winstpotentieel en een sterk concurrentievoordeel.',
                focusAreas: [
                    'Marktmacht',
                    'Prijselasticiteit (pricing power)',
                    'Kostenstructuur flexibiliteit',
                    'Innovatiekracht',
                    'Financiële kansen duurzaamheid'
                ],
                exampleQuestions: [
                    'U opereert in een markt met veel concurrentie. Hoe vertaalt de door u geschetste productdiversificatie zich concreet in een hogere winstmarge?',
                    'U noemt innovatie als kans. Hoe beïnvloedt de verhouding tussen uw constante en variabele kosten het vermogen om snel te investeren?',
                    'De "True Price" van uw product ligt significant hoger. Ziet u dit als kostenpost of presenteert u een plan om dit om te zetten in een commerciële kans?'
                ],
                criteria: [6, 7, 8, 9],
                color: 'green',
                icon: '💰'
            },
            toezichthouder: {
                title: 'Toezichthouder "Autoriteit Markt & Maatschappij" (AMM)',
                mission: 'Bewaken van het publieke belang, eerlijke marktwerking en de naleving van (toekomstige) wetgeving.',
                focusAreas: [
                    'Overheidsregulering',
                    'Negatieve externe effecten',
                    'Maatschappelijke kosten (brede welvaart)',
                    'CSRD/ESRS naleving',
                    'Ethische bedrijfsvoering'
                ],
                exampleQuestions: [
                    'U analyseert de aankomende overheidsregulering. Welke concrete maatregelen treft u nu al om per ingangsdatum compliant te zijn?',
                    'Uit uw analyse van de brede welvaart blijkt negatieve impact op leefomgeving. Welke meetbare doelstellingen heeft u geformuleerd?',
                    'Welke ESRS-standaard is het lastigst te implementeren in uw huidige bedrijfsvoering en waarom?'
                ],
                criteria: [10, 11, 12, 13],
                color: 'orange',
                icon: '⚖️'
            }
        };
    }

    getCard(role) {
        return this.cards[role];
    }

    getQuickReference(role) {
        const card = this.cards[role];
        return {
            mission: card.mission.substring(0, 100) + '...',
            topFocus: card.focusAreas.slice(0, 3),
            nextQuestion: this.getRandomQuestion(role)
        };
    }

    getRandomQuestion(role) {
        const questions = this.cards[role].exampleQuestions;
        return questions[Math.floor(Math.random() * questions.length)];
    }
}
```

### 2. Role Card UI Component
```html
<div class="role-card" data-role="rvc">
    <div class="card-header">
        <span class="role-icon">🏛️</span>
        <h3>Raad van Commissarissen</h3>
        <button class="expand-btn" aria-label="Expand role details">
            <svg><!-- chevron icon --></svg>
        </button>
    </div>

    <div class="card-body">
        <section class="mission-section">
            <h4>Jullie Missie:</h4>
            <p><!-- Mission text --></p>
        </section>

        <section class="focus-section">
            <h4>Let op:</h4>
            <ul class="focus-list">
                <!-- Focus areas -->
            </ul>
        </section>

        <section class="questions-section">
            <h4>Voorbeeldvragen:</h4>
            <ol class="example-questions">
                <!-- Example questions -->
            </ol>
            <button class="generate-question">
                Genereer nieuwe vraag
            </button>
        </section>

        <section class="criteria-section">
            <h4>Focus Criteria:</h4>
            <div class="criteria-badges">
                <!-- Criteria numbers -->
            </div>
        </section>
    </div>

    <div class="card-actions">
        <button class="print-card">Print</button>
        <button class="quick-ref">Quick Reference</button>
    </div>
</div>
```

## Tests Required

### Unit Tests
```javascript
describe('RoleCards', () => {
    test('Should have cards for all stakeholder roles', () => {
        const roleCards = new RoleCards();
        expect(roleCards.cards).toHaveProperty('rvc');
        expect(roleCards.cards).toHaveProperty('investeerders');
        expect(roleCards.cards).toHaveProperty('toezichthouder');
    });

    test('Should return correct card for role', () => {
        const roleCards = new RoleCards();
        const rvcCard = roleCards.getCard('rvc');

        expect(rvcCard.title).toBe('Raad van Commissarissen');
        expect(rvcCard.mission).toContain('Toezicht houden');
        expect(rvcCard.focusAreas).toHaveLength(4);
        expect(rvcCard.exampleQuestions).toHaveLength(3);
    });

    test('Should generate random questions', () => {
        const roleCards = new RoleCards();
        const questions = new Set();

        // Get 10 random questions
        for (let i = 0; i < 10; i++) {
            questions.add(roleCards.getRandomQuestion('investeerders'));
        }

        // Should have at least 2 different questions (unless very unlucky)
        expect(questions.size).toBeGreaterThanOrEqual(2);
    });

    test('Should provide quick reference', () => {
        const roleCards = new RoleCards();
        const quickRef = roleCards.getQuickReference('toezichthouder');

        expect(quickRef.mission).toBeDefined();
        expect(quickRef.mission.length).toBeLessThanOrEqual(103); // 100 + '...'
        expect(quickRef.topFocus).toHaveLength(3);
        expect(quickRef.nextQuestion).toBeDefined();
    });

    test('Should map correct criteria to roles', () => {
        const roleCards = new RoleCards();

        expect(roleCards.cards.rvc.criteria).toEqual([1, 2, 4, 9, 13]);
        expect(roleCards.cards.investeerders.criteria).toEqual([6, 7, 8, 9]);
        expect(roleCards.cards.toezichthouder.criteria).toEqual([10, 11, 12, 13]);
    });
});
```

### Integration Tests
```javascript
describe('Role Cards UI', () => {
    test('Should display role card when role selected', async () => {
        await page.goto('/toetsing.html#roles');
        await page.click('[data-role="rvc"]');

        const card = await page.$('.role-card[data-role="rvc"]');
        expect(card).toBeTruthy();

        const title = await page.$eval('.role-card h3', el => el.textContent);
        expect(title).toBe('Raad van Commissarissen');
    });

    test('Should expand/collapse card details', async () => {
        await page.click('[data-role="rvc"]');

        // Initially collapsed
        let bodyVisible = await page.$eval('.card-body',
            el => window.getComputedStyle(el).display);
        expect(bodyVisible).toBe('none');

        // Click expand
        await page.click('.expand-btn');

        bodyVisible = await page.$eval('.card-body',
            el => window.getComputedStyle(el).display);
        expect(bodyVisible).toBe('block');
    });

    test('Should generate new questions on button click', async () => {
        await page.click('[data-role="investeerders"]');
        await page.click('.expand-btn');

        const firstQuestion = await page.$eval('.example-questions li:first-child',
            el => el.textContent);

        await page.click('.generate-question');

        const questions = await page.$$eval('.example-questions li',
            els => els.map(el => el.textContent));

        // Should have a mix of original and generated questions
        expect(questions).toContain(firstQuestion);
        expect(questions.length).toBeGreaterThan(3);
    });

    test('Should show quick reference overlay', async () => {
        await page.click('[data-role="toezichthouder"]');
        await page.click('.quick-ref');

        const overlay = await page.$('.quick-reference-overlay');
        expect(overlay).toBeTruthy();

        const mission = await page.$eval('.quick-mission', el => el.textContent);
        expect(mission).toContain('Bewaken van het publieke belang');
    });

    test('Should print role card', async () => {
        let printTriggered = false;
        page.on('dialog', dialog => {
            printTriggered = true;
            dialog.dismiss();
        });

        await page.click('[data-role="rvc"]');
        await page.click('.print-card');

        expect(printTriggered).toBe(true);
    });
});
```

### Accessibility Tests
```javascript
describe('Role Cards Accessibility', () => {
    test('Should have proper ARIA labels', async () => {
        const expandBtn = await page.$('.expand-btn');
        const ariaLabel = await expandBtn.getAttribute('aria-label');
        expect(ariaLabel).toBe('Expand role details');

        await page.click('.expand-btn');
        const newLabel = await expandBtn.getAttribute('aria-label');
        expect(newLabel).toBe('Collapse role details');
    });

    test('Should be keyboard navigable', async () => {
        await page.keyboard.press('Tab');
        const focused = await page.evaluate(() =>
            document.activeElement.classList.contains('role-card'));
        expect(focused).toBe(true);

        await page.keyboard.press('Enter');
        const expanded = await page.$eval('.card-body',
            el => window.getComputedStyle(el).display);
        expect(expanded).toBe('block');
    });

    test('Should announce role selection', async () => {
        await page.click('[data-role="rvc"]');

        const announcement = await page.$eval('[aria-live="polite"]',
            el => el.textContent);
        expect(announcement).toContain('Raad van Commissarissen rol geselecteerd');
    });
});
```

## Acceptance Criteria
- [ ] All three stakeholder roles have complete cards
- [ ] Mission statements are clearly displayed
- [ ] Focus areas are listed with bullets
- [ ] Example questions are numbered
- [ ] Criteria numbers are shown as badges
- [ ] Cards can expand/collapse
- [ ] Quick reference mode available
- [ ] Questions can be randomized
- [ ] Cards are printable
- [ ] Mobile responsive design
- [ ] Accessible via keyboard
- [ ] Screen reader compatible

## Dependencies
- Role selection component
- State manager for current role
- Print service
- Mobile navigation

## Technical Requirements
- Cards load within 100ms
- Smooth expand/collapse animation
- Print CSS for clean output
- Works offline
- Supports RTL languages

## UI/UX Requirements
- Color-coded by role
- Clear visual hierarchy
- Icon for each role
- Expandable sections
- Print-friendly layout
- Dark mode support