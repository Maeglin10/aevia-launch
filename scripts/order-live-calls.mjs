// Place les recalculs après toutes les variables de session.
//
//   node scripts/order-live-calls.mjs [--dry]
//
// `SERVICES_SOURCE = SERVICES_SOURCE_LIVE();` lit `sessionData`. Quand cette
// ligne est écrite juste après `fd = session?.formData;` et que `sessionData =
// session;` n'arrive que trente lignes plus bas, derrière un `useEffect`, le
// recalcul se fait sur une session encore nulle : le thème affiche sa ville de
// démonstration alors que tout est correctement câblé.
//
// Réordonner le bloc de rendu ne suffit pas — les deux lignes n'y sont pas
// toujours ensemble. On déplace donc les recalculs sous la dernière variable de
// session, où qu'elle soit.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const SOURCE = /^\s*(?:fd|bp|c|sessionData)\s*=\s*(?:session|__session)(?:\?\.\w+)?;\s*$/;
const LIVE = /^\s*(\w+)\s*=\s*\1_LIVE\(\);\s*$/;

let faits = 0;
const touches = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  const fichiers = [path.join(dossier, "page.tsx"), path.join(dossier, "layout.tsx")];
  for (const sous of fs.readdirSync(dossier)) {
    const f = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(f)) fichiers.push(f);
  }

  for (const file of fichiers) {
    if (!fs.existsSync(file)) continue;
    const lignes = fs.readFileSync(file, "utf8").split("\n");

    const iSources = lignes.map((l, i) => (SOURCE.test(l) ? i : -1)).filter((i) => i >= 0);
    const iLive = lignes.map((l, i) => (LIVE.test(l) ? i : -1)).filter((i) => i >= 0);
    if (iSources.length === 0 || iLive.length === 0) continue;

    // Le recalcul doit venir après les variables de session — il les lit — et
    // avant tout ce qui lit la constante recalculée. Une seule position
    // satisfait les deux : juste sous la dernière variable de session.
    const derniereSource = iSources[iSources.length - 1];
    const dejaEnPlace = iLive.every((i, k) => i === derniereSource + k + 1);
    if (dejaEnPlace) continue;

    const aDeplacer = iLive.map((i) => lignes[i]);
    const restantes = lignes.filter((_, i) => !iLive.includes(i));
    const nouvelleFin = restantes.findIndex((l) => l === lignes[derniereSource]);
    restantes.splice(nouvelleFin + 1, 0, ...aDeplacer);

    if (!dry) fs.writeFileSync(file, restantes.join("\n"));
    faits += aDeplacer.length;
    touches.push(`${file.replace(`${ROOT}/`, "")} (${aDeplacer.length})`);
  }
}

console.log(`${dry ? "[à blanc] " : ""}${faits} recalcul(s) déplacé(s) sur ${touches.length} fichier(s)`);
console.log(touches.slice(0, 12).join("  ·  "));
