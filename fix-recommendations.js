const fs = require('fs');
const path = require('path');

const dir = __dirname;
const allHtmlFiles = fs.readdirSync(dir).filter(f => f.startsWith('p-') && f.endsWith('.html'));

const validProductLinks = [
  'p-Premium-Canvas-Tote.html',
  'p-Only-Check-Trouser.html',
  'p-Leather-Biker-Jacket.html',
  'p-Front-Pocket-Jumper.html',
  'p-Vintage-Inspired-Classic.html',
  'p-Stretch-Cotton-Shirt.html',
  'p-Waxed-Canvas-Holdall.html',
  'p-Esprit-Ruffle-Shirt.html'
];

allHtmlFiles.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  let index = 0;
  // Replace each occurrence of href="product-detail.html" with a different valid product link
  content = content.replace(/href="product-detail\.html"/g, () => {
    const link = validProductLinks[index % validProductLinks.length];
    index++;
    return `href="${link}"`;
  });
  
  fs.writeFileSync(filePath, content, 'utf-8');
});

console.log(`Updated recommendation catalog links in ${allHtmlFiles.length} PDP pages.`);
