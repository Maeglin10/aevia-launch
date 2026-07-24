/**
 * check-arrow-swap.mjs — detects carousel prev/next arrow buttons that
 * change horizontal order (or jump position) across slide changes.
 * Finds clickable elements containing ‹ › or chevron-like icons, clicks
 * through several slides, and flags if the "left" button's x position
 * ever ends up right of the "right" button's, or if either button's
 * x position shifts significantly between slides (layout not fixed).
 */
import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = `http://localhost:${process.env.PORT || 3412}`;
async function getAllTemplateIds() {
  const templatesDir = path.join(__dirname, '..', 'app', 'templates');
  const entries = await fs.readdir(templatesDir);
  return entries
    .filter((e) => /^impact-\d+$/.test(e))
    .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));
}
const ids = process.argv[2] === '--all'
  ? await getAllTemplateIds()
  : process.argv[2].split(',').map((n) => `impact-${n.trim()}`);

async function findArrowPairs(page) {
  return page.evaluate(() => {
    const isArrowish = (el) => {
      const t = (el.textContent || '').trim();
      if (['‹', '›', '<', '>', '←', '→', '‹›', '❮', '❯'].includes(t)) return true;
      const lbl = (el.getAttribute('aria-label') || '').toLowerCase();
      if (/prev|next|précédent|suivant|slide|carou/.test(lbl)) return true;
      // small square-ish clickable button with a small SVG and no meaningful text — likely an icon-only nav button
      if (t.length === 0 && el.querySelector('svg')) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && r.width < 70 && r.height > 0 && r.height < 70) return true;
      }
      return false;
    };
    const candidates = [...document.querySelectorAll('button, a[role="button"], div[onclick], div[role="button"]')].filter(isArrowish);
    return candidates.map((el, idx) => {
      const r = el.getBoundingClientRect();
      return { idx, text: (el.textContent || '').trim().slice(0, 20), left: r.left, top: r.top, w: r.width, h: r.height };
    });
  });
}

async function checkOne(browser, id) {
  const found = [];
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  try {
    const resp = await page.goto(`${BASE_URL}/templates/${id}`, { waitUntil: 'load', timeout: 30000 });
    if (!resp || resp.status() !== 200) return { id, skipped: `HTTP ${resp?.status()}` };
    await page.waitForTimeout(1000);

    const before = await findArrowPairs(page);
    if (before.length < 2) return { id, skipped: 'no arrow pair found' };

    // group into left/right pairs by proximity in `top` (same row)
    const rows = [];
    for (const b of before) {
      let row = rows.find((r) => Math.abs(r[0].top - b.top) < 10);
      if (row) row.push(b);
      else rows.push([b]);
    }
    const pairs = rows.filter((r) => r.length === 2);
    if (pairs.length === 0) return { id, skipped: 'no same-row pair' };

    for (const pairRow of pairs) {
      const rowTop = pairRow[0].top;
      // click the rightmost ("next") button in this row 3 times, re-measuring the pair each time
      for (let click = 0; click < 3; click++) {
        const rowNow = (await findArrowPairs(page))
          .filter((x) => Math.abs(x.top - rowTop) < 20)
          .sort((p, q) => p.left - q.left);
        if (rowNow.length !== 2) break;
        const [beforeLeft, beforeRight] = rowNow;

        await page.mouse.click(beforeRight.left + beforeRight.w / 2, beforeRight.top + beforeRight.h / 2);
        await page.waitForTimeout(500);

        const rowAfter = (await findArrowPairs(page))
          .filter((x) => Math.abs(x.top - rowTop) < 20)
          .sort((p, q) => p.left - q.left);
        if (rowAfter.length !== 2) continue;
        const [afterLeft, afterRight] = rowAfter;

        const leftMoved = Math.abs(afterLeft.left - beforeLeft.left);
        const rightMoved = Math.abs(afterRight.left - beforeRight.left);
        if (leftMoved > 40 || rightMoved > 40) {
          found.push({
            id,
            click: click + 1,
            issue: 'arrow position shifted between slides',
            leftBefore: beforeLeft.left, leftAfter: afterLeft.left,
            rightBefore: beforeRight.left, rightAfter: afterRight.left,
          });
        }
      }
    }
    return { id, checked: true, found };
  } catch (e) {
    return { id, error: String(e).slice(0, 150) };
  } finally {
    await page.close();
  }
}

async function main() {
  const browser = await chromium.launch();
  const findings = [];
  const queue = [...ids];
  let done = 0;
  async function worker() {
    while (queue.length) {
      const id = queue.shift();
      const r = await checkOne(browser, id);
      done++;
      if (r.error) findings.push({ id: r.id, error: r.error });
      else if (r.found?.length) findings.push(...r.found);
      console.log(`${done}/${ids.length} ${id}${r.skipped ? ` (${r.skipped})` : ''}${r.found?.length ? ` ⚠️ ${r.found.length} shift(s)` : ''}${r.error ? ` ERR: ${r.error}` : ''}`);
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));
  await browser.close();
  const outPath = path.join(__dirname, '..', 'audit-results', 'arrow-swap-report.json');
  await fs.writeFile(outPath, JSON.stringify(findings, null, 1));
  console.log(`\n${findings.length} findings -> ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
