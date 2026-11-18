// Intro de la primera visita (plan §4.3 A). Solo con html.intro, decidido en el <head>.
// La secuencia: la marca se traza en contorno (CSS, 800 ms) · espera en contorno hasta que la página
// está lista · relleno (200 ms) · pausa (400 ms) · el iris se cierra y el hero entra escalonado.
const TRACE = 800;
const MIN_OUTLINE = 300; // espera mínima en contorno, para que se vea
const MAX_WAIT = 1500; // espera máxima a la carga
const FILL = 200;
const HOLD = 400;
const LEAVE = 1150; // el iris (850 ms) y la última pieza del hero

const wait = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

function initIntro() {
  const root = document.documentElement;
  if (!root.classList.contains('intro')) return;
  const screen = document.querySelector<HTMLElement>('[data-intro-screen]');
  if (!screen) {
    root.classList.remove('intro');
    return;
  }

  let leaving = false;
  const cleanup = () => {
    root.classList.remove('intro', 'inking');
    screen.classList.remove('is-filled', 'is-leaving');
    window.removeEventListener('pointerdown', skip);
    window.removeEventListener('keydown', skip);
  };
  const leave = () => {
    if (leaving) return;
    leaving = true;
    screen.classList.add('is-filled', 'is-leaving');
    root.classList.add('inking');
    window.setTimeout(cleanup, LEAVE);
  };
  // Cualquier tecla o clic salta a la salida
  function skip() {
    leave();
  }
  window.addEventListener('pointerdown', skip, { once: true });
  window.addEventListener('keydown', skip, { once: true });

  // Lo que falta del trazado: lo dice la propia animación, que empezó con el primer pintado
  const tracing = screen.querySelector('.car-ink')?.getAnimations()[0]?.currentTime;
  const traceLeft = Math.max(0, TRACE - (typeof tracing === 'number' ? tracing : TRACE));

  // La página está lista cuando están las fuentes y la foto del hero
  const photo = [...document.querySelectorAll<HTMLImageElement>('.hero-photo-img')].find(
    (img) => getComputedStyle(img).display !== 'none',
  );
  const ready = Promise.all([
    document.fonts?.ready ?? Promise.resolve(),
    photo ? photo.decode().catch(() => undefined) : Promise.resolve(),
  ]);

  (async () => {
    await wait(traceLeft + MIN_OUTLINE);
    await Promise.race([ready, wait(MAX_WAIT)]);
    if (leaving) return;
    screen.classList.add('is-filled');
    await wait(FILL + HOLD);
    leave();
  })();
}

initIntro();
