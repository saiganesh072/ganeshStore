(function ($) {
    // USE STRICT
    "use strict";

    /*==================================================================
    [ Helper to enable horizontal touchpad 2-finger swipe / scroll ]*/
    function enableTouchpadScroll($slick) {
        $slick.each(function() {
            var el = this;
            var $el = $(el);
            var slickInstance = null;
            var isTouchpadSwiping = false;
            var accumulatedDeltaX = 0;
            var resetTimer = null;

            el.addEventListener('wheel', function(e) {
                var deltaX = e.deltaX;
                var deltaY = e.deltaY;

                // Handle horizontal scroll primarily
                if (Math.abs(deltaX) > Math.abs(deltaY)) {
                    e.preventDefault(); // Stop standard browser horizontal history navigation / page shifting

                    slickInstance = $el.slick('getSlick');
                    if (!slickInstance || slickInstance.animating) return;

                    // Initialize swipe if not already swiping
                    if (!isTouchpadSwiping) {
                        isTouchpadSwiping = true;
                        accumulatedDeltaX = 0;

                        // Mock swipeStart
                        slickInstance.touchObject = {
                            fingerCount: 1,
                            startX: 0,
                            startY: 0,
                            curX: 0,
                            curY: 0
                        };
                        slickInstance.dragging = true;
                        slickInstance.swiping = true;
                    }

                    accumulatedDeltaX += deltaX;

                    // Mock swipeMove
                    var curX = -accumulatedDeltaX;
                    var mockEvent = {
                        clientX: curX,
                        clientY: 0,
                        originalEvent: {
                            touches: undefined
                        },
                        preventDefault: function() {}
                    };

                    slickInstance.touchObject.curX = curX;
                    slickInstance.touchObject.swipeLength = Math.round(Math.abs(curX));

                    // Let Slick update CSS translate dynamically
                    slickInstance.swipeMove(mockEvent);

                    // Debounce logic for swipeEnd
                    if (resetTimer) clearTimeout(resetTimer);
                    
                    resetTimer = setTimeout(function() {
                        if (isTouchpadSwiping) {
                            isTouchpadSwiping = false;

                            // Premium, user-friendly responsive swipe threshold: 15% capped at 120px for a smooth, natural feel
                            slickInstance.touchObject.minSwipe = Math.min(slickInstance.listWidth * 0.15, 120);

                            var mockEndEvent = {
                                originalEvent: {
                                    touches: undefined
                                }
                            };

                            // Let Slick finalize or snap back
                            slickInstance.swipeEnd(mockEndEvent);
                            accumulatedDeltaX = 0;
                        }
                    }, 150); // 150ms timeout to detect fingers lifted
                }
            }, { passive: false });
        });
    }

        /*==================================================================
        [ Slick1 ]*/
        $('.wrap-slick1').each(function(){
            var wrapSlick1 = $(this);
            var slick1 = $(this).find('.slick1');


            var itemSlick1 = $(slick1).find('.item-slick1');
            var layerSlick1 = $(slick1).find('.layer-slick1');
            var actionSlick1 = [];
            

            $(slick1).on('init', function(){
                var layerCurrentItem = $(itemSlick1[0]).find('.layer-slick1');

                for(var i=0; i<actionSlick1.length; i++) {
                    clearTimeout(actionSlick1[i]);
                }

                $(layerSlick1).each(function(){
                    $(this).removeClass($(this).data('appear') + ' visible-true');
                });

                for(var i=0; i<layerCurrentItem.length; i++) {
                    actionSlick1[i] = setTimeout(function(index) {
                        $(layerCurrentItem[index]).addClass($(layerCurrentItem[index]).data('appear') + ' visible-true');
                    },$(layerCurrentItem[i]).data('delay'),i); 
                }        
            });


            var showDot = false;
            if($(wrapSlick1).find('.wrap-slick1-dots').length > 0) {
                showDot = true;
            }

            $(slick1).slick({
                pauseOnFocus: false,
                pauseOnHover: false,
                slidesToShow: 1,
                slidesToScroll: 1,
                fade: true,
                speed: 1000,
                infinite: true,
                autoplay: true,
                autoplaySpeed: 6000,
                arrows: true,
                appendArrows: $(wrapSlick1),
                prevArrow:'<button class="arrow-slick1 prev-slick1"><i class="zmdi zmdi-caret-left"></i></button>',
                nextArrow:'<button class="arrow-slick1 next-slick1"><i class="zmdi zmdi-caret-right"></i></button>',
                dots: showDot,
                appendDots: $(wrapSlick1).find('.wrap-slick1-dots'),
                dotsClass:'slick1-dots',
                customPaging: function(slick, index) {
                    var linkThumb = $(slick.$slides[index]).data('thumb');
                    var caption = $(slick.$slides[index]).data('caption');
                    return  '<img src="' + linkThumb + '">' +
                            '<span class="caption-dots-slick1">' + caption + '</span>';
                },
            });

            enableTouchpadScroll(slick1);

            $(slick1).on('afterChange', function(event, slick, currentSlide){ 

                var layerCurrentItem = $(itemSlick1[currentSlide]).find('.layer-slick1');

                for(var i=0; i<actionSlick1.length; i++) {
                    clearTimeout(actionSlick1[i]);
                }

                $(layerSlick1).each(function(){
                    $(this).removeClass($(this).data('appear') + ' visible-true');
                });

                for(var i=0; i<layerCurrentItem.length; i++) {
                    actionSlick1[i] = setTimeout(function(index) {
                        $(layerCurrentItem[index]).addClass($(layerCurrentItem[index]).data('appear') + ' visible-true');
                    },$(layerCurrentItem[i]).data('delay'),i); 
                }
                         
            });

        });

        /*==================================================================
        [ Slick2 ]*/
        $('.wrap-slick2').each(function(){
            var slick2 = $(this).find('.slick2');
            slick2.slick({
              slidesToShow: 4,
              slidesToScroll: 4,
              infinite: true,
              autoplay: false,
              autoplaySpeed: 6000,
              arrows: true,
              appendArrows: $(this),
              prevArrow:'<button class="arrow-slick2 prev-slick2"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
              nextArrow:'<button class="arrow-slick2 next-slick2"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',  
              responsive: [
                {
                  breakpoint: 1200,
                  settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                    infinite: true
                  }
                },
                {
                  breakpoint: 992,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    infinite: true
                  }
                },
                {
                  breakpoint: 576,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true
                  }
                }
              ]    
            });
            enableTouchpadScroll(slick2);
          });


        $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
          var nameTab = $(e.target).attr('href'); 
          $(nameTab).find('.slick2').slick('reinit');          
        });      
        
        /*==================================================================
        [ Slick3 ]*/
        $('.wrap-slick3').each(function(){
            var slick3 = $(this).find('.slick3');
            slick3.slick({
                slidesToShow: 1,
                slidesToScroll: 1,
                fade: true,
                infinite: true,
                autoplay: false,
                autoplaySpeed: 6000,

                arrows: true,
                appendArrows: $(this).find('.wrap-slick3-arrows'),
                prevArrow:'<button class="arrow-slick3 prev-slick3"><i class="fa fa-angle-left" aria-hidden="true"></i></button>',
                nextArrow:'<button class="arrow-slick3 next-slick3"><i class="fa fa-angle-right" aria-hidden="true"></i></button>',

                dots: true,
                appendDots: $(this).find('.wrap-slick3-dots'),
                dotsClass:'slick3-dots',
                customPaging: function(slick, index) {
                    var portrait = $(slick.$slides[index]).data('thumb');
                    return '<img src=" ' + portrait + ' "/><div class="slick3-dot-overlay"></div>';
                },  
            });
            enableTouchpadScroll(slick3);
        });
            
        /*==================================================================
        [ Slick4 ]*/
        $('.wrap-slick4').each(function(){
            var slick4 = $(this).find('.slick4');
            slick4.slick({
              slidesToShow: 3,
              slidesToScroll: 1,
              infinite: true,
              autoplay: true,
              autoplaySpeed: 4000,
              arrows: false,
              dots: true,
              appendDots: $(this),
              dotsClass:'slick2-dots',
              swipeToSlide: true,
              touchThreshold: 15,
              customPaging: function(slick, index) {
                return '<button type="button"></button>';
              },
              responsive: [
                {
                  breakpoint: 1200,
                  settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true
                  }
                },
                {
                  breakpoint: 992,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true
                  }
                },
                {
                  breakpoint: 768,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true
                  }
                },
                {
                  breakpoint: 576,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    infinite: true
                  }
                }
              ]    
            });
            enableTouchpadScroll(slick4);
        });

})(jQuery);