// Extrae fotogramas de un vídeo local con Chrome sin interfaz (no hace falta ffmpeg).
// Uso: node video-frames.mjs <cdp.mjs> <video> <carpeta> <prefijo> <t0> <t1> <paso> [ancho]
import { createServer } from 'node:http';
import { statSync, createReadStream, mkdirSync, writeFileSync } from 'node:fs';
const [CDP, file, OUT, PRE, t0, t1, step, w = '430', crop = '0,0,1,1'] = process.argv.slice(2);
const CROP = crop.split(',').map(Number); // x, y, ancho y alto como fracción del fotograma
const { Browser, sleep } = await import(CDP);
mkdirSync(OUT, { recursive: true });
const size = statSync(file).size;
const server = createServer((req, res) => {
  if (req.url.startsWith('/v')) {
    const m = /bytes=(\d+)-(\d*)/.exec(req.headers.range || '');
    const start = m ? +m[1] : 0; const end = m && m[2] ? +m[2] : size - 1;
    res.writeHead(m ? 206 : 200, { 'content-type': 'video/mp4', 'accept-ranges': 'bytes', 'content-length': end - start + 1, ...(m ? { 'content-range': `bytes ${start}-${end}/${size}` } : {}) });
    return createReadStream(file, { start, end }).pipe(res);
  }
  res.writeHead(200, { 'content-type': 'text/html' });
  res.end('<!doctype html><video id="v" src="/v" muted playsinline preload="auto"></video><canvas id="c"></canvas>');
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const browser = await Browser.launch();
const p = await browser.newPage({ width: 900, height: 900 });
await p.goto(`http://127.0.0.1:${server.address().port}/`, { settleMs: 800 });
const meta = await p.eval(() => new Promise((res) => { const v = document.getElementById('v'); const done = () => res({ d: v.duration, w: v.videoWidth, h: v.videoHeight, err: v.error && v.error.message }); if (v.readyState >= 1) done(); else { v.onloadedmetadata = done; v.onerror = done; setTimeout(done, 8000); } }));
console.log('meta', JSON.stringify(meta));
if (!meta.w) { await browser.close(); server.close(); process.exit(2); }
const grab = (t, w, k) => new Promise((res) => {
  const v = document.getElementById('v'); const c = document.getElementById('c');
  const sw = k[2] * v.videoWidth, sh = k[3] * v.videoHeight;
  c.width = w; c.height = Math.round(w * sh / sw);
  const draw = () => { c.getContext('2d').drawImage(v, k[0] * v.videoWidth, k[1] * v.videoHeight, sw, sh, 0, 0, c.width, c.height); res(c.toDataURL('image/jpeg', 0.85)); };
  v.onseeked = () => (v.requestVideoFrameCallback ? v.requestVideoFrameCallback(draw) : setTimeout(draw, 60));
  v.currentTime = t; setTimeout(draw, 3000);
});
let n = 0;
for (let t = +t0; t <= +t1 + 1e-6; t += +step) {
  const url = await p.eval(`(${grab.toString()})(${t.toFixed(3)}, ${+w}, ${JSON.stringify(CROP)})`);
  writeFileSync(`${OUT}/${PRE}-${t.toFixed(2).padStart(5, '0')}s.jpg`, Buffer.from(url.split(',')[1], 'base64'));
  n++;
}
console.log('frames', n);
await browser.close(); server.close(); process.exit(0);
