// Remet les variables de session avant tout ce qui les lit.
//
//   node scripts/order-session-vars.mjs [--dry]
//
// Les passes de câblage insèrent chacune sa ligne juste après `fd =
// session?.formData;`. À force, l'ordre du bloc de rendu devient celui des
// passes, pas celui des dépendances :
//
//   fd   = session?.formData;
//   plans = plans_LIVE();          ← lit bp
//   bp   = session?.businessProfile;   ← trop tard
//
// `plans_LIVE()` appelle alors le contrat avec `bp` encore nul et rend la
// démonstration. Le défaut est invisible : le câblage est correct, l'ordre ne
// l'est pas.
//
// `fd`, `bp`, `c` et `sessionData` remontent donc en tête du bloc.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const SOURCES = [
  /^\s*fd = session\?\.formData;\s*$/,
  /^\s*bp = session\?\.businessProfile;\s*$/,
  /^\s*c = session\?\.generatedContent;\s*$/,
  /^\s*sessionData = session;\s*$/,
];

let faits = 0;
const touches = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  for (const nom of ["page.tsx", "layout.tsx"]) {
    const file = path.join(ROOT, id, nom);
    if (!fs.existsSync(file)) continue;
    const lignes = fs.readFileSync(file, "utf8").split("\n");

    // Pas de détection de bloc : elle s'arrêtait au premier `useEffect` et
    // laissait `sessionData = session;` trente lignes plus bas, derrière les
    // appels qui le lisent. On prend la première affectation de session et on
    // ramène toutes les autres juste dessous, où qu'elles soient.
    const iSources = lignes.map((l, i) => (SOURCES.some((re) => re.test(l)) ? i : -1)).filter((i) => i >= 0);
    if (iSources.length < 2) continue;
    const premier = iSources[0];
    const autres = iSources.slice(1);
    if (autres.every((i, k) => i === premier + k + 1)) continue;   // déjà groupées

    const deplacees = autres.map((i) => lignes[i]);
    const restantes = lignes.filter((_, i) => !autres.includes(i));
    restantes.splice(premier + 1, 0, ...deplacees);
    const neuf = restantes;

    if (!dry) fs.writeFileSync(file, neuf.join("\n"));
    faits++;
    touches.push(`${id}/${nom.replace(".tsx", "")}`);
  }
}

console.log(`${dry ? "[à blanc] " : ""}${faits} bloc(s) réordonné(s)`);
console.log(touches.join(" "));
