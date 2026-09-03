/* Une seconde lecture, plus large que la première.

   Le premier filtre ne repérait un texte anglais qu'à ses mots-outils — the,
   and, your. « RESERVE A TABLE » et « FINE DINING » n'en contiennent aucun :
   ils sont passés à travers, et sont restés en production. Celui-ci regarde
   les mots pleins du vocabulaire courant des thèmes. */
import { chromium } from "playwright";
const MOTS = /\b(reserve|table|dining|fine|book|booking|discover|explore|view|shop|learn|start|join|contact|about|home|menu|team|story|works|services|pricing|features|gallery|studio|collection|now|free|call|send|read|watch|play|buy|order|sign|log|get|our|your|the|and|with|from|for)\b/i;
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 }, locale: "fr-FR" });
await ctx.addInitScript(() => { try { localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, ts: 1 })); } catch {} });
for (const t of process.argv.slice(2)) {
  const p = await ctx.newPage();
  try {
    await p.goto(`http://localhost:3000/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await p.waitForTimeout(4500);
    const out = await p.evaluate((src) => {
      const MOTS = new RegExp(src, "i");
      const FR = /[àâäéèêëîïôöùûüçœ]|\b(le|la|les|des|une|nous|vous|votre|notre|pour|avec|sur|dans|est|sont|et|ou|qui|que|plus|tout|sans|chez|nos|vos|un|du|au|aux)\b/i;
      const res = [];
      const m = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = m.nextNode(); n; n = m.nextNode()) {
        const s = (n.nodeValue || "").trim();
        if (s.length < 3 || s.length > 90) continue;
        if (!MOTS.test(s) || FR.test(s)) continue;
        const e = n.parentElement;
        if (!e || e.closest("style,script,noscript,code,pre")) continue;
        const r = e.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        res.push(s);
      }
      return [...new Set(res)];
    }, MOTS.source);
    if (out.length) { console.log(`\n══ ${t} ══`); for (const s of out) console.log("· " + s); }
  } catch (e) { console.log(`\n══ ${t} ══ ERREUR`); }
  await p.close();
}
await nav.close();
