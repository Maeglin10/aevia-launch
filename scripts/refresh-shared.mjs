// Recalcule au rendu les constantes des modules partagés.
//
//   node scripts/refresh-shared.mjs [--dry]
//
// `clientPhotoAt` a été posé dans les `shared.tsx`, mais leurs tableaux sont des
// constantes de module : évaluées à l'import, quand la page n'a pas encore retenu
// la session. La substitution y est donc inerte — le même piège que dans les
// pages, à un fichier de distance.
//
// Le corps part dans une fonction, la constante devient un `let`, et le module
// expose un `rafraichirPartage()` que la page appelle juste après avoir retenu la
// session. Les liaisons d'export sont vivantes : la page voit la nouvelle valeur
// sans rien réimporter.

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
  const partage = path.join(ROOT, id, "shared.tsx");
  const page = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(partage)) continue;
  let src = fs.readFileSync(partage, "utf8");
  if (!src.includes("clientPhotoAt(")) continue;
  if (src.includes("rafraichirPartage")) continue;

  const noms = [];
  for (let tour = 0; tour < 30; tour++) {
    let fait = false;
    for (const m of src.matchAll(/^export const (\w+)\s*(?::[^=\n]+)?=\s*(\[|\{)/gm)) {
      const nom = m[1];
      if (noms.includes(nom)) continue;
      const ouvre = m[2];
      const j = src.indexOf(ouvre, m.index + m[0].length - 1);
      const fin = ferme(src, j, ouvre, ouvre === "[" ? "]" : "}");
      if (fin === -1) continue;
      const corps = src.slice(j, fin + 1);
      if (!corps.includes("clientPhotoAt(")) continue;
      let apres = fin + 1;
      const queue = /^\s*as const\s*;?/.exec(src.slice(apres));
      const suffixe = queue ? " as const" : "";
      if (queue) apres += queue[0].length;
      else if (src[apres] === ";") apres += 1;

      src =
        src.slice(0, m.index) +
        `function ${nom}_LIVE() {\n  return ${corps}${suffixe};\n}\nexport let ${nom} = ${nom}_LIVE();` +
        src.slice(apres);
      noms.push(nom);
      fait = true;
      break;
    }
    if (!fait) break;
  }

  if (noms.length === 0) continue;

  src +=
    `\n\n/*\n  Rappelé par la page une fois la session retenue : sans cet appel, les\n` +
    `  tableaux ci-dessus gardent la valeur qu'ils avaient à l'import, quand le\n` +
    `  client n'existait pas encore.\n*/\nexport function rafraichirPartage(): void {\n` +
    noms.map((n) => `  ${n} = ${n}_LIVE();`).join("\n") +
    `\n}\n`;

  if (!dry) fs.writeFileSync(partage, src);

  // La page appelle le rafraîchissement juste après avoir retenu la session.
  if (fs.existsSync(page)) {
    let sp = fs.readFileSync(page, "utf8");
    if (!sp.includes("rafraichirPartage(")) {
      const a = /\n(\s*)memoriserSession\(sessionData\);/.exec(sp);
      if (a) {
        sp = sp.slice(0, a.index + a[0].length) + `\n${a[1]}rafraichirPartage();` + sp.slice(a.index + a[0].length);
        // L'import depuis « ./shared » existe déjà dans tous ces thèmes.
        sp = sp.replace(/import \{([^}]*)\} from "\.\/shared";/, (mm, g) => {
          const set = new Set(g.split(",").map((x) => x.trim()).filter(Boolean));
          set.add("rafraichirPartage");
          return `import {\n  ${[...set].sort().join(",\n  ")},\n} from "./shared";`;
        });
        if (!sp.includes("rafraichirPartage,") && !sp.includes("rafraichirPartage }")) {
          const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(sp);
          const at = d ? d.index + d[0].length : 0;
          sp = sp.slice(0, at) + 'import { rafraichirPartage } from "./shared";\n' + sp.slice(at);
        }
        if (!dry) fs.writeFileSync(page, sp);
      }
    }
  }

  faits += noms.length;
  touches.push(`${id} (${noms.length})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} constante(s) partagée(s) recalculée(s) au rendu sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 12).join("  ·  "));
