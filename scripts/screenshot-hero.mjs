// Capture initial-load (no-scroll) hero screenshots at 3 breakpoints for visual
// audit — used to manually/agent-judge header-overlap and CTA-visibility bugs,
// since DOM-heuristic detection proved too noisy (excluded valid header CTAs,
// picked up off-screen duplicate CTAs further down the page).
import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;
const OUT_DIR = process.env.OUT_DIR || '/tmp/hero-screens';

const BREAKPOINTS = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
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
  if (!ids.length) { console.error('usage: node screenshot-hero.mjs 1,2,3 (or space separated)'); process.exit(1); }
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
        await page.goto(`${BASE_URL}/templates/${id}`, { waitUntil: 'networkidle', timeout: 20000 });
        await page.addStyleTag({ content: HIDE_DEV_UI });
        await page.waitForTimeout(2200);
        await page.screenshot({ path: path.join(OUT_DIR, `${id}-${bp.name}.png`) });
        console.log(`${id} ${bp.name} OK`);
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
