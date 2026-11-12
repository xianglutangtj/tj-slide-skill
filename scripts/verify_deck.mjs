#!/usr/bin/env node
// Render every click of every slide, check each one, and write screenshots plus a contact sheet.
//
//   node scripts/verify_deck.mjs path/to/deck.html [output-folder]
//
// Needs Playwright (`npm i playwright`) and a local Chrome. If Playwright lives somewhere
// unusual, point PLAYWRIGHT_PATH at its index.mjs; set CHROME_PATH to use a specific browser.
// The deck must expose window.deck (the starter does).
//
// Fails on: page errors, failed or external requests, anything drawn outside the slide,
//           navigation that does not step forward and back.
// Warns on: small text, text cut off inside a box, a slide state with a lot of words.
// It cannot judge whether a slide is clear. Open contact-sheet.png and look.
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const MIN_FONT_PX = 20;      // smallest text allowed on a slide (page number excepted)
const MAX_WORDS = 90;        // words on screen in one state (title, eyebrow, page number not counted) before we warn
const [deckArg, outArg] = process.argv.slice(2);
if (!deckArg) { console.error('usage: node verify_deck.mjs deck.html [output-folder]'); process.exit(2); }
const deck = path.resolve(deckArg);
const out = path.resolve(outArg || path.join(path.dirname(deck), 'verification'));

async function loadPlaywright() {
  const tries = [process.env.PLAYWRIGHT_PATH && pathToFileURL(process.env.PLAYWRIGHT_PATH).href, 'playwright', 'playwright-core'].filter(Boolean);
  for (const t of tries) { try { const m = await import(t); return m.chromium || m.default.chromium; } catch {} }
  console.error('Playwright not found. Run `npm i playwright`, or set PLAYWRIGHT_PATH, or use the Chrome command in references/qa.md.');
  process.exit(2);
}
const chromium = await loadPlaywright();
const launch = process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : { channel: 'chrome' };
const browser = await chromium.launch({ headless: true, ...launch });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const errors = [], failed = [], external = [];
page.on('pageerror', e => errors.push(String(e)));
page.on('requestfailed', r => failed.push(r.url()));
page.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) external.push(r.url()); });

await fs.mkdir(out, { recursive: true });
await page.goto(pathToFileURL(deck).href);
if (!(await page.evaluate(() => !!window.deck))) { console.error('window.deck is missing: use the starter engine.'); process.exit(2); }
const slides = await page.evaluate(() => window.deck.slides);
const states = [], problems = [], warnings = [];

for (let s = 1; s <= slides; s++) {
  const clicks = await page.evaluate(n => window.deck.clicks(n), s);
  for (let c = 0; c <= clicks; c++) {
    await page.evaluate(([n, k]) => window.deck.go(n, k), [s, c]);
    await page.waitForTimeout(420);                       // let the transition finish
    const r = await page.evaluate(({ MIN_FONT_PX }) => {
      const frame = document.querySelector('.frame.active');
      const seen = e => { const cs = getComputedStyle(e), b = e.getBoundingClientRect();
        if (cs.display === 'none' || b.width < 1 || b.height < 1) return false;
        for (let p = e; p && p !== document.body; p = p.parentElement) { const ps = getComputedStyle(p); if (ps.visibility === 'hidden' || +ps.opacity < 0.05) return false; }
        return true; };
      const all = [...frame.querySelectorAll('*')].filter(e => !e.closest('aside.notes') && seen(e));
      const tag = e => `${e.tagName.toLowerCase()}${e.className && typeof e.className === 'string' ? '.' + e.className.trim().replace(/\s+/g, '.') : ''} "${(e.textContent || '').trim().slice(0, 50)}"`;
      const outside = all.filter(e => { const b = e.getBoundingClientRect(); return b.left < -1 || b.top < -1 || b.right > 1921 || b.bottom > 1081; }).map(tag);
      const own = e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
      const chrome = e => e.closest('h1,.eyebrow,.folio');
      const small = all.filter(e => own(e) && !e.closest('.folio') && parseFloat(getComputedStyle(e).fontSize) < MIN_FONT_PX).map(e => `${parseFloat(getComputedStyle(e).fontSize)}px ${tag(e)}`);
      const cut = all.filter(e => e.style.height && (e.scrollHeight > e.clientHeight + 3 || e.scrollWidth > e.clientWidth + 3)).map(tag);
      const words = all.filter(e => own(e) && !chrome(e)).reduce((n, e) => n + [...e.childNodes].filter(x => x.nodeType === 3).map(x => x.textContent.trim()).join(' ').split(/\s+/).filter(Boolean).length, 0);
      return { title: frame.querySelector('h1')?.textContent.trim(), outside, small, cut, words };
    }, { MIN_FONT_PX });
    const file = `s${s}-click${c}.png`;
    await page.screenshot({ path: path.join(out, file) });
    const where = `slide ${s} click ${c}`;
    if (r.outside.length) problems.push(`${where}: outside the slide: ${r.outside.join('; ')}`);
    if (r.small.length) warnings.push(`${where}: text under ${MIN_FONT_PX}px: ${r.small.join('; ')}`);
    if (r.cut.length) warnings.push(`${where}: content larger than its box: ${r.cut.join('; ')}`);
    if (r.words > MAX_WORDS) warnings.push(`${where}: ${r.words} words on screen`);
    states.push({ slide: s, click: c, title: r.title, words: r.words, file });
  }
}

// forward then back must return to the same place
await page.evaluate(() => window.deck.go(1, 0));
await page.keyboard.press('ArrowRight');
const fwd = await page.evaluate(() => window.deck.state());
await page.keyboard.press('ArrowLeft');
const back = await page.evaluate(() => window.deck.state());
const moved = fwd.slide !== 1 || fwd.click !== 0;
if (!moved || back.slide !== 1 || back.click !== 0) problems.push(`navigation: forward ${JSON.stringify(fwd)}, back ${JSON.stringify(back)}`);
if (errors.length) problems.push(`page errors: ${errors.join('; ')}`);
if (failed.length) problems.push(`failed requests: ${failed.join('; ')}`);
if (external.length) problems.push(`external requests (deck will break offline): ${[...new Set(external)].join('; ')}`);

// contact sheet: every state on one image, two per row
const cells = await Promise.all(states.map(async st => `<figure><img src="data:image/png;base64,${(await fs.readFile(path.join(out, st.file))).toString('base64')}"><figcaption>${st.slide}.${st.click} · ${st.words}w</figcaption></figure>`));
const sheet = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
await sheet.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;background:#dce3e8;font-family:Arial,sans-serif;display:grid;grid-template-columns:repeat(2,960px)}figure{margin:0;position:relative;border:2px solid #8d9aa5;background:#fff}img{width:956px;height:538px;display:block}figcaption{position:absolute;right:12px;top:10px;background:#00274c;color:#fff;font-size:16px;font-weight:700;padding:6px 10px;border-radius:5px}</style>${cells.join('')}`);
await sheet.waitForFunction(() => [...document.images].every(i => i.complete && i.naturalWidth > 0));
await sheet.screenshot({ path: path.join(out, 'contact-sheet.png'), fullPage: true });
await browser.close();

await fs.writeFile(path.join(out, 'manifest.json'), JSON.stringify({ deck, slides, states, problems, warnings }, null, 2));
console.log(`${slides} slides, ${states.length} states → ${out}`);
warnings.forEach(w => console.log('WARN  ' + w));
problems.forEach(p => console.log('FAIL  ' + p));
console.log(problems.length ? 'FAILED' : 'PASSED (now look at contact-sheet.png)');
process.exit(problems.length ? 1 : 0);
