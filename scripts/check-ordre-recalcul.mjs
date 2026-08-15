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
  const src = lignes.join("\n");

  /* Ce que lit le corps d'une fonction `X_LIVE`. */
  function litQuoi(nom) {
    const debut = src.indexOf(`function ${nom}_LIVE(`);
    if (debut < 0) return new Set();
    let i = src.indexOf("{", debut), prof = 0, fin = i;
    while (fin < src.length) {
      if (src[fin] === "{") prof++;
      else if (src[fin] === "}") { prof--; if (prof === 0) break; }
      fin++;
    }
    const corps = src.slice(i, fin);
    return new Set(["sessionData", "fd", "bp", "c"].filter((v) => new RegExp(`\\b${v}\\b`).test(corps)));
  }

  for (let i = 0; i < lignes.length; i++) {
    const m = lignes[i].match(/^\s+([A-Za-z_$][\w$]*)\s*=\s*\1_LIVE\(\);/);
    if (!m) continue;
    const lues = litQuoi(m[1]);
    if (!lues.size) continue;
    /*
       On n'accuse que si la variable que la fonction lit vraiment est affectée
       plus bas. Sans cette vérification, soixante-quatre recalculs
       parfaitement placés étaient signalés parce qu'une autre variable de
       session, qu'ils n'emploient pas, se trouvait plus loin.
    */
    for (let j = i + 1; j < Math.min(i + 21, lignes.length); j++) {
      const a = lignes[j].match(/^\s+(sessionData|fd|bp|c)\s*=\s*[^=]/);
      if (a && lues.has(a[1]) && !/_LIVE\(\)/.test(lignes[j])) {
        fautes.push(`${p.slice("app/templates/".length)}:${i + 1}  ${m[1]} lit ${a[1]}, affectée ligne ${j + 1}`);
        break;
      }
    }
  }
}

fautes.forEach((f) => console.log(f));
console.log(fautes.length ? `\n${fautes.length} recalcul(s) trop tôt` : "aucun recalcul avant sa donnée");
process.exit(fautes.length ? 1 : 0);
