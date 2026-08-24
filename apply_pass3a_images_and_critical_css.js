const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

// Critical above-the-fold CSS to inline
const criticalCss = `
  /* Critical Above-the-Fold CSS */
  .skip-link{position:absolute;top:-100px;left:16px;background:#717fe0;color:#fff;padding:12px 24px;font-weight:700;font-size:14px;border-radius:0 0 8px 8px;z-index:999999;transition:top .2s ease-in-out;text-decoration:none;box-shadow:0 8px 24px rgba(113,127,224,.35)}
  .skip-link:focus{top:0;outline:3px solid #222;outline-offset:2px}
  .announcement-bar{background:#222;color:#fff;text-align:center;font-size:12px;padding:8px 15px;font-weight:500;letter-spacing:1px}
  .container-menu-desktop{height:84px;width:100%;position:relative;-webkit-transition:all .3s ease;transition:all .3s ease}
  .wrap-menu-desktop{position:fixed;top:0;left:0;width:100%;height:84px;background-color:#fff;z-index:1100;box-shadow:0 0 10px rgba(0,0,0,.08)}
  .limiter-menu-desktop{height:100%;display:flex;align-items:center;background-color:transparent}
  .logo{display:block;margin-right:45px}
  .logo img{display:block;max-width:100%;height:auto}
  .main-menu{display:flex;align-items:center;margin:0;padding:0;list-style:none}
  .main-menu > li{position:relative;padding:20px 0}
  .main-menu > li > a{font-family:Poppins-Medium,sans-serif;font-size:14px;color:#333;padding:5px 15px;text-decoration:none;transition:color .25s ease}
  .wrap-icon-header{display:flex;align-items:center;margin-left:auto}
  .icon-header-item{font-size:24px;color:#333;cursor:pointer;position:relative;display:flex;align-items:center}
`;

let updatedPages = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Inline Critical CSS in head if not already present
    if (!html.includes('/* Critical Above-the-Fold CSS */')) {
        html = html.replace('</head>', `  <style id="critical-css">${criticalCss}</style>\n</head>`);
        changed = true;
    }

    // 2. Enhance Hero Slider with WebP picture fallback on index.html
    if (file === 'index.html') {
        if (!html.includes('<picture class="hero-slide-picture">')) {
            // Replace slide-01 img with responsive picture preserving high fetchpriority
            html = html.replace(
                /<img width="1920" height="930" src="images\/slide-01\.jpg" alt="IMG-SLIDER" fetchpriority="high" \/>/g,
                '<picture class="hero-slide-picture"><source srcset="images/slide-01.webp" type="image/webp"><img width="1920" height="930" src="images/slide-01.jpg" alt="IMG-SLIDER" fetchpriority="high" /></picture>'
            );
            html = html.replace(
                /<img loading="lazy" width="1920" height="930" src="images\/slide-02\.jpg" alt="IMG-SLIDER" \/>/g,
                '<picture class="hero-slide-picture"><source srcset="images/slide-02.webp" type="image/webp"><img loading="lazy" width="1920" height="930" src="images/slide-02.jpg" alt="IMG-SLIDER" /></picture>'
            );
            html = html.replace(
                /<img loading="lazy" width="1920" height="930" src="images\/slide-03\.jpg" alt="IMG-SLIDER" \/>/g,
                '<picture class="hero-slide-picture"><source srcset="images/slide-03.webp" type="image/webp"><img loading="lazy" width="1920" height="930" src="images/slide-03.jpg" alt="IMG-SLIDER" /></picture>'
            );
            changed = true;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, html, 'utf8');
        updatedPages++;
    }
});

console.log(`Critical CSS & WebP Image Pipeline applied across ${updatedPages} HTML files.`);
