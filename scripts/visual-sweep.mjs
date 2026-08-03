/**
 * visual-sweep.mjs — Batch 1 du prompt visuel.
 *
 * En un seul passage sur chaque template :
 *   1. Contraste H1 (stddev luminance) pour les templates 266→383 manquants
 *   2. Images chargées (naturalWidth > 0)
 *   3. Images chargées mais jamais peintes (ancêtres à 0px)
 *   4. Vignettes manquantes dans public/thumbnails/
 *   5. Contenu anglais (heuristique sur h1/h2/boutons)
 *
 * Usage: PORT=3412 node scripts/visual-sweep.mjs
 */
import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('/Users/milliandvalentin/skylaunch/node_modules/sharp');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = `http://localhost:${process.env.PORT || 3412}`;
const VIEWPORT = { width: 1280, height: 720 };

const HIDE_DEV_UI = `
  nextjs-portal, [data-nextjs-portal], #__next-build-watcher,
  #nextjs__container_errors_desc, [data-nextjs-toast],
  button[data-nextjs-errors-close-button] { display: none !important; }
  #aevia-webchat-root { display: none !important; }
`;

// English detection: common English words that would NOT appear in French content
const EN_WORDS = /\b(the|our|your|with|from|about|this|that|services|contact us|learn more|get started|view|explore|discover|read more|subscribe|book now|shop now|sign up|log in|pricing|features|testimonials|portfolio|schedule|appointment|welcome to)\b/i;

async function getTemplateIds() {
  const dir = path.join(__dirname, '..', 'app', 'templates');
  const entries = await fs.readdir(dir);
  return entries.filter(e => /^impact-\d+$/.test(e))
    .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));
}

async function checkThumbnails(ids) {
  const thumbDir = path.join(__dirname, '..', 'public', 'thumbnails');
  const missing = [];
  for (const id of ids) {
    const p = path.join(thumbDir, `${id}.webp`);
    try { await fs.access(p); } catch { missing.push(id); }
  }
  return missing;
}

function luminanceStddev(data, channels) {
  const n = data.length / channels;
  const lum = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    const o = i * channels;
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
  console.log(`${ids.length} templates found`);

  // 1. Thumbnails check (no browser needed)
  const missingThumbs = await checkThumbnails(ids);
  console.log(`\nMissing thumbnails: ${missingThumbs.length}`);
  if (missingThumbs.length) console.log(missingThumbs.join(', '));

  // 2. Browser-based checks
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (let idx = 0; idx < ids.length; idx++) {
    const id = ids[idx];
    const num = parseInt(id.split('-')[1]);
    const needsContrast = num >= 266;

    const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    page.on('console', () => {});

    const entry = { id, images: {}, english: false, contrast: null };

    try {
      await page.addInitScript(() => {
        const c = JSON.stringify({ essential: true, analytics: true, marketing: false, ts: Date.now() });
        localStorage.setItem('aevia-cookie-consent', c);
        localStorage.setItem('aevia-consent', c);
      });

      await page.goto(`${BASE_URL}/templates/${id}`, { waitUntil: 'networkidle', timeout: 25000 });
      await page.addStyleTag({ content: HIDE_DEV_UI });
      await page.waitForTimeout(2000);

      // Scroll through to trigger lazy loading
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise(r => setTimeout(r, 80));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(800);

      // Image checks
      const imgData = await page.evaluate(() => {
        const imgs = [...document.querySelectorAll('img')];
        return imgs.map(im => {
          const loaded = im.complete && im.naturalWidth > 0;
          const src = (im.currentSrc || im.src || '').slice(-80);
          const alt = (im.alt || '').slice(0, 60);

          // "loaded but never painted" check: walk 6 ancestors
          let painted = true;
          if (loaded) {
            let el = im;
            for (let i = 0; i < 6 && el; i++) {
              const r = el.getBoundingClientRect();
              if (r.width < 2 || r.height < 2) { painted = false; break; }
              el = el.parentElement;
            }
          }

          return { src, alt, loaded, painted };
        });
      });

      const broken = imgData.filter(i => !i.loaded && i.src);
      const unpainted = imgData.filter(i => i.loaded && !i.painted);
      entry.images = {
        total: imgData.length,
        broken: broken.length,
        brokenSrc: broken.map(i => i.src).slice(0, 5),
        unpainted: unpainted.length,
        unpaintedSrc: unpainted.map(i => i.src).slice(0, 5),
      };

      // English content check
      const textData = await page.evaluate(() => {
        const texts = [];
        for (const el of document.querySelectorAll('h1, h2, a, button')) {
          const t = (el.textContent || '').trim();
          if (t.length > 3 && t.length < 100) texts.push(t);
        }
        return texts;
      });

      const enHits = textData.filter(t => EN_WORDS.test(t));
      if (enHits.length >= 3) {
        entry.english = true;
        entry.englishSamples = enHits.slice(0, 5);
      }

      // Contrast check (only for missing templates 266+)
      if (needsContrast) {
        const h1Count = await page.locator('h1').count();
        if (h1Count > 0) {
          const h1 = page.locator('h1').first();
          const box = await h1.boundingBox();
          if (box && box.width >= 4 && box.height >= 4) {
            const x = Math.max(0, Math.floor(box.x));
            const y = Math.max(0, Math.floor(box.y));
            const w = Math.min(VIEWPORT.width - x, Math.ceil(box.width));
            const h = Math.min(VIEWPORT.height - y, Math.ceil(box.height));
            if (w >= 4 && h >= 4 && y < VIEWPORT.height) {
              const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height } });
              const { data, info } = await sharp(png).extract({ left: x, top: y, width: w, height: h }).raw().toBuffer({ resolveWithObject: true });
              const { stddev, mean } = luminanceStddev(data, info.channels);
              entry.contrast = { stddev: Math.round(stddev * 10) / 10, mean: Math.round(mean), w, h };
            }
          }
        }
      }

      results.push(entry);
      const tag = [];
      if (entry.images.broken) tag.push(`${entry.images.broken}broken`);
      if (entry.images.unpainted) tag.push(`${entry.images.unpainted}unpainted`);
      if (entry.english) tag.push('EN');
      if (entry.contrast) tag.push(`c=${entry.contrast.stddev}`);
      process.stdout.write(`\r${idx + 1}/${ids.length} ${id} ${tag.join(' ') || 'ok'}          `);
    } catch (err) {
      entry.error = err.message.split('\n')[0].slice(0, 100);
      results.push(entry);
      process.stdout.write(`\r${idx + 1}/${ids.length} ${id} ERROR          `);
    } finally {
      await ctx.close();
    }
  }

  await browser.close();

  // Write results
  const outPath = path.join(__dirname, '..', 'audit-results', 'visual-sweep.json');
  await fs.writeFile(outPath, JSON.stringify({ missingThumbs, results }, null, 1));

  // Summary
  console.log('\n\n=== SUMMARY ===');
  console.log(`Templates scanned: ${results.length}`);
  console.log(`Missing thumbnails: ${missingThumbs.length}`);

  const withBroken = results.filter(r => r.images?.broken > 0);
  console.log(`\nBroken images (${withBroken.length} templates):`);
  for (const r of withBroken.slice(0, 20)) console.log(`  ${r.id}: ${r.images.broken} broken — ${r.images.brokenSrc.join(', ')}`);

  const withUnpainted = results.filter(r => r.images?.unpainted > 0);
  console.log(`\nLoaded but never painted (${withUnpainted.length} templates):`);
  for (const r of withUnpainted) console.log(`  ${r.id}: ${r.images.unpainted} — ${r.images.unpaintedSrc.join(', ')}`);

  const enTemplates = results.filter(r => r.english);
  console.log(`\nEnglish content (${enTemplates.length} templates):`);
  for (const r of enTemplates) console.log(`  ${r.id}: ${r.englishSamples.join(' | ')}`);

  const lowContrast = results.filter(r => r.contrast && r.contrast.stddev < 15)
    .sort((a, b) => a.contrast.stddev - b.contrast.stddev);
  console.log(`\nLow contrast H1 (stddev<15, ${lowContrast.length} templates):`);
  for (const r of lowContrast) console.log(`  ${r.id}: stddev=${r.contrast.stddev} mean=${r.contrast.mean}`);

  const errors = results.filter(r => r.error);
  if (errors.length) {
    console.log(`\nErrors (${errors.length}):`);
    for (const r of errors) console.log(`  ${r.id}: ${r.error}`);
  }
}

main().catch(err => { console.error(err); process.exit(1); });
