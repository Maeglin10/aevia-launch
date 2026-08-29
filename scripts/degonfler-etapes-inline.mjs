/*
  Sortir les étapes recopiées trois fois dans le rendu, et les renuméroter.

    node scripts/degonfler-etapes-inline.mjs impact-290:1030 [--ecrire]

  Un passage antérieur a produit cette forme, où le même tableau de
  démonstration est écrit trois fois — une pour l'item, une pour le modulo, une
  pour le repli :

      const steps = resolveList(
        SOURCE?.map((s: any, i: number) => ({ ...([ … ])[i % ([ … ]).length], title: s.title })),
        [ … ],
      );

  Deux défauts. Le premier tient à la lecture : trois copies dérivent. Le second
  est visible du client : `i % longueur` recopie le numéro d'ordre, si bien
  qu'une méthode en six étapes devant une démonstration qui en compte quatre
  affiche « 01, 02, 03, 04, 01, 02 ». impact-17 en fait même une clé React
  dupliquée, ce qui vide la page.

  On sort le tableau en constante de module et l'on passe par
  `fusionnerEtapes`, qui renumérote en respectant la forme trouvée.

  Le repère est donné à la main, ligne par ligne : plusieurs blocs de cette
  forme cohabitent dans un même fichier — quatre dans impact-290 — et prendre
  le premier venu, c'est câbler la méthode sur les prestations.
*/
import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");
const CIBLES = process.argv.slice(2).filter((a) => a.includes(":")).map((a) => {
  const [theme, ligne] = a.split(":");
  return { theme, ligne: Number(ligne) };
});

/* Le crochet fermant qui équilibre celui ouvert en `depuis`. */
function fermant(src, depuis, ouvrant = "[", clos = "]") {
  let n = 0;
  for (let i = depuis; i < src.length; i++) {
    if (src[i] === ouvrant) n++;
    else if (src[i] === clos) { n--; if (n === 0) return i; }
  }
  return -1;
}

const faits = [], laisses = [];

for (const { theme, ligne } of CIBLES) {
  const f = path.join("app/templates", theme, "page.tsx");
  let src = fs.readFileSync(f, "utf8");
  const NOM = `ETAPES_DEMO_${theme.replace(/\D/g, "")}`;
  if (src.includes(NOM)) { laisses.push(`${theme} · déjà dégonflé`); continue; }

  const depart = src.split("\n").slice(0, ligne - 1).join("\n").length;
  const tete = /resolveList\(\s*\n(\s*\/\*[\s\S]*?\*\/\s*\n)?\s*([\s\S]{0,140}?)\?\.map\(\((\w+): any, (\w+): number\) => \(\{ \.\.\.\(\[/.exec(src.slice(depart));
  if (!tete) { laisses.push(`${theme} · forme non reconnue à la ligne ${ligne}`); continue; }
  const [, commentaire, source, sVar, iVar] = tete;
  const debutBloc = depart + tete.index;

  /* Les deux copies du tableau : celle de l'item, celle du modulo. */
  const ouvre1 = debutBloc + tete[0].length - 1;
  const fin1 = fermant(src, ouvre1);
  if (fin1 < 0) { laisses.push(`${theme} · tableau non refermé`); continue; }
  const litteral = src.slice(ouvre1, fin1 + 1);

  const modulo = new RegExp(`^\\)\\s*\\[\\s*${iVar}\\s*%\\s*\\(\\[`).exec(src.slice(fin1 + 1));
  if (!modulo) { laisses.push(`${theme} · pas de « )[i % ([ » après le tableau`); continue; }
  const ouvre2 = fin1 + modulo[0].length;
  const fin2 = fermant(src, ouvre2);
  const longueur = /^\]\)\.length\],/.exec(src.slice(fin2, fin2 + 12));
  if (fin2 < 0 || !longueur) { laisses.push(`${theme} · « ]).length], » introuvable`); continue; }

  /* Ce que le thème écrit par-dessus : `title: s.title, text: …` jusqu'au `})),`. */
  const finMap = src.indexOf("})),", fin2);
  if (finMap < 0) { laisses.push(`${theme} · fin du map introuvable`); continue; }
  const surcharges = src.slice(fin2 + longueur[0].length, finMap).trim().replace(/,$/, "");

  /* Le repli, troisième copie, jusqu'à la parenthèse de resolveList. */
  const apresMap = fin2 + longueur[0].length + (finMap - fin2 - longueur[0].length) + 4;
  const ouvre3 = src.indexOf("[", apresMap);
  const fin3 = ouvre3 >= 0 ? fermant(src, ouvre3) : -1;
  const finBloc = src.indexOf(");", fin3 > 0 ? fin3 : apresMap) + 2;

  const marge = " ".repeat(src.slice(0, debutBloc).length - src.lastIndexOf("\n", debutBloc) - 1);
  const remplacement =
    `resolveList(\n` +
    (commentaire ? commentaire : "") +
    `${marge}  fusionnerEtapes(${NOM}, ${source} as any)?.map((${sVar}: any, ${iVar}: number) => ({\n` +
    `${marge}    ...${sVar},\n` +
    (surcharges ? surcharges.split(/,\s*(?![^(]*\))/).map((x) => `${marge}    ${x.trim()},\n`).join("") : "") +
    `${marge}  })),\n` +
    `${marge}  ${NOM},\n` +
    `${marge});`;

  src = src.slice(0, debutBloc) + remplacement + src.slice(finBloc);

  const imports = [...src.matchAll(/^import\b[\s\S]*?;$/gm)];
  const finImports = imports.length ? imports.at(-1).index + imports.at(-1)[0].length : 0;
  src = src.slice(0, finImports) +
    `\n\n/* Les étapes de la démonstration, écrites une fois. */\nconst ${NOM} = ${litteral};\n` +
    src.slice(finImports);

  const bloc = src.match(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/);
  if (bloc && !/\bfusionnerEtapes\b/.test(bloc[1])) {
    const noms = [...new Set([...bloc[1].matchAll(/[A-Za-z_$][\w$]*/g)].map((x) => x[0]).concat("fusionnerEtapes"))].sort();
    src = src.replace(bloc[0], `import {\n${noms.map((n) => `  ${n},\n`).join("")}} from "@/lib/templates/clientContent";`);
  }

  faits.push(`${theme} · ${NOM} · ${litteral.split("\n").length} lignes, deux copies retirées`);
  if (ECRIRE) fs.writeFileSync(f, src);
}

faits.forEach((r) => console.log("  " + r));
if (laisses.length) console.log("\nlaissés :\n" + laisses.map((r) => "  " + r).join("\n"));
console.log(`\n${faits.length} dégonflés · ${laisses.length} laissés · ${ECRIRE ? "écrit" : "simulation (--ecrire)"}`);
