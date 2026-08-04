// Rend au rendu tout appel au contrat évalué à l'import.
//
//   node scripts/unfreeze-module-calls.mjs [--dry]
//
// Complète `fix-frozen-calls.mjs`, qui ne savait reconnaître qu'une constante
// dont la valeur commence par `[` ou `{`. Les passes de câblage en produisent
// d'autres formes — `const courses = resolveList(clientServices(…), […])` — tout
// aussi mortes : évaluées une fois à l'import, quand `fd` vaut encore `null`.
//
// La constante devient une fonction rappelée là où la session arrive.
// `check-frozen.mjs` dit ce qu'il reste.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const CONTRAT =
  /client(?:Services|Reviews|Stats|Faq|Team|Areas|Certifications|Name|City|Tagline|Address|Photos)\s*\(/;

function finDeclaration(src, depart) {
  let k = depart, prof = 0;
  for (; k < src.length; k++) {
    const ch = src[k];
    // Un commentaire contient des points-virgules qui ne terminent rien : c'est
    // dans l'un d'eux que la première version a coupé impact-148 en deux.
    if (ch === "/" && src[k + 1] === "/") { k = src.indexOf("\n", k); if (k === -1) return -1; continue; }
    if (ch === "/" && src[k + 1] === "*") { k = src.indexOf("*/", k); if (k === -1) return -1; k++; continue; }
    // Pas de suivi des guillemets : un texte JSX contient des apostrophes
    // isolées — « l'engagement » — qui feraient croire à une chaîne ouverte et
    // emporteraient la lecture jusqu'au bout du fichier. La profondeur des
    // crochets suffit, à condition d'exiger un point-virgule en fin de ligne.
    if ("([{".includes(ch)) prof++;
    else if (")]}".includes(ch)) prof--;
    else if (ch === ";" && prof === 0 && /^\s*$/.test(src.slice(k + 1, src.indexOf("\n", k) + 1 || undefined))) return k;
    // Le point-virgule n'est pas toujours écrit : `const X = [ … ]` suivi d'un
    // saut de ligne ferme aussi la déclaration. Sans ce cas, les tableaux sans
    // point-virgule échappaient entièrement à la passe.
    else if ((ch === "]" || ch === "}") && prof === 0) {
      const suite = src.slice(k + 1, src.indexOf("\n", k) + 1 || undefined);
      if (/^\s*;?\s*$/.test(suite)) return k + (suite.trim() === ";" ? 2 : 1);
    }
    else if (ch === "\n" && prof === 0 && /^\s*(?:export )?(?:const|let|var|function|\/\/)/.test(src.slice(k + 1, k + 40))) return k;
  }
  return -1;
}

let faits = 0;
const touches = [];
const restants = [];

// Les sous-pages produisent les mêmes constantes gelées que les pages
// d'accueil : impact-16/services y déclarait ses prestations au niveau module,
// donc évaluées à l'import, donc toujours celles de la démonstration.
const FICHIERS = [];
for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  FICHIERS.push([id, path.join(dossier, "page.tsx")]);
  for (const sous of fs.readdirSync(dossier)) {
    const f = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(f)) FICHIERS.push([`${id}/${sous}`, f]);
  }
}

for (const [id, file] of FICHIERS) {
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  let bouge = false;

  for (let tour = 0; tour < 20; tour++) {
    let fait = false;
    for (const m of src.matchAll(/^(?:export )?(?:const|let|var) (\w+)[^=\n]*=/gm)) {
      const nom = m[1];
      if (nom.endsWith("_LIVE")) continue;
      const fin = finDeclaration(src, m.index + m[0].length);
      if (fin === -1) continue;
      const corps = src.slice(m.index, fin);
      if (!CONTRAT.test(corps)) continue;
      if (src.includes(`function ${nom}_LIVE(`)) continue;

      const valeur = src.slice(m.index + m[0].length, fin).trim();
      // Un composant n'est pas évalué à l'import : son corps attend d'être
      // rendu. `const Nav = () => (…)` est une déclaration de fonction déguisée,
      // et l'envelopper dans un `_LIVE()` casse le fichier — c'est ce qui est
      // arrivé aux cinq composants d'impact-222.
      if (/^(?:async\s+)?(?:\([^()]*\)|[A-Za-z_$][\w$]*)\s*(?::[^=]*)?=>/.test(valeur)) continue;
      if (/^(?:async\s+)?function\b/.test(valeur)) continue;
      if (/^(?:React\.)?(?:memo|forwardRef)\s*\(/.test(valeur)) continue;
      const rendu = /\n(\s*)fd = session\?\.formData;/.exec(src);
      if (!rendu) { restants.push(`${id} ${nom} (pas de point de rendu)`); continue; }

      src =
        src.slice(0, m.index) +
        `function ${nom}_LIVE() {\n  return ${valeur};\n}\nlet ${nom} = ${nom}_LIVE();` +
        src.slice(fin);
      const r = /\n(\s*)fd = session\?\.formData;/.exec(src);
      src = src.slice(0, r.index + r[0].length) + `\n${r[1]}${nom} = ${nom}_LIVE();` + src.slice(r.index + r[0].length);
      faits++;
      touches.push(`${id} ${nom}`);
      bouge = true;
      fait = true;
      break;
    }
    if (!fait) break;
  }

  if (bouge && !dry) fs.writeFileSync(file, src);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} constante(s) rendue(s) au rendu`);
console.log(touches.join("  ·  "));
if (restants.length) console.log(`restants : ${restants.join(", ")}`);
