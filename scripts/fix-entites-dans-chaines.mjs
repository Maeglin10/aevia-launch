// Les entités HTML écrites au milieu d'une chaîne JavaScript.
//
//   node scripts/fix-entites-dans-chaines.mjs [--dry]
//
// Sur impact-237, on lit à l'écran : « le cabinet de référence de la Côte
// d&apos;Azur. » Sur impact-239 : « fondé sur l&apos;exigence, l&apos;écoute et
// vingt-cinq ans d&apos;engagement ». L'entité s'affiche telle quelle.
//
// La raison tient en une ligne : dans le texte d'un élément JSX, React décode
// les entités HTML ; dans une chaîne JavaScript, non — c'est du texte, rien de
// plus. Le câblage a déplacé des phrases du premier endroit vers le second, et
// les entités ont cessé d'être lues.
//
// On ne corrige donc que ce qui est à l'intérieur d'une chaîne. Le reste du
// fichier, où l'entité fonctionne, n'est pas touché.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const ENTITES = {
  "&apos;": "'",
  "&#39;": "'",
  "&quot;": '"',
  "&amp;": "&",
  "&nbsp;": " ",
  "&ndash;": "–",
  "&mdash;": "—",
  "&hellip;": "…",
};

/*
  Suivre l'état « dans une chaîne ou non » demande une précaution propre au
  français : dans « l'exigence », l'apostrophe n'ouvre pas une chaîne. On ne la
  compte comme délimiteur que si elle n'est pas encadrée de lettres — sans quoi
  la moitié des phrases françaises fait basculer l'analyse et tout le reste du
  fichier est lu de travers.
*/
function corriger(src) {
  let out = "";
  let chaine = null;
  let corrections = 0;

  for (let i = 0; i < src.length; i++) {
    const c = src[i];

    if (chaine && c === "\\") { out += c + (src[i + 1] ?? ""); i++; continue; }

    if (c === '"' || c === "`" || c === "'") {
      const estDelimiteur =
        c !== "'" ||
        !(/[\p{L}]/u.test(src[i - 1] ?? "") && /[\p{L}]/u.test(src[i + 1] ?? ""));
      if (estDelimiteur) {
        if (chaine === c) chaine = null;
        else if (!chaine) chaine = c;
      }
      out += c;
      continue;
    }

    if (chaine && c === "&") {
      const suite = src.slice(i, i + 9);
      const trouve = Object.keys(ENTITES).find((e) => suite.startsWith(e));
      if (trouve) {
        let remplacement = ENTITES[trouve];
        // Le caractère de remplacement ne doit pas refermer la chaîne où il vit.
        if (remplacement === chaine) remplacement = "\\" + remplacement;
        out += remplacement;
        i += trouve.length - 1;
        corrections++;
        continue;
      }
    }

    out += c;
  }
  return { out, corrections };
}

let total = 0;
const touches = [];
for (const d of fs.readdirSync(ROOT).filter((x) => x.startsWith("impact-"))) {
  for (const nom of ["page.tsx", "layout.tsx", "shared.tsx"]) {
    const f = path.join(ROOT, d, nom);
    if (!fs.existsSync(f)) continue;
    const src = fs.readFileSync(f, "utf8");
    if (!/&(apos|quot|amp|nbsp|#39|ndash|mdash|hellip);/.test(src)) continue;
    const { out, corrections } = corriger(src);
    if (corrections === 0) continue;
    if (!dry) fs.writeFileSync(f, out);
    total += corrections;
    touches.push(`${d}${nom === "page.tsx" ? "" : "/" + nom} (${corrections})`);
  }
}

console.log(`${dry ? "[à blanc] " : ""}${total} entité(s) décodées dans des chaînes, sur ${touches.length} fichier(s)`);
console.log(touches.slice(0, 14).join("  ·  "));
