// Graba el morph tarjeta ↔ caso a cámara lenta en fotogramas seguidos.
// Uso: node morph-frames.mjs <cdp.mjs> <carpeta> <url-inicial> <selector-del-enlace> <light|dark> <ancho>x<alto> <prefijo> [scroll-al-enlace 0|1]
import { writeFileSync } from 'node:fs';
const [CDP, dir, url, link, scheme, size, prefix, scroll = '1'] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const [w, h] = size.split('x').map(Number);
const browser = await Browser.launch();
const p = await browser.newPage({ width: w, height: h, mobile: w < 600, dsf: 1 });
await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}` });
await p.goto(url, { settleMs: 1500 });
// Una hoja de estilos colgada de <html> (fuera de head y body) sobrevive al cambio de página
await p.eval(`(() => { const s = document.createElement('style'); s.textContent = '::view-transition-group(morph-visual),::view-transition-group(morph-title),::view-transition-old(morph-visual),::view-transition-new(morph-visual),::view-transition-old(morph-title),::view-transition-new(morph-title){animation-duration:1.4s!important}html.is-morph::view-transition-new(root){animation-duration:2.4s!important;animation-delay:0.5s!important}'; document.documentElement.append(s); })()`);
if (scroll === '1') { await p.eval(`document.querySelector(${JSON.stringify(link)}).scrollIntoView({ block: 'center', behavior: 'instant' })`); await sleep(900); }
await p.eval(`document.querySelector(${JSON.stringify(link)}).click()`);
const t0 = Date.now();
const frames = [];
while (Date.now() - t0 < 4700) {
  const at = Date.now() - t0;
  try { const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 72 }); frames.push([at, data]); } catch (e) {}
  await sleep(40);
}
frames.forEach(([at, data]) => writeFileSync(`${dir}/${prefix}-${String(at).padStart(5, '0')}.jpg`, Buffer.from(data, 'base64')));
console.log('fotogramas', frames.length);
console.log(JSON.stringify(await p.eval(() => ({ url: location.pathname, cls: document.documentElement.className, y: Math.round(scrollY), nombres: [...document.querySelectorAll('[data-morph-visual],[data-morph-title]')].filter((e) => e.style.viewTransitionName).length }))));
await browser.close(); process.exit(0);
