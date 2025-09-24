# Bootstrapping Plan: Economic Defense Builder Q&A Oefentool

## Overzicht
Incrementele ontwikkeling van simpele MVP naar volledig product in 5 fases, met Playwright tests per fase.

## 🎯 FASE 1: MVP - Basic Q&A (Sprint 1 - 2 dagen)

### Wat bouwen we:
**Nieuwe component: `/js/components/defense-builder.js`**
- Laad vragenbank JSON (`toetsing-vragenbank.json`)
- Toon 1 hoofdvraag met deelvragen
- Textarea voor antwoord invoeren
- Opslaan in localStorage
- Clear localStorage knop

**Integratie in `toetsing.html`:**
- Nieuwe sectie "Q&A Oefenen" na rotatieschema
- Route `/oefenen` in router
- Menu item toevoegen

**LocalStorage structuur:**
```javascript
{
  "defense_builder": {
    "answers": {
      "1a": "Antwoord op deelvraag 1a...",
      "1b": "Antwoord op deelvraag 1b..."
    },
    "currentQuestion": 1,
    "startedAt": "2025-01-10T10:00:00Z"
  }
}
```

### Playwright Test MVP:
```javascript
test('MVP: kan vraag laden en antwoord opslaan', async ({ page }) => {
  await page.goto('/toetsing.html#oefenen');
  await expect(page.locator('h2')).toContainText('Q&A Oefenen');
  await page.fill('textarea', 'Test antwoord');
  await page.click('button:text("Opslaan")');

  // Check localStorage
  const storage = await page.evaluate(() => localStorage.getItem('defense_builder'));
  expect(storage).toContain('Test antwoord');
});
```

---

## 🚀 FASE 2: Navigation & Progress (Sprint 2 - 2 dagen)

### Wat toevoegen:
- Volgende/vorige vraag navigatie
- Progress bar (1 van 75 vragen)
- Skip vraag functionaliteit
- Vraag bookmarking
- Sessie timer

### Playwright Test Navigatie:
```javascript
test('Navigatie tussen vragen werkt', async ({ page }) => {
  await page.goto('/toetsing.html#oefenen');
  await expect(page.locator('.progress-bar')).toContainText('1 / 75');

  await page.click('button:text("Volgende")');
  await expect(page.locator('.progress-bar')).toContainText('2 / 75');

  await page.click('button:text("Vorige")');
  await expect(page.locator('.progress-bar')).toContainText('1 / 75');
});
```

---

## 🎨 FASE 3: Team Socratic Mode (Sprint 3 - 3 dagen)

### Wat toevoegen:
- Peer mode toggle
- Vervolgvragen templates tonen
- Peer feedback formulier
- Rol switching (RvB ↔ Critical Friend)
- Feedback opslaan in localStorage

**Component uitbreiding:**
```javascript
class DefenseBuilder {
  enableTeamMode() {
    // Toggle tussen solo en team
    // Toon vraagkaarten voor peer
    // Wissel rollen na elke vraag
  }
}
```

### Playwright Test Team Mode:
```javascript
test('Team mode: kan rollen wisselen', async ({ page }) => {
  await page.goto('/toetsing.html#oefenen');
  await page.click('button:text("Team Mode")');

  // Student A beantwoordt
  await page.fill('[data-student="A"] textarea', 'RvB antwoord');

  // Student B stelt vervolgvraag
  await page.click('.question-card:first-child');
  await expect(page.locator('.follow-up-question')).toBeVisible();

  // Wissel rollen
  await page.click('button:text("Wissel Rollen")');
  await expect(page.locator('[data-role="A"]')).toContainText('Critical Friend');
});
```

---

## 🧠 FASE 4: Concept Mapper (Sprint 4 - 4 dagen)

### Wat toevoegen:
- D3.js concept web visualisatie
- Drag & drop nodes
- Concept linking interface
- Export concept map als PNG
- Knowledge Bank basis

**Nieuwe dependencies:**
```html
<script src="https://d3js.org/d3.v7.min.js"></script>
```

### Playwright Test Concept Map:
```javascript
test('Concept mapper: kan concepten verbinden', async ({ page }) => {
  await page.goto('/toetsing.html#oefenen');
  await page.click('button:text("Concept Map")');

  // Check D3 canvas
  await expect(page.locator('svg.concept-map')).toBeVisible();

  // Drag node
  const node = page.locator('.concept-node:text("BBP")');
  await node.dragTo(page.locator('.drop-zone'));

  // Create link
  await page.click('.concept-node:text("BBP")');
  await page.click('.concept-node:text("Consumptie")');
  await expect(page.locator('.concept-link')).toHaveCount(1);
});
```

---

## 🏆 FASE 5: Analytics & Polish (Sprint 5 - 3 dagen)

### Wat toevoegen:
- Analytics dashboard
- Export functionaliteit (PDF/JSON)
- Filteropties (per week/thema/rol)
- Best practices sectie
- Offline PWA support
- Responsive mobile design

### Complete Features:
- **Knowledge Bank**: Alle antwoorden doorzoekbaar
- **Growth Tracking**: Voortgang over tijd
- **Team Insights**: Vergelijk met teamgenoten
- **Smart Suggestions**: Relevante concepten

### Playwright Test Complete:
```javascript
test('Analytics: toont voortgang dashboard', async ({ page }) => {
  // Setup: beantwoord enkele vragen
  await page.goto('/toetsing.html#oefenen');
  for (let i = 0; i < 5; i++) {
    await page.fill('textarea', `Antwoord ${i}`);
    await page.click('button:text("Opslaan & Volgende")');
  }

  // Check dashboard
  await page.click('button:text("Dashboard")');
  await expect(page.locator('.questions-completed')).toContainText('5');
  await expect(page.locator('.concept-coverage')).toContainText('6.7%');

  // Export test
  await page.click('button:text("Export PDF")');
  const download = await page.waitForEvent('download');
  expect(download.suggestedFilename()).toBe('defense-builder-export.pdf');
});
```

---

## 📁 Bestandsstructuur per fase:

### Fase 1 (MVP):
```
/js/components/
  └── defense-builder.js         [NEW]
/toetsing.html                   [MODIFY: add section]
```

### Fase 2:
```
/js/components/
  ├── defense-builder.js         [UPDATE]
  └── defense-progress.js        [NEW]
```

### Fase 3:
```
/js/components/
  ├── defense-builder.js         [UPDATE]
  ├── team-socratic.js          [NEW]
  └── question-cards.js         [NEW]
```

### Fase 4:
```
/js/components/
  ├── defense-builder.js         [UPDATE]
  ├── concept-mapper.js         [NEW]
  └── knowledge-bank.js         [NEW]
```

### Fase 5:
```
/js/components/
  ├── defense-builder.js         [UPDATE]
  ├── defense-analytics.js      [NEW]
  └── defense-export.js         [NEW]
/sw.js                           [UPDATE: cache v7]
```

---

## 🧪 Test Strategie per Fase:

### Fase 1: Unit Tests (30 min)
- Vraag laden ✓
- Antwoord opslaan ✓
- LocalStorage clear ✓

### Fase 2: Integration Tests (45 min)
- Navigatie flow ✓
- Progress tracking ✓
- Data persistentie ✓

### Fase 3: User Flow Tests (60 min)
- Solo → Team switch ✓
- Rol wisseling ✓
- Feedback flow ✓

### Fase 4: Visual Tests (45 min)
- Concept map rendering ✓
- Drag & drop ✓
- Export functionaliteit ✓

### Fase 5: E2E Tests (90 min)
- Complete user journey ✓
- Cross-browser ✓
- Mobile responsive ✓
- Offline capability ✓

---

## 🎯 Success Criteria per Fase:

**MVP**: Student kan 1 vraag beantwoorden en opslaan
**Fase 2**: Student kan door alle 75 vragen navigeren
**Fase 3**: 2 studenten kunnen samen oefenen
**Fase 4**: Student kan concepten visueel verbinden
**Fase 5**: Complete learning analytics beschikbaar

## Tijdlijn: ~14 dagen totaal
- Fase 1: 2 dagen
- Fase 2: 2 dagen
- Fase 3: 3 dagen
- Fase 4: 4 dagen
- Fase 5: 3 dagen

## Status Updates

### Fase 1 MVP - Status: IN PROGRESS 🚧

#### ✅ Completed:
- [x] Defense Builder component (`/js/components/defense-builder.js`)
- [x] LocalStorage integration
- [x] Question display with sub-questions
- [x] Answer saving functionality
- [x] Clear storage functionality

#### 🔄 In Progress:
- [ ] Integration in toetsing.html
- [ ] Router configuration
- [ ] Menu navigation

#### ⏳ Todo:
- [ ] Playwright tests
- [ ] Mobile responsiveness check
- [ ] Error handling improvements

---

## Notes

### Technical Decisions:
- **No build process**: Direct ES6 modules for simplicity
- **Tailwind CDN**: Already loaded in toetsing.html
- **Vanilla JS**: No framework dependencies
- **LocalStorage first**: Simple persistence, no backend needed

### Future Considerations:
- **IndexedDB**: Voor Fase 4-5 als meer storage nodig is
- **WebWorkers**: Voor heavy processing in Fase 5
- **PWA manifest**: Voor installable app in Fase 5
- **WebRTC**: Voor real-time team collaboration (optional)

---

*Last Updated: 2025-01-10*
*Version: 1.0*
*Owner: Bedrijfskunde Curriculum Team*