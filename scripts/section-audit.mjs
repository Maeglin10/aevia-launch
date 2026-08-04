// Recense les sections qui ne lisent rien du client.
//
//   node scripts/section-audit.mjs [--csv]
//
// Les balayages précédents mesuraient une poignée de valeurs témoins — le nom,
// la ville, les prestations, les avis. Ils ne disent rien d'une section entière
// que le client ne peut pas toucher : une galerie, un manifeste, une frise de
// méthode, un bloc « nos engagements » écrit en dur.
//
// Ici on découpe chaque page à la balise `<section>` et on demande, pour
// chacune : y a-t-il un seul endroit où la donnée du client peut entrer ? Un
// appel au contrat, une lecture de `fd`, `bp` ou `c`, une photo du client.
//
// Une section sans aucune de ces entrées est un cul-de-sac : le client la voit
// sur son site, elle parle d'une autre entreprise, et rien dans le wizard ne
// permet de la changer.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const csv = process.argv.includes("--csv");

const ENTREE =
  /client(?:Services|Reviews|Stats|Faq|Team|Areas|Certifications|Name|City|Tagline|Address|Photos|LegalForm)\s*\(|\bfd\??\.|\bbp\??\.|\bc\??\.[a-z]|__layoutSession|sessionData/;

/*
  Une section rend souvent une variable câblée ailleurs — `{SERVICES.map(…)}`,
  où `SERVICES` reçoit sa valeur d'un `resolveList(clientServices(…), …)` cinq
  cents lignes plus haut. Chercher l'appel au contrat dans la section elle-même
  conclurait à tort qu'elle est muette. On relève donc d'abord les variables
  alimentées par le client dans le fichier, puis on regarde si la section en cite
  une.
*/
function variablesCablees(src) {
  const noms = new Set();
  for (const m of src.matchAll(/(?:^|\s)(\w+)\s*=\s*(?:\/\*[^*]*\*\/\s*)?resolveList/g)) noms.add(m[1]);
  for (const m of src.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*(?:\/\*[^*]*\*\/\s*)?resolveList/g)) noms.add(m[1]);
  for (const m of src.matchAll(/(\w+)\s*=\s*\1_LIVE\(\)/g)) noms.add(m[1]);
  for (const m of src.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*\w+_LIVE\(\)/g)) noms.add(m[1]);
  // Une variable qui recopie une variable câblée l'est aussi.
  for (let tour = 0; tour < 3; tour++) {
    for (const m of src.matchAll(/(?:const|let|var)\s+(\w+)\s*=\s*(\w+);/g)) {
      if (noms.has(m[2])) noms.add(m[1]);
    }
    for (const m of src.matchAll(/(?:^|\s)(\w+)\s*=\s*(\w+)\.map\(/g)) {
      if (noms.has(m[2])) noms.add(m[1]);
    }
  }
  noms.delete("");
  return noms;
}

// Le titre d'une section : son `id`, sinon son premier titre.
function etiquette(bloc) {
  const id = /\sid=["'`]([\w-]+)["'`]/.exec(bloc);
  if (id) return id[1];
  const h = /<h[1-6][^>]*>([\s\S]{0,80}?)<\/h[1-6]>/.exec(bloc);
  if (h) return h[1].replace(/<[^>]*>/g, "").replace(/\{[^}]*\}/g, "").replace(/\s+/g, " ").trim().slice(0, 40) || "(sans titre)";
  return "(sans titre)";
}

function sections(src) {
  const out = [];
  const re = /<section\b/g;
  let m;
  while ((m = re.exec(src))) {
    // Fin de la section : la balise fermante correspondante.
    let prof = 1, k = m.index + 8;
    const ouvre = /<section\b/g, ferme = /<\/section>/g;
    while (prof > 0) {
      ouvre.lastIndex = k; ferme.lastIndex = k;
      const a = ouvre.exec(src), b = ferme.exec(src);
      if (!b) return out;
      if (a && a.index < b.index) { prof++; k = a.index + 8; continue; }
      prof--; k = b.index + 10;
    }
    out.push({ deb: m.index, fin: k, bloc: src.slice(m.index, k) });
    re.lastIndex = k;
  }
  return out;
}

let total = 0, mortes = 0;
const parTheme = [];
const parEtiquette = {};

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  const src = fs.readFileSync(file, "utf8");
  const liste = sections(src);
  const cablees = variablesCablees(src);
  const citeUneCablee = (bloc) =>
    [...cablees].some((n) => new RegExp(`[^\\w.]${n}\\b`).test(bloc));
  const sansEntree = [];
  for (const s of liste) {
    total++;
    if (!ENTREE.test(s.bloc) && !citeUneCablee(s.bloc)) {
      mortes++;
      const e = etiquette(s.bloc);
      sansEntree.push(e);
      parEtiquette[e] = (parEtiquette[e] ?? 0) + 1;
    }
  }
  if (sansEntree.length) parTheme.push({ id, n: sansEntree.length, sur: liste.length, quoi: sansEntree });
}

if (csv) {
  for (const t of parTheme) console.log(`${t.id},${t.n},${t.sur},"${t.quoi.join(" | ")}"`);
} else {
  console.log(`${total} sections mesurées, ${mortes} sans aucune entrée client (${Math.round((mortes / total) * 100)} %)`);
  console.log(`${parTheme.length} thèmes sur 373 ont au moins une section muette\n`);
  console.log("les étiquettes les plus fréquentes :");
  for (const [e, n] of Object.entries(parEtiquette).sort((a, b) => b[1] - a[1]).slice(0, 25)) {
    console.log(`${String(n).padStart(4)} ${e}`);
  }
  console.log("\nles thèmes les plus touchés :");
  for (const t of parTheme.sort((a, b) => b.n - a.n).slice(0, 12)) {
    console.log(`${String(t.n).padStart(3)}/${t.sur}  ${t.id}  ${t.quoi.slice(0, 5).join(", ")}`);
  }
}
