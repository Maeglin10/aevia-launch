// Donne à chaque thème une variable de module `sessionData`.
//
//   node scripts/ensure-session-var.mjs [--dry]
//
// 225 thèmes sur 373 en ont une, 148 non — selon la passe qui les a touchés en
// premier. Toute passe suivante doit alors deviner comment ce thème-là nomme sa
// session, et les codemods se remplissent de branches. Pire : une section rendue
// par un composant de module ne voit pas le `session` local du composant page.
//
// Une seule forme, la même partout : `sessionData` déclarée en tête, alimentée
// là où `fd` l'est.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

let faits = 0;
const restants = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (/^let sessionData: any = null;/m.test(src)) continue;

  const a = /\n(\s*)fd = session\?\.formData;/.exec(src);
  if (!a) { restants.push(`${id} (pas de point de rendu)`); continue; }

  // La déclaration va après les imports, jamais entre eux et une constante qui
  // la lirait — les sections sont plus bas, mais les constantes de module non.
  let apres = 0;
  for (const m of src.matchAll(/^import [\s\S]*?from\s*["'][^"']+["'];?\n/gm)) apres = m.index + m[0].length;
  src = src.slice(0, apres) + "let sessionData: any = null;\n" + src.slice(apres);

  const b = /\n(\s*)fd = session\?\.formData;/.exec(src);
  src = src.slice(0, b.index + b[0].length) + `\n${b[1]}sessionData = session;` + src.slice(b.index + b[0].length);

  if (!dry) fs.writeFileSync(file, src);
  faits++;
}

console.log(`${dry ? "[à blanc] " : ""}${faits} thème(s) dotés de sessionData`);
if (restants.length) console.log(`restants (${restants.length}) : ${restants.slice(0, 10).join(", ")}`);
