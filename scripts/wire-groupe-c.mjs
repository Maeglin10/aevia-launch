// Les catalogues propres aux pages annexes : cours, formateurs, formules,
// équipes, soins, FAQ, avis, ateliers, studios, visites.
//
//   node scripts/wire-groupe-c.mjs            # essai
//   node scripts/wire-groupe-c.mjs --ecrire   # écrire
//
// Ces listes n'existent nulle part sur la page d'accueil : elles sont nées sur
// la page annexe, et aucun codemod ne peut deviner leur appariement. La table
// ci-dessous a été écrite à la main, liste par liste, après lecture des clés
// réelles — c'est la leçon des cinq resserrements de capabilities.ts : aucune
// heuristique n'y arrive, il faut regarder.
//
// Ce qui reste au thème, par décision : valeurs d'agence, méthodes, étapes,
// récompenses, articles de blog, navigation, spécifications techniques —
// l'identité du thème, pas la donnée du client.

import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");

/*
  `expr` reçoit la démonstration sous le nom DEMO. Règle des prix : ne montrer
  celui du client que s'il existe, sinon garder celui de la ligne de
  démonstration — c'est le comportement des pages d'accueil, accepté partout.
*/
const TABLE = [
  // ── L'école en ligne : ses cours, ses formateurs, ses formules ──
  ...["tarifs", "cours", "mentoring", "communaute"].flatMap((route) => [
    { f: `impact-11/${route}`, nom: "COURSES", fn: "clientServices",
      expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], title: s.title, price: s.price ?? DEMO[i % DEMO.length].price }))` },
    { f: `impact-11/${route}`, nom: "INSTRUCTORS", fn: "clientTeam",
      expr: `clientTeam(sessionData)?.map((m: any, i: number) => ({ ...DEMO[i % DEMO.length], name: m.name, specialty: m.role ?? DEMO[i % DEMO.length].specialty }))` },
    { f: `impact-11/${route}`, nom: "PLANS", fn: "clientServices",
      expr: `clientServices(sessionData)?.filter((s: any) => s.price).map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], name: s.title, price: s.price }))` },
  ]),
  // ── L'agence : son équipe, sa FAQ ──
  { f: "impact-27/studio", nom: "crew", fn: "clientTeam",
    expr: `clientTeam(sessionData)?.map((m: any, i: number) => ({ ...DEMO[i % DEMO.length], name: m.name, role: m.role ?? DEMO[i % DEMO.length].role }))` },
  { f: "impact-27/contact", nom: "FAQ", fn: "clientFaq",
    expr: `clientFaq(sessionData)?.map((x: any) => ({ q: x.q, a: x.a }))` },
  // ── Le cabinet : ses praticiens, ses soins ──
  { f: "impact-30/team", nom: "members", fn: "clientTeam",
    expr: `clientTeam(sessionData)?.map((m: any, i: number) => ({ ...DEMO[i % DEMO.length], name: m.name, role: m.role ?? DEMO[i % DEMO.length].role, initials: m.name.split(/\\s+/).map((p: string) => p[0] ?? "").join("").slice(0, 2).toUpperCase() }))` },
  { f: "impact-30/soins", nom: "specialties", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], title: s.title, details: s.desc || DEMO[i % DEMO.length].details, price: s.price ?? DEMO[i % DEMO.length].price }))` },
  // ── La sécurité : son équipe de garde, sa FAQ d'urgence ──
  { f: "impact-32/contact", nom: "GUARD_TEAM", fn: "clientTeam",
    expr: `clientTeam(sessionData)?.map((m: any, i: number) => ({ ...DEMO[i % DEMO.length], name: m.name, role: m.role ?? DEMO[i % DEMO.length].role, initials: m.name.split(/\\s+/).map((p: string) => p[0] ?? "").join("").slice(0, 2).toUpperCase() }))` },
  { f: "impact-32/contact", nom: "EMERGENCY_FAQ", fn: "clientFaq",
    expr: `clientFaq(sessionData)?.map((x: any) => ({ q: x.q, a: x.a }))` },
  // ── Le coworking : les avis de ses membres ──
  { f: "impact-35/community", nom: "TESTIMONIALS_DATA", fn: "clientReviews",
    expr: `clientReviews(sessionData)?.map((r: any, i: number) => ({ ...DEMO[i % DEMO.length], name: r.author ?? DEMO[i % DEMO.length].name, text: r.text }))` },
  // ── Le torréfacteur : ses ateliers, sa FAQ, ses avis ──
  { f: "impact-38/contact", nom: "SUBSCRIPTION_FAQ", fn: "clientFaq",
    expr: `clientFaq(sessionData)?.map((x: any) => ({ q: x.q, a: x.a }))` },
  { f: "impact-38/contact", nom: "WORKSHOP_CONTACT_OPTIONS", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], title: s.title, desc: s.desc || DEMO[i % DEMO.length].desc, price: s.price ?? DEMO[i % DEMO.length].price }))` },
  { f: "impact-38/abonnement", nom: "REVIEW_HIGHLIGHTS", fn: "clientReviews",
    expr: `clientReviews(sessionData)?.map((r: any, i: number) => ({ ...DEMO[i % DEMO.length], name: r.author ?? DEMO[i % DEMO.length].name, short: r.text, avatar: (r.author ?? "").split(/\\s+/).map((p: string) => p[0] ?? "").join("").slice(0, 2).toUpperCase() || DEMO[i % DEMO.length].avatar }))` },
  // ── Le label : ses prestations, ses studios ──
  { f: "impact-42/production", nom: "services", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], title: s.title, desc: s.desc || DEMO[i % DEMO.length].desc, pricing: s.price ?? DEMO[i % DEMO.length].pricing }))` },
  { f: "impact-42/studios", nom: "studioDetails", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], name: s.title, desc: s.desc || DEMO[i % DEMO.length].desc, rate: s.price ?? DEMO[i % DEMO.length].rate }))` },
  // ── Le domaine : ses visites guidées ──
  { f: "impact-56/visite", nom: "experiences", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], title: s.title, description: s.desc || DEMO[i % DEMO.length].description, price: s.price ?? DEMO[i % DEMO.length].price }))` },
];

function finDuTableau(src, depart) {
  let d = 0;
  for (let i = depart; i < src.length; i++) {
    const ch = src[i];
    if (ch === "[" || ch === "{" || ch === "(") d++;
    else if (ch === "]" || ch === "}" || ch === ")") { d--; if (d === 0) return i; }
    else if (ch === '"' || ch === "'" || ch === "`") {
      const q = ch; i++;
      while (i < src.length && src[i] !== q) i += src[i] === "\\" ? 2 : 1;
    }
  }
  return -1;
}

/* Regroupées par fichier : une seule réécriture des imports et du recalcul. */
const parFichier = {};
for (const e of TABLE) (parFichier[e.f] = parFichier[e.f] ?? []).push(e);

let totalListes = 0;
for (const [chemin, entrees] of Object.entries(parFichier)) {
  const fichier = path.join("app/templates", chemin, "page.tsx");
  let src = fs.readFileSync(fichier, "utf8");
  const faits = [];

  for (const e of entrees) {
    if (src.includes(`${e.nom}_LIVE`) || src.includes(`${e.nom}_DEMO_ANNEXE`)) { faits.push(e); continue; }
    const m = src.match(new RegExp(`(?:^|\\n)(\\s*)(?:const|let|var)\\s+${e.nom}\\s*(?::[^=\\n]+)?=\\s*\\[`));
    if (!m) { console.log(`ABSENTE : ${chemin} ${e.nom}`); continue; }
    const ouvre = src.indexOf("[", m.index + m[0].length - 1);
    const ferme = finDuTableau(src, ouvre);
    if (ferme < 0) { console.log(`ILLISIBLE : ${chemin} ${e.nom}`); continue; }

    const demo = src.slice(ouvre, ferme + 1);
    const nomDemo = `${e.nom}_DEMO_ANNEXE`;
    const expr = e.expr.replaceAll("DEMO", nomDemo);
    const indent = m[1];
    /*
      Deux habitats. Au niveau du module (pas d'indentation) : démonstration à
      l'import, _LIVE() recalculée à l'arrivée de la session. Dans le composant
      (indentée) : la déclaration se rejoue à chaque rendu, resolveList se pose
      directement — cinq listes vivaient là et le codemod les disait absentes.
    */
    const remplacement = indent
      ? `\n${indent}const ${nomDemo} = ${demo};\n`
        + `${indent}const ${e.nom} = resolveList(${expr}, ${nomDemo});\n`
      : `\nconst ${nomDemo} = ${demo};\n`
        + `function ${e.nom}_LIVE() {\n  return resolveList(${expr}, ${nomDemo});\n}\n`
        + `let ${e.nom} = ${nomDemo};\n`;
    src = src.slice(0, m.index + (src[m.index] === "\n" ? 1 : 0)) + remplacement.slice(1)
      + src.slice(ferme + 1).replace(/^;?/, "");
    e.module = !indent;
    faits.push(e);
  }
  if (!faits.length) continue;

  const dejaImporte = (nom) => new RegExp(`import\\s*\\{[^}]*\\b${nom}\\b[^}]*\\}`).test(src)
    || new RegExp(`^\\s+${nom},\\s*$`, "m").test(src);
  const lignes = [];
  if (!dejaImporte("resolveList")) lignes.push(`import { resolveList } from "@/lib/templates/resolveList";`);
  const fns = [...new Set(faits.map((f) => f.fn))].filter((fn) => !dejaImporte(fn));
  if (fns.length) lignes.push(`import { ${fns.join(", ")} } from "@/lib/templates/clientContent";`);
  if (lignes.length) {
    const apres = src.match(/^['"]use client['"];?\n/m);
    const at = apres ? apres.index + apres[0].length : 0;
    src = src.slice(0, at) + lignes.join("\n") + "\n" + src.slice(at);
  }

  const candidats = [
    src.match(/\n(\s*)c = \w+\?\.generatedContent;\n/),
    src.match(/\n(\s*)sessionData = \w+;\n/),
  ].filter(Boolean);
  const ancre = candidats.sort((a, b) => b.index - a.index)[0];
  const enModule = faits.filter((f) => f.module);
  if (!ancre && enModule.length) { console.log(`SANS ANCRE : ${chemin} — recalcul non posé`); continue; }
  const aRecalculer = enModule.filter((f) => !new RegExp(`^\\s+${f.nom} = ${f.nom}_LIVE\\(\\);`, "m").test(src));
  if (aRecalculer.length) {
    const recalcul = aRecalculer.map((f) => `${ancre[1]}${f.nom} = ${f.nom}_LIVE();`).join("\n");
    src = src.slice(0, ancre.index + ancre[0].length) + recalcul + "\n" + src.slice(ancre.index + ancre[0].length);
  }

  totalListes += faits.length;
  console.log(`${chemin} · ${faits.map((f) => `${f.nom}←${f.fn}`).join(" ")}`);
  if (ECRIRE) fs.writeFileSync(fichier, src);
}
console.log(`\n${Object.keys(parFichier).length} pages · ${totalListes} listes câblées`);
if (!ECRIRE) console.log("(essai — relancer avec --ecrire)");
