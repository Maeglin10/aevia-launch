// Fait apparaître la ville du client dans le pied de page.
//
//   node scripts/wire-footer-city.mjs [--dry]
//
// Le parcours client, joué sur cinq métiers, montre que la ville n'apparaît sur
// aucun site produit. Ce n'est pas qu'elle soit fausse : ces thèmes n'affichent
// aucune ville. Or pour une entreprise locale, la ville est ce qu'un visiteur
// cherche en premier et ce qu'un moteur indexe pour la recherche locale.
//
// Il n'existe pas de point d'insertion universel avant le titre — seuls 14
// thèmes portent un sur-titre littéral. Le pied de page, lui, est présent sur
// 293 thèmes sous la forme d'une ligne de copyright, et c'est l'endroit où une
// mention de ville se lit naturellement.
//
// On n'ajoute rien si le client n'a pas donné de ville : le pied de page reste
// exactement ce qu'il était.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

let touched = 0;

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  const original = fs.readFileSync(file, "utf8");
  if (original.includes("VILLE_PIED")) continue;

  const decl = /\blet (?:fd|sessionData): any = null;/.exec(original);
  if (!decl) continue;
  const cut = decl.index + decl[0].length;
  const tete = original.slice(0, cut);
  let src = original.slice(cut);

  const arg = /sessionData = session;/.test(original) ? "sessionData" : "{ formData: fd }";
  const mention = `{/* VILLE_PIED */}{clientCity(${arg}) ? \` · \${clientCity(${arg})}\` : ""}`;

  let fait = false;
  /*
    La balise fermante n'est pas toujours sur la même ligne que le texte : sur
    100 thèmes le copyright tient sur plusieurs lignes, et une classe [^<\n]
    s'arrêtait au premier retour à la ligne. On accepte donc les espaces et les
    retours avant la fermeture — mais toujours pas de « < », pour ne jamais
    déborder sur la balise suivante.
  */
  src = src.replace(/(©\s*(?:\{[^}]{0,80}\}|\d{4})[^<]{0,140}?)(\s*<\/)/, (m, ligne, fin) => {
    if (fait) return m;
    fait = true;
    return `${ligne}${mention}${fin}`;
  });
  if (!fait) continue;

  src = tete + src;
  if (!/\bclientCity\b/.test(original)) {
    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, b) => {
        const have = new Set(b.split("\n").map((l) => l.trim().replace(/,$/, "")).filter(Boolean));
        have.add("clientCity");
        return `import {\n${[...have].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
      });
    } else {
      const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
      const at = dir ? dir.index + dir[0].length : 0;
      src = src.slice(0, at) + `import { clientCity } from "@/lib/templates/clientContent";\n` + src.slice(at);
    }
  }

  if (src === original) continue;
  if (!dry) fs.writeFileSync(file, src);
  touched++;
}

console.log(`${dry ? "[à blanc] " : ""}${touched} pied(s) de page portant la ville du client`);
