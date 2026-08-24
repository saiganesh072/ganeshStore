const fs = require('fs');
const path = require('path');

const root = __dirname;

// 1. Update @font-face in CSS and font files
const fontFiles = [
    'fonts/font-awesome-4.7.0/css/font-awesome.min.css',
    'fonts/font-awesome-4.7.0/css/font-awesome.css',
    'fonts/iconic/css/material-design-iconic-font.min.css',
    'fonts/iconic/css/material-design-iconic-font.css',
    'fonts/linearicons-v1.0.0/icon-font.min.css',
    'vendor/slick/slick-theme.css'
];

fontFiles.forEach(relPath => {
    const fullPath = path.join(root, relPath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf-8');
        if (!content.includes('font-display')) {
            content = content.replace(/@font-face\s*\{/gi, '@font-face{font-display:swap;');
            fs.writeFileSync(fullPath, content, 'utf-8');
            console.log(`Added font-display: swap to ${relPath}`);
        }
    }
});

// 2. Non-critical stylesheet async loading across all HTML files
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));
const nonCriticalSheets = [
    'vendor/animate/animate.css',
    'vendor/css-hamburgers/hamburgers.min.css',
    'vendor/animsition/css/animsition.min.css',
    'vendor/select2/select2.min.css',
    'vendor/daterangepicker/daterangepicker.css',
    'vendor/MagnificPopup/magnific-popup.css',
    'vendor/perfect-scrollbar/perfect-scrollbar.css'
];

let htmlModified = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(root, file);
    let html = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    nonCriticalSheets.forEach(sheet => {
        // Match standard link tag for this sheet if not already using media="print"
        const regex = new RegExp('<link\\s+rel=["\']stylesheet["\']\\s+type=["\']text/css["\']\\s+href=["\']' + sheet.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '["\']\\s*/?>', 'gi');
        if (regex.test(html) && !html.includes(`href="${sheet}" media="print"`)) {
            html = html.replace(regex, `<link rel="stylesheet" type="text/css" href="${sheet}" media="print" onload="this.media='all'" />\n  <noscript><link rel="stylesheet" type="text/css" href="${sheet}" /></noscript>`);
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, html, 'utf-8');
        htmlModified++;
    }
});

console.log(`Updated ${htmlModified} HTML files with async non-critical stylesheets.`);
