const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log('========================================================================');
console.log('GANESH STORE: DEEP MULTI-DIMENSIONAL AUDIT SUITE');
console.log('========================================================================');
console.log(`Discovered ${htmlFiles.length} HTML files in root directory.\n`);

const issues = [];
const stats = {
    totalFiles: htmlFiles.length,
    missingTitle: 0,
    missingMetaDesc: 0,
    missingOgTags: 0,
    missingH1: 0,
    multipleH1: 0,
    imagesWithoutAlt: 0,
    brokenInternalLinks: 0,
    missingStructuredData: 0,
    externalLinksWithoutNoopener: 0,
    inputsWithoutAriaOrLabel: 0
};

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');

    // 1. Title
    const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
    if (!titleMatch || !titleMatch[1].trim()) {
        stats.missingTitle++;
        issues.push({ file, type: 'SEO', issue: 'Missing or empty <title> tag' });
    }

    // 2. Meta description
    const metaDesc = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    if (!metaDesc || !metaDesc[1].trim()) {
        stats.missingMetaDesc++;
        issues.push({ file, type: 'SEO', issue: 'Missing or empty meta description' });
    }

    // 3. OpenGraph Tags
    const ogTitle = content.match(/<meta\s+property=["']og:title["']/i);
    const ogImage = content.match(/<meta\s+property=["']og:image["']/i);
    if (!ogTitle || !ogImage) {
        stats.missingOgTags++;
    }

    // 4. Heading Hierarchy (H1)
    const h1Matches = content.match(/<h1[\s>]/gi) || [];
    if (h1Matches.length === 0) {
        stats.missingH1++;
        issues.push({ file, type: 'A11y & SEO', issue: 'Missing <h1> tag' });
    } else if (h1Matches.length > 1) {
        stats.multipleH1++;
    }

    // 5. Images without alt
    const imgTags = content.match(/<img[^>]+>/gi) || [];
    imgTags.forEach(img => {
        if (!/alt=["'][^"']*["']/i.test(img)) {
            stats.imagesWithoutAlt++;
            issues.push({ file, type: 'A11y', issue: `Image missing alt attribute: ${img.slice(0, 50)}...` });
        }
    });

    // 6. External Links without rel="noopener noreferrer"
    const targetBlankLinks = content.match(/<a[^>]+target=["']_blank["'][^>]*>/gi) || [];
    targetBlankLinks.forEach(a => {
        if (!/rel=["'][^"']*noopener/i.test(a)) {
            stats.externalLinksWithoutNoopener++;
            issues.push({ file, type: 'Security', issue: `target="_blank" link missing rel="noopener noreferrer": ${a.slice(0, 60)}...` });
        }
    });

    // 7. Broken Internal Links
    const hrefMatches = content.matchAll(/href=["']([^"']+)["']/gi);
    for (const match of hrefMatches) {
        const href = match[1].trim();
        if (href && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
            const cleanHref = href.split('?')[0].split('#')[0];
            if (cleanHref && !fs.existsSync(path.join(rootDir, cleanHref))) {
                stats.brokenInternalLinks++;
                issues.push({ file, type: 'Broken Link', issue: `Broken link to: ${href}` });
            }
        }
    }

    // 8. JSON-LD Structured Data
    if (!/<script\s+type=["']application\/ld\+json["']/i.test(content)) {
        stats.missingStructuredData++;
    }
});

console.log('--- AUDIT FINDINGS SUMMARY ---');
console.log(`Total HTML Pages Audited: ${stats.totalFiles}`);
console.log(`Pages missing Meta Description: ${stats.missingMetaDesc}`);
console.log(`Pages missing OpenGraph Tags: ${stats.missingOgTags}`);
console.log(`Pages missing <h1> heading: ${stats.missingH1}`);
console.log(`Images missing alt attribute: ${stats.imagesWithoutAlt}`);
console.log(`Broken Internal Links: ${stats.brokenInternalLinks}`);
console.log(`Security: Target _blank links missing rel="noopener": ${stats.externalLinksWithoutNoopener}`);
console.log(`Pages missing JSON-LD Structured Data: ${stats.missingStructuredData}`);

console.log(`\nSample Issues (Total ${issues.length}):`);
issues.slice(0, 25).forEach(iss => console.log(` - [${iss.type}] ${iss.file}: ${iss.issue}`));
