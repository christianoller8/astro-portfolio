// Versión "de día" de la foto de la luz roja: la figura sola, sin la franja de luz de la pared ni
// sombra, con fondo transparente para que se vea la hoja de la página (su gris y su textura, D25).
// Detrás del cuerpo lleva un velo oscuro muy suave, que hace de pared (un velo claro lo despegaba
// del papel y la figura parecía flotar) y se apaga hacia los bordes y hacia arriba, donde la foto
// toca la barra, para que no haya ningún corte.
// En el borde de la figura se quita la pared vieja (oscura y, a la altura de la franja, roja) para
// que no quede cerco.
// Uso (desde la raíz, usa sharp):
//   node .taste-skill/recorte/luz-gris.cjs <foto.jpg> <mascara.png> <salida.webp> [previa.jpg]
// La máscara de card.jpg está en docs/imgs/card-mascara.png (sale de mascara-diferencia.cjs).
// Ajustes por variable de entorno: GLOW (opacidad máxima del velo, 0–1), VEIL (su tono: 0 negro,
// 1 blanco), CX, CY, RX, RY (centro y
// radios del velo, en fracciones de la foto), INNER (desde dónde se apaga), TOP0, TOP1 (rampa de
// arriba) y SHEET (gris de la hoja, solo para la previa).
const sharp = require('sharp');
const [photoPath, maskPath, outPath, prevPath] = process.argv.slice(2);
const env = (k, v) => (process.env[k] === undefined ? v : +process.env[k]);
// Los valores por defecto son los de card-light.webp. La foto asoma bajo la barra al 17 % de su alto
// (en escritorio y en móvil): a esa altura el velo tiene que haberse apagado ya.
const GLOW = env('GLOW', 0.12), VEIL = env('VEIL', 0), CX = env('CX', 0.55), CY = env('CY', 0.58), RX = env('RX', 0.66), RY = env('RY', 0.56);
const INNER = env('INNER', 0.35), TOP0 = env('TOP0', 0.17), TOP1 = env('TOP1', 0.32), SHEET = env('SHEET', 0xd6);

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

  const out = Buffer.alloc(N * 4);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, u = x / W, v = y / H;
    const r = Math.hypot((u - CX) / RX, (v - CY) / RY);
    // El velo: del tono VEIL (0 negro, 1 blanco), con esta opacidad
    const g = (1 - smooth(INNER, 1, r)) * smooth(TOP0, TOP1, v) * GLOW;
    const a = alpha[i];
    // Figura (a) sobre el velo (g): la opacidad del píxel y su color, sin premultiplicar
    const cover = a + (1 - a) * g;
    for (let c = 0; c < 3; c++) {
      const p = d[i * 3 + c] / 255;
      // Color propio de la figura en el borde: la foto menos la parte de pared que se colaba. Solo
      // donde la máscara es fiable (a ≥ 0,5) y sin apartarse mucho de la foto
      const own = a >= 1 ? p : a >= 0.5 ? Math.min(p + 0.15, Math.max(p - 0.15, (p - (1 - a) * wall[c][i]) / a)) : p;
      const color = cover > 1e-4 ? (a * own + (1 - a) * g * VEIL) / cover : VEIL;
      out[i * 4 + c] = Math.round(Math.min(1, Math.max(0, color)) * 255);
    }
    out[i * 4 + 3] = Math.round(cover * 255);
  }
  const img = sharp(out, { raw: { width: W, height: H, channels: 4 } });
  await img.clone().webp({ quality: 90, alphaQuality: 100, effort: 6 }).toFile(outPath);
  // La previa la pone sobre el gris de la hoja
  if (prevPath) await img.clone().flatten({ background: { r: SHEET, g: SHEET, b: SHEET } }).resize({ height: 1100 }).jpeg({ quality: 88 }).toFile(prevPath);
  console.log('hecho', outPath, require('node:fs').statSync(outPath).size, 'bytes');
})();
