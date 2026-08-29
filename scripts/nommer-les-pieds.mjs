/*
  Rendre son nom au thème, là où j'avais laissé son identifiant.

    node scripts/nommer-les-pieds.mjs [--ecrire]

  Le pied de page minimal ajouté à soixante et onze thèmes portait
  `clientName(…) ?? "impact-07"`. Tant qu'un client remplit son nom, personne ne
  le voit ; mais la galerie publique des thèmes, elle, n'a pas de client — et
  affichait « impact-07 » en bas de page.

  Le nom du thème est dans le nom de son composant : `AetherSoundPage` est
  « Aether Sound ». On ne l'invente pas, on le lit.
*/
import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");

/* « AetherSoundPage » → « Aether Sound » ; « LATELIERPage » → « L'ATELIER » non,
   on laisse les capitales collées telles quelles plutôt que de mal couper. */
function nomLisible(composant) {
  const base = composant.replace(/(Page|Template)$/, "").replace(/(Page|Template)$/, "");
  return base
    /* On ne coupe que devant une capitale qui ouvre un mot : « AetherSound »
       donne « Aether Sound », mais « SaaS » reste « SaaS » — sa dernière
       capitale ne commence rien. */
    .replace(/([a-zà-ÿ0-9])([A-ZÀ-Ý])(?=[a-zà-ÿ])/g, "$1 $2")
    .replace(/([A-ZÀ-Ý]{2,})([A-ZÀ-Ý][a-zà-ÿ])/g, "$1 $2")
    .trim();
}

const faits = [], laisses = [];
for (const theme of fs.readdirSync("app/templates").filter((d) => /^impact-\d+$/.test(d))) {
  const p = path.join("app/templates", theme, "page.tsx");
  if (!fs.existsSync(p)) continue;
  let src = fs.readFileSync(p, "utf8");
  if (!src.includes(`?? "${theme}"`)) continue;

  const m = /export default function\s+([A-Za-zÀ-ÿ0-9_]+)\s*\(/.exec(src);
  const nom = m ? nomLisible(m[1]) : null;
  if (!nom || nom.length < 3) { laisses.push(`${theme} · composant illisible`); continue; }

  src = src.split(`?? "${theme}"`).join(`?? ${JSON.stringify(nom)}`);
  if (ECRIRE) fs.writeFileSync(p, src);
  faits.push(`${theme.padEnd(12)} ${m[1].padEnd(28)} → « ${nom} »`);
}

faits.slice(0, 8).forEach((f) => console.log("  " + f));
if (laisses.length) console.log("\nlaissés :\n" + laisses.map((l) => "  " + l).join("\n"));
console.log(`\n${faits.length} thèmes renommés${ECRIRE ? "" : " (simulation, --ecrire)"}`);
