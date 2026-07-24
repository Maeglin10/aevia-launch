/**
 * check-nav-arrows.mjs — measures the "Slide précédent" / "Slide suivant"
 * nav buttons at mobile viewport (390px) and reports whether they overlap.
 * Ground-truth checker for the missing-closing-div carousel bug.
 */
import { chromium } from 'playwright';
const BASE_URL = `http://localhost:${process.env.PORT || 3412}`;
const ids = process.argv[2].split(',').map((n) => `impact-${n.trim()}`);

const browser = await chromium.launch();
for (const id of ids) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  try {
    const resp = await page.goto(`${BASE_URL}/templates/${id}`, { waitUntil: 'load', timeout: 30000 });
    if (!resp || resp.status() !== 200) { console.log(`${id}: HTTP ${resp?.status()}`); await page.close(); continue; }
    await page.waitForTimeout(1200);
    const res = await page.evaluate(() => {
      const prev = document.querySelector('button[aria-label*="récédent" i], button[aria-label*="prev" i]');
      const next = document.querySelector('button[aria-label*="uivant" i], button[aria-label*="next" i]');
      if (!prev || !next) return null;
      const pr = prev.getBoundingClientRect();
      const nr = next.getBoundingClientRect();
      const overlap = Math.max(0, Math.min(pr.right, nr.right) - Math.max(pr.left, nr.left));
      return { prevLeft: Math.round(pr.left), prevRight: Math.round(pr.right), nextLeft: Math.round(nr.left), nextRight: Math.round(nr.right), overlapPx: Math.round(overlap) };
    });
    if (!res) console.log(`${id}: no prev/next arrows found`);
    else console.log(`${id}: prev[${res.prevLeft},${res.prevRight}] next[${res.nextLeft},${res.nextRight}] overlap=${res.overlapPx}px ${res.overlapPx > 5 ? '⚠️ BROKEN' : '✅ ok'}`);
  } catch (e) {
    console.log(`${id}: ERROR ${String(e).slice(0, 100)}`);
  }
  await page.close();
}
await browser.close();
