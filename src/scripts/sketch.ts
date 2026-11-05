// Trazos "a lápiz" generados a partir de cajas reales del DOM (intro y escena del boceto).

export type Rng = () => number;

/** Generador pseudoaleatorio con semilla: el mismo boceto en cada visita. */
export function rng(seed: number): Rng {
  let s = seed | 0;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const jitter = (r: Rng, amount: number) => (r() - 0.5) * 2 * amount;
const n = (v: number) => Math.round(v * 10) / 10;

/** Línea ligeramente curva, como un trazo hecho a pulso. */
export function line(x1: number, y1: number, x2: number, y2: number, r: Rng, wobble = 1.4): string {
  const mx = (x1 + x2) / 2 + jitter(r, wobble * 1.6);
  const my = (y1 + y2) / 2 + jitter(r, wobble * 1.6);
  return `M${n(x1 + jitter(r, wobble))} ${n(y1 + jitter(r, wobble))}Q${n(mx)} ${n(my)} ${n(
    x2 + jitter(r, wobble),
  )} ${n(y2 + jitter(r, wobble))}`;
}

/** Rectángulo de cuatro trazos que se pasan un poco en las esquinas. */
export function rect(x: number, y: number, w: number, h: number, r: Rng): string[] {
  const over = Math.min(7, Math.max(2, Math.min(w, h) * 0.06));
  return [
    line(x - over * r(), y, x + w + over * r(), y, r),
    line(x + w, y - over * r(), x + w, y + h + over * r(), r),
    line(x + w + over * r(), y + h, x - over * r(), y + h, r),
    line(x, y + h + over * r(), x, y - over * r(), r),
  ];
}

/** Líneas onduladas que hacen de texto en un boceto. */
export function scribble(
  x: number,
  y: number,
  w: number,
  h: number,
  r: Rng,
  lineHeight: number,
): string[] {
  const rows = Math.max(1, Math.round(h / lineHeight));
  const paths: string[] = [];
  for (let i = 0; i < rows; i++) {
    const cy = y + lineHeight * (i + 0.5);
    const end = x + w * (i === rows - 1 && rows > 1 ? 0.45 + r() * 0.35 : 0.82 + r() * 0.18);
    const amp = Math.min(lineHeight * 0.16, 5);
    const step = Math.max(18, lineHeight * 0.9);
    let d = `M${n(x)} ${n(cy)}`;
    let up = true;
    for (let px = x + step; px < end; px += step) {
      d += `Q${n(px - step / 2)} ${n(cy + (up ? -amp : amp) + jitter(r, amp * 0.4))} ${n(Math.min(px, end))} ${n(cy)}`;
      up = !up;
    }
    paths.push(d);
  }
  return paths;
}

/** Aspa dentro de una caja: el hueco de una imagen en un wireframe. */
export function cross(x: number, y: number, w: number, h: number, r: Rng): string[] {
  return [line(x, y, x + w, y + h, r, 2), line(x + w, y, x, y + h, r, 2)];
}

/**
 * Dibuja el boceto de todos los [data-sketch] de `stage` en un <svg> superpuesto.
 * Cada trazo lleva --k (0–1) para escalonar su aparición desde CSS.
 */
export function sketchElements(stage: HTMLElement, seed = 7): SVGSVGElement {
  const r = rng(seed);
  const box = stage.getBoundingClientRect();
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'sketch-layer');
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('viewBox', `0 0 ${n(box.width)} ${n(box.height)}`);
  svg.setAttribute('width', String(n(box.width)));
  svg.setAttribute('height', String(n(box.height)));

  const items = [...stage.querySelectorAll<HTMLElement>('[data-sketch]')];
  const all: string[][] = items.map((el) => {
    const b = el.getBoundingClientRect();
    const x = b.left - box.left;
    const y = b.top - box.top;
    const kind = el.dataset.sketch;
    if (kind === 'text') {
      // Una línea de boceto por cada línea real del texto, con su ancho real
      const range = document.createRange();
      range.selectNodeContents(el);
      const lines = [...range.getClientRects()].filter((line) => line.width > 4);
      if (lines.length) {
        const merged: DOMRect[] = [];
        for (const line of lines) {
          const last = merged[merged.length - 1];
          if (last && Math.abs(last.top - line.top) < line.height / 2) {
            const left = Math.min(last.left, line.left);
            merged[merged.length - 1] = new DOMRect(
              left,
              last.top,
              Math.max(last.right, line.right) - left,
              last.height,
            );
          } else merged.push(line);
        }
        return merged.flatMap((line) => {
          const lx = line.left - box.left;
          const ly = line.top - box.top;
          // Los titulares grandes se bocetan como una caja; el texto normal, como una línea ondulada
          return line.height > 40
            ? rect(lx, ly + line.height * 0.2, line.width, line.height * 0.62, r)
            : scribble(lx, ly, line.width, line.height, r, line.height);
        });
      }
      const lh = parseFloat(getComputedStyle(el).lineHeight) || b.height;
      return scribble(x, y, b.width, b.height, r, Math.min(lh, b.height));
    }
    if (kind === 'image')
      return [...rect(x, y, b.width, b.height, r), ...cross(x, y, b.width, b.height, r)];
    return rect(x, y, b.width, b.height, r);
  });

  const total = all.reduce((sum, paths) => sum + paths.length, 0) || 1;
  let i = 0;
  for (const paths of all) {
    for (const d of paths) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d);
      path.setAttribute('pathLength', '1');
      path.style.setProperty('--k', (i / total).toFixed(3));
      svg.appendChild(path);
      i++;
    }
  }

  // Notas a mano: a la derecha de la pieza si caben, si no encima
  const noted = items.filter((el) => el.dataset.sketchNote);
  noted.forEach((el, index) => {
    const b = el.getBoundingClientRect();
    const x = b.left - box.left;
    const y = b.top - box.top;
    const label = el.dataset.sketchNote ?? '';
    const estimate = label.length * 8 + 24;
    const right = x + b.width + 12;
    const fits = right + estimate < box.width;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.textContent = fits ? `← ${label}` : `↓ ${label}`;
    text.setAttribute('x', String(n(fits ? right : Math.max(0, x))));
    text.setAttribute(
      'y',
      String(n(fits ? y + Math.min(b.height / 2, 16) + 5 : Math.max(14, y - 10))),
    );
    text.style.setProperty('--k', (noted.length > 1 ? index / (noted.length - 1) : 0).toFixed(3));
    svg.appendChild(text);
  });

  return svg;
}
