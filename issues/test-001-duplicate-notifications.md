# Issue: Duplicate Notifications on Role Selection [FIXED ✅]

## Metadata
- **Date**: 2024-01-09T10:30:00Z
- **Test**: Role Selection Flow
- **Severity**: Medium
- **Category**: UI/Functionality
- **Status**: FIXED (2024-01-09)
- **Resolution Date**: 2024-01-09

## Description
When selecting a role (Raad van Bestuur), three identical notification messages appear simultaneously at the bottom of the screen, all saying "Raad van Bestuur geselecteerd als je rol". This creates visual clutter and confusion.

## Steps to Reproduce
1. Navigate to http://localhost:5502/toetsing.html
2. Click on "Rollen" in navigation
3. Click on "Raad van Bestuur" role card
4. Observe multiple duplicate notifications appear

## Expected Behavior
Only one notification should appear when a role is selected.

## Actual Behavior
Three identical notifications appear stacked on top of each other, each with its own close button.

## Environment
- Browser: Chromium (Playwright)
- Viewport: Default
- Device: Desktop

## Evidence
- Console shows multiple state change events for the same action
- DOM inspection reveals three notification elements with refs e137, e139, e143, e147

## Suggested Fix
Check the event listeners and notification system to ensure only one notification is triggered per action. Possible causes:
1. Multiple event listeners attached to the same element
2. State change triggering multiple notification calls
3. Missing debounce on notification creation

## Fix Applied (2024-01-09)

### Root Cause
The role cards had duplicate event handling:
1. Inline `onclick` attribute calling `roleSelection.selectRole()`
2. Document-level click event listener also calling `selectRole()` for elements with `[data-role-id]`
3. Event listeners were being attached multiple times without cleanup

### Solution Implemented
1. **Removed inline onclick handler** from role cards (line 141)
2. **Added event listener cleanup** to prevent duplicate listeners (lines 359-373)
3. **Added debounce mechanism** to notifications (lines 395-406)

### Files Modified
- `/js/components/role-selection.js` - Fixed duplicate event handling and added debounce
- `/sw.js` - Updated cache version to v5 to ensure fixes are loaded

### Testing Required
1. Navigate to Rollen page
2. Click on any role card
3. Verify only ONE notification appears
4. Test rapid clicking to ensure debounce works