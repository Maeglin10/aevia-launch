// Les métiers pauvres empruntent aux métiers voisins.
//
//   node scripts/completer-metiers-voisins.mjs [--dry]
//
// Treize métiers n'offrent que deux modèles : un audioprothésiste, un couvreur,
// une crèche voient deux propositions et rien d'autre. C'est plus grave que la
// ressemblance — devant deux choix, on doute d'un catalogue.
//
// Aucune description du premier lot ne dit « couvreur » ni « podologue » : on ne
// peut donc pas les rapprocher par les mots. Mais un couvreur travaille comme un
// plombier, un notaire comme un avocat, un podologue comme un kinésithérapeute.
// On emprunte donc aux voisins les modèles variés qu'ils ont déjà éprouvés.

import fs from "node:fs";
import path from "node:path";

const dry = process.argv.includes("--dry");
const chemin = path.join(process.cwd(), "lib/templates/sectors.ts");
const sectors = fs.readFileSync(chemin, "utf8");
const debut = sectors.indexOf("export const SECTOR_TEMPLATES");
const bloc = sectors.slice(debut, sectors.indexOf("\n};", debut));

const parMetier = {};
for (const m of bloc.matchAll(/^\s{2}([a-z]+):\s*\[([^\]]*)\]/gm)) {
  parMetier[m[1]] = [...m[2].matchAll(/impact-[\w-]+/g)].map((x) => x[0]);
}

// Qui ressemble à qui, du point de vue du client et de son site.
const VOISINS = {
  audioprothesiste: ["opticien", "medecin"],
  couvreur: ["plombier", "electricien"],
  creche: ["formation"],
  cuisiniste: ["menuisier", "architecte"],
  infirmier: ["medecin", "kine"],
  laboratoire: ["medecin"],
  notaire: ["avocat", "comptable"],
  peintre: ["plombier", "electricien"],
  pharmacie: ["medecin", "opticien"],
  podologue: ["kine", "osteo"],
  pressing: ["menage"],
  securite: ["serrurier", "demenageur"],
  vitrier: ["plombier", "menuisier"],
  toiletteur: ["veterinaire", "coiffeur"],
  esthetique: ["coiffeur"],
  bijouterie: ["couture"],
  hotel: ["restaurant"],
  // Les derniers démunis : un vétérinaire n'avait qu'un seul modèle.
  veterinaire: ["medecin"],
  fleuriste: ["mariage", "couture"],
  brasserie: ["restaurant"],
  demenageur: ["menage", "securite"],
  menuisier: ["cuisiniste", "couvreur"],
  opticien: ["medecin", "bijouterie"],
  recrutement: ["comptable", "avocat"],
  serrurier: ["plombier"],
  assurance: ["comptable", "avocat"],
  caviste: ["restaurant"],
  producteur: ["boulangerie", "restaurant"],
};

const CIBLE = 5;   // ce qu'un client doit voir au minimum pour choisir
const varie = (id) => Number(id.replace("impact-", "")) <= 236;

const ajouts = {};
for (const [metier, voisins] of Object.entries(VOISINS)) {
  const siens = parMetier[metier];
  if (!siens) continue;
  const manque = CIBLE - siens.length;
  const sansVarie = !siens.some(varie);
  if (manque <= 0 && !sansVarie) continue;

  const candidats = [];
  for (const v of voisins) {
    for (const id of parMetier[v] ?? []) {
      if (siens.includes(id) || candidats.includes(id)) continue;
      // On emprunte d'abord ce qui apporte de la variété.
      candidats.push(id);
    }
  }
  candidats.sort((a, b) => Number(varie(b)) - Number(varie(a)));
  const aPrendre = candidats.filter(varie).slice(0, Math.max(manque, 2));
  if (aPrendre.length) ajouts[metier] = aPrendre;
}

console.log(`${Object.keys(ajouts).length} métiers complétés par leurs voisins`);
for (const [metier, ids] of Object.entries(ajouts)) {
  console.log(`  ${metier.padEnd(18)} ${parMetier[metier].length} → ${parMetier[metier].length + ids.length} · + ${ids.join(", ")}`);
}

if (!dry && Object.keys(ajouts).length) {
  let neuf = sectors;
  for (const [metier, ids] of Object.entries(ajouts)) {
    const motif = new RegExp(`(^\\s{2}${metier}:\\s*\\[)([^\\]]*)(\\])`, "m");
    neuf = neuf.replace(motif, (m0, tete, dedans, queue) =>
      `${tete}${dedans.trimEnd().replace(/,$/, "")}, ${ids.map((i) => `'${i}'`).join(", ")}${queue}`);
  }
  fs.writeFileSync(chemin, neuf);
  console.log("\nlib/templates/sectors.ts mis à jour");
}
