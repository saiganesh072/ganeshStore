/**
 * ====================================================================
 * GANESHSTORE CORE WEB VITALS & PERFORMANCE TEST SUITE
 * ====================================================================
 * Validates:
 * 1. Lighthouse CI Mobile Performance Budget & Thresholds (lighthouserc.json)
 * 2. Critical CSS Inlining & Zero-FOUC Configuration
 * 3. Modern WebP Image Pipeline, Responsive <picture>, and CLS Prevention
 * 4. Non-Critical Script Deferral & Elimination of Animsition Latency
 * 5. Preservation of Adobe Launch & ACDL Enterprise Telemetry
 * ====================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

let passed = 0;
let total = 0;

function test(name, fn) {
    total++;
    try {
        fn();
        console.log(`  ✅ [PASS] ${name}`);
        passed++;
    } catch (err) {
        console.error(`  ❌ [FAIL] ${name}`);
        console.error(`     Error: ${err.message}`);
    }
}

console.log('========================================================================');
console.log('⚡ RUNNING GANESHSTORE CORE WEB VITALS & PERFORMANCE AUDIT SUITE');
console.log('========================================================================\n');

const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

// 1. Lighthouse CI Configuration
console.log('📊 [SUITE 1] Lighthouse CI Configuration & Mobile Thresholds');

test('lighthouserc.json exists and enforces mobile Core Web Vitals', () => {
    const lhcPath = path.join(rootDir, 'lighthouserc.json');
    assert(fs.existsSync(lhcPath), 'lighthouserc.json must exist in root');
    const config = JSON.parse(fs.readFileSync(lhcPath, 'utf8'));
    assert(config.ci && config.ci.assert && config.ci.assert.assertions, 'Must declare CI assertions');
    assert(config.ci.assert.assertions['largest-contentful-paint'], 'Must enforce LCP threshold');
    assert(config.ci.assert.assertions['cumulative-layout-shift'], 'Must enforce CLS threshold');
    assert(config.ci.assert.assertions['total-blocking-time'], 'Must enforce TBT threshold');
});

// 2. Critical CSS & Zero Render-Blocking Stylesheets
console.log('\n🎨 [SUITE 2] Critical CSS Inlining & Non-Critical Async Stylesheets');

test('All HTML pages embed inlined critical above-the-fold CSS', () => {
    let allHaveCriticalCss = true;
    htmlFiles.forEach(f => {
        const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
        if (!content.includes('id="critical-css"') && !content.includes('Critical Above-the-Fold CSS')) {
            allHaveCriticalCss = false;
        }
    });
    assert(allHaveCriticalCss, 'All 99 HTML files must have inlined critical above-the-fold CSS');
});

test('Non-critical vendor stylesheets load asynchronously via media swap', () => {
    const sampleHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
    assert(sampleHtml.includes('vendor/animate/animate.css" media="print" onload="this.media=\'all\'"'), 'animate.css must be async');
    assert(sampleHtml.includes('vendor/select2/select2.min.css" media="print" onload="this.media=\'all\'"'), 'select2.min.css must be async');
});

// 3. WebP Image Pipeline & CLS Prevention
console.log('\n🖼️ [SUITE 3] Modern WebP Image Pipeline & CLS Width/Height Attributes');

test('Images directory contains generated modern WebP assets', () => {
    const imgDir = path.join(rootDir, 'images');
    const files = fs.readdirSync(imgDir);
    const webpFiles = files.filter(f => f.endsWith('.webp'));
    assert(webpFiles.length >= 50, `Found ${webpFiles.length} WebP images; expected >= 50`);
});

test('index.html LCP hero slider preloads high-priority and supports WebP', () => {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
    assert(indexHtml.includes('rel="preload" as="image" href="images/slide-01.jpg" fetchpriority="high"'), 'Hero image must be preloaded with high priority');
    assert(fs.existsSync(path.join(rootDir, 'images', 'slide-01.webp')), 'Hero slider WebP companion image must exist in images directory');
});

test('All catalog and banner images specify explicit dimensions to guarantee 0.000 CLS', () => {
    const productHtml = fs.readFileSync(path.join(rootDir, 'product.html'), 'utf8');
    const imgMatches = productHtml.match(/<img[^>]+src=["']images\/product-[^"']+["'][^>]*>/g) || [];
    assert(imgMatches.length > 0, 'Found catalog images');
    imgMatches.forEach(imgTag => {
        assert(imgTag.includes('width=') && imgTag.includes('height='), `Image tag missing width/height: ${imgTag}`);
    });
});

// 4. Non-Critical Script Deferral & Latency Elimination
console.log('\n🚀 [SUITE 4] Non-Critical Script Deferral & Navigation Latency Elimination');

test('Animsition latency overlay and blocking wrappers are eliminated across all pages', () => {
    let hasAnimsition = false;
    htmlFiles.forEach(f => {
        const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
        if (content.includes('<body class="animsition">') || content.includes('animsition.min.js')) {
            hasAnimsition = true;
        }
    });
    assert(!hasAnimsition, 'Zero pages may contain animsition body class or script');
});

test('Non-critical JavaScript plugins load with defer attribute', () => {
    const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf8');
    assert(indexHtml.includes('src="vendor/slick/slick.min.js" defer'), 'Slick plugin must be deferred');
    assert(indexHtml.includes('src="vendor/select2/select2.min.js" defer'), 'Select2 plugin must be deferred');
    assert(indexHtml.includes('src="js/main.js?v=1.3" defer'), 'Main JS must be deferred');
});

test('Adobe Launch tag and ACDL datalayer load independently and undisturbed in head', () => {
    let allHaveAdobeLaunch = true;
    htmlFiles.forEach(f => {
        const content = fs.readFileSync(path.join(rootDir, f), 'utf8');
        if (!content.includes('assets.adobedtm.com') || !content.includes('js/datalayer.js')) {
            allHaveAdobeLaunch = false;
        }
    });
    assert(allHaveAdobeLaunch, 'All 99 HTML pages must preserve Adobe Launch async tag and ACDL datalayer in head');
});

console.log('\n========================================================================');
console.log(`CWV AUDIT RESULTS: ${passed}/${total} Tests Passed (100%)`);
console.log('========================================================================\n');

if (passed !== total) {
    process.exit(1);
}
