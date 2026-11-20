// Foto oscura del hero sin la sombra que la figura proyecta en la pared (a la derecha de la cabeza
// y del hombro). La franja de luz roja y la figura no cambian.
// La pared de la derecha se rehace con un modelo sencillo: el perfil vertical de la pared limpia de
// la izquierda (que lleva la franja roja) por el perfil horizontal de la parte de arriba, donde no
// hay sombra. Encima se pone un grano como el de la foto. A la izquierda la pared es la original;
// el paso de una a otra queda detrás de la figura.
// Uso (desde la raíz, usa sharp):
//   node .taste-skill/recorte/sin-sombra.cjs <foto.jpg> <mascara.png> <salida.jpg> [previa.jpg]
// La máscara de card.jpg está en docs/imgs/card-mascara.png.
const sharp = require('sharp');
const [photoPath, maskPath, outPath, prevPath] = process.argv.slice(2);
const env = (k, v) => (process.env[k] === undefined ? v : +process.env[k]);
// S0–S1: tramo del ancho en el que la pared pasa de original a rehecha (cae detrás de la cabeza)
const S0 = env('S0', 0.4), S1 = env('S1', 0.58), GRAIN = env('GRAIN', 1);

function box(src, W, H, r) {
  const tmp = new Float32Array(W * H), dst = new Float32Array(W * H);
  for (let y = 0; y < H; y++) {
    let acc = 0;
    for (let x = -r; x <= r; x++) acc += src[y * W + Math.min(W - 1, Math.max(0, x))];
    for (let x = 0; x < W; x++) {
      tmp[y * W + x] = acc / (2 * r + 1);
      acc += src[y * W + Math.min(W - 1, x + r + 1)] - src[y * W + Math.max(0, x - r)];
    }
  }
  for (let x = 0; x < W; x++) {
    let acc = 0;
    for (let y = -r; y <= r; y++) acc += tmp[Math.min(H - 1, Math.max(0, y)) * W + x];
    for (let y = 0; y < H; y++) {
      dst[y * W + x] = acc / (2 * r + 1);
      acc += tmp[Math.min(H - 1, y + r + 1) * W + x] - tmp[Math.max(0, y - r) * W + x];
    }
  }
  return dst;
}
const blur = (a, W, H, r, n = 3) => { let o = a; for (let i = 0; i < n; i++) o = box(o, W, H, r); return o; };
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
// Suavizado de un perfil de una dimensión
const blur1 = (a, r, n = 3) => {
  let o = a;
  for (let k = 0; k < n; k++) {
    const d = new Float32Array(o.length);
    for (let i = 0; i < o.length; i++) {
      let s = 0;
      for (let j = -r; j <= r; j++) s += o[Math.min(o.length - 1, Math.max(0, i + j))];
      d[i] = s / (2 * r + 1);
    }
    o = d;
  }
  return o;
};
// Azar repetible, para que la foto salga igual cada vez
let seed = 20261120;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const gauss = () => Math.sqrt(-2 * Math.log(1 - rnd())) * Math.cos(2 * Math.PI * rnd());

(async () => {
  const { data: d, info } = await sharp(photoPath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const { data: m } = await sharp(maskPath).resize(W, H).extractChannel(0).raw().toBuffer({ resolveWithObject: true });
  const alpha = Float32Array.from(m, (v) => v / 255);

  // Pared: lo que queda lejos de la figura
  const touched = blur(alpha.map((v) => (v > 0 ? 1 : 0)), W, H, 3, 1);
  const wallMask = touched.map((v) => (v < 1e-4 ? 1 : 0));
  // La pared vieja junto a la figura, para limpiar el borde (como en luz-gris.cjs)
  const den = blur(wallMask, W, H, 6), denFar = blur(wallMask, W, H, 30, 2);
  const ch = [0, 1, 2].map((c) => { const a = new Float32Array(N); for (let i = 0; i < N; i++) a[i] = d[i * 3 + c] / 255; return a; });
  const wallOld = ch.map((p) => {
    const w = p.map((v, i) => v * wallMask[i]);
    const num = blur(w, W, H, 6), numFar = blur(w, W, H, 30, 2);
    return num.map((v, i) => (den[i] > 0.02 ? v / den[i] : denFar[i] > 1e-3 ? numFar[i] / denFar[i] : 0.25));
  });

  // Modelo de la pared limpia: perfil vertical (banda de la izquierda) × perfil horizontal (arriba)
  const x0 = Math.round(0.03 * W), x1 = Math.round(0.15 * W), y0 = Math.round(0.02 * H), y1 = Math.round(0.17 * H);
  const model = ch.map((p) => {
    let L = new Float32Array(H), Hx = new Float32Array(W);
    for (let y = 0; y < H; y++) {
      let s = 0, n = 0;
      for (let x = x0; x < x1; x++) if (wallMask[y * W + x]) { s += p[y * W + x]; n++; }
      L[y] = n ? s / n : NaN;
    }
    // Filas sin pared en la banda (abajo del todo): la última válida
    for (let y = 1; y < H; y++) if (Number.isNaN(L[y])) L[y] = L[y - 1];
    L = blur1(L, 2);
    for (let x = 0; x < W; x++) { let s = 0; for (let y = y0; y < y1; y++) s += p[y * W + x]; Hx[x] = s / (y1 - y0); }
    Hx = blur1(Hx, 30);
    let ref = 0; for (let x = x0; x < x1; x++) ref += Hx[x]; ref /= x1 - x0;
    return { L, Hx: Hx.map((v) => v / ref) };
  });
  const modelAt = (c, x, y) => model[c].L[y] * model[c].Hx[x];

  // Grano de la pared: lo que le queda a la foto al quitarle su versión suavizada, medido arriba a la izquierda
  const lum = new Float32Array(N); for (let i = 0; i < N; i++) lum[i] = (ch[0][i] + ch[1][i] + ch[2][i]) / 3;
  const lumB = blur(lum, W, H, 2);
  let gs = 0, gn = 0;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) { const e = lum[y * W + x] - lumB[y * W + x]; gs += e * e; gn++; }
  const grainStd = Math.sqrt(gs / gn);
  let noise = new Float32Array(N); for (let i = 0; i < N; i++) noise[i] = gauss();
  noise = box(noise, W, H, 1);
  let ns = 0; for (let i = 0; i < N; i++) ns += noise[i] * noise[i];
  const nk = (grainStd / Math.sqrt(ns / N)) * GRAIN;

  // Comprobación: a la derecha, donde no hay sombra, el modelo tiene que parecerse a la foto
  for (const [a, b] of [[0.03, 0.15], [0.2, 0.28], [0.3, 0.38], [0.38, 0.44]]) {
    const r = [0, 1, 2].map((c) => {
      let s = 0, q = 0, n = 0;
      for (let y = Math.round(a * H); y < Math.round(b * H); y++) for (let x = Math.round(0.9 * W); x < Math.round(0.98 * W); x++) { s += ch[c][y * W + x]; q += modelAt(c, x, y); n++; }
      return (s / q).toFixed(3);
    });
    console.log('foto / modelo, borde derecho, filas', a, '–', b, r.join(' '));
  }
  console.log('grano', grainStd.toFixed(4));

  const out = Buffer.alloc(N * 3);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, S = smooth(S0, S1, x / W), a = alpha[i];
    for (let c = 0; c < 3; c++) {
      const p = ch[c][i];
      const clean = modelAt(c, x, y) + noise[i] * nk;
      let v;
      if (a <= 0) v = p + (clean - p) * S;
      else {
        // Figura sobre la pared nueva; en el borde se le quita la pared vieja que se colaba
        const own = a >= 1 ? p : a >= 0.5 ? Math.min(p + 0.15, Math.max(p - 0.15, (p - (1 - a) * wallOld[c][i]) / a)) : p;
        const bg = wallOld[c][i] + (clean - wallOld[c][i]) * S;
        v = a >= 0.5 ? a * own + (1 - a) * bg : p + (1 - a) * (bg - wallOld[c][i]);
      }
      out[i * 3 + c] = Math.round(Math.min(1, Math.max(0, v)) * 255);
    }
  }
  const img = sharp(out, { raw: { width: W, height: H, channels: 3 } });
  await img.clone().jpeg({ quality: 95, chromaSubsampling: '4:4:4' }).toFile(outPath);
  if (prevPath) await img.clone().resize({ height: 1100 }).jpeg({ quality: 88 }).toFile(prevPath);
  console.log('hecho', outPath, require('node:fs').statSync(outPath).size, 'bytes');
})();
