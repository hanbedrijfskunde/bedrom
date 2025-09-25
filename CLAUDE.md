# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Business Economics course project repository ("bedrom") containing HTML presentations and course documentation in Dutch. The project focuses on macro-economic analysis, market structures, and ESG factors for sector analysis.

## Repository Structure

- **HTML Presentations**: Standalone HTML files with embedded Tailwind CSS, MathJax for formulas, and visualizations
  - `slides.html`, `slides-wk2.html`, `slides-wk3.html`, `slides-wk4.html`, `slides-wk5.html`: Weekly presentation slides
  - `simulatie-wk1.html`: Week 1 simulation
  - `notes.html`: Course notes
  - `index.html`: Course landing page with week-based navigation
  - `toetsing.html`: Assessment preparation page (in development)

- **Course Documentation**: Markdown files containing course materials
  - `draaiboek-wk1.md`, `draaiboek-wk2.md`, `draaiboek-wk3.md`, `draaiboek-wk4.md`, `draaiboek-wk5.md`: Weekly course guides
  - `casus-postnl.md`: PostNL case study
  - `course-docs/`: Additional course documentation
    - `wk3/`, `wk4/`, `wk5/`: Weekly materials with CORE Economy PDFs
    - `toetsing/`: Assessment documentation
      - `toetsprogramma-de-strategische-arena.md`: Assessment program details
      - `PRD-toetspagina.md`: Product Requirements Document for assessment page
      - `TDD-toetspagina.md`: Technical Design Document (2140 lines)
      - `implementation-tasks.md`: Development task list (17 tasks for junior developers)
  - `issues/`: Feature requests and implementation issues

- **Assets**:
  - `images/`: Course images and visualizations
  - `tests/`: Screenshot testing files (PNG format)

## Development Commands

### Viewing HTML Files
The project uses VS Code Live Server on port 5502 (configured in .vscode/settings.json):
```bash
# Start Live Server in VS Code on port 5502
# Or open HTML files directly in a browser
```

### HTML Structure
All HTML files are self-contained with:
- Tailwind CSS via CDN
- MathJax for mathematical formulas
- Chart.js for data visualizations
- Inter font from Google Fonts

No build process or package manager is required - files can be edited directly and viewed in a browser.

## Key Technologies

- **HTML/CSS**: Standalone presentation files
- **Tailwind CSS**: Utility-first CSS framework (loaded via CDN)
- **MathJax**: Mathematical notation rendering
- **Chart.js**: Data visualization library (Week 1-4)
- **Plotly.js**: Advanced interactive graphs (Week 5 - CORE Economy figures)

## Architecture & Patterns

### Presentation System
All slide presentations follow a consistent architecture:
- **Slide structure**: Each `<section class="slide">` represents one presentation slide
- **Navigation system**: JavaScript-based with keyboard (arrow keys, space), button controls, and mobile swipe support
- **Slide counter**: Displays current position (e.g., "1 / 25") with automatic updates
- **Responsive design**: Desktop shows full-screen slides, mobile enables vertical scrolling
- **Transitions**: CSS opacity transitions (0.6s ease-in-out) between slides

### Interactive Elements
Presentations include various interactive components:
- **p5.js visualizations**: Used for economic models and simulations (e.g., isocurve demonstrations)
- **Chart.js graphs**: Data visualizations for economic concepts (Weeks 1-4)
- **Plotly.js graphs**: Interactive economic figures with curved fills (Week 5)
- **MathJax formulas**: Mathematical notation with `$` delimiters for inline math
- **Game buttons**: Interactive learning games integrated via modal overlays
- **Interactive polls**: Real-time voting systems for student engagement (Week 5)

### Authentication Pattern
Teacher-only resources use URL parameter authentication:
```javascript
const urlParams = new URLSearchParams(window.location.search);
const isDocent = urlParams.get('docent') === 'true';
```

### Styling Conventions
- **Color scheme**: Uses Tailwind CSS utility classes
- **Typography**: Inter font family from Google Fonts
- **Layout**: Flexbox/Grid layouts with Tailwind utilities
- **Mobile breakpoint**: 768px (md: prefix in Tailwind)

## Project Guidelines

### File Management
- **Never create unnecessary files**: Only create documentation when explicitly requested
- **Prefer editing over creating**: Always modify existing files when possible
- **Respect existing structure**: Follow established patterns and conventions

### Content Conventions
- **Language**: All course content is in Dutch (Nederlands)
- **Slide count verification**: Important slides (e.g., slides-wk3.html) must maintain exact slide counts
- **Formula rendering**: Use MathJax with single `$` for inline math
- **Image fallbacks**: Use emojis as placeholders when images are unavailable

### Week Structure
The course follows a weekly structure with consistent components:
- **Draaiboek**: Teacher guide with detailed lesson plans (protected access)
- **Slides**: Student-facing presentations with interactive elements
- **Games/Simulations**: One interactive learning tool per week
- **Course docs**: Supporting materials in course-docs/wk{N}/ directories

### Week 4 Specifics
**Theme**: Social Interactions & Dilemmas (based on CORE Economy Unit 4)
- **Slides**: 17 slides including CORE Economy reference slide
- **Key concepts**: Game theory, prisoner's dilemma, public goods, ultimatum game, innovation rent
- **Interactive elements**:
  - Public Goods Game (external link)
  - P5.js prisoner's dilemma matrices
- **Slide formats**:
  - Slide 4: CORE Economy reference with PDF downloads
  - Slide 14: Ultimatum Game experiment results
  - Slide 16: Three-column synthesis (theory, lessons, tools)
- **Brightspace integration**: Direct links to materials in assignment descriptions

### Week 5 Specifics
**Theme**: Market Failures & External Effects (based on CORE Economy Unit 12)
- **Slides**: 16 slides with interactive Plotly graph
- **Key concepts**: External effects, MPC vs MSC, Coase theorem, bargaining & compensation
- **Interactive elements**:
  - Plotly.js graph showing Figure 12.4 from CORE Economy
  - Interactive poll on chlordecone dilemma (slide 3)
  - Speed dating timer for knowledge sharing (slide 12)
- **Main visualization**:
  - Figure 12.4: The gains from bargaining
  - Curved MSC and MPC lines with proper intersection points
  - Filled areas showing net social gain and loss of profit
  - Pareto-efficient point at 38,000 tons, market equilibrium at 80,000 tons
- **Case study**: Martinique & Guadeloupe chlordecone disaster (1972-1993)
  - Real-world example of market failure
  - 90% population contaminated
  - Soil polluted for 700 years
- **CSRD/ESRS integration**:
  - Corporate Sustainability Reporting Directive
  - 12 ESRS standards (E1-E5, S1-S4, G1, ESRS 1&2)
  - 1,178 datapoints (265 voluntary)
- **External tools**:
  - Hidden Costs Analysis tool: https://hanbedrijfskunde.github.io/hidden-costs/
- **Bridge from Week 4**:
  - Connects social dilemmas to market failures
  - Prisoner's dilemma applied to pollution decisions
  - Ultimatum game applied to compensation negotiations

### Assessment (Toetsing) Specifics
**Theme**: De Strategische Arena - Boardroom simulation assessment
- **Documentation**:
  - PRD: Complete product requirements with UX focus
  - TDD: 2140-line technical design document
  - Implementation tasks: 17 main tasks for junior developers
- **Key Components** (implemented):
  - ✅ Role selection system (5 roles with sub-roles)
  - ✅ Presentation timer (40 minutes, 7 phases)
  - ⚠️ Q&A simulator with adaptive questioning (partial)
  - ✅ Team coordination features (team creation, invite codes)
  - ✅ PDF generation for materials
  - ✅ Offline functionality with Service Worker
  - ✅ Settings with data export/import
  - ✅ Progress tracking (automatic calculation)
- **Technical Stack**:
  - Vanilla JavaScript (ES6+ modules)
  - Tailwind CSS via CDN
  - State management with LocalStorage
  - Progressive Web App capabilities
  - Service Worker (cache version: v6)
- **Testing Requirements**:
  - Each task must pass specific tests before proceeding
  - WCAG 2.1 AA accessibility compliance
  - Lighthouse score >90
  - Mobile-first responsive design

### Recent Fixes & Improvements (2024-01-09)

#### Fixed Issues
1. **Duplicate Notifications** (test-001)
   - Fixed duplicate event handlers in role selection
   - Added debounce mechanism for notifications
   - Files: `/js/components/role-selection.js`

2. **Materials Page 404** (test-003)
   - Added missing route handler for materials page
   - Connected preparation-materials component to routing
   - Files: `/js/core/app.js`

3. **Team Modal Not Closing** (test-002)
   - Issue identified, fix pending

4. **Timer Button Label** (test-004)
   - Minor UI issue, fix pending

#### Component Status
- **Working**: Homepage, Role Selection, Team Creation, Timer, Settings, Export/Import
- **Partial**: Preparation page (empty content), Q&A Simulator
- **Testing**: Materials page (just fixed)

#### Known Issues in `/issues/`
- Active bugs and feature requests documented
- Test reports with comprehensive findings
- Priority fixes marked as HIGH/MEDIUM/LOW

### Development Best Practices

#### Service Worker Cache Management
- **Current version**: v6 (update when making JS/CSS changes)
- **Location**: `/sw.js` lines 6-7
- **When to update**: After any JavaScript or CSS modifications
- **Format**: `strategische-arena-v{N}` and `runtime-cache-v{N}`

#### Testing Workflow
1. **Clear browser cache** or use incognito mode for testing
2. **Unregister service worker** in DevTools > Application when debugging
3. **Check console** for state management logs and errors
4. **Use Playwright MCP** for automated testing

#### Common Pitfalls to Avoid
- **Don't add duplicate event listeners** - check if handlers already exist
- **Always update cache version** when modifying JS files
- **Use data-navigate attributes** instead of onclick for navigation
- **Debounce notifications** to prevent spam
- **Check for existing components** before creating new ones

#### Debug Commands
```javascript
// In browser console:
app.debug()  // Shows app state
stateManager.debug()  // Shows state manager info
stateManager.get('user')  // Get user state
stateManager.reset()  // Clear all data
```

#### Local Testing
```bash
# Start local server
python3 -m http.server 5502

# Or use VS Code Live Server on port 5502
# Access at: http://localhost:5502/toetsing.html
```
- to