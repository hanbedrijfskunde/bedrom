# Bug: Multiple Role Selection Modals Appearing [FIXED ✅ - Duplicate of test-001]

## Issue Description
When navigating to the "Rollen" (Roles) section and clicking on a role card, the modal for confirming the selection appears multiple times instead of just once.

## Status: FIXED (2024-01-09)
**Resolution**: This issue was the same root cause as test-001-duplicate-notifications.md and has been fixed with the same solution.

## Steps to Reproduce
1. Navigate to the "Rollen" section
2. Click on any role card (e.g., "Raad van Bestuur", "Investeerders", etc.)
3. Observe that the role details/confirmation modal appears multiple times

## Expected Behavior
- Clicking a role card should display the role details modal only once
- The modal should show the role information and sub-role selection options
- Only one modal instance should be created per click

## Actual Behavior
- Multiple modal instances are being created
- This may be caused by duplicate event listeners being attached
- The modals may be stacking on top of each other

## Severity
Medium - This affects user experience but doesn't break core functionality

## Potential Causes
1. **Duplicate Event Listeners**: The `attachEventListeners()` method in `role-selection.js` might be adding multiple click listeners to the same elements
2. **Event Bubbling**: Click events might be bubbling up and triggering multiple handlers
3. **View Re-initialization**: When the view is re-loaded, event listeners might not be properly cleaned up before new ones are attached

## Suggested Fix
In `/workspaces/bedrom/js/components/role-selection.js`:

1. Remove the global click listener or ensure it's only attached once
2. Use event delegation properly to avoid duplicate listeners
3. Check if a modal already exists before creating a new one
4. Clean up event listeners when the component is destroyed or re-initialized

## Code Location
- File: `/workspaces/bedrom/js/components/role-selection.js`
- Method: `attachEventListeners()` (line ~396)
- Method: `selectRole()` (line ~168)
- Method: `showRoleDetails()` (line ~183)

## Additional Notes
- This issue was discovered during testing of the role selection functionality
- The bug doesn't prevent the role selection from working, but creates a confusing user experience
- May also cause performance issues if many modals are created

## Fix Applied (2024-01-09)
The issue was caused by duplicate event handlers being attached to role cards. This was the same root cause as test-001-duplicate-notifications.md.

### Solution:
1. Removed duplicate inline onclick handlers from role cards
2. Added proper event listener cleanup to prevent duplicates
3. Implemented debounce mechanism for notifications and modals
4. Updated cache version in service worker

### Files Modified:
- `/js/components/role-selection.js` - Fixed duplicate event handling
- `/sw.js` - Updated cache version

## Date Reported
2025-09-23

## Date Fixed
2024-01-09