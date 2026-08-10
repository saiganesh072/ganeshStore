const fs = require('fs');
const path = require('path');

const dir = __dirname;
const allHtmlFiles = fs.readdirSync(dir).filter(f => f.startsWith('p-') && f.endsWith('.html'));

const relatedProducts = [
  { url: 'p-Handloom-Cotton-Kurta.html', img: 'images/product-46.png', name: 'Handloom Cotton Kurta', price: '$45.00' },
  { url: 'p-Embroidered-Anarkali-Suit.html', img: 'images/product-47.png', name: 'Embroidered Anarkali Suit', price: '$120.00' },
  { url: 'p-Performance-Polo-Shirt.html', img: 'images/product-57.png', name: 'Performance Polo Shirt', price: '$35.00' },
  { url: 'p-Rainbow-Stripe-Kids-TShirt.html', img: 'images/product-58.png', name: 'Rainbow Stripe Kids T-Shirt', price: '$18.00' },
  { url: 'p-Floral-Print-Kids-Frock.html', img: 'images/product-60.png', name: 'Floral Print Kids Frock', price: '$28.00' },
  { url: 'p-White-Canvas-Sneakers.html', img: 'images/product-63.png', name: 'White Canvas Sneakers', price: '$55.00' },
  { url: 'p-High-Waist-Leggings.html', img: 'images/product-64.png', name: 'High-Waist Leggings', price: '$40.00' },
  { url: 'p-Leather-Laptop-Sleeve.html', img: 'images/product-66.png', name: 'Leather Laptop Sleeve', price: '$85.00' }
];

let htmlContent = '';
relatedProducts.forEach(prod => {
  htmlContent += `
            <div class="item-slick2 p-l-15 p-r-15 p-t-15 p-b-15">
              <!-- Block2 -->
              <div class="block2">
                <div class="block2-pic hov-img0">
                  <a href="${prod.url}">
                    <img src="${prod.img}" alt="IMG-PRODUCT" />
                  </a>

                  <a
                    href="${prod.url}"
                    class="block2-btn flex-c-m stext-103 cl2 size-102 bg0 bor2 hov-btn1 p-lr-15 trans-04"
                  >
                    View Product
                  </a>
                </div>

                <div class="block2-txt flex-w flex-t p-t-14">
                  <div class="block2-txt-child1 flex-col-l">
                    <a
                      href="${prod.url}"
                      class="stext-104 cl4 hov-cl1 trans-04 js-name-b2 p-b-6"
                    >
                      ${prod.name}
                    </a>

                    <span class="stext-105 cl3"> ${prod.price} </span>
                  </div>

                  <div class="block2-txt-child2 flex-r p-t-3">
                    <a
                      href="#"
                      class="btn-addwish-b2 dis-block pos-relative js-addwish-b2"
                    >
                      <img
                        class="icon-heart1 dis-block trans-04"
                        src="images/icons/icon-heart-01.png"
                        alt="ICON"
                      />
                      <img
                        class="icon-heart2 dis-block trans-04 ab-t-l"
                        src="images/icons/icon-heart-02.png"
                        alt="ICON"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
`;
});

allHtmlFiles.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Find <div class="slick2"> and its closing tag, replacing everything inside
  // It's safer to use split/indexOf to replace the block.
  const startMarker = '<div class="slick2">';
  const endMarker = '<footer class="bg3 p-t-75 p-b-32">'; // the next major section after Related Products
  
  const startIndex = content.indexOf(startMarker);
  const footerIndex = content.indexOf(endMarker);
  
  if (startIndex !== -1 && footerIndex !== -1) {
    // we need to keep the slick2 start tag and the closing div tags before the footer
    // Let's find the `</div>` that closes `<div class="wrap-slick2">` just before footer.
    // Actually, we can just replace everything between `<div class="slick2">` and `</div>\n        </div>\n      </div>\n    </section>`
    
    // A regex to match the slick2 container and everything inside it:
    const regex = /<div class="slick2">[\s\S]*?(?=<\/div>\s*<\/div>\s*<\/section>)/;
    
    content = content.replace(regex, `<div class="slick2">\n${htmlContent}          </div>\n        `);
    
    fs.writeFileSync(filePath, content, 'utf-8');
  } else {
    // For files that don't match, log them
    console.log(`Could not find markers in ${file}`);
  }
});

console.log('Rebuilt Related Products section for all PDPs!');
