/*
  La marque de démonstration écrite en dur, hors du repli.

    node scripts/marque-en-dur.mjs

  Le site d'un plombier annonçait « ThermoFix Ateliers Vidal & Fils » dans son
  logo. Le thème écrivait `ThermoFix&nbsp;<span>{clientName(…) ?? "Pro"}</span>` :
  la moitié gauche du nom est en dur, seule la moitié droite écoute le client.
  Le nom du client s'ajoute au nom de démonstration au lieu de le remplacer.

  Le balayage des pages ne le voyait pas : il cherchait le nom de démonstration
  entier — « ThermoFix Pro » — et ne trouvait que sa moitié.

  Une occurrence est fautive quand elle n'est PAS le repli d'un appel client,
  c'est-à-dire quand elle n'est pas précédée de `?? "`.
*/
import fs from "node:fs";
import path from "node:path";

const src = fs.readFileSync("lib/templates/marquesDemo.ts", "utf8");
const MARQUES = {};
for (const m of src.matchAll(/"(impact-\d+)":\s*"((?:[^"\\]|\\.)*)"/g)) MARQUES[m[1]] = m[2];

/* Les mots trop communs pour désigner une marque à eux seuls. */
const BANALS = new Set(["pro", "studio", "atelier", "group", "groupe", "co", "and", "the",
  "cabinet", "maison", "agence", "clinic", "clinique", "lab", "labs", "design", "paris"]);

const rapport = [];
for (const [theme, marque] of Object.entries(MARQUES)) {
  const mots = marque.split(/[\s.&·—-]+/).filter((w) => w.length >= 4 && !BANALS.has(w.toLowerCase()));
  if (!mots.length) continue;

  for (const f of ["page.tsx", "shared.tsx", "layout.tsx"]) {
    const p = path.join("app/templates", theme, f);
    if (!fs.existsSync(p)) continue;
    const texte = fs.readFileSync(p, "utf8");
    const lignes = texte.split("\n");

    /* Les bornes de chaque chaîne de repli, une fois pour le fichier. */
    const replis = [...texte.matchAll(/\?\?\s*(["'`])((?:[^\\]|\\.)*?)\1/g)]
      .map((m) => [m.index, m.index + m[0].length]);

    for (const mot of new Set(mots)) {
      for (const m of texte.matchAll(new RegExp(mot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"))) {
        /*
          Le repli d'un appel client est légitime : `clientName(…) ?? "ThermoFix"`.
          Il ne suffit pas de regarder les six caractères précédents : dans
          `?? "INK & Iron"` le mot « Iron » est loin du `??`. On repère donc les
          bornes de chaque repli et l'on écarte tout ce qui tombe dedans.
        */
        if (replis.some(([a, b]) => m.index >= a && m.index < b)) continue;
        /* Ni un chemin de fichier ni un identifiant de code. */
        const ligne = lignes[texte.slice(0, m.index).split("\n").length - 1];
        if (/^\s*(import|\/\/|\*)/.test(ligne)) continue;
        rapport.push({
          theme, marque, mot, fichier: f,
          ligne: texte.slice(0, m.index).split("\n").length,
          extrait: ligne.trim().slice(0, 120),
        });
      }
    }
  }
}

/* Une ligne peut porter deux mots de la même marque : on ne la compte qu'une fois. */
const vues = new Set();
const propre = rapport.filter((r) => {
  const c = `${r.theme}:${r.fichier}:${r.ligne}`;
  if (vues.has(c)) return false; vues.add(c); return true;
});

const parTheme = {};
for (const r of propre) (parTheme[r.theme] ??= []).push(r);
console.log(`${Object.keys(parTheme).length} thèmes · ${propre.length} lignes impriment la marque de démonstration en dur\n`);
for (const [t, rs] of Object.entries(parTheme).slice(0, 10)) {
  console.log(`  ${t.padEnd(12)} « ${rs[0].marque} » ×${rs.length}\t${rs[0].fichier}:${rs[0].ligne}  ${rs[0].extrait.slice(0, 80)}`);
}
fs.writeFileSync("/tmp/marque-en-dur.json", JSON.stringify(propre, null, 1));
