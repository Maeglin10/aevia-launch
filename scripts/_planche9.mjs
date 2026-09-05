/* Assemble 9 vignettes de héros en une planche 3×3 étiquetée. */
import sharp from "sharp";
import fs from "node:fs";

const [sortie, ...themes] = process.argv.slice(2);
const CASE_L = 426, CASE_H = 300, MARGE = 26;
const comps = [];
for (let i = 0; i < themes.length && i < 9; i++) {
  const f = `captures/heros/${themes[i]}.jpeg`;
  if (!fs.existsSync(f)) continue;
  const x = (i % 3) * CASE_L, y = Math.floor(i / 3) * (CASE_H + MARGE) + MARGE;
  comps.push({ input: f, left: x, top: y });
  const svg = `<svg width="${CASE_L}" height="${MARGE}"><text x="6" y="18" font-size="15" font-family="sans-serif" fill="#111">${themes[i]}</text></svg>`;
  comps.push({ input: Buffer.from(svg), left: x, top: y - MARGE });
}
await sharp({ create: { width: CASE_L * 3, height: (CASE_H + MARGE) * 3, channels: 3, background: "#ffffff" } })
  .composite(comps).jpeg({ quality: 78 }).toFile(sortie);
console.log(sortie);
