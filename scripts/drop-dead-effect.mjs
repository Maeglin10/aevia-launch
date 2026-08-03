// Supprime le useEffect qui n'a jamais rien produit.
//
//   node scripts/drop-dead-effect.mjs [--dry]
//
// Présent dans 110 thèmes, il devine quatre noms de constantes par
// `typeof X !== 'undefined'` — des identifiants qui n'existent pas, donc tous
// nuls —, puis mute des constantes de module en place, ce qui ne déclenche aucun
// rendu, et le fait dans un effet, donc après le peinturage. Trois raisons
// indépendantes de ne rien afficher.
//
// On le retire : le câblage réel passe désormais par resolveList au rendu, et
// laisser ce bloc donne l'illusion que ces thèmes lisent la session.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

let touched = 0;
let lines = 0;

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!src.includes("services_arrays") && !src.includes("testimonials_arrays")) continue;

  const marker = Math.min(
    ...["services_arrays", "testimonials_arrays"]
      .map((m) => src.indexOf(m))
      .filter((i) => i !== -1),
  );
  // Remonter au useEffect qui contient le marqueur.
  const start = src.lastIndexOf("useEffect(", marker);
  if (start === -1) continue;

  // Descendre en comptant les accolades jusqu'à la fermeture de l'appel.
  let i = src.indexOf("{", start);
  let depth = 0;
  for (; i < src.length; i++) {
    if (src[i] === "{") depth++;
    else if (src[i] === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  const close = src.indexOf(");", i);
  if (close === -1) continue;
  const block = src.slice(start, close + 2);
  // Garde-fou : le bloc retiré doit bien être celui-là, et rien de plus.
  if (!block.includes("services_arrays") && !block.includes("testimonials_arrays")) continue;
  if (block.length > 4000) continue;

  lines += block.split("\n").length;
  src = src.slice(0, start) + src.slice(close + 2);
  if (!dry) fs.writeFileSync(file, src);
  touched++;
}

console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s), ${lines} ligne(s) de code mort retirées`);
