const fs = require('fs');
let html = fs.readFileSync('product.html', 'utf-8');

const replacements = [
  { url: 'p-Performance-Polo-Shirt.html', oldImg: 'images/product-01.jpg', newImg: 'images/product-57.png' },
  { url: 'p-Rainbow-Stripe-Kids-TShirt.html', oldImg: 'images/product-01.jpg', newImg: 'images/product-58.png' },
  { url: 'p-Denim-Dungaree-Set.html', oldImg: 'images/product-01.jpg', newImg: 'images/product-59.png' },
  { url: 'p-Floral-Print-Kids-Frock.html', oldImg: 'images/product-01.jpg', newImg: 'images/product-60.png' },
  { url: 'p-Boys-Cargo-Joggers.html', oldImg: 'images/product-01.jpg', newImg: 'images/product-61.png' },
  { url: 'p-Kolhapuri-Leather-Sandals.html', oldImg: 'images/product-09.jpg', newImg: 'images/product-62.png' },
  { url: 'p-White-Canvas-Sneakers.html', oldImg: 'images/product-09.jpg', newImg: 'images/product-63.png' },
  { url: 'p-High-Waist-Leggings.html', oldImg: 'images/product-03.jpg', newImg: 'images/product-64.png' },
  { url: 'p-Breathable-Mesh-Tank-Top.html', oldImg: 'images/product-03.jpg', newImg: 'images/product-65.png' },
  { url: 'p-Leather-Laptop-Sleeve.html', oldImg: 'images/product-10.jpg', newImg: 'images/product-66.png' },
  { url: 'p-Handwoven-Stole.html', oldImg: 'images/product-10.jpg', newImg: 'images/product-67.png' },
];

replacements.forEach(rep => {
  const regex = new RegExp(`href="${rep.url}"[^>]*><img src="${rep.oldImg}"`, 'g');
  html = html.replace(regex, `href="${rep.url}"><img src="${rep.newImg}"`);
});

fs.writeFileSync('product.html', html, 'utf-8');
console.log('Updated product.html');
