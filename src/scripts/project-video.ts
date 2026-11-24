// El vídeo de un proyecto (src/components/ui/ProjectVideo.astro):
// - el archivo se pide al acercarse la caja a la pantalla (hasta entonces, solo el póster);
// - se mueve mientras se ve al menos una cuarta parte y se para al salir, al ocultar la pestaña
//   y al cambiar de página;
// - el botón lo pausa y lo reanuda (WCAG 2.2.2). Con "reducir movimiento" nace parado.

const NEAR_MARGIN = '300px 0px';
const PLAY_RATIO = 0.25;

function initVideo(root: HTMLElement, signal: AbortSignal, reduce: MediaQueryList) {
  const video = root.querySelector<HTMLVideoElement>('video');
  const button = root.querySelector<HTMLButtonElement>('[data-video-toggle]');
  if (!video || !button) return;

  // Lo que ha elegido quien mira: parado a mano (o por reducir movimiento). Con la pantalla ocultada,
  // fuera de vista o sin cargar, el vídeo se para sin que esto cambie
  let wantsPaused = reduce.matches;
  let visible = false;

  const attach = () => {
    const src = video.dataset.videoSrc;
    if (src && !video.getAttribute('src')) video.setAttribute('src', src);
  };

  const label = () => {
    const playing = !wantsPaused;
    root.dataset.state = playing ? 'playing' : 'paused';
    button.setAttribute('aria-label', (playing ? button.dataset.pause : button.dataset.play) ?? '');
  };

  const sync = () => {
    const shouldPlay = visible && !wantsPaused && !document.hidden;
    if (shouldPlay && video.paused) {
      attach();
      // Si el navegador lo rechaza (ahorro de datos, política de reproducción), se queda en el póster
      video.play().catch(() => {});
    } else if (!shouldPlay && !video.paused) {
      video.pause();
    }
  };

  const near = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      attach();
      near.disconnect();
    },
    { rootMargin: NEAR_MARGIN },
  );
  const seen = new IntersectionObserver(
    (entries) => {
      visible = entries[entries.length - 1].intersectionRatio >= PLAY_RATIO;
      sync();
    },
    { threshold: [0, PLAY_RATIO, 1] },
  );
  near.observe(root);
  seen.observe(root);

  button.addEventListener(
    'click',
    () => {
      wantsPaused = !wantsPaused;
      label();
      sync();
    },
    { signal },
  );
  document.addEventListener('visibilitychange', sync, { signal });
  // Si cambia la preferencia con la página abierta: reducir para en el acto; quitarla no arranca nada solo
  reduce.addEventListener(
    'change',
    () => {
      if (reduce.matches) wantsPaused = true;
      label();
      sync();
    },
    { signal },
  );
  signal.addEventListener('abort', () => {
    near.disconnect();
    seen.disconnect();
    video.pause();
  });

  label();
}

function initProjectVideos() {
  const roots = document.querySelectorAll<HTMLElement>('[data-video]');
  if (!roots.length) return;
  const controller = new AbortController();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  roots.forEach((root) => initVideo(root, controller.signal, reduce));
  // Antes de cambiar de página se suelta todo: la página nueva vuelve a enlazar los suyos
  document.addEventListener('astro:before-swap', () => controller.abort(), { once: true });
}

document.addEventListener('astro:page-load', initProjectVideos);
