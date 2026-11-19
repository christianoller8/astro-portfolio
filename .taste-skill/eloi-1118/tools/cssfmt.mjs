// Formatea CSS minificado (una regla por línea, con sangría por bloque) y saca un resumen de animación.
// Uso: node cssfmt.mjs <entrada.css> <salida.pretty.css> [--report]
import fs from 'node:fs';

const [input, output, flag] = process.argv.slice(2);
const css = fs.readFileSync(input, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

let out = '';
let depth = 0;
let buf = '';
let quote = null;
let paren = 0;
for (const ch of css) {
  if (quote) { buf += ch; if (ch === quote) quote = null; continue; }
  if (ch === '"' || ch === "'") { quote = ch; buf += ch; continue; }
  if (ch === '(') paren++;
  if (ch === ')') paren--;
  if (paren > 0) { buf += ch; continue; }
  if (ch === '{') { out += '  '.repeat(depth) + buf.trim() + ' {\n'; depth++; buf = ''; continue; }
  if (ch === ';') { out += '  '.repeat(depth) + buf.trim() + ';\n'; buf = ''; continue; }
  if (ch === '}') {
    if (buf.trim()) out += '  '.repeat(depth) + buf.trim() + ';\n';
    depth = Math.max(0, depth - 1);
    out += '  '.repeat(depth) + '}\n';
    buf = '';
    continue;
  }
  buf += ch;
}
fs.writeFileSync(output, out);

if (flag === '--report') {
  const uniq = (arr) => [...new Map(arr.map((x) => [x, (arr.filter((y) => y === x).length)])).entries()].sort((a, b) => b[1] - a[1]);
  const all = (re) => [...css.matchAll(re)].map((m) => m[1].trim());
  const report = {
    lines: out.split('\n').length,
    easings: uniq(all(/(cubic-bezier\([^)]*\)|steps\([^)]*\)|ease-in-out|ease-out|ease-in|linear(?:\([^)]*\))?)/g)).slice(0, 30),
    durations: uniq(all(/(?<![\w-])(\d*\.?\d+m?s)\b/g)).slice(0, 40),
    mediaQueries: uniq(all(/@media\s*([^{]+)\{/g)),
    supports: uniq(all(/@supports\s*([^{]+)\{/g)),
    containerQueries: uniq(all(/@container\s*([^{]+)\{/g)),
    fontFaces: [...css.matchAll(/@font-face\s*\{([^}]*)\}/g)].map((m) => m[1].replace(/src:[^;]*;?/, '').trim()),
    zIndex: uniq(all(/z-index:\s*([^;}]+)/g)),
    viewTransitionNames: uniq(all(/view-transition-name:\s*([^;}]+)/g)),
    animationTimelines: uniq(all(/(animation-timeline:[^;}]+|scroll-timeline[^;}]*|view-timeline[^;}]*|animation-range:[^;}]+)/g)),
    clipPaths: uniq(all(/clip-path:\s*([^;}]+)/g)).slice(0, 25),
    blendModes: uniq(all(/(mix-blend-mode:[^;}]+|backdrop-filter:[^;}]+|filter:[^;}]+)/g)).slice(0, 25),
    newCss: uniq(all(/(@starting-style|@property\s+[\w-]+|@layer\s+[\w-, ]+|:has\(|text-wrap:\s*\w+|field-sizing|interpolate-size|anchor-name|position-anchor|scroll-snap-type:[^;}]+|scrollbar-gutter:[^;}]+|color-mix\(|light-dark\(|@scope|text-box[^;}]*|view-transition-class:[^;}]+)/g)),
  };
  console.log(JSON.stringify(report, null, 1));
}
