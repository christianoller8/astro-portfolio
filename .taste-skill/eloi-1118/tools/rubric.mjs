// Rúbrica "de 10": lo que se puede medir.
// - Prueba 3 (5 segundos): cuándo se ve, tras cargar el inicio con su intro, quién es, qué hace, y los
//   accesos a proyectos y CV.
// - Prueba 6 (densidad): tamaños de letra distintos en cada pantalla (sin contar fragmentos de
//   interfaz, código ni valores medidos), y si queda alguna numeración decorativa.
// Uso: node rubric.mjs <cdp.mjs> <origen>
const [CDP, origin] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();

// --- Prueba 3 ---
{
  const p = await browser.newPage({ width: 1440, height: 900 });
  await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__t0 = performance.now(); try { localStorage.removeItem('lens'); } catch (e) {}` });
  p.goto(origin + '/', { settleMs: 0 }).catch(() => {});
  let seen = null;
  for (let i = 0; i < 80 && !seen; i++) {
    await sleep(100);
    seen = await p.eval(() => {
      const vis = (sel) => { const el = document.querySelector(sel); if (!el) return false; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); const intro = document.querySelector('.intro-screen'); const covered = intro && getComputedStyle(intro).display !== 'none' && document.documentElement.classList.contains('intro'); return !covered && r.top < innerHeight && r.bottom > 0 && +cs.opacity > 0.9; };
      const all = vis('.hero-name') && vis('.hero-role') && vis('.hero-copy .btn-primary') && vis('.hero-copy .btn-quiet');
      return all ? Math.round(performance.now() - window.__t0) : null;
    }).catch(() => null);
  }
  console.log('PRUEBA 3 · nombre, oficio, "Ver proyectos" y "Descargar CV" a la vista a los', seen, 'ms (con la intro)');
}

// --- Prueba 6 ---
const PAGES = ['/', '/projects/', '/projects/tempora/', '/projects/vistalo/', '/about/', '/contact/'];
for (const path of PAGES) {
  const p = await browser.newPage({ width: 1440, height: 900 });
  await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); localStorage.removeItem('projects-mode'); } catch (e) {}` });
  await p.goto(origin + path, { settleMs: 2200 });
  const r = await p.eval(async () => {
    const screens = [];
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y < total - 200; y += innerHeight - 56) {
      scrollTo(0, y); await new Promise((r) => setTimeout(r, 120));
      const sizes = new Map();
      const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
      for (let n = walker.nextNode(); n; n = walker.nextNode()) {
        const el = n.parentElement;
        if (!n.textContent.trim() || el.closest('[data-ui], [inert], pre, code, samp, kbd, .frame-label, .lens-layer, [hidden], .cmap, template')) continue;
        const range = document.createRange(); range.selectNodeContents(n); const b = range.getBoundingClientRect();
        if (!b.width || b.bottom < 60 || b.top > innerHeight) continue;
        const cs = getComputedStyle(el); if (cs.visibility === 'hidden' || +cs.opacity < 0.1) continue;
        const size = Math.round(parseFloat(cs.fontSize));
        sizes.set(size, (sizes.get(size) ?? 0) + n.textContent.trim().length);
      }
      screens.push([...sizes.entries()].sort((a, b) => a[0] - b[0]).map(([s]) => s));
    }
    const numbered = [...document.querySelectorAll('main *')].filter((el) => !el.children.length && /^(0\d|\d{2})$/.test(el.textContent.trim()) && !el.closest('[data-ui], [inert], pre, code, samp')).map((el) => el.textContent.trim());
    return { screens, numbered: numbered.slice(0, 6) };
  });
  const worst = Math.max(...r.screens.map((s) => s.length));
  console.log(`PRUEBA 6 · ${path} · tamaños por pantalla: ${r.screens.map((s) => s.length).join(' ')} (máx ${worst}) · numeraciones: ${r.numbered.length ? r.numbered.join(',') : 'ninguna'}`);
  for (const s of r.screens.filter((s) => s.length > 4).slice(0, 3)) console.log('      ', s.join(' · '));
}
await browser.close(); process.exit(0);
