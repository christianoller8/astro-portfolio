// Escena "del boceto al producto": el scroll lleva una pantalla de Tempora de boceto a código y a QA.
// JS solo calcula el progreso (--p de 0 a 1) y la fase; todo lo visual está en ProcessScene.astro.
import { sketchElements } from './sketch';

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function initProcess() {
  const section = document.querySelector<HTMLElement>('[data-process]');
  const track = section?.querySelector<HTMLElement>('[data-process-track]');
  const screen = section?.querySelector<HTMLElement>('[data-process-screen]');
  if (!section || !track || !screen) return;

  const controller = new AbortController();
  const { signal } = controller;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const wide = window.matchMedia('(min-width: 1024px) and (min-height: 640px)');
  const steps = [...section.querySelectorAll<HTMLElement>('[data-step]')];
  let pinned = false;
  let frame = 0;
  let sketch: SVGSVGElement | null = null;

  const drawSketch = () => {
    sketch?.remove();
    sketch = sketchElements(screen, 23);
    sketch.classList.add('process-sketch');
    screen.appendChild(sketch);
  };

  const setPhase = (phase: number) => {
    if (section.dataset.phase === String(phase)) return;
    section.dataset.phase = String(phase);
    steps.forEach((step, i) => step.toggleAttribute('data-active', i === phase));
  };

  const update = () => {
    frame = 0;
    let p = 1;
    if (!reduce.matches) {
      if (pinned) {
        const box = track.getBoundingClientRect();
        p = clamp(-box.top / Math.max(1, box.height - window.innerHeight));
      } else {
        const box = screen.getBoundingClientRect();
        p = clamp((window.innerHeight * 0.9 - box.top) / (window.innerHeight * 0.8));
      }
    }
    section.style.setProperty('--p', p.toFixed(4));
    setPhase(p < 0.34 ? 0 : p < 0.67 ? 1 : 2);
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  const setMode = () => {
    pinned = wide.matches && !reduce.matches;
    section.classList.toggle('is-pinned', pinned);
    section.classList.toggle('is-static', reduce.matches);
    drawSketch();
    update();
  };

  let resizeTimer = 0;
  window.addEventListener('scroll', schedule, { passive: true, signal });
  window.addEventListener(
    'resize',
    () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setMode, 150);
    },
    { signal },
  );
  wide.addEventListener('change', setMode, { signal });
  reduce.addEventListener('change', setMode, { signal });
  document.addEventListener('astro:before-swap', () => controller.abort(), { once: true });

  setMode();
  document.fonts?.ready.then(() => !signal.aborted && setMode());
}

document.addEventListener('astro:page-load', initProcess);
