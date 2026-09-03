/* Où, exactement, l'anglais est-il resté ?

   Le balayage dit « anglais our,your » sans dire dans quelle phrase. Ce relevé
   rend le texte affiché qui contient le mot, avec assez de contexte pour
   décider s'il s'agit d'une vraie fuite ou d'un nom propre — « Our Sound »
   dans un nom de groupe n'est pas la même chose qu'un bouton « Our services ».

     BASE_URL=http://localhost:3100 node scripts/_anglais-ou.mjs impact-06 …

   ⚠️ La traduction se fait DANS LE NAVIGATEUR : `curl` ne peut rien voir ici.
*/
import { chromium } from "playwright";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const MOTS = /\b(home|about|our|your|book now|view all|read more|learn more|contact us|get started|sign in|discover|welcome|opening hours|our story|our team|our services|see more|explore|shop now|subscribe|free trial|features)\b/i;

const nav = await chromium.launch();
for (const theme of process.argv.slice(2)) {
  const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(() => {
    try {
      localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
      localStorage.setItem("site-analytics-consent", "refused");
    } catch {}
  });
  const p = await ctx.newPage();
  try {
    await p.goto(`${BASE}/templates/${theme}`, { waitUntil: "networkidle", timeout: 60000 });
    /* Le dictionnaire du thème passe en plusieurs fois, sur près de trois
       secondes : mesurer trop tôt, c'est relever une page pas encore traduite. */
    await p.waitForTimeout(3500);
    const trouves = await p.evaluate((source) => {
      const re = new RegExp(source, "i");
      const out = [];
      for (const e of document.querySelectorAll("*")) {
        if (e.children.length) continue;
        const t = (e.textContent || "").replace(/\s+/g, " ").trim();
        if (!t || t.length > 120) continue;
        const s = getComputedStyle(e);
        if (s.visibility === "hidden" || s.display === "none") continue;
        if (re.test(t)) out.push(t);
      }
      return [...new Set(out)];
    }, MOTS.source);
    console.log(trouves.length ? `${theme} :` : `${theme} | rien`);
    for (const t of trouves.slice(0, 8)) console.log("   ", JSON.stringify(t));
  } catch (e) {
    console.log(`${theme} | échec ${String(e).slice(0, 60)}`);
  }
  await ctx.close();
}
await nav.close();
