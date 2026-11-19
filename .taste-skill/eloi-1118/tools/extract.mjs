// Extrae CSS inline, scripts, <head> y esqueleto del <body> de un HTML descargado (solo lectura, no ejecuta nada).
// Uso: node extract.mjs <archivo.html> <carpeta-salida>
import fs from 'node:fs';
import path from 'node:path';

const [file, out] = process.argv.slice(2);
const html = fs.readFileSync(file, 'utf8');
fs.mkdirSync(path.join(out, 'scripts'), { recursive: true });

const styles = [...html.matchAll(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi)];
fs.writeFileSync(path.join(out, 'inline.css'), styles.map((m, i) => `/* ---- style #${i} ${m[1].trim()} ---- */\n${m[2]}`).join('\n\n'));

const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)];
const summary = [];
scripts.forEach((m, i) => {
  const attrs = m[1].trim();
  const body = m[2];
  const name = String(i).padStart(2, '0') + (attrs.includes('ld+json') ? '.json' : attrs.includes('speculationrules') ? '.spec.json' : '.js');
  if (body.trim()) fs.writeFileSync(path.join(out, 'scripts', name), body);
  summary.push(`${name}\t${attrs || '(sin atributos)'}\t${body.length} B\t${body.trim().slice(0, 90).replace(/\s+/g, ' ')}`);
});
fs.writeFileSync(path.join(out, 'scripts.tsv'), summary.join('\n'));

const head = (html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i) || [, ''])[1];
const headTags = [...head.matchAll(/<(meta|link|title|base)\b[^>]*>(?:[^<]*<\/title>)?/gi)].map((m) => m[0]);
fs.writeFileSync(path.join(out, 'head.txt'), headTags.join('\n'));

// Esqueleto del body: etiquetas estructurales con id/clase y encabezados con su texto
const body = (html.match(/<body\b[^>]*>([\s\S]*)<\/body>/i) || [, ''])[1]
  .replace(/<script\b[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[\s\S]*?<\/style>/gi, '')
  .replace(/<svg\b[\s\S]*?<\/svg>/gi, '<svg/>');
const lines = [];
let depth = 0;
const re = /<(\/?)(header|nav|main|section|article|aside|footer|h[1-6]|dialog|form|figure|ul|ol|details)\b([^>]*)>/gi;
let m;
while ((m = re.exec(body))) {
  const [, close, tag, attrs] = m;
  if (close) { depth = Math.max(0, depth - 1); continue; }
  const id = (attrs.match(/\bid="([^"]*)"/) || [, ''])[1];
  const cls = (attrs.match(/\bclass="([^"]*)"/) || [, ''])[1].replace(/\bastro-[a-z0-9]+\b/g, '').trim();
  const data = [...attrs.matchAll(/\b(data-[a-z-]+)(?:="([^"]*)")?/g)].map((d) => d[1] + (d[2] ? `=${d[2]}` : '')).join(' ');
  let text = '';
  if (/^h[1-6]$/i.test(tag)) {
    const end = body.indexOf(`</${tag}`, re.lastIndex);
    text = ' → "' + body.slice(re.lastIndex, end).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() + '"';
  }
  lines.push(`${'  '.repeat(depth)}<${tag}${id ? '#' + id : ''}${cls ? '.' + cls.replace(/\s+/g, '.') : ''}${data ? ' [' + data + ']' : ''}>${text}`);
  if (!/^h[1-6]$/i.test(tag)) depth++;
}
fs.writeFileSync(path.join(out, 'skeleton.txt'), lines.join('\n'));

const css = styles.map((s) => s[2]).join('\n');
const count = (r) => (css.match(r) || []).length;
console.log(JSON.stringify({
  file: path.basename(file),
  htmlBytes: html.length,
  styleBlocks: styles.length,
  inlineCssBytes: css.length,
  scripts: scripts.length,
  keyframes: [...new Set([...css.matchAll(/@keyframes\s+([\w-]+)/g)].map((k) => k[1]))].length,
  reducedMotionQueries: count(/prefers-reduced-motion/g),
  viewTransitionRules: count(/view-transition/g),
  externalCss: [...html.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/gi)].map((l) => (l[0].match(/href="([^"]+)"/) || [])[1]),
  externalJs: [...html.matchAll(/<script[^>]+src="([^"]+)"/gi)].map((s) => s[1]),
}, null, 1));
