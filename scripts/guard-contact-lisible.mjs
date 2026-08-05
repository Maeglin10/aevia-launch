// Le halo se pose d'après la couleur réellement rendue.
//
//   node scripts/guard-contact-lisible.mjs /tmp/lis0.json … [--dry]
//
// La première version cherchait la teinte du texte dans le source — « text-
// [#1e2a1c] », « color: '#fff' » — et n'en trouvait que sur six thèmes : ailleurs
// la couleur vient d'une classe nommée, d'une variable, ou d'un parent. Vingt
// thèmes gardaient donc un nom d'entreprise ou un numéro de téléphone qu'on ne
// lit pas.
//
// Ici la couleur vient de la mesure elle-même, telle que le navigateur l'a
// calculée. Un texte sombre reçoit un halo clair, un texte clair un halo sombre,
// et le dessin du thème ne bouge pas.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const fichiers = process.argv.slice(2).filter((a) => a.endsWith(".json"));
if (fichiers.length === 0) {
  console.error("usage: node scripts/guard-contact-lisible.mjs /tmp/lis0.json …");
  process.exit(1);
}

const luminance = (couleur) => {
  const m = couleur.match(/[\d.]+/g);
  if (!m) return null;
  const [r, g, b] = m.slice(0, 3).map(Number).map((x) => {
    const s = x / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const HALO_CLAIR =
  '"0 0 2px rgba(255,255,255,0.95), 0 0 10px rgba(255,255,255,0.9), 0 0 20px rgba(255,255,255,0.7)"';
const HALO_SOMBRE = '"0 0 2px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.8)"';

const fiches = fichiers.flatMap((f) => JSON.parse(fs.readFileSync(f, "utf8")));
let faits = 0;
const touches = [];

for (const fiche of fiches) {
  // On ne s'occupe que du nom de l'entreprise et de son numéro.
  // Les cinq entreprises du harnais, et le numéro qu'elles partagent.
  const cibles = Object.entries(fiche.couleurs ?? {}).filter(([texte]) =>
    /Ateliers Vidal|Maison Bonnefoy|Clinique du Lac|Comptoir des Alpes|Studio Margaux|04 50 11/.test(texte),
  );
  if (cibles.length === 0) continue;

  /*
    L'en-tête de soixante-deux thèmes vit dans `layout.tsx`, et leur module
    partagé porte parfois le nom lui aussi : ne regarder que `page.tsx` laissait
    le nom illisible là où il est le plus visible.
  */
  const fichiers = ["page.tsx", "layout.tsx", "shared.tsx"]
    .map((f) => path.join(ROOT, fiche.id, f))
    .filter((f) => fs.existsSync(f));
  if (fichiers.length === 0) continue;
  let n = 0;

  // Le halo suit la couleur la plus sombre rencontrée : c'est la plus menacée.
  const lum = Math.min(...cibles.map(([, c]) => luminance(c) ?? 1));
  const halo = lum < 0.5 ? HALO_CLAIR : HALO_SOMBRE;

  for (const file of fichiers) {
  const src = fs.readFileSync(file, "utf8");
  const lignes = src.split("\n").map((ligne) => {
    if (!/client(?:Name|Phone|Email)\(/.test(ligne)) return ligne;
    if (/alt=|aria-|title=|content=|textShadow/.test(ligne)) return ligne;
    if (/style=\{\{/.test(ligne)) {
      n++;
      return ligne.replace(/style=\{\{/, `style={{ textShadow: ${halo}, `);
    }
    /*
      La balise qui porte le texte, pas la première de la ligne : celle-ci est
      souvent une icône auto-fermante — `<Droplets size={24} />` — et poser le
      style devant sa barre oblique cassait le fichier.
    */
    const balises = [...ligne.matchAll(/<([A-Za-z][\w.]*)((?:[^<>]|\{[^{}]*\})*?)(\/?)>/g)]
      .filter((m) => m[3] !== "/" && m.index < ligne.indexOf("client"));
    const balise = balises[balises.length - 1];
    if (!balise) return ligne;
    n++;
    return ligne.slice(0, balise.index)
      + `<${balise[1]}${balise[2]} style={{ textShadow: ${halo} }}>`
      + ligne.slice(balise.index + balise[0].length);
  });

  const neuf = lignes.join("\n");
  if (neuf !== src && !dry) fs.writeFileSync(file, neuf);
  }

  if (n === 0) continue;
  faits += n;
  touches.push(`${fiche.id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} nom(s) et numéro(s) protégés du fond sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 20).join("  ·  "));
