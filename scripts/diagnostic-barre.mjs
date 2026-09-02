/* Ce qu'on retrouve, thème après thème, derrière un texte illisible.

   Six familles sont revenues assez souvent pour valoir un repérage :
     1. le voile du héros qui se creuse au milieu (« 0.10 » à 35-40 %),
        exactement là où le titre se pose ;
     2. la barre transparente tant qu'on n'a pas défilé, sur une photo claire ;
     3. les liens de la barre écrits entre 20 et 45 % d'opacité ;
     4. le halo BLANC posé derrière un texte blanc, qui l'empâte ;
     5. le test `C.bg === '#ffffff'` qui rend un bandeau sombre à un thème clair ;
     6. le nom du client sans couleur propre, qui hérite du texte courant.

   Le script ne corrige rien : il dit où regarder dans le fichier.

     node scripts/diagnostic-barre.mjs impact-207 [impact-208 …]
*/
import fs from "node:fs";

const MOTIFS = [
  { nom: "voile creusé au milieu", re: /rgba\([^)]+,\s*0\.(0\d|1[0-5])\)\s*3[0-9]%/ },
  { nom: "barre transparente", re: /scrolled\s*\?[^:]{0,80}:\s*["'`]transparent["'`]/ },
  { nom: "liens à faible opacité", re: /text-(?:white|\[#[0-9a-fA-F]{3,8}\])\/(?:1\d|2\d|3\d|4[0-5])\b|rgba\(255,\s*255,\s*255,\s*0\.[0-4]\d?\)/ },
  { nom: "halo blanc derrière le texte", re: /textShadow:\s*["'`]0 0 2px rgba\(255,255,255/ },
  { nom: "bandeau décidé par égalité de chaîne", re: /=== ['"]#ffffff['"] \? ['"]255,255,255['"]/ },
  { nom: "nom du client sans couleur", re: /\{\/\* NOM_LOGO \*\/[^}]{0,40}clientName/ },
];

for (const theme of process.argv.slice(2)) {
  const trouves = [];
  for (const f of [`app/templates/${theme}/page.tsx`, `app/templates/${theme}/layout.tsx`, `app/templates/${theme}/shared.tsx`]) {
    if (!fs.existsSync(f)) continue;
    const lignes = fs.readFileSync(f, "utf8").split("\n");
    lignes.forEach((l, i) => {
      for (const m of MOTIFS) if (m.re.test(l)) trouves.push(`${f}:${i + 1} — ${m.nom}`);
    });
  }
  console.log(`\n══ ${theme} ══`);
  console.log(trouves.length ? [...new Set(trouves)].join("\n") : "aucun motif connu");
}
