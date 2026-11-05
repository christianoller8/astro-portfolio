// Intro "del boceto a la web": el boceto se dibuja sobre la posición real de cada pieza del hero
// y después el contenido se entinta en su sitio. Solo con html.intro (decidido en el <head>).
import { sketchElements } from './sketch';

const DRAW_SECONDS = 1.05;

function initIntro() {
  const root = document.documentElement;
  if (!root.classList.contains('intro')) return;
  const stage = document.querySelector<HTMLElement>('[data-intro-stage]');
  if (!stage) {
    root.classList.remove('intro');
    return;
  }

  const svg = sketchElements(stage, 11);
  svg.querySelectorAll<SVGElement>('path, text').forEach((mark) => {
    const k = parseFloat(mark.style.getPropertyValue('--k')) || 0;
    mark.style.animation =
      mark.tagName === 'text'
        ? `ink-failsafe 0.3s ease ${(0.35 + k * DRAW_SECONDS).toFixed(2)}s forwards`
        : `draw-stroke 0.5s var(--ease-out) ${(k * DRAW_SECONDS).toFixed(2)}s forwards`;
  });
  stage.appendChild(svg);

  let finished = false;
  const timers: number[] = [];
  const cleanup = () => {
    svg.remove();
    root.classList.remove('intro', 'inking');
    window.removeEventListener('pointerdown', skip);
    window.removeEventListener('keydown', skip);
  };
  const ink = () => {
    if (finished) return;
    finished = true;
    root.classList.add('inking');
    svg.style.transition = 'opacity 0.5s ease';
    svg.style.opacity = '0';
    timers.push(window.setTimeout(cleanup, 1100));
  };
  function skip() {
    timers.forEach((id) => window.clearTimeout(id));
    finished = true;
    cleanup();
  }

  timers.push(window.setTimeout(ink, (DRAW_SECONDS + 0.45) * 1000));
  window.addEventListener('pointerdown', skip, { once: true });
  window.addEventListener('keydown', skip, { once: true });
}

// Espera a las fuentes (máximo 0,4 s) para que el boceto caiga donde caerá el texto real
const fontsOrTimeout = Promise.race([
  document.fonts?.ready ?? Promise.resolve(),
  new Promise((resolve) => window.setTimeout(resolve, 400)),
]);
fontsOrTimeout.then(initIntro);
