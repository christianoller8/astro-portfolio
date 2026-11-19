// Busca texto en español en las páginas en inglés: recorre los nodos de texto visibles (y aria-label,
// title, alt, placeholder) y señala los que tienen acentos o palabras típicas del español.
// Uso: node en-scan.mjs <cdp.mjs> <origen> <ruta> [<ruta>…]
const [CDP, origin, ...paths] = process.argv.slice(2);
const { Browser, sleep } = await import(CDP);
const browser = await Browser.launch();
for (const path of paths) {
  const p = await browser.newPage({ width: 1440, height: 900 });
  await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `try { localStorage.removeItem('lens'); } catch (e) {}` });
  await p.goto(origin + path, { settleMs: 2200 });
  const found = await p.eval(() => {
    const es = /[áéíóúñ¿¡]|\b(el|la|los|las|de|del|que|para|con|una|uno|por|sobre|más|qué|cómo|está|ver|hoy|mi|tu|sin|todo|todos|también|aquí|ahora)\b/i;
    const ok = /^(Vístalo|Vístalo.*|Tengo ganas de verte|Se me ha hecho tarde|¿Me pones un café\?|Me da igual|Te echo de menos|ES|made by chris|Christian Oller|Castellano|.*QA.*)$/;
    const out = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) {
      const text = n.textContent.replace(/\s+/g, ' ').trim();
      const host = n.parentElement;
      if (!text || text.length < 2 || host.closest('script, style, template, pre, code, [data-nf-lang="es"]')) continue;
      if (es.test(text) && !ok.test(text)) out.add(text.slice(0, 90));
    }
    for (const el of document.querySelectorAll('[aria-label], [title], [alt], [placeholder]')) for (const a of ['aria-label', 'title', 'alt', 'placeholder']) { const v = el.getAttribute(a); if (v && es.test(v) && !ok.test(v)) out.add(`[${a}] ${v.slice(0, 80)}`); }
    return { lang: document.documentElement.lang, title: document.title, desc: document.querySelector('meta[name=description]')?.content, hits: [...out] };
  });
  console.log(`\n== ${path}  lang=${found.lang}\n   title: ${found.title}\n   desc: ${found.desc}`);
  for (const h of found.hits) console.log('   ·', h);
}
await browser.close(); process.exit(0);
