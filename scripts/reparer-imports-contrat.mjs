/*
  L'import du contrat, dérivé de ce que le fichier emploie vraiment.

    node scripts/reparer-imports-contrat.mjs

  Un import retiré par mégarde ne se voit pas au build — `@ts-nocheck` couvre
  les thèmes — mais fait tomber la page au premier rendu :
  « clientName is not defined », page blanche. C'est arrivé sur cinq layouts en
  une seule passe de nettoyage.

  On lit donc les appels présents dans le fichier et on écrit l'import qui leur
  correspond, ni plus ni moins.
*/
import fs from "node:fs";
import path from "node:path";

const RACINE = "app/templates";
const contrat = fs.readFileSync("lib/templates/clientContent.ts", "utf8");
const EXPORTEES = new Set([...contrat.matchAll(/export function (client[A-Za-z]+)/g)].map((m) => m[1]));

let corriges = 0;
const parcourir = (dossier) => {
  for (const e of fs.readdirSync(dossier, { withFileTypes: true })) {
    const p = path.join(dossier, e.name);
    if (e.isDirectory()) { parcourir(p); continue; }
    if (!/\.tsx?$/.test(e.name)) continue;
    const s = fs.readFileSync(p, "utf8");
    const employes = [...new Set([...s.matchAll(/\b(client[A-Z][A-Za-z]+)\s*\(/g)].map((m) => m[1]))]
      .filter((n) => EXPORTEES.has(n)).sort();
    if (!employes.length) continue;

    const bloc = /import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.exec(s);
    const importes = bloc ? new Set(bloc[1].split(",").map((x) => x.trim()).filter(Boolean)) : new Set();
    const manquants = employes.filter((n) => !importes.has(n));
    if (!manquants.length) continue;

    const nouveau = "import {\n" + [...new Set([...importes, ...employes])].sort().map((n) => `  ${n},\n`).join("") + '} from "@/lib/templates/clientContent";';
    let sortie;
    if (bloc) sortie = s.slice(0, bloc.index) + nouveau + s.slice(bloc.index + bloc[0].length);
    else {
      const prem = /^\s*import .*?;\s*\n/m.exec(s);
      if (!prem) { console.log(`${p} : aucun import, ignoré`); continue; }
      sortie = s.slice(0, prem.index + prem[0].length) + nouveau + "\n" + s.slice(prem.index + prem[0].length);
    }
    fs.writeFileSync(p, sortie);
    corriges++;
    console.log(`${p.replace(RACINE + "/", "")} : +${manquants.join(", ")}`);
  }
};
parcourir(RACINE);
console.log(corriges ? `\n${corriges} fichier(s) réparé(s)` : "tous les imports sont complets");
