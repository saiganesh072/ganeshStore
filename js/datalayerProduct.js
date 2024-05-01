function getCookieValue(name) {
  let result = document.cookie.match("(^|[^;]+)s*" + name + "s*=s*([^;]+)");
  return result ? result.pop() : "";
}

var userID = getCookieValue("CustomerNumber");
var userName = getCookieValue("CustomerName");

var pageName = window.location.pathname.split("/").pop().split(".")[0];
var pageUrl = window.location.href;

var productId = document.querySelector(".js-addcart-detail").getAttribute("data-product-id");
var productName = document.querySelector(".js-name-detail").innerText;
var productPrice = document.querySelector(".mtext-106").innerText;

var productKeyMap = {
  "Esprit Ruffle Shirt": [
    "white",
    "t-shirt",
    "casual wear",
    "short sleeves",
    "black",
    "jeans",
    "silver",
    "belt",
    "women",
  ],
  "Herschel supply": [
    "white",
    "shirt",
    "long sleeves",
    "button-up",
    "collared",
    "pink",
    "trousers",
    "formal wear",
    "women",
  ],
  "Only Check Trouser": ["blue", "checkered", "shirt", "short sleeves", "denim", "jeans", "men"],
  "Classic Trench Coat": [
    "olive",
    "green",
    "coat",
    "fur-lined collar",
    "belted",
    "black",
    "pants",
    "women",
    "long sleeves",
  ],
  "Front Pocket Jumper": [
    "denim",
    "shirt",
    "jeans",
    "black",
    "skirt",
    "short sleeves",
    "button-up",
    "collared",
  ],
  "Vintage Inspired Classic": [
    "black",
    "watch",
    "analog",
    "leather strap",
    "round dial",
    "minimalist design",
    "rose gold",
  ],
  "Shirt in Stretch Cotton": [
    "white",
    "grey",
    "shirt",
    "blazer",
    "blue",
    "jeans",
    "black",
    "belt",
    "stylish",
    "checkered",
  ],
  "Pieces Metallic Printed": [
    "white",
    "t-shirt",
    "casual wear",
    "short sleeves",
    "cactus",
    "print",
    "green",
    "denim",
    "jeans",
    "blue",
    "silver",
    "belt",
    "buckle",
  ],
  "T-Shirt with Sleeve": [
    "white",
    "t-shirt",
    "casual wear",
    "short sleeves",
    "blue",
    "jeans",
    "silver",
  ],
  "Pretty Little Thing": ["black", "top", "red", "rose", "women", "green"],
  "Mini Silver Mesh Watch": [
    "black",
    "silver",
    "watch",
    "analog",
    "chain",
    "strap",
    "round dial",
    "minimalist design",
  ],
  "Square Neck Back": [
    "grey",
    "black",
    "t-shirt",
    "casual wear",
    "short sleeves",
    "trousers",
    "women",
  ],
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
    pageUrl: pageUrl,
  },
  product: {
    id: productId,
    name: productName,
    price: productPrice,
    Keywords: productKeys,
    // thumbnailUrl: productThumbnail,
    // categoryId: productCategoryId,
    // productType: productType,
  },
};
