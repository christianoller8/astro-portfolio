// Compone el SVG de la caricatura a partir del JSON del trazado y lo compara con el JPEG original.
// Uso: node compose.mjs <cdp.mjs> <trazado.json> <cabeza.jpg> <salida.svg> <comparacion.jpg>
import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
const [CDP, jsonPath, head, outSvg, outJpg] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const t = JSON.parse(readFileSync(jsonPath, 'utf8'));
const svg = (colors) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${t.width} ${t.height}">
${t.paper.map((p) => `<path fill="${colors.paper}" fill-rule="evenodd" d="${p.d}"/>`).join('\n')}
${t.grey.map((p) => `<path fill="${colors.grey}" fill-rule="evenodd" d="${p.d}"/>`).join('\n')}
${t.ink.map((p) => `<path fill="${colors.ink}" fill-rule="evenodd" d="${p.d}"/>`).join('\n')}
</svg>`;
const light = svg({ paper: '#ffffff', grey: '#bdbdbd', ink: '#1a1a1a' });
writeFileSync(outSvg, light);
const dark = svg({ paper: '#171717', grey: '#5c5c60', ink: '#f5f5f5' });
const numbered = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${t.width} ${t.height}">${t.ink.map((p, i) => `<path fill="hsl(${(i * 67) % 360} 70% 45%)" fill-rule="evenodd" d="${p.d}"/>`).join('')}${t.ink.map((p, i) => `<text x="${p.c[0]}" y="${p.c[1]}" font-size="34" font-family="monospace" font-weight="700" fill="#000" stroke="#fff" stroke-width="6" paint-order="stroke">${i}</text>`).join('')}</svg>`;
const html = `<!doctype html><meta charset="utf-8"><style>body{margin:0;display:grid;grid-template-columns:repeat(4,430px);font:16px monospace}figure{margin:0;padding:14px}figure>*:first-child{display:block;width:400px;height:auto}.c{background:#e5e5e5}.d{background:#2c2c2e;color:#eee}figcaption{padding-top:6px}</style>
<figure><img src="/head.jpg"><figcaption>original (JPEG)</figcaption></figure>
<figure class="c">${light}<figcaption>SVG, claro (${Math.round(light.length / 1024)} KB)</figcaption></figure>
<figure class="d">${dark}<figcaption>SVG, oscuro</figcaption></figure>
<figure>${numbered}<figcaption>piezas de tinta: ${t.ink.length}</figcaption></figure>`;
const server = createServer((req, res) => {
  if (req.url === '/head.jpg') { res.writeHead(200, { 'content-type': 'image/jpeg' }); return res.end(readFileSync(head)); }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const browser = await Browser.launch();
const page = await browser.newPage({ width: 1720, height: 620 });
await page.goto(`http://127.0.0.1:${server.address().port}/`, { settleMs: 800 });
await page.screenshot({ path: outJpg, quality: 88 });
console.log('svg', Math.round(light.length / 1024) + ' KB');
await browser.close(); server.close(); process.exit(0);
