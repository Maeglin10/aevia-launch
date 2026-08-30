/* Ce que la console dit vraiment, sur les thèmes en question. */
import { chromium } from "playwright";
const NOM = "Atelier Vérification";
const S = { id: "v", formData: { businessName: NOM, phone: "+33 4 78 12 34 56", email: "bonjour@verif.fr" },
  businessProfile: { identity: { name: NOM }, contacts: { general: { phone: "+33 4 78 12 34 56" } } }, generatedContent: {} };
const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 860 } });
await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));
for (const t of process.argv.slice(2)) {
  const p = await ctx.newPage();
  const erreurs = [], avertissements = [];
  p.on("pageerror", (e) => erreurs.push(String(e).split("\n")[0]));
  p.on("console", (m) => {
    const txt = m.text();
    if (/favicon|Download the React|Fast Refresh/i.test(txt)) return;
    if (m.type() === "error") {
      /* Le message porte des « %s » : la vraie valeur est dans les arguments. */
      const args = m.args().length > 1 ? " ← " + m.args().slice(1, 3).map((a) => String(a)).join(", ") : "";
      erreurs.push((txt + args).slice(0, 220));
    }
    else if (m.type() === "warning") avertissements.push(txt.slice(0, 160));
  });
  await p.goto(`http://localhost:3000/templates/${t}?session=v`, { waitUntil: "domcontentloaded", timeout: 180000 });
  await p.waitForTimeout(6000);
  const debord = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await p.screenshot({ path: `captures/revue/${t}.png` });
  console.log(`\n── ${t} · débord ${debord}px · ${erreurs.length} erreur(s) · ${avertissements.length} avertissement(s)`);
  [...new Set(erreurs)].slice(0, 4).forEach((e) => console.log("   ERREUR  " + e));
  [...new Set(avertissements)].slice(0, 3).forEach((e) => console.log("   AVERT.  " + e));
  await p.close();
}
await nav.close();
