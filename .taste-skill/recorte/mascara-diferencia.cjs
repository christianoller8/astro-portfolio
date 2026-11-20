// Recupera la máscara de persona de un montaje en el que la figura se pegó tal cual sobre otro fondo
// (como card-light.jpg, hecho con luz.cjs). Sirve donde no hay person.swift (Windows): compara el
// montaje con la foto original. Dentro de la figura los píxeles coinciden; en el fondo no se parecen.
// En el borde, montaje = a·foto + (1 − a)·fondo, y de ahí sale a.
// Uso (desde la raíz del repositorio, usa sharp): node .taste-skill/recorte/mascara-diferencia.cjs <foto.jpg> <montaje.jpg> <mascara.png>
const sharp = require('sharp');
const [photoPath, montagePath, outPath] = process.argv.slice(2);

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
const rgb = async (path) => {
  const { data, info } = await sharp(path).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { d: data, W: info.width, H: info.height };
};

(async () => {
  const P = await rgb(photoPath), M = await rgb(montagePath);
  if (P.W !== M.W || P.H !== M.H) throw new Error('La foto y el montaje no miden lo mismo');
  const { W, H } = P, N = W * H;

  // Diferencia por píxel (el canal que más cambia)
  const diff = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    let m = 0;
    for (let c = 0; c < 3; c++) m = Math.max(m, Math.abs(M.d[i * 3 + c] - P.d[i * 3 + c]));
    diff[i] = m / 255;
  }
  // Fondo seguro: difiere de la foto, igual que todo lo que tiene a 2 px
  const seed = diff.map((v) => (v > 0.12 ? 1 : 0));
  const near = blur(seed, W, H, 2, 1);
  const core = near.map((v) => (v > 0.999 ? 1 : 0));

  // El fondo del montaje, prolongado bajo el borde de la figura (convolución normalizada)
  const den = blur(core, W, H, 8), far = blur(core, W, H, 60, 2);
  const back = [0, 1, 2].map((c) => {
    const ch = new Float32Array(N);
    for (let i = 0; i < N; i++) ch[i] = (M.d[i * 3 + c] / 255) * core[i];
    const num = blur(ch, W, H, 8), numFar = blur(ch, W, H, 60, 2);
    return num.map((v, i) => (den[i] > 0.02 ? v / den[i] : far[i] > 1e-3 ? numFar[i] / far[i] : -1));
  });

  // a sale de proyectar (montaje − foto) sobre (fondo − foto)
  const alpha = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    if (core[i]) continue;
    let dot = 0, len = 0;
    for (let c = 0; c < 3; c++) {
      const p = P.d[i * 3 + c] / 255, b = back[c][i];
      if (b < 0) { len = 0; break; }
      dot += (M.d[i * 3 + c] / 255 - p) * (b - p);
      len += (b - p) * (b - p);
    }
    const t = len > 0.003 ? Math.min(1, Math.max(0, dot / len)) : diff[i] < 0.05 ? 0 : 1;
    // Fuera el ruido del JPEG en los dos extremos
    alpha[i] = Math.min(1, Math.max(0, (1 - t - 0.04) / 0.92));
  }

  // Agujeros e islas pequeños (la máscara original tenía alguno en brillos y botones): se rellenan o
  // se quitan. Solo los pequeños: el hueco entre el brazo y el cuerpo también está cerrado y es fondo.
  const MAX_SPECK = 600;
  const label = new Int32Array(N).fill(-1);
  const fix = [];
  for (let start = 0; start < N; start++) {
    if (label[start] !== -1) continue;
    const inside = alpha[start] >= 0.5, stack = [start], region = [];
    label[start] = start;
    let edge = false;
    while (stack.length) {
      const i = stack.pop(), x = i % W, y = (i - x) / W;
      region.push(i);
      if (x === 0 || y === 0 || x === W - 1 || y === H - 1) edge = true;
      for (const j of [x > 0 ? i - 1 : -1, x < W - 1 ? i + 1 : -1, y > 0 ? i - W : -1, y < H - 1 ? i + W : -1]) {
        if (j >= 0 && label[j] === -1 && alpha[j] >= 0.5 === inside) { label[j] = start; stack.push(j); }
      }
    }
    if (region.length < MAX_SPECK && !edge) fix.push({ region, value: inside ? 0 : 1 });
  }
  for (const { region, value } of fix) {
    // Con su anillo de borde (2 px), para que no quede un cerco
    const ring = new Float32Array(N);
    for (const i of region) ring[i] = 1;
    const grown = blur(ring, W, H, 2, 1);
    for (let i = 0; i < N; i++) if (grown[i] > 0) alpha[i] = value;
  }
  console.log('agujeros e islas corregidos', fix.length);

  const out = Buffer.alloc(N);
  let partial = 0;
  for (let i = 0; i < N; i++) {
    out[i] = Math.round(alpha[i] * 255);
    if (alpha[i] > 0 && alpha[i] < 1) partial++;
  }
  console.log('píxeles de figura', alpha.reduce((s, v) => s + (v >= 0.5 ? 1 : 0), 0), '· de borde', partial);
  await sharp(out, { raw: { width: W, height: H, channels: 1 } }).png().toFile(outPath);
})();
