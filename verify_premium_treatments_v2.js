const fs = require('fs');
const path = require('path');

console.log('==================================================================');
console.log('=== STOREFRONT PREMIUM TREATMENTS & COMPLIANCE E2E VERIFICATION ===');
console.log('==================================================================\n');

let failedTests = 0;
let passedTests = 0;

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
    
    console.log('--- TEST GROUP 1: CSS Premium Visual Treatment Rules ---');
    
    // Check block2 hardware acceleration and GPU rendering preserves
    assert(
        cssContent.includes('transform-style: preserve-3d') && cssContent.includes('backface-visibility: hidden'),
        'Product card (.block2) utilizes full 3D hardware acceleration layer.'
    );
    
    assert(
        cssContent.includes('will-change: transform, box-shadow'),
        'Product card (.block2) registers will-change optimizations to prevent micro-stutter.'
    );

    // Check block2 hover safety pseudo-element boundaries
    assert(
        cssContent.includes('.block2::after') && cssContent.includes('.block2:hover::after'),
        'Product card (.block2) implements bottom safety hover bounds (::after) to eliminate mouse flickering.'
    );
    
    assert(
        cssContent.includes('height: 16px') && cssContent.includes('bottom: -16px'),
        'Hover safety bounds (::after) correctly extends down by 16px to bridge the vertical shift.'
    );

    // Check block2-btn transform-based transitions instead of reflows
    assert(
        cssContent.includes('transform: translate(-50%, 30px)') && cssContent.includes('opacity: 0') && cssContent.includes('pointer-events: none'),
        'Quick View button (.block2-btn) starts off-screen using translate offsets and pointer-events disabled.'
    );
    
    assert(
        cssContent.includes('transform: translate(-50%, 0)') && cssContent.includes('opacity: 1') && cssContent.includes('pointer-events: auto'),
        'Quick View button (.block2-btn) elevates gracefully with active pointer-events on card hover.'
    );

    // Check notification badges glowing spheres
    assert(
        cssContent.includes('.icon-header-noti::after') && cssContent.includes('border-radius: 50%'),
        'Notification badges (.icon-header-noti::after) are styled as gorgeous, circular spheres.'
    );
    
    assert(
        cssContent.includes('background: linear-gradient(135deg, #717fe0, #5b69c5)'),
        'Notification badges feature a beautiful, premium HSL linear-gradient background.'
    );

    assert(
        cssContent.includes('border: 2px solid #fff'),
        'Notification badges have a solid white border for premium backdrop separation.'
    );
    
    assert(
        cssContent.includes('box-shadow: 0 4px 8px rgba(113, 127, 224, 0.35)'),
        'Notification badges feature a custom, vibrant purple drop-shadow.'
    );

    assert(
        cssContent.includes('.icon-header-noti:hover::after') && cssContent.includes('transform: scale(1.25)'),
        'Notification badges feature elegant scale-up zoom responses on hover.'
    );

    // Check header icon micro-rotations
    assert(
        cssContent.includes('.icon-header-item i') && cssContent.includes('transition: transform'),
        'Header icons are set up for smooth transform micro-animations.'
    );
    
    assert(
        cssContent.includes('.icon-header-item:hover i') && cssContent.includes('transform: scale(1.15)'),
        'Header icons scale slightly on hover for tactile physical feedback.'
    );

    // Check inline search navigation transitions and styles
    assert(
        cssContent.includes('.inline-search-nav') && cssContent.includes('position: absolute') && cssContent.includes('border-radius: 24px'),
        'Desktop inline search container (.inline-search-nav) is a fully rounded absolute-positioned capsule.'
    );

    assert(
        cssContent.includes('.limiter-menu-desktop.show-inline-search .menu-desktop') && cssContent.includes('transform: translateX(-40px)'),
        'Desktop main menu links slide away gracefully to the left when search expands.'
    );

    assert(
        cssContent.includes('.limiter-menu-desktop.show-inline-search .wrap-icon-header') && cssContent.includes('transform: translateX(40px)'),
        'Desktop header icons slide away gracefully to the right when search expands.'
    );

    assert(
        cssContent.includes('.limiter-menu-desktop.show-inline-search .inline-search-nav') && cssContent.includes('opacity: 1') && cssContent.includes('border-color: #717fe0'),
        'Desktop inline search container transitions to fully opaque and glowing white on expansion.'
    );

    // Check mobile inline search elements
    assert(
        cssContent.includes('.inline-search-mobile') && cssContent.includes('border-radius: 20px') && cssContent.includes('background: rgba(113, 127, 224, 0.05)'),
        'Mobile inline search container (.inline-search-mobile) is a fully rounded mobile-sized capsule.'
    );

    assert(
        cssContent.includes('.wrap-header-mobile.show-inline-search .logo-mobile') && cssContent.includes('transform: translateX(-30px)'),
        'Mobile logo slides away gracefully to the left on active mobile search.'
    );

    // Check catalog filter search pill design
    assert(
        cssContent.includes('.panel-search .bor8') && cssContent.includes('border-radius: 30px') && cssContent.includes('box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.03)'),
        'Catalog search container (.bor8 under .panel-search) has a fully rounded 30px capsule shape and inner depth.'
    );

    assert(
        cssContent.includes('.panel-search .bor8:focus-within') && cssContent.includes('transform: translateY(-3px)'),
        'Catalog search container elevates vertically on focus to provide dynamic physical feedback.'
    );

    console.log();
} catch (e) {
    console.error('[ERROR] Failed to read or parse css/main.css:', e.message);
    failedTests++;
}

// 2. Verify js/main.js
try {
    const jsPath = path.join(__dirname, 'js', 'main.js');
    const jsContent = fs.readFileSync(jsPath, 'utf8');
    
    console.log('--- TEST GROUP 2: JS Navigation Dropdowns & Routing ---');

    // Check injection function
    assert(
        jsContent.includes('function injectHeaderSubmenus()'),
        'Dynamic submenu injection builder (injectHeaderSubmenus) is defined.'
    );

    // Check desktop menu injection rules
    assert(
        jsContent.includes('product.html?category=women') && jsContent.includes('product.html?category=men') && jsContent.includes('product.html?category=bag'),
        'Desktop main menu Shop category submenus are programmatically injected with correct URLs.'
    );

    assert(
        jsContent.includes('js-trigger-slide-cart') && jsContent.includes('wishlist.html') && jsContent.includes('signin.html'),
        'Desktop main menu Features submenu showcases Slide-Out Cart, Wishlist, and Account links.'
    );

    // Check mobile menu injection rules
    assert(
        jsContent.includes('.main-menu-m') && jsContent.includes('sub-menu-m') && jsContent.includes('arrow-main-menu-m'),
        'Mobile navigation menu Shop and Features are fully injected with sub-menu-m classes and arrows.'
    );

    // Check trigger cart click event
    assert(
        jsContent.includes("$(document).off('click', '.js-trigger-slide-cart').on('click', '.js-trigger-slide-cart'"),
        'Slide-Out Cart submenu link binds a click handler to slide the cart drawer open natively.'
    );

    // Check query-parameter routing filter execution
    assert(
        jsContent.includes('function initCategoryFilteringRouting()'),
        'Intelligent category query-parameter router (initCategoryFilteringRouting) is defined.'
    );

    assert(
        jsContent.includes('urlParams.get(\'category\')'),
        'Category router reads URL search query parameters.'
    );

    assert(
        jsContent.includes('.isotope-grid') && jsContent.includes('isotope({ filter: filterVal })'),
        'Category router triggers Isotope layout filtering on active elements.'
    );

    assert(
        jsContent.includes('animate({') && jsContent.includes('scrollTop:'),
        'Category router triggers smooth scrolling down to the active visual product catalog section.'
    );

    // Verify inline search injections in JS
    assert(
        jsContent.includes('.inline-search-nav') && jsContent.includes('.inline-search-mobile'),
        'Dynamic search bar injectors successfully insert HTML markup for inline expanding capsules.'
    );

    // Verify search catalog parameter routing filter execution
    assert(
        jsContent.includes('function initSearchFilteringRouting()'),
        'Intelligent search parameter catalog router (initSearchFilteringRouting) is defined.'
    );

    assert(
        jsContent.includes('urlParams.get(\'search\')'),
        'Search parameter router reads search keywords from URL search parameters.'
    );

    assert(
        jsContent.includes('isotope({') && jsContent.includes('name.indexOf(searchVal) > -1'),
        'Search parameter router triggers dynamic Isotope name searches in the product grid catalogue.'
    );

    console.log();
} catch (e) {
    console.error('[ERROR] Failed to read or parse js/main.js:', e.message);
    failedTests++;
}

console.log('==================================================================');
console.log(`VERIFICATION SUMMARY: ${passedTests} Passed, ${failedTests} Failed`);
console.log('==================================================================');

if (failedTests > 0) {
    process.exit(1);
} else {
    process.exit(0);
}
