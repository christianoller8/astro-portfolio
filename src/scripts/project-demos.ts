// Los proyectos se pueden tocar (plan §5.2): una mini interacción en cada fragmento de interfaz.
// - Tempora: añadir un turno y fichar a quien está pendiente.
// - Vibora: elegir una pista libre y confirmar la reserva.
// - Learnish: ver la respuesta y pasar de tarjeta.
// - Vístalo: abrir la web real dentro de su marco (solo se carga al pedirla).
// Todo va por delegación sobre [data-demo]; los datos de cada demo vienen en data-demo-data.

const data = <T>(root: HTMLElement) => JSON.parse(root.dataset.demoData ?? '{}') as T;
const bump = (el: Element | null, by: number) => {
  if (el) el.textContent = String(Math.max(0, Number(el.textContent) + by));
};
const replay = (el: Element, className: string) => {
  el.classList.remove(className);
  void (el as HTMLElement).offsetWidth;
  el.classList.add(className);
};

/* ---------- Tempora ---------- */

type Person = { name: string; initials: string; unit: string; shift: string };

function tempora(root: HTMLElement, target: Element) {
  const [shifts, done, pending] = root.querySelectorAll('[data-demo-stat]');
  const info = data<{ next: Person[]; done: string }>(root);

  if (target.closest('[data-demo-add]')) {
    const template = root.querySelector<HTMLTemplateElement>('template[data-demo-row]');
    const head = root.querySelector('.tp-row--head');
    const row = template?.content.firstElementChild?.cloneNode(true) as HTMLElement | undefined;
    if (!row || !head) return;
    const turn = Number(root.dataset.demoTurn ?? 0);
    const person = info.next[turn % info.next.length];
    root.dataset.demoTurn = String(turn + 1);
    const [who, unit, shift] = row.children;
    who.querySelector('i')!.textContent = person.initials;
    who.querySelector('b')!.textContent = person.name;
    unit.textContent = person.unit;
    shift.textContent = person.shift;
    head.after(row);
    bump(shifts, 1);
    bump(pending, 1);
    // La tabla no crece sin fin: se quedan las seis filas más recientes
    const rows = root.querySelectorAll('.tp-row:not(.tp-row--head)');
    if (rows.length > 6) rows[rows.length - 1].remove();
    return;
  }

  const chip = target.closest<HTMLElement>('[data-demo-clock]');
  if (chip) {
    chip.textContent = info.done;
    chip.classList.remove('is-pending');
    chip.removeAttribute('data-demo-clock');
    chip.setAttribute('disabled', '');
    replay(chip, 'is-just');
    bump(done, 1);
    bump(pending, -1);
  }
}

/* ---------- Vibora ---------- */

function vibora(root: HTMLElement, target: Element) {
  const info = data<{ free: string; mine: string; confirmed: string; pick: string }>(root);
  const bar = root.querySelector('.vb-bar');
  const summary = root.querySelector('[data-demo-summary]');
  const confirm = root.querySelector<HTMLButtonElement>('[data-demo-confirm]');
  const slots = [...root.querySelectorAll<HTMLButtonElement>('[data-demo-slot]')];

  const slot = target.closest<HTMLButtonElement>('[data-demo-slot]');
  if (slot) {
    const on = slot.getAttribute('aria-pressed') !== 'true';
    for (const other of slots) {
      const mine = other === slot && on;
      other.setAttribute('aria-pressed', String(mine));
      other.classList.toggle('is-mine', mine);
      other.textContent = mine ? info.mine : info.free;
    }
    bar?.classList.remove('is-done');
    if (summary) summary.textContent = on ? `${slot.dataset.demoSlot} · 90 min` : info.pick;
    if (confirm) confirm.disabled = !on;
    return;
  }

  if (target.closest('[data-demo-confirm]') && bar && summary) {
    const picked = slots.find((s) => s.getAttribute('aria-pressed') === 'true');
    if (!picked) return;
    summary.textContent = `${info.confirmed} · ${picked.dataset.demoSlot}`;
    bar.classList.add('is-done');
  }
}

/* ---------- Learnish ---------- */

function learnish(root: HTMLElement, target: Element) {
  const info = data<{ cards: [string, string][]; of: string }>(root);
  const answer = root.querySelector<HTMLElement>('[data-demo-answer]');
  const reveal = root.querySelector<HTMLElement>('[data-demo-reveal]');
  const buttons = root.querySelectorAll<HTMLButtonElement>('[data-demo-next]');
  if (!answer || !reveal) return;

  if (target.closest('[data-demo-reveal]')) {
    reveal.hidden = true;
    answer.hidden = false;
    buttons.forEach((btn) => (btn.disabled = false));
    buttons[1]?.focus({ preventScroll: true });
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
  }
}

/* ---------- Vístalo: la web real dentro de su marco ---------- */

/** La web se carga a ancho de escritorio (o de móvil, si el marco es estrecho) y se escala al marco */
function fit(stage: HTMLElement) {
  const frame = stage.querySelector<HTMLIFrameElement>('iframe');
  if (!frame) return;
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
