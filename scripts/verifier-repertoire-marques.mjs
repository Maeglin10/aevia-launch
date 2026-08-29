/*
  Le répertoire des marques de démonstration dit-il vrai ?

    node scripts/verifier-repertoire-marques.mjs

  Un salon de coiffure recevait impact-180, un site d'électricien : « URGENCE 4H »,
  « CONTRATS », un tableau électrique en fond. Le juge de catalogue ne l'avait pas
  vu parce qu'il se fie au nom de démonstration, et que le répertoire donnait pour
  ce thème « Essential Salon · Rennes » — alors que le thème s'appelle Thermotek.

  Une entrée fausse dans le répertoire rend muet le seul instrument qui ne mentait
  pas. On le recoupe donc avec la source : le nom de démonstration d'un thème est
  le repli de son premier appel au nom du client.
*/
import fs from "node:fs";
import path from "node:path";

const src = fs.readFileSync("lib/templates/marquesDemo.ts", "utf8");
const REPERTOIRE = {};
for (const m of src.matchAll(/"(impact-\d+)":\s*"((?:[^"\\]|\\.)*)"/g)) REPERTOIRE[m[1]] = m[2];

/* Le repli du premier appel au nom du client : ce que la page affiche quand
   personne n'a rien rempli. */
function marqueLue(theme) {
  for (const f of ["page.tsx", "shared.tsx", "layout.tsx"]) {
    const p = path.join("app/templates", theme, f);
    if (!fs.existsSync(p)) continue;
    const t = fs.readFileSync(p, "utf8");
    const m = /(?:clientName\(sessionData\)|fd\?\.businessName)\s*\)?\s*\?\?\s*"([^"]{2,60})"/.exec(t);
    if (m) return m[1];
  }
  return null;
}

const themes = fs.readdirSync("app/templates").filter((d) => /^impact-\d+$/.test(d));
const faux = [], absents = [];
/* On compare sur les lettres seules : « Thermotek » et « ThermoTek Pro »
   sont la même marque, « Essential Salon » n'en est pas une autre orthographe. */
const nu = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

for (const theme of themes) {
  const lue = marqueLue(theme);
  if (!lue) continue;
  const dite = REPERTOIRE[theme];
  if (!dite) { absents.push({ theme, lue }); continue; }
  if (!nu(dite).includes(nu(lue).slice(0, 6)) && !nu(lue).includes(nu(dite).slice(0, 6))) {
    faux.push({ theme, dite, lue });
  }
}

console.log(`${faux.length} entrées fausses · ${absents.length} thèmes absents du répertoire\n`);
for (const f of faux.slice(0, 20)) console.log(`  ${f.theme.padEnd(12)} répertoire « ${f.dite} »  ≠  source « ${f.lue} »`);
fs.writeFileSync("/tmp/marques-fausses.json", JSON.stringify({ faux, absents }, null, 1));
