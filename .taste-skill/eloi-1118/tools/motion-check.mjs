// Comprueba los tokens de movimiento en /sistema y la transición entre páginas.
const [CDP, B, OUT] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
const p = await browser.newPage({ width: 1440, height: 900 });
await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { sessionStorage.setItem('intro-done', '1'); localStorage.removeItem('lens'); } catch (e) {}` });
await p.goto(B + '/sistema/', { settleMs: 1200 });
console.log(JSON.stringify(await p.eval(() => {
  const cs = getComputedStyle(document.documentElement);
  const runners = [...document.querySelectorAll('.runner')].map((r) => { const c = getComputedStyle(r); return c.transitionDuration + ' ' + c.transitionTimingFunction.slice(0, 60); });
  return { tokens: ['--ease-out', '--ease-camera', '--ease-in', '--spring', '--dur-micro', '--dur-ui', '--dur-ink', '--dur-camera', '--stagger', '--dist'].map((t) => t + ': ' + cs.getPropertyValue(t).trim()), runners };
}), null, 1));
const c = await p.eval(() => { const el = document.querySelector('#sys-motion'); el.scrollIntoView({ block: 'start', behavior: 'instant' }); const b = document.querySelector('[data-motion-toggle]').getBoundingClientRect(); return { x: b.left + b.width / 2, y: b.top + b.height / 2 }; });
await sleep(500);
for (const type of ['mousePressed', 'mouseReleased']) await p.send('Input.dispatchMouseEvent', { type, x: c.x, y: c.y, button: 'left', clickCount: 1 });
await sleep(300);
await p.screenshot({ path: OUT + '/e1-mov-curvas-300ms.jpg', quality: 82 });
await sleep(900);
await p.screenshot({ path: OUT + '/e1-mov-curvas-fin.jpg', quality: 82 });
// Transición entre páginas: duración y curva reales
await p.goto(B + '/', { settleMs: 1200 });
const link = await p.eval(() => { const a = document.querySelector('header a[href="/projects"], header a[href="/projects/"]'); const r = a.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; });
for (const type of ['mousePressed', 'mouseReleased']) await p.send('Input.dispatchMouseEvent', { type, x: link.x, y: link.y, button: 'left', clickCount: 1 });
let anims = [];
for (let i = 0; i < 20 && !anims.length; i++) { await sleep(40); anims = await p.eval(() => document.getAnimations().filter((a) => a.effect?.pseudoElement?.includes('view-transition')).map((a) => `${a.effect.pseudoElement} ${a.animationName} ${a.effect.getTiming().duration}ms ${a.effect.getTiming().easing}`)); }
console.log('VT:', anims.join(' | ') || 'no capturada');
await sleep(400);
await p.screenshot({ path: OUT + '/e1-mov-transicion.jpg', quality: 82 });
await browser.close(); process.exit(0);
