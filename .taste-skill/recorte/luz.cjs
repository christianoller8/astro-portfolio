// Versión "de día" de la foto de la luz roja: la pared pasa a blanco y se conservan la franja de
// luz roja y la sombra; la figura se monta encima con la máscara de persona.
// Uso (desde una carpeta con jimp instalado): node luz.cjs <foto.jpg> <mascara.png> <salida.jpg> [previa.jpg]
const Jimp = require('jimp');
const [srcPath, maskPath, outPath, prevPath] = process.argv.slice(2);

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

// Ajuste por mínimos cuadrados de una superficie cuadrática: a + bx + cy + dx² + ey² + fxy
function fitQuad(samples) {
  const N = 6, A = Array.from({ length: N }, () => new Float64Array(N + 1));
  for (const [x, y, v] of samples) {
    const t = [1, x, y, x * x, y * y, x * y];
    for (let i = 0; i < N; i++) { for (let j = 0; j < N; j++) A[i][j] += t[i] * t[j]; A[i][N] += t[i] * v; }
  }
  for (let i = 0; i < N; i++) {
    let p = i; for (let k = i + 1; k < N; k++) if (Math.abs(A[k][i]) > Math.abs(A[p][i])) p = k;
    [A[i], A[p]] = [A[p], A[i]];
    for (let k = 0; k < N; k++) if (k !== i) { const f = A[k][i] / A[i][i]; for (let j = i; j <= N; j++) A[k][j] -= f * A[i][j]; }
  }
  const c = A.map((row, i) => row[N] / row[i]);
  return (x, y) => c[0] + c[1] * x + c[2] * y + c[3] * x * x + c[4] * y * y + c[5] * x * y;
}

(async () => {
  const src = await Jimp.read(srcPath), mask = await Jimp.read(maskPath);
  const W = src.bitmap.width, H = src.bitmap.height, d = src.bitmap.data;
  if (mask.bitmap.width !== W) mask.resize(W, H, Jimp.RESIZE_BICUBIC);
  const alpha = new Float32Array(W * H), neutral = new Float32Array(W * H), red = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) {
    alpha[i] = Math.min(1, Math.max(0, (mask.bitmap.data[i * 4] / 255 - 0.22) / 0.6));
    const r = d[i * 4] / 255, g = d[i * 4 + 1] / 255, b = d[i * 4 + 2] / 255;
    neutral[i] = (g + b) / 2;
    red[i] = r - (g + b) / 2;
  }
  // El borde de la figura, un punto más suave, para que no quede recortado a tijera
  { const softA = blur(alpha, W, H, 1, 2); alpha.set(softA); }
  // Fondo = lejos de la figura (la máscara, engordada)
  const fat = blur(alpha, W, H, 10, 2);
  const bg = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) bg[i] = fat[i] < 0.02 ? 1 : 0;

  // Desenfoque solo con píxeles de fondo (convolución normalizada): quita el grano sin mezclar la figura
  const soft = (a, r) => { const num = blur(a.map((v, i) => v * bg[i]), W, H, r), den = blur(bg, W, H, r); return num.map((v, i) => (den[i] > 1e-4 ? v / den[i] : 0)); };
  const nSoft = soft(neutral, 5), rSoft = soft(red, 6);
  const have = blur(bg, W, H, 5);

  // Superficie de la pared (su viñeteado): se ajusta sin la franja roja y descartando la sombra
  let samples = [];
  for (let y = 0; y < H; y += 12) for (let x = 0; x < W; x += 12) {
    const i = y * W + x; if (!bg[i]) continue;
    if (rSoft[i] > 0.03) continue; // franja de luz
    samples.push([x / W, y / H, nSoft[i]]);
  }
  let wall = fitQuad(samples);
  for (let k = 0; k < 4; k++) {
    samples = samples.filter(([x, y, v]) => v / wall(x, y) > 0.93); // fuera la sombra
    wall = fitQuad(samples);
  }
  console.log('muestras de pared', samples.length);

  // Base local de la pared: la propia pared muy desenfocada, sin la franja de luz ni la zona de la
  // sombra (un recuadro a la derecha de la cabeza, propio de esta foto). Donde no hay pared cerca,
  // vale la superficie ajustada.
  const inShadowBox = (x, y) => x / W > 0.55 && x / W < 0.88 && y / H > 0.19 && y / H < 0.53;
  const plain = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; plain[i] = bg[i] && rSoft[i] < 0.02 && !inShadowBox(x, y) ? 1 : 0; }
  const baseNum = blur(neutral.map((v, i) => v * plain[i]), W, H, 90), baseDen = blur(plain, W, H, 90);
  // Dentro del recuadro de la sombra no hay pared lisa cerca: se trae de más lejos
  const farNum = blur(neutral.map((v, i) => v * plain[i]), W, H, 230, 2), farDen = blur(plain, W, H, 230, 2);
  const baseAt = (i, x, y) => (baseDen[i] > 0.05 ? baseNum[i] / baseDen[i] : farDen[i] > 0.01 ? farNum[i] / farDen[i] : wall(x / W, y / H));

  // Sombra de ambiente: la silueta, muy desenfocada y un poco desplazada hacia donde cae la sombra real
  const ambient = blur(alpha, W, H, 34, 3);
  const AMB = +(process.env.AMB || 0.12), AX = 26, AY = 12;

  // Sombra proyectada. En la foto es demasiado tenue y granulada para extraerla limpia (un 5 % más
  // oscura que la pared), así que se redibuja con la propia silueta: más grande, desplazada a la
  // derecha y un poco hacia abajo, como cae en la pared, y con el borde blando.
  const CAST = +(process.env.CAST || 0.17), CS = 1.12;
  const castRaw = new Float32Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const sx = Math.round((x - 0.725 * W) / CS + 0.48 * W), sy = Math.round((y - 0.245 * H) / CS + 0.185 * H);
    if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
    // Se va apagando hacia abajo: lo que importa es la cabeza y los hombros
    const fade = Math.min(1, Math.max(0, (0.8 - y / H) / 0.3));
    castRaw[y * W + x] = alpha[sy * W + sx] * fade;
  }
  const cast = blur(castRaw, W, H, 9, 3);

  const DEAD = +(process.env.DEAD || 0.975), GAIN = +(process.env.GAIN || 3.5), FLOOR = +(process.env.FLOOR || 0.6);
  const dbg = [];
  const out = new Jimp(W, H, 0xffffffff), o = out.bitmap.data;
  let minShade = 1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const i = y * W + x, base = baseAt(i, x, y);
    // Sombra: cuánto más oscura que la pared. La pared lisa queda en blanco puro
    const ratio = have[i] > 1e-3 ? nSoft[i] / base : 1;
    if (process.env.DEBUG && x % 60 === 0 && y % 60 === 0 && x / W > 0.6 && y / H > 0.2 && y / H < 0.56) dbg.push(`${(x / W).toFixed(2)},${(y / H).toFixed(2)}:${ratio.toFixed(2)}/${(rSoft[i] / base).toFixed(2)}`);
    // Por debajo de DEAD es sombra; se acentúa con GAIN y nunca baja de FLOOR
    const amb = ambient[Math.max(0, y - AY) * W + Math.max(0, x - AX)] * AMB;
    const shade = (1 - cast[i] * CAST) * (1 - amb);
    // Luz roja: el exceso de rojo, en proporción a la pared
    const glow = have[i] > 1e-3 ? Math.max(0, rSoft[i] / base - 0.1) : 0;
    // La sombra tapa la luz
    const tint = Math.min(0.6, glow * 0.38) * (1 - cast[i]);
    if (shade < minShade) minShade = shade;
    const lit = shade;
    const pr = lit, pg = lit * (1 - tint * 0.86), pb = lit * (1 - tint);
    const a = alpha[i];
    o[i * 4] = Math.round((pr * (1 - a) + (d[i * 4] / 255) * a) * 255);
    o[i * 4 + 1] = Math.round((pg * (1 - a) + (d[i * 4 + 1] / 255) * a) * 255);
    o[i * 4 + 2] = Math.round((pb * (1 - a) + (d[i * 4 + 2] / 255) * a) * 255);
    o[i * 4 + 3] = 255;
  }
  console.log('sombra más oscura', minShade.toFixed(2));
  if (dbg.length) console.log(dbg.join('  '));
  await out.quality(92).writeAsync(outPath);
  if (prevPath) await out.clone().resize(Jimp.AUTO, 1100).quality(88).writeAsync(prevPath);
})();
