// La session survit-elle à la navigation entre les pages d'un thème ?
//
//   node scripts/wire-session-navigation.mjs --ecrire
//
// Cliquer « À propos » dans l'en-tête d'impact-99/carte change de route et perd
// `?session=` : la page d'arrivée revient à la démonstration. Toutes les
// campagnes chargeaient les pages annexes avec le paramètre — personne n'avait
// testé le clic. Sur un aperçu livré, le visiteur perdait la personnalisation
// à la première navigation.
//
// Le remède tient au même endroit que la lecture : la session trouvée dans
// l'adresse est retenue pour le thème (sessionStorage, par onglet), et sert de
// repli quand l'adresse n'en porte pas. Retenue PAR THÈME : sans cela, une
// session d'aperçu contaminerait la galerie entière visitée ensuite.

import fs from "node:fs";
import path from "node:path";
import { globSync } from "glob";

const ECRIRE = process.argv.includes("--ecrire");

const AVANT = /^(\s*)const id = new URLSearchParams\(window\.location\.search\)\.get\("session"\);$/m;
const APRES = (indent) => `${indent}let id = new URLSearchParams(window.location.search).get("session");
${indent}/* La navigation interne perd le paramètre : on retient la session par thème. */
${indent}try {
${indent}  const cleSession = "apercu-session:" + window.location.pathname.split("/")[2];
${indent}  if (id) sessionStorage.setItem(cleSession, id);
${indent}  else id = sessionStorage.getItem(cleSession);
${indent}} catch {}`;

const fichiers = [
  ...globSync("app/templates/impact-*/**/page.tsx"),
  ...globSync("app/templates/impact-*/page.tsx"),
  "app/templates/BrandColorVar.tsx",
];

let faits = 0, deja = 0;
for (const f of [...new Set(fichiers)]) {
  const src = fs.readFileSync(f, "utf8");
  if (src.includes("apercu-session:")) { deja++; continue; }
  const m = src.match(AVANT);
  if (!m) continue;
  if (ECRIRE) fs.writeFileSync(f, src.replace(AVANT, APRES(m[1])));
  faits++;
}
console.log(`${faits} fichiers corrigés · ${deja} déjà faits`);
if (!ECRIRE) console.log("(essai — relancer avec --ecrire)");
