// Ce que les thèmes d'un métier affichent, et ce que le wizard lui demande.
//
//   node scripts/audit-archetypes.mjs
//
// Une section reste en démonstration quand le thème l'affiche mais que le
// formulaire n'a jamais posé la question. On croise donc, archétype par
// archétype, les fonctions du contrat que ses thèmes appellent avec les champs
// que son étape réclame.

import fs from "node:fs";
import path from "node:path";

const sectors = fs.readFileSync("lib/templates/sectors.ts", "utf8");
const blocTemplates = sectors.slice(sectors.indexOf("export const SECTOR_TEMPLATES"));
const themesParNiche = {};
for (const m of blocTemplates.matchAll(/^\s*([a-z0-9_]+)\s*:\s*\[([\s\S]*?)\]/gm)) {
  themesParNiche[m[1]] = [...m[2].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
}

const arch = fs.readFileSync("lib/wizard/archetypes.ts", "utf8");
const nicheArchetype = {};
for (const m of arch.slice(arch.indexOf("NICHE_ARCHETYPE")).matchAll(/^\s*([a-z0-9_]+)\s*:\s*['"]([a-z0-9_]+)['"]/gm)) {
  nicheArchetype[m[1]] = m[2];
}
const demande = {};
for (const m of arch.matchAll(/id:\s*['"](\w+)['"],\s*catalogueFields:\s*\[([^\]]*)\],\s*coreFields:\s*\[([^\]]*)\]/g)) {
  demande[m[1]] = [...(`${m[2]},${m[3]}`).matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
}

/** Chaque champ du profil, et la fonction du contrat qui le lit. */
const LIT = {
  services: /\bclientServices\s*\(/, menu: /\bclientMenu\s*\(/, products: /\bclientProducts\s*\(/,
  team: /\bclientTeam\s*\(/, beforeAfter: /\bclientWorks\s*\(/,
  faq: /\bclientFaq\s*\(/, keyStats: /\bclientStats\s*\(/,
  certifications: /\bclientCertifications\s*\(/, reputation: /\bclientReviews\s*\(/,
  openingHours: /\bclientHours\s*\(/, paymentMethods: /\bclientPayments\s*\(/,
  geo: /\bclientAddress\s*\(|\bclientAreas\s*\(/, bookingSystem: /\bclientBookingUrl\s*\(/,
};

const parArch = {};
for (const [niche, ids] of Object.entries(themesParNiche)) {
  const a = nicheArchetype[niche];
  if (!a) { (parArch.__sansArchetype ??= { niches: new Set() }).niches.add(niche); continue; }
  parArch[a] ??= { niches: new Set(), themes: new Set(), lit: {} };
  parArch[a].niches.add(niche);
  for (const id of ids) {
    const f = path.join("app/templates", id, "page.tsx");
    if (!fs.existsSync(f)) continue;
    parArch[a].themes.add(id);
    const s = fs.readFileSync(f, "utf8");
    for (const [champ, re] of Object.entries(LIT)) {
      if (re.test(s)) { (parArch[a].lit[champ] ??= new Set()).add(id); }
    }
  }
}

for (const [a, d] of Object.entries(parArch)) {
  if (a === "__sansArchetype") {
    console.log(`\n=== métiers sans archétype (${d.niches.size}) : ${[...d.niches].join(", ")}`);
    continue;
  }
  const dem = new Set(demande[a] ?? []);
  /*
    Un champ absent de l'étape n'est pas un trou si le contrat sait le tirer
    d'un autre : `clientServices` sert la carte, puis le catalogue, puis les
    biens. Un restaurateur qui remplit sa carte voit donc la section des
    prestations remplie sans qu'on lui demande deux fois la même chose.
  */
  const REPLIS = { services: ["menu", "products", "listings"], beforeAfter: ["listings", "products"] };
  const manquants = Object.entries(d.lit)
    .filter(([c]) => !dem.has(c) && !(REPLIS[c] ?? []).some((r) => dem.has(r)))
    .map(([c, ids]) => `${c} (${ids.size}/${d.themes.size} thèmes)`)
    .sort();
  console.log(`\n=== ${a} — ${d.niches.size} métiers, ${d.themes.size} thèmes`);
  if (manquants.length) console.log(`   AFFICHÉ, JAMAIS DEMANDÉ : ${manquants.join(" · ")}`);
  else console.log("   tout ce qui s'affiche est demandé");
  const jamaisAffiche = [...dem].filter((c) => !d.lit[c]);
  if (jamaisAffiche.length) console.log(`   demandé pour rien : ${jamaisAffiche.join(", ")}`);
}
