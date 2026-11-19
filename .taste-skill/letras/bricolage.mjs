// La caricatura junto a la letra de la web (Bricolage Grotesque), en cuatro composiciones.
// Uso: node bricolage.mjs <cdp.mjs> <cabeza.jpg> <fuente.woff2> <salida.jpg>
import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
const [CDP, head, font, out] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const big = "font:650 124px/0.9 'Bricolage';letter-spacing:-.045em";
const C = `<div class="w" style="font:400 56px/1 'Bricolage';letter-spacing:-.02em">made by</div><div class="w" style="${big};font-size:168px;margin-top:4px">chris</div>`;
const options = [
  ['1', 'Como estaba (30 px)', C, 30],
  ['2', 'Más margen (64 px)', C, 64],
  ['3', 'Aún más margen (96 px)', C, 96],
  ['4', 'La 2, en oscuro', C, 64],
];
const html = `<!doctype html><meta charset="utf-8"><style>
  @font-face{font-family:'Bricolage';src:url(/font.woff2) format('woff2');font-weight:200 800;font-stretch:75% 100%}
  body{margin:0;background:#fff;color:#1a1a1a;font-family:'Bricolage',sans-serif}
  .grid{display:grid;grid-template-columns:repeat(2,860px)}
  .cell{position:relative;height:380px;display:flex;align-items:center;gap:30px;padding:34px 30px 0 34px;box-sizing:border-box;border-right:1px solid #e3e3e3;border-bottom:1px solid #e3e3e3;overflow:hidden}
  .tag{position:absolute;left:20px;top:14px;font:400 18px 'Bricolage',sans-serif;color:#555}
  .tag b{color:#111;font-weight:700;margin-right:8px}
  .cell img{height:260px;flex:none;mix-blend-mode:multiply}
  .w{white-space:nowrap}
  .dark{background:#171717;color:#f5f5f5}.dark .tag,.dark .tag b{color:#bbb}.dark img{filter:invert(1);mix-blend-mode:screen}
</style><div class="grid">${options.map(([k, name, m, gap]) => `<div class="cell${k === '4' ? ' dark' : ''}" style="gap:${gap}px"><div class="tag"><b>${k}</b>${name}</div><img src="/head.jpg" alt=""><div>${m}</div></div>`).join('')}</div>`;
const server = createServer((req, res) => {
  if (req.url === '/head.jpg') { res.writeHead(200, { 'content-type': 'image/jpeg' }); return res.end(readFileSync(head)); }
  if (req.url === '/font.woff2') { res.writeHead(200, { 'content-type': 'font/woff2' }); return res.end(readFileSync(font)); }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const browser = await Browser.launch();
const page = await browser.newPage({ width: 1720, height: 760 });
await page.goto(`http://127.0.0.1:${server.address().port}/`, { settleMs: 1200 });
await page.eval(() => document.fonts.ready.then(() => 1));
await sleep(400);
await page.screenshot({ path: out, quality: 88 });
await browser.close(); server.close(); process.exit(0);
