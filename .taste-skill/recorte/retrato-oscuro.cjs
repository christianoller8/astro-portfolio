// Retrato de Sobre mí para el modo oscuro: la persona recortada (máscara de Vision, con el borde
// suavizado) sobre transparente. Uso: node retrato-oscuro.cjs <foto.jpg> <mascara.png> <salida.png>
const path = require('path');
const Jimp = require(path.join(process.env.JIMP_DIR, 'node_modules', 'jimp'));
(async () => {
  const [src, maskPath, out] = process.argv.slice(2);
  const photo = await Jimp.read(src);
  const mask = await Jimp.read(maskPath);
  mask.resize(photo.bitmap.width, photo.bitmap.height, Jimp.RESIZE_BICUBIC).blur(2);
  const { data, width, height } = photo.bitmap;
  const m = mask.bitmap.data;
  for (let i = 0; i < width * height; i++) {
    // Se aprieta la máscara para comerse el halo claro del fondo en el borde
    const a = Math.max(0, Math.min(1, (m[i * 4] / 255 - 0.5) / 0.42));
    data[i * 4 + 3] = Math.round(a * 255);
  }
  await photo.writeAsync(out);
  console.log('ok', width, height);
})();
