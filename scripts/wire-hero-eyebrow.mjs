// Le sur-titre du hero annonce le métier du client.
//
//   node scripts/wire-hero-eyebrow.mjs [--dry] [impact-01 …]
//
// Au-dessus du titre, la plupart des thèmes posent une courte ligne en
// capitales : « VISUAL STORYTELLER », « ATELIER DEPUIS 1987 », « PALACE —
// FOUNDED 1887 ». Le titre porte désormais le métier du client et le sous-titre
// ses prestations ; cette ligne-là reste la dernière du hero à parler d'une
// autre entreprise.
//
// Elle reçoit le métier et la ville — « Plombier · Annecy » —, et garde son
// texte d'origine pour qui ne remplit pas le wizard. On ne prend que les lignes
// courtes situées juste avant le titre : au-delà, c'est une phrase, et une
// phrase se retouche depuis l'aperçu.

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
  x.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();

let faits = 0;
const touches = [];
const refus = {};
const ids = seulement.length ? seulement : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!/^let sessionData: any = null;/m.test(src)) continue;

  const titre = /<((?:motion|m)\.)?h1\b/.exec(src);
  if (!titre) { refus["pas de titre"] = (refus["pas de titre"] ?? 0) + 1; continue; }

  // La zone du sur-titre : les huit cents caractères qui précèdent le titre.
  const debutZone = Math.max(0, titre.index - 800);
  const zone = src.slice(debutZone, titre.index);

  let choisi = null;
  for (const m of zone.matchAll(/<((?:motion|m)\.)?(p|span|div)\b/g)) {
    const finOuv = finBalise(zone, m.index + m[0].length);
    if (finOuv === -1 || zone[finOuv - 1] === "/") continue;
    const finFerm = fermeElement(zone, finOuv + 1, m[0].slice(1).replace(".", "\\."));
    if (finFerm === -1) continue;
    const dedans = zone.slice(finOuv + 1, finFerm);
    if (/[{}]/.test(dedans)) continue;
    const texte = texteNet(dedans);
    // Court, écrit, et pas déjà une donnée du client.
    if (texte.length < 4 || texte.length > 34) continue;
    if (!/\p{L}/u.test(texte)) continue;
    choisi = { deb: debutZone + finOuv + 1, fin: debutZone + finFerm, texte };
  }
  if (!choisi) { refus["pas de sur-titre"] = (refus["pas de sur-titre"] ?? 0) + 1; continue; }

  const remp = `{clientEyebrow(sessionData) ?? ${JSON.stringify(choisi.texte)}}`;
  src = src.slice(0, choisi.deb) + remp + src.slice(choisi.fin);

  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m0, g) => {
      const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      noms.add("clientEyebrow");
      return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
    });
  } else {
    const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
    const at = d ? d.index + d[0].length : 0;
    src = src.slice(0, at) + 'import { clientEyebrow } from "@/lib/templates/clientContent";\n' + src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  faits++;
  touches.push(`${id} («${choisi.texte.slice(0, 22)}»)`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} sur-titre(s) de hero branchés sur le métier du client`);
console.log(touches.slice(0, 12).join("  ·  "));
if (Object.keys(refus).length) {
  console.log("laissés tels quels :", Object.entries(refus).map(([k, v]) => `${k} ${v}`).join(", "));
}
