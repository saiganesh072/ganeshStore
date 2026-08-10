const fs = require('fs');
const path = require('path');

const dir = __dirname;
const filesToCheck = ['index.html', 'product.html', 'shoping-cart.html', 'wishlist.html'];
const existingFiles = new Set(fs.readdirSync(dir).filter(f => f.endsWith('.html')));

let brokenLinks = [];

filesToCheck.forEach(file => {
  if (!fs.existsSync(path.join(dir, file))) return;
  const content = fs.readFileSync(path.join(dir, file), 'utf-8');
  
  // Find all href="p-*.html" or href="product-detail.html"
  const linkRegex = /href="([^"]+\.html[^"]*)"/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    let link = match[1];
    
    // Ignore external links or empty links
    if (link.startsWith('http') || link.startsWith('#') || link.startsWith('javascript:')) continue;
    
    // Strip query parameters for existence check
    const baseLink = link.split('?')[0];
    
    // We only care about internal html pages
    if (baseLink.endsWith('.html')) {
      if (!existingFiles.has(baseLink)) {
        brokenLinks.push({
          source: file,
          brokenLink: link,
          baseLink: baseLink
        });
      }
    }
  }
});

if (brokenLinks.length > 0) {
  console.log('Found Broken Links:');
  console.log(JSON.stringify(brokenLinks, null, 2));
} else {
  console.log('All internal HTML links are valid!');
}
