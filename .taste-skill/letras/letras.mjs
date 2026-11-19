// Monta la caricatura junto a 10 parejas de letras (equivalentes libres de las de Adobe Fonts) y las captura.
// Uso: node letras.mjs <cdp.mjs> <cabeza.jpg> <salida-sin-extensión>
import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
const [CDP, head, out] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);

const fonts = 'family=Playfair+Display:ital,wght@1,900&family=Luxurious+Script&family=Jost:wght@300;700&family=Pinyon+Script&family=Arimo:wght@400;700&family=Great+Vibes&family=Lobster&family=Fraunces:opsz,wght@9..144,900&family=Yellowtail&family=Abril+Fatface&family=Nunito:wght@800&family=Bebas+Neue&family=Lobster+Two:ital,wght@1,700&family=Shrikhand&family=Varela+Round&family=Cormorant:wght@600&family=Bodoni+Moda:wght@500&family=Pacifico&display=block';

// Cada opción: nombre original (Adobe Fonts), equivalente libre usado y el HTML de la letra
const options = [
  ['Essonnes & Parlare', 'Playfair Display + Luxurious Script', `<div class="w" style="font:italic 900 132px 'Playfair Display';letter-spacing:-.01em;line-height:.9">CHRIS</div><div class="w" style="font:92px 'Luxurious Script';margin:-34px 0 0 70px;line-height:1">made by</div>`],
  ['Futura & Sloop', 'Jost + Pinyon Script', `<div class="w" style="font:700 132px 'Jost';letter-spacing:.02em;line-height:.9">CHRIS</div><div class="w" style="font:84px 'Pinyon Script';margin:-40px 0 0 60px;line-height:1">made by</div>`],
  ['Bickham Script & Helvetica', 'Great Vibes + Arimo', `<div class="w" style="font:700 60px 'Arimo';letter-spacing:.06em;line-height:1"><span style="font:400 104px 'Great Vibes';letter-spacing:0;margin-right:-6px">M</span>ADE BY</div><div class="w" style="font:700 112px 'Arimo';letter-spacing:.04em;line-height:.95;margin-top:-18px"><span style="font:400 170px 'Great Vibes';letter-spacing:0;margin-right:-10px">C</span>HRIS</div>`],
  ['Filmotype Keynote & Helvetica', 'Lobster + Arimo', `<div class="w" style="font:150px 'Lobster';line-height:1;transform:rotate(-6deg);transform-origin:left bottom">Chris.</div><div class="w" style="font:400 34px 'Arimo';letter-spacing:.34em;margin:18px 0 0 40px">- MADE BY -</div>`],
  ['Espiritu Regular & Espiritu Script', 'Fraunces + Yellowtail', `<div class="w" style="font:900 140px 'Fraunces';letter-spacing:-.02em;line-height:.95">Chris</div><div class="w" style="font:54px 'Yellowtail';margin:2px 0 0 96px;line-height:1">made by</div>`],
  ['Fields & Proxima Soft', 'Abril Fatface + Nunito', `<div class="w" style="font:148px 'Abril Fatface';line-height:.95">Chris</div><div class="w" style="font:800 40px 'Nunito';margin:6px 0 0 6px;line-height:1">made by</div>`],
  ['Bebas Neue & Gelato Luxe', 'Bebas Neue + Lobster Two', `<div style="position:relative;display:inline-block"><div class="w" style="font:190px 'Bebas Neue';letter-spacing:.02em;line-height:.9;color:transparent;-webkit-text-stroke:2px #111">CHRIS</div><div class="w" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-46%) rotate(-6deg);font:italic 700 84px 'Lobster Two';white-space:nowrap;line-height:1">made by</div></div>`],
  ['Bookmania Bold Italic & Domus', 'Shrikhand + Varela Round', `<div class="w" style="font:150px 'Shrikhand';line-height:1">Chris</div><div class="w" style="font:32px 'Varela Round';letter-spacing:.3em;margin:6px 0 0 44px">MADE BY</div>`],
  ['Norman & Ebony Light', 'Cormorant + Jost', `<div class="w" style="font:600 168px 'Cormorant';letter-spacing:-.03em;line-height:.85">CHRIS</div><div class="w" style="font:300 32px 'Jost';letter-spacing:.3em;margin:14px 0 0 30px">MADE BY</div>`],
  ['Bodoni Std & Angela Heart', 'Bodoni Moda + Pacifico', `<div class="w" style="font:500 150px 'Bodoni Moda';letter-spacing:-.01em;line-height:.9">CHRIS</div><div class="w" style="font:70px 'Pacifico';margin:-46px 0 0 120px;line-height:1;transform:rotate(-4deg)">made by</div>`],
];

const html = `<!doctype html><meta charset="utf-8"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fonts}">
<style>
  body{margin:0;background:#fff;color:#111;font-family:Arimo,sans-serif}
  .grid{display:grid;grid-template-columns:repeat(2,760px)}
  .cell{position:relative;height:360px;display:flex;align-items:center;gap:26px;padding:34px 30px 0 34px;box-sizing:border-box;border-right:1px solid #e3e3e3;border-bottom:1px solid #e3e3e3;overflow:hidden}
  .tag{position:absolute;left:20px;top:14px;font:400 17px Arimo,sans-serif;color:#555}
  .tag b{color:#111;font-weight:700;margin-right:8px}
  .tag i{font-style:normal;color:#8a8a8a}
  .cell img{height:250px;flex:none;mix-blend-mode:multiply}
  .w{white-space:nowrap}
</style>
<div class="grid">${options.map(([name, sub, markup], i) => `<div class="cell"><div class="tag"><b>${i + 1}</b>${name} <i>· aquí: ${sub}</i></div><img src="/head.jpg" alt=""><div>${markup}</div></div>`).join('')}</div>`;

const server = createServer((req, res) => {
  if (req.url === '/head.jpg') { res.writeHead(200, { 'content-type': 'image/jpeg' }); return res.end(readFileSync(head)); }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }); res.end(html);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const browser = await Browser.launch();
const page = await browser.newPage({ width: 1520, height: 900, dsf: 1 });
await page.goto(`http://127.0.0.1:${server.address().port}/`, { settleMs: 1500 });
const loaded = await page.eval(() => document.fonts.ready.then(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family).filter((v, i, a) => a.indexOf(v) === i)));
console.log('fuentes cargadas:', loaded.length, loaded.join(', '));
await sleep(500);
const shot = async (name, y, h) => { const { data } = await page.send('Page.captureScreenshot', { format: 'jpeg', quality: 88, captureBeyondViewport: true, clip: { x: 0, y, width: 1520, height: h, scale: 1 } }); (await import('node:fs')).writeFileSync(name, Buffer.from(data, 'base64')); };
await shot(`${out}-1-4.jpg`, 0, 720);
await shot(`${out}-5-8.jpg`, 720, 720);
await shot(`${out}-9-10.jpg`, 1440, 360);
await browser.close(); server.close(); process.exit(0);
