/* Simple view verification. Bundled Chromium (Playwright) against the local dev server.
 *
 *   node scripts/verify-simple.mjs [base] [outDir]
 *
 * Every request off localhost is aborted, so no analytics or third-party call leaves the
 * machine. Every page carries the estate's click guard (guardPlaywrightPage), so the mailto
 * anchor can never reach another app. The site has no form that writes, no checkout and no API
 * route that scans; the copy button writes only to this browser's clipboard.
 */
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { guardPlaywrightPage } from '/Users/admin/CompoundLabs/compound-ops/tools/lib/safe-chrome.mjs';

const require = createRequire('/Users/admin/CompoundLabs/compound-ops/');
const { chromium } = require('playwright');

const BASE = process.argv[2] || 'http://localhost:3306';
const OUT = process.argv[3] || '/Users/admin/CompoundLabs/compound-ops/standards/simple-view-ref/review';
mkdirSync(OUT, { recursive: true });

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};

const browser = await chromium.launch({ args: ['--mute-audio'] });
async function open(width = 1440, height = 900) {
  const ctx = await browser.newContext({ viewport: { width, height } });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: BASE });
  await ctx.route('**/*', (route) => (new URL(route.request().url()).hostname === 'localhost' ? route.continue() : route.abort()));
  const page = await ctx.newPage();
  await guardPlaywrightPage(page);
  return { ctx, page };
}
const settle = (page) => page.waitForTimeout(800);
const view = (page) => page.locator('.site-surface').getAttribute('data-view');
const overflow = (page) => page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const counts = (page) => page.evaluate(() => [...['header', 'main', 'footer']].map((t) => document.querySelectorAll(`.site-surface ${t}:not(dialog *)`).length));

try {
  /* 1. Fresh visitor: Console default, welcome opens, close paths, suppression. */
  {
    const { ctx, page } = await open();
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await settle(page);
    const dlg = page.locator('dialog.sv-welcome');
    check('welcome opens on / for a fresh visitor', await dlg.evaluate((d) => d.open));
    check('fresh visitor defaults to Console', (await view(page)) === 'console');
    check('welcome has a labelled illustration', (await dlg.innerText()).includes('ILLUSTRATION'));
    check('welcome shows the real mark', (await dlg.locator('img[src="/icon.svg"]').count()) === 1);
    await page.screenshot({ path: `${OUT}/leakless-site-welcome-1440.png` });
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    check('Escape closes the welcome', !(await dlg.evaluate((d) => d.open)));
    check('closing does not change the view', (await view(page)) === 'console');
    await page.locator('footer.console-foot button', { hasText: 'Start here' }).click();
    await page.waitForTimeout(400);
    check('Console footer Start here reopens the welcome', await dlg.evaluate((d) => d.open));
    await page.mouse.click(5, 5);
    await page.waitForTimeout(400);
    check('backdrop click closes the welcome', !(await dlg.evaluate((d) => d.open)));
    await page.locator('footer.console-foot button', { hasText: 'Start here' }).click();
    await page.waitForTimeout(300);
    await dlg.locator('footer input[type=checkbox]').check();
    await dlg.locator('.sv-choices button', { hasText: 'Simple' }).click();
    await page.waitForTimeout(400);
    check('choosing Simple switches the page', (await view(page)) === 'simple');
    await page.reload({ waitUntil: 'networkidle' });
    await settle(page);
    check('suppressed welcome stays shut on reload', !(await dlg.evaluate((d) => d.open)));
    check('saved Simple survives reload', (await view(page)) === 'simple');
    await page.locator('.sv-footer button', { hasText: 'Start here' }).click();
    await page.waitForTimeout(400);
    check('Simple footer Start here reopens even when suppressed', await dlg.evaluate((d) => d.open));
    await dlg.locator('.sv-close').click();
    await page.waitForTimeout(400);
    await page.goto(`${BASE}/?view=console&utm=x#contract`, { waitUntil: 'networkidle' });
    await settle(page);
    check('URL view beats saved view', (await view(page)) === 'console');
    await page.locator('footer.console-foot button', { hasText: 'Simple' }).click();
    await page.waitForTimeout(300);
    const u = new URL(page.url());
    check('switching keeps other params and hash', u.searchParams.get('view') === 'simple' && u.searchParams.get('utm') === 'x' && u.hash === '#contract');
    await ctx.close();
  }

  /* 2. The Simple home: one chrome, action in the first screen, listbox, copy, disclosures. */
  {
    const { ctx, page } = await open();
    await page.goto(`${BASE}/?view=simple&welcome=0`, { waitUntil: 'networkidle' });
    await settle(page);
    check('welcome=0 keeps the welcome shut', !(await page.locator('dialog.sv-welcome').evaluate((d) => d.open)));
    check('one header, main and footer', JSON.stringify(await counts(page)) === '[1,1,1]', JSON.stringify(await counts(page)));
    const card = await page.locator('#start').boundingBox();
    check('action card starts in the first screen', card && card.y < 900);
    check('no native select', (await page.locator('select').count()) === 0);
    const h1 = await page.locator('h1').evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
    check('headline is large sans', h1 >= 56, `${h1}px`);
    await page.screenshot({ path: `${OUT}/leakless-site-simple-1440.png`, fullPage: true });

    const btn = page.locator('.sv-select-btn');
    await btn.click();
    await page.waitForTimeout(250);
    check('listbox opens on click', (await btn.getAttribute('aria-expanded')) === 'true');
    await page.screenshot({ path: `${OUT}/leakless-site-simple-select-open-1440.png` });
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(250);
    check('arrow and Enter pick an option', (await btn.innerText()).includes('Every morning'));
    check('focus returns to the listbox button', await btn.evaluate((e) => e === document.activeElement));
    check('picked workflow shows the schedule', (await page.locator('.sv-code').innerText()).includes("cron: '0 6 * * *'"));
    await btn.press('Enter');
    await page.keyboard.press('Escape');
    await page.waitForTimeout(250);
    check('Escape closes the listbox', (await btn.getAttribute('aria-expanded')) === 'false');
    await page.locator('.sv-primary').click();
    await page.waitForTimeout(250);
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    check('copy writes the picked workflow', clip.includes("cron: '0 6 * * *'") && clip.includes('kyisaiah47/leakless@v1'));

    const first = page.locator('.sv-result .sv-disclosure > button').first();
    const panel = page.locator(`#${(await first.getAttribute('aria-controls')).replace(/:/g, '\\:')}`);
    check('collapsed disclosure is inert', (await panel.getAttribute('inert')) !== null);
    await first.click();
    await page.waitForTimeout(400);
    check('disclosure exposes aria-expanded', (await first.getAttribute('aria-expanded')) === 'true');
    check('open disclosure lists the five README findings', (await page.locator('.sv-findings li').count()) === 5);
    await page.locator('#example').screenshot({ path: `${OUT}/leakless-site-simple-example-open-1440.png` });

    await page.locator('.sv-footer button', { hasText: 'Console' }).click();
    await page.waitForTimeout(300);
    await page.locator('footer.console-foot button', { hasText: 'Simple' }).click();
    await page.waitForTimeout(300);
    check('picked workflow survives a view switch', (await page.locator('.sv-select-btn').innerText()).includes('Every morning'));
    await page.locator('.sv-footer button', { hasText: 'Console' }).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/leakless-site-console-1440.png` });
    check('Console keeps its masthead and frame', (await page.locator('.masthead').count()) === 1 && (await page.locator('.frame').count()) === 1);
    await ctx.close();
  }

  /* 3. 404 in both views. */
  {
    const { ctx, page } = await open();
    await page.goto(`${BASE}/no-such-page?view=simple`, { waitUntil: 'networkidle' });
    await settle(page);
    check('Simple 404 has recovery links', (await page.locator('.sv-next a').count()) === 3);
    check('Simple 404 one header, main, footer', JSON.stringify(await counts(page)) === '[1,1,1]');
    await page.screenshot({ path: `${OUT}/leakless-site-simple-404-1440.png` });
    await page.locator('.sv-footer button', { hasText: 'Console' }).click();
    await page.waitForTimeout(300);
    check('Console 404 has view controls', (await page.locator('footer.console-foot .sv-view-tools').count()) === 1);
    await ctx.close();
  }

  /* 4. 390: overflow only, no screenshots. */
  for (const route of ['/?view=simple&welcome=0', '/?view=console&welcome=0', '/no-such-page?view=simple']) {
    const { ctx, page } = await open(390, 844);
    await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
    await settle(page);
    if (route.includes('simple') && route.startsWith('/?')) {
      for (const b of await page.locator('.sv-disclosure > button').all()) await b.click();
      await page.waitForTimeout(400);
    }
    const o = await overflow(page);
    check(`no page overflow at 390 on ${route}`, o <= 0, `${o}px`);
    await ctx.close();
  }
  {
    const { ctx, page } = await open(390, 700);
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' });
    await settle(page);
    const fit = await page.locator('dialog.sv-welcome').evaluate((d) => {
      const r = d.getBoundingClientRect();
      return r.left >= 0 && r.right <= innerWidth && r.bottom <= innerHeight && d.scrollHeight > d.clientHeight;
    });
    check('phone welcome fits the viewport and scrolls inside', fit);
    await ctx.close();
  }
} finally {
  await browser.close();
}
const failed = results.filter((r) => !r.ok).length;
console.log(`\n${results.length - failed} of ${results.length} checks passed`);
process.exit(failed ? 1 : 0);
