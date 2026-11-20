// La firma "Chris" de la barra (marca provisional, 20 nov): la palabra escrita en Rock Salt (Google
// Fonts), guardada como imagen con transparencia. En la web se usa de máscara, así que toma el color
// de la tinta en los dos modos y no hace falta cargar esa letra como tercera familia.
// Cuando Christian haga su firma a mano, esta imagen se sustituye por la suya.
// Uso (desde la raíz; abre Edge con Playwright): node .taste-skill/letras/firma.mjs [texto] [salida.webp]
import { chromium } from '@playwright/test';
import sharp from 'sharp';
const [text = 'Chris', out = 'src/assets/images/brand/chris.webp'] = process.argv.slice(2);
const browser = await chromium.launch({ channel: 'msedge' });
const page = await browser.newPage({ viewport: { width: 1600, height: 700 }, deviceScaleFactor: 1 });
await page.setContent(`<!doctype html><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Rock+Salt&display=block">
<style>html,body{margin:0;background:transparent}p{margin:0;padding:120px 80px;font:200px/1.4 'Rock Salt',cursive;color:#000;display:inline-block;white-space:nowrap}</style>
<p></p>`);
await page.locator('p').evaluate((el, t) => { el.textContent = t; }, text);
const loaded = await page.evaluate(async () => { await document.fonts.load("200px 'Rock Salt'"); return document.fonts.check("200px 'Rock Salt'"); });
if (!loaded) throw new Error('Rock Salt did not load');
await page.waitForTimeout(300);
const png = await page.locator('p').screenshot({ omitBackground: true });
await browser.close();
// Recortada a la tinta y a un tamaño que sobra para pantallas de alta densidad
const trimmed = await sharp(png).trim().toBuffer();
const info = await sharp(trimmed).resize({ height: 240 }).webp({ lossless: true }).toFile(out);
console.log('hecho', out, info.width + ' × ' + info.height, info.size + ' bytes');
