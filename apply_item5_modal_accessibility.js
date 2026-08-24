const fs = require('fs');
const path = require('path');

const root = __dirname;
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));

// 1. Update HTML files with role="dialog" and aria-modal="true"
let htmlModified = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(root, file);
    let html = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // Search modal
    if (html.includes('class="modal-search-header') && !html.includes('class="modal-search-header flex-c-m trans-04 js-hide-modal-search" role="dialog"')) {
        html = html.replace(
            /class="modal-search-header flex-c-m trans-04 js-hide-modal-search"/g,
            'class="modal-search-header flex-c-m trans-04 js-hide-modal-search" role="dialog" aria-modal="true" aria-label="Search Products"'
        );
        changed = true;
    }

    // Quick view modal
    if (html.includes('class="wrap-modal1') && !html.includes('class="wrap-modal1 js-modal1 p-t-60 p-b-20" role="dialog"')) {
        html = html.replace(
            /class="wrap-modal1 js-modal1 p-t-60 p-b-20"/g,
            'class="wrap-modal1 js-modal1 p-t-60 p-b-20" role="dialog" aria-modal="true" aria-label="Quick View Modal"'
        );
        changed = true;
    }

    // Cart drawer
    if (html.includes('class="wrap-header-cart') && !html.includes('class="wrap-header-cart js-panel-cart" role="dialog"')) {
        html = html.replace(
            /class="wrap-header-cart js-panel-cart"/g,
            'class="wrap-header-cart js-panel-cart" role="dialog" aria-modal="true" aria-label="Shopping Cart Drawer"'
        );
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, html, 'utf-8');
        htmlModified++;
    }
});

console.log(`Updated dialog ARIA attributes across ${htmlModified} HTML files.`);
