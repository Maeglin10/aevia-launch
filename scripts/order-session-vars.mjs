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

    const debut = lignes.findIndex((l) => SOURCES[0].test(l));
    if (debut === -1) continue;

    // Le bloc de rendu : jusqu'au premier `const`/`return`/hook local.
    let fin = debut + 1;
    for (; fin < lignes.length; fin++) {
      const l = lignes[fin];
      if (/^\s*(const|let|var|return|if|useEffect|function)\b/.test(l) && !/^\s*(?:const|let|var)\s+\w+\s*=\s*\w+_LIVE\(\)/.test(l)) break;
    }

    const bloc = lignes.slice(debut, fin);
    const estSource = (l) => SOURCES.some((re) => re.test(l));
    const sources = bloc.filter(estSource);
    const reste = bloc.filter((l) => !estSource(l));
    // Rien à faire si les sources sont déjà toutes en tête.
    const dejaEnTete = bloc.slice(0, sources.length).every(estSource);
    if (sources.length < 2 || dejaEnTete) continue;

    const ordre = SOURCES.map((re) => sources.find((l) => re.test(l))).filter(Boolean);
    const neuf = [...lignes.slice(0, debut), ...ordre, ...reste, ...lignes.slice(fin)];
    if (!dry) fs.writeFileSync(file, neuf.join("\n"));
    faits++;
    touches.push(`${id}/${nom.replace(".tsx", "")}`);
  }
}

console.log(`${dry ? "[à blanc] " : ""}${faits} bloc(s) réordonné(s)`);
console.log(touches.join(" "));
