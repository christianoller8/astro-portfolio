// La foto de Sobre mí (20 nov): el retrato de la luz circular, pasado a blanco y negro.
// El original, en color, está en docs/imgs/sobre-mi-luz.jpg. En la página se funde con la hoja
// con una máscara (AboutPage.astro), así que aquí solo se le quita el color y se afina el contraste.
// Uso (desde la raíz, usa sharp):
//   node .taste-skill/recorte/sobre-mi.cjs [original.jpg] [salida.jpg]
const sharp = require('sharp');
const [src = 'docs/imgs/sobre-mi-luz.jpg', out = 'src/assets/images/about.jpg'] = process.argv.slice(2);
(async () => {
  const info = await sharp(src)
    .grayscale()
    // Un punto más de contraste: en gris, el círculo de luz y la cara pierden algo de fuerza
    .linear(1.08, -6)
    .jpeg({ quality: 92, chromaSubsampling: '4:4:4' })
    .toFile(out);
  console.log('hecho', out, info.width + ' × ' + info.height, info.size + ' bytes');
})();
