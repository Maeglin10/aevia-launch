// L'emplacement photo réclamé au client, et celui qui s'affiche.
//
//   node scripts/fix-indice-photos.mjs            # essai
//   node scripts/fix-indice-photos.mjs --ecrire   # écrire
//
// Le motif fautif, 282 fois dans 107 thèmes :
//
//   photo(1, (clientPhotos(sessionData)[2] || "https://…photo-du-modèle"))
//
// `photo(i, repli)` renvoie `fd.photoUrls[i] || repli`. Ici l'enveloppe impose
// l'emplacement 1, et le `[2]` ne sert que de repli — inutilisé dès que le
// client a rempli l'emplacement 1, c'est-à-dire presque toujours. L'emplacement
// 3, que le formulaire a demandé et étiqueté, n'apparaît donc jamais.
//
// La correction rend à chaque emplacement le rang qu'il annonce :
//
//   photo(2, "https://…photo-du-modèle")
//
// Elle rejoint ce que le formulaire promet déjà au client — « les dernières
// images garderont celles du modèle » : un emplacement qu'il ne remplit pas
// affiche la photo du thème, non la sienne recopiée.
//
// Mesuré avant correction : 204 photos réclamées sur 1 366 ne s'affichaient
// nulle part, ni sur l'accueil ni sur aucune page annexe.

import fs from "node:fs";
import { globSync } from "glob";

const ECRIRE = process.argv.includes("--ecrire");

/*
  On ne touche qu'à la forme complète — appel `photo(`, indice littéral,
  `clientPhotos(...)[n]`, repli en chaîne. Toute autre écriture est laissée
  telle quelle : mieux vaut corriger moins que réécrire de travers.
*/
const MOTIF = /photo\(\s*(\d+)\s*,\s*\(\s*clientPhotos\((\w+)\)\s*\[\s*(\d+)\s*\]\s*\|\|\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')\s*\)\s*\)/g;

let fichiers = 0, corriges = 0, ignores = 0;
for (const fichier of globSync("app/templates/impact-*/**/page.tsx")) {
  const avant = fs.readFileSync(fichier, "utf8");
  let n = 0;
  const apres = avant.replace(MOTIF, (tout, iEnveloppe, session, jVoulu, repli) => {
    if (iEnveloppe === jVoulu) return tout; // déjà cohérent
    n++;
    return `photo(${jVoulu}, ${repli})`;
  });
  // Ce que le motif n'a pas su lire : on le compte pour ne pas le croire traité.
  for (const m of apres.matchAll(/photo\(\s*(\d+)\s*,\s*\(?\s*clientPhotos\([^)]*\)\s*\[\s*(\d+)\s*\]/g)) {
    if (m[1] !== m[2]) ignores++;
  }
  if (!n) continue;
  fichiers++; corriges += n;
  if (ECRIRE) fs.writeFileSync(fichier, apres);
  console.log(`${fichier.replace("app/templates/", "").replace("/page.tsx", "").padEnd(24)} ${n} emplacement${n > 1 ? "s" : ""} rendu${n > 1 ? "s" : ""} au client`);
}

console.log(`\n${corriges} appels corrigés dans ${fichiers} fichiers · ${ignores} d'une autre forme, laissés tels quels`);
if (!ECRIRE) console.log("(essai — relancer avec --ecrire)");
