const fs = require('fs');
const path = require('path');

const sourceDir = __dirname;
const destIn = path.join(__dirname, 'in');
const destUs = path.join(__dirname, 'us');

// Ignore copying these items
const ignoreList = ['.git', 'in', 'us', 'node_modules', '.antigravityignore', 'package.json', 'package-lock.json', '.gemini'];

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  const basename = path.basename(src);
  if (ignoreList.includes(basename)) {
    return;
  }

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
    });
  } else {
    // Check if it's a script we might not want to deploy (optional, but let's copy everything except JS root scripts maybe? No, copy everything)
    if (basename.endsWith('.js') && fs.readFileSync(src, 'utf-8').includes('require(')) {
        // Just a heuristic to skip build scripts like generate-pdp.js, fix-recommendations.js, etc.
        // But to be safe, maybe just copy everything so the exact same site works.
    }
    fs.copyFileSync(src, dest);
  }
}

console.log('Duplicating to IN folder...');
if (!fs.existsSync(destIn)) fs.mkdirSync(destIn);
fs.readdirSync(sourceDir).forEach(child => {
  copyRecursiveSync(path.join(sourceDir, child), path.join(destIn, child));
});

console.log('Duplicating to US folder...');
if (!fs.existsSync(destUs)) fs.mkdirSync(destUs);
fs.readdirSync(sourceDir).forEach(child => {
  copyRecursiveSync(path.join(sourceDir, child), path.join(destUs, child));
});

console.log('Duplication complete!');
