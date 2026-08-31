/* Le texte du héros se lit-il sur la photo ?

   La diversification a remplacé des photos sans regarder leur luminosité :
   une photo claire sous un titre blanc rend la page illisible. On mesure au
   rendu — pas au fichier : on prend le titre du héros, sa couleur calculée,
   et la luminosité MOYENNE des pixels derrière lui, capture à l'appui.

   Le rapport de contraste est celui du WCAG. En dessous de 3, un grand titre
   n'est plus lisible ; en dessous de 4,5, un texte courant ne l'est pas. */
import { chromium } from "playwright";
import fs from "node:fs";
import { createRequire } from "module";
const sharp = createRequire(import.meta.url)("sharp");

const themes = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 860 } });
const mauvais = [];

const lum = (r, g, b) => {
  const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};

for (const t of themes) {
  const p = await ctx.newPage();
  try {
    await p.goto(`http://localhost:3000/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await p.waitForTimeout(3500);
    const info = await p.evaluate(() => {
      const h1 = document.querySelector("h1");
      if (!h1) return null;
      const b = h1.getBoundingClientRect();
      if (b.width < 40 || b.top > 800) return null;
      const c = getComputedStyle(h1).color.match(/\d+/g).map(Number);
      return { x: Math.max(0, b.x), y: Math.max(0, b.y), w: Math.min(b.width, 1280), h: Math.min(b.height, 400), c };
    });
    if (!info) { await p.close(); continue; }
    const png = await p.screenshot({ clip: { x: info.x, y: info.y, width: Math.max(8, info.w), height: Math.max(8, info.h) } });
    /* La luminosité moyenne du fond derrière le titre. */
    const st = await sharp(png).stats();
    const [r, g, bl] = st.channels.slice(0, 3).map((c) => c.mean);
    const L1 = lum(info.c[0], info.c[1], info.c[2]), L2 = lum(r, g, bl);
    const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    if (ratio < 3) mauvais.push([t, Number(ratio.toFixed(2))]);
  } catch {}
  await p.close();
}
await nav.close();
mauvais.sort((a, b) => a[1] - b[1]);
mauvais.forEach(([t, r]) => console.log(`${t} : contraste ${r}`));
console.log(`\n${themes.length} thèmes · ${mauvais.length} titres sous le seuil de 3`);
fs.writeFileSync("captures/contact/lisibilite.json", JSON.stringify(mauvais, null, 2));
