// Graba la entrada de una web en fotogramas seguidos y vuelca qué técnicas de animación usa.
// Uso: node entry-frames.mjs <cdp.mjs> <carpeta> <url> <ancho>x<alto> <prefijo> [duración ms]
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, size, prefix, total = '6000'] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: 1 });
const nav = p.send('Page.navigate', { url });
const t0 = Date.now();
await nav;
const frames = [];
while (Date.now() - t0 < +total) {
  const at = Date.now() - t0;
  try { const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 60 }); frames.push([at, data]); } catch (e) {}
  await sleep(30);
}
frames.forEach(([at, data]) => writeFileSync(`${dir}/${prefix}-${String(at).padStart(5, '0')}.jpg`, Buffer.from(data, 'base64')));
console.log('fotogramas', frames.length, frames.map((f) => f[0]).join(' '));
const info = await p.eval(() => {
  const tags = (sel) => document.querySelectorAll(sel).length;
  const scripts = [...document.scripts].map((s) => s.src).filter(Boolean).map((s) => s.split('/').slice(-1)[0].slice(0, 60));
  const res = performance.getEntriesByType('resource').map((r) => r.name).filter((n) => /\.(json|riv|lottie|mp4|webm|gif|webp|png|svg|glb|gltf|ktx2|bin)(\?|$)/i.test(n)).map((n) => n.split('/').slice(-2).join('/').slice(0, 80));
  const gens = [...document.querySelectorAll('meta[name=generator]')].map((m) => m.content);
  return { title: document.title, gens, canvas: tags('canvas'), video: tags('video'), svg: tags('svg'), lottie: tags('lottie-player, dotlottie-player, [class*=lottie]'), scripts: scripts.slice(0, 30), recursos: res.slice(0, 60), libs: { gsap: !!window.gsap, THREE: !!window.THREE, lottie: !!window.lottie || !!window.bodymovin, rive: !!window.rive, barba: !!window.barba, lenis: !!window.Lenis || !!window.lenis, swup: !!window.swup }, next: !!window.__NEXT_DATA__ || !!window.next, nuxt: !!window.__NUXT__ };
});
console.log(JSON.stringify(info, null, 1));
await browser.close(); process.exit(0);
