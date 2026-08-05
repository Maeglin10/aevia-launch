// Un titre écrit en plusieurs balises est un seul titre.
//
//   node scripts/wire-hero-multi.mjs [--dry] [impact-01 …]
//
// Trente thèmes composent leur titre de hero en `h1` successifs — un par ligne,
// chacun avec son animation et sa couleur :
//
//   <h1>Elena</h1>
//   <h1>Korr<span>.</span></h1>
//
// La passe précédente n'en voyait que le premier : « Elena » sur cinq
// caractères, aucune formule du client n'y tenait, et le thème gardait son
// titre. Ici les balises voisines sont réunies et traitées comme les lignes
// d'une même phrase — ce qu'elles sont à l'écran.

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

const texteNet = (x) =>
  x.replace(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, "").replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();

let faits = 0;
const touches = [];
const refus = {};
const ids = seulement.length ? seulement : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!/^let sessionData: any = null;/m.test(src)) continue;
  /*
    Un thème peut avoir un appel au contrat ailleurs — dans une section, dans un
    sous-titre — sans que son titre soit branché. Écarter le fichier entier
    laissait « Elena Korr. » en place sur trois cents thèmes.
  */

  // Les titres du haut de page, dans l'ordre.
  const titres = [];
  for (const m of src.matchAll(/<((?:motion|m)\.)?h1\b/g)) {
    const finOuv = finBalise(src, m.index + m[0].length);
    if (finOuv === -1 || src[finOuv - 1] === "/") continue;
    const finFerm = fermeElement(src, finOuv + 1, m[0].slice(1).replace(".", "\\."));
    if (finFerm === -1) continue;
    titres.push({ deb: m.index, finOuv, finFerm, dedans: src.slice(finOuv + 1, finFerm) });
    if (titres.length >= 6) break;
  }
  if (titres.length < 2) { refus["un seul titre"] = (refus["un seul titre"] ?? 0) + 1; continue; }

  // Voisins : moins de neuf cents caractères entre la fin de l'un et le début
  // du suivant. Au-delà, c'est un titre de section, pas une ligne du hero.
  const groupe = [titres[0]];
  for (let i = 1; i < titres.length; i++) {
    if (titres[i].deb - groupe[groupe.length - 1].finFerm > 900) break;
    groupe.push(titres[i]);
  }
  if (groupe.length < 2) { refus["titres éloignés"] = (refus["titres éloignés"] ?? 0) + 1; continue; }

  /*
    Chaque ligne se réécrit dans son repli si elle en a un — la passe des
    sections a pu la rendre retouchable —, sinon dans son contenu entier.
  */
  const lignes = [];
  for (const t of groupe) {
    /*
      Le repli s'écrit de deux façons : `clientText(…) ?? (<> … </>)` posé par la
      passe des sections, ou `c?.heroHeadline ?? <> … </>` écrit par le thème.
      N'en reconnaître qu'une laissait tout le titre dans une expression, dont il
      ne restait aucun texte à mesurer.
    */
    const retouche = /\?\?\s*\(?<>/.exec(t.dedans);
    const debut = retouche ? retouche.index + retouche[0].length : 0;
    const ferme = t.dedans.lastIndexOf("</>");
    const fin = retouche ? (ferme === -1 ? -1 : ferme) : t.dedans.length;
    if (fin <= debut) { lignes.length = 0; break; }
    const corps = t.dedans.slice(debut, fin);
    if (/client[A-Z]/.test(corps) || /\.map\(/.test(corps)) { lignes.length = 0; break; }
    const texte = texteNet(corps);
    if (!texte || texte.length > 60) { lignes.length = 0; break; }
    lignes.push({ deb: t.finOuv + 1 + debut, fin: t.finOuv + 1 + debut + corps.length, texte, corps });
  }
  if (lignes.length < 2) { refus["repli illisible"] = (refus["repli illisible"] ?? 0) + 1; continue; }

  const maxLigne = Math.max(...lignes.map((l) => l.texte.length));
  const total = lignes.length;
  for (let i = lignes.length - 1; i >= 0; i--) {
    const l = lignes[i];
    const remp = `{clientHeroLine(sessionData, ${i}, ${total}, ${maxLigne}) ?? (<>${l.corps}</>)}`;
    src = src.slice(0, l.deb) + remp + src.slice(l.fin);
  }

  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m0, g) => {
      const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      noms.add("clientHeroLine");
      return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
    });
  } else {
    const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
    const at = d ? d.index + d[0].length : 0;
    src = src.slice(0, at) + 'import { clientHeroLine } from "@/lib/templates/clientContent";\n' + src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  faits++;
  touches.push(`${id} (${total} lignes)`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} titre(s) en plusieurs balises réunis`);
console.log(touches.slice(0, 14).join("  ·  "));
if (Object.keys(refus).length) {
  console.log("laissés tels quels :", Object.entries(refus).map(([k, v]) => `${k} ${v}`).join(", "));
}
