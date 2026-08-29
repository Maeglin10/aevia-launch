/*
  Écrire le dictionnaire de traduction d'un thème.

    node scripts/ecrire-traductions.mjs /tmp/lot-01.json

  Le fichier d'entrée porte, par thème, chaque phrase de démonstration et ses
  quatre traductions dans l'ordre fr, es, de, pt :

      { "impact-217": { "Shop the drop": ["Voir la collection", "Ver la colección",
                                          "Zur Kollektion", "Ver a coleção"] } }

  Il en sort `app/templates/impact-217/traductions.ts`, chargé par
  BrandColorVar avec le thème et avec lui seul : mille cent vingt-sept
  paragraphes en cinq langues dans un lexique global pèseraient sur toutes les
  pages pour ne servir qu'à une.

  La clé est mise en minuscules, comme la lecture le fait au moment de chercher.
  Un fichier déjà écrit est complété, jamais remplacé : deux lots peuvent
  traiter le même thème.
*/
import fs from "node:fs";
import path from "node:path";

const LANGUES = ["fr", "es", "de", "pt"];
const entree = process.argv[2];
if (!entree) { console.error("usage : node scripts/ecrire-traductions.mjs <fichier.json>"); process.exit(1); }

const lot = JSON.parse(fs.readFileSync(entree, "utf8"));
let themes = 0, phrases = 0;

for (const [theme, phrasesDuTheme] of Object.entries(lot)) {
  const dossier = path.join("app/templates", theme);
  if (!fs.existsSync(dossier)) { console.log(`  ✗ ${theme} — dossier absent`); continue; }
  const fichier = path.join(dossier, "traductions.ts");

  /* Ce qui existe déjà, pour compléter plutôt qu'écraser. */
  const deja = {};
  if (fs.existsSync(fichier)) {
    const src = fs.readFileSync(fichier, "utf8");
    for (const langue of LANGUES) {
      deja[langue] = {};
      const bloc = new RegExp(`  ${langue}: \\{([\\s\\S]*?)\\n  \\},`).exec(src);
      if (!bloc) continue;
      for (const m of bloc[1].matchAll(/^\s*"((?:[^"\\]|\\.)*)":\s*"((?:[^"\\]|\\.)*)",$/gm)) {
        deja[langue][JSON.parse(`"${m[1]}"`)] = JSON.parse(`"${m[2]}"`);
      }
    }
  }

  const dico = {};
  for (const langue of LANGUES) dico[langue] = { ...(deja[langue] ?? {}) };
  for (const [source, trads] of Object.entries(phrasesDuTheme)) {
    if (!Array.isArray(trads) || trads.length !== LANGUES.length) {
      console.log(`  ✗ ${theme} — « ${source.slice(0, 40)} » : ${trads?.length ?? 0} traductions au lieu de 4`);
      continue;
    }
    LANGUES.forEach((langue, i) => { dico[langue][source.toLowerCase()] = trads[i]; });
    phrases++;
  }

  const corps = LANGUES.map((langue) => {
    const lignes = Object.entries(dico[langue])
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => `    ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
      .join("\n");
    return `  ${langue}: {\n${lignes}\n  },`;
  }).join("\n");

  fs.writeFileSync(fichier, `/*
  La prose de démonstration de ce thème, dans les langues que nous proposons.

  Ces phrases sont écrites en dur dans le thème : elles ne viennent d'aucun
  champ du formulaire, et disparaissent dès que le client remplit le bloc
  correspondant. Les traduire est ce qui tient la page tant qu'il ne l'a pas
  fait — un site français ne montre pas de paragraphe anglais.

  Chargé par BrandColorVar avec ce thème et avec lui seul.
*/
export const TRADUCTIONS: Record<string, Record<string, string>> = {
${corps}
};
`);
  themes++;
}

console.log(`\n${themes} thèmes · ${phrases} phrases × 4 langues`);
