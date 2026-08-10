const fs = require('fs');

const pages = [
  {
    name: 'contact.html',
    title: 'Contact Us',
    desc: 'Get in touch with GaneshStore.',
    content: '<div class="row"><div class="col-md-10 col-lg-8 m-lr-auto"><div class="p-t-7 p-b-140"><h3 class="mtext-111 cl2 p-b-16">Send Us A Message</h3><form><div class="bor8 m-b-20 how-pos4-parent"><input class="stext-111 cl2 plh3 size-116 p-l-62 p-r-30" type="text" name="email" placeholder="Your Email Address"><img class="how-pos4 pointer-none" src="images/icons/icon-email.png" alt="ICON"></div><div class="bor8 m-b-30"><textarea class="stext-111 cl2 plh3 size-120 p-lr-28 p-tb-25" name="msg" placeholder="How Can We Help?"></textarea></div><button class="flex-c-m stext-101 cl0 size-121 bg3 bor1 hov-btn3 p-lr-15 trans-04 pointer">Submit</button></form></div></div></div>'
  },
  {
    name: 'order-history.html',
    title: 'Order History',
    desc: 'View your past orders on GaneshStore.',
    content: '<div class="row"><div class="col-12 m-lr-auto"><div class="p-t-7 p-b-140 text-center"><h3 class="mtext-111 cl2 p-b-16">Your Orders</h3><p class="stext-113 cl6 p-b-26">You have no past orders.</p><a href="product.html" class="flex-c-m stext-101 cl0 size-101 bg1 bor1 hov-btn1 p-lr-15 trans-04 m-lr-auto" style="width: 200px;">Shop Now</a></div></div></div>'
  },
  {
    name: 'shipping.html',
    title: 'Shipping Policy',
    desc: 'Shipping information for GaneshStore.',
    content: '<div class="row"><div class="col-md-10 col-lg-8 m-lr-auto"><div class="p-t-7 p-b-140"><h3 class="mtext-111 cl2 p-b-16">Shipping Policy</h3><p class="stext-113 cl6 p-b-26">We offer free standard shipping on all orders over $100. Standard shipping takes 3-5 business days. Expedited shipping is available at checkout.</p></div></div></div>'
  },
  {
    name: 'returns.html',
    title: 'Returns & Exchanges',
    desc: 'Returns and exchange policy for GaneshStore.',
    content: '<div class="row"><div class="col-md-10 col-lg-8 m-lr-auto"><div class="p-t-7 p-b-140"><h3 class="mtext-111 cl2 p-b-16">Returns & Exchanges</h3><p class="stext-113 cl6 p-b-26">You can return any unworn, unwashed item within 30 days of purchase for a full refund or exchange. Please ensure all original tags are attached.</p></div></div></div>'
  },
  {
    name: 'terms.html',
    title: 'Terms of Service',
    desc: 'Terms of service for GaneshStore.',
    content: '<div class="row"><div class="col-md-10 col-lg-8 m-lr-auto"><div class="p-t-7 p-b-140"><h3 class="mtext-111 cl2 p-b-16">Terms of Service</h3><p class="stext-113 cl6 p-b-26">By using GaneshStore, you agree to these terms and conditions. We reserve the right to update these terms at any time.</p></div></div></div>'
  },
  {
    name: 'privacy.html',
    title: 'Privacy Policy',
    desc: 'Privacy policy for GaneshStore.',
    content: '<div class="row"><div class="col-md-10 col-lg-8 m-lr-auto"><div class="p-t-7 p-b-140"><h3 class="mtext-111 cl2 p-b-16">Privacy Policy</h3><p class="stext-113 cl6 p-b-26">We value your privacy. We do not sell your personal information to third parties. Information collected is used solely for order processing and improving your experience.</p></div></div></div>'
  }
];

pages.forEach(page => {
  let fileContent = fs.readFileSync(page.name, 'utf8');
  
  fileContent = fileContent.replace(/<title>.*?<\/title>/, "<title>" + page.title + " | GaneshStore — Premium Fashion & Accessories</title>");
  fileContent = fileContent.replace(/<meta name="description" content=".*?" \/>/, '<meta name="description" content="' + page.desc + '" />');
  
  fileContent = fileContent.replace(/<li class="active-menu">\s*<a href="about\.html">About<\/a>/, '<li>\n                  <a href="about.html">About</a>');
  
  fileContent = fileContent.replace(/<!-- Title page -->[\s\S]*?<!-- Content page -->/, "<!-- Title page -->\n    <section class=\"bg-img1 txt-center p-lr-15 p-tb-92\" style=\"background-image: url('images/bg-01.jpg')\">\n      <h2 class=\"ltext-105 cl0 txt-center\">" + page.title + "</h2>\n    </section>\n    <!-- Content page -->");

  fileContent = fileContent.replace(/<section class="bg0 p-t-75 p-b-120">[\s\S]*?<!-- Footer -->/, "<section class=\"bg0 p-t-75 p-b-120\">\n      <div class=\"container\">\n" + page.content + "\n      </div>\n    </section>\n    <!-- Footer -->");

  fs.writeFileSync(page.name, fileContent);
  console.log('Updated ' + page.name);
});
