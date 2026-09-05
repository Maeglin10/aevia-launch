/* Les liens qui ne mènent nulle part.

   Trois thèmes revus à la main avaient le même défaut : un lien « #cible »
   dont la cible n'existe pas — libellé traduit, identifiant resté anglais,
   ou construit par `label.toLowerCase()`. Le clic ne fait rien, sans erreur.

   Pour chaque page : chaque `href="#…"` doit trouver son élément, et chaque
   lien interne `/templates/…` doit répondre 200.

     BASE_URL=… node scripts/_ancres.mjs impact-01 impact-02 …
*/
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const nav = await chromium.launch();
const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 1280, height: 900 } });
await ctx.addInitScript(() => {
  try {
    localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
    localStorage.setItem("site-analytics-consent", "refused");
  } catch {}
});
const p = await ctx.newPage();
const vusInternes = new Map(); // route -> status, partagé entre thèmes

for (const theme of process.argv.slice(2)) {
  try {
    await p.goto(`${BASE}/templates/${theme}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await p.waitForTimeout(2500);
    const { casses, internes } = await p.evaluate(() => {
      const casses = [];
      const internes = new Set();
      for (const a of document.querySelectorAll("a[href]")) {
        const h = a.getAttribute("href") || "";
        const txt = (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 30);
        if (h.startsWith("#")) {
          if (h === "#" || h === "#!") continue; /* volontairement inertes */
          const id = decodeURIComponent(h.slice(1));
          if (!document.getElementById(id) && !document.getElementsByName(id).length)
            casses.push(`#${id} (« ${txt} »)`);
        } else if (h.startsWith("/templates/")) {
          internes.add(h.split("#")[0].split("?")[0]);
        }
      }
      return { casses: [...new Set(casses)], internes: [...internes] };
    });
    const morts = [];
    for (const r of internes) {
      if (!vusInternes.has(r)) {
        const rep = await p.request.get(`${BASE}${r}`, { timeout: 30000 }).catch(() => null);
        vusInternes.set(r, rep ? rep.status() : 0);
      }
      if (vusInternes.get(r) !== 200) morts.push(`${r} → ${vusInternes.get(r)}`);
    }
    if (casses.length || morts.length) {
      console.log(`${theme} | ${casses.length} ancre(s) morte(s), ${morts.length} lien(s) mort(s)`);
      for (const c of casses.slice(0, 6)) console.log(`   ancre ${c}`);
      for (const m of morts.slice(0, 4)) console.log(`   lien ${m}`);
    } else {
      console.log(`${theme} | rien`);
    }
  } catch (e) {
    console.log(`${theme} | échec ${String(e).slice(0, 60)}`);
  }
}
await nav.close();
