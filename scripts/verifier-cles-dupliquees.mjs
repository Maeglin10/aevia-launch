/* Les clés dupliquées de React, sur tout le catalogue.

   Le contrat rend, quand le client n'a pas encore d'avis, plusieurs entrées
   portant le même auteur — « Avis à venir ». Tout thème qui clave sur ce
   champ donne alors la même clé à plusieurs enfants. C'est l'« issue » que
   Next affiche en bas de page, et React peut y perdre l'identité des cartes
   entre deux rendus. */
import { chromium } from "playwright";
import fs from "node:fs";

const NOM = "Atelier Vérification";
const S = { id: "v", formData: { businessName: NOM, phone: "+33 4 78 12 34 56", email: "bonjour@verif.fr" },
  businessProfile: { identity: { name: NOM }, contacts: { general: { phone: "+33 4 78 12 34 56" } } }, generatedContent: {} };

const themes = fs.readdirSync("app/templates").filter((d) => /^impact-\d+$/.test(d))
  .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));
const coupables = [];

/* Une page NEUVE par thème, refermée avant le suivant. React journalise en
   différé : avec une seule page réutilisée, l'erreur d'un thème arrivait
   pendant le rendu du suivant et lui était imputée. Le premier relevé
   annonçait ainsi 132 thèmes, dont trois que le diagnostic ciblé donnait
   propres. */
for (const t of themes) {
  const p = await ctx.newPage();
  let fautif = false;
  p.on("console", (m) => {
    if (m.type() === "error" && /same key/i.test(m.text())) fautif = true;
  });
  try {
    await p.goto(`http://localhost:3000/templates/${t}?session=v`, { waitUntil: "domcontentloaded", timeout: 180000 });
    await p.waitForTimeout(3200);
  } catch (e) { console.log(`${t} : ${String(e).split("\n")[0].slice(0, 50)}`); }
  await p.close();
  if (fautif) coupables.push(t);
}
const uniques = [...new Set(coupables)];
uniques.forEach((t) => console.log(`${t} : CLÉ DUPLIQUÉE`));
console.log(`\n${themes.length} thèmes rendus · ${uniques.length} avec une clé dupliquée`);
fs.writeFileSync("captures/contact/cles-dupliquees.json", JSON.stringify(uniques, null, 2));
await nav.close();
