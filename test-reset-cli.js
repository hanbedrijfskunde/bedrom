#!/usr/bin/env node

/**
 * Command-line test for Reset Memory button functionality
 * Run with: node test-reset-cli.js
 */

const http = require('http');
const fs = require('fs').promises;
const path = require('path');

const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m'
};

function log(message, color = colors.reset) {
    console.log(`${color}${message}${colors.reset}`);
}

async function checkFile(filePath, description) {
    try {
        await fs.access(filePath);
        log(`✅ ${description}: File exists`, colors.green);
        return true;
    } catch {
        log(`❌ ${description}: File not found`, colors.red);
        return false;
    }
}

async function checkFileContent(filePath, searchStrings, description) {
    try {
        const content = await fs.readFile(filePath, 'utf8');
        const found = searchStrings.every(str => content.includes(str));
        if (found) {
            log(`✅ ${description}`, colors.green);
        } else {
            log(`❌ ${description}`, colors.red);
        }
        return found;
    } catch (error) {
        log(`❌ Error reading file: ${error.message}`, colors.red);
        return false;
    }
}

async function testHttpRequest(url) {
    return new Promise((resolve) => {
        http.get(url, (res) => {
            if (res.statusCode === 200) {
                log(`✅ Server test: ${url} responds with 200 OK`, colors.green);
                resolve(true);
            } else {
                log(`❌ Server test: ${url} responds with ${res.statusCode}`, colors.red);
                resolve(false);
            }
        }).on('error', (err) => {
            log(`❌ Server test failed: ${err.message}`, colors.red);
            resolve(false);
        });
    });
}

async function runTests() {
    log('\n🧪 RESET MEMORY BUTTON - FUNCTIONALITY TESTS\n', colors.blue);
    log('=' .repeat(50));

    const results = {
        passed: 0,
        failed: 0,
        total: 0
    };

    async function test(name, fn) {
        results.total++;
        log(`\nTest ${results.total}: ${name}`, colors.yellow);
        const passed = await fn();
        if (passed) results.passed++;
        else results.failed++;
    }

    // Test 1: Check settings.js exists
    await test('Settings component file exists', async () => {
        return await checkFile(
            path.join(__dirname, 'js/components/settings.js'),
            'settings.js'
        );
    });

    // Test 2: Check settings.js has reset functionality
    await test('Reset functionality implemented', async () => {
        return await checkFileContent(
            path.join(__dirname, 'js/components/settings.js'),
            ['handleReset', 'localStorage.clear()', 'confirm('],
            'Reset function with confirmation dialog'
        );
    });

    // Test 3: Check settings.js has export/import
    await test('Export/Import functionality', async () => {
        return await checkFileContent(
            path.join(__dirname, 'js/components/settings.js'),
            ['exportProgress', 'importProgress', 'download'],
            'Export and import progress features'
        );
    });

    // Test 4: Check toetsing.html imports settings
    await test('Settings imported in main page', async () => {
        const exists = await checkFile(
            path.join(__dirname, 'toetsing.html'),
            'toetsing.html'
        );
        if (!exists) return false;

        return await checkFileContent(
            path.join(__dirname, 'toetsing.html'),
            ['settings-button', 'Settings'],
            'Settings button in HTML'
        );
    });

    // Test 5: Check app.js loads settings
    await test('App.js loads settings component', async () => {
        return await checkFileContent(
            path.join(__dirname, 'js/core/app.js'),
            ['loadSettings', '../components/settings.js'],
            'Settings component loaded in app.js'
        );
    });

    // Test 6: Check state-manager reset method
    await test('StateManager has reset method', async () => {
        return await checkFileContent(
            path.join(__dirname, 'js/core/state-manager.js'),
            ['reset()', 'localStorage.removeItem', 'state:reset'],
            'StateManager reset implementation'
        );
    });

    // Test 7: Check server accessibility
    await test('Local server running', async () => {
        return await testHttpRequest('http://localhost:5502/toetsing.html');
    });

    // Test 8: Check issue documentation
    await test('Reset button issue documented', async () => {
        return await checkFileContent(
            path.join(__dirname, 'issues/feature-reset-memory-button.md'),
            ['Reset Memory Button', 'IMPLEMENTED', '✅'],
            'Issue marked as implemented'
        );
    });

    // Test 9: Check for safety measures
    await test('Safety measures implemented', async () => {
        return await checkFileContent(
            path.join(__dirname, 'js/components/settings.js'),
            ['progress.percentage > 80', 'backup', 'WAARSCHUWING'],
            'Extra confirmations for high progress'
        );
    });

    // Test 10: Check UI styling
    await test('Reset button has appropriate styling', async () => {
        return await checkFileContent(
            path.join(__dirname, 'js/components/settings.js'),
            ['btn-danger', 'bg-red-600', 'hover:bg-red-700'],
            'Danger button styling for reset'
        );
    });

    // Summary
    log('\n' + '=' .repeat(50), colors.blue);
    log('\n📊 TEST SUMMARY:\n', colors.blue);
    log(`Total Tests: ${results.total}`);
    log(`Passed: ${results.passed}`, colors.green);
    log(`Failed: ${results.failed}`, results.failed > 0 ? colors.red : colors.green);
    log(`Success Rate: ${Math.round((results.passed / results.total) * 100)}%\n`);

    if (results.passed === results.total) {
        log('🎉 All tests passed! Reset functionality is properly implemented.\n', colors.green);
        log('Next steps:', colors.yellow);
        log('1. Open http://localhost:5502/test-reset-function.html for automated browser tests');
        log('2. Open http://localhost:5502/test-integration-reset.html for interactive testing');
        log('3. Open http://localhost:5502/toetsing.html to test the actual application\n');
    } else {
        log('⚠️  Some tests failed. Please review the implementation.\n', colors.red);
    }

    process.exit(results.failed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
    log(`\n❌ Test runner error: ${error.message}`, colors.red);
    process.exit(1);
});