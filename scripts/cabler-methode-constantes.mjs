/*
  Brancher la méthode du client sur les thèmes dont les étapes sont une
  constante de module.

    node scripts/cabler-methode-constantes.mjs [--ecrire]

  Le premier passage n'a câblé que les thèmes dont la constante s'appelait
  `METHODE`, `PROCESS_STEPS`, `STEPS` ou `ETAPES` : soixante-quatre sur cent
  quarante-neuf. Les autres la nomment `PROCESS`, `METHOD_ITEMS`,
  `APPROACH_ITEMS`, `CRAFT_STEPS`, `PARCOURS_SOURCE` — dix-sept noms en tout.

  Deux formes, et une seule greffe pour chacune :

    A. `const PROCESS = [ … ]` au niveau du module, lu une fois dans le JSX.
       On ne touche pas à la constante — elle est gelée à l'import, et la
       transformer en `let` réaffecté a déjà coûté cinq cent soixante-dix-huit
       erreurs d'ordre. On remplace la lecture, là où `sessionData` est en vue.

    B. `const METHODE = METHODE_SOURCE;` dans le composant. La ligne est déjà
       au bon endroit : on la réécrit.

  Les étapes de la démonstration gardent ce que le client n'écrit pas — le
  numéro d'ordre, l'icône, la durée — parce que la fusion par étalement pose la
  démonstration d'abord et le client par-dessus.
*/
import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");
const { A, B } = JSON.parse(fs.readFileSync("/tmp/methode-abc.json", "utf8"));

const resolu = (nom, v) =>
  `resolveList(clientMethode(${v})?.map((e: any, i: number) => ({ ...${nom}[i % ${nom}.length], ...e })), ${nom})`;

/*
  Les deux symboles employés doivent être importés, sans écraser l'existant.

  À poser AVANT la greffe : cherché après, le symbole se voit lui-même dans le
  code qu'on vient d'écrire et l'import n'est jamais ajouté. Douze thèmes ont
  été livrés ainsi, `clientMethode` introuvable à l'exécution.
*/
function importer(src, sym, depuis) {
  const imports = [...src.matchAll(/^import\b[\s\S]*?;$/gm)].map((m) => m[0]).join("\n");
  if (new RegExp(`\\b${sym}\\b`).test(imports)) return src;
  const bloc = src.match(new RegExp(`import \\{([^}]*)\\} from "${depuis.replace(/\//g, "\\/")}";`));
  if (bloc) {
    const noms = [...new Set([...bloc[1].matchAll(/[A-Za-z_$][\w$]*/g)].map((x) => x[0]).concat(sym))].sort();
    return src.replace(bloc[0], `import {\n${noms.map((n) => `  ${n},\n`).join("")}} from "${depuis}";`);
  }
  const j = src.indexOf("\n", src.indexOf('"use client"')) + 1;
  return src.slice(0, j) + `import { ${sym} } from "${depuis}";\n` + src.slice(j);
}

const faits = [], laisses = [];

for (const [theme, nom] of A) {
  const f = path.join("app/templates", theme, "page.tsx");
  let src = fs.readFileSync(f, "utf8");
  if (/clientMethode\(/.test(src)) { laisses.push(`${theme} · déjà câblé`); continue; }
  const v = ["sessionData", "__session", "session"].find((x) => new RegExp(`\\b${x}\\b`).test(src));
  if (!v) { laisses.push(`${theme} · pas de variable de session`); continue; }

  /* La lecture dans le JSX : `{PROCESS.map(`. Une seule, sauf exception. */
  const lecture = new RegExp(`\\{${nom}\\.map\\(`, "g");
  const sites = [...src.matchAll(lecture)];
  if (sites.length !== 1) { laisses.push(`${theme} · ${sites.length} lectures de ${nom}`); continue; }

  src = importer(src, "clientMethode", "@/lib/templates/clientContent");
  src = importer(src, "resolveList", "@/lib/templates/resolveList");
  src = src.replace(lecture, `{${resolu(nom, v)}.map(`);
  faits.push(`${theme} · A · ${nom}`);
  if (ECRIRE) fs.writeFileSync(f, src);
}

for (const [theme, base, source] of B) {
  const f = path.join("app/templates", theme, "page.tsx");
  let src = fs.readFileSync(f, "utf8");
  if (/clientMethode\(/.test(src)) { laisses.push(`${theme} · déjà câblé`); continue; }
  const v = ["sessionData", "__session", "session"].find((x) => new RegExp(`\\b${x}\\b`).test(src));
  if (!v) { laisses.push(`${theme} · pas de variable de session`); continue; }

  const alias = new RegExp(`const ${base}\\s*=\\s*${source};`);
  if (!alias.test(src)) { laisses.push(`${theme} · alias introuvable`); continue; }
  src = importer(src, "clientMethode", "@/lib/templates/clientContent");
  src = importer(src, "resolveList", "@/lib/templates/resolveList");
  src = src.replace(alias, `const ${base} = ${resolu(source, v)};`);
  faits.push(`${theme} · B · ${base} ← ${source}`);
  if (ECRIRE) fs.writeFileSync(f, src);
}

faits.forEach((r) => console.log("  " + r));
if (laisses.length) console.log("\nlaissés :\n" + laisses.map((r) => "  " + r).join("\n"));
console.log(`\n${faits.length} câblés · ${laisses.length} laissés · ${ECRIRE ? "écrit" : "simulation (--ecrire)"}`);
