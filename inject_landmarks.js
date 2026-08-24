const fs = require('fs');
const path = require('path');

const root = __dirname;
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(root, file);
    let html = fs.readFileSync(filePath, 'utf-8');
    let changed = false;

    // 1. Add Skip Link if missing
    if (!html.includes('class="skip-link"')) {
        // Insert after <body ...>
        html = html.replace(/(<body[^>]*>)/i, '$1\n  <a href="#main-content" class="skip-link">Skip to main content</a>');
        changed = true;
    }

    // 2. Wrap main content with <main id="main-content" role="main"> and </main>
    if (!html.includes('id="main-content"')) {
        // Find where main content begins:
        // Case A: File with js-panel-cart
        if (html.includes('js-panel-cart')) {
            const cartIdx = html.indexOf('js-panel-cart');
            const checkOutIdx = html.indexOf('Check Out', cartIdx);
            if (checkOutIdx !== -1) {
                // Find the closing of the cart panel (5 closing div tags)
                const afterCartMatch = html.substring(checkOutIdx).match(/Check Out[\s\S]*?<\/a>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/i);
                if (afterCartMatch) {
                    const insertPos = checkOutIdx + afterCartMatch[0].length;
                    const before = html.substring(0, insertPos);
                    const after = html.substring(insertPos);
                    html = before + '\n\n  <!-- Main Content Landmark -->\n  <main id="main-content" role="main">\n' + after;
                    changed = true;
                }
            }
        } else {
            // Case B: File without js-panel-cart (e.g. 404.html, demo.html)
            if (html.includes('<main>')) {
                html = html.replace('<main>', '<main id="main-content" role="main">');
                changed = true;
            } else if (html.includes('</header>')) {
                html = html.replace('</header>', '</header>\n\n  <!-- Main Content Landmark -->\n  <main id="main-content" role="main">\n');
                changed = true;
            }
        }

        // Close </main> right before <footer (or <!-- Footer -->)
        if (html.includes('id="main-content"') && !html.includes('</main>')) {
            if (html.includes('<!-- Footer -->')) {
                html = html.replace('<!-- Footer -->', '</main>\n\n  <!-- Footer -->');
                changed = true;
            } else if (html.includes('<footer')) {
                html = html.replace('<footer', '</main>\n\n  <footer');
                changed = true;
            }
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, html, 'utf-8');
        modifiedCount++;
    }
});

console.log(`Injected landmarks & skip links into ${modifiedCount} HTML files.`);
