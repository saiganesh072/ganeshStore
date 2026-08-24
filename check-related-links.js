const fs = require('fs');
const content = fs.readFileSync('p-Esprit-Ruffle-Shirt.html', 'utf-8');
const lines = content.split('\n');

let startIndex = lines.findIndex(l => l.includes('Related Products'));
if (startIndex !== -1) {
  let section = lines.slice(startIndex, startIndex + 500).join('\n');
  const linkRegex = /href="([^"]+\.html[^"]*)"/g;
  let match;
  console.log("Links in Related Products section:");
  while ((match = linkRegex.exec(section)) !== null) {
    console.log(match[1]);
  }
} else {
  console.log("No Related Products section found in p-Esprit-Ruffle-Shirt.html");
}
