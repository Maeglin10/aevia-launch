// Rend au rendu les appels client* figés dans une constante de module.
//
//   node scripts/fix-frozen-calls.mjs [--dry]
//
// Une constante de module est évaluée à l'import, quand la session n'existe pas
// encore : un `${clientCity(...)}` écrit là renvoie toujours undefined et le
// thème garde sa valeur de démonstration pour toujours. 46 appels sur 32 thèmes
// sont dans ce cas — introduits par les passes ville, nom et adresse avant que
// cette règle ne soit comprise.
//
// La constante devient un `let` alimenté au rendu : le corps est déplacé dans
// une fonction, et la variable reçoit son résultat là où la session arrive.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const APPEL = /client(?:City|Name|Address|Services|Reviews|Stats|Certifications|Faq|Team|Areas|Photos)\s*\(/;

let touched = 0;
let corriges = 0;
const notes = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  const avant = src;

  for (let tour = 0; tour < 20; tour++) {
    let fait = false;
    for (const m of [...src.matchAll(/^const (\w+)\s*(?::[^=]+)?=\s*[[{]/gm)]) {
      const nom = m[1];
      if (nom.endsWith("_LIVE")) continue;
      const eq = src.indexOf("=", m.index);
      let k = eq + 1;
      while (k < src.length && /\s/.test(src[k])) k++;
      const ouv = src[k];
      if (ouv !== "[" && ouv !== "{") continue;
      const clos = ouv === "[" ? "]" : "}";
      let d = 0;
      let fin = -1;
      for (let x = k; x < src.length; x++) {
        if (src[x] === ouv) d++;
        else if (src[x] === clos) {
          d--;
          if (d === 0) {
            fin = x;
            break;
          }
        }
      }
      if (fin === -1) continue;
      const corps = src.slice(k, fin + 1);
      if (!APPEL.test(corps)) continue;

      /*
        Le corps part dans une fonction, appelée au rendu. La variable garde son
        nom pour que rien d'autre ne change, et démarre sur une évaluation faite
        sans session — donc sur les valeurs du thème, exactement comme avant.
      */
      const fabrique = `${nom}_LIVE`;
      const remplacement =
        `function ${fabrique}() {\n  return ${corps};\n}\nlet ${nom} = ${fabrique}();`;
      const finLigne = src.indexOf("\n", fin);
      src = src.slice(0, m.index) + remplacement + src.slice(finLigne === -1 ? fin + 1 : finLigne);

      const anc = /\n(\s*)(sessionData = session;|fd = session\?\.formData;)/.exec(src);
      if (!anc) {
        notes.push(`${id} : aucun point d'assignation`);
        break;
      }
      src =
        src.slice(0, anc.index + anc[0].length) +
        `\n${anc[1]}${nom} = ${fabrique}();` +
        src.slice(anc.index + anc[0].length);
      corriges++;
      fait = true;
      break;
    }
    if (!fait) break;
  }

  if (src === avant) continue;
  if (!dry) fs.writeFileSync(file, src);
  touched++;
}

for (const n of notes.slice(0, 6)) console.log(n);
console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s), ${corriges} constante(s) rendue(s) au rendu`);
