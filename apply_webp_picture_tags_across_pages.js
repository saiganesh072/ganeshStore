const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

let modifiedFiles = 0;
let totalReplacedImages = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    let fileChanged = false;

    // Replace product, banner, about, blog, and gallery images with <picture> tags
    // Matching pattern: <img ... src="images/(product|banner|about|blog|gallery|slide)-XX.(jpg|png)" ... />
    // but not if already inside <picture>

    // Regex for <img> tags with images/(product|banner|about|blog|gallery|slide)-
    const imgRegex = /(<picture[^>]*>[\s\S]*?<\/picture>)|(<img\s+([^>]*?)src=["'](images\/(?:product|banner|about|blog|gallery|slide)-[a-zA-Z0-9_\-]+)\.(jpg|png)["']([^>]*?)\/?>)/gi;

    html = html.replace(imgRegex, (match, pictureTag, imgTag, beforeSrc, basePath, ext, afterSrc) => {
        if (pictureTag) {
            return pictureTag; // already wrapped
        }

        // Construct <picture> wrapper with WebP <source>
        const webpSource = `<source srcset="${basePath}.webp" type="image/webp">`;
        const fullImg = `<img ${beforeSrc.trim()} src="${basePath}.${ext}"${afterSrc} />`.replace(/\s{2,}/g, ' ');
        fileChanged = true;
        totalReplacedImages++;
        return `<picture class="img-responsive-wrap">${webpSource}${fullImg}</picture>`;
    });

    if (fileChanged) {
        fs.writeFileSync(filePath, html, 'utf8');
        modifiedFiles++;
    }
});

console.log(`Successfully wrapped ${totalReplacedImages} images in <picture> with WebP sources across ${modifiedFiles} HTML files.`);
