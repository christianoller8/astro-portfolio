// Hoja de contactos: junta varias capturas en una sola imagen con su nombre debajo.
// Uso: node sheet.mjs <cdp.mjs> <salida.jpg> <columnas> <ancho-celda> <img1> <img2> ...
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';

const [CDP, out, cols, cell, ...imgs] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const html = `<!doctype html><meta charset="utf-8"><style>
body{margin:0;background:#111;font:12px/1.2 ui-monospace,monospace;color:#ddd}
.g{display:grid;grid-template-columns:repeat(${cols},${cell}px);gap:6px;padding:6px}
figure{margin:0}img{width:100%;display:block}figcaption{padding:3px 2px}
</style><div class="g">${imgs.map((p, i) => `<figure><img src="/i/${i}"><figcaption>${basename(p).replace(/\.jpg$/, '')}</figcaption></figure>`).join('')}</div>`;
const server = createServer((req, res) => {
  const m = req.url.match(/^\/i\/(\d+)$/);
  if (m) { res.writeHead(200, { 'content-type': 'image/jpeg' }); return res.end(readFileSync(imgs[+m[1]])); }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const browser = await Browser.launch();
const width = cols * (+cell + 6) + 6;
const page = await browser.newPage({ width, height: 800 });
await page.goto(`http://127.0.0.1:${server.address().port}/`, { settleMs: 600 });
await page.screenshot({ path: out, fullPage: true, quality: 70 });
await browser.close();
server.close();
process.exit(0);
