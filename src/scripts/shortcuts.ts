// Atajos de una sola tecla (1, 2, 3 para las lentes y M para el lienzo): WCAG 2.1.4 pide que se
// puedan apagar. Christian decidió el 20 nov un ajuste en el panel de la caricatura, "Atajos de
// teclado", encendido por defecto y recordado en localStorage. Apagado:
// - 1, 2, 3 y M no hacen nada (lenses.ts y canvas.ts preguntan a shortcutsOn()); Esc sigue
//   funcionando, porque no es un atajo de un carácter imprimible y sirve para salir de lo abierto.
// - Los avisos de teclas desaparecen: las <kbd> marcadas con data-key-hint (global.css) y los
//   aria-keyshortcuts de esas teclas, que ya no serían verdad.
// El estado vive en html[data-shortcuts="off"]; el script del <head> (Layout.astro) lo restaura
// antes del primer pintado y tras cada cambio de página, porque Astro cambia los atributos de html.

const root = document.documentElement;
const STORAGE_KEY = 'shortcuts';

export const shortcutsOn = () => root.dataset.shortcuts !== 'off';

/** Pone al día lo que depende del estado: el interruptor y los aria-keyshortcuts de las teclas sueltas */
function sync() {
  const on = shortcutsOn();
  document.querySelectorAll<HTMLElement>('[data-shortcuts-switch]').forEach((el) => el.setAttribute('aria-checked', String(on)));
  document.querySelectorAll<HTMLElement>('[aria-keyshortcuts], [data-keyshortcuts]').forEach((el) => {
    // Escape no es un atajo de un solo carácter: se queda siempre
    const keys = el.getAttribute('aria-keyshortcuts') ?? el.dataset.keyshortcuts ?? '';
    if (keys === 'Escape') return;
    if (on) {
      if (el.dataset.keyshortcuts) el.setAttribute('aria-keyshortcuts', el.dataset.keyshortcuts);
      delete el.dataset.keyshortcuts;
    } else {
      el.dataset.keyshortcuts = keys;
      el.removeAttribute('aria-keyshortcuts');
    }
  });
}

// El estado también vive en memoria: Astro cambia los atributos de html al navegar, y sin
// almacenamiento (bloqueado) el script del <head> no tiene de dónde restaurarlo. Este módulo sigue
// cargado entre páginas, así que recuerda el último valor y lo repone tras cada cambio
let current = shortcutsOn();

export function setShortcuts(on: boolean) {
  current = on;
  if (on) delete root.dataset.shortcuts;
  else root.dataset.shortcuts = 'off';
  try {
    if (on) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, 'off');
  } catch {
    /* sin almacenamiento: el ajuste vive solo en esta página */
  }
  sync();
}

document.addEventListener('click', (event) => {
  const toggle = event.target instanceof Element ? event.target.closest('[data-shortcuts-switch]') : null;
  if (toggle) setShortcuts(!shortcutsOn());
});
document.addEventListener('astro:after-swap', () => {
  if (current) delete root.dataset.shortcuts;
  else root.dataset.shortcuts = 'off';
  sync();
});
document.addEventListener('astro:page-load', sync);
sync();
