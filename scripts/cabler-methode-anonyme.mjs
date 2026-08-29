/*
  Câbler les méthodes écrites en tableau anonyme dans le JSX.

    node scripts/cabler-methode-anonyme.mjs impact-59:625 impact-76:536 … [--ecrire]

  Sept thèmes écrivent leurs étapes directement dans le rendu :

      {[
        { num: "01", title: "Candidature", desc: "…" },
        …
      ].map((s, i) => (

  Un tableau anonyme ne peut pas servir deux fois — la fusion en a besoin pour
  le modulo — alors on le sort en constante de module, nommée d'après le thème,
  et l'on greffe la lecture par-dessus.

  Le repère est donné à la main, ligne par ligne : ces sections se reconnaissent
  à leur titre affiché, pas à un motif de code, et l'ancrage automatique par
  titre attrapait les mauvaises listes — une grille de poêles, une liste
  d'avantages.
*/
import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");
const CIBLES = process.argv.slice(2).filter((a) => a.includes(":")).map((a) => {
  const [theme, ligne] = a.split(":");
  return { theme, ligne: Number(ligne) };
});

const faits = [], laisses = [];

for (const { theme, ligne } of CIBLES) {
  const f = path.join("app/templates", theme, "page.tsx");
  let src = fs.readFileSync(f, "utf8");
  const lignes = src.split("\n");
  const depuis = lignes.slice(0, ligne - 1).join("\n").length + 1;

  /* Le `{[` qui ouvre, puis le `].map(` qui ferme : on compte les crochets. */
  const ouvre = src.indexOf("{[", depuis - 2);
  if (ouvre < 0 || ouvre > depuis + 40) { laisses.push(`${theme} · pas de « {[ » à la ligne ${ligne}`); continue; }
  let profondeur = 0, ferme = -1;
  for (let i = ouvre + 1; i < src.length; i++) {
    if (src[i] === "[") profondeur++;
    else if (src[i] === "]") { profondeur--; if (profondeur === 0) { ferme = i; break; } }
  }
  if (ferme < 0 || !/^\]\.map\(/.test(src.slice(ferme))) { laisses.push(`${theme} · le tableau ne se referme pas sur « ].map( »`); continue; }

  const litteral = src.slice(ouvre + 1, ferme + 1);
  const v = ["sessionData", "__session", "session"].find((x) => new RegExp(`\\b${x}\\b`).test(src));
  if (!v) { laisses.push(`${theme} · pas de variable de session`); continue; }
  /* Un tableau qui lit déjà la session ne peut pas sortir du composant. */
  if (new RegExp(`\\b${v}\\b`).test(litteral)) { laisses.push(`${theme} · le tableau lit déjà la session`); continue; }

  const NOM = `METHODE_DEMO_${theme.replace(/\D/g, "")}`;
  src = src.slice(0, ouvre + 1) + `${NOM}` + src.slice(ferme + 1);

  /* La constante se pose après le dernier import, hors du composant. */
  const imports = [...src.matchAll(/^import\b[\s\S]*?;$/gm)];
  const fin = imports.length ? imports[imports.length - 1].index + imports[imports.length - 1][0].length : 0;
  src = src.slice(0, fin) +
    `\n\n/* Les étapes de la démonstration, sorties du rendu pour que la méthode du\n   client puisse s'y substituer ligne à ligne. */\nconst ${NOM} = ${litteral};\n` +
    src.slice(fin);

  for (const [sym, dep] of [["clientMethode", "@/lib/templates/clientContent"], ["resolveList", "@/lib/templates/resolveList"]]) {
    const deja = [...src.matchAll(/^import\b[\s\S]*?;$/gm)].map((m) => m[0]).join("\n");
    if (new RegExp(`\\b${sym}\\b`).test(deja)) continue;
    const bloc = src.match(new RegExp(`import \\{([^}]*)\\} from "${dep.replace(/\//g, "\\/")}";`));
    if (bloc) {
      const noms = [...new Set([...bloc[1].matchAll(/[A-Za-z_$][\w$]*/g)].map((x) => x[0]).concat(sym))].sort();
      src = src.replace(bloc[0], `import {\n${noms.map((n) => `  ${n},\n`).join("")}} from "${dep}";`);
    } else {
      const j = src.indexOf("\n", src.indexOf('"use client"')) + 1;
      src = src.slice(0, j) + `import { ${sym} } from "${dep}";\n` + src.slice(j);
    }
  }

  src = src.replace(
    new RegExp(`\\{${NOM}\\.map\\(`),
    `{resolveList(clientMethode(${v})?.map((e: any, i: number) => ({ ...${NOM}[i % ${NOM}.length], ...e })), ${NOM}).map(`,
  );

  faits.push(`${theme} · ${NOM} · ${litteral.split("\n").length} lignes sorties`);
  if (ECRIRE) fs.writeFileSync(f, src);
}

faits.forEach((r) => console.log("  " + r));
if (laisses.length) console.log("\nlaissés :\n" + laisses.map((r) => "  " + r).join("\n"));
console.log(`\n${faits.length} câblés · ${laisses.length} laissés · ${ECRIRE ? "écrit" : "simulation (--ecrire)"}`);
