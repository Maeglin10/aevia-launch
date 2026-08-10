// Une variable de module employée sans être déclarée fait disparaître la page.
//
//   node scripts/check-variables-contrat.mjs
//
// Les thèmes lisent la session par quatre variables de module — `sessionData`,
// `fd`, `bp`, `c`. Elles ne sont pas toutes déclarées dans tous les fichiers :
// les pages annexes ont été fabriquées en recopiant des morceaux d'accueil, et
// une page qui garde `c` mais pas `bp` compile très bien — les thèmes portent
// `@ts-nocheck` — puis tombe au premier rendu en « bp is not defined ».
//
// C'est arrivé deux fois au même endroit : impact-99/carte, d'abord sur
// `sessionData`, puis sur `bp` en câblant la carte du restaurant. Ce contrôle
// existe pour qu'il n'y ait pas de troisième fois.

import fs from "node:fs";
import { globSync } from "glob";

const VARIABLES = ["sessionData", "fd", "bp", "c"];
const suspects = [];

for (const fichier of globSync("app/templates/impact-*/**/page.tsx")) {
  const src = fs.readFileSync(fichier, "utf8");
  for (const v of VARIABLES) {
    // Employée : lue quelque part, hors déclaration et hors affectation.
    const employee = new RegExp(`(?<![\\w.$])${v}\\s*(?:\\?\\.|\\.|\\))`).test(src)
      || new RegExp(`\\(\\s*${v}\\s*[,)]`).test(src);
    if (!employee) continue;
    /*
      Une déclaration prend trois formes : nue (`let bp = null`), déstructurée
      en tableau (`const [fd, setFd] = useState()`) ou en objet. N'accepter que
      la première déclarait impact-314 fautif à tort — l'instrument
      sur-déclare, encore.
    */
    const declaree = new RegExp(`^\\s*(?:let|const|var)\\s+${v}\\b`, "m").test(src)
      || new RegExp(`(?:let|const|var)\\s*[[{][^\\]}]*\\b${v}\\b[^\\]}]*[\\]}]\\s*=`).test(src)
      || new RegExp(`function\\s+\\w+\\s*\\([^)]*\\b${v}\\b`).test(src);
    if (!declaree) suspects.push({ fichier: fichier.replace("app/templates/", ""), variable: v });
  }
}

for (const s of suspects) console.log(`${s.fichier}  emploie « ${s.variable} » sans la déclarer`);
console.log(`\n${suspects.length} variables employées sans déclaration`);
process.exit(suspects.length ? 1 : 0);
