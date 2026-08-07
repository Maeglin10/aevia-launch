// Le titre du hero, en entier, au client.
//
//   node scripts/wire-titre-suite.mjs --dry impact-01 …
//
// Vingt-quatre thèmes composent leur hero en deux ou trois titres empilés, mais
// n'en branchent qu'un : un plombier lit « Plombier internet's best. », son
// métier suivi du texte de la démonstration. Ce n'est ni sa phrase ni celle du
// thème — c'est un collage.
//
// On déclare au contrat le vrai nombre de lignes et l'on donne à chaque titre
// son rang. Le texte du thème reste en repli, mot pour mot, pour qui n'écrit
// rien.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const ids = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
if (ids.length === 0) { console.error("usage: node scripts/wire-titre-suite.mjs impact-01 …"); process.exit(1); }

let faits = 0;
const touches = [];
const restes = [];

for (const id of ids) {
  const f = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(f)) { restes.push(`${id} (pas de page)`); continue; }
  let src = fs.readFileSync(f, "utf8");

  const appel = /clientHeroLine\(sessionData,\s*0,\s*(\d+),\s*(\d+)\)/.exec(src);
  if (!appel) { restes.push(`${id} (aucun titre branché)`); continue; }
  const [total, largeur] = [Number(appel[1]), Number(appel[2])];
  if (total > 1) { restes.push(`${id} (déjà sur ${total} lignes)`); continue; }

  /*
    Les titres qui suivent celui qui est branché, dans la même portée. On se
    limite à ce qui vient après lui et avant la fin du hero : un titre de
    section situé plus bas dans la page ne fait pas partie du collage.
  */
  const depuis = appel.index;
  const zone = src.slice(depuis, depuis + 4000);
  const suivants = [...zone.matchAll(/<(motion\.)?h[12]\b[^>]*>([\s\S]{0,400}?)<\/(motion\.)?h[12]>/g)]
    .filter((m) => !m[2].includes("clientHeroLine"))
    .filter((m) => {
      /*
        Le contenu peut être du texte nu, ou déjà une expression avec repli —
        « {c?.heroHeadline ?? "devient légende"} ». Dans les deux cas il y a une
        phrase à rendre au client ; on la reconnaît au texte brut ou à la chaîne
        littérale qu'il porte.
      */
      const brut = m[2].replace(/<[^>]*>/g, "").replace(/\{[^}]*\}/g, "").trim();
      const litterale = /"([^"]{4,120})"|'([^']{4,120})'/.exec(m[2]);
      return (brut.length >= 4 && brut.length <= 120) || Boolean(litterale);
    });

  if (suivants.length === 0) { restes.push(`${id} (pas de titre en dur à la suite)`); continue; }

  const nouveauTotal = 1 + suivants.length;
  src = src.replace(
    new RegExp(`clientHeroLine\\(sessionData,\\s*0,\\s*1,\\s*${largeur}\\)`, "g"),
    `clientHeroLine(sessionData, 0, ${nouveauTotal}, ${largeur})`,
  );

  /*
    Chaque titre suivant reçoit son rang. On enveloppe son contenu tel quel :
    le repli garde ses balises, ses entités et sa mise en forme.
  */
  let rang = 1;
  for (const m of suivants) {
    const contenu = m[2];
    const remplace = `{clientHeroLine(sessionData, ${rang}, ${nouveauTotal}, ${largeur}) ?? <>${contenu}</>}`;
    const entier = m[0];
    const neuf = entier.replace(contenu, remplace);
    if (!src.includes(entier)) { restes.push(`${id} (titre ${rang} introuvable après réécriture)`); break; }
    src = src.replace(entier, neuf);
    rang++;
  }

  if (!dry) fs.writeFileSync(f, src);
  faits++;
  touches.push(`${id} (1 → ${nouveauTotal} lignes)`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} titre(s) de hero rendus au client en entier`);
console.log(touches.slice(0, 16).join("  ·  "));
if (restes.length) console.log(`\nlaissés tels quels (${restes.length}) :\n   ${restes.slice(0, 10).join("\n   ")}`);
