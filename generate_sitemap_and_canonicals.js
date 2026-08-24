const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log(`Processing ${htmlFiles.length} HTML files for Canonical & SEO integration...`);

// Base Domain
const BASE_URL = 'https://ganeshstore.com';

// 1. Build sitemap.xml
let sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

htmlFiles.forEach(file => {
    // Determine priority and changefreq
    let priority = '0.7';
    let changefreq = 'weekly';
    
    if (file === 'index.html') {
        priority = '1.0';
        changefreq = 'daily';
    } else if (file === 'product.html' || file === 'shoping-cart.html') {
        priority = '0.9';
        changefreq = 'daily';
    } else if (file.startsWith('p-') || file === 'product-detail.html') {
        priority = '0.8';
        changefreq = 'weekly';
    } else if (file === 'about.html' || file === 'contact.html' || file === 'blog.html') {
        priority = '0.6';
        changefreq = 'monthly';
    } else if (file === 'privacy.html' || file === 'terms.html' || file === 'shipping.html' || file === 'returns.html') {
        priority = '0.3';
        changefreq = 'yearly';
    }

    const loc = file === 'index.html' ? `${BASE_URL}/` : `${BASE_URL}/${file}`;
    const today = new Date().toISOString().split('T')[0];

    sitemapXml += `  <url>
    <loc>${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>
`;
});

sitemapXml += `</urlset>
`;

fs.writeFileSync(path.join(rootDir, 'sitemap.xml'), sitemapXml, 'utf-8');
console.log('✅ sitemap.xml generated successfully!');

// 2. Inject Canonical tags and clean up hreflang tags in all HTML files
let modifiedCount = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    const canonicalUrl = file === 'index.html' ? `${BASE_URL}/` : `${BASE_URL}/${file}`;
    const canonicalTag = `<link rel="canonical" href="${canonicalUrl}" />`;

    // Remove any existing canonical tag
    content = content.replace(/<link\s+rel=["']canonical["'][^>]*>\s*/gi, '');
    
    // Remove any multi-region hreflang tags if present
    content = content.replace(/<link\s+rel=["']alternate["']\s+hreflang=[^>]*>\s*/gi, '');

    // Insert new canonical tag right before </head>
    if (content.includes('</head>')) {
        content = content.replace('</head>', `\t${canonicalTag}\n</head>`);
    }

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        modifiedCount++;
    }
});

console.log(`✅ Clean Canonical tags injected in ${modifiedCount} HTML files.`);
