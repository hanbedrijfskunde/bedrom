# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Business Economics course project repository ("bedrom") containing HTML presentations and course documentation in Dutch. The project focuses on macro-economic analysis, market structures, and ESG factors for sector analysis.

## Repository Structure

- **HTML Presentations**: Standalone HTML files with embedded Tailwind CSS, MathJax for formulas, and Chart.js for visualizations
  - `slides.html`, `slides-wk2.html`: Weekly presentation slides
  - `simulatie-wk1.html`: Week 1 simulation
  - `notes.html`: Course notes

- **Course Documentation**: Markdown files containing course materials
  - `draaiboek-wk1.md`, `draaiboek-wk2.md`: Weekly course guides
  - `casus-postnl.md`: PostNL case study
  - `course-docs/`: Additional course documentation

## Development Setup

### Viewing HTML Files
The project uses VS Code Live Server on port 5501:
```bash
# Start Live Server in VS Code
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