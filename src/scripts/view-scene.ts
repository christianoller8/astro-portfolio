// "Cómo lo veo yo" (ViewScene.astro): marca la fase según el texto que está en el centro de la
// pantalla y rellena, a partir del DOM de la web de ejemplo, lo que cada mirada pinta encima:
// el boceto, las selecciones con su medida, las etiquetas, el árbol y las comprobaciones.
import { sketchElements } from './sketch';

/** Ancho al que está "diseñada" la web de ejemplo: las medidas se dan a ese tamaño */
const DESIGN_WIDTH = 1280;

type Texts = Record<'contrast' | 'target' | 'alt' | 'headings' | 'links' | 'yes' | 'no', string>;

const luminance = (rgb: number[]) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const parse = (color: string) => (color.match(/[\d.]+/g) ?? []).slice(0, 3).map(Number);
const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(parse(a)), luminance(parse(b))].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

function initViewScene() {
  const section = document.querySelector<HTMLElement>('[data-view-scene]');
  const frame = section?.querySelector<HTMLElement>('[data-view-frame]');
  const demo = section?.querySelector<HTMLElement>('[data-view-demo]');
  const overlay = section?.querySelector<HTMLElement>('[data-view-overlay]');
  if (!section || !frame || !demo || !overlay) return;

  const controller = new AbortController();
  const { signal } = controller;
  const texts = JSON.parse(section.dataset.i18n ?? '{}') as Texts;
  const steps = [...section.querySelectorAll<HTMLElement>('[data-view-step]')];
  let sketch: SVGSVGElement | null = null;

  // --- Fase: el último texto cuyo comienzo ya ha pasado la línea de lectura ---
  // En escritorio la línea está algo por debajo del centro; en móvil y tablet, donde el escenario
  // queda fijo arriba, a media altura de lo que queda libre bajo él.
  const stage = section.querySelector<HTMLElement>('.vs-stage');
  const wide = window.matchMedia('(min-width: 1024px)');
  const setPhase = () => {
    const under = wide.matches || !stage ? 0 : stage.getBoundingClientRect().bottom;
    const line = wide.matches ? window.innerHeight * 0.62 : under + (window.innerHeight - under) * 0.5;
    let best = 0;
    steps.forEach((step, i) => {
      if (step.getBoundingClientRect().top <= line) best = i;
    });
    if (section.dataset.phase !== String(best)) section.dataset.phase = String(best);
    steps.forEach((step, i) => step.toggleAttribute('data-active', i === best));
  };

  // --- Lo que se pinta encima, medido en la web de ejemplo ---
  const build = () => {
    const base = frame.getBoundingClientRect();
    if (!base.width) return;
    const scale = DESIGN_WIDTH / base.width;
    const place = (el: Element, mark: HTMLElement, pad = 0) => {
      const box = el.getBoundingClientRect();
      mark.style.left = `${box.left - base.left - pad}px`;
      mark.style.top = `${box.top - base.top - pad}px`;
      mark.style.width = `${box.width + pad * 2}px`;
      mark.style.height = `${box.height + pad * 2}px`;
    };
    const mark = (kind: string, label = '') => {
      const el = document.createElement('span');
      el.className = `vs-mark vs-mark--${kind}`;
      // <code>: son medidas y etiquetas, no texto
      if (label) el.innerHTML = `<code>${label}</code>`;
      overlay.append(el);
      return el;
    };
    overlay.replaceChildren();

    // 1 · Boceto de cada pieza y dos selecciones con su medida real (a 1280 px)
    sketch?.remove();
    sketch = sketchElements(demo, 31);
    frame.append(sketch);
    const cta = demo.querySelector<HTMLElement>('[data-view-cta]');
    const art = demo.querySelector<HTMLElement>('[data-view-art]');
    for (const el of [cta, art]) {
      if (!el) continue;
      const box = el.getBoundingClientRect();
      place(el, mark('sel', `${Math.round(box.width * scale)} × ${Math.round(box.height * scale)}`));
    }

    // 2 · La etiqueta real de cada bloque marcado, y el árbol de la página
    [...demo.querySelectorAll<HTMLElement>('[data-tag]')].forEach((el, i) => {
      const tag = mark('tag', `&lt;${el.tagName.toLowerCase()}&gt;`);
      tag.style.setProperty('--i', String(i));
      if (el.dataset.tag === 'in') tag.dataset.in = '';
      place(el, tag);
    });
    const trees = [...section.querySelectorAll<HTMLElement>('[data-view-tree]')];
    if (trees.length) {
      const lines: string[] = [];
      const walk = (el: Element, depth: number) => {
        // Hermanos iguales seguidos se agrupan: "<a> × 3"
        const groups: { tag: string; nodes: Element[] }[] = [];
        for (const child of el.children) {
          const tag = child.tagName.toLowerCase();
          const last = groups[groups.length - 1];
          const same = last && last.tag === tag && last.nodes[0].children.length === child.children.length;
          if (same && (!child.children.length || tag === 'article')) last.nodes.push(child);
          else groups.push({ tag, nodes: [child] });
        }
        for (const group of groups) {
          const node = group.nodes[0];
          const count = group.nodes.length > 1 ? ` × ${group.nodes.length}` : '';
          lines.push(`${'  '.repeat(depth)}<${group.tag}>${count}`);
          if (depth < 3 && group.nodes.length === 1 && group.tag !== 'svg') walk(node, depth + 1);
        }
      };
      walk(demo, 0);
      for (const tree of trees) tree.textContent = lines.slice(0, 18).join('\n');
    }

    // 3 · Comprobaciones, calculadas ahora
    const checks: { label: string; value: string; ok: boolean; on?: Element | null }[] = [];
    if (cta) {
      const style = getComputedStyle(cta);
      const ratio = contrast(style.color, style.backgroundColor);
      checks.push({ label: texts.contrast, value: `${ratio.toFixed(1).replace('.', ',')}:1`, ok: ratio >= 4.5, on: cta });
      const box = cta.getBoundingClientRect();
      const w = Math.round(box.width * scale), h = Math.round(box.height * scale);
      checks.push({ label: texts.target, value: `${w} × ${h} px`, ok: w >= 44 && h >= 44 });
    }
    const picture = demo.querySelector('[role="img"]');
    const alt = picture?.getAttribute('aria-label')?.trim() ?? '';
    checks.push({ label: texts.alt, value: alt ? texts.yes : texts.no, ok: !!alt, on: art });
    const levels = [...demo.querySelectorAll('h1, h2, h3')].map((h) => +h.tagName[1]);
    const ordered = levels[0] === 1 && levels.every((level, i) => i === 0 || level - levels[i - 1] <= 1);
    checks.push({ label: texts.headings, value: `h${[...new Set(levels)].join(' › h')}`, ok: ordered, on: demo.querySelector('h1') });
    const links = [...demo.querySelectorAll('a')];
    const named = links.filter((a) => a.textContent?.trim()).length;
    checks.push({ label: texts.links, value: `${named} / ${links.length}`, ok: named === links.length });

    for (const list of section.querySelectorAll<HTMLElement>('[data-view-checks]')) {
      list.replaceChildren(
        ...checks.map((check) => {
          const li = document.createElement('li');
          const value = document.createElement('samp');
          value.className = 'kit-badge';
          value.dataset.state = check.ok ? 'ok' : 'fail';
          value.textContent = check.value;
          li.append(check.label, value);
          return li;
        }),
      );
    }
    checks.filter((check) => check.ok && check.on).forEach((check, i) => {
      const ok = mark('ok');
      ok.style.setProperty('--i', String(i));
      place(check.on!, ok);
    });
  };

  let frameId = 0;
  const onScroll = () => {
    if (frameId) return;
    frameId = requestAnimationFrame(() => {
      frameId = 0;
      setPhase();
    });
  };
  let timer = 0;
  const rebuild = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      build();
      setPhase();
    }, 150);
  };

  window.addEventListener('scroll', onScroll, { passive: true, signal });
  window.addEventListener('resize', rebuild, { signal });
  document.addEventListener('astro:before-swap', () => controller.abort(), { once: true });

  build();
  setPhase();
  // Con las fuentes cargadas cambian los anchos: se vuelve a medir
  document.fonts?.ready.then(() => !signal.aborted && build());
}

document.addEventListener('astro:page-load', initViewScene);
