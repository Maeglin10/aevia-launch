// Rend retouchables les listes écrites à même la section.
//
//   node scripts/wire-section-lists.mjs [--dry] [impact-01 …]
//
// Cinquante-cinq sections muettes portent leur texte dans un tableau écrit sur
// place — `{["Fondée en 2018…", "Notre conviction…"].map(…)}` — que ni la passe
// des titres ni celle des étiquettes n'atteignaient : le texte n'est pas dans
// l'élément, il est dans la donnée.
//
// Le tableau devient `clientList(sessionData, "cle.liste") ?? [ … ]`. Sans
// retouche, le thème affiche exactement ce qu'il affichait ; avec, le client
// remplace la liste ligne par ligne depuis l'aperçu.
//
// On ne prend que les tableaux de chaînes simples. Un tableau de paires —
// `[["137", "Ans d'histoire"], …]` — se lit `.map(([n, t]) => …)` : y rendre
// des chaînes plates casserait la section.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seulement = process.argv.slice(2).filter((a) => a.startsWith("impact-"));

const ENTREE =
  /client(?:Services|Reviews|Stats|Faq|Team|Areas|Certifications|Name|City|Tagline|Address|Photos|LegalForm|Text|List)\s*\(|\bfd\??\.|\bbp\??\.|\bc\??\.[a-z]|__layoutSession|sessionData/;

function ferme(s, i, o, c) {
  let n = 0, guil = null;
  for (let k = i; k < s.length; k++) {
    const ch = s[k];
    if (guil) { if (ch === guil && s[k - 1] !== "\\") guil = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { guil = ch; continue; }
    if (ch === o) n++;
    else if (ch === c) { n--; if (n === 0) return k; }
  }
  return -1;
}

function sections(src) {
  const out = [];
  const re = /<section\b/g;
  let m;
  while ((m = re.exec(src))) {
    let prof = 1, k = m.index + 8;
    const o = /<section\b/g, f = /<\/section>/g;
    while (prof > 0) {
      o.lastIndex = k; f.lastIndex = k;
      const a = o.exec(src), b = f.exec(src);
      if (!b) return out;
      if (a && a.index < b.index) { prof++; k = a.index + 8; continue; }
      prof--; k = b.index + 10;
    }
    out.push({ deb: m.index, fin: k });
    re.lastIndex = k;
  }
  return out;
}

function variablesCablees(src) {
  const noms = new Set();
  for (const m of src.matchAll(/(?:^|\s)(\w+)\s*=\s*(?:\/\*[^*]*\*\/\s*)?resolveList/g)) noms.add(m[1]);
  for (const m of src.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*(?:\/\*[^*]*\*\/\s*)?resolveList/g)) noms.add(m[1]);
  for (const m of src.matchAll(/(\w+)\s*=\s*\1_LIVE\(\)/g)) noms.add(m[1]);
  for (const m of src.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*\w+_LIVE\(\)/g)) noms.add(m[1]);
  for (let t = 0; t < 3; t++) {
    for (const m of src.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*(\w+);/g)) if (noms.has(m[2])) noms.add(m[1]);
    for (const m of src.matchAll(/(?:^|\s)(\w+)\s*=\s*(\w+)\.map\(/g)) if (noms.has(m[2])) noms.add(m[1]);
  }
  noms.delete("");
  return noms;
}

// Un tableau de chaînes simples, et rien d'autre.
function chainesSeules(corps) {
  const dedans = corps.slice(1, -1).trim();
  if (!dedans) return null;
  const morceaux = [];
  let k = 0;
  while (k < dedans.length) {
    while (k < dedans.length && /[\s,]/.test(dedans[k])) k++;
    if (k >= dedans.length) break;
    const q = dedans[k];
    if (q !== '"' && q !== "'") return null;
    let j = k + 1;
    while (j < dedans.length && !(dedans[j] === q && dedans[j - 1] !== "\\")) j++;
    if (j >= dedans.length) return null;
    morceaux.push(dedans.slice(k, j + 1));
    k = j + 1;
  }
  return morceaux.length >= 2 ? morceaux : null;
}

let faits = 0;
const touches = [];
const ids = seulement.length ? seulement : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!/^let sessionData: any = null;/m.test(src)) continue;

  const cablees = variablesCablees(src);
  const citeUneCablee = (bloc) => [...cablees].some((n) => new RegExp(`[^\\w.]${n}\\b`).test(bloc));
  let n = 0;

  for (const { deb, fin } of sections(src).reverse()) {
    const bloc = src.slice(deb, fin);
    if (ENTREE.test(bloc) || citeUneCablee(bloc)) continue;
    const cle = /\sid=["'`]([\w-]+)["'`]/.exec(bloc)?.[1] ?? `bloc-${deb}`;

    // Le plus long tableau de chaînes de la section : c'est le texte qu'on lit.
    let cible = null;
    for (const m of bloc.matchAll(/\[/g)) {
      const f = ferme(bloc, m.index, "[", "]");
      if (f === -1) continue;
      if (!/^\s*\.map\(/.test(bloc.slice(f + 1))) continue;
      const morceaux = chainesSeules(bloc.slice(m.index, f + 1));
      if (!morceaux) continue;
      const poids = morceaux.join("").length;
      if (poids < 40) continue;
      if (!cible || poids > cible.poids) cible = { deb: m.index, fin: f, morceaux, poids };
    }
    if (!cible) continue;

    const tableau = bloc.slice(cible.deb, cible.fin + 1);
    const remp = `(clientList(sessionData, "${cle}.liste") ?? ${tableau})`;
    src = src.slice(0, deb + cible.deb) + remp + src.slice(deb + cible.fin + 1);
    n++;
  }

  if (n === 0) continue;
  if (!/import \{[^}]*\bclientList\b/.test(src)) {
    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m0, g) => {
        const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
        noms.add("clientList");
        return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
      });
    } else {
      const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = d ? d.index + d[0].length : 0;
      src = src.slice(0, at) + 'import { clientList } from "@/lib/templates/clientContent";\n' + src.slice(at);
    }
  }
  if (!dry) fs.writeFileSync(file, src);
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} liste(s) de section rendues retouchables sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 14).join("  ·  "));
