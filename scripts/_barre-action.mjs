/* Ce que la barre d'action mobile affiche vraiment, thème par thème.

     BASE_URL=http://localhost:3100 node scripts/_barre-action.mjs impact-141 …
*/
import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const nav = await chromium.launch();
for (const theme of process.argv.slice(2)) {
  const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 390, height: 844 } });
  await ctx.addInitScript(() => { try {
    localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
    localStorage.setItem("site-analytics-consent", "refused");
  } catch {} });
  const p = await ctx.newPage();
  try {
    await p.goto(`${BASE}/templates/${theme}`, { waitUntil: "networkidle", timeout: 60000 });
    await p.waitForTimeout(2500);
    const r = await p.evaluate(() => {
      const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
      const pot = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      const enRGB = (c) => { pot.clearRect(0, 0, 1, 1); pot.fillStyle = c; pot.fillRect(0, 0, 1, 1); const [r, g, b] = pot.getImageData(0, 0, 1, 1).data; return [r, g, b]; };
      const barre = document.querySelector("[data-barre-action]");
      if (!barre) return null;
      const b = barre.querySelector("a, button");
      if (!b) return { vide: true };
      const s = getComputedStyle(b);
      const t = enRGB(s.color), f = enRGB(s.backgroundColor);
      const l1 = lum(t), l2 = lum(f);
      return { libelle: b.textContent.trim().slice(0, 30), encre: s.color, fond: s.backgroundColor, k: +((Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)).toFixed(2) };
    });
    console.log(theme, JSON.stringify(r));
  } catch (e) { console.log(theme, "échec", String(e).slice(0, 70)); }
  await ctx.close();
}
await nav.close();
