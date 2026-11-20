// Segunda parte de las miniaturas del lienzo: recorta cada captura al frame de la página y la deja
// a mitad de tamaño (685 × 854).
// Desde el 20 nov (D23) la barra es la primera fila del artboard, así que entra en la miniatura: el
// recorte empieza arriba del todo y solo deja fuera los márgenes de lienzo de los lados (35 px).
// Usa sharp, que ya es dependencia del proyecto (antes era jimp), así funciona en cualquier equipo.
// Uso, desde la raíz del proyecto: node .taste-skill/eloi-1118/tools/canvas-thumbs-resize.cjs <carpeta-capturas> public/canvas
const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');

const [dir, out] = process.argv.slice(2);
(async () => {
  for (const f of fs.readdirSync(dir).filter((name) => name.endsWith('.jpg'))) {
    await sharp(path.join(dir, f))
      .extract({ left: 35, top: 0, width: 1370, height: 1708 })
      .resize({ width: 685, kernel: 'cubic' })
      .jpeg({ quality: 80 })
      .toFile(path.join(out, f));
  }
})();
