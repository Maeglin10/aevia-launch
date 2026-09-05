/* Neuf héros par planche, pour juger la cohérence photo/métier à l'œil. */
import { chromium } from "playwright";
import sharp from "sharp";
import fs from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const themes = process.argv.slice(2);
fs.mkdirSync("captures/heros", { recursive: true });

const nav = await chromium.launch();
const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 1280, height: 900 } });
await ctx.addInitScript(() => {
  try {
    localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
    localStorage.setItem("site-analytics-consent", "refused");
  } catch {}
});
const p = await ctx.newPage();
for (const t of themes) {
  try {
    await p.goto(`${BASE}/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await p.waitForTimeout(2800);
    const png = await p.screenshot();
    await sharp(png).resize(426, 300).jpeg({ quality: 70 }).toFile(`captures/heros/${t}.jpeg`);
    console.log(t);
  } catch { console.log(t, "ÉCHEC"); }
}
await nav.close();
