// Fait passer les images des thèmes par la photo du client.
//
//   node scripts/wire-photos.mjs --dry
//   node scripts/wire-photos.mjs [impact-353 …]
//
// Le thème garde son image : elle devient le repli, deuxième argument de
// `photo(n, url)`. Un emplacement sans photo cliente affiche donc exactement ce
// qu'il affichait avant.
//
// Deux positions seulement sont traitées ici, celles évaluées au rendu :
//   <img src="https://…">            → src={photo(n, "https://…")}
//   style={{ backgroundImage: `url(https://…)` }}
// Les URL rangées dans une constante de module sont évaluées à l'import, quand
// la session n'existe pas encore : les réécrire là ne produirait rien. Elles
// relèvent du travail thème par thème, à l'endroit où le thème les lit.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const args = process.argv.slice(2);
const dry = args.includes("--dry");
const named = args.filter((a) => a.startsWith("impact-"));
const ids = named.length
  ? named
  : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));

/*
  Ce qui est une image, et rien d'autre. Sans ce filtre, « @import
  url(https://fonts.googleapis.com/…) » se faisait remplacer et le thème ne
  compilait plus : une URL dans un url() n'est pas forcément une photo.
*/
const IS_IMAGE = /\.(jpe?g|png|webp|avif|gif)(\?|$)|images\.(unsplash|pexels)\.com|cdn\.pixabay\.com/i;

const HELPER = `function photo(i: number, fallback: string): string {
  return fd?.photoUrls?.[i] || fallback;
}`;

let touched = 0;
let slots = 0;
const notes = [];

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  let after = before;
  let n = 0;

  // 1) <img src="https://…" …>
  after = after.replace(/src=(["'])(https?:\/\/[^"']+)\1/g, (m, _q, url) =>
    IS_IMAGE.test(url) ? `src={photo(${n++}, ${JSON.stringify(url)})}` : m,
  );

  /*
    2) url(https://…) dans un style inline. L'interpolation exige un gabarit :
    quinze occurrences vivaient dans une chaîne à guillemets simples, où
    « ${…} » serait rendu tel quel à l'écran. On convertit la chaîne entière en
    gabarit dans le même mouvement plutôt que de les laisser de côté.
  */
  after = after.replace(
    /(?<!\[)(['"`])url\((["']?)(https?:\/\/[^"')]+)\2\)\1/g,
    (m, _outer, _inner, url) =>
      IS_IMAGE.test(url) ? `\`url(\${photo(${n++}, ${JSON.stringify(url)})})\`` : m,
  );
  /*
    Les url() déjà dans un gabarit. Le lookbehind écarte les valeurs arbitraires
    Tailwind, celles écrites entre crochets dans un className : ce n'est pas un
    gabarit, l'interpolation s'y écrivait telle quelle dans le HTML et cassait
    le JSX.

    Ne pas écrire ici d'exemple ressemblant à une classe Tailwind : le scanner
    lit ce fichier, fabrique la classe correspondante, et Turbopack échoue
    ensuite à résoudre le chemin d'image qu'elle contient. Ce commentaire-là a
    coûté un build.
  */
  after = after.replace(
    /(?<!\[)url\((["']?)(https?:\/\/[^"')]+)\1\)/g,
    (m, _q, url) =>
      IS_IMAGE.test(url) ? `url(\${photo(${n++}, ${JSON.stringify(url)})})` : m,
  );

  if (n === 0) continue;

  // Le repli lit `fd`, donc le thème doit l'avoir. Sans lui, on ne touche à rien
  // plutôt que d'introduire une référence morte.
  if (!/\blet fd: any = null;/.test(after)) {
    notes.push(`${id}  ${n} emplacement(s) mais pas de fd — à traiter à la main`);
    continue;
  }
  if (!/function photo\(/.test(after)) {
    after = after.replace(/\n(let brand: any = null;|let bp: any = null;)/, `\n$1\n${HELPER}`);
    if (!/function photo\(/.test(after)) {
      after = after.replace(/\n(let fd: any = null;)/, `\n$1\n${HELPER}`);
    }
    if (!/function photo\(/.test(after)) {
      notes.push(`${id}  impossible de poser le helper — à traiter à la main`);
      continue;
    }
  }

  if (!dry) fs.writeFileSync(file, after);
  touched++;
  slots += n;
  notes.push(`${id}  ${n} emplacement(s)`);
}

for (const line of notes) console.log(line);
console.log(
  `\n${dry ? "[à blanc] " : ""}${touched} thème(s), ${slots} emplacement(s) branché(s) sur les photos du client`,
);
