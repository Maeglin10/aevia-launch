// Ce que voit vraiment le client : sa liste, pas la galerie.
//
//   node scripts/equilibrer-catalogue-metiers.mjs [--dry]
//
// Dix métiers sur quarante-neuf proposent une liste dont la majorité se
// ressemble : un dentiste voit cinq propositions quasi identiques sur six —
// même surtitre à filet, même titre serif dont la seconde ligne est en
// italique, même photo assombrie, même « DÉCOUVRIR » en bas. Seules la couleur
// et la photo changent. Choisir devient impossible, et le catalogue paraît
// pauvre alors qu'il compte trois cent soixante-treize modèles.
//
// On ne touche pas au dessin de ces thèmes : ils sont bons, et pris un par un
// personne ne leur reproche rien. On rééquilibre la liste — on complète avec
// des modèles du groupe varié dont la catégorie et la description parlent du
// même métier, en gardant ceux qui se ressemblent, qui restent pertinents.

import fs from "node:fs";
import path from "node:path";

const RACINE = process.cwd();
const dry = process.argv.includes("--dry");

// Les deux groupes dont la composition est presque commune.
const seRessemble = (id) => {
  const n = Number(String(id).replace("impact-", ""));
  return n >= 237 && n <= 302;
};

const registry = fs.readFileSync(path.join(RACINE, "lib/templates/registry.ts"), "utf8");
const MODELES = [];
for (const m of registry.matchAll(/id:\s*"(impact-[\w-]+)",\s*\n\s*name:\s*"([^"]*)",\s*\n\s*description:\s*"([^"]*)",\s*\n\s*category:\s*"([^"]*)"/g)) {
  MODELES.push({ id: m[1], nom: m[2], description: m[3], categorie: m[4] });
}

/*
  Deux filtres, pas un. Le premier tour par mots-clés larges proposait une
  clinique vétérinaire à un dentiste et une fleuriste à un avocat : « care » et
  « conseil » se trouvent partout. On exige donc un mot qui nomme le métier, et
  une catégorie qui lui convient.
*/
const MOTS = {
  medecin: { forts: ["medical clinic", "doctor", "general practice", "health clinic", "médecin"], categories: ["Health"], exclus: ["veterinary", "pet ", "animal"] },
  dentiste: { forts: ["dental", "dentist", "orthodont", "smile studio"], categories: ["Health"], exclus: ["veterinary", "pet ", "animal"] },
  kine: { forts: ["physio", "physical therapy", "rehab", "kinesi"], categories: ["Health", "Fitness"] },
  osteo: { forts: ["osteo", "manual therapy", "massage", "chiroprac"], categories: ["Health", "Wellness", "Beauty"] },
  avocat: { forts: ["law firm", "litigation", "attorney", "legal"], categories: ["Corporate", "Professional"] },
  comptable: { forts: ["accounting", "accountant", "audit", "bookkeep", "fiscal"], categories: ["Corporate", "Professional", "Finance"] },
  coach: { forts: ["coaching", "personal training", "fitness studio", "gym"], categories: ["Fitness", "Wellness", "Health"] },
  boulangerie: { forts: ["bakery", "boulangerie", "pastry", "patisserie", "bread"], categories: ["Food & Drink"] },
  tatoueur: { forts: ["tattoo"], categories: ["Beauty", "Art", "Creative"], exclus: ["nail", "hair salon", "barber"] },
  paysagiste: { forts: ["landscape", "garden design", "jardin", "gardening"], categories: ["Home", "Services", "Nature"] },
};

const chemin = path.join(RACINE, "lib/templates/sectors.ts");
let sectors = fs.readFileSync(chemin, "utf8");
const debut = sectors.indexOf("export const SECTOR_TEMPLATES");
const finBloc = sectors.indexOf("\n};", debut);
const bloc = sectors.slice(debut, finBloc);

let faits = 0;
const rapport = [];

for (const [metier, regle] of Object.entries(MOTS)) {
  const ligne = new RegExp(`^(\\s{2}${metier}:\\s*\\[)([^\\]]*)(\\])`, "m").exec(bloc);
  if (!ligne) continue;
  const actuels = [...ligne[2].matchAll(/impact-[\w-]+/g)].map((x) => x[0]);
  const semblables = actuels.filter(seRessemble).length;
  if (semblables / actuels.length < 0.5) continue;

  /*
    Combien ajouter : de quoi ramener les jumeaux sous la moitié de la liste.
    On n'en retire aucun — ils conviennent au métier, ils sont simplement trop
    nombreux à se ressembler.
  */
  const aAjouter = Math.max(0, semblables * 2 + 1 - actuels.length);
  if (aAjouter === 0) continue;

  const recevable = (m) => {
    if (seRessemble(m.id) || actuels.includes(m.id)) return false;
    if (!regle.categories.includes(m.categorie)) return false;
    const texte = `${m.nom} ${m.description}`.toLowerCase();
    return !(regle.exclus ?? []).some((mot) => texte.includes(mot));
  };
  /*
    D'abord ceux qui nomment le métier, ensuite ceux de la même catégorie. Un
    thème de santé convient à un dentiste même s'il parle d'autre chose : le
    client remplace tout le contenu. Un thème vétérinaire, non — la photo de
    chien reste dans la démonstration qu'il regarde pour choisir.
  */
  const nomment = MODELES.filter((m) => recevable(m) && regle.forts.some((mot) => `${m.nom} ${m.description}`.toLowerCase().includes(mot)));
  const memeCategorie = MODELES.filter((m) => recevable(m) && !nomment.includes(m));
  const candidats = [...nomment, ...memeCategorie];

  const choisis = candidats.slice(0, aAjouter).map((m) => m.id);
  if (choisis.length === 0) { rapport.push(`${metier} : aucun modèle varié ne parle de ce métier`); continue; }

  const neuf = `${ligne[1]}${ligne[2].trimEnd().replace(/,$/, "")}, ${choisis.map((x) => `"${x}"`).join(", ")}${ligne[3]}`;
  sectors = sectors.replace(ligne[0], neuf);
  faits++;
  const part = Math.round((100 * semblables) / (actuels.length + choisis.length));
  rapport.push(`${metier.padEnd(14)} ${actuels.length} → ${actuels.length + choisis.length} modèles · jumeaux ${Math.round((100 * semblables) / actuels.length)}% → ${part}%`);
}

if (!dry) fs.writeFileSync(chemin, sectors);
console.log(`${dry ? "[à blanc] " : ""}${faits} métier(s) rééquilibrés\n`);
console.log(rapport.join("\n"));
