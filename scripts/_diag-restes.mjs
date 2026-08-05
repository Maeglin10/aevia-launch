// Où se cachent les villes de démonstration qui restent.
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const VILLES = ["Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Nantes", "Lille", "Nice", "Strasbourg", "Rennes", "Montpellier"];
const registre = JSON.parse(fs.readFileSync("/tmp/registre.json", "utf8"));
const cibles = registre.filter((x) => !x.recu && x.griefs.some((g) => /^reste/.test(g)));

const familles = {};
for (const { id, griefs } of cibles) {
  const ville = /reste : (\w+)/.exec(griefs.find((g) => /^reste/.test(g)))?.[1];
  if (!ville) continue;
  const dossier = path.join(ROOT, id);
  for (const f of ["page.tsx", "layout.tsx", "shared.tsx"]) {
    const chemin = path.join(dossier, f);
    if (!fs.existsSync(chemin)) continue;
    const src = fs.readFileSync(chemin, "utf8");
    for (const ligne of src.split("\n")) {
      if (!new RegExp(`\\b${ville}\\b`).test(ligne)) continue;
      if (/RCS|Aevia|SIREN|^\s*(import|\/\/)/.test(ligne)) continue;
      const forme = /\d{5}/.test(ligne) ? "adresse postale"
        : /clientCity|clientAddress/.test(ligne) ? "à côté d'un appel au contrat"
        : /alt=|aria|href=/.test(ligne) ? "attribut"
        : /\[|\{/.test(ligne) ? "donnée d'exemple"
        : "texte";
      familles[forme] ??= [];
      if (familles[forme].length < 4) familles[forme].push(`${id} · ${ligne.trim().slice(0, 90)}`);
      familles[`${forme} (compte)`] = (familles[`${forme} (compte)`] ?? 0) + 1;
    }
  }
}
for (const [k, v] of Object.entries(familles)) {
  if (k.endsWith("(compte)")) console.log(`${String(v).padStart(4)}  ${k.replace(" (compte)", "")}`);
}
console.log();
for (const [k, v] of Object.entries(familles)) {
  if (Array.isArray(v)) console.log(`— ${k}\n   ${v.join("\n   ")}`);
}
