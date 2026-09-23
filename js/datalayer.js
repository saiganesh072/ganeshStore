/**
 * ==================================================================
 * [ Ganesh Store - Adobe Client Data Layer Integration ]
 * ==================================================================
 * An enterprise-grade, event-driven tracking implementation fully
 * compliant with the Adobe Client Data Layer (ACDL) standard.
 * Automatically tracks page loads, handles advanced e-commerce context
 * scraping (products, cart state), and binds to user clicks.
 */

(function () {
  'use strict';

  // 1. Initialize Adobe Client Data Layer queue
  window.adobeDataLayer = window.adobeDataLayer || [];

  // 2. Helper to detect page types based on path and title
  function getPageType() {
    var path = window.location.pathname.toLowerCase();
    var title = document.title.toLowerCase();

    if (path === '/' || path.indexOf('/index.html') !== -1 || path.indexOf('/home-02.html') !== -1 || path.indexOf('/home-03.html') !== -1) {
      return 'home';
    } else if (path.indexOf('/product.html') !== -1 || title.indexOf('shop') !== -1 || title.indexOf('product') !== -1 && title.indexOf('detail') === -1) {
      return 'shop';
    } else if (path.indexOf('/product-detail.html') !== -1 || path.indexOf('/p-') !== -1 || title.indexOf('product detail') !== -1) {
      return 'product-detail';
    } else if (path.indexOf('/shoping-cart.html') !== -1 || title.indexOf('cart') !== -1) {
      return 'cart';
    } else if (path.indexOf('/about.html') !== -1 || title.indexOf('about') !== -1) {
      return 'about';
    } else if (path.indexOf('/signin.html') !== -1 || title.indexOf('contact') !== -1 || title.indexOf('sign in') !== -1) {
      return 'signin';
    } else if (path.indexOf('/blog') !== -1 || title.indexOf('blog') !== -1) {
      return 'blog';
    }
    return 'general';
  }

  // 3. Helper to format a clean, standardized Page Name
  function getPageName(type) {
    var name = 'ganesh-store:' + type;
    if (type === 'product-detail') {
      var pName = document.querySelector('.js-name-detail')?.innerText?.trim();
      if (pName) {
        name += ':' + pName.toLowerCase().replace(/\s+/g, '-');
      }
    }
    return name;
  }

  // 4. Main initialization function triggered on DOMContentLoaded
  function initDataLayer() {
    var pageType = getPageType();
    var pageName = getPageName(pageType);

    // 4a. Prepare Enterprise Page Details
    var pageInfo = {
      pageName: pageName,
      pageType: pageType,
      pageTitle: document.title,
      pageURL: window.location.href,
      pagePath: window.location.pathname,
      domain: window.location.hostname,
      protocol: window.location.protocol,
      referrer: document.referrer,
      language: document.documentElement.lang || navigator.language || 'en-US',
      currency: 'USD',
      siteSection: pageType,
      siteSubSection: document.title.split('-')[0]?.trim() || pageType,
      environment: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? 'development' : 'production',
      timestamp: Date.now()
    };

    // 4b. Prepare Visitor & Device Details
    var visitorInfo = {
      userAgent: navigator.userAgent,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      screenResolution: window.screen.width + 'x' + window.screen.height,
      deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop'
    };

    // 4c. Prepare User Context
    var rawWishlist = localStorage.getItem('wishlist');
    var wishlistItems = [];
    try { wishlistItems = JSON.parse(rawWishlist) || []; } catch(e) {}

    var userInfo = {
      loggedIn: localStorage.getItem('user') === 'loggedin',
      userType: localStorage.getItem('user') === 'loggedin' ? 'authenticated' : 'guest',
      wishlistItemsCount: wishlistItems.length
    };

    var userProfile = null;
    try {
      userProfile = JSON.parse(localStorage.getItem('userProfile'));
    } catch (e) {}

    if (userProfile) {
      userInfo.userId = userProfile.id || userProfile.email || '';
      userInfo.email = userProfile.email || '';
      userInfo.name = userProfile.name || '';
      userInfo.loyaltyTier = userProfile.loyaltyTier || 'Standard';
      userInfo.accountCreated = userProfile.created_at || '2026-01-01';
    }

    // 4d. Prepare E-commerce Context
    var ecommerceInfo = {};

    // Product Details Scraping (Product Detail Pages)
    if (pageType === 'product-detail') {
      var urlParams = new URLSearchParams(window.location.search);
      var urlSku = urlParams.get('SKUID') || urlParams.get('skuID') || urlParams.get('skuid') || urlParams.get('SKU') || urlParams.get('sku');

      var pName = document.querySelector('.js-name-detail')?.innerText?.trim() || '';
      var pPriceText = document.querySelector('.mtext-106')?.innerText?.trim() || '';
      var priceNum = parseFloat(pPriceText.replace(/[^\d.]/g, '')) || 0;
      var pId = document.querySelector('.js-addcart-detail')?.getAttribute('data-product-id') || '';
      
      var sku = urlSku || '';
      var categories = ['Fashion'];
      
      document.querySelectorAll('span').forEach(function (el) {
        var text = el.innerText || '';
        if (!sku && text.indexOf('SKU:') !== -1) {
          sku = text.replace('SKU:', '').trim();
        }
        if (text.indexOf('Categories:') !== -1) {
          categories = text.replace('Categories:', '').split(',').map(function (c) {
            return c.trim();
          });
        }
      });

      if (!pId) {
        pId = sku || (pName ? pName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'GS001');
      }
      if (!sku) {
        sku = pId || 'GS001';
      }

      var finalSku = urlSku || sku || pId || 'GS001';

      if (!urlSku) {
        urlParams.set('SKUID', finalSku);
        var newUrl = window.location.pathname + '?' + urlParams.toString() + window.location.hash;
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, '', newUrl);
        }
        pageInfo.pageURL = window.location.href;
      }

      var selectedSize = document.querySelector('select[name="time"]')?.value || 'Size M';
      var selectedColor = document.querySelectorAll('select[name="time"]')[1]?.value || 'Default';

      ecommerceInfo.productInfo = {
        id: pId,
        productId: pId,
        sku: finalSku,
        SKUID: finalSku,
        skuID: finalSku,
        name: pName,
        price: pPriceText,
        priceValue: priceNum,
        currency: 'USD',
        brand: 'GaneshStore',
        stockStatus: 'in_stock',
        rating: 4.8,
        reviewsCount: 14,
        categories: categories,
        primaryCategory: categories[0] || 'Fashion',
        selectedSize: selectedSize,
        selectedColor: selectedColor,
        imageUrl: document.querySelector('.item-slick3 img, .wrap-pic-w img')?.getAttribute('src') || 'images/product-01.jpg'
      };
    }

    // Cart Status Scraping (All Pages LocalStorage check)
    var rawCart = localStorage.getItem('cartItems');
    var cartItems = [];
    if (rawCart) {
      try {
        cartItems = JSON.parse(rawCart) || [];
      } catch (e) {
        console.error('DataLayer: Failed to parse cartItems from localStorage', e);
      }
    }

    if (cartItems.length > 0) {
      var totalAmount = 0;
      var cleanItems = cartItems.map(function (item) {
        var itemPrice = parseFloat((item.price || '0').replace(/[^\d.]/g, '')) || 0;
        var quantity = parseInt(item.quantity || 1, 10);
        var itemTotal = itemPrice * quantity;
        totalAmount += itemTotal;

        return {
          id: item.id || 'GS001',
          productId: item.id || 'GS001',
          sku: item.id || 'GS001',
          name: item.name || '',
          price: item.price || '',
          priceValue: itemPrice,
          quantity: quantity,
          itemTotal: itemTotal,
          size: item.size || '',
          color: item.color || '',
          brand: 'GaneshStore',
          image: item.image || ''
        };
      });

      ecommerceInfo.cartInfo = {
        cartId: 'cart_' + (cartItems[0]?.id || 'guest'),
        items: cleanItems,
        totalUniqueItems: cleanItems.length,
        totalItemsCount: cleanItems.reduce(function (acc, curr) { return acc + curr.quantity; }, 0),
        subtotal: totalAmount,
        totalAmount: '$' + totalAmount.toFixed(2),
        currency: 'USD',
        isFreeShipping: totalAmount >= 100
      };

      // Push initial State update to ACDL
      window.adobeDataLayer.push({
        cart: ecommerceInfo.cartInfo
      });
    }

    // 5. Push pageLoaded Event to Adobe Client Data Layer
    var pageLoadPayload = {
      event: 'pageLoaded',
      page: pageInfo,
      user: userInfo,
      visitor: visitorInfo,
      timestamp: Date.now()
    };
    if (Object.keys(ecommerceInfo).length > 0) {
      pageLoadPayload.ecommerce = ecommerceInfo;
    }

    window.adobeDataLayer.push(pageLoadPayload);

    // 6. Print developer console logs
    console.log(
      '%c📊 Adobe Client Data Layer - Event "pageLoaded" Pushed',
      'background: #107c41; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-family: sans-serif;',
      pageLoadPayload
    );
  }

  // 7. Click Tracking Logic using Event Delegation
  function initClickTracking() {
    document.addEventListener('click', function (event) {
      var element = event.target;

      // Navigate up to find the closest interactive element (a or button)
      while (element && element !== document.body) {
        var tagName = element.tagName;
        var role = element.getAttribute('role');
        var isClickable = tagName === 'A' || tagName === 'BUTTON' || role === 'button' || 
                           element.classList.contains('btn') || 
                           element.classList.contains('btn-num-product-down') || 
                           element.classList.contains('btn-num-product-up') ||
                           element.classList.contains('remove-product-btn');

        if (isClickable) {
          handleElementClick(element);
          break;
        }
        element = element.parentElement;
      }
    });
  }

  function handleElementClick(element) {
    var text = element.innerText?.trim() || element.value?.trim() || '';
    
    // Fallback to title, alt or class if text is empty (e.g. image link, close icon)
    if (!text) {
      var img = element.querySelector('img');
      if (img) {
        text = img.getAttribute('alt') || img.getAttribute('title') || 'Image Link';
      } else {
        text = element.getAttribute('title') || element.getAttribute('aria-label') || 'Icon / Graphic Button';
      }
    }

    var id = element.id || '';
    var classes = element.className || '';
    var href = element.getAttribute('href') || '';
    var type = element.tagName;
    var action = 'Link/Button Click';

    // Contextual Action Mapping for E-Commerce Actions
    if (element.classList.contains('js-addcart-detail') || text.toLowerCase().indexOf('add to cart') !== -1) {
      action = 'Add to Cart';
    } else if (element.classList.contains('js-addwish-detail') || element.classList.contains('js-addwish-b2')) {
      action = 'Add to Wishlist';
    } else if (element.classList.contains('js-show-modal1') || text.toLowerCase().indexOf('quick view') !== -1) {
      action = 'Quick View';
    } else if (element.classList.contains('btn-num-product-down')) {
      action = 'Decrease Quantity';
    } else if (element.classList.contains('btn-num-product-up')) {
      action = 'Increase Quantity';
    } else if (element.classList.contains('remove-product-btn') || text.toLowerCase().indexOf('remove') !== -1) {
      action = 'Remove Cart Item';
    } else if (text.toLowerCase().indexOf('proceed to checkout') !== -1 || element.classList.contains('bor14')) {
      action = 'Proceed to Checkout';
    } else if (element.classList.contains('logo') || element.closest('.logo')) {
      action = 'Logo Click';
    } else if (element.closest('.main-menu') || element.closest('.main-menu-m')) {
      action = 'Navigation Menu Header';
    } else if (element.closest('footer')) {
      action = 'Footer Navigation';
    }

    var clickPayload = {
      event: 'linkClicked',
      clickInfo: {
        text: text,
        id: id,
        classes: classes,
        href: href,
        type: type,
        action: action,
        timestamp: Date.now()
      }
    };

    // State Update and Event Push
    window.adobeDataLayer.push(clickPayload);

    // Print developer console logs
    console.log(
      '%c🖱️ Adobe Client Data Layer - Event "linkClicked" Pushed',
      'background: #0078d4; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-family: sans-serif;',
      clickPayload
    );
  }

  // ==================================================================
  // ACDL PUBLIC EVENT HELPERS FOR LAUNCH RULE ENGINE
  // ==================================================================
  
  // Helper to push Add to Cart event to ACDL
  window.trackACDLAddToCart = function (productInfo) {
    window.adobeDataLayer = window.adobeDataLayer || [];
    window.adobeDataLayer.push({
      event: 'addToCart',
      cartItem: productInfo,
      timestamp: Date.now()
    });
    console.log(
      '%c🛒 ACDL - Event "addToCart" Pushed',
      'background: #e65100; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
      productInfo
    );
  };

  // Helper to push Remove from Cart event to ACDL
  window.trackACDLRemoveFromCart = function (productInfo) {
    window.adobeDataLayer = window.adobeDataLayer || [];
    window.adobeDataLayer.push({
      event: 'removeFromCart',
      cartItem: productInfo,
      timestamp: Date.now()
    });
    console.log(
      '%c🗑️ ACDL - Event "removeFromCart" Pushed',
      'background: #c62828; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
      productInfo
    );
  };

  // Helper to push Purchase Completed event to ACDL & Adobe Experience Platform (Alloy) Web SDK
  var _lastPurchaseTrackedId = null;
  var _lastPurchaseTrackedTime = 0;

  window.trackACDLPurchase = function (transactionInfo, customMboxScope) {
    if (!transactionInfo) return;

    // Deduplication check: prevent duplicate purchase tracking within 2.5 seconds for the same order
    var currentOrderId = transactionInfo.order_id || transactionInfo.purchaseID || '';
    var now = Date.now();
    if (currentOrderId && currentOrderId === _lastPurchaseTrackedId && (now - _lastPurchaseTrackedTime < 2500)) {
      return;
    }
    _lastPurchaseTrackedId = currentOrderId;
    _lastPurchaseTrackedTime = now;

    window.adobeDataLayer = window.adobeDataLayer || [];

    // Format productListItems conforming to XDM commerce schema
    var rawItems = transactionInfo.items || [];
    var productListItems = rawItems.map(function (item) {
      var priceNum = typeof item.price === 'number'
        ? item.price
        : (item.priceValue !== undefined 
            ? parseFloat(item.priceValue) || 0 
            : parseFloat((item.price || '0').toString().replace(/[^\d.]/g, '')) || 0);
      var qty = parseInt(item.quantity || 1, 10);
      var itemTotal = typeof item.priceTotal === 'number'
        ? item.priceTotal
        : parseFloat((priceNum * qty).toFixed(2));
      var skuVal = item.SKU || item.sku || item.id || item.productId || 'GS001';

      return {
        SKU: skuVal,
        name: item.name || '',
        quantity: qty,
        priceTotal: itemTotal
      };
    });

    var totalVal = typeof transactionInfo.total === 'number'
      ? transactionInfo.total
      : parseFloat((transactionInfo.total || '0').toString().replace(/[^\d.]/g, '')) || 0;

    var purchaseIdVal = transactionInfo.order_id || transactionInfo.purchaseID || ('ORD-' + now);
    var scopeName = customMboxScope || window.targetMboxScope || window.adobeTargetScope || '<your_mbox>';

    // Construct XDM object compliant with Adobe Experience Platform Web SDK specification
    var xdmPayload = {
      commerce: {
        order: {
          purchaseID: purchaseIdVal,
          priceTotal: totalVal,
          currencyCode: 'USD'
        },
        purchases: {
          value: 1
        }
      },
      productListItems: productListItems,
      _experience: {
        decisioning: {
          propositions: [
            {
              scope: scopeName
            }
          ],
          propositionEventType: {
            display: 1
          }
        }
      }
    };

    // Attach xdm into transaction object
    transactionInfo.xdm = xdmPayload;

    // Push unified ACDL payload
    var acdlPayload = {
      event: 'purchaseCompleted',
      transaction: transactionInfo,
      xdm: xdmPayload,
      timestamp: now
    };
    window.adobeDataLayer.push(acdlPayload);

    console.log(
      '%c🎉 ACDL - Event "purchaseCompleted" Pushed',
      'background: #2e7d32; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
      acdlPayload
    );

    // If Adobe Experience Platform Web SDK (alloy) is loaded, dispatch sendEvent directly
    if (typeof window.alloy === 'function') {
      window.alloy("sendEvent", {
        xdm: xdmPayload
      }).then(function (result) {
        console.log(
          '%c🚀 Alloy Web SDK - Purchase sendEvent Dispatched Successfully',
          'background: #0052cc; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
          result
        );
      }).catch(function (error) {
        console.warn('Alloy sendEvent warning:', error);
      });
    }

    return acdlPayload;
  };

  // Dedicated helper for explicit Alloy Web SDK purchase call
  window.trackAlloyPurchase = function (transactionInfo, customMboxScope) {
    if (!transactionInfo) return;
    return window.trackACDLPurchase(transactionInfo, customMboxScope);
  };

  // Helper to push User Login event to ACDL
  window.trackACDLUserLogin = function (userInfo) {
    window.adobeDataLayer = window.adobeDataLayer || [];
    window.adobeDataLayer.push({
      event: 'userLogin',
      user: userInfo,
      timestamp: Date.now()
    });
    console.log(
      '%c👤 ACDL - Event "userLogin" Pushed',
      'background: #6a1b9a; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
      userInfo
    );
  };

  // Helper to push Search Initiated event to ACDL
  window.trackACDLSearch = function (searchTerm, resultsCount, categoryFilter) {
    window.adobeDataLayer = window.adobeDataLayer || [];
    var payload = {
      event: 'searchInitiated',
      search: {
        keyword: searchTerm || '',
        resultsCount: typeof resultsCount === 'number' ? resultsCount : 0,
        categoryFilter: categoryFilter || 'All',
        timestamp: Date.now()
      }
    };
    window.adobeDataLayer.push(payload);
    console.log(
      '%c🔍 ACDL - Event "searchInitiated" Pushed',
      'background: #0288d1; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
      payload
    );
  };

  // Helper to push Checkout Step event to ACDL
  window.trackACDLCheckoutStep = function (stepNumber, stepName, cartTotal, paymentMethod) {
    window.adobeDataLayer = window.adobeDataLayer || [];
    var payload = {
      event: 'checkoutStep',
      checkout: {
        stepNumber: stepNumber || 1,
        stepName: stepName || 'Billing & Shipping',
        cartTotal: cartTotal || 0,
        paymentMethod: paymentMethod || 'credit_card',
        timestamp: Date.now()
      }
    };
    window.adobeDataLayer.push(payload);
    console.log(
      '%c💳 ACDL - Event "checkoutStep" Pushed',
      'background: #7b1fa2; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
      payload
    );
  };

  // Helper to push Promo Code Applied event to ACDL
  window.trackACDLPromoCode = function (couponCode, discountAmount, isValid, rejectionReason) {
    window.adobeDataLayer = window.adobeDataLayer || [];
    var payload = {
      event: 'promoCodeApplied',
      promo: {
        code: couponCode || '',
        discount: discountAmount || 0,
        isValid: !!isValid,
        rejectionReason: rejectionReason || '',
        timestamp: Date.now()
      }
    };
    window.adobeDataLayer.push(payload);
    console.log(
      '%c🏷️ ACDL - Event "promoCodeApplied" Pushed',
      'background: #f57c00; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
      payload
    );
  };

  // Helper to push Wishlist Toggle event to ACDL
  window.trackACDLWishlistToggle = function (productInfo, action) {
    window.adobeDataLayer = window.adobeDataLayer || [];
    var payload = {
      event: 'wishlistToggled',
      wishlistItem: {
        id: productInfo?.id || productInfo?.productId || 'GS001',
        name: productInfo?.name || '',
        price: productInfo?.price || '',
        action: action || 'added',
        timestamp: Date.now()
      }
    };
    window.adobeDataLayer.push(payload);
    console.log(
      '%c❤️ ACDL - Event "wishlistToggled" Pushed',
      'background: #d81b60; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
      payload
    );
  };

  // Helper to push Product View event to ACDL
  window.trackACDLProductView = function (productInfo) {
    window.adobeDataLayer = window.adobeDataLayer || [];
    var payload = {
      event: 'productView',
      product: productInfo,
      timestamp: Date.now()
    };
    window.adobeDataLayer.push(payload);
    console.log(
      '%c👁️ ACDL - Event "productView" Pushed',
      'background: #00897b; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
      payload
    );
  };

  // Helper to push Filter Change event to ACDL
  window.trackACDLFilterChange = function (filterType, filterValue, resultsCount) {
    window.adobeDataLayer = window.adobeDataLayer || [];
    var payload = {
      event: 'filterApplied',
      filter: {
        type: filterType || 'category',
        value: filterValue || 'all',
        resultsCount: resultsCount || 0,
        timestamp: Date.now()
      }
    };
    window.adobeDataLayer.push(payload);
    console.log(
      '%c🎯 ACDL - Event "filterApplied" Pushed',
      'background: #546e7a; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold;',
      payload
    );
  };

  // 8. Bootstrap initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initDataLayer();
      initClickTracking();
    });
  } else {
    initDataLayer();
    initClickTracking();
  }

})();


