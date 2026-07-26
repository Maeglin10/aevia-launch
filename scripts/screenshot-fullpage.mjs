// Full-page section screenshots for personal visual QA — captures the ENTIRE
// page (not just the hero viewport) sliced into viewport-height chunks, so
// crowding/collision/offset bugs anywhere down the page are visible, not
// just in the hero. Mobile is captured first since it's the top QA priority.
import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;
const OUT_DIR = process.env.OUT_DIR || '/tmp/section-screens';

const BREAKPOINTS = [
  { name: 'mobile', width: 375, height: 800 },
  { name: 'desktop', width: 1440, height: 900 },
];

const HIDE_DEV_UI = `
  nextjs-portal, [data-nextjs-portal], #__next-build-watcher,
  #nextjs__container_errors_desc, [data-nextjs-toast],
  button[data-nextjs-errors-close-button] { display: none !important; }
  #aevia-webchat-root { display: none !important; }
`;

async function main() {
  const ids = process.argv.slice(2).flatMap(n => n.split(',')).filter(Boolean)
    .map(n => `impact-${n.trim().replace(/^impact-/, '')}`);
  if (!ids.length) { console.error('usage: node screenshot-fullpage.mjs 1,2,3'); process.exit(1); }
  await fs.mkdir(OUT_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  for (const id of ids) {
    for (const bp of BREAKPOINTS) {
      const ctx = await browser.newContext({ viewport: { width: bp.width, height: bp.height }, deviceScaleFactor: 1 });
      const page = await ctx.newPage();
      page.on('console', () => {});
      try {
        await page.addInitScript(() => {
          const consent = JSON.stringify({ essential: true, analytics: true, marketing: false, ts: Date.now() });
          localStorage.setItem('aevia-cookie-consent', consent);
          localStorage.setItem('aevia-consent', consent);
        });
        await page.goto(`${BASE_URL}/templates/${id}`, { waitUntil: 'networkidle', timeout: 25000 });
        await page.addStyleTag({ content: HIDE_DEV_UI });
        // trigger scroll-based reveal animations by scrolling through once
        await page.evaluate(async () => {
          const step = window.innerHeight * 0.85;
          const max = document.body.scrollHeight;
          for (let y = 0; y < max; y += step) {
            window.scrollTo(0, y);
            await new Promise(r => setTimeout(r, 120));
          }
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(1500);
        const fullHeight = await page.evaluate(() => document.body.scrollHeight);
        const nSlices = Math.min(8, Math.max(1, Math.ceil(fullHeight / bp.height)));
        for (let i = 0; i < nSlices; i++) {
          await page.evaluate((y) => window.scrollTo(0, y), i * bp.height);
          await page.waitForTimeout(250);
          await page.screenshot({ path: path.join(OUT_DIR, `${id}-${bp.name}-s${i}.png`) });
        }
        console.log(`${id} ${bp.name} OK (${nSlices} slices, height=${fullHeight})`);
      } catch (err) {
        console.log(`${id} ${bp.name} ERROR ${err.message.split('\n')[0]}`);
      } finally {
        await ctx.close();
      }
    }
  }
  await browser.close();
}

main().catch(err => { console.error(err); process.exit(1); });
