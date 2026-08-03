// Bascule les thèmes sur le contrat de lecture unique.
//
//   node scripts/wire-themes.mjs --dry            (rapport, aucune écriture)
//   node scripts/wire-themes.mjs --range 1 40     (écrit)
//   node scripts/wire-themes.mjs impact-352 …
//
// Le contrat publie les deux vocabulaires (`title`/`name`, `author`/`name`), donc
// il n'y a rien à réécrire dans les sections : seule l'expression source change.
// C'est ce qui rend l'opération sûre sur 373 fichiers — chaque substitution
// remplace une expression connue par un appel, sans toucher au rendu.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");

/** Expressions sources, de la plus spécifique à la plus générale. */
const RULES = [
  // services
  [/bp\?\.services\s*\?\?\s*c\?\.services/g, "clientServices(session)", "clientServices"],
  [/c\?\.services\s*\?\?\s*bp\?\.services/g, "clientServices(session)", "clientServices"],
  [/session\?\.businessProfile\?\.services/g, "clientServices(session)", "clientServices"],
  [/bp\?\.services/g, "clientServices(session)", "clientServices"],
  /*
    Quelques thèmes copient le profil dans une variable locale avant de le lire —
    bpLocal, businessProfile, cData. Les règles ne visaient que `bp?.` et `c?.`,
    et ces thèmes restaient donc sur leur démonstration : dix pour les
    prestations, neuf pour les avis.
  */
  [/bpLocal\?\.services/g, "clientServices(session)", "clientServices"],
  [/businessProfile\?\.services/g, "clientServices(session)", "clientServices"],
  [/cData\?\.services/g, "clientServices(session)", "clientServices"],
  [/c\?\.services/g, "clientServices(session)", "clientServices"],
  // avis
  [
    /bp\?\.reputation\?\.featuredReviews\s*\?\?\s*c\?\.testimonials/g,
    "clientReviews(session)",
    "clientReviews",
  ],
  [
    /c\?\.testimonials\s*\?\?\s*bp\?\.reputation\?\.featuredReviews/g,
    "clientReviews(session)",
    "clientReviews",
  ],
  [/session\?\.businessProfile\?\.reputation\?\.featuredReviews/g, "clientReviews(session)", "clientReviews"],
  [/bp\?\.reputation\?\.featuredReviews/g, "clientReviews(session)", "clientReviews"],
  [/bpLocal\?\.reputation\?\.featuredReviews/g, "clientReviews(session)", "clientReviews"],
  [/businessProfile\?\.reputation\?\.featuredReviews/g, "clientReviews(session)", "clientReviews"],
  [/c\?\.testimonials/g, "clientReviews(session)", "clientReviews"],
  // blocs jamais lus par aucun thème avant aujourd'hui
  [/bp\?\.keyStats/g, "clientStats(session)", "clientStats"],
  [/bpLocal\?\.keyStats/g, "clientStats(session)", "clientStats"],
  [/bp\?\.certifications/g, "clientCertifications(session)", "clientCertifications"],
  [/bp\?\.faq/g, "clientFaq(session)", "clientFaq"],
  [/bpLocal\?\.faq/g, "clientFaq(session)", "clientFaq"],
  [/bp\?\.team/g, "clientTeam(session)", "clientTeam"],
  [/bpLocal\?\.team/g, "clientTeam(session)", "clientTeam"],
  [/bp\?\.geo\?\.serviceAreas/g, "clientAreas(session)", "clientAreas"],
];

const args = process.argv.slice(2);
const dry = args.includes("--dry");
let ids;
const ri = args.indexOf("--range");
if (ri !== -1) {
  ids = [];
  for (let n = Number(args[ri + 1]); n <= Number(args[ri + 2]); n++)
    ids.push(`impact-${String(n).padStart(2, "0")}`);
} else {
  const named = args.filter((a) => a.startsWith("impact-"));
  ids = named.length
    ? named
    : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));
}

let touched = 0;
let skipped = 0;
const summary = [];

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, "utf8");
  // Un thème déjà basculé peut encore lire une variable locale non couverte.
  const dejaSurContrat = before.includes("@/lib/templates/clientContent");
  // Le contrat a besoin de la session : un thème qui ne la lit pas doit être
  // traité à la main, son composant n'a pas d'état de session du tout.
  if (!/const \[session, setSession\]/.test(before)) {
    summary.push(`${id}  SANS SESSION — à traiter à la main`);
    continue;
  }

  /*
    Les thèmes déclarent `let fd/c/bp` au niveau du module et les assignent dans
    le corps du composant, pour que les sous-composants (page Boutique, sections
    extraites) y accèdent sans passer de props. Le contrat doit suivre la même
    règle : passer la `session` locale marcherait dans le composant principal et
    lèverait un ReferenceError dans les sous-composants — 179 endroits mesurés.
    On déclare donc un `sessionData` de module, assigné là où `bp` l'est.
  */
  const moduleScoped = /\n\s*bp = session\?\.businessProfile;/.test(before);
  const arg = moduleScoped ? "sessionData" : "session";

  let after = before;
  const used = new Set();
  for (const [re, repl, helper] of RULES) {
    if (re.test(after)) {
      after = after.replace(re, repl.replace("(session)", `(${arg})`));
      used.add(helper);
    }
  }
  if (used.size === 0) {
    if (dejaSurContrat) skipped++;
    else summary.push(`${id}  aucune source connue`);
    continue;
  }

  if (dejaSurContrat) {
    // L'import existe déjà : on ne le repose pas.
  }
  if (moduleScoped && !/let sessionData/.test(after)) {
    after = after.replace(
      /(\n)(let bp: any = null;)/,
      "$1$2\n// La session complète, pour lib/templates/clientContent : même portée\n// que fd/c/bp, pour les sous-composants qui n'ont pas de props.\nlet sessionData: any = null;",
    );
    after = after.replace(
      /(\n\s*)(bp = session\?\.businessProfile;)/,
      "$1$2$1sessionData = session;",
    );
    if (!/let sessionData/.test(after) || !/sessionData = session;/.test(after)) {
      summary.push(`${id}  motif de module non reconnu — à traiter à la main`);
      continue;
    }
  }

  /*
    Fusionner plutôt que poser un second import : ces thèmes sont déjà sur le
    contrat et n'y lisaient qu'une variable locale non couverte. Deux
    déclarations depuis le même module ne compilent pas.
  */
  const bloc = /import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/;
  if (bloc.test(after)) {
    after = after.replace(bloc, (m, corps) => {
      const ont = new Set(
        corps.split("\n").map((l) => l.trim().replace(/,$/, "")).filter(Boolean),
      );
      used.forEach((h) => ont.add(h));
      return `import {\n${[...ont].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
    });
  } else {
    const imp = `import {\n${[...used].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
    const lignes = after.split("\n");
    let fin = -1;
    for (let i = 0; i < lignes.length; i++) {
      if (!/^import[\s{]/.test(lignes[i])) continue;
      let j = i;
      while (j < lignes.length && !/from\s+["'][^"']+["'];?\s*$|^import\s+["'][^"']+["'];?\s*$/.test(lignes[j])) j++;
      fin = Math.min(j, lignes.length - 1);
    }
    if (fin === -1) {
      summary.push(`${id}  aucun import — ignoré`);
      continue;
    }
    lignes.splice(fin + 1, 0, imp);
    after = lignes.join("\n");
  }

  if (!dry) fs.writeFileSync(file, after);
  touched++;
  summary.push(`${id}  ${[...used].sort().join(" ")}`);
}

for (const line of summary) console.log(line);
console.log(
  `\n${dry ? "[à blanc] " : ""}${touched} thème(s) basculé(s), ${skipped} déjà sur le contrat, ${ids.length} examiné(s)`,
);
