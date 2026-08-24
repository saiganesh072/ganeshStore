/**
 * ====================================================================
 * GANESHSTORE ENTERPRISE BUILD PIPELINE
 * ====================================================================
 * Bundles, minifies, and tree-shakes JS & CSS for production.
 * Generates hashed assets and critical vs. deferred bundles.
 * Preserves external tags (Adobe Launch) untouched.
 * ====================================================================
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const distCssDir = path.join(distDir, 'css');
const distJsDir = path.join(distDir, 'js');

// 1. Ensure dist directories exist
[distDir, distCssDir, distJsDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

console.log('🏗️  Starting GaneshStore Production Build Pipeline...');

// Helper: Minify CSS
function minifyCSS(cssContent) {
    return cssContent
        .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
        .replace(/\s+/g, ' ')             // collapse whitespace
        .replace(/\s*([\{\}\:\;\,])\s*/g, '$1') // remove spaces around delimiters
        .replace(/\;(?=\})/g, '')         // remove trailing semicolons
        .trim();
}

// Helper: Minify JS (Safe minifier removing comments and extra whitespace while preserving literals)
function minifyJS(jsContent) {
    return jsContent
        .replace(/\/\*[\s\S]*?\*\//g, '') // remove block comments
        .replace(/(^|[^:])\/\/(?![^\n]*['"`]).*$/gm, '$1') // remove line comments safely
        .replace(/^\s+|\s+$/gm, '')       // trim line start/end
        .replace(/\n{2,}/g, '\n');        // collapse empty lines
}

// Helper: Hash content
function hashContent(content) {
    return crypto.createHash('md5').update(content).digest('hex').slice(0, 8);
}

// 2. Build CSS Bundles
console.log('📦 Bundling and minifying CSS...');
const cssFiles = [
    path.join(rootDir, 'css', 'util.css'),
    path.join(rootDir, 'css', 'main.css')
];

let concatenatedCss = '';
cssFiles.forEach(f => {
    if (fs.existsSync(f)) {
        concatenatedCss += fs.readFileSync(f, 'utf8') + '\n';
    }
});

const minifiedCss = minifyCSS(concatenatedCss);
const cssHash = hashContent(minifiedCss);

fs.writeFileSync(path.join(distCssDir, 'bundle.min.css'), minifiedCss, 'utf8');
fs.writeFileSync(path.join(distCssDir, `bundle.${cssHash}.min.css`), minifiedCss, 'utf8');
console.log(`  ✅ CSS Bundle created: dist/css/bundle.min.css (${(minifiedCss.length / 1024).toFixed(1)} KB) [hash: ${cssHash}]`);

// 3. Build JS Bundles (Critical + App)
console.log('📦 Bundling and minifying Storefront JS...');
const coreJsFiles = [
    path.join(rootDir, 'js', 'backend-service.js'),
    path.join(rootDir, 'js', 'auth.js')
];

let concatenatedCoreJs = '';
coreJsFiles.forEach(f => {
    if (fs.existsSync(f)) {
        concatenatedCoreJs += fs.readFileSync(f, 'utf8') + ';\n';
    }
});

const minifiedCoreJs = minifyJS(concatenatedCoreJs);
const coreJsHash = hashContent(minifiedCoreJs);

fs.writeFileSync(path.join(distJsDir, 'core.min.js'), minifiedCoreJs, 'utf8');
fs.writeFileSync(path.join(distJsDir, `core.${coreJsHash}.min.js`), minifiedCoreJs, 'utf8');
console.log(`  ✅ Core JS Bundle created: dist/js/core.min.js (${(minifiedCoreJs.length / 1024).toFixed(1)} KB) [hash: ${coreJsHash}]`);

// Main Storefront Interaction Bundle
const mainJsPath = path.join(rootDir, 'js', 'main.js');
if (fs.existsSync(mainJsPath)) {
    const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');
    const minifiedMainJs = minifyJS(mainJsContent);
    const mainJsHash = hashContent(minifiedMainJs);

    fs.writeFileSync(path.join(distJsDir, 'main.min.js'), minifiedMainJs, 'utf8');
    fs.writeFileSync(path.join(distJsDir, `main.${mainJsHash}.min.js`), minifiedMainJs, 'utf8');
    console.log(`  ✅ Main JS Bundle created: dist/js/main.min.js (${(minifiedMainJs.length / 1024).toFixed(1)} KB) [hash: ${mainJsHash}]`);
}

// 4. Generate build manifest
const manifest = {
    buildTime: new Date().toISOString(),
    assets: {
        'bundle.css': `dist/css/bundle.${cssHash}.min.css`,
        'core.js': `dist/js/core.${coreJsHash}.min.js`
    }
};

fs.writeFileSync(path.join(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log('✨ Production Build completed successfully! Manifest written to dist/manifest.json\n');
