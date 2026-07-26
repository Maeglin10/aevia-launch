// Contrast audit — flags hero titles that visually blend into their background.
// Heuristic: crop the screenshot to the H1's bounding box, compute the
// luminance standard deviation of that crop. Legible text (dark glyphs on
// light bg, or vice versa) has HIGH local luminance variance. A title that
// blends into its background has LOW variance — the crop looks near-uniform.
// This approximates WCAG contrast without needing per-glyph OCR.
import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('/Users/milliandvalentin/skylaunch/node_modules/sharp');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;
const VIEWPORT = { width: 1280, height: 720 };

const HIDE_DEV_UI = `
  nextjs-portal, [data-nextjs-portal], #__next-build-watcher,
  #nextjs__container_errors_desc, [data-nextjs-toast],
  button[data-nextjs-errors-close-button] { display: none !important; }
  #aevia-webchat-root { display: none !important; }
`;

async function getTemplateIds() {
  const templatesDir = path.join(__dirname, '..', 'app', 'templates');
  const entries = await fs.readdir(templatesDir);
  return entries.filter(e => /^impact-\d+$/.test(e))
    .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));
}

function luminanceStddev(data, channels) {
  const n = data.length / channels;
  const lum = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const o = i * channels;
    // Rec. 601 luma
    lum[i] = 0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
  }
  let mean = 0;
  for (let i = 0; i < n; i++) mean += lum[i];
  mean /= n;
  let variance = 0;
  for (let i = 0; i < n; i++) variance += (lum[i] - mean) ** 2;
  variance /= n;
  return { stddev: Math.sqrt(variance), mean };
}

async function main() {
  const ids = await getTemplateIds();
  const arg = process.argv[2];
  let target;
  if (arg === '--only') {
    const list = new Set(process.argv[3].split(',').map(n => `impact-${n.trim().replace(/^impact-/, '')}`));
    target = ids.filter(id => list.has(id));
  } else if (arg) {
    target = [arg];
  } else {
    target = ids;
  }

  console.log(`Auditing ${target.length} templates on ${BASE_URL}`);
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const id of target) {
    const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
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
      await page.waitForTimeout(4000); // let hero reveal animations settle

      const h1 = page.locator('h1').first();
      const count = await page.locator('h1').count();
      if (count === 0) {
        results.push({ id, status: 'NO_H1' });
        continue;
      }
      const box = await h1.boundingBox();
      if (!box || box.width < 4 || box.height < 4) {
        results.push({ id, status: 'NO_BBOX' });
        continue;
      }
      // Clamp to viewport
      const x = Math.max(0, Math.floor(box.x));
      const y = Math.max(0, Math.floor(box.y));
      const w = Math.min(VIEWPORT.width - x, Math.ceil(box.width));
      const h = Math.min(VIEWPORT.height - y, Math.ceil(box.height));
      if (w < 4 || h < 4 || y >= VIEWPORT.height) {
        results.push({ id, status: 'OFFSCREEN' });
        continue;
      }

      const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height } });
      const { data, info } = await sharp(png).extract({ left: x, top: y, width: w, height: h }).raw().toBuffer({ resolveWithObject: true });
      const { stddev, mean } = luminanceStddev(data, info.channels);

      results.push({ id, status: 'OK', stddev: Math.round(stddev * 10) / 10, mean: Math.round(mean), w, h });
      process.stdout.write(`\r${results.length}/${target.length} — ${id} stddev=${stddev.toFixed(1)}`);
    } catch (err) {
      results.push({ id, status: 'ERROR', error: err.message.split('\n')[0] });
    } finally {
      await ctx.close();
    }
  }
  await browser.close();

  console.log('\n\n=== RESULTS (sorted worst-first, low stddev = likely low contrast) ===');
  const ok = results.filter(r => r.status === 'OK').sort((a, b) => a.stddev - b.stddev);
  const other = results.filter(r => r.status !== 'OK');
  for (const r of ok) console.log(`${r.stddev.toString().padStart(6)}  mean=${r.mean.toString().padStart(3)}  ${r.id}  (${r.w}x${r.h})`);
  console.log('\n--- non-OK ---');
  for (const r of other) console.log(`${r.id}: ${r.status}${r.error ? ' — ' + r.error : ''}`);

  await fs.writeFile(path.join(__dirname, '..', 'audit-results', 'contrast-audit.json'), JSON.stringify(results, null, 2));
  console.log('\nSaved to audit-results/contrast-audit.json');
}

main().catch(err => { console.error(err); process.exit(1); });
