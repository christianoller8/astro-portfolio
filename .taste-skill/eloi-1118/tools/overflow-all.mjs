// Desbordes: cada página, en los dos idiomas, a varios anchos. Señala scroll horizontal y textos
// que se salen de su caja. Uso: node overflow-all.mjs <cdp.mjs> <origen>
const [CDP, origin] = process.argv.slice(2);
const { Browser } = await import(CDP);
const browser = await Browser.launch();
const PAGES = ['/', '/projects/', '/projects/tempora/', '/projects/vibora/', '/projects/learnish/', '/projects/vistalo/', '/about/', '/contact/', '/no-existe'];
let bad = 0;
for (const lang of ['', '/en']) for (const path of PAGES) for (const w of [320, 390, 768, 1024, 1440, 1920]) {
  const p = await browser.newPage({ width: w, height: 900, mobile: w < 600 });
  await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('projects-mode'); } catch (e) {}` });
  await p.goto(origin + lang + path, { settleMs: 900 });
  const r = await p.eval(() => {
    const out = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) out.push(`scroll horizontal ${document.documentElement.scrollWidth}`);
    for (const el of document.querySelectorAll('main h1, main h2, main h3, main .btn, main p, main a, main li, main dd, main dt')) {
      if (el.closest('[hidden], [inert], .cmap, pre, .lens-bar-stats') || !el.getClientRects().length) continue;
      const b = el.getBoundingClientRect();
      if (b.width && (b.right > innerWidth + 2 || b.left < -2) && getComputedStyle(el).position !== 'fixed') out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} "${el.textContent.trim().slice(0, 24)}" →${Math.round(b.right)}`);
    }
    return out.slice(0, 4);
  });
  if (r.length) { bad++; console.log(`${lang || '/es'}${path} @${w}:`, r.join(' ; ')); }
  await p.close?.();
}
console.log('páginas con desbordes:', bad, 'de', PAGES.length * 12);
await browser.close(); process.exit(0);
