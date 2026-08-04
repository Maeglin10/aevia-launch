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

// Vrai si le morceau se termine par une barre oblique inverse non neutralisée :
// la recoller à un guillemet fermant en ferait un guillemet échappé.
function finitParBarre(x) {
  const m = /\\+$/.exec(x);
  return Boolean(m) && m[0].length % 2 === 1;
}

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
    // Toute chaîne en position de donnée — élément de tableau ou valeur de
    // propriété — qui cite la ville comme un mot entier. La première version
    // n'acceptait qu'une liste de clés (desc, body, text…) et laissait passer
    // `role: 'Propriétaires · Toulouse Lardenne'`, `bio: "… chez Dessange à
    // Paris …"` et `items: ['📍 Toulouse & agglomération']`.
    const motCle = new RegExp(`\\b${ville}\\b`);
    src = src.split("\n").map((ligne) => {
      if (/^\s*(import|export|\/\/|\*)/.test(ligne)) return ligne;
      if (/href=|alt=|alt:|aria|placeholder|content=|@type|schema|clientCity/.test(ligne)) return ligne;
      return ligne.replace(/(['"])((?:[^'"\\]|\\.)*)\1/g, (m0, q, valeur, pos) => {
        const avantChar = ligne.slice(0, pos).replace(/\s+$/, "").slice(-1);
        const apresChar = ligne.slice(pos + m0.length).replace(/^\s+/, "").slice(0, 1);
        if (!"[,:".includes(avantChar)) return m0;
        if (apresChar && !"],}".includes(apresChar)) return m0;
        if (valeur.includes("${") || !motCle.test(valeur)) return m0;
        const morceaux = valeur.split(motCle);
        // Une barre oblique inverse en fin de morceau échapperait le guillemet
        // fermant qu'on lui accole — c'est ce qui a coupé impact-04 en deux.
        if (morceaux.some(finitParBarre)) return m0;
        n++;
        return morceaux
          .map((x) => (x ? `${q}${x}${q}` : null))
          .reduce((acc, x, i) => {
            if (i > 0) acc.push(`(clientCity(${arg}) ?? ${q}${ville}${q})`);
            if (x) acc.push(x);
            return acc;
          }, [])
          .join(" + ");
      });
    }).join("\n");

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
