# Feature Request: Reset Memory Button ✅ IMPLEMENTED

## Issue Description
Er is behoefte aan een knop waarmee gebruikers hun voortgang en opgeslagen gegevens kunnen resetten. Dit is nuttig voor testen, opnieuw beginnen, of wanneer gebruikers een schone lei willen.

## User Story
Als gebruiker wil ik mijn voortgang en opgeslagen gegevens kunnen resetten, zodat ik opnieuw kan beginnen met de assessment voorbereiding.

## Proposed Solution
Implementeer een "Reset Geheugen" knop die:
1. Alle LocalStorage data wist
2. De staat van de applicatie reset naar de beginwaarden
3. De gebruiker terugbrengt naar het startscherm
4. Een bevestigingsdialoog toont voordat de reset wordt uitgevoerd

## Technical Implementation

### Location
De reset-knop kan op verschillende plekken worden toegevoegd:
- In het hoofdmenu (desktop)
- In het mobiele menu
- Op de profielpagina
- Als een "instellingen" sectie

### Code Location
- Component: `/workspaces/bedrom/js/components/settings.js` (nieuw te maken)
- State reset: `/workspaces/bedrom/js/core/state-manager.js` (uitbreiden met reset functie)
- UI integratie: `/workspaces/bedrom/toetsing.html`

### Implementation Steps

1. **Add Reset Method to StateManager**
```javascript
// In state-manager.js
reset() {
    // Show confirmation dialog
    if (!confirm('Weet je zeker dat je alle voortgang wilt resetten? Dit kan niet ongedaan worden gemaakt.')) {
        return false;
    }
    
    // Clear LocalStorage
    localStorage.removeItem(this.storageKey);
    
    // Reset to initial state
    this.state = this.getInitialState();
    
    // Notify all listeners
    this.emit('state:reset');
    
    // Reload the page to ensure clean state
    window.location.reload();
    
    return true;
}
```

2. **Create Settings Component**
```javascript
// New file: js/components/settings.js
export class Settings {
    constructor() {
        this.createResetButton();
    }
    
    createResetButton() {
        const button = document.createElement('button');
        button.className = 'btn btn-danger';
        button.innerHTML = '🗑️ Reset Geheugen';
        button.onclick = () => this.handleReset();
        return button;
    }
    
    handleReset() {
        stateManager.reset();
    }
}
```

3. **Add UI Button**
```html
<!-- In navigation or settings section -->
<button 
    class="btn btn-secondary btn-sm" 
    onclick="confirmReset()"
    title="Reset alle voortgang en begin opnieuw">
    <span>🔄</span> Reset
</button>
```

## UI/UX Considerations

### Visual Design
- Use a warning color (red/orange) for the button
- Place it in a settings or profile section, not prominently displayed
- Add an icon (🗑️, 🔄, or ⚠️) to make it recognizable

### Safety Measures
1. **Confirmation Dialog**: Always show a confirmation dialog
2. **Warning Text**: Clear warning that this action cannot be undone
3. **Progress Check**: If progress > 80%, show extra warning
4. **Backup Option**: Consider offering to download progress as PDF before reset

### Confirmation Dialog Example
```javascript
const message = `
⚠️ WAARSCHUWING: Reset Geheugen

Dit zal het volgende permanent verwijderen:
• Je geselecteerde rol
• Alle voortgang (${progressPercentage}% voltooid)
• Team informatie
• Notities en antwoorden
• Q&A simulator resultaten

Weet je zeker dat je door wilt gaan?
`;
```

## Acceptance Criteria
- [x] Reset button is available in settings/menu
- [x] Confirmation dialog appears before reset
- [x] All LocalStorage data is cleared
- [x] Application returns to initial state
- [x] User is redirected to home page
- [x] Success message is shown after reset
- [x] Button has appropriate warning styling
- [x] Works on both desktop and mobile

## Implementation Status: COMPLETED ✅

### What was implemented:
1. **Settings Component** (`/js/components/settings.js`)
   - Complete settings modal with reset functionality
   - Export/Import progress feature
   - Progress summary display
   - Multiple confirmation dialogs for safety

2. **Settings Button**
   - Fixed position button (bottom-left) with gear icon
   - Opens settings modal

3. **Reset Functionality**
   - Clear all localStorage data
   - Reset state to initial values
   - Show success notification
   - Reload page after reset

4. **Additional Features**
   - Export progress to JSON file
   - Import progress from JSON file
   - Extra warning for high progress (>80%)
   - Offer to backup before reset
   - Visual progress summary

## Priority
Medium - This is a useful feature for development and testing, and for users who want to start over.

## Estimated Effort
2-3 hours

## Additional Notes
- Consider adding a "soft reset" option that only clears progress but keeps role selection
- Could add an export/import feature for backing up progress
- Useful for testing and demonstration purposes
- Should be hidden or disabled in production/exam mode

## Related Issues
- None currently

## Date Reported
2025-01-23
