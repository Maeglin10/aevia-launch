// Le code postal de la démonstration devant la ville du client.
//
//   node scripts/wire-code-postal.mjs --dry
//
// Onze thèmes écrivent « 75007 » + la ville saisie : un plombier annécien lit
// « 75007 Annecy ». Ce n'est pas une maladresse de mise en page, c'est une
// adresse fausse qui a l'air vraie — pire qu'une adresse de démonstration
// assumée, parce que rien n'alerte le client à la relecture.
//
// On passe la paire au contrat, qui sert l'adresse saisie, à défaut la ville
// seule, et sans rien du client la ligne du thème mot pour mot.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seuls = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
const ids = seuls.length ? seuls : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-")).sort();

/*
  Trois écritures pour la même chose :
    "75007 " + (clientCity(…) ?? "Paris")
    `75007 ${clientCity(…) ?? "Paris"}`
    "12 rue X, 75007 " + (clientCity(…) ?? "Paris")
  La rue qui précède, quand il y en a une, est déjà rendue au client ailleurs ;
  ici on ne touche qu'au couple code postal / ville.
*/
const FORMES = [
  {
    // "75007 " + (clientCity(sessionData) ?? "Paris")
    re: /(["'])(\d{5})\s\1\s*\+\s*\((client(?:City|Ville))\(([^)]*)\)\s*\?\?\s*["']([^"']+)["']\)/g,
    remplace: (m, q, cp, fn, arg, ville) => `clientCodePostalVille(${arg || "sessionData"}, "${cp}", "${ville}")`,
  },
  {
    // `75007 ${clientCity(sessionData) ?? "Paris"}`
    re: /`(\d{5})\s\$\{client(?:City|Ville)\(([^)]*)\)\s*\?\?\s*["']([^"']+)["']\}`/g,
    remplace: (m, cp, arg, ville) => `clientCodePostalVille(${arg || "sessionData"}, "${cp}", "${ville}")`,
  },
];

let faits = 0;
const touches = [];

for (const id of ids) {
  const f = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(f)) continue;
  let src = fs.readFileSync(f, "utf8");
  let poses = 0;

  for (const { re, remplace } of FORMES) {
    src = src.replace(re, (...a) => { poses++; return remplace(...a); });
  }
  if (poses === 0) continue;

  if (!/^\s*clientCodePostalVille,/m.test(src)) {
    const marque = '} from "@/lib/templates/clientContent";';
    const fin = src.indexOf(marque);
    if (fin < 0) { console.log(`${id} : pas d'import du contrat`); continue; }
    const debut = src.lastIndexOf("import {", fin);
    src = src.slice(0, debut + "import {".length) + "\n  clientCodePostalVille," + src.slice(debut + "import {".length);
  }

  if (!dry) fs.writeFileSync(f, src);
  faits++;
  touches.push(`${id} (${poses})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} thème(s) où le code postal ne précède plus la ville d'un autre`);
console.log(touches.join("  ·  "));
