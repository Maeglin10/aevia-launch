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
  [/c\?\.testimonials/g, "clientReviews(session)", "clientReviews"],
  // blocs jamais lus par aucun thème avant aujourd'hui
  [/bp\?\.keyStats/g, "clientStats(session)", "clientStats"],
  [/bp\?\.certifications/g, "clientCertifications(session)", "clientCertifications"],
  [/bp\?\.faq/g, "clientFaq(session)", "clientFaq"],
  [/bp\?\.team/g, "clientTeam(session)", "clientTeam"],
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
  if (before.includes("@/lib/templates/clientContent")) {
    skipped++;
    continue;
  }
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
    summary.push(`${id}  aucune source connue`);
    continue;
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

  const imp = `import {\n${[...used]
    .sort()
    .map((h) => `  ${h},`)
    .join("\n")}\n} from "@/lib/templates/clientContent";\n`;

  // Après le DERNIER import du fichier, et après sa dernière ligne : un import
  // multiligne (`import {\n  A,\n} from "…"`) se referme plus bas que la ligne
  // qui commence par `import`, et y insérer coupe la déclaration en deux.
  const lines = after.split("\n");
  let last = -1;
  for (let i = 0; i < lines.length; i++) {
    if (!/^import[\s{]/.test(lines[i])) continue;
    let j = i;
    while (j < lines.length && !/from\s+["'][^"']+["'];?\s*$|^import\s+["'][^"']+["'];?\s*$/.test(lines[j])) j++;
    last = Math.min(j, lines.length - 1);
  }
  if (last === -1) {
    summary.push(`${id}  aucun import — ignoré`);
    continue;
  }
  lines.splice(last + 1, 0, imp.trimEnd());
  after = lines.join("\n");

  if (!dry) fs.writeFileSync(file, after);
  touched++;
  summary.push(`${id}  ${[...used].sort().join(" ")}`);
}

for (const line of summary) console.log(line);
console.log(
  `\n${dry ? "[à blanc] " : ""}${touched} thème(s) basculé(s), ${skipped} déjà sur le contrat, ${ids.length} examiné(s)`,
);
