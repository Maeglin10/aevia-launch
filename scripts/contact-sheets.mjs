/**
 * contact-sheets.mjs — composite thumbnails into labeled 2x2 contact sheets
 * for visual review. Reads public/thumbnails/impact-*.webp, writes PNG sheets
 * to the directory given as argv[2].
 */
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const sharp = require('/Users/milliandvalentin/skylaunch/node_modules/sharp');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THUMBS = path.join(__dirname, '..', 'public', 'thumbnails');
const OUT = process.argv[2];
const CELL_W = 640;
const CELL_H = 360;

const label = (text) =>
  Buffer.from(
    `<svg width="${CELL_W}" height="28"><rect width="${CELL_W}" height="28" fill="black" opacity="0.75"/><text x="8" y="20" font-family="Helvetica" font-size="17" font-weight="bold" fill="#00ff88">${text}</text></svg>`,
  );

async function main() {
  await fs.mkdir(OUT, { recursive: true });
  const files = (await fs.readdir(THUMBS))
    .filter((f) => /^impact-\d+\.webp$/.test(f))
    .sort(
      (a, b) => parseInt(a.match(/\d+/)[0]) - parseInt(b.match(/\d+/)[0]),
    );

  // only keep thumbnails whose template still exists
  const templatesDir = path.join(__dirname, '..', 'app', 'templates');
  const live = new Set(await fs.readdir(templatesDir));
  const kept = files.filter((f) => live.has(f.replace('.webp', '')));

  let sheet = 0;
  for (let i = 0; i < kept.length; i += 4) {
    const batch = kept.slice(i, i + 4);
    const composites = [];
    for (let k = 0; k < batch.length; k++) {
      const id = batch[k].replace('.webp', '');
      const img = await sharp(path.join(THUMBS, batch[k]))
        .resize(CELL_W, CELL_H, { fit: 'cover', position: 'top' })
        .toBuffer();
      const x = (k % 2) * CELL_W;
      const y = Math.floor(k / 2) * CELL_H;
      composites.push({ input: img, left: x, top: y });
      composites.push({ input: label(id), left: x, top: y });
    }
    sheet++;
    const name = `sheet-${String(sheet).padStart(2, '0')}-${batch[0].replace('.webp', '')}-to-${batch[batch.length - 1].replace('.webp', '')}.png`;
    await sharp({
      create: {
        width: CELL_W * 2,
        height: CELL_H * 2,
        channels: 3,
        background: { r: 30, g: 30, b: 30 },
      },
    })
      .composite(composites)
      .png()
      .toFile(path.join(OUT, name));
  }
  console.log(`${sheet} sheets for ${kept.length} thumbnails -> ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
