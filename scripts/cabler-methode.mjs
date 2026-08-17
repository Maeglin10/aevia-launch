/*
  Brancher la méthode du client sur la section « comment ça se passe ».

    node scripts/cabler-methode.mjs [--ecrire]

  Cent quarante-neuf thèmes affichent des étapes — « Discover, Design, Build,
  Launch » — et aucun ne les lisait du client : le formulaire ne les demandait
  pas, et le contrat n'avait pas de lecteur. Un couvreur d'Annecy recevait donc
  la méthode d'une agence web.

  Le champ et le lecteur existent désormais. Reste à recalculer la constante du
  thème après l'arrivée de la session, comme on le fait pour les prestations et
  les avis.
*/
import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");
const cap = fs.readFileSync("lib/templates/capabilities.ts", "utf8");
const DECLARENT = new Set(
  [...cap.matchAll(/"(impact-\d+)":\s*\[([^\]]*)\]/g)].filter((m) => m[2].includes('"methode"')).map((m) => m[1]),
);

const NOMS = ["METHODE", "PROCESS_STEPS", "STEPS", "ETAPES"];
const rapport = [];

for (const theme of [...DECLARENT].sort((a, b) => Number(a.slice(7)) - Number(b.slice(7)))) {
  const f = path.join("app/templates", theme, "page.tsx");
  if (!fs.existsSync(f)) continue;
  let src = fs.readFileSync(f, "utf8");
  if (/clientMethode\(/.test(src)) continue;

  /* La variable de session du fichier. */
  const v = ["sessionData", "__session", "session"].find((x) => new RegExp(`\\b${x}\\b`).test(src));
  if (!v) continue;

  /* Une constante recalculée après la session : c'est là qu'on greffe. */
  /*
     La constante peut être déclarée `let` ou `const`, seule ou doublée d'une
     source. Exiger un recalcul `_LIVE()` ne trouvait que quatorze thèmes sur
     cent quarante-neuf.
  */
  const nom = NOMS.find((n) => new RegExp(`^(?:let|const) ${n}\\b`, "m").test(src));
  if (!nom) continue;
  /* Une constante réaffectée doit être `let`. */
  src = src.replace(new RegExp(`^const (${nom})\\b`, "m"), "let $1");

  const source = new RegExp(`\\b${nom}_SOURCE\\b`).test(src) ? `${nom}_SOURCE`
    : new RegExp(`\\b${nom}_DEMO\\b`).test(src) ? `${nom}_DEMO` : nom;

  /* On greffe juste après le recalcul, ou après l'affectation de la session. */
  const ancre = new RegExp(`^(\\s+)${nom}\\s*=\\s*${nom}_LIVE\\(\\);`, "m");
  const greffe = (marge) =>
    `\n${marge}/* La méthode du client remplace les étapes de la démonstration. */\n` +
    `${marge}${nom} = resolveList(\n` +
    `${marge}  clientMethode(${v})?.map((e: any, i: number) => ({ ...${source}[i % ${source}.length], ...e })),\n` +
    `${marge}  ${source},\n` +
    `${marge});`;

  let sortie;
  const m = ancre.exec(src);
  if (m) {
    sortie = src.slice(0, m.index + m[0].length) + greffe(m[1]) + src.slice(m.index + m[0].length);
  } else {
    const a = new RegExp(`^(\\s+)(?:${v}) = [A-Za-z_$][\\w$]*;`, "m").exec(src);
    if (!a) continue;
    sortie = src.slice(0, a.index + a[0].length) + greffe(a[1]) + src.slice(a.index + a[0].length);
  }

  /* Les deux symboles employés doivent être importés. */
  for (const [sym, depuis] of [["clientMethode", "@/lib/templates/clientContent"], ["resolveList", "@/lib/templates/resolveList"]]) {
    if (new RegExp(`\\b${sym}\\b`).test(sortie.split("export default")[0])) continue;
    const bloc = sortie.match(new RegExp(`import \\{([^}]*)\\} from "${depuis.replace(/[/]/g, "\\/")}";`));
    if (bloc) {
      const noms = [...new Set([...bloc[1].matchAll(/[A-Za-z_$][\w$]*/g)].map((x) => x[0]).concat(sym))].sort();
      sortie = sortie.replace(bloc[0], `import {\n${noms.map((n) => `  ${n},\n`).join("")}} from "${depuis}";`);
    } else {
      const j = sortie.indexOf("\n", sortie.indexOf('"use client"')) + 1;
      sortie = sortie.slice(0, j) + `import { ${sym} } from "${depuis}";\n` + sortie.slice(j);
    }
  }

  rapport.push(`${theme} · ${nom} ← ${source}`);
  if (ECRIRE) fs.writeFileSync(f, sortie);
}

rapport.forEach((r) => console.log("  " + r));
console.log(`\n${rapport.length} thèmes · ${ECRIRE ? "écrit" : "simulation (--ecrire)"} · ${DECLARENT.size} déclarent « methode »`);
