/*
  Les libellés du sélecteur de thèmes, contre les marques réelles.

    node scripts/libelles-du-selecteur.mjs [--ecrire]

  Le client choisit son thème sur une vignette légendée. impact-180 était
  légendé « Essential Salon · Rennes » — c'est un site de chauffagiste,
  « Thermotek Chauffage ». impact-186, « Dr. Léa Fontaine », cabinet dentaire,
  était légendé « ArchiTectura · Île-de-France ».

  La légende doit dire la marque que la page affiche vraiment ; la ville, elle,
  reste celle qui était écrite — c'est un décor, pas une donnée.
*/
import fs from "node:fs";

const ECRIRE = process.argv.includes("--ecrire");
let src = fs.readFileSync("lib/templates/sectors.ts", "utf8");

const marques = {};
for (const m of fs.readFileSync("lib/templates/marquesDemo.ts", "utf8")
  .matchAll(/"(impact-\d+)":\s*"((?:[^"\\]|\\.)*)"/g)) marques[m[1]] = m[2];

const nu = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

const faits = [];
src = src.replace(/^(\s*'(impact-[\w-]+)':\s*)(['"])((?:[^'"\\]|\\.)*)\3,/gm, (tout, tete, theme, q, legende) => {
  const vraie = marques[theme];
  if (!vraie) return tout;
  /*
    Un nom commun n'est pas une marque. Le nom du composant de certains thèmes
    est « Home » ou « Gaming » ; en tirer une légende donnerait « Home · Lille ».
    On exige au moins un mot qui distingue, sinon on laisse la légende écrite.
  */
  const COMMUNS = new Set(["home", "gaming", "page", "app", "main", "index", "studio", "design",
    "atelier", "maison", "agence", "cabinet", "group", "groupe", "clinic", "clinique", "shop", "store", "pro"]);
  const distinctifs = vraie.split(/[^A-Za-zÀ-ÿ0-9]+/)
    .filter((w) => w.length >= 4 && !COMMUNS.has(nu(w)) && !/^impact\d*$/i.test(w));
  if (!distinctifs.length) return tout;
  const [nom, ...suite] = legende.split(" · ");
  /*
    La légende dit-elle déjà la bonne marque ?

    Comparer les chaînes entières fait passer « Dr. Beaumont » pour autre chose
    que « Dr. Élodie Beaumont » — un prénom de plus, et l'on réécrit pour rien.
    Un mot commun d'au moins quatre lettres suffit à reconnaître la même marque.
  */
  const mots = (x) => new Set(nu(x.replace(/[·.]/g, " ")).length ? x.split(/[^A-Za-zÀ-ÿ0-9]+/).filter((w) => w.length >= 4).map(nu) : []);
  const a = mots(nom), b = mots(vraie);
  if ([...b].some((w) => a.has(w))) return tout;
  const neuve = [vraie, ...suite].join(" · ");
  faits.push(`${theme.padEnd(12)} « ${legende} »  →  « ${neuve} »`);
  return `${tete}${JSON.stringify(neuve)},`;
});

if (ECRIRE) fs.writeFileSync("lib/templates/sectors.ts", src);
faits.slice(0, 12).forEach((f) => console.log("  " + f));
console.log(`\n${faits.length} légendes corrigées${ECRIRE ? "" : " (simulation, --ecrire)"}`);
