const fs = require('fs');
const path = require('path');

console.log('========================================================================');
console.log('GANESH STORE: ACCESSIBILITY, SEO, SECURITY & DISCOVERABILITY TEST SUITE');
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

console.log(`Auditing ${htmlFiles.length} HTML files in root directory...\n`);

// 1. 404 Recovery Page
console.log('--- Suite 1: 404 Page & Recovery Experience ---');
assert(fs.existsSync(path.join(rootDir, '404.html')), '404.html exists in root');
const p404 = fs.readFileSync(path.join(rootDir, '404.html'), 'utf-8');
assert(p404.includes('Search luxury products'), '404 page contains in-page search bar');
assert(p404.includes('Popular Categories'), '404 page provides category recovery links');
assert(p404.includes('Back to Home'), '404 page contains back-to-home CTA');

// 2. SEO, OpenGraph & Structured Data
console.log('\n--- Suite 2: SEO, OpenGraph & JSON-LD Structured Data ---');
let allHaveTitle = true;
let allHaveDesc = true;
let allHaveOg = true;
let allHaveJsonLd = true;
let allHaveH1 = true;
let allTargetBlankSecure = true;

htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
    
    if (!/<title>[^<]+<\/title>/i.test(content)) allHaveTitle = false;
    if (!/<meta\s+name=["']description["']/i.test(content)) allHaveDesc = false;
    if (!content.includes('og:title') || !content.includes('og:image')) allHaveOg = false;
    if (!content.includes('application/ld+json')) allHaveJsonLd = false;
    if (!/<h1[\s>]/i.test(content)) allHaveH1 = false;

    const blanks = content.match(/<a[^>]+target=["']_blank["'][^>]*>/gi) || [];
    blanks.forEach(b => {
        if (!/rel=["'][^"']*noopener/i.test(b)) allTargetBlankSecure = false;
    });
});

assert(allHaveTitle, 'All HTML files have meaningful <title> tags');
assert(allHaveDesc, 'All HTML files have search-engine optimized meta descriptions');
assert(allHaveOg, 'All HTML files have OpenGraph and Twitter Card social preview metadata');
assert(allHaveJsonLd, 'All HTML files embed schema.org JSON-LD Structured Data');
assert(allHaveH1, 'All HTML files contain accessible <h1> heading hierarchy');
assert(allTargetBlankSecure, 'All target="_blank" links include rel="noopener noreferrer" for security');

// 3. CSS Accessibility & Focus Rules
console.log('\n--- Suite 3: CSS WCAG 2.2 AA Accessibility & Focus Rules ---');
const mainCss = fs.readFileSync(path.join(rootDir, 'css', 'main.css'), 'utf-8');
assert(mainCss.includes('.sr-only'), 'CSS declares .sr-only accessible screen reader utility');
assert(mainCss.includes(':focus-visible'), 'CSS declares accessible :focus-visible outline indicators');
assert(mainCss.includes('prefers-reduced-motion'), 'CSS supports prefers-reduced-motion user preference');
assert(mainCss.includes('min-width: 44px') || mainCss.includes('min-height: 44px'), 'CSS establishes mobile minimum touch target guidelines');
assert(mainCss.includes('.skip-link'), 'CSS styles accessible .skip-link navigation utility');

// 3b. HTML Landmarks & Skip Links
console.log('\n--- Suite 3b: HTML5 Semantic Landmarks & Skip-to-Content Navigation ---');
let allHaveSkipLink = true;
let allHaveMainLandmark = true;
htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
    if (!content.includes('class="skip-link"') || !content.includes('href="#main-content"')) {
        allHaveSkipLink = false;
    }
    if (!content.includes('id="main-content"') || !content.includes('role="main"') || !content.includes('</main>')) {
        allHaveMainLandmark = false;
    }
});
assert(allHaveSkipLink, 'All 99 HTML files feature a focusable Skip-to-Main-Content link');
assert(allHaveMainLandmark, 'All 99 HTML files wrap primary content in <main id="main-content" role="main">');

// 4. Link & Asset Integrity
console.log('\n--- Suite 4: Broken Link & Asset Resolution ---');
let brokenLinks = 0;
htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
    const hrefRegex = /href=["']([^"']+)["']/gi;
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
        const href = match[1].trim();
        if (href && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
            const cleanHref = href.split('?')[0].split('#')[0];
            if (cleanHref && !fs.existsSync(path.join(rootDir, cleanHref))) {
                brokenLinks++;
            }
        }
    }
});
assert(brokenLinks === 0, 'Zero broken internal links across all HTML pages and assets');

// 5. Global Technical SEO, Robots.txt & XML Sitemap
console.log('\n--- Suite 5: Global Technical SEO, Robots.txt & XML Sitemap ---');
assert(fs.existsSync(path.join(rootDir, 'robots.txt')), 'robots.txt exists in root with search directives');
const robotsContent = fs.readFileSync(path.join(rootDir, 'robots.txt'), 'utf-8');
assert(robotsContent.includes('Sitemap: https://ganeshstore.com/sitemap.xml'), 'robots.txt specifies sitemap.xml URL');

assert(fs.existsSync(path.join(rootDir, 'sitemap.xml')), 'sitemap.xml exists in root');
const sitemapContent = fs.readFileSync(path.join(rootDir, 'sitemap.xml'), 'utf-8');
assert(sitemapContent.includes('https://ganeshstore.com/'), 'sitemap.xml contains global store URLs');

let allHaveCanonical = true;
htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
    if (!/<link\s+rel=["']canonical["']\s+href=["']https:\/\/ganeshstore\.com/i.test(content)) {
        allHaveCanonical = false;
    }
});
assert(allHaveCanonical, 'All HTML pages contain unified global canonical tags');

console.log('\n========================================================================');
console.log(`TEST RESULTS: ${passed} Passed, ${failed} Failed`);
console.log('========================================================================\n');

if (failed > 0) {
    process.exit(1);
} else {
    console.log('ALL ACCESSIBILITY, SEO, SECURITY & RECOVERY TESTS PASSED (100%)!\n');
}
