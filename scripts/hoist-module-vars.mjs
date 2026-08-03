// Remonte les variables de module juste après les imports.
//
//   node scripts/hoist-module-vars.mjs [--dry]
//
// Les thèmes déclarent `let fd/c/bp/brand/sessionData` au milieu du fichier,
// souvent après plusieurs sections extraites en composants. Ces composants
// s'exécutent au rendu, donc bien après l'initialisation du module : les lire là
// est correct à l'exécution. TypeScript, lui, refuse « used before its
// declaration », ce qui a bloqué le câblage du pied de page sur 74 thèmes.
//
// Remonter la déclaration ne change rien au comportement — c'est un `let` à
// `null`, initialisé au chargement du module dans les deux cas — et rend
// l'ensemble du fichier libre de s'y référer.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const NOMS = ["fd", "c", "bp", "brand", "sessionData"];

let touched = 0;
let deplacees = 0;

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  const original = fs.readFileSync(file, "utf8");

  // Fin du bloc d'imports : la dernière ligne qui ferme une déclaration import.
  const lignes = original.split("\n");
  let finImports = -1;
  for (let i = 0; i < lignes.length; i++) {
    if (/^import[\s{]/.test(lignes[i])) {
      let j = i;
      while (j < lignes.length && !/from\s+["'][^"']+["'];?\s*$|^import\s+["'][^"']+["'];?\s*$/.test(lignes[j])) j++;
      finImports = Math.min(j, lignes.length - 1);
    }
  }
  if (finImports === -1) continue;

  const decls = [];
  for (let i = 0; i < lignes.length; i++) {
    const m = /^let (fd|c|bp|brand|sessionData): any = null;\s*$/.exec(lignes[i]);
    if (!m || i <= finImports) continue;
    /*
      Les commentaires collés juste au-dessus décrivent la déclaration. Les
      laisser sur place les rendrait orphelins, pointant vers une ligne qui n'y
      est plus — ils partent donc avec elle.
    */
    const bloc = [];
    let k = i - 1;
    while (k > finImports && /^\s*\/\//.test(lignes[k])) {
      bloc.unshift(lignes[k]);
      k--;
    }
    decls.push({ i, debut: i - bloc.length, nom: m[1], lignes: [...bloc, lignes[i]] });
  }
  if (decls.length === 0) continue;

  // Rien à faire si elles suivent déjà immédiatement les imports.
  if (decls[0].i <= finImports + 3) continue;

  const aRetirer = new Set();
  for (const d of decls) for (let k = d.debut; k <= d.i; k++) aRetirer.add(k);
  const sortie = [];
  for (let i = 0; i < lignes.length; i++) {
    if (aRetirer.has(i)) continue;
    sortie.push(lignes[i]);
    if (i === finImports) {
      sortie.push("");
      sortie.push("// Variables de module lues par les sections extraites en composants :");
      sortie.push("// déclarées ici pour que tout le fichier puisse s'y référer.");
      for (const d of decls) sortie.push(...d.lignes);
    }
  }

  const src = sortie.join("\n");
  if (src === original) continue;
  if (!dry) fs.writeFileSync(file, src);
  touched++;
  deplacees += decls.length;
}

console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s), ${deplacees} déclaration(s) remontée(s)`);
