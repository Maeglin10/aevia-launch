/* Les mots collés par un saut de ligne JSX.

   `<span>Des piscines</span>{"\n"}<span>qui vous</span>` ne rend PAS d'espace :
   JSX supprime le retour à la ligne entre deux éléments frères. Le titre
   s'affiche « Des piscinesqui vousressemblent. » — impact-222 avait déjà payé
   ce défaut avec « Solisaccompagne ».

   On lit le texte RENDU, pas la source : seul le navigateur sait ce qui a été
   avalé.

     BASE_URL=http://localhost:3100 node scripts/_mots-colles.mjs impact-177 …
*/
import { chromium } from "playwright";
const BASE = process.env.BASE_URL || "http://localhost:3000";
const nav = await chromium.launch();
for (const theme of process.argv.slice(2)) {
  const ctx = await nav.newContext({ locale: "fr-FR", viewport: { width: 1280, height: 900 } });
  await ctx.addInitScript(() => { try {
    localStorage.setItem("aevia-cookie-consent", JSON.stringify({ essential: true, analytics: false, ts: 1 }));
    localStorage.setItem("site-analytics-consent", "refused");
  } catch {} });
  const p = await ctx.newPage();
  try {
    await p.goto(`${BASE}/templates/${theme}`, { waitUntil: "networkidle", timeout: 60000 });
    await p.waitForTimeout(1500);
    const colles = await p.evaluate(() => {
      const out = [];
      for (const e of document.querySelectorAll("h1, h2, h3, p, span, a, li, div")) {
        if (e.children.length === 0) continue;
        const t = (e.innerText || "").replace(/\s+/g, " ").trim();
        if (!t || t.length > 120) continue;
        /* Une minuscule ou un point suivi immédiatement d'une lettre : deux
           mots que rien ne sépare. On laisse passer les composés connus. */
        const m = t.match(/[a-zà-ÿ]{2}\.?[A-ZÀ-Ý][a-zà-ÿ]{2}|[a-zà-ÿ]{3}[A-ZÀ-Ý]/g);
        if (m) out.push({ t, m: [...new Set(m)] });
      }
      return out;
    });
    console.log(colles.length ? `${theme} :` : `${theme} | rien`);
    for (const c of colles.slice(0, 6)) console.log("   ", JSON.stringify(c));
  } catch (e) { console.log(`${theme} | échec ${String(e).slice(0, 60)}`); }
  await ctx.close();
}
await nav.close();
