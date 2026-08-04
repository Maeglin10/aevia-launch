// Fait porter au titre du hero l'accroche écrite par le client.
//
//   node scripts/wire-hero-headline.mjs impact-10 impact-114 … [--dry]
//
// `tagline` — « ce que vous faites » — est un champ obligatoire du wizard, et
// quatre-vingt-treize thèmes ne l'affichent nulle part : ils déclarent bien
// `heroHeadline` dans leur type de session, mais ne le lisent que là. Le client
// remplit donc un champ obligatoire dont il ne voit jamais le résultat.
//
// Le titre garde sa balise, ses classes, son style et ses animations : seul son
// contenu textuel change, et seulement si le client a écrit quelque chose.
//
// Un titre dont les enfants sont autre chose que du texte — un composant qui
// découpe la phrase lettre par lettre, une liste passée à `.map`, une image —
// n'est pas touché : y injecter une chaîne casserait l'animation du thème.
// Ceux-là sont listés en fin de passe plutôt que réécrits de force.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const ids = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
if (ids.length === 0) {
  console.error("usage: node scripts/wire-hero-headline.mjs impact-10 [...] [--dry]");
  process.exit(1);
}

// Fin de la balise ouvrante : les accolades d'un `style={{…}}` et la flèche d'un
// `onClick={() => …}` contiennent des `>` qui ne ferment rien.
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
  // i pointe après la balise ouvrante. On compte les <tag> imbriqués.
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
const restants = [];

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) { restants.push(`${id} (absent)`); continue; }
  let src = fs.readFileSync(file, "utf8");
  if (src.includes("/* ACCROCHE */")) { restants.push(`${id} (déjà)`); continue; }

  const arg = /sessionData = session;/.test(src)
    ? "sessionData"
    : /\bconst c = session\?\.generatedContent|\bc = session\?\.generatedContent/.test(src)
      ? "{ formData: fd, generatedContent: c }"
      : "{ formData: fd }";

  // Le premier titre du fichier : dans tous les thèmes mesurés, c'est le hero.
  // La balise est aussi souvent `motion.h1` que `h1`, et quatre-vingt-dix
  // thèmes n'ont pas de h1 du tout — leur hero porte un h2.
  // Le premier titre est souvent celui du logo, écrit `{businessName}` — un
  // titre entièrement dynamique. On essaie donc les titres dans l'ordre et on
  // prend le premier qui porte vraiment une phrase.
  // Un h2 n'est un titre de hero que dans les thèmes qui n'ont pas de h1 :
  // ailleurs c'est un titre de section, et l'accroche du client y tomberait au
  // milieu d'une galerie.
  const aH1 = /<(?:(?:motion|m)\.)?h1\b/.test(src);
  const titres = [...src.matchAll(aH1 ? /<((?:motion|m)\.)?(h1)\b/g : /<((?:motion|m)\.)?(h2)\b/g)];
  if (titres.length === 0) { restants.push(`${id} (pas de titre)`); continue; }
  let choisi = null, motif = "";
  for (const h1 of titres) {
    const balise = h1[0].slice(1);
    const finOuv = finBalise(src, h1.index + h1[0].length);
    if (finOuv === -1) { motif = "balise non fermée"; continue; }
    if (src[finOuv - 1] === "/") { motif = "titre auto-fermant"; continue; }
    const finFerm = fermeElement(src, finOuv + 1, balise.replace(".", "\\."));
    if (finFerm === -1) { motif = "fermeture introuvable"; continue; }
    const enfants = src.slice(finOuv + 1, finFerm);

    if (/\.map\(/.test(enfants)) { motif = "titre construit par map"; continue; }
    if (/<[A-Z]/.test(enfants)) { motif = "titre confié à un composant"; continue; }
    if (/<(img|svg|video)\b/.test(enfants)) { motif = "titre graphique"; continue; }
    if (enfants.includes("clientTagline")) { motif = "déjà"; continue; }
    if (enfants.trim().length === 0) { motif = "titre vide"; continue; }

  // Un titre entièrement dynamique — `{slide.title}`, `{selectedProduct.name}` —
  // n'est pas le hero mais le titre d'une carte, d'une fiche ou d'une lightbox.
  // Y écrire l'accroche du client la ferait apparaître au mauvais endroit.
    const litteral = enfants
    .replace(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;/g, "x")
    .replace(/\s+/g, "")
    .trim();
    if (litteral.length < 8) { motif = "titre dynamique"; continue; }
    choisi = { finOuv, finFerm, enfants };
    break;
  }
  if (!choisi) { restants.push(`${id} (${motif || "aucun titre exploitable"})`); continue; }
  const { finOuv, finFerm, enfants } = choisi;

  const remp = `{/* ACCROCHE */ clientTagline(${arg}) ?? (<>${enfants}</>)}`;
  src = src.slice(0, finOuv + 1) + remp + src.slice(finFerm);

  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
      const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      noms.add("clientTagline");
      return "import {\n" + [...noms].sort().map((n) => `  ${n},\n`).join("") + '} from "@/lib/templates/clientContent";';
    });
  } else {
    const d = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = d ? d.index + d[0].length : 0;
    src = src.slice(0, at) + 'import { clientTagline } from "@/lib/templates/clientContent";\n' + src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  faits++;
  console.log(`${id}  « ${enfants.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 55)} »`);
}

console.log(`\n${dry ? "[à blanc] " : ""}${faits} thème(s) câblé(s)`);
if (restants.length) console.log(`restants (${restants.length}) :\n  ${restants.join("\n  ")}`);
