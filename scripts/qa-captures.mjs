/*
  Trier les trois cent soixante-treize captures pour savoir lesquelles regarder.

    node scripts/qa-captures.mjs

  On ne peut pas regarder sept cent quarante-six images l'une après l'autre avec
  la même attention. On classe donc d'abord ce qui se mesure sans jugement — un
  débordement de côté, une page trop courte, une section vide, un nom de
  démonstration resté — et l'on regarde ensuite celles qui ressortent.

  Les seuils viennent du corpus, pas d'une idée a priori : la médiane des
  hauteurs sert de repère, et l'on signale ce qui s'en écarte franchement.
*/
import fs from "node:fs";

const FICHES = JSON.parse(fs.readFileSync("/tmp/captures/fiches.json", "utf8"));
const CARTE = JSON.parse(fs.readFileSync("/tmp/marques-toutes.json", "utf8"));

const utiles = FICHES.filter((f) => f.texte);
const hauteurs = utiles.map((f) => f.hauteur).sort((a, b) => a - b);
const mediane = hauteurs[Math.floor(hauteurs.length / 2)];

const ANGLAIS = /(?<![A-Za-zÀ-ÖØ-öø-ÿ])(the|and|our|your|we|with|for|from|that|this|are|have|will|can|every|each|into|their|you|its|about|through|been|being)(?![A-Za-zÀ-ÖØ-öø-ÿ])/gi;
const LETTRE = /[A-Za-zÀ-ÖØ-öø-ÿ0-9]/;

function marqueRestee(fiche) {
  const demo = CARTE[fiche.theme];
  if (!demo || String(demo).length < 4) return false;
  const m = String(demo);
  if ((fiche.client ?? "").includes(m)) return false;
  let i = -1;
  while ((i = fiche.texte.indexOf(m, i + 1)) >= 0) {
    if (!LETTRE.test(fiche.texte[i - 1] ?? " ") && !LETTRE.test(fiche.texte[i + m.length] ?? " ")) return true;
  }
  return false;
}

const rapport = [];
for (const f of FICHES) {
  const motifs = [];
  if (f.erreur) motifs.push(`erreur : ${f.erreur}`);
  if (!f.texte) { rapport.push({ theme: f.theme, motifs: motifs.length ? motifs : ["aucun texte relevé"] }); continue; }
  if (f.deCote > 0) motifs.push(`déborde de ${f.deCote} px sur le côté`);
  if (f.hauteur < mediane * 0.35) motifs.push(`page courte : ${f.hauteur} px (médiane ${mediane})`);
  if (f.sections != null && f.sections < 3) motifs.push(`${f.sections} sections seulement`);
  if (marqueRestee(f)) motifs.push(`nom de la démonstration resté (${CARTE[f.theme]})`);

  const segs = f.texte.split(" | ").map((s) => s.trim()).filter(Boolean);
  const anglais = segs.filter((s) => {
    const mots = s.split(/\s+/).length;
    const n = (s.match(ANGLAIS) ?? []).length;
    return mots >= 3 && n / mots >= 0.2;
  });
  if (anglais.length >= 8) motifs.push(`${anglais.length} segments anglais`);
  if (segs.length < 30) motifs.push(`${segs.length} segments de texte seulement`);

  if (motifs.length) rapport.push({ theme: f.theme, motifs, apercu: anglais.slice(0, 2) });
}

console.log(`${utiles.length} pages mesurées · hauteur médiane ${mediane} px`);
console.log(`${rapport.length} pages à regarder\n`);
for (const r of rapport) {
  console.log(`${r.theme.padEnd(12)} ${r.motifs.join(" · ")}`);
  for (const a of r.apercu ?? []) console.log(`             « ${a.slice(0, 96)} »`);
}
fs.writeFileSync("/tmp/a-regarder.json", JSON.stringify(rapport.map((r) => r.theme)));
