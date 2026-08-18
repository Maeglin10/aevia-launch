/*
  Compléter le répertoire des marques de démonstration depuis la source.

    node scripts/completer-repertoire-marques.mjs [--ecrire]

  Le juge de catalogue passe son chemin quand un thème n'a pas de marque connue :
  `if (!marque) continue`. Soixante-quatorze thèmes n'ont donc jamais été jugés,
  et l'un d'eux — impact-180, un site de chauffagiste — était proposé aux
  coiffeurs et aux toiletteurs. Un salon de coiffure recevait « URGENCE 4H » et
  un tableau électrique en photo de couverture.

  La marque d'un thème est le repli de son premier appel au nom du client. On
  écarte les replis qui ne sont pas des noms : `alt={… ?? 'logo'}` n'en est pas un.
*/
import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");
const PAS_UN_NOM = /^(logo|image|photo|client|nom|name|brand|site|entreprise|pro)$/i;

function marqueLue(theme) {
  for (const f of ["page.tsx", "shared.tsx", "layout.tsx"]) {
    const p = path.join("app/templates", theme, f);
    if (!fs.existsSync(p)) continue;
    const t = fs.readFileSync(p, "utf8");
    for (const m of t.matchAll(/(?:clientName\(sessionData\)|fd\?\.businessName)\s*\)?\s*\?\?\s*["']([^"']{2,60})["']/g)) {
      const v = m[1].trim();
      if (!PAS_UN_NOM.test(v) && /[A-Za-zÀ-ÿ]/.test(v)) return v;
    }
  }
  return null;
}

let src = fs.readFileSync("lib/templates/marquesDemo.ts", "utf8");
const connus = new Set([...src.matchAll(/"(impact-\d+)":\s*"/g)].map((m) => m[1]));
const themes = fs.readdirSync("app/templates")
  .filter((d) => /^impact-\d+$/.test(d))
  .sort((a, b) => Number(a.slice(7)) - Number(b.slice(7)));

const ajouts = [];
for (const theme of themes) {
  if (connus.has(theme)) continue;
  const marque = marqueLue(theme);
  if (marque) ajouts.push([theme, marque]);
}

if (ECRIRE && ajouts.length) {
  /* Insérées à la fin du répertoire, avant son accolade fermante. */
  const debut = src.indexOf("export const MARQUE_DEMO");
  const fin = src.indexOf("\n};", debut);
  const lignes = ajouts.map(([t, m]) => `  "${t}": ${JSON.stringify(m)},`).join("\n");
  src = src.slice(0, fin) + "\n\n  /* Relevées dans la source : ces thèmes manquaient au répertoire,\n     et le juge de catalogue les passait donc en silence. */\n" + lignes + src.slice(fin);
  fs.writeFileSync("lib/templates/marquesDemo.ts", src);
}

console.log(`${ajouts.length} marques relevées${ECRIRE ? " et écrites" : " (simulation, --ecrire)"}\n`);
for (const [t, m] of ajouts.slice(0, 10)) console.log(`  ${t.padEnd(12)} « ${m} »`);
