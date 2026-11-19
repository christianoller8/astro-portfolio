// Segunda parte de las miniaturas del lienzo: recorta cada captura al frame de la página (sin la
// barra, el nombre del frame ni los márgenes de lienzo) y la deja a mitad de tamaño.
// Uso (desde una carpeta con jimp): node canvas-thumbs-resize.cjs <carpeta-capturas> <public/canvas>
const Jimp = require('jimp');
const fs = require('node:fs');
const [dir, out] = process.argv.slice(2);
(async () => {
  for (const f of fs.readdirSync(dir).filter((name) => name.endsWith('.jpg'))) {
    const image = await Jimp.read(`${dir}/${f}`);
    await image.crop(35, 92, 1370, 1708).resize(685, Jimp.AUTO, Jimp.RESIZE_BICUBIC).quality(80).writeAsync(`${out}/${f}`);
  }
})();
