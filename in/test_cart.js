const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

// Helper to find Chrome executable on Windows
function findChrome() {
    const paths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        `C:\\Users\\svuribindi\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe`
    ];
    for (const p of paths) {
        if (fs.existsSync(p)) {
            return p;
        }
    }
    throw new Error('Chrome executable not found on standard paths!');
}

async function runTests() {
    const chromePath = findChrome();
    console.log(`Found Chrome at: ${chromePath}`);

    const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    
    // Set viewport to desktop
    await page.setViewport({ width: 1200, height: 800 });

    try {
        console.log('--- Step 1: Navigating to Product Detail Page (Esprit Ruffle Shirt) ---');
        await page.goto('http://localhost:8000/p-Esprit-Ruffle-Shirt.html', { waitUntil: 'networkidle2' });

        // Clear localStorage before testing to start with a fresh state
        await page.evaluate(() => {
            localStorage.clear();
            console.log('Cleared localStorage.');
        });

        // Verify initial cart badge is empty or 0
        const initialBadge = await page.evaluate(() => {
            const el = document.querySelector('.js-show-cart');
            return el ? el.getAttribute('data-notify') : null;
        });
        console.log(`Initial Cart Badge count: ${initialBadge}`);

        console.log('--- Step 2: Selecting options and adding to cart ---');
        
        // Select Size M
        await page.evaluate(() => {
            const selects = document.querySelectorAll('select');
            // Size select is usually first, but let's select Size M specifically
            for (const select of selects) {
                for (const option of select.options) {
                    if (option.text.indexOf('Size M') > -1 || option.text === 'M') {
                        select.value = option.value;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                        break;
                    }
                }
            }
        });

        // Select Color Red
        await page.evaluate(() => {
            const selects = document.querySelectorAll('select');
            for (const select of selects) {
                for (const option of select.options) {
                    if (option.text.indexOf('Red') > -1) {
                        select.value = option.value;
                        select.dispatchEvent(new Event('change', { bubbles: true }));
                        break;
                    }
                }
            }
        });

        // Change quantity to 2
        await page.click('.btn-num-product-up');
        const qtyVal = await page.$eval('.num-product', el => el.value);
        console.log(`Quantity input value set to: ${qtyVal}`);

        // Click Add to Cart
        console.log('Clicking "Add to cart" detail button...');
        await page.click('.js-addcart-detail');

        // Wait for SweetAlert dialog to appear
        await page.waitForSelector('.swal-modal', { timeout: 5000 });
        const swalText = await page.$eval('.swal-text', el => el.textContent);
        console.log(`SweetAlert popup text: "${swalText.trim()}"`);
        
        // Assert SweetAlert matches
        if (swalText.indexOf('is added to cart') === -1) {
            throw new Error(`Expected cart SweetAlert but got: "${swalText}"`);
        }

        // Close SweetAlert
        await page.evaluate(() => {
            if (typeof swal === 'function') {
                swal.close();
            } else if (typeof swal2 === 'function') {
                swal2.close();
            } else {
                const btn = document.querySelector('.swal-button--confirm, .swal2-confirm');
                if (btn) btn.click();
            }
        });
        await page.waitForFunction(() => !document.querySelector('.swal-overlay--show-modal'));

        // Verify cart badge count is updated dynamically to match quantity value
        const localCartOnAdd = await page.evaluate(() => {
            return localStorage.getItem('cartItems');
        });
        console.log(`LocalCart after Add: ${localCartOnAdd}`);

        const updatedBadge = await page.evaluate(() => {
            return document.querySelector('.js-show-cart').getAttribute('data-notify');
        });
        console.log(`Updated Cart Badge count: ${updatedBadge}`);
        if (parseInt(updatedBadge) !== parseInt(qtyVal)) {
            throw new Error(`Expected badge count to be ${qtyVal}, but got: ${updatedBadge}`);
        }

        console.log('--- Step 3: Direct Navigation via Cart Icon ---');
        
        // Clicking the cart icon
        console.log('Clicking cart icon in header...');
        await page.click('.js-show-cart');

        // Wait for navigation programmatically
        await page.waitForFunction(() => window.location.href.indexOf('shoping-cart.html') > -1);
        await new Promise(resolve => setTimeout(resolve, 500)); // wait a tiny bit for render
        const currentUrl = page.url();
        console.log(`Navigated URL: ${currentUrl}`);
        if (currentUrl.indexOf('shoping-cart.html') === -1) {
            throw new Error(`Expected direct navigation to shoping-cart.html but landed on: ${currentUrl}`);
        }

        // Verify that sidebar is not visible (i.e. js-panel-cart does not have show-header-cart class)
        const sidebarVisible = await page.evaluate(() => {
            const panel = document.querySelector('.js-panel-cart');
            return panel ? panel.classList.contains('show-header-cart') : false;
        });
        console.log(`Is Sidebar panel drawer visible? ${sidebarVisible}`);
        if (sidebarVisible) {
            throw new Error('Shopping Cart sidebar drawer was opened on click, but direct page navigation was expected!');
        }

        console.log('--- Step 4: Verify Cart Page rendering ---');
        
        // Assert items in cart page
        const cartItemsCount = await page.evaluate(() => {
            return document.querySelectorAll('.table-shopping-cart .table_row').length;
        });
        console.log(`Number of item rows rendered in table: ${cartItemsCount}`);
        if (cartItemsCount !== 1) {
            throw new Error(`Expected 1 item row in cart table, but found: ${cartItemsCount}`);
        }

        const itemName = await page.$eval('.js-cart-item-name', el => el.textContent.trim());
        const itemSize = await page.$eval('.js-cart-item-size', el => el.textContent.trim());
        const itemColor = await page.$eval('.js-cart-item-color', el => el.textContent.trim());
        const itemQty = await page.$eval('.num-product', el => el.value);
        const itemPrice = await page.$eval('.column-3', el => el.textContent.trim());
        const itemTotal = await page.$eval('.column-5', el => el.textContent.trim());

        console.log(`Cart row details: Name: "${itemName}", Size: "${itemSize}", Color: "${itemColor}", Qty: ${itemQty}, Price: "${itemPrice}", Total: "${itemTotal}"`);
        
        if (itemName !== 'Esprit Ruffle Shirt') {
            throw new Error(`Expected item "Esprit Ruffle Shirt" but found: "${itemName}"`);
        }
        if (itemQty !== qtyVal) {
            throw new Error(`Expected quantity ${qtyVal} but found: ${itemQty}`);
        }

        console.log('--- Step 5: Quantity Adjustments ---');
        
        // Click plus button inside the row
        await page.click('.btn-num-product-up');
        await new Promise(resolve => setTimeout(resolve, 200)); // Wait for change event
        
        const newQtyVal = await page.$eval('.num-product', el => el.value);
        const newTotalVal = await page.$eval('.column-5', el => el.textContent.trim());
        const cartTotalsVal = await page.$eval('.mtext-110', el => el.textContent.trim());

        console.log(`After increasing quantity: Qty: ${newQtyVal}, Row Total: "${newTotalVal}", Subtotal: "${cartTotalsVal}"`);
        const expectedNewQty = (parseInt(qtyVal) + 1).toString();
        if (newQtyVal !== expectedNewQty) {
            throw new Error(`Expected quantity ${expectedNewQty} but got: ${newQtyVal}`);
        }

        // Verify updated localStorage state
        const localCart = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('cartItems'));
        });
        console.log(`localStorage state quantity: ${localCart[0].quantity}`);
        if (localCart[0].quantity !== parseInt(expectedNewQty)) {
            throw new Error(`Expected localStorage quantity to update to ${expectedNewQty} but got: ${localCart[0].quantity}`);
        }

        console.log('--- Step 6: Item Removal & Empty State rendering ---');
        
        // Click on the image to remove item (which triggers dynamic remove action)
        await page.click('.how-itemcart1');
        
        // Wait for row removal (contains sweetalert popup and a 500ms slide-out animation)
        await page.waitForSelector('.swal-modal', { timeout: 5000 });
        const removalSwal = await page.$eval('.swal-text', el => el.textContent);
        console.log(`Removal SweetAlert popup: "${removalSwal.trim()}"`);
        await page.evaluate(() => {
            if (typeof swal === 'function') {
                swal.close();
            } else if (typeof swal2 === 'function') {
                swal2.close();
            } else {
                const btn = document.querySelector('.swal-button--confirm, .swal2-confirm');
                if (btn) btn.click();
            }
        });
        await page.waitForFunction(() => !document.querySelector('.swal-overlay--show-modal'));
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Wait for row to be completely removed from DOM
        await page.waitForFunction(() => document.querySelectorAll('.table-shopping-cart .table_row').length === 0);
        console.log('Item row removed from DOM successfully.');

        // Verify localStorage is empty
        const finalCart = await page.evaluate(() => {
            return JSON.parse(localStorage.getItem('cartItems')) || [];
        });
        console.log(`Final localStorage cartItems count: ${finalCart.length}`);
        if (finalCart.length !== 0) {
            throw new Error(`Expected cartItems in localStorage to be empty but found ${finalCart.length} items`);
        }

        // Verify empty state is visible
        const emptyStateVisible = await page.evaluate(() => {
            const el = document.getElementById('cart-empty-state');
            return el ? !el.classList.contains('dis-none') : false;
        });
        console.log(`Is Empty State container visible? ${emptyStateVisible}`);
        if (!emptyStateVisible) {
            throw new Error('Expected #cart-empty-state to be visible after last item removal, but it was not.');
        }

        console.log('--- SUCCESS: All Shopping Cart E2E assertions passed successfully! ---');

    } catch (e) {
        console.error('--- FAILURE: Cart E2E Test execution failed! ---');
        console.error(e);
        process.exit(1);
    } finally {
        await browser.close();
    }
}

runTests();
