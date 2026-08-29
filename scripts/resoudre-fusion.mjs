/* Résolution par règles des conflits mécaniques de la fusion.

   Quatre familles se tranchent sans jugement :
     1. listes d'imports  → l'union des deux, triée ;
     2. un côté vide      → le côté qui ajoute ;
     3. redirect contre page réelle → la page réelle (main l'a construite,
        la branche n'y avait mis qu'une redirection) ;
   Le reste est laissé en conflit, pour être regardé.

   --voir n'écrit rien. */
import fs from "node:fs";
import { execSync } from "node:child_process";

const voir = process.argv.includes("--voir");
const fichiers = execSync("git diff --name-only --diff-filter=U", { encoding: "utf8" }).trim().split("\n").filter(Boolean);
const CONFLIT = /<<<<<<< HEAD\n([\s\S]*?)\n?=======\n([\s\S]*?)\n?>>>>>>> main\n/g;

const compte = { imports: 0, unSeulCote: 0, redirect: 0, laisse: 0 };
const restants = new Set();

for (const f of fichiers) {
  if (!fs.existsSync(f)) continue;
  let src = fs.readFileSync(f, "utf8");
  let reste = false;

  const sortie = src.replace(CONFLIT, (tout, moi, eux) => {
    /* 1. listes d'identifiants : union triée */
    if (/^[\sA-Za-z0-9_,]*$/.test(moi + eux)) {
      const noms = [...new Set(
        (moi + "," + eux).split(/[,\n]/).map((x) => x.trim()).filter(Boolean),
      )].sort();
      const indent = (moi.match(/^(\s*)/) ?? ["", "  "])[1] || "  ";
      compte.imports++;
      return noms.map((n) => `${indent}${n},`).join("\n") + "\n";
    }
    /* 2. un côté n'ajoute rien */
    if (!moi.trim()) { compte.unSeulCote++; return eux ? eux + "\n" : ""; }
    if (!eux.trim()) { compte.unSeulCote++; return moi ? moi + "\n" : ""; }
    /* 3. une redirection contre une vraie page */
    if (/^\s*redirect\(/.test(moi) && /__session/.test(eux)) { compte.redirect++; return eux + "\n"; }

    compte.laisse++; reste = true;
    return tout;
  });

  if (!voir && sortie !== src) fs.writeFileSync(f, sortie);
  if (reste) restants.add(f);
  else if (!voir && sortie !== src) execSync(`git add -- "${f}"`);
}

console.log(`imports fusionnés : ${compte.imports}`);
console.log(`un seul côté      : ${compte.unSeulCote}`);
console.log(`redirection → page: ${compte.redirect}`);
console.log(`laissés en conflit: ${compte.laisse} dans ${restants.size} fichiers`);
fs.writeFileSync("/private/tmp/claude-501/-Users-milliandvalentin-skybot-inbox/8d5d04e6-ff0e-4585-8a48-1ecf36587a30/scratchpad/restants.txt", [...restants].sort().join("\n"));
