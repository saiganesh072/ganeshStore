/**
 * GaneshStore Experience Layer
 * Glass mobile dock/menu, compact hero, sticky catalog toolbar and scroll reveal.
 * gs-dock-from carries the pill's starting slot across ordinary page loads.
 * The dock yields to text entry and the PDP purchase bar.
 * Loaded after main.js; every feature no-ops when its markup is absent.
 */
(function ($) {
  'use strict';

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window) {
    // Content is hidden for reveal only when this class is present, so no-JS visitors still see everything
    document.documentElement.classList.add('gs-motion');
  }

  function readJSON(key) {
    try {
      var value = JSON.parse(localStorage.getItem(key));
      return Array.isArray(value) ? value : [];
    } catch (e) {
      console.warn('GaneshStore: unable to read ' + key, e);
      return [];
    }
  }

  function initMobileDock() {
    if (document.querySelector('.gs-dock')) return;
    var root = document.documentElement;
    var current = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    var active = /^(index|home-02|home-03)\.html$/.test(current) ? 0 :
      /^(product|product-detail)\.html$/.test(current) || /^p-.*\.html$/.test(current) ? 1 :
      current === 'wishlist.html' ? 2 : /^(shoping-cart|checkout)\.html$/.test(current) ? 3 : -1;
    var items = [
      ['index.html', 'Home', 'home'],
      ['product.html', 'Shop', 'store'],
      ['wishlist.html', 'Wishlist', 'favorite-outline'],
      ['shoping-cart.html', 'Bag', 'shopping-cart']
    ];
    var dock = document.createElement('nav');
    dock.className = 'gs-dock';
    dock.setAttribute('aria-label', 'Primary navigation');
    dock.innerHTML = '<div class="gs-dock-capsule"><span class="gs-dock-pill" aria-hidden="true"></span>' +
      items.map(function (item, i) {
        return '<a class="gs-dock-link" href="' + item[0] + '"' + (i === active ? ' aria-current="page"' : '') +
          '><i class="zmdi zmdi-' + item[2] + '" aria-hidden="true"></i><span>' + item[1] +
          '</span><span class="gs-dock-badge" hidden aria-hidden="true"></span></a>';
      }).join('') + '</div>' +
      ($('.menu-mobile').length ? '<button type="button" class="gs-dock-more" aria-label="More navigation"><i class="zmdi zmdi-apps" aria-hidden="true"></i><span>More</span></button>' : '');
    document.body.appendChild(dock);
    root.classList.add('gs-dock-enabled');
    var links = dock.querySelectorAll('.gs-dock-link');
    var pill = dock.querySelector('.gs-dock-pill');
    var capsule = dock.querySelector('.gs-dock-capsule');

    function position(index, animate) {
      pill.classList.toggle('is-moving', animate && !reduceMotion);
      pill.style.opacity = index < 0 ? '0' : '1';
      if (index < 0) return;
      pill.style.width = links[index].offsetWidth + 'px';
      pill.style.transform = 'translateX(' + links[index].offsetLeft + 'px)';
    }

    function session(action, value) {
      try {
        if (action === 'get') return sessionStorage.getItem('gs-dock-from');
        if (action === 'set') sessionStorage.setItem('gs-dock-from', JSON.stringify(value));
        if (action === 'remove') sessionStorage.removeItem('gs-dock-from');
      } catch (e) {
        console.warn('GaneshStore: navigation animation storage unavailable', e);
      }
      return null;
    }

    function updateCounts() {
      var counts = [0, 0, readJSON('wishlist').length, readJSON('cartItems').reduce(function (n, item) {
        var quantity = item && Number(item.quantity);
        return n + (Number.isFinite(quantity) && quantity > 0 ? Math.floor(quantity) : 1);
      }, 0)];
      [2, 3].forEach(function (i) {
        var badge = links[i].querySelector('.gs-dock-badge');
        badge.hidden = !counts[i];
        badge.textContent = counts[i] > 99 ? '99+' : counts[i];
        links[i].setAttribute('aria-label', items[i][1] + ', ' + counts[i] + (i === 2 ? ' saved' : ' items'));
      });
    }

    var from = null;
    var saved = session('get');
    if (saved) {
      try { from = JSON.parse(saved); } catch (e) { console.warn('GaneshStore: invalid navigation animation state', e); }
      session('remove');
    }
    var navigation = performance.getEntriesByType('navigation')[0];
    var animate = !reduceMotion && active >= 0 && from && Number.isInteger(from.i) && from.i >= 0 && from.i < 4 &&
      Number.isFinite(from.t) && Date.now() - from.t >= 0 && Date.now() - from.t < 5000 && from.i !== active &&
      (!navigation || navigation.type === 'navigate');
    position(animate ? from.i : active, false);
    if (animate) {
      requestAnimationFrame(function () {
        position(from.i, false);
        pill.getBoundingClientRect();
        requestAnimationFrame(function () { position(active, true); });
      });
    }
    $(dock).on('click', '.gs-dock-link', function (e) {
      if (reduceMotion || e.isDefaultPrevented() || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || this.target === '_blank') return;
      var index = Array.prototype.indexOf.call(links, this);
      if (index === active) return;
      session('set', { i: active, t: Date.now() });
      position(index, true);
    });

    function syncLayout() {
      var header = document.querySelector('.wrap-header-mobile');
      if (header) root.style.setProperty('--gs-head-bottom', (header.getBoundingClientRect().bottom + window.scrollY) + 'px');
      position(active, false);
      syncYield();
    }
    function syncYield() {
      var field = document.activeElement;
      var typing = field && field.matches('textarea, select, input:not([type=button]):not([type=submit]):not([type=checkbox]):not([type=radio]):not([type=range])');
      var yieldDock = window.innerWidth < 992 && (!!typing || !!document.querySelector('.sticky-pdp-bar.visible'));
      root.classList.toggle('gs-dock-yield', yieldDock);
      dock.inert = yieldDock;
    }
    updateCounts();
    syncLayout();
    var lastWidth = capsule.clientWidth;
    if ('ResizeObserver' in window) new ResizeObserver(function () {
      if (capsule.clientWidth !== lastWidth) {
        lastWidth = capsule.clientWidth;
        position(active, false);
      }
    }).observe(capsule);
    var buyBar = document.querySelector('.sticky-pdp-bar');
    if (buyBar && 'MutationObserver' in window) new MutationObserver(syncYield).observe(buyBar, { attributes: true, attributeFilter: ['class'] });
    $(window).on('resize orientationchange', syncLayout).on('pageshow', function (e) {
      if (e.originalEvent.persisted) position(active, false);
      updateCounts();
      syncYield();
    }).on('storage', updateCounts);
    $(document).on('cartUpdated wishlistUpdated', updateCounts).on('focusin focusout', function () { setTimeout(syncYield, 0); });
    var $search = $('.wrap-header-mobile .js-show-modal-search');
    $search.attr({ role: 'button', tabindex: '0', 'aria-label': 'Search products' }).on('keydown.gsdock', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $(this).trigger('click'); }
    });
    $(document).on('click', '.inline-search-btn-close-m', function () { $search.trigger('focus'); });
  }

  /* ------------------------------------------------------------------
     Mobile menu: floating glass sheet
     ------------------------------------------------------------------ */
  function initMobileMenu() {
    var $menu = $('.menu-mobile').first();
    var $toggle = $('.btn-show-menu-mobile, .gs-dock-more');
    if (!$menu.length || !$toggle.length) return;

    $menu.addClass('gs-menu').attr('id', $menu.attr('id') || 'gs-mobile-menu');
    $toggle.attr({ 'aria-controls': $menu.attr('id'), 'aria-expanded': 'false', 'aria-label': 'More navigation' });
    $menu.attr({ role: 'navigation', 'aria-label': 'More navigation', inert: '' });
    var opener = null;

    var current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $menu.find('.main-menu-m > li > a').each(function () {
      if ($.trim($(this).text()) === 'Sale' && $(this).attr('href') === 'product.html') {
        $(this).attr('href', 'product.html?category=sale').removeClass('label1 rs1').removeAttr('data-label1');
      }
      var href = ($(this).attr('href') || '').split('?')[0].toLowerCase();
      if (href && href === current && !$(this).attr('href').includes('?')) $(this).attr('aria-current', 'page');
    });

    if (!$menu.find('.gs-menu-quick').length) {
      var cartCount = readJSON('cartItems').reduce(function (n, i) { return n + (parseInt(i.quantity, 10) || 1); }, 0);
      var wishCount = readJSON('wishlist').length;
      $menu.append(
        '<div class="gs-menu-quick">' +
        '  <a href="shoping-cart.html"><i class="zmdi zmdi-shopping-cart"></i>Bag<span class="gs-count js-gs-cart-count">' + cartCount + ' items</span></a>' +
        '  <a href="wishlist.html"><i class="zmdi zmdi-favorite-outline"></i>Wishlist<span class="gs-count">' + wishCount + ' saved</span></a>' +
        '  <a href="signin.html"><i class="zmdi zmdi-account-circle"></i>Account<span class="gs-count">Sign in</span></a>' +
        '</div>'
      );
    }

    var $scrim = $('.gs-menu-scrim');
    if (!$scrim.length) $scrim = $('<div class="gs-menu-scrim" aria-hidden="true"></div>').appendTo('body');

    function setOpen(open, returnFocus) {
      var bar = document.querySelector('.wrap-header-mobile');
      if (bar) document.documentElement.style.setProperty('--gs-mm-top', (bar.getBoundingClientRect().bottom + 8) + 'px');
      $('html').toggleClass('gs-menu-open', open);
      $toggle.toggleClass('is-active', open).attr('aria-expanded', open ? 'true' : 'false');
      $menu[0].inert = !open;
      $('html, body').css('overflow', open ? 'hidden' : '');
      if (open) {
        $menu.find('a[href]').first().trigger('focus');
      } else if (returnFocus && opener) {
        opener.focus();
      }
    }

    // Replace the theme's slideToggle with the sheet behaviour
    $toggle.off('click').on('click', function () {
      opener = this;
      setOpen(!$('html').hasClass('gs-menu-open'), true);
    });
    $scrim.on('click', function () { setOpen(false, true); });
    $menu.on('click', 'a[href]:not([href="#"])', function () { setOpen(false); });
    $(document).on('keydown', function (e) {
      if (!$('html').hasClass('gs-menu-open')) return;
      if (e.key === 'Escape') setOpen(false, true);
      if (e.key === 'Tab') {
        var focusable = $menu.find('a[href], button').filter(':visible').toArray();
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    $(window).on('resize', function () {
      if (window.innerWidth > 991 && $('html').hasClass('gs-menu-open')) setOpen(false);
    });
    $(document).on('cartUpdated', function () {
      var n = readJSON('cartItems').reduce(function (t, i) { return t + (parseInt(i.quantity, 10) || 1); }, 0);
      $('.js-gs-cart-count').text(n + ' items');
    });
  }

  /* ------------------------------------------------------------------
     Shop: sticky glass toolbar (category pills + search/filter)
     ------------------------------------------------------------------ */
  function initCatalogToolbar() {
    var $group = $('.filter-tope-group').first();
    if (!$group.length || !$('.isotope-grid').length) return;
    var $bar = $group.parent();
    if ($bar.hasClass('gs-catalog-toolbar')) return;

    $bar.addClass('gs-catalog-toolbar');
    var sentinel = $('<div class="gs-catalog-sentinel" aria-hidden="true"></div>').insertBefore($bar)[0];

    if ('IntersectionObserver' in window) {
      var io;
      var observe = function () {
        if (io) io.disconnect();
        var offset = window.innerWidth >= 992 ? 82 : 0;
        io = new IntersectionObserver(function (entries) {
          $bar.toggleClass('is-stuck', !entries[0].isIntersecting && entries[0].boundingClientRect.top < offset + 1);
        }, { rootMargin: '-' + (offset + 1) + 'px 0px 0px 0px', threshold: 0 });
        io.observe(sentinel);
      };
      observe();
      $(window).on('resize', observe);
    }
  }

  /* ------------------------------------------------------------------
     Scroll reveal with per-row stagger
     ------------------------------------------------------------------ */
  function initReveal() {
    if (!document.documentElement.classList.contains('gs-motion')) return;

    var selectors = [
      '.sec-banner .block1',
      '.isotope-item .block2',
      '.item-slick2 .block2',
      '.sec-blog .blog-item',
      '.ltext-103, .ltext-105, .ltext-106',
      '.bg6 [class*="col-"] > div',
      '.row > .col-lg-3 > .txt-center'
    ].join(',');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    var register = function (root) {
      $(root).find(selectors).addBack(selectors).each(function () {
        if (this.classList.contains('gs-reveal')) return;
        // Stagger siblings that share a row (cards in a grid / carousel)
        var $cell = $(this).closest('.isotope-item, .item-slick2, [class*="col-"]');
        var index = $cell.length ? $cell.index() % 4 : 0;
        this.style.setProperty('--gs-delay', (index * 0.07) + 's');
        this.classList.add('gs-reveal');
        io.observe(this);
      });
    };

    register(document.body);

    // Related / Recently Viewed rows are rendered after load
    if ('MutationObserver' in window) {
      new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          m.addedNodes.forEach(function (n) { if (n.nodeType === 1) register(n); });
        });
      }).observe(document.body, { childList: true, subtree: true });
    }
  }

  /* ------------------------------------------------------------------
     PDP: show the chosen size/colour next to its label; keyboard swatches
     ------------------------------------------------------------------ */
  function initOptionLabels() {
    $('.premium-option-row').each(function () {
      var $row = $(this);
      var $label = $row.find('.premium-option-label').first();
      var $select = $row.find('select').first();
      if (!$label.length || !$select.length) return;

      var $value = $label.find('.gs-option-value');
      if (!$value.length) $value = $('<span class="gs-option-value" aria-live="polite"></span>').appendTo($label);

      var update = function () {
        var val = $select.val();
        var chosen = val && val !== 'Choose an option' ? $select.find('option:selected').text().replace(/^size\s*/i, '').trim() : '';
        $value.text(chosen ? '\u00b7 ' + chosen : '');
        $row.find('.size-pill-item, .color-swatch-item').each(function () {
          this.setAttribute('aria-checked', $(this).hasClass('active') ? 'true' : 'false');
        });
      };
      $select.on('change.gsoption', update);
      update();

      var $group = $row.find('.premium-swatch-container').first();
      $group.attr({ role: 'radiogroup', 'aria-label': $.trim($label.clone().children().remove().end().text()) || 'Option' });
      $group.find('.size-pill-item, .color-swatch-item').each(function () {
        var $s = $(this);
        $s.attr({ role: 'radio', tabindex: '0', 'aria-label': $s.attr('title') || $.trim($s.text()) || $s.attr('data-val') });
      });
    });

    $(document).on('keydown', '.size-pill-item, .color-swatch-item', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        $(this).trigger('click');
      }
    });
  }

  $(function () {
    initMobileDock();
    initMobileMenu();
    initCatalogToolbar();
    initOptionLabels();
    initReveal();
  });
})(jQuery);
