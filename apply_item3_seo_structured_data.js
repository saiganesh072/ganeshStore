const fs = require('fs');
const path = require('path');

const root = __dirname;
const htmlFiles = fs.readdirSync(root).filter(f => f.endsWith('.html'));

// 1. Update index.html with WebSite + SearchAction schema and fix OG description if needed
const indexPath = path.join(root, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

const websiteSearchSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "GaneshStore",
      "url": "https://ganeshstore.com/",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": "https://ganeshstore.com/product.html?search={search_term_string}"
        },
        "query-input": "required name=search_term_string"
      }
    }
    </script>`;

if (!indexHtml.includes('"@type": "WebSite"') && !indexHtml.includes('"@type":"WebSite"')) {
    indexHtml = indexHtml.replace('</head>', `${websiteSearchSchema}\n</head>`);
    fs.writeFileSync(indexPath, indexHtml, 'utf-8');
    console.log('Added WebSite + SearchAction JSON-LD to index.html');
}

// 2. Add BreadcrumbList to product.html
const productCatalogPath = path.join(root, 'product.html');
let productCatalogHtml = fs.readFileSync(productCatalogPath, 'utf-8');
const catalogBreadcrumb = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://ganeshstore.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Shop",
          "item": "https://ganeshstore.com/product.html"
        }
      ]
    }
    </script>`;

if (!productCatalogHtml.includes('"BreadcrumbList"')) {
    productCatalogHtml = productCatalogHtml.replace('</head>', `${catalogBreadcrumb}\n</head>`);
    fs.writeFileSync(productCatalogPath, productCatalogHtml, 'utf-8');
    console.log('Added BreadcrumbList JSON-LD to product.html');
}

// 3. Add BreadcrumbList to all 67 product detail pages (p-*.html and product-detail.html)
let pdpCount = 0;
htmlFiles.filter(f => f.startsWith('p-') || f === 'product-detail.html').forEach(file => {
    const filePath = path.join(root, file);
    let html = fs.readFileSync(filePath, 'utf-8');

    if (!html.includes('"BreadcrumbList"')) {
        // Extract product name from existing Product JSON-LD or title
        let productName = file.replace('p-', '').replace('.html', '').replace(/-/g, ' ');
        if (file === 'product-detail.html') productName = 'Lightweight Jacket';

        const nameMatch = html.match(/"name":\s*"([^"]+)"/);
        if (nameMatch && nameMatch[1] && nameMatch[1] !== 'GaneshStore') {
            productName = nameMatch[1];
        }

        const pdpBreadcrumb = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://ganeshstore.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Shop",
          "item": "https://ganeshstore.com/product.html"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": "${productName}",
          "item": "https://ganeshstore.com/${file}"
        }
      ]
    }
    </script>`;

        html = html.replace('</head>', `${pdpBreadcrumb}\n</head>`);
        fs.writeFileSync(filePath, html, 'utf-8');
        pdpCount++;
    }
});
console.log(`Added BreadcrumbList JSON-LD to ${pdpCount} PDP files.`);

// 4. Add FAQPage schema to returns.html
const returnsPath = path.join(root, 'returns.html');
let returnsHtml = fs.readFileSync(returnsPath, 'utf-8');
if (!returnsHtml.includes('"FAQPage"')) {
    const faqReturns = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the GaneshStore return policy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can return any unworn, unwashed item within 30 days of purchase for a full refund or exchange with original tags attached."
          }
        },
        {
          "@type": "Question",
          "name": "How long do refunds take to process?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Refunds are processed to the original payment method within 5-7 business days after inspection at our fulfillment facility."
          }
        }
      ]
    }
    </script>`;
    returnsHtml = returnsHtml.replace('</head>', `${faqReturns}\n</head>`);
    fs.writeFileSync(returnsPath, returnsHtml, 'utf-8');
    console.log('Added FAQPage JSON-LD to returns.html');
}

// 5. Add FAQPage schema to shipping.html
const shippingPath = path.join(root, 'shipping.html');
let shippingHtml = fs.readFileSync(shippingPath, 'utf-8');
if (!shippingHtml.includes('"FAQPage"')) {
    const faqShipping = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What are the shipping options and delivery times?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "We offer free standard shipping on orders over $100 (3-5 business days) and expedited priority shipping (1-2 business days)."
          }
        },
        {
          "@type": "Question",
          "name": "Do you offer international worldwide shipping?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, GaneshStore delivers worldwide with full tracking and customs clearance support."
          }
        }
      ]
    }
    </script>`;
    shippingHtml = shippingHtml.replace('</head>', `${faqShipping}\n</head>`);
    fs.writeFileSync(shippingPath, shippingHtml, 'utf-8');
    console.log('Added FAQPage JSON-LD to shipping.html');
}

// 6. Add ContactPage schema to contact.html
const contactPath = path.join(root, 'contact.html');
let contactHtml = fs.readFileSync(contactPath, 'utf-8');
if (!contactHtml.includes('"ContactPage"')) {
    const contactSchema = `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact GaneshStore Concierge",
      "description": "Reach out to GaneshStore for order inquiries, bespoke styling assistance, and customer support.",
      "url": "https://ganeshstore.com/contact.html",
      "mainEntity": {
        "@type": "Organization",
        "name": "GaneshStore",
        "telephone": "+1-96-716-6879",
        "email": "support@ganeshstore.com",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "8th floor, 379 Hudson St",
          "addressLocality": "New York",
          "addressRegion": "NY",
          "postalCode": "10018",
          "addressCountry": "US"
        }
      }
    }
    </script>`;
    contactHtml = contactHtml.replace('</head>', `${contactSchema}\n</head>`);
    fs.writeFileSync(contactPath, contactHtml, 'utf-8');
    console.log('Added ContactPage JSON-LD to contact.html');
}
