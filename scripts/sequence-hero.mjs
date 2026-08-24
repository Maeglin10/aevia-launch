/*
  La séquence du héros — dans quel ORDRE les blocs se succèdent en haut de page.

  Deux thèmes peuvent avoir des couleurs, des polices et des ornements
  différents et rester jumeaux à l'œil : c'est l'ordre et la place des blocs
  qui font la première impression. On relève donc, dans les bornes du héros,
  la suite des rôles rencontrés :

    surtitre  un texte court en capitales très espacées
    titre     le <h1> (ou le conteneur du titre animé)
    para      le paragraphe d'accroche
    duo       deux liens d'action côte à côte
    solo      un seul lien d'action
    meta      la rangée « 01/03 · mot-clé · flèches »
    image     une <img>
    cartes    une grille de cartes/statistiques

  Puis la disposition du conteneur : « colonne » (flex column),
  « grille-2 », « plein-cadre » (image en fond), « centré ».

    node scripts/sequence-hero.mjs 329 383
*/
import fs from "node:fs";

const num = (t) => Number(t.slice(7));
const [a, b] = process.argv.slice(2);
const min = Number(a ?? 0), max = Number(b ?? 9999);

const themes = fs
  .readdirSync("app/templates")
  .filter((d) => /^impact-\d+$/.test(d))
  .sort((x, y) => num(x) - num(y))
  .filter((t) => num(t) >= min && num(t) <= max);

function bornes(L) {
  let d = L.findIndex((l) => /── HERO|══ HERO|── Hero/i.test(l));
  if (d < 0) d = L.findIndex((l, k) => /<section/.test(l) && /100dvh|100vh/.test(L.slice(k, k + 4).join(" ")));
  if (d < 0) return null;
  const f = L.findIndex((l, k) => k > d && /^ {6}<\/section>\s*$/.test(l));
  return f < 0 ? null : [d, f];
}

/** Les rôles, dans l'ordre où le code les pose. */
function sequence(src) {
  const out = [];
  const lignes = src.split("\n");
  for (let k = 0; k < lignes.length; k++) {
    const l = lignes[k];
    const fenetre = lignes.slice(k, k + 3).join(" ");
    if (/<h1\b/.test(l)) out.push("titre");
    else if (/letterSpacing:\s*["']?(4|0\.[23]\d?em|3px|[3-6]px)/.test(l) && /textTransform:\s*["']uppercase["']/.test(l) && !/fontSize:\s*1[5-9]/.test(l)) out.push("surtitre");
    else if (/<Kicker\b/.test(l)) out.push("surtitre");
    else if (/<p\b/.test(l) && /maxWidth:\s*(4[5-9]\d|5\d\d|6\d\d)/.test(fenetre)) out.push("para");
    else if (/<img\b/.test(l)) out.push("image");
    else if (/SlideIndex|HairlineArrows/.test(l)) out.push("meta");
    else if (/href=\{telHref\}|href="#(services|contact)"/.test(l)) out.push("lien");
  }
  /* Deux liens consécutifs = le duo plein + contour. */
  const compact = [];
  for (const r of out) {
    if (r === "meta" && compact[compact.length - 1] === "meta") continue;
    if (r === "lien" && compact[compact.length - 1] === "lien") { compact[compact.length - 1] = "duo"; continue; }
    if (r === "lien" && compact[compact.length - 1] === "duo") continue;
    if (r === "titre" && compact[compact.length - 1] === "titre") continue;
    compact.push(r);
  }
  return compact.map((r) => (r === "lien" ? "solo" : r));
}

function disposition(src) {
  const t = [];
  if (/gridTemplateColumns:\s*["'`][^"'`]*\b(0?\.?\d+(\.\d+)?fr\s+0?\.?\d+(\.\d+)?fr|repeat\(2)/.test(src)) t.push("grille-2");
  if (/flexDirection:\s*["']column["']/.test(src)) t.push("colonne");
  if (/objectFit:\s*["']cover["']/.test(src) && /position:\s*["']absolute["'][^}]{0,200}inset:\s*0/.test(src)) t.push("plein-cadre");
  if (/textAlign:\s*["']center["']/.test(src)) t.push("centré");
  return t.length ? t.join("+") : "libre";
}

const lignesSortie = [];
const empreintes = new Map();
for (const t of themes) {
  const p = `app/templates/${t}/page.tsx`;
  if (!fs.existsSync(p)) continue;
  const L = fs.readFileSync(p, "utf8").split("\n");
  const bb = bornes(L);
  if (!bb) { lignesSortie.push([t, "?", "bornes introuvables"]); continue; }
  const src = L.slice(bb[0], bb[1] + 1).join("\n");
  const seq = sequence(src).join(" ");
  const disp = disposition(src);
  const emp = `${disp} | ${seq}`;
  empreintes.set(emp, (empreintes.get(emp) ?? 0) + 1);
  lignesSortie.push([t, disp, seq]);
}

for (const [t, d, s] of lignesSortie) console.log(`${t.padEnd(12)} ${d.padEnd(22)} ${s}`);

console.log("\n── empreintes partagées par au moins deux thèmes ──");
for (const [emp, n] of [...empreintes].sort((x, y) => y[1] - x[1])) {
  if (n < 2) continue;
  console.log(`  ${String(n).padStart(2)} × ${emp}`);
}
const dupes = [...empreintes.values()].filter((n) => n >= 2).reduce((s, n) => s + n, 0);
console.log(`\n${dupes} thèmes sur ${lignesSortie.length} partagent leur composition avec un autre.`);
