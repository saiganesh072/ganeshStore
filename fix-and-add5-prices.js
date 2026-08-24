const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const inDir = path.join(__dirname, 'in');
const usDir = path.join(__dirname, 'us');

// Helper to copy files cleanly excluding scripts/git
function copyClean(srcFolder, dstFolder) {
  if (!fs.existsSync(dstFolder)) fs.mkdirSync(dstFolder, { recursive: true });

  const ignoreList = ['.git', 'in', 'us', 'node_modules', '.antigravityignore', 'package.json', 'package-lock.json', '.gemini'];

  function copyRecursive(src, dst) {
    const stats = fs.statSync(src);
    const basename = path.basename(src);

    if (ignoreList.includes(basename)) return;

    if (stats.isDirectory()) {
      if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true });
      fs.readdirSync(src).forEach(child => {
        copyRecursive(path.join(src, child), path.join(dst, child));
      });
    } else {
      fs.copyFileSync(src, dst);
    }
  }

  fs.readdirSync(srcFolder).forEach(child => {
    copyRecursive(path.join(srcFolder, child), path.join(dstFolder, child));
  });
}

// 1. Copy exact original files to IN directory (so IN has 100% original untouched prices)
console.log('Restoring 100% original prices to IN directory...');
copyClean(rootDir, inDir);

// 2. Copy exact original files to US directory first
console.log('Copying base files to US directory...');
copyClean(rootDir, usDir);

// 3. For US directory, parse and add +$5.00 to ALL prices!
console.log('Adding +$5.00 to every price in US directory...');

function add5ToPrices(text) {
  // Regex matches prices like $58.79 or $100 or $35.20
  return text.replace(/\$(\d+(?:\.\d{1,2})?)/g, (match, p1) => {
    const originalNum = parseFloat(p1);
    // Add +5.00
    const newNum = (originalNum + 5.0).toFixed(2);
    return `$${newNum}`;
  });
}

const usFiles = fs.readdirSync(usDir).filter(f => f.endsWith('.html'));

usFiles.forEach(file => {
  const filePath = path.join(usDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Replace prices
  content = add5ToPrices(content);

  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log('Price adjustment complete!');
console.log('IN Region: 100% original prices kept');
console.log('US Region: All prices increased by exactly +$5.00');
