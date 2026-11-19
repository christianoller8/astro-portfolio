// Segunda tanda de microinteracciones, con pantalla completa (las piezas de la barra no se pueden recortar).
import { writeFileSync } from 'node:fs';
const [CDP, dir, origin, scheme] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const open = async (path, w = 1440, h = 900) => { const p = await browser.newPage({ width: w, height: h, dsf: 1 }); await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: scheme }] }); await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('theme'); } catch (e) {}` }); await p.goto(origin + path, { settleMs: 2400 }); return p; };
const shot = async (p, name, clip) => { const { data } = await p.send('Page.captureScreenshot', { format: 'jpeg', quality: 84, ...(clip ? { clip: { ...clip, scale: 2 } } : {}) }); writeFileSync(`${dir}/${name}.jpg`, Buffer.from(data, 'base64')); };
const move = async (p, x, y) => { await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: x - 2, y }); await p.send('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y }); };
const center = (p, sel) => p.eval((s) => { const r = document.querySelector(s).getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }, sel);
const BAR = { x: 760, y: 0, width: 680, height: 56 };
const NAV = { x: 300, y: 0, width: 380, height: 56 };
let p = await open('/');
await p.send('Animation.enable'); await p.send('Animation.setPlaybackRate', { playbackRate: 0.12 });
await p.eval(() => document.querySelector('header [data-lens-set="design"]').click()); await sleep(2600); await shot(p, 'b06-lente-diseno', BAR);
await p.eval(() => document.querySelector('header [data-lens-set="qa"]').click()); await sleep(650); await shot(p, 'b06-lente-deslizando', BAR); await sleep(2600); await shot(p, 'b06-lente-qa', BAR);
await p.send('Animation.setPlaybackRate', { playbackRate: 1 }); await p.eval(() => document.querySelector('[data-lens-clear]').click());
let c = await center(p, '.hero-copy .btn-quiet'); await move(p, c.x, c.y); await sleep(130); await shot(p, 'b03-secundario-cv', { x: c.x - 220, y: c.y - 50, width: 440, height: 100 });
await p.eval(() => document.querySelector('.stack-item').scrollIntoView({ block: 'start' })); await p.eval(() => window.scrollBy(0, -80)); await sleep(500);
c = await center(p, '.stack-item [data-sel]'); await move(p, c.x, c.y - 40); await sleep(450); await shot(p, 'b04-tarjeta');
p = await open('/');
await p.send('Animation.enable'); await p.send('Animation.setPlaybackRate', { playbackRate: 0.1 });
await p.eval(() => [...document.querySelectorAll('.toolbar-nav a')].find((a) => /contact/.test(a.href)).click());
for (const t of [1200, 1500, 1500]) { await sleep(t); await shot(p, `b05-menu-${t === 1200 ? 'a' : Math.random().toString(36).slice(2, 5)}`, NAV); }
await p.send('Animation.setPlaybackRate', { playbackRate: 1 }); await sleep(3000); await shot(p, 'b05-menu-z-fin', NAV);
console.log(await p.eval(() => ({ path: location.pathname, ind: !!document.querySelector('.nav-ind'), dónde: document.querySelector('.nav-ind')?.parentElement.textContent.trim() })));
// Menú de móvil: el control de lentes al abrirse
p = await open('/', 390, 844);
await p.eval(() => document.querySelector('#mobile-menu [data-lens-set="code"]').click()); await p.eval(() => document.getElementById('menu-btn').click()); await sleep(700); await shot(p, 'b06-menu-movil');
console.log(await p.eval(() => { const g = document.querySelector('#mobile-menu [data-seg]'); return { seg: g.className, on: g.style.getPropertyValue('--seg-on'), w: g.style.getPropertyValue('--seg-w') }; }));
await browser.close(); process.exit(0);
