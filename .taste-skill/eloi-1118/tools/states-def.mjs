// Capturas de estados de la home de prototipo-def: hero, escena en boceto, lente Diseño e intro.
// Uso: node states-def.mjs <cdp.mjs> <base-url> <carpeta> <prefijo> [light|dark]
import { mkdirSync } from 'node:fs';
const [CDP, B, OUT, PRE, scheme = 'light'] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
mkdirSync(OUT, { recursive: true });
const browser = await Browser.launch();
const mk = async (intro) => {
  const p = await browser.newPage({ width: 1440, height: 900 });
  await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] });
  // El head script salta la intro con navigator.webdriver: se oculta para poder verla
  if (intro) await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false });` });
  else await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { sessionStorage.setItem('intro-done', '1'); } catch (e) {}` });
  return p;
};
const shot = (p, n) => p.screenshot({ path: `${OUT}/${PRE}-${n}.jpg`, quality: 82 });

let p = await mk(false);
await p.goto(B + '/', { settleMs: 1500 });
await shot(p, '1-hero');
await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 180, y: 640 });
await sleep(500); await shot(p, '2-hero-hover-boton');
const top = await p.eval(() => { const el = document.querySelector('.process, [data-process], .process-track'); return el ? Math.round(el.getBoundingClientRect().top + scrollY) : -1; });
if (top >= 0) { await p.eval((y) => scrollTo({ top: y + 260, behavior: 'instant' }), top); await sleep(1200); await shot(p, '3-escena-boceto'); }
await p.eval(() => scrollTo({ top: 0, behavior: 'instant' }));
await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: '1', code: 'Digit1', text: '1' });
await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: '1', code: 'Digit1' });
await sleep(1200); await shot(p, '4-lente-diseno');
await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: '3', code: 'Digit3', text: '3' });
await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: '3', code: 'Digit3' });
await sleep(1500); await shot(p, '6-lente-qa');
await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 });
await sleep(300);
await p.close();

p = await mk(true);
const dcl = new Promise((r) => { const off = browser.on(p.sessionId, 'Page.domContentEventFired', () => { off(); r(); }); setTimeout(r, 8000); });
await p.send('Page.navigate', { url: B + '/' });
await dcl; await sleep(650);
await shot(p, '5-intro-boceto');
await p.close();
console.log('ok', PRE, 'processTop', top);
await browser.close(); process.exit(0);
