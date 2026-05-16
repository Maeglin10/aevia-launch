#!/usr/bin/env node
/**
 * Generate WebP thumbnail screenshots for all visible templates.
 *
 * Usage:
 *   1. npm install puppeteer --save-dev
 *   2. Start the dev server: npm run dev  (or set BASE_URL to production URL)
 *   3. node scripts/screenshot-templates.js
 *
 * Outputs: public/thumbnails/[id].webp  (640×400, WebP quality 75)
 * Screenshots at 1280×800 then downsampled — cwebp must be installed (brew install webp).
 */

const puppeteer = require("puppeteer");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUT_DIR = path.join(__dirname, "..", "public", "thumbnails");
const CONCURRENCY = 2; // parallel tabs (keep low for remote URLs)
const VIEWPORT = { width: 1280, height: 800 };
const QUALITY = 80;
const TIMEOUT = 30_000;

// ── All visible templates (site builder + quality impact) ─────────────────────
const SITE_BUILDER = [
  "landing", "saas", "agency", "vitrine", "consultant", "portfolio",
  "ecommerce", "restaurant", "hotel", "healthcare", "realestate",
  "fitness", "event", "nonprofit", "startup",
  "luxury", "brutalist", "magazine", "aurora", "3d-tech", "minimal-pro",
  "marketplace", "livestream",
];

// Impact templates currently visible after quality audit (650+ lines, all loading)
const IMPACT_VISIBLE = [
  // Originals / early elevated
  "impact-01", "impact-02", "impact-03", "impact-04", "impact-05",
  // Round 1 rewrites (716-1952 lines, all premium)
  "impact-10", "impact-11", "impact-12", "impact-13", "impact-14", "impact-15",
  "impact-16", "impact-17", "impact-18", "impact-19", "impact-20", "impact-21",
  "impact-22", "impact-23", "impact-24", "impact-25", "impact-26", "impact-27",
  "impact-28", "impact-29",
  // Round 2 rewrites (800-1808 lines, all premium)
  "impact-30", "impact-31", "impact-32", "impact-33", "impact-34", "impact-35",
  "impact-36", "impact-37", "impact-38", "impact-39", "impact-40", "impact-41",
  "impact-42", "impact-43", "impact-44", "impact-45", "impact-46", "impact-47",
  "impact-48", "impact-49",
  // Elevated batch (700-1100 lines)
  "impact-57", "impact-58", "impact-61", "impact-63", "impact-64",
  "impact-68", "impact-69", "impact-72",
  "impact-81", "impact-82", "impact-83", "impact-84", "impact-85", "impact-86",
  "impact-88", "impact-89", "impact-90", "impact-91",
  "impact-94", "impact-95", "impact-96",
  "impact-112", "impact-114", "impact-115",
  // Antigravity batch
  "impact-126", "impact-130", "impact-131", "impact-132", "impact-133", "impact-134", "impact-135",
  // Recent rewrite batch (visible minus duplicates)
  "impact-157", "impact-158",
  "impact-161", "impact-162", "impact-163", "impact-164", "impact-165", "impact-166",
  "impact-167", "impact-168", "impact-169", "impact-170", "impact-171",
  "impact-172", "impact-173", "impact-174", "impact-175", "impact-176",
  // Latest batch
  "impact-196", "impact-197", "impact-198", "impact-199", "impact-200", "impact-201",
];

const ALL_TEMPLATES = [
  ...IMPACT_VISIBLE.map((id) => ({ id, href: `/templates/${id}` })),
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function screenshotTemplate(browser, template, attempt = 1) {
  const outPath = path.join(OUT_DIR, `${template.id}.webp`);

  // Skip if already exists (re-run is additive; use --force to regenerate all)
  if (!process.argv.includes("--force") && fs.existsSync(outPath)) {
    console.log(`  skip  ${template.id} (exists)`);
    return;
  }

  const page = await browser.newPage();
  await page.setViewport(VIEWPORT);

  try {
    await page.goto(`${BASE_URL}${template.href}`, {
      waitUntil: "domcontentloaded",
      timeout: TIMEOUT,
    });

    // Wait for images + animations to settle
    await sleep(2000);

    // Hide scrollbar + fixed elements that bleed (chat widgets etc.)
    await page.evaluate(() => {
      document.documentElement.style.overflow = "hidden";
      document.querySelectorAll("[data-radix-portal], [data-floating-ui-portal]")
        .forEach((el) => el.remove());
    });

    const tmpPath = outPath.replace(".webp", "_tmp.webp");
    await page.screenshot({
      path: tmpPath,
      type: "webp",
      quality: QUALITY,
      clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
    });
    // Downsample to 640×400 for fast gallery loading (~69% size reduction)
    execSync(`cwebp -q 75 -resize 640 400 "${tmpPath}" -o "${outPath}" -quiet`);
    fs.unlinkSync(tmpPath);

    console.log(`  ✅  ${template.id}`);
  } catch (err) {
    console.error(`  ❌  ${template.id} (attempt ${attempt}): ${err.message}`);
    if (attempt < 3) {
      await page.close().catch(() => {});
      await sleep(3000);
      return screenshotTemplate(browser, template, attempt + 1);
    }
  } finally {
    await page.close().catch(() => {});
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────
async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log(`\n🚀 Screenshotting ${ALL_TEMPLATES.length} templates → ${OUT_DIR}\n`);
  console.log(`   Base URL : ${BASE_URL}`);
  console.log(`   Concurrency : ${CONCURRENCY}`);
  console.log(`   Use --force to regenerate existing thumbnails\n`);

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
  });

  // Process in parallel batches
  for (let i = 0; i < ALL_TEMPLATES.length; i += CONCURRENCY) {
    const batch = ALL_TEMPLATES.slice(i, i + CONCURRENCY);
    await Promise.all(batch.map((t) => screenshotTemplate(browser, t)));
    process.stdout.write(`  [${Math.min(i + CONCURRENCY, ALL_TEMPLATES.length)}/${ALL_TEMPLATES.length}]\n`);
    await sleep(1000); // brief pause between batches to avoid rate limiting
  }

  await browser.close();
  console.log("\n✅ Done! Thumbnails saved to public/thumbnails/");
  console.log("   Next: git add public/thumbnails && git commit -m 'feat: add template thumbnails'\n");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
