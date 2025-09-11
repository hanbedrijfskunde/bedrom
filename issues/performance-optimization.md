# Performance & Technical Issues - slides-wk3.html

**Status**: 🟡 Optimization  
**Priority**: Low-Medium  
**Impact**: Performance & Reliability  

## Issue #010: Chart.js Initialization Errors ✅ FIXED

**Description**: Console errors during chart initialization suggesting timing issues.

**Observed Errors**:
```
TypeError: Cannot read properties of null (reading 'getContext')
at initOrderBookBuilder
at initDemandCurveChart_Horloge
```

**Root Cause**: Old Week 2 JavaScript functions being called but their HTML elements were removed during Week 3 cleanup

**✅ IMPLEMENTATION COMPLETED:**
- Removed all old Week 2 function calls (initOrderBookBuilder, initDemandCurveChart_Horloge, etc.)
- Removed corresponding function definitions 
- Cleaned up unused initialization flags
- Eliminated #brood-answer CSS styles and logic
- Maintained all Week 3 functionality intact

**Recommended Fix**:
```javascript
// Add existence check before initialization
if (index === 9 && !isoProfitSimulatorInitialized) {
    const canvas = document.getElementById('isoprofit-chart-slide-10');
    if (canvas && canvas.getContext) {
        new IsoProfitCurveSimulator(10);
        isoProfitSimulatorInitialized = true;
    } else {
        console.warn('Canvas element not ready for slide 10');
        // Retry after short delay
        setTimeout(() => {
            if (document.getElementById('isoprofit-chart-slide-10')) {
                new IsoProfitCurveSimulator(10);
                isoProfitSimulatorInitialized = true;
            }
        }, 100);
    }
}
```

**Impact**: Eliminates console errors, improves reliability.

---

## Issue #011: CDN Dependency Warnings

**Description**: Tailwind CSS CDN warning about production usage.

**Console Warning**: "cdn.tailwindcss.com should not be used in production"

**Current**: CDN-based Tailwind CSS
**Recommendation**: For production deployment, consider build process

**Low Priority Fix**:
- Keep CDN for development/classroom use (perfectly functional)
- For production deployment, implement proper Tailwind build process

**Impact**: Eliminates console warnings, better production practices.

---

## Issue #012: Font Loading Optimization

**Description**: Google Fonts may cause flash of unstyled text (FOUT).

**Current**:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

**Enhancement**:
```html
<link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"></noscript>

<!-- Add fallback font -->
<style>
body {
    font-family: "Inter", system-ui, -apple-system, sans-serif;
}
</style>
```

**Impact**: Faster perceived loading, reduced font flash.

---

## Issue #013: Memory Management for Long Sessions

**Description**: Chart.js instances may accumulate memory during long classroom sessions.

**Potential Issue**: Multiple chart updates without proper cleanup

**Recommended Enhancement**:
```javascript
class IsoProfitCurveSimulator {
    destroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        // Remove event listeners
        this.priceSlider?.removeEventListener('input', this.updateHandler);
        this.quantitySlider?.removeEventListener('input', this.updateHandler);
    }
}

// Add cleanup when navigating away from slides
function showSlide(index) {
    // Cleanup previous slide interactive components
    if (window.currentSimulator) {
        window.currentSimulator.destroy();
    }
    
    // ... existing slide logic
}
```

**Impact**: Better memory management for extended classroom use.