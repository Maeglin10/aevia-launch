// Répare les câblages du groupe C posés au mauvais niveau.
//
//   node scripts/repare-groupe-c.mjs --ecrire
//
// `const X = resolveList(clientTeam(sessionData)…)` écrit au niveau du module
// s'évalue une fois, à l'import, quand la session est encore nulle — la liste
// reste en démonstration pour toujours. La forme correcte au module : une
// fonction X_LIVE(), une initialisation sur la démonstration, et un recalcul
// dans le composant une fois la session arrivée.

import fs from "node:fs";
import { globSync } from "glob";

const ECRIRE = process.argv.includes("--ecrire");

for (const fichier of globSync("app/templates/impact-*/*/page.tsx")) {
  let src = fs.readFileSync(fichier, "utf8");
  // Uniquement en colonne zéro : dans un composant, la forme inline est correcte.
  const matches = [...src.matchAll(/^const ([A-Za-z_$][\w$]*) = (resolveList\([\s\S]*?_DEMO_ANNEXE\);)$/gm)]
    .filter((m) => m[2].includes("sessionData"));
  if (!matches.length) continue;

  const noms = [];
  for (const m of matches.reverse()) {
    const [tout, nom, appel] = m;
    const forme = `function ${nom}_LIVE() {\n  return ${appel}\n}\nlet ${nom} = ${nom}_DEMO_ANNEXE;`;
    src = src.slice(0, m.index) + forme + src.slice(m.index + tout.length);
    noms.push(nom);
  }

  const candidats = [
    src.match(/\n(\s*)c = \w+\?\.generatedContent;\n/),
    src.match(/\n(\s*)sessionData = \w+;\n/),
  ].filter(Boolean);
  const ancre = candidats.sort((a, b) => b.index - a.index)[0];
  if (!ancre) { console.log(`SANS ANCRE : ${fichier}`); continue; }
  const aPoser = noms.filter((n) => !new RegExp(`^\\s+${n} = ${n}_LIVE\\(\\);`, "m").test(src));
  if (aPoser.length) {
    const recalcul = aPoser.map((n) => `${ancre[1]}${n} = ${n}_LIVE();`).join("\n");
    src = src.slice(0, ancre.index + ancre[0].length) + recalcul + "\n" + src.slice(ancre.index + ancre[0].length);
  }

  console.log(fichier.replace("app/templates/", ""), "·", noms.join(" "));
  if (ECRIRE) fs.writeFileSync(fichier, src);
}
