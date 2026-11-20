// La cámara del lienzo navegable (CanvasMap.astro): abrir y cerrar (tecla M, "Ver lienzo", Esc),
// arrastrar, hacer zoom con la rueda o el pellizco, y entrar en un frame.
import { navigate } from 'astro:transitions/client';

const FRAME_W = 320;
/** Las miniaturas recortan 1370 px de ancho de una captura a 1440, y su primera fila (56 px) es la barra */
const CAPTURE_W = 1370;
const CAPTURE_BAR = 56;
const MIN_ZOOM = 0.2;
const MAX_ZOOM = 2.2;

interface Camera {
  x: number;
  y: number;
  k: number;
}

function initCanvas() {
  const overlay = document.querySelector<HTMLElement>('[data-canvas]');
  const world = overlay?.querySelector<HTMLElement>('[data-canvas-world]');
  if (!overlay || !world) return;

  const controller = new AbortController();
  const { signal } = controller;
  const root = document.documentElement;
  const frames = [...overlay.querySelectorAll<HTMLAnchorElement>('[data-canvas-frame]')];
  const zoomLabel = overlay.querySelector<HTMLElement>('[data-canvas-zoom]');
  const bounds = JSON.parse(overlay.dataset.bounds ?? '{}') as { x: number; y: number; w: number; h: number };
  const grid = window.matchMedia('(max-width: 767px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const flight = () => (reduce.matches ? 0 : 800);

  // "/" y "/en/" son la home: sin la barra final queda vacío, y vacío es "/"
  const here = location.pathname.replace(/^\/en(?=\/|$)/, '').replace(/\/$/, '') || '/';
  // En una ruta que no existe (404) ningún frame es "aquí": el lienzo se abre ya alejado
  const found = frames.find((frame) => frame.dataset.canvasFrame === here);
  const current = found ?? frames[0];
  frames.forEach((frame) => frame.toggleAttribute('aria-current', false));
  if (found) current.setAttribute('aria-current', 'page');

  let camera: Camera = { x: 0, y: 0, k: 1 };
  let open = false;
  let trigger: HTMLElement | null = null;
  let timer = 0;

  const apply = (next: Camera, fly = false) => {
    camera = next;
    overlay.classList.toggle('is-flying', fly);
    world.style.transform = `translate(${next.x.toFixed(1)}px, ${next.y.toFixed(1)}px) scale(${next.k.toFixed(4)})`;
    overlay.style.setProperty('--k', next.k.toFixed(4));
    if (zoomLabel) zoomLabel.textContent = `${Math.round(next.k * 100)} %`;
  };

  /** Todo el archivo a la vista, centrado */
  const fitAll = (): Camera => {
    const box = overlay.getBoundingClientRect();
    const margin = Math.min(64, box.width * 0.05);
    const k = Math.min((box.width - margin * 2) / bounds.w, (box.height - margin * 2 - 48) / bounds.h, 1);
    return {
      k,
      x: (box.width - bounds.w * k) / 2 - bounds.x * k,
      y: (box.height - 48 - bounds.h * k) / 2 - bounds.y * k,
    };
  };
  /**
   * Un frame ocupando el sitio del frame real de la página: de ahí sale y ahí entra la cámara.
   * La miniatura empieza con la barra (D23): se sube lo que mide esa fila a la escala de la miniatura,
   * así la barra de la miniatura queda debajo de la real y su papel coincide con el de la página.
   */
  const fitFrame = (frame: HTMLElement): Camera => {
    const box = overlay.getBoundingClientRect();
    const style = getComputedStyle(root);
    const gutter = parseFloat(style.getPropertyValue('--gutter')) || 16;
    const gutterPx = gutter < 5 ? gutter * 16 : gutter;
    const side = document.querySelector<HTMLElement>('.artboard')?.getBoundingClientRect().left ?? gutterPx;
    const k = (box.width - side * 2) / FRAME_W;
    const bar = CAPTURE_BAR * ((FRAME_W * k) / CAPTURE_W);
    return { k, x: side - +frame.dataset.x! * k, y: -bar - +frame.dataset.y! * k };
  };

  const lock = (on: boolean) => {
    root.classList.toggle('canvas-open', on);
    // La página de detrás queda inerte; la barra no, porque el lienzo empieza debajo de ella y sigue
    // a la vista: sus enlaces y selectores (tema, idioma) tienen que seguir funcionando.
    for (const el of document.querySelectorAll<HTMLElement>('main, footer')) el.inert = on;
    for (const btn of document.querySelectorAll<HTMLElement>('[data-canvas-open]')) btn.setAttribute('aria-pressed', String(on));
  };

  const show = (from?: HTMLElement | null) => {
    if (open) return;
    open = true;
    // Desde el bocadillo "Cómo lo veo yo", el foco vuelve a la caricatura: su panel se cierra al elegir
    trigger =
      from?.closest('[data-vb]')?.querySelector<HTMLElement>('[data-vb-toggle]') ??
      from ??
      (document.activeElement as HTMLElement | null);
    window.clearTimeout(timer);
    // El menú de móvil, si estaba abierto, se cierra
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn?.getAttribute('aria-expanded') === 'true') menuBtn.click();
    overlay.hidden = false;
    lock(true);
    if (grid.matches) {
      overlay.scrollTop = 0;
      requestAnimationFrame(() => overlay.classList.add('is-open'));
      current.scrollIntoView({ block: 'center' });
    } else {
      // Sale de la página actual y se aleja hasta ver el archivo entero
      apply(found ? fitFrame(current) : fitAll());
      void overlay.offsetWidth;
      overlay.classList.add('is-open');
      if (found) requestAnimationFrame(() => apply(fitAll(), true));
    }
    current.focus({ preventScroll: true });
  };

  const hide = () => {
    if (!open) return;
    open = false;
    const done = () => {
      overlay.hidden = true;
      overlay.classList.remove('is-flying');
      lock(false);
      trigger?.focus({ preventScroll: true });
    };
    if (grid.matches || !found) {
      overlay.classList.remove('is-open');
      timer = window.setTimeout(done, 180);
      return;
    }
    // Vuelve a entrar en la página en la que estabas
    apply(fitFrame(current), true);
    timer = window.setTimeout(() => {
      overlay.classList.remove('is-open');
      timer = window.setTimeout(done, 180);
    }, flight() * 0.8);
  };

  /** Entra en un frame: la cámara se acerca hasta él y entonces se cambia de página, sin otra transición */
  const enter = (frame: HTMLAnchorElement) => {
    if (frame === found) {
      hide();
      return;
    }
    const go = () => {
      root.dataset.canvasNav = '1';
      navigate(frame.href);
    };
    if (grid.matches) {
      go();
      return;
    }
    apply(fitFrame(frame), true);
    window.setTimeout(go, flight() * 0.86);
  };

  // --- Abrir y cerrar ---
  document.addEventListener(
    'click',
    (event) => {
      const target = event.target instanceof Element ? event.target : null;
      const opener = target?.closest<HTMLElement>('[data-canvas-open]');
      if (opener) {
        if (open) hide();
        else show(opener);
        return;
      }
      if (target?.closest('[data-canvas-close]')) hide();
      if (target?.closest('[data-canvas-fit]') && open) apply(fitAll(), true);
    },
    { signal },
  );
  document.addEventListener(
    'keydown',
    (event) => {
      const typing = event.target instanceof HTMLElement && event.target.closest('input, textarea, select, [contenteditable]');
      if (typing || event.metaKey || event.ctrlKey || event.altKey) return;
      if (event.key === 'Escape' && open) {
        event.preventDefault();
        hide();
      } else if (event.key.toLowerCase() === 'm') {
        event.preventDefault();
        if (open) hide();
        else show();
      }
    },
    { signal },
  );

  // --- Arrastrar, pellizcar y zoom con la rueda ---
  const pointers = new Map<number, { x: number; y: number }>();
  let moved = 0;
  let pinch = 0;
  const zoomAt = (px: number, py: number, k: number) => {
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, k));
    const ratio = next / camera.k;
    apply({ k: next, x: px - (px - camera.x) * ratio, y: py - (py - camera.y) * ratio });
  };
  overlay.addEventListener(
    'pointerdown',
    (event) => {
      if (grid.matches || (event.target as Element).closest('.cmap-tools')) return;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      moved = 0;
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        pinch = Math.hypot(a.x - b.x, a.y - b.y);
      }
    },
    { signal },
  );
  overlay.addEventListener(
    'pointermove',
    (event) => {
      const last = pointers.get(event.pointerId);
      if (!last) return;
      const dx = event.clientX - last.x, dy = event.clientY - last.y;
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        const distance = Math.hypot(a.x - b.x, a.y - b.y);
        const box = overlay.getBoundingClientRect();
        if (pinch) zoomAt((a.x + b.x) / 2 - box.left, (a.y + b.y) / 2 - box.top, camera.k * (distance / pinch));
        pinch = distance;
        moved = 99;
        return;
      }
      moved += Math.abs(dx) + Math.abs(dy);
      if (moved < 5) return;
      overlay.classList.add('is-dragging');
      overlay.setPointerCapture(event.pointerId);
      apply({ ...camera, x: camera.x + dx, y: camera.y + dy });
    },
    { signal },
  );
  const release = (event: PointerEvent) => {
    pointers.delete(event.pointerId);
    pinch = 0;
    overlay.classList.remove('is-dragging');
  };
  overlay.addEventListener('pointerup', release, { signal });
  overlay.addEventListener('pointercancel', release, { signal });
  overlay.addEventListener(
    'wheel',
    (event) => {
      if (grid.matches) return;
      event.preventDefault();
      const box = overlay.getBoundingClientRect();
      zoomAt(event.clientX - box.left, event.clientY - box.top, camera.k * Math.exp(-event.deltaY * (event.ctrlKey ? 0.012 : 0.0018)));
    },
    { passive: false, signal },
  );

  // --- Entrar en un frame (si no se estaba arrastrando) ---
  overlay.addEventListener(
    'click',
    (event) => {
      const frame = (event.target as Element).closest<HTMLAnchorElement>('[data-canvas-frame]');
      if (!frame) return;
      event.preventDefault();
      if (moved < 5) enter(frame);
    },
    { signal },
  );

  window.addEventListener('resize', () => open && !grid.matches && apply(fitAll()), { signal });
  document.addEventListener(
    'astro:before-swap',
    () => {
      controller.abort();
      window.clearTimeout(timer);
    },
    { once: true },
  );
}

document.addEventListener('astro:page-load', initCanvas);
