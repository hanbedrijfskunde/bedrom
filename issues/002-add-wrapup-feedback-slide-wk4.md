# Issue #002: Add Wrap-up & Feedback Slide to Week 4

**Status: RESOLVED** ✅

## Description
Add a Wrap-up & Feedback slide to slides-wk4.html, similar to the one in slides-wk3.html. This should be the final content slide (slide 13) that summarizes key takeaways and provides a feedback mechanism.

## Acceptance Criteria
- [x] Add new slide as slide 13 (before or replacing current closing slide)
- [x] Include "Belangrijkste Takeaways" section with Week 4 key points
- [x] Include feedback QR code section
- [x] Maintain consistent styling with existing slides
- [x] Update slide counter to reflect total of 13 slides

## Technical Details

### Slide Structure (based on Week 3 template)
```html
<!-- Slide 13: Wrap-up & Feedback -->
<section class="slide h-full flex-col items-center justify-center text-center">
    <div class="slide-content">
        <h2 class="text-4xl sm:text-5xl font-bold">Wrap-up & Feedback</h2>
        <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
            <div class="bg-gray-200 p-6 rounded-lg">
                <h3 class="font-bold text-xl mb-2">Belangrijkste Takeaways</h3>
                <ul class="list-disc list-inside space-y-2">
                    <li>Sociale dilemma's ontstaan wanneer eigenbelang botst met collectief welzijn</li>
                    <li>Het gevangenendilemma illustreert waarom samenwerking moeilijk is zonder communicatie</li>
                    <li>Instituties, normen en herhaalde interacties kunnen samenwerking bevorderen</li>
                    <li>Speltheorie helpt strategische interacties te analyseren en voorspellen</li>
                </ul>
            </div>
            <div class="bg-gray-800 text-white p-6 rounded-lg flex flex-col items-center justify-center text-center">
                <h3 class="font-bold text-xl mb-3">Feedback & Retrospective</h3>
                <p class="text-gray-300 mb-4">
                    Jullie feedback is essentieel. Scan de code en laat ons weten
                    wat je van dit college vond.
                </p>
                <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://hanbedrijfskunde.github.io/retrospective/?workshop=AEC%20Week4"
                    alt="Retrospective QR Code"
                    class="rounded-lg bg-white p-1"
                />
                <a href="https://hanbedrijfskunde.github.io/retrospective/?workshop=AEC%20Week4"
                   target="_blank"
                   class="text-blue-300 underline text-sm mt-2 hover:text-blue-200">
                    Direct link
                </a>
            </div>
        </div>
    </div>
</section>
```

### Key Takeaways for Week 4
1. Sociale dilemma's ontstaan wanneer eigenbelang botst met collectief welzijn
2. Het gevangenendilemma illustreert waarom samenwerking moeilijk is zonder communicatie
3. Publieke goederen vereisen collectieve actie ondanks individuele prikkels om mee te liften
4. Instituties, normen en herhaalde interacties kunnen samenwerking bevorderen
5. Speltheorie helpt strategische interacties te analyseren en voorspellen

## Files to Modify
- `/workspaces/bedrom/slides-wk4.html`

## Priority
**High** - Important for course consistency and gathering student feedback

## Resolution Details
**Resolved Date:** 2024-09-21
**Implementation:**
- Added as Slide 12 (Wrap-up & Feedback)
- Kernboodschap moved to Slide 13
- Total slide count updated from 12 to 13
- QR code generated linking to: https://hanbedrijfskunde.github.io/retrospective/?workshop=AEC%20Week4
- Two-column layout matching Week 3 style

## Key Takeaways Included:
1. Sociale dilemma's ontstaan wanneer eigenbelang botst met collectief welzijn
2. Het gevangenendilemma illustreert waarom samenwerking moeilijk is zonder communicatie
3. Publieke goederen vereisen collectieve actie ondanks individuele prikkels om mee te liften
4. Speltheorie helpt strategische interacties te analyseren en voorspellen
5. Instituties, normen en herhaalde interacties kunnen samenwerking bevorderen

## Notes
- Successfully integrated before the Kernboodschap slide
- Maintains consistent styling with other weeks
- QR code functional and links to Week 4 specific feedback form