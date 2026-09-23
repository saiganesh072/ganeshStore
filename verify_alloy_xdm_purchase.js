const fs = require('fs');
const path = require('path');

console.log('========================================================================');
console.log(' VERIFICATION: ALLOY XDM & ACDL PURCHASE EVENT INTEGRATION');
console.log('========================================================================\n');

let passed = 0;
let failed = 0;

function assert(condition, message) {
    if (condition) {
        console.log(`  ✓ [PASS] ${message}`);
        passed++;
    } else {
        console.error(`  ✗ [FAIL] ${message}`);
        failed++;
    }
}

// Setup simulated browser environment
global.location = {
    pathname: '/checkout.html',
    href: 'https://ganeshstore.com/checkout.html',
    hostname: 'ganeshstore.com',
    protocol: 'https:'
};
global.window = global;
global.window.location = global.location;
global.document = {
    addEventListener: () => {},
    readyState: 'complete',
    title: 'Checkout | GaneshStore',
    documentElement: { lang: 'en-US' },
    location: global.location,
    referrer: '',
    querySelectorAll: () => []
};
global.screen = { width: 1920, height: 1080 };
global.navigator = { userAgent: 'Mozilla/5.0 TestBrowser', language: 'en-US' };
global.innerWidth = 1200;
global.innerHeight = 800;
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
};

// Mock alloy function
let alloyCallCount = 0;
let lastAlloyCallArgs = null;
global.window.alloy = function (command, payload) {
    alloyCallCount++;
    lastAlloyCallArgs = { command, payload };
    return Promise.resolve({ ok: true });
};

// Load datalayer.js
const datalayerCode = fs.readFileSync(path.join(__dirname, 'js', 'datalayer.js'), 'utf-8');
eval(datalayerCode);

assert(typeof window.trackACDLPurchase === 'function', 'trackACDLPurchase is exposed on window');
assert(typeof window.trackAlloyPurchase === 'function', 'trackAlloyPurchase is exposed on window');

// Test order transaction
const mockTransaction = {
    order_id: 'ORD-703639',
    customer_name: 'test r',
    email: 'test@ab.com',
    shipping_address: 'test123, test, test 411111',
    shipping_method: 'Standard Delivery',
    payment_method: 'CARD',
    subtotal: 58.79,
    discount: 0,
    shipping_fee: 0,
    tax: 0,
    total: 58.79,
    tracking_number: 'GS-TRK-938212',
    user_id: null,
    items: [
        {
            id: 'GS001',
            SKU: 'PROD-01',
            name: 'Esprit Ruffle Shirt',
            price: '$58.79',
            quantity: 1,
            size: 'Size M',
            color: 'Default'
        },
        {
            id: 'GS002',
            sku: 'PROD-02',
            name: 'Classic Trench Coat',
            price: '$100.00',
            quantity: 2,
            size: 'Size L',
            color: 'Beige'
        }
    ]
};

// Configure custom mbox scope
window.targetMboxScope = 'order_confirmation_target_scope';

// Trigger purchase event
window.trackACDLPurchase(mockTransaction);

// Verify ACDL push
const lastEvent = window.adobeDataLayer[window.adobeDataLayer.length - 1];
assert(lastEvent.event === 'purchaseCompleted', 'Pushed event name is "purchaseCompleted"');
assert(lastEvent.transaction.order_id === 'ORD-703639', 'Transaction details preserved in ACDL');
assert(!!lastEvent.xdm, 'XDM object attached to ACDL event');

// Verify XDM structure
const xdm = lastEvent.xdm;
assert(xdm.commerce.order.purchaseID === 'ORD-703639', 'XDM commerce.order.purchaseID matches order_id');
assert(xdm.commerce.order.priceTotal === 58.79, 'XDM commerce.order.priceTotal matches total value');
assert(xdm.commerce.purchases.value === 1, 'XDM commerce.purchases.value equals 1');

// Verify productListItems
assert(Array.isArray(xdm.productListItems) && xdm.productListItems.length === 2, 'productListItems has 2 items');
assert(xdm.productListItems[0].SKU === 'PROD-01', 'First product SKU is PROD-01');
assert(xdm.productListItems[0].priceTotal === 58.79, 'First product priceTotal is 58.79');
assert(xdm.productListItems[1].SKU === 'PROD-02', 'Second product SKU fallback to sku property (PROD-02)');
assert(xdm.productListItems[1].priceTotal === 200.00, 'Second product priceTotal calculates unit price * qty (200.00)');

// Verify Decisioning / Propositions
assert(Array.isArray(xdm._experience.decisioning.propositions), 'Decisioning propositions array present');
assert(xdm._experience.decisioning.propositions[0].scope === 'order_confirmation_target_scope', 'Proposition scope matches custom configured scope');
assert(xdm._experience.decisioning.propositionEventType.display === 1, 'Proposition display counter equals 1');

// Verify direct Alloy Web SDK dispatch
assert(alloyCallCount === 1, 'Alloy sendEvent was invoked once');
assert(lastAlloyCallArgs.command === 'sendEvent', 'Alloy command is "sendEvent"');
assert(lastAlloyCallArgs.payload.xdm.commerce.order.purchaseID === 'ORD-703639', 'Alloy payload contains valid XDM');

// Test deduplication safeguard
window.trackACDLPurchase(mockTransaction);
assert(alloyCallCount === 1, 'Immediate duplicate purchase call was safely blocked by deduplication');

console.log('\n========================================================================');
console.log(`TOTAL ALLOY XDM VERIFICATION: ${passed} Passed, ${failed} Failed`);
console.log('========================================================================\n');

if (failed > 0) {
    process.exit(1);
}
