#!/usr/bin/env node
/* Capture every state of leakless at the estate review width. Desktop only and tiled by viewport. */
import { createRequire } from 'node:module';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { launchSafe } from '/Users/admin/CompoundLabs/compound-ops/tools/lib/safe-chrome.mjs';

const require = createRequire('/Users/admin/CompoundLabs/compound-ops/package.json');
const puppeteer = require('puppeteer-core');
const root = resolve(new URL('..', import.meta.url).pathname);
const out = resolve(root, 'review');
const base = (process.argv.find((value) => value.startsWith('http')) || 'http://localhost:3306').replace(/\/$/, '');
const wait = (ms) => new Promise((done) => setTimeout(done, ms));
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });

const browser = await launchSafe(puppeteer, { headless: true });
const views = [
  ['console-default', null],
  ['console-grade', 1],
  ['console-reachability', 2],
  ['console-switcher', 'switcher'],
];
const ledger = [];
for (const [id, state] of views) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
  await page.goto(`${base}/`, { waitUntil: 'networkidle2', timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);
  if (typeof state === 'number') await page.evaluate((index) => document.querySelectorAll('.chip')[index]?.click(), state);
  if (state === 'switcher') await page.evaluate(() => document.querySelector('.app-switch')?.click());
  await wait(500);
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let tile = 0; tile < Math.ceil(height / 900); tile++) {
    await page.evaluate((y) => window.scrollTo(0, y), tile * 900);
    await wait(180);
    await page.screenshot({ path: resolve(out, `${id}-${String(tile + 1).padStart(2, '0')}.png`) });
  }
  const box = await page.evaluate(() => ({ clientWidth: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
  ledger.push({ id, height, ...box, sideways: box.scrollWidth > box.clientWidth + 1 });
  await page.close();
}
await browser.close();
writeFileSync(resolve(out, 'ledger.json'), JSON.stringify({ base, viewport: 1440, views: ledger }, null, 2) + '\n');
if (ledger.some((view) => view.sideways)) process.exit(1);
console.log(`captured ${ledger.length} states at 1440 into review/`);
