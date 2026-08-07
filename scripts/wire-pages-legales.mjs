// Les mentions légales d'une société qui n'existe pas.
//
//   node scripts/wire-pages-legales.mjs --dry
//
// Six cent dix-sept pages légales sur sept cent trente-trois sont figées :
// « Le présent site est édité par Impact Agency, SARL au capital de 10 000 €,
// immatriculée au RCS de Paris », suivi d'une adresse inventée. Le client
// achète le thème, publie, et sa page de mentions légales désigne une société
// qui n'existe pas — sur le document même dont la loi exige qu'il l'identifie.
//
// Le remède est déjà écrit et déjà en service sur cent seize pages :
// `TemplateLegal` rend les quatre documents générés pour ce client et son
// secteur. On y bascule les autres. Le style de ces pages est neutre, à dessein :
// ce qui compte est que le texte soit le sien.

import fs from "node:fs";
import path from "node:path";

const dry = process.argv.includes("--dry");

/** La route dit quel document afficher. */
const DOCUMENT = {
  "mentions": "mentionsLegales",
  "mentions-legales": "mentionsLegales",
  "cgu": "cgu",
  "cgv": "cgv",
  "confidentialite": "confidentialite",
  "privacy": "confidentialite",
};

function pagesLegales(racine) {
  const out = [];
  for (const theme of fs.readdirSync(racine).filter((d) => d.startsWith("impact-"))) {
    const parcours = (dossier, chemin) => {
      for (const entree of fs.readdirSync(dossier, { withFileTypes: true })) {
        if (!entree.isDirectory()) continue;
        const sous = path.join(dossier, entree.name);
        const doc = DOCUMENT[entree.name];
        if (doc && fs.existsSync(path.join(sous, "page.tsx"))) {
          out.push({ theme, fichier: path.join(sous, "page.tsx"), doc, route: [...chemin, entree.name].join("/") });
        }
        if (entree.name === "legal") parcours(sous, [...chemin, entree.name]);
      }
    };
    parcours(path.join(racine, theme), []);
  }
  return out;
}

const pages = pagesLegales(path.join(process.cwd(), "app/templates"));
let faits = 0;
const parTheme = {};

for (const { theme, fichier, doc } of pages) {
  const src = fs.readFileSync(fichier, "utf8");
  if (src.includes("TemplateLegal")) continue;

  /*
    Une réexportation d'une ligne : le composant partagé lit la session, choisit
    le document demandé et affiche celui du client. Rien à maintenir par thème.
  */
  const neuf = `import TemplateLegal from "@/app/templates/_shared/TemplateLegal";\n\n`
    + `export default function Page() {\n  return <TemplateLegal only="${doc}" />;\n}\n`;

  if (!dry) fs.writeFileSync(fichier, neuf);
  faits++;
  (parTheme[theme] ??= []).push(doc);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} page(s) légale(s) rendues au client, sur ${Object.keys(parTheme).length} thèmes`);
console.log(`total de pages légales inspectées : ${pages.length}`);
