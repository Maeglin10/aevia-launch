// Donne une entrée aux sections qui n'en ont aucune.
//
//   node scripts/wire-mute-sections.mjs [--dry] [impact-01 …]
//
// La passe `wire-section-text.mjs` ne regarde qu'un élément par section : son
// premier titre. Quand ce titre est fabriqué par un composant d'animation, par
// un `.map`, ou qu'il est déjà branché, elle abandonne la section entière — et
// cent soixante-quatre sections sont ainsi restées sans la moindre entrée. Le
// client les voit sur son site, elles parlent d'une autre entreprise, et rien
// dans le wizard ne les change.
//
// Ici on essaie tous les porteurs de texte de la section, dans l'ordre où ils
// se lisent — titres, paragraphes, citations, puis le bloc qui porte le plus de
// texte — et on retient le premier qu'on peut réécrire sans risque. Le refus
// d'un candidat ne condamne plus la section.
//
// Ce qu'on ne touche toujours pas : un texte construit par un composant, par un
// `.map`, ou déjà branché sur la donnée du client. Y injecter une chaîne
// casserait le thème, et c'est le design qu'on ne touche pas.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seulement = process.argv.slice(2).filter((a) => a.startsWith("impact-"));

const ENTREE =
  /client(?:Services|Reviews|Stats|Faq|Team|Areas|Certifications|Name|City|Tagline|Address|Photos|LegalForm|Text)\s*\(|\bfd\??\.|\bbp\??\.|\bc\??\.[a-z]|__layoutSession|sessionData/;

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
    const ouvre = /<section\b/g, ferme = /<\/section>/g;
    while (prof > 0) {
      ouvre.lastIndex = k; ferme.lastIndex = k;
      const a = ouvre.exec(src), b = ferme.exec(src);
      if (!b) return out;
      if (a && a.index < b.index) { prof++; k = a.index + 8; continue; }
      prof--; k = b.index + 10;
    }
    out.push({ deb: m.index, fin: k });
    re.lastIndex = k;
  }
  return out;
}

// Les variables que le client alimente ailleurs dans le fichier.
function variablesCablees(src) {
  const noms = new Set();
  for (const m of src.matchAll(/(?:^|\s)(\w+)\s*=\s*(?:\/\*[^*]*\*\/\s*)?resolveList/g)) noms.add(m[1]);
  for (const m of src.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*(?:\/\*[^*]*\*\/\s*)?resolveList/g)) noms.add(m[1]);
  for (const m of src.matchAll(/(\w+)\s*=\s*\1_LIVE\(\)/g)) noms.add(m[1]);
  for (const m of src.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*\w+_LIVE\(\)/g)) noms.add(m[1]);
  for (let tour = 0; tour < 3; tour++) {
    for (const m of src.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*(\w+);/g)) if (noms.has(m[2])) noms.add(m[1]);
    for (const m of src.matchAll(/(?:^|\s)(\w+)\s*=\s*(\w+)\.map\(/g)) if (noms.has(m[2])) noms.add(m[1]);
  }
  noms.delete("");
  return noms;
}

function texteNet(x) {
  return x
    .replace(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

let faits = 0;
const touches = [];
const refus = {};
const ids = seulement.length ? seulement : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!/^let sessionData: any = null;/m.test(src)) { refus["pas de session"] = (refus["pas de session"] ?? 0) + 1; continue; }

  const cablees = variablesCablees(src);
  const citeUneCablee = (bloc) => [...cablees].some((n) => new RegExp(`[^\\w.]${n}\\b`).test(bloc));
  const liste = sections(src);
  let n = 0;

  // De la fin vers le début : chaque réécriture décale ce qui suit.
  for (let k = liste.length - 1; k >= 0; k--) {
    const { deb, fin } = liste[k];
    const bloc = src.slice(deb, fin);
    if (ENTREE.test(bloc) || citeUneCablee(bloc)) continue;

    const cle = /\sid=["'`]([\w-]+)["'`]/.exec(bloc)?.[1] ?? `section-${k + 1}`;

    /*
      Les candidats dans l'ordre de lecture : un titre d'abord, puis la prose.
      Le bloc qui porte le plus de texte vient en dernier — c'est le repli des
      sections qui n'ont ni titre ni paragraphe, un manifeste dans un `div`.
    */
    const candidats = [];
    for (const m of bloc.matchAll(/<((?:motion|m)\.)?(h1|h2|h3|h4|p|blockquote|figcaption)\b/g)) {
      candidats.push({ m, rang: /^h[1-4]$/.test(m[2]) ? 0 : 1 });
    }
    /*
      Un composant qui ne reçoit qu'un texte est lui aussi un porteur : la bande
      défilante d'impact-120 tient tout son contenu dans deux `<ParallaxText>`.
      La vérification des enfants, plus bas, écarte ceux qui enveloppent une
      balise ou une expression — on ne remplace jamais autre chose qu'un texte.
    */
    for (const m of bloc.matchAll(/<([A-Z]\w*)\b/g)) {
      candidats.push({ m: Object.assign([m[0], "", m[1]], { index: m.index }), rang: 1, court: true });
    }
    let long = null;
    for (const m of bloc.matchAll(/<((?:motion|m)\.)?(div|span)\b/g)) {
      const fo = finBalise(bloc, m.index + m[0].length);
      if (fo === -1 || bloc[fo - 1] === "/") continue;
      const ff = fermeElement(bloc, fo + 1, m[0].slice(1).replace(".", "\\."));
      if (ff === -1) continue;
      const dedans = bloc.slice(fo + 1, ff);
      if (/<(?:motion\.|m\.)?(div|span|p|blockquote|h[1-6])\b/.test(dedans)) continue;
      const net = texteNet(dedans);
      if (net.length < 40) continue;
      if (!long || net.length > long.n) long = { m, n: net.length };
    }
    if (long) candidats.push({ m: long.m, rang: 2 });
    candidats.sort((a, b) => a.rang - b.rang || a.m.index - b.m.index);

    /*
      Tous les porteurs valides de la section, pas seulement le premier : une
      bande défilante en porte deux, un manifeste un titre et trois phrases. Une
      section muette ne l'est plus à moitié.
    */
    const retenus = [];
    for (const { m: t, court } of candidats) {
      const balise = t[0].slice(1);
      const finOuv = finBalise(bloc, t.index + t[0].length);
      if (finOuv === -1 || bloc[finOuv - 1] === "/") continue;
      const finFerm = fermeElement(bloc, finOuv + 1, balise.replace(".", "\\."));
      if (finFerm === -1) continue;
      const enfants = bloc.slice(finOuv + 1, finFerm);

      if (/client[A-Z]/.test(enfants)) continue;
      if (/\.map\(/.test(enfants)) continue;
      if (/<[A-Z]/.test(enfants)) continue;
      const litteral = texteNet(enfants);
      if (litteral.length < 3) continue;
      const titre = /^(h[1-4])$/.test(t[2]);
      // Une étiquette de trois mots n'est pas un texte de section — sauf quand
      // elle est tout ce que la section montre.
      if (!titre && !court && litteral.length < 40) continue;
      // Un porteur déjà contenu dans un autre : on garde l'extérieur.
      if (retenus.some((r) => t.index >= r.deb && finFerm <= r.fin)) continue;

      retenus.push({ deb: t.index, fin: finFerm, finOuv, finFerm, enfants, titre });
    }

    if (retenus.length === 0) {
      refus["aucun porteur de texte"] = (refus["aucun porteur de texte"] ?? 0) + 1;
      continue;
    }

    // Les clés se numérotent dans l'ordre de lecture, la réécriture se fait à
    // rebours : chaque remplacement décale ce qui suit.
    const compte = { titre: 0, texte: 0 };
    for (const r of [...retenus].sort((a, b) => a.deb - b.deb)) {
      const genre = r.titre ? "titre" : "texte";
      compte[genre]++;
      r.suffixe = compte[genre] === 1 ? genre : `${genre}-${compte[genre]}`;
    }
    for (const r of retenus.sort((a, b) => b.deb - a.deb)) {
      const remp = `{/* TEXTE_SECTION */ clientText(sessionData, "${cle}.${r.suffixe}") ?? (<>${r.enfants}</>)}`;
      src = src.slice(0, deb + r.finOuv + 1) + remp + src.slice(deb + r.finFerm);
      n++;
    }
  }

  if (n === 0) continue;
  if (!/import \{[^}]*\bclientText\b/.test(src)) {
    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m0, g) => {
        const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
        noms.add("clientText");
        return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
      });
    } else {
      const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = d ? d.index + d[0].length : 0;
      src = src.slice(0, at) + 'import { clientText } from "@/lib/templates/clientContent";\n' + src.slice(at);
    }
  }
  if (!dry) fs.writeFileSync(file, src);
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} section(s) muette(s) rendues retouchables sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 14).join("  ·  "));
if (Object.keys(refus).length) {
  console.log("laissées telles quelles :", Object.entries(refus).map(([k, v]) => `${k} ${v}`).join(", "));
}
