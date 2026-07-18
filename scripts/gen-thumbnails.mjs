import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('/Users/milliandvalentin/skylaunch/node_modules/sharp');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THUMBNAILS_DIR = path.join(__dirname, '..', 'public', 'thumbnails');
const BASE_URL = `http://localhost:${process.env.PORT || 3000}`;
const VIEWPORT = { width: 1280, height: 720 };

// CSS injected before screenshot to hide dev UI noise
const HIDE_DEV_UI = `
  nextjs-portal,
  [data-nextjs-portal],
  #__next-build-watcher,
  #nextjs__container_errors_desc,
  [data-nextjs-toast],
  button[data-nextjs-errors-close-button] { display: none !important; }
  /* Hide Turbopack issues button */
  div[style*="position: fixed"][style*="bottom"][style*="left"] button,
  div[style*="position:fixed"][style*="bottom"][style*="left"] button { display: none !important; }
  /* Hide cookie banner — various selectors used in templates */
  [class*="cookie"], [id*="cookie"], [class*="Cookie"], [id*="Cookie"],
  [class*="consent"], [id*="consent"],
  [class*="banner"], [id*="banner"] { display: none !important; }
  /* Hide chatbot / webchat widget */
  #aevia-webchat-root { display: none !important; }
`;

async function getTemplateIds() {
  const templatesDir = path.join(__dirname, '..', 'app', 'templates');
  const entries = await fs.readdir(templatesDir);
  return entries
    .filter(e => /^impact-\d+$/.test(e))
    .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));
}

// Templates where scroll-0 shows empty canvas — capture mid-scroll instead
const SCROLL_OFFSETS = {
  'impact-217': 0,     // AirForge — parallax hero (real photo) is the money shot
  'impact-218': 0,     // Domaine Miroir — parallax hero (real vineyard photo)
  'impact-220': 0,     // Hora Viva — parallax hero (real watch photo)
  'impact-221': 0,     // Lumyx — parallax hero (real photo)
};

async function main() {
  await fs.mkdir(THUMBNAILS_DIR, { recursive: true });

  const ids = await getTemplateIds();
  const arg = process.argv[2];
  let target;
  if (arg === '--missing') {
    // Only templates that don't yet have a thumbnail file.
    const existing = new Set((await fs.readdir(THUMBNAILS_DIR)).map((f) => f.replace(/\.\w+$/, '')));
    target = ids.filter((id) => !existing.has(id));
  } else if (arg) {
    target = [arg];
  } else {
    target = ids;
  }
  console.log(`Capturing ${target.length} templates on ${BASE_URL}`);

  const browser = await chromium.launch({ headless: true });

  let done = 0;
  const failed = [];

  for (const id of target) {
    const ctx = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    page.on('console', () => {});

    const url = `${BASE_URL}/templates/${id}`;
    const outPath = path.join(THUMBNAILS_DIR, `${id}.webp`);

    try {
      await page.addInitScript(() => {
        // Pre-accept cookies so the banner never mounts
        const consent = JSON.stringify({ essential: true, analytics: true, marketing: false, ts: Date.now() });
        localStorage.setItem('aevia-cookie-consent', consent);
        localStorage.setItem('aevia-consent', consent);
        // Silence React hydration noise
        const origError = console.error;
        console.error = (...args) => {
          const msg = args[0]?.toString?.() || '';
          if (msg.includes('Hydration') || msg.includes('hydration') || msg.includes('did not match')) return;
          origError.apply(console, args);
        };
      });

      await page.goto(url, { waitUntil: 'networkidle', timeout: 20000 });

      // Scroll to a better position for canvas/animation templates
      const scrollY = SCROLL_OFFSETS[id] ?? 0;
      if (scrollY > 0) {
        await page.evaluate((y) => window.scrollTo(0, y), scrollY);
        await page.waitForTimeout(800); // let scroll-driven animations update
      }

      // Inject CSS to hide dev noise, webchat button, and any remaining banners
      await page.addStyleTag({ content: HIDE_DEV_UI });

      // Also force-hide via JS: remove any element fixed to bottom that has cookie text
      await page.evaluate(() => {
        // Hide Turbopack/Next.js dev overlays
        document.querySelectorAll('nextjs-portal, [data-nextjs-portal]').forEach(el => el.remove());
        // Hide webchat button (shadow DOM host)
        ['aevia-webchat-widget', 'skybot-webchat-widget', 'aevia-webchat-root'].forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = 'none';
        });
        // Hide any remaining fixed-bottom banners (cookie etc.)
        document.querySelectorAll('*').forEach(el => {
          const style = window.getComputedStyle(el);
          if (style.position === 'fixed' && style.bottom !== 'auto' && style.bottom !== '' &&
              (el.textContent || '').includes('cookie')) {
            el.style.display = 'none';
          }
        });
      });

      // Wait for animations/fonts to settle (5 seconds as requested)
      await page.waitForTimeout(5000);

      const jpegBuffer = await page.screenshot({
        type: 'jpeg',
        quality: 92,
        clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
      });

      await sharp(jpegBuffer).webp({ quality: 85 }).toFile(outPath);

      done++;
      process.stdout.write(`\r${done}/${target.length} — ${id}`);
    } catch (err) {
      process.stdout.write(`\n✗ FAILED ${id}: ${err.message}\n`);
      failed.push(id);
    } finally {
      await ctx.close();
    }
  }

  await browser.close();
  console.log(`\n\nDone: ${done}/${target.length}`);
  if (failed.length > 0) console.log(`Failed: ${failed.join(', ')}`);
}

main().catch(err => { console.error(err); process.exit(1); });
