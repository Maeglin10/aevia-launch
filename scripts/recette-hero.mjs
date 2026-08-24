/*
  La recette du héros — ce qui donne à une page son premier coup d'œil.

  Les identifiants de section disaient que les thèmes récents étaient tous
  différents ; l'écran dit le contraire. C'est que la ressemblance n'est pas
  dans la liste des sections mais dans la composition du haut de page, la
  seule partie qu'un visiteur voit avant de juger.

  Six marqueurs, relevés dans la source :
    filet      — le trait horizontal court avant le sur-titre
    surtitre   — « MÉTIER · VILLE » en capitales espacées
    italique   — la seconde ligne du titre en italique d'une autre couleur
    duo        — un bouton plein suivi d'un bouton contour
    index      — la fraction « 01 / 03 » d'un carrousel
    colonne    — le titre à gauche, une image ou des cartes à droite
*/
import fs from "node:fs";

const num = (t) => Number(t.slice(7));
const themes = fs.readdirSync("app/templates").filter((d) => /^impact-\d+$/.test(d)).sort((a, b) => num(a) - num(b));

function recette(t) {
  const p = `app/templates/${t}/page.tsx`;
  if (!fs.existsSync(p)) return null;
  const tout = fs.readFileSync(p, "utf8");
  /*
    On ne juge que le haut de page.

    La première version lisait le fichier entier : un thème dont le héros ne
    porte plus d'italique restait compté comme italique à cause d'une citation
    en bas de page. La jauge annonçait 100 % même après correction.
  */
  /* Le héros se repère à sa hauteur d'écran, ou à défaut au premier <section>
     qui suit l'en-tête. Se caler sur le premier <section> tout court prenait
     la barre de navigation et rendait la jauge muette. */
  let debut = tout.search(/<section[^>]*(100dvh|100vh|minHeight)/);
  if (debut < 0) debut = tout.search(/── HERO|── Hero/);
  if (debut < 0) debut = Math.max(0, tout.search(/<section/));
  const suite = tout.indexOf("</section>", debut);
  const s = suite > 0 ? tout.slice(debut, suite) : tout;
  return {
    theme: t,
    filet:    /width:\s*\d{2,3},?\s*height:\s*[12]\b|h-px w-\d|width:\s*["']?\d{2}px["']?,\s*height:\s*["']?1px/.test(s),
    surtitre: /letterSpacing[^}]{0,40}(0\.[12]\d|[12]\d?px)[\s\S]{0,400}·|·\s*\{?\s*client(City|Ville)/.test(s),
    italique: /fontStyle:\s*["']italic["']/.test(s),
    duo:      /(border:\s*["'`]1px solid|borderColor)[\s\S]{0,600}(background:\s*(C\.|accent|ACCENT))|Nos\s|Voir nos/.test(s) && (s.match(/<button|<a[^>]*className="[^"]*(px-|py-)/g) ?? []).length >= 2,
    index:    /0?1\s*\{?\s*\/?\s*\}?\s*<|\/\s*0?3|String\(i\s*\+\s*1\)\.padStart\(2/.test(s) && /padStart\(2, ?["']0["']\)/.test(s),
    colonne:  /grid[^"'`]{0,40}(1fr 1fr|repeat\(2)|lg:grid-cols-2|gridTemplateColumns:\s*["'`]1\.?\d*fr/.test(s),
  };
}

const rs = themes.map(recette).filter(Boolean);
const score = (r) => ["filet","surtitre","italique","duo","index","colonne"].filter((k) => r[k]).length;

const recents = rs.filter((r) => num(r.theme) >= 328);
const anciens = rs.filter((r) => num(r.theme) < 326);
const moy = (g) => (g.reduce((s, r) => s + score(r), 0) / g.length).toFixed(2);

console.log(`recette moyenne — récents ≥328 : ${moy(recents)}/6 · anciens <326 : ${moy(anciens)}/6\n`);
for (const k of ["filet","surtitre","italique","duo","index","colonne"]) {
  const pr = (recents.filter((r) => r[k]).length / recents.length * 100).toFixed(0);
  const pa = (anciens.filter((r) => r[k]).length / anciens.length * 100).toFixed(0);
  console.log(`  ${k.padEnd(9)} récents ${String(pr).padStart(3)} %   anciens ${String(pa).padStart(3)} %`);
}
const clones = recents.filter((r) => score(r) >= 4);
console.log(`\n${clones.length}/${recents.length} thèmes récents cumulent au moins 4 marqueurs sur 6 :`);
console.log("  " + clones.map((r) => r.theme.slice(7)).join(", "));
fs.writeFileSync("/tmp/recette.json", JSON.stringify(rs, null, 1));
