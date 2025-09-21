# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Business Economics course project repository ("bedrom") containing HTML presentations and course documentation in Dutch. The project focuses on macro-economic analysis, market structures, and ESG factors for sector analysis.

## Repository Structure

- **HTML Presentations**: Standalone HTML files with embedded Tailwind CSS, MathJax for formulas, and Chart.js for visualizations
  - `slides.html`, `slides-wk2.html`, `slides-wk3.html`, `slides-wk4.html`: Weekly presentation slides
  - `simulatie-wk1.html`: Week 1 simulation
  - `notes.html`: Course notes
  - `index.html`: Course landing page with week-based navigation

- **Course Documentation**: Markdown files containing course materials
  - `draaiboek-wk1.md`, `draaiboek-wk2.md`, `draaiboek-wk3.md`, `draaiboek-wk4.md`: Weekly course guides
  - `casus-postnl.md`: PostNL case study
  - `course-docs/`: Additional course documentation (wk3/, wk4/ subdirectories)
    - `wk4/`: CORE Economy Unit 4 & 12 PDFs, innovation storyline
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
- **Chart.js**: Data visualization library

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
- **Chart.js graphs**: Data visualizations for economic concepts
- **MathJax formulas**: Mathematical notation with `$` delimiters for inline math
- **Game buttons**: Interactive learning games integrated via modal overlays

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
- **Key concepts**: Game theory, prisoner's dilemma, public goods, ultimatum game
- **Interactive elements**:
  - Public Goods Game (external link)
  - P5.js prisoner's dilemma matrices
- **Slide formats**:
  - Slide 4: CORE Economy reference with PDF downloads
  - Slide 14: Ultimatum Game experiment results
  - Slide 16: Three-column synthesis (theory, lessons, tools)