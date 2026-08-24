const fs = require('fs');
const path = require('path');

const root = __dirname;
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));

// Image natural dimensions map
const dimensionMap = {
    'logo-01.png': { width: 231, height: 34 },
    'icon-close.png': { width: 11, height: 11 },
    'icon-close2.png': { width: 11, height: 11 },
    'icon-email.png': { width: 14, height: 11 },
    'icon-heart-01.png': { width: 21, height: 19 },
    'icon-heart-02.png': { width: 21, height: 19 },
    'icon-next.png': { width: 12, height: 21 },
    'icon-prev.png': { width: 12, height: 21 },
    'icon-pay-01.png': { width: 35, height: 23 },
    'icon-pay-02.png': { width: 35, height: 23 },
    'icon-pay-03.png': { width: 35, height: 23 },
    'icon-pay-04.png': { width: 35, height: 23 },
    'icon-pay-05.png': { width: 35, height: 23 },
    'item-cart-01.jpg': { width: 60, height: 80 },
    'item-cart-02.jpg': { width: 60, height: 80 },
    'item-cart-03.jpg': { width: 60, height: 80 },
    'banner-01.jpg': { width: 1200, height: 809 },
    'banner-02.jpg': { width: 1200, height: 809 },
    'banner-03.jpg': { width: 1200, height: 809 },
    'banner-04.jpg': { width: 1200, height: 809 },
    'banner-05.jpg': { width: 1200, height: 809 },
    'banner-06.jpg': { width: 1200, height: 809 },
    'banner-07.jpg': { width: 1200, height: 809 },
    'banner-08.jpg': { width: 1200, height: 809 },
    'banner-09.jpg': { width: 1200, height: 809 },
    'blog-01.jpg': { width: 1200, height: 837 },
    'blog-02.jpg': { width: 1200, height: 837 },
    'blog-03.jpg': { width: 1200, height: 837 },
    'blog-04.jpg': { width: 1200, height: 837 },
    'blog-05.jpg': { width: 1200, height: 837 },
    'blog-06.jpg': { width: 1200, height: 837 }
};

let modifiedFiles = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(root, file);
    let html = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // Replace img tags
    html = html.replace(/<img\s+([^>]*?)src=["']([^"']+)["']([^>]*?)\/?>/gi, (fullMatch, beforeSrc, src, afterSrc) => {
        let combined = (beforeSrc + ' ' + afterSrc).trim();
        const baseName = path.basename(src);

        // Determine dimensions
        let width = null;
        let height = null;

        if (dimensionMap[baseName]) {
            width = dimensionMap[baseName].width;
            height = dimensionMap[baseName].height;
        } else if (baseName.startsWith('product-detail-')) {
            width = 1200;
            height = 1485;
        } else if (baseName.startsWith('product-') || baseName.startsWith('gallery-') || baseName.startsWith('shop-')) {
            width = 1200;
            height = 1486;
        } else if (baseName.startsWith('item-cart-')) {
            width = 60;
            height = 80;
        } else if (baseName.startsWith('banner-')) {
            width = 1200;
            height = 809;
        } else if (baseName.startsWith('blog-')) {
            width = 1200;
            height = 837;
        } else if (baseName.startsWith('icon-pay-')) {
            width = 35;
            height = 23;
        }

        // Check whether it should be lazy loaded
        // DO NOT lazy load: logo, LCP slide hero, or the first PDP image
        let isEager = false;
        if (baseName.includes('logo') || baseName === 'slide-01.jpg' || fullMatch.includes('fetchpriority="high"') || (file.startsWith('p-') && baseName === 'product-detail-01.jpg' && !html.substring(0, html.indexOf(fullMatch)).includes('product-detail-01.jpg'))) {
            isEager = true;
        }

        let newAttrs = fullMatch;

        // Add dimensions if not present
        if (width && height && !fullMatch.includes('width=') && !fullMatch.includes('height=')) {
            newAttrs = newAttrs.replace('<img', `<img width="${width}" height="${height}"`);
            changed = true;
        }

        // Add loading="lazy" if not eager and not already present
        if (!isEager && !newAttrs.includes('loading=')) {
            newAttrs = newAttrs.replace('<img', '<img loading="lazy"');
            changed = true;
        }

        return newAttrs;
    });

    if (changed) {
        fs.writeFileSync(filePath, html, 'utf-8');
        modifiedFiles++;
    }
});

console.log(`Updated images across ${modifiedFiles} HTML files with dimensions and loading='lazy'.`);
