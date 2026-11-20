// Versión "de día" de la foto de la luz roja: la figura sobre un gris claro, sin la franja de luz de la
// pared ni sombra. El gris es más hondo detrás del cuerpo y se abre a blanco hacia los bordes y hacia
// arriba, donde la foto toca la barra, para fundirse con el papel sin ningún corte.
// En el borde de la figura se cambia la pared vieja por el gris (foto + (1 − a)·(gris − pared)), así
// no queda cerco oscuro ni rojizo donde pasaba la franja.
// Uso (desde la raíz, usa sharp):
//   node .taste-skill/recorte/luz-gris.cjs <foto.jpg> <mascara.png> <salida.jpg> [previa.jpg]
// La máscara de card.jpg está en docs/imgs/card-mascara.png (sale de mascara-diferencia.cjs).
// Ajustes por variable de entorno: GRAY (el gris más hondo, 0–1), CX, CY, RX, RY (centro y radios de
// la mancha gris, en fracciones de la foto), INNER (desde dónde aclara), TOP0, TOP1 (rampa de arriba)
// y GRAIN (grano, en niveles de 0 a 255).
const sharp = require('sharp');
const [photoPath, maskPath, outPath, prevPath] = process.argv.slice(2);
const env = (k, v) => (process.env[k] === undefined ? v : +process.env[k]);
// Los valores por defecto son los de card-light.jpg (D24). La foto asoma bajo la barra al 17 % de su
// alto (en escritorio y en móvil): a esa altura el gris tiene que ser ya blanco.
const GRAY = env('GRAY', 0.88), CX = env('CX', 0.55), CY = env('CY', 0.58), RX = env('RX', 0.66), RY = env('RY', 0.56);
const INNER = env('INNER', 0.35), TOP0 = env('TOP0', 0.15), TOP1 = env('TOP1', 0.3), GRAIN = env('GRAIN', 1.4);

// Desenfoque de caja separable sobre un Float32Array
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

// Grano: ruido gaussiano repetible (mulberry32 + Box-Muller)
function noise(seed) {
  let s = seed >>> 0;
  const rand = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  return () => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());
}

(async () => {
  const { data: d, info } = await sharp(photoPath).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height, N = W * H;
  const { data: m } = await sharp(maskPath).resize(W, H).extractChannel(0).raw().toBuffer({ resolveWithObject: true });
  const alpha = Float32Array.from(m, (v) => v / 255);

  // La pared de la foto junto a la figura (con su franja roja), para quitarla del borde
  const touched = blur(alpha.map((v) => (v > 0 ? 1 : 0)), W, H, 3, 1);
  const wallMask = touched.map((v) => (v === 0 ? 1 : 0));
  const den = blur(wallMask, W, H, 6), denFar = blur(wallMask, W, H, 30, 2);
  const wall = [0, 1, 2].map((c) => {
    const ch = new Float32Array(N);
    for (let i = 0; i < N; i++) ch[i] = (d[i * 3 + c] / 255) * wallMask[i];
    const num = blur(ch, W, H, 6), numFar = blur(ch, W, H, 30, 2);
    return num.map((v, i) => (den[i] > 0.02 ? v / den[i] : denFar[i] > 1e-3 ? numFar[i] / denFar[i] : 0.25));
  });

  const grain = noise(1118);
  const out = Buffer.alloc(N * 3);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, u = x / W, v = y / H;
    const r = Math.hypot((u - CX) / RX, (v - CY) / RY);
    const s = (1 - smooth(INNER, 1, r)) * smooth(TOP0, TOP1, v);
    const g = 1 - s * (1 - GRAY) + (grain() * GRAIN) / 255;
    const a = alpha[i];
    for (let c = 0; c < 3; c++) {
      const p = d[i * 3 + c] / 255;
      // Acotado entre la foto y el gris: donde la máscara se queda corta (la oreja, con luz roja) la
      // piel que cae fuera no puede salir más clara que el fondo y hacer un cerco
      const o = a >= 1 ? p : a <= 0 ? g : Math.min(Math.max(p, g), Math.max(Math.min(p, g), p + (1 - a) * (g - wall[c][i])));
      out[i * 3 + c] = Math.round(Math.min(1, Math.max(0, o)) * 255);
    }
  }
  const img = sharp(out, { raw: { width: W, height: H, channels: 3 } });
  await img.clone().jpeg({ quality: 90, mozjpeg: true }).toFile(outPath);
  if (prevPath) await img.clone().resize({ height: 1100 }).jpeg({ quality: 88 }).toFile(prevPath);
  console.log('hecho', outPath);
})();
