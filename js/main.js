
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
    $('.js-show-cart').on('click',function(){
        $('.js-panel-cart').addClass('show-header-cart');
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
    [ Show modal1 ]*/
    $('.js-show-modal1').on('click',function(e){
        e.preventDefault();
        $('.js-modal1').addClass('show-modal1');
    });

    $('.js-hide-modal1').on('click',function(){
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

    // Run initialization on DOM load
    $(document).ready(function() {
        initWishlist();
        $(window).on('load', function() {
            initWishlist();
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

    // Handle Add to Cart from Wishlist Click
    $(document).on('click', '.js-add-cart-from-wishlist', function() {
        var name = $(this).attr('data-name');
        if (typeof swal === 'function') {
            swal(name, "is added to cart !", "success");
        }
    });

})(jQuery);

 
