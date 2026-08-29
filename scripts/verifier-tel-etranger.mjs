/* Le numéro d'un inconnu sur le site d'un client.

   Le grep dit 93 thèmes ; le grep ment souvent (données de démonstration
   remplacées à l'exécution, numéros dans le JSON-LD, tableaux morts). On
   rend donc chaque thème avec une session dont le numéro est unique, et on
   LIT le texte visible : tout numéro au format français qui n'est pas celui
   du client est un numéro d'inconnu réellement affiché. */
import { chromium } from "playwright";
import fs from "node:fs";

const TEL = "+33 4 78 12 34 56";
const SESSION = {
  id: "verif-tel",
  formData: { businessName: "Atelier Vérification", phone: TEL },
  businessProfile: {
    identity: { name: "Atelier Vérification" },
    contacts: { general: { phone: TEL, email: "bonjour@atelier-verif.fr" } },
  },
  generatedContent: {},
};
/* Le numéro du client, chiffres seuls, pour comparer sans se soucier de la mise en forme. */
const NU = TEL.replace(/\D/g, "");

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
    await p.goto(`http://localhost:3000/templates/impact-${n}?session=verif-tel`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(1700);
    const r = await p.evaluate((nu) => {
      const propre = (s) => s.replace(/\D/g, "");
      /* Le texte VU, pas la source : innerText ignore ce qui est masqué. */
      const vus = [...((document.body.innerText || "").matchAll(/(?:\+33|0)[\s.\-]?[1-9](?:[\s.\-]?\d{2}){4}/g))]
        .map((m) => m[0].trim());
      const liens = [...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute("href").slice(4));
      const etrangers = [...new Set([...vus, ...liens])].filter((t) => {
        const c = propre(t);
        /* « 0478123456 » et « +33478123456 » sont le même numéro. */
        return c !== nu && c !== "0" + nu.slice(2) && "33" + c.slice(1) !== nu;
      });
      return { etrangers: etrangers.slice(0, 4), sien: (document.body.innerText || "").includes("78 12 34 56") };
    }, NU);
    if (r.etrangers.length) { coupables.push([n, r.etrangers, r.sien]); console.log(`impact-${n} : TEL ÉTRANGER ${r.etrangers.join(" · ")}${r.sien ? " (le sien est là aussi)" : " (le sien ABSENT)"}`); }
  } catch (e) { console.log(`impact-${n} : ${String(e).split("\n")[0].slice(0, 70)}`); }
}

console.log(`\n${themes.length} thèmes rendus · ${coupables.length} affichent un numéro qui n'est pas celui du client`);
fs.writeFileSync("captures/contact/tel-etranger.json", JSON.stringify(coupables, null, 2));
await nav.close();
