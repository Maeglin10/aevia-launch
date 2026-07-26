// Hero layout audit — flags two specific bugs across the template catalogue:
//   1. Header overlaps/clips the hero H1 (title hidden under a sticky/fixed nav).
//   2. Primary hero CTA requires scrolling to see on initial load (below the fold).
// Runs at 3 breakpoints per template since either bug is often responsive-only.
import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '6', 10);

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

async function getTemplateIds() {
  const templatesDir = path.join(__dirname, '..', 'app', 'templates');
  const entries = await fs.readdir(templatesDir);
  return entries.filter(e => /^impact-\d+$/.test(e))
    .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));
}

function rectsOverlap(a, b) {
  if (!a || !b) return false;
  const yOverlap = a.y < b.y + b.height && a.y + a.height > b.y;
  const xOverlap = a.x < b.x + b.width && a.x + a.width > b.x;
  return yOverlap && xOverlap;
}

async function auditOne(browser, id) {
  const perBreakpoint = {};
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
      await page.waitForTimeout(2200); // let hero reveal animations settle, no scroll

      const h1Count = await page.locator('h1').count();
      if (h1Count === 0) {
        perBreakpoint[bp.name] = { status: 'NO_H1' };
        continue;
      }
      const h1Box = await page.locator('h1').first().boundingBox();
      if (!h1Box) {
        perBreakpoint[bp.name] = { status: 'NO_H1_BBOX' };
        continue;
      }

      // Header/nav: first header element, or first element with position fixed/sticky
      // near the top that looks like a nav bar.
      const headerBox = await page.evaluate(() => {
        const el = document.querySelector('header') || document.querySelector('nav');
        if (!el) return null;
        const cs = getComputedStyle(el);
        if (cs.position !== 'fixed' && cs.position !== 'sticky') return null; // only care if it overlays content
        const r = el.getBoundingClientRect();
        return { x: r.x, y: r.y, width: r.width, height: r.height };
      });

      // Primary hero CTA: first visible a/button after the H1 in DOM order,
      // excluding anything inside header/nav.
      const ctaBox = await page.evaluate(() => {
        const h1 = document.querySelector('h1');
        if (!h1) return null;
        const header = document.querySelector('header');
        const nav = document.querySelector('nav');
        const candidates = Array.from(document.querySelectorAll('a, button'));
        for (const el of candidates) {
          if (header && header.contains(el)) continue;
          if (nav && nav.contains(el)) continue;
          // must come after h1 in DOM order
          if (!(h1.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)) continue;
          const r = el.getBoundingClientRect();
          if (r.width < 4 || r.height < 4) continue;
          const text = (el.textContent || '').trim();
          if (!text && !el.querySelector('svg')) continue;
          return { x: r.x, y: r.y, width: r.width, height: r.height, text: text.slice(0, 40) };
        }
        return null;
      });

      const headerOverlapsH1 = rectsOverlap(headerBox, h1Box);
      const ctaRequiresScroll = ctaBox ? (ctaBox.y + ctaBox.height > bp.height) : null;
      const gapAboveH1 = headerBox ? Math.round(h1Box.y - (headerBox.y + headerBox.height)) : Math.round(h1Box.y);

      perBreakpoint[bp.name] = {
        status: 'OK',
        headerOverlapsH1,
        ctaFound: !!ctaBox,
        ctaText: ctaBox?.text ?? null,
        ctaRequiresScroll,
        gapAboveH1,
        h1Top: Math.round(h1Box.y),
        h1Bottom: Math.round(h1Box.y + h1Box.height),
        viewportHeight: bp.height,
      };
    } catch (err) {
      perBreakpoint[bp.name] = { status: 'ERROR', error: err.message.split('\n')[0] };
    } finally {
      await ctx.close();
    }
  }
  return { id, ...perBreakpoint };
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

  console.log(`Auditing ${target.length} templates x ${BREAKPOINTS.length} breakpoints on ${BASE_URL}, concurrency=${CONCURRENCY}`);
  const browser = await chromium.launch({ headless: true });
  const results = [];
  let done = 0;

  const queue = [...target];
  async function worker() {
    while (queue.length) {
      const id = queue.shift();
      const r = await auditOne(browser, id);
      results.push(r);
      done++;
      process.stdout.write(`\r${done}/${target.length} — ${id}`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()));
  await browser.close();

  results.sort((a, b) => parseInt(a.id.split('-')[1]) - parseInt(b.id.split('-')[1]));

  const headerClips = [];
  const ctaScrolls = [];
  for (const r of results) {
    for (const bp of BREAKPOINTS) {
      const d = r[bp.name];
      if (!d || d.status !== 'OK') continue;
      if (d.headerOverlapsH1) headerClips.push({ id: r.id, breakpoint: bp.name });
      if (d.ctaRequiresScroll) ctaScrolls.push({ id: r.id, breakpoint: bp.name, gapAboveH1: d.gapAboveH1, ctaText: d.ctaText });
    }
  }

  console.log('\n\n=== HEADER CLIPS TITLE ===');
  for (const c of headerClips) console.log(`${c.id} @ ${c.breakpoint}`);
  console.log(`\n=== CTA REQUIRES SCROLL (${ctaScrolls.length}) ===`);
  for (const c of ctaScrolls) console.log(`${c.id} @ ${c.breakpoint}  gapAboveH1=${c.gapAboveH1}px  cta="${c.ctaText}"`);

  await fs.mkdir(path.join(__dirname, '..', 'audit-results'), { recursive: true });
  await fs.writeFile(
    path.join(__dirname, '..', 'audit-results', 'hero-layout-audit.json'),
    JSON.stringify({ results, headerClips, ctaScrolls }, null, 2)
  );
  console.log('\nSaved to audit-results/hero-layout-audit.json');
}

main().catch(err => { console.error(err); process.exit(1); });
