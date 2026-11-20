// Transición entre páginas. Dos modos, y la animación de cada uno está en global.css
// (::view-transition-*):
// - Paneo con el personaje (docs/referencias/transicion-personaje.md): decide la dirección según el
//   orden del menú y mueve al personaje, que empuja la página al avanzar y tira de ella al volver.
// - Morph de la tarjeta al caso (plan §4.3 D): entre una lista de proyectos (la home o Proyectos)
//   y el caso de uno de ellos, la imagen y el título viajan de la tarjeta a la cabecera y vuelven.
import type { TransitionBeforePreparationEvent, TransitionBeforeSwapEvent } from 'astro:transitions/client';
import { animate } from './character';

const ORDER = ['/', '/projects', '/about', '/contact'];
let back = false;
let frame = 0;
/** El proyecto cuya tarjeta y cuyo caso se están transformando, o null si la transición es un paneo */
let morph: string | null = null;
let traverse = false;
/** Se entra desde el lienzo navegable: el cambio de página va sin animación */
let instant = false;

const plain = (url: URL) => url.pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '') || '/';
const caseOf = (url: URL) => plain(url).match(/^\/projects\/([^/]+)$/)?.[1] ?? null;
const isList = (url: URL) => ['/', '/projects'].includes(plain(url));

/**
 * Da nombre de transición a la imagen y al título de un proyecto en el documento actual.
 * Devuelve la imagen, o null si no está (entonces no hay morph).
 */
function tag(slug: string, near?: Element | null) {
  // Proyectos tiene dos vistas (cajas y lienzo) y las dos llevan estas piezas: valen las de la que
  // se ve. (La página abre siempre en cajas, así que al llegar a ella son las de las cajas.)
  const shown = (selector: string) =>
    [...document.querySelectorAll<HTMLElement>(selector)].find((el) => el.getClientRects().length > 0) ?? null;
  const within = (selector: string) => near?.closest('li, article')?.querySelector<HTMLElement>(selector) ?? shown(selector);
  const visual = within(`[data-morph-visual="${slug}"]`);
  const title = within(`[data-morph-title="${slug}"]`);
  if (!visual) return null;
  visual.style.viewTransitionName = 'morph-visual';
  if (title) title.style.viewTransitionName = 'morph-title';
  return { visual, title };
}

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
const canAnimate = () =>
  'startViewTransition' in document && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('astro:before-preparation', (event) => {
  const { from, to, direction, navigationType, sourceElement } = event as TransitionBeforePreparationEvent;
  morph = null;
  traverse = navigationType === 'traverse';
  instant = document.documentElement.dataset.canvasNav === '1';
  if (instant) return;
  // Cambio de idioma: ir al inglés es avanzar (empuja) y volver al español es regresar (arrastra)
  if (language(from) !== language(to)) {
    back = language(to) === 'es';
    return;
  }
  // De una lista a un caso, o de vuelta: morph. Las piezas de la página que sale se nombran ya,
  // antes de que el navegador le haga la foto
  const slug = caseOf(to) && isList(from) ? caseOf(to) : caseOf(from) && isList(to) ? caseOf(from) : null;
  if (slug && canAnimate() && tag(slug, sourceElement)) morph = slug;
  const delta = rank(to) - rank(from);
  back = delta < 0 || (delta === 0 && direction === 'back');
});

document.addEventListener('astro:before-swap', (event) => {
  const transition = (event as TransitionBeforeSwapEvent).viewTransition;
  const animated = canAnimate();
  cancelAnimationFrame(frame);

  // El swap reemplaza los atributos de <html>: las clases se ponen justo después, antes de animar
  document.addEventListener(
    'astro:after-swap',
    () => {
      const root = document.documentElement;
      root.classList.toggle('frame-back', back);
      if (!animated) return;
      if (instant) {
        root.classList.add('is-instant');
        transition.finished.finally(() => root.classList.remove('is-instant'));
        return;
      }

      if (morph) {
        const target = tag(morph);
        if (target) {
          root.classList.add('is-morph');
          // Las piezas que llegan no hacen además su entrada escalonada: se quedarían a medio camino
          for (const el of [target.visual, target.title]) {
            el?.removeAttribute('data-reveal');
            el?.closest('[data-reveal]')?.removeAttribute('data-reveal');
          }
          // Al volver a una lista con un enlace (no con "atrás"), se baja hasta la tarjeta
          if (caseOf(new URL(location.href)) === null && !traverse) {
            target.visual.scrollIntoView({ block: 'center', behavior: 'instant' });
          }
          transition.finished.finally(() => {
            root.classList.remove('is-morph');
            target.visual.style.viewTransitionName = '';
            if (target.title) target.title.style.viewTransitionName = '';
          });
          return;
        }
      }
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
