/**
 * GaneshStore Experience Layer
 * Glass mobile menu, sticky glass catalog toolbar, scroll reveal,
 * PDP option labels and keyboard-accessible swatches.
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
    try { return JSON.parse(localStorage.getItem(key)) || []; } catch (e) { return []; }
  }

  /* ------------------------------------------------------------------
     Mobile menu: floating glass sheet
     ------------------------------------------------------------------ */
  function initMobileMenu() {
    var $menu = $('.menu-mobile').first();
    var $toggle = $('.btn-show-menu-mobile');
    if (!$menu.length || !$toggle.length) return;

    $menu.addClass('gs-menu').attr('id', $menu.attr('id') || 'gs-mobile-menu');
    $toggle.attr({ 'aria-controls': $menu.attr('id'), 'aria-expanded': 'false', 'aria-label': 'Menu' });

    var current = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    $menu.find('.main-menu-m > li > a').each(function () {
      var href = ($(this).attr('href') || '').split('?')[0].toLowerCase();
      if (href && href === current) $(this).attr('aria-current', 'page');
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

    function setOpen(open) {
      var bar = document.querySelector('.wrap-header-mobile');
      if (bar) document.documentElement.style.setProperty('--gs-mm-top', (bar.getBoundingClientRect().bottom + 8) + 'px');
      $('html').toggleClass('gs-menu-open', open);
      $toggle.toggleClass('is-active', open).attr('aria-expanded', open ? 'true' : 'false');
      $('html, body').css('overflow', open ? 'hidden' : '');
    }

    // Replace the theme's slideToggle with the sheet behaviour
    $toggle.off('click').on('click', function () {
      setOpen(!$('html').hasClass('gs-menu-open'));
    });
    $scrim.on('click', function () { setOpen(false); });
    $menu.on('click', 'a[href]:not([href="#"])', function () { setOpen(false); });
    $(document).on('keydown', function (e) {
      if (e.key === 'Escape' && $('html').hasClass('gs-menu-open')) setOpen(false);
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
        var chosen = val && val !== 'Choose an option' ? $select.find('option:selected').text().replace(/size\s*/i, '').trim() : '';
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
    initMobileMenu();
    initCatalogToolbar();
    initOptionLabels();
    initReveal();
  });
})(jQuery);
