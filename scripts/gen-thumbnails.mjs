import { chromium } from 'playwright';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('/Users/milliandvalentin/skylaunch/node_modules/sharp');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THUMBNAILS_DIR = path.join(__dirname, '..', 'public', 'thumbnails');
const BASE_URL = 'http://localhost:3001';
const VIEWPORT = { width: 1280, height: 720 };

async function getTemplateIds() {
  const templatesDir = path.join(__dirname, '..', 'app', 'templates');
  const entries = await fs.readdir(templatesDir);
  return entries
    .filter(e => /^impact-\d+$/.test(e))
    .sort((a, b) => parseInt(a.split('-')[1]) - parseInt(b.split('-')[1]));
}

async function main() {
  await fs.mkdir(THUMBNAILS_DIR, { recursive: true });

  const ids = await getTemplateIds();
  console.log(`Found ${ids.length} templates`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 });
  const page = await context.newPage();
  page.on('console', () => {});

  let done = 0;
  const failed = [];

  for (const id of ids) {
    const url = `${BASE_URL}/templates/${id}`;
    const outPath = path.join(THUMBNAILS_DIR, `${id}.webp`);

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 15000 });
      await page.waitForTimeout(800);

      const jpegBuffer = await page.screenshot({
        type: 'jpeg',
        quality: 92,
        clip: { x: 0, y: 0, width: VIEWPORT.width, height: VIEWPORT.height },
      });

      // Convert to webp using sharp
      await sharp(jpegBuffer)
        .webp({ quality: 85 })
        .toFile(outPath);

      done++;
      if (done % 10 === 0 || done === ids.length) {
        process.stdout.write(`\rProgress: ${done}/${ids.length}`);
      }
    } catch (err) {
      console.error(`\nFAILED ${id}: ${err.message}`);
      failed.push(id);
    }
  }

  await browser.close();

  console.log(`\n\nDone: ${done}/${ids.length}`);
  if (failed.length > 0) console.log(`Failed (${failed.length}): ${failed.join(', ')}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
