/* La clé des avis.

   Sans avis du client, le contrat rend plusieurs entrées portant toutes le
   même auteur — « Avis à venir » — pour tenir la place sans nommer personne.
   Les thèmes qui clavent sur cet auteur donnent alors la même clé à plusieurs
   enfants : mesuré au rendu, 137 thèmes sur 373.

   On ne touche QUE les listes d'avis, et seulement quand le .map() englobant
   nomme déjà son index. Ailleurs — la navigation, les prestations — le champ
   est une identité stable et reste la meilleure clé. */
import fs from "node:fs";
import path from "node:path";

const motifCle = /key=\{([a-zA-Z_]\w*)\.(\w+)\}/;
const motifMap = /([A-Za-z_][\w.?\[\]()]*)\s*\.map\(\s*\(?\s*([a-zA-Z_]\w*)\s*(?:,\s*([a-zA-Z_]\w*)\s*)?\)?\s*=>/g;
const estAvis = /avis|review|temoign|testimon/i;

let total = 0; const touches = [];

function parcourir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory()) { parcourir(p); continue; }
    if (!e.name.endsWith(".tsx")) continue;
    const L = fs.readFileSync(p, "utf8").split("\n");
    let n = 0;
    for (let i = 0; i < L.length; i++) {
      const m = motifCle.exec(L[i]);
      if (!m) continue;
      for (let k = i; k > Math.max(-1, i - 12); k--) {
        motifMap.lastIndex = 0;
        let c, trouve = null;
        while ((c = motifMap.exec(L[k]))) if (c[2] === m[1]) { trouve = c; break; }
        if (!trouve) continue;
        if (estAvis.test(trouve[1]) && trouve[3]) {
          L[i] = L[i].replace(motifCle, `key={${trouve[3]}}`);
          n++;
        }
        break;
      }
    }
    if (n) { fs.writeFileSync(p, L.join("\n")); total += n; touches.push(`${path.relative("app/templates", p)} (${n})`); }
  }
}
parcourir("app/templates");
touches.slice(0, 8).forEach((t) => console.log(t));
console.log(`\n${total} clés d'avis corrigées dans ${touches.length} fichiers`);
