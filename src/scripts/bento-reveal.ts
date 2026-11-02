/**
 * Bento Grid Entrance & Reveal Controller
 * Respects prefers-reduced-motion and provides graceful degradation for crawlers/no-js
 */
export function initBentoReveal(): void {
  // Check user preference for reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    // Reveal all immediately without animation
    document.querySelectorAll('.bento-reveal').forEach((el) => {
      el.classList.add('revealed');
    });
    return;
  }

  // Signal that JS animation is ready
  document.documentElement.classList.add('js-ready');

  const observerOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const elements = document.querySelectorAll('.bento-reveal');
  elements.forEach((el, index) => {
    // Add staggered delay class if not already set
    if (!el.className.includes('delay-')) {
      const delayIndex = (index % 6) + 1;
      el.classList.add(`delay-${delayIndex}`);
    }
    observer.observe(el);
  });
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBentoReveal);
  } else {
    initBentoReveal();
  }
}
