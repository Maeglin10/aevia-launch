// Un préfixe d'adresse n'est pas une photo.
//
//   node scripts/fix-photo-prefix.mjs [--dry]
//
// Six thèmes rangent le début de leurs adresses d'images dans une constante —
// `PHOTO_BASE = "https://images.unsplash.com/photo-"` — et la complètent par un
// identifiant : `${PHOTO_BASE}1571019613454-…?q=80`. La passe des photos y a vu
// une adresse comme une autre et l'a branchée sur celle du client : l'adresse
// rendue devenait « …flowers-1209948_1280.jpg157101961 », et l'image ne
// chargeait jamais.
//
// La constante reprend son préfixe. Ce que le client fournit passe alors par les
// autres emplacements du thème, qui, eux, portent des adresses entières.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

let faits = 0;
const touches = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");

  // Un repli qui se termine par « photo- » ou « / » est un début d'adresse.
  const motif = /\(clientPhotos\([^)]*\)\[\d+\] \|\| (['"])([^'"]*(?:photo-|\/))\1\)/g;
  const neuf = src.replace(motif, (m0, q, prefixe) => {
    faits++;
    return `${q}${prefixe}${q}`;
  });
  if (neuf === src) continue;
  if (!dry) fs.writeFileSync(file, neuf);
  touches.push(id);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} préfixe(s) d'adresse rendus au thème sur ${touches.length} thème(s)`);
console.log(touches.join("  ·  "));
