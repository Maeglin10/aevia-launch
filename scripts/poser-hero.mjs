/*
  Poser un nouveau héros à la place de l'ancien — par LIGNES, jamais par motif.

  Une expression régulière non gourmande sur « \n} » s'arrête au « }: { » du
  typage : elle laisse un résidu et casse le fichier. Deux thèmes y sont
  passés. Ici on ne cherche aucun motif dans le corps : on repère la ligne du
  commentaire « ── HERO » et la première ligne valant exactement
  « </section> » à six espaces d'indentation, et on remplace l'intervalle.

    node scripts/poser-hero.mjs 329 /tmp/hero-329.txt
    node scripts/poser-hero.mjs 329 /tmp/hero-329.txt --voir   (montre sans écrire)

  Le fichier passé remplace tout l'intervalle, commentaire de tête compris :
  il doit donc porter lui-même son « {/* ── HERO … *​/} » et son <section>.
*/
import fs from "node:fs";

const [nArg, blocPath, ...opts] = process.argv.slice(2);
if (!nArg || !blocPath) { console.error("usage : node scripts/poser-hero.mjs 329 /tmp/hero-329.txt [--voir]"); process.exit(1); }

const id = `impact-${String(nArg).replace(/^impact-/, "")}`;
const cible = `app/templates/${id}/page.tsx`;
if (!fs.existsSync(cible)) { console.error(`introuvable : ${cible}`); process.exit(1); }

const L = fs.readFileSync(cible, "utf8").split("\n");

const debut = L.findIndex((l) => /── HERO|══ HERO|── Hero/i.test(l));
if (debut < 0) { console.error(`${id} : pas de commentaire « ── HERO » — bornes à poser à la main`); process.exit(1); }
const fin = L.findIndex((l, k) => k > debut && /^ {6}<\/section>\s*$/.test(l));
if (fin < 0) { console.error(`${id} : pas de « </section> » à six espaces après la ligne ${debut + 1}`); process.exit(1); }

/* Garde-fou : un héros de moins de dix lignes ou de plus de trois cents
   signifie que les bornes ont glissé. On refuse plutôt que d'abîmer. */
const taille = fin - debut + 1;
if (taille < 10 || taille > 300) { console.error(`${id} : bornes suspectes (${debut + 1}-${fin + 1}, ${taille} lignes) — vérifier à la main`); process.exit(1); }

const nouveau = fs.readFileSync(blocPath, "utf8").replace(/\n+$/, "").split("\n");

if (opts.includes("--voir")) {
  console.log(`${id} : remplacerait les lignes ${debut + 1}-${fin + 1} (${taille} lignes) par ${nouveau.length} lignes`);
  console.log("── ancien, premières et dernières lignes ──");
  console.log(L.slice(debut, debut + 3).join("\n"));
  console.log("   …");
  console.log(L.slice(fin - 2, fin + 1).join("\n"));
  process.exit(0);
}

const sortie = [...L.slice(0, debut), ...nouveau, ...L.slice(fin + 1)];
fs.writeFileSync(cible, sortie.join("\n"));
console.log(`${id} : lignes ${debut + 1}-${fin + 1} (${taille}) remplacées par ${nouveau.length} lignes`);
