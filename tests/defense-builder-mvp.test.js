/**
 * Playwright Test - Defense Builder MVP
 * Tests for Phase 1: Basic Q&A functionality
 */

const { test, expect } = require('@playwright/test');

test.describe('Defense Builder MVP Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the toetsing page
        await page.goto('http://localhost:5502/toetsing.html#oefenen');

        // Wait for the defense builder to load
        await page.waitForSelector('#defense-builder-app', { timeout: 5000 });
    });

    test('MVP: Should load and display first question', async ({ page }) => {
        // Check that the main heading is visible
        await expect(page.locator('h2')).toContainText('Q&A Oefentool - Economic Defense Builder');

        // Check that Defense Builder content is loaded
        await expect(page.locator('#defense-builder-content')).toBeVisible();

        // Check progress bar shows question 1 of 75
        await expect(page.locator('.bg-white').first()).toContainText('Vraag 1 van 75');

        // Check that a textarea for answer is present
        await expect(page.locator('#answer-input')).toBeVisible();
    });

    test('MVP: Can save answer to localStorage', async ({ page }) => {
        // Type an answer
        const testAnswer = 'Dit is mijn test antwoord voor de eerste deelvraag. Het moet minimaal 100 karakters bevatten om een goede test te zijn van het systeem.';
        await page.fill('#answer-input', testAnswer);

        // Click save button
        await page.click('#save-answer');

        // Check notification appears
        await expect(page.locator('#save-notification')).toBeVisible();
        await expect(page.locator('#save-notification')).toContainText('Antwoord opgeslagen!');

        // Check localStorage contains the answer
        const storageData = await page.evaluate(() => {
            return localStorage.getItem('defense_builder');
        });

        expect(storageData).toBeTruthy();
        const parsed = JSON.parse(storageData);
        expect(Object.values(parsed.answers)[0]).toContain('Dit is mijn test antwoord');
    });

    test('MVP: Character counter updates while typing', async ({ page }) => {
        // Check initial character count
        await expect(page.locator('#char-count')).toContainText('0 karakters');

        // Type some text
        await page.fill('#answer-input', 'Test antwoord');

        // Check character count updated
        await expect(page.locator('#char-count')).toContainText('13 karakters');

        // Add more text to exceed 100 chars
        const longText = 'Dit is een langer antwoord dat meer dan 100 karakters bevat zodat we kunnen testen of de kleur verandert naar groen wanneer we genoeg hebben getypt.';
        await page.fill('#answer-input', longText);

        // Check that counter shows green color class when > 100 chars
        const charCountElement = page.locator('#char-count');
        await expect(charCountElement).toHaveClass(/text-green-600/);
    });

    test('MVP: Can navigate between sub-questions', async ({ page }) => {
        // Check we start at subquestion 1
        await expect(page.locator('h4')).toContainText('Deelvraag 1 van');

        // Save current answer
        await page.fill('#answer-input', 'Antwoord voor deelvraag 1');
        await page.click('#save-answer');

        // Click next subquestion if available
        const nextButton = page.locator('#next-subquestion');
        const hasNextButton = await nextButton.count() > 0;

        if (hasNextButton) {
            await nextButton.click();
            // Check we moved to subquestion 2
            await expect(page.locator('h4')).toContainText('Deelvraag 2 van');

            // Check previous button is now visible
            await expect(page.locator('#prev-subquestion')).toBeVisible();
        }
    });

    test('MVP: Can clear all storage', async ({ page }) => {
        // First save some data
        await page.fill('#answer-input', 'Test data to be cleared');
        await page.click('#save-answer');

        // Verify data is saved
        let storageData = await page.evaluate(() => localStorage.getItem('defense_builder'));
        expect(storageData).toBeTruthy();

        // Click clear storage button
        await page.click('#clear-storage');

        // Handle confirmation dialog
        page.once('dialog', dialog => {
            expect(dialog.message()).toContain('Weet je zeker dat je alle antwoorden wilt wissen?');
            dialog.accept();
        });

        // Wait for confirmation to be processed
        await page.waitForTimeout(500);

        // Check localStorage is cleared
        storageData = await page.evaluate(() => localStorage.getItem('defense_builder'));
        expect(storageData).toBeNull();

        // Check notification shows success
        await expect(page.locator('#save-notification')).toContainText('Alle antwoorden zijn gewist');
    });

    test('MVP: Persists data on page reload', async ({ page }) => {
        // Save an answer
        const testAnswer = 'Dit antwoord moet bewaard blijven na reload';
        await page.fill('#answer-input', testAnswer);
        await page.click('#save-answer');

        // Wait for save to complete
        await page.waitForTimeout(500);

        // Reload the page
        await page.reload();

        // Wait for defense builder to reinitialize
        await page.waitForSelector('#defense-builder-content', { timeout: 5000 });

        // Check that the answer is still there
        const answerValue = await page.locator('#answer-input').inputValue();
        expect(answerValue).toContain('Dit antwoord moet bewaard blijven');
    });

    test('MVP: Shows stakeholder context', async ({ page }) => {
        // Check stakeholder role is displayed
        await expect(page.locator('.bg-blue-50')).toBeVisible();

        // Check it contains role information
        const roleText = await page.locator('.bg-blue-50').textContent();
        expect(roleText).toContain('AFM');
    });

    test('MVP: Shows hints for sub-questions', async ({ page }) => {
        // Check that hints are displayed
        const hints = page.locator('.bg-yellow-100');
        const hintsCount = await hints.count();

        // Should have at least one hint
        expect(hintsCount).toBeGreaterThan(0);

        // Check hint contains helpful text
        const firstHint = await hints.first().textContent();
        expect(firstHint).toContain('💡');
    });

    test('MVP: Validates minimum answer length', async ({ page }) => {
        // Type a very short answer
        await page.fill('#answer-input', 'Te kort');
        await page.click('#save-answer');

        // Check warning notification appears
        await expect(page.locator('#save-notification')).toContainText('te kort');
    });

    test('MVP: Shows question metadata', async ({ page }) => {
        // Check week number is displayed
        await expect(page.locator('.bg-white').first()).toContainText('Week');

        // Check theme is displayed
        const themeText = await page.locator('.bg-white').first().textContent();
        expect(themeText).toMatch(/Week \d+ - .+/);
    });
});

// Performance test
test('MVP: Loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();

    await page.goto('http://localhost:5502/toetsing.html#oefenen');
    await page.waitForSelector('#defense-builder-content', { timeout: 5000 });

    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
});

// Mobile responsiveness test
test('MVP: Works on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    await page.goto('http://localhost:5502/toetsing.html#oefenen');
    await page.waitForSelector('#defense-builder-content');

    // Check that content is still accessible
    await expect(page.locator('#answer-input')).toBeVisible();
    await expect(page.locator('#save-answer')).toBeVisible();

    // Check no horizontal scroll
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
});