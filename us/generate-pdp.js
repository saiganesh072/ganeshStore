// Script to generate remaining PDP pages with actual images
const fs = require('fs');
const path = require('path');

const baseDir = __dirname;
const templateFile = path.join(baseDir, 'p-Esprit-Ruffle-Shirt.html');
const template = fs.readFileSync(templateFile, 'utf-8');

const newProducts = [
  { file: 'p-Performance-Polo-Shirt.html', name: 'Performance Polo Shirt', price: '$45.00', image: 'images/product-57.png', category: 'Sportswear' },
  { file: 'p-Rainbow-Stripe-Kids-TShirt.html', name: 'Rainbow Stripe Kids T-Shirt', price: '$18.00', image: 'images/product-58.png', category: 'Kids' },
  { file: 'p-Denim-Dungaree-Set.html', name: 'Denim Dungaree Set', price: '$35.00', image: 'images/product-59.png', category: 'Kids' },
  { file: 'p-Floral-Print-Kids-Frock.html', name: 'Floral Print Kids Frock', price: '$25.00', image: 'images/product-60.png', category: 'Kids' },
  { file: 'p-Boys-Cargo-Joggers.html', name: 'Boys Cargo Joggers', price: '$22.00', image: 'images/product-61.png', category: 'Kids' },
  { file: 'p-Kolhapuri-Leather-Sandals.html', name: 'Kolhapuri Leather Sandals', price: '$40.00', image: 'images/product-62.png', category: 'Shoes' },
  { file: 'p-White-Canvas-Sneakers.html', name: 'White Canvas Sneakers', price: '$55.00', image: 'images/product-63.png', category: 'Shoes' },
  { file: 'p-High-Waist-Leggings.html', name: 'High-Waist Leggings', price: '$30.00', image: 'images/product-64.png', category: 'Activewear' },
  { file: 'p-Breathable-Mesh-Tank-Top.html', name: 'Breathable Mesh Tank Top', price: '$22.00', image: 'images/product-65.png', category: 'Activewear' },
  { file: 'p-Leather-Laptop-Sleeve.html', name: 'Leather Laptop Sleeve', price: '$65.00', image: 'images/product-66.png', category: 'Accessories' },
  { file: 'p-Handwoven-Stole.html', name: 'Handwoven Stole', price: '$28.00', image: 'images/product-67.png', category: 'Accessories' },
];

let created = 0;
newProducts.forEach(product => {
  const filePath = path.join(baseDir, product.file);

  let html = template;
  
  // Replace title
  html = html.replace(/Esprit Ruffle Shirt \| GaneshStore/g, `${product.name} | GaneshStore`);
  html = html.replace(/Shop the Esprit Ruffle Shirt/g, `Shop the ${product.name}`);
  
  // Replace product name in all contexts
  html = html.replace(/Esprit Ruffle Shirt/g, product.name);
  
  // Replace price
  html = html.replace(/\$\s*58\.79/g, product.price.replace('$', '$ '));
  
  // Replace main product image
  html = html.replace(/images\/product-01\.jpg/g, product.image);
  
  // Replace product-detail images with the same product image
  html = html.replace(/images\/product-detail-01\.jpg/g, product.image);
  html = html.replace(/images\/product-detail-02\.jpg/g, product.image);
  html = html.replace(/images\/product-detail-03\.jpg/g, product.image);
  
  // Replace breadcrumb category
  html = html.replace(/>Women<\/a>/g, `>${product.category}</a>`);
  
  fs.writeFileSync(filePath, html, 'utf-8');
  console.log(`CREATED: ${product.file}`);
  created++;
});

console.log(`\nDone! Created ${created} new PDP pages.`);
