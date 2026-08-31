/* Le métier annoncé à l'écran, thème par thème.

   Le registre décrit le DESIGN, pas le commerce : « electric blue » y parle
   d'une palette, et m'aurait fait poser des photos d'électricien sur deux
   logiciels. Le thème, lui, annonce son métier au-dessus de son titre —
   « PHARMACIE D'OFFICINE · LILLE », « PRESSING · PARIS ».

   On relève donc, sans session : le libellé court au-dessus du h1, le h1
   lui-même, et le nom de la barre. Trois signaux, mesurés. */
import { chromium } from "playwright";
import fs from "node:fs";

const themes = fs.readdirSync("app/templates").filter((d) => /^impact-\d+$/.test(d))
  .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
const releve = {};

for (const t of themes) {
  const p = await ctx.newPage();
  try {
    await p.goto(`http://localhost:3000/templates/${t}`, { waitUntil: "domcontentloaded", timeout: 180000 });
    await p.waitForTimeout(2000);
    releve[t] = await p.evaluate(() => {
      const propre = (s) => (s || "").replace(/\s+/g, " ").trim();
      const h1 = document.querySelector("h1");
      /* Le libellé du métier : le texte court juste avant le titre. */
      let kicker = "";
      if (h1) {
        const sect = h1.closest("section, header, div") ?? document.body;
        const cands = [...sect.querySelectorAll("span, p, div")]
          .filter((e) => e.children.length === 0)
          .map((e) => propre(e.innerText))
          .filter((s) => s.length >= 4 && s.length <= 60);
        const avant = cands.slice(0, 6).find((s) => s !== propre(h1.innerText));
        kicker = avant ?? "";
      }
      const barre = [...document.querySelectorAll("header, nav")]
        .filter((e) => e.getBoundingClientRect().top < 140)[0];
      return {
        kicker,
        titre: propre(h1?.innerText).slice(0, 90),
        marque: propre(barre?.innerText).split("\n")[0].slice(0, 40),
      };
    });
    process.stdout.write(".");
  } catch (e) { releve[t] = { kicker: "", titre: "", marque: "", erreur: true }; }
  await p.close();
}
await nav.close();
fs.writeFileSync("captures/contact/metier-ecran.json", JSON.stringify(releve, null, 2));
const avec = Object.values(releve).filter((r) => r.kicker).length;
console.log(`\n${themes.length} thèmes · ${avec} avec un libellé de métier lisible`);
