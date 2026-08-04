// Remplace la ville de démonstration partout où elle se lit.
//
//   node scripts/wire-demo-city-prose.mjs [--dry]
//
// Le sur-titre du hero dit bien « Électricien certifié · Chambéry », mais trois
// paragraphes plus bas le thème parle encore de Toulouse : « Intervention rapide
// à Toulouse et agglomération ». Le client ne le voit pas au premier coup d'œil,
// son visiteur si.
//
// La ville de démonstration n'est pas devinée : c'est celle que le thème lui-même
// écrit en repli de `clientCity(...)`. Un thème sans ce repli n'est pas touché.
//
// Seul le texte JSX est réécrit. Une ville citée dans une chaîne de données —
// `description: 'Intervention rapide à Toulouse'` — demanderait une concaténation
// évaluée au rendu, et ces tableaux sont le plus souvent des constantes de
// module, donc figés à l'import : le remplacement y serait mort-né.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

function dansChaine(ligne, pos) {
  const seg = ligne.slice(0, pos);
  const impair = (re) => (seg.match(re) || []).length % 2 === 1;
  return impair(/(?<!\\)"/g) || impair(/(?<!\\)'/g) || impair(/(?<!\\)`/g);
}

let faits = 0;
const touches = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  const racine = path.join(dossier, "page.tsx");
  if (!fs.existsSync(racine)) continue;

  // La ville de démonstration, dite par le thème lui-même.
  const src0 = fs.readFileSync(racine, "utf8");
  const replis = [...src0.matchAll(/clientCity\(([^)]*)\)\s*\?\?\s*"([^"]+)"/g)];
  if (replis.length === 0) continue;
  const ville = replis[0][2];
  const arg = replis[0][1];
  if (!/^[A-ZÉÈÀ][\wéèêàçôûï' -]{2,24}$/.test(ville)) continue;

  const fichiers = [racine, path.join(dossier, "layout.tsx")];
  for (const sous of fs.readdirSync(dossier)) {
    const f = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(f)) fichiers.push(f);
  }

  for (const file of fichiers) {
    if (!fs.existsSync(file)) continue;
    let src = fs.readFileSync(file, "utf8");
    const argIci = /__layoutSession/.test(src)
      ? "__layoutSession"
      : /let sessionData: any = null;/.test(src)
        ? "sessionData"
        : /\bconst fd\b|let fd: any = null;/.test(src)
          ? "{ formData: fd }"
          : null;
    if (!argIci) continue;

    let n = 0;
    const motif = new RegExp(`(^|[\\s>(,·—–])(${ville})(?=[\\s<.,;:!?·—–)]|$)`, "g");
    const lignes = src.split("\n").map((l) => {
      if (/^\s*(import|const|let|var|function|export|\/\/|\*)/.test(l)) return l;
      if (/alt=|src=|href=|clientCity|content=|title=|aria-label=/.test(l)) return l;
      return l.replace(motif, (m0, avant, v, pos) => {
        if (dansChaine(l, pos)) return m0;
        n++;
        return `${avant}{clientCity(${argIci}) ?? "${v}"}`;
      });
    });
    if (n === 0) continue;
    src = lignes.join("\n");

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

console.log(`${dry ? "[à blanc] " : ""}${faits} mention(s) de ville de démonstration sur ${touches.length} fichier(s)`);
console.log(touches.slice(0, 15).join("  ·  "));
