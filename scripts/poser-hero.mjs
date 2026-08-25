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

/*
  Le héros se repère d'abord à son commentaire de tête. Une bonne moitié des
  thèmes n'en porte pas : on prend alors le premier <section> plein écran —
  la barre de navigation, elle, n'est jamais en 100dvh. Se caler sur le
  premier <section> tout court prendrait le bandeau de nav.
*/
let debut = L.findIndex((l) => /── HERO|══ HERO|── Hero/i.test(l));
if (debut < 0) {
  /* Le <section> plein écran. La déclaration de hauteur peut se trouver
     jusqu'à une quinzaine de lignes plus bas quand le style est écrit sur
     plusieurs lignes — une fenêtre trop courte rendait la moitié des thèmes
     « introuvables ». */
  debut = L.findIndex((l, k) => /^\s*<section\b/.test(l) && /100dvh|100vh/.test(L.slice(k, k + 16).join(" ")));
  if (debut >= 0) console.error(`${id} : pas de commentaire « ── HERO », bornes prises sur le premier <section> plein écran (ligne ${debut + 1})`);
}
if (debut < 0) {
  /* Certains héros ne déclarent aucune hauteur d'écran : ils se reconnaissent
     à leur classe « iNNN-hero » ou à leur ancre de haut de page. */
  const num = id.slice(7);
  const marque = new RegExp(`className="i${num}-hero|id="(top|hero|haut)"`);
  debut = L.findIndex((l, k) => /^\s*<section\b/.test(l) && marque.test(L.slice(k, k + 16).join(" ")));
  if (debut >= 0) console.error(`${id} : héros repéré à sa classe ou à son ancre (ligne ${debut + 1}) — pas de hauteur d'écran déclarée`);
}
if (debut < 0) { console.error(`${id} : ni commentaire « ── HERO » ni <section> plein écran — bornes à poser à la main`); process.exit(1); }

/*
  La balise fermante se trouve en comptant les ouvertures et les fermetures,
  pas à un nombre d'espaces fixe.

  Deux tentatives précédentes ont échoué : « </section> à six espaces »
  laissait de côté les thèmes dont le héros vit à quatre, et « à
  l'indentation de l'ouvrante » butait sur les fichiers où le <section> du
  héros est collé en colonne zéro alors que sa fermante est bien indentée —
  impact-363 et cinq autres sont dans ce cas.
*/
const ouverture = L.findIndex((l, k) => k >= debut && /<section\b/.test(l));
if (ouverture < 0) { console.error(`${id} : aucun <section> après la ligne ${debut + 1}`); process.exit(1); }
let profondeur = 0;
let fin = -1;
for (let k = ouverture; k < L.length; k++) {
  profondeur += (L[k].match(/<section\b/g) ?? []).length;
  profondeur -= (L[k].match(/<\/section>/g) ?? []).length;
  if (profondeur === 0) { fin = k; break; }
}
if (fin < 0) { console.error(`${id} : <section> jamais refermé après la ligne ${ouverture + 1}`); process.exit(1); }

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
