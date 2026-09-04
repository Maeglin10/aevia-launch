/* Le texte que la page affiche vraiment, découpé en morceaux lisibles.
   Pour relire un thème à la main : c'est ce que voit le visiteur, après
   traduction, pas ce qu'il y a dans le source.

     BASE_URL=http://localhost:3100 node scripts/_texte-rendu.mjs impact-01
*/
import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const nav = await chromium.launch();
const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 1280, height: 900 } });
await ctx.addInitScript(() => { try {
  localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
  localStorage.setItem("site-analytics-consent", "refused"); } catch {} });
const p = await ctx.newPage();
await p.goto(`${BASE}/templates/${process.argv[2]}`, { waitUntil: "domcontentloaded", timeout: 120000 });
await p.waitForTimeout(4200);
await p.evaluate(async () => {
  for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); }
  window.scrollTo(0, 0);
});
await p.waitForTimeout(600);
const t = await p.evaluate(() => {
  const out = [];
  const m = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = m.nextNode(); n; n = m.nextNode()) {
    const e = n.parentElement; if (!e) continue;
    if (e.closest("style,script,noscript,template")) continue;
    let cache = false;
    for (let a = e; a; a = a.parentElement) { const s = getComputedStyle(a);
      if (parseFloat(s.opacity) < 0.05 || s.visibility === "hidden" || s.display === "none") { cache = true; break; } }
    if (cache) continue;
    const v = (n.nodeValue || "").replace(/\s+/g, " ").trim();
    if (v) out.push(v);
  }
  return [...new Set(out)];
});
console.log(t.join("\n"));
await nav.close();
