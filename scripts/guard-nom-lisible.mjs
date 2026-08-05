// Le nom de l'entreprise doit rester lisible.
//
//   node scripts/guard-nom-lisible.mjs [--dry] impact-191 …
//
// Quatorze thèmes peignent le nom du client d'une couleur en dur — « text-
// [#1e2a1c] », un vert presque noir — posée sur un fond qui, lui, varie avec la
// photo. Mesuré sur les pixels du rendu, le nom y sort à 1,1:1 : il disparaît.
// Et sur plusieurs de ces thèmes, l'en-tête est le seul endroit où il figure.
//
// On ne touche ni à la couleur ni à la mise en page : on pose un halo, clair
// sous un texte sombre, sombre sous un texte clair. C'est ce que font les
// journaux pour un titre posé sur une photo, et cela tient quelle que soit
// l'image que le client téléverse.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const ids = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
if (ids.length === 0) {
  console.error("usage: node scripts/guard-nom-lisible.mjs impact-191 …");
  process.exit(1);
}

const luminance = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((x) => {
    const s = x / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

let faits = 0;
const touches = [];

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  let n = 0;

  // Les lignes qui affichent le nom du client et rien d'autre de compliqué.
  const lignes = src.split("\n").map((ligne) => {
    // Le nom, mais aussi ce qui permet d'appeler : un numéro illisible ne sert
    // à rien non plus.
    if (!/client(?:Name|Phone|Email)\(/.test(ligne)) return ligne;
    if (/alt=|aria-|title=|content=|halo du nom/.test(ligne)) return ligne;
    if (/textShadow/.test(ligne)) return ligne;

    // La couleur du texte, telle que le thème l'écrit.
    const teinte =
      /text-\[(#[0-9a-fA-F]{6})\]/.exec(ligne)?.[1] ??
      /color:\s*["'](#[0-9a-fA-F]{6})["']/.exec(ligne)?.[1] ??
      (/text-white|text-\[#f|text-zinc-[123]00|text-neutral-[123]00/.test(ligne) ? "#ffffff" : null);
    if (!teinte) return ligne;

    const halo =
      luminance(teinte) < 0.5
        // Deux couches : un contour net qui détache la lettre, un voile large
        // qui éclaircit le fond. Une seule couche laissait le nom noyé.
        ? '"0 0 2px rgba(255,255,255,0.95), 0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7)"'
        : '"0 0 2px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.8)"';

    // Le halo se pose sur le style existant s'il y en a un, sinon on en ouvre un.
    if (/style=\{\{/.test(ligne)) {
      n++;
      return ligne.replace(/style=\{\{/, `style={{ textShadow: ${halo}, `);
    }
    const balise = /<(\w+)([^>]*?)>/.exec(ligne);
    if (!balise) return ligne;
    n++;
    return ligne.replace(balise[0], `<${balise[1]}${balise[2]} style={{ textShadow: ${halo} }}>`);
  });

  if (n === 0) continue;
  if (!dry) fs.writeFileSync(file, lignes.join("\n"));
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} nom(s) d'entreprise protégés du fond sur ${touches.length} thème(s)`);
console.log(touches.join("  ·  "));
