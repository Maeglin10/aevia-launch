// Une galerie ne se remplit pas de vide.
//
//   node scripts/guard-empty-photo-lists.mjs [--dry]
//
// Un thème dresse sa galerie depuis les réalisations du client :
// `resolveList(bp?.beforeAfter?.map((r) => r.afterUrl || r.beforeUrl), DEMO)`.
// Le client décrit un chantier sans en fournir la photo : la projection rend
// `undefined`, `resolveList` voit une liste d'un élément — donc pas vide — et la
// galerie affiche une image sans source à la place des quatre exemples.
//
// On écarte les adresses vides avant de comparer. La liste redevient vide, le
// thème garde ses exemples, et la galerie reste pleine.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

function ferme(s, i, o, c) {
  let n = 0;
  for (let k = i; k < s.length; k++) {
    if (s[k] === o) n++;
    else if (s[k] === c) { n--; if (n === 0) return k; }
  }
  return -1;
}

let faits = 0;
const touches = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  let n = 0;

  for (const m of [...src.matchAll(/resolveList\(/g)].reverse()) {
    const fin = ferme(src, m.index + m[0].length - 1, "(", ")");
    if (fin === -1) continue;
    const dedans = src.slice(m.index + m[0].length, fin);
    // Une projection d'adresses : elle rend une chaîne, pas un objet.
    if (!/\.map\(/.test(dedans)) continue;
    if (/=>\s*\(?\s*\{/.test(dedans)) continue;
    if (!/(Url|url|img|image|photo|src|cover)\b/.test(dedans)) continue;
    if (dedans.includes("filter(Boolean)")) continue;

    const virgule = dedans.lastIndexOf(",");
    if (virgule === -1) continue;
    const projection = dedans.slice(0, virgule).trimEnd();
    const demo = dedans.slice(virgule);
    if (!projection.endsWith(")")) continue;

    const neuf = `${projection}?.filter(Boolean)${demo}`;
    src = src.slice(0, m.index + m[0].length) + neuf + src.slice(fin);
    n++;
  }

  if (n === 0) continue;
  if (!dry) fs.writeFileSync(file, src);
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} galerie(s) protégées du vide sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 16).join("  ·  "));
