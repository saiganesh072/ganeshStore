const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'css', 'main.css');
const jsPath = path.join(__dirname, 'js', 'main.js');

console.log('Injecting Luxury Features Batch 2...');

// --- CSS INJECTION ---
let cssContent = fs.readFileSync(cssPath, 'utf8');

const luxuryCss2 = `

/* ==================================================================
   [ LUXURY FEATURES BATCH 2 ] 
   ================================================================== */

/* 1. Smart Live Search Overlay */
.luxury-search-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.96);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: 99999;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 15vh;
}
.luxury-search-overlay.active {
    opacity: 1;
    visibility: visible;
}
.luxury-search-close {
    position: absolute;
    top: 40px;
    right: 50px;
    font-size: 40px;
    color: #333;
    cursor: pointer;
    transition: transform 0.3s ease;
}
.luxury-search-close:hover {
    transform: rotate(90deg);
}
.luxury-search-input-wrap {
    width: 70%;
    max-width: 800px;
    position: relative;
}
.luxury-search-input {
    width: 100%;
    font-family: Poppins-Light;
    font-size: 48px;
    color: #222;
    background: transparent;
    border: none;
    border-bottom: 2px solid #ddd;
    padding: 10px 0;
    outline: none;
    transition: border-color 0.3s ease;
}
.luxury-search-input:focus {
    border-bottom-color: #717fe0;
}
.luxury-search-input::placeholder {
    color: #ccc;
}
.luxury-trending-searches {
    margin-top: 40px;
    width: 70%;
    max-width: 800px;
    text-align: left;
}
.luxury-trending-title {
    font-family: Poppins-Medium;
    font-size: 14px;
    color: #888;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 20px;
}
.luxury-trending-pill {
    display: inline-block;
    padding: 10px 24px;
    background: #f5f5f5;
    border-radius: 50px;
    font-family: Poppins-Regular;
    font-size: 15px;
    color: #333;
    margin-right: 15px;
    margin-bottom: 15px;
    cursor: pointer;
    transition: all 0.3s ease;
}
.luxury-trending-pill:hover {
    background: #717fe0;
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(113, 127, 224, 0.2);
}

/* 2. Category Filter Item Counts */
.filter-tope-group button .filter-count {
    font-size: 13px;
    color: #888;
    font-weight: 500;
    transition: color 0.4s;
}
.filter-tope-group button.how-active1 .filter-count,
.filter-tope-group button:hover .filter-count {
    color: #717fe0;
}

/* 3. Tactile Haptic Ripples */
.luxury-ripple-btn {
    position: relative;
    overflow: hidden;
}
.luxury-ripple-effect {
    position: absolute;
    border-radius: 50%;
    background: rgba(113, 127, 224, 0.4);
    transform: scale(0);
    animation: ripple 0.6s linear;
    pointer-events: none;
}
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

if (!cssContent.includes('LUXURY FEATURES BATCH 2')) {
    fs.writeFileSync(cssPath, cssContent + luxuryCss2, 'utf8');
    console.log('Injected luxury CSS into css/main.css');
}

// --- JS INJECTION ---
let jsContent = fs.readFileSync(jsPath, 'utf8');

const luxuryJs2 = `
/*==================================================================
[ LUXURY FEATURES BATCH 2 ]*/

// Feature 1: Smart Live Search Overlay
function initSmartLiveSearch() {
    var overlayHtml = '<div class="luxury-search-overlay">' +
        '  <div class="luxury-search-close"><i class="zmdi zmdi-close"></i></div>' +
        '  <div class="luxury-search-input-wrap">' +
        '    <input type="text" class="luxury-search-input" placeholder="Search for luxury...">' +
        '  </div>' +
        '  <div class="luxury-trending-searches">' +
        '    <div class="luxury-trending-title">Trending Now</div>' +
        '    <div class="luxury-trending-pill">Trench Coat</div>' +
        '    <div class="luxury-trending-pill">Leather Jacket</div>' +
        '    <div class="luxury-trending-pill">Silver Watch</div>' +
        '    <div class="luxury-trending-pill">Summer Dress</div>' +
        '  </div>' +
        '</div>';
    
    if (!$('.luxury-search-overlay').length) {
        $('body').append(overlayHtml);
    }

    // Intercept original search modal trigger
    $(document).off('click', '.js-show-modal-search').on('click', '.js-show-modal-search', function(e) {
        e.preventDefault();
        e.stopPropagation();
        $('.luxury-search-overlay').addClass('active');
        setTimeout(function() {
            $('.luxury-search-input').focus();
        }, 400);
    });

    $(document).on('click', '.luxury-search-close', function() {
        $('.luxury-search-overlay').removeClass('active');
        $('.luxury-search-input').val('');
    });

    // Close on ESC
    $(document).on('keydown', function(e) {
        if (e.key === "Escape") {
            $('.luxury-search-overlay').removeClass('active');
        }
    });

    // Auto-fill input when clicking trending pill
    $(document).on('click', '.luxury-trending-pill', function() {
        $('.luxury-search-input').val($(this).text()).focus();
        // In a real app, this would trigger the actual search
    });
}

// Feature 2: Category Filter Counts
function initCategoryFilterCounts() {
    $('.filter-tope-group button').each(function() {
        var filter = $(this).attr('data-filter');
        if (filter === '*') {
            var count = $('.isotope-item').length;
            if (count && $(this).find('.filter-count').length === 0) {
                $(this).append('<span class="filter-count"> (' + count + ')</span>');
            }
        } else if (filter) {
            var count = $(filter).length;
            if (count && $(this).find('.filter-count').length === 0) {
                $(this).append('<span class="filter-count"> (' + count + ')</span>');
            }
        }
    });
}

// Feature 3: Tactile Haptic Ripples on Quantity Controls
function initTactileRipples() {
    $('.btn-num-product-down, .btn-num-product-up').addClass('luxury-ripple-btn');
    
    $(document).on('mousedown', '.luxury-ripple-btn', function(e) {
        var $btn = $(this);
        var offset = $btn.offset();
        var x = e.pageX - offset.left;
        var y = e.pageY - offset.top;
        
        var $ripple = $('<span class="luxury-ripple-effect"></span>');
        $ripple.css({
            top: y + 'px',
            left: x + 'px',
            width: $btn.height() + 'px',
            height: $btn.height() + 'px',
            marginTop: -($btn.height() / 2) + 'px',
            marginLeft: -($btn.height() / 2) + 'px'
        });
        
        $btn.append($ripple);
        
        setTimeout(function() {
            $ripple.remove();
        }, 600);
    });
}

// Initialize Batch 2
$(document).ready(function() {
    initSmartLiveSearch();
    initCategoryFilterCounts();
    initTactileRipples();
});
`;

if (!jsContent.includes('LUXURY FEATURES BATCH 2')) {
    fs.writeFileSync(jsPath, jsContent + '\n\n' + luxuryJs2, 'utf8');
    console.log('Injected luxury JS into js/main.js');
}

console.log('Batch 2 completed.');
