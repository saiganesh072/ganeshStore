/*==================================================================
    [ Cart Items ]*/

// Retrieve cart items from localStorage (if any)
let cartItems = localStorage.getItem("cartItems");
cartItems = cartItems ? JSON.parse(cartItems) : [];

// Add event listener when the DOM is fully loaded
const addToCartBtn = document.querySelector(".js-addcart-detail");
if (addToCartBtn) {
  addToCartBtn.addEventListener("click", addToCart);
}

function addToCart(event) {
  var productId = event.target.getAttribute("data-product-id");
  var productname = document.querySelector(".mtext-105").innerText;
  var productPrice = document.querySelector(".mtext-106").innerText;
  var productImage = document
    .querySelector(".wrap-pic-w")
    .getElementsByTagName("img")[0].src;
  var productpage = window.location.href;
  var productQuantity = document.querySelector(".num-product").value;
  var productSize = document.getElementsByClassName(
    "select2-selection__rendered"
  )[0].innerText;
  var productColor = document.getElementsByClassName(
    "select2-selection__rendered"
  )[1].innerText;

  // Check if the product is already in the cart
  const existingProduct = cartItems.find((item) => item.id === productId);
  if (existingProduct) {
    // If the product exists, increment the quantity
    existingProduct.quantity++;
    console.log("Quantity updated for product:", existingProduct);
  } else {
    // If the product doesn't exist, add it to the cart
    const product = {
      id: productId,
      name: productname,
      price: productPrice,
      image: productImage,
      page: productpage,
      quantity: productQuantity,
      size: productSize,
      color: productColor,
    };

    cartItems.push(product);
    console.log("Product added to cart:", product);
  }

  // Update localStorage with the modified cartItems
  localStorage.setItem("cartItems", JSON.stringify(cartItems));
}
