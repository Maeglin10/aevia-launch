// Branche le titre principal sur l'accroche du client.
//
//   node scripts/wire-headline.mjs [--dry]
//
// 118 thèmes n'affichent pas l'accroche produite pour le client : 25 ne la
// lisent nulle part, et les autres la lisent ailleurs que dans le titre. Le h1
// est pourtant la première chose qu'un visiteur lit et la première qu'un moteur
// indexe.
//
// On ne réécrit qu'un h1 dont le contenu est un texte littéral — ni expression,
// ni composant, ni fragment. Un titre construit mot à mot pour être animé
// (`heroTitle.split(' ').map(...)`) relève du travail thème par thème : y
// injecter une chaîne casserait l'animation.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

let touched = 0;
let count = 0;

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  const original = fs.readFileSync(file, "utf8");

  const decl = /\blet (?:c|fd): any = null;/.exec(original);
  if (!decl) continue;
  const cut = decl.index + decl[0].length;
  const tete = original.slice(0, cut);
  let src = original.slice(cut);
  let n = 0;

  src = src.replace(
    /(<h1\b[^>]*>)(\s*)([^<{\s][^<{]{2,90}?)(\s*)(<\/h1>)/g,
    (m, open, a, texte, b, close) => {
      // Un titre qui contient déjà une expression n'est pas concerné.
      if (texte.includes("${") || texte.includes("??")) return m;
      n++;
      return `${open}${a}{c?.heroHeadline ?? ${JSON.stringify(texte.trim())}}${b}${close}`;
    },
  );

  if (n === 0) continue;
  src = tete + src;
  if (!/\blet c: any = null;/.test(src)) continue;

  if (!dry) fs.writeFileSync(file, src);
  touched++;
  count += n;
}

console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s), ${count} titre(s) branché(s)`);
