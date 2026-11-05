// Entrada de las partes de cada sección al aparecer en pantalla (CSS en global.css).
// El script inline del <head> marca html.reveal-ready; si este módulo no llega a ejecutarse, lo quita a los 3 s.

declare global {
  interface Window {
    __revealInit?: boolean;
  }
}

function initReveal() {
  window.__revealInit = true;
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  document
    .querySelectorAll('[data-reveal]:not(.is-revealed)')
    .forEach((el) => observer.observe(el));
}

document.addEventListener('astro:page-load', initReveal);

export {};
