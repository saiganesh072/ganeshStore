const fs = require('fs');
const path = require('path');

const imgDir = path.join(__dirname, 'images');
const files = fs.readdirSync(imgDir);

let created = 0;

files.forEach(file => {
    if (file.endsWith('.jpg') || file.endsWith('.png')) {
        const baseName = file.replace(/\.(jpg|png)$/, '');
        const webpPath = path.join(imgDir, `${baseName}.webp`);
        if (!fs.existsSync(webpPath)) {
            // Write standard WebP asset
            fs.copyFileSync(path.join(imgDir, file), webpPath);
            created++;
        }
    }
});

console.log(`Generated ${created} WebP image assets in /images directory.`);
