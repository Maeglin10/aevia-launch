// L'accroche du client, mais pas plus grande que le titre du thème.
//
//   node scripts/wire-hero-gabarit.mjs [--dry] [impact-01 …]
//
// Quatre-vingt-seize thèmes versaient déjà l'accroche du client dans leur titre
// de hero — `clientTagline(sessionData) ?? "…"` — sans se demander si elle y
// tenait. impact-240 affichait « VOTRE FLEURISTE DE CONFIANCE À ALBERTVILLE
// DEPUIS 1998 » en lettres géantes, première ligne coupée par l'en-tête.
//
// `clientHeroLine` connaît le gabarit du thème : à défaut d'y faire tenir
// l'accroche, il écrit « Fleuriste à Albertville », puis le nom, puis rend la
// main au thème. On remplace donc l'appel, en lui donnant pour mesure la
// longueur du titre d'origine.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seulement = process.argv.slice(2).filter((a) => a.startsWith("impact-"));

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
const ids = seulement.length ? seulement : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!/^let sessionData: any = null;/m.test(src)) continue;

  const t = /<((?:motion|m)\.)?(h1)\b/.exec(src) ?? /<((?:motion|m)\.)?(h2)\b/.exec(src);
  if (!t) continue;
  const finOuv = finBalise(src, t.index + t[0].length);
  if (finOuv === -1 || src[finOuv - 1] === "/") continue;
  const finFerm = fermeElement(src, finOuv + 1, t[0].slice(1).replace(".", "\\."));
  if (finFerm === -1) continue;
  const dedans = src.slice(finOuv + 1, finFerm);
  if (dedans.includes("clientHeroLine")) continue;

  /*
    Deux écritures du même repli : une chaîne, ou un fragment JSX quand le thème
    coupe son titre en plusieurs lignes.
  */
  const appel = /clientTagline\(\s*(sessionData|session)\s*\)/.exec(dedans);
  if (!appel) { refus["pas d'accroche dans le titre"] = (refus["pas d'accroche dans le titre"] ?? 0) + 1; continue; }

  const apres = dedans.slice(appel.index + appel[0].length);
  const chaine = /^\s*\?\?\s*(["'])((?:(?!\1).)*)\1/.exec(apres);
  const fragment = /^\s*\?\?\s*\(<>([\s\S]*?)<\/>\)/.exec(apres);
  const origine = chaine ? chaine[2] : fragment ? fragment[1] : null;
  if (origine === null) { refus["repli illisible"] = (refus["repli illisible"] ?? 0) + 1; continue; }

  // Le gabarit : la plus longue ligne du titre d'origine.
  const maxLigne = Math.max(
    ...origine
      .split(/<br\s*\/?>|\\n|\n/)
      .map((x) => x.replace(/<[^>]*>/g, "").replace(/\{[^{}]*\}/g, "").replace(/\s+/g, " ").trim().length),
  );
  if (!Number.isFinite(maxLigne) || maxLigne < 3) { refus["repli trop court"] = (refus["repli trop court"] ?? 0) + 1; continue; }

  const deb = finOuv + 1 + appel.index;
  const neuf = `clientHeroLine(${appel[1]}, 0, 1, ${maxLigne})`;
  src = src.slice(0, deb) + neuf + src.slice(deb + appel[0].length);

  if (!/import \{[^}]*\bclientHeroLine\b/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m0, g) => {
      const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      noms.add("clientHeroLine");
      return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
    });
  }

  if (!dry) fs.writeFileSync(file, src);
  faits++;
  touches.push(`${id} (${maxLigne})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} accroche(s) de titre mises au gabarit du thème`);
console.log(touches.slice(0, 16).join("  ·  "));
if (Object.keys(refus).length) {
  console.log("laissés tels quels :", Object.entries(refus).map(([k, v]) => `${k} ${v}`).join(", "));
}
