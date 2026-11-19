// Convierte "made by" y "chris" (Bricolage Grotesque variable) en trazados, uno por letra, ya
// colocados en el sistema de coordenadas de la marca (el de src/data/caricature.json).
// Uso (desde una carpeta con fontkit instalado; la fuente en .ttf, descomprimida del .woff2 con wawoff2): node lockup-paths.mjs <fuente.ttf> <caricature.json> <salida.json>
import * as fontkit from 'fontkit';
import { readFileSync, writeFileSync } from 'node:fs';

const [fontPath, artPath, outPath] = process.argv.slice(2);
const art = JSON.parse(readFileSync(artPath, 'utf8'));
const base = fontkit.openSync(fontPath);
const h = art.height;
// Las mismas medidas que usa Caricature.astro
const textX = art.width + Math.round(h * 0.246);
const lines = [
  { key: 'made', text: 'made by', size: Math.round(h * 0.215), y: Math.round(h * 0.262), wght: 400, opsz: 48, spacing: -0.02 },
  { key: 'chris', text: 'chris', size: Math.round(h * 0.646), y: Math.round(h * 0.796), wght: 650, opsz: 96, spacing: -0.045 },
];
const n = (v) => Math.round(v * 10) / 10;
const out = { textX };
for (const line of lines) {
  const font = base.getVariation({ wght: line.wght, wdth: 100, opsz: line.opsz });
  const scale = line.size / font.unitsPerEm;
  const run = font.layout(line.text);
  let pen = textX;
  const glyphs = [];
  run.glyphs.forEach((glyph, i) => {
    const pos = run.positions[i];
    const ox = pen + pos.xOffset * scale, oy = line.y - pos.yOffset * scale;
    const d = glyph.path.commands.map((c) => {
      const a = c.args.map((v, k) => (k % 2 === 0 ? n(ox + v * scale) : n(oy - v * scale)));
      const letter = { moveTo: 'M', lineTo: 'L', quadraticCurveTo: 'Q', bezierCurveTo: 'C', closePath: 'Z' }[c.command];
      return letter + a.join(' ');
    }).join('');
    if (d) glyphs.push(d);
    pen += pos.xAdvance * scale + line.spacing * line.size;
  });
  out[line.key] = glyphs;
  out[line.key + 'End'] = Math.round(pen);
  console.log(line.text, glyphs.length, 'letras · acaba en x =', Math.round(pen), '·', glyphs.join('').length, 'B');
}
writeFileSync(outPath, JSON.stringify(out));
