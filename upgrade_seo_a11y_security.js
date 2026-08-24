const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

console.log(`Processing ${htmlFiles.length} HTML files for SEO, OpenGraph, JSON-LD, Accessibility, and Security upgrades...`);

let upgradedCount = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');
    let modified = false;

    // --- 1. TITLE & META DESCRIPTION ---
    let pageTitle = 'GaneshStore — Premium Luxury Fashion & Modern Elegance';
    let titleMatch = content.match(/<title>([^<]*)<\/title>/i);
    if (titleMatch && titleMatch[1].trim()) {
        pageTitle = titleMatch[1].trim();
    } else {
        const cleanName = file.replace('.html', '').replace(/^p-/, '').replace(/-/g, ' ');
        pageTitle = `${cleanName} | GaneshStore — Luxury Collection`;
        if (content.includes('<head>')) {
            content = content.replace('<head>', `<head>\n    <title>${pageTitle}</title>`);
            modified = true;
        }
    }

    let metaDesc = 'Discover curated luxury fashion, designer apparel, footwear, timepieces, and bespoke accessories at GaneshStore. Complimentary shipping on orders over $100.';
    let metaDescMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
    if (metaDescMatch && metaDescMatch[1].trim()) {
        metaDesc = metaDescMatch[1].trim();
    } else {
        const cleanName = file.replace('.html', '').replace(/^p-/, '').replace(/-/g, ' ');
        metaDesc = `Explore ${cleanName} at GaneshStore. Handcrafted luxury essentials with premium materials, verified customer reviews, and white-glove express delivery.`;
        if (content.includes('</title>')) {
            content = content.replace('</title>', `</title>\n    <meta name="description" content="${metaDesc}" />`);
            modified = true;
        }
    }

    // --- 2. OPEN GRAPH & TWITTER CARDS ---
    if (!content.includes('og:title')) {
        let ogImg = 'images/slide-01.jpg';
        const imgMatch = content.match(/src=["'](images\/product-[^"']+)["']/i) || content.match(/src=["'](images\/[^"']+)["']/i);
        if (imgMatch) ogImg = imgMatch[1];

        const ogTags = `
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="${file.startsWith('p-') ? 'product' : 'website'}" />
    <meta property="og:site_name" content="GaneshStore" />
    <meta property="og:title" content="${pageTitle.replace(/"/g, '&quot;')}" />
    <meta property="og:description" content="${metaDesc.replace(/"/g, '&quot;')}" />
    <meta property="og:image" content="${ogImg}" />
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${pageTitle.replace(/"/g, '&quot;')}" />
    <meta name="twitter:description" content="${metaDesc.replace(/"/g, '&quot;')}" />
    <meta name="twitter:image" content="${ogImg}" />`;

        if (content.includes('</title>')) {
            content = content.replace('</title>', `</title>${ogTags}`);
            modified = true;
        }
    }

    // --- 3. JSON-LD STRUCTURED DATA ---
    if (!content.includes('application/ld+json')) {
        let jsonLd = {};
        if (file.startsWith('p-') || file === 'product-detail.html') {
            const prodNameMatch = content.match(/js-name-detail[^>]*>([^<]+)</i);
            const prodName = prodNameMatch ? prodNameMatch[1].trim() : file.replace('.html', '').replace(/^p-/, '').replace(/-/g, ' ');
            const prodPriceMatch = content.match(/js-price-detail[^>]*>\s*\$([0-9.]+)/i);
            const prodPrice = prodPriceMatch ? parseFloat(prodPriceMatch[1]) : 49.99;

            jsonLd = {
                "@context": "https://schema.org/",
                "@type": "Product",
                "name": prodName,
                "image": [
                    "images/product-01.jpg"
                ],
                "description": metaDesc,
                "sku": `GS-${file.replace(/[^0-9a-zA-Z]/g, '').slice(0, 8).toUpperCase()}`,
                "brand": {
                    "@type": "Brand",
                    "name": "GaneshStore"
                },
                "offers": {
                    "@type": "Offer",
                    "url": file,
                    "priceCurrency": "USD",
                    "price": prodPrice,
                    "priceValidUntil": "2027-12-31",
                    "itemCondition": "https://schema.org/NewCondition",
                    "availability": "https://schema.org/InStock",
                    "seller": {
                        "@type": "Organization",
                        "name": "GaneshStore"
                    }
                },
                "aggregateRating": {
                    "@type": "AggregateRating",
                    "ratingValue": "4.9",
                    "reviewCount": "28"
                }
            };
        } else {
            jsonLd = {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "GaneshStore",
                "url": "https://ganeshstore.com",
                "logo": "images/icons/logo-01.png",
                "description": "Curated luxury fashion atelier, accessories, footwear, and bespoke craftsmanship.",
                "sameAs": [
                    "https://www.facebook.com/ganeshstore",
                    "https://www.instagram.com/ganeshstore",
                    "https://www.pinterest.com/ganeshstore"
                ]
            };
        }

        const scriptTag = `\n    <script type="application/ld+json">\n    ${JSON.stringify(jsonLd, null, 2)}\n    </script>`;
        if (content.includes('</head>')) {
            content = content.replace('</head>', `${scriptTag}\n  </head>`);
            modified = true;
        }
    }

    // --- 4. ACCESSIBLE H1 HEADING HIERARCHY ---
    if (!/<h1[\s>]/i.test(content)) {
        if (file.startsWith('p-') || file === 'product-detail.html') {
            // Replace <h4 class="mtext-105 cl2 js-name-detail p-b-14"> with <h1 ...>
            if (content.includes('js-name-detail')) {
                content = content.replace(/<h4([^>]*js-name-detail[^>]*)>/gi, '<h1$1>');
                content = content.replace(/<\/h4>(\s*<span class="mtext-106 cl2 js-price-detail)/gi, '</h1>$1');
                modified = true;
            }
        } else if (file === 'index.html' || file === 'home-02.html' || file === 'home-03.html') {
            // Add semantic accessible H1 in slider/hero or sr-only
            if (content.includes('<h2 class="ltext-201')) {
                content = content.replace('<h2 class="ltext-201', '<h1 class="ltext-201');
                content = content.replace('</h2>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<div class="layer-slick1', '</h1>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t<div class="layer-slick1');
                modified = true;
            } else if (content.includes('<body>') || content.includes('<body class="animsition">')) {
                content = content.replace(/(<body[^>]*>)/i, '$1\n    <h1 class="sr-only">GaneshStore — Luxury Fashion, Footwear & Accessories</h1>');
                modified = true;
            }
        } else if (file === 'product.html') {
            if (content.includes('<body>') || content.includes('<body class="animsition">')) {
                content = content.replace(/(<body[^>]*>)/i, '$1\n    <h1 class="sr-only">Curated Luxury Fashion Catalog & New Arrivals</h1>');
                modified = true;
            }
        } else if (file === 'shoping-cart.html') {
            if (content.includes('<body>') || content.includes('<body class="animsition">')) {
                content = content.replace(/(<body[^>]*>)/i, '$1\n    <h1 class="sr-only">Shopping Cart & Free Shipping Estimator</h1>');
                modified = true;
            }
        } else if (file === 'checkout.html') {
            if (content.includes('<body>') || content.includes('<body class="animsition">')) {
                content = content.replace(/(<body[^>]*>)/i, '$1\n    <h1 class="sr-only">Secure Multi-Step Luxury Checkout & Payment</h1>');
                modified = true;
            }
        } else if (file === 'signin.html') {
            if (content.includes('<body>') || content.includes('<body class="animsition">')) {
                content = content.replace(/(<body[^>]*>)/i, '$1\n    <h1 class="sr-only">Client Sign In, 2-Step Verification & VIP Rewards</h1>');
                modified = true;
            }
        } else {
            if (content.includes('<body>') || content.includes('<body class="animsition">')) {
                const titleStr = file.replace('.html', '').replace(/-/g, ' ');
                content = content.replace(/(<body[^>]*>)/i, `$1\n    <h1 class="sr-only">GaneshStore — ${titleStr}</h1>`);
                modified = true;
            }
        }
    }

    // --- 5. SECURITY: target="_blank" missing rel="noopener noreferrer" ---
    const targetBlankRegex = /<a\s+([^>]*target=["']_blank["'][^>]*)>/gi;
    content = content.replace(targetBlankRegex, (match, p1) => {
        if (!/rel=["'][^"']*noopener/i.test(p1)) {
            modified = true;
            return `<a ${p1} rel="noopener noreferrer">`;
        }
        return match;
    });

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf-8');
        upgradedCount++;
    }
});

console.log(`Successfully upgraded ${upgradedCount} HTML files!`);
