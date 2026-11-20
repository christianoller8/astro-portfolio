// La textura de la hoja (D25): papel con trama de puntos de imprenta, manchas suaves y grano.
// Es una imagen fija que se repite sin costuras (todo el ruido es periódico), no un shader: no hay
// nada que redibujar ni que reaccione al ratón.
// Uso (desde la raíz, usa sharp):
//   node .taste-skill/papel/papel.cjs light public/textures/paper-light.webp [previa.png]
//   node .taste-skill/papel/papel.cjs dark  public/textures/paper-dark.webp  [previa.png]
// El mosaico mide 1024 px y se pinta a 512 px CSS (nítido en pantallas de doble densidad).
// Ajustes por variable de entorno: BASE (gris de la hoja, 0–255), DOT y HI (cuánto se apartan del
// gris los puntos oscuros y los claros, en niveles), MOTTLE (manchas), GRAIN (grano) y Q (calidad).
const sharp = require('sharp');
const [mode, outPath, prevPath] = process.argv.slice(2);
const env = (k, v) => (process.env[k] === undefined ? v : +process.env[k]);
const dark = mode === 'dark';
// En claro la base va 3 niveles por encima del gris de la hoja: los puntos lo bajan a su media
const BASE = env('BASE', dark ? 0x17 : 0xd9);
const DOT = env('DOT', dark ? 8 : -9);
const HI = env('HI', dark ? -3 : 6);
const MOTTLE = env('MOTTLE', dark ? 0.8 : 1.2);
const GRAIN = env('GRAIN', dark ? 0.9 : 1.2);
const Q = env('Q', 82);

const T = 1024;
// 72 celdas por lado: la trama a 45° queda a unos 5 px CSS entre puntos vecinos (se distingue a
// densidad simple) y cierra en el borde
const CELLS = env('CELLS', 72), P = T / CELLS;

function rng(seed) {
  let s = seed >>> 0;
  return () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

// Ruido de valor periódico: una rejilla de n × n que se repite en el borde del mosaico
function periodic(n, seed) {
  const r = rng(seed), g = Float32Array.from({ length: n * n }, () => r());
  return (x, y) => {
    const fx = (x / T) * n, fy = (y / T) * n, x0 = Math.floor(fx), y0 = Math.floor(fy);
    const tx = fx - x0, ty = fy - y0, sx = tx * tx * tx * (tx * (tx * 6 - 15) + 10), sy = ty * ty * ty * (ty * (ty * 6 - 15) + 10);
    const at = (i, j) => g[(((j % n) + n) % n) * n + (((i % n) + n) % n)];
    const a = at(x0, y0) + (at(x0 + 1, y0) - at(x0, y0)) * sx, b = at(x0, y0 + 1) + (at(x0 + 1, y0 + 1) - at(x0, y0 + 1)) * sx;
    return a + (b - a) * sy;
  };
}
const fbm = (seed) => { const a = periodic(3, seed), b = periodic(7, seed + 1), c = periodic(15, seed + 2); return (x, y) => 0.55 * a(x, y) + 0.3 * b(x, y) + 0.15 * c(x, y); };

// Distancia al punto más cercano de una trama cuadrada de paso P, desplazada (ox, oy)
const toDot = (x, y, ox, oy) => { const dx = ((x - ox) / P) % 1, dy = ((y - oy) / P) % 1; const ax = (dx < 0 ? dx + 1 : dx) - 0.5, ay = (dy < 0 ? dy + 1 : dy) - 0.5; return Math.hypot(ax, ay) * P; };

(async () => {
  const inkField = fbm(11), hiField = fbm(47), mottle = fbm(83), gauss = (() => { const r = rng(1118); return () => Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r()); })();
  const out = Buffer.alloc(T * T);
  const R = P * 0.3; // radio máximo de un punto
  for (let y = 0; y < T; y++) for (let x = 0; x < T; x++) {
    // Puntos de tinta: una trama a 45° (dos tramas cuadradas, una desplazada medio paso). El tamaño
    // del punto sale del ruido (de la mitad al total de su área): la trama cambia de peso por zonas,
    // como un impreso, pero sin llegar a hacer manchas cuando la página se ve entera
    const ink = 0.5 + 0.5 * smooth(0.3, 0.7, inkField(x, y));
    const d = Math.min(toDot(x, y, P / 2, P / 2), toDot(x, y, 0, 0));
    const dot = Math.min(1, Math.max(0, R * Math.sqrt(ink) - d + 0.5));
    // Puntos de brillo, más escasos, en la trama complementaria
    const hi = smooth(0.52, 0.74, hiField(x, y));
    const dh = Math.min(toDot(x, y, P / 2, 0), toDot(x, y, 0, P / 2));
    const glint = Math.min(1, Math.max(0, R * 0.8 * Math.sqrt(hi) - dh + 0.5)) * hi;
    const v = BASE + DOT * dot + HI * glint + MOTTLE * (mottle(x, y) - 0.5) * 2 + GRAIN * gauss();
    out[y * T + x] = Math.round(Math.min(255, Math.max(0, v)));
  }
  const img = sharp(out, { raw: { width: T, height: T, channels: 1 } });
  await img.clone().webp({ quality: Q, effort: 6 }).toFile(outPath);
  // La previa repite el mosaico 2 × 2 a tamaño real (para ver que no hay costura) y recorta el centro
  if (prevPath) {
    const tile = await img.clone().png().toBuffer();
    await sharp({ create: { width: T * 2, height: T * 2, channels: 3, background: '#000' } })
      .composite([0, 1, 2, 3].map((i) => ({ input: tile, left: (i % 2) * T, top: (i >> 1) * T })))
      .png().toBuffer().then((b) => sharp(b).extract({ left: T - 400, top: T - 300, width: 800, height: 600 }).toFile(prevPath));
  }
  console.log(mode, 'base', BASE, '→', outPath, require('node:fs').statSync(outPath).size, 'bytes');
})();
