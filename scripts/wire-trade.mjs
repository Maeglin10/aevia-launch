// Le métier affiché est celui du client.
//
//   node scripts/wire-trade.mjs [--dry] [impact-01 …]
//
// Les thèmes écrivent leur métier en toutes lettres dans leurs sur-titres :
// « Paysagiste · {ville} & Loire-Atlantique », « Ostéopathe · Lyon ». La passe
// des villes a bien remplacé la ville ; le métier, lui, est resté celui de la
// démonstration — le site d'un coiffeur de Chambéry annonçait « PAYSAGISTE ·
// CHAMBÉRY ».
//
// On ne touche qu'aux métiers voisins d'un appel à la ville du client : c'est la
// forme du sur-titre, et elle ne laisse aucun doute sur ce que le mot désigne.
// Ailleurs — dans une biographie, dans un article — le mot peut être n'importe
// quoi, et on le laisse.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seulement = process.argv.slice(2).filter((a) => a.startsWith("impact-"));

const METIERS = [
  "Paysagiste", "Électricien", "Electricien", "Plombier", "Traiteur", "Ostéopathe", "Osteopathe",
  "Coach sportif", "Barbier", "Architecte", "Vétérinaire", "Veterinaire", "Photographe",
  "Restaurateur", "Comptable", "Avocat", "Coiffeur", "Fleuriste", "Menuisier", "Peintre",
  "Maçon", "Macon", "Couvreur", "Charpentier", "Boulanger", "Pâtissier", "Patissier",
  "Dentiste", "Notaire", "Serrurier", "Carreleur", "Jardinier", "Toiletteur", "Esthéticienne",
  "Tatoueur", "Opticien", "Pharmacien", "Podologue", "Psychologue", "Naturopathe",
  "Kinésithérapeute", "Kinesitherapeute", "Sophrologue", "Décorateur", "Decorateur",
];

let faits = 0;
const touches = [];
const ids = seulement.length ? seulement : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));

for (const id of ids) {
  const dossier = path.join(ROOT, id);
  if (!fs.existsSync(dossier) || !fs.statSync(dossier).isDirectory()) continue;
  const fichiers = ["page.tsx", "layout.tsx", "shared.tsx"]
    .map((f) => path.join(dossier, f))
    .filter((f) => fs.existsSync(f));

  let n = 0;
  for (const f of fichiers) {
    let src = fs.readFileSync(f, "utf8");
    const lignes = src.split("\n").map((ligne) => {
      // Le métier ne se remplace qu'à côté de la ville du client.
      if (!/client(?:City|CityOr)\(/.test(ligne)) return ligne;
      if (/^\s*(import|\/\/|\*)/.test(ligne)) return ligne;
      if (/alt=|alt:|aria|href=|@type|schema/.test(ligne)) return ligne;
      let sortie = ligne;
      for (const metier of METIERS) {
        const motif = new RegExp(`(^|[>\\s·—–|,({\\[])(${metier})(?=[\\s<·—–,.|)}\\]]|$)`, "g");
        sortie = sortie.replace(motif, (m0, avant, mot, pos) => {
          // Ni dans une chaîne, ni dans une clé d'objet.
          const seg = sortie.slice(0, pos);
          const impair = (re) => (seg.match(re) || []).length % 2 === 1;
          if (impair(/(?<!\\)"/g) || impair(/(?<!\\)'/g) || impair(/(?<!\\)`/g)) return m0;
          if (/^\s*:/.test(sortie.slice(pos + m0.length))) return m0;
          n++;
          return `${avant}{clientTrade(sessionData) ?? "${mot}"}`;
        });
      }
      return sortie;
    });
    if (n === 0) continue;
    src = lignes.join("\n");
    if (!/import \{[^}]*\bclientTrade\b/.test(src)) {
      if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
        src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m0, g) => {
          const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
          noms.add("clientTrade");
          return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
        });
      } else {
        const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
        const at = d ? d.index + d[0].length : 0;
        src = src.slice(0, at) + 'import { clientTrade } from "@/lib/templates/clientContent";\n' + src.slice(at);
      }
    }
    if (!dry) fs.writeFileSync(f, src);
  }

  if (n === 0) continue;
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} mention(s) de métier branchées sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 16).join("  ·  "));
