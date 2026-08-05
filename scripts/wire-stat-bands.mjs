// Branche les bandeaux de chiffres écrits à même le rendu.
//
//   node scripts/wire-stat-bands.mjs [--dry] [impact-01 …]
//
// Quarante-six sections muettes sont des bandeaux de chiffres — « 15+ Years
// Experience · 42 Remote Destinations · 4.9/5 Guest Satisfaction ». Les passes
// précédentes ne voyaient que les listes d'objets nommées ; ici la donnée est
// soit un tableau de paires, soit quatre blocs recopiés côte à côte. Le client
// remplit pourtant ses chiffres au wizard.
//
// Deux formes, deux câblages :
//
//   [["137", "Ans d'histoire"], …].map(([n, l]) => …)
//     devient clientStats(…)?.map((s) => [s.value, s.label]) ?? [ … ]
//
//   <div>15+</div><div>Years Experience</div>  (×4)
//     devient {clientStats(…)?.[0]?.value ?? "15+"} et son libellé
//
// Dans les deux cas le thème garde sa mise en page, ses icônes et ses couleurs :
// seules les chaînes changent, et seulement si le client a rempli.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seulement = process.argv.slice(2).filter((a) => a.startsWith("impact-"));

const ENTREE =
  /client(?:Services|Reviews|Stats|Faq|Team|Areas|Certifications|Name|City|Tagline|Address|Photos|LegalForm|Text|List)\s*\(|\bfd\??\.|\bbp\??\.|\bc\??\.[a-z]|__layoutSession|sessionData/;

/*
  Ce qui se lit comme un chiffre clé : « 15+ », « 4.9/5 », « 100% », « 72h »,
  « 250k+ ». N'accepter qu'un seul caractère d'unité laissait passer « 250k+ »
  pour du texte, et le bandeau du hero d'impact-11 restait celui du thème.
*/
const CHIFFRE = /^\d[\d\s.,]*[a-zA-Z+%°/\d]{0,4}$/;

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

function texteNet(x) {
  return x.replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
}

// Un tableau de paires de chaînes : [["137", "Ans d'histoire"], …]
function pairesDeChaines(corps) {
  const dedans = corps.slice(1, -1).trim();
  if (!dedans.startsWith("[")) return null;
  let k = 0, paires = 0;
  while (k < dedans.length) {
    while (k < dedans.length && /[\s,]/.test(dedans[k])) k++;
    if (k >= dedans.length) break;
    if (dedans[k] !== "[") return null;
    const f = ferme(dedans, k, "[", "]");
    if (f === -1) return null;
    const membres = dedans.slice(k + 1, f).split(",").map((x) => x.trim()).filter(Boolean);
    if (membres.length !== 2) return null;
    if (!membres.every((x) => /^["'].*["']$/s.test(x))) return null;
    paires++;
    k = f + 1;
  }
  return paires >= 2 ? paires : null;
}

// Un bandeau de chiffres commence par des chiffres : « 250k+ », « 92% », « 27 ».
function premieresValeursChiffrees(corps) {
  const premiers = [...corps.matchAll(/\[\s*(["'])((?:(?!\1).)*)\1/g)].map((m) => m[2]);
  return premiers.length >= 2 && premiers.every((x) => CHIFFRE.test(x.trim()));
}

let faitsA = 0, faitsB = 0;
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

  /*
    Les bandeaux de chiffres ne vivent pas tous dans une section muette : celui
    d'impact-11 — « 250k+ Apprenants actifs · 500+ Cours disponibles · 92% Taux
    d'emploi » — trône sous le titre du hero, dans une section qui porte par
    ailleurs le nom et l'accroche du client. On traite donc les tableaux de
    paires partout, à condition que la première valeur de chaque paire se lise
    comme un chiffre : « Apprenants actifs » n'en est pas un.
  */
  for (const m of [...src.matchAll(/\[/g)].reverse()) {
    const f = ferme(src, m.index, "[", "]");
    if (f === -1) continue;
    if (!/^\s*\.map\(/.test(src.slice(f + 1))) continue;
    const corps = src.slice(m.index, f + 1);
    if (!pairesDeChaines(corps)) continue;
    if (!premieresValeursChiffrees(corps)) continue;
    const remp = `(clientStats(sessionData)?.map((s: any) => [s.value, s.label]) ?? ${corps})`;
    src = src.slice(0, m.index) + remp + src.slice(f + 1);
    n++; faitsA++;
  }

  for (const { deb, fin } of sections(src).reverse()) {
    const bloc = src.slice(deb, fin);
    if (ENTREE.test(bloc) || citeUneCablee(bloc)) continue;

    // Forme A — le tableau de paires.
    let faitA = false;
    for (const m of bloc.matchAll(/\[/g)) {
      const f = ferme(bloc, m.index, "[", "]");
      if (f === -1) continue;
      if (!/^\s*\.map\(/.test(bloc.slice(f + 1))) continue;
      if (!pairesDeChaines(bloc.slice(m.index, f + 1))) continue;
      const tableau = bloc.slice(m.index, f + 1);
      const remp = `(clientStats(sessionData)?.map((s: any) => [s.value, s.label]) ?? ${tableau})`;
      src = src.slice(0, deb + m.index) + remp + src.slice(deb + f + 1);
      n++; faitsA++; faitA = true;
      break;
    }
    if (faitA) continue;

    /*
      Forme B — les blocs recopiés. On relève, dans l'ordre, tous les éléments
      qui ne portent qu'un texte ; un chiffre suivi d'un libellé fait une paire.
      Il en faut au moins deux : un chiffre isolé est une décoration, pas un
      bandeau.
    */
    const porteurs = [];
    for (const m of bloc.matchAll(/<((?:motion|m)\.)?(div|span|p|h1|h2|h3|h4|strong|b)\b/g)) {
      const fo = finBalise(bloc, m.index + m[0].length);
      if (fo === -1 || bloc[fo - 1] === "/") continue;
      const ff = fermeElement(bloc, fo + 1, m[0].slice(1).replace(".", "\\."));
      if (ff === -1) continue;
      const enfants = bloc.slice(fo + 1, ff);
      if (/[<{]/.test(enfants)) continue;
      const texte = texteNet(enfants);
      if (!texte) continue;
      porteurs.push({ deb: fo + 1, fin: ff, texte });
    }
    porteurs.sort((a, b) => a.deb - b.deb);

    const paires = [];
    for (let k = 0; k + 1 < porteurs.length; k++) {
      if (!CHIFFRE.test(porteurs[k].texte)) continue;
      if (CHIFFRE.test(porteurs[k + 1].texte)) continue;
      if (porteurs[k + 1].texte.length > 40) continue;
      paires.push([porteurs[k], porteurs[k + 1]]);
      k++;
    }
    if (paires.length < 2) continue;

    const edits = [];
    paires.forEach(([v, l], i) => {
      edits.push({ ...v, remp: `{clientStats(sessionData)?.[${i}]?.value ?? ${JSON.stringify(v.texte)}}` });
      edits.push({ ...l, remp: `{clientStats(sessionData)?.[${i}]?.label ?? ${JSON.stringify(l.texte)}}` });
    });
    for (const e of edits.sort((a, b) => b.deb - a.deb)) {
      src = src.slice(0, deb + e.deb) + e.remp + src.slice(deb + e.fin);
    }
    n++; faitsB++;
  }

  if (n === 0) continue;
  if (!/import \{[^}]*\bclientStats\b/.test(src)) {
    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m0, g) => {
        const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
        noms.add("clientStats");
        return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
      });
    } else {
      const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = d ? d.index + d[0].length : 0;
      src = src.slice(0, at) + 'import { clientStats } from "@/lib/templates/clientContent";\n' + src.slice(at);
    }
  }
  if (!dry) fs.writeFileSync(file, src);
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faitsA} tableau(x) de paires et ${faitsB} bandeau(x) recopié(s) branchés sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 14).join("  ·  "));
