// "Zoom entre frames": decide si el artboard nuevo entra por la derecha (adelante) o por la izquierda
// (atrás) según el orden del menú. La animación está en global.css (::view-transition-*(root)).
import type { TransitionBeforePreparationEvent } from 'astro:transitions/client';

const ORDER = ['/', '/projects', '/about', '/contact'];
let back = false;

function rank(url: URL) {
  const path = url.pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  const index = ORDER.indexOf(parts.length ? `/${parts[0]}` : '/');
  // Las subpáginas (un proyecto) quedan "dentro" de su sección
  return (index < 0 ? ORDER.length : index) * 2 + (parts.length > 1 ? 1 : 0);
}

document.addEventListener('astro:before-preparation', (event) => {
  const { from, to, direction } = event as TransitionBeforePreparationEvent;
  const delta = rank(to) - rank(from);
  back = delta < 0 || (delta === 0 && direction === 'back');
});

// El swap reemplaza los atributos de <html>: la clase se vuelve a poner justo antes de animar
document.addEventListener('astro:after-swap', () => {
  document.documentElement.classList.toggle('frame-back', back);
});
