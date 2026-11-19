// Página de caso (ProjectPage.astro):
// - El boceto que se entinta: el scroll dibuja primero el boceto de la pantalla clave y después la
//   entinta. JS solo calcula dos progresos (--draw y --ink); lo visual está en la página.
// - Las pruebas: comprobaciones calculadas ahora sobre la pieza que se puede tocar.
import { sketchElements } from './sketch';

const clamp = (value: number) => Math.min(1, Math.max(0, value));
type Rgb = [number, number, number];

const parse = (color: string) => (color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number) as Rgb;
const luminance = (rgb: Rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(parse(a)), luminance(parse(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
function initSketch(signal: AbortSignal) {
  const stage = document.querySelector<HTMLElement>('[data-case-sketch]');
  const screen = stage?.querySelector<HTMLElement>('[data-case-screen]');
  if (!stage || !screen) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const readout = stage.querySelector<HTMLElement>('[data-case-ink]');
  let sketch: SVGSVGElement | null = null;
  let frame = 0;

  const draw = () => {
    sketch?.remove();
    sketch = sketchElements(screen, 17);
    sketch.classList.add('case-sketch');
    screen.append(sketch);
  };
  const update = () => {
    frame = 0;
    // 0 cuando la pantalla asoma por abajo; 1 cuando su centro pasa algo por encima del centro
    const box = screen.getBoundingClientRect();
    const p = reduce.matches ? 1 : clamp((window.innerHeight * 0.92 - box.top) / (window.innerHeight * 0.5 + box.height * 0.55));
    const ink = clamp((p - 0.5) / 0.45);
    stage.style.setProperty('--draw', clamp(p / 0.5).toFixed(4));
    stage.style.setProperty('--ink', ink.toFixed(4));
    if (readout) readout.textContent = `${Math.round(ink * 100)} %`;
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };
  let timer = 0;
  const redraw = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      draw();
      update();
    }, 150);
  };
  window.addEventListener('scroll', schedule, { passive: true, signal });
  window.addEventListener('resize', redraw, { signal });
  draw();
  update();
  document.fonts?.ready.then(() => !signal.aborted && redraw());
}

function initChecks() {
  const list = document.querySelector<HTMLElement>('[data-case-checks]');
  const demo = document.querySelector<HTMLElement>('[data-case-demo] [data-demo]');
  if (!list || !demo) return;
  const labels = JSON.parse(list.dataset.i18n ?? '{}') as Record<string, string>;
  const decimal = document.documentElement.lang === 'en' ? '.' : ',';
  const controls = [...demo.querySelectorAll<HTMLElement>('button, a[href]')];
  const checks: { label: string; value: string; ok: boolean }[] = [];

  // El botón principal: el primero con color de fondo propio
  const main = controls.find((el) => {
    const bg = getComputedStyle(el).backgroundColor;
    return bg !== 'transparent' && !/, 0\)$/.test(bg);
  });
  if (main) {
    const style = getComputedStyle(main);
    const ratio = contrast(style.color, style.backgroundColor);
    checks.push({ label: labels.contrast, value: `${ratio.toFixed(1).replace('.', decimal)}:1`, ok: ratio >= 4.5 });
  }
  const sizes = controls.map((el) => el.getBoundingClientRect()).filter((box) => box.width && box.height);
  if (sizes.length) {
    const smallest = sizes.reduce((min, box) => (Math.min(box.width, box.height) < Math.min(min.width, min.height) ? box : min));
    checks.push({
      label: labels.target,
      value: `${Math.round(smallest.width)} × ${Math.round(smallest.height)} px`,
      ok: smallest.width >= 24 && smallest.height >= 24,
    });
  }
  const named = controls.filter((el) => (el.getAttribute('aria-label') || el.textContent || '').trim()).length;
  checks.push({ label: labels.names, value: `${named} / ${controls.length}`, ok: named === controls.length });
  const reachable = controls.filter((el) => el.tabIndex >= 0 || (el as HTMLButtonElement).disabled).length;
  checks.push({ label: labels.keyboard, value: `${reachable} / ${controls.length}`, ok: reachable === controls.length });
  // El texto más pequeño de la pieza
  let smallestText = Infinity;
  for (const el of demo.querySelectorAll<HTMLElement>('*')) {
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim())) continue;
    smallestText = Math.min(smallestText, parseFloat(getComputedStyle(el).fontSize));
  }
  if (Number.isFinite(smallestText)) {
    checks.push({ label: labels.type, value: `${smallestText.toFixed(1).replace('.', decimal).replace(/[.,]0$/, '')} px`, ok: smallestText >= 11 });
  }

  list.replaceChildren(
    ...checks.map((check) => {
      const li = document.createElement('li');
      const value = document.createElement('span');
      value.className = 'kit-badge';
      value.dataset.state = check.ok ? 'ok' : 'fail';
      value.textContent = check.value;
      li.append(check.label, value);
      return li;
    }),
  );
}

let controller: AbortController | undefined;
document.addEventListener('astro:page-load', () => {
  controller?.abort();
  controller = new AbortController();
  initSketch(controller.signal);
  initChecks();
  // Las fuentes cambian tamaños: las pruebas se repiten cuando han cargado
  document.fonts?.ready.then(initChecks);
});
