// Tres lentes (Diseño · Código · QA): capas de herramienta calculadas en el navegador sobre la propia web.
// - Las marcas (selecciones, guías, cotas, etiquetas, insignias) van en una capa aparte dentro del
//   frame (.lens-layer) y se colocan midiendo cada pieza: no tocan el HTML de la página.
// - La barra de estado de abajo (LensPanel.astro) lleva las cifras de la lente activa.
// - Con ratón, Diseño y Código inspeccionan la pieza que hay bajo el puntero.
// El estado vive en html[data-lens] y en sessionStorage (dura lo que la pestaña); el script inline
// del <head> lo restaura antes de pintar. Los estilos están en src/styles/lenses.css.

import { coveredFrom } from './project-stack';
import { shortcutsOn } from './shortcuts';

type Lens = 'design' | 'code' | 'qa';
type Group = 'structure' | 'alt' | 'name' | 'target' | 'label' | 'contrast';
type Check = { ok: boolean; group: Group; label: string; el?: Element; note?: string; badge?: boolean };
type Rgba = [number, number, number, number];
type Mark = { node: HTMLElement; place: (base: DOMRect, art: DOMRect) => void; live?: boolean; el?: Element };

const LENSES: Lens[] = ['design', 'code', 'qa'];
const GROUPS: Group[] = ['contrast', 'target', 'name', 'alt', 'label', 'structure'];
const STORAGE_KEY = 'lens';
const root = document.documentElement;

const NOTES = {
  es: {
    alt: 'alt',
    decorative: 'decorativa',
    noAlt: 'sin alt',
    name: 'nombre accesible',
    noName: 'sin nombre',
    target: 'táctil',
    small: 'objetivo pequeño',
    label: 'etiqueta',
    noLabel: 'sin etiqueta',
    contrast: 'contraste',
    h1: 'Un único h1',
    order: 'Encabezados en orden',
    lang: 'Idioma declarado',
    title: 'Título de la página',
    column: 'columna',
    margin: 'margen',
    groups: {
      contrast: 'contraste',
      target: 'zona táctil',
      name: 'nombres',
      alt: 'imágenes',
      label: 'formularios',
      structure: 'estructura',
    },
  },
  en: {
    alt: 'alt',
    decorative: 'decorative',
    noAlt: 'no alt',
    name: 'accessible name',
    noName: 'no name',
    target: 'target',
    small: 'small target',
    label: 'label',
    noLabel: 'no label',
    contrast: 'contrast',
    h1: 'Single h1',
    order: 'Headings in order',
    lang: 'Language declared',
    title: 'Page title',
    column: 'column',
    margin: 'margin',
    groups: {
      contrast: 'contrast',
      target: 'target size',
      name: 'names',
      alt: 'images',
      label: 'forms',
      structure: 'structure',
    },
  },
};

const isLens = (value: unknown): value is Lens => LENSES.includes(value as Lens);
const currentLens = (): Lens | null => (isLens(root.dataset.lens) ? root.dataset.lens : null);
const lang = () => (root.lang === 'en' ? 'en' : 'es');
const fmt = (value: number, digits = 0) =>
  new Intl.NumberFormat(lang(), {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
    useGrouping: false,
  }).format(value);
const esc = (text: string) => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const frame = () => document.querySelector<HTMLElement>('main.frame');
const artboard = () => document.querySelector<HTMLElement>('main.frame > .artboard');

export function setLens(next: Lens | null) {
  if (next) root.dataset.lens = next;
  else delete root.dataset.lens;
  try {
    // Solo mientras dure la pestaña (decisión de Christian, 20 nov): antes iba en localStorage
    if (next) sessionStorage.setItem(STORAGE_KEY, next);
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    /* sin almacenamiento: la lente vive solo en esta página */
  }
  render(true);
}

function syncButtons() {
  const lens = currentLens();
  document.querySelectorAll<HTMLButtonElement>('[data-lens-set]').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lensSet === lens));
  });
}

/** Lo que no cuenta para las lentes: lo oculto, lo inerte (la web de ejemplo) y lo que no ocupa sitio */
const visible = (el: Element, strict = true) => {
  const box = el.getBoundingClientRect();
  // strict: lo que llega a un lector de pantalla (QA y Código). Diseño también marca lo decorativo.
  if (!box.width || !box.height || el.closest(strict ? '[hidden], [inert], [aria-hidden="true"]' : '[hidden], [inert]')) return false;
  const cs = getComputedStyle(el);
  return cs.visibility !== 'hidden' && cs.display !== 'none';
};

/* ---------- La capa de marcas ---------- */

let layer: HTMLElement | null = null;
let marks: Mark[] = [];
let hover: { node: HTMLElement; tag: HTMLElement; guides: HTMLElement[] } | null = null;
let targets: Element[] = [];

function resetLayer(lens: Lens | null, animate: boolean) {
  const old = layer;
  layer = null;
  marks = [];
  hover = null;
  targets = [];
  if (old) {
    if (animate) {
      // Cruce de 200 ms entre lentes
      old.classList.add('is-leaving');
      window.setTimeout(() => old.remove(), 220);
    } else old.remove();
  }
  document.querySelectorAll('.lens-layer:not(.is-leaving)').forEach((stale) => stale !== old && stale.remove());
  const host = frame();
  if (!lens || !host) return;
  layer = document.createElement('div');
  layer.className = 'lens-layer';
  layer.dataset.kind = lens;
  layer.setAttribute('aria-hidden', 'true');
  if (!animate) layer.classList.add('is-static');
  host.append(layer);
}

const node = (className: string, html = '') => {
  const el = document.createElement('span');
  el.className = className;
  el.innerHTML = html;
  layer?.append(el);
  return el;
};

/** Marca pegada a un elemento: caja del tamaño del elemento (más un margen) y sus etiquetas dentro */
function markOn(el: Element, className: string, html: string, pad = 0) {
  const mark = node(`lm ${className}`, `<i class="lm-box"></i>${html}`);
  let last = '';
  const entry: Mark = {
    node: mark,
    el,
    // Se vuelve a medir al hacer scroll: hay piezas fijadas (sticky) o que cambian de escala al pasar
    live: true,
    place: (base, art) => {
      // La caja es la parte de la pieza que queda dentro del artboard (el retrato se sale por arriba)
      const box = el.getBoundingClientRect();
      const left = Math.max(box.left - pad, art.left);
      const top = Math.max(box.top - pad, art.top);
      const right = Math.min(box.right + pad, art.right);
      // En las tarjetas apiladas del inicio, solo hasta donde la tapa la siguiente: lo de debajo no se marca
      const bottom = Math.min(box.bottom + pad, art.bottom, coveredFrom(el));
      const key = `${left - base.left}|${top - base.top}|${right - left}|${bottom - top}`;
      if (key === last) return;
      last = key;
      mark.hidden = !box.width || !box.height || right <= left || bottom <= top;
      mark.style.left = `${(left - base.left).toFixed(1)}px`;
      mark.style.top = `${(top - base.top).toFixed(1)}px`;
      mark.style.width = `${(right - left).toFixed(1)}px`;
      mark.style.height = `${(bottom - top).toFixed(1)}px`;
    },
  };
  marks.push(entry);
  return entry;
}

function place(onlyLive = false) {
  const host = frame();
  const art = artboard();
  if (!host || !art || !layer) return;
  const base = host.getBoundingClientRect();
  const area = art.getBoundingClientRect();
  for (const mark of marks) if (!onlyLive || mark.live) mark.place(base, area);
}

/** Las piezas con contenido propio (texto, imágenes, campos): una etiqueta no debe taparlas */
function contentBoxes(art: HTMLElement) {
  const boxes: { el: Element; box: DOMRect }[] = [];
  const walker = document.createTreeWalker(art, NodeFilter.SHOW_ELEMENT);
  for (let el = walker.nextNode() as Element | null; el; el = walker.nextNode() as Element | null) {
    if (el.closest('.lens-layer')) continue;
    const own = el.matches('img, svg, input, textarea, select, button') || [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim());
    if (!own) continue;
    const box = el.getBoundingClientRect();
    if (box.width && box.height) boxes.push({ el, box });
  }
  return boxes;
}

/**
 * Coloca cada etiqueta donde no pise a otra, ni tape contenido, ni se salga del artboard. Prueba, por
 * orden: encima de su caja (a la izquierda o al final), al lado, dentro (si la caja es grande) y
 * debajo. Si no cabe en ningún sitio, se esconde y queda solo la caja.
 */
const SPOTS = [[], ['is-end'], ['is-side'], ['is-in', 'is-end'], ['is-in'], ['is-flip'], ['is-flip', 'is-end']];
function declutter() {
  const artEl = artboard();
  const art = artEl?.getBoundingClientRect();
  if (!layer || !artEl || !art) return;
  const content = contentBoxes(artEl);
  const taken: DOMRect[] = [];
  const meets = (a: DOMRect, b: DOMRect, gap: number) =>
    a.left < b.right + gap && a.right > b.left - gap && a.top < b.bottom - 2 && a.bottom > b.top + 2;
  const bad = (box: DOMRect, el?: Element) =>
    box.top < art.top - 1 ||
    box.left < art.left - 1 ||
    box.right > art.right + 1 ||
    // La etiqueta de una pieza de una tarjeta apilada no puede caer encima de la tarjeta que la tapa
    (!!el && box.bottom > coveredFrom(el) + 1) ||
    taken.some((t) => meets(box, t, 4)) ||
    content.some(
      (c) =>
        c.el !== el &&
        !c.el.contains(el ?? null) &&
        // Sobre la propia imagen marcada sí puede ir su insignia
        !(el?.contains(c.el) && c.el.matches('img, svg')) &&
        meets(box, c.box, 0),
    );
  for (const mark of marks) {
    const tag = mark.node.querySelector<HTMLElement>('.lm-tag');
    if (!tag || mark.node.hidden) continue;
    mark.node.classList.remove('is-flip', 'is-in', 'is-end', 'is-side');
    tag.hidden = false;
    // La etiqueta de un bloque (Código) y la medida de una selección (Diseño) tienen su sitio fijo,
    // salvo que caiga encima de la tarjeta apilada que tapa su pieza: entonces se queda sin etiqueta
    if (mark.node.matches('.lm--block, .lm--sel')) {
      const box = tag.getBoundingClientRect();
      if (mark.el && box.bottom > coveredFrom(mark.el) + 1) tag.hidden = true;
      else taken.push(box);
      continue;
    }
    const roomy = mark.node.offsetHeight >= 72 && mark.node.offsetWidth >= tag.offsetWidth + 16;
    let placed = false;
    for (const spot of SPOTS) {
      if (spot.includes('is-in') && !roomy) continue;
      mark.node.classList.add(...spot);
      const box = tag.getBoundingClientRect();
      if (!bad(box, mark.el)) {
        taken.push(box);
        placed = true;
        break;
      }
      mark.node.classList.remove(...spot);
    }
    tag.hidden = !placed;
  }
}

/** Escalonado: 20 ms entre las marcas que están a la vista, como mucho 30 */
function stagger() {
  let i = 0;
  for (const mark of marks) {
    const box = mark.node.getBoundingClientRect();
    const inView = box.bottom > 0 && box.top < window.innerHeight;
    mark.node.style.setProperty('--i', String(inView ? Math.min(i++, 30) : 0));
  }
}

/* ---------- Diseño ---------- */

const shortFamily = (family: string) =>
  family
    .split(',')[0]
    .replace(/["']/g, '')
    .replace(/ Variable$/, '')
    .trim();

const typeOf = (el: Element) => {
  const cs = getComputedStyle(el);
  const size = parseFloat(cs.fontSize);
  const leading = parseFloat(cs.lineHeight) / size;
  return `${shortFamily(cs.fontFamily)} · ${fmt(size)}/${Number.isFinite(leading) ? fmt(leading, 2) : '—'} · ${cs.fontWeight}`;
};
const sizeOf = (el: Element) => {
  const box = el.getBoundingClientRect();
  return `${fmt(box.width)} × ${fmt(box.height)}`;
};

/** La columna de contenido: el primer .wrap del artboard sin su relleno lateral */
function column() {
  const art = artboard();
  const wrap = art?.querySelector<HTMLElement>('.wrap');
  if (!art || !wrap) return null;
  const a = art.getBoundingClientRect();
  const w = wrap.getBoundingClientRect();
  const cs = getComputedStyle(wrap);
  const left = w.left + parseFloat(cs.paddingLeft);
  const right = w.right - parseFloat(cs.paddingRight);
  return { art: a, left, right, margin: left - a.left, width: right - left };
}

function buildDesign() {
  const art = artboard();
  if (!art) return;
  const L = NOTES[lang()];

  // Guías de la columna y, arriba, las cotas de los márgenes y de la columna
  if (column()) {
    for (const side of ['left', 'right'] as const) {
      const guide = node('lm lm--guide');
      marks.push({
        node: guide,
        place: (base) => {
          const col = column();
          if (!col) return;
          guide.style.left = `${(col[side] - base.left).toFixed(1)}px`;
          guide.style.top = `${(col.art.top - base.top).toFixed(1)}px`;
          guide.style.height = `${col.art.height.toFixed(1)}px`;
        },
      });
    }
    const dims = node(
      'lm lm--dims',
      '<span class="kit-dim" data-axis="x"><b></b></span><span class="kit-dim" data-axis="x"><b></b></span><span class="kit-dim" data-axis="x"><b></b></span>',
    );
    const [m1, c, m2] = [...dims.children] as HTMLElement[];
    marks.push({
      node: dims,
      place: (base) => {
        const col = column();
        if (!col) return;
        dims.style.left = `${(col.art.left - base.left).toFixed(1)}px`;
        dims.style.top = `${(col.art.top - base.top + 8).toFixed(1)}px`;
        dims.style.width = `${col.art.width.toFixed(1)}px`;
        const rest = col.art.right - col.right;
        m1.style.width = `${col.margin.toFixed(1)}px`;
        c.style.width = `${col.width.toFixed(1)}px`;
        m2.style.width = `${rest.toFixed(1)}px`;
        m1.firstElementChild!.textContent = col.margin >= 44 ? fmt(col.margin) : '';
        c.firstElementChild!.textContent = `${L.column} ${fmt(col.width)}`;
        m2.firstElementChild!.textContent = rest >= 44 ? fmt(rest) : '';
      },
    });
  }

  // Selecciones: las piezas marcadas en el HTML y los títulos de sección
  const picked = new Set<Element>();
  art.querySelectorAll<HTMLElement>('[data-ds]').forEach((el) => {
    if (!visible(el, false)) return;
    picked.add(el);
    const value = el.hasAttribute('data-ds-type') ? typeOf(el) : sizeOf(el);
    const kind = el.hasAttribute('data-ds-type') ? 'lm--sel lm--type' : 'lm--sel';
    const mark = markOn(el, kind, `<b class="lm-name">${esc(el.dataset.ds ?? '')}</b><b class="lm-tag lm-size"></b>`);
    const size = mark.node.querySelector('.lm-size')!;
    size.textContent = value;
    const basePlace = mark.place;
    mark.place = (base, art) => {
      basePlace(base, art);
      size.textContent = el.hasAttribute('data-ds-type') ? typeOf(el) : sizeOf(el);
    };
  });
  art.querySelectorAll<HTMLElement>('h2').forEach((el) => {
    if (!visible(el) || picked.has(el) || el.closest('[data-ds]')) return;
    const mark = markOn(el, 'lm--sel lm--type', `<b class="lm-name">H2</b><b class="lm-tag lm-size"></b>`);
    mark.node.querySelector('.lm-size')!.textContent = typeOf(el);
  });

  buildHover(true);
}

function designBar() {
  const L = NOTES[lang()];
  const styles = getComputedStyle(root);
  const tokens = ['--sheet', '--paper', '--ink', '--muted'].map((name) => ({
    name: name.slice(2),
    value: styles.getPropertyValue(name).trim(),
  }));
  const families = new Set<string>();
  document.fonts.forEach((face) => {
    if (face.status === 'loaded') families.add(shortFamily(face.family));
  });
  const col = column();
  return [
    ...tokens.map((t) => `<li class="lb-chip"><i class="lb-sw" style="background:${t.value}"></i>${t.name} <b>${t.value}</b></li>`),
    '<li class="lb-sep"></li>',
    ...[...families].map((family) => `<li class="lb-chip">${esc(family)}</li>`),
    ...(col
      ? [
          '<li class="lb-sep"></li>',
          `<li class="lb-chip">${L.column} <b>${fmt(col.width)}</b> · ${L.margin} <b>${fmt(col.margin)}</b></li>`,
        ]
      : []),
  ].join('');
}

/* ---------- Código ---------- */

const tagHtml = (label: string) => {
  // "<section> Hero.astro" → la etiqueta y, más apagado, el componente
  const [tag, ...rest] = label.split(' ');
  return `${esc(tag)}${rest.length ? ` <i>${esc(rest.join(' '))}</i>` : ''}`;
};

function buildCode() {
  const art = artboard();
  if (!art) return;
  art.querySelectorAll<HTMLElement>('[data-cs]').forEach((el) => {
    if (!visible(el)) return;
    markOn(el, 'lm--block', `<b class="lm-tag lm-tag--code">${tagHtml(el.dataset.cs ?? '')}</b>`);
  });
  art.querySelectorAll<HTMLElement>('h1, h2, h3').forEach((el) => {
    if (!visible(el)) return;
    markOn(el, 'lm--node', `<b class="lm-tag lm-tag--node">&lt;${el.tagName.toLowerCase()}&gt;</b>`, 3);
  });
  buildHover(false);
}

function codeBar(i18n: Record<string, string>) {
  const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
  const bytes = (entry: PerformanceResourceTiming) => entry.transferSize || entry.encodedBodySize || 0;
  const inline = (selector: string) =>
    [...document.querySelectorAll(selector)].reduce((sum, el) => sum + (el.textContent?.length ?? 0), 0);
  const js =
    resources.filter((e) => /\.m?js(\?|$)/.test(e.name)).reduce((sum, e) => sum + bytes(e), 0) +
    inline('script:not([src]):not([type="application/ld+json"])');
  const css =
    resources.filter((e) => /\.css(\?|$)/.test(e.name)).reduce((sum, e) => sum + bytes(e), 0) + inline('style');
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined;
  const load = nav ? nav.loadEventEnd || nav.domContentLoadedEventEnd : 0;
  const nodes = document.getElementsByTagName('*').length;
  const rows = [
    [fmt(nodes), i18n.nodes],
    [`${fmt(js / 1024, 1)} KB`, i18n.js],
    [`${fmt(css / 1024, 1)} KB`, i18n.css],
    ...(load ? [[`${fmt(load / 1000, 2)} s`, i18n.load]] : []),
  ];
  // Las capas de la página: cada bloque con su componente; al pulsarlo, se va hasta él
  const blocks = [...document.querySelectorAll<HTMLElement>('[data-cs]')].filter((el) => visible(el));
  targets = blocks;
  return [
    ...rows.map(([value, label]) => `<li class="lb-chip"><b>${value}</b> ${label}</li>`),
    '<li class="lb-sep"></li>',
    ...blocks.map(
      (el, i) => `<li><button type="button" class="lb-chip lb-chip--btn" data-lens-goto="${i}">${esc((el.dataset.cs ?? '').replace(/^<[^>]+>\s+(?=\S)/, ''))}</button></li>`,
    ),
  ].join('');
}

/* ---------- Inspector: la pieza que hay bajo el puntero (Diseño y Código) ---------- */

function buildHover(withGuides: boolean) {
  const mark = node('lm lm--hover', '<i class="lm-box"></i><b class="lm-tag lm-tip"></b>');
  mark.hidden = true;
  const guides = withGuides ? ['x', 'x', 'y', 'y'].map((axis) => node(`lm lm--guide lm--guide-${axis} lm--guide-hover`)) : [];
  guides.forEach((guide) => (guide.hidden = true));
  hover = { node: mark, tag: mark.querySelector<HTMLElement>('.lm-tip')!, guides };
}

function hideHover() {
  if (!hover) return;
  hover.node.hidden = true;
  hover.guides.forEach((guide) => (guide.hidden = true));
}

const ownText = (el: Element) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent?.trim());

function inspect(target: Element | null) {
  const lens = currentLens();
  const host = frame();
  const art = artboard();
  if (!hover || !host || !art || !target || !art.contains(target) || target === art || target.closest('[inert]')) {
    hideHover();
    return;
  }
  const box = target.getBoundingClientRect();
  const a = art.getBoundingClientRect();
  // Los contenedores que ocupan casi toda la pantalla no se inspeccionan: taparían lo demás
  if (!box.width || !box.height || (box.height > window.innerHeight * 0.85 && box.width > a.width * 0.85)) {
    hideHover();
    return;
  }
  const base = host.getBoundingClientRect();
  const { node: mark, tag, guides } = hover;
  mark.hidden = false;
  mark.style.left = `${(box.left - base.left).toFixed(1)}px`;
  mark.style.top = `${(box.top - base.top).toFixed(1)}px`;
  mark.style.width = `${box.width.toFixed(1)}px`;
  mark.style.height = `${box.height.toFixed(1)}px`;

  if (lens === 'code') {
    const cls = [...target.classList].find((c) => !c.startsWith('astro-'));
    tag.innerHTML = `${esc(target.tagName.toLowerCase())}${cls ? `<i>.${esc(cls)}</i>` : ''} <u>${sizeOf(target)}</u>`;
  } else {
    tag.innerHTML = `${sizeOf(target)}${ownText(target) ? ` <i>${esc(typeOf(target))}</i>` : ''}`;
  }
  // La nota va debajo de la pieza; si no cabe en pantalla, encima. Y nunca se sale del artboard.
  const below = box.bottom + 8 + tag.offsetHeight < window.innerHeight - 52;
  mark.classList.toggle('is-above', !below);
  const overflow = box.left + tag.offsetWidth - (a.right - 4);
  tag.style.left = `${overflow > 0 ? -overflow : 0}px`;

  // Líneas de construcción: los cuatro bordes de la pieza, prolongados por el artboard
  if (guides.length) {
    const top = Math.max(a.top, 0) - base.top;
    const height = Math.min(a.bottom, window.innerHeight) - Math.max(a.top, 0);
    [box.top, box.bottom - 1].forEach((y, i) => {
      const g = guides[i];
      g.hidden = false;
      g.style.left = `${(a.left - base.left).toFixed(1)}px`;
      g.style.top = `${(y - base.top).toFixed(1)}px`;
      g.style.width = `${a.width.toFixed(1)}px`;
    });
    [box.left, box.right - 1].forEach((x, i) => {
      const g = guides[i + 2];
      g.hidden = false;
      g.style.left = `${(x - base.left).toFixed(1)}px`;
      g.style.top = `${top.toFixed(1)}px`;
      g.style.height = `${height.toFixed(1)}px`;
    });
  }
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
  return [top[0] * a + bottom[0] * (1 - a), top[1] * a + bottom[1] * (1 - a), top[2] * a + bottom[2] * (1 - a), 1];
};

function effectiveBackground(el: Element): Rgba | null {
  const layers: Rgba[] = [];
  for (let n: Element | null = el; n; n = n.parentElement) {
    const cs = getComputedStyle(n);
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

function runChecks(): Check[] {
  const L = NOTES[lang()];
  const checks: Check[] = [];
  // La web de ejemplo de "Cómo lo veo yo" es una ilustración inerte: no cuenta. Tampoco lo oculto con
  // [hidden]: la 404 lleva su titular en los dos idiomas y esconde el que no toca, y antes la lente
  // contaba los dos <h1> (lo encontraron los tests de Playwright el 23 nov)
  const real = (el: Element) => !el.closest('[inert], [hidden]');

  checks.push({ ok: !!root.getAttribute('lang'), group: 'structure', label: L.lang });
  checks.push({ ok: document.title.trim().length > 0, group: 'structure', label: L.title });
  const h1s = [...document.querySelectorAll('main h1')].filter(real);
  checks.push({ ok: h1s.length === 1, group: 'structure', label: L.h1, el: h1s[1] });
  let previous = 0;
  let ordered = true;
  let jump: Element | undefined;
  [...document.querySelectorAll('main h1, main h2, main h3, main h4')].filter(real).forEach((heading) => {
    const level = Number(heading.tagName[1]);
    if (previous && level > previous + 1) {
      ordered = false;
      jump ??= heading;
    }
    previous = level;
  });
  checks.push({ ok: ordered, group: 'structure', label: L.order, el: jump });

  document.querySelectorAll('main img').forEach((img) => {
    if (!real(img) || !visible(img)) return;
    const alt = img.getAttribute('alt');
    const host = img.closest('[data-qa-host]') ?? img.parentElement ?? undefined;
    checks.push({
      ok: alt !== null,
      group: 'alt',
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
    checks.push({ ok: !!name, group: 'name', label: name ? L.name : L.noName, el });
    const inlineLink = el.tagName === 'A' && getComputedStyle(el).display === 'inline';
    if (!inlineLink) {
      const box = el.getBoundingClientRect();
      const ok = box.width >= 24 && box.height >= 24;
      checks.push({
        ok,
        group: 'target',
        label: ok ? L.target : L.small,
        el,
        note: `${Math.round(box.width)}×${Math.round(box.height)}`,
        // La insignia, solo en botones y enlaces de tamaño de botón (no en una tarjeta entera)
        badge: box.height <= 96 && (el.matches('.btn, button') || !!el.closest('main')),
      });
    }
  });

  document.querySelectorAll('main input:not([type="hidden"]), main textarea, main select').forEach((field) => {
    // Un campo escondido (como la casilla trampa del formulario) no lo ve nadie: no necesita etiqueta
    if (!real(field)) return;
    const input = field as HTMLInputElement;
    const ok = (input.labels?.length ?? 0) > 0 || input.hasAttribute('aria-label') || input.hasAttribute('aria-labelledby');
    checks.push({
      ok,
      group: 'label',
      label: ok ? L.label : L.noLabel,
      el: field.closest('[data-qa-host]') ?? field.parentElement ?? undefined,
      badge: true,
    });
  });

  const decimal = lang() === 'es' ? ',' : '.';
  document
    .querySelectorAll<HTMLElement>('main h1, main h2, main h3, main p, main li, main label, main .btn, footer p, footer a')
    .forEach((el) => {
      if (!el.textContent?.trim() || !visible(el)) return;
      const cs = getComputedStyle(el);
      const fg = parseColor(cs.color);
      const bg = effectiveBackground(el);
      if (!fg || !bg || cs.mixBlendMode !== 'normal') return;
      const ratio = contrast(over(fg, bg), bg);
      const size = parseFloat(cs.fontSize);
      const large = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700);
      checks.push({
        ok: ratio >= (large ? 3 : 4.5),
        group: 'contrast',
        label: L.contrast,
        el,
        note: `${ratio.toFixed(1).replace('.', decimal)}:1`,
        badge: el.matches('h1, h2, h3'),
      });
    });

  return checks;
}

function buildQa(checks: Check[]) {
  const art = artboard();
  if (!art) return;
  const found = new Map<Element, { ok: boolean; notes: string[] }>();
  for (const check of checks) {
    if (!check.el || (!check.badge && check.ok) || !art.contains(check.el)) continue;
    const entry = found.get(check.el) ?? { ok: true, notes: [] };
    const note = check.note ? `${check.label} ${check.note}` : check.label;
    if (!check.ok && entry.ok) {
      entry.ok = false;
      entry.notes = [note];
    } else if (check.ok === entry.ok && !entry.notes.includes(note)) entry.notes.push(note);
    found.set(check.el, entry);
  }
  found.forEach((entry, el) => {
    const mark = markOn(
      el,
      'lm--qa',
      `<b class="lm-tag lm-badge">${esc(entry.notes.slice(0, 2).join(' · '))}<i class="lm-ico"></i></b>`,
      3,
    );
    mark.node.dataset.state = entry.ok ? 'ok' : 'fail';
  });
}

function qaBar(checks: Check[], i18n: Record<string, string>) {
  const L = NOTES[lang()];
  const passed = checks.filter((c) => c.ok).length;
  targets = [];
  const chips = GROUPS.map((group) => {
    const own = checks.filter((c) => c.group === group);
    if (!own.length) return '';
    const ok = own.filter((c) => c.ok).length;
    const failed = own.find((c) => !c.ok && c.el && frame()?.contains(c.el));
    const inner = `${L.groups[group]} <b>${ok}/${own.length}</b><i class="lm-ico"></i>`;
    const state = ok === own.length ? 'ok' : 'fail';
    if (failed?.el) {
      targets.push(failed.el);
      return `<li><button type="button" class="lb-chip lb-chip--btn" data-state="${state}" data-lens-goto="${targets.length - 1}">${inner}</button></li>`;
    }
    return `<li class="lb-chip" data-state="${state}">${inner}</li>`;
  });
  return [`<li class="lb-chip lb-score"><b>${passed}/${checks.length}</b> ${i18n.passed}</li>`, '<li class="lb-sep"></li>', ...chips].join('');
}

const signature = (checks: Check[]) => checks.map((c) => `${c.ok ? 1 : 0}${c.note ?? ''}`).join('|');

/**
 * Si al medir había colores a medio cambiar (una transición de color en curso), el contraste leído no
 * es el definitivo: cuando terminan se comprueba otra vez y, si el resultado cambia, se repinta.
 */
function settleQa(before: string) {
  const running = document
    .getAnimations()
    .filter((a) => a instanceof CSSTransition && /color/.test(a.transitionProperty) && a.playState === 'running');
  if (!running.length) return;
  Promise.allSettled(running.map((a) => a.finished)).then(() => {
    if (currentLens() === 'qa' && signature(runChecks()) !== before) render();
  });
}

/* ---------- Render ---------- */

function render(animate = false) {
  if (root.dataset.lens && !isLens(root.dataset.lens)) delete root.dataset.lens;
  syncButtons();
  const lens = currentLens();
  const motion = animate && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  resetLayer(lens, motion);
  const panel = document.querySelector<HTMLElement>('[data-lens-panel]');
  if (!lens || !panel) return;
  const i18n = JSON.parse(panel.dataset.i18n ?? '{}') as Record<string, string>;
  const title = panel.querySelector('[data-lens-title]');
  const stats = panel.querySelector('[data-lens-stats]');
  if (title) title.textContent = i18n[lens];
  if (lens === 'design') {
    buildDesign();
    if (stats) stats.innerHTML = designBar();
  } else if (lens === 'code') {
    buildCode();
    if (stats) stats.innerHTML = codeBar(i18n);
  } else {
    const checks = runChecks();
    buildQa(checks);
    if (stats) stats.innerHTML = qaBar(checks, i18n);
    settleQa(signature(checks));
  }
  if (stats) stats.scrollLeft = 0;
  place();
  declutter();
  if (motion) stagger();
}

/** Vuelve a medir sin repetir la animación (cambios de tamaño, fuentes, imágenes que llegan) */
function refresh() {
  if (!currentLens()) return;
  if (!layer?.isConnected) {
    render();
    return;
  }
  place();
  declutter();
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
  if (target?.closest('[data-lens-clear]')) {
    setLens(null);
    return;
  }
  // Un bloque de la barra de estado: se va hasta él y se resalta un momento
  const goto = target?.closest<HTMLElement>('[data-lens-goto]');
  const el = goto ? targets[Number(goto.dataset.lensGoto)] : null;
  if (el) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: el.matches('[data-cs]') ? 'start' : 'center' });
    hot(el, true);
    window.setTimeout(() => hot(el, false), 1600);
  }
});

function hot(el: Element | null, on: boolean) {
  for (const mark of marks) if (mark.el === el) mark.node.classList.toggle('is-hot', on);
}
for (const [type, on] of [
  ['pointerover', true],
  ['pointerout', false],
  ['focusin', true],
  ['focusout', false],
] as const) {
  document.addEventListener(type, (event) => {
    const chip = (event.target as Element | null)?.closest?.<HTMLElement>('[data-lens-goto]');
    if (chip) hot(targets[Number(chip.dataset.lensGoto)], on);
  });
}

document.addEventListener('keydown', (event) => {
  if (event.metaKey || event.ctrlKey || event.altKey) return;
  const el = event.target as HTMLElement | null;
  if (el?.closest?.('input, textarea, select, [contenteditable="true"]')) return;
  if (root.classList.contains('canvas-open')) return;
  // Escape sigue valiendo siempre; las teclas 1, 2 y 3 solo con los atajos encendidos (WCAG 2.1.4)
  if (event.key === 'Escape' && currentLens()) setLens(null);
  if (!shortcutsOn()) return;
  const index = ['1', '2', '3'].indexOf(event.key);
  if (index >= 0) setLens(LENSES[index] === currentLens() ? null : LENSES[index]);
});

// Inspector con ratón
let pointerTarget: Element | null = null;
let pointerFrame = 0;
document.addEventListener(
  'pointermove',
  (event) => {
    if (!hover || event.pointerType !== 'mouse') return;
    pointerTarget = event.target instanceof Element ? event.target : null;
    if (pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => {
      pointerFrame = 0;
      inspect(pointerTarget);
    });
  },
  { passive: true },
);
document.addEventListener('pointerleave', hideHover);

let scrollFrame = 0;
let tidyTimer = 0;
window.addEventListener(
  'scroll',
  () => {
    if (!layer) return;
    // Al parar, las etiquetas se vuelven a colocar: en las tarjetas apiladas del inicio (y en las
    // piezas fijas) lo que tapa a cada pieza cambia al bajar
    window.clearTimeout(tidyTimer);
    tidyTimer = window.setTimeout(() => layer && declutter(), 140);
    if (scrollFrame) return;
    scrollFrame = requestAnimationFrame(() => {
      scrollFrame = 0;
      hideHover();
      place(true);
    });
  },
  { passive: true },
);

let resizeTimer = 0;
const onResize = () => {
  window.clearTimeout(resizeTimer);
  resizeTimer = window.setTimeout(refresh, 160);
};
new ResizeObserver(onResize).observe(document.documentElement);
window.addEventListener('resize', onResize, { passive: true });
document.fonts?.ready.then(refresh);
// El titular se entinta al cargar (se mueve unos píxeles): se vuelve a medir cuando ha terminado
document.addEventListener('astro:page-load', () => {
  render(true);
  for (const delay of [700, 1600, 3200]) window.setTimeout(refresh, delay);
});
