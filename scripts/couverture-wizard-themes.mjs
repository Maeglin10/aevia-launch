// Le wizard demande-t-il ce que les thèmes du métier vont afficher ?
//
//   node scripts/couverture-wizard-themes.mjs
//
// C'est le lien qui porte tout le chantier : un thème n'est personnalisable que
// si le wizard, pour la niche du client, lui a posé la question. Un thème de
// dentiste qui montre une grille de tarifs alors que l'archétype « service et
// rendez-vous » ne demande pas de prix laisse une section muette — et le client
// ne saura jamais qu'il aurait pu la remplir.
//
// On croise donc, pour chacun des soixante-huit métiers : les blocs déclarés par
// les modèles qu'on lui propose, et les champs que son archétype lui demande.

import fs from "node:fs";
import path from "node:path";

const RACINE = process.cwd();

// Ce que chaque modèle déclare afficher.
const capacites = fs.readFileSync(path.join(RACINE, "lib/templates/capabilities.ts"), "utf8");
const BLOCS = {};
for (const m of capacites.matchAll(/"(impact-[\w-]+)":\s*\[([^\]]*)\]/g)) {
  BLOCS[m[1]] = [...m[2].matchAll(/"([a-z0-9_]+)"/g)].map((x) => x[1]);
}

// Les modèles proposés à chaque métier.
const sectors = fs.readFileSync(path.join(RACINE, "lib/templates/sectors.ts"), "utf8");
const debut = sectors.indexOf("export const SECTOR_TEMPLATES");
const blocSect = sectors.slice(debut, sectors.indexOf("\n};", debut));
const MODELES = {};
for (const m of blocSect.matchAll(/^\s{2}([a-z0-9_]+):\s*\[([^\]]*)\]/gm)) {
  MODELES[m[1]] = [...m[2].matchAll(/impact-[\w-]+/g)].map((x) => x[0]);
}

// L'archétype de chaque niche, et ce qu'il demande.
const arch = fs.readFileSync(path.join(RACINE, "lib/wizard/archetypes.ts"), "utf8");
const ARCHETYPE_DE = {};
const nBloc = arch.slice(arch.indexOf("NICHE_ARCHETYPE"));
for (const m of nBloc.matchAll(/(\w+):\s*"(\w+)"/g)) ARCHETYPE_DE[m[1]] = m[2];

const CHAMPS = {};
const aBloc = arch.slice(arch.indexOf("export const ARCHETYPES"), arch.indexOf("export const NICHE_ARCHETYPE"));
for (const m of aBloc.matchAll(/^\s{2}(\w+):\s*\{([\s\S]*?)\n\s{2}\},/gm)) {
  const champs = [...m[2].matchAll(/"(\w+)"/g)].map((x) => x[1]);
  CHAMPS[m[1]] = champs;
}

/*
  Ce qui alimente quoi. Le nom, la ville, l'accroche et les photos sont demandés
  à tout le monde : ils ne dépendent pas de l'archétype.
*/
const TOUJOURS_DEMANDE = new Set(["prestations", "photos", "methode"]);
const ALIMENTE = {
  prestations: ["services", "menu", "products", "listings", "projets", "prestations"],
  tarifs: ["services", "menu", "products", "honoraires", "grilleTarifs"],
  avis: ["reputation"],
  chiffres: ["keyStats"],
  equipe: ["team"],
  engagements: ["certifications"],
  faq: ["faq"],
  horaires: ["openingHours"],
  zones: ["geo", "zonesIntervention"],
  realisations: ["beforeAfter", "projets", "listings", "products"],
  menu: ["menu", "products", "services"],
  produits: ["products", "menu", "commerce"],
  /*
    « Notre méthode » est de la prose, pas une donnée : le client la réécrit
    depuis l'aperçu, par les retouches de section. Aucun champ du wizard ne la
    porte, et c'est très bien ainsi.
  */
  methode: ["__retouche__"],
};

const manques = {};
const parMetier = [];

for (const [metier, modeles] of Object.entries(MODELES)) {
  const archetype = ARCHETYPE_DE[metier];
  if (!archetype) { parMetier.push({ metier, souci: "aucun archétype" }); continue; }
  const champs = new Set(CHAMPS[archetype] ?? []);

  const blocsMontres = new Set();
  for (const id of modeles) for (const b of BLOCS[id] ?? []) blocsMontres.add(b);

  const nonAlimentes = [];
  for (const bloc of blocsMontres) {
    if (TOUJOURS_DEMANDE.has(bloc)) continue;
    const sources = ALIMENTE[bloc];
    if (!sources) { nonAlimentes.push(`${bloc} (inconnu du contrat)`); continue; }
    if (!sources.some((s) => champs.has(s))) nonAlimentes.push(bloc);
  }

  parMetier.push({ metier, archetype, modeles: modeles.length, blocs: [...blocsMontres], nonAlimentes });
  for (const b of nonAlimentes) (manques[b] ??= []).push(metier);
}

const enDefaut = parMetier.filter((x) => x.nonAlimentes?.length);
console.log(`${parMetier.length} métiers · ${enDefaut.length} dont un bloc affiché n'est pas demandé au wizard\n`);

console.log("les blocs qui manquent, et à qui :");
for (const [bloc, metiers] of Object.entries(manques).sort((a, b) => b[1].length - a[1].length)) {
  console.log(`  ${bloc.padEnd(14)} ${String(metiers.length).padStart(3)} métiers — ${metiers.slice(0, 8).join(", ")}`);
}

console.log("\nles métiers les plus démunis :");
for (const x of enDefaut.sort((a, b) => b.nonAlimentes.length - a.nonAlimentes.length).slice(0, 12)) {
  console.log(`  ${x.metier.padEnd(18)} (${x.archetype}) — ${x.nonAlimentes.join(", ")}`);
}
