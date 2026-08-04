// La ville de démonstration citée dans les chaînes de données.
//
//   node scripts/wire-demo-city-strings.mjs [--dry]
//
// La passe précédente n'a traité que le texte JSX. Reste ce qui est écrit dans
// les tableaux : `description: 'Intervention rapide à Toulouse et agglomération'`.
// Une chaîne ne peut pas recevoir d'accolades JSX ; elle devient une
// concaténation, ce qui suppose qu'elle soit évaluée au rendu.
//
// C'est pourquoi cette passe doit être suivie de `unfreeze-module-calls.mjs` :
// la constante contient désormais un appel au contrat, et il faut la rendre au
// rendu — sans quoi la substitution serait mort-née, comme les six grilles
// tarifaires de la veille.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

let faits = 0;
const touches = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  const racine = path.join(dossier, "page.tsx");
  if (!fs.existsSync(racine)) continue;

  const src0 = fs.readFileSync(racine, "utf8");
  const repli = /clientCity\([^)]*\)\s*\?\?\s*"([^"]+)"/.exec(src0);
  if (!repli) continue;
  const ville = repli[1];
  if (!/^[A-ZÉÈÀ][\wéèêàçôûï' -]{2,24}$/.test(ville)) continue;

  const fichiers = [racine, path.join(dossier, "layout.tsx")];
  for (const sous of fs.readdirSync(dossier)) {
    const f = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(f)) fichiers.push(f);
  }

  for (const file of fichiers) {
    if (!fs.existsSync(file)) continue;
    let src = fs.readFileSync(file, "utf8");
    const arg = /__layoutSession/.test(src)
      ? "__layoutSession"
      : /let sessionData: any = null;/.test(src)
        ? "sessionData"
        : /\bconst fd\b|let fd: any = null;/.test(src)
          ? "{ formData: fd }"
          : null;
    if (!arg) continue;

    let n = 0;
    // Une valeur de propriété, écrite en apostrophes ou en guillemets, qui cite
    // la ville comme un mot entier. Les clés d'objet et les attributs JSX sont
    // hors sujet : ils ne s'affichent pas.
    const motif = new RegExp(
      `(\\b(?:desc|description|text|texte|body|sub|subtitle|blurb|resume|answer|a|content|excerpt|intro)\\s*:\\s*)(['"])((?:[^'"\\\\]|\\\\.)*?\\b${ville}\\b(?:[^'"\\\\]|\\\\.)*?)\\2`,
      "g",
    );
    src = src.replace(motif, (m0, cle, q, valeur) => {
      if (valeur.includes("${") || valeur.includes("clientCity")) return m0;
      const morceaux = valeur.split(new RegExp(`\\b${ville}\\b`));
      if (morceaux.length < 2) return m0;
      n++;
      const rendu = morceaux
        .map((x) => `${q}${x}${q}`)
        .join(` + (clientCity(${arg}) ?? ${q}${ville}${q}) + `)
        .replace(new RegExp(`${q}${q} \\+ `, "g"), "")
        .replace(new RegExp(` \\+ ${q}${q}`, "g"), "");
      return `${cle}${rendu}`;
    });

    if (n === 0) continue;

    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
        const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
        noms.add("clientCity");
        return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
      });
    } else {
      const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = d ? d.index + d[0].length : 0;
      src = src.slice(0, at) + 'import { clientCity } from "@/lib/templates/clientContent";\n' + src.slice(at);
    }

    if (!dry) fs.writeFileSync(file, src);
    faits += n;
    touches.push(`${file.replace(`${ROOT}/`, "")} (${n}× ${ville})`);
  }
}

console.log(`${dry ? "[à blanc] " : ""}${faits} chaîne(s) sur ${touches.length} fichier(s)`);
console.log(touches.slice(0, 12).join("  ·  "));
console.log("\nEnchaîner avec : node scripts/unfreeze-module-calls.mjs");
