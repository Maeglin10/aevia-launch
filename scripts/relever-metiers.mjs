/* Le métier de chaque thème, lu dans le thème lui-même.

   Trois sources, par ordre de fiabilité :
     1. le repli de clientTrade — « clientTrade(s) ?? "Ébéniste" » : c'est le
        thème qui dit son propre métier ;
     2. la bannière de commentaire en tête de fichier, qui nomme l'enseigne
        et l'activité ;
     3. le libellé du secteur dans templateTier, quand il existe.
   On ne devine jamais : un thème sans source reste marqué inconnu. */
import fs from "node:fs";

const themes = fs.readdirSync("app/templates").filter((d) => /^impact-\d+$/.test(d))
  .sort((a, b) => Number(a.split("-")[1]) - Number(b.split("-")[1]));

const metiers = {};
let sansSource = [];

for (const t of themes) {
  let src = "";
  for (const n of ["page.tsx", "layout.tsx", "shared.tsx"]) {
    const f = `app/templates/${t}/${n}`;
    if (fs.existsSync(f)) src += fs.readFileSync(f, "utf8");
  }
  let m = /clientTrade\([^)]*\)\s*\?\?\s*["'`]([^"'`]{3,40})["'`]/.exec(src);
  if (m) { metiers[t] = { metier: m[1].trim(), source: "clientTrade" }; continue; }

  /* La bannière : « BOULANGERIE DU BEFFROI — Boulangerie artisanale · Lille » */
  m = /^\s{0,6}[A-ZÀ-Ý][A-ZÀ-Ý'’&. ]{3,44}\s+—\s+([^\n·]{4,60})/m.exec(src);
  if (m) { metiers[t] = { metier: m[1].trim(), source: "bannière" }; continue; }

  sansSource.push(t);
}

const parMetier = {};
for (const [t, v] of Object.entries(metiers)) {
  const c = v.metier.toLowerCase();
  (parMetier[c] ??= []).push(t);
}
console.log(`${themes.length} thèmes · ${Object.keys(metiers).length} avec un métier lisible · ${sansSource.length} sans source`);
console.log(`métiers distincts : ${Object.keys(parMetier).length}`);
console.log("\nles plus fréquents :");
Object.entries(parMetier).sort((a, b) => b[1].length - a[1].length).slice(0, 12)
  .forEach(([m, v]) => console.log(`   ${v.length.toString().padStart(3)}  ${m}`));
if (sansSource.length) console.log(`\nsans source : ${sansSource.slice(0, 14).join(", ")}${sansSource.length > 14 ? " …" : ""}`);
fs.writeFileSync("captures/contact/metiers.json", JSON.stringify(metiers, null, 2));
