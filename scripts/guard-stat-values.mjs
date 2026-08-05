// Le chiffre du client là où le thème attend un nombre.
//
//   node scripts/guard-stat-values.mjs [--dry] [impact-01 …]
//
// Une centaine de thèmes écrivent `resolveList(clientStats(session), STATS_DEMO)`
// sans rien projeter. Tant que le rendu se contente d'afficher la valeur, tout
// va bien. Mais quand le thème la traite en nombre — `stat.value.toFixed(1)`,
// `Math.floor(stat.value)`, `intVal.toLocaleString()` — le « 27 » du client, qui
// est une chaîne, casse la page : impact-216 ne rendait plus que son en-tête.
//
// Là où la démonstration écrit un nombre, la valeur du client est convertie et
// son unité part dans le champ de suffixe du thème, s'il en a un. Là où la
// démonstration écrit déjà une chaîne, on ne touche à rien.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seulement = process.argv.slice(2).filter((a) => a.startsWith("impact-"));

function ferme(s, i, o, c) {
  let n = 0;
  for (let k = i; k < s.length; k++) {
    if (s[k] === o) n++;
    else if (s[k] === c) { n--; if (n === 0) return k; }
  }
  return -1;
}

let faits = 0;
const touches = [];
const ids = seulement.length ? seulement : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  let n = 0;

  for (const m of [...src.matchAll(/resolveList\(\s*(clientStats\([^)]*\))\s*,\s*(\w+)\s*\)/g)].reverse()) {
    const [tout, appel, demo] = m;
    // La démonstration décide : projeter n'a de sens que si elle écrit un nombre.
    const d = new RegExp(`(?:const|let|var)\\s+${demo}\\s*(?::[^=]+)?=\\s*\\[`).exec(src);
    if (!d) continue;
    const j = src.indexOf("[", d.index + d[0].length - 1);
    const corps = src.slice(j, ferme(src, j, "[", "]") + 1);
    const premier = corps.slice(corps.indexOf("{"), corps.indexOf("}") + 1);
    const cle = /(\w+)\s*:\s*(-?\d+(?:\.\d+)?)\s*[,}]/.exec(premier);
    if (!cle) continue;
    const champ = cle[1];
    const suffixe = /(\w*suffix\w*|unite|unit)\s*:/i.exec(premier)?.[1];

    const projete =
      `${appel}?.map((s: any) => ({ ` +
      `...s, ${champ}: Number(String(s.value ?? "").replace(/[^\\d.]/g, "")) || 0` +
      (suffixe ? `, ${suffixe}: String(s.value ?? "").replace(/[\\d.\\s]/g, "")` : "") +
      ` }))`;
    src = src.slice(0, m.index) + `resolveList(${projete}, ${demo})` + src.slice(m.index + tout.length);
    n++;
  }

  if (n === 0) continue;
  if (!dry) fs.writeFileSync(file, src);
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} projection(s) de chiffres protégées sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 16).join("  ·  "));
