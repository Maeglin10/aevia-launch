// L'accroche du client se lit toujours quelque part.
//
//   node scripts/wire-accroche-hero.mjs [--dry] impact-276 …
//
// Quand le titre du hero est trop étroit pour l'accueillir — sept caractères sur
// certains thèmes — le contrat y écrit « Plombier à Annecy » pour ne pas
// déborder. La phrase que le client a écrite ne se lit alors nulle part : ni
// dans le titre, ni dans un sous-titre que ces thèmes n'ont pas.
//
// On ajoute donc une ligne sous le titre, dans le style du thème : même famille
// de caractères, une taille en dessous, la couleur héritée à quatre-vingts pour
// cent. Elle n'apparaît que si le client a écrit une accroche que le titre n'a
// pas prise ; sinon rien ne change, pas même un blanc.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const ids = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
if (ids.length === 0) {
  console.error("usage: node scripts/wire-accroche-hero.mjs impact-276 …");
  process.exit(1);
}

function finBalise(s, i) {
  let prof = 0, guil = null;
  for (let k = i; k < s.length; k++) {
    const ch = s[k];
    if (guil) { if (ch === guil) guil = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { guil = ch; continue; }
    if (ch === "{") prof++;
    else if (ch === "}") prof--;
    else if (ch === ">" && prof === 0) return k;
  }
  return -1;
}

function fermeElement(s, i, tag) {
  const ouvre = new RegExp(`<${tag}\\b`, "g");
  const clot = new RegExp(`</${tag}\\s*>`, "g");
  let prof = 1, k = i;
  while (k < s.length) {
    ouvre.lastIndex = k; clot.lastIndex = k;
    const a = ouvre.exec(s), b = clot.exec(s);
    if (!b) return -1;
    if (a && a.index < b.index) { prof++; k = a.index + a[0].length; continue; }
    prof--; k = b.index + b[0].length;
    if (prof === 0) return b.index;
  }
  return -1;
}

let faits = 0;
const touches = [];
const refus = {};

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!/^let sessionData: any = null;/m.test(src)) continue;
  if (src.includes("ACCROCHE_SOUS_TITRE")) { refus["déjà"] = (refus["déjà"] ?? 0) + 1; continue; }

  const t = /<((?:motion|m)\.)?h1\b/.exec(src) ?? /<((?:motion|m)\.)?h2\b/.exec(src);
  if (!t) { refus["pas de titre"] = (refus["pas de titre"] ?? 0) + 1; continue; }
  const finOuv = finBalise(src, t.index + t[0].length);
  if (finOuv === -1 || src[finOuv - 1] === "/") { refus["balise"] = (refus["balise"] ?? 0) + 1; continue; }
  const balise = t[0].slice(1).replace(".", "\\.");
  const finFerm = fermeElement(src, finOuv + 1, balise);
  if (finFerm === -1) { refus["balise"] = (refus["balise"] ?? 0) + 1; continue; }

  // Juste après la fermeture du titre, à la même profondeur.
  const apres = src.indexOf(">", finFerm) + 1;
  if (apres <= 0) { refus["balise"] = (refus["balise"] ?? 0) + 1; continue; }

  /*
    Un titre peut être l'élément d'un tableau JSX — « {[ <div/>, <h1/> ]} » — et
    l'on n'y glisse pas un bloc conditionnel : il y faudrait une virgule, pas des
    accolades. impact-329 cassait ainsi.
  */
  const suite = src.slice(apres, apres + 40).trim();
  if (suite.startsWith(",") || suite.startsWith("]")) {
    refus["titre dans un tableau"] = (refus["titre dans un tableau"] ?? 0) + 1;
    continue;
  }

  const ligne =
    `\n      {/* ACCROCHE_SOUS_TITRE — le titre est trop étroit pour la phrase du client */}\n` +
    `      {clientAccrocheRestante(sessionData) && (\n` +
    `        <p style={{ fontSize: "clamp(15px, 1.5vw, 20px)", lineHeight: 1.5, opacity: 0.8, marginTop: 12, maxWidth: "44ch" }}>\n` +
    `          {clientAccrocheRestante(sessionData)}\n` +
    `        </p>\n` +
    `      )}\n`;
  src = src.slice(0, apres) + ligne + src.slice(apres);

  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m0, g) => {
      const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      noms.add("clientAccrocheRestante");
      return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
    });
  } else {
    const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
    const at = d ? d.index + d[0].length : 0;
    src = src.slice(0, at) + 'import { clientAccrocheRestante } from "@/lib/templates/clientContent";\n' + src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  faits++;
  touches.push(id);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} accroche(s) posées sous le titre`);
console.log(touches.slice(0, 16).join("  ·  "));
if (Object.keys(refus).length) {
  console.log("laissés tels quels :", Object.entries(refus).map(([k, v]) => `${k} ${v}`).join(", "));
}
