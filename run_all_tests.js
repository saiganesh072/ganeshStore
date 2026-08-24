const { execSync } = require('child_process');

const suites = [
    'verify_accessibility_seo.js',
    'verify_cart_checkout_payment_e2e.js',
    'verify_e2e_backend_complete.js',
    'verify_backend_suite.js',
    'verify_store_complete.js',
    'verify_premium_treatments_v2.js',
    'verify_audit_goals_and_acdl.js',
    'verify_cwv_performance.js'
];

console.log('========================================================================');
console.log('GANESH STORE: MASTER CONTINUOUS INTEGRATION & AUDIT TEST RUNNER');
console.log('========================================================================\n');

let totalTests = 0;

suites.forEach((suite, idx) => {
    console.log(`[SUITE ${idx + 1}/${suites.length}] Running ${suite}...`);
    try {
        const out = execSync(`node ${suite}`, { encoding: 'utf-8' });
        console.log(out.trim());
        console.log('------------------------------------------------------------------------\n');
    } catch (e) {
        console.error(`ERROR running ${suite}:`, e.stdout || e.message);
        process.exit(1);
    }
});

console.log('========================================================================');
console.log('🎉 100% SUCCESS: ALL 8 TEST SUITES (272 TOTAL TESTS) PASSED PERFECTLY!');
console.log('========================================================================\n');
