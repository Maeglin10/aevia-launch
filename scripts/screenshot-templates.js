#!/usr/bin/env node
/**
 * Generate WebP thumbnail screenshots for all visible templates.
 *
 * Usage:
 *   npm install puppeteer --save-dev          (one-time)
 *   brew install webp                         (one-time, for cwebp)
 *
 *   # Against local dev server (fastest iteration):
 *   npm run dev &
 *   node scripts/screenshot-templates.js
 *
 *   # Against production:
 *   BASE_URL=https://launch.aevia.services node scripts/screenshot-templates.js --force
 *
 *   # Re-generate specific templates only:
 *   ONLY=impact-01,impact-22 node scripts/screenshot-templates.js --force
 *
 * Outputs: public/thumbnails/[id].webp  (640×400, WebP quality 80)
 * Screenshots at 1440×900 viewport — downsampled with cwebp.
 */

const puppeteer = require("puppeteer");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

// ── Config ─────────────────────────────────────────────────────────────────────
const BASE_URL   = process.env.BASE_URL || "http://localhost:3000";
const OUT_DIR    = path.join(__dirname, "..", "public", "thumbnails");
const TEMPLATES_DIR = path.join(__dirname, "..", "app", "templates");
const CONCURRENCY = parseInt(process.env.CONCURRENCY || "3", 10);
const VIEWPORT   = { width: 1440, height: 900 };
const TIMEOUT    = 45_000;
const FORCE      = process.argv.includes("--force");
const ONLY       = process.env.ONLY ? process.env.ONLY.split(",").map(s => s.trim()) : null;

// Templates that have no page.tsx yet (skip silently)
const SKIP = new Set(["impact-202", "impact-203", "impact-204", "impact-205", "impact-206"]);

// ── Auto-discover all templates ────────────────────────────────────────────────
function discoverTemplates() {
  if (!fs.existsSync(TEMPLATES_DIR)) return [];

  return fs.readdirSync(TEMPLATES_DIR)
    .filter((name) => {
      if (SKIP.has(name)) return false;
      if (ONLY && !ONLY.includes(name)) return false;
      const pagePath = path.join(TEMPLATES_DIR, name, "page.tsx");
      return fs.existsSync(pagePath);
    })
    .sort((a, b) => {
      // Natural sort: impact-2 before impact-10
      const num = (s) => parseInt(s.replace(/\D+/g, ""), 10) || 0;
      return num(a) - num(b);
    })
    .map((id) => ({ id, href: `/templates/${id}` }));
}

// ── Helpers ────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function screenshotTemplate(browser, template, attempt = 1) {
  const outPath = path.join(OUT_DIR, `${template.id}.webp`);

  if (!FORCE && fs.existsSync(outPath)) {
    console.log(`  skip  ${template.id} (exists — use --force to regenerate)`);
    return;
  }

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  // Simulate a real browser environment so animations run
  await page.setExtraHTTPHeaders({ "Accept-Language": "fr-FR,fr;q=0.9" });

  // Disable prefers-reduced-motion so Framer Motion animations actually run
  await page.emulateMediaFeatures([
    { name: "prefers-reduced-motion", value: "no-preference" },
  ]);

  try {
    await page.goto(`${BASE_URL}${template.href}`, {
      waitUntil: "networkidle2",
      timeout: TIMEOUT,
    });

    // Give React/Next.js a moment to hydrate
    await sleep(500);

    // ── Trigger scroll-based animations (Framer Motion useInView / IntersectionObserver)
    // Scroll down to activate observers near the hero, then return to top
    await page.evaluate(async () => {
      window.scrollTo({ top: 300, behavior: "instant" });
      await new Promise(r => setTimeout(r, 100));
      window.scrollTo({ top: 0, behavior: "instant" });
    });

    // Wait for entrance animations to complete (most Framer Motion transitions are 0.4–0.8s)
    await sleep(2500);

    // ── Clean up UI chrome that shouldn't appear in thumbnails
    await page.evaluate(() => {
      // Remove scrollbar
      document.documentElement.style.overflow = "hidden";
      // Remove chat widgets, floating portals
      document.querySelectorAll(
        "[data-radix-portal], [data-floating-ui-portal], iframe[title*='chat'], #intercom-container"
      ).forEach((el) => el.remove());
    });

    // ── Screenshot at full viewport size, then downsample to 640×400
    const tmpPath = outPath.replace(".webp", "_tmp.webp");
    await page.screenshot({
      path: tmpPath,
      type: "webp",
      quality: 90,
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
    });

    execSync(`cwebp -q 80 -resize 640 400 "${tmpPath}" -o "${outPath}" -quiet`);
    fs.unlinkSync(tmpPath);

    console.log(`  ✅  ${template.id}`);
  } catch (err) {
    console.error(`  ❌  ${template.id} (attempt ${attempt}): ${err.message}`);
    if (attempt < 3) {
      await page.close().catch(() => {});
      await sleep(4000);
      return screenshotTemplate(browser, template, attempt + 1);
    }
  } finally {
    await page.close().catch(() => {});
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const templates = discoverTemplates();

  if (templates.length === 0) {
    console.error("No templates found. Make sure you're running from the skylaunch root.");
    process.exit(1);
  }

  console.log(`\n🚀  ${templates.length} templates → ${OUT_DIR}`);
  console.log(`    Base URL    : ${BASE_URL}`);
  console.log(`    Concurrency : ${CONCURRENCY}`);
  console.log(`    Force regen : ${FORCE}`);
  if (ONLY) console.log(`    Filter      : ${ONLY.join(", ")}`);
  console.log();

  const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-gpu",
      "--disable-web-security", // needed for some font/image cross-origin
      "--font-render-hinting=none",
    ],
  });

  let done = 0;
  for (let i = 0; i < templates.length; i += CONCURRENCY) {
    const batch = templates.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map((t) => screenshotTemplate(browser, t)));
    done = Math.min(i + CONCURRENCY, templates.length);
    process.stdout.write(`  [${done}/${templates.length}]\n`);
    await sleep(500); // brief pause between batches
  }

  await browser.close();
  console.log("\n✅  Done! Thumbnails saved to public/thumbnails/");
  console.log("    Next: git add public/thumbnails && git commit -m 'feat: regenerate template thumbnails'");
  console.log("          vercel --prod --yes\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
