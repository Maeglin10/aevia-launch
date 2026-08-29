/*
  Second passage de rattachement, jugé sur le titre des thèmes.

    node scripts/rattacher-catalogue-2.mjs [--ecrire]

  Le premier passage jugeait le thème dans son ensemble : un seul secteur bien
  rattaché suffisait à le blanchir. Un salon de coiffure recevait donc
  impact-180 — « Thermotek Chauffage — Chauffagiste professionnel » — parce que
  ce thème était aussi (correctement) proposé aux toiletteurs.

  Le titre de chaque thème nomme son métier en toutes lettres. Ne sont repris ici
  que les écarts francs, relus un à un ; les cas discutables — un traiteur
  proposé aux restaurants, une entreprise de construction proposée aux
  architectes — sont laissés tels quels.
*/
import fs from "node:fs";

const ECRIRE = process.argv.includes("--ecrire");

const RATTACHEMENTS = [
  { theme: "impact-180", titre: "Thermotek Chauffage — Chauffagiste",  quitte: ["coiffeur", "toiletteur"], rejoint: "plombier" },
  { theme: "impact-189", titre: "ATELIER LÉONIE — Salon de coiffure",  quitte: ["restaurant", "brasserie"], rejoint: "coiffeur" },
  { theme: "impact-191", titre: "Jardins Vivants — espaces verts",     quitte: ["menage", "institut_beaute", "demenageur"], rejoint: "paysagiste" },
  { theme: "impact-192", titre: "SÉC'URFAST — Serrurier urgence",      quitte: ["institut_beaute", "demenageur"], rejoint: "serrurier" },
  { theme: "impact-193", titre: "Ostéo Gaïa — D.O.",                   quitte: ["avocat"], rejoint: "osteo" },
  { theme: "impact-195", titre: "Maison Élise — Wedding planner",      quitte: ["restaurant"], rejoint: "mariage" },
  { theme: "impact-200", titre: "Cérémonie — Wedding Planner",         quitte: ["fleuriste"], rejoint: "mariage" },
  { theme: "impact-186", titre: "Dr. Léa Fontaine — Cabinet dentaire", quitte: ["medecin"], rejoint: "dentiste" },
];

let src = fs.readFileSync("lib/templates/sectors.ts", "utf8");
const cite = (t) => new RegExp(`['"]${t}['"]`);
const faits = [], laisses = [];

for (const { theme, titre, quitte, rejoint } of RATTACHEMENTS) {
  let partis = 0;
  for (const secteur of quitte) {
    const motif = new RegExp(`^(\\s*'?${secteur}'?:\\s*)\\[([^\\]]*)\\]`, "m");
    const m = motif.exec(src);
    if (!m) { laisses.push(`${theme} · secteur « ${secteur} » introuvable`); continue; }
    if (!cite(theme).test(m[2])) continue;
    const propre = m[2].split(",").map((x) => x.trim()).filter((x) => x && !cite(theme).test(x));
    src = src.replace(motif, `$1[${propre.join(", ")}]`);
    partis++;
  }

  const motif = new RegExp(`^(\\s*'?${rejoint}'?:\\s*)\\[([^\\]]*)\\]`, "m");
  const m = motif.exec(src);
  if (!m) { laisses.push(`${theme} · secteur d'accueil « ${rejoint} » introuvable`); continue; }
  if (!cite(theme).test(m[2])) {
    const liste = m[2].split(",").map((x) => x.trim()).filter(Boolean).concat(`'${theme}'`);
    src = src.replace(motif, `$1[${liste.join(", ")}]`);
  }
  faits.push(`${theme.padEnd(12)} « ${titre} » → ${rejoint} (quitte ${partis})`);
}

/* Aucun secteur ne doit se retrouver dépeuplé : le client doit garder un choix. */
const bloc = src.slice(src.indexOf("SECTOR_TEMPLATES"), src.indexOf("TEMPLATE_CITY_LABELS"));
const maigres = [...bloc.matchAll(/^\s*'?([a-z_0-9]+)'?:\s*\[([^\]]*)\]/gm)]
  .map((m) => [m[1], (m[2].match(/impact-/g) ?? []).length])
  .filter(([, n]) => n < 3);

if (ECRIRE) fs.writeFileSync("lib/templates/sectors.ts", src);
faits.forEach((f) => console.log("  " + f));
if (laisses.length) console.log("\nlaissés :\n" + laisses.map((l) => "  " + l).join("\n"));
if (maigres.length) console.log("\n⚠ secteurs à moins de trois thèmes : " + maigres.map(([s, n]) => `${s} (${n})`).join(", "));
console.log(`\n${faits.length} rattachés · ${ECRIRE ? "écrit" : "simulation (--ecrire)"}`);
