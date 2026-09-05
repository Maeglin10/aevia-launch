/*
  Ce que le thème sait afficher, et ce que le wizard sait demander.

    node scripts/qa-wizard-couverture.mjs

  Un client qui remplit tout garde parfois des sections d'exemple. Deux causes
  possibles, et il faut les séparer : ou bien le wizard ne pose pas la question,
  ou bien le thème ne lit pas la réponse. Ce contrôle traite la première.

  Pour chaque thème, on croise les blocs qu'il déclare (capabilities.ts) avec
  les blocs que le formulaire collecte réellement pour le métier concerné.
*/
import fs from "node:fs";

const cap = fs.readFileSync("lib/templates/capabilities.ts", "utf8");
const BLOCS = Object.fromEntries(
  [...cap.matchAll(/"(impact-\d+)":\s*\[([^\]]*)\]/g)].map((m) => [
    m[1],
    [...m[2].matchAll(/"([a-z]+)"/g)].map((x) => x[1]),
  ]),
);

/*
  Ce que le formulaire collecte. Établi en lisant StepForm : chaque bloc y a
  son champ, ou n'en a pas.
*/
const form = ["components/StepForm.tsx",
  ...fs.readdirSync("components/wizard").filter(f => f.endsWith(".tsx") || f.endsWith(".ts")).map(f => "components/wizard/" + f),
  ...fs.readdirSync("components/wizard/steps").filter(f => f.endsWith(".tsx")).map(f => "components/wizard/steps/" + f),
].map(f => fs.readFileSync(f, "utf8")).join("\n");
const COLLECTE = {
  prestations: /services=\{|businessProfile\.services/.test(form),
  tarifs: /price/.test(form),
  avis: /featuredReviews|reviews=/.test(form),
  chiffres: /keyStats/.test(form),
  engagements: /certifications/.test(form),
  faq: /\bfaq\b/.test(form),
  equipe: /\bteam\b/.test(form),
  horaires: /openingHours/.test(form),
  menu: /\bmenu\b/.test(form),
  produits: /products/.test(form),
  realisations: /beforeAfter/.test(form),
  zones: /serviceAreas/.test(form),
  methode: /\bmethode\b|\bmethod\b/.test(form),
};

console.log("Ce que le formulaire sait demander :");
for (const [b, ok] of Object.entries(COLLECTE)) console.log(`  ${ok ? "✓" : "✗"} ${b}`);

const jamais = Object.entries(COLLECTE).filter(([, ok]) => !ok).map(([b]) => b);
const compte = {};
for (const [theme, blocs] of Object.entries(BLOCS)) {
  for (const b of blocs) if (jamais.includes(b)) (compte[b] ??= []).push(theme);
}
console.log("\nBlocs déclarés par des thèmes mais jamais demandés :");
if (!Object.keys(compte).length) console.log("  aucun");
for (const [b, ts] of Object.entries(compte).sort((a, c) => c[1].length - a[1].length)) {
  console.log(`  ${b} — ${ts.length} thèmes (ex. ${ts.slice(0, 4).join(", ")})`);
}
