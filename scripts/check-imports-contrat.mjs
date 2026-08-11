// Toute fonction du contrat employée doit être importée.
//
//   node scripts/check-imports-contrat.mjs
//
// Une seule ligne d'import oubliée et la page ne s'affiche plus du tout :
// « This page couldn't load », ReferenceError au premier rendu. Le compilateur
// ne le voit pas — les thèmes portent « @ts-nocheck » — et la mesure le prend
// pour un titre resté en démonstration. Ce contrôle-ci le nomme.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const contrat = fs.readFileSync("lib/templates/clientContent.ts", "utf8");
const exportees = new Set(
  [...contrat.matchAll(/^export function (client\w+)/gm)].map((m) => m[1]),
);

let fautifs = 0;
for (const theme of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  for (const fichier of ["page.tsx", "shared.tsx"]) {
    const f = path.join(ROOT, theme, fichier);
    if (!fs.existsSync(f)) continue;
    const src = fs.readFileSync(f, "utf8");
    const employees = new Set([...src.matchAll(/\b(client[A-Z]\w*)\s*\(/g)].map((m) => m[1]));
    /*
      L'accolade ouvrante est celle qui précède immédiatement la marque, et non
      la première du fichier : les thèmes enchaînent plusieurs imports, et
      partir du premier faisait lire le mauvais bloc — trois cent soixante-six
      faux positifs, dont aucun n'existait.
    */
    /*
      TOUS les blocs, pas seulement le premier. Un fichier peut importer du
      contrat à deux endroits — une ligne ajoutée en tête, puis le bloc
      multiligne d'origine. Ne lire que le premier faisait accuser impact-21 et
      impact-38 d'oublier dix fonctions qu'ils importent bel et bien.
    */
    const marque = '} from "@/lib/templates/clientContent";';
    const importees = new Set();
    let curseur = 0;
    for (;;) {
      const finBloc = src.indexOf(marque, curseur);
      if (finBloc < 0) break;
      const debutBloc = src.lastIndexOf("import {", finBloc);
      if (debutBloc >= 0) {
        for (const nom of src.slice(debutBloc + "import {".length, finBloc).split(",")) {
          const propre = nom.trim();
          if (propre) importees.add(propre);
        }
      }
      curseur = finBloc + marque.length;
    }
    const manquantes = [...employees].filter((n) => exportees.has(n) && !importees.has(n));
    if (manquantes.length) {
      fautifs++;
      console.log(`${theme}/${fichier} : ${manquantes.join(", ")}`);
    }
  }
}
console.log(fautifs ? `\n${fautifs} fichier(s) emploient une fonction qu'ils n'importent pas` : "tout ce qui est employé est importé");
