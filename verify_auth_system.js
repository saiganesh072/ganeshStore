/**
 * ====================================================================
 * GANESHSTORE AUTHENTICATION & SIGNIN.HTML VERIFICATION SUITE
 * ====================================================================
 * Validates:
 * 1. Zero Duplicate HTML Element IDs in signin.html
 * 2. Critical Login & Dashboard Element IDs exist exactly once
 * 3. Two-Wrapper View Isolation (#auth-loggedin-view, #auth-loggedout-view)
 * 4. Visual Redesign Classes & Floating Label Structure
 * 5. Micro-Animations & prefers-reduced-motion Accessibility
 * 6. Authentication JS Engine Integration & Event Handlers
 * ====================================================================
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

let passed = 0;
let total = 0;
const pendingTests = [];

function test(name, fn) {
  total++;
  const pass = () => {
    console.log(`  ✅ [PASS] ${name}`);
    passed++;
  };
  const fail = err => {
    console.error(`  ❌ [FAIL] ${name}`);
    console.error(`     Error: ${err.message}`);
  };
  try {
    const result = fn();
    if (result && typeof result.then === 'function') {
      pendingTests.push(result.then(pass, fail));
    } else {
      pass();
    }
  } catch (err) {
    fail(err);
  }
}

console.log('========================================================================');
console.log('GANESH STORE: AUTHENTICATION & SIGNIN.HTML VERIFICATION SUITE');
console.log('========================================================================\n');

const filePath = path.join(__dirname, 'signin.html');
assert(fs.existsSync(filePath), 'signin.html must exist');
const html = fs.readFileSync(filePath, 'utf8');

// TEST GROUP 1: ID Uniqueness
console.log('--- TEST GROUP 1: ID Uniqueness & Semantic Structure ---');

test('Zero duplicate IDs in signin.html', () => {
  const idRegex = /\sid=["']([^"']+)["']/g;
  const ids = [];
  let match;
  while ((match = idRegex.exec(html)) !== null) {
    ids.push(match[1]);
  }
  
  const idCounts = {};
  const duplicates = [];
  ids.forEach(id => {
    idCounts[id] = (idCounts[id] || 0) + 1;
    if (idCounts[id] === 2) {
      duplicates.push(id);
    }
  });

  assert.strictEqual(
    duplicates.length,
    0,
    `Found duplicate IDs in signin.html: ${duplicates.join(', ')}`
  );
});

// TEST GROUP 2: Critical Element IDs Presence & Single Occurrence
console.log('\n--- TEST GROUP 2: Critical Auth & Dashboard Element IDs ---');

const criticalIds = [
  'auth-loggedin-view',
  'auth-loggedout-view',
  'contact-login-form',
  'contact-register-form',
  'c-login-email',
  'c-login-password',
  'c-login-remember',
  'c-signup-name',
  'c-signup-email',
  'c-signup-password',
  'c-signup-agree',
  'btn-tab-signin',
  'btn-tab-signup',
  'contact-auth-banner',
  'c-banner-icon',
  'c-banner-text',
  'contact-signin-section',
  'contact-signup-section',
  'acc-tab-orders',
  'acc-tab-profile',
  'acc-tab-wishlist',
  'acc-tab-rewards',
  'acc-tab-security',
  'acc-edit-name',
  'acc-edit-phone',
  'acc-edit-address',
  'twofa-status-pill',
  'twofa-setup-section',
  'twofa-active-section',
  'twofa-qr-image',
  'twofa-secret-text',
  'twofa-verify-input',
  'twofa-login-code-input',
  'twofa-modal-alert',
  'twoFactorModal',
  'orderTrackingModal'
];

criticalIds.forEach(id => {
  test(`Element ID #${id} exists exactly once`, () => {
    const regex = new RegExp(`id=["']${id}["']`, 'g');
    const matches = html.match(regex);
    const count = matches ? matches.length : 0;
    assert.strictEqual(count, 1, `Expected ID #${id} to appear exactly once, found: ${count}`);
  });
});

// TEST GROUP 3: View Isolation & Container Layout
console.log('\n--- TEST GROUP 3: View Isolation & Container Layout ---');

test('#auth-loggedin-view is hidden (display: none) by default', () => {
  assert(
    html.includes('id="auth-loggedin-view"') &&
    /id=["']auth-loggedin-view["'][^>]*style=["'][^"']*display:\s*none/i.test(html),
    '#auth-loggedin-view must have inline style="display: none;" by default'
  );
});

test('#auth-loggedout-view is visible (display: block) by default', () => {
  assert(
    html.includes('id="auth-loggedout-view"') &&
    /id=["']auth-loggedout-view["'][^>]*style=["'][^"']*display:\s*block/i.test(html),
    '#auth-loggedout-view must have inline style="display: block;" by default'
  );
});

test('Profile edit fields reside exclusively inside #auth-loggedin-view', () => {
  const loggedInBlock = html.split('id="auth-loggedin-view"')[1].split('id="auth-loggedout-view"')[0];
  assert(loggedInBlock.includes('id="acc-edit-name"'), 'acc-edit-name must be inside #auth-loggedin-view');
  assert(loggedInBlock.includes('id="acc-edit-phone"'), 'acc-edit-phone must be inside #auth-loggedin-view');
  assert(loggedInBlock.includes('id="acc-edit-address"'), 'acc-edit-address must be inside #auth-loggedin-view');
});

test('Profile edit fields are NOT leaked into #auth-loggedout-view', () => {
  const loggedOutBlock = html.split('id="auth-loggedout-view"')[1];
  assert(!loggedOutBlock.includes('id="acc-edit-name"'), 'acc-edit-name must NOT be inside #auth-loggedout-view');
  assert(!loggedOutBlock.includes('id="acc-edit-phone"'), 'acc-edit-phone must NOT be inside #auth-loggedout-view');
});

test('Login form resides exclusively inside #auth-loggedout-view', () => {
  const loggedOutBlock = html.split('id="auth-loggedout-view"')[1];
  assert(loggedOutBlock.includes('id="contact-login-form"'), 'contact-login-form must be in logged-out view');
  assert(loggedOutBlock.includes('id="c-login-email"'), 'c-login-email must be in logged-out view');
});

test('Login form is NOT duplicated into #auth-loggedin-view', () => {
  const loggedInBlock = html.split('id="auth-loggedin-view"')[1].split('id="auth-loggedout-view"')[0];
  assert(!loggedInBlock.includes('id="contact-login-form"'), 'contact-login-form must NOT be in logged-in view');
});

test('Google button resides inside #auth-loggedout-view', () => {
  const loggedOutBlock = html.split('id="auth-loggedout-view"')[1];
  assert(loggedOutBlock.includes('class="btn-google-login"'), 'Google login button must be in logged-out view');
});

// TEST GROUP 4: Visual Treatment & Micro-Animations
console.log('\n--- TEST GROUP 4: Visual Treatment & Micro-Animations ---');

test('Card container has .auth-card class', () => {
  assert(html.includes('class="auth-card"'), 'Main card container must use .auth-card class');
});

test('Background container has .auth-page-bg class', () => {
  assert(html.includes('class="auth-page-bg"') || html.includes('auth-page-bg'), 'Background section must use .auth-page-bg');
});

test('Floating label input groups (.auth-float-group) are implemented', () => {
  assert(html.includes('class="auth-float-group"'), 'Inputs must use .auth-float-group container');
});

test('Floating label text (.auth-float-label) is implemented', () => {
  assert(html.includes('class="auth-float-label"'), 'Labels must use .auth-float-label class');
});

const accountCss = fs.readFileSync(path.join(__dirname, 'css', 'account.css'), 'utf8');

test('Account stylesheet is linked from signin.html', () => {
  assert(/href=["']css\/account\.css(\?[^"']*)?["']/.test(html), 'signin.html must link css/account.css');
});

test('Account entrance animation (gsAcctUp) is declared', () => {
  assert(accountCss.includes('@keyframes gsAcctUp'), 'Must declare gsAcctUp keyframe animation');
});

test('Error feedback micro-animation (bannerShake) is declared', () => {
  assert(accountCss.includes('@keyframes bannerShake'), 'Must declare bannerShake keyframe animation');
});

test('Accessibility support for prefers-reduced-motion is declared', () => {
  assert(accountCss.includes('prefers-reduced-motion: reduce'), 'Must support prefers-reduced-motion');
});

test('Account tabs use the sliding segmented control instead of a scrolling tab strip', () => {
  assert(/class=["']account-nav-tabs gs-seg["']/.test(html), 'Account tabs must use .gs-seg');
  assert(!/\.account-nav-tabs\s*\{[^}]*overflow-x:\s*auto/.test(accountCss), 'Account tabs must not scroll horizontally');
});

// TEST GROUP 5: Authentication JS Engine Functions
console.log('\n--- TEST GROUP 5: Authentication JS Engine Functions ---');

test('syncAuthView() helper function is defined', () => {
  assert(html.includes('function syncAuthView()'), 'syncAuthView helper must be defined');
});

test('toggleContactPassword() helper function is defined', () => {
  assert(html.includes('function toggleContactPassword('), 'toggleContactPassword helper must be defined');
});

test('showContactMessage() helper function is defined', () => {
  assert(html.includes('function showContactMessage('), 'showContactMessage helper must be defined');
});

test('switchContactTab() helper function is defined', () => {
  assert(html.includes('function switchContactTab('), 'switchContactTab helper must be defined');
});

test('switchAccountTab() helper function is defined', () => {
  assert(html.includes('function switchAccountTab('), 'switchAccountTab helper must be defined');
});

// TEST GROUP 6: Customer ID Account Registry
console.log('\n--- TEST GROUP 6: Customer ID Account Registry ---');

function loadBackendWithUsers(users) {
  const vm = require('vm');
  const store = new Map();
  if (users) store.set('ganeshStore_registered_users', JSON.stringify(users));
  const localStorage = {
    getItem: key => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(key, String(value)),
    removeItem: key => store.delete(key)
  };
  const context = {
    console: { log() {}, warn() {}, error() {} },
    crypto: { randomUUID: () => `uuid-${store.size}-${Math.random()}` },
    document: { cookie: '' },
    localStorage,
    $: () => ({ each() {}, trigger() {} })
  };
  context.window = context;
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, 'js', 'backend-service.js'), 'utf8'), context);
  return { auth: context.BackendService.auth, store };
}

test('Seeded accounts receive unique sequential five-digit customer IDs', () => {
  const { store } = loadBackendWithUsers();
  const users = JSON.parse(store.get('ganeshStore_registered_users'));
  assert.deepStrictEqual(users.map(u => u.customerId), ['GS-10001', 'GS-10002', 'GS-10003']);
});

test('Sign-up assigns the next ID and sign-in lookup accepts email or customer ID', () => {
  const { auth } = loadBackendWithUsers();
  const account = auth.createCustomerAccount({ name: 'Ganesh', email: 'Ganesh@Gmail.com', password: 'secret123' });
  assert.strictEqual(account.customerId, 'GS-10004');
  assert.strictEqual(auth.findAccount('ganesh@gmail.com').id, account.id);
  assert.strictEqual(auth.findAccount('gs10004').id, account.id);
  assert.throws(() => auth.createCustomerAccount({ email: 'GANESH@gmail.com', password: 'secret123' }), /already exists/);
});

test('Legacy accounts keep unique IDs and duplicate legacy IDs are reassigned', () => {
  const { store } = loadBackendWithUsers([
    { uid: 'GS-54321', name: 'Legacy One', email: 'one@example.com', password: 'secret123' },
    { uid: 'GS-54321', name: 'Legacy Two', email: 'two@example.com', password: 'secret123' },
    { name: 'Legacy Three', email: 'three@example.com', password: 'secret123' }
  ]);
  const users = JSON.parse(store.get('ganeshStore_registered_users'));
  assert.deepStrictEqual(users.map(u => u.customerId), ['GS-54321', 'GS-10001', 'GS-10002']);
  assert(users.every(u => u.id), 'Every migrated account needs an internal ID for 2FA/profile updates');
});

test('Backend login rejects wrong passwords for known customers', async () => {
  const { auth } = loadBackendWithUsers();
  await assert.rejects(() => auth.login('GS-10001', 'wrong-password'), /Invalid email\/customer ID or password/);
});

Promise.all(pendingTests).then(() => {
  console.log('\n========================================================================');
  console.log(`AUTH SUITE SUMMARY: ${passed}/${total} Passed, ${total - passed} Failed`);
  console.log('========================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
});
