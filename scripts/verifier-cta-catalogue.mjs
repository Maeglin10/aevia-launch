/*
  Le balayage complet : chaque thème du catalogue, en 390 × 844.

    1. un appel à l'action visible SANS défiler ?
    2. en reste-t-il un APRÈS défilement ?

  Mesuré au navigateur, visibilité réelle testée : dimensions, opacité,
  display, et recouvrement par elementFromPoint.

    node scripts/verifier-cta-catalogue.mjs
*/
import { chromium } from "playwright";
import fs from "node:fs";

const BASE = `http://localhost:${process.env.PORT || 3000}`;
const tous = fs.readdirSync("app/templates").filter((d) => /^impact-\d+$/.test(d))
  .map((d) => Number(d.slice(7))).sort((a, b) => a - b);

const MOTS = "(r[ée]serv|rendez|devis|appel|contact|rappel|essai|inscri|demande|commander|joindre|visite|bilan|estimation|chiffrer|parler|organiser|bloquer|confier|panier|course|projet|audit|d[ée]gustation|urgence|book|call|quote)";

const releve = (motsSrc) => {
  const RE = new RegExp(motsSrc, "i");
  const vis = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 24 || r.height < 18 || r.bottom < 0 || r.top > innerHeight) return false;
    const s = getComputedStyle(el);
    if (s.visibility === "hidden" || s.display === "none" || +s.opacity < 0.2) return false;
    const d = document.elementFromPoint(Math.min(innerWidth - 1, r.left + r.width / 2), Math.min(innerHeight - 1, r.top + r.height / 2));
    return d === el || el.contains(d) || (d && d.contains(el));
  };
  const fixe = (el) => { for (let x = el; x && x !== document.body; x = x.parentElement) { const q = getComputedStyle(x).position; if (q === "fixed" || q === "sticky") return true; } return false; };
  const act = [...document.querySelectorAll("a[href],button")].filter((el) => {
    const h = (el.getAttribute("href") || "").toLowerCase();
    const t = (el.textContent || "").trim();
    return h.startsWith("tel:") || h.startsWith("mailto:") || (t.length > 2 && t.length < 60 && RE.test(t));
  });
  const v = act.filter(vis);
  return { total: v.length, fixes: v.filter(fixe).length };
};

const b = await chromium.launch({ headless: true });
const sansHaut = [], sansSticky = [], erreurs = [];
for (const n of tous) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 } });
  const p = await ctx.newPage();
  try {
    await p.addInitScript(() => { const c = JSON.stringify({ essential: true, analytics: true, marketing: false, ts: 1 }); localStorage.setItem("aevia-cookie-consent", c); localStorage.setItem("aevia-consent", c); });
    await p.goto(`${BASE}/templates/impact-${n}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    /* La barre globale s'examine à 1,4 s, 3,2 s et 6 s, puis à chaque
       défilement : on mesure après le dernier passage. */
    await p.waitForTimeout(6600);
    const haut = await p.evaluate(releve, MOTS);
    await p.evaluate(() => window.scrollTo(0, Math.min(2400, document.body.scrollHeight * 0.45)));
    await p.waitForTimeout(1300);
    const bas = await p.evaluate(releve, MOTS);
    if (haut.total === 0) sansHaut.push(n);
    if (bas.fixes === 0) sansSticky.push(n);
  } catch (e) { erreurs.push(n); }
  finally { await ctx.close(); }
}
await b.close();
console.log(`${tous.length} thèmes mesurés en 390 × 844 :`);
console.log(`  sans appel à l'action au premier regard      : ${sansHaut.length}`);
console.log(`  sans appel à l'action épinglé après défilement : ${sansSticky.length}`);
console.log(`  pages en erreur de chargement                : ${erreurs.length}  ${erreurs.slice(0,10).join(", ")}`);
console.log(`  (impact-1 à impact-9 rendent une page 404 : le thème n'existe pas, ce n'est pas un défaut d'appel à l'action)`);
if (sansHaut.length) console.log(`\n  haut : ${sansHaut.join(", ")}`);
if (sansSticky.length) console.log(`  épinglé : ${sansSticky.join(", ")}`);
fs.writeFileSync("/tmp/cta-catalogue.json", JSON.stringify({ sansHaut, sansSticky, erreurs }, null, 1));
