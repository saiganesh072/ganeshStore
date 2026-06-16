
// ====================================================================
// GANESHSTORE CLOUD DATABASE CONFIGURATION (SUPABASE)
// To enable full-stack secure databases, user logins, cart/wishlist
// persistence, and shared PDP reviews, populate your credentials below:
// ====================================================================
var SUPABASE_URL = "https://urglyumucxvnszyyrdiv.supabase.co";       
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyZ2x5dW11Y3h2bnN6eXlyZGl2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MjIxMTksImV4cCI6MjA5NTA5ODExOX0.Fuw5FNHXw_rGoxfeVW8sjCT_DO0lDsOKPJ-wQ2-JV70";

var supabaseClient = null;

// Programmatically load Supabase browser client SDK via CDN
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
    var script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
    script.onload = function() {
        if (typeof supabase !== 'undefined') {
            window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log("Supabase Client initialized successfully!");
        }
    };
    document.head.appendChild(script);
}

(function ($) {
    "use strict";

    window.activeFilters = {
        category: '*',
        priceRange: 'all',
        color: 'all',
        tag: 'all',
        searchQuery: ''
    };

    /*[ Load page ]
    ===========================================================*/
    $(".animsition").animsition({
        inClass: 'fade-in',
        outClass: 'fade-out',
        inDuration: 1500,
        outDuration: 800,
        linkElement: '.animsition-link',
        loading: true,
        loadingParentElement: 'html',
        loadingClass: 'animsition-loading-1',
        loadingInner: '<div class="loader05"></div>',
        timeout: false,
        timeoutCountdown: 5000,
        onLoadEvent: true,
        browser: [ 'animation-duration', '-webkit-animation-duration'],
        overlay : false,
        overlayClass : 'animsition-overlay-slide',
        overlayParentElement : 'html',
        transition: function(url){ window.location.href = url; }
    });
    
    /*[ Back to top ]
    ===========================================================*/
    var windowH = $(window).height()/2;

    $(window).on('scroll',function(){
        if ($(this).scrollTop() > windowH) {
            $("#myBtn").css('display','flex');
        } else {
            $("#myBtn").css('display','none');
        }
    });

    $('#myBtn').on("click", function(){
        $('html, body').animate({scrollTop: 0}, 300);
    });


    /*==================================================================
    [ Fixed Header ]*/
    var headerDesktop = $('.container-menu-desktop');
    var wrapMenu = $('.wrap-menu-desktop');

    if($('.announcement-bar').length > 0) {
        var posWrapHeader = $('.announcement-bar').outerHeight();
    }
    else {
        var posWrapHeader = 0;
    }
    

    if($(window).scrollTop() > posWrapHeader) {
        $(headerDesktop).addClass('fix-menu-desktop');
        $(wrapMenu).css('top',0); 
    }  
    else {
        $(headerDesktop).removeClass('fix-menu-desktop');
        $(wrapMenu).css('top',posWrapHeader - $(this).scrollTop()); 
    }

    $(window).on('scroll',function(){
        if($(this).scrollTop() > posWrapHeader) {
            $(headerDesktop).addClass('fix-menu-desktop');
            $(wrapMenu).css('top',0); 
        }  
        else {
            $(headerDesktop).removeClass('fix-menu-desktop');
            $(wrapMenu).css('top',posWrapHeader - $(this).scrollTop()); 
        } 
    });
    /*==================================================================
    [ Dynamic Header Submenu Injections ]*/
    function injectHeaderSubmenus() {
        // Desktop Shop dropdown
        var $desktopShopLi = $('.main-menu > li > a').filter(function() {
            return $(this).text().trim() === 'Shop';
        }).parent();
        if ($desktopShopLi.length && !$desktopShopLi.find('.sub-menu').length) {
            $desktopShopLi.append(
                '<ul class="sub-menu">' +
                '  <li><a href="product.html?category=women">Women</a></li>' +
                '  <li><a href="product.html?category=men">Men</a></li>' +
                '  <li><a href="product.html?category=bag">Bags</a></li>' +
                '  <li><a href="product.html?category=shoes">Shoes</a></li>' +
                '  <li><a href="product.html?category=watches">Watches</a></li>' +
                '</ul>'
            );
        }

        // Desktop Features dropdown
        var $desktopFeaturesA = $('.main-menu > li > a').filter(function() {
            return $(this).text().trim() === 'Features';
        });
        if ($desktopFeaturesA.length) {
            $desktopFeaturesA.attr('href', '#');
            var $desktopFeaturesLi = $desktopFeaturesA.parent();
            if (!$desktopFeaturesLi.find('.sub-menu').length) {
                $desktopFeaturesLi.append(
                    '<ul class="sub-menu">' +
                    '  <li><a href="#" class="js-trigger-slide-cart">Slide-Out Cart</a></li>' +
                    '  <li><a href="product.html">Dynamic Quick View</a></li>' +
                    '  <li><a href="wishlist.html">My Wishlist</a></li>' +
                    '  <li><a href="signin.html">Account Center</a></li>' +
                    '</ul>'
                );
            }
        }

        // Mobile Shop dropdown
        var $mobileShopLi = $('.main-menu-m > li > a').filter(function() {
            return $(this).text().trim() === 'Shop';
        }).parent();
        if ($mobileShopLi.length && !$mobileShopLi.find('.sub-menu-m').length) {
            $mobileShopLi.append(
                '<ul class="sub-menu-m">' +
                '  <li><a href="product.html?category=women">Women</a></li>' +
                '  <li><a href="product.html?category=men">Men</a></li>' +
                '  <li><a href="product.html?category=bag">Bags</a></li>' +
                '  <li><a href="product.html?category=shoes">Shoes</a></li>' +
                '  <li><a href="product.html?category=watches">Watches</a></li>' +
                '</ul>' +
                '<span class="arrow-main-menu-m">' +
                '  <i class="fa fa-angle-right" aria-hidden="true"></i>' +
                '</span>'
            );
        }

        // Mobile Features dropdown
        var $mobileFeaturesA = $('.main-menu-m > li > a').filter(function() {
            return $(this).text().trim() === 'Features';
        });
        if ($mobileFeaturesA.length) {
            $mobileFeaturesA.attr('href', '#');
            var $mobileFeaturesLi = $mobileFeaturesA.parent();
            if (!$mobileFeaturesLi.find('.sub-menu-m').length) {
                $mobileFeaturesLi.append(
                    '<ul class="sub-menu-m">' +
                    '  <li><a href="#" class="js-trigger-slide-cart">Slide-Out Cart</a></li>' +
                    '  <li><a href="product.html">Dynamic Quick View</a></li>' +
                    '  <li><a href="wishlist.html">My Wishlist</a></li>' +
                    '  <li><a href="signin.html">Account Center</a></li>' +
                    '</ul>' +
                    '<span class="arrow-main-menu-m">' +
                    '  <i class="fa fa-angle-right" aria-hidden="true"></i>' +
                    '</span>'
                );
            }
        }

        // Desktop Inline Search Injection
        if ($('.limiter-menu-desktop').length && !$('.inline-search-nav').length) {
            $('.limiter-menu-desktop').append(
                '<div class="inline-search-nav">' +
                '  <button class="inline-search-btn-search">' +
                '    <i class="zmdi zmdi-search" style="font-size: 20px; color: #717fe0;"></i>' +
                '  </button>' +
                '  <form class="inline-search-form" action="product.html" method="get" style="flex-grow: 1; height: 100%; display: flex; align-items: center; margin: 0;">' +
                '    <input type="text" name="search" placeholder="Search products..." class="inline-search-input" />' +
                '  </form>' +
                '  <button class="inline-search-btn-close">' +
                '    <i class="zmdi zmdi-close" style="font-size: 20px; color: #999;"></i>' +
                '  </button>' +
                '</div>'
            );
        }

        // Mobile Inline Search Injection
        if ($('.wrap-header-mobile').length && !$('.inline-search-mobile').length) {
            $('.wrap-header-mobile').append(
                '<div class="inline-search-mobile">' +
                '  <button class="inline-search-btn-search-m">' +
                '    <i class="zmdi zmdi-search" style="font-size: 18px; color: #717fe0;"></i>' +
                '  </button>' +
                '  <form class="inline-search-form-m" action="product.html" method="get" style="flex-grow: 1; height: 100%; display: flex; align-items: center; margin: 0;">' +
                '    <input type="text" name="search" placeholder="Search..." class="inline-search-input-m" />' +
                '  </form>' +
                '  <button class="inline-search-btn-close-m">' +
                '    <i class="zmdi zmdi-close" style="font-size: 18px; color: #999;"></i>' +
                '  </button>' +
                '</div>'
            );
        }
    }

    // Run injection before mobile menu hooks
    injectHeaderSubmenus();

    // Slide-out cart trigger from submenu
    $(document).off('click', '.js-trigger-slide-cart').on('click', '.js-trigger-slide-cart', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Close mobile menu if it is open
        if ($('.menu-mobile').css('display') === 'block') {
            $('.menu-mobile').slideUp();
            $('.btn-show-menu-mobile').removeClass('is-active');
        }
        
        // Trigger cart drawer click
        $('.js-show-cart').first().trigger('click');
    });


    /*==================================================================
    [ Menu mobile ]*/
    $('.btn-show-menu-mobile').on('click', function(){
        $(this).toggleClass('is-active');
        $('.menu-mobile').slideToggle();
    });

    var arrowMainMenu = $('.arrow-main-menu-m');

    for(var i=0; i<arrowMainMenu.length; i++){
        $(arrowMainMenu[i]).on('click', function(){
            $(this).parent().find('.sub-menu-m').slideToggle();
            $(this).toggleClass('turn-arrow-main-menu-m');
        })
    }

    $(window).resize(function(){
        if($(window).width() >= 992){
            if($('.menu-mobile').css('display') == 'block') {
                $('.menu-mobile').css('display','none');
                $('.btn-show-menu-mobile').toggleClass('is-active');
            }

            $('.sub-menu-m').each(function(){
                if($(this).css('display') == 'block') { console.log('hello');
                    $(this).css('display','none');
                    $(arrowMainMenu).removeClass('turn-arrow-main-menu-m');
                }
            });
                
        }
    });


    /*==================================================================
    [ Show / hide inline expanding search ]*/
    $('.js-show-modal-search').off('click').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        var isMobile = $(this).closest('.wrap-header-mobile').length > 0;
        
        if (isMobile) {
            $('.wrap-header-mobile').addClass('show-inline-search');
            $('.inline-search-mobile input').focus();
        } else {
            $('.limiter-menu-desktop').addClass('show-inline-search');
            $('.inline-search-nav input').focus();
        }
    });

    $(document).on('click', '.inline-search-btn-close, .inline-search-btn-close-m', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('.limiter-menu-desktop').removeClass('show-inline-search');
        $('.wrap-header-mobile').removeClass('show-inline-search');
    });

    // Close search on Escape key press
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape') {
            $('.limiter-menu-desktop').removeClass('show-inline-search');
            $('.wrap-header-mobile').removeClass('show-inline-search');
        }
    });


    /*==================================================================
    [ Isotope ]*/
    var $topeContainer = $('.isotope-grid');
    var $filter = $('.filter-tope-group');

    // filter items on button click
    $filter.each(function () {
        $filter.on('click', 'button', function () {
            var filterValue = $(this).attr('data-filter');
            $topeContainer.isotope({filter: filterValue});
        });
        
    });

    // init Isotope
    $(window).on('load', function () {
        var $grid = $topeContainer.each(function () {
            $(this).isotope({
                itemSelector: '.isotope-item',
                layoutMode: 'fitRows',
                percentPosition: true,
                animationEngine : 'best-available',
                getSortData: {
                    price: function(itemElem) {
                        var priceText = $(itemElem).find('.stext-105').text().trim();
                        return parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
                    }
                },
                masonry: {
                    columnWidth: '.isotope-item'
                }
            });
        });
    });

    var isotopeButton = $('.filter-tope-group button');

    $(isotopeButton).each(function(){
        $(this).on('click', function(){
            for(var i=0; i<isotopeButton.length; i++) {
                $(isotopeButton[i]).removeClass('how-active1');
            }

            $(this).addClass('how-active1');
        });
    });

    /*==================================================================
    [ Filter / Search product ]*/
    $('.js-show-filter').on('click',function(){
        $(this).toggleClass('show-filter');
        $('.panel-filter').slideToggle(400);

        if($('.js-show-search').hasClass('show-search')) {
            $('.js-show-search').removeClass('show-search');
            $('.panel-search').slideUp(400);
        }    
    });

    $('.js-show-search').on('click',function(){
        $(this).toggleClass('show-search');
        $('.panel-search').slideToggle(400);

        if($('.js-show-filter').hasClass('show-filter')) {
            $('.js-show-filter').removeClass('show-filter');
            $('.panel-filter').slideUp(400);
        }    
    });




    /*==================================================================
    [ Cart ]*/
    $('.js-show-cart').on('click',function(e){
        e.preventDefault();
        window.location.href = 'shoping-cart.html';
    });

    $('.js-hide-cart').on('click',function(){
        $('.js-panel-cart').removeClass('show-header-cart');
    });

    /*==================================================================
    [ Cart ]*/
    $('.js-show-sidebar').on('click',function(){
        $('.js-sidebar').addClass('show-sidebar');
    });

    $('.js-hide-sidebar').on('click',function(){
        $('.js-sidebar').removeClass('show-sidebar');
    });

    /*==================================================================
    [ +/- num product ]*/
    $('.btn-num-product-down').on('click', function(){
        var numProduct = Number($(this).next().val());
        if(numProduct > 0) $(this).next().val(numProduct - 1);
    });

    $('.btn-num-product-up').on('click', function(){
        var numProduct = Number($(this).prev().val());
        $(this).prev().val(numProduct + 1);
    });

    /*==================================================================
    [ Rating ]*/
    $('.wrap-rating').each(function(){
        var item = $(this).find('.item-rating');
        var rated = -1;
        var input = $(this).find('input');
        $(input).val(0);

        $(item).on('mouseenter', function(){
            var index = item.index(this);
            var i = 0;
            for(i=0; i<=index; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for(var j=i; j<item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });

        $(item).on('click', function(){
            var index = item.index(this);
            rated = index;
            $(input).val(index+1);
        });

        $(this).on('mouseleave', function(){
            var i = 0;
            for(i=0; i<=rated; i++) {
                $(item[i]).removeClass('zmdi-star-outline');
                $(item[i]).addClass('zmdi-star');
            }

            for(var j=i; j<item.length; j++) {
                $(item[j]).addClass('zmdi-star-outline');
                $(item[j]).removeClass('zmdi-star');
            }
        });
    });
    
    /*==================================================================
    [ Show modal1 (Dynamic Quick View population) ]*/
    $('.js-show-modal1').on('click', function(e) {
        e.preventDefault();
        
        var $btn = $(this);
        var $block = $btn.closest('.block2');
        if (!$block.length) {
            // Fallback if not inside .block2 card
            $('.js-modal1').addClass('show-modal1');
            return;
        }

        // 1. Scrap product metadata
        var name = $block.find('.js-name-b2').text().trim();
        var price = $block.find('.stext-105').text().trim();
        var img = $block.find('.block2-pic img').attr('src');
        var link = $block.find('.js-name-b2').attr('href') || $block.find('.block2-pic a').first().attr('href') || 'product-detail.html';

        // 2. Populate modal details
        var $modal = $('.js-modal1');
        $modal.find('.js-name-detail').text(name);
        $modal.find('.mtext-106').text(price);
        $modal.find('.js-addcart-detail').attr('data-link', link);

        // 3. Populate and re-initialize slick slider inside modal dynamically
        var $slick3 = $modal.find('.slick3');
        if ($slick3.hasClass('slick-initialized')) {
            $slick3.slick('unslick');
        }
        
        $slick3.empty();

        // Add 3 thumbnails for the dynamic product using its primary scraped image
        var slideHtml = '';
        for (var i = 0; i < 3; i++) {
            slideHtml += 
                '<div class="item-slick3" data-thumb="' + img + '">' +
                '  <div class="wrap-pic-w pos-relative">' +
                '    <img src="' + img + '" alt="IMG-PRODUCT" />' +
                '    <a class="flex-c-m size-108 how-pos1 bor0 fs-16 cl10 bg0 hov-btn3 trans-04" href="' + img + '">' +
                '      <i class="fa fa-expand"></i>' +
                '    </a>' +
                '  </div>' +
                '</div>';
        }
        $slick3.append(slideHtml);

        // Reinitialise Slick gallery inside modal
        $slick3.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            fade: true,
            infinite: true,
            arrows: true,
            appendArrows: $modal.find('.wrap-slick3-arrows'),
            prevArrow: '<button class="arrow-slick3 prev-slick3"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
            nextArrow: '<button class="arrow-slick3 next-slick3"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',
            dots: true,
            appendDots: $modal.find('.wrap-slick3-dots'),
            dotsClass: 'slick3-dots',
            customPaging: function(slick, index) {
                var portrait = $(slick.$slides[index]).data('thumb');
                return '<img src="' + portrait + '"/><div class="slick3-dot-overlay"></div>';
            }
        });

        // 4. Open modal
        $modal.find('.js-addcart-detail').off('click');
        $modal.addClass('show-modal1');
    });

    $('.js-hide-modal1').on('click', function() {
        $('.js-modal1').removeClass('show-modal1');
    });

    /*==================================================================
    [ Click block2 image to go to PDP ]*/
    $("<style>.block2-pic img { cursor: pointer; }</style>").appendTo("head");
    $(document).on('click', '.block2-pic img', function(){
        var block2 = $(this).closest('.block2');
        var pdpLink = block2.find('.block2-txt-child1 a').attr('href');
        if(pdpLink) {
            window.location.href = pdpLink;
        }
    });

    /*==================================================================
    [ Wishlist Functionality Integration ]*/
    
    // Helper to get wishlist from localStorage
    function getWishlist() {
        try {
            return JSON.parse(localStorage.getItem('wishlist')) || [];
        } catch (e) {
            return [];
        }
    }

    // Helper to save wishlist to localStorage
    function saveWishlist(wishlist) {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        updateWishlistBadges();
        if (typeof syncWishlistToSupabase === 'function') {
            syncWishlistToSupabase();
        }
    }

    // Helper to update all header wishlist badges
    function updateWishlistBadges() {
        var wishlist = getWishlist();
        var count = wishlist.length;
        $('.icon-header-noti i.zmdi-favorite-outline, .icon-header-noti i.zmdi-favorite, .icon-header-noti svg')
            .parent()
            .attr('data-notify', count);
        
        // Dynamic header heart filled indicator strictly for the active wishlist.html route
        var $svg = $('.heart-icon-header');
        if ($svg.length) {
            var isWishlistPage = window.location.pathname.indexOf('wishlist.html') > -1;
            if (isWishlistPage) {
                $svg.addClass('js-header-heart-active-route');
            } else {
                $svg.removeClass('js-header-heart-active-route');
            }
        }
    }

    // Initialize all wishlist interactions on load
    function initWishlist() {
        var wishlist = getWishlist();

        // 0. Inject premium linear gradient def capsule dynamically to the body
        if (!$('#heart-gradient-svg').length) {
            $('body').append(
                '<svg id="heart-gradient-svg" style="position: absolute; width: 0; height: 0;" width="0" height="0">' +
                '  <defs>' +
                '    <linearGradient id="cherry-gradient" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '      <stop offset="0%" stop-color="#ff3366" />' +
                '      <stop offset="100%" stop-color="#d91444" />' +
                '    </linearGradient>' +
                '  </defs>' +
                '</svg>'
            );
        }

        // 1. Rewrite all header/mobile-header favorite icons to point to wishlist.html and replace with SVG heart
        var headerHeartSelector = '.icon-header-item i.zmdi-favorite-outline, .icon-header-item i.zmdi-favorite, .wrap-icon-header a i.zmdi-favorite-outline, .wrap-icon-header a i.zmdi-favorite';
        $(headerHeartSelector).each(function() {
            var $icon = $(this);
            var $link = $icon.parent();
            if (!$link.find('.heart-icon-header').length) {
                $icon.remove(); // remove old zmdi icon
                $link.prepend(
                    '<svg class="heart-icon-header" viewBox="0 0 24 24" width="24" height="24">' +
                    '  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="none" stroke="#222" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>' +
                    '</svg>'
                );
            }
            $link.attr('href', 'wishlist.html');
        });

        // 2. Update badges immediately
        updateWishlistBadges();

        // 3. Clear existing inline click handlers that would double-fire
        $('.js-addwish-b2, .js-addwish-detail').off('click');

        // Inject SVG heart markup into catalog listing items contextually (replaces PNGs)
        $('.js-addwish-b2').each(function() {
            var $heartLink = $(this);
            if (!$heartLink.find('.heart-icon').length) {
                $heartLink.empty().append(
                    '<svg class="heart-icon" viewBox="0 0 24 24" width="20" height="20">' +
                    '  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' +
                    '</svg>'
                );
            }
        });

        // Inject SVG heart markup into PDP wishlist buttons (replaces old Iconic font i tag)
        $('.js-addwish-detail').each(function() {
            var $heartLink = $(this);
            if (!$heartLink.find('.heart-icon').length) {
                $heartLink.empty().append(
                    '<svg class="heart-icon" viewBox="0 0 24 24" width="18" height="18">' +
                    '  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' +
                    '</svg>'
                );
            }
        });

        // 4. Sync active heart visual states for product grid cards
        $('.js-addwish-b2').each(function() {
            var name = $(this).closest('.block2').find('.js-name-b2').text().trim();
            var isInWishlist = wishlist.some(function(item) {
                return item.name === name;
            });
            if (isInWishlist) {
                $(this).addClass('js-addedwish-b2');
            } else {
                $(this).removeClass('js-addedwish-b2');
            }
        });

        // 5. Sync active state for PDP page main wishlist buttons contextually
        $('.js-addwish-detail').each(function() {
            var $btn = $(this);
            var $row = $btn.closest('.row');
            var nameDetail = $row.find('.js-name-detail').first().text().trim();
            if (!nameDetail) {
                nameDetail = $('.js-name-detail').first().text().trim();
            }
            var isInWishlist = wishlist.some(function(item) {
                return item.name === nameDetail;
            });
            if (isInWishlist) {
                $btn.addClass('js-addedwish-detail');
            } else {
                $btn.removeClass('js-addedwish-detail');
            }
        });

        // 6. Render wishlist page if on wishlist.html
        renderWishlistPage();
    }

    // Wishlist page dynamic rendering
    function renderWishlistPage() {
        var wishlist = getWishlist();
        var $tableBody = $('#wishlist-table-body');
        var $contentArea = $('#wishlist-content');
        var $emptyState = $('#wishlist-empty-state');

        if (!$tableBody.length) return; // Not on wishlist page

        if (wishlist.length === 0) {
            $contentArea.addClass('dis-none');
            $emptyState.removeClass('dis-none');
            return;
        }

        $emptyState.addClass('dis-none');
        $contentArea.removeClass('dis-none');
        $tableBody.empty();

        wishlist.forEach(function(item) {
            var rowHtml = 
                '<tr class="table_row" style="transition: all 0.5s ease;">' +
                '  <td class="column-1">' +
                '    <div class="wishlist-item-img">' +
                '      <img src="' + item.image + '" alt="IMG">' +
                '    </div>' +
                '  </td>' +
                '  <td class="column-2">' +
                '    <a href="' + item.link + '" class="hov-cl1 trans-04 stext-115" style="font-family: Poppins-Medium; font-size: 15px; color: #333;">' + item.name + '</a>' +
                '  </td>' +
                '  <td class="column-3 stext-115">' + item.price + '</td>' +
                '  <td class="column-4" style="text-align: center; padding-right: 20px;">' +
                '    <div class="flex-c-m flex-w">' +
                '      <button class="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 js-add-cart-from-wishlist" ' +
                '              data-name="' + item.name + '" ' +
                '              data-price="' + item.price + '" ' +
                '              data-image="' + item.image + '" ' +
                '              data-link="' + item.link + '">' +
                '        Add to Cart' +
                '      </button>' +
                '      <button class="btn-remove-wishlist js-remove-wishlist-item" ' +
                '              data-name="' + item.name + '" ' +
                '              title="Remove from Wishlist">' +
                '        <i class="zmdi zmdi-delete"></i>' +
                '      </button>' +
                '    </div>' +
                '  </td>' +
                '</tr>';
            $tableBody.append(rowHtml);
        });
    }

    // Helper to get cookies by name
    function getCookieValue(name) {
        var result = document.cookie.match("(^|[^;]+)\\s*" + name + "\\s*=\\s*([^;]+)");
        return result ? decodeURIComponent(result.pop()) : "";
    }

    function syncAuthHeader() {
        // Consolidated under unified authentication flow in js/auth.js
    }

    // Intelligent category query routing and automatic isotope filter execution
    function initCategoryFilteringRouting() {
        var urlParams = new URLSearchParams(window.location.search);
        var category = urlParams.get('category');
        if (category) {
            var catName = category.toLowerCase().trim();
            var filterVal = '.' + catName;
            if (catName === 'bags' || catName === 'bag') {
                filterVal = '.bag';
            } else if (catName === 'watches' || catName === 'watch') {
                filterVal = '.watches';
            } else if (catName === 'shoes' || catName === 'shoe') {
                filterVal = '.shoes';
            } else if (catName === 'men' || catName === 'man') {
                filterVal = '.men';
            } else if (catName === 'women' || catName === 'woman') {
                filterVal = '.women';
            } else if (catName === 'all') {
                filterVal = '*';
            }
            
            var $topeContainer = $('.isotope-grid');
            var $btn = $('.filter-tope-group button[data-filter="' + filterVal + '"]');
            
            if ($btn.length && $topeContainer.length) {
                // Remove active class from all buttons
                $('.filter-tope-group button').removeClass('how-active1');
                // Select active category button
                $btn.addClass('how-active1');
                
                // Sync with combined filter state
                window.activeFilters.category = filterVal;
                if (typeof window.executeCombinedFilters === 'function') {
                    window.executeCombinedFilters();
                } else {
                    $topeContainer.isotope({ filter: filterVal });
                }
                
                // Soft scroll to the filtered storefront section so the user lands straight on the active visual catalogue!
                var $productCatalog = $('.bg0.m-t-23.p-b-140');
                if ($productCatalog.length) {
                    $('html, body').animate({
                        scrollTop: $productCatalog.offset().top - 85
                    }, 600);
                }
            }
        }
    }

    // Intelligent search query routing and automatic isotope filter execution
    function initSearchFilteringRouting() {
        var urlParams = new URLSearchParams(window.location.search);
        var searchVal = urlParams.get('search');
        if (searchVal) {
            searchVal = searchVal.toLowerCase().trim();
            var $topeContainer = $('.isotope-grid');
            
            if ($topeContainer.length) {
                // Remove active filter highlight from buttons
                $('.filter-tope-group button').removeClass('how-active1');
                
                // Sync with combined filter state
                window.activeFilters.searchQuery = searchVal;
                if (typeof window.executeCombinedFilters === 'function') {
                    window.executeCombinedFilters();
                } else {
                    $topeContainer.isotope({
                        filter: function() {
                            var name = $(this).find('.js-name-b2').text().toLowerCase();
                            return name.indexOf(searchVal) > -1;
                        }
                    });
                }
                
                // Soft scroll to product catalog grid section
                var $productCatalog = $('.bg0.m-t-23.p-b-140');
                if ($productCatalog.length) {
                    $('html, body').animate({
                        scrollTop: $productCatalog.offset().top - 85
                    }, 600);
                }
            }
        }
    }

    // Swap Filter & Search buttons and implement inline-expanding catalog search
    function initCatalogFilters() {
        // 1. Swap Search & Filter Buttons
        $('.js-show-search').each(function() {
            var $searchBtn = $(this);
            var $filterBtn = $searchBtn.siblings('.js-show-filter');
            if ($filterBtn.length) {
                $searchBtn.insertBefore($filterBtn);
                $searchBtn.addClass('m-r-8').removeClass('m-l-8');
                $filterBtn.removeClass('m-r-8');
            }
        });

        // 1b. Morph the search button into a self-contained expanding glass search capsule
        $('.js-show-search').each(function() {
            var $btn = $(this);
            if (!$btn.find('.js-search-input-field').length) {
                $btn.html(
                    '<i class="zmdi zmdi-search m-r-6 js-search-icon" style="transition: transform 0.4s; font-size: 15px; display: flex; align-items: center;"></i>' +
                    '<span class="js-search-label">Search</span>' +
                    '<input class="js-search-input-field" type="text" placeholder="Type to search..." autocomplete="off" />' +
                    '<div class="js-search-close-btn"><i class="zmdi zmdi-close"></i></div>'
                );
            }
        });

        // 2. Bind real-time input keyup filtering on the standard panel-search input
        var $input = $('.panel-search input[name="search-product"]');
        var $topeContainer = $('.isotope-grid');
        
        // Map dynamic metadata color & tag classes to isotope items
        $('.isotope-item').each(function() {
            var $item = $(this);
            var name = $item.find('.js-name-b2').text().toLowerCase();
            
            // Dynamic mappings for colors
            if (name.indexOf('ruffle') > -1 || name.indexOf('mesh') > -1 || name.indexOf('cotton') > -1) {
                $item.addClass('color-white');
            }
            if (name.indexOf('trench') > -1 || name.indexOf('check') > -1 || name.indexOf('converse') > -1) {
                $item.addClass('color-grey');
            }
            if (name.indexOf('shirt') > -1 || name.indexOf('trouser') > -1 || name.indexOf('pocket') > -1) {
                $item.addClass('color-blue');
            }
            if (name.indexOf('herschel') > -1 || name.indexOf('pretty') > -1 || name.indexOf('square') > -1) {
                $item.addClass('color-black');
            }
            if (name.indexOf('watch') > -1 || name.indexOf('jacket') > -1) {
                $item.addClass('color-green');
            }
            if (name.indexOf('converse') > -1 || name.indexOf('metallic') > -1 || name.indexOf('stripe') > -1) {
                $item.addClass('color-red');
            }
            
            // Fallback color
            if (!$item.hasClass('color-black') && !$item.hasClass('color-blue') && !$item.hasClass('color-grey') && !$item.hasClass('color-green') && !$item.hasClass('color-red') && !$item.hasClass('color-white')) {
                $item.addClass('color-black');
            }
            
            // Dynamic mappings for tags
            if (name.indexOf('shirt') > -1 || name.indexOf('t-shirt') > -1 || name.indexOf('ruffle') > -1) {
                $item.addClass('tag-fashion');
            }
            if (name.indexOf('herschel') > -1 || name.indexOf('watch') > -1 || name.indexOf('silver') > -1) {
                $item.addClass('tag-lifestyle');
            }
            if (name.indexOf('trouser') > -1 || name.indexOf('denim') > -1 || name.indexOf('coat') > -1) {
                $item.addClass('tag-denim');
            }
            if (name.indexOf('converse') > -1 || name.indexOf('pocket') > -1 || name.indexOf('stripe') > -1) {
                $item.addClass('tag-streetstyle');
            }
            if (name.indexOf('metallic') > -1 || name.indexOf('pretty') > -1 || name.indexOf('classic') > -1) {
                $item.addClass('tag-crafts');
            }
            
            // Fallback tag
            if (!$item.hasClass('tag-fashion') && !$item.hasClass('tag-lifestyle') && !$item.hasClass('tag-denim') && !$item.hasClass('tag-streetstyle') && !$item.hasClass('tag-crafts')) {
                $item.addClass('tag-fashion');
            }
        });

        // Combined filtering executor
        window.executeCombinedFilters = function() {
            if (!$topeContainer.length) return;
            
            var runFilter = function() {
                $topeContainer.isotope({
                    filter: function() {
                        var $item = $(this);
                        
                        // 1. Category Filter
                        if (window.activeFilters.category !== '*') {
                            if (!$item.hasClass(window.activeFilters.category.replace('.', ''))) {
                                return false;
                            }
                        }
                        
                        // 2. Price Range Filter
                        var priceText = $item.find('.stext-105').text().trim();
                        var priceVal = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
                        
                        if (window.activeFilters.priceRange !== 'all') {
                            if (window.activeFilters.priceRange === '0-50') {
                                if (priceVal < 0 || priceVal > 50) return false;
                            } else if (window.activeFilters.priceRange === '50-100') {
                                if (priceVal < 50 || priceVal > 100) return false;
                            } else if (window.activeFilters.priceRange === '100-150') {
                                if (priceVal < 100 || priceVal > 150) return false;
                            } else if (window.activeFilters.priceRange === '150-200') {
                                if (priceVal < 150 || priceVal > 200) return false;
                            } else if (window.activeFilters.priceRange === '200+') {
                                if (priceVal < 200) return false;
                            }
                        }
                        
                        // 3. Color Filter
                        if (window.activeFilters.color !== 'all') {
                            if (!$item.hasClass('color-' + window.activeFilters.color)) {
                                return false;
                            }
                        }
                        
                        // 4. Tag Filter
                        if (window.activeFilters.tag !== 'all') {
                            if (!$item.hasClass('tag-' + window.activeFilters.tag)) {
                                return false;
                            }
                        }
                        
                        // 5. Search Query Filter
                        if (window.activeFilters.searchQuery !== '') {
                            var name = $item.find('.js-name-b2').text().toLowerCase();
                            if (name.indexOf(window.activeFilters.searchQuery) === -1) {
                                return false;
                            }
                        }
                        
                        return true;
                    }
                });
            };

            // Trigger modern skeleton loading shimmer transition
            var $grid = $('.isotope-grid');
            if ($grid.length && !$('.skeleton-container').length) {
                // Create skeleton container
                var skeletonHtml = '<div class="row skeleton-container w-full" style="padding: 0 15px; transition: opacity 0.2s ease; width: 100%;">';
                for (var i = 0; i < 8; i++) {
                    skeletonHtml += 
                        '<div class="col-sm-6 col-md-4 col-lg-3 p-b-35">' +
                        '  <div class="skeleton-product">' +
                        '    <div class="skeleton-placeholder skeleton-product-pic"></div>' +
                        '    <div class="skeleton-placeholder skeleton-product-title"></div>' +
                        '    <div class="skeleton-placeholder skeleton-product-price"></div>' +
                        '  </div>' +
                        '</div>';
                }
                skeletonHtml += '</div>';
                
                var $skeletons = $(skeletonHtml).insertBefore($grid);
                
                // Hide grid with smooth fade
                $grid.css({ 'opacity': '0', 'pointer-events': 'none', 'transition': 'opacity 0.2s ease' });
                
                setTimeout(function() {
                    $skeletons.css('opacity', '0');
                    setTimeout(function() {
                        $skeletons.remove();
                        $grid.css({ 'opacity': '1', 'pointer-events': 'auto' });
                        runFilter();
                    }, 200);
                }, 500);
            } else {
                runFilter();
            }
        };

        // 3. Keyup Search listener (Synchronized across responsive inputs)
        var $inlineInput = $('.js-search-input-field');
        
        function handleSearchKeyup(query) {
            window.activeFilters.searchQuery = query;
            $('.filter-tope-group button').removeClass('how-active1');
            window.executeCombinedFilters();
        }
        
        if ($input.length) {
            $input.off('keyup').on('keyup', function() {
                var query = $(this).val().toLowerCase().trim();
                handleSearchKeyup(query);
            });
        }
        
        if ($inlineInput.length) {
            $inlineInput.off('keyup').on('keyup', function() {
                var query = $(this).val().toLowerCase().trim();
                handleSearchKeyup(query);
            });
        }

        // Intercept and toggle search trigger with self-contained expanding capsule micro-animations
        $('.js-show-search').off('click').on('click', function(e) {
            var isMobile = $(window).width() < 768;
            
            // Check if filter is open and close it
            if ($('.js-show-filter').hasClass('show-filter')) {
                $('.js-show-filter').removeClass('show-filter');
                $('.panel-filter').slideUp(400);
            }
            
            if (isMobile) {
                e.preventDefault();
                var $btn = $(this);
                // Mobile behavior: toggle standard panel-search dropdown
                $btn.removeClass('js-search-active');
                $btn.toggleClass('show-search');
                $('.panel-search').slideToggle(400);
            } else {
                // Desktop behavior: expand this capsule inline!
                var $btn = $(this);
                if (!$btn.hasClass('js-search-active')) {
                    e.preventDefault();
                    $btn.addClass('js-search-active');
                    
                    // Hide standard dropdown if open
                    $('.panel-search').hide();
                    
                    setTimeout(function() {
                        $btn.find('.js-search-input-field').focus();
                    }, 50);
                }
                // If already expanded, let click pass inside input (prevent default close)
            }
        });

        // Prevent click events inside input from collapsing the capsule
        $(document).on('click', '.js-search-input-field', function(e) {
            e.stopPropagation();
        });

        // Handle close button action specifically
        $(document).on('click', '.js-search-close-btn', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            var $btn = $(this).closest('.js-show-search');
            $btn.removeClass('js-search-active');
            $btn.removeClass('show-search');
            
            var $inputField = $btn.find('.js-search-input-field');
            $inputField.val('').blur();
            handleSearchKeyup('');
        });

        // 4. Sort By Column Click Handlers (Col 1)
        $('.filter-col1 a').off('click').on('click', function(e) {
            e.preventDefault();
            var $link = $(this);
            var text = $link.text().trim().toLowerCase();
            
            $('.filter-col1 a').removeClass('filter-link-active');
            $link.addClass('filter-link-active');
            
            if (text.indexOf('low to high') > -1) {
                $topeContainer.isotope({ sortBy: 'price', sortAscending: true });
            } else if (text.indexOf('high to low') > -1) {
                $topeContainer.isotope({ sortBy: 'price', sortAscending: false });
            } else {
                $topeContainer.isotope({ sortBy: 'original-order' });
            }
        });

        // 5. Price Column Click Handlers (Col 2)
        $('.filter-col2 a').off('click').on('click', function(e) {
            e.preventDefault();
            var $link = $(this);
            var text = $link.text().trim().toLowerCase();
            
            $('.filter-col2 a').removeClass('filter-link-active');
            $link.addClass('filter-link-active');
            
            if (text.indexOf('all') > -1) {
                window.activeFilters.priceRange = 'all';
            } else if (text.indexOf('0.00') > -1) {
                window.activeFilters.priceRange = '0-50';
            } else if (text.indexOf('50.00 - $100.00') > -1 || text.indexOf('50.00') > -1) {
                window.activeFilters.priceRange = '50-100';
            } else if (text.indexOf('100.00 - $150.00') > -1 || text.indexOf('100.00') > -1) {
                window.activeFilters.priceRange = '100-150';
            } else if (text.indexOf('150.00 - $200.00') > -1 || text.indexOf('150.00') > -1) {
                window.activeFilters.priceRange = '150-200';
            } else if (text.indexOf('200.00+') > -1 || text.indexOf('200+') > -1) {
                window.activeFilters.priceRange = '200+';
            }
            
            window.executeCombinedFilters();
        });

        // 6. Color Column Click Handlers (Col 3)
        $('.filter-col3 a').off('click').on('click', function(e) {
            e.preventDefault();
            var $link = $(this);
            var text = $link.text().trim().toLowerCase();
            
            $('.filter-col3 a').removeClass('filter-link-active');
            $link.addClass('filter-link-active');
            
            window.activeFilters.color = text;
            window.executeCombinedFilters();
        });

        // 7. Tags Column Click Handlers (Col 4)
        $("<style>.active-tag-premium { border-color: #717fe0 !important; color: #717fe0 !important; font-family: Poppins-Medium; }</style>").appendTo("head");
        $('.filter-col4 a').off('click').on('click', function(e) {
            e.preventDefault();
            var $link = $(this);
            var text = $link.text().trim().toLowerCase();
            
            if ($link.hasClass('active-tag-premium')) {
                // Toggle off if clicked again!
                $link.removeClass('active-tag-premium');
                window.activeFilters.tag = 'all';
            } else {
                $('.filter-col4 a').removeClass('active-tag-premium');
                $link.addClass('active-tag-premium');
                window.activeFilters.tag = text;
            }
            
            window.executeCombinedFilters();
        });

        // 8. Integrate with Category Tope Group buttons so they update the activeFilters state too!
        $('.filter-tope-group button').off('click').on('click', function() {
            var $btn = $(this);
            var filterValue = $btn.attr('data-filter');
            
            $('.filter-tope-group button').removeClass('how-active1');
            $btn.addClass('how-active1');
            
            window.activeFilters.category = filterValue;
            window.executeCombinedFilters();
        });
    }

    // Dynamic Product Detail Page (PDP) reviews, rating persistence, and tab synchronization
    function initPDPReviews() {
        var productName = $('.js-name-detail').first().text().trim();
        if (!productName) return; // Not on a product detail page
        
        var reviewsKey = 'reviews_' + productName.replace(/\s+/g, '_');
        var reviews = [];
        try {
            reviews = JSON.parse(localStorage.getItem(reviewsKey)) || [];
        } catch (e) {
            reviews = [];
        }
        
        // 1. Pre-populate high-quality mock reviews if none exist
        if (reviews.length === 0) {
            reviews = [
                {
                    name: "Sai Ganesh",
                    email: "sai@ganeshstore.com",
                    rating: 5,
                    review: "This product exceeds all my expectations! The fabric is incredibly premium, stitching is spotless, and the fit is absolutely perfect. A true masterpiece!",
                    date: "May 20, 2026"
                },
                {
                    name: "Olivia Vance",
                    email: "olivia@vance.net",
                    rating: 4,
                    review: "Excellent design and very comfortable. Perfect for standard daily wear. Shipping was remarkably fast too! Strongly recommended.",
                    date: "May 18, 2026"
                }
            ];
            localStorage.setItem(reviewsKey, JSON.stringify(reviews));
        }

        // 2. Clear hardcoded reviews and inject dynamic wrapper
        var $pB30 = $('#reviews').find('.p-b-30.m-lr-15-sm');
        if ($pB30.length) {
            $pB30.find('.flex-w.flex-t.p-b-68').remove(); // remove old static block
            
            var $list = $pB30.find('.js-reviews-list');
            if (!$list.length) {
                $list = $('<div class="js-reviews-list"></div>');
                $pB30.prepend($list);
            }
            
            // Render function
            function renderPDPReviews(reviewList) {
                $list.empty();
                
                // Calculate ratings breakdown dynamically
                var total = reviewList.length;
                var avg = 0;
                var counts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
                if (total > 0) {
                    var sum = 0;
                    reviewList.forEach(function(item) {
                        var r = Math.round(item.rating);
                        if (r >= 1 && r <= 5) {
                            counts[r]++;
                            sum += item.rating;
                        }
                    });
                    avg = (sum / total).toFixed(1);
                } else {
                    avg = "0.0";
                }

                // Create Summary Breakdown Card
                var summaryHtml = 
                    '<div class="row js-reviews-summary" style="background: rgba(255, 255, 255, 0.45); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border: 1px solid rgba(0, 0, 0, 0.05); border-radius: 16px; margin-bottom: 40px; padding: 24px; box-shadow: 0 8px 30px rgba(0,0,0,0.02); display: flex; width: 100%;">' +
                    '  <div class="col-sm-4 text-center d-flex flex-column align-items-center justify-content-center" style="border-right: 1px solid rgba(0,0,0,0.06); padding-right: 20px; display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
                    '    <h1 style="font-size: 56px; font-family: Poppins-Bold; line-height: 1; margin: 0; color: #222;">' + avg + '</h1>' +
                    '    <div class="fs-18 cl11 m-t-10 m-b-5" style="margin-top: 10px; margin-bottom: 5px;">';
                
                var roundedAvg = Math.round(avg);
                for (var s = 1; s <= 5; s++) {
                    if (s <= roundedAvg) {
                        summaryHtml += '<i class="zmdi zmdi-star m-r-2" style="color: #f9ba48; font-size: 18px;"></i>';
                    } else {
                        summaryHtml += '<i class="zmdi zmdi-star-outline m-r-2" style="color: #ccc; font-size: 18px;"></i>';
                    }
                }
                
                summaryHtml += 
                    '    </div>' +
                    '    <span class="stext-102 cl9" style="font-size: 13px; font-family: Poppins-Regular;">' + total + ' Verified Reviews</span>' +
                    '  </div>' +
                    '  <div class="col-sm-8 p-l-25" style="display: flex; flex-direction: column; gap: 8px; justify-content: center; flex: 1;">';
                
                [5, 4, 3, 2, 1].forEach(function(star) {
                    var pct = total > 0 ? Math.round((counts[star] / total) * 100) : 0;
                    summaryHtml += 
                        '    <div style="display: flex; align-items: center; gap: 10px; font-size: 13px;">' +
                        '      <span style="width: 50px; font-family: Poppins-Medium; color: #555; text-align: left;">' + star + ' Star</span>' +
                        '      <div style="flex: 1; height: 8px; background: rgba(0,0,0,0.04); border-radius: 4px; overflow: hidden;">' +
                        '        <div style="width: ' + pct + '%; height: 100%; background: linear-gradient(90deg, #9b51e0, #3081ed); border-radius: 4px; transition: width 1s cubic-bezier(0.25, 0.8, 0.25, 1);"></div>' +
                        '      </div>' +
                        '      <span style="width: 35px; text-align: right; color: #888; font-family: Poppins-Regular;">' + pct + '%</span>' +
                        '    </div>';
                });
                
                summaryHtml += 
                    '  </div>' +
                    '</div>';

                // Prepend or replace summary block
                var $prevSummary = $pB30.find('.js-reviews-summary');
                if ($prevSummary.length) {
                    $prevSummary.replaceWith(summaryHtml);
                } else {
                    $pB30.prepend(summaryHtml);
                }

                // Render reviews logs
                reviewList.forEach(function(item) {
                    var starHtml = '';
                    for (var k = 1; k <= 5; k++) {
                        if (k <= item.rating) {
                            starHtml += '<i class="zmdi zmdi-star m-r-2" style="color: #f9ba48;"></i>';
                        } else {
                            starHtml += '<i class="zmdi zmdi-star-outline m-r-2" style="color: #ccc;"></i>';
                        }
                    }
                    
                    var avatarNum = Math.floor(Math.random() * 3) + 1; // mock avatars 1, 2, 3
                    var itemHtml = 
                        '<div class="flex-w flex-t p-b-40" style="border-bottom: 1px solid #f2f2f2; margin-bottom: 30px; padding-bottom: 10px; transition: all 0.5s ease;">' +
                        '  <div class="wrap-pic-s size-109 bor0 of-hidden m-r-18 m-t-6" style="border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">' +
                        '    <img src="images/avatar-0' + avatarNum + '.jpg" alt="AVATAR" onerror="this.src=\'images/icons/logo-01.png\';">' +
                        '  </div>' +
                        '  <div class="size-207">' +
                        '    <div class="flex-w flex-sb-m p-b-10">' +
                        '      <span class="mtext-107 cl2 p-r-20" style="font-family: Poppins-Medium; font-size: 15px;">' + item.name + '</span>' +
                        '      <span class="fs-14 cl11">' + starHtml + '</span>' +
                        '    </div>' +
                        '    <span class="stext-102 cl9" style="font-size: 12px; display: block; margin-bottom: 8px;">' + item.date + '</span>' +
                        '    <p class="stext-102 cl6" style="line-height: 1.6; font-size: 14px;">' + item.review + '</p>' +
                        '  </div>' +
                        '</div>';
                    $list.append(itemHtml);
                });
                
                // Sync tab counts
                var $reviewTabLink = $('a[href="#reviews"], a[data-toggle="tab"]:contains("Reviews")');
                if ($reviewTabLink.length) {
                    $reviewTabLink.text('Reviews (' + reviewList.length + ')');
                }
            }
            
            // Supabase Database Integration for PDP Reviews
            if (window.supabaseClient) {
                window.supabaseClient
                    .from('reviews')
                    .select('*')
                    .eq('product_name', productName)
                    .order('created_at', { ascending: false })
                    .then(function(res) {
                        if (res.data && res.data.length > 0) {
                            var dbReviews = res.data.map(function(r) {
                                return {
                                    name: r.reviewer_name,
                                    email: r.email,
                                    rating: r.rating,
                                    review: r.comment,
                                    date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                };
                            });
                            renderPDPReviews(dbReviews);
                        } else {
                            renderPDPReviews(reviews);
                        }
                    });
            } else {
                renderPDPReviews(reviews);
            }
            
            // 3. Handle review form submission
            $(document).off('submit', '#reviews form').on('submit', '#reviews form', function(e) {
                e.preventDefault();
                var $form = $(this);
                var name = $form.find('#name').val().trim();
                var email = $form.find('#email').val().trim();
                var reviewText = $form.find('#review').val().trim();
                var rating = parseInt($form.find('input[name="rating"]').val()) || 0;
                
                if (!name || !email || !reviewText || rating === 0) {
                    if (typeof swal === 'function') {
                        swal("Incomplete Form", "Please provide your name, email, rating stars, and a review description!", "warning");
                    } else {
                        alert("Please complete all review fields and select a star rating!");
                    }
                    return;
                }
                
                var newReview = {
                    name: name,
                    email: email,
                    rating: rating,
                    review: reviewText,
                    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                };

                function completeSubmission() {
                    $form[0].reset();
                    $form.find('.wrap-rating .item-rating').removeClass('zmdi-star').addClass('zmdi-star-outline');
                    $form.find('input[name="rating"]').val(0);
                    
                    if (typeof swal === 'function') {
                        swal("Review Submitted", "Thank you! Your feedback has been published.", "success");
                    }
                }

                if (window.supabaseClient) {
                    window.supabaseClient
                        .from('reviews')
                        .insert({
                            product_name: productName,
                            reviewer_name: name,
                            email: email,
                            rating: rating,
                            comment: reviewText
                        })
                        .then(function(res) {
                            window.supabaseClient
                                .from('reviews')
                                .select('*')
                                .eq('product_name', productName)
                                .order('created_at', { ascending: false })
                                .then(function(updatedRes) {
                                    if (updatedRes.data) {
                                        var dbReviews = updatedRes.data.map(function(r) {
                                            return {
                                                name: r.reviewer_name,
                                                email: r.email,
                                                rating: r.rating,
                                                review: r.comment,
                                                date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                            };
                                        });
                                        renderPDPReviews(dbReviews);
                                    }
                                    completeSubmission();
                                });
                        });
                } else {
                    reviews.unshift(newReview);
                    localStorage.setItem(reviewsKey, JSON.stringify(reviews));
                    renderPDPReviews(reviews);
                    completeSubmission();
                }
            });
        }
    }

    // Run initialization on DOM load
    $(document).ready(function() {
        initWishlist();
        initCart();
        initCatalogFilters();
        initPDPReviews();
        initPremiumPDPSwatches();
        initPDPPanZoom();
        initPDPPricingBadges();
        initCheckout();
        $(window).on('load', function() {
            initWishlist();
            initCart();
            initCategoryFilteringRouting();
            initSearchFilteringRouting();
            initCheckout();
        });
    });

    // Premium Frosted Glass Toast Notification System
    function showPremiumToast(message, type, options) {
        var $container = $('#premium-toast-container');
        if (!$container.length) {
            $container = $('<div id="premium-toast-container"></div>');
            $('body').append($container);
        }
        
        var iconHtml = '';
        var imgHtml = '';
        var titleHtml = '';
        
        if (type === 'success') {
            // Heart icon with gorgeous custom toast-cherry-gradient matching premium wishlist cherry red
            iconHtml = 
                '<svg viewBox="0 0 24 24" width="20" height="20" style="margin-right: 12px; flex-shrink: 0; filter: drop-shadow(0 2px 4px rgba(255, 51, 102, 0.15));">' +
                '  <defs>' +
                '    <linearGradient id="toast-cherry-gradient" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '      <stop offset="0%" stop-color="#ff3366" />' +
                '      <stop offset="100%" stop-color="#d91444" />' +
                '    </linearGradient>' +
                '  </defs>' +
                '  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="url(#toast-cherry-gradient)" />' +
                '</svg>';
        } else if (type === 'cart-success') {
            // Sleek Cart Drop Micro-Animated SVG Shopping Cart
            iconHtml = 
                '<svg class="premium-cart-svg" viewBox="0 0 24 24" width="24" height="24" style="margin-right: 12px; flex-shrink: 0; filter: drop-shadow(0 2px 5px rgba(255, 51, 102, 0.22)); overflow: visible;">' +
                '  <defs>' +
                '    <linearGradient id="toast-cart-gradient" x1="0%" y1="0%" x2="100%" y2="100%">' +
                '      <stop offset="0%" stop-color="#ff3366" />' +
                '      <stop offset="100%" stop-color="#d91444" />' +
                '    </linearGradient>' +
                '  </defs>' +
                '  <rect class="premium-cart-package" x="11" y="2" width="5" height="5" rx="1.5" fill="url(#toast-cart-gradient)" />' +
                '  <g class="premium-cart-body">' +
                '    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" fill="none" stroke="url(#toast-cart-gradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />' +
                '    <circle cx="9" cy="21" r="2" fill="url(#toast-cart-gradient)" />' +
                '    <circle cx="20" cy="21" r="2" fill="url(#toast-cart-gradient)" />' +
                '  </g>' +
                '</svg>';
            
            if (options && options.image) {
                imgHtml = '<img src="' + options.image + '" style="width: 42px; height: 42px; object-fit: cover; border-radius: 6px; margin-right: 12px; border: 1px solid rgba(0,0,0,0.06); flex-shrink: 0;">';
            }
            titleHtml = '<span class="premium-toast-title" style="display: block; font-weight: 600; color: #111; font-size: 14px; margin-bottom: 2px; font-family: \'Montserrat\', sans-serif;">Successfully Added</span>';
        } else {
            // Information/Removal circle icon
            iconHtml = 
                '<svg viewBox="0 0 24 24" width="20" height="20" style="margin-right: 12px; flex-shrink: 0;" fill="none" stroke="#888" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
                '  <circle cx="12" cy="12" r="10"></circle>' +
                '  <line x1="12" y1="16" x2="12" y2="12"></line>' +
                '  <line x1="12" y1="8" x2="12.01" y2="8"></line>' +
                '</svg>';
        }
        
        var toastId = 'toast-' + Date.now();
        var contentInner = iconHtml + imgHtml;
        if (titleHtml) {
            contentInner += '<div class="premium-toast-text" style="display: flex; flex-direction: column; flex-grow: 1;">' +
                            titleHtml +
                            '  <span class="premium-toast-message">' + message + '</span>' +
                            '</div>';
        } else {
            contentInner += '<span class="premium-toast-message" style="flex-grow: 1;">' + message + '</span>';
        }
        
        var toastHtml = 
            '<div id="' + toastId + '" class="premium-toast-item">' +
            '  <div class="premium-toast-content">' +
            contentInner +
            '  </div>' +
            '  <button class="premium-toast-close">&times;</button>' +
            '</div>';
            
        var $toast = $(toastHtml);
        $container.append($toast);
        
        // Force browser layout reflow to guarantee starting transition states are registered
        if ($toast.length) {
            var reflow = $toast[0].offsetHeight;
        }
        
        // Entrance transition with protective delay
        setTimeout(function() {
            $toast.addClass('toast-show');
        }, 30);
        
        // Auto dismiss after 3 seconds
        var autoTimer = setTimeout(function() {
            closeToast();
        }, 3000);
        
        function closeToast() {
            clearTimeout(autoTimer);
            $toast.removeClass('toast-show');
            setTimeout(function() {
                $toast.remove();
            }, 400);
        }
        
        // Manual dismiss on close click
        $toast.find('.premium-toast-close').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            closeToast();
        });
    }

    // Handle click on product grid heart icons
    $(document).on('click', '.js-addwish-b2', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        var $btn = $(this);
        var $block = $btn.closest('.block2');
        var name = $block.find('.js-name-b2').text().trim();
        var price = $block.find('.stext-105').text().trim();
        var img = $block.find('.block2-pic img').attr('src');
        var link = $block.find('.block2-txt-child1 a').attr('href');
        
        var wishlist = getWishlist();
        var itemIndex = wishlist.findIndex(function(item) {
            return item.name === name;
        });

        if (itemIndex > -1) {
            // Remove from wishlist (toggle off)
            wishlist.splice(itemIndex, 1);
            saveWishlist(wishlist);
            $btn.removeClass('js-addedwish-b2');
            showPremiumToast('<strong>' + name + '</strong> has been removed from your wishlist.', 'info');
        } else {
            // Add to wishlist
            var newItem = {
                name: name,
                price: price,
                image: img,
                link: link
            };
            wishlist.push(newItem);
            saveWishlist(wishlist);
            $btn.addClass('js-addedwish-b2');
            showPremiumToast('<strong>' + name + '</strong> has been added to your wishlist.', 'success');
        }
    });

    // Handle click on PDP detail heart button contextually
    $(document).on('click', '.js-addwish-detail', function(e) {
        e.preventDefault();
        
        var $btn = $(this);
        var $row = $btn.closest('.row');
        
        var name = $row.find('.js-name-detail').first().text().trim();
        if (!name) {
            name = $('.js-name-detail').first().text().trim();
        }
        
        var price = $row.find('.mtext-106').first().text().trim();
        if (!price) {
            price = $('.mtext-106').first().text().trim();
        }
        
        var img = $row.find('.wrap-pic-w img').first().attr('src') || $row.find('img').first().attr('src');
        if (!img) {
            img = $('.slick3 img').first().attr('src') || 'images/product-detail-01.jpg';
        }
        
        var link = window.location.pathname.split('/').pop() || 'product-detail.html';
        if (link === 'wishlist.html' || link === '') {
            link = 'product-detail.html';
        }
        
        var wishlist = getWishlist();
        var itemIndex = wishlist.findIndex(function(item) {
            return item.name === name;
        });

        if (itemIndex > -1) {
            // Remove from wishlist
            wishlist.splice(itemIndex, 1);
            saveWishlist(wishlist);
            
            // Sync all matching detail buttons on the page (in case there's a modal and a main button)
            $('.js-addwish-detail').each(function() {
                var btnName = $(this).closest('.row').find('.js-name-detail').first().text().trim();
                if (!btnName) btnName = $('.js-name-detail').first().text().trim();
                if (btnName === name) {
                    $(this).removeClass('js-addedwish-detail');
                }
            });
            
            showPremiumToast('<strong>' + name + '</strong> has been removed from your wishlist.', 'info');
        } else {
            // Add to wishlist
            var newItem = {
                name: name,
                price: price,
                image: img,
                link: link
            };
            wishlist.push(newItem);
            saveWishlist(wishlist);
            
            // Sync all matching detail buttons on the page
            $('.js-addwish-detail').each(function() {
                var btnName = $(this).closest('.row').find('.js-name-detail').first().text().trim();
                if (!btnName) btnName = $('.js-name-detail').first().text().trim();
                if (btnName === name) {
                    $(this).addClass('js-addedwish-detail');
                }
            });
            
            showPremiumToast('<strong>' + name + '</strong> has been added to your wishlist.', 'success');
        }
    });

    // Handle Remove from Wishlist Table Click
    $(document).on('click', '.js-remove-wishlist-item', function() {
        var name = $(this).attr('data-name');
        var $row = $(this).closest('.table_row');
        
        var wishlist = getWishlist();
        var index = wishlist.findIndex(function(item) {
            return item.name === name;
        });

        if (index > -1) {
            wishlist.splice(index, 1);
            saveWishlist(wishlist);
            
            // Premium fade out transition animation
            $row.css({
                'opacity': '0',
                'transform': 'translateX(-30px)'
            });
            
            setTimeout(function() {
                $row.remove();
                if (getWishlist().length === 0) {
                    $('#wishlist-content').addClass('dis-none');
                    $('#wishlist-empty-state').removeClass('dis-none');
                }
            }, 500);
            
            showPremiumToast('<strong>' + name + '</strong> has been removed from your wishlist.', 'info');
        }
    });

    // Handle Add to Cart from Wishlist Click
    $(document).off('click', '.js-add-cart-from-wishlist').on('click', '.js-add-cart-from-wishlist', function(e) {
        e.preventDefault();
        var $btn = $(this);
        if ($btn.hasClass('is-loading')) return;

        var name = $btn.attr('data-name');
        var price = $btn.attr('data-price');
        var img = $btn.attr('data-image');
        var size = "Size M"; // default
        var color = "Default Color"; // default
        var qty = 1;

        $btn.addClass('is-loading');

        setTimeout(function() {
            $btn.removeClass('is-loading');

            var cart = getCart();
            var existingItem = cart.find(function(item) {
                return item.name === name && item.size === size && item.color === color;
            });

            if (existingItem) {
                existingItem.quantity = (parseInt(existingItem.quantity) || 1) + qty;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    image: img,
                    quantity: qty,
                    size: size,
                    color: color
                });
            }

            saveCart(cart);
            renderSideDrawerCart();

            showPremiumToast('<strong>' + name + '</strong> (' + size + ' / ' + color + ') has been added to your cart.', 'cart-success', {
                image: img
            });
        }, 1200);
    });

    /*==================================================================
    [ Cart Functionality Integration ]*/
    
    var activeDiscountPercentage = parseInt(sessionStorage.getItem('activeDiscountPercentage')) || 0;

    // Helper to get cart from localStorage
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('cartItems')) || [];
        } catch (e) {
            return [];
        }
    }

    // Helper to save cart to localStorage
    function saveCart(cart) {
        localStorage.setItem('cartItems', JSON.stringify(cart));
        updateCartBadges();
        if (typeof syncCartToSupabase === 'function') {
            syncCartToSupabase();
        }
    }

    // Helper to update all header cart badges
    function updateCartBadges() {
        var cart = getCart();
        var totalQuantity = cart.reduce(function(total, item) {
            return total + (parseInt(item.quantity) || 1);
        }, 0);
        
        // Update both desktop and mobile header cart badges
        $('.js-show-cart').each(function() {
            $(this).attr('data-notify', totalQuantity);
        });
    }

    // Initialize all cart interactions on load
    function initCart() {
        // 1. Rewrite all header/mobile-header cart icons to point directly to shoping-cart.html but open drawer dynamically
        $('.js-show-cart').each(function() {
            $(this).attr('href', 'shoping-cart.html');
        });

        // Rewrite Check Out buttons inside the drawer dynamically
        $('.header-cart-buttons a').each(function() {
            if ($(this).text().trim() === 'Check Out') {
                $(this).attr('href', 'checkout.html');
            }
        });

        $('.js-show-cart').off('click').on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            $('.js-panel-cart').addClass('show-header-cart');
            renderSideDrawerCart();
        });

        // 2. Update badges and render panels immediately
        updateCartBadges();
        renderSideDrawerCart();

        // 3. Clear existing inline click handlers that would double-fire
        setTimeout(function() {
            $('.js-addcart-detail').off('click');
        }, 150);

        // 4. Render shopping cart page if on shoping-cart.html
        renderCartPage();

        // 5. Handle Coupon Code Submission
        $(document).on('click', '.size-118', function(e) {
            e.preventDefault();
            var $btn = $(this);
            if ($btn.hasClass('is-loading')) return;

            var $couponInput = $('input[name="coupon"]');
            var couponCode = $couponInput.val().trim().toUpperCase();

            if (!couponCode) {
                if (typeof swal === 'function') {
                    swal("Empty Code", "Please enter a coupon code first.", "warning");
                }
                return;
            }

            $btn.addClass('is-loading');

            setTimeout(function() {
                $btn.removeClass('is-loading');
                
                if (couponCode === 'GEMINI20' || couponCode === 'GANESH20') {
                    activeDiscountPercentage = 20;
                    sessionStorage.setItem('activeDiscountPercentage', '20');
                    sessionStorage.setItem('activeCouponCode', couponCode);
                    updateCartPageTotals();
                    if (typeof swal === 'function') {
                        swal("Coupon Applied!", "Coupon '" + couponCode + "' successfully applied. You received a 20% discount on all items!", "success");
                    }
                } else {
                    activeDiscountPercentage = 0;
                    sessionStorage.removeItem('activeDiscountPercentage');
                    sessionStorage.removeItem('activeCouponCode');
                    updateCartPageTotals();
                    if (typeof swal === 'function') {
                        swal("Invalid Coupon", "The coupon code '" + couponCode + "' is invalid, expired, or does not exist.", "error");
                    }
                }
            }, 1200);
        });

        // 6. Handle Proceed to Checkout form submission (redirect to dedicated checkout page)
        $(document).on('submit', '#cart-form', function(e) {
            e.preventDefault();
            window.location.href = 'checkout.html';
        });
    }

    // Dynamic rendering of the side drawer cart panel
    function renderSideDrawerCart() {
        var cart = getCart();
        var $cartWrap = $('.header-cart-wrapitem');
        var $cartTotal = $('.header-cart-total');
        
        if (!$cartWrap.length) return; // Cart drawer elements not present

        $cartWrap.empty();
        
        if (cart.length === 0) {
            $cartWrap.append('<li class="flex-col-c-m p-t-40 p-b-40 w-full text-center" style="list-style-type: none;"><i class="zmdi zmdi-shopping-cart-off m-b-15" style="font-size: 40px; color: #ccc;"></i><span class="stext-115 cl6">Your cart is empty</span></li>');
            $cartTotal.text('Total: $0.00');
            return;
        }

        var subtotal = 0;
        cart.forEach(function(item) {
            var priceNum = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
            var qty = parseInt(item.quantity) || 1;
            subtotal += priceNum * qty;
            
            var itemHtml = 
                '<li class="header-cart-item flex-w flex-t m-b-12" style="transition: all 0.5s ease; list-style-type: none;">' +
                '  <div class="header-cart-item-img js-remove-side-cart-item" title="Remove from Cart" ' +
                '       data-name="' + item.name + '" ' +
                '       data-size="' + item.size + '" ' +
                '       data-color="' + item.color + '">' +
                '    <img src="' + item.image + '" alt="IMG" />' +
                '  </div>' +
                '  <div class="header-cart-item-txt p-t-8">' +
                '    <a href="' + (item.link || 'product-detail.html') + '" class="header-cart-item-name m-b-8 hov-cl1 trans-04">' +
                '      ' + item.name +
                '    </a>' +
                '    <span class="header-cart-item-info" style="font-size: 12px; color: #888; display: block; margin-bottom: 4px;">' +
                '      ' + item.size + ' | ' + item.color +
                '    </span>' +
                '    <span class="header-cart-item-info">' +
                '      ' + qty + ' x ' + item.price +
                '    </span>' +
                '  </div>' +
                '</li>';
            $cartWrap.append(itemHtml);
        });

        $cartTotal.text('Total: $' + subtotal.toFixed(2));
    }

    // Handle dynamic side drawer item removal click
    $(document).on('click', '.js-remove-side-cart-item', function(e) {
        e.preventDefault();
        var $item = $(this).closest('.header-cart-item');
        var name = $(this).attr('data-name');
        var size = $(this).attr('data-size');
        var color = $(this).attr('data-color');
        
        var cart = getCart();
        var itemIndex = cart.findIndex(function(i) {
            return i.name === name && i.size === size && i.color === color;
        });

        if (itemIndex > -1) {
            cart.splice(itemIndex, 1);
            saveCart(cart);
            
            // Sync dynamic components
            renderCartPage();
            
            // Animating removal
            $item.css({
                'opacity': '0',
                'transform': 'translateX(30px)'
            });
            
            setTimeout(function() {
                $item.remove();
                renderSideDrawerCart();
            }, 500);

            if (typeof swal === 'function') {
                swal(name, "has been removed from your cart.", "info");
            }
        }
    });

    // Shopping Cart page dynamic rendering
    function renderCartPage() {
        var cart = getCart();
        var $form = $('#cart-form');
        var $emptyState = $('#cart-empty-state');
        var $table = $('.table-shopping-cart');

        if (!$form.length) return; // Not on shopping cart page

        if (cart.length === 0) {
            $form.addClass('dis-none');
            $emptyState.removeClass('dis-none');
            return;
        }

        $emptyState.addClass('dis-none');
        $form.removeClass('dis-none');

        // Clear existing dynamic rows, keeping the header (tr.table_head)
        $table.find('.table_row').remove();

        cart.forEach(function(item, index) {
            var priceNum = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
            var totalStr = '$ ' + (priceNum * (parseInt(item.quantity) || 1)).toFixed(2);
            
            var rowHtml = 
                '<tr class="table_row" style="transition: all 0.5s ease;">' +
                '  <td class="column-1">' +
                '    <div class="how-itemcart1 js-remove-cart-item" title="Remove from Cart" ' +
                '         data-name="' + item.name + '" ' +
                '         data-size="' + item.size + '" ' +
                '         data-color="' + item.color + '">' +
                '      <img src="' + item.image + '" alt="IMG">' +
                '    </div>' +
                '  </td>' +
                '  <td class="column-2">' +
                '    <span class="js-cart-item-name" style="font-family: Poppins-Medium; font-size: 15px; color: #333;">' + item.name + '</span>' +
                '    <br>' +
                '    <span style="font-size: 12px; color: #888;">' +
                '      Size: <span class="js-cart-item-size">' + item.size + '</span> | ' +
                '      Color: <span class="js-cart-item-color">' + item.color + '</span>' +
                '    </span>' +
                '  </td>' +
                '  <td class="column-3 stext-115">' + item.price + '</td>' +
                '  <td class="column-4">' +
                '    <div class="wrap-num-product flex-w m-l-auto m-r-0">' +
                '      <div class="btn-num-product-down cl8 hov-btn3 trans-04 flex-c-m">' +
                '        <i class="fs-16 zmdi zmdi-minus"></i>' +
                '      </div>' +
                '      <input class="mtext-104 cl3 txt-center num-product" type="number" ' +
                '             name="num-product' + (index + 1) + '" value="' + item.quantity + '">' +
                '      <div class="btn-num-product-up cl8 hov-btn3 trans-04 flex-c-m">' +
                '        <i class="fs-16 zmdi zmdi-plus"></i>' +
                '      </div>' +
                '    </div>' +
                '  </td>' +
                '  <td class="column-5 stext-115">' + totalStr + '</td>' +
                '</tr>';
            $table.append(rowHtml);
        });

        updateCartPageTotals();
        var storedCoupon = sessionStorage.getItem('activeCouponCode');
        if (storedCoupon) {
            $('input[name="coupon"]').val(storedCoupon);
        }
    }

    // Function to calculate and update the total amount
    function updateCartPageTotals() {
        var cart = getCart();
        var subtotal = 0;
        cart.forEach(function(item) {
            var priceNum = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
            var qty = parseInt(item.quantity) || 1;
            subtotal += priceNum * qty;
        });
        
        var discountAmount = subtotal * (activeDiscountPercentage / 100);
        var finalTotal = subtotal - discountAmount;
        
        var $totals = $('.mtext-110');
        if ($totals.length >= 2) {
            $totals.eq(0).text('$ ' + subtotal.toFixed(2));
            $totals.eq(1).text('$ ' + finalTotal.toFixed(2));
        } else {
            $totals.text('$ ' + finalTotal.toFixed(2));
        }

        // Render dynamic discount summary item elegantly
        $('.js-coupon-notice').remove();
        if (activeDiscountPercentage > 0) {
            var noticeHtml = 
                '<div class="flex-w flex-t p-t-8 p-b-8 js-coupon-notice" style="border-top: 1px dashed rgba(15, 118, 110, 0.2); margin-top: 8px;">' +
                '  <div class="size-208"><span class="stext-110" style="color: #0f766e; font-family: Poppins-Medium;">Discount (20%):</span></div>' +
                '  <div class="size-209"><span class="stext-110" style="color: #0f766e; font-family: Poppins-Medium;">- $ ' + discountAmount.toFixed(2) + '</span></div>' +
                '</div>';
            $('.bor12.p-t-15.p-b-30').first().before(noticeHtml);
        }
    }

    // Handle click on PDP detail "Add to cart" button contextually
    $(document).on('click', '.js-addcart-detail', function(e) {
        e.preventDefault();
        
        var $btn = $(this);
        if ($btn.hasClass('is-loading')) return; // Prevent duplicate clicks
        
        var $row = $btn.closest('.row');
        
        // Extract Name
        var name = $row.find('.js-name-detail').first().text().trim();
        if (!name) {
            name = $('.js-name-detail').first().text().trim();
        }
        
        // Extract Price
        var price = $row.find('.mtext-106').first().text().trim();
        if (!price) {
            price = $('.mtext-106').first().text().trim();
        }
        
        // Extract Image
        var img = $row.find('.wrap-pic-w img').first().attr('src') || $('.slick3 img').first().attr('src') || $row.find('img').first().attr('src') || 'images/product-detail-01.jpg';
        
        // Extract Quantity
        var qty = parseInt($row.find('.num-product').first().val()) || 1;
        
        // Dynamic Variable Selection Validation
        var size = "";
        var color = "";
        var validationFailed = false;
        var missingAttribute = "";

        $row.find('select').each(function() {
            var $select = $(this);
            var selectedVal = $select.val();
            
            var isSize = false;
            $select.find('option').each(function() {
                var optText = $(this).text().toLowerCase();
                if (optText.indexOf('size') > -1 || optText === 's' || optText === 'm' || optText === 'l' || optText === 'xl') {
                    isSize = true;
                }
            });
            
            var parentText = $select.closest('.flex-w').text().toLowerCase();
            if (parentText.indexOf('size') > -1) {
                isSize = true;
            }
            
            if (isSize) {
                if (!selectedVal || selectedVal === 'Choose an option') {
                    validationFailed = true;
                    missingAttribute = "Size";
                } else {
                    size = selectedVal;
                }
            } else {
                var isColor = false;
                $select.find('option').each(function() {
                    var optText = $(this).text().toLowerCase();
                    if (optText.indexOf('color') > -1 || optText === 'red' || optText === 'blue' || optText === 'white' || optText === 'grey' || optText === 'black') {
                        isColor = true;
                    }
                });
                if (parentText.indexOf('color') > -1) {
                    isColor = true;
                }
                
                if (!selectedVal || selectedVal === 'Choose an option') {
                    validationFailed = true;
                    missingAttribute = "Color";
                } else {
                    color = selectedVal;
                }
            }
        });

        // Enforce validations before proceeding
        if (validationFailed) {
            $row.find('select').each(function() {
                var $select = $(this);
                var selectedVal = $select.val();
                if (!selectedVal || selectedVal === 'Choose an option') {
                    var $target = $select.closest('.rs1-select2').next('.premium-swatch-container');
                    if (!$target.length) $target = $select.closest('.rs1-select2');
                    
                    var $rowContainer = $select.closest('.premium-option-row');
                    if (!$rowContainer.length) $rowContainer = $select.closest('.flex-w');
                    
                    // Trigger dynamic physical row shake
                    $rowContainer.addClass('premium-row-error');
                    setTimeout(function() {
                        $rowContainer.removeClass('premium-row-error');
                    }, 500);
                    
                    // Trigger glowing red border on missing container
                    $target.addClass('premium-swatch-error');
                    
                    // Remove error styling instantly when selection changes
                    $select.off('change.pdpvalidation').on('change.pdpvalidation', function() {
                        $target.removeClass('premium-swatch-error');
                    });
                }
            });
            return;
        }

        // Apply fallback if no dropdowns were present (non-configurable items)
        if (!size) size = "Size M";
        if (!color) color = "Default Color";

        // Trigger CTA loading spinner interaction
        $btn.addClass('is-loading');

        setTimeout(function() {
            $btn.removeClass('is-loading');
            
            // Add item to cart state
            var cart = getCart();
            var existingItem = cart.find(function(item) {
                return item.name === name && item.size === size && item.color === color;
            });

            if (existingItem) {
                existingItem.quantity = (parseInt(existingItem.quantity) || 1) + qty;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    image: img,
                    quantity: qty,
                    size: size,
                    color: color
                });
            }

            saveCart(cart);
            renderSideDrawerCart();
            
            // Trigger premium non-blocking toast notification
            showPremiumToast('<strong>' + name + '</strong> (' + size + ' / ' + color + ') has been added to your cart.', 'cart-success', {
                image: img
            });
        }, 1200);
    });

    // Handle delegated quantity decrease button click
    $(document).on('click', '.btn-num-product-down', function(e) {
        e.preventDefault();
        var $input = $(this).next('.num-product');
        if ($input.length) {
            var val = parseInt($input.val()) || 1;
            if (val > 1) {
                val--;
                $input.val(val).trigger('change');
                $input.addClass('pulse-highlight');
                setTimeout(function() {
                    $input.removeClass('pulse-highlight');
                }, 300);
            }
        }
    });

    // Handle delegated quantity increase button click
    $(document).on('click', '.btn-num-product-up', function(e) {
        e.preventDefault();
        var $input = $(this).prev('.num-product');
        if ($input.length) {
            var val = parseInt($input.val()) || 1;
            val++;
            $input.val(val).trigger('change');
            $input.addClass('pulse-highlight');
            setTimeout(function() {
                $input.removeClass('pulse-highlight');
            }, 300);
        }
    });

    // Handle delegated quantity input changes in table row
    $(document).on('change', '.num-product', function() {
        var $row = $(this).closest('.table_row');
        if (!$row.length) return; // Not in cart table row
        
        var name = $row.find('.js-cart-item-name').text().trim();
        var size = $row.find('.js-cart-item-size').text().trim();
        var color = $row.find('.js-cart-item-color').text().trim();
        var quantity = parseInt($(this).val()) || 1;
        if (quantity < 1) {
            quantity = 1;
            $(this).val(1);
        }

        var cart = getCart();
        var item = cart.find(function(i) {
            return i.name === name && i.size === size && i.color === color;
        });

        if (item) {
            item.quantity = quantity;
            saveCart(cart);
            
            // Recalculate row total
            var priceNum = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
            var totalStr = '$ ' + (priceNum * quantity).toFixed(2);
            $row.find('.column-5').text(totalStr);
            
            // Recalculate cart totals
            updateCartPageTotals();
        }
    });

    // Handle delegated item removal from table row click
    $(document).on('click', '.js-remove-cart-item', function(e) {
        e.preventDefault();
        var $row = $(this).closest('.table_row');
        var name = $row.find('.js-cart-item-name').text().trim();
        var size = $row.find('.js-cart-item-size').text().trim();
        var color = $row.find('.js-cart-item-color').text().trim();
        
        var cart = getCart();
        var itemIndex = cart.findIndex(function(i) {
            return i.name === name && i.size === size && i.color === color;
        });

        if (itemIndex > -1) {
            cart.splice(itemIndex, 1);
            saveCart(cart);
            
            // Premium fade out transition animation
            $row.css({
                'opacity': '0',
                'transform': 'translateX(-30px)',
                'transition': 'all 0.5s ease'
            });
            
            setTimeout(function() {
                $row.remove();
                if (getCart().length === 0) {
                    renderCartPage();
                } else {
                    updateCartPageTotals();
                }
            }, 500);
            
            // Trigger premium info toast notification
            showPremiumToast('<strong>' + name + '</strong> has been removed from your cart.', 'info');
        }
    });

    // Sync cart and wishlist with Supabase database
    function syncCartToSupabase() {
        if (!window.supabaseClient) return;
        var profile = null;
        try {
            profile = JSON.parse(localStorage.getItem('userProfile'));
        } catch(e) {}
        if (!profile) return;

        var cart = JSON.parse(localStorage.getItem('cartItems')) || [];
        
        window.supabaseClient
            .from('carts')
            .delete()
            .eq('user_id', profile.id)
            .then(function() {
                if (cart.length === 0) return;
                var rows = cart.map(function(item) {
                    return {
                        user_id: profile.id,
                        product_name: item.name,
                        price: item.price,
                        image_url: item.image,
                        quantity: item.quantity,
                        size: item.size,
                        color: item.color,
                        link: item.link || ''
                    };
                });
                window.supabaseClient.from('carts').insert(rows).then(function(res) {
                    if (res.error) console.error("Error syncing cart to database:", res.error);
                });
            });
    }

    function syncWishlistToSupabase() {
        if (!window.supabaseClient) return;
        var profile = null;
        try {
            profile = JSON.parse(localStorage.getItem('userProfile'));
        } catch(e) {}
        if (!profile) return;

        var wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        
        window.supabaseClient
            .from('wishlists')
            .delete()
            .eq('user_id', profile.id)
            .then(function() {
                if (wishlist.length === 0) return;
                var rows = wishlist.map(function(item) {
                    return {
                        user_id: profile.id,
                        product_name: item.name,
                        price: item.price,
                        image_url: item.image,
                        link: item.link || ''
                    };
                });
                window.supabaseClient.from('wishlists').insert(rows).then(function(res) {
                    if (res.error) console.error("Error syncing wishlist to database:", res.error);
                });
            });
    }

    // Intercept submit form on signin.html
    $(document).on('click', '.CSubmit', function(e) {
        if (!window.supabaseClient) return; // fallback to static login
        
        var name = $('.CName').val().trim();
        var phone = $('.CPhNum').val().trim();
        
        if (!name || !phone) return;
        
        e.preventDefault();
        e.stopPropagation();
        
        window.supabaseClient
            .from('profiles')
            .select('*')
            .eq('phone_number', phone)
            .then(function(response) {
                if (response.error) {
                    console.error("Supabase Profile Login Error:", response.error);
                    return;
                }
                var profile = response.data && response.data[0];
                if (profile) {
                    // Profile exists! Pull cart and wishlist
                    localStorage.setItem('userProfile', JSON.stringify(profile));
                    localStorage.setItem('user', 'loggedin');
                    
                    // Pull carts
                    window.supabaseClient
                        .from('carts')
                        .select('*')
                        .eq('user_id', profile.id)
                        .then(function(cartRes) {
                            if (cartRes.data) {
                                var dbCart = cartRes.data.map(function(c) {
                                    return {
                                        name: c.product_name,
                                        price: c.price,
                                        image: c.image_url,
                                        quantity: c.quantity,
                                        size: c.size,
                                        color: c.color,
                                        link: c.link || 'product-detail.html'
                                    };
                                });
                                localStorage.setItem('cartItems', JSON.stringify(dbCart));
                                updateCartBadges();
                            }
                            
                            // Pull wishlists
                            window.supabaseClient
                                .from('wishlists')
                                .select('*')
                                .eq('user_id', profile.id)
                                .then(function(wishRes) {
                                    if (wishRes.data) {
                                        var dbWish = wishRes.data.map(function(w) {
                                            return {
                                                name: w.product_name,
                                                price: w.price,
                                                image: w.image_url,
                                                link: w.link || 'product-detail.html'
                                            };
                                        });
                                        localStorage.setItem('wishlist', JSON.stringify(dbWish));
                                        updateWishlistBadges();
                                    }
                                    
                                    // Cookie credentials
                                    document.cookie = "CustomerName=" + encodeURIComponent(profile.full_name) + "; path=/;";
                                    document.cookie = "CustomerNumber=" + encodeURIComponent(profile.phone_number) + "; path=/;";
                                    
                                    if (typeof loginfun === 'function') {
                                        loginfun();
                                    }
                                    window.location.reload();
                                });
                        });
                } else {
                    // Profile doesn't exist, create a secure profile record
                    var newProfileId = crypto.randomUUID();
                    var newProfile = {
                        id: newProfileId,
                        full_name: name,
                        phone_number: phone
                    };
                    
                    window.supabaseClient
                        .from('profiles')
                        .insert(newProfile)
                        .then(function(insertRes) {
                            if (insertRes.error) {
                                console.error("Supabase Profile Insert Error:", insertRes.error);
                                return;
                            }
                            localStorage.setItem('userProfile', JSON.stringify(newProfile));
                            localStorage.setItem('user', 'loggedin');
                            
                            // Sync current offline state to database
                            syncCartToSupabase();
                            syncWishlistToSupabase();
                            
                            // Cookie credentials
                            document.cookie = "CustomerName=" + encodeURIComponent(name) + "; path=/;";
                            document.cookie = "CustomerNumber=" + encodeURIComponent(phone) + "; path=/;";
                            
                            if (typeof loginfun === 'function') {
                                loginfun();
                            }
                            window.location.reload();
                        });
                }
            });
    });

    // Intercept logout button
    $(document).on('click', '.CLogout, .js-global-logout', function(e) {
        if (typeof logoutUser === 'function') {
            logoutUser(e);
        } else {
            localStorage.removeItem('userProfile');
            localStorage.setItem('user', 'loggedout');
            localStorage.setItem('cartItems', '[]');
            localStorage.setItem('wishlist', '[]');
            document.cookie = "CustomerName=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            document.cookie = "CustomerNumber=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
            window.location.reload();
        }
    });

    /*==================================================================
    [ Sticky Mobile Cart Action Ribbon ]*/
    if ($('.js-addcart-detail').length > 0 && $(window).width() <= 576) {
        var productName = $('.js-name-detail').text().trim() || 'Product';
        var productPrice = $('.mtext-106').text().trim() || '';
        var productImg = $('.wrap-pic-w img').first().attr('src') || '';
        
        var stickyBarHtml = 
            '<div class="js-sticky-mobile-bar" style="position: fixed; bottom: -80px; left: 0; width: 100%; background: rgba(255,255,255,0.92); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-top: 1px solid rgba(0,0,0,0.08); box-shadow: 0 -6px 20px rgba(0,0,0,0.06); padding: 10px 20px; z-index: 999; display: flex; justify-content: space-between; align-items: center; transition: all 0.4s ease;">' +
            '  <div style="display: flex; align-items: center; gap: 10px;">' +
            '    <img src="' + productImg + '" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">' +
            '    <div style="display: flex; flex-direction: column;">' +
            '      <span style="font-family: Poppins-Medium; font-size: 12px; color: #222; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">' + productName + '</span>' +
            '      <span style="font-family: Poppins-Regular; font-size: 11px; color: #888;">' + productPrice + '</span>' +
            '    </div>' +
            '  </div>' +
            '  <button class="js-sticky-buy-trigger" style="background: linear-gradient(135deg, #9b51e0, #3081ed); border: none; color: #fff; padding: 8px 16px; border-radius: 20px; font-family: Poppins-Medium; font-size: 12px; cursor: pointer; box-shadow: 0 4px 10px rgba(155, 81, 224, 0.2); outline: none;">Add to Cart</button>' +
            '</div>';
        
        $('body').append(stickyBarHtml);
        
        $(window).on('scroll', function() {
            var $mainBtn = $('.js-addcart-detail');
            var triggerTop = $mainBtn.offset().top + $mainBtn.outerHeight();
            if ($(window).scrollTop() > triggerTop) {
                $('.js-sticky-mobile-bar').css('bottom', '0');
            } else {
                $('.js-sticky-mobile-bar').css('bottom', '-80px');
            }
        });
        
        $(document).on('click', '.js-sticky-buy-trigger', function() {
            $('.js-addcart-detail').trigger('click');
        });
    }

    // 1. Dynamic Option Swatches (Color & Size) Builder
    function initPremiumPDPSwatches() {
        // Size and Color swatches
        $('.rs1-select2').each(function() {
            var $originalContainer = $(this);
            var $select = $originalContainer.find('select.js-select2');
            if (!$select.length) return;
            
            // Check if this container already has premium swatches built next to it to avoid duplicates
            if ($originalContainer.next('.premium-swatch-container').length) return;
            
            var isSize = false;
            var isColor = false;
            var options = [];
            
            $select.find('option').each(function() {
                var text = $(this).text().trim();
                var val = $(this).val();
                if (text === 'Choose an option') return;
                
                if (text.toLowerCase().indexOf('size') > -1 || text === 'S' || text === 'M' || text === 'L' || text === 'XL') {
                    isSize = true;
                } else {
                    isColor = true;
                }
                
                options.push({ text: text, val: val });
            });
            
            if (options.length === 0) return;
            
            var $row = $originalContainer.closest('.flex-w');
            var $labelCol = $row.find('.size-203');
            var labelText = $labelCol.text().trim();
            
            // Re-style row into stacked option block
            $row.addClass('premium-option-row').removeClass('flex-w flex-r-m p-b-10');
            $labelCol.remove(); // Remove the old label column block entirely
            
            // Build the clean stacked title
            var $newLabel = $('<span class="premium-option-label">' + labelText + '</span>');
            $originalContainer.before($newLabel); // Place label above dropdown container
            $originalContainer.parent().removeClass('size-204 respon6-next');

            if (isSize) {
                // Build size pills grid
                $originalContainer.hide(); // Hide the select2 dropdown container
                
                var $pillContainer = $('<div class="size-pill-container premium-swatch-container"></div>');
                options.forEach(function(opt) {
                    var display = opt.text.replace(/size\s*/i, '').trim();
                    var $pill = $('<div class="size-pill-item" data-val="' + opt.val + '">' + display + '</div>');
                    
                    $pill.on('click', function() {
                        $pillContainer.removeClass('premium-swatch-error');
                        if ($(this).hasClass('active')) {
                            $(this).removeClass('active');
                            $select.val('Choose an option').trigger('change');
                        } else {
                            $pillContainer.find('.size-pill-item').removeClass('active');
                            $(this).addClass('active');
                            $select.val(opt.val).trigger('change');
                        }
                    });
                    
                    $pillContainer.append($pill);
                });
                
                $originalContainer.after($pillContainer);
            } else if (isColor) {
                // Build color circles swatches
                $originalContainer.hide(); // Hide select2
                
                var $colorContainer = $('<div class="color-swatch-container premium-swatch-container"></div>');
                
                // Color hex mapping for high-end aesthetics
                var colorMap = {
                    'red': '#ff3366',
                    'blue': '#3a86ff',
                    'white': '#ffffff',
                    'grey': '#8e9aaf',
                    'gray': '#8e9aaf',
                    'black': '#1a1a1a',
                    'green': '#0f766e'
                };
                
                options.forEach(function(opt) {
                    var colorKey = opt.text.toLowerCase().trim();
                    var hex = colorMap[colorKey] || '#cccccc';
                    
                    var style = 'background-color: ' + hex + ';';
                    if (colorKey === 'white') {
                        style += ' border: 1px solid rgba(0,0,0,0.1);';
                    }
                    
                    var $swatch = $('<div class="color-swatch-item" style="' + style + '" data-val="' + opt.val + '" title="' + opt.text + '"></div>');
                    
                    $swatch.on('click', function() {
                        $colorContainer.removeClass('premium-swatch-error');
                        if ($(this).hasClass('active')) {
                            $(this).removeClass('active');
                            $select.val('Choose an option').trigger('change');
                        } else {
                            $colorContainer.find('.color-swatch-item').removeClass('active');
                            $(this).addClass('active');
                            $select.val(opt.val).trigger('change');
                        }
                    });
                    
                    $colorContainer.append($swatch);
                });
                
                $originalContainer.after($colorContainer);
            }
        });

        // 2. Quantity & Add to Cart Action Row Alignment
        $('.wrap-num-product').each(function() {
            var $numProduct = $(this);
            
            // Guard against duplicate runs on load vs ready
            if ($numProduct.parent().hasClass('premium-qty-wrapper')) return;
            
            var $row = $numProduct.closest('.flex-r-m');
            var $innerWrapper = $numProduct.parent();
            
            // Wrap the quantity block in a labeled wrapper
            var $qtyWrapper = $('<div class="premium-qty-wrapper"></div>');
            var $qtyLabel = $('<span class="premium-option-label">QTY</span>');
            $numProduct.before($qtyWrapper);
            $qtyWrapper.append($qtyLabel).append($numProduct);
            
            // Shift classes to premium capsule action row
            $row.addClass('premium-action-outer-row').removeClass('flex-w flex-r-m p-b-10');
            $innerWrapper.addClass('premium-action-row').removeClass('size-204 flex-w flex-m respon6-next');
            
            // Relocate Wishlist CTA to be next to Add to Cart button as a primary action
            var $originalWish = $('.js-addwish-detail');
            if ($originalWish.length && !$innerWrapper.find('.js-addwish-detail-container').length) {
                var isAlreadyWish = $originalWish.hasClass('js-addedwish-detail');
                
                var wishSvg = 
                    '<svg viewBox="0 0 24 24">' +
                    '  <defs>' +
                    '    <linearGradient id="pdp-cherry-gradient" x1="0%" y1="0%" x2="100%" y2="100%">' +
                    '      <stop offset="0%" stop-color="#ff3366" />' +
                    '      <stop offset="100%" stop-color="#d91444" />' +
                    '    </linearGradient>' +
                    '  </defs>' +
                    '  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />' +
                    '</svg>';
                    
                var activeClass = isAlreadyWish ? ' wishlisted' : '';
                var $newWishBtn = $('<div class="js-addwish-detail-container' + activeClass + '" title="Add to Wishlist">' + wishSvg + '</div>');
                
                // Clicking the primary action triggers native click handler
                $newWishBtn.on('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    $originalWish.first().trigger('click');
                    
                    // Sync active status after animation/state update
                    setTimeout(function() {
                        var isWish = $originalWish.hasClass('js-addedwish-detail');
                        $newWishBtn.toggleClass('wishlisted', isWish);
                    }, 50);
                });
                
                // Add to the end of the action block row
                $innerWrapper.append($newWishBtn);
                
                // Hide the old wishlist divider/element from social bar to avoid duplicates, but preserve in DOM
                $originalWish.closest('.bor9').hide();
                
                // Periodically check/sync class to catch other triggers (like modal closing)
                setInterval(function() {
                    var isWish = $originalWish.hasClass('js-addedwish-detail');
                    $newWishBtn.toggleClass('wishlisted', isWish);
                }, 300);
            }
        });

        // 3. Social Share & Wishlist Left-Alignment (Remove inline offsets)
        $('.respon7').each(function() {
            var $shareRow = $(this);
            $shareRow.addClass('premium-share-row').removeClass('flex-w flex-m p-l-100 p-t-40 respon7');
        });
    }

    // 2. Interactive Cursor Pan-Zoom on Main Images
    function initPDPPanZoom() {
        $('.wrap-pic-w:not(.block1)').each(function() {
            var $container = $(this);
            var $img = $container.find('img');
            if (!$img.length) return;
            
            $container.off('mousemove.pdpzoom mouseleave.pdpzoom');
            
            $container.on('mousemove.pdpzoom', function(e) {
                var width = $container.width();
                var height = $container.height();
                
                var rect = this.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                
                var xPercent = (x / width) * 100;
                var yPercent = (y / height) * 100;
                
                $img.css('transform-origin', xPercent + '% ' + yPercent + '%');
            });
            
            $container.on('mouseleave.pdpzoom', function() {
                $img.css('transform-origin', 'center center');
            });
        });
    }

    // 3. Dynamic Free Shipping Badge Injection
    function initPDPPricingBadges() {
        $('.mtext-106').each(function() {
            var $price = $(this);
            if ($price.find('.free-shipping-badge').length) return;
            
            var badgeHtml = 
                '<span class="free-shipping-badge">' +
                '  <span class="free-shipping-dot"></span>' +
                '  Free Shipping Eligible' +
                '</span>';
                
            $price.append(badgeHtml);
        });
    }

    // ====================================================================
    // SECURE CHECKOUT PAGE ENGINE
    // ====================================================================
    function initCheckout() {
        var isCheckoutPage = window.location.pathname.indexOf('checkout.html') > -1;
        if (!isCheckoutPage) return;

        // 1. Guard against empty cart
        var cart = getCart();
        if (cart.length === 0) {
            showPremiumToast('Your shopping cart is empty. Redirecting to Shop...', 'info');
            setTimeout(function() {
                window.location.href = 'product.html';
            }, 2000);
            return;
        }

        // 2. Multi-tab Cart Syncing
        window.addEventListener('storage', function(e) {
            if (e.key === 'cartItems') {
                var updatedCart = getCart();
                if (updatedCart.length === 0) {
                    window.location.href = 'product.html';
                } else {
                    renderCheckoutSummary();
                }
            }
        });

        // 3. Render Checkout Summary Card & Mobile Summary
        var activeCouponDiscount = parseInt(sessionStorage.getItem('activeDiscountPercentage')) || 0; // percentage
        var shippingFee = 0; // standard is free

        function renderCheckoutSummary() {
            var currentCart = getCart();
            var $summaryList = $('.checkout-items-summary-list');
            var $mobileSummaryList = $('.mobile-summary-items-list');
            
            if (!$summaryList.length) return;
            
            $summaryList.empty();
            $mobileSummaryList.empty();

            var subtotal = 0;
            currentCart.forEach(function(item) {
                var priceNum = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
                var itemQty = parseInt(item.quantity) || 1;
                var totalItemPrice = priceNum * itemQty;
                subtotal += totalItemPrice;

                var itemHtml = 
                    '<div class="flex-w flex-t p-b-15 border-bottom-light m-b-15" style="align-items: center;">' +
                    '  <div style="width: 50px; height: 50px; border-radius: 8px; border: 1px solid rgba(0,0,0,0.06); overflow: hidden; margin-right: 15px; flex-shrink: 0;">' +
                    '    <img src="' + item.image + '" alt="IMG" style="width: 100%; height: 100%; object-fit: cover;" />' +
                    '  </div>' +
                    '  <div style="flex-grow: 1;">' +
                    '    <span class="stext-115 cl2" style="font-family: Poppins-Medium; display: block; font-size: 13.5px;">' + item.name + '</span>' +
                    '    <span class="stext-115 cl6" style="font-size: 11px;">Size: ' + item.size + ' | Color: ' + item.color + '</span>' +
                    '  </div>' +
                    '  <span class="stext-115 cl2" style="font-family: Poppins-Medium; flex-shrink: 0; padding-left: 10px;">' + itemQty + ' x ' + item.price + '</span>' +
                    '</div>';

                $summaryList.append(itemHtml);
                $mobileSummaryList.append(itemHtml);
            });

            // Calculate Shipping
            var isExpress = $('input[name="shipping_method_option"]:checked').val() === 'express';
            shippingFee = isExpress ? 15.00 : 0.00;

            // Calculate Coupon Discount
            var discountVal = subtotal * (activeCouponDiscount / 100);
            var finalTotal = subtotal - discountVal + shippingFee;

            // Sync Totals in summary card
            $('.js-checkout-subtotal').text('$ ' + subtotal.toFixed(2));
            $('.js-checkout-shipping').text(shippingFee > 0 ? '$ 15.00' : 'Free');
            
            if (activeCouponDiscount > 0) {
                $('.js-checkout-discount-row').show();
                $('#checkoutDiscountAmount').text('- $ ' + discountVal.toFixed(2));
            } else {
                $('.js-checkout-discount-row').hide();
            }

            $('.js-checkout-total').text('$ ' + finalTotal.toFixed(2));
            $('.js-mobile-total-summary').text('$ ' + finalTotal.toFixed(2));
            $('.js-upi-payment-total').text('$ ' + finalTotal.toFixed(2));
        }

        renderCheckoutSummary();

        // Pre-populate stored coupon if any
        var storedCoupon = sessionStorage.getItem('activeCouponCode');
        if (storedCoupon) {
            var $couponInput = $('input[name="checkout_coupon"]');
            $couponInput.val(storedCoupon);
            if (activeCouponDiscount > 0) {
                $couponInput.addClass('field-valid');
            }
        }

        // 4. Shipping Radio Selector click bindings
        $('input[name="shipping_method_option"]').on('change', function() {
            $('.shipping-method-option').removeClass('active-method');
            $(this).closest('.shipping-method-option').addClass('active-method');
            renderCheckoutSummary();
        });

        // 5. Autocomplete address list simulator
        var addressSuggestions = [
            "123 Main St, New York, NY 10001",
            "456 Broadway, New York, NY 10012",
            "789 Fashion Ave, New York, NY 10018",
            "101 Park Ave, New York, NY 10178",
            "202 Fifth Ave, New York, NY 10010"
        ];

        $('.autocomplete-address-input').on('focus keyup', function() {
            var val = $(this).val().toLowerCase().trim();
            var $dropdown = $('.address-autocomplete-list');
            $dropdown.empty();

            var filtered = addressSuggestions.filter(function(addr) {
                return addr.toLowerCase().indexOf(val) > -1;
            });

            if (filtered.length && $(this).is(':focus')) {
                filtered.forEach(function(addr) {
                    $dropdown.append('<div class="address-autocomplete-item">' + addr + '</div>');
                });
                $dropdown.show();
            } else {
                $dropdown.hide();
            }
        });

        $(document).on('click', '.address-autocomplete-item', function() {
            var selected = $(this).text();
            var parts = selected.split(', ');
            
            $('.autocomplete-address-input').val(parts[0]).trigger('input').trigger('change').removeClass('field-error').addClass('field-valid');
            $('input[name="city"]').val(parts[1]).trigger('input').trigger('change').removeClass('field-error').addClass('field-valid');
            
            var stateZip = parts[2].split(' ');
            $('input[name="state"]').val(stateZip[0]).trigger('input').trigger('change').removeClass('field-error').addClass('field-valid');
            $('input[name="postcode"]').val(stateZip[1]).trigger('input').trigger('change').removeClass('field-error').addClass('field-valid');
            
            $('.address-autocomplete-list').hide();
        });

        $(document).on('click', function(e) {
            if (!$(e.target).closest('.position-relative').length) {
                $('.address-autocomplete-list').hide();
            }
        });

        // 6. Interactive credit card updates & flips
        var $creditCard = $('#creditCard');
        
        $('#inputCardName').on('input', function() {
            var val = $(this).val().trim();
            $('#cardNameLabel').text(val ? val.toUpperCase() : 'YOUR NAME');
        });

        $('#inputCardNumber').on('input', function() {
            var val = $(this).val().replace(/\D/g, '');
            var formatted = val.match(/.{1,4}/g);
            var maskedVal = formatted ? formatted.join(' ') : '';
            $(this).val(maskedVal);
            $('#cardNoLabel').text(maskedVal ? maskedVal : '•••• •••• •••• ••••');
        });

        $('#inputCardExpiry').on('input', function() {
            var val = $(this).val().replace(/\D/g, '');
            if (val.length >= 2) {
                val = val.substring(0,2) + '/' + val.substring(2,4);
            }
            $(this).val(val);
            $('#cardExpiryLabel').text(val ? val : 'MM/YY');
        });

        $('#inputCardCvv').on('focus', function() {
            $creditCard.addClass('flipped');
        }).on('blur', function() {
            $creditCard.removeClass('flipped');
        }).on('input', function() {
            var val = $(this).val().replace(/\D/g, '');
            $(this).val(val);
            $('#cardCvvLabel').text(val ? val : '•••');
        });

        // 7. Payment Tab Switching
        $('.payment-tab-btn').on('click', function() {
            var tab = $(this).attr('data-tab');
            $('.payment-tab-btn').removeClass('active-tab');
            $(this).addClass('active-tab');

            $('.payment-panel').removeClass('active-panel');
            $('#panel-' + tab).addClass('active-panel');
        });

        // 8. Live input validation handlers
        $('#checkoutForm input').on('input change blur', function() {
            var $input = $(this);
            var val = $input.val().trim();
            var isValid = true;

            if ($input.attr('required') && !val) {
                isValid = false;
            } else if ($input.attr('type') === 'email' && val) {
                var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = re.test(val);
            } else if ($input.attr('name') === 'card_number' && $('.payment-tab-btn.active-tab').attr('data-tab') === 'card') {
                isValid = val.replace(/\s/g, '').length === 16;
            } else if ($input.attr('name') === 'card_expiry' && $('.payment-tab-btn.active-tab').attr('data-tab') === 'card') {
                isValid = val.length === 5 && val.indexOf('/') === 2;
            } else if ($input.attr('name') === 'card_cvv' && $('.payment-tab-btn.active-tab').attr('data-tab') === 'card') {
                isValid = val.length === 3;
            }

            if (isValid && val) {
                $input.removeClass('field-error').addClass('field-valid');
            } else if (!isValid) {
                $input.removeClass('field-valid').addClass('field-error');
            } else {
                $input.removeClass('field-valid field-error');
            }
        });

        // 9. Coupon validation trigger
        $('.js-checkout-apply-coupon').on('click', function() {
            var $input = $('input[name="checkout_coupon"]');
            var code = $input.val().trim().toUpperCase();

            if (code === 'GANESH20' || code === 'GEMINI20') {
                activeCouponDiscount = 20;
                sessionStorage.setItem('activeDiscountPercentage', '20');
                sessionStorage.setItem('activeCouponCode', code);
                $input.removeClass('field-error').addClass('field-valid');
                showPremiumToast('Coupon applied! Enjoy 20% discount.', 'success');
                renderCheckoutSummary();
            } else {
                activeCouponDiscount = 0;
                sessionStorage.removeItem('activeDiscountPercentage');
                sessionStorage.removeItem('activeCouponCode');
                $input.removeClass('field-valid').addClass('field-error');
                showPremiumToast('Invalid coupon code.', 'error');
                renderCheckoutSummary();
            }
        });

        // 10. UPI Scan verification handler
        $('.js-verify-upi-payment').on('click', function() {
            var $btn = $(this);
            $btn.addClass('is-loading').text('Verifying...');
            
            setTimeout(function() {
                $btn.removeClass('is-loading').text('Verified ✓').css('background-color', '#0f766e');
                showPremiumToast('UPI Transaction Verified Successfully!', 'success');
                $btn.data('verified', true);
            }, 1500);
        });

        // 11. PayPal Popup simulation
        $('.js-paypal-checkout-btn').on('click', function() {
            showPremiumToast('Redirecting to PayPal securely...', 'info');
            setTimeout(function() {
                if (confirm("Simulate PayPal Sandbox Authorization?")) {
                    window.paypalAuthorized = true;
                    showPremiumToast('PayPal authorization completed successfully.', 'success');
                    $('.js-btn-place-order').trigger('click');
                }
            }, 1000);
        });

        // 12. Mobile summary toggler
        $('.mobile-summary-toggle').on('click', function() {
            $(this).toggleClass('expanded');
            $('.mobile-summary-collapse').toggleClass('open');
        });

        // 13. Printable Invoice PDF handler
        $(document).on('click', '#btnPrintInvoice', function(e) {
            e.preventDefault();
            window.print();
        });

        // Confetti explosion script helper
        function triggerConfettiBurst() {
            var colors = ['#717fe0', '#ff3366', '#ffd700', '#0f766e', '#3081ed'];
            for (var i = 0; i < 70; i++) {
                var $particle = $('<div class="confetti-particle"></div>');
                var randomColor = colors[Math.floor(Math.random() * colors.length)];
                var randomLeft = Math.random() * 100;
                var randomDelay = Math.random() * 2;
                var randomSize = Math.floor(Math.random() * 8) + 6;

                $particle.css({
                    'background-color': randomColor,
                    'left': randomLeft + '%',
                    'width': randomSize + 'px',
                    'height': randomSize + 'px',
                    'animation-delay': randomDelay + 's'
                });
                $('body').append($particle);

                // Auto clean particle
                (function($p) {
                    setTimeout(function() {
                        $p.remove();
                    }, 4500);
                })($particle);
            }
        }

        // 14. Place Order Submission
        $('.js-btn-place-order').on('click', function(e) {
            e.preventDefault();

            // Validate personal fields
            var hasErrors = false;
            $('#checkoutForm input[required]').each(function() {
                var val = $(this).val().trim();
                if (!val) {
                    $(this).addClass('field-error');
                    hasErrors = true;
                }
            });

            if (hasErrors) {
                showPremiumToast('Please complete all required fields.', 'error');
                $('.checkout-form-section').addClass('field-error');
                setTimeout(function() {
                    $('.checkout-form-section').removeClass('field-error');
                }, 400);
                return;
            }

            // Verify specific payment tab method authorization
            var activeTab = $('.payment-tab-btn.active-tab').attr('data-tab');
            if (activeTab === 'card') {
                var cc = $('#inputCardNumber').val().replace(/\s/g, '');
                var exp = $('#inputCardExpiry').val();
                var cvv = $('#inputCardCvv').val();
                if (cc.length !== 16 || exp.length !== 5 || cvv.length !== 3) {
                    showPremiumToast('Please enter valid credit card details.', 'error');
                    return;
                }
            } else if (activeTab === 'upi') {
                if (!$('.js-verify-upi-payment').data('verified')) {
                    showPremiumToast('Please scan the QR code and verify your transaction.', 'error');
                    return;
                }
            } else if (activeTab === 'paypal') {
                if (!window.paypalAuthorized) {
                    showPremiumToast('Please click "Pay with PayPal" to authorize the transaction.', 'error');
                    return;
                }
            }

            // Launch secure loader
            var $overlay = $('#processingOverlay');
            $overlay.show();

            // Animate steps
            setTimeout(function() {
                $('#proc-step-1').removeClass('active-step').addClass('step-completed').find('i').removeClass('zmdi-circle-o').addClass('zmdi-check-circle');
                $('#proc-step-2').addClass('active-step');

                setTimeout(function() {
                    $('#proc-step-2').removeClass('active-step').addClass('step-completed').find('i').removeClass('zmdi-circle-o').addClass('zmdi-check-circle');
                    $('#proc-step-3').addClass('active-step');

                    setTimeout(function() {
                        $('#proc-step-3').removeClass('active-step').addClass('step-completed').find('i').removeClass('zmdi-circle-o').addClass('zmdi-check-circle');
                        $('#proc-step-4').addClass('active-step');

                        // Save details to database
                        var currentCart = getCart();
                        var orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
                        var subtotalStr = $('.js-checkout-subtotal').text().replace(/[^\d.]/g, '');
                        var subtotalNum = parseFloat(subtotalStr) || 0;
                        var discountNum = subtotalNum * (activeCouponDiscount / 100);
                        var totalNum = subtotalNum - discountNum + shippingFee;

                        var emailVal = $('input[name="checkout-email"]').val().trim();
                        var fullNameVal = $('input[name="firstname"]').val().trim() + ' ' + $('input[name="lastname"]').val().trim();
                        var addrVal = $('input[name="address"]').val().trim() + ', ' + $('input[name="city"]').val().trim() + ', ' + $('input[name="state"]').val().trim() + ' ' + $('input[name="postcode"]').val().trim();
                        var shipMethodVal = $('input[name="shipping_method_option"]:checked').val() === 'express' ? 'Express Delivery' : 'Standard Delivery';
                        
                        var orderData = {
                            order_id: orderId,
                            customer_name: fullNameVal,
                            email: emailVal,
                            shipping_address: addrVal,
                            shipping_method: shipMethodVal,
                            payment_method: activeTab.toUpperCase(),
                            items: currentCart,
                            subtotal: subtotalNum,
                            discount: discountNum,
                            total: totalNum
                        };

                        function completeTransaction() {
                            $overlay.hide();
                            $('#checkoutMainRow').hide();
                            $('.bread-crumb').hide();
                            $('.mobile-summary-toggle').hide();
                            $('.mobile-summary-collapse').removeClass('open').hide();

                            // Populate invoice details
                            $('#receiptOrderId').text(orderId);
                            $('#receiptDate').text(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }));
                            $('#receiptEmail').text(emailVal);
                            $('#receiptPayment').text(activeTab.toUpperCase());
                            $('#receiptAddress').text(addrVal);

                            // Populate items table
                            var $receiptTable = $('#receiptTableBody');
                            $receiptTable.empty();
                            currentCart.forEach(function(item) {
                                var row = 
                                    '<tr>' +
                                    '  <td>' + item.name + ' <span style="font-size:11px;color:#888;">(' + item.size + ' / ' + item.color + ')</span></td>' +
                                    '  <td style="text-align:center;">' + item.quantity + '</td>' +
                                    '  <td style="text-align:right;">' + item.price + '</td>' +
                                    '</tr>';
                                $receiptTable.append(row);
                            });

                            $('#receiptSubtotal').text('$ ' + subtotalNum.toFixed(2));
                            if (discountNum > 0) {
                                $('#receiptDiscountRow').show();
                                $('#receiptDiscount').text('- $ ' + discountNum.toFixed(2));
                            } else {
                                $('#receiptDiscountRow').hide();
                            }
                            $('#receiptShipping').text(shippingFee > 0 ? '$ 15.00' : 'Free');
                            $('#receiptTotal').text('$ ' + totalNum.toFixed(2));

                            $('#receiptContainer').show();
                            
                            // Save to local order history
                            var history = [];
                            try {
                                history = JSON.parse(localStorage.getItem('order_history')) || [];
                            } catch (err) {
                                history = [];
                            }
                            history.push(orderData);
                            localStorage.setItem('order_history', JSON.stringify(history));

                            // Clear cart and coupon
                            saveCart([]);
                            sessionStorage.removeItem('activeDiscountPercentage');
                            sessionStorage.removeItem('activeCouponCode');
                            updateCartBadges();
                            renderSideDrawerCart();

                            // Fireworks / confetti explosion
                            triggerConfettiBurst();
                            showPremiumToast('Invoice has been sent to ' + emailVal, 'success');
                        }

                        // Save to Supabase Cloud Database if configured
                        if (window.supabaseClient) {
                            window.supabaseClient
                                .from('orders')
                                .insert(orderData)
                                .then(function(res) {
                                    if (res.error) {
                                        console.warn("Supabase Order saving failed, falling back to local storage:", res.error.message);
                                    } else {
                                        console.log("Order saved to Supabase cloud successfully.");
                                    }
                                    completeTransaction();
                                })
                                .catch(function(err) {
                                    console.warn("Supabase Order saving caught exception, falling back to local:", err);
                                    completeTransaction();
                                });
                        } else {
                            completeTransaction();
                        }

                    }, 1000);
                }, 1000);
            }, 1000);

        });
    }

    // Run initialization on DOM load
    $(document).ready(function() {
        initCheckout();
    });

})(jQuery);

