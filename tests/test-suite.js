/**
 * Test Suite for De Strategische Arena
 * Unit and integration tests for all components
 */

class TestSuite {
    constructor() {
        this.tests = [];
        this.results = [];
        this.currentTest = null;
    }

    /**
     * Register a test
     */
    test(name, testFn) {
        this.tests.push({ name, testFn });
    }

    /**
     * Run all tests
     */
    async runAll() {
        console.log('🧪 Starting Test Suite...');
        this.results = [];
        
        for (const test of this.tests) {
            this.currentTest = test.name;
            
            try {
                await test.testFn();
                this.results.push({
                    name: test.name,
                    status: 'PASS',
                    error: null
                });
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.results.push({
                    name: test.name,
                    status: 'FAIL',
                    error: error.message
                });
                console.error(`❌ ${test.name}: ${error.message}`);
            }
        }
        
        this.printSummary();
        return this.results;
    }

    /**
     * Print test summary
     */
    printSummary() {
        const passed = this.results.filter(r => r.status === 'PASS').length;
        const failed = this.results.filter(r => r.status === 'FAIL').length;
        const total = this.results.length;
        
        console.log('\n' + '='.repeat(50));
        console.log(`Test Results: ${passed}/${total} passed, ${failed} failed`);
        console.log('='.repeat(50));
        
        if (failed > 0) {
            console.log('\nFailed Tests:');
            this.results
                .filter(r => r.status === 'FAIL')
                .forEach(r => console.log(`  - ${r.name}: ${r.error}`));
        }
    }

    /**
     * Assert helper functions
     */
    assert(condition, message = 'Assertion failed') {
        if (!condition) {
            throw new Error(message);
        }
    }

    assertEquals(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    assertNotNull(value, message) {
        if (value === null || value === undefined) {
            throw new Error(message || 'Value is null or undefined');
        }
    }

    assertExists(selector, message) {
        const element = document.querySelector(selector);
        if (!element) {
            throw new Error(message || `Element not found: ${selector}`);
        }
        return element;
    }
}

// Create test suite instance
const testSuite = new TestSuite();

// =========================
// UNIT TESTS
// =========================

// Test State Manager
testSuite.test('StateManager: Initialize with default state', () => {
    const state = stateManager.getInitialState();
    testSuite.assertNotNull(state);
    testSuite.assertNotNull(state.user);
    testSuite.assertNotNull(state.progress);
});

testSuite.test('StateManager: Set and get values', () => {
    stateManager.set('test.value', 'hello');
    const value = stateManager.get('test.value');
    testSuite.assertEquals(value, 'hello');
});

testSuite.test('StateManager: LocalStorage persistence', () => {
    stateManager.set('persist.test', 'saved');
    const saved = localStorage.getItem('strategische_arena_state');
    testSuite.assertNotNull(saved);
    const parsed = JSON.parse(saved);
    testSuite.assertEquals(parsed.persist?.test, 'saved');
});

// Test Router
testSuite.test('Router: Navigate to view', () => {
    router.navigate('home');
    testSuite.assertEquals(window.location.hash, '#home');
});

testSuite.test('Router: Handle route change', () => {
    window.location.hash = '#roles';
    // Wait for hashchange event
    setTimeout(() => {
        const container = document.getElementById('view-container');
        testSuite.assertNotNull(container);
    }, 100);
});

// Test Timer
testSuite.test('Timer: Initialize with correct duration', () => {
    const timer = new PresentationTimer();
    testSuite.assertEquals(timer.totalDuration, 40 * 60); // 40 minutes in seconds
});

testSuite.test('Timer: Phase transitions', () => {
    const timer = new PresentationTimer();
    testSuite.assertEquals(timer.currentPhase, 0);
    timer.timeRemaining = 35 * 60; // Jump to 35 minutes
    timer.checkPhaseTransition();
    testSuite.assert(timer.currentPhase > 0, 'Phase should advance');
});

// Test Progress Tracker
testSuite.test('Progress: Calculate percentage', () => {
    const progress = new ProgressTracker();
    progress.updateModuleProgress('test1', true);
    progress.updateModuleProgress('test2', false);
    const percentage = progress.calculateOverallProgress();
    testSuite.assert(percentage >= 0 && percentage <= 100, 'Percentage should be between 0 and 100');
});

// Test Role Selection Bug Fix
testSuite.test('RoleSelection: No duplicate event listeners', () => {
    const roleCard = document.querySelector('.role-card');
    if (roleCard) {
        // Click once
        roleCard.click();
        
        // Count modals
        const modals = document.querySelectorAll('.modal:not(.hidden)');
        testSuite.assert(modals.length <= 1, 'Should only show one modal');
    }
});

// =========================
// INTEGRATION TESTS
// =========================

testSuite.test('Integration: Role selection flow', async () => {
    // Select a role
    roleSelection.selectRole('rvb');
    testSuite.assertEquals(stateManager.get('user.role'), 'rvb');
    
    // Select sub-role
    roleSelection.selectSubRole('CEO');
    testSuite.assertEquals(stateManager.get('user.subRole'), 'CEO');
});

testSuite.test('Integration: Progress updates', () => {
    const tracker = new ProgressTracker();
    
    // Update multiple modules
    tracker.updateModuleProgress('roleSelection', true);
    tracker.updateModuleProgress('materials', true);
    tracker.updateModuleProgress('timer', false);
    
    const progress = tracker.calculateOverallProgress();
    testSuite.assert(progress > 0, 'Progress should be greater than 0');
});

testSuite.test('Integration: Team creation', () => {
    const team = teamCoordination.createTeam('Test Team');
    testSuite.assertNotNull(team);
    testSuite.assertNotNull(team.inviteCode);
    testSuite.assertEquals(team.name, 'Test Team');
});

// =========================
// ACCESSIBILITY TESTS
// =========================

testSuite.test('A11y: Skip links exist', () => {
    const skipLink = testSuite.assertExists('.skip-link');
    testSuite.assertNotNull(skipLink.getAttribute('href'));
});

testSuite.test('A11y: ARIA labels present', () => {
    const nav = document.querySelector('nav');
    if (nav) {
        const ariaLabel = nav.getAttribute('aria-label');
        testSuite.assertNotNull(ariaLabel, 'Navigation should have aria-label');
    }
});

testSuite.test('A11y: Focus indicators visible', () => {
    const button = document.querySelector('button');
    if (button) {
        button.focus();
        const outline = window.getComputedStyle(button).outline;
        testSuite.assertNotNull(outline);
    }
});

// =========================
// PERFORMANCE TESTS
// =========================

testSuite.test('Performance: Page load time', () => {
    if (window.performance) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        testSuite.assert(loadTime < 5000, `Page load time (${loadTime}ms) should be under 5 seconds`);
    }
});

testSuite.test('Performance: LocalStorage size', () => {
    const storageSize = new Blob([JSON.stringify(localStorage)]).size;
    testSuite.assert(storageSize < 5000000, `LocalStorage size (${storageSize} bytes) should be under 5MB`);
});

// =========================
// MOBILE TESTS
// =========================

testSuite.test('Mobile: Touch targets minimum size', () => {
    const buttons = document.querySelectorAll('button, a, input[type="checkbox"]');
    buttons.forEach(button => {
        const rect = button.getBoundingClientRect();
        testSuite.assert(
            rect.width >= 44 && rect.height >= 44,
            `Touch target too small: ${rect.width}x${rect.height}`
        );
    });
});

testSuite.test('Mobile: Viewport meta tag', () => {
    const viewport = document.querySelector('meta[name="viewport"]');
    testSuite.assertNotNull(viewport, 'Viewport meta tag should exist');
    testSuite.assert(
        viewport.content.includes('width=device-width'),
        'Viewport should be device-width'
    );
});

// =========================
// PWA TESTS
// =========================

testSuite.test('PWA: Service Worker registered', async () => {
    if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        testSuite.assertNotNull(registration, 'Service Worker should be registered');
    }
});

testSuite.test('PWA: Manifest linked', () => {
    const manifest = document.querySelector('link[rel="manifest"]');
    testSuite.assertNotNull(manifest, 'Manifest should be linked');
});

// =========================
// BUG FIXES
// =========================

testSuite.test('Bug Fix: Multiple modal issue resolved', () => {
    // Clean up any existing modals
    document.querySelectorAll('.modal').forEach(m => m.remove());
    
    // Simulate multiple rapid clicks
    const roleCard = document.querySelector('[data-role-id]');
    if (roleCard) {
        for (let i = 0; i < 5; i++) {
            roleCard.click();
        }
        
        // Check only one modal exists
        const modals = document.querySelectorAll('.modal');
        testSuite.assert(modals.length <= 1, `Expected 1 modal, found ${modals.length}`);
    }
});

testSuite.test('Bug Fix: Progress persistence', () => {
    // Set progress
    stateManager.set('progress.modules.test', true);
    
    // Simulate page reload by saving and loading
    const saved = localStorage.getItem('strategische_arena_state');
    const loaded = JSON.parse(saved);
    
    testSuite.assertEquals(
        loaded.progress?.modules?.test,
        true,
        'Progress should persist after reload'
    );
});

// Export test suite
export default testSuite;

// Auto-run tests if in test environment
if (typeof window !== 'undefined' && window.location.search.includes('test=true')) {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🧪 Running automated tests...');
        testSuite.runAll().then(results => {
            // Display results in page
            const resultsDiv = document.createElement('div');
            resultsDiv.className = 'fixed top-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-md z-50';
            
            const passed = results.filter(r => r.status === 'PASS').length;
            const failed = results.filter(r => r.status === 'FAIL').length;
            
            resultsDiv.innerHTML = `
                <h3 class="text-lg font-bold mb-2">Test Results</h3>
                <div class="text-sm">
                    <p class="${failed === 0 ? 'text-green-600' : 'text-red-600'} font-medium">
                        ${passed}/${results.length} tests passed
                    </p>
                    ${failed > 0 ? `
                        <details class="mt-2">
                            <summary class="cursor-pointer text-red-600">Failed tests (${failed})</summary>
                            <ul class="mt-1 text-xs">
                                ${results
                                    .filter(r => r.status === 'FAIL')
                                    .map(r => `<li>- ${r.name}: ${r.error}</li>`)
                                    .join('')}
                            </ul>
                        </details>
                    ` : ''}
                </div>
                <button onclick="this.parentElement.remove()" class="mt-3 text-xs text-gray-500 hover:text-gray-700">
                    Close
                </button>
            `;
            
            document.body.appendChild(resultsDiv);
        });
    });
}