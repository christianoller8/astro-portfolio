// Los proyectos se pueden tocar (plan §5.2): una mini interacción en cada fragmento de interfaz.
// - Tempora: pulsar una casilla vacía del cuadrante pone su turno.
// - Víbora: elegir una pista libre y confirmar la reserva.
// - Learnish: ver la respuesta y pasar de tarjeta.
// - Vístalo: abrir la web real dentro de su marco (solo se carga al pedirla).
// Todo va por delegación sobre [data-demo]; los datos de cada demo vienen en data-demo-data.

const data = <T>(root: HTMLElement) => JSON.parse(root.dataset.demoData ?? '{}') as T;
const replay = (el: Element, className: string) => {
  el.classList.remove(className);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(className);
};

/**
 * Región educada de cada demo: lo que cambia en pantalla (una fila nueva, "Fichado", "Reserva
 * confirmada") no lo leía un lector de pantalla. La región se crea al cargar la página, antes de
 * que cambie su texto, porque una región creada con el texto ya puesto no se anuncia (WCAG 4.1.3).
 */
const region = (root: HTMLElement) => {
  let node = root.querySelector<HTMLElement>(':scope > [data-demo-live-region]');
  if (!node) {
    node = document.createElement('span');
    node.className = 'sr-only';
    node.setAttribute('role', 'status');
    node.setAttribute('aria-live', 'polite');
    node.dataset.demoLiveRegion = '';
    root.append(node);
  }
  return node;
};
const say = (root: HTMLElement, template: string | undefined, values: Record<string, string>) => {
  if (!template) return;
  const text = template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '');
  const node = region(root);
  node.textContent = '';
  requestAnimationFrame(() => (node.textContent = text));
};
document.addEventListener('astro:page-load', () => {
  document.querySelectorAll<HTMLElement>('[data-demo]:not([data-demo="live"])').forEach(region);
});

/* ---------- Tempora ---------- */

// Como en el cuadrante real: la casilla vacía se pulsa y entra su turno, con su color y su letra
function tempora(root: HTMLElement, target: Element) {
  const cell = target.closest<HTMLElement>('[data-demo-cell]');
  if (!cell) return;
  const info = data<{ say: { added: string }; shifts: Record<string, string> }>(root);
  const code = cell.dataset.shift ?? 'M';
  const label = info.shifts[code] ?? code;
  const chip = document.createElement('span');
  chip.className = `tp-shift s-${code} is-just`;
  const letter = document.createElement('span');
  letter.setAttribute('aria-hidden', 'true');
  letter.textContent = code;
  const name = document.createElement('span');
  name.className = 'sr-only';
  name.textContent = label;
  chip.append(letter, name);
  // El botón desaparece y el foco se perdería en body (WCAG 2.4.3): pasa a la siguiente casilla vacía
  const hadFocus = document.activeElement === cell;
  const following = [...root.querySelectorAll<HTMLElement>('[data-demo-cell]')].find((el) => el !== cell);
  cell.replaceWith(chip);
  if (hadFocus) following?.focus({ preventScroll: true });
  say(root, info.say.added, { name: cell.dataset.name ?? '', shift: `${label}, ${cell.dataset.day ?? ''}` });
}

/* ---------- Víbora ---------- */

// Como en la agenda real: la hora libre pasa a «Seleccionada», el diálogo repite los datos y, al
// reservar, la hora queda «Ocupada» (con su trama) y sale el aviso de abajo
type SlotState = 'free' | 'taken' | 'picked';

function vibora(root: HTMLElement, target: Element) {
  const info = data<{ states: Record<SlotState, string>; done: string; say: { picked: string; unpicked: string; confirmed: string } }>(root);
  const dialog = root.querySelector<HTMLElement>('[data-demo-dialog]');
  const toast = root.querySelector<HTMLElement>('[data-demo-toast]');
  if (!dialog) return;
  const picked = () => root.querySelector<HTMLButtonElement>('[data-demo-slot][aria-pressed="true"]');
  const mark = (slot: HTMLElement, state: SlotState) => {
    slot.setAttribute('aria-pressed', String(state === 'picked'));
    slot.classList.toggle('is-picked', state === 'picked');
    const label = slot.querySelector('em');
    if (label) label.textContent = info.states[state];
  };

  const slot = target.closest<HTMLButtonElement>('[data-demo-slot]');
  if (slot) {
    const current = picked();
    if (current && current !== slot) mark(current, 'free');
    const on = slot.getAttribute('aria-pressed') !== 'true';
    mark(slot, on ? 'picked' : 'free');
    dialog.hidden = !on;
    if (toast) toast.hidden = true;
    if (on) {
      dialog.querySelector('[data-demo-time]')!.textContent = slot.dataset.time ?? '';
      dialog.querySelector('[data-demo-price]')!.textContent = slot.dataset.price ?? '';
      dialog.querySelector<HTMLElement>('[data-demo-confirm]')?.focus({ preventScroll: true });
    }
    say(root, on ? info.say.picked : info.say.unpicked, { slot: slot.dataset.demoSlot ?? '' });
    return;
  }

  if (target.closest('[data-demo-back]')) {
    const current = picked();
    dialog.hidden = true;
    if (current) {
      mark(current, 'free');
      current.focus({ preventScroll: true });
    }
    say(root, info.say.unpicked, {});
    return;
  }

  if (target.closest('[data-demo-confirm]')) {
    const current = picked();
    if (!current) return;
    dialog.hidden = true;
    // Reservada, deja de ser un botón; el foco pasa a la siguiente hora libre o, si no queda, al aviso
    const taken = document.createElement('span');
    taken.className = 'vb-slot is-taken is-just';
    taken.append(...[...current.childNodes].map((node) => node.cloneNode(true)));
    const label = taken.querySelector('em');
    if (label) label.textContent = info.states.taken;
    const following = [...root.querySelectorAll<HTMLElement>('[data-demo-slot]')].find((el) => el !== current);
    current.replaceWith(taken);
    if (toast) {
      toast.textContent = info.done.replace('{time}', current.dataset.time ?? '');
      toast.hidden = false;
    }
    (following ?? toast)?.focus({ preventScroll: true });
    say(root, info.say.confirmed, { slot: current.dataset.demoSlot ?? '' });
  }
}

/* ---------- Learnish ---------- */

function learnish(root: HTMLElement, target: Element) {
  const info = data<{ cards: [string, string][]; of: string; say: { answer: string; card: string } }>(root);
  const answer = root.querySelector<HTMLElement>('[data-demo-answer]');
  const reveal = root.querySelector<HTMLElement>('[data-demo-reveal]');
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-demo-next]');
  if (!answer || !reveal) return;

  if (target.closest('[data-demo-reveal]')) {
    reveal.hidden = true;
    answer.hidden = false;
    buttons.forEach((btn) => (btn.disabled = false));
    buttons[1]?.focus({ preventScroll: true });
    say(root, info.say.answer, { answer: answer.textContent?.trim() ?? '' });
    return;
  }

  const next = target.closest<HTMLElement>('[data-demo-next]');
  if (next) {
    // "Lo sabía" avanza la lección; "Repasar" deja la tarjeta para después
    let step = Number(root.dataset.demoStep ?? 7);
    if (next.dataset.demoNext === 'good') step = step >= 10 ? 1 : step + 1;
    root.dataset.demoStep = String(step);
    const index = (Number(root.dataset.demoCard ?? 0) + 1) % info.cards.length;
    root.dataset.demoCard = String(index);
    const [word, translation] = info.cards[index];
    root.querySelector('[data-demo-word]')!.textContent = word;
    answer.textContent = translation;
    answer.hidden = true;
    reveal.hidden = false;
    buttons.forEach((btn) => (btn.disabled = true));
    root.querySelector('[data-demo-progress]')!.textContent = `${step} ${info.of} 10`;
    root.querySelector<HTMLElement>('[data-demo-bar]')!.style.width = `${step * 10}%`;
    const card = root.querySelector('[data-demo-card]');
    if (card) replay(card, 'is-next');
    reveal.focus({ preventScroll: true });
    say(root, info.say.card, { word });
  }
}

/* ---------- Vístalo: la web real dentro de su marco ---------- */

/** La web se carga a ancho de escritorio (o de móvil, si el marco es estrecho) y se escala al marco */
function fit(stage: HTMLElement) {
  const frame = stage.querySelector<HTMLIFrameElement>('iframe');
  // Sin ancho (el marco está en una vista escondida, como las cajas de Proyectos con el lienzo a la
  // vista) no hay nada que medir: se deja como estaba
  if (!frame || !stage.clientWidth) return;
  const width = stage.clientWidth < 520 ? 390 : 1280;
  const k = stage.clientWidth / width;
  frame.style.width = `${width}px`;
  frame.style.height = `${Math.ceil(stage.clientHeight / k)}px`;
  frame.style.transform = `scale(${k.toFixed(4)})`;
}

function live(root: HTMLElement, target: Element) {
  const toggle = target.closest<HTMLButtonElement>('[data-demo-live]');
  const stage = root.querySelector<HTMLElement>('[data-demo-stage]');
  if (!toggle || !stage) return;
  const open = !root.classList.contains('is-live');
  root.classList.toggle('is-live', open);
  toggle.setAttribute('aria-pressed', String(open));
  toggle.querySelector('span')!.textContent = (open ? toggle.dataset.close : toggle.dataset.open) ?? '';
  if (!open) {
    stage.querySelector('iframe')?.remove();
    return;
  }
  const frame = document.createElement('iframe');
  frame.src = root.dataset.demoUrl ?? '';
  frame.title = root.dataset.demoTitle ?? '';
  frame.loading = 'eager';
  frame.referrerPolicy = 'no-referrer';
  frame.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  stage.append(frame);
  fit(stage);
}

/* ---------- Eventos (una sola vez por carga) ---------- */

const DEMOS: Record<string, (root: HTMLElement, target: Element) => void> = { tempora, vibora, learnish, live };

document.addEventListener('click', (event) => {
  const target = event.target instanceof Element ? event.target : null;
  const root = target?.closest<HTMLElement>('[data-demo]');
  if (!target || !root) return;
  DEMOS[root.dataset.demo ?? '']?.(root, target);
});

window.addEventListener(
  'resize',
  () => document.querySelectorAll<HTMLElement>('[data-demo="live"].is-live [data-demo-stage]').forEach(fit),
  { passive: true },
);
