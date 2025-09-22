# De Strategische Arena - Assessment Voorbereiding

Een interactieve webapplicatie voor HBO Business Economics studenten om zich voor te bereiden op de boardroom simulatie assessment.

## 🎯 Project Overview

De Strategische Arena is een assessment voorbereidingstool waar studenten:
- Hun rol kunnen selecteren (RvB, RvC, Investeerders, Toezichthouder, Observatoren)
- Voorbereidingsmaterialen kunnen doorlopen
- Met een timer kunnen oefenen (40 minuten, 7 fases)
- Q&A vragen kunnen simuleren
- Team coördinatie kunnen organiseren
- PDF samenvattingen kunnen genereren

## 🚀 Quick Start

### Prerequisites
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- VS Code with Live Server extension (recommended)
- Git for version control

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd bedrom
```

2. Open in VS Code:
```bash
code .
```

3. Start Live Server:
- Right-click on `toetsing.html`
- Select "Open with Live Server"
- Or use the shortcut: `Alt+L, Alt+O`

The application will open at `http://localhost:5502/toetsing.html`

### Alternative: Direct Browser
Simply open `toetsing.html` directly in your browser - no build process required!

## 📁 Project Structure

```
bedrom/
├── toetsing.html           # Main application page
├── index.html              # Course landing page
├── js/
│   ├── core/              # Core application logic
│   ├── components/        # Reusable components
│   ├── services/          # External services
│   └── utils/             # Utility functions
├── css/                   # Custom styles
├── data/                  # JSON data files
├── images/                # Images and assets
├── tests/                 # Test suites
│   ├── unit/             # Unit tests
│   ├── integration/      # Integration tests
│   └── e2e/              # End-to-end tests
└── course-docs/
    └── toetsing/         # Documentation
        ├── PRD-toetspagina.md
        ├── TDD-toetspagina.md
        └── implementation-tasks.md
```

## 🛠️ Technology Stack

- **HTML5**: Semantic markup
- **Tailwind CSS**: Utility-first CSS framework (via CDN)
- **Vanilla JavaScript**: ES6+ features
- **Google Fonts**: Inter font family
- **LocalStorage**: State persistence
- **Service Worker**: Offline functionality (coming soon)

## 📋 Development Tasks

See `/course-docs/toetsing/implementation-tasks.md` for the complete 17-task implementation plan.

Current progress:
- ✅ Task 1: Project Setup & Basic HTML Structure
- ⏳ Task 2: Design System & Styling
- ⏳ Task 3: State Management System
- ... (14 more tasks)

## 🧪 Testing

Run tests to verify functionality:

### HTML Validation
Visit [W3C Validator](https://validator.w3.org/) and validate `toetsing.html`

### Accessibility Testing
- Use browser DevTools Lighthouse
- Target score: >90
- WCAG 2.1 AA compliance required

### Browser Testing
Test in:
- Chrome/Edge (Chromium)
- Firefox
- Safari
- Mobile browsers

## 🎨 Design System

### Colors
- Primary: Blue (#3B82F6)
- RvB: Blue (#3B82F6)
- RvC: Purple (#9333EA)
- Investeerders: Green (#10B981)
- Toezichthouder: Orange (#F97316)
- Observatoren: Gray (#6B7280)

### Typography
- Font: Inter
- Sizes: xs (12px) to 4xl (36px)
- Weights: 400, 500, 600, 700

### Breakpoints
- Mobile: <768px
- Tablet: 768px - 1023px
- Desktop: ≥1024px

## 📚 Documentation

- **PRD**: Product Requirements Document - `/course-docs/toetsing/PRD-toetspagina.md`
- **TDD**: Technical Design Document - `/course-docs/toetsing/TDD-toetspagina.md`
- **Tasks**: Implementation tasks - `/course-docs/toetsing/implementation-tasks.md`
- **Course Guide**: General project info - `/CLAUDE.md`

## 👥 Contributing

1. Check the task list in `implementation-tasks.md`
2. Pick an unassigned task
3. Create a feature branch
4. Complete all subtasks and tests
5. Submit a pull request

## 📝 License

This project is part of the HBO Business Economics curriculum.

## 🆘 Support

For questions or issues:
- Check documentation in `/course-docs/toetsing/`
- Review the TDD for technical details
- Contact the development team

## 🔄 Version

Current version: 0.1.0 (Task 1 completed)

---

*Built with ❤️ for Business Economics students*