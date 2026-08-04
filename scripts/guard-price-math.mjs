// Protège les calculs faits sur le prix du client.
//
//   node scripts/guard-price-math.mjs [--dry]
//
// Huit thèmes calculent une remise annuelle à partir du tarif : `parseInt(
// plan.price.slice(1)) * 0.8`. Le format supposé est `$49`. Le client écrit
// « 120 € », « à partir de 80 € », « sur devis » — et la carte affiche `$NaN`.
//
// Le calcul n'est plus tenté quand il ne donne pas un nombre : le tarif du
// client s'affiche alors tel qu'il l'a écrit. C'est la seule réponse honnête —
// un thème ne peut pas deviner la remise annuelle d'un prix qu'il ne sait pas
// lire.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

// `parseInt(x.price…)`, `parseFloat(x.price…)`, `Number(x.price)`
const CALCUL = /\b(parseInt|parseFloat|Number)\((\w+)\.(price|prix|tarif)([^)]*)\)/g;

let faits = 0;
const touches = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  const fichiers = [path.join(dossier, "page.tsx")];
  for (const sous of fs.readdirSync(dossier)) {
    const f = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(f)) fichiers.push(f);
  }

  for (const file of fichiers) {
    if (!fs.existsSync(file)) continue;
    let src = fs.readFileSync(file, "utf8");
    if (src.includes("/* PRIX_CALCULABLE */")) continue;
    let n = 0;

    // La forme est toujours la même : une bascule mensuel/annuel, puis un
    // calcul sur le tarif. On ajoute à la condition que le tarif soit lisible
    // comme un nombre — sinon on affiche ce que le client a écrit.
    src = src.replace(
      /\b((?:billingAnnual|annualBilling|isAnnual|annuel|yearly|isYearly)\s*&&\s*)(\w+)\.(price|prix|tarif)(\s*!==\s*"[^"]*")?/g,
      (m0, bascule, objet, champ, comparaison) => {
        if (m0.includes("PRIX_CALCULABLE")) return m0;
        n++;
        return `${bascule}/* PRIX_CALCULABLE */ Number.isFinite(parseFloat(String(${objet}.${champ}).replace(/[^0-9.]/g, ""))) && ${objet}.${champ}${comparaison ?? ""}`;
      },
    );

    if (n === 0) continue;
    if (!dry) fs.writeFileSync(file, src);
    faits += n;
    touches.push(`${file.replace(`${ROOT}/`, "")} (${n})`);
  }
}

console.log(`${dry ? "[à blanc] " : ""}${faits} calcul(s) protégé(s) sur ${touches.length} fichier(s)`);
console.log(touches.join("  ·  "));
