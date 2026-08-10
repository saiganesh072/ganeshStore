const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf-8');

// Replacements to show new products on homepage
const replacements = [
  { oldUrl: 'p-Esprit-Ruffle-Shirt.html', oldImg: 'images/product-01.jpg', oldName: 'Esprit Ruffle Shirt', newUrl: 'p-Handloom-Cotton-Kurta.html', newImg: 'images/product-46.png', newName: 'Handloom Cotton Kurta' },
  { oldUrl: 'p-Premium-Canvas-Tote.html', oldImg: 'images/product-02.jpg', oldName: 'Premium Canvas Tote', newUrl: 'p-Embroidered-Anarkali-Suit.html', newImg: 'images/product-47.png', newName: 'Embroidered Anarkali Suit' },
  { oldUrl: 'p-Only-Check-Trouser.html', oldImg: 'images/product-03.jpg', oldName: 'Only Check Trouser', newUrl: 'p-Performance-Polo-Shirt.html', newImg: 'images/product-57.png', newName: 'Performance Polo Shirt' },
  { oldUrl: 'p-Leather-Biker-Jacket.html', oldImg: 'images/product-04.jpg', oldName: 'Leather Biker Jacket', newUrl: 'p-Floral-Print-Kids-Frock.html', newImg: 'images/product-60.png', newName: 'Floral Print Kids Frock' },
  { oldUrl: 'p-Front-Pocket-Jumper.html', oldImg: 'images/product-05.jpg', oldName: 'Front Pocket Jumper', newUrl: 'p-White-Canvas-Sneakers.html', newImg: 'images/product-63.png', newName: 'White Canvas Sneakers' },
  { oldUrl: 'p-Vintage-Inspired-Classic.html', oldImg: 'images/product-06.jpg', oldName: 'Vintage Inspired Classic', newUrl: 'p-High-Waist-Leggings.html', newImg: 'images/product-64.png', newName: 'High-Waist Leggings' },
];

replacements.forEach(rep => {
  html = html.split(rep.oldUrl).join(rep.newUrl);
  html = html.split(rep.oldImg).join(rep.newImg);
  html = html.split(rep.oldName).join(rep.newName);
});

fs.writeFileSync('index.html', html, 'utf-8');
console.log('Updated index.html to showcase new products');
