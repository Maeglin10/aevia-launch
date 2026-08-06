// Le titre ne passe plus sous l'en-tête.
//
//   node scripts/fix-titre-sous-entete.mjs /tmp/entete.json [--dry]
//
// Mesuré au navigateur : sur certains thèmes, la première ligne du titre est
// amputée par la barre de navigation — on lit « AME » au lieu de « TAME YOUR
// BIOLOGY », « HE » au lieu de « THE SILENCE ». Un mot coupé n'est jamais un
// parti pris.
//
// On pousse le titre vers le bas de ce qui le recouvrait, plus une marge de
// respiration. Sur un hero centré, cela décale le bloc sans rien déplacer
// d'autre ; la taille des lettres, la police et l'animation ne bougent pas.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const fichiers = process.argv.slice(2).filter((a) => a.endsWith(".json"));
if (fichiers.length === 0) {
  console.error("usage: node scripts/fix-titre-sous-entete.mjs /tmp/entete.json");
  process.exit(1);
}

const fiches = fichiers.flatMap((f) => JSON.parse(fs.readFileSync(f, "utf8")));
let faits = 0;
const touches = [];

for (const fiche of fiches) {
  if (!(fiche.recouvrement > 8)) continue;
  const file = path.join(ROOT, fiche.id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  /*
    Un hero centré verticalement compense la marge qu'on ajoute : le titre
    remonte d'autant qu'on le pousse. On repasse donc jusqu'à ce que la mesure
    dise zéro, en cumulant à ce qui est déjà posé.
  */
  const deja = /\/\* TITRE_DEGAGE \*\/ marginTop: (\d+)/.exec(src);
  if (deja) {
    const total = Number(deja[1]) + Math.min(220, fiche.recouvrement + 20);
    src = src.replace(deja[0], `/* TITRE_DEGAGE */ marginTop: ${total}`);
    if (!dry) fs.writeFileSync(file, src);
    faits++;
    touches.push(`${fiche.id} (→${total}px)`);
    continue;
  }

  // Ce qu'il faut dégager : le recouvrement mesuré et une marge de vingt pixels.
  const marge = Math.min(220, fiche.recouvrement + 20);

  /*
    Le titre du hero, pas le premier du fichier : sur impact-01, la marge s'est
    posée sur un titre de section au milieu de la page et l'a décalé de deux
    cents pixels. On ne retient donc que les titres du haut du source, là où le
    premier écran se construit.
  */
  const m = [.../<((?:motion|m)\.)?h[12]\b/g[Symbol.matchAll] ? src.matchAll(/<((?:motion|m)\.)?h[12]\b/g) : []]
    .find((x) => x.index < src.length * 0.75 && /hero|Hero|banner|accueil/i.test(src.slice(Math.max(0, x.index - 1500), x.index)))
    ?? /<((?:motion|m)\.)?h1\b/.exec(src);
  if (!m) continue;

  // Le style se pose sur la balise du titre, en tête de ses attributs.
  const apres = m.index + m[0].length;
  const dejaStyle = /^[^>]*\sstyle=\{\{/.test(src.slice(apres, apres + 400));
  if (dejaStyle) {
    const pos = src.indexOf("style={{", apres);
    src = src.slice(0, pos) + `style={{ /* TITRE_DEGAGE */ marginTop: ${marge}, ` + src.slice(pos + "style={{".length);
  } else {
    src = src.slice(0, apres) + ` style={{ /* TITRE_DEGAGE */ marginTop: ${marge} }}` + src.slice(apres);
  }

  if (!dry) fs.writeFileSync(file, src);
  faits++;
  touches.push(`${fiche.id} (+${marge}px)`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} titre(s) dégagés de l'en-tête`);
console.log(touches.slice(0, 16).join("  ·  "));
