// Le titre qui n'attendait que la génération par intelligence artificielle.
//
//   node scripts/wire-titre-heroheadline.mjs --dry
//
// Trente et un thèmes écrivent leur titre ainsi : `{c?.heroHeadline ?? <démo>}`.
// `c` est le contenu rédigé par la génération, que le client du formulaire
// direct n'a jamais — il remplit son nom, sa ville, son accroche, et lit
// pourtant « Neon Genesis » ou « Namib Desert » en très gros.
//
// On insère sa phrase avant : le titre porte ce qu'il a écrit, la génération
// garde sa place quand elle a tourné, et la démonstration reste en dernier
// recours, mot pour mot.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seuls = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
const ids = seuls.length ? seuls : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-")).sort();

let faits = 0;
const touches = [];
const restes = [];

for (const id of ids) {
  const f = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(f)) continue;
  let src = fs.readFileSync(f, "utf8");
  if (/clientHeroLine|clientAccrocheRestante|clientTaglineOr/.test(src)) continue;

  /*
    Seulement dans un titre du hero. Le même motif sert ailleurs — une
    métadonnée, un partage social — où la phrase du client n'a rien à faire.
  */
  const balise = src.search(/<(?:motion\.)?h1\b/);
  if (balise < 0) { restes.push(`${id} (pas de h1)`); continue; }
  const zone = src.slice(balise, balise + 1400);
  const dansLeTitre = zone.indexOf("c?.heroHeadline");
  if (dansLeTitre < 0) { restes.push(`${id} (heroHeadline hors du titre)`); continue; }

  const absolu = balise + dansLeTitre;
  /*
    Jamais dans une expression logique. `active === 0 && c?.heroHeadline ? … : …`
    devient `a && x ?? b` une fois la phrase insérée, que le langage refuse de
    lire — mélanger `??` avec `&&` sans parenthèses est une erreur de syntaxe.
  */
  const avant = src.slice(Math.max(0, absolu - 60), absolu);
  if (/(&&|\|\|)\s*$/.test(avant)) { restes.push(`${id} (titre dans une expression logique)`); continue; }
  /*
    La largeur de ligne se déduit du texte de la démonstration : sa plus longue
    ligne dit ce que le gabarit encaisse. Faute de mieux, seize caractères,
    valeur qui tient sur tous les titres mesurés.
  */
  const apres = src.slice(absolu, absolu + 500);
  const lignes = apres.split(/<br\s*\/?>/).slice(0, 4)
    .map((l) => l.replace(/<[^>]*>/g, "").replace(/\{[^}]*\}/g, "").trim().length)
    .filter((n) => n > 0);
  const largeur = lignes.length ? Math.max(12, Math.min(28, Math.max(...lignes))) : 16;

  src = src.slice(0, absolu)
    + `clientHeroLine(sessionData, 0, 1, ${largeur}) ?? c?.heroHeadline`
    + src.slice(absolu + "c?.heroHeadline".length);

  if (!/^\s*clientHeroLine,/m.test(src)) {
    const marque = '} from "@/lib/templates/clientContent";';
    const fin = src.indexOf(marque);
    if (fin < 0) { restes.push(`${id} (pas d'import du contrat)`); continue; }
    const debut = src.lastIndexOf("import {", fin);
    src = src.slice(0, debut + "import {".length) + "\n  clientHeroLine," + src.slice(debut + "import {".length);
  }

  if (!dry) fs.writeFileSync(f, src);
  faits++;
  touches.push(`${id} (${largeur} car.)`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} titre(s) de hero rendus au client`);
console.log(touches.join("  ·  "));
if (restes.length) console.log(`\nlaissés tels quels (${restes.length}) :\n   ${restes.join("\n   ")}`);
