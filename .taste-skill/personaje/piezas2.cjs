// Saca las piezas de la segunda lámina (docs/imgs/emoji-piezas-2.jpg). Como piezas.cjs, pero cada
// pieza se elige por un punto que cae dentro de su dibujo, y con tres arreglos propios:
// - hand-grip: se quitan las rayas finas del canto que agarra (apertura morfológica).
// - shin: la "pierna" de la lámina es la pierna entera; se usa su mitad de abajo (de la rodilla al
//   tobillo), con la parte de arriba redondeada.
// - sweat: las gotas son dibujos pequeños y sueltos; se guardan una a una.
// Uso (desde una carpeta con jimp): node piezas2.cjs <lamina.jpg> <carpeta-salida> [previa.jpg]
const Jimp = require('jimp');
const fs = require('node:fs');
const [src, outDir, prev] = process.argv.slice(2);

const PIECES = {
  head: [590, 250], 'head-strain': [920, 250], 'head-relief': [1280, 250], 'head-front': [590, 660],
  torso: [930, 700], hood: [1240, 560], 'cord-1': [1301, 750], 'cord-2': [1334, 740],
  'upper-arm': [550, 1050], forearm: [770, 1200], 'hand-open': [1050, 1000], 'hand-fist': [1050, 1230],
  'hand-fist-front': [1300, 990], 'hand-grip': [1260, 1230],
  thigh: [250, 1400], leg: [570, 1600], shoe: [920, 1520], 'shoe-bent': [900, 1790],
  'dust-1': [1230, 1740], 'dust-2': [1340, 1725], 'dust-3': [1300, 1830],
};
const SWEAT = [1165, 1385, 1375, 1600]; // la zona de las gotas

(async () => {
  const img = await Jimp.read(src);
  const W = img.bitmap.width, H = img.bitmap.height, d = img.bitmap.data;
  const lum = new Uint8Array(W * H);
  for (let i = 0; i < W * H; i++) lum[i] = Math.round(0.299 * d[i * 4] + 0.587 * d[i * 4 + 1] + 0.114 * d[i * 4 + 2]);
  const BG = 232, bg = new Uint8Array(W * H), stack = [];
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x);
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1);
  while (stack.length) { const p = stack.pop(); if (bg[p] || lum[p] < BG) continue; bg[p] = 1; const x = p % W, y = (p - x) / W; if (x > 0) stack.push(p - 1); if (x < W - 1) stack.push(p + 1); if (y > 0) stack.push(p - W); if (y < H - 1) stack.push(p + W); }
  const label = new Int32Array(W * H), comps = [null];
  for (let i = 0; i < W * H; i++) {
    if (bg[i] || label[i]) continue;
    const id = comps.length; let area = 0, x0 = W, y0 = H, x1 = 0, y1 = 0; const st = [i]; label[i] = id;
    while (st.length) { const p = st.pop(); area++; const x = p % W, y = (p - x) / W; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; const q = yy * W + xx; if (!bg[q] && !label[q]) { label[q] = id; st.push(q); } } }
    comps.push({ id, area, x0, y0, x1, y1 });
  }

  // Recorta un componente: fondo transparente y borde tratado como línea negra con transparencia
  const cut = (c, keep) => {
    const pad = 3, bx = Math.max(0, c.x0 - pad), by = Math.max(0, c.y0 - pad), bw = Math.min(W, c.x1 + pad + 1) - bx, bh = Math.min(H, c.y1 + pad + 1) - by;
    const out = new Jimp(bw, bh, 0x00000000), o = out.bitmap.data;
    const inside = (p) => label[p] === c.id && (!keep || keep[p]);
    for (let y = 0; y < bh; y++) for (let x = 0; x < bw; x++) {
      const p = (by + y) * W + bx + x, q = (y * bw + x) * 4;
      if (!inside(p)) continue;
      let edge = false;
      for (let dy = -2; dy <= 2 && !edge; dy++) for (let dx = -2; dx <= 2; dx++) {
        const xx = bx + x + dx, yy = by + y + dy;
        if (xx < 0 || yy < 0 || xx >= W || yy >= H || !inside(yy * W + xx)) { edge = true; break; }
      }
      if (edge && lum[p] > 40) { const a = Math.max(0, Math.min(1, (BG - lum[p]) / (BG - 40))); o[q] = o[q + 1] = o[q + 2] = 22; o[q + 3] = Math.round(a * 255); }
      else { o[q] = d[p * 4]; o[q + 1] = d[p * 4 + 1]; o[q + 2] = d[p * 4 + 2]; o[q + 3] = 255; }
    }
    return { out, box: { x: bx, y: by, w: bw, h: bh } };
  };
  const crop = (image) => { // recorta al contenido
    const b = image.bitmap; let x0 = b.width, y0 = b.height, x1 = 0, y1 = 0;
    for (let y = 0; y < b.height; y++) for (let x = 0; x < b.width; x++) if (b.data[(y * b.width + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
    return image.clone().crop(Math.max(0, x0 - 2), Math.max(0, y0 - 2), Math.min(b.width, x1 + 3) - Math.max(0, x0 - 2), Math.min(b.height, y1 + 3) - Math.max(0, y0 - 2));
  };

  const result = {};
  const save = async (name, image) => { await image.writeAsync(`${outDir}/${name}.png`); result[name] = { w: image.bitmap.width, h: image.bitmap.height }; console.log(name.padEnd(16), `${image.bitmap.width} × ${image.bitmap.height}`); };

  for (const [name, [px, py]] of Object.entries(PIECES)) {
    const id = label[py * W + px];
    if (!id) { console.log('SIN PIEZA EN', name, px, py); continue; }
    const c = comps[id];
    if (name === 'hand-grip') {
      // Apertura: se erosiona 5 px (las rayas finas desaparecen) y se vuelve a engordar
      const R = 5, er = new Uint8Array(W * H), keep = new Uint8Array(W * H);
      for (let y = c.y0; y <= c.y1; y++) for (let x = c.x0; x <= c.x1; x++) {
        let ok = true;
        for (let dy = -R; dy <= R && ok; dy++) for (let dx = -R; dx <= R; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H || label[yy * W + xx] !== c.id) { ok = false; break; } }
        er[y * W + x] = ok ? 1 : 0;
      }
      for (let y = c.y0; y <= c.y1; y++) for (let x = c.x0; x <= c.x1; x++) {
        let ok = false;
        for (let dy = -R - 2; dy <= R + 2 && !ok; dy++) for (let dx = -R - 2; dx <= R + 2; dx++) { const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < W && yy < H && er[yy * W + xx]) { ok = true; break; } }
        keep[y * W + x] = ok ? 1 : 0;
      }
      await save(name, crop(cut(c, keep).out));
      continue;
    }
    const piece = cut(c).out;
    if (name === 'leg') {
      // De la pierna entera, la parte de abajo: desde el 46 % (la rodilla) hasta el bajo
      const b = piece.bitmap, top = Math.round(b.height * 0.46), shin = piece.clone().crop(0, top, b.width, b.height - top);
      // Arriba se redondea con un semicírculo: es lo que queda bajo la rodilla del muslo
      const sb = shin.bitmap, r = sb.width / 2;
      for (let y = 0; y < r; y++) for (let x = 0; x < sb.width; x++) {
        const dist = Math.hypot(x - r, y - r);
        const a = Math.max(0, Math.min(1, r - 3 - dist));
        const q = (y * sb.width + x) * 4; sb.data[q + 3] = Math.round(sb.data[q + 3] * a);
      }
      await save('shin', crop(shin));
      continue;
    }
    await save(name, piece);
  }
  // Gotas de sudor: los dibujos pequeños de su zona
  const drops = comps.filter((c) => c && c.area > 110 && c.x0 >= SWEAT[0] && c.y0 >= SWEAT[1] && c.x1 <= SWEAT[2] && c.y1 <= SWEAT[3]).sort((a, b) => b.area - a.area).slice(0, 5);
  for (const [k, c] of drops.entries()) await save(`sweat-${k + 1}`, cut(c).out);

  fs.writeFileSync(`${outDir}/piezas.json`, JSON.stringify(result, null, 1));
  if (prev) {
    const names = Object.keys(result), cols = 7, cell = 300;
    const sheet = new Jimp(cols * cell, Math.ceil(names.length / cols) * cell, 0x8a8a8aff);
    for (const [k, name] of names.entries()) {
      const im = await Jimp.read(`${outDir}/${name}.png`); im.scaleToFit(cell - 30, cell - 30);
      sheet.composite(im, (k % cols) * cell + (cell - im.bitmap.width) / 2, Math.floor(k / cols) * cell + (cell - im.bitmap.height) / 2);
    }
    await sheet.quality(88).writeAsync(prev);
  }
})();
