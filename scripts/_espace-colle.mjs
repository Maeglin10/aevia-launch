/* Le nom du client collé au mot qui suit.

   « {clientName(…) ?? "Solis"} accompagne » s'affiche « Solisaccompagne » :
   l'espace qui sépare l'expression du texte disparaît au rendu. Le défaut ne
   se voit qu'à l'écran, et seulement quand un client a donné son nom.

   On regarde la page rendue, pas le source : deux nœuds de texte collés dont
   le premier porte le nom. */
import { chromium } from "playwright";

/* Par défaut le serveur de développement ; BASE_URL permet de mesurer sur la
   version construite, bien plus rapide et plus proche de la production. */
const BASE = process.env.BASE_URL || "http://localhost:3000";
const NOM = "Atelier Vérification";
const S = { id: "v", formData: { businessName: NOM, phone: "+33 4 78 12 34 56" },
  businessProfile: { identity: { name: NOM } }, generatedContent: {} };
const nav = await chromium.launch();
for (const t of process.argv.slice(2)) {
  const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 }, locale: "fr-FR" });
  await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));
  const p = await ctx.newPage();
  try {
    await p.goto(`${BASE}/templates/${t}?session=v`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await p.waitForTimeout(4200);
    const out = await p.evaluate((nom) => {
      const res = [];
      const m = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n = m.nextNode(); n; n = m.nextNode()) {
        if ((n.nodeValue || "").trim() !== nom) continue;
        const suite = n.nextSibling;
        if (!suite || suite.nodeType !== 3) continue;
        const v = suite.nodeValue || "";
        if (v && !/^[\s.,;:!?'’)\-–—]/.test(v)) res.push(nom + "▸" + v.slice(0, 40));
      }
      return res;
    }, NOM);
    if (out.length) console.log(`${t} : ${out.join(" | ")}`);
  } catch { console.log(t, "ERREUR"); }
  await ctx.close();
}
await nav.close();
