/* Seconde passe : la règle tranchée avec l'utilisateur.

     · dans la série 328-383, le héros recomposé de la branche gagne ;
     · partout ailleurs, main gagne.

   Ce n'est pas une perte : les correctifs de la branche hors héros sont tous
   produits par des scripts déterministes, qu'on rejoue ensuite sur l'arbre
   fusionné. Prendre main garantit qu'aucune de ses 122 avancées ne disparaît
   dans un arbitrage à la main. */
import fs from "node:fs";
import { execSync } from "node:child_process";

const CONFLIT = /<<<<<<< HEAD\n([\s\S]*?)\n?=======\n([\s\S]*?)\n?>>>>>>> main\n/g;
const fichiers = fs.readFileSync("/private/tmp/claude-501/-Users-milliandvalentin-skybot-inbox/8d5d04e6-ff0e-4585-8a48-1ecf36587a30/scratchpad/restants.txt", "utf8").trim().split("\n").filter(Boolean);
let heros = 0, principal = 0;

for (const f of fichiers) {
  if (!fs.existsSync(f)) continue;
  const serie = /impact-3(2[89]|[3-8][0-9])\//.test(f);
  const src = fs.readFileSync(f, "utf8");
  const sortie = src.replace(CONFLIT, (_t, moi, eux) => {
    if (serie) { heros++; return moi ? moi + "\n" : ""; }
    principal++; return eux ? eux + "\n" : "";
  });
  fs.writeFileSync(f, sortie);
  execSync(`git add -- "${f}"`);
}
console.log(`${heros} conflits tranchés pour le héros recomposé`);
console.log(`${principal} conflits tranchés pour main`);
