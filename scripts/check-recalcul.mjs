/*
  Une donnée dégelée mais jamais recalculée.

    node scripts/check-recalcul.mjs

  Le dégel d'une constante pose trois choses : une fonction `X_LIVE()`, une
  déclaration `let X = X_LIVE();` pour la démonstration, et un recalcul
  `X = X_LIVE();` une fois la session arrivée. Sans le troisième, la donnée
  reste celle de l'import — et le thème affiche le nom de la démonstration
  alors que le fichier semble parfaitement câblé, `clientName(…) ?? "…"` à
  chaque ligne. impact-288 montrait « Ampère & Fils » dans ses trois
  témoignages pour cette seule raison.

  On vérifie aussi les copies : `let AVIS = AVIS_SOURCE;` prend la valeur du
  moment. Si la source est recalculée et pas la copie, la copie garde la
  démonstration.
*/
import fs from "node:fs";
import path from "node:path";

function* parcourir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const c = path.join(d, e.name);
    if (e.isDirectory()) yield* parcourir(c);
    else if (e.name.endsWith(".tsx")) yield c;
  }
}

const manques = [];
for (const p of parcourir("app/templates")) {
  const s = fs.readFileSync(p, "utf8");
  const nom = p.slice("app/templates/".length);

  /* Les constantes dégelées : `let X = X_LIVE();` en marge gauche. */
  const degelees = [...s.matchAll(/^let\s+([A-Za-z_$][\w$]*)[^=\n]*=\s*\1_LIVE\(\);/gm)].map((m) => m[1]);
  for (const x of degelees) {
    /* Réaffectée d'une manière ou d'une autre à l'intérieur d'une fonction :
       certains thèmes recalculent par `resolveList(...)` plutôt que par
       `X_LIVE()`, ce qui remplit le même office. */
    const reaffectee = new RegExp(`^\\s+${x}\\s*=[^=]`, "m");
    if (!reaffectee.test(s)) manques.push(`${nom}  ${x} — dégelée, jamais recalculée`);
  }

  /* Les copies d'une constante recalculée. */
  for (const m of s.matchAll(/^let\s+([A-Za-z_$][\w$]*)\s*=\s*([A-Z][\w$]*);\s*$/gm)) {
    const [, copie, source] = m;
    if (!degelees.includes(source)) continue;
    const suit = new RegExp(`^\\s+${copie}\\s*=[^=]`, "m");
    if (!suit.test(s)) manques.push(`${nom}  ${copie} — copie de ${source}, jamais rafraîchie`);
  }
}

manques.forEach((m) => console.log(m));
console.log(manques.length ? `\n${manques.length} donnée(s) figée(s) malgré le dégel` : "aucune donnée figée malgré le dégel");
process.exit(manques.length ? 1 : 0);
