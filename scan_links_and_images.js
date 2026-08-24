const fs = require('fs');
const path = require('path');

const root = __dirname;
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));

let missingImgs = 0;
let brokenLinks = 0;

htmlFiles.forEach(f => {
    const html = fs.readFileSync(path.join(root, f), 'utf-8');
    const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
    let match;
    while ((match = imgRegex.exec(html)) !== null) {
        let src = match[1];
        if (src.startsWith('http') || src.startsWith('data:') || src.startsWith('//')) continue;
        src = src.split('?')[0].split('#')[0];
        if (!fs.existsSync(path.join(root, src))) {
            console.log('Missing img:', f, '->', src);
            missingImgs++;
        }
    }
    
    const hrefRegex = /<a[^>]+href=["']([^"']+)["']/gi;
    while ((match = hrefRegex.exec(html)) !== null) {
        let href = match[1];
        if (href.startsWith('http') || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('//')) continue;
        href = href.split('?')[0].split('#')[0];
        if (href && !fs.existsSync(path.join(root, href))) {
            console.log('Broken internal link:', f, '->', href);
            brokenLinks++;
        }
    }
});

console.log(`Scan complete: ${htmlFiles.length} pages checked.`);
console.log(`Missing imgs: ${missingImgs}, Broken internal links: ${brokenLinks}`);
