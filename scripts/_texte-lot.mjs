/* Texte rendu d'une liste de routes — un seul navigateur, N pages.
     BASE_URL=… node scripts/_texte-lot.mjs routes.txt dossier-sortie/ */
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const [fRoutes, dSortie] = process.argv.slice(2);
fs.mkdirSync(dSortie, { recursive: true });
const routes = fs.readFileSync(fRoutes, "utf8").split("\n").filter(Boolean);

const nav = await chromium.launch();
const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 1280, height: 900 } });
await ctx.addInitScript(() => {
  try {
    localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
    localStorage.setItem("site-analytics-consent", "refused");
  } catch {}
});
const p = await ctx.newPage();
for (const r of routes) {
  const nom = r.replace(/^\/templates\//, "").replace(/\//g, "__");
  try {
    await p.goto(`${BASE}${r}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await p.waitForTimeout(3000);
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
      return [...new Set(out)].join("\n");
    });
    fs.writeFileSync(`${dSortie}/${nom}.txt`, t);
    console.log(nom);
  } catch (e) {
    fs.writeFileSync(`${dSortie}/${nom}.txt`, `ÉCHEC ${String(e).slice(0, 80)}`);
    console.log(nom, "ÉCHEC");
  }
}
await nav.close();
