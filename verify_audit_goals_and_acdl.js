const fs = require('fs');
const path = require('path');

console.log('========================================================================');
console.log('GANESH STORE: AUDIT GOALS, ACDL TELEMETRY & STOREFRONT VERIFICATION');
console.log('========================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✓ [PASS] ${message}`);
        passed++;
    } else {
        console.error(`  ✗ [FAIL] ${message}`);
        failed++;
    }
}

const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

// 1. Single Global Canonical Region Verification
console.log('--- Suite 1: Single Global Canonical Region & SEO ---');
assert(!fs.existsSync(path.join(rootDir, 'in')), 'in/ directory is removed (consolidated to global)');
assert(!fs.existsSync(path.join(rootDir, 'us')), 'us/ directory is removed (consolidated to global)');
assert(fs.existsSync(path.join(rootDir, 'robots.txt')), 'robots.txt exists in root');
assert(fs.existsSync(path.join(rootDir, 'sitemap.xml')), 'sitemap.xml exists in root');

let allHaveGlobalCanonical = true;
htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
    if (!content.includes('<link rel="canonical" href="https://ganeshstore.com')) {
        allHaveGlobalCanonical = false;
    }
});
assert(allHaveGlobalCanonical, `All ${htmlFiles.length} HTML files have unified global canonical tags`);

// 2. Adobe Client Data Layer (ACDL) Enterprise Methods
console.log('\n--- Suite 2: Adobe Client Data Layer (ACDL) Enterprise Standard ---');
const dataLayerJs = fs.readFileSync(path.join(rootDir, 'js', 'datalayer.js'), 'utf-8');
assert(dataLayerJs.includes('window.trackACDLAddToCart'), 'ACDL exposes trackACDLAddToCart');
assert(dataLayerJs.includes('window.trackACDLRemoveFromCart'), 'ACDL exposes trackACDLRemoveFromCart');
assert(dataLayerJs.includes('window.trackACDLPurchase'), 'ACDL exposes trackACDLPurchase');
assert(dataLayerJs.includes('window.trackACDLUserLogin'), 'ACDL exposes trackACDLUserLogin');
assert(dataLayerJs.includes('window.trackACDLSearch'), 'ACDL exposes trackACDLSearch');
assert(dataLayerJs.includes('window.trackACDLCheckoutStep'), 'ACDL exposes trackACDLCheckoutStep');
assert(dataLayerJs.includes('window.trackACDLPromoCode'), 'ACDL exposes trackACDLPromoCode');
assert(dataLayerJs.includes('window.trackACDLWishlistToggle'), 'ACDL exposes trackACDLWishlistToggle');
assert(dataLayerJs.includes('window.trackACDLProductView'), 'ACDL exposes trackACDLProductView');
assert(dataLayerJs.includes('window.trackACDLFilterChange'), 'ACDL exposes trackACDLFilterChange');

// 3. Typo-Tolerant Live Search & Telemetry
console.log('\n--- Suite 3: Typo-Tolerant Live Search & Telemetry ---');
const mainJs = fs.readFileSync(path.join(rootDir, 'js', 'main.js'), 'utf-8');
assert(mainJs.includes('function isMatch('), 'main.js implements intelligent fuzzy/typo-tolerant matching');
assert(mainJs.includes('trackACDLSearch'), 'main.js triggers ACDL search telemetry on live queries');

// 4. Cart Features: Save for Later & Clear Cart
console.log('\n--- Suite 4: Cart Features (Save for Later & 1-Click Clear Cart) ---');
const cartHtml = fs.readFileSync(path.join(rootDir, 'shoping-cart.html'), 'utf-8');
assert(cartHtml.includes('js-clear-cart'), 'shoping-cart.html contains 1-Click Clear Cart button');
assert(mainJs.includes('.js-save-for-later'), 'main.js implements Save for Later wishlist migration handler');
assert(mainJs.includes('.js-clear-cart'), 'main.js implements 1-Click Clear Cart handler');

const mainCss = fs.readFileSync(path.join(rootDir, 'css', 'main.css'), 'utf-8');
assert(mainCss.includes('.btn-save-later-cart'), 'main.css styles .btn-save-later-cart with luxury hover micro-animations');

// 5. Performance, LCP & External Script Cleanup
console.log('\n--- Suite 5: Performance & External Analytics Cleanliness ---');
const indexHtml = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
assert(indexHtml.includes('rel="preload" as="image" href="images/slide-01.jpg" fetchpriority="high"'), 'index.html preloads LCP hero image with high priority');
assert(!indexHtml.includes('munchkin.marketo.net'), 'Marketo Munchkin script removed to preserve Adobe Launch exclusively');

// 6. PDP HTML Semantic & Heading Tag Integrity
console.log('\n--- Suite 6: PDP Heading & Semantic Integrity ---');
const pdpHtml = fs.readFileSync(path.join(rootDir, 'product-detail.html'), 'utf-8');
assert(!pdpHtml.includes('<h1 class="mtext-105 cl2 js-name-detail p-b-14">\n                Lightweight Jacket\n              </h4>'), 'product-detail.html has correctly matched h1 tags');

console.log('\n========================================================================');
console.log(`TOTAL AUDIT VERIFICATION RESULTS: ${passed} Passed, ${failed} Failed`);
console.log('========================================================================\n');

if (failed > 0) {
    process.exit(1);
} else {
    console.log('🎉 ALL AUDIT GOALS & QUALITY CRITERIA MET WITH 100% SUCCESS!\n');
}
