/* Le nom du client s'affiche-t-il DANS LA BARRE, ou seulement plus bas ?

   Le rapport de personnalisation cherchait le nom dans toute la page : un
   thème qui l'affiche dans son pied mais garde le nom de démonstration en
   haut passait pour correct. On regarde la barre elle-même. */
import { chromium } from "playwright";
const NOM = "Atelier Vérification";
const S = { id: "v", formData: { businessName: NOM, phone: "+33 4 78 12 34 56" },
  businessProfile: { identity: { name: NOM } }, generatedContent: {} };
const nav = await chromium.launch();
for (const t of process.argv.slice(2)) {
  const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 }, locale: "fr-FR" });
  await ctx.route("**/api/sessions**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(S) }));
  const p = await ctx.newPage();
  try {
    await p.goto(`http://localhost:3000/templates/${t}?session=v`, { waitUntil: "domcontentloaded", timeout: 120000 });
    await p.waitForTimeout(4200);
    await p.waitForFunction((n) => (document.body.innerText || "").toLowerCase().includes(n.toLowerCase()), NOM, { timeout: 6000 }).catch(() => {});
    const r = await p.evaluate((nom) => {
      const barre = [...document.querySelectorAll("header, nav")].filter((e) => e.getBoundingClientRect().top < 140)[0];
      const txt = (barre?.innerText || "").replace(/\s+/g, " ").trim();
      return { dedans: txt.toLowerCase().includes(nom.toLowerCase()), txt: txt.slice(0, 60) };
    }, NOM);
    console.log(`${t} ${r.dedans ? "ok" : "NOM ABSENT DE LA BARRE"} · « ${r.txt} »`);
  } catch (e) { console.log(t, "ERREUR", String(e).slice(0, 50)); }
  await ctx.close();
}
await nav.close();
