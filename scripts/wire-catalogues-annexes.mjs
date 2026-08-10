// Les catalogues des pages annexes : voitures, montres, chambres, collections,
// espaces, destinations, événements, équipes, formules.
//
//   node scripts/wire-catalogues-annexes.mjs            # essai
//   node scripts/wire-catalogues-annexes.mjs --ecrire   # écrire
//
// Trouvées par qa-demo-residuelle.mjs, qui part de la page et non du code :
// on remplit tout ce que le formulaire propose, et l'on relève ce que la
// démonstration continue d'afficher. 59 listes ont survécu à un profil complet.
//
// Toutes ne sont pas au client. Restent au thème, par décision : les étapes
// d'une méthode, les valeurs d'une maison, les jalons d'une histoire, les
// signaux de confiance, les options de mouture d'un torréfacteur. Ce sont des
// choix de rédaction du modèle, pas des données qu'un client saisit.
//
// Sont au client : ce qu'il vend, qui il est, ce qu'il propose.

import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");

const TABLE = [
  // ── Ce que le client vend ──
  { f: "impact-03/boutique", nom: "COLLECTION", fn: "clientProducts",
    expr: `clientProducts(sessionData)?.map((p: any, i: number) => ({ ...DEMO[i % DEMO.length], name: p.name, price: p.price ?? DEMO[i % DEMO.length].price, desc: p.description ?? p.desc ?? DEMO[i % DEMO.length].desc }))` },
  { f: "impact-20/collections", nom: "PRODUCTS", fn: "clientProducts",
    expr: `clientProducts(sessionData)?.map((p: any, i: number) => ({ ...DEMO[i % DEMO.length], name: p.name, price: p.price ?? DEMO[i % DEMO.length].price }))` },
  { f: "impact-12/collections", nom: "collectionsList", fn: "clientProducts",
    expr: `clientProducts(sessionData)?.map((p: any, i: number) => ({ ...DEMO[i % DEMO.length], name: p.name, desc: p.description ?? p.desc ?? DEMO[i % DEMO.length].desc }))` },
  { f: "impact-13/montres", nom: "watchModels", fn: "clientProducts",
    expr: `clientProducts(sessionData)?.map((p: any, i: number) => ({ ...DEMO[i % DEMO.length], name: p.name, price: p.price ?? DEMO[i % DEMO.length].price }))` },
  { f: "impact-65/materials", nom: "materialsList", fn: "clientProducts",
    expr: `clientProducts(sessionData)?.map((p: any, i: number) => ({ ...DEMO[i % DEMO.length], name: p.name, desc: p.description ?? p.desc ?? DEMO[i % DEMO.length].desc }))` },
  ...["fleet", "engineering"].map((r) => ({ f: `impact-08/${r}`, nom: "FLEET", fn: "clientProducts",
    expr: `clientProducts(sessionData)?.map((p: any, i: number) => ({ ...DEMO[i % DEMO.length], name: p.name, desc: p.description ?? p.desc ?? DEMO[i % DEMO.length].desc }))` })),
  { f: "impact-40/menu", nom: "menus", fn: "clientMenu",
    expr: `clientMenu(sessionData)?.map((m: any, i: number) => ({ ...DEMO[i % DEMO.length], name: m.name, price: m.price ?? DEMO[i % DEMO.length].price }))` },

  // ── Ce qu'il propose ──
  { f: "impact-10/chambres", nom: "ROOMS_FULL", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], name: s.title, desc: s.desc || DEMO[i % DEMO.length].desc, price: s.price ?? DEMO[i % DEMO.length].price }))` },
  { f: "impact-35/spaces", nom: "SPACES_DATA", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], name: s.title, tagline: s.desc || DEMO[i % DEMO.length].tagline }))` },
  { f: "impact-32/services", nom: "SPECIALTIES_DETAIL", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], title: s.title, summary: s.desc || DEMO[i % DEMO.length].summary, price: s.price ?? DEMO[i % DEMO.length].price }))` },
  { f: "impact-34/features", nom: "DETAIL_FEATURES", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], title: s.title, desc: s.desc || DEMO[i % DEMO.length].desc }))` },
  { f: "impact-09/manifest", nom: "MISSIONS", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], name: s.title, desc: s.desc || DEMO[i % DEMO.length].desc }))` },
  { f: "impact-36/sectors", nom: "SECTORS_DETAIL", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], name: s.title, desc: s.desc || DEMO[i % DEMO.length].desc }))` },
  { f: "impact-65/research", nom: "sectors", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], title: s.title, desc: s.desc || DEMO[i % DEMO.length].desc }))` },
  { f: "impact-14/destinations", nom: "ALL_DESTINATIONS", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], name: s.title, desc: s.desc || DEMO[i % DEMO.length].desc }))` },
  { f: "impact-14/experience", nom: "experiences", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], title: s.title, desc: s.desc || DEMO[i % DEMO.length].desc }))` },
  { f: "impact-01/work", nom: "PROJECTS", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], title: s.title }))` },

  // ── Ses formules ──
  { f: "impact-35/pricing", nom: "plans", fn: "clientServices",
    expr: `clientServices(sessionData)?.filter((s: any) => s.price).map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], name: s.title, price: s.price }))` },
  { f: "impact-21/contact", nom: "pricingTiers", fn: "clientServices",
    expr: `clientServices(sessionData)?.filter((s: any) => s.price).map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], name: s.title, price: s.price, desc: s.desc || DEMO[i % DEMO.length].desc }))` },

  // ── Qui il est ──
  { f: "impact-17/equipe", nom: "team", fn: "clientTeam",
    expr: `clientTeam(sessionData)?.map((m: any, i: number) => ({ ...DEMO[i % DEMO.length], name: m.name, role: m.role ?? DEMO[i % DEMO.length].role }))` },
  { f: "impact-19/equipe", nom: "team", fn: "clientTeam",
    expr: `clientTeam(sessionData)?.map((m: any, i: number) => ({ ...DEMO[i % DEMO.length], name: m.name, role: m.role ?? DEMO[i % DEMO.length].role }))` },
  { f: "impact-42/artistes", nom: "artistRoster", fn: "clientTeam",
    expr: `clientTeam(sessionData)?.map((m: any, i: number) => ({ ...DEMO[i % DEMO.length], name: m.name }))` },
  { f: "impact-35/community", nom: "MEMBERS_DATA", fn: "clientTeam",
    expr: `clientTeam(sessionData)?.map((m: any, i: number) => ({ ...DEMO[i % DEMO.length], name: m.name }))` },

  // ── Ce qu'il organise : les événements, la billetterie ──
  { f: "impact-35/community", nom: "EVENTS_DATA", fn: "clientServices",
    expr: `clientServices(sessionData)?.map((s: any, i: number) => ({ ...DEMO[i % DEMO.length], title: s.title, desc: s.desc || DEMO[i % DEMO.length].desc }))` },

  // ── Ses distinctions ──
  ...[["impact-16/propos", "AWARDS"], ["impact-57/studio", "AWARDS"],
      ["impact-21/studio", "awards"], ["impact-27/studio", "awards"]].map(([f, nom]) => ({
    f, nom, fn: "clientCertifications",
    expr: `clientCertifications(sessionData)?.map((x: any, i: number) => ({ ...DEMO[i % DEMO.length], title: typeof x === "string" ? x : (x.name ?? x.title) }))` })),
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

const parFichier = {};
for (const e of TABLE) (parFichier[e.f] = parFichier[e.f] ?? []).push(e);

let total = 0;
for (const [chemin, entrees] of Object.entries(parFichier)) {
  const fichier = path.join("app/templates", chemin, "page.tsx");
  if (!fs.existsSync(fichier)) { console.log(`ABSENT : ${chemin}`); continue; }
  let src = fs.readFileSync(fichier, "utf8");
  const faits = [];

  for (const e of entrees) {
    if (src.includes(`${e.nom}_DEMO_ANNEXE`)) { faits.push(e); continue; }
    /*
      L'indentation se lit en espaces et tabulations seulement : `\s` englobe
      le retour à la ligne, si bien qu'une ligne vide avant la déclaration
      passait pour une indentation. La liste était alors traitée comme locale à
      un composant, donc figée à l'import — et affichait la démonstration quoi
      que le client saisisse.
    */
    const m = src.match(new RegExp(`(?:^|\\n)([ \\t]*)(?:const|let|var)\\s+${e.nom}\\s*(?::[^=\\n]+)?=\\s*\\[`));
    if (!m) { console.log(`ABSENTE : ${chemin} ${e.nom}`); continue; }
    const ouvre = src.indexOf("[", m.index + m[0].length - 1);
    const ferme = finDuTableau(src, ouvre);
    if (ferme < 0) { console.log(`ILLISIBLE : ${chemin} ${e.nom}`); continue; }

    const demo = src.slice(ouvre, ferme + 1);
    const nomDemo = `${e.nom}_DEMO_ANNEXE`;
    const expr = e.expr.replaceAll("DEMO", nomDemo);
    const indent = m[1];
    /*
      Deux habitats, comme pour le groupe C : au niveau du module, la liste est
      figée à l'import et doit être recalculée dans le composant ; déclarée dans
      un composant, elle se rejoue à chaque rendu et resolveList s'y pose
      directement.
    */
    const remplacement = indent
      ? `\n${indent}const ${nomDemo} = ${demo};\n${indent}const ${e.nom} = resolveList(${expr}, ${nomDemo});\n`
      : `\nconst ${nomDemo} = ${demo};\nfunction ${e.nom}_LIVE() {\n  return resolveList(${expr}, ${nomDemo});\n}\nlet ${e.nom} = ${nomDemo};\n`;
    src = src.slice(0, m.index + (src[m.index] === "\n" ? 1 : 0)) + remplacement.slice(1)
      + src.slice(ferme + 1).replace(/^;?/, "");
    e.module = !indent;
    faits.push(e);
  }
  if (!faits.length) continue;

  const dejaLa = (nom) => new RegExp(`import\\s*\\{[^}]*\\b${nom}\\b[^}]*\\}`, "s").test(src)
    || new RegExp(`^\\s+${nom},\\s*$`, "m").test(src);
  const lignes = [];
  if (!dejaLa("resolveList")) lignes.push(`import { resolveList } from "@/lib/templates/resolveList";`);
  const fns = [...new Set(faits.map((f) => f.fn))].filter((fn) => !dejaLa(fn));
  if (fns.length) lignes.push(`import { ${fns.join(", ")} } from "@/lib/templates/clientContent";`);
  if (lignes.length) {
    const apres = src.match(/^['"]use client['"];?\n/m);
    const at = apres ? apres.index + apres[0].length : 0;
    src = src.slice(0, at) + lignes.join("\n") + "\n" + src.slice(at);
  }

  const enModule = faits.filter((f) => f.module);
  if (enModule.length) {
    const candidats = [
      src.match(/\n(\s*)c = \w+\?\.generatedContent;\n/),
      src.match(/\n(\s*)sessionData = \w+;\n/),
    ].filter(Boolean);
    const ancre = candidats.sort((a, b) => b.index - a.index)[0];
    if (!ancre) { console.log(`SANS ANCRE : ${chemin}`); continue; }
    const aPoser = enModule.filter((f) => !new RegExp(`^\\s+${f.nom} = ${f.nom}_LIVE\\(\\);`, "m").test(src));
    if (aPoser.length) {
      const recalcul = aPoser.map((f) => `${ancre[1]}${f.nom} = ${f.nom}_LIVE();`).join("\n");
      src = src.slice(0, ancre.index + ancre[0].length) + recalcul + "\n" + src.slice(ancre.index + ancre[0].length);
    }
  }

  total += faits.length;
  console.log(`${chemin} · ${faits.map((f) => `${f.nom}←${f.fn}`).join(" ")}`);
  if (ECRIRE) fs.writeFileSync(fichier, src);
}
console.log(`\n${Object.keys(parFichier).length} pages · ${total} catalogues câblés`);
if (!ECRIRE) console.log("(essai — relancer avec --ecrire)");
