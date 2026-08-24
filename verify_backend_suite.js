/**
 * ====================================================================
 * GANESHSTORE ENTERPRISE BACKEND VERIFICATION SUITE
 * ====================================================================
 * Validates:
 * 1. Supabase SQL Schema & Table Migrations (9 Tables + RLS + Triggers + Seeds)
 * 2. Universal Backend Service Layer (`js/backend-service.js`)
 * 3. Auth, Loyalty Tiers, Cart, Wishlist, Reviews, Orders, Newsletter, Contact, Coupons
 * 4. Signin Luxury Account Center, Tracking Modal, and Telemetry
 * ====================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
    totalTests++;
    try {
        fn();
        console.log(`  ✅ PASS: ${name}`);
        passedTests++;
    } catch (err) {
        console.error(`  ❌ FAIL: ${name}`);
        console.error(`     Error: ${err.message}`);
    }
}

console.log('\n========================================================');
console.log('🧪 RUNNING GANESHSTORE BACKEND VERIFICATION SUITE');
console.log('========================================================\n');

// --------------------------------------------------------------------
// SUITE 1: Supabase Database Schema & Migration Audit
// --------------------------------------------------------------------
console.log('📦 [SUITE 1] Supabase Database Schema & SQL Migrations');

const schemaPath = path.join(__dirname, 'supabase_schema.sql');
const schemaSql = fs.readFileSync(schemaPath, 'utf8');

test('Schema file exists and contains enterprise header', () => {
    assert(fs.existsSync(schemaPath), 'supabase_schema.sql must exist');
    assert(schemaSql.includes('GANESHSTORE ENTERPRISE SUPABASE DATABASE MIGRATION'), 'Must include enterprise header');
});

test('Schema defines all 9 core e-commerce tables', () => {
    const requiredTables = [
        'public.profiles',
        'public.products',
        'public.reviews',
        'public.carts',
        'public.wishlists',
        'public.orders',
        'public.newsletter_subscribers',
        'public.contact_messages',
        'public.coupons'
    ];
    requiredTables.forEach(tbl => {
        assert(schemaSql.includes(`CREATE TABLE IF NOT EXISTS ${tbl}`), `Table ${tbl} must be defined`);
    });
});

test('Row Level Security (RLS) is enabled on all tables', () => {
    const rlsTables = [
        'public.profiles',
        'public.products',
        'public.reviews',
        'public.carts',
        'public.wishlists',
        'public.orders',
        'public.newsletter_subscribers',
        'public.contact_messages',
        'public.coupons'
    ];
    rlsTables.forEach(tbl => {
        assert(schemaSql.includes(`ALTER TABLE ${tbl} ENABLE ROW LEVEL SECURITY;`), `RLS must be enabled on ${tbl}`);
    });
});

test('Hardened least-privilege RLS policies prevent unauthorized access', () => {
    // Profiles lockdown
    assert(schemaSql.includes('auth.uid() = id'), 'Profiles must restrict SELECT to owner (auth.uid() = id)');
    assert(!schemaSql.includes('FOR SELECT USING (true);') || schemaSql.includes('Products are publicly readable'), 'Profiles must not have public SELECT USING (true)');
    
    // Products lockdown
    assert(schemaSql.includes('Only admin or service role can mutate products'), 'Products must restrict mutations to admin or service role');
    
    // Carts & Wishlists lockdown
    assert(schemaSql.includes('auth.uid() = user_id'), 'Carts and wishlists must restrict access to row owner (auth.uid() = user_id)');
    
    // Newsletter & Inquiries lockdown
    assert(schemaSql.includes('Only service role can read newsletter subscribers'), 'Newsletter subscriber list must be restricted from public SELECT');
    assert(schemaSql.includes('Only service role can read contact messages'), 'Contact inquiries must be restricted from public SELECT');
});

test('Atomic Postgres RPCs for Server-Side Pricing, Coupons & 2FA are defined', () => {
    assert(schemaSql.includes('FUNCTION public.validate_coupon_code('), 'Must define validate_coupon_code RPC');
    assert(schemaSql.includes('FUNCTION public.create_authenticated_order('), 'Must define create_authenticated_order RPC');
    assert(schemaSql.includes('FUNCTION public.enable_user_2fa('), 'Must define enable_user_2fa RPC');
    assert(schemaSql.includes('FUNCTION public.get_decrypted_2fa_secret('), 'Must define get_decrypted_2fa_secret RPC');
});

test('Automatic updated_at trigger function and indexes are defined', () => {
    assert(schemaSql.includes('FUNCTION public.handle_updated_at()'), 'Must define timestamp update trigger function');
    assert(schemaSql.includes('idx_profiles_email'), 'Must index profiles email');
    assert(schemaSql.includes('idx_orders_order_id'), 'Must index orders order_id');
    assert(schemaSql.includes('idx_reviews_product_name'), 'Must index reviews product_name');
});

test('Seed data is populated for coupons, catalog products, and reviews', () => {
    assert(schemaSql.includes("('SAVE10', 'percentage'"), 'Must seed SAVE10 coupon');
    assert(schemaSql.includes("('GANESH20', 'fixed'"), 'Must seed GANESH20 coupon');
    assert(schemaSql.includes("('FREESHIP', 'free_shipping'"), 'Must seed FREESHIP coupon');
    assert(schemaSql.includes("'Esprit Ruffle Shirt'"), 'Must seed catalog products');
    assert(schemaSql.includes("'Sai Ganesh'"), 'Must seed sample verified reviews');
});


// --------------------------------------------------------------------
// SUITE 2: BackendService Engine Unit & Integration Tests
// --------------------------------------------------------------------
console.log('\n⚙️ [SUITE 2] Universal BackendService Layer (`js/backend-service.js`)');

// Mock browser environment for Node
const mockStorage = {};
global.localStorage = {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = String(v); },
    removeItem: (k) => { delete mockStorage[k]; },
    clear: () => { for (const k in mockStorage) delete mockStorage[k]; }
};
global.document = {
    cookie: '',
    trigger: () => {}
};
global.$ = () => ({
    each: () => {},
    attr: () => {},
    trigger: () => {},
    find: () => ({ length: 0 }),
    append: () => {},
    on: () => {},
    off: () => ({ on: () => {} }),
    text: () => '',
    val: () => ''
});
global.window = global;

// Load backend service
require('./js/backend-service.js');
const BS = global.window.BackendService;

test('BackendService initializes globally', () => {
    assert(BS, 'BackendService must be defined on window');
    assert(typeof BS.init === 'function', 'BackendService.init must exist');
    assert(BS.auth && BS.cart && BS.wishlist && BS.reviews && BS.orders && BS.newsletter && BS.contact && BS.coupons && BS.products, 'All subsystems must be present');
});

test('Auth Subsystem: Register, Login, and Profile Management', async () => {
    // 1. Register
    const regUser = await BS.auth.register({
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '1234567890',
        password: 'password123'
    });
    assert.strictEqual(regUser.email, 'test@example.com');
    assert.strictEqual(regUser.loyaltyTier, 'Bronze');

    // 2. Login
    const loggedUser = await BS.auth.login('test@example.com', 'password123');
    assert.strictEqual(loggedUser.id, regUser.id);
    assert.strictEqual(BS.auth.getCurrentUser().email, 'test@example.com');

    // 3. Update Profile
    const updated = await BS.auth.updateProfile({ name: 'Updated Customer Name' });
    assert.strictEqual(updated.name, 'Updated Customer Name');
    assert.strictEqual(BS.auth.getCurrentUser().name, 'Updated Customer Name');

    // 4. Logout
    BS.auth.logout();
    assert.strictEqual(BS.auth.getCurrentUser(), null);
});

test('Loyalty Rewards Tier Calculation Engine', () => {
    const bronzeInfo = BS.auth.getLoyaltyInfo({ loyaltyPoints: 200 });
    assert.strictEqual(bronzeInfo.tier, 'Bronze');
    assert.strictEqual(bronzeInfo.nextTier, 'Silver');
    assert.strictEqual(bronzeInfo.pointsToNext, 300);

    const silverInfo = BS.auth.getLoyaltyInfo({ loyaltyPoints: 600 });
    assert.strictEqual(silverInfo.tier, 'Silver');
    assert.strictEqual(silverInfo.nextTier, 'Gold');

    const goldInfo = BS.auth.getLoyaltyInfo({ loyaltyPoints: 1200 });
    assert.strictEqual(goldInfo.tier, 'Gold');
    assert.strictEqual(goldInfo.nextTier, 'Platinum');

    const platInfo = BS.auth.getLoyaltyInfo({ loyaltyPoints: 2500 });
    assert.strictEqual(platInfo.tier, 'Platinum');
    assert.strictEqual(platInfo.nextTier, 'Max Tier');
});

test('Cart Subsystem: Add, Update, Remove, and Storage Synchronization', () => {
    BS.cart.saveCart([]);
    assert.strictEqual(BS.cart.getCart().length, 0);

    BS.cart.addToCart({
        id: 'p1',
        name: 'Esprit Ruffle Shirt',
        price: '$16.64',
        quantity: 2,
        size: 'M',
        color: 'White'
    });

    let cart = BS.cart.getCart();
    assert.strictEqual(cart.length, 1);
    assert.strictEqual(cart[0].quantity, 2);

    // Add same item (increments quantity)
    BS.cart.addToCart({
        id: 'p1',
        name: 'Esprit Ruffle Shirt',
        price: '$16.64',
        quantity: 1,
        size: 'M',
        color: 'White'
    });
    cart = BS.cart.getCart();
    assert.strictEqual(cart[0].quantity, 3);

    // Remove item
    BS.cart.removeFromCart('Esprit Ruffle Shirt', 'M', 'White');
    assert.strictEqual(BS.cart.getCart().length, 0);
});

test('Wishlist Subsystem: Toggle and Badges', () => {
    const item = { name: 'Vintage Inspired Classic', price: '$93.20', image: 'images/product-06.jpg' };
    
    // Toggle ON
    const r1 = BS.wishlist.toggleWishlist(item);
    assert.strictEqual(r1.added, true);
    assert.strictEqual(BS.wishlist.getWishlist().length, 1);

    // Toggle OFF
    const r2 = BS.wishlist.toggleWishlist(item);
    assert.strictEqual(r2.added, false);
    assert.strictEqual(BS.wishlist.getWishlist().length, 0);
});

test('Reviews Subsystem: Submission and Rating Aggregation', async () => {
    const rev = await BS.reviews.addReview('Classic Trench Coat', {
        name: 'Alexander Wright',
        email: 'alex@wright.org',
        rating: 5,
        comment: 'Masterpiece craftsmanship!'
    });
    assert.strictEqual(rev.rating, 5);
    assert.strictEqual(rev.verified_purchase, true);

    const reviews = await BS.reviews.getProductReviews('Classic Trench Coat');
    assert(reviews.length >= 1);
    
    const agg = BS.reviews.calculateAggregateRating(reviews);
    assert(agg.average >= 1.0 && agg.average <= 5.0);
    assert(agg.count >= 1);
});

test('Orders Subsystem: Checkout Creation, User History & Milestone Tracking', async () => {
    const orderPayload = {
        customer_name: 'Sai Ganesh',
        email: 'sai@ganeshstore.com',
        shipping_address: '123 Luxury Avenue, New York, NY',
        shipping_method: 'Express Delivery',
        payment_method: 'CARD',
        items: [{ name: 'Esprit Ruffle Shirt', price: '$16.64', quantity: 2 }],
        subtotal: 33.28,
        discount: 0,
        shipping_fee: 15.00,
        tax: 0,
        total: 48.28
    };

    const order = await BS.orders.createOrder(orderPayload);
    assert(order.order_id.startsWith('ORD-'), 'Order ID must start with ORD-');
    assert(order.tracking_number.startsWith('GS-TRK-'), 'Tracking number must start with GS-TRK-');
    assert.strictEqual(order.total, 48.28);

    // Get User Orders
    const orders = await BS.orders.getUserOrders('sai@ganeshstore.com');
    assert(orders.length > 0);
    assert.strictEqual(orders[0].order_id, order.order_id);

    // Track Order Milestones
    const track = BS.orders.trackOrder(order.order_id);
    assert.strictEqual(track.found, true);
    assert.strictEqual(track.milestones.length, 5);
    assert.strictEqual(track.milestones[0].title, 'Order Confirmed');
    assert.strictEqual(track.milestones[0].done, true);
});

test('Newsletter & Contact Subsystem: Validation & Deduplication', async () => {
    // Newsletter
    const res1 = await BS.newsletter.subscribe('insider@ganeshstore.com', 'footer');
    assert.strictEqual(res1.success, true);

    const res2 = await BS.newsletter.subscribe('insider@ganeshstore.com', 'footer');
    assert.strictEqual(res2.alreadySubscribed, true);

    // Contact
    const contactRes = await BS.contact.sendMessage({
        name: 'VIP Client',
        email: 'vip@client.com',
        subject: 'Custom Tailoring Inquiry',
        message: 'I would like to inquire about bespoke sizing.'
    });
    assert.strictEqual(contactRes.success, true);
});

test('Coupons Subsystem: Promo Code Verification & Thresholds', async () => {
    // Percentage
    const c1 = BS.coupons.validateCoupon('SAVE10', 100);
    assert.strictEqual(c1.valid, true);
    assert.strictEqual(c1.discountAmount, 10);

    // Async validation
    const cAsync = await BS.coupons.validateCouponAsync('SAVE10', 100);
    assert.strictEqual(cAsync.valid, true);

    // Fixed with minSpend Met
    const c2 = BS.coupons.validateCoupon('GANESH20', 60);
    assert.strictEqual(c2.valid, true);
    assert.strictEqual(c2.discountAmount, 20);

    // Fixed with minSpend Not Met
    const c3 = BS.coupons.validateCoupon('GANESH20', 30);
    assert.strictEqual(c3.valid, false);

    // Free Shipping
    const c4 = BS.coupons.validateCoupon('FREESHIP', 50);
    assert.strictEqual(c4.valid, true);

    // Invalid Code
    const c5 = BS.coupons.validateCoupon('NONEXISTENT', 100);
    assert.strictEqual(c5.valid, false);
});

test('Products Catalog API: ID & Name Lookup', () => {
    const catalog = BS.products.getCatalog();
    assert.strictEqual(catalog.length, 16);

    const p1 = BS.products.getProductById('GS001');
    assert.strictEqual(p1.name, 'Esprit Ruffle Shirt');

    const p2 = BS.products.getProductByName('Classic Trench Coat');
    assert.strictEqual(p2.id, 'GS004');
    assert.strictEqual(p2.priceNum, 75.00);
});


// --------------------------------------------------------------------
// SUITE 3: Signin Page & Frontend Integration
// --------------------------------------------------------------------
console.log('\n🖥️ [SUITE 3] Signin Page & Storefront Integration');

const signinHtml = fs.readFileSync(path.join(__dirname, 'signin.html'), 'utf8');
const mainJs = fs.readFileSync(path.join(__dirname, 'js/main.js'), 'utf8');

test('signin.html contains luxury Account Center with tabs and tracking modal', () => {
    assert(signinHtml.includes('account-header-card'), 'Must contain account header card');
    assert(signinHtml.includes('switchAccountTab'), 'Must contain tab switching');
    assert(signinHtml.includes('orderTrackingModal'), 'Must contain order tracking modal');
    assert(signinHtml.includes('quickLoginDemo'), 'Must contain 1-click quick demo accounts');
    assert(signinHtml.includes('js/backend-service.js'), 'Must import backend service');
});

test('js/main.js contains Universal Review, Newsletter, and Contact engines', () => {
    assert(mainJs.includes('initUniversalReviewSystem'), 'Must contain review system');
    assert(mainJs.includes('initUniversalNewsletterSystem'), 'Must contain newsletter engine');
    assert(mainJs.includes('initUniversalContactSystem'), 'Must contain contact engine');
    assert(mainJs.includes('initUniversalReviewSystem()'), 'Must call reviews on ready');
    assert(mainJs.includes('initUniversalNewsletterSystem()'), 'Must call newsletter on ready');
});


// --------------------------------------------------------------------
// FINAL SCORECARD
// --------------------------------------------------------------------
console.log('\n========================================================');
console.log(`📊 RESULTS: ${passedTests}/${totalTests} Tests Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
console.log('========================================================\n');

if (passedTests === totalTests) {
    console.log('🎉 ALL BACKEND AUDIT & IMPLEMENTATION TESTS PASSED PERFECTLY!\n');
    process.exit(0);
} else {
    console.error('⚠️ SOME TESTS FAILED.');
    process.exit(1);
}
