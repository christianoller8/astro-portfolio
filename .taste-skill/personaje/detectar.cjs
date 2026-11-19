// Lista los dibujos de una lámina (componentes grandes de "no fondo") con su caja, y guarda una
// vista con cada caja numerada, para poder nombrarlos.
// Uso: node detectar.cjs <lamina.jpg> <vista.jpg> [área mínima]
const Jimp = require('jimp');
const [src, out, minArea = '2500'] = process.argv.slice(2);
(async () => {
  const img = await Jimp.read(src);
  const W = img.bitmap.width, H = img.bitmap.height, d = img.bitmap.data;
  const lum = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) lum[i] = Math.round(0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]);
  const BG = 232, bg = new Uint8Array(W * H), stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) { const p = stack.pop(); if (bg[p] || lum[p] < BG) continue; bg[p] = 1; const x = p % W, y = (p - x) / W; if (x > 0) stack.push(p - 1); if (x < W - 1) stack.push(p + 1); if (y > 0) stack.push(p - W); if (y < H - 1) stack.push(p + W); }
  const label = new Int32Array(W * H), comps = [];
  for (let i = 0; i < W * H; i++) {
    if (bg[i] || label[i]) continue;
    const id = comps.length + 1; let area = 0, x0 = W, y0 = H, x1 = 0, y1 = 0; const st = [i]; label[i] = id;
    while (st.length) { const p = st.pop(); area++; const x = p % W, y = (p - x) / W; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; const q = yy * W + xx; if (!bg[q] && !label[q]) { label[q] = id; st.push(q); } } }
    comps.push({ id, area, x0, y0, x1, y1 });
  }
  const big = comps.filter((c) => c.area >= +minArea).sort((a, b) => a.y0 - b.y0 || a.x0 - b.x0);
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
  big.forEach((c, k) => {
    console.log(String(k).padStart(2), 'id', String(c.id).padStart(4), 'área', String(c.area).padStart(6), 'caja', c.x0, c.y0, c.x1, c.y1, `(${c.x1 - c.x0 + 1} × ${c.y1 - c.y0 + 1})`);
    for (let x = c.x0; x <= c.x1; x++) for (const y of [c.y0, c.y1]) { const i = (y * W + x) * 4; d[i] = 255; d[i + 1] = 0; d[i + 2] = 0; }
    for (let y = c.y0; y <= c.y1; y++) for (const x of [c.x0, c.x1]) { const i = (y * W + x) * 4; d[i] = 255; d[i + 1] = 0; d[i + 2] = 0; }
    img.print(font, c.x0 + 4, c.y0 + 2, String(k));
  });
  await img.quality(85).writeAsync(out);
})();
