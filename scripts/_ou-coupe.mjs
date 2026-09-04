import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const [theme, larg = "390"] = process.argv.slice(2);
const nav = await chromium.launch();
const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: +larg, height: +larg === 390 ? 844 : 900 } });
await ctx.addInitScript(() => { try {
  localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
  localStorage.setItem("site-analytics-consent", "refused"); } catch {} });
const p = await ctx.newPage();
await p.goto(`${BASE}/templates/${theme}`, { waitUntil: "domcontentloaded", timeout: 90000 });
await p.waitForTimeout(3800);
console.log(await p.evaluate(() => {
  const vis = (e) => { for (let n = e; n; n = n.parentElement) { const s = getComputedStyle(n);
    if (parseFloat(s.opacity) < 0.05 || s.visibility === "hidden" || s.display === "none") return false; } return true; };
  const out = [];
  for (const e of document.querySelectorAll("section, div")) {
    if (!vis(e)) continue;
    const b = e.getBoundingClientRect();
    /* Le bloc doit être un HÉROS, pas la racine de la page : sans plafond
           de hauteur, on mesurait le document entier (8 193 px) et le moindre
           élément en position fixe, remonté par une animation, comptait comme
           « coupé ». */
        if (b.top > innerHeight * 0.25 || b.height < innerHeight * 0.45 || b.height > innerHeight * 1.6) continue;
    const st = getComputedStyle(e);
    if (st.overflow === "visible" && st.overflowY === "visible") continue;
    let manque = 0; const perdus = [];
    for (const x of e.querySelectorAll("a, button, [role='button'], p, h1, h2, span")) {
      if (!vis(x)) continue;
      const r = x.getBoundingClientRect();
      if (r.height < 8 || r.width < 8) continue;
      /* Une lettre de 192 px à 5 % d'opacité est un filigrane décoratif :
         la couper est voulu. Seul le contenu compte. */
      if (parseFloat(getComputedStyle(x).opacity) <= 0.12) continue;
      const d = r.bottom - b.bottom;
      if (d <= 2) continue;
      manque = Math.max(manque, Math.round(d));
      perdus.push((x.textContent || "").replace(/\s+/g, " ").trim().slice(0, 28));
    }
    if (!manque) continue;
    out.push(`${e.tagName.toLowerCase()} id=${e.id || "-"} cls="${(e.className||"").toString().slice(0,60)}" box=${Math.round(b.top)}..${Math.round(b.bottom)} h=${Math.round(b.height)} ov=${st.overflow} manque=${manque}px perdus=${JSON.stringify([...new Set(perdus)].slice(0,4))}`);
  }
  return out.slice(0, 4).join("\n") || "rien";
}));
await nav.close();
