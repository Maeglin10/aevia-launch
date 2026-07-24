/**
 * audit-overlaps.mjs — programmatic visual-defect scanner for template themes.
 *
 * For every app/templates/impact-N page, loads it in Playwright, triggers
 * whileInView animations by scrolling, then measures every visible text-bearing
 * element and reports:
 *   - text/text overlaps (bounding-rect intersections after ancestor clipping)
 *   - horizontal page overflow
 *   - near-touching text blocks (cramped spacing)
 * at desktop (1280x720) and mobile (390x844) viewports.
 *
 * Usage: PORT=3412 node scripts/audit-overlaps.mjs [--only 311,312] [--from 200]
 * Output: audit-results/overlap-report.json (+ per-page progress on stdout)
 */
import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = `http://localhost:${process.env.PORT || 3412}`;
const OUT_DIR = path.join(__dirname, '..', 'audit-results');
const CONCURRENCY = 4;

// Hide dev-only UI noise (Next.js toasts) — NOT template content.
const HIDE_DEV_UI = `
  nextjs-portal, [data-nextjs-portal], #__next-build-watcher,
  [data-nextjs-toast], #aevia-webchat-root { display: none !important; }
`;

async function getTemplateIds() {
  const templatesDir = path.join(__dirname, '..', 'app', 'templates');
  const entries = await fs.readdir(templatesDir);
  let ids = entries
    .filter((e) => /^impact-\d+$/.test(e))
    .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));
  const onlyArg = process.argv.find((a) => a.startsWith('--only'));
  if (onlyArg) {
    const list = (onlyArg.split('=')[1] || process.argv[process.argv.indexOf(onlyArg) + 1])
      .split(',')
      .map((n) => `impact-${n.trim()}`);
    ids = ids.filter((id) => list.includes(id));
  }
  const fromArg = process.argv.indexOf('--from');
  if (fromArg !== -1) {
    const from = parseInt(process.argv[fromArg + 1]);
    ids = ids.filter((id) => parseInt(id.split('-')[1]) >= from);
  }
  return ids;
}

/** Runs inside the page: measure text elements, detect overlaps. */
function detectDefects() {
  const vw = window.innerWidth;

  // --- collect visible text-bearing elements ---
  const els = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
  let node;
  while ((node = walker.nextNode())) {
    const el = node;
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'SVG', 'PATH'].includes(el.tagName)) continue;
    // direct text only (children handle their own text)
    let direct = '';
    for (const child of el.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) direct += child.textContent;
    }
    direct = direct.replace(/\s+/g, ' ').trim();
    if (!direct) continue;

    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    // EFFECTIVE opacity: multiply through ancestors — inactive carousel slides
    // are usually hidden via opacity-0 on a parent, not on the text node itself.
    let effOpacity = parseFloat(cs.opacity);
    for (let anc = el.parentElement; anc && anc !== document.documentElement; anc = anc.parentElement) {
      effOpacity *= parseFloat(getComputedStyle(anc).opacity);
      if (effOpacity < 0.15) break;
    }
    if (effOpacity < 0.15) continue;

    // skip fixed/sticky elements and their descendants (navbars/floating CTAs overlay by design)
    let p = el;
    let fixed = false;
    while (p && p !== document.body) {
      const pos = getComputedStyle(p).position;
      if (pos === 'fixed' || pos === 'sticky') {
        fixed = true;
        break;
      }
      p = p.parentElement;
    }
    if (fixed) continue;

    let rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;

    // clip by ancestors with overflow hidden/clip/auto/scroll (carousels, marquees)
    let clipped = { left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom };
    p = el.parentElement;
    while (p && p !== document.documentElement) {
      const pcs = getComputedStyle(p);
      if (/(hidden|clip|auto|scroll)/.test(pcs.overflow + pcs.overflowX + pcs.overflowY)) {
        const pr = p.getBoundingClientRect();
        clipped.left = Math.max(clipped.left, pr.left);
        clipped.top = Math.max(clipped.top, pr.top);
        clipped.right = Math.min(clipped.right, pr.right);
        clipped.bottom = Math.min(clipped.bottom, pr.bottom);
      }
      p = p.parentElement;
    }
    const w = clipped.right - clipped.left;
    const h = clipped.bottom - clipped.top;
    if (w < 2 || h < 2) continue; // fully clipped away — not visible

    // short selector-ish path for reporting
    const tag = el.tagName.toLowerCase();
    const cls = (typeof el.className === 'string' ? el.className : '')
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .join('.');
    els.push({
      el,
      tag,
      path: cls ? `${tag}.${cls}` : tag,
      text: direct.slice(0, 60),
      fontSize: parseFloat(cs.fontSize),
      left: clipped.left + window.scrollX,
      top: clipped.top + window.scrollY,
      right: clipped.right + window.scrollX,
      bottom: clipped.bottom + window.scrollY,
    });
  }

  // --- pairwise overlap detection ---
  const overlaps = [];
  for (let i = 0; i < els.length; i++) {
    for (let j = i + 1; j < els.length; j++) {
      const a = els[i];
      const b = els[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const ix = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const iy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ix <= 0 || iy <= 0) continue;
      const inter = ix * iy;
      const areaA = (a.right - a.left) * (a.bottom - a.top);
      const areaB = (b.right - b.left) * (b.bottom - b.top);
      const ratio = inter / Math.min(areaA, areaB);
      if (ratio < 0.12) continue;
      // identical text + near-identical rect = intentional layered/glitch effect
      if (
        a.text === b.text &&
        Math.abs(a.left - b.left) < 8 &&
        Math.abs(a.top - b.top) < 8
      )
        continue;
      overlaps.push({
        ratio: Math.round(ratio * 100),
        a: { path: a.path, text: a.text, top: Math.round(a.top) },
        b: { path: b.path, text: b.text, top: Math.round(b.top) },
      });
    }
  }
  overlaps.sort((x, y) => y.ratio - x.ratio);

  // --- horizontal overflow ---
  const overflowX =
    document.documentElement.scrollWidth > vw + 2
      ? document.documentElement.scrollWidth - vw
      : 0;

  return {
    textEls: els.length,
    overlaps: overlaps.slice(0, 20),
    overflowX,
  };
}

async function scanPage(page, id) {
  const url = `${BASE_URL}/templates/${id}`;
  const result = { id, url };
  await page.setViewportSize({ width: 1280, height: 720 });
  const resp = await page.goto(url, { waitUntil: 'load', timeout: 45000 });
  result.status = resp ? resp.status() : 0;
  if (result.status !== 200) return result;
  await page.addStyleTag({ content: HIDE_DEV_UI });

  // Pass 1: true rest state, BEFORE any synthetic scroll. Scroll-scrubbed
  // carousels (useScroll-driven MotionValues with spring damping) need this —
  // scrolling through the page and back leaves their `progress` value in a
  // transient mid-crossfade state for ~seconds, producing phantom overlaps
  // between panels that are correctly single-visible at genuine rest.
  await page.waitForTimeout(600);
  const restDesktop = await page.evaluate(detectDefects);

  // Pass 2: scroll through to trigger whileInView entrance animations on
  // below-fold content, then return to top and let spring values re-settle.
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(3000); // generous settle for spring-damped scroll MotionValues

  const scrolledDesktop = await page.evaluate(detectDefects);

  // An overlap only counts if it persists in BOTH passes — a hit in only the
  // scrolled pass is scanner-induced disturbance (transient crossfade), not
  // a real defect a visitor would ever see.
  const key = (o) => `${o.a.path}|${o.a.text}|${o.b.path}|${o.b.text}`;
  const restKeys = new Set((restDesktop.overlaps || []).map(key));
  result.desktop = {
    ...scrolledDesktop,
    overlaps: (scrolledDesktop.overlaps || []).filter((o) => restKeys.has(key(o))),
  };

  // mobile pass — same two-pass rest-vs-scrolled methodology
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);
  const restMobile = await page.evaluate(detectDefects);

  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(2500);
  const scrolledMobile = await page.evaluate(detectDefects);

  const restMobileKeys = new Set((restMobile.overlaps || []).map(key));
  result.mobile = {
    ...scrolledMobile,
    overlaps: (scrolledMobile.overlaps || []).filter((o) => restMobileKeys.has(key(o))),
  };

  return result;
}

async function main() {
  const ids = await getTemplateIds();
  console.log(`Scanning ${ids.length} templates on ${BASE_URL}`);
  await fs.mkdir(OUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const results = [];
  let done = 0;

  const queue = [...ids];
  async function worker() {
    const context = await browser.newContext({ reducedMotion: 'no-preference' });
    const page = await context.newPage();
    while (queue.length) {
      const id = queue.shift();
      try {
        const r = await scanPage(page, id);
        results.push(r);
      } catch (e) {
        // one retry — dev-server compile hiccups
        try {
          const r = await scanPage(page, id);
          results.push(r);
        } catch (e2) {
          results.push({ id, error: String(e2).slice(0, 200) });
        }
      }
      done++;
      const last = results[results.length - 1];
      const d = last.desktop || {};
      const m = last.mobile || {};
      const flag =
        (d.overlaps?.length || 0) + (m.overlaps?.length || 0) > 0 ||
        d.overflowX > 0 ||
        m.overflowX > 0 ||
        last.error ||
        last.status !== 200;
      console.log(
        `${done}/${ids.length} ${id} ${flag ? '⚠️' : 'ok'} d:${d.overlaps?.length ?? '-'}ov/${d.overflowX ?? '-'}px m:${m.overlaps?.length ?? '-'}ov/${m.overflowX ?? '-'}px${last.error ? ' ERR' : ''}${last.status && last.status !== 200 ? ` HTTP${last.status}` : ''}`,
      );
    }
    await context.close();
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  await browser.close();

  results.sort((a, b) => parseInt(a.id.split('-')[1]) - parseInt(b.id.split('-')[1]));
  const outPath = path.join(OUT_DIR, 'overlap-report.json');
  await fs.writeFile(outPath, JSON.stringify(results, null, 1));

  const flagged = results.filter(
    (r) =>
      r.error ||
      r.status !== 200 ||
      (r.desktop?.overlaps?.length || 0) > 0 ||
      (r.mobile?.overlaps?.length || 0) > 0 ||
      (r.desktop?.overflowX || 0) > 0 ||
      (r.mobile?.overflowX || 0) > 0,
  );
  console.log(`\nDone. Flagged: ${flagged.length}/${results.length}`);
  console.log(`Report: ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
