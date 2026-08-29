/* Le nom d'une démonstration dans la barre du haut.

   Le pied de page est le second endroit où l'identité fuit ; le premier est
   le logo. On lit la barre elle-même — le premier élément fixe ou collant de
   la page, ou le <header>/<nav> le plus haut — et on demande : porte-t-il le
   nom du client ?

   Un logo en image (fd.logoBase64) est une réponse valable : le client a
   fourni sa marque, aucun texte n'est attendu. */
import { chromium } from "playwright";
import fs from "node:fs";

const NOM = "Zarbotil Quenvale";
const SESSION = {
  id: "verif-entete",
  formData: { businessName: NOM },
  businessProfile: { identity: { name: NOM } },
  generatedContent: {},
};

const themes = fs.readdirSync("app/templates")
  .filter((d) => /^impact-\d+$/.test(d))
  .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.route("**/api/sessions**", (r) =>
  r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(SESSION) }));
const p = await ctx.newPage();
const coupables = [];

for (const n of themes) {
  try {
    await p.goto(`http://localhost:3000/templates/${n}?session=verif-entete`, { waitUntil: "domcontentloaded", timeout: 180000 });
    await p.waitForTimeout(4000);
    const r = await p.evaluate((nom) => {
      /* Les espaces sont normalisés AVANT la comparaison : un thème qui coupe
         le nom sur deux éléments met un saut de ligne au milieu, et la
         comparaison échouait alors que le nom est bien à l'écran. */
      const plat = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
      const barres = [...document.querySelectorAll("header, nav, [class*='nav'], [class*='header']")]
        .filter((e) => e.getBoundingClientRect().top < 140 && e.getBoundingClientRect().height > 20);
      if (!barres.length) return { sansBarre: true };
      const texte = barres.map((b) => b.innerText || "").join(" ");
      const image = barres.some((b) => b.querySelector("img"));
      return { ok: plat(texte).includes(plat(nom)), image, debut: texte.trim().slice(0, 70).replace(/\s+/g, " ") };
    }, NOM);
    if (r.sansBarre || r.ok || r.image) continue;
    coupables.push([n, r.debut]);
    console.log(`${n} : BARRE SANS LE NOM · « ${r.debut} »`);
  } catch (e) { console.log(`${n} : ${String(e).split("\n")[0].slice(0, 60)}`); }
}
console.log(`\n${themes.length} thèmes rendus · ${coupables.length} barres au nom d'une démonstration`);
fs.writeFileSync("captures/contact/noms-entete.json", JSON.stringify(coupables, null, 2));
await nav.close();
