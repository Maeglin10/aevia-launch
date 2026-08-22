/*
  Audit de qualité des 373 thèmes, mesuré contre le niveau de la reprise
  316-383 (docs/REPRISE_316_383_PLAN.md §4 — la check-list premium).

    node scripts/audit-qualite.mjs            # tableau trié, pires en tête
    node scripts/audit-qualite.mjs --json     # fiches complètes sur stdout

  Tout est mesuré dans les fichiers, rien n'est estimé. Trois axes :

  - DESIGN     /40 : geste de signature du kit, clamp(), fontes dédiées,
                     easing maîtrisé, media queries locales, survols pilotés,
                     reduced-motion, textures sans image.
  - CÂBLAGE    /40 : helpers du contrat réellement appelés, resolveList,
                     retouches clientText, LegalIdentity, var(--brand),
                     photos du client réinjectées.
  - VENDABILITÉ/20 : photos présentes, thème proposé au catalogue d'un
                     métier, pages secondaires, matière.

  La note ne dit pas qu'une page est belle — elle dit qu'elle possède, ou
  non, ce que possèdent toutes les pages retenues comme référence (245, 247,
  83, et la série 316-383 reprise). Un score bas se vérifie à l'écran avant
  de conclure : l'instrument a déjà menti.
*/
import fs from "node:fs";
import path from "node:path";

const RACINE = process.cwd();
const DOSSIER = path.join(RACINE, "app/templates");

const sectors = fs.readFileSync(path.join(RACINE, "lib/templates/sectors.ts"), "utf8");
const tiers = fs.readFileSync(path.join(RACINE, "lib/templates/templateTier.ts"), "utf8");

const tierDe = (id) => tiers.match(new RegExp(`"${id}":\\s*"(\\w+)"`))?.[1] ?? "?";
const auCatalogue = (id) => new RegExp(`["']${id}["']`).test(sectors);

const GESTES = [
  "ArcSwap", "PortalZoom", "HardCutRebuild", "CrossPush", "MosaicPush",
  "TrackingCollapse", "PanelDrop", "PanelRise", "ScrollGrow",
  "DifferentialExit", "ScrollSpin", "LineScroll", "InvertSweep", "ComposeIn",
  "ParticleOrb", "PushBlur", "WordFlight", "ExpandFrame", "LineMask",
  "BentoCascade", "HeldSwap", "GhostSolid", "WipeReveal", "StickyProgress",
];

const themes = fs.readdirSync(DOSSIER).filter((d) => d.startsWith("impact-")).sort();
const fiches = [];

for (const id of themes) {
  const fichier = path.join(DOSSIER, id, "page.tsx");
  if (!fs.existsSync(fichier)) continue;
  /*
    Les thèmes multi-pages rangent tokens, fontes et helpers dans un
    shared.tsx que la page importe : sans lui, impact-83 perdait ses fontes
    et la moitié de son câblage. On mesure donc la somme des deux.
  */
  const partage = path.join(DOSSIER, id, "shared.tsx");
  const src = fs.readFileSync(fichier, "utf8") +
    (fs.existsSync(partage) ? fs.readFileSync(partage, "utf8") : "");
  const compter = (re) => (src.match(re) ?? []).length;

  const sousPages = fs.readdirSync(path.join(DOSSIER, id), { withFileTypes: true })
    .filter((e) => e.isDirectory() && fs.existsSync(path.join(DOSSIER, id, e.name, "page.tsx"))).length;

  const geste = GESTES.find((g) => new RegExp(`<${g}[\\s/>]`).test(src)) ?? null;
  const clamps = compter(/clamp\(/g);
  const fontes = /@import url\(['"]https:\/\/fonts\.googleapis/.test(src);
  const easing = /cubic-bezier\(\s*0?\.16|[[(]0\.16,\s*1,\s*0\.3,\s*1[\])]/.test(src);
  const medias = compter(/@media/g);
  const survols = compter(/onMouseEnter/g);
  const motion = /prefers-reduced-motion|useReducedMotion/.test(src);
  const textures = compter(/radial-gradient|linear-gradient/g);

  const helpers = new Set((src.match(/\bclient[A-Z][A-Za-z]+\s*\(/g) ?? []).map((s) => s.replace(/\s*\($/, "")));
  const retouches = new Set((src.match(/client(?:Text|List)\(\s*sessionData\s*,\s*["']([^"']+)["']/g) ?? [])).size;
  const rl = compter(/resolveList\(/g);
  const legal = /LegalIdentity/.test(src);
  const brand = /var\(--brand/.test(src);
  const photosClient = /clientPhotos|photoUrls/.test(src);
  const urls = new Set(src.match(/unsplash\.com\/photo-[0-9a-zA-Z_-]+|pexels\.com\/photos\/[0-9]+/g) ?? []).size;
  const lignes = src.split("\n").length;

  let design = 0;
  design += geste ? 8 : 0;
  design += clamps >= 40 ? 8 : clamps >= 20 ? 5 : clamps >= 8 ? 2 : 0;
  design += fontes ? 5 : 0;
  design += easing ? 3 : 0;
  design += medias >= 3 ? 4 : medias >= 1 ? 2 : 0;
  design += survols >= 6 ? 4 : survols >= 2 ? 2 : 0;
  design += motion ? 3 : 0;
  design += textures >= 8 ? 3 : textures >= 3 ? 1 : 0;
  design += /overflowX:\s*["']clip/.test(src) ? 2 : 0;

  let cablage = 0;
  cablage += helpers.size >= 14 ? 15 : helpers.size >= 10 ? 11 : helpers.size >= 6 ? 7 : helpers.size >= 3 ? 3 : helpers.size > 0 ? 1 : 0;
  cablage += rl >= 3 ? 5 : rl >= 1 ? 3 : 0;
  cablage += retouches >= 6 ? 6 : retouches >= 3 ? 3 : retouches >= 1 ? 1 : 0;
  cablage += legal ? 4 : 0;
  cablage += brand ? 5 : 0;
  cablage += photosClient ? 5 : 0;

  let vendable = 0;
  vendable += urls >= 6 ? 5 : urls >= 2 ? 3 : urls >= 1 ? 1 : 0;
  vendable += auCatalogue(id) ? 8 : 0;
  vendable += sousPages >= 3 ? 4 : sousPages >= 1 ? 2 : 0;
  vendable += lignes >= 600 ? 3 : lignes >= 350 ? 1 : 0;

  fiches.push({
    id, tier: tierDe(id), catalogue: auCatalogue(id), geste, lignes, sousPages,
    clamps, fontes, medias, survols, motion, easing,
    helpers: helpers.size, retouches, resolveList: rl, legal, brand, urls,
    design, cablage, vendable, total: design + cablage + vendable,
  });
}

fiches.sort((a, b) => a.total - b.total);

if (process.argv.includes("--json")) {
  console.log(JSON.stringify(fiches, null, 2));
} else {
  console.log("id | total | D/40 | C/40 | V/20 | tier | catal | geste | helpers | retouches | lignes");
  for (const f of fiches) {
    console.log(
      `${f.id} | ${String(f.total).padStart(3)} | ${f.design} | ${f.cablage} | ${f.vendable}` +
      ` | ${f.tier} | ${f.catalogue ? "oui" : "NON"} | ${f.geste ?? "—"}` +
      ` | ${f.helpers} | ${f.retouches} | ${f.lignes}`,
    );
  }
  const moy = (xs) => Math.round(xs.reduce((a, b) => a + b, 0) / xs.length);
  console.log(`\n${fiches.length} thèmes · moyenne ${moy(fiches.map((f) => f.total))}/100` +
    ` · design ${moy(fiches.map((f) => f.design))}/40 · câblage ${moy(fiches.map((f) => f.cablage))}/40` +
    ` · vendabilité ${moy(fiches.map((f) => f.vendable))}/20`);
}
