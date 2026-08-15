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
  const marque = marqueDe(src);
  if (!marque) continue;
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
  src = src.replace(/\?\?\s*(?:\(<>)?[^\n]{0,20}/g, (t) => {
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
    return ligne.replace(/(.?[:(,[=]\s*)"([^"\\\n`]*)"/g, (tout, avant, corps) => {
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

  src = src.replace(/\u0000(\d+)\u0000/g, (_, i) => caches[Number(i)]);

  if (!faits) continue;
  if (!/import\s*\{[^}]*\bclientName\b/.test(src)) {
    const m = src.match(/\} from "@\/lib\/templates\/clientContent";/);
    if (m) src = src.replace(m[0], `  clientName,\n${m[0]}`);
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
