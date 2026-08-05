// Resserre le gabarit des titres qui ont grandi.
//
//   node scripts/tighten-hero.mjs /tmp/hero0.json …
//
// Un gabarit compté en caractères ne dit pas où un titre casse : « Tame Your »
// fait neuf caractères et s'affiche déjà sur deux lignes à cent soixante-seize
// pixels. Plutôt que de deviner, on mesure, on resserre, et l'on remesure.
//
// Chaque thème dont le titre a grandi voit son gabarit divisé par deux : le
// contrat descend alors d'un cran — de l'accroche à « Plombier à Annecy », puis
// au nom de l'entreprise, puis au titre du thème. Sous six caractères, il n'y a
// plus rien à tenter : le thème garde le sien.

import fs from "node:fs";
import path from "node:path";

const fichiers = process.argv.slice(2).filter((a) => a.endsWith(".json"));
if (fichiers.length === 0) {
  console.error("usage: node scripts/tighten-hero.mjs /tmp/hero0.json …");
  process.exit(1);
}

const fiches = fichiers.flatMap((f) => JSON.parse(fs.readFileSync(f, "utf8")));
const ko = fiches.filter((f) => f.griefs?.length);

let touches = 0;
const noms = [];
for (const f of ko) {
  const file = path.join(process.cwd(), "app/templates", f.id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  let n = 0;
  let plancher = false;
  src = src.replace(/clientHeroLine\((sessionData|session), (\d+), (\d+), (\d+)\)/g, (m, s, rang, total, gabarit) => {
    const neuf = Math.round(Number(gabarit) / 2);
    if (neuf < 6) { plancher = true; return m; }
    n++;
    return `clientHeroLine(${s}, ${rang}, ${total}, ${neuf})`;
  });
  if (plancher && n === 0) {
    // Plus rien à resserrer : le titre du thème reprend sa place.
    src = src.replace(/\{clientHeroLine\((?:sessionData|session), \d+, \d+, \d+\) \?\? (("(?:[^"\\]|\\.)*")|('(?:[^'\\]|\\.)*'))\}/g,
      (m, repli) => JSON.parse(repli.replace(/^'|'$/g, '"')));
    noms.push(`${f.id} (rendu au thème)`);
    fs.writeFileSync(file, src);
    touches++;
    continue;
  }
  if (n === 0) continue;
  fs.writeFileSync(file, src);
  touches++;
  noms.push(`${f.id} (${n})`);
}

console.log(`${ko.length} régression(s), ${touches} thème(s) resserré(s)`);
console.log(noms.slice(0, 20).join("  ·  "));
