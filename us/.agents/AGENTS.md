# GaneshStore UI/UX Design Guidelines & Preferences

Always follow these guidelines when building, modifying, or refining any page on the GaneshStore site.

## Core Philosophy
- **Professional Craftsmanship**: Act as a world-class professional UI/UX designer and frontend developer.
- **No Rushing**: Focus on one page at a time. Spend time completely planning, analyzing, and refining the details to make them perfect.
- **Visual Attraction**: Use curated color palettes, premium modern typography, smooth transitions, and tactile feel to capture user attention.
- **Smooth Animations**: Every transition must feel organic, using custom transition timing functions (`cubic-bezier(0.25, 1, 0.5, 1)` or similar) instead of linear fades.

---

## User Preferences & Feedback

### 1. Homepage (`index.html`)
- **Hero Banner [Action Required]**:
  - The current hero banner is disliked. Redesign it to look modern, high-end, and visually compelling.
- **Category Carousel Hover Gradient [Action Required]**:
  - The gradient overlay on hover in the category carousel is disliked. Replace it with a more refined, premium styling (e.g., solid elegant color overlay with low opacity, sleek border zoom, or a high-end subtle transition).
- **Navigation Dropdown Animations [Action Required]**:
  - The hover/dropdown animations for the navigation menu are disliked. Replace them with smooth, fluid dropdown animations (e.g., a subtle slide-down with fade-in and scale).
- **Product Cards [Keep & Enhance]**:
  - The product card hover animations and smoothness are liked. Maintain this feel and ensure other cards on the site have similar high-quality hover effects.
- **Wishlist Icon [Keep & Enhance]**:
  - The wishlist icon micro-animations (on hover/click) are liked. Maintain and propagate these micro-animations across all product listings.

### 2. Wishlist Page (`wishlist.html`)
- **Design [Keep]**:
  - The layout and flow of this page are liked. Keep the clean, premium feel intact.

### 3. Shopping Cart Page (`shoping-cart.html`)
- **Interactive States [Action Required]**:
  - The page is functional but needs more refinement. Improve the layout, adding smooth micro-animations for quantity adjustments, item removals, coupon additions, and cart updates.

---

## Workflow Instruction for Scheduled Runs
- When triggered, focus on one page from the guidelines above.
- Verify existing code, plan the changes, write a walkthrough, and implement them.
- Do not attempt to refactor multiple pages in a single run; ensure completeness and visual excellence of the selected page.
