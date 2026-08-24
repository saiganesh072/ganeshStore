const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const htmlFiles = fs.readdirSync(rootDir).filter(f => f.endsWith('.html'));

let modifiedCount = 0;

htmlFiles.forEach(file => {
    const filePath = path.join(rootDir, file);
    let html = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // 1. Remove animsition class from body
    if (html.includes('<body class="animsition">')) {
        html = html.replace('<body class="animsition">', '<body>');
        changed = true;
    } else if (html.includes('<body class="animsition ')) {
        html = html.replace('<body class="animsition ', '<body class="');
        changed = true;
    }

    // 2. Remove animsition CSS & JS references
    if (html.includes('animsition.min.css')) {
        html = html.replace(/<!--===+-->\s*<link rel="stylesheet"[^>]*animsition\.min\.css[^>]*>\s*(<noscript>[^<]*<\/noscript>)?/g, '');
        html = html.replace(/<link rel="stylesheet"[^>]*animsition\.min\.css[^>]*>\s*(<noscript>[^<]*<\/noscript>)?/g, '');
        changed = true;
    }
    if (html.includes('animsition.min.js')) {
        html = html.replace(/<!--===+-->\s*<script src="[^"]*animsition\.min\.js"><\/script>/g, '');
        html = html.replace(/<script src="[^"]*animsition\.min\.js"><\/script>/g, '');
        changed = true;
    }

    // 3. Add defer to non-critical vendor scripts
    const scriptsToDefer = [
        'vendor/select2/select2.min.js',
        'vendor/slick/slick.min.js',
        'vendor/isotope/isotope.pkgd.min.js',
        'vendor/sweetalert/sweetalert.min.js',
        'vendor/perfect-scrollbar/perfect-scrollbar.min.js',
        'vendor/daterangepicker/moment.min.js',
        'vendor/daterangepicker/daterangepicker.js',
        'vendor/MagnificPopup/jquery.magnific-popup.min.js',
        'vendor/parallax100/parallax100.js',
        'vendor/countdowntime/countdowntime.js',
        'js/main.js',
        'js/auth.js',
        'js/backend-service.js',
        'firebase-app-compat.js',
        'firebase-auth-compat.js',
        'firebase-firestore-compat.js'
    ];

    scriptsToDefer.forEach(scriptSubstr => {
        const regex = new RegExp(`(<script\\s+src=["'][^"']*${scriptSubstr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"']*["'])(?!\\s+defer)([^>]*><\\/script>)`, 'g');
        if (regex.test(html)) {
            html = html.replace(regex, '$1 defer$2');
            changed = true;
        }
    });

    if (changed) {
        fs.writeFileSync(filePath, html, 'utf8');
        modifiedCount++;
    }
});

console.log(`Successfully updated ${modifiedCount} HTML files with deferred scripts and removed animsition latency.`);
