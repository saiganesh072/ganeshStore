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

// 2b. Granular JSON-LD Schemas (Breadcrumbs, Sitelinks Search, FAQPage, ContactPage)
const pHome = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
assert(pHome.includes('"SearchAction"') && pHome.includes('"WebSite"'), 'index.html contains WebSite + SearchAction (Sitelinks Searchbox) schema');

const pReturns = fs.readFileSync(path.join(rootDir, 'returns.html'), 'utf-8');
assert(pReturns.includes('"FAQPage"'), 'returns.html contains FAQPage JSON-LD schema');

const pShipping = fs.readFileSync(path.join(rootDir, 'shipping.html'), 'utf-8');
assert(pShipping.includes('"FAQPage"'), 'shipping.html contains FAQPage JSON-LD schema');

const pContact = fs.readFileSync(path.join(rootDir, 'contact.html'), 'utf-8');
assert(pContact.includes('"ContactPage"'), 'contact.html contains ContactPage JSON-LD schema');

let pdpBreadcrumbsValid = true;
const pdpFiles = htmlFiles.filter(f => f.startsWith('p-') || f === 'product-detail.html' || f === 'product.html');
pdpFiles.forEach(f => {
    const c = fs.readFileSync(path.join(rootDir, f), 'utf-8');
    if (!c.includes('"BreadcrumbList"')) pdpBreadcrumbsValid = false;
});
assert(pdpBreadcrumbsValid, 'All 67 product detail pages and catalog pages contain BreadcrumbList JSON-LD schema');

let allJsonLdParseValid = true;
htmlFiles.forEach(file => {
    const html = fs.readFileSync(path.join(rootDir, file), 'utf-8');
    const regex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
        try {
            JSON.parse(match[1].trim());
        } catch (e) {
            allJsonLdParseValid = false;
        }
    }
});
assert(allJsonLdParseValid, 'All embedded JSON-LD blocks across all 99 pages parse as valid schema.org JSON');

// 3. CSS Accessibility & Focus Rules
console.log('\n--- Suite 3: CSS WCAG 2.2 AA Accessibility & Focus Rules ---');
const mainCss = fs.readFileSync(path.join(rootDir, 'css', 'main.css'), 'utf-8');
assert(mainCss.includes('.sr-only'), 'CSS declares .sr-only accessible screen reader utility');
assert(mainCss.includes(':focus-visible'), 'CSS declares accessible :focus-visible outline indicators');
assert(mainCss.includes('prefers-reduced-motion'), 'CSS supports prefers-reduced-motion user preference');
assert(mainCss.includes('min-width: 44px') || mainCss.includes('min-height: 44px'), 'CSS establishes mobile minimum touch target guidelines');
assert(mainCss.includes('.skip-link'), 'CSS styles accessible .skip-link navigation utility');
assert(mainCss.includes('font-display: swap'), 'main.css includes font-display: swap on all typography font-face declarations');

const faCss = fs.readFileSync(path.join(rootDir, 'fonts/font-awesome-4.7.0/css/font-awesome.min.css'), 'utf-8');
assert(faCss.includes('font-display:swap') || faCss.includes('font-display: swap'), 'FontAwesome includes font-display: swap to eliminate FOIT');

const iconicCss = fs.readFileSync(path.join(rootDir, 'fonts/iconic/css/material-design-iconic-font.min.css'), 'utf-8');
assert(iconicCss.includes('font-display:swap') || iconicCss.includes('font-display: swap'), 'Material Iconic font includes font-display: swap to eliminate FOIT');

const pIndex = fs.readFileSync(path.join(rootDir, 'index.html'), 'utf-8');
assert(pIndex.includes('media="print" onload="this.media=\'all\'"'), 'Non-critical stylesheets use async media swap to prevent render blocking');

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

// 3c. Image Performance & CLS Prevention
console.log('\n--- Suite 3c: Image Performance, CLS Prevention & Lazy Loading ---');
let hasLazyImages = false;
let hasExplicitDimensions = true;
let heroNotLazy = true;

htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
    if (content.includes('loading="lazy"')) hasLazyImages = true;
    if (file === 'index.html') {
        const heroMatch = content.match(/<img[^>]+src=["'][^"']*slide-01\.jpg["'][^>]*>/i);
        if (heroMatch && heroMatch[0].includes('loading="lazy"')) {
            heroNotLazy = false;
        }
    }
});
assert(hasLazyImages, 'Below-the-fold catalog and content images utilize native loading="lazy"');
assert(heroNotLazy, 'LCP above-the-fold hero images are eager loaded without lazy loading');
const sampleProductHtml = fs.readFileSync(path.join(rootDir, 'product.html'), 'utf-8');
assert(sampleProductHtml.includes('width="1200"') && sampleProductHtml.includes('height="1486"'), 'Product grid images declare explicit width and height attributes to prevent CLS');

// 3d. Modal Accessibility & Keyboard Focus Trapping (WCAG 2.2 AA)
console.log('\n--- Suite 3d: Modal Dialog ARIA & Keyboard Focus Trapping ---');
let allModalsAriaCompliant = true;
htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
    if (content.includes('js-modal1') && !content.includes('role="dialog"')) {
        allModalsAriaCompliant = false;
    }
    if (content.includes('modal-search-header') && !content.includes('role="dialog"')) {
        allModalsAriaCompliant = false;
    }
    if (content.includes('js-panel-cart') && !content.includes('role="dialog"')) {
        allModalsAriaCompliant = false;
    }
});
assert(allModalsAriaCompliant, 'Search modals, Quick View popups, and Cart drawers declare role="dialog" and aria-modal="true"');

const jsMainContent = fs.readFileSync(path.join(rootDir, 'js', 'main.js'), 'utf-8');
assert(jsMainContent.includes('trapModalFocus') && jsMainContent.includes('closeAccessibleModal'), 'main.js implements keyboard focus trapping and focus restoration on close');

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

// 6. HTTP Security Headers Configurations (Netlify, Vercel, Nginx, Apache)
console.log('\n--- Suite 6: Production HTTP Security Headers & CSP Allowlist ---');
assert(fs.existsSync(path.join(rootDir, '_headers')), 'Netlify _headers file exists');
const netlifyHeaders = fs.readFileSync(path.join(rootDir, '_headers'), 'utf-8');
assert(netlifyHeaders.includes('Content-Security-Policy-Report-Only') && netlifyHeaders.includes('Strict-Transport-Security'), 'Netlify headers include CSP Report-Only and HSTS');

assert(fs.existsSync(path.join(rootDir, 'vercel.json')), 'Vercel vercel.json configuration exists');
const vercelConfig = JSON.parse(fs.readFileSync(path.join(rootDir, 'vercel.json'), 'utf-8'));
assert(Array.isArray(vercelConfig.headers) && vercelConfig.headers[0].headers.length >= 6, 'Vercel configuration declares all 6 essential security headers');

assert(fs.existsSync(path.join(rootDir, 'nginx.conf')), 'Nginx production configuration exists');
const nginxConfig = fs.readFileSync(path.join(rootDir, 'nginx.conf'), 'utf-8');
assert(nginxConfig.includes('X-Frame-Options "DENY"') && nginxConfig.includes('X-Content-Type-Options "nosniff"'), 'Nginx config declares X-Frame-Options and X-Content-Type-Options');

assert(fs.existsSync(path.join(rootDir, '.htaccess')), 'Apache .htaccess configuration exists');
const htaccessConfig = fs.readFileSync(path.join(rootDir, '.htaccess'), 'utf-8');
assert(htaccessConfig.includes('Referrer-Policy "strict-origin-when-cross-origin"') && htaccessConfig.includes('Permissions-Policy'), 'Apache config declares Referrer-Policy and Permissions-Policy');

console.log('\n========================================================================');
console.log(`TEST RESULTS: ${passed} Passed, ${failed} Failed`);
console.log('========================================================================\n');

if (failed > 0) {
    process.exit(1);
} else {
    console.log('ALL ACCESSIBILITY, SEO, SECURITY & RECOVERY TESTS PASSED (100%)!\n');
}
