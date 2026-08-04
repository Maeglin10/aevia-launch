// Le rapport de personnalisation, thème par thème.
//
//   node scripts/rapport-personnalisation.mjs /tmp/fiche0.json …
//
// Rassemble les fiches produites par `final-audit.mjs` et dit, pour chaque
// thème, ce que le client peut y changer et ce qui lui échappe encore. Le
// détail par thème part dans `docs/PERSONNALISATION_PAR_THEME.md` ; le résumé
// s'affiche.

import fs from "node:fs";
import path from "node:path";

const fichiers = process.argv.slice(2).filter((a) => a.endsWith(".json"));
if (fichiers.length === 0) {
  console.error("usage: node scripts/rapport-personnalisation.mjs /tmp/fiche0.json …");
  process.exit(1);
}

const fiches = fichiers.flatMap((f) => JSON.parse(fs.readFileSync(f, "utf8")));
fiches.sort((a, b) => a.id.localeCompare(b.id, "fr", { numeric: true }));

// Les emplacements photo déclarés par chaque thème.
const slots = fs.readFileSync(path.join(process.cwd(), "lib/templates/photoSlots.ts"), "utf8");
const total = {};
for (const m of slots.matchAll(/"(impact-[\w-]+)":\s*\{\s*n:\s*\d+,\s*total:\s*(\d+)/g)) {
  total[m[1]] = Number(m[2]);
}

const compte = {
  total: fiches.length, complets: 0, plantees: 0,
  photos: 0, photosNA: 0, couleur: 0, couleurNA: 0, sansRestes: 0,
};
const manques = {};
const lignes = [];

for (const f of fiches) {
  const sansPhoto = (total[f.id] ?? 0) === 0;
  if (f.plantee) compte.plantees++;
  if (f.photos === "oui") compte.photos++;
  else if (sansPhoto) compte.photosNA++;
  if (f.couleur) compte.couleur++;
  if (f.restes.length === 0) compte.sansRestes++;
  for (const k of f.manquent) manques[k] = (manques[k] ?? 0) + 1;

  const complet = f.manquent.length === 0 && !f.plantee && (f.photos === "oui" || sansPhoto);
  if (complet) compte.complets++;

  lignes.push(
    `| ${f.id} | ${f.manquent.length === 0 ? "✓" : f.manquent.join(", ")} ` +
    `| ${f.affiches.join(", ") || "—"} | ${f.retouches} ` +
    `| ${f.photos === "oui" ? "✓" : sansPhoto ? "—" : "✗"} ` +
    `| ${f.couleur ? "✓" : "—"} | ${f.restes.slice(0, 2).join(", ") || "✓"} |`,
  );
}

const doc = `# Ce que le client peut changer, thème par thème

Mesuré au navigateur : chaque thème reçoit sa propre entreprise — nom, ville,
métier, couleur, prestations, tarifs, avis, chiffres, équipe, questions,
horaires, adresse, réalisations — et ses propres images.

- **blocs** : les blocs que le thème déclare afficher et qui portent bien la
  donnée du client. ✓ signifie qu'aucun ne manque.
- **en plus** : ce que le thème montre au-delà de ses blocs déclarés — téléphone,
  e-mail, adresse, horaires, réalisations.
- **retouches** : les titres, textes et listes que le client peut réécrire depuis
  l'aperçu.
- **photos** : ✓ affichées, — le thème n'a aucun emplacement photo, ✗ non prises.
- **couleur** : ✓ la couleur du client est peinte, — le thème est monochrome.
- **reste** : ce qui subsiste de la démonstration. ✓ signifie rien.

| thème | blocs | en plus | retouches | photos | couleur | reste |
|---|---|---|---|---|---|---|
${lignes.join("\n")}
`;

fs.writeFileSync(path.join(process.cwd(), "docs/PERSONNALISATION_PAR_THEME.md"), doc);

console.log(`${compte.total} thèmes mesurés`);
console.log(`  complets (aucun bloc manquant, photos prises, pas de plantage) : ${compte.complets}`);
console.log(`  photos du client : ${compte.photos} + ${compte.photosNA} sans emplacement = ${compte.photos + compte.photosNA}`);
console.log(`  couleur peinte   : ${compte.couleur}`);
console.log(`  sans reste de démonstration : ${compte.sansRestes}`);
console.log(`  pages plantées   : ${compte.plantees}`);
console.log(`  retouches offertes : ${fiches.reduce((n, f) => n + f.retouches, 0)}`);
if (Object.keys(manques).length) {
  console.log("  manques :", Object.entries(manques).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", "));
}
console.log("\ndétail → docs/PERSONNALISATION_PAR_THEME.md");
