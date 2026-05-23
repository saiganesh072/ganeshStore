
(function ($) {
    "use strict";

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

    if($('.top-bar').length > 0) {
        var posWrapHeader = $('.top-bar').height();
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
    [ Show / hide modal search ]*/
    $('.js-show-modal-search').on('click', function(){
        $('.modal-search-header').addClass('show-modal-search');
        $(this).css('opacity','0');
    });

    $('.js-hide-modal-search').on('click', function(){
        $('.modal-search-header').removeClass('show-modal-search');
        $('.js-show-modal-search').css('opacity','1');
    });

    $('.container-search-header').on('click', function(e){
        e.stopPropagation();
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
    }

    // Helper to update all header wishlist badges
    function updateWishlistBadges() {
        var wishlist = getWishlist();
        var count = wishlist.length;
        $('.icon-header-noti i.zmdi-favorite-outline, .icon-header-noti i.zmdi-favorite')
            .parent()
            .attr('data-notify', count);
    }

    // Initialize all wishlist interactions on load
    function initWishlist() {
        var wishlist = getWishlist();

        // 1. Rewrite all header/mobile-header favorite icons to point to wishlist.html
        $('.icon-header-item i.zmdi-favorite-outline, .icon-header-item i.zmdi-favorite')
            .parent()
            .attr('href', 'wishlist.html');

        // 2. Update badges immediately
        updateWishlistBadges();

        // 3. Clear existing inline click handlers that would double-fire
        $('.js-addwish-b2, .js-addwish-detail').off('click');

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
                $btn.find('i').css('color', '#ec38bc');
            } else {
                $btn.removeClass('js-addedwish-detail');
                $btn.find('i').css('color', '');
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
                '    <div class="how-itemcart1 js-remove-wishlist-item" data-name="' + item.name + '" title="Remove from Wishlist">' +
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

    // Dynamic session and authentication sync across all headers and top bars
    function syncAuthHeader() {
        var userState = localStorage.getItem("user");
        var customerName = getCookieValue("CustomerName");
        
        // 1. Identify active authentication menus and top bar elements
        var $loginLinks = $('.main-menu a:contains("Sign In"), .main-menu a:contains("Login"), .main-menu a:contains("Sign IN"), .main-menu a:contains("Contact")');
        var $mobileLoginLinks = $('.main-menu-m a:contains("Sign In"), .main-menu-m a:contains("Login"), .main-menu-m a:contains("Sign IN"), .main-menu-m a:contains("Contact")');
        var $topBarLeft = $('.left-top-bar');

        if (userState === "loggedin" && customerName) {
            // 2. Personalize the desktop topbar
            if ($topBarLeft.length) {
                $topBarLeft.html('Welcome back, <strong style="color: #fff; font-family: Poppins-Medium;">' + customerName + '</strong>! | <a href="#" class="js-global-logout" style="color: #6c7ae0; text-decoration: underline; margin-left: 5px;">Logout</a>');
            }

            // 3. Rewrite header navigation links to go to account center
            $loginLinks.each(function() {
                $(this).text("My Account");
                $(this).attr("href", "contact.html");
                $(this).closest('li').addClass('active-menu');
            });
            
            $mobileLoginLinks.each(function() {
                $(this).text("My Account");
                $(this).attr("href", "contact.html");
            });

            // 4. Bind dynamic Logout action in header
            $(document).off('click', '.js-global-logout').on('click', '.js-global-logout', function(e) {
                e.preventDefault();
                localStorage.setItem("user", "loggedout");
                // Clear cookies
                document.cookie = "CustomerName=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                document.cookie = "CustomerNumber=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
                
                if (typeof swal === 'function') {
                    swal("Logged Out", "You have been successfully logged out.", "success");
                }
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
            });
        } else {
            // Restore default topbar left text
            if ($topBarLeft.length && !$topBarLeft.find('.js-global-logout').length) {
                $topBarLeft.text('Free shipping for standard order over $100');
            }
        }
    }

    // Run initialization on DOM load
    $(document).ready(function() {
        initWishlist();
        initCart();
        syncAuthHeader();
        $(window).on('load', function() {
            initWishlist();
            initCart();
            syncAuthHeader();
        });
    });

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
            if (typeof swal === 'function') {
                swal(name, "has been removed from your wishlist.", "info");
            }
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
            if (typeof swal === 'function') {
                swal(name, "is added to wishlist !", "success");
            }
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
                    $(this).find('i').css('color', '');
                }
            });
            
            if (typeof swal === 'function') {
                swal(name, "has been removed from your wishlist.", "info");
            }
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
                    $(this).find('i').css('color', '#ec38bc');
                }
            });
            
            if (typeof swal === 'function') {
                swal(name, "is added to wishlist !", "success");
            }
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
            
            if (typeof swal === 'function') {
                swal(name, "has been removed from your wishlist.", "info");
            }
        }
    });

    /*==================================================================
    [ Cart Functionality Integration ]*/
    
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
    }

    // Function to calculate and update the total amount
    function updateCartPageTotals() {
        var cart = getCart();
        var total = 0;
        cart.forEach(function(item) {
            var priceNum = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
            var qty = parseInt(item.quantity) || 1;
            total += priceNum * qty;
        });
        
        var totalStr = '$ ' + total.toFixed(2);
        $('.mtext-110').text(totalStr);
    }

    // Handle click on PDP detail "Add to cart" button contextually
    $(document).on('click', '.js-addcart-detail', function(e) {
        e.preventDefault();
        
        var $btn = $(this);
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
        
        // Extract Size & Color
        var size = "Size M"; // default
        var color = "White"; // default

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
                if (selectedVal && selectedVal !== 'Choose an option') {
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
                
                if (isColor && selectedVal && selectedVal !== 'Choose an option') {
                    color = selectedVal;
                }
            }
        });

        // Add to cart
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
        
        // Trigger SweetAlert
        if (typeof swal === 'function') {
            swal(name, "is added to cart !", "success");
        }
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
            
            if (typeof swal === 'function') {
                swal(name, "has been removed from your cart.", "info");
            }
        }
    });

    // Handle delegated Add to Cart from Wishlist Click
    $(document).on('click', '.js-add-cart-from-wishlist', function(e) {
        e.preventDefault();
        
        var $btn = $(this);
        var name = $btn.attr('data-name');
        var price = $btn.attr('data-price');
        var img = $btn.attr('data-image');
        
        var cart = getCart();
        var size = "Size M";
        var color = "White";
        
        var existingItem = cart.find(function(item) {
            return item.name === name && item.size === size && item.color === color;
        });

        if (existingItem) {
            existingItem.quantity = (existingItem.quantity || 1) + 1;
        } else {
            cart.push({
                name: name,
                price: price,
                image: img,
                quantity: 1,
                size: size,
                color: color
            });
        }

        saveCart(cart);
        
        if (typeof swal === 'function') {
            swal(name, "is added to cart !", "success");
        }
    });

})(jQuery);

 
