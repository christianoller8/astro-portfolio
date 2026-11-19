// Captura estados interactivos de eloicotonat.com en Chrome sin interfaz (CDP de la skill design-taste-frontend).
// Uso: node capture.mjs <carpeta-salida> <ruta a scripts/lib/cdp.mjs> [grupo,grupo...]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [OUT, CDP, only] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const groups = new Set((only || 'intro,home,qa,tabs,vt,dark,mobile,av,misc').split(','));
const B = 'https://www.eloicotonat.com';
mkdirSync(OUT, { recursive: true });
const notes = [];
const log = (...a) => { const s = a.join(' '); console.log(s); notes.push(s); };

// "Rechazar" ya elegido: el banner de cookies no tapa las capturas y no se carga medición
const REJECT = `try { localStorage.setItem('consent', JSON.stringify({ v: 1, a: 0, t: Date.now() })); } catch (e) {}`;
// Transiciones entre páginas 10 veces más lentas, para poder fotografiarlas
const SLOW_VT = `(() => { const css = '::view-transition-new(root),::view-transition-group(*),html.vt-in .vt-head,::view-transition-new(nav-line):only-child,::view-transition-old(nav-line):only-child{animation-duration:3.6s!important}';
  const add = () => { const s = document.createElement('style'); s.textContent = css; (document.head || document.documentElement).appendChild(s); };
  if (document.documentElement) add(); else new MutationObserver((m, o) => { if (document.documentElement) { add(); o.disconnect(); } }).observe(document, { childList: true }); })();`;

const browser = await Browser.launch();

async function page(opts = {}, init = [REJECT]) {
  const p = await browser.newPage(opts);
  if (opts.dark || opts.light) await p.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-color-scheme', value: opts.dark ? 'dark' : 'light' }] });
  for (const src of init) await p.send('Page.addScriptToEvaluateOnNewDocument', { source: src });
  return p;
}
const shot = (p, name, o = {}) => p.screenshot({ path: join(OUT, name + '.jpg'), quality: 80, ...o });
const centre = (p, sel, i = 0) => p.eval(([s, i]) => {
  const el = document.querySelectorAll(s)[i]; if (!el) return null;
  el.scrollIntoView({ block: 'center', behavior: 'instant' });
  const r = el.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}, [sel, i]);
async function mouse(p, type, x, y) {
  await p.send('Input.dispatchMouseEvent', { type, x, y, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: type === 'mouseMoved' ? 0 : 1 });
}
async function hover(p, sel, i = 0) { const c = await centre(p, sel, i); if (!c) throw new Error('no ' + sel); await mouse(p, 'mouseMoved', c.x, c.y); return c; }
async function click(p, sel, i = 0) { const c = await hover(p, sel, i); await mouse(p, 'mousePressed', c.x, c.y); await mouse(p, 'mouseReleased', c.x, c.y); }
async function key(p, k) { await p.send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code: k, windowsVirtualKeyCode: k === 'Escape' ? 27 : 0 }); await p.send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code: k, windowsVirtualKeyCode: k === 'Escape' ? 27 : 0 }); }
const clipOf = (p, sel, pad = 0) => p.eval(([s, pad]) => {
  const el = document.querySelector(s); if (!el) return null;
  const r = el.getBoundingClientRect();
  return { x: Math.max(0, r.left + scrollX - pad), y: Math.max(0, r.top + scrollY - pad), width: Math.min(r.width + pad * 2, innerWidth), height: Math.min(r.height + pad * 2, 3000) };
}, [sel, pad]);
async function section(p, sel, name, pad = 0) {
  await p.eval((s) => document.querySelector(s)?.scrollIntoView({ block: 'start', behavior: 'instant' }), sel);
  await sleep(700);
  const clip = await clipOf(p, sel, pad);
  if (!clip) throw new Error('no ' + sel);
  await shot(p, name, { clip, fullPage: false });
}
async function step(name, fn) { try { await fn(); log('ok  ', name); } catch (e) { log('FAIL', name, '-', e.message.split('\n')[0]); } }
// Ráfaga de capturas durante `ms` milisegundos; devuelve los tiempos reales de cada una
async function burst(p, prefix, ms, gap = 0) {
  const t0 = Date.now(); const times = []; let i = 0;
  while (Date.now() - t0 < ms) {
    const t = Date.now() - t0;
    try {
      await shot(p, `${prefix}-${String(i).padStart(2, '0')}-${String(t).padStart(4, '0')}ms`, { quality: 70 });
      times.push(t); i++;
    } catch { await sleep(30); continue; }
    if (gap) await sleep(gap);
  }
  return times;
}
// Espera un evento CDP de la página (o se rinde a los `ms`)
const waitEvent = (p, method, ms = 10000) => new Promise((resolve) => {
  const off = browser.on(p.sessionId, method, () => { off(); resolve(true); });
  setTimeout(() => { off(); resolve(false); }, ms);
});

if (groups.has('intro')) await step('intro (escritorio)', async () => {
  const p = await page();
  const dcl = waitEvent(p, 'Page.domContentEventFired');
  await p.send('Page.navigate', { url: B + '/' });
  await dcl;
  const times = await burst(p, 'intro', 3000);
  log('     intro frames at', times.join(','));
  await p.close();
});

if (groups.has('home') || groups.has('qa') || groups.has('tabs') || groups.has('vt')) {
  const p = await page({}, [REJECT, `try { sessionStorage.setItem('introDone', '1'); } catch (e) {}`]);
  await p.goto(B + '/', { settleMs: 2500 });

  if (groups.has('home')) {
    await step('hero', () => shot(p, 'home-hero'));
    for (const [tone, name] of [['tone-cobalt', 'qa'], ['tone-amber', 'video'], ['tone-teal', 'web'], ['tone-plum', 'ia']]) {
      await step('hero hover ' + name, async () => { await p.eval(() => scrollTo(0, 0)); await hover(p, `.hero-role.${tone}`); await sleep(700); await shot(p, 'home-hero-hover-' + name); });
    }
    await step('logo hover', async () => { await p.eval(() => scrollTo(0, 0)); await hover(p, '.tn-brand'); await sleep(800); await shot(p, 'home-logo-hover', { clip: { x: 0, y: 0, width: 520, height: 80 } }); });
    await step('btn hover', async () => { await p.eval(() => scrollTo(0, 0)); await hover(p, '.hero-actions .btn-primary'); await sleep(500); await shot(p, 'home-btn-hover', { clip: { x: 0, y: 300, width: 900, height: 260 } }); });
    await mouse(p, 'mouseMoved', 5, 890);
    for (const [sel, name] of [['#que-hago', 'home-sec-quehago'], ['#trabajo', 'home-sec-trabajo'], ['#como-empezamos', 'home-sec-como'], ['footer.site-footer', 'home-sec-footer']]) {
      await step(name, () => section(p, sel, name, 8));
    }
    await step('scroll progress', async () => { await p.eval(() => scrollTo(0, document.documentElement.scrollHeight * 0.45)); await sleep(900); await shot(p, 'home-mid-scroll'); });
  }

  if (groups.has('tabs')) {
    const n = await p.eval(() => document.querySelectorAll('[data-wid] [role="tab"]').length);
    for (let i = 0; i < n; i++) await step('servicios tab ' + i, async () => { await click(p, '[data-wid] [role="tab"]', i); await mouse(p, 'mouseMoved', 5, 890); await sleep(1600); await section(p, '#que-hago', 'home-tab-' + i, 8); });
  }

  if (groups.has('qa')) {
    await step('qa on', async () => { await p.eval(() => scrollTo(0, 0)); await sleep(300); await click(p, '.hc-note'); await sleep(1500); await shot(p, 'qa-01-on'); });
    for (let i = 0; i < 8; i++) await step('qa next ' + i, async () => { await click(p, '[data-qa-next]'); await sleep(1300); await shot(p, 'qa-02-next-' + i); });
    await step('qa off', async () => { await key(p, 'Escape'); await sleep(400); });
  }

  if (groups.has('vt')) {
    await p.close();
    const q = await page({}, [REJECT, `try { sessionStorage.setItem('introDone', '1'); } catch (e) {}`, SLOW_VT]);
    await q.goto(B + '/', { settleMs: 2000 });
    await step('vt adelante (inicio → trabajo)', async () => {
      await click(q, '.tn-link[href="/trabajo/"]');
      const t = await burst(q, 'vt-fwd', 4200, 120);
      log('     vt-fwd frames at', t.join(','));
    });
    await sleep(1500);
    await step('vt atrás (trabajo → inicio)', async () => {
      await q.eval(() => scrollTo(0, 0));
      await click(q, '.tn-brand');
      const t = await burst(q, 'vt-back', 4200, 120);
      log('     vt-back frames at', t.join(','));
    });
    await sleep(1500);
    await step('vt subpágina (inicio → contacto)', async () => {
      await click(q, '.tn-link[href="/contacto/"]');
      const t = await burst(q, 'vt-contact', 2600, 250);
      log('     vt-contact frames at', t.join(','));
    });
    await q.close();
  } else await p.close();
}

if (groups.has('dark')) await step('home oscuro (página entera)', async () => {
  const p = await page({ dark: true }, [REJECT, `try { sessionStorage.setItem('introDone', '1'); } catch (e) {}`]);
  await p.goto(B + '/', { settleMs: 2500 });
  await p.wheel(6000, { step: 300, pauseMs: 60 });
  await sleep(800);
  await p.eval(() => scrollTo(0, 0));
  await sleep(500);
  await shot(p, 'dark-home-full', { fullPage: true, quality: 70 });
  for (const path of ['trabajo', 'audiovisual', 'sobre-mi', 'contacto']) {
    await p.goto(`${B}/${path}/`, { settleMs: 1800 });
    await shot(p, 'dark-' + path + '-fold');
  }
  await p.close();
});

if (groups.has('light')) await step('tema claro', async () => {
  const p = await page({ light: true }, [REJECT, `try { sessionStorage.setItem('introDone', '1'); } catch (e) {}`]);
  await p.goto(B + '/', { settleMs: 2500 });
  await p.wheel(6000, { step: 300, pauseMs: 60 });
  await sleep(800);
  await p.eval(() => scrollTo(0, 0));
  await sleep(500);
  await shot(p, 'light-home-full', { fullPage: true, quality: 70 });
  await click(p, '.hc-note'); await sleep(1500); await shot(p, 'light-qa-on'); await key(p, 'Escape');
  for (const path of ['trabajo', 'audiovisual', 'sobre-mi', 'contacto', 'servicios']) {
    await p.goto(`${B}/${path}/`, { settleMs: 1800 });
    await shot(p, 'light-' + path + '-fold');
  }
  await p.close();
});

if (groups.has('mobile')) {
  const p = await page({ width: 390, height: 844, mobile: true, dsf: 2 });
  await step('móvil intro', async () => { const dcl = waitEvent(p, 'Page.domContentEventFired'); await p.send('Page.navigate', { url: B + '/' }); await dcl; const t = await burst(p, 'm-intro', 2900, 150); log('     m-intro at', t.join(',')); });
  await sleep(1500);
  await step('móvil hero', () => shot(p, 'm-hero'));
  await step('móvil menú', async () => { await click(p, '#navBurger'); await sleep(700); await shot(p, 'm-menu'); await click(p, '#navBurger'); await sleep(400); });
  await step('móvil cta fija', async () => { await p.eval(() => scrollTo(0, 1600)); await sleep(900); await shot(p, 'm-sticky-cta'); });
  await step('móvil qa', async () => { await p.eval(() => scrollTo(0, 0)); await sleep(400); await click(p, '.hc-note'); await sleep(1500); await shot(p, 'm-qa'); await key(p, 'Escape'); });
  await step('móvil página entera', async () => { await p.wheel(9000, { step: 400, pauseMs: 50 }); await p.eval(() => scrollTo(0, 0)); await sleep(500); await shot(p, 'm-home-full', { fullPage: true, quality: 65 }); });
  await p.close();
}

if (groups.has('av')) {
  const p = await page({}, [REJECT, `try { sessionStorage.setItem('introDone', '1'); } catch (e) {}`]);
  await p.goto(B + '/audiovisual/', { settleMs: 2500 });
  await step('av hero', () => shot(p, 'av-hero'));
  await step('av reel', () => section(p, '.avp-reel', 'av-reel', 0));
  await step('av filtro directo', async () => { await click(p, '[data-avfilter="directo"]'); await sleep(900); await section(p, '.avp-reel', 'av-filter-directo', 0); });
  await step('av hover vídeo', async () => { await click(p, '[data-avfilter="all"]'); await sleep(600); await hover(p, '.js-av-video', 0); await sleep(2500); const c = await clipOf(p, '.js-av-video', 40); await shot(p, 'av-hover-video', { clip: c }); });
  await step('av lightbox', async () => { await mouse(p, 'mouseMoved', 5, 5); await click(p, '[data-lb-reel]'); await sleep(2500); await shot(p, 'av-lightbox'); await key(p, 'Escape'); await sleep(500); });
  await step('av clientes', () => section(p, '.avp-clients', 'av-clients', 0));
  await p.close();
}

if (groups.has('misc')) {
  const p = await page({}, [REJECT, `try { sessionStorage.setItem('introDone', '1'); } catch (e) {}`]);
  for (const [path, name] of [['/sobre-mi/', 'about'], ['/contacto/', 'contact'], ['/servicios/', 'services'], ['/notas/esta-web-se-prueba-sola/', 'note'], ['/esta-no-existe/', '404'], ['/en/', 'en-home']]) {
    await step('fold ' + name, async () => { await p.goto(B + path, { settleMs: 2200 }); await shot(p, 'fold-' + name); });
  }
  await step('nota con progreso de lectura', async () => { await p.goto(B + '/notas/esta-web-se-prueba-sola/', { settleMs: 1500 }); await p.wheel(2400, { step: 300, pauseMs: 50 }); await sleep(800); await shot(p, 'note-reading'); });
  await p.close();
}

writeFileSync(join(OUT, 'capture-log.txt'), notes.join('\n'));
await browser.close();
process.exit(0);
