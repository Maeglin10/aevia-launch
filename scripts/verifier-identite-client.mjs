/* Le site d'un client qui affiche l'identité d'un autre.

   Deux défauts de la même famille, mesurés en un seul passage :
     · un numéro de téléphone qui n'est pas le sien ;
     · le nom d'une démonstration dans le pied de page.

   Deux biais du premier relevé, corrigés ici :
     · querySelector("footer") attrape le pied d'une CARTE (témoignage,
       encadré) et pas celui de la page — on prend le dernier <footer> qui
       n'est pas contenu dans un autre, et on exige qu'il soit bas de page ;
     · innerText applique text-transform, donc « Durand » devient « DURAND »
       et la comparaison échoue — on compare sans casse ni accents. */
import { chromium } from "playwright";
import fs from "node:fs";

const NOM = "Zarbotil Quenvale";
const TEL = "+33 4 78 12 34 56";
const SESSION = {
  id: "verif-identite",
  formData: { businessName: NOM, phone: TEL, email: "bonjour@atelier-verif.fr" },
  businessProfile: {
    identity: { name: NOM },
    contacts: { general: { phone: TEL, email: "bonjour@atelier-verif.fr" } },
    geo: { address: "12 rue des Capucins, 69001 Lyon" },
  },
  generatedContent: {},
};
const NU = TEL.replace(/\D/g, "");

/* Le NOM DE DOSSIER, pas le nombre : « impact-02 » converti en nombre donne
   « impact-2 », une URL qui n'existe pas. La page 404 n'affiche évidemment
   le nom d'aucun client — le relevé annonçait alors neuf thèmes muets qui
   n'avaient jamais été rendus. */
const themes = fs.readdirSync("app/templates")
  .filter((d) => /^impact-\d+$/.test(d))
  .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.route("**/api/sessions**", (r) =>
  r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(SESSION) }),
);
const p = await ctx.newPage();
const tel = [], nom = [], muets = [];

for (const n of themes) {
  for (let essai = 1; essai <= 2; essai++) {
    try {
      await p.goto(`http://localhost:3000/templates/${n}?session=verif-identite`, { waitUntil: "domcontentloaded", timeout: 60000 });
      await p.waitForTimeout(4000);
      const r = await p.evaluate(([nomAttendu, nu]) => {
        const plat = (s) => (s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
        const chiffres = (s) => (s || "").replace(/\D/g, "");
        const meme = (a) => { const c = chiffres(a); return c === nu || c === "0" + nu.slice(2) || "33" + c.slice(1) === nu; };

        /* Le pied DE LA PAGE : pas imbriqué, et dans le dernier tiers. */
        const pieds = [...document.querySelectorAll("footer")]
          .filter((f) => !f.parentElement?.closest("footer"))
          .filter((f) => f.getBoundingClientRect().top + scrollY > document.body.scrollHeight * 0.55);
        const pied = pieds[pieds.length - 1] ?? null;

        const texte = document.body.innerText || "";
        /* Pas de tiret comme séparateur : « 01-15-2026 » est une date, et le
           relevé la comptait comme un numéro. Un numéro français s'écrit
           avec des espaces ou des points. */
        /* Bornes : sans elles, le motif attrape dix chiffres à l'intérieur
           d'un identifiant plus long — un RPPS (« RPPS 10234567890 ») ou une
           autorisation CNAPS (« AUT-013-2126-01-15-20260012345 ») étaient
           comptés comme le numéro d'un inconnu. */
        const vus = [...texte.matchAll(/(?<![\d\-])(?:\+33[\s.]?|0)[1-9](?:[\s.]?\d{2}){4}(?![\d\-])/g)].map((m) => m[0].trim());
        const liens = [...document.querySelectorAll('a[href^="tel:"]')].map((a) => a.getAttribute("href").slice(4));
        /* Les numéros d'urgence (15, 18, 112) ne sont ceux de personne. */
        const etrangers = [...new Set([...vus, ...liens])]
          .filter((t) => chiffres(t).length > 4)
          .filter((t) => !meme(t));

        return {
          page404: /404|This page could not be found|introuvable/i.test((document.title || "") + " " + texte.slice(0, 200)),
          etrangers: etrangers.slice(0, 3),
          sien: vus.some(meme) || liens.some(meme),
          hautOk: plat(texte).includes(plat(nomAttendu)),
          piedOk: pied ? plat(pied.innerText).includes(plat(nomAttendu)) : null,
          piedDebut: pied ? pied.innerText.trim().slice(0, 80).replace(/\s+/g, " ") : "(aucun pied de page)",
        };
      }, [NOM, NU]);

      if (r.etrangers.length) { tel.push([n, r.etrangers, r.sien]); console.log(`${n} : TEL ÉTRANGER ${r.etrangers.join(" · ")}${r.sien ? "" : " (le sien ABSENT)"}`); }
      if (r.piedOk === false && r.hautOk) { nom.push([n, r.piedDebut]); console.log(`${n} : PIED AU NOM D'UN AUTRE · « ${r.piedDebut} »`); }
      if (r.page404) { console.log(`${n} : PAGE INTROUVABLE (404)`); break; }
      if (!r.hautOk) { muets.push(n); console.log(`${n} : le nom du client n'apparaît NULLE PART`); }
      break;
    } catch (e) {
      if (essai === 2) console.log(`${n} : ${String(e).split("\n")[0].slice(0, 60)}`);
    }
  }
}

console.log(`\n${themes.length} thèmes rendus`);
console.log(`  ${tel.length} affichent un numéro qui n'est pas celui du client`);
console.log(`  ${nom.length} portent le nom d'une démonstration en pied de page`);
console.log(`  ${muets.length} n'affichent le nom du client nulle part`);
fs.writeFileSync("captures/contact/identite.json", JSON.stringify({ tel, nom, muets }, null, 2));
await nav.close();
