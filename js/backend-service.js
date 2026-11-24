/**
 * ====================================================================
 * GANESHSTORE ENTERPRISE UNIVERSAL BACKEND SERVICE LAYER
 * ====================================================================
 * Version: 2.0.0
 * Features:
 * 1. Hybrid Offline-First Architecture (Supabase Cloud + Local Cache)
 * 2. Complete Auth & Loyalty Rewards Tier Engine
 * 3. Bidirectional Cart & Wishlist Cloud Synchronization
 * 4. Product Reviews & Rating Aggregation Subsystem
 * 5. Orders Checkout, History, and Live Delivery Tracking
 * 6. Newsletter Subscription & Contact Inquiries Engine
 * 7. Promo Code & Dynamic Coupon Validator
 * ====================================================================
 */

(function (window) {
    'use strict';

    // Supabase Cloud Configuration
    var SUPABASE_CONFIG = {
        url: window.SUPABASE_URL || "https://urglyumucxvnszyyrdiv.supabase.co",
        anonKey: window.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZ2x5dW11Y3h2bnN6eXlyZGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MjIxMTksImV4cCI6MjA5NTA5ODExOX0.Fuw5FNHXw_rGoxfeVW8sjCT_DO0lDsOKPJ-wQ2-JV70"
    };

    // Master Catalog Data
    var MASTER_CATALOG = [
        { id: 'GS001', name: 'Esprit Ruffle Shirt', price: '$16.64', priceNum: 16.64, category: 'Women', tag: '.women', img: 'images/product-01.jpg', url: 'p-Esprit-Ruffle-Shirt.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS002', name: 'Herschel supply', price: '$35.31', priceNum: 35.31, category: 'Women', tag: '.women', img: 'images/product-02.jpg', url: 'p-Herschel-supply.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS003', name: 'Only Check Trouser', price: '$25.50', priceNum: 25.50, category: 'Men', tag: '.men', img: 'images/product-03.jpg', url: 'p-Only-Check-Trouser.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS004', name: 'Classic Trench Coat', price: '$75.00', priceNum: 75.00, compareAt: 93.75, category: 'Women', tag: '.women', img: 'images/product-04.jpg', url: 'p-Classic-Trench-Coat.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS005', name: 'Front Pocket Jumper', price: '$34.75', priceNum: 34.75, category: 'Women', tag: '.women', img: 'images/product-05.jpg', url: 'p-Front-Pocket-Jumper.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS006', name: 'Vintage Inspired Classic', price: '$93.20', priceNum: 93.20, compareAt: 116.50, category: 'Watches', tag: '.watches', img: 'images/product-06.jpg', url: 'p-Vintage-Inspired-Classic.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS007', name: 'Shirt in Stretch Cotton', price: '$52.66', priceNum: 52.66, category: 'Women', tag: '.women', img: 'images/product-07.jpg', url: 'p-Shirt-in-Stretch-Cotton.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS008', name: 'Pieces Metallic Printed', price: '$18.96', priceNum: 18.96, category: 'Women', tag: '.women', img: 'images/product-08.jpg', url: 'p-Pieces-Metallic-Printed.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS009', name: 'Converse All Star Hi Plimsolls', price: '$75.00', priceNum: 75.00, category: 'Shoes', tag: '.shoes', img: 'images/product-09.jpg', url: 'p-Converse-All-Star-Hi-Plimsolls.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS010', name: 'Femme T-Shirt In Stripe', price: '$25.85', priceNum: 25.85, category: 'Women', tag: '.women', img: 'images/product-10.jpg', url: 'p-Femme-T-Shirt-In-Stripe.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS011', name: 'Herschel supply men', price: '$63.16', priceNum: 63.16, compareAt: 78.95, category: 'Men', tag: '.men', img: 'images/product-11.jpg', url: 'p-Herschel-supply-men.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS012', name: 'Herschel supply watch', price: '$63.15', priceNum: 63.15, category: 'Watches', tag: '.watches', img: 'images/product-12.jpg', url: 'p-Herschel-supply-watch.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS013', name: 'T-Shirt with Sleeve', price: '$18.49', priceNum: 18.49, category: 'Women', tag: '.women', img: 'images/product-13.jpg', url: 'p-T-Shirt-with-Sleeve.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS014', name: 'Pretty Little Thing', price: '$54.79', priceNum: 54.79, compareAt: 68.49, category: 'Women', tag: '.women', img: 'images/product-14.jpg', url: 'p-Pretty-Little-Thing.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS015', name: 'Mini Silver Mesh Watch', price: '$86.85', priceNum: 86.85, category: 'Watches', tag: '.watches', img: 'images/product-15.jpg', url: 'p-Mini-Silver-Mesh-Watch.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS016', name: 'Square Neck Back', price: '$29.64', priceNum: 29.64, category: 'Women', tag: '.women', img: 'images/product-16.jpg', url: 'p-Square-Neck-Back.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS017', name: 'Roll-Top Canvas Backpack', price: '$68.00', priceNum: 68.00, isNew: true, category: 'Bags', tag: '.bag', img: 'images/product-68.jpg', url: 'p-Roll-Top-Canvas-Backpack.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS018', name: 'Olive City Backpack', price: '$54.50', priceNum: 54.50, isNew: true, category: 'Bags', tag: '.bag', img: 'images/product-69.jpg', url: 'p-Olive-City-Backpack.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS019', name: 'Leather Platform Ankle Boots', price: '$89.00', priceNum: 89.00, isNew: true, category: 'Shoes', tag: '.shoes', img: 'images/product-70.jpg', url: 'p-Leather-Platform-Ankle-Boots.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS020', name: 'Windowpane Wool Blazer', price: '$98.00', priceNum: 98.00, isNew: true, category: 'Men', tag: '.men', img: 'images/product-71.jpg', url: 'p-Windowpane-Wool-Blazer.html', rating: 4.9, reviewsCount: 28 },
        { id: 'GS021', name: 'Sherpa-Lined Denim Jacket', price: '$84.00', priceNum: 84.00, isNew: true, category: 'Men', tag: '.men', img: 'images/product-72.jpg', url: 'p-Sherpa-Lined-Denim-Jacket.html', rating: 4.9, reviewsCount: 28 }
    ];

    // Coupons Catalog
    var ACTIVE_COUPONS = {
        'SAVE10': { type: 'percentage', value: 10, minSpend: 0, desc: '10% Off Entire Order' },
        'GANESH20': { type: 'fixed', value: 20, minSpend: 50, desc: '$20 Off on orders over $50' },
        'WELCOME10': { type: 'percentage', value: 10, minSpend: 0, desc: '10% Welcome Discount' },
        'FREESHIP': { type: 'free_shipping', value: 0, minSpend: 0, desc: 'Free Standard Shipping' },
        'GEMINI20': { type: 'percentage', value: 20, minSpend: 0, desc: '20% Off Exclusive AI VIP Discount' }
    };

    // Safe LocalStorage Helper
    var Storage = {
        get: function (key, fallback) {
            try {
                var item = localStorage.getItem(key);
                return item ? JSON.parse(item) : fallback;
            } catch (e) {
                return fallback;
            }
        },
        set: function (key, val) {
            try {
                localStorage.setItem(key, JSON.stringify(val));
            } catch (e) {
                console.warn('Storage.set failed for ' + key, e);
            }
        },
        remove: function (key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {}
        }
    };

    // =================================================================
    // CUSTOMER ACCOUNT REGISTRY (EMAIL + UNIQUE CUSTOMER ID)
    // =================================================================
    var USERS_KEY = 'ganeshStore_registered_users';
    var CUSTOMER_ID_SEQ_KEY = 'ganeshStore_customer_id_seq';
    var CUSTOMER_ID_MIN = 10001;
    var CUSTOMER_ID_MAX = 99999;
    var EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    var CustomerAccounts = {
        normalizeEmail: function (email) {
            return String(email || '').trim().toLowerCase();
        },

        isEmail: function (value) {
            return EMAIL_PATTERN.test(this.normalizeEmail(value));
        },

        normalizeCustomerId: function (value) {
            var match = String(value || '').trim().toUpperCase().replace(/\s+/g, '').match(/^GS-?(\d{5})$/);
            return match ? 'GS-' + match[1] : '';
        },

        _customerNumber: function (customerId) {
            var normalized = this.normalizeCustomerId(customerId);
            return normalized ? parseInt(normalized.slice(3), 10) : 0;
        },

        _newInternalId: function () {
            return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'usr_' + Date.now() + '_' + Math.floor(Math.random() * 100000);
        },

        _allocateCustomerId: function (usedNumbers) {
            var lastAllocated = parseInt(Storage.get(CUSTOMER_ID_SEQ_KEY, CUSTOMER_ID_MIN - 1), 10) || (CUSTOMER_ID_MIN - 1);
            var next = Math.max(CUSTOMER_ID_MIN, lastAllocated + 1);
            while (usedNumbers[next] && next <= CUSTOMER_ID_MAX) next++;
            if (next > CUSTOMER_ID_MAX) throw new Error('Customer ID capacity reached. Please contact support.');
            usedNumbers[next] = true;
            Storage.set(CUSTOMER_ID_SEQ_KEY, next);
            return 'GS-' + next;
        },

        ensureUsers: function () {
            var self = this;
            var users = Storage.get(USERS_KEY, []);
            if (!Array.isArray(users)) users = [];
            var usedNumbers = {};
            var changed = false;

            users = users.filter(function (user) { return user && typeof user === 'object'; });
            users.forEach(function (user) {
                var email = self.normalizeEmail(user.email);
                if (email && user.email !== email) {
                    user.email = email;
                    changed = true;
                }
                if (!user.id) {
                    user.id = user.uid || self._newInternalId();
                    changed = true;
                }

                var customerId = self.normalizeCustomerId(user.customerId || user.customer_id || user.uid);
                var customerNumber = self._customerNumber(customerId);
                if (customerNumber && !usedNumbers[customerNumber]) {
                    usedNumbers[customerNumber] = true;
                    if (user.customerId !== customerId) {
                        user.customerId = customerId;
                        changed = true;
                    }
                } else if (user.customerId) {
                    delete user.customerId;
                    changed = true;
                }
            });

            users.forEach(function (user) {
                if (!user.customerId) {
                    user.customerId = self._allocateCustomerId(usedNumbers);
                    changed = true;
                }
            });

            if (changed || !Array.isArray(Storage.get(USERS_KEY, null))) {
                Storage.set(USERS_KEY, users);
            }
            return users;
        },

        saveUsers: function (users) {
            Storage.set(USERS_KEY, users);
        },

        findByIdentifier: function (identifier, users) {
            var list = users || this.ensureUsers();
            var customerId = this.normalizeCustomerId(identifier);
            if (customerId) {
                return list.find(function (user) { return user.customerId === customerId; }) || null;
            }
            var email = this.normalizeEmail(identifier);
            if (!this.isEmail(email)) return null;
            return list.find(function (user) { return user.email === email; }) || null;
        },

        create: function (accountData) {
            var users = this.ensureUsers();
            var email = this.normalizeEmail(accountData.email);
            if (!this.isEmail(email)) throw new Error('Enter a valid email address.');
            if (users.some(function (user) { return user.email === email; })) {
                throw new Error('An account with this email already exists. Please sign in instead.');
            }

            var phone = String(accountData.phone || '').trim();
            if (phone && users.some(function (user) { return user.phone === phone || user.phone_number === phone; })) {
                throw new Error('An account with this phone number already exists.');
            }

            var usedNumbers = {};
            var self = this;
            users.forEach(function (user) {
                var number = self._customerNumber(user.customerId);
                if (number) usedNumbers[number] = true;
            });

            var name = String(accountData.name || email.split('@')[0]).trim();
            var account = {
                id: accountData.id || this._newInternalId(),
                customerId: this._allocateCustomerId(usedNumbers),
                name: name,
                full_name: name,
                email: email,
                phone: phone,
                phone_number: phone,
                password: accountData.password || null,
                authProvider: accountData.authProvider || 'password',
                loyaltyTier: accountData.loyaltyTier || 'Bronze',
                loyaltyPoints: accountData.loyaltyPoints || 100,
                two_factor_enabled: false,
                two_factor_secret: null,
                created_at: new Date().toISOString()
            };

            users.push(account);
            this.saveUsers(users);
            return account;
        },

        getOrCreate: function (accountData) {
            var existing = this.findByIdentifier(accountData.email);
            if (existing) return existing;
            return this.create(accountData);
        },

        attachToProfile: function (profile) {
            if (!profile || typeof profile !== 'object') return profile;
            var account = this.findByIdentifier(profile.customerId || profile.email);
            if (!account && profile.id) {
                account = this.ensureUsers().find(function (user) { return user.id === profile.id; }) || null;
            }
            return account ? Object.assign({}, profile, { customerId: account.customerId, customer_id: account.customerId }) : profile;
        }
    };

    function setCustomerSessionCookies(user) {
        var name = user.name || user.full_name || user.displayName || (user.email ? user.email.split('@')[0] : 'Customer');
        document.cookie = "CustomerName=" + encodeURIComponent(name) + "; path=/;";
        document.cookie = "CustomerNumber=" + encodeURIComponent(user.customerId || '') + "; path=/;";
    }

    // =================================================================
    // RFC 6238 TOTP / GOOGLE AUTHENTICATOR HELPER ENGINE
    // =================================================================
    var TOTP = {
        base32chars: "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
        
        generateSecret: function (length) {
            length = length || 16;
            var secret = "";
            for (var i = 0; i < length; i++) {
                var rand = Math.floor(Math.random() * 32);
                secret += this.base32chars.charAt(rand);
            }
            return secret;
        },

        base32tohex: function (base32) {
            var base32chars = this.base32chars;
            var bits = "";
            var hex = "";
            base32 = (base32 || '').replace(/=+$/, '').toUpperCase();
            for (var i = 0; i < base32.length; i++) {
                var val = base32chars.indexOf(base32.charAt(i));
                if (val === -1) continue;
                bits += ('00000' + val.toString(2)).slice(-5);
            }
            for (var j = 0; j + 4 <= bits.length; j += 4) {
                var chunk = bits.substr(j, 4);
                hex += parseInt(chunk, 2).toString(16);
            }
            return hex;
        },

        // HMAC-SHA1 in pure JavaScript
        sha1: function (msgBytes) {
            function rotl(n, s) { return (n << s) | (n >>> (32 - s)); }
            var K = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6];
            var H = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
            
            var len = msgBytes.length;
            var words = [];
            for (var i = 0; i < len; i++) {
                words[i >>> 2] |= (msgBytes[i] & 0xff) << (24 - (i % 4) * 8);
            }
            words[len >>> 2] |= 0x80 << (24 - (len % 4) * 8);
            words[(((len + 8) >>> 6) << 4) + 15] = len * 8;

            for (var chunk = 0; chunk < words.length; chunk += 16) {
                var W = new Array(80);
                for (var t = 0; t < 16; t++) W[t] = words[chunk + t] || 0;
                for (var t = 16; t < 80; t++) W[t] = rotl(W[t - 3] ^ W[t - 8] ^ W[t - 14] ^ W[t - 16], 1);

                var a = H[0], b = H[1], c = H[2], d = H[3], e = H[4];
                for (var t = 0; t < 80; t++) {
                    var s = Math.floor(t / 20);
                    var f = s === 0 ? (b & c) | (~b & d) :
                            s === 1 ? (b ^ c ^ d) :
                            s === 2 ? (b & c) | (b & d) | (c & d) : (b ^ c ^ d);
                    var temp = (rotl(a, 5) + f + e + K[s] + W[t]) >>> 0;
                    e = d; d = c; c = rotl(b, 30) >>> 0; b = a; a = temp;
                }
                H[0] = (H[0] + a) >>> 0;
                H[1] = (H[1] + b) >>> 0;
                H[2] = (H[2] + c) >>> 0;
                H[3] = (H[3] + d) >>> 0;
                H[4] = (H[4] + e) >>> 0;
            }

            var resBytes = [];
            for (var h = 0; h < 5; h++) {
                for (var bIdx = 3; bIdx >= 0; bIdx--) {
                    resBytes.push((H[h] >>> (bIdx * 8)) & 0xff);
                }
            }
            return resBytes;
        },

        hmacSha1: function (keyBytes, msgBytes) {
            var blockSize = 64;
            if (keyBytes.length > blockSize) {
                keyBytes = this.sha1(keyBytes);
            }
            while (keyBytes.length < blockSize) {
                keyBytes.push(0);
            }
            var oKeyPad = [], iKeyPad = [];
            for (var i = 0; i < blockSize; i++) {
                oKeyPad[i] = keyBytes[i] ^ 0x5c;
                iKeyPad[i] = keyBytes[i] ^ 0x36;
            }
            var inner = this.sha1(iKeyPad.concat(msgBytes));
            return this.sha1(oKeyPad.concat(inner));
        },

        hexToBytes: function (hex) {
            var bytes = [];
            for (var c = 0; c < hex.length; c += 2) {
                bytes.push(parseInt(hex.substr(c, 2), 16));
            }
            return bytes;
        },

        generateToken: function (secret, timeOffset) {
            timeOffset = timeOffset || 0;
            var epoch = Math.floor(Date.now() / 1000) + timeOffset;
            var timeStep = Math.floor(epoch / 30);

            var timeHex = ('0000000000000000' + timeStep.toString(16)).slice(-16);
            var timeBytes = this.hexToBytes(timeHex);
            var keyHex = this.base32tohex(secret);
            var keyBytes = this.hexToBytes(keyHex);

            var hmac = this.hmacSha1(keyBytes, timeBytes);
            var offset = hmac[hmac.length - 1] & 0x0f;
            var binary = ((hmac[offset] & 0x7f) << 24) |
                         ((hmac[offset + 1] & 0xff) << 16) |
                         ((hmac[offset + 2] & 0xff) << 8) |
                         (hmac[offset + 3] & 0xff);

            var otp = (binary % 1000000).toString();
            while (otp.length < 6) otp = '0' + otp;
            return otp;
        },

        verifyToken: function (secret, token) {
            if (!secret || !token) return false;
            var cleanToken = String(token).trim().replace(/\s/g, '');
            for (var drift = -30; drift <= 30; drift += 30) {
                var expected = this.generateToken(secret, drift);
                if (expected === cleanToken) return true;
            }
            return false;
        }
    };

    // Universal Backend Service Object
    var BackendService = {
        _isCloudAvailable: false,
        _client: null,

        // Initialize Supabase Client
        init: function () {
            var self = this;
            if (window.supabaseClient) {
                self._client = window.supabaseClient;
                self._isCloudAvailable = true;
                console.log('⚡ BackendService connected to Supabase Client instance.');
            } else if (typeof window.supabase !== 'undefined' && SUPABASE_CONFIG.url && SUPABASE_CONFIG.anonKey) {
                try {
                    self._client = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
                    window.supabaseClient = self._client;
                    self._isCloudAvailable = true;
                    console.log('⚡ BackendService created Supabase Client successfully.');
                } catch (e) {
                    console.warn('⚠️ Supabase client creation failed, using high-performance local database engine.', e);
                    self._isCloudAvailable = false;
                }
            } else {
                console.log('ℹ️ Running BackendService in Offline-First Local Engine mode.');
                self._isCloudAvailable = false;
            }

            // Seed initial mock accounts if none exist
            self._seedInitialData();
        },

        _seedInitialData: function () {
            var users = Storage.get('ganeshStore_registered_users', []);
            if (users.length === 0) {
                users = [
                    { id: 'u_sai_01', name: 'Sai Ganesh', email: 'sai@ganeshstore.com', phone: '9876543210', password: 'password123', loyaltyTier: 'Platinum', loyaltyPoints: 2450, two_factor_enabled: false },
                    { id: 'u_olivia_02', name: 'Olivia Vance', email: 'olivia@vance.net', phone: '9123456780', password: 'password123', loyaltyTier: 'Gold', loyaltyPoints: 1200, two_factor_enabled: false },
                    { id: 'u_demo_03', name: 'Demo Customer', email: 'demo@ganeshstore.com', phone: '9998887770', password: 'password123', loyaltyTier: 'Silver', loyaltyPoints: 450, two_factor_enabled: false }
                ];
                Storage.set('ganeshStore_registered_users', users);
            }
            CustomerAccounts.ensureUsers();

            var currentProfile = Storage.get('userProfile', null);
            var profileWithCustomerId = CustomerAccounts.attachToProfile(currentProfile);
            if (profileWithCustomerId && profileWithCustomerId !== currentProfile) {
                Storage.set('userProfile', profileWithCustomerId);
            }

            var mockUser = Storage.get('ganeshStore_user_mock', null);
            var mockAccount = mockUser ? CustomerAccounts.findByIdentifier(mockUser.customerId || mockUser.email) : null;
            if (mockAccount && mockUser.customerId !== mockAccount.customerId) {
                mockUser.customerId = mockAccount.customerId;
                Storage.set('ganeshStore_user_mock', mockUser);
            }
        },

        // =================================================================
        // AUTHENTICATION & PROFILES SUBSYSTEM (WITH GOOGLE AUTHENTICATOR 2FA)
        // =================================================================
        auth: {
            normalizeCustomerId: function (value) {
                return CustomerAccounts.normalizeCustomerId(value);
            },

            isEmail: function (value) {
                return CustomerAccounts.isEmail(value);
            },

            findAccount: function (identifier) {
                return CustomerAccounts.findByIdentifier(identifier);
            },

            createCustomerAccount: function (accountData) {
                return CustomerAccounts.create(accountData);
            },

            getOrCreateCustomerAccount: function (accountData) {
                return CustomerAccounts.getOrCreate(accountData);
            },

            attachCustomerId: function (profile) {
                return CustomerAccounts.attachToProfile(profile);
            },

            // Generate a new 2FA Secret Key and QR Code URL
            generate2FASecret: function (email) {
                var secret = TOTP.generateSecret(16);
                var userEmail = email || (BackendService.auth.getCurrentUser() ? BackendService.auth.getCurrentUser().email : 'sai@ganeshstore.com');
                var otpauthUrl = 'otpauth://totp/GaneshStore:' + encodeURIComponent(userEmail) + '?secret=' + secret + '&issuer=GaneshStore';
                var qrCodeUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=' + encodeURIComponent(otpauthUrl);
                return {
                    secret: secret,
                    otpauthUrl: otpauthUrl,
                    qrCodeUrl: qrCodeUrl
                };
            },

            // Verify a TOTP token directly against a secret
            verify2FAToken: function (secret, token) {
                return TOTP.verifyToken(secret, token);
            },

            // Enable 2FA on the currently logged-in account
            enable2FA: async function (secret, token) {
                var user = this.getCurrentUser();
                if (!user) throw new Error('You must be signed in to configure 2-Factor Authentication.');

                var isValid = TOTP.verifyToken(secret, token);
                if (!isValid) {
                    throw new Error('Invalid 6-digit verification code. Please check your Google Authenticator app and try again.');
                }

                user.two_factor_enabled = true;
                user.two_factor_secret = secret;
                await this.updateProfile({
                    two_factor_enabled: true,
                    two_factor_secret: secret
                });

                return {
                    success: true,
                    message: 'Google Authenticator 2-Factor Authentication is now active! 🛡️'
                };
            },

            // Disable 2FA on the currently logged-in account
            disable2FA: async function (token) {
                var user = this.getCurrentUser();
                if (!user) throw new Error('You must be signed in.');

                if (user.two_factor_secret && token) {
                    var isValid = TOTP.verifyToken(user.two_factor_secret, token);
                    if (!isValid) {
                        throw new Error('Invalid verification code. Cannot disable 2FA.');
                    }
                }

                user.two_factor_enabled = false;
                user.two_factor_secret = null;
                await this.updateProfile({
                    two_factor_enabled: false,
                    two_factor_secret: null
                });

                return {
                    success: true,
                    message: '2-Factor Authentication has been disabled.'
                };
            },

            // Verify 2FA token during login flow
            verifyLogin2FA: async function (userId, token) {
                var users = CustomerAccounts.ensureUsers();
                var user = users.find(function (u) { return u.id === userId || u.customerId === userId; });
                if (!user) throw new Error('User session not found.');
                if (!user.two_factor_secret) throw new Error('2FA is not configured for this account.');

                var isValid = TOTP.verifyToken(user.two_factor_secret, token);
                if (!isValid) {
                    throw new Error('Invalid 6-digit code. Please enter the current code from your Google Authenticator app.');
                }

                // Complete login
                Storage.set('userProfile', user);
                Storage.set('ganeshStore_user_mock', {
                    uid: user.id,
                    customerId: user.customerId,
                    email: user.email,
                    displayName: user.name || user.full_name,
                    photoURL: null
                });
                Storage.set('user', 'loggedin');
                setCustomerSessionCookies(user);

                await BackendService.cart.fetchCartFromCloud(user.id);
                await BackendService.wishlist.fetchWishlistFromCloud(user.id);

                if (window.trackACDLUserLogin) {
                    window.trackACDLUserLogin(user);
                }

                return user;
            },

            // Register a new user
            register: async function (userData) {
                var password = userData.password || '';
                if (password.length < 6) {
                    throw new Error('Password must be at least 6 characters long.');
                }

                var newUser = CustomerAccounts.create({
                    name: userData.name,
                    email: userData.email,
                    phone: userData.phone,
                    password: password
                });

                // Cloud Supabase Sync
                if (BackendService._isCloudAvailable && BackendService._client) {
                    try {
                        await BackendService._client.from('profiles').insert({
                            id: newUser.id,
                            full_name: newUser.name,
                            email: newUser.email,
                            phone_number: newUser.phone,
                            loyalty_tier: 'Bronze',
                            loyalty_points: 100,
                            two_factor_enabled: false
                        });
                    } catch (err) {
                        console.warn('Supabase cloud profile insert exception:', err);
                    }
                }

                // Set active session
                Storage.set('userProfile', newUser);
                Storage.set('user', 'loggedin');
                setCustomerSessionCookies(newUser);

                // Telemetry
                if (window.trackACDLUserLogin) {
                    window.trackACDLUserLogin(newUser);
                }

                return newUser;
            },

            // Login with email or customer ID and password (with 2FA interceptor)
            login: async function (identifier, password) {
                var cleanIdentifier = (identifier || '').trim();
                var isCustomerId = !!CustomerAccounts.normalizeCustomerId(cleanIdentifier);
                if (!isCustomerId && !CustomerAccounts.isEmail(cleanIdentifier)) {
                    throw new Error('Enter a valid email address or customer ID (for example, GS-10001).');
                }
                if (!password) {
                    throw new Error('Password is required.');
                }

                var user = CustomerAccounts.findByIdentifier(cleanIdentifier);
                if (user && user.password !== password) {
                    throw new Error('Invalid email/customer ID or password. Please try again.');
                }

                if (!user && !isCustomerId && BackendService._isCloudAvailable && BackendService._client) {
                    var cleanEmail = CustomerAccounts.normalizeEmail(cleanIdentifier);
                    try {
                        var res = await BackendService._client.from('profiles').select('*').eq('email', cleanEmail).limit(1);
                        if (res.data && res.data.length > 0) {
                            var p = res.data[0];
                            user = CustomerAccounts.getOrCreate({
                                id: p.id,
                                name: p.full_name,
                                email: p.email || cleanEmail,
                                phone: p.phone_number,
                                password: password,
                                loyaltyTier: p.loyalty_tier || 'Bronze',
                                loyaltyPoints: p.loyalty_points || 100
                            });
                            user.two_factor_enabled = !!p.two_factor_enabled;
                            user.two_factor_secret = p.two_factor_secret || null;
                        }
                    } catch (e) {}
                }

                if (!user) {
                    throw new Error('Invalid email/customer ID or password. Please try again.');
                }

                // Check if Google Authenticator 2FA is required for this account
                if (user.two_factor_enabled && user.two_factor_secret) {
                    return {
                        requires2FA: true,
                        userId: user.id,
                        email: user.email,
                        customerId: user.customerId,
                        message: '2-Factor Authentication required.'
                    };
                }

                Storage.set('userProfile', user);
                Storage.set('user', 'loggedin');
                setCustomerSessionCookies(user);

                // Merge and sync cloud cart/wishlist
                await BackendService.cart.fetchCartFromCloud(user.id);
                await BackendService.wishlist.fetchWishlistFromCloud(user.id);

                if (window.trackACDLUserLogin) {
                    window.trackACDLUserLogin(user);
                }

                return user;
            },

            // Login with Phone Number
            loginWithPhone: async function (phone, name) {
                var cleanPhone = (phone || '').trim();
                var cleanName = (name || 'Guest User').trim();

                var users = CustomerAccounts.ensureUsers();
                var user = users.find(function (u) { return u.phone === cleanPhone || u.phone_number === cleanPhone; });

                if (!user) {
                    return await this.register({
                        phone: cleanPhone,
                        name: cleanName,
                        email: cleanPhone + '@ganeshstore.com',
                        password: 'password123'
                    });
                }

                if (user.two_factor_enabled && user.two_factor_secret) {
                    return {
                        requires2FA: true,
                        userId: user.id,
                        email: user.email,
                        customerId: user.customerId,
                        message: '2-Factor Authentication required.'
                    };
                }

                Storage.set('userProfile', user);
                Storage.set('user', 'loggedin');
                setCustomerSessionCookies(user);

                await BackendService.cart.fetchCartFromCloud(user.id);
                await BackendService.wishlist.fetchWishlistFromCloud(user.id);

                return user;
            },

            // Logout
            logout: function () {
                Storage.remove('userProfile');
                Storage.remove('user');
                document.cookie = "CustomerName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                document.cookie = "CustomerNumber=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                $(document).trigger('userLoggedOut');
            },

            // Get Current Active User
            getCurrentUser: function () {
                return Storage.get('userProfile', null);
            },

            // Update user profile
            updateProfile: async function (profileUpdates) {
                var currentUser = this.getCurrentUser();
                if (!currentUser) throw new Error('No user logged in.');

                var updated = Object.assign({}, currentUser, profileUpdates);
                Storage.set('userProfile', updated);

                // Update users list
                var users = CustomerAccounts.ensureUsers();
                var idx = users.findIndex(function (u) {
                    return u.id === currentUser.id || (currentUser.customerId && u.customerId === currentUser.customerId);
                });
                if (idx > -1) {
                    users[idx] = Object.assign({}, users[idx], profileUpdates);
                    CustomerAccounts.saveUsers(users);
                }

                if (BackendService._isCloudAvailable && BackendService._client) {
                    try {
                        await BackendService._client.from('profiles').update({
                            full_name: updated.name || updated.full_name,
                            phone_number: updated.phone || updated.phone_number,
                            default_address: updated.defaultAddress || {}
                        }).eq('id', currentUser.id);
                    } catch (e) {}
                }

                return updated;
            },

            // Calculate Dynamic Loyalty Tier
            getLoyaltyInfo: function (user) {
                var points = user && user.loyaltyPoints ? user.loyaltyPoints : 100;
                var tier = 'Bronze';
                var nextTier = 'Silver';
                var pointsToNext = 500 - points;
                var perk = 'Standard 1x Points & Free Shipping Over $100';

                if (points >= 2000) {
                    tier = 'Platinum';
                    nextTier = 'Max Tier';
                    pointsToNext = 0;
                    perk = 'VIP Concierge, 3x Points & Instant Free Shipping';
                } else if (points >= 1000) {
                    tier = 'Gold';
                    nextTier = 'Platinum';
                    pointsToNext = 2000 - points;
                    perk = '2x Points, Free Express Shipping & Early Sale Access';
                } else if (points >= 500) {
                    tier = 'Silver';
                    nextTier = 'Gold';
                    pointsToNext = 1000 - points;
                    perk = '1.5x Points & Special Birthday Vouchers';
                }

                return {
                    tier: tier,
                    points: points,
                    nextTier: nextTier,
                    pointsToNext: Math.max(0, pointsToNext),
                    perk: perk
                };
            }
        },

        // =================================================================
        // SHOPPING CART CLOUD & PERSISTENCE SUBSYSTEM
        // =================================================================
        cart: {
            getCart: function () {
                return Storage.get('cartItems', Storage.get('ganeshCartItems', Storage.get('cart', [])));
            },

            saveCart: function (cartItems) {
                Storage.set('cartItems', cartItems);
                Storage.set('ganeshCartItems', cartItems);
                Storage.set('cart', cartItems);

                this.updateBadges();
                this.syncCartToCloud();

                if (typeof window.updateFreeShippingProgressBar === 'function') {
                    window.updateFreeShippingProgressBar();
                }

                $(document).trigger('cartUpdated');
            },

            addToCart: function (item) {
                var cart = this.getCart();
                var qty = parseInt(item.quantity, 10) || 1;

                var existing = cart.find(function (i) {
                    return i.name === item.name &&
                           (i.size || 'M') === (item.size || 'M') &&
                           (i.color || 'Default') === (item.color || 'Default');
                });

                if (existing) {
                    existing.quantity = (parseInt(existing.quantity, 10) || 1) + qty;
                } else {
                    cart.push({
                        id: item.id || ('p_' + Date.now()),
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        size: item.size || 'Size M',
                        color: item.color || 'Default',
                        quantity: qty,
                        link: item.link || 'product-detail.html'
                    });
                }

                this.saveCart(cart);

                if (window.trackACDLAddToCart) {
                    window.trackACDLAddToCart(item);
                }

                return cart;
            },

            removeFromCart: function (name, size, color) {
                var cart = this.getCart();
                var filtered = cart.filter(function (i) {
                    return !(i.name === name && (i.size || '') === (size || '') && (i.color || '') === (color || ''));
                });
                this.saveCart(filtered);
                return filtered;
            },

            clearCart: function () {
                this.saveCart([]);
                return [];
            },

            getCartCount: function () {
                var cart = this.getCart();
                return cart.reduce(function (tot, i) {
                    return tot + (parseInt(i.quantity, 10) || 1);
                }, 0);
            },

            getCartSubtotal: function () {
                var cart = this.getCart();
                return cart.reduce(function (tot, i) {
                    var priceNum = parseFloat(String(i.price).replace(/[^0-9.]/g, '')) || 0;
                    var qty = parseInt(i.quantity, 10) || 1;
                    return tot + (priceNum * qty);
                }, 0);
            },

            updateBadges: function () {
                var cart = this.getCart();
                var totalQuantity = cart.reduce(function (tot, i) {
                    return tot + (parseInt(i.quantity, 10) || 1);
                }, 0);

                $('.js-show-cart').each(function () {
                    $(this).attr('data-notify', totalQuantity);
                });
            },

            syncCartToCloud: async function () {
                var user = BackendService.auth.getCurrentUser();
                if (!user || !BackendService._isCloudAvailable || !BackendService._client) return;

                var cart = this.getCart();
                try {
                    await BackendService._client.from('carts').upsert({
                        user_id: user.id,
                        items: cart,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' });
                } catch (e) {
                    console.warn('Cloud cart sync error:', e);
                }
            },

            fetchCartFromCloud: async function (userId) {
                if (!BackendService._isCloudAvailable || !BackendService._client) return;
                try {
                    var res = await BackendService._client.from('carts').select('items').eq('user_id', userId).limit(1);
                    if (res.data && res.data[0] && Array.isArray(res.data[0].items)) {
                        var cloudItems = res.data[0].items;
                        var localCart = this.getCart();

                        // Merge unique local items with cloud items
                        var merged = cloudItems.slice();
                        localCart.forEach(function (loc) {
                            var found = merged.find(function (m) {
                                return m.name === loc.name && m.size === loc.size && m.color === loc.color;
                            });
                            if (!found) merged.push(loc);
                        });

                        this.saveCart(merged);
                    }
                } catch (e) {}
            }
        },

        // =================================================================
        // WISHLIST CLOUD & PERSISTENCE SUBSYSTEM
        // =================================================================
        wishlist: {
            getWishlist: function () {
                return Storage.get('wishlist', []);
            },

            toggleWishlist: function (item) {
                var wishlist = this.getWishlist();
                var idx = wishlist.findIndex(function (w) { return w.name === item.name; });
                var added = false;

                if (idx > -1) {
                    wishlist.splice(idx, 1);
                    added = false;
                } else {
                    wishlist.push({
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        link: item.link || 'product-detail.html',
                        added_at: new Date().toISOString()
                    });
                    added = true;
                }

                Storage.set('wishlist', wishlist);
                this.updateBadges();
                this.syncWishlistToCloud();
                $(document).trigger('wishlistUpdated', { added: added, item: item });

                if (window.trackACDLWishlistToggle) {
                    window.trackACDLWishlistToggle(item, added ? 'add' : 'remove');
                }

                return { added: added, wishlist: wishlist };
            },

            updateBadges: function () {
                var wishlist = this.getWishlist();
                $('.icon-header-noti[href*="wishlist"], a[data-notify].zmdi-favorite-outline').each(function () {
                    $(this).attr('data-notify', wishlist.length);
                });
            },

            syncWishlistToCloud: async function () {
                var user = BackendService.auth.getCurrentUser();
                if (!user || !BackendService._isCloudAvailable || !BackendService._client) return;

                var wishlist = this.getWishlist();
                try {
                    await BackendService._client.from('wishlists').upsert({
                        user_id: user.id,
                        items: wishlist,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' });
                } catch (e) {}
            },

            fetchWishlistFromCloud: async function (userId) {
                if (!BackendService._isCloudAvailable || !BackendService._client) return;
                try {
                    var res = await BackendService._client.from('wishlists').select('items').eq('user_id', userId).limit(1);
                    if (res.data && res.data[0] && Array.isArray(res.data[0].items)) {
                        Storage.set('wishlist', res.data[0].items);
                        this.updateBadges();
                    }
                } catch (e) {}
            }
        },

        // =================================================================
        // REVIEWS & RATING AGGREGATION SUBSYSTEM
        // =================================================================
        reviews: {
            getProductReviews: async function (productName) {
                var cleanName = (productName || '').trim();
                var cacheKey = 'reviews_' + cleanName.replace(/\s+/g, '_');
                var localReviews = Storage.get(cacheKey, []);

                if (BackendService._isCloudAvailable && BackendService._client) {
                    try {
                        var res = await BackendService._client.from('reviews')
                            .select('*')
                            .eq('product_name', cleanName)
                            .order('created_at', { ascending: false });

                        if (res.data && res.data.length > 0) {
                            localReviews = res.data;
                            Storage.set(cacheKey, localReviews);
                        }
                    } catch (e) {}
                }

                // If completely empty, generate high quality verified seed reviews
                if (localReviews.length === 0) {
                    localReviews = [
                        {
                            reviewer_name: "Sai Ganesh",
                            email: "sai@ganeshstore.com",
                            rating: 5,
                            comment: "Exceeded all my expectations! The fabric is incredibly soft, breathable, and fits with tailored perfection.",
                            verified_purchase: true,
                            created_at: new Date(Date.now() - 86400000 * 3).toISOString()
                        },
                        {
                            reviewer_name: "Olivia Vance",
                            email: "olivia@vance.net",
                            rating: 5,
                            comment: "Stunning design and immaculate attention to detail. Fast shipping with elegant luxury packaging!",
                            verified_purchase: true,
                            created_at: new Date(Date.now() - 86400000 * 7).toISOString()
                        }
                    ];
                    Storage.set(cacheKey, localReviews);
                }

                return localReviews;
            },

            addReview: async function (productName, reviewData) {
                var cleanName = (productName || '').trim();
                var cacheKey = 'reviews_' + cleanName.replace(/\s+/g, '_');
                var currentReviews = await this.getProductReviews(cleanName);

                var newRev = {
                    product_name: cleanName,
                    reviewer_name: reviewData.name || reviewData.reviewer_name || 'Verified Buyer',
                    email: reviewData.email || 'customer@ganeshstore.com',
                    rating: parseInt(reviewData.rating, 10) || 5,
                    comment: reviewData.comment || reviewData.review || '',
                    verified_purchase: true,
                    created_at: new Date().toISOString()
                };

                currentReviews.unshift(newRev);
                Storage.set(cacheKey, currentReviews);

                // Cloud Supabase Sync
                if (BackendService._isCloudAvailable && BackendService._client) {
                    try {
                        await BackendService._client.from('reviews').insert(newRev);
                    } catch (e) {
                        console.warn('Supabase review insert exception:', e);
                    }
                }

                $(document).trigger('reviewAdded', { productName: cleanName, review: newRev });
                return newRev;
            },

            submitReview: async function (productNameOrData, maybeData) {
                if (typeof productNameOrData === 'object') {
                    return await this.addReview(productNameOrData.product_name || productNameOrData.productName || 'Product', productNameOrData);
                }
                return await this.addReview(productNameOrData, maybeData);
            },

            calculateAggregateRating: function (reviewsList) {
                if (!reviewsList || reviewsList.length === 0) return { average: 5.0, count: 0 };
                var sum = reviewsList.reduce(function (tot, r) { return tot + (parseInt(r.rating, 10) || 5); }, 0);
                var avg = (sum / reviewsList.length).toFixed(1);
                return {
                    average: parseFloat(avg),
                    count: reviewsList.length
                };
            }
        },

        // =================================================================
        // ORDERS CHECKOUT & REAL-TIME DELIVERY TRACKER
        // =================================================================
        orders: {
            createOrder: async function (orderPayload) {
                var user = BackendService.auth.getCurrentUser();
                var orderId = orderPayload.order_id || ('ORD-' + Math.floor(100000 + Math.random() * 900000));
                var trackingNo = 'GS-TRK-' + Math.floor(10000000 + Math.random() * 90000000);

                var estDate = new Date();
                estDate.setDate(estDate.getDate() + (orderPayload.shipping_method === 'Express Delivery' ? 2 : 4));

                var orderRecord = {
                    order_id: orderId,
                    user_id: user ? user.id : null,
                    customer_name: orderPayload.customer_name || (user ? user.name : 'Guest Customer'),
                    email: orderPayload.email || (user ? user.email : 'customer@ganeshstore.com'),
                    phone: orderPayload.phone || (user ? user.phone : ''),
                    shipping_address: orderPayload.shipping_address || '123 Luxury Lane, New York, NY',
                    shipping_method: orderPayload.shipping_method || 'Standard Delivery',
                    payment_method: (orderPayload.payment_method || 'CARD').toUpperCase(),
                    payment_status: 'COMPLETED',
                    order_status: 'processing',
                    tracking_number: trackingNo,
                    estimated_delivery: estDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
                    items: orderPayload.items || BackendService.cart.getCart(),
                    subtotal: parseFloat(orderPayload.subtotal) || 0,
                    discount: parseFloat(orderPayload.discount) || 0,
                    shipping_fee: parseFloat(orderPayload.shipping_fee) || 0,
                    tax: parseFloat(orderPayload.tax) || 0,
                    total: parseFloat(orderPayload.total) || 0,
                    created_at: new Date().toISOString()
                };

                // Save locally
                var history = Storage.get('order_history', []);
                history.unshift(orderRecord);
                Storage.set('order_history', history);

                // Add Loyalty Points (10 points per dollar spent)
                if (user) {
                    var earnedPoints = Math.floor(orderRecord.total * 10);
                    user.loyaltyPoints = (user.loyaltyPoints || 100) + earnedPoints;
                    var tierInfo = BackendService.auth.getLoyaltyInfo(user);
                    user.loyaltyTier = tierInfo.tier;
                    await BackendService.auth.updateProfile({
                        loyaltyPoints: user.loyaltyPoints,
                        loyaltyTier: user.loyaltyTier
                    });
                }

                // Cloud Supabase Sync
                if (BackendService._isCloudAvailable && BackendService._client) {
                    try {
                        await BackendService._client.from('orders').insert(orderRecord);
                    } catch (e) {
                        console.warn('Supabase cloud order insert error:', e);
                    }
                }

                // Purchase tracking disabled - nothing is sent on purchase.
                // if (window.trackACDLPurchase) {
                //     window.trackACDLPurchase(orderRecord);
                // }

                // Clear cart
                BackendService.cart.saveCart([]);

                return orderRecord;
            },

            getUserOrders: async function (userIdOrEmail) {
                var localOrders = Storage.get('order_history', []);

                if (BackendService._isCloudAvailable && BackendService._client && userIdOrEmail) {
                    try {
                        var query = BackendService._client.from('orders').select('*').order('created_at', { ascending: false });
                        if (userIdOrEmail.includes('@')) {
                            query = query.eq('email', userIdOrEmail);
                        } else {
                            query = query.eq('user_id', userIdOrEmail);
                        }
                        var res = await query;
                        if (res.data && res.data.length > 0) {
                            localOrders = res.data;
                            Storage.set('order_history', localOrders);
                        }
                    } catch (e) {}
                }

                return localOrders;
            },

            trackOrder: function (orderId) {
                var orders = Storage.get('order_history', []);
                var order = orders.find(function (o) { return o.order_id === orderId || o.tracking_number === orderId; });

                if (!order) {
                    // Generate dynamic simulation order for demo purposes
                    return {
                        found: false,
                        message: 'Order number not found. Please check your order reference.'
                    };
                }

                // Calculate progress milestones based on elapsed time
                var createdTime = new Date(order.created_at || Date.now()).getTime();
                var elapsedHours = (Date.now() - createdTime) / (1000 * 60 * 60);

                var currentStep = 2; // Processing
                var statusText = 'In Processing & Quality Check';

                if (elapsedHours > 48) {
                    currentStep = 5; // Delivered
                    statusText = 'Delivered Successfully';
                } else if (elapsedHours > 24) {
                    currentStep = 4; // Out for Delivery
                    statusText = 'Out for Local Delivery';
                } else if (elapsedHours > 6) {
                    currentStep = 3; // Shipped
                    statusText = 'In Transit with Carrier';
                }

                return {
                    found: true,
                    order: order,
                    currentStep: currentStep,
                    statusText: statusText,
                    milestones: [
                        { step: 1, title: 'Order Confirmed', time: 'Completed', done: true },
                        { step: 2, title: 'Quality Verification', time: currentStep >= 2 ? 'Completed' : 'Pending', done: currentStep >= 2 },
                        { step: 3, title: 'Shipped via Express', time: currentStep >= 3 ? 'In Transit' : 'Scheduled', done: currentStep >= 3 },
                        { step: 4, title: 'Out for Delivery', time: currentStep >= 4 ? 'Courier Assigned' : 'Upcoming', done: currentStep >= 4 },
                        { step: 5, title: 'Delivered', time: currentStep >= 5 ? order.estimated_delivery : 'Est. ' + order.estimated_delivery, done: currentStep >= 5 }
                    ]
                };
            }
        },

        // =================================================================
        // NEWSLETTER & CONTACT INQUIRIES SUBSYSTEM
        // =================================================================
        newsletter: {
            subscribe: async function (email, source) {
                var cleanEmail = (email || '').trim().toLowerCase();
                if (!cleanEmail || cleanEmail.indexOf('@') === -1 || cleanEmail.indexOf('.') === -1) {
                    throw new Error('Please enter a valid email address.');
                }

                var subs = Storage.get('newsletter_subscribers', []);
                if (subs.indexOf(cleanEmail) > -1) {
                    return { success: true, alreadySubscribed: true, message: 'You are already subscribed to GaneshStore Insider!' };
                }

                subs.push(cleanEmail);
                Storage.set('newsletter_subscribers', subs);

                if (BackendService._isCloudAvailable && BackendService._client) {
                    try {
                        await BackendService._client.from('newsletter_subscribers').insert({
                            email: cleanEmail,
                            source: source || 'footer_newsletter'
                        });
                    } catch (e) {}
                }

                if (window.adobeDataLayer) {
                    window.adobeDataLayer.push({
                        event: 'newsletterSubscribed',
                        newsletter: { email: cleanEmail, source: source || 'footer' }
                    });
                }

                return { success: true, message: 'Thank you for subscribing! Check your inbox for your 10% code: WELCOME10' };
            }
        },

        contact: {
            sendMessage: async function (messageData) {
                var name = (messageData.name || '').trim();
                var email = (messageData.email || '').trim();
                var message = (messageData.message || '').trim();
                var subject = messageData.subject || 'Customer Inquiry';

                if (!name || !email || !message) {
                    throw new Error('Please fill in all required fields.');
                }

                var messages = Storage.get('contact_messages', []);
                var msgObj = {
                    id: 'msg_' + Date.now(),
                    name: name,
                    email: email,
                    subject: subject,
                    message: message,
                    status: 'unread',
                    created_at: new Date().toISOString()
                };

                messages.unshift(msgObj);
                Storage.set('contact_messages', messages);

                if (BackendService._isCloudAvailable && BackendService._client) {
                    try {
                        await BackendService._client.from('contact_messages').insert({
                            name: name,
                            email: email,
                            subject: subject,
                            message: message
                        });
                    } catch (e) {}
                }

                return { success: true, message: 'Your message has been sent successfully. Our luxury concierge will respond within 24 hours.' };
            },

            submitMessage: async function (messageData) {
                return await this.sendMessage(messageData);
            }
        },

        // =================================================================
        // COUPONS & DISCOUNTS VALIDATOR SUBSYSTEM
        // =================================================================
        coupons: {
            validateCoupon: function (code, subtotal) {
                var cleanCode = (code || '').trim().toUpperCase();
                var numSubtotal = parseFloat(subtotal) || 0;

                var coupon = ACTIVE_COUPONS[cleanCode];
                if (!coupon) {
                    if (window.trackACDLPromoCode) {
                        window.trackACDLPromoCode(cleanCode, 0, false, 'Invalid coupon code');
                    }
                    return { valid: false, message: 'Invalid coupon code.' };
                }

                if (coupon.minSpend && numSubtotal < coupon.minSpend) {
                    if (window.trackACDLPromoCode) {
                        window.trackACDLPromoCode(cleanCode, 0, false, 'Minimum spend requirement not met');
                    }
                    return {
                        valid: false,
                        message: 'This coupon requires a minimum spend of $' + coupon.minSpend.toFixed(2)
                    };
                }

                var discountAmount = 0;
                if (coupon.type === 'percentage') {
                    discountAmount = (numSubtotal * coupon.value) / 100;
                } else if (coupon.type === 'fixed') {
                    discountAmount = Math.min(numSubtotal, coupon.value);
                } else if (coupon.type === 'free_shipping') {
                    discountAmount = 0; // Standard shipping waived
                }

                if (window.trackACDLPromoCode) {
                    window.trackACDLPromoCode(cleanCode, discountAmount, true, '');
                }

                return {
                    valid: true,
                    code: cleanCode,
                    type: coupon.type,
                    discount_type: coupon.type,
                    value: coupon.value,
                    discount_value: coupon.value,
                    discountAmount: discountAmount,
                    discount_amount: discountAmount,
                    description: coupon.desc
                };
            }
        },

        // =================================================================
        // PRODUCTS CATALOG API
        // =================================================================
        products: {
            getCatalog: function () {
                return MASTER_CATALOG;
            },
            getProductById: function (id) {
                return MASTER_CATALOG.find(function (p) { return p.id === id; }) || null;
            },
            getProductByName: function (name) {
                var clean = (name || '').trim().toLowerCase();
                return MASTER_CATALOG.find(function (p) { return p.name.toLowerCase() === clean; }) || null;
            }
        }
    };

    // Auto initialize BackendService on window load
    BackendService.init();

    // Export Globally
    window.BackendService = BackendService;

})(window);
