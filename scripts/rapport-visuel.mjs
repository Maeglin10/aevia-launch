// Ce que la capture de chaque thème donne à voir.
//
//   node scripts/rapport-visuel.mjs /tmp/qa0.json …
//
// Rassemble les fiches de `visual-qa.mjs`, classe les défauts par nature et
// range les thèmes du plus atteint au moins atteint : c'est l'ordre dans lequel
// les regarder. Le détail part dans `docs/QA_VISUELLE.md`.

import fs from "node:fs";
import path from "node:path";

const fichiers = process.argv.slice(2).filter((a) => a.endsWith(".json"));
if (fichiers.length === 0) {
  console.error("usage: node scripts/rapport-visuel.mjs /tmp/qa0.json …");
  process.exit(1);
}

const fiches = fichiers.flatMap((f) => JSON.parse(fs.readFileSync(f, "utf8")));
fiches.sort((a, b) => a.id.localeCompare(b.id, "fr", { numeric: true }));

const NATURE = [
  ["défile de côté", "defilement"],
  ["image(s) cassée(s)", "images"],
  ["texte(s) coupé(s)", "texte"],
  ["contraste(s) faible(s)", "contraste"],
  ["titre de démonstration", "titre"],
  ["page très courte", "courte"],
  ["erreur js", "erreur"],
  ["capture impossible", "capture"],
];

const compte = {};
const parNature = {};
for (const f of fiches) {
  for (const d of f.defauts ?? []) {
    const n = NATURE.find(([motif]) => d.includes(motif))?.[1] ?? "autre";
    compte[n] = (compte[n] ?? 0) + 1;
    (parNature[n] ??= []).push(f.id);
  }
}

const atteints = fiches.filter((f) => (f.defauts ?? []).length);
atteints.sort((a, b) => b.defauts.length - a.defauts.length || a.id.localeCompare(b.id, "fr", { numeric: true }));

const lignes = fiches.map((f) =>
  `| ${f.id} | ${f.nom} · ${f.metier} · ${f.ville} | ${f.couleur} | ${(f.defauts ?? []).join(" · ") || "—"} |`,
);

const doc = `# Ce que la capture donne à voir — QA visuelle des 373 thèmes

Chaque thème reçoit une entreprise réelle par le wizard — nom long, accroche,
trois prestations, deux avis, deux chiffres, horaires, adresse, photos des deux
banques, couleur de marque — puis on capture le rendu et l'on relève ce qui se
mesure de l'image.

Les captures sont dans \`/tmp/qa/<thème>-haut.jpg\` (premier écran) et
\`/tmp/qa/<thème>-page.jpg\` (page entière).

## Ce qui a été relevé

| nature | thèmes |
|---|---|
${NATURE.map(([, n]) => [n, compte[n] ?? 0])
    .filter(([, k]) => k)
    .map(([n, k]) => `| ${n} | **${k}** |`)
    .join("\n")}

${atteints.length} thèmes sur ${fiches.length} portent au moins un défaut mesurable.

## Chaque thème

| thème | l'entreprise essayée | couleur | ce qui a été relevé |
|---|---|---|---|
${lignes.join("\n")}
`;

fs.writeFileSync(path.join(process.cwd(), "docs/QA_VISUELLE.md"), doc);

console.log(`${fiches.length} thèmes capturés, ${atteints.length} avec un défaut mesurable`);
for (const [, n] of NATURE) {
  if (compte[n]) console.log(`  ${n.padEnd(12)} ${String(compte[n]).padStart(3)}  ${(parNature[n] ?? []).slice(0, 8).join(" ")}`);
}
console.log("\ndétail → docs/QA_VISUELLE.md");
