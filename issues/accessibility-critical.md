# Critical Accessibility Issues - slides-wk3.html

**Status**: 🔴 Critical  
**Priority**: High  
**WCAG Level**: A/AA Violations  

## Issue #001: Missing ARIA Labels on Interactive Elements

**Description**: All interactive sliders lack proper ARIA labels making them inaccessible to screen readers.

**Affected Components**:
- Price slider (slide 11, line ~649)
- Quantity slider (slide 11, line ~654) 
- Profit level slider (slide 12, line ~686)

**Current Code**:
```html
<input id="price-slider-10" type="range" min="1" max="5" step="0.1" value="2.5" 
    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
```

**Fix Required**:
```html
<input id="price-slider-10" type="range" min="1" max="5" step="0.1" value="2.5"
    aria-label="Prijs per croissant in euro's"
    aria-describedby="price-value-10"
    class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer">
```

**Impact**: Screen reader users cannot understand or use the interactive economic simulators.

---

## Issue #002: Charts Inaccessible to Screen Readers

**Description**: Canvas-based Chart.js visualizations have no alternative text or ARIA descriptions.

**Affected Components**:
- IsoProfitCurveSimulator (slide 11)
- DemandIsoProfitSimulator (slide 12) 
- All Chart.js instances

**Current Code**:
```html
<canvas id="isoprofit-chart-slide-10" class="w-full h-96"></canvas>
```

**Fix Required**:
```html
<canvas id="isoprofit-chart-slide-10" 
    aria-label="Interactieve isowinstcurve grafiek showing prijs versus hoeveelheid relationships"
    role="img"
    class="w-full h-96"></canvas>

<!-- Add hidden data table for screen readers -->
<div class="sr-only" id="chart-data-table-10">
    <table>
        <caption>Isowinstcurve data points</caption>
        <thead>
            <tr><th>Hoeveelheid</th><th>Prijs</th><th>Winst</th></tr>
        </thead>
        <tbody id="chart-data-body-10">
            <!-- Populated by JavaScript -->
        </tbody>
    </table>
</div>
```

**Impact**: Visually impaired students completely excluded from core economic learning activities.

---

## Issue #003: Color-Only Visual Feedback

**Description**: Optimization discovery tool uses only color changes (red/orange/green borders) to communicate status.

**Affected Components**:
- Intersection feedback system (slide 12)
- Border color changes for optimization status

**Current Code**:
```html
<div class="bg-white p-4 rounded border-2 border-orange-400">
    <div class="text-lg font-bold mb-2">📊 Snijpunten met vraagcurve: 2</div>
</div>
```

**Fix Required**:
```html
<div class="bg-white p-4 rounded border-2 border-orange-400" aria-live="polite">
    <div class="text-lg font-bold mb-2">
        📊 Snijpunten met vraagcurve: 2 
        <span class="inline-block bg-orange-100 text-orange-800 px-2 py-1 rounded text-sm ml-2">
            Probeer hoger
        </span>
    </div>
    <span class="sr-only">Status: Te laag winstniveau, probeer hogere waarde</span>
</div>
```

**Impact**: Color-blind students cannot distinguish between optimization states.

---

## Issue #004: Missing Semantic Landmarks

**Description**: Page lacks proper semantic HTML structure for navigation.

**Current Structure**: Generic `<div>` and `<section>` elements without ARIA landmarks

**Fix Required**:
```html
<body>
    <nav aria-label="Slide navigation">
        <div class="navigation">
            <button aria-label="Previous slide">‹</button>
            <span aria-live="polite">1 / 24</span>
            <button aria-label="Next slide">›</button>
        </div>
    </nav>
    
    <main role="main" aria-label="Presentation content">
        <section aria-labelledby="slide-title-1">
            <!-- Slide content -->
        </section>
    </main>
</body>
```

**Impact**: Screen reader users cannot efficiently navigate presentation structure.