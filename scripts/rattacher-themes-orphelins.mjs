// Les modèles qu'aucun métier ne propose.
//
//   node scripts/rattacher-themes-orphelins.mjs [--dry]
//
// Quatre-vingt-dix-sept modèles sur trois cent soixante-treize n'apparaissent
// dans la liste d'aucun métier : le client ne les voit qu'en quittant le
// formulaire pour la galerie, ce que presque personne ne fait. Un quart du
// catalogue est donc payé, entretenu et invisible.
//
// On rattache ceux dont le sujet correspond vraiment à un métier du catalogue —
// une agence immobilière de luxe à l'agent immobilier, un studio de tatouage au
// tatoueur, une billetterie d'événement à la salle de réception. Les autres
// restent en galerie : un tableau de bord SaaS ou un carnet de voyage ne
// correspond à aucun des soixante-huit métiers, et le proposer à un plombier
// ferait plus de mal que de bien.

import fs from "node:fs";
import path from "node:path";

const dry = process.argv.includes("--dry");
const chemin = path.join(process.cwd(), "lib/templates/sectors.ts");

/*
  Chaque modèle et le ou les métiers auxquels son sujet correspond. La liste
  vient de la description du registre, lue une par une — pas d'une règle sur la
  catégorie, qui range « Luxury » aussi bien un parfumeur qu'un constructeur
  automobile.
*/
const RATTACHEMENTS = {
  // Agences, studios, portfolios : le sujet est le travail créatif lui-même.
  "impact-01": ["studio_creatif"],
  "impact-121": ["studio_creatif", "photographe"],
  "impact-154": ["studio_creatif"],
  "impact-164": ["studio_creatif"],
  "impact-21": ["studio_creatif", "decorateur_interieur"],
  "impact-27": ["studio_creatif"],
  "impact-29": ["studio_creatif"],
  "impact-170": ["studio_creatif"],
  "impact-155": ["studio_creatif", "photographe"],
  "impact-80": ["architecte"],
  "impact-153": ["architecte", "btp_construction"],

  // Boutiques et maisons de produit.
  "impact-07": ["bijouterie"],
  "impact-08": ["garage_auto"],
  "impact-26": ["bijouterie", "institut_beaute"],
  "impact-120": ["bijouterie", "institut_beaute"],
  "impact-63": ["bijouterie"],
  "impact-75": ["bijouterie", "boutique_mode"],
  "impact-112": ["boutique_mode", "couture"],
  "impact-134": ["institut_beaute"],
  "impact-160": ["boutique_mode"],
  "impact-185": ["boutique_mode"],
  "impact-81": ["boutique_mode"],
  "impact-59": ["boutique_mode"],
  "impact-324": ["salle_reception"],
  "impact-325": ["salle_reception", "formation"],

  // Métiers de bouche et de table.
  "impact-146": ["restaurant"],
  "impact-66": ["restaurant", "producteur"],

  // Réception, événement.
  "impact-127": ["salle_reception", "mariage"],
  "impact-321": ["salle_reception", "formation"],

  // Transport et logistique.
  "impact-207": ["demenageur"],
  "impact-216": ["demenageur", "vtc"],

  // Nature, jardin, matière vivante.
  "impact-114": ["paysagiste"],
  "impact-115": ["paysagiste"],
  "impact-132": ["paysagiste", "architecte"],
  "impact-142": ["paysagiste"],

  // Le reste, un par un.
  "impact-145": ["agent_immobilier"],
  "impact-89": ["tatoueur"],
  "impact-141": ["ecole_musique"],
  "impact-133": ["btp_construction"],
  "impact-130": ["decorateur_interieur"],
  "impact-136": ["decorateur_interieur"],
  "impact-144": ["studio_creatif"],
  "impact-122": ["formation"],
  "impact-163": ["formation"],
  "impact-169": ["formation"],
};

let sectors = fs.readFileSync(chemin, "utf8");
const debut = sectors.indexOf("export const SECTOR_TEMPLATES");
const finBloc = sectors.indexOf("\n};", debut);
const bloc = sectors.slice(debut, finBloc);

const parMetier = {};
for (const m of bloc.matchAll(/^\s{2}([a-z0-9_]+):\s*\[([^\]]*)\]/gm)) {
  parMetier[m[1]] = [...m[2].matchAll(/impact-[\w-]+/g)].map((x) => x[0]);
}

const ajouts = {};
const inconnus = [];
for (const [theme, metiers] of Object.entries(RATTACHEMENTS)) {
  if (!fs.existsSync(path.join(process.cwd(), "app/templates", theme, "page.tsx"))) { inconnus.push(`${theme} (pas de page)`); continue; }
  for (const metier of metiers) {
    if (!parMetier[metier]) { inconnus.push(`${theme} → ${metier} (métier inconnu)`); continue; }
    if (parMetier[metier].includes(theme)) continue;
    (ajouts[metier] ??= []).push(theme);
  }
}

let neuf = sectors;
for (const [metier, themes] of Object.entries(ajouts)) {
  const re = new RegExp(`^(\\s{2}${metier}:\\s*\\[)([^\\]]*)(\\])`, "m");
  const avant = re.exec(neuf);
  if (!avant) { inconnus.push(`${metier} (ligne introuvable)`); continue; }
  const liste = avant[2].trimEnd().replace(/,\s*$/, "");
  neuf = neuf.replace(re, `$1${liste}, ${themes.map((t) => `"${t}"`).join(", ")}$3`);
}

if (!dry) fs.writeFileSync(chemin, neuf);

const total = Object.values(ajouts).reduce((n, v) => n + v.length, 0);
const modeles = new Set(Object.values(ajouts).flat()).size;
console.log(`${dry ? "[à blanc] " : ""}${modeles} modèle(s) rattachés, ${total} entrées ajoutées sur ${Object.keys(ajouts).length} métiers`);
for (const [m, t] of Object.entries(ajouts)) console.log(`   ${m.padEnd(20)} +${t.length} · ${t.join(", ")}`);
if (inconnus.length) console.log(`\nignorés (${inconnus.length}) :\n   ${inconnus.join("\n   ")}`);
