// Saca las piezas del personaje de la lámina (docs/imgs/emoji-piezas.jpg): detecta cada dibujo,
// quita el fondo blanco y los rótulos, y guarda un PNG transparente por pieza.
// Uso (desde una carpeta con jimp): node piezas.cjs <lamina.jpg> <carpeta-salida> [previa.jpg]
const Jimp = require('jimp');
const fs = require('node:fs');
const [src, outDir, prev] = process.argv.slice(2);

// Dónde cae cada pieza en la lámina (centro aproximado, en fracción del ancho y del alto)
const NAMES = {
  head: [0.19, 0.17], 'head-effort': [0.435, 0.17], 'upper-arm': [0.66, 0.155], forearm: [0.75, 0.305],
  torso: [0.17, 0.48], 'hand-open': [0.85, 0.425], 'hand-fist': [0.85, 0.605], hip: [0.18, 0.78],
  thigh: [0.42, 0.75], shin: [0.6, 0.715], shoe: [0.835, 0.87],
};

(async () => {
  const img = await Jimp.read(src);
  const W = img.bitmap.width, H = img.bitmap.height, d = img.bitmap.data;
  const lum = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) lum[i] = Math.round(0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]);

  // Fondo: el blanco conectado con el borde de la lámina (el blanco de la piel y de la suela queda dentro)
  const BG = 232;
  const bg = new Uint8Array(W * H), stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) {
    const p = stack.pop();
    if (bg[p] || lum[p] < BG) continue;
    bg[p] = 1;
    const x = p % W, y = (p - x) / W;
    if (x > 0) stack.push(p - 1); if (x < W - 1) stack.push(p + 1);
    if (y > 0) stack.push(p - W); if (y < H - 1) stack.push(p + W);
  }

  // Componentes de "no fondo": las piezas son las grandes; las letras, las pequeñas
  const label = new Int32Array(W * H), comps = [];
  for (let i = 0; i < W * H; i++) {
    if (bg[i] || label[i]) continue;
    const id = comps.length + 1; let area = 0, x0 = W, y0 = H, x1 = 0, y1 = 0; const st = [i]; label[i] = id;
    while (st.length) {
      const p = st.pop(); area++;
      const x = p % W, y = (p - x) / W;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue;
        const q = yy * W + xx; if (!bg[q] && !label[q]) { label[q] = id; st.push(q); }
      }
    }
    comps.push({ id, area, x0, y0, x1, y1 });
  }
  const parts = comps.filter((c) => c.area > 9000);
  console.log('componentes', comps.length, '· piezas', parts.length);

  const result = {};
  for (const [name, [fx, fy]] of Object.entries(NAMES)) {
    const cx = fx * W, cy = fy * H;
    const c = parts.find((p) => cx >= p.x0 && cx <= p.x1 && cy >= p.y0 && cy <= p.y1);
    if (!c) { console.log('NO ENCONTRADA', name); continue; }
    const pad = 3, bx = Math.max(0, c.x0 - pad), by = Math.max(0, c.y0 - pad), bw = Math.min(W, c.x1 + pad + 1) - bx, bh = Math.min(H, c.y1 + pad + 1) - by;
    const out = new Jimp(bw, bh, 0x00000000), o = out.bitmap.data;
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      const p = (by + y) * W + bx + x, q = (y * bw + x) * 4;
      if (label[p] !== c.id) continue;
      // ¿Está en el borde? (algún vecino a 2 px es fondo)
      let edge = false;
      for (let dy = -2; dy <= 2 && !edge; dy++) for (let dx = -2; dx <= 2; dx++) {
        const xx = bx + x + dx, yy = by + y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H || bg[yy * W + xx]) { edge = true; break; }
      }
      if (edge && lum[p] > 40) {
        // Píxel de borde: es línea negra mezclada con el blanco del fondo → negro con transparencia
        const a = Math.max(0, Math.min(1, (BG - lum[p]) / (BG - 40)));
        o[q] = o[q + 1] = o[q + 2] = 22; o[q + 3] = Math.round(a * 255);
      } else {
        o[q] = d[p * 4]; o[q + 1] = d[p * 4 + 1]; o[q + 2] = d[p * 4 + 2]; o[q + 3] = 255;
      }
    }
    await out.writeAsync(`${outDir}/${name}.png`);
    result[name] = { w: bw, h: bh, x: bx, y: by };
    console.log(name.padEnd(12), `${bw} × ${bh}`, 'en', bx, by);
  }
  fs.writeFileSync(`${outDir}/piezas.json`, JSON.stringify(result, null, 1));

  if (prev) {
    // Vista previa sobre gris medio, para ver los bordes y el blanco de la piel
    const sheet = new Jimp(W, H, 0x8a8a8aff);
    for (const [name, r] of Object.entries(result)) sheet.composite(await Jimp.read(`${outDir}/${name}.png`), r.x, r.y);
    await sheet.resize(1400, Jimp.AUTO).quality(88).writeAsync(prev);
  }
})();
