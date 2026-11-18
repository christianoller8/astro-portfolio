// Tres lentes (Diseño · Código · QA): capas calculadas en el navegador sobre la propia web.
// El estado vive en html[data-lens] y en localStorage; el script inline del <head> lo restaura antes de pintar.

type Lens = 'design' | 'code' | 'qa';
type Check = { ok: boolean; label: string; el?: Element; note?: string; badge?: boolean };
type Rgba = [number, number, number, number];

const LENSES: Lens[] = ['design', 'code', 'qa'];
const STORAGE_KEY = 'lens';
const root = document.documentElement;

const NOTES = {
  es: {
    alt: 'alt',
    decorative: 'decorativa',
    noAlt: 'sin alt',
    name: 'nombre accesible',
    noName: 'sin nombre',
    target: 'tamaño táctil',
    small: 'objetivo pequeño',
    label: 'etiqueta',
    noLabel: 'sin etiqueta',
    contrast: 'contraste',
    h1: 'Un único h1',
    order: 'Encabezados en orden',
    lang: 'Idioma declarado',
    title: 'Título de la página',
    failed: 'Por revisar',
  },
  en: {
    alt: 'alt',
    decorative: 'decorative',
    noAlt: 'no alt',
    name: 'accessible name',
    noName: 'no name',
    target: 'target size',
    small: 'small target',
    label: 'label',
    noLabel: 'no label',
    contrast: 'contrast',
    h1: 'Single h1',
    order: 'Headings in order',
    lang: 'Language declared',
    title: 'Page title',
    failed: 'To review',
  },
};

const isLens = (value: unknown): value is Lens => LENSES.includes(value as Lens);
const currentLens = (): Lens | null => (isLens(root.dataset.lens) ? root.dataset.lens : null);
const lang = () => (root.lang === 'en' ? 'en' : 'es');
const fmt = (value: number, digits = 0) =>
  new Intl.NumberFormat(lang(), {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  }).format(value);

export function setLens(next: Lens | null) {
  if (next) root.dataset.lens = next;
  else delete root.dataset.lens;
  try {
    if (next) localStorage.setItem(STORAGE_KEY, next);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* sin almacenamiento: la lente vive solo en esta página */
  }
  render();
}

function syncButtons() {
  const lens = currentLens();
  document.querySelectorAll<HTMLButtonElement>('[data-lens-set]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lensSet === lens));
  });
}

function clearMarks() {
  document.querySelectorAll('[data-qa]').forEach((el) => {
    el.removeAttribute('data-qa');
    el.removeAttribute('data-qa-note');
  });
  document.querySelectorAll('[data-ds-meta]').forEach((el) => el.removeAttribute('data-ds-meta'));
  document.querySelectorAll('[data-cs-auto]').forEach((el) => {
    el.removeAttribute('data-cs');
    el.removeAttribute('data-cs-auto');
  });
}

/* ---------- Diseño ---------- */

const shortFamily = (family: string) =>
  family
    .split(',')[0]
    .replace(/["']/g, '')
    .replace(/ Variable$/, '')
    .trim();

function annotateDesign() {
  document.querySelectorAll<HTMLElement>('[data-ds]').forEach((el) => {
    if (el.hasAttribute('data-ds-type')) {
      const cs = getComputedStyle(el);
      const size = parseFloat(cs.fontSize);
      const leading = parseFloat(cs.lineHeight) / size;
      el.dataset.dsMeta = `${shortFamily(cs.fontFamily)} ${fmt(size)}/${fmt(leading, 2)} · ${cs.fontWeight}`;
    } else {
      const box = el.getBoundingClientRect();
      el.dataset.dsMeta = `${fmt(box.width)} × ${fmt(box.height)}`;
    }
  });
}

function designPanel(i18n: Record<string, string>) {
  const styles = getComputedStyle(root);
  const tokens = ['--paper', '--ink', '--muted', '--graphite', '--canvas'].map((name) => ({
    name,
    value: styles.getPropertyValue(name).trim(),
  }));
  const families = new Set<string>();
  document.fonts.forEach((face) => {
    if (face.status === 'loaded') families.add(shortFamily(face.family));
  });
  const swatches = tokens
    .map(
      (token) =>
        `<li style="display:flex;align-items:center;gap:.5rem"><span style="width:14px;height:14px;background:${token.value};box-shadow:inset 0 0 0 1px rgb(127 127 127 / .5)"></span>${token.name.slice(2)} <span style="opacity:.75">${token.value}</span></li>`,
    )
    .join('');
  return `<p style="font-weight:600">${i18n.colors}</p><ul style="display:grid;gap:.25rem;margin:.35rem 0 .75rem">${swatches}</ul><p style="font-weight:600">${i18n.fonts}</p><p>${[...families].join(' · ')}</p>`;
}

/* ---------- Código ---------- */

function annotateCode() {
  document.querySelectorAll<HTMLElement>('main h1, main h2').forEach((heading) => {
    if (heading.hasAttribute('data-cs')) return;
    heading.dataset.cs = `<${heading.tagName.toLowerCase()}>`;
    heading.dataset.csAuto = '';
  });
}

function codePanel(i18n: Record<string, string>) {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const bytes = (entry: PerformanceResourceTiming) =>
    entry.transferSize || entry.encodedBodySize || 0;
  const inline = (selector: string) =>
    [...document.querySelectorAll(selector)].reduce(
      (sum, el) => sum + (el.textContent?.length ?? 0),
      0,
    );
  const js =
    resources.filter((e) => /\.m?js(\?|$)/.test(e.name)).reduce((sum, e) => sum + bytes(e), 0) +
    inline('script:not([src]):not([type="application/ld+json"])');
  const css =
    resources.filter((e) => /\.css(\?|$)/.test(e.name)).reduce((sum, e) => sum + bytes(e), 0) +
    inline('style');
  const nav = performance.getEntriesByType('navigation')[0] as
    | PerformanceNavigationTiming
    | undefined;
  const load = nav ? nav.loadEventEnd || nav.domContentLoadedEventEnd : 0;
  const nodes = document.getElementsByTagName('*').length;
  const rows = [
    [fmt(nodes), i18n.nodes],
    [`${fmt(js / 1024, 1)} KB`, i18n.js],
    [`${fmt(css / 1024, 1)} KB`, i18n.css],
    ...(load ? [[`${fmt(load / 1000, 2)} s`, i18n.load]] : []),
  ];
  return `<ul style="display:grid;gap:.3rem">${rows
    .map(([value, label]) => `<li><strong style="font-weight:700">${value}</strong> ${label}</li>`)
    .join('')}</ul>`;
}

/* ---------- QA ---------- */

function parseColor(value: string): Rgba | null {
  const rgb = value.match(/rgba?\(([^)]+)\)/);
  if (rgb) {
    const [r, g, b, a = '1'] = rgb[1].split(/[\s,/]+/).filter(Boolean);
    return [+r, +g, +b, +a];
  }
  const srgb = value.match(/color\(srgb ([^)]+)\)/);
  if (srgb) {
    const parts = srgb[1]
      .split(/[\s/]+/)
      .filter(Boolean)
      .map(Number);
    return [parts[0] * 255, parts[1] * 255, parts[2] * 255, parts[3] ?? 1];
  }
  return null;
}

const over = (top: Rgba, bottom: Rgba): Rgba => {
  const a = top[3];
  return [
    top[0] * a + bottom[0] * (1 - a),
    top[1] * a + bottom[1] * (1 - a),
    top[2] * a + bottom[2] * (1 - a),
    1,
  ];
};

function effectiveBackground(el: Element): Rgba | null {
  const layers: Rgba[] = [];
  for (let node: Element | null = el; node; node = node.parentElement) {
    const cs = getComputedStyle(node);
    if (cs.backgroundImage.includes('url(')) return null;
    const color = parseColor(cs.backgroundColor);
    if (color && color[3] > 0) {
      layers.push(color);
      if (color[3] >= 1) break;
    }
  }
  let result: Rgba = [255, 255, 255, 1];
  for (let i = layers.length - 1; i >= 0; i--) result = over(layers[i], result);
  return result;
}

function luminance([r, g, b]: Rgba) {
  const channel = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

const contrast = (a: Rgba, b: Rgba) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

const visible = (el: Element) => {
  const box = el.getBoundingClientRect();
  if (!box.width || !box.height || el.closest('[hidden], [inert], [aria-hidden="true"]'))
    return false;
  const cs = getComputedStyle(el);
  return cs.visibility !== 'hidden' && cs.display !== 'none';
};

function runChecks(): Check[] {
  const L = NOTES[lang()];
  const checks: Check[] = [];

  checks.push({ ok: !!root.getAttribute('lang'), label: L.lang });
  checks.push({ ok: document.title.trim().length > 0, label: L.title });
  checks.push({ ok: document.querySelectorAll('main h1').length === 1, label: L.h1 });
  let previous = 0;
  let ordered = true;
  document.querySelectorAll('main h1, main h2, main h3, main h4').forEach((heading) => {
    const level = Number(heading.tagName[1]);
    if (previous && level > previous + 1) ordered = false;
    previous = level;
  });
  checks.push({ ok: ordered, label: L.order });

  document.querySelectorAll('main img').forEach((img) => {
    const alt = img.getAttribute('alt');
    const host = img.closest('[data-qa-host]') ?? img.parentElement ?? undefined;
    checks.push({
      ok: alt !== null,
      label: alt === null ? L.noAlt : alt ? L.alt : L.decorative,
      el: host,
      badge: true,
    });
  });

  document.querySelectorAll<HTMLElement>('a[href], button').forEach((el) => {
    if (!visible(el)) return;
    const name =
      el.getAttribute('aria-label')?.trim() ||
      el.textContent?.trim() ||
      el.querySelector('img')?.getAttribute('alt')?.trim() ||
      el.getAttribute('title')?.trim() ||
      '';
    const inHeader = !!el.closest('header');
    checks.push({
      ok: !!name,
      label: name ? L.name : L.noName,
      el,
      badge: !inHeader && el.matches('.btn, button'),
    });
    const inlineLink = el.tagName === 'A' && getComputedStyle(el).display === 'inline';
    if (!inlineLink) {
      const box = el.getBoundingClientRect();
      const ok = box.width >= 24 && box.height >= 24;
      checks.push({
        ok,
        label: ok ? L.target : L.small,
        el,
        note: `${Math.round(box.width)}×${Math.round(box.height)}`,
      });
    }
  });

  document
    .querySelectorAll('main input:not([type="hidden"]), main textarea, main select')
    .forEach((field) => {
      const input = field as HTMLInputElement;
      const ok =
        (input.labels?.length ?? 0) > 0 ||
        input.hasAttribute('aria-label') ||
        input.hasAttribute('aria-labelledby');
      checks.push({
        ok,
        label: ok ? L.label : L.noLabel,
        el: field.closest('[data-qa-host]') ?? field.parentElement ?? undefined,
        badge: true,
      });
    });

  const decimal = lang() === 'es' ? ',' : '.';
  document
    .querySelectorAll<HTMLElement>(
      'main h1, main h2, main h3, main p, main li, main label, main .btn, footer p, footer a',
    )
    .forEach((el) => {
      if (!el.textContent?.trim() || !visible(el)) return;
      const cs = getComputedStyle(el);
      const fg = parseColor(cs.color);
      const bg = effectiveBackground(el);
      if (!fg || !bg) return;
      const ratio = contrast(over(fg, bg), bg);
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
      checks.push({
        ok: ratio >= (large ? 3 : 4.5),
        label: L.contrast,
        el,
        note: `${ratio.toFixed(1).replace('.', decimal)}:1`,
        badge: el.matches('h1, h2, .btn'),
      });
    });

  return checks;
}

function markChecks(checks: Check[]) {
  const marks = new Map<Element, { ok: boolean; notes: string[] }>();
  for (const check of checks) {
    if (!check.el || (!check.badge && check.ok)) continue;
    const entry = marks.get(check.el) ?? { ok: true, notes: [] };
    const note = check.note ? `${check.label} ${check.note}` : check.label;
    if (!check.ok && entry.ok) {
      entry.ok = false;
      entry.notes = [note];
    } else if (check.ok === entry.ok) entry.notes.push(note);
    marks.set(check.el, entry);
  }
  marks.forEach((entry, el) => {
    el.setAttribute('data-qa', entry.ok ? 'ok' : 'warn');
    el.setAttribute('data-qa-note', entry.notes.slice(0, 2).join(' · '));
  });
}

function qaPanel(checks: Check[], i18n: Record<string, string>) {
  const passed = checks.filter((c) => c.ok).length;
  const failed = checks.filter((c) => !c.ok);
  const L = NOTES[lang()];
  const list = failed.length
    ? `<p style="margin-top:.5rem;font-weight:600">${L.failed}</p><ul style="display:grid;gap:.2rem">${failed
        .slice(0, 4)
        .map((c) => `<li>! ${c.label}${c.note ? ` ${c.note}` : ''}</li>`)
        .join('')}</ul>`
    : '';
  return `<p><strong style="font-weight:700;font-size:1.25rem">${passed}/${checks.length}</strong> ${i18n.passed}</p>${list}`;
}

/* ---------- Render ---------- */

function render() {
  syncButtons();
  clearMarks();
  const lens = currentLens();
  const panel = document.querySelector<HTMLElement>('[data-lens-panel]');
  if (!lens || !panel) return;
  const i18n = JSON.parse(panel.dataset.i18n ?? '{}') as Record<string, string>;
  const title = panel.querySelector('[data-lens-title]');
  const body = panel.querySelector('[data-lens-body]');
  const stats = panel.querySelector('[data-lens-stats]');
  if (title) title.textContent = i18n[lens];
  if (body) body.textContent = i18n[`${lens}Body`];
  if (!stats) return;
  if (lens === 'design') {
    annotateDesign();
    stats.innerHTML = designPanel(i18n);
  } else if (lens === 'code') {
    annotateCode();
    stats.innerHTML = codePanel(i18n);
  } else {
    const checks = runChecks();
    markChecks(checks);
    stats.innerHTML = qaPanel(checks, i18n);
  }
}

/* ---------- Eventos (una sola vez por carga) ---------- */

document.addEventListener('click', (event) => {
  const target = event.target as Element | null;
  const setter = target?.closest<HTMLElement>('[data-lens-set]');
  if (setter) {
    const lens = setter.dataset.lensSet;
    setLens(isLens(lens) && lens !== currentLens() ? lens : null);
    return;
  }
  if (target?.closest('[data-lens-clear]')) setLens(null);
});

document.addEventListener('keydown', (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const el = event.target as HTMLElement | null;
  if (el?.closest('input, textarea, select, [contenteditable="true"]')) return;
  if (event.key === 'Escape' && currentLens()) setLens(null);
  const index = ['1', '2', '3'].indexOf(event.key);
  if (index >= 0) setLens(LENSES[index] === currentLens() ? null : LENSES[index]);
});

let resizeTimer = 0;
const onResize = () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(() => currentLens() && render(), 160);
};
new ResizeObserver(onResize).observe(document.documentElement);
document.fonts?.ready.then(() => currentLens() && render());
document.addEventListener('astro:page-load', render);
