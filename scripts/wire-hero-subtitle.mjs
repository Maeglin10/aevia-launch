// La ligne sous le titre annonce ce que le client fait.
//
//   node scripts/wire-hero-subtitle.mjs [--dry] [impact-01 …]
//
// Le titre du hero porte désormais la donnée du client. La ligne juste dessous,
// elle, est restée celle de la démonstration : « Coaching sportif premium à
// Chambéry. Résultats garantis ou remboursés. » sous le titre d'un coiffeur.
//
// Elle reçoit les trois premières prestations du client — c'est ce qu'il a
// écrit, rien n'est inventé — et le texte du thème reste en repli, mot pour mot,
// pour qui ne remplit pas cette partie du wizard.

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
  if (src.includes("clientHeroSubtitle")) { refus["déjà"] = (refus["déjà"] ?? 0) + 1; continue; }

  const t = /<((?:motion|m)\.)?(h1)\b/.exec(src) ?? /<((?:motion|m)\.)?(h2)\b/.exec(src);
  if (!t) continue;
  const finOuv = finBalise(src, t.index + t[0].length);
  if (finOuv === -1 || src[finOuv - 1] === "/") continue;
  const finFerm = fermeElement(src, finOuv + 1, t[0].slice(1).replace(".", "\\."));
  if (finFerm === -1) continue;
  // Le titre doit déjà parler du client, sinon il n'y a pas de doublon à éviter.
  const titre = src.slice(finOuv + 1, finFerm);
  if (!/client(HeroLine|Tagline|Name)/.test(titre)) { refus["titre pas branché"] = (refus["titre pas branché"] ?? 0) + 1; continue; }

  // Le premier paragraphe qui suit, s'il n'est qu'un texte écrit en dur.
  const suite = src.slice(finFerm, finFerm + 2600);
  const para = /<((?:motion|m)\.)?p\b[^>]*>([\s\S]{40,420}?)<\/(?:motion\.|m\.)?p>/.exec(suite);
  if (!para) { refus["pas de paragraphe"] = (refus["pas de paragraphe"] ?? 0) + 1; continue; }
  if (/[{}]/.test(para[2]) || !/\p{L}/u.test(para[2])) { refus["paragraphe déjà vivant"] = (refus["paragraphe déjà vivant"] ?? 0) + 1; continue; }

  const texte = para[2].replace(/\s+/g, " ").trim();
  const deb = finFerm + para.index + para[0].indexOf(para[2]);
  src = src.slice(0, deb) + `{clientHeroSubtitle(sessionData) ?? ${JSON.stringify(texte)}}` + src.slice(deb + para[2].length);

  if (!/import \{[^}]*\bclientHeroSubtitle\b/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m0, g) => {
      const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      noms.add("clientHeroSubtitle");
      return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
    });
  }

  if (!dry) fs.writeFileSync(file, src);
  faits++;
  touches.push(id);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} sous-titre(s) de hero branchés sur les prestations du client`);
console.log(touches.slice(0, 16).join("  ·  "));
if (Object.keys(refus).length) {
  console.log("laissés tels quels :", Object.entries(refus).map(([k, v]) => `${k} ${v}`).join(", "));
}
