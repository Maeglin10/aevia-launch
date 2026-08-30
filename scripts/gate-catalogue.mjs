/*
  Barrière catalogue — opposable à la vente (B2).

  Rejoue le score /100 (scripts/audit-qualite.mjs) et écrit la liste des thèmes
  SOUS LE SEUIL (total < 40) dans lib/templates/catalogueGate.ts. app/themes
  fusionne cette liste dans HIDDEN_IMPACT : un thème sous le seuil n'apparaît
  plus au catalogue tant qu'il n'est pas remonté. La page directe reste
  accessible (on ne casse pas les liens d'aperçu existants) — il n'est juste
  plus proposé à l'achat.

  Le score est un ORDRE DE PRIORITÉ, pas un verdict (l'instrument a déjà menti
  une fois — cf. AUDIT_QUALITE). D'où l'échappatoire manuelle GARDER_MALGRE_SCORE
  dans app/themes/page.tsx : y inscrire un id vérifié à l'écran le garde visible
  malgré son score. La barrière ne décide jamais seule contre l'œil.

    node scripts/gate-catalogue.mjs      # régénère le fichier + résume

  À rejouer après chaque reprise (les scores montent, la liste se vide).
*/
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const SEUIL = 40;
const RACINE = process.cwd();
const CIBLE = path.join(RACINE, "lib/templates/catalogueGate.ts");

// Rejoue le scoreur en JSON (source unique de vérité du /100).
const brut = execFileSync("node", ["scripts/audit-qualite.mjs", "--json"], {
  cwd: RACINE,
  maxBuffer: 32 * 1024 * 1024,
  encoding: "utf8",
});
const fiches = JSON.parse(brut);

const sousSeuil = fiches
  .filter((f) => typeof f.total === "number" && f.total < SEUIL)
  .sort((a, b) => a.total - b.total);

const lignes = sousSeuil.map((f) => `  "${f.id}": ${f.total},`).join("\n");

const sortie = `// AUTO-GENERATED — do not hand-edit. Regenerate: node scripts/gate-catalogue.mjs
// Themes below the sale-quality floor (score < ${SEUIL}/100), hidden from the
// catalogue by app/themes until reworked. The page still resolves at its direct
// URL — the theme is simply not offered for purchase. Override a screen-verified
// theme back into the catalogue via GARDER_MALGRE_SCORE in app/themes/page.tsx.
export const GATE_SEUIL = ${SEUIL};

/** id du thème -> score /100, pour les thèmes sous le seuil (générés). */
export const SOUS_SEUIL: Record<string, number> = {
${lignes}
};
`;

fs.writeFileSync(CIBLE, sortie);
console.log(
  `Barrière régénérée : ${sousSeuil.length} thème(s) sous ${SEUIL}/100 retirés du catalogue.`,
);
console.log(sousSeuil.map((f) => `${f.id}(${f.total})`).join(" "));
