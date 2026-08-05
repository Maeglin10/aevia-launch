// Une adresse d'image vide n'est pas une adresse.
//
//   node scripts/guard-empty-urls.mjs [--dry] [impact-01 …]
//
// Le client décrit une réalisation sans en fournir la photo : `beforeUrl` et
// `afterUrl` arrivent en chaîne vide. Les projections écrivaient
// `img: b.afterUrl ?? b.beforeUrl ?? demo`, et `??` ne rattrape que `null` et
// `undefined` — la chaîne vide passe. impact-124 rendait ainsi quatre images
// sans source dès que le client remplissait ses réalisations : ses photos
// disparaissaient au moment où il donnait le plus d'informations.
//
// `??` devient `||` sur les seuls champs d'adresse. Le repli du thème reprend
// sa place quand le client n'a rien fourni.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seulement = process.argv.slice(2).filter((a) => a.startsWith("impact-"));

// Les champs qui portent une adresse, et rien d'autre : un `title ?? repli`
// garde son `??`, une chaîne de titre vide n'a jamais fait disparaître d'image.
const CHAMPS = "afterUrl|beforeUrl|imageUrl|photoUrl|imgUrl|coverUrl|logoUrl|avatarUrl|url|img|image|src|cover|photo|avatar|logo|thumbnail|thumb";
/*
  L'accès peut passer par un indice et des points d'interrogation :
  `bp?.beforeAfter?.[0]?.afterUrl ?? PHOTO.gallery1`. Le motif d'origine n'en
  voyait que la forme simple, et cinq thèmes rendaient encore des images sans
  source dès que le client décrivait une réalisation sans photo.
*/
const ADRESSE = new RegExp(`(\\w|\\])\\??\\.(${CHAMPS})\\s*\\?\\?`, "g");

let faits = 0;
const touches = [];
const ids = seulement.length ? seulement : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));

for (const id of ids) {
  const dossier = path.join(ROOT, id);
  if (!fs.existsSync(dossier) || !fs.statSync(dossier).isDirectory()) continue;
  const fichiers = ["page.tsx", "layout.tsx", "shared.tsx"]
    .map((f) => path.join(dossier, f))
    .filter((f) => fs.existsSync(f));
  for (const sous of fs.readdirSync(dossier)) {
    const f = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(f)) fichiers.push(f);
  }

  let n = 0;
  for (const f of fichiers) {
    const src = fs.readFileSync(f, "utf8");
    const neuf = src.replace(ADRESSE, (m0, avant, champ) => {
      n++;
      return `${m0.slice(0, m0.length - 2).replace(/\s*$/, "")} ||`;
    });
    if (neuf === src) continue;
    if (!dry) fs.writeFileSync(f, neuf);
  }
  if (n === 0) continue;
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} adresse(s) d'image protégées du vide sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 16).join("  ·  "));
