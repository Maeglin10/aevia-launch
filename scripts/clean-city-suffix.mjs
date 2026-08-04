// Enlève ce qui traîne derrière la ville de démonstration.
//
//   node scripts/clean-city-suffix.mjs [--dry]
//
// Remplacer « Paris » par la ville du client laisse son arrondissement : le
// kinésithérapeute annécien lit « Kinésithérapie du sport · Annecy 15e ». Même
// chose pour un département — « Bordeaux & Gironde » devient « Aix-les-Bains &
// Gironde » — et pour une région.
//
// Ces suffixes appartiennent à la ville de démonstration, pas au client : ils
// partent avec elle. Le client qui n'a pas donné de ville retrouve le texte
// d'origine, arrondissement compris, puisque le repli est la chaîne entière.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

// Ce qui ne se dit que d'une ville précise : arrondissement, département,
// région, pays.
const SUFFIXE =
  /^(\s*(?:\d{1,2}(?:er|e|ᵉ)|[IVX]{1,4}))(?=[\s<.,;:!?·—–)]|$)|^(\s*&\s*(?:Gironde|Rhône|Ain|Savoie|Isère|Var|Hérault|Loire|Nord|Alsace|Bretagne|Normandie|Occitanie|Provence|Île-de-France|IDF))(?=[\s<.,;:!?·—–)]|$)|^(\s*et\s+l(?:&apos;|')Île-de-France)/;

let faits = 0;
const touches = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  const fichiers = [path.join(dossier, "page.tsx"), path.join(dossier, "layout.tsx")];
  for (const sous of fs.readdirSync(dossier)) {
    const f = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(f)) fichiers.push(f);
  }

  for (const file of fichiers) {
    if (!fs.existsSync(file)) continue;
    let src = fs.readFileSync(file, "utf8");
    let n = 0;

    // Après une substitution JSX : `{clientCity(…) ?? "Paris"} 15e`
    src = src.replace(/(\{clientCity\([^{}]*\)\s*\?\?\s*"[^"]+"\})([^\n<]{0,30})/g, (m0, appel, suite) => {
      const s = SUFFIXE.exec(suite);
      if (!s) return m0;
      n++;
      return appel + suite.slice(s[0].length);
    });

    // Après une concaténation : `(clientCity(…) ?? "Paris") + " 15e …"`
    src = src.replace(/(\(clientCity\([^()]*\)\s*\?\?\s*(['"])[^'"]+\2\)\s*\+\s*)(['"])([^'"]*)\3/g, (m0, tete, _q1, q, valeur) => {
      const s = SUFFIXE.exec(valeur);
      if (!s) return m0;
      const reste = valeur.slice(s[0].length);
      n++;
      return reste ? `${tete}${q}${reste}${q}` : tete.replace(/\s*\+\s*$/, "");
    });

    if (n === 0) continue;
    if (!dry) fs.writeFileSync(file, src);
    faits += n;
    touches.push(`${file.replace(`${ROOT}/`, "")} (${n})`);
  }
}

console.log(`${dry ? "[à blanc] " : ""}${faits} suffixe(s) de ville retiré(s) sur ${touches.length} fichier(s)`);
console.log(touches.slice(0, 12).join("  ·  "));
