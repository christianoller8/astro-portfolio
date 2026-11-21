// El apilado de las tarjetas de proyecto del inicio es CSS (position: sticky en ProjectStack.astro).
// Aquí van las tres cosas que el CSS no puede hacer solo:
// 1. La inclinación con la que sube cada tarjeta: depende de lo que le falta para llegar a su sitio.
// 2. Que el foco del teclado no caiga en una tarjeta que la siguiente ya ha tapado (WCAG 2.4.11).
// 3. Decir a las lentes hasta dónde se ve cada tarjeta, para que no marquen lo que queda debajo.

/** Grados de inclinación de una tarjeta cuando asoma por abajo; llega recta a su sitio */
const MAX_TILT = 5;

let items: HTMLElement[] = [];
let frame = 0;

/** El apilado solo existe donde el CSS lo activa (escritorio con altura, sin "reducir movimiento") */
const isStacked = (item: HTMLElement) => getComputedStyle(item).position === 'sticky';
const stickTop = (item: HTMLElement) => parseFloat(getComputedStyle(item).top) || 0;

/**
 * El borde superior de cada tarjeta, medido una vez por posición de scroll y tamaño de ventana: las
 * lentes preguntan por cada una de sus marcas al hacer scroll, y así la pila no se mide cada vez. La
 * inclinación no cambia estas medidas: va en la tarjeta de dentro, no en el elemento fijo.
 */
let tops: { key: string; stacked: boolean; values: number[] } | null = null;
function measure() {
  const key = `${scrollY}|${innerWidth}|${innerHeight}`;
  if (tops?.key !== key) {
    const stacked = !!items[0] && isStacked(items[0]);
    tops = { key, stacked, values: stacked ? items.map((item) => item.getBoundingClientRect().top) : [] };
  }
  return tops;
}

/**
 * Hasta dónde se ve una pieza de una tarjeta apilada: el borde superior de la tarjeta posterior que
 * más ha subido sobre la suya (Infinity si no está en la pila o es la última).
 */
export function coveredFrom(el: Element): number {
  const item = el.closest<HTMLElement>('.stack-item');
  const index = item ? items.indexOf(item) : -1;
  if (index < 0) return Infinity;
  const { stacked, values } = measure();
  return stacked ? Math.min(Infinity, ...values.slice(index + 1)) : Infinity;
}

function tilt() {
  frame = 0;
  // Medida nueva en cada vuelta: también cambia sin scroll (al pasar a "reducir movimiento", al
  // cargar las fuentes)
  tops = null;
  const first = items[0];
  if (!first) return;
  // Primero se lee todo y después se escribe, para no forzar el cálculo de estilos tarjeta a tarjeta
  const { stacked, values } = measure();
  const top = stacked ? stickTop(first) : 0;
  const travel = innerHeight - top;
  const angles = items.map((_, index) => {
    // Lo que le falta para llegar a su sitio: 1 cuando asoma por abajo, 0 cuando ya está fija.
    // La primera no se inclina: es la que ya está en la mesa.
    const left = stacked && index > 0 ? Math.min(Math.max((values[index] - top) / travel, 0), 1) : 0;
    // Como en la referencia, cada una gira hacia un lado y se endereza pronto para posarse suave
    return left > 0 ? MAX_TILT * left ** 1.5 * (index % 2 ? -1 : 1) : 0;
  });
  items.forEach((item, index) => {
    const card = item.firstElementChild;
    if (card instanceof HTMLElement) card.style.transform = angles[index] ? `rotate(${angles[index].toFixed(3)}deg)` : '';
  });
}

function requestTilt() {
  if (!frame) frame = requestAnimationFrame(tilt);
}

/** Si el foco del teclado entra en algo que tapa una tarjeta posterior, se baja hasta dejar la suya encima */
function uncover(event: FocusEvent) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  // Solo con el teclado: con el ratón se pulsa lo que se ve, y un salto a mitad del clic lo perdería
  if (!target.matches(':focus-visible')) return;
  const item = target.closest<HTMLElement>('.stack-item');
  if (!item || target.getBoundingClientRect().bottom <= coveredFrom(target)) return;
  const index = items.indexOf(item);
  const list = item.parentElement;
  if (index < 0 || !list) return;
  const step = item.offsetHeight + (parseFloat(getComputedStyle(list).rowGap) || 0);
  // Sin animación: es una respuesta a una tecla
  scrollTo({ top: list.getBoundingClientRect().top + scrollY + index * step - stickTop(item), behavior: 'instant' });
}

addEventListener('scroll', requestTilt, { passive: true });
addEventListener('resize', requestTilt);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', requestTilt);
document.addEventListener('focusin', uncover);
document.addEventListener('astro:page-load', () => {
  items = [...document.querySelectorAll<HTMLElement>('.stack-item')];
  tops = null;
  requestTilt();
});
