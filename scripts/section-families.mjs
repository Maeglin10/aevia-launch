// Classe les sections muettes par famille et par niche.
//
//   node scripts/section-families.mjs [--liste <famille>]
//
// `section-audit.mjs` dit combien de sections n'ont aucune entrée client.
// Celui-ci dit lesquelles se ressemblent : les thèmes d'une même niche partagent
// leur squelette, et une famille se traite une fois pour toutes plutôt qu'un
// thème à la fois.
//
// La famille est devinée de trois façons, dans cet ordre : l'identifiant de la
// section, son titre, puis les mots de son contenu. Une section qui n'entre dans
// aucune famille est comptée à part — c'est là que se cachent les cas isolés.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const arg = process.argv.indexOf("--liste");
const listeDe = arg !== -1 ? process.argv[arg + 1] : null;

const ENTREE =
  /client(?:Services|Reviews|Stats|Faq|Team|Areas|Certifications|Name|City|Tagline|Address|Photos|LegalForm|Hours|Phone|Email|BookingUrl|Payments)\s*\(|\bfd\??\.|\bbp\??\.|\bc\??\.[a-z]|__layoutSession|sessionData/;

// Famille → ce qui la trahit dans l'identifiant, le titre ou le contenu.
const FAMILLES = [
  ["contact", /\b(contact|nous-trouver|nous-joindre|coordonnees|coordonnées|find-us|reach)\b/i],
  ["reservation", /\b(rdv|reservation|réservation|booking|devis|quote|appointment|prendre-rendez)\b/i],
  ["methode", /\b(methode|méthode|process|processus|approche|approach|demarche|démarche|how-it-works|etapes|étapes|parcours|workflow)\b/i],
  ["galerie", /\b(gallery|galerie|photos|portfolio|realisations|réalisations|projets|projects|work|travaux|creations|créations|lookbook)\b/i],
  ["prestations", /\b(services|prestations|soins|offres|expertise|expertises|solutions|savoir-faire|specialites|spécialités)\b/i],
  ["tarifs", /\b(tarifs|pricing|prix|formules|abonnements|packages|plans)\b/i],
  ["avis", /\b(avis|temoignages|témoignages|testimonials|reviews|clients?-disent)\b/i],
  ["equipe", /\b(equipe|équipe|team|artisans|praticiens|coaches|artists|staff)\b/i],
  ["apropos", /\b(about|apropos|à-propos|histoire|story|manifeste|manifesto|philosophie|philosophy|studio|maison|atelier|cabinet)\b/i],
  ["faq", /\b(faq|questions|queries)\b/i],
  ["engagements", /\b(engagements|garanties|certifications|labels|valeurs|values|commitments|charte)\b/i],
  ["chiffres", /\b(chiffres|stats|numbers|key-figures|impact)\b/i],
  ["menu", /\b(menu|carte|plats|boissons|cave|vins)\b/i],
  ["blog", /\b(blog|journal|actualites|actualités|news|magazine|presse|press)\b/i],
  ["partenaires", /\b(partenaires|partners|marques|brands|trusted|ils-nous-font-confiance|references|références)\b/i],
  ["cta", /\b(cta|newsletter|inscription|signup|subscribe)\b/i],
  ["hero", /\b(hero|accueil|home|intro)\b/i],
];

function ferme(src, i) {
  let prof = 1, k = i;
  while (prof > 0) {
    const a = src.indexOf("<section", k), b = src.indexOf("</section>", k);
    if (b === -1) return -1;
    if (a !== -1 && a < b) { prof++; k = a + 8; continue; }
    prof--; k = b + 10;
  }
  return k;
}

function sections(src) {
  const out = [];
  let i = 0;
  for (;;) {
    const d = src.indexOf("<section", i);
    if (d === -1) return out;
    const f = ferme(src, d + 8);
    if (f === -1) return out;
    out.push(src.slice(d, f));
    i = f;
  }
}

function variablesCablees(src) {
  const noms = new Set();
  for (const m of src.matchAll(/(?:^|\s)(\w+)\s*=\s*(?:\/\*[^*]*\*\/\s*)?resolveList/g)) noms.add(m[1]);
  for (const m of src.matchAll(/(\w+)\s*=\s*\1_LIVE\(\)/g)) noms.add(m[1]);
  for (let t = 0; t < 3; t++) {
    for (const m of src.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*(\w+);/g)) if (noms.has(m[2])) noms.add(m[1]);
  }
  noms.delete("");
  return noms;
}

function famille(bloc) {
  const id = /\sid=["'`]([\w-]+)["'`]/.exec(bloc)?.[1] ?? "";
  const titres = [...bloc.matchAll(/<h[1-6][^>]*>([\s\S]{0,120}?)<\/h[1-6]>/g)]
    .map((m) => m[1].replace(/<[^>]*>/g, " ").replace(/\{[^}]*\}/g, " "))
    .join(" ");
  const texte = bloc.replace(/<[^>]*>/g, " ").replace(/\{[^}]*\}/g, " ").slice(0, 1200);
  for (const [nom, motif] of FAMILLES) if (motif.test(id)) return nom;
  for (const [nom, motif] of FAMILLES) if (motif.test(titres)) return nom;
  for (const [nom, motif] of FAMILLES) if (motif.test(texte)) return nom;
  return "(inclassée)";
}

// Niche de chaque thème, d'après la table du wizard.
const secteurs = fs.readFileSync(path.join(process.cwd(), "lib/templates/sectors.ts"), "utf8");
const nicheDe = {};
for (const m of secteurs.matchAll(/^\s*([\w_]+):\s*\[([^\]]*)\]/gm)) {
  for (const t of m[2].matchAll(/'(impact-[\w-]+)'/g)) nicheDe[t[1]] ??= m[1];
}

const parFamille = {};
const exemples = {};

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  const cablees = variablesCablees(src);
  for (const bloc of sections(src)) {
    if (ENTREE.test(bloc)) continue;
    if ([...cablees].some((n) => new RegExp(`[^\\w.]${n}\\b`).test(bloc))) continue;
    const f = famille(bloc);
    const niche = nicheDe[id] ?? "(hors table)";
    parFamille[f] ??= { total: 0, niches: {} };
    parFamille[f].total++;
    parFamille[f].niches[niche] = (parFamille[f].niches[niche] ?? 0) + 1;
    (exemples[f] ??= []).push(`${id} (${niche})`);
  }
}

if (listeDe) {
  console.log((exemples[listeDe] ?? []).join("\n"));
} else {
  console.log("famille          sections   niches les plus concernées");
  for (const [f, d] of Object.entries(parFamille).sort((a, b) => b[1].total - a[1].total)) {
    const top = Object.entries(d.niches).sort((a, b) => b[1] - a[1]).slice(0, 3)
      .map(([n, k]) => `${n}:${k}`).join(" ");
    console.log(`${f.padEnd(16)} ${String(d.total).padStart(5)}      ${top}`);
  }
}
