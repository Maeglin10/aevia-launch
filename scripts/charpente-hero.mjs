/*
  La charpente du héros — quelle COMPOSITION chaque thème emploie en haut de page.

  On ne compte pas des ornements (filet, sur-titre) : ils ne changent rien à
  l'œil. On relève la disposition : combien de colonnes, où vit l'image, où
  vit le texte, la page est-elle centrée ou alignée à gauche.

  Bornes du héros : de la ligne du commentaire « ── HERO » (ou du premier
  <section> plein écran) jusqu'à la première ligne valant exactement
  « </section> » à l'indentation de six espaces.

    node scripts/charpente-hero.mjs 329 383
*/
import fs from "node:fs";

const [debutArg, finArg] = process.argv.slice(2);
const min = Number(debutArg ?? 0), max = Number(finArg ?? 9999);

const num = (t) => Number(t.slice(7));
const themes = fs
  .readdirSync("app/templates")
  .filter((d) => /^impact-\d+$/.test(d))
  .sort((a, b) => num(a) - num(b))
  .filter((t) => num(t) >= min && num(t) <= max);

export function bornesHero(lignes) {
  let debut = lignes.findIndex((l) => /── HERO|══ HERO|── Hero/i.test(l));
  if (debut < 0) {
    debut = lignes.findIndex((l, k) => /<section/.test(l) && lignes.slice(k, k + 6).join(" ").match(/100dvh|100vh|minHeight/));
  }
  if (debut < 0) return null;
  const fin = lignes.findIndex((l, k) => k > debut && /^ {6}<\/section>\s*$/.test(l));
  return fin < 0 ? null : [debut, fin];
}

function charpente(t) {
  const p = `app/templates/${t}/page.tsx`;
  if (!fs.existsSync(p)) return null;
  const lignes = fs.readFileSync(p, "utf8").split("\n");
  const b = bornesHero(lignes);
  if (!b) return { theme: t, err: "bornes introuvables" };
  const s = lignes.slice(b[0], b[1] + 1).join("\n");

  /* Une grille à deux pistes : « 1fr 1fr », « 1.05fr 0.95fr », « repeat(2 ». */
  const grille2 = /gridTemplateColumns:\s*["'`][^"'`]*\b(0?\.?\d+(\.\d+)?fr\s+0?\.?\d+(\.\d+)?fr|repeat\(2)/.test(s);
  const nbImg = (s.match(/<img\b/g) ?? []).length;
  /* Image posée en fond, qui remplit le cadre. */
  const pleinCadre = /<img[^>]*|[\s\S]{0,400}?position:\s*["']absolute["'][\s\S]{0,200}?inset:\s*0/.test(s)
    && /objectFit:\s*["']cover["']/.test(s)
    && /position:\s*["']absolute["'][^}]{0,160}inset:\s*0/.test(s);
  const centre = /textAlign:\s*["']center["']/.test(s);
  const italique = /fontStyle:\s*["']italic["']/.test(s);
  const fraction = /SlideIndex|padStart\(2, ?["']0["']\)/.test(s);
  const kicker = /<Kicker\b/.test(s);
  const flexColonne = /flexDirection:\s*["']column["']/.test(s);
  const aspect = (s.match(/aspectRatio:\s*["'`]([^"'`]+)["'`]/) ?? [])[1] ?? "";

  return {
    theme: t, l: `${b[0] + 1}-${b[1] + 1}`, lignes: b[1] - b[0] + 1,
    grille2, img: nbImg, pleinCadre, centre, italique, fraction, kicker, flexColonne, aspect,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const rows = themes.map(charpente).filter(Boolean);
  const oui = (v) => (v ? "×" : "·");
  console.log("thème        lignes  2col  img  plein  centré  ital  frac  kick  colonne  ratio");
  for (const r of rows) {
    if (r.err) { console.log(`${r.theme.padEnd(12)} ${r.err}`); continue; }
    console.log(
      `${r.theme.padEnd(12)} ${String(r.lignes).padStart(4)}    ${oui(r.grille2)}   ${String(r.img).padStart(2)}    ${oui(r.pleinCadre)}     ${oui(r.centre)}    ${oui(r.italique)}    ${oui(r.fraction)}    ${oui(r.kicker)}     ${oui(r.flexColonne)}     ${r.aspect}`,
    );
  }
  const n = rows.filter((r) => !r.err).length;
  const pc = (f) => `${Math.round((rows.filter((r) => !r.err && f(r)).length / n) * 100)} %`;
  console.log(`\n${n} thèmes lus — 2 colonnes ${pc((r) => r.grille2)} · italique ${pc((r) => r.italique)} · fraction ${pc((r) => r.fraction)} · Kicker ${pc((r) => r.kicker)}`);
}
