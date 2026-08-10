// La signature du modèle, sur les pages annexes.
//
//   node scripts/wire-signature-sous-pages.mjs --dry
//
// Six thèmes écrivent leur seconde ligne de marque en dur dans chaque page
// annexe : « Reach Orbital Group » sous le nom du client, « Grill & Cellar »,
// « Boulangerie Artisanale ». Le client livre donc des pages qui portent, à
// côté de son nom, celui d'une autre entreprise.
//
// La passe globale n'y peut rien : l'en-tête contient déjà le nom du client,
// elle considère donc son travail fait. La correction est à la source.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

/* Le thème, et la signature qu'il répète de page en page. */
const SIGNATURES = {
  /* Le premier morceau du logo autant que le second : les deux nomment le modèle. */
  "impact-09-b": "Astrum.",
  "impact-99-b": "Ember",
  "impact-100": "NovaSpatial Design",
  "impact-09": "Reach Orbital Group",
  "impact-90": "Boulangerie Artisanale",
  "impact-99": "Grill & Cellar",
  "impact-10": "Grand Palais",
  "impact-22": "NimbusAI",
};

let faits = 0;
const touches = [];

for (const [theme, signature] of Object.entries(SIGNATURES)) {
  const dossier = path.join(ROOT, theme.replace(/-b$/, ""));
  if (!fs.existsSync(dossier)) continue;

  for (const entree of fs.readdirSync(dossier, { withFileTypes: true })) {
    if (!entree.isDirectory()) continue;
    const f = path.join(dossier, entree.name, "page.tsx");
    if (!fs.existsSync(f)) continue;
    let src = fs.readFileSync(f, "utf8");

    /*
      Le texte JSX seul — pas les commentaires, pas les descriptions de
      chambres où « Grand Palais » raconte l'hôtel plutôt que de le nommer.
      On ne touche qu'à ce qui suit une balise ouvrante.
    */
    const motif = new RegExp(`(>\\s*)${signature.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}(\\s*<)`, "g");
    let poses = 0;
    src = src.replace(motif, (m, avant, apres) => {
      poses++;
      return `${avant}{clientName(sessionData) ?? "${signature}"}${apres}`;
    });
    if (poses === 0) continue;

    /*
      Le nom peut vivre n'importe où dans le bloc d'import, y compris sur une
      seule ligne : chercher un début de ligne l'ajoutait une seconde fois et
      la compilation refusait le doublon.
    */
    const blocImport = /import \{([\s\S]*?)\} from "@\/lib\/templates\/clientContent";/.exec(src);
    const dejaImporte = blocImport ? blocImport[1].split(",").some((x) => x.trim() === "clientName") : false;
    if (!dejaImporte) {
      const marque = '} from "@/lib/templates/clientContent";';
      const fin = src.indexOf(marque);
      if (fin < 0) {
        /* La page annexe n'importe pas encore le contrat : on l'ajoute. */
        const apresUseClient = src.indexOf("\n", src.indexOf('"use client"'));
        src = src.slice(0, apresUseClient + 1)
          + `import { clientName } from "@/lib/templates/clientContent";\n`
          + src.slice(apresUseClient + 1);
      } else {
        const debut = src.lastIndexOf("import {", fin);
        src = src.slice(0, debut + "import {".length) + "\n  clientName," + src.slice(debut + "import {".length);
      }
    }

    if (!dry) fs.writeFileSync(f, src);
    faits++;
    touches.push(`${theme.replace(/-b$/, "")}/${entree.name} (${poses})`);
  }
}

console.log(`${dry ? "[à blanc] " : ""}${faits} page(s) annexe(s) où la signature vient du client`);
console.log(touches.join("  ·  "));
