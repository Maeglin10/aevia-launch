// Le meilleur du catalogue, proposé aux métiers qui lui correspondent.
//
//   node scripts/enrichir-catalogue-metiers.mjs [--dry]
//
// Cent huit modèles du premier lot — les plus variés, ceux qui font la barre de
// qualité — ne sont proposés à aucun métier : ils n'apparaissent nulle part dans
// le wizard. Pendant ce temps, huit métiers ne voient que des modèles des deux
// familles qui se ressemblent, et le kinésithérapeute n'a que celles-là.
//
// On rapproche donc chaque modèle libre du métier auquel sa catégorie et sa
// description le destinent, et l'on complète les métiers les plus démunis. Rien
// n'est caché, aucun dessin ne change : c'est le choix offert au client qui
// s'élargit.

import fs from "node:fs";
import path from "node:path";

const dry = process.argv.includes("--dry");
const RACINE = process.cwd();

const registre = fs.readFileSync(path.join(RACINE, "lib/templates/registry.ts"), "utf8");
const META = {};
for (const m of registre.matchAll(/id:\s*"(impact-[\w-]+)",\s*\n\s*name:\s*"([^"]*)",\s*\n\s*description:\s*"([^"]*)",\s*\n\s*category:\s*"([^"]*)"/g)) {
  META[m[1]] = { nom: m[2], description: m[3], categorie: m[4] };
}

const sectors = fs.readFileSync(path.join(RACINE, "lib/templates/sectors.ts"), "utf8");
const debut = sectors.indexOf("export const SECTOR_TEMPLATES");
const finBloc = sectors.indexOf("\n};", debut);
const bloc = sectors.slice(debut, finBloc);

const parMetier = {};
for (const m of bloc.matchAll(/^\s{2}([a-z]+):\s*\[([^\]]*)\]/gm)) {
  parMetier[m[1]] = [...m[2].matchAll(/impact-[\w-]+/g)].map((x) => x[0]);
}
const attribues = new Set(Object.values(parMetier).flat());

/*
  Ce qui rattache un modèle à un métier : la catégorie du registre d'abord, les
  mots de sa description ensuite. On reste prudent — un modèle mal placé, un
  restaurant proposé à un dentiste, coûte plus cher qu'un modèle absent.
*/
const AFFINITES = {
  medecin: { categories: ["Health"], mots: /doctor|medical|clinic|practitioner|cabinet médical|santé/i },
  dentiste: { categories: ["Health"], mots: /dental|dentist|smile|orthodont/i },
  kine: { categories: ["Health", "Sports"], mots: /physio|kiné|rehab|mouvement|posture|sport/i },
  osteo: { categories: ["Health"], mots: /osteo|ostéo|manual therapy|posture/i },
  veterinaire: { categories: ["Health"], mots: /vet|animal|pet/i },
  pharmacie: { categories: ["Health"], mots: /pharmac|officine/i },
  opticien: { categories: ["Health", "E-Commerce"], mots: /optic|eyewear|lunette/i },
  avocat: { categories: ["Finance", "Corporate"], mots: /law|legal|avocat|juridique|counsel/i },
  notaire: { categories: ["Finance", "Corporate"], mots: /notar|patrimoine|succession/i },
  comptable: { categories: ["Finance", "Corporate"], mots: /account|comptab|fiscal|expertise/i },
  assurance: { categories: ["Finance", "Corporate"], mots: /insur|assur|courtage/i },
  recrutement: { categories: ["Corporate", "Tech"], mots: /recruit|talent|hiring|rh\b/i },
  architecte: { categories: ["Real Estate", "Luxury", "Minimal"], mots: /architect|studio d'architecture|urbanis/i },
  photographe: { categories: ["Creative", "Editorial"], mots: /photograph|studio photo|image/i },
  coiffeur: { categories: ["Beauty"], mots: /hair|coiffure|salon|barbier|barber/i },
  esthetique: { categories: ["Beauty", "Luxury"], mots: /beauty|esthé|spa|soin/i },
  tatoueur: { categories: ["Creative", "Beauty"], mots: /tattoo|tatou|ink/i },
  fleuriste: { categories: ["Creative", "E-Commerce"], mots: /flower|fleur|botan|floral/i },
  bijouterie: { categories: ["Luxury", "E-Commerce"], mots: /jewel|bijou|joaill/i },
  couture: { categories: ["Luxury", "Creative"], mots: /couture|tailor|atelier de couture|mode|textile/i },
  restaurant: { categories: ["Food & Drink", "Hospitality"], mots: /restaurant|bistro|table|chef|cuisine/i },
  boulangerie: { categories: ["Food & Drink"], mots: /baker|boulang|pain|pâtiss|pastry/i },
  brasserie: { categories: ["Food & Drink"], mots: /brasserie|bar|brew|bière/i },
  caviste: { categories: ["Food & Drink", "Luxury"], mots: /wine|vin|cave|cellar/i },
  producteur: { categories: ["Food & Drink"], mots: /farm|ferme|produce|local|maraîch/i },
  hotel: { categories: ["Hospitality", "Luxury"], mots: /hotel|hôtel|suite|palace|chambre/i },
  mariage: { categories: ["Events", "Luxury"], mots: /wedding|mariage|noces|réception/i },
  coach: { categories: ["Sports"], mots: /coach|fitness|training|gym|performance/i },
  plombier: { categories: ["Services"], mots: /plumb|plomb|chauffage|sanitaire/i },
  electricien: { categories: ["Services"], mots: /electric|électric|domotique/i },
  menuisier: { categories: ["Services", "Luxury"], mots: /wood|menuis|ébénis|charpent/i },
  paysagiste: { categories: ["Services"], mots: /landscap|paysag|jardin|garden/i },
  peintre: { categories: ["Services"], mots: /paint|peintre|décoration/i },
  couvreur: { categories: ["Services"], mots: /roof|couvreur|toiture|zinguerie/i },
  serrurier: { categories: ["Services"], mots: /lock|serrur|sécurité/i },
  demenageur: { categories: ["Services"], mots: /moving|déménag|transport/i },
  menage: { categories: ["Services"], mots: /clean|ménage|nettoyage|propreté/i },
  securite: { categories: ["Services", "Corporate"], mots: /security|sécurité|surveillance/i },
  formation: { categories: ["Education"], mots: /learn|formation|cours|école|academy/i },
  creche: { categories: ["Education"], mots: /child|enfant|crèche|nursery/i },
  vtc: { categories: ["Automotive", "Services"], mots: /driver|chauffeur|vtc|transport/i },
  pisciniste: { categories: ["Services", "Luxury"], mots: /pool|piscine|spa/i },
  cuisiniste: { categories: ["Services", "Luxury"], mots: /kitchen|cuisine sur mesure|agencement/i },
  toiletteur: { categories: ["Services", "Beauty"], mots: /groom|toilettage|animal/i },
};

// Combien de modèles un métier doit-il proposer au minimum, et combien issus du
// premier lot — celui qui porte la variété.
const MINIMUM_VARIES = 3;

const libres = fs.readdirSync(path.join(RACINE, "app/templates"))
  .filter((d) => d.startsWith("impact-"))
  .filter((d) => Number(d.replace("impact-", "")) <= 236)
  .filter((d) => !attribues.has(d));

const ajouts = {};
for (const [metier, ids] of Object.entries(parMetier)) {
  const affinite = AFFINITES[metier];
  if (!affinite) continue;
  const varies = ids.filter((x) => Number(x.replace("impact-", "")) <= 236).length;
  if (varies >= MINIMUM_VARIES) continue;

  const candidats = libres
    .filter((id) => !Object.values(ajouts).flat().includes(id))
    .map((id) => {
      const meta = META[id];
      if (!meta) return null;
      /*
        La catégorie est éliminatoire, les mots ne font que classer. Les accepter
        seuls proposait un modèle « Beauty » à un comptable, parce que sa
        description contenait « expertise ».
      */
      if (!affinite.categories.includes(meta.categorie)) return null;
      /*
        Les mots aussi sont éliminatoires. La seule catégorie « Creative »
        proposait « NOVA Agency — We build the internet's best » à un fleuriste :
        une agence sombre pour une boutique de fleurs. Mieux vaut un métier avec
        peu de modèles qu'un métier avec des modèles qui ne lui vont pas.
      */
      const parLesMots = affinite.mots.test(`${meta.nom} ${meta.description}`);
      /*
        Les mots sont éliminatoires — sauf pour un métier qui n'a aucun modèle
        varié : aucune description ne dit « couvreur » ni « serrurier », et il
        vaut mieux un thème de sa catégorie principale que rien du tout. On
        n'accepte alors que la catégorie de tête, la plus proche du métier.
      */
      if (!parLesMots) {
        if (varies > 0) return null;
        if (meta.categorie !== affinite.categories[0]) return null;
        /*
          « Services » est un fourre-tout : sur cette seule foi, une école de
          voile se retrouvait proposée à un couvreur. Le repli sans mots ne vaut
          que pour les catégories qui désignent vraiment un métier.
        */
        if (meta.categorie === "Services") return null;
        return { id, note: 3, meta };
      }
      return { id, note: 5, meta };
    })
    .filter(Boolean)
    .sort((a, b) => b.note - a.note);

  const aPrendre = candidats.slice(0, MINIMUM_VARIES - varies);
  if (aPrendre.length) ajouts[metier] = aPrendre.map((x) => x.id);
}

console.log(`${libres.length} modèles variés sans métier · ${Object.keys(ajouts).length} métiers complétés`);
for (const [metier, ids] of Object.entries(ajouts)) {
  console.log(`  ${metier.padEnd(16)} + ${ids.map((i) => `${i} (${META[i]?.categorie})`).join(", ")}`);
}

if (!dry && Object.keys(ajouts).length) {
  let neuf = sectors;
  for (const [metier, ids] of Object.entries(ajouts)) {
    const motif = new RegExp(`(^\\s{2}${metier}:\\s*\\[)([^\\]]*)(\\])`, "m");
    neuf = neuf.replace(motif, (m0, tete, dedans, queue) =>
      `${tete}${dedans.trimEnd().replace(/,$/, "")}, ${ids.map((i) => `'${i}'`).join(", ")}${queue}`);
  }
  fs.writeFileSync(path.join(RACINE, "lib/templates/sectors.ts"), neuf);
  console.log("\nlib/templates/sectors.ts mis à jour");
}
