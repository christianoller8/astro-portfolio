// Vectoriza la caricatura (JPEG) en tres capas: silueta de papel, tono gris de la barba y tinta.
// La tinta se separa por piezas conectadas (pelo y contorno, cejas, ojos, nariz, boca…) para que la
// intro pueda trazar y rellenar cada una.
// Uso: node vectorize.cjs <cabeza.jpg> <salida.json> [escala]
const Jimp = require('jimp');
const { Potrace } = require('potrace');
const fs = require('node:fs');

const [src, out, scaleArg = '2', tolArg = '0.5', turdArg = '6', decArg = '1'] = process.argv.slice(2);
const SCALE = +scaleArg;
const TOL = +tolArg; // tolerancia de las curvas: más alta, menos puntos
const TURD = +turdArg; // motas más pequeñas que esto se descartan
const DEC = 10 ** +decArg; // decimales de las coordenadas

// --- utilidades de máscaras (Uint8Array de 0/1) ---
function morph(mask, W, H, r, dilate) {
  // Filtro separable de máximo (dilatar) o mínimo (erosionar) con ventana cuadrada de radio r
  const pass = (srcArr, horizontal) => {
    const dst = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let v = dilate ? 0 : 1;
      for (let k = -r; k <= r; k++) {
        const xx = horizontal ? x + k : x, yy = horizontal ? y : y + k;
        const s = xx < 0 || yy < 0 || xx >= W || yy >= H ? 0 : srcArr[yy * W + xx];
        if (dilate ? s : !s) { v = dilate ? 1 : 0; break; }
      }
      dst[y * W + x] = v;
    }
    return dst;
  };
  return pass(pass(mask, true), false);
}
const dilate = (m, W, H, r) => morph(m, W, H, r, true);
const erode = (m, W, H, r) => morph(m, W, H, r, false);

function components(mask, W, H, minArea) {
  const label = new Int32Array(W * H);
  const list = [];
  const stack = [];
  for (let i = 0; i < W * H; i++) {
    if (!mask[i] || label[i]) continue;
    const id = list.length + 1;
    let area = 0, x0 = W, y0 = H, x1 = 0, y1 = 0, sx = 0, sy = 0;
    const px = [];
    stack.push(i); label[i] = id;
    while (stack.length) {
      const p = stack.pop(); px.push(p);
      const x = p % W, y = (p - x) / W;
      area++; sx += x; sy += y;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        const q = yy * W + xx;
        if (mask[q] && !label[q]) { label[q] = id; stack.push(q); }
      }
    }
    list.push({ area, bbox: [x0, y0, x1, y1], cx: sx / area, cy: sy / area, px });
  }
  return list.filter((c) => c.area >= minArea);
}

function trace(pixels, W, H, params) {
  // Dibuja la pieza en negro sobre blanco y la pasa por potrace
  return new Promise((resolve, reject) => {
    const image = new Jimp(W, H, 0xffffffff);
    const data = image.bitmap.data;
    for (const p of pixels) { const o = p * 4; data[o] = data[o + 1] = data[o + 2] = 0; }
    const tracer = new Potrace({ turdSize: TURD * SCALE * SCALE, optTolerance: TOL, alphaMax: 1.1, threshold: 128, ...params });
    tracer.loadImage(image, (err) => {
      if (err) return reject(err);
      const tag = tracer.getPathTag();
      const d = (tag.match(/ d="([^"]+)"/) || [, ''])[1];
      resolve(d);
    });
  });
}
const maskPixels = (mask) => { const px = []; for (let i = 0; i < mask.length; i++) if (mask[i]) px.push(i); return px; };
// Coordenadas de vuelta al tamaño original y con un decimal
const tidy = (d) => d.replace(/-?\d+\.?\d*/g, (n) => String(Math.round((+n / SCALE) * DEC) / DEC)).replace(/\s+/g, ' ').trim();

(async () => {
  const img = await Jimp.read(src);
  const W0 = img.bitmap.width, H0 = img.bitmap.height;
  img.resize(W0 * SCALE, H0 * SCALE, Jimp.RESIZE_BICUBIC);
  const W = img.bitmap.width, H = img.bitmap.height, data = img.bitmap.data;
  const lum = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) lum[i] = Math.round(0.299 * data[i * 4] + 0.587 * data[i * 4 + 1] + 0.114 * data[i * 4 + 2]);

  const ink = new Uint8Array(W * H), nonWhite = new Uint8Array(W * H), greyCand = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) {
    ink[i] = lum[i] < 105 ? 1 : 0;
    nonWhite[i] = lum[i] < 225 ? 1 : 0;
    greyCand[i] = lum[i] >= 105 && lum[i] < 225 ? 1 : 0;
  }

  // Gris: se abre para quitar los halos del antialiasing, se cierra para tapar el granulado
  // y se dilata un poco para que quede metido bajo la línea de tinta
  const r = 3 * SCALE;
  let grey = dilate(erode(greyCand, W, H, r), W, H, r);
  grey = erode(dilate(grey, W, H, r), W, H, r);
  grey = dilate(grey, W, H, 2 * SCALE);
  const greyParts = components(grey, W, H, 400 * SCALE * SCALE);

  // Silueta: se inunda el fondo desde los bordes, con las líneas engordadas para cerrar huecos
  const R = 5 * SCALE;
  const barrier = dilate(nonWhite, W, H, R);
  const outside = new Uint8Array(W * H);
  const stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const p = stack.pop();
    if (outside[p] || barrier[p]) continue;
    outside[p] = 1;
    const x = p % W, y = (p - x) / W;
    if (x > 0) stack.push(p - 1); if (x < W - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - W); if (y < H - 1) stack.push(p + W);
  }
  let sil = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) sil[i] = outside[i] ? 0 : 1;
  // Halo: la silueta, un poco más grande que el dibujo. Es el borde claro del modo oscuro (tipo pegatina)
  const halo = dilate(sil, W, H, Math.max(1, Math.round((7 * W0) / 900)) * SCALE);
  sil = erode(sil, W, H, R + 4 * SCALE); // vuelve a su sitio y queda por dentro del contorno

  const inkParts = components(ink, W, H, 80 * SCALE * SCALE).sort((a, b) => b.area - a.area);

  const result = { width: W0, height: H0, halo: [], paper: [], grey: [], ink: [] };
  result.halo.push({ d: tidy(await trace(maskPixels(halo), W, H, { turdSize: 400 * SCALE * SCALE, optTolerance: Math.max(2, TOL * 2), alphaMax: 1.3 })) });
  result.paper.push({ d: tidy(await trace(maskPixels(sil), W, H, { turdSize: 400 * SCALE * SCALE, optTolerance: Math.max(1.5, TOL * 2) })) });
  for (const c of greyParts) result.grey.push({ d: tidy(await trace(c.px, W, H, { turdSize: 60 * SCALE * SCALE, optTolerance: Math.max(1.2, TOL * 1.5) })), area: Math.round(c.area / SCALE / SCALE), c: [Math.round(c.cx / SCALE), Math.round(c.cy / SCALE)] });
  for (const c of inkParts) result.ink.push({ d: tidy(await trace(c.px, W, H, {})), area: Math.round(c.area / SCALE / SCALE), c: [Math.round(c.cx / SCALE), Math.round(c.cy / SCALE)], bbox: c.bbox.map((v) => Math.round(v / SCALE)) });
  fs.writeFileSync(out, JSON.stringify(result));
  const bytes = (arr) => arr.reduce((s, p) => s + p.d.length, 0);
  console.log(`papel ${result.paper.length} (${bytes(result.paper)} B) · gris ${result.grey.length} (${bytes(result.grey)} B) · tinta ${result.ink.length} (${bytes(result.ink)} B)`);
  for (const [i, p] of result.ink.entries()) console.log('tinta', i, 'área', p.area, 'centro', p.c.join(','), 'bbox', p.bbox.join(','), p.d.length + ' B');
  for (const [i, p] of result.grey.entries()) console.log('gris', i, 'área', p.area, 'centro', p.c.join(','), p.d.length + ' B');
})();
