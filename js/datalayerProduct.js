function getCookieValue(name) {
  let result = document.cookie.match("(^|[^;]+)s*" + name + "s*=s*([^;]+)");
  return result ? result.pop() : "";
}

var userID = getCookieValue("CustomerNumber");
var userName = getCookieValue("CustomerName");

var pageName = window.location.pathname.split("/").pop().split(".")[0];
var pageUrl = window.location.href;

var urlParams = new URLSearchParams(window.location.search);
var urlSku = urlParams.get("SKUID") || urlParams.get("skuID") || urlParams.get("skuid") || urlParams.get("SKU") || urlParams.get("sku");

var productId = document.querySelector(".js-addcart-detail")?.getAttribute("data-product-id") || "";
var productName = document.querySelector(".js-name-detail")?.innerText || "";
var productPrice = document.querySelector(".mtext-106")?.innerText || "";

var skuText = "";
document.querySelectorAll("span").forEach(function (el) {
  var text = el.innerText || "";
  if (text.indexOf("SKU:") !== -1) {
    skuText = text.replace("SKU:", "").trim();
  }
});

var finalSku = urlSku || skuText || productId || "GS001";
if (!productId) productId = finalSku;

var productKeyMap = {
  "Esprit Ruffle Shirt": ["white","t-shirt","casual wear","short sleeves","cotton","women"],
  "Herschel supply": ["white","shirt","button-up","collared","formal wear","women"],
  "Only Check Trouser": ["blue","checkered","gingham","shirt","short sleeves","men"],
  "Classic Trench Coat": ["olive","green","coat","fur-lined collar","belted","outerwear","women"],
  "Front Pocket Jumper": ["grey","denim","shirt","pockets","long sleeves","women"],
  "Vintage Inspired Classic": ["black","watch","analog","leather strap","rose gold","minimalist design"],
  "Shirt in Stretch Cotton": ["grey","blazer","houndstooth","checkered","tailoring","women"],
  "Pieces Metallic Printed": ["white","t-shirt","cactus","print","short sleeves","women"],
  "Converse All Star Hi Plimsolls": ["black","sneakers","canvas","high-top","shoes","unisex"],
  "Femme T-Shirt In Stripe": ["black","t-shirt","crop top","fitted","short sleeves","women"],
  "Herschel supply men": ["blue","gingham","shirt","long sleeves","checkered","men"],
  "Herschel supply watch": ["brown","leather","accessories","silver","buckle"],
  "T-Shirt with Sleeve": ["white","t-shirt","scoop neck","casual wear","short sleeves","women"],
  "Pretty Little Thing": ["black","top","rose","embroidered","cropped","women"],
  "Mini Silver Mesh Watch": ["black","silver","watch","analog","mesh strap","minimalist design"],
  "Square Neck Back": ["grey","black","t-shirt","casual wear","short sleeves","women"],
  "Roll-Top Canvas Backpack": ["grey","backpack","canvas","roll-top","laptop","bags","unisex"],
  "Olive City Backpack": ["olive","green","backpack","neoprene","gold","bags","women"],
  "Leather Platform Ankle Boots": ["black","boots","leather","platform","ankle boots","shoes","women"],
  "Windowpane Wool Blazer": ["charcoal","grey","blazer","windowpane","checkered","wool","tailoring","men"],
  "Sherpa-Lined Denim Jacket": ["blue","denim","jacket","sherpa","outerwear","men"],
};
var productKeys = productKeyMap[productName] || [];

var digitalData = {
  account: {
    userId: userID,
    userName: userName,
    Age: "age",
    Email: "email",
  },
  page: {
    pageName: pageName,
    pageType: "PDP",
    pageUrl: window.location.href,
  },
  product: {
    id: productId,
    productId: productId,
    SKUID: finalSku,
    skuID: finalSku,
    sku: finalSku,
    name: productName,
    price: productPrice,
    Keywords: productKeys,
  },
};
