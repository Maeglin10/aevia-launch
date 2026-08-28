/* Le nom de démonstration figé dans le pied de page.

   On ne devine pas au motif : on rend chaque thème avec une session dont le
   nom est unique et improbable, puis on LIT le pied. Si la barre du haut
   porte bien ce nom et que le pied porte autre chose, le thème affiche le nom
   d'une démonstration sur le site d'un vrai client. */
import { chromium } from "playwright";
import fs from "node:fs";

const NOM = "Zarbotil Quenvale";
const SESSION = {
  id: "verif-nom",
  formData: { businessName: NOM },
  businessProfile: { identity: { name: NOM }, contacts: { general: { phone: "+33 4 78 12 34 56" } } },
  generatedContent: {},
};

const themes = fs.readdirSync("app/templates")
  .filter((d) => /^impact-\d+$/.test(d))
  .map((d) => Number(d.split("-")[1]))
  .sort((a, b) => a - b);

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.route("**/api/sessions**", (r) =>
  r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(SESSION) }),
);
const p = await ctx.newPage();
const coupables = [];

for (const n of themes) {
  try {
    await p.goto(`http://localhost:3000/templates/impact-${n}?session=verif-nom`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(1800);
    const r = await p.evaluate((nom) => {
      const pied = document.querySelector("footer");
      if (!pied) return { sansPied: true };
      const t = (document.body.innerText || "");
      return { hautOk: t.includes(nom), piedOk: (pied.innerText || "").includes(nom), piedDebut: (pied.innerText || "").trim().slice(0, 90).replace(/\s+/g, " ") };
    }, NOM);
    if (r.sansPied) continue;
    if (r.hautOk && !r.piedOk) { coupables.push([n, r.piedDebut]); console.log(`impact-${n} : PIED SANS LE NOM · « ${r.piedDebut} »`); }
  } catch (e) { console.log(`impact-${n} : ${String(e).split("\n")[0].slice(0, 70)}`); }
}

console.log(`\n${themes.length} thèmes examinés · ${coupables.length} pieds au nom d'une démonstration`);
fs.writeFileSync("captures/contact/noms-pied.json", JSON.stringify(coupables, null, 2));
await nav.close();
