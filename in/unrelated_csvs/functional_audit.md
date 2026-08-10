# Functional Audit Report: Gaps & Missing E-commerce Logic

This audit scans routes, components, and interactive handlers in `js/main.js` and storefront HTML files to identify gaps in core e-commerce behavior.

---

## 1. Identified Functional Gaps

### A. Lack of Checkout Form Validation & Processing State
* **Issue**: The "Proceed to Checkout" button (`.size-116`) inside `shoping-cart.html` resides in a raw `<form>` with no custom submission handler. Clicking it triggers a native browser GET reload with query parameters, resetting the cart state without placing an order.
* **Impact**: Total lack of order placement feedback, order tracking, or empty cart triggers.
* **Required Logic**: 
  * Intercept checkout form submission.
  * Validate shipping address fields (Country, State/Country, Postcode).
  * Render a high-contrast dynamic spinner on the CTA button (change text to "Processing Order..." and disable the button).
  * Clear the cart from `localStorage` upon order placement.
  * Launch a stunning order placement confirmation modal.

### B. Missing PDP Attribute Selection Enforcement
* **Issue**: In `js/main.js` (lines 1494–1535), the dynamic "Add to Cart" listener defaults attributes to `"Size M"` and `"White"` if the customer does not change the dropdowns from `"Choose an option"`.
* **Impact**: Shippers can buy items with undefined variants, resulting in incorrect fulfillment tracking.
* **Required Logic**: 
  * Block `js-addcart-detail` execution if Size or Color select values are empty or equal to `"Choose an option"`.
  * Display a premium dynamic warning (e.g. SweetAlert dialog) instructing them to select their custom size and color variables.

### C. Absence of Loading States on Call-To-Action (CTA) Buttons
* **Issue**: Buttons like "Add to Cart", "Apply Coupon", "Update Totals", and "Subscribe" execute instantly with zero micro-interaction delays.
* **Impact**: Feels static, and can lead to double-clicks/duplicate database requests on slower network conditions.
* **Required Logic**: Add a standard `1.2s` to `1.5s` delayed simulation with loading state text/spinners and disabled attributes during checkout, coupon validations, and subscriptions.

### D. Cart Totals & Coupon Code Feedback Gaps
* **Issue**: The "Apply Coupon" and "Update Totals" buttons are non-functional static layout anchors.
* **Required Logic**:
  * Apply active state validation for coupon codes (e.g. apply a simulated discount if code `"GEMINI20"` is entered).
  * Update totals dynamically in real-time.
