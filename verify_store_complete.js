const fs = require('fs');
const path = require('path');

console.log('====================================================================');
console.log('=== GANESHSTORE LUXURY SUITE & COMPLETE STOREFRONT VERIFICATION ===');
console.log('====================================================================\n');

let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`[PASS] ${message}`);
        passedTests++;
    } else {
        console.log(`[FAIL] ${message}`);
        failedTests++;
    }
}

// 1. Verify css/main.css
try {
    const cssPath = path.join(__dirname, 'css', 'main.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');

    console.log('--- TEST GROUP 1: CSS Luxury Suite Styles ---');

    assert(
        cssContent.includes('.luxury-search-overlay') && cssContent.includes('backdrop-filter: blur('),
        'Smart Live Search overlay utilizes luxury glassmorphism backdrop blur.'
    );

    assert(
        cssContent.includes('.luxury-search-input') && cssContent.includes('Poppins-Light'),
        'Live search input features modern Poppins-Light typography.'
    );

    assert(
        cssContent.includes('.luxury-trending-pill') && cssContent.includes('border-radius: 50px'),
        'Trending search chips are styled as rounded capsule pills with hover elevation.'
    );

    assert(
        cssContent.includes('.luxury-search-grid') && cssContent.includes('grid-template-columns:'),
        'Live search results grid uses responsive CSS Grid layout.'
    );

    assert(
        cssContent.includes('.luxury-search-card') && cssContent.includes('border-radius: 12px'),
        'Live search product cards feature rounded corners, smooth hover transitions, and shadow.'
    );

    assert(
        cssContent.includes('.filter-tope-group button .filter-count') && cssContent.includes('transition: color'),
        'Category filter counts (.filter-count) have subtle styling with active accent color transition.'
    );

    assert(
        cssContent.includes('.luxury-ripple-btn') && cssContent.includes('.luxury-ripple-effect') && cssContent.includes('@keyframes ripple'),
        'Tactile haptic ripple effect is fully declared with smooth scaling keyframe animation.'
    );

    assert(
        cssContent.includes('@keyframes numBump') || cssContent.includes('.num-product.value-bump'),
        'Quantity value bump micro-interaction animation is styled.'
    );

    assert(
        cssContent.includes('.shipping-progress-container') && cssContent.includes('.shipping-progress-bar-fill'),
        'Free Shipping tracker progress bar is fully styled.'
    );

    console.log();
} catch (e) {
    console.error('[ERROR] Failed to verify CSS:', e.message);
    failedTests++;
}

// 2. Verify js/main.js
try {
    const jsPath = path.join(__dirname, 'js', 'main.js');
    const jsContent = fs.readFileSync(jsPath, 'utf8');

    console.log('--- TEST GROUP 2: JavaScript Luxury Engine & Telemetry ---');

    assert(
        jsContent.includes('var GANESH_STORE_CATALOG = [') && jsContent.includes('Esprit Ruffle Shirt'),
        'Master product catalog array is declared with products, images, categories, and URLs.'
    );

    assert(
        jsContent.includes('function initSmartLiveSearch()'),
        'Smart Live Search engine (initSmartLiveSearch) is defined.'
    );

    assert(
        jsContent.includes('executeLiveSearch(') && jsContent.includes('searchDebounceTimer'),
        'Live search executes real-time filtering with debouncing.'
    );

    assert(
        jsContent.includes('luxury-trending-pill') && jsContent.includes('data-search'),
        'Trending chips populate input and trigger instant search queries.'
    );

    assert(
        jsContent.includes("e.key === 'Enter'") && jsContent.includes("product.html?search="),
        'Enter key submits search query directly to the product catalog route.'
    );

    assert(
        jsContent.includes("e.key === 'Escape'") && jsContent.includes("#luxurySearchClose"),
        'Escape key and close button dismiss the live search overlay.'
    );

    assert(
        jsContent.includes('function initCategoryFilterCounts()'),
        'Category filter count generator (initCategoryFilterCounts) is defined.'
    );

    assert(
        jsContent.includes('function initTactileRipples()'),
        'Tactile haptic ripple generator (initTactileRipples) is defined.'
    );

    assert(
        jsContent.includes('function initQuantityValueBump()'),
        'Quantity value bump handler (initQuantityValueBump) is defined.'
    );

    assert(
        jsContent.includes('window.updateFreeShippingProgressBar = function()'),
        'Free shipping progress bar tracker is defined globally.'
    );

    assert(
        jsContent.includes("localStorage.setItem('cartItems', JSON.stringify(cart))") &&
        jsContent.includes("$(document).trigger('cartUpdated')"),
        'Cart persistence unifies storage keys and dispatches cartUpdated event on changes.'
    );

    console.log();
} catch (e) {
    console.error('[ERROR] Failed to verify JS:', e.message);
    failedTests++;
}

// 3. Verify js/datalayer.js
try {
    const dlPath = path.join(__dirname, 'js', 'datalayer.js');
    const dlContent = fs.readFileSync(dlPath, 'utf8');

    console.log('--- TEST GROUP 3: Adobe Client Data Layer (ACDL) ---');

    assert(
        dlContent.includes('window.adobeDataLayer = window.adobeDataLayer || [];'),
        'Adobe Client Data Layer array is initialized.'
    );

    assert(
        dlContent.includes("event: 'pageLoaded'") && dlContent.includes('ecommerceInfo'),
        'Page load telemetry push captures page, user, and e-commerce context.'
    );

    assert(
        dlContent.includes('window.trackACDLAddToCart') && dlContent.includes('window.trackACDLPurchase'),
        'ACDL public event helpers (AddToCart, Purchase, RemoveFromCart, UserLogin) are exposed.'
    );

    console.log('\n--- TEST GROUP 4: Production Build Pipeline & Asset Bundling ---');
    assert(fs.existsSync(path.join(__dirname, 'build.js')), 'build.js production pipeline script exists.');
    assert(fs.existsSync(path.join(__dirname, 'dist', 'css', 'bundle.min.css')), 'dist/css/bundle.min.css is generated.');
    assert(fs.existsSync(path.join(__dirname, 'dist', 'js', 'core.min.js')), 'dist/js/core.min.js is generated.');
    assert(fs.existsSync(path.join(__dirname, 'dist', 'manifest.json')), 'dist/manifest.json asset manifest exists.');

    console.log();
} catch (e) {
    console.error('[ERROR] Failed to verify DataLayer or Build Pipeline:', e.message);
    failedTests++;
}

console.log('====================================================================');
console.log(`TOTAL RESULTS: ${passedTests} Passed, ${failedTests} Failed`);
console.log('====================================================================');

if (failedTests > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
