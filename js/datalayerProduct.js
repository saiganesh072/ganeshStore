function getCookieValue(name) {
  let result = document.cookie.match("(^|[^;]+)s*" + name + "s*=s*([^;]+)");
  return result ? result.pop() : "";
}

var userID = getCookieValue("CustomerNumber");
var userName = getCookieValue("CustomerName");

var pageName = window.location.pathname.split("/").pop().split(".")[0];
var pageUrl = window.location.href;

var productId = document
  .querySelector(".js-addcart-detail")
  .getAttribute("data-product-id");
var productName = document.querySelector(".js-name-detail").innerText;
var productPrice = document.querySelector(".mtext-106").innerText;

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
    // thumbnailUrl: productThumbnail,
    // categoryId: productCategoryId,
    // productType: productType,
  },
};
