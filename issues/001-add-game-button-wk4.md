# Issue #001: Add Prisoner's Dilemma Game Button to Week 4 Slides

**Status: RESOLVED** ✅

## Description
Add a button/link to the prisoner's dilemma game in the Week 4 presentation (slides-wk4.html). The game is hosted at: https://starfish-app-a4m9z.ondigitalocean.app/

## Acceptance Criteria
- [x] Add a game button/link somewhere appropriate in slides-wk4.html
- [x] Button should have consistent styling with other interactive elements
- [x] Link opens in a new tab (target="_blank")
- [x] Button is placed in a logical location (suggestion: after the prisoner's dilemma explanation slides)

## Technical Details

### Suggested Implementation
Add a new slide or integrate into an existing slide (e.g., after slide 10 or 11) with:

```html
<div class="mt-8">
    <a href="https://starfish-app-a4m9z.ondigitalocean.app/"
       target="_blank"
       class="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold transition text-lg">
        <span>🎮</span>
        <span>Speel het Gevangenendilemma</span>
    </a>
</div>
```

### Alternative: Add to existing slide
Could be added to slide 10 (Resultaat & De "Tragedie") or slide 11 (Sociale Dilemma's Oplossen) as an interactive element.

## Files to Modify
- `/workspaces/bedrom/slides-wk4.html`

## Priority
**Medium** - Enhances learning experience but not critical for basic functionality

## Resolution Details
**Resolved Date:** 2024-09-21
**Implementation:**
- Button added to Slide 6 (after "Begripvragen")
- Styled with green color scheme (bg-green-500)
- Text adapted to "Speel het Publieke Goederenspel" to match slide context
- Includes hover effects and proper accessibility features

## Notes
- The game provides an interactive way for students to experience the prisoner's dilemma
- Button successfully integrated with existing slide flow
- Positioned after comprehension questions for optimal learning sequence