/*
  Aligner ce que le wizard demande sur ce que les thèmes affichent vraiment.

    node scripts/aligner-capabilites.mjs               # rapport seul
    node scripts/aligner-capabilites.mjs --ecrire      # met à jour capabilities.ts

  On ne lit pas le registre, on lit le thème : un bloc n'est déclaré que si la
  page appelle le helper qui le remplit. C'est la règle du dépôt, apprise en la
  violant — `capabilities.ts` a été resserré cinq fois pour sur-déclaration, et
  un bloc déclaré sans être affiché fait poser au client une question dont la
  réponse n'ira nulle part.

  L'inverse coûte plus cher encore : un bloc affiché mais non déclaré n'est
  jamais demandé, et la section reste en démonstration sur le site livré.
*/
import fs from "node:fs";
import path from "node:path";

const RACINE = process.cwd();
const DOSSIER = path.join(RACINE, "app/templates");
const FICHIER = path.join(RACINE, "lib/templates/capabilities.ts");
const ecrire = process.argv.includes("--ecrire");
const cibles = process.argv.filter((a) => a.startsWith("impact-"));

/*
  Le helper qui prouve le bloc. « methode » n'en a pas : ces étapes
  appartiennent au thème, aucun champ du wizard ne les alimente — on la
  conserve telle qu'elle est déjà déclarée plutôt que de la retirer.
*/
const PREUVE = {
  prestations: /clientServices\s*\(/,
  avis: /clientReviews\s*\(/,
  chiffres: /clientStats\s*\(/,
  engagements: /clientCertifications\s*\(/,
  faq: /clientFaq\s*\(/,
  equipe: /clientTeam\s*\(/,
  horaires: /clientHours\s*\(/,
  realisations: /clientWorks\s*\(/,
  zones: /clientAreas\s*\(/,
  menu: /clientMenu\s*\(/,
  produits: /clientProducts\s*\(/,
};

// Un thème ne mérite « tarifs » que s'il peint un prix venu du client.
const PREUVE_TARIFS = /\.price\b/;

function sourceDuTheme(id) {
  const morceaux = [];
  const base = path.join(DOSSIER, id);
  const empiler = (dir) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) empiler(p);
      else if (/\.tsx?$/.test(e.name)) morceaux.push(fs.readFileSync(p, "utf8"));
    }
  };
  empiler(base);
  return morceaux.join("\n");
}

const src = fs.readFileSync(FICHIER, "utf8");
const declares = {};
for (const m of src.matchAll(/"(impact-[\w-]+)":\s*\[([^\]]*)\]/g)) {
  declares[m[1]] = m[2].split(",").map((s) => s.trim().replace(/"/g, "")).filter(Boolean);
}

const ids = (cibles.length ? cibles : fs.readdirSync(DOSSIER).filter((d) => d.startsWith("impact-"))).sort();
const corrections = {};
let nbAjouts = 0;


for (const id of ids) {
  let code;
  try {
    code = sourceDuTheme(id);
  } catch {
    continue;
  }
  const mesures = new Set();
  for (const [bloc, re] of Object.entries(PREUVE)) if (re.test(code)) mesures.add(bloc);
  if (mesures.has("prestations") && PREUVE_TARIFS.test(code)) mesures.add("tarifs");

  const avant = declares[id] ?? [];
  /*
    On n'enlève rien. Un bloc peut être rendu sans qu'aucun helper n'y
    paraisse : « horaires » est réécrit après coup par BrandColorVar, à partir
    de `bp.openingHours`, sur la grille que le thème a dessinée lui-même. Le
    retirer d'ici ferait cesser la question du wizard, et la passe globale
    n'aurait plus rien à poser. Idem pour « methode », qui appartient au thème.
    Retirer un bloc demande donc une preuve à l'écran, pas une absence de grep.
  */
  for (const b of avant) mesures.add(b);

  const ajouts = [...mesures].filter((b) => !avant.includes(b)).sort();
  if (!ajouts.length) continue;

  corrections[id] = [...mesures].sort();
  nbAjouts += ajouts.length;
  console.log(`${id} | +${ajouts.join(",")}`);
}

console.log(`\n${Object.keys(corrections).length} thème(s) à corriger · ${nbAjouts} bloc(s) à ajouter`);

if (ecrire && Object.keys(corrections).length) {
  let out = src;
  for (const [id, blocs] of Object.entries(corrections)) {
    const ligne = `  "${id}": [${blocs.map((b) => `"${b}"`).join(", ")}],`;
    const re = new RegExp(`  "${id}":\\s*\\[[^\\]]*\\],`);
    out = re.test(out) ? out.replace(re, ligne) : out.replace(/^};$/m, `${ligne}\n};`);
  }
  fs.writeFileSync(FICHIER, out);
  console.log(`\ncapabilities.ts mis à jour`);
}
