/* Ce qu'un visiteur français voit encore en anglais, thème par thème.
   Le texte COMPLET, jamais tronqué : une clé de dictionnaire tronquée ne
   correspond à rien. */
import { chromium } from "playwright";

/* Par défaut le serveur de développement ; BASE_URL permet de mesurer sur la
   version construite, bien plus rapide et plus proche de la production. */
const BASE = process.env.BASE_URL || "http://localhost:3000";
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 }, locale: "fr-FR" });
await ctx.addInitScript(() => { try { localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, ts: 1 })); } catch {} });
for (const t of process.argv.slice(2)) {
  const p = await ctx.newPage();
  try {
    await p.goto(`${BASE}/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await p.waitForTimeout(4200);
    const out = await p.evaluate(() => {
      const EN = /\b(the|and|with|your|our|from|about|home|book now|read more|learn more|get started|sign in|discover|welcome|view all|contact us|we |they |their|this |that |which|been|have|has |are |is a|for a|to a)\b/i;
      const FR = /\b(le|la|les|des|une|nous|vous|votre|notre|pour|avec|sur|dans|est|sont|et|ou|qui|que|plus|tout|sans|chez|nos|vos)\b/i;
      const res = [];
      const m = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = m.nextNode(); n; n = m.nextNode()) {
        const s = (n.nodeValue || "").trim();
        if (s.length < 3 || !EN.test(s)) continue;
        if (FR.test(s) && !/\b(the|and|with|your|our|we |they )\b/i.test(s)) continue;
        const e = n.parentElement;
        if (!e || e.closest("style,script,noscript")) continue;
        const r = e.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        res.push(s);
      }
      return [...new Set(res)];
    });
    console.log(`\n══ ${t} ══ ${out.length} texte(s)`);
    for (const s of out) console.log("· " + s);
  } catch (e) { console.log(`\n══ ${t} ══ ERREUR ${String(e).slice(0, 60)}`); }
  await p.close();
}
await nav.close();
