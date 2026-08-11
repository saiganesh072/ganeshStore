const fs = require('fs');
const path = require('path');

function processHtmlFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 1. Fix Thumbnails and Gallery Images
    const firstImgMatch = content.match(/<div[^>]*class="item-slick3"[^>]*>[\s\S]*?<img\s+src="([^"]+)"/i);
    
    if (firstImgMatch && firstImgMatch[1]) {
        const firstImgSrc = firstImgMatch[1];
        
        let newContent = content.replace(/(<div[^>]*class="item-slick3"[^>]*)data-thumb="[^"]*"/gi, `$1data-thumb="${firstImgSrc}"`);
        newContent = newContent.replace(/(<div[^>]*class="item-slick3"[^>]*>[\s\S]*?<img\s+src=")[^"]+(")/gi, `$1${firstImgSrc}$2`);
        newContent = newContent.replace(/(<div[^>]*class="item-slick3"[^>]*>[\s\S]*?<a[^>]*href=")[^"]+(")/gi, `$1${firstImgSrc}$2`);
        
        if (newContent !== content) {
            content = newContent;
            modified = true;
        }
    }

    // 2. Fix Breadcrumb (Men vs Women) based on product title
    const titleMatch = content.match(/<span\s+class="stext-109 cl4">\s*([^<]+)\s*<\/span>/i);
    if (titleMatch && titleMatch[1]) {
        const title = titleMatch[1].trim().toLowerCase();
        
        let category = null;
        if (title.includes('women') || title.includes('femme')) {
            category = 'Women';
        } else if (title.includes('men') || title.includes('shirt') || title.includes('jacket') || title.includes('trouser') || title.includes('coat')) {
            category = 'Men';
        }

        if (category) {
            const breadcrumbRegex = /(<a href="product\.html"[^>]*>\s*)(Women|Men)(\s*<i class="fa fa-angle-right)/gi;
            let newContent = content.replace(breadcrumbRegex, `$1${category}$3`);
            
            if (newContent !== content) {
                content = newContent;
                modified = true;
            }
        }
    }

    if (modified) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(dir) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!fullPath.includes('.git') && !fullPath.includes('node_modules')) {
                walkDir(fullPath);
            }
        } else if (fullPath.endsWith('.html') && (file.startsWith('p-') || file === 'product-detail.html')) {
            processHtmlFile(fullPath);
        }
    });
}

walkDir(path.join(__dirname));
console.log('Finished updating PDPs.');
