// Donne un nombre aux compteurs animés.
//
//   node scripts/fix-numeric-stats.mjs [--dry]
//
// Un thème qui anime ses chiffres lit un nombre : `{ value: 27, suffix: "%" }`,
// et le compteur va de zéro jusqu'à lui. Le client, lui, écrit « 18 ans » ou
// « 2 000+ ». La projection écrivait `value: s.value` telle quelle, et le
// compteur ne partait jamais.
//
// « 2 000+ » devient `value: 2000` et `suffix: "+"` : l'animation reste, et le
// chiffre affiché est celui du client.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

function ferme(s, i, o, c) {
  let n = 0;
  for (let x = i; x < s.length; x++) {
    if (s[x] === o) n++;
    else if (s[x] === c) { n--; if (n === 0) return x; }
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

  for (let tour = 0; tour < 20; tour++) {
    let fait = false;
    for (const m of src.matchAll(/clientStats\(([^)]*)\)\?\.map\(/g)) {
      const ouv = src.indexOf("({", m.index + m[0].length);
      if (ouv === -1) continue;
      const fin = ferme(src, ouv + 1, "{", "}");
      if (fin === -1) continue;
      const proj = src.slice(ouv + 1, fin + 1);
      if (proj.includes("Number(") || proj.includes("parseInt")) continue;

      // La démonstration décide : si sa valeur est un nombre, le thème anime.
      const nomSource = /\.\.\.(\w+)\[/.exec(proj)?.[1];
      if (!nomSource) continue;
      const d = new RegExp(`(?:const|let)\\s+${nomSource}\\s*(?::[^=]+)?=\\s*\\[`).exec(src);
      if (!d) continue;
      const j = src.indexOf("[", d.index + d[0].length - 1);
      const corps = src.slice(j, ferme(src, j, "[", "]") + 1);
      const cle = /(\w+)\s*:\s*(-?\d+(?:\.\d+)?)\s*[,}]/.exec(corps.slice(corps.indexOf("{")));
      if (!cle) continue;
      const champ = cle[1];
      if (!new RegExp(`${champ}\\s*:\\s*s\\.value`).test(proj)) continue;

      const suffixe = /(\w*suffix\w*|unite|unit)\s*:/i.exec(corps)?.[1];
      const remplacement =
        `${champ}: Number(String(s.value ?? "").replace(/[^\\d.]/g, "")) || 0` +
        (suffixe ? `, ${suffixe}: String(s.value ?? "").replace(/[\\d.\\s]/g, "")` : "");
      const neuf = proj.replace(new RegExp(`${champ}\\s*:\\s*s\\.value`), remplacement);
      src = src.slice(0, ouv + 1) + neuf + src.slice(fin + 1);
      n++;
      fait = true;
      break;
    }
    if (!fait) break;
  }

  if (n === 0) continue;
  if (!dry) fs.writeFileSync(file, src);
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} compteur(s) rendus lisibles sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 14).join("  ·  "));
