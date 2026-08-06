// Dégager le titre en le retrouvant par ce qu'il affiche.
//
//   node scripts/fix-titre-cible.mjs /tmp/entete.json [--dry]
//
// La première version cherchait « le titre du hero » dans le source, par
// voisinage de mots. Elle s'est trompée huit fois : la marge s'est posée sur un
// autre élément, qui n'a pas bougé le titre — et qui, sur impact-01, a décalé de
// deux cents pixels un titre de section au milieu de la page.
//
// On part donc de ce que le navigateur affiche : le texte du titre amputé. On
// retrouve dans le source la balise qui porte ce texte, et c'est elle qu'on
// pousse. Aucune heuristique de voisinage, aucun « probablement le bon ».

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const fiches = process.argv
  .slice(2)
  .filter((a) => a.endsWith(".json"))
  .flatMap((f) => JSON.parse(fs.readFileSync(f, "utf8")));

let faits = 0;
const touches = [];
const perdus = [];

for (const fiche of fiches) {
  if (!(fiche.recouvrement > 8)) continue;
  /*
    Le titre ne vit pas toujours dans page.tsx : certains thèmes portent leur
    en-tête et leur hero dans layout.tsx ou dans un fichier partagé.
  */
  const candidats = ["page.tsx", "layout.tsx", "shared.tsx", "hero.tsx"]
    .map((f) => path.join(ROOT, fiche.id, f))
    .filter((f) => fs.existsSync(f));
  if (candidats.length === 0) continue;
  let file = candidats[0];
  let src = fs.readFileSync(file, "utf8");

  /*
    On retire d'abord les marges posées par la version précédente : elles ne
    déplaçaient pas le titre, et rien ne dit qu'elles ne déplaçaient pas autre
    chose.
  */
  src = src
    .replace(/ style=\{\{ \/\* TITRE_DEGAGE \*\/ marginTop: \d+ \}\}/g, "")
    .replace(/style=\{\{ \/\* TITRE_DEGAGE \*\/ marginTop: \d+, /g, "style={{ ");

  /*
    Le texte rendu, tel que le navigateur l'a lu. Les retours à la ligne du
    rendu ne sont pas dans le source : on ne garde que le premier fragment,
    assez long pour être unique, et on tolère l'espace insécable et les
    accolades JSX entre les mots.
  */
  const rendu = (fiche.titre ?? "").split("\n")[0].trim();
  if (rendu.length < 3) { perdus.push(`${fiche.id} (titre vide)`); continue; }
  const motif = rendu
    .slice(0, 24)
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\s+/g, "[\\s\\S]{0,40}");
  /*
    Le rendu est souvent mis en capitales par la feuille de style : « LIVETICKET »
    pour un source qui dit « LiveTicket ». On compare donc sans tenir compte de
    la casse — sinon on ne retrouve jamais le titre qu'on vient de mesurer.
  */
  let found = null;
  for (const c of candidats) {
    const t = fs.readFileSync(c, "utf8");
    const m = new RegExp(motif, "i").exec(t);
    if (m) { file = c; src = t; found = m; break; }
  }
  if (!found) { perdus.push(`${fiche.id} («${rendu.slice(0, 18)}» absent du source)`); continue; }
  src = src
    .replace(/ style=\{\{ \/\* TITRE_DEGAGE \*\/ marginTop: \d+ \}\}/g, "")
    .replace(/style=\{\{ \/\* TITRE_DEGAGE \*\/ marginTop: \d+, /g, "style={{ ");
  found = new RegExp(motif, "i").exec(src);
  if (!found) { perdus.push(`${fiche.id} (perdu après nettoyage)`); continue; }

  // La balise de titre ouverte juste avant ce texte, c'est celle qui l'affiche.
  const avant = src.slice(0, found.index);
  const balises = [...avant.matchAll(/<((?:motion|m)\.)?h[1-3]\b/g)];
  if (balises.length === 0) { perdus.push(`${fiche.id} (aucune balise de titre)`); continue; }
  const b = balises[balises.length - 1];

  const marge = Math.min(240, fiche.recouvrement + 24);
  const apres = b.index + b[0].length;
  const finBalise = src.indexOf(">", apres);
  const attributs = src.slice(apres, finBalise);

  if (/\sstyle=\{\{/.test(attributs)) {
    const pos = src.indexOf("style={{", apres);
    src = src.slice(0, pos) + `style={{ /* TITRE_DEGAGE */ marginTop: ${marge}, ` + src.slice(pos + "style={{".length);
  } else {
    src = src.slice(0, apres) + ` style={{ /* TITRE_DEGAGE */ marginTop: ${marge} }}` + src.slice(apres);
  }

  if (!dry) fs.writeFileSync(file, src);
  faits++;
  touches.push(`${fiche.id} (+${marge}px)`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} titre(s) dégagés en ciblant le texte affiché`);
if (touches.length) console.log(touches.join("  ·  "));
if (perdus.length) console.log(`non retrouvés : ${perdus.join("  ·  ")}`);
