/**
 * Scroll Reveal Animations Engine
 * Handles smooth element fade-in and slide-up as sections enter the viewport.
 */
document.addEventListener("DOMContentLoaded", function () {
  const revealElements = document.querySelectorAll(".reveal-on-scroll");

  // Observer Options
  const observerOptions = {
    root: null, // use the viewport
    rootMargin: "0px 0px -8% 0px", // triggers slightly before entering view for a smoother feeling
    threshold: 0.1 // triggers when 10% of the element is visible
  };

  // Callback function when element intersects
  const revealCallback = function (entries, observer) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Unobserve to run animation only once and save performance
        observer.unobserve(entry.target);
      }
    });
  };

  // Create observer
  const observer = new IntersectionObserver(revealCallback, observerOptions);

  // Start observing each element
  revealElements.forEach(element => {
    observer.observe(element);
  });
});
