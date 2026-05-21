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
    } else if (path.indexOf('/contact.html') !== -1 || title.indexOf('contact') !== -1 || title.indexOf('sign in') !== -1) {
      return 'contact';
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

    // Prepare Page Details
    var pageInfo = {
      pageName: pageName,
      pageType: pageType,
      pageTitle: document.title,
      pageURL: window.location.href,
      pagePath: window.location.pathname,
      referrer: document.referrer,
      language: document.documentElement.lang || navigator.language || 'en',
      timestamp: Date.now()
    };

    // Prepare Visitor Context
    var visitorInfo = {
      userAgent: navigator.userAgent,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      screenResolution: window.screen.width + 'x' + window.screen.height
    };

    // Prepare E-commerce Context
    var ecommerceInfo = {};

    // 4a. Product Details Scraping (Product Detail Pages)
    if (pageType === 'product-detail') {
      var pName = document.querySelector('.js-name-detail')?.innerText?.trim() || '';
      var pPrice = document.querySelector('.mtext-106')?.innerText?.trim() || '';
      var pId = document.querySelector('.js-addcart-detail')?.getAttribute('data-product-id') || '';
      
      var sku = '';
      var categories = [];
      
      // Scrape SKU and Categories from supplementary spans
      document.querySelectorAll('span').forEach(function (el) {
        var text = el.innerText || '';
        if (text.indexOf('SKU:') !== -1) {
          sku = text.replace('SKU:', '').trim();
        }
        if (text.indexOf('Categories:') !== -1) {
          categories = text.replace('Categories:', '').split(',').map(function (c) {
            return c.trim();
          });
        }
      });

      ecommerceInfo.productInfo = {
        id: pId,
        name: pName,
        price: pPrice,
        sku: sku,
        categories: categories
      };
    }

    // 4b. Cart Status Scraping (Shopping Cart / All Pages LocalStorage check)
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
        var itemPrice = parseFloat((item.price || '0').replace('$', '').trim());
        var quantity = parseInt(item.quantity || 1, 10);
        totalAmount += itemPrice * quantity;

        return {
          id: item.id || '',
          name: item.name || '',
          price: item.price || '',
          quantity: quantity,
          size: item.size || '',
          color: item.color || ''
        };
      });

      ecommerceInfo.cartInfo = {
        items: cleanItems,
        totalItemsCount: cleanItems.reduce(function (acc, curr) { return acc + curr.quantity; }, 0),
        totalAmount: '$' + totalAmount.toFixed(2)
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
      visitor: visitorInfo,
      timestamp: Date.now()
    };
    if (Object.keys(ecommerceInfo).length > 0) {
      pageLoadPayload.ecommerce = ecommerceInfo;
    }

    window.adobeDataLayer.push(pageLoadPayload);

    // 6. Print gorgeous developer console logs
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

    // Print gorgeous console logs
    console.log(
      '%c🖱️ Adobe Client Data Layer - Event "linkClicked" Pushed',
      'background: #0078d4; color: white; padding: 4px 8px; border-radius: 4px; font-weight: bold; font-family: sans-serif;',
      clickPayload
    );
  }

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
