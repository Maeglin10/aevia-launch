// Le métier de la démonstration, à la place de celui du client.
//
//   node scripts/wire-metier.mjs --dry
//
// Sur impact-351, un plombier annécien lit « COUVREUR-ZINGUEUR · ANNECY » en
// surtitre : la ville vient de lui, le métier d'un autre. C'est la première
// ligne que voit un prospect, avant le titre, avant les photos — et elle
// annonce un autre métier que le sien.
//
// Le contrat sait déjà répondre : `clientTrade` rend l'activité saisie au
// formulaire. On l'installe partout où le métier est écrit en dur, en gardant
// celui du thème en repli pour la démonstration du catalogue.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seuls = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
const ids = seuls.length ? seuls : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-")).sort();

/*
  Les métiers que le catalogue met en scène, avec leurs variantes d'écriture.
  On ne remplace que des mots entiers, jamais un fragment : « macon » ne doit
  pas se déclencher au milieu de « maçonnerie », qui décrit une prestation et
  non l'identité de l'entreprise.
*/
const METIERS = [
  "Couvreur-zingueur", "Couvreur", "Zingueur", "Électricien", "Electricien", "Menuisier",
  "Serrurier", "Peintre en bâtiment", "Paysagiste", "Carreleur", "Chauffagiste", "Vitrier",
  "Pisciniste", "Dentiste", "Chirurgien-dentiste", "Médecin généraliste", "Médecin",
  "Kinésithérapeute", "Ostéopathe", "Podologue", "Vétérinaire", "Opticien",
  "Audioprothésiste", "Pharmacien", "Sage-femme", "Avocat", "Notaire", "Expert-comptable",
  "Comptable", "Architecte", "Coiffeur", "Esthéticienne", "Tatoueur", "Photographe",
  "Traiteur", "Boulanger", "Pâtissier", "Caviste", "Fleuriste", "Bijoutier",
  "Déménageur", "Toiletteur", "Ébéniste", "Brasseur", "Infirmier",
];

/** Les accents et la casse ne doivent pas faire manquer une occurrence. */
const echappe = (m) => m.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let faits = 0;
const touches = [];

for (const id of ids) {
  const f = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(f)) continue;
  let src = fs.readFileSync(f, "utf8");
  let poses = 0;

  for (const metier of METIERS) {
    /*
      Deux écritures seulement, celles qui désignent l'entreprise : le texte JSX
      nu — `>Couvreur-zingueur<` ou `>COUVREUR-ZINGUEUR · ` — et la chaîne d'un
      surtitre. On laisse tranquilles les commentaires, les descriptions de
      prestations et les noms de variables.
    */
    /*
      Le métier ouvre parfois sa propre ligne, la balise étant restée plus haut :
      « \n          Couvreur-zingueur{fd?.city … ». On accepte donc aussi un
      début de ligne, en écartant les commentaires — une ligne qui commence par
      « * » ou « // » décrit le thème, elle ne s'affiche pas.
    */
    const enJSX = new RegExp(
      `(>\\s*|\\n[ \\t]+(?![*/]))(${echappe(metier)}|${echappe(metier.toUpperCase())})(?=[\\s·<{,.])`,
      "g",
    );
    src = src.replace(enJSX, (m, avant, mot) => {
      poses++;
      const majuscules = mot === mot.toUpperCase();
      return `${avant}{${majuscules ? "clientTrade(sessionData)?.toUpperCase()" : "clientTrade(sessionData)"} ?? "${mot}"}`;
    });
  }

  if (poses === 0) continue;

  if (!/^\s*clientTrade,/m.test(src)) {
    const marque = '} from "@/lib/templates/clientContent";';
    const fin = src.indexOf(marque);
    if (fin < 0) { console.log(`${id} : pas d'import du contrat`); continue; }
    const debut = src.lastIndexOf("import {", fin);
    src = src.slice(0, debut + "import {".length) + "\n  clientTrade," + src.slice(debut + "import {".length);
  }

  if (!dry) fs.writeFileSync(f, src);
  faits++;
  touches.push(`${id} (${poses})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} thème(s) où le métier affiché est celui du client`);
console.log(touches.join("  ·  "));
