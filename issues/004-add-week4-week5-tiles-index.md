# Issue #004: Add Week 4 and Week 5 Tiles to Index Page

## Description
Add tiles for Week 4 and Week 5 to the index.html landing page. Week 4 content is ready, Week 5 should use placeholders until content is complete.

## Acceptance Criteria
- [ ] Add Week 4 tile with proper links and content
- [ ] Add Week 5 tile with placeholder content
- [ ] Maintain consistent styling with existing week tiles
- [ ] Ensure proper gradient colors for each week
- [ ] Add appropriate icons/emojis for visual consistency

## Technical Details

### Week 4 Tile Structure
```html
<!-- Week 4 -->
<div class="week-card bg-white rounded-2xl shadow-lg overflow-hidden">
    <div class="h-48 bg-gradient-to-br from-purple-400 to-purple-600 relative overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center text-white">
                <img src="images/week4-social-interactions.png" alt="Sociale interacties" class="week-image mx-auto mb-2">
                <div class="week-image-fallback text-6xl mb-2">🤝</div>
                <p class="text-sm opacity-80">Sociale interacties & dilemma's</p>
            </div>
        </div>
        <div class="absolute top-4 left-4">
            <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">Week 4</span>
        </div>
    </div>
    <div class="p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-2">Sociale Interacties & Dilemma's</h3>
        <p class="text-gray-600 mb-6 text-sm">Speltheorie, gevangenendilemma en samenwerking</p>

        <div class="space-y-3">
            <a href="slides-wk4.html" class="material-link flex items-center justify-between bg-blue-50 hover:bg-blue-100 px-4 py-3 rounded-lg text-blue-700 font-medium">
                <span class="flex items-center">
                    <span class="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Slides
                </span>
                <span class="text-xs">→</span>
            </a>

            <a href="https://starfish-app-a4m9z.ondigitalocean.app/" target="_blank" class="material-link flex items-center justify-between bg-green-50 hover:bg-green-100 px-4 py-3 rounded-lg text-green-700 font-medium">
                <span class="flex items-center">
                    <span class="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Gevangenendilemma Spel
                </span>
                <span class="text-xs">🎮</span>
            </a>

            <a href="draaiboek-wk4.md" class="docent-only material-link flex items-center justify-between bg-purple-50 hover:bg-purple-100 px-4 py-3 rounded-lg text-purple-700 font-medium">
                <span class="flex items-center">
                    <span class="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Draaiboek
                </span>
                <span class="text-xs">🔒</span>
            </a>
        </div>
    </div>
</div>
```

### Week 5 Tile Structure (Placeholder)
```html
<!-- Week 5 -->
<div class="week-card bg-white rounded-2xl shadow-lg overflow-hidden">
    <div class="h-48 bg-gradient-to-br from-green-400 to-green-600 relative overflow-hidden">
        <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center text-white">
                <img src="images/week5-esg-frameworks.png" alt="ESG Frameworks" class="week-image mx-auto mb-2">
                <div class="week-image-fallback text-6xl mb-2">🌱</div>
                <p class="text-sm opacity-80">ESG & Duurzaamheid</p>
            </div>
        </div>
        <div class="absolute top-4 left-4">
            <span class="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-medium">Week 5</span>
        </div>
    </div>
    <div class="p-6">
        <h3 class="text-xl font-bold text-gray-800 mb-2">ESG Frameworks</h3>
        <p class="text-gray-600 mb-6 text-sm">Environmental, Social & Governance in bedrijfsvoering</p>

        <div class="space-y-3">
            <div class="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg text-gray-500">
                <span class="flex items-center">
                    <span class="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    Slides (Coming Soon)
                </span>
                <span class="text-xs">🚧</span>
            </div>

            <div class="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg text-gray-500">
                <span class="flex items-center">
                    <span class="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    ESG Simulator (Coming Soon)
                </span>
                <span class="text-xs">🚧</span>
            </div>

            <div class="docent-only flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg text-gray-500">
                <span class="flex items-center">
                    <span class="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    Draaiboek (Coming Soon)
                </span>
                <span class="text-xs">🔒</span>
            </div>
        </div>
    </div>
</div>
```

## Files to Modify
- `/workspaces/bedrom/index.html`

## Notes for Implementation
- Insert after Week 3 tile in the grid
- Consider changing grid to `lg:grid-cols-3` if keeping 3-column layout
- May need to adjust grid to show 2 rows of 3 columns or 3 rows of 2 columns
- Week 4 uses purple gradient (from-purple-400 to-purple-600)
- Week 5 uses green gradient (from-green-400 to-green-600)
- Ensure draaiboek-wk4.md is created before linking

## Priority
**High** - Needed for navigation to new week content

## Dependencies
- Requires draaiboek-wk4.md to be created (or remove link temporarily)
- Week 5 content can remain as placeholder until Issue #003 is complete