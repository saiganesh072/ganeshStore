const fs = require('fs');
const path = require('path');
const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));
const broken = {};
htmlFiles.forEach(file => {
    const content = fs.readFileSync(path.join(rootDir, file), 'utf-8');
    const hrefRegex = /href=["']([^"']+)["']/gi;
    let match;
    while ((match = hrefRegex.exec(content)) !== null) {
        const href = match[1].trim();
        if (href && !href.startsWith('http') && !href.startsWith('//') && !href.startsWith('#') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:')) {
            const cleanHref = href.split('?')[0].split('#')[0];
            if (cleanHref && !fs.existsSync(path.join(rootDir, cleanHref))) {
                if (!broken[cleanHref]) broken[cleanHref] = [];
                broken[cleanHref].push(file);
            }
        }
    }
});
console.log('Unique broken target URLs count:', Object.keys(broken).length);
for (const [target, sources] of Object.entries(broken)) {
    console.log(` - "${target}" (referenced in ${sources.length} files: ${sources.slice(0, 3).join(', ')}...)`);
}
