const fs = require('fs');
const path = require('path');

// A script to append the new Related Products JS logic into main.js
const mainJsPath = path.join(__dirname, 'js', 'main.js');
let content = fs.readFileSync(mainJsPath, 'utf8');

// 1. Replace initPDPExtras for dynamic badges
const newPdpExtras = `
function initPDPExtras() {
    var $priceContainer = $('.mtext-106').first();
    if (!$priceContainer.length) return;

    var pName = $('.js-name-detail').text().trim() || 'Product';
    
    // Deterministic hash based on product name length and character codes
    var hash = 0;
    for (var i = 0; i < pName.length; i++) {
        hash = pName.charCodeAt(i) + ((hash << 5) - hash);
    }
    hash = Math.abs(hash);
    
    // Show scarcity badges for ~35% of products based on hash
    if (hash % 3 === 0) {
        if (!$('.stock-scarcity-badge').length) {
            var scarcityHtml = '<div>' +
                '<span class="stock-scarcity-badge">⚡ Only ' + ((hash % 4) + 2) + ' left in stock - order soon</span>' +
                '<span class="popularity-badge">🔥 ' + ((hash % 20) + 12) + ' viewed in last hour</span>' +
                '</div>';
            $priceContainer.after(scarcityHtml);
        }
    }

    if (!$('.delivery-estimate-box').length) {
        var today = new Date();
        var minDate = new Date(today);
        minDate.setDate(today.getDate() + 3);
        var maxDate = new Date(today);
        maxDate.setDate(today.getDate() + 5);
        
        var options = { weekday: 'short', month: 'short', day: 'numeric' };
        var estStr = minDate.toLocaleDateString('en-US', options) + ' - ' + maxDate.toLocaleDateString('en-US', options);
        
        var deliveryHtml = '<div class="delivery-estimate-box">' +
            '<i class="zmdi zmdi-truck"></i> Estimated Delivery: <strong>' + estStr + '</strong>' +
            '</div>';
        $('.p-t-33').before(deliveryHtml);
    }
}

// Feature: Dynamic Related Products
function initDynamicRelatedProducts() {
    var $relateSection = $('.sec-relate-product .container');
    if (!$relateSection.length) return;
    
    var currentName = $('.js-name-detail').text().trim();
    
    // Catalog of varied dummy products for recommendations
    var catalog = [
        { name: "Esprit Ruffle Shirt", price: "$16.64", img: "images/product-01.jpg", url: "p-Esprit-Ruffle-Shirt.html" },
        { name: "Herschel supply men", price: "$35.31", img: "images/product-02.jpg", url: "p-Herschel-supply-men.html" },
        { name: "Only Check Trouser", price: "$25.50", img: "images/product-03.jpg", url: "p-Only-Check-Trouser.html" },
        { name: "Classic Trench Coat", price: "$75.00", img: "images/product-04.jpg", url: "p-Classic-Trench-Coat.html" },
        { name: "Front Pocket Jumper", price: "$34.75", img: "images/product-05.jpg", url: "p-Front-Pocket-Jumper.html" },
        { name: "Vintage Inspired Classic", price: "$93.20", img: "images/product-06.jpg", url: "p-Vintage-Inspired-Classic.html" },
        { name: "Shirt in Stretch Cotton", price: "$52.66", img: "images/product-07.jpg", url: "p-Shirt-in-Stretch-Cotton.html" },
        { name: "Pieces Metallic Printed", price: "$18.96", img: "images/product-08.jpg", url: "p-Pieces-Metallic-Printed.html" }
    ];
    
    // Filter out the exact product we are viewing
    var related = catalog.filter(function(item) {
        return item.name.toLowerCase() !== currentName.toLowerCase();
    });
    
    // Ensure we only show 5-6 products
    related = related.slice(0, 6);
    
    var itemsHtml = '';
    related.forEach(function(item) {
        itemsHtml += '<div style="flex: 0 0 220px; text-align: center;">' +
            '<a href="' + item.url + '">' +
            '  <img src="' + item.img + '" style="width: 220px; height: 260px; object-fit: cover; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);">' +
            '  <div style="font-size: 15px; font-family: Poppins-Medium; color: #222; margin-top: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">' + item.name + '</div>' +
            '  <div style="font-size: 14px; color: #717fe0; font-weight: 600; margin-top: 4px;">' + item.price + '</div>' +
            '</a>' +
            '</div>';
    });

    // Replace the old bulky slick2 crosshairs with the premium fluid carousel layout
    var premiumHtml = '<div class="p-b-45"><h3 class="ltext-106 cl5 txt-center">Related Products</h3></div>' +
        '<div class="free-scroll-carousel" style="display: flex; gap: 30px; overflow-x: auto; padding-bottom: 20px;">' + itemsHtml + '</div>';
        
    $relateSection.html(premiumHtml);
}
`;

content = content.replace(/function initPDPExtras\(\) \{[\s\S]*?(?=\/\/\s*Feature 8)/i, newPdpExtras);

// Ensure initDynamicRelatedProducts is called in document ready
if (!content.includes('initDynamicRelatedProducts();')) {
    content = content.replace(/(initPDPExtras\(\);)/, '$1\n    initDynamicRelatedProducts();');
}

fs.writeFileSync(mainJsPath, content, 'utf8');
console.log('Successfully updated js/main.js with Dynamic Related Products and Scarcity Badges.');
