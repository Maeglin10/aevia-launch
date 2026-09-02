/* Ajouter des entrées au dictionnaire d'UN thème.

   Les thèmes anglais se traduisent à l'exécution : BrandColorVar charge
   `app/templates/<thème>/traductions.ts` et remplace les textes qu'il y
   trouve, dans la langue du visiteur. Ce qui manque au dictionnaire reste
   donc en anglais sur une page française.

   Ce script ne devine rien : on lui donne les quatre traductions.

     node scripts/ajouter-traductions.mjs impact-46 < entrees.json
   où entrees.json vaut :
     [ { "en": "Monthly", "fr": "Mensuel", "es": "Mensual",
         "de": "Monatlich", "pt": "Mensal" }, … ]

   La clé est le texte anglais en minuscules, tel que la page l'affiche.
*/
import fs from "node:fs";

const theme = process.argv[2];
if (!theme) { console.error("usage: node scripts/ajouter-traductions.mjs <thème> < entrees.json"); process.exit(1); }

const chemin = `app/templates/${theme}/traductions.ts`;
const entrees = JSON.parse(fs.readFileSync(0, "utf8"));
const LANGUES = ["fr", "es", "de", "pt"];

let src = fs.existsSync(chemin)
  ? fs.readFileSync(chemin, "utf8")
  : `/*
  La prose de démonstration de ce thème, dans les langues que nous proposons.
  Chargé par BrandColorVar avec ce thème et avec lui seul.
*/
export const TRADUCTIONS: Record<string, Record<string, string>> = {
${LANGUES.map((l) => `  ${l}: {\n  },`).join("\n")}
};
`;

const echapper = (v) => v.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
let poses = 0, sautes = 0;

for (const langue of LANGUES) {
  const ouvre = new RegExp(`^  ${langue}: \\{$`, "m");
  const m = ouvre.exec(src);
  if (!m) { console.error(`langue absente du fichier : ${langue}`); process.exit(1); }
  const finBloc = src.indexOf("\n  },", m.index);
  const bloc = src.slice(m.index, finBloc);

  let lignes = "";
  for (const e of entrees) {
    const cle = e.en.trim().toLowerCase();
    if (bloc.includes(`"${echapper(cle)}":`)) { if (langue === "fr") sautes++; continue; }
    if (!e[langue]) continue;
    lignes += `    "${echapper(cle)}": "${echapper(e[langue])}",\n`;
    if (langue === "fr") poses++;
  }
  src = src.slice(0, m.index + m[0].length) + "\n" + lignes.replace(/\n$/, "") + src.slice(m.index + m[0].length);
}

fs.writeFileSync(chemin, src);
console.log(`${theme} : ${poses} entrées posées, ${sautes} déjà présentes`);
