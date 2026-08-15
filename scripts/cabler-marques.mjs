/*
  Remplacer la marque de démonstration par le nom du client, partout où elle
  s'affiche.

    node scripts/cabler-marques.mjs [--ecrire] [impact-158 …]

  Cent sept accueils nomment encore l'entreprise de la démonstration à côté de
  celle du client : « Atlas est né d'une conviction simple », « Bureau a
  transformé notre positionnement », « Le Matin Doré est aussi un espace de
  culture ». Le titre et le pied de page portaient bien le nom du client — la
  prose, elle, n'avait jamais été câblée, et personne ne l'avait mesurée sur les
  accueils.

  Deux endroits seulement sont touchés :

  · le texte d'un élément JSX, entre `>` et `<` ;
  · une chaîne de caractères qui sert visiblement à afficher du texte.

  Le second cas est le piège : une chaîne peut être une classe CSS, une adresse,
  une clé de traduction. Seize fichiers avaient été cassés lors d'un passage
  précédent faute de cette distinction. On refuse donc toute ligne qui porte un
  attribut technique, toute URL, tout import.
*/
import fs from "node:fs";
import path from "node:path";

/*
  La marque telle qu'elle s'affiche sur l'accueil du thème. Une page annexe ne
  porte pas toujours son propre repli `clientName(…) ?? "X"` : elle écrit la
  marque en clair, et le codemod passait à côté. Cent quatre-vingt-dix-neuf
  pages la montraient encore après le premier passage.
*/
const MARQUES = JSON.parse(fs.readFileSync("/tmp/marques.json", "utf8"));

const ECRIRE = process.argv.includes("--ecrire");
const CIBLES = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
const RACINE = "app/templates";

/* La marque de chaque thème, lue dans le repli que le thème s'est donné. */
function marqueDe(src) {
  const m = src.match(/clientName\([A-Za-z_$][\w$]*\)\s*\?\?\s*"([^"]{2,60})"/);
  if (!m || /^impact-\d+$/.test(m[1])) return null;
  return m[1];
}
function variableSession(s) {
  for (const v of ["sessionData", "__session", "__layoutSession", "fd"]) {
    if (new RegExp(`\\b${v}\\b`).test(s)) return v === "fd" ? null : v;
  }
  return null;
}

const INTERDIT = /className|href=|src=|import |require\(|\.css|https?:\/\/|style=|font-family|@media|aria-|data-|key=/;

function motif(marque) {
  return new RegExp(`(?<![\\w])${marque.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w])`, "g");
}

const rapport = [];
for (const p of parcourir(RACINE)) {
  const theme = p.slice(RACINE.length + 1).split("/")[0];
  if (CIBLES.length && !CIBLES.includes(theme)) continue;
  let src = fs.readFileSync(p, "utf8");
  /*
     La marque de l'accueil fait foi. Lire le premier repli venu dans le fichier
     donnait « Artisan Florist » pour impact-47 — un métier, pas un nom — et le
     codemod remplaçait le mauvais mot tout en laissant « Pétales & Co » sur les
     sept pages du thème.
  */
  const marque = MARQUES[theme] ?? marqueDe(src);
  if (!marque || /^impact-\d+$/.test(marque)) continue;
  const v = variableSession(src);
  if (!v) continue;
  const lecture = `clientName(${v}) ?? "${marque}"`;
  const re = motif(marque);
  let faits = 0;

  /*
     Masquer les replis déjà en place. Sans cela le codemod se mord la queue :
     `clientName(s) ?? "Atlas"` devenait
     `clientName(s) ?? \`${clientName(s) ?? "Atlas"}\``, et le repli d'un
     fragment JSX (`?? (<>Atlas</>)`) était réécrit au milieu d'une balise.
  */
  const caches = [];
  src = src.replace(/\?\?\s*(?:"[^"\n]*"|'[^'\n]*'|\(<>[^\n]{0,60})/g, (t) => {
    if (!motif(marque).test(t)) return t;
    caches.push(t);
    return `\u0000${caches.length - 1}\u0000`;
  });

  /*
     2. Les chaînes d'affichage.

     Le piège est l'apostrophe française. Un premier passage cherchait une
     chaîne entre deux guillemets, quels qu'ils soient : dans
     `q: "Suppression d'un mur porteur…"`, il a pris l'apostrophe de « d'un »
     pour une ouverture et injecté au milieu du texte — quarante-deux fichiers
     ne compilaient plus, et la réparation en a cassé cent quarante-quatre.

     On n'accepte donc qu'une forme sans ambiguïté : une chaîne en position de
     valeur (après `:`, `(`, `,`, `[` ou `=`), délimitée par des guillemets
     droits, et qui n'en contient aucun. L'apostrophe, à l'intérieur, n'est
     alors plus qu'un caractère comme un autre.
  */
  src = src.split("\n").map((ligne) => {
    if (INTERDIT.test(ligne)) return ligne;
    /* Les deux sortes de guillemets, échappements compris : impact-10 écrivait
       ses textes en apostrophes (`long: 'Nestled around the inner garden…'`) et
       échappait celles du texte — le motif s'arrêtait au premier antislash. */
    return ligne.replace(/(^\s*|.?[:(,[=]\s*)(["'])((?:[^"'\\\n`]|\\.)*)\2/g, (tout, avant, guillemet, corps) => {
      re.lastIndex = 0;
      if (!re.test(corps) || corps.includes("${")) return tout;
      re.lastIndex = 0;
      faits += (corps.match(re) ?? []).length;
      const chaine = "`" + corps.replace(re, `\${${lecture}}`) + "`";
      /* Un attribut JSX veut des accolades : `alt="…"` devient `alt={`…`}`,
         jamais `alt=`…`` — soixante-quinze fichiers l'ont appris. */
      return /[a-zA-Z-]=$/.test(avant) ? avant + "{" + chaine + "}" : avant + chaine;
    });
  }).join("\n");

  /*
     1. Le texte d'un élément.

     Un motif `>…<` ne suffisait pas : il exigeait un texte sans accolade et
     laissait donc intact tout paragraphe dont l'élément appelle une fonction
     plus loin — « QBit Labs is an independent quantum computing research
     institute » tenait sur trois lignes dans un <p> qui lisait clientText.

     On suit donc l'état du fichier caractère par caractère. Trois écueils, tous
     rencontrés : une accolade ouvre une expression, dont le contenu n'est pas
     du texte ; un `>` peut appartenir à une flèche `=>` ou à une comparaison ;
     et un guillemet droit dans ce qu'on croit être du texte signale qu'on lit
     en réalité du code — l'apostrophe, elle, est française et reste du texte.
  */
  {
    const morceaux = [];
    let i = 0, debutTexte = -1, profondeur = 0, guillemet = null;
    while (i < src.length) {
      const c = src[i];
      if (debutTexte >= 0) {
        if (c === "<") { morceaux.push([debutTexte, i]); debutTexte = -1; }
        else if (c === "{") { morceaux.push([debutTexte, i]); debutTexte = -1; profondeur = 1; }
        else if (c === '"' || c === "`") { debutTexte = -1; }
        i++; continue;
      }
      if (guillemet) {
        if (c === "\\") i++;
        else if (c === guillemet) guillemet = null;
        i++; continue;
      }
      if (c === '"' || c === "'" || c === "`") { guillemet = c; i++; continue; }
      if (profondeur > 0) {
        if (c === "{") profondeur++;
        else if (c === "}") { profondeur--; if (profondeur === 0) debutTexte = i + 1; }
        i++; continue;
      }
      if (c === ">" && src[i - 1] !== "=") debutTexte = i + 1;
      i++;
    }
    let sortie = "", curseur = 0;
    for (const [a, b] of morceaux) {
      if (a < curseur) continue;
      const texte = src.slice(a, b);
      re.lastIndex = 0;
      if (!re.test(texte)) continue;
      re.lastIndex = 0;
      faits += (texte.match(re) ?? []).length;
      sortie += src.slice(curseur, a) + texte.replace(re, `{${lecture}}`);
      curseur = b;
    }
    src = sortie + src.slice(curseur);
  }

  src = src.replace(/\u0000(\d+)\u0000/g, (_, i) => caches[Number(i)]);

  if (!faits) continue;
  if (!/import\s*\{[^}]*\bclientName\b/.test(src)) {
    const bloc = src.match(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/);
    if (bloc) {
      const noms = [...new Set([...bloc[1].matchAll(/client[A-Za-z]+/g)].map((x) => x[0]).concat("clientName"))].sort();
      src = src.replace(bloc[0], `import {\n${noms.map((n) => `  ${n},\n`).join("")}} from "@/lib/templates/clientContent";`);
    }
    else {
      const j = src.indexOf("\n", src.indexOf('"use client";'));
      src = src.slice(0, j + 1) + 'import { clientName } from "@/lib/templates/clientContent";\n' + src.slice(j + 1);
    }
  }
  rapport.push({ fichier: p.slice(RACINE.length + 1), marque, faits });
  if (ECRIRE) fs.writeFileSync(p, src);
}

function* parcourir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const c = path.join(d, e.name);
    if (e.isDirectory()) yield* parcourir(c);
    else if (e.name.endsWith(".tsx")) yield c;
  }
}

for (const r of rapport) console.log(`${r.fichier.padEnd(42)} « ${r.marque} » ×${r.faits}`);
console.log(`\n${rapport.length} fichiers · ${rapport.reduce((a, r) => a + r.faits, 0)} occurrences · ${ECRIRE ? "écrit" : "simulation (--ecrire)"}`);
