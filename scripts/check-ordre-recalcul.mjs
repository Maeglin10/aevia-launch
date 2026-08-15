/*
  Un recalcul placé avant la donnée qu'il lit.

    node scripts/check-ordre-recalcul.mjs

  Le dégel insère `X = X_LIVE();` juste après `sessionData = …`. Mais les thèmes
  affectent leurs variables de session l'une après l'autre :

      sessionData = __session;
      channels = channels_LIVE();     ← lit fd, qui vaut encore null
      fd = __session?.formData;

  La donnée est donc recalculée avec la session d'avant, et le repli de la
  démonstration s'affiche — impact-29/contact montrait « contact@exemple.fr »
  malgré un dégel en apparence correct.

  On vérifie que chaque recalcul suit la dernière affectation de session du
  bloc.
*/
import fs from "node:fs";
import path from "node:path";

function* parcourir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const c = path.join(d, e.name);
    if (e.isDirectory()) yield* parcourir(c);
    else if (e.name.endsWith(".tsx")) yield c;
  }
}

/*
  Les quatre variables que tout thème tire de la session, affectées d'affilée.
  `brand` et `photo` en dérivent mais sont posées bien plus bas, par dessein :
  les compter faisait passer pour fautifs des recalculs parfaitement placés.
*/
const AFFECTATION = /^\s+(sessionData|fd|bp|c)\s*=\s*[^=]/;

const fautes = [];
for (const p of parcourir("app/templates")) {
  const lignes = fs.readFileSync(p, "utf8").split("\n");
  let derniere = -1;
  for (let i = 0; i < lignes.length; i++) {
    if (AFFECTATION.test(lignes[i]) && !/_LIVE\(\)/.test(lignes[i])) derniere = i;
  }
  if (derniere < 0) continue;
  for (let i = 0; i < lignes.length; i++) {
    const m = lignes[i].match(/^\s+([A-Za-z_$][\w$]*)\s*=\s*\1_LIVE\(\);/);
    /* Et seulement si l'affectation est du même bloc : à portée de vingt lignes. */
    if (m && i < derniere && derniere - i <= 20) {
      fautes.push(`${p.slice("app/templates/".length)}:${i + 1}  ${m[1]} recalculé avant la ligne ${derniere + 1}`);
    }
  }
}

fautes.forEach((f) => console.log(f));
console.log(fautes.length ? `\n${fautes.length} recalcul(s) trop tôt` : "aucun recalcul avant sa donnée");
process.exit(fautes.length ? 1 : 0);
