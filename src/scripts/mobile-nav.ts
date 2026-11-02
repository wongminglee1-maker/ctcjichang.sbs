/**
 * Mobile Navigation Drawer Controller
 * Handles ARIA states, keyboard traps, and auto-close on click
 */
export function initMobileNav(): void {
  const toggleBtn = document.querySelector<HTMLButtonElement>('[data-mobile-nav-toggle]');
  const menuContainer = document.querySelector<HTMLElement>('[data-mobile-nav-menu]');

  if (!toggleBtn || !menuContainer) return;

  function setOpenState(isOpen: boolean) {
    toggleBtn?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    if (isOpen) {
      menuContainer?.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      // Focus first link in menu
      const firstLink = menuContainer?.querySelector<HTMLAnchorElement>('a, button');
      firstLink?.focus();
    } else {
      menuContainer?.classList.remove('is-open');
      document.body.style.overflow = '';
      toggleBtn?.focus();
    }
  }

  toggleBtn.addEventListener('click', () => {
    const isCurrentlyOpen = toggleBtn.getAttribute('aria-expanded') === 'true';
    setOpenState(!isCurrentlyOpen);
  });

  // Close when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      setOpenState(false);
    }
  });

  // Close when clicking any link inside the mobile menu
  const menuLinks = menuContainer.querySelectorAll<HTMLAnchorElement>('a');
  menuLinks.forEach((link) => {
    link.addEventListener('click', () => {
      setOpenState(false);
    });
  });

  // Close when clicking backdrop
  const backdrop = menuContainer.querySelector('[data-mobile-nav-backdrop]');
  if (backdrop) {
    backdrop.addEventListener('click', () => {
      setOpenState(false);
    });
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
  } else {
    initMobileNav();
  }
}
