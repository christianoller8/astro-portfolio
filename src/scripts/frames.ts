// Transición entre páginas (docs/referencias/transicion-personaje.md): decide la dirección del
// paneo según el orden del menú y mueve al personaje, que empuja la página al ir hacia delante y
// tira de ella al volver. El paneo en sí está en global.css (::view-transition-*).
import type { TransitionBeforePreparationEvent, TransitionBeforeSwapEvent } from 'astro:transitions/client';
import { animate } from './character';

const ORDER = ['/', '/projects', '/about', '/contact'];
let back = false;
let frame = 0;

function rank(url: URL) {
  const path = url.pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '') || '/';
  const parts = path.split('/').filter(Boolean);
  const index = ORDER.indexOf(parts.length ? `/${parts[0]}` : '/');
  // Las subpáginas (un proyecto) quedan "dentro" de su sección
  return (index < 0 ? ORDER.length : index) * 2 + (parts.length > 1 ? 1 : 0);
}

/** cubic-bezier(x1, y1, x2, y2) evaluada en x: la misma curva que --ease-pan, para ir al paso del paneo */
function bezier(x1: number, y1: number, x2: number, y2: number) {
  const at = (a: number, b: number, t: number) => 3 * a * (1 - t) ** 2 * t + 3 * b * (1 - t) * t ** 2 + t ** 3;
  return (x: number) => {
    let lo = 0, hi = 1, t = x;
    for (let i = 0; i < 24; i++) {
      t = (lo + hi) / 2;
      if (at(x1, x2, t) < x) lo = t;
      else hi = t;
    }
    return at(y1, y2, t);
  };
}

const reads = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
const ms = (value: string) => (value.endsWith('ms') ? parseFloat(value) : parseFloat(value) * 1000);

const language = (url: URL) => (/^\/en(\/|$)/.test(url.pathname) ? 'en' : 'es');

document.addEventListener('astro:before-preparation', (event) => {
  const { from, to, direction } = event as TransitionBeforePreparationEvent;
  // Cambio de idioma: ir al inglés es avanzar (empuja) y volver al español es regresar (arrastra)
  if (language(from) !== language(to)) {
    back = language(to) === 'es';
    return;
  }
  const delta = rank(to) - rank(from);
  back = delta < 0 || (delta === 0 && direction === 'back');
});

document.addEventListener('astro:before-swap', (event) => {
  const transition = (event as TransitionBeforeSwapEvent).viewTransition;
  const animated =
    'startViewTransition' in document && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  cancelAnimationFrame(frame);

  // El swap reemplaza los atributos de <html>: las clases se ponen justo después, antes de animar
  document.addEventListener(
    'astro:after-swap',
    () => {
      const root = document.documentElement;
      root.classList.toggle('frame-back', back);
      if (!animated) return;
      root.classList.add('is-panning');

      const chr = document.querySelector<HTMLElement>('[data-pusher] .chr');
      if (!chr) return;
      const goingBack = back;
      chr.dataset.face = 'strain';
      chr.dataset.hands = goingBack ? 'grip' : 'open';
      const mode = goingBack ? 'pulling' : 'pushing';
      animate(chr, mode, 0);

      const duration = ms(reads('--dur-pan')) || 2000;
      const curve = reads('--ease-pan').match(/cubic-bezier\(([^)]+)\)/)?.[1].split(',').map(Number);
      const ease = curve?.length === 4 ? bezier(curve[0], curve[1], curve[2], curve[3]) : (x: number) => x;
      // Zancadas: las que caben en el recorrido, entre dos y tres ciclos (cuatro a seis pasos)
      const height = parseFloat(getComputedStyle(chr).getPropertyValue('--h')) || 400;
      const travel = window.innerWidth + height;
      const cycles = Math.min(3, Math.max(2, travel / (height * 1.25)));

      transition.ready
        .then(() => {
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min(1, (now - start) / duration);
            animate(chr, mode, ease(progress) * cycles * 360);
            if (progress < 1) frame = requestAnimationFrame(tick);
          };
          frame = requestAnimationFrame(tick);
        })
        .catch(() => undefined);
      transition.finished.finally(() => {
        cancelAnimationFrame(frame);
        root.classList.remove('is-panning');
      });
    },
    { once: true },
  );
});
