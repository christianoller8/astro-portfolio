// Comportamiento del kit gráfico (estilos en src/styles/kit.css):
// medida de la selección, hilo de prototipo y cruceta con coordenadas.

const SVG_NS = 'http://www.w3.org/2000/svg';
const n = (v: number) => Math.round(v * 10) / 10;

/** Escribe "ancho × alto" en la pieza seleccionada: lo lee [data-sel]::after. */
function measure(target: EventTarget | null) {
  const el = target instanceof Element ? target.closest<HTMLElement>('[data-sel]') : null;
  if (!el) return;
  const box = el.getBoundingClientRect();
  el.dataset.size = `${Math.round(box.width)} × ${Math.round(box.height)}`;
}

/**
 * Hilo de prototipo entre dos piezas: sale del lado derecho del origen y llega al lado izquierdo del
 * destino (o al revés si el destino queda a la izquierda), con tangentes horizontales.
 */
export function drawThread(svg: SVGSVGElement, from: Element, to: Element) {
  const base = svg.getBoundingClientRect();
  const a = from.getBoundingClientRect();
  const b = to.getBoundingClientRect();
  const forward = b.left + b.width / 2 >= a.left + a.width / 2;
  const x1 = (forward ? a.right : a.left) - base.left;
  const y1 = a.top + a.height / 2 - base.top;
  const x2 = (forward ? b.left : b.right) - base.left;
  const y2 = b.top + b.height / 2 - base.top;
  const dir = forward ? 1 : -1;
  const pull = Math.max(32, Math.abs(x2 - x1) / 2) * dir;
  const tip = x2 - 2 * dir;

  const line = document.createElementNS(SVG_NS, 'path');
  line.setAttribute('class', 'kit-thread-line');
  line.setAttribute('pathLength', '1');
  line.setAttribute(
    'd',
    `M${n(x1)} ${n(y1)}C${n(x1 + pull)} ${n(y1)} ${n(tip - pull)} ${n(y2)} ${n(tip)} ${n(y2)}`,
  );
  const head = document.createElementNS(SVG_NS, 'path');
  head.setAttribute('class', 'kit-thread-head');
  head.setAttribute(
    'd',
    `M${n(tip - 7 * dir)} ${n(y2 - 5)}L${n(tip)} ${n(y2)}L${n(tip - 7 * dir)} ${n(y2 + 5)}`,
  );
  const origin = document.createElementNS(SVG_NS, 'circle');
  origin.setAttribute('cx', String(n(x1)));
  origin.setAttribute('cy', String(n(y1)));
  origin.setAttribute('r', '3.5');
  svg.replaceChildren(line, head, origin);
}

/** Dibuja el hilo (o lo repite desde el principio). */
export function playThread(svg: SVGSVGElement) {
  svg.classList.add('is-reset');
  svg.classList.remove('is-drawn');
  void svg.getBoundingClientRect();
  svg.classList.remove('is-reset');
  svg.classList.add('is-drawn');
}

/** Hilos declarados en el HTML: <svg class="kit-thread" data-thread-from="#a" data-thread-to="#b">. */
function initThreads(signal: AbortSignal) {
  const threads = [...document.querySelectorAll<SVGSVGElement>('svg[data-thread-from]')];
  if (!threads.length) return;
  const layout = () => {
    for (const svg of threads) {
      const from = document.querySelector(svg.dataset.threadFrom ?? '');
      const to = document.querySelector(svg.dataset.threadTo ?? '');
      if (from && to) drawThread(svg, from, to);
    }
  };
  layout();
  threads.forEach((svg) => svg.classList.add('is-drawn'));
  window.addEventListener('resize', layout, { passive: true, signal });
  document.querySelectorAll<HTMLElement>('[data-thread-play]').forEach((btn) => {
    btn.addEventListener(
      'click',
      () => {
        const svg = document.querySelector<SVGSVGElement>(btn.dataset.threadPlay ?? '');
        if (svg) playThread(svg);
      },
      { signal },
    );
  });
}

/** Cruceta con coordenadas: la etiqueta sigue al puntero dentro de cada [data-coords]. */
function initCoords(signal: AbortSignal) {
  document.querySelectorAll<HTMLElement>('[data-coords]').forEach((area) => {
    const label = document.createElement('span');
    label.className = 'kit-coords';
    label.setAttribute('aria-hidden', 'true');
    area.append(label);
    area.addEventListener(
      'pointermove',
      (event) => {
        if (event.pointerType !== 'mouse') return;
        const box = area.getBoundingClientRect();
        const x = event.clientX - box.left;
        const y = event.clientY - box.top;
        label.textContent = `x ${Math.round(x)} · y ${Math.round(y)}`;
        // La etiqueta se queda dentro del área: salta al otro lado del puntero cerca del borde
        const flipX = x > box.width - label.offsetWidth - 16;
        const flipY = y > box.height - label.offsetHeight - 16;
        label.style.transform = `translate(${n(flipX ? x - label.offsetWidth - 10 : x + 12)}px, ${n(
          flipY ? y - label.offsetHeight - 10 : y + 12,
        )}px)`;
        area.classList.add('is-tracking');
      },
      { signal },
    );
    area.addEventListener('pointerleave', () => area.classList.remove('is-tracking'), { signal });
  });
}

/** Tamaño real del frame (el artboard) junto a su nombre; se actualiza al cambiar el ancho o el alto. */
function initFrameSize(signal: AbortSignal) {
  const label = document.querySelector<HTMLElement>('[data-frame-size]');
  const artboard = document.querySelector<HTMLElement>('.artboard');
  if (!label || !artboard || !('ResizeObserver' in window)) return;
  const observer = new ResizeObserver(() => {
    label.textContent = `${Math.round(artboard.offsetWidth)} × ${Math.round(artboard.offsetHeight)}`;
  });
  observer.observe(artboard);
  signal.addEventListener('abort', () => observer.disconnect());
}

let controller: AbortController | undefined;

document.addEventListener('astro:page-load', () => {
  controller?.abort();
  controller = new AbortController();
  const { signal } = controller;
  document.addEventListener('pointerover', (event) => measure(event.target), { signal });
  document.addEventListener('focusin', (event) => measure(event.target), { signal });
  // Las piezas que nacen seleccionadas (el retrato del hero) llevan su medida al día
  const measureSelected = () => document.querySelectorAll('[data-sel].is-selected').forEach(measure);
  measureSelected();
  window.addEventListener('resize', measureSelected, { passive: true, signal });
  initFrameSize(signal);
  initThreads(signal);
  initCoords(signal);
});
