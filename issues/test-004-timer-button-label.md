# Issue: Timer Button Label Doesn't Update When Running [PENDING]

## Metadata
- **Date**: 2024-01-09T11:15:00Z
- **Test**: Timer Functionality
- **Severity**: Low
- **Category**: UI/UX
- **Status**: PENDING
- **Priority**: Low
- **Last Reviewed**: 2025-09-23

## Description
When the timer is started, the button still shows "▶ Start Timer" instead of changing to "⏸ Pause Timer" or similar. This makes it unclear whether the timer is running or not.

## Steps to Reproduce
1. Navigate to http://localhost:5502/toetsing.html#/timer
2. Click "▶ Start Timer" button
3. Observe that button label doesn't change

## Expected Behavior
Button should change to show "⏸ Pause Timer" when timer is running, allowing user to pause the timer.

## Actual Behavior
Button remains as "▶ Start Timer" even though timer is running (countdown from 40:00 to 39:59 visible).

## Environment
- Browser: Chromium (Playwright)
- Viewport: 1024x768
- Device: Desktop

## Evidence
- Timer is running (shows 39:59 from 40:00)
- Notification "Timer gestart" appears
- Button ref e121 still shows "▶ Start Timer"

## Suggested Fix
Update timer component to:
1. Change button label to "Pause" when timer is running
2. Change button icon from play (▶) to pause (⏸)
3. Toggle between play/pause states on click