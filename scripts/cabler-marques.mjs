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

/* Ce qui interdit toute la ligne : on n'y touche jamais. */
const LIGNE_INTERDITE = /^\s*(?:import |export .*from )|require\(/;

/*
   Ce qui interdit une chaîne, elle seule.

   Le filtre portait sur la ligne entière : un nom de projet écrit à côté d'une
   URL d'illustration (« name: "Ateliers Kéops", … src: "https://…" ») ou d'une
   classe CSS était donc épargné, alors qu'il s'affiche en toutes lettres. Six
   pages d'impact-17 et cinq d'impact-18 le montraient encore.
*/
function chaineTechnique(t) {
  if (/^(?:https?:|\/|\.\/|#|data:|mailto:|tel:)/.test(t)) return true;
  if (/:\/\//.test(t)) return true;
  if (/\.(css|js|png|jpe?g|svg|webp|woff2?)$/i.test(t)) return true;
  /* Une liste de classes utilitaires : plusieurs mots à tirets, aucun espace
     porteur de sens. */
  if (/(?:^|\s)(?:text|bg|border|flex|grid|px|py|mt|mb|w|h|max|min|rounded|font|tracking|leading|absolute|relative|hover:|md:|lg:)-?[\w./[\]%-]*/.test(t)
      && /-/.test(t) && !/[.!?,;]/.test(t)) return true;
  if (/font-family|serif|sans-serif|monospace/i.test(t)) return true;
  return false;
}

/*
  Les trois écritures d'une même marque.

  Le catalogue relève ce qui s'affiche : impact-08 montre « VULCAN », mais c'est
  la feuille de style qui met en capitales — la source, elle, écrit « Vulcan ».
  Un motif à la casse exacte manquait donc les cinq pages du thème.

  On ne descend pas jusqu'aux minuscules : « Terre » et « Table » sont des
  marques du catalogue autant que des mots ordinaires, et « la terre choisie »
  doit rester intact.
*/
function motif(marque) {
  const titre = marque.toLowerCase().replace(/(^|[\s'’-])(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
  const formes = [...new Set([marque, titre, marque.toUpperCase()])]
    .sort((a, b) => b.length - a.length)
    .map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  return new RegExp(`(?<![\\w])(?:${formes.join("|")})(?![\\w])`, "g");
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
    if (LIGNE_INTERDITE.test(ligne)) return ligne;
    /* Les deux sortes de guillemets, échappements compris : impact-10 écrivait
       ses textes en apostrophes (`long: 'Nestled around the inner garden…'`) et
       échappait celles du texte — le motif s'arrêtait au premier antislash. */
    return ligne.replace(/(^\s*|.?[:(,[=]\s*)(["'])((?:[^"'\\\n`]|\\.)*)\2/g, (tout, avant, guillemet, corps, position) => {
      re.lastIndex = 0;
      if (!re.test(corps) || corps.includes("${") || chaineTechnique(corps)) return tout;
      /*
         Une marque d'un seul mot est souvent un mot ordinaire : « Atelier »,
         « Cabinet », « Table », « Encre ». Dans une description d'image
         (`alt="Atelier menuisier ébéniste Bordeaux"`, `alt="Table
         gastronomique"`), c'est le mot commun qui est employé, pas le nom de
         l'entreprise — et le remplacer donnait « Ateliers Vidal & Fils
         menuisier ébéniste ». On laisse donc ces descriptions tranquilles.
      */
      if (!marque.includes(" ") && /(?:alt|title|aria-label|placeholder)=\s*$/.test(ligne.slice(0, position + avant.length))) return tout;
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

     Trois écritures successives ont été nécessaires. Un motif `>…<` exigeait un
     texte sans accolade et manquait tout paragraphe dont l'élément appelle une
     fonction plus loin. Un automate suivant les guillemets prenait l'apostrophe
     de « l'atelier » pour une ouverture de chaîne et se désynchronisait pour le
     reste du fichier — « Obscura » restait affiché sur les quatre pages du
     thème sans que rien ne le signale.

     Celui-ci suit les balises. On n'entre dans un texte qu'en sortant d'une
     balise ouvrante, et l'apostrophe y redevient ce qu'elle est : une lettre.
     Les guillemets ne comptent que dans une balise ou dans une expression,
     là où ils délimitent vraiment une chaîne.
  */
  {
    const morceaux = [];
    const DEHORS = 0, BALISE = 1, TEXTE = 2;
    let etat = DEHORS, i = 0, debutTexte = -1, guillemet = null, profTag = 0, profExpr = 0;

    /*
       Les commentaires, sautés avant tout le reste. Les miens sont en français :
       « n'affiche pas », « l'import » — chaque apostrophe y ouvrait une chaîne
       qui ne se refermait jamais, et le balayage perdait le fil du fichier dès
       les premières lignes. Trente-sept segments relevés là où il y en a des
       centaines, et « QBit Labs is an independent research institute » restait
       affiché.
    */
    const commentaire = () => {
      if (src[i] === "/" && src[i + 1] === "/") { while (i < src.length && src[i] !== "\n") i++; return true; }
      if (src[i] === "/" && src[i + 1] === "*") { i += 2; while (i < src.length && !(src[i] === "*" && src[i + 1] === "/")) i++; i += 2; return true; }
      return false;
    };

    const chaine = (c) => {
      if (guillemet) {
        if (c === "\\") { i++; return true; }
        if (c === guillemet) guillemet = null;
        return true;
      }
      if (c === '"' || c === "'" || c === "`") { guillemet = c; return true; }
      return false;
    };

    while (i < src.length) {
      const c = src[i];

      if (etat === BALISE) {
        if (!guillemet && commentaire()) continue;
        if (!chaine(c)) {
          if (c === "{") profTag++;
          else if (c === "}") profTag--;
          else if (c === ">" && profTag === 0) {
            /* Même auto-fermante, une balise laisse derrière elle le texte de
               l'élément parent : `<br />Nous sommes l'atelier…`. En repassant
               par le code, l'apostrophe de « l'atelier » était lue comme une
               ouverture de chaîne et tout le reste du fichier se décalait. */
            etat = TEXTE;
            debutTexte = i + 1;
          }
        }
        i++; continue;
      }

      if (etat === TEXTE) {
        if (c === "<") { morceaux.push([debutTexte, i]); etat = BALISE; guillemet = null; profTag = 0; }
        else if (c === "{") { morceaux.push([debutTexte, i]); etat = DEHORS; profExpr++; }
        else if (c === "}" && profExpr > 0) { morceaux.push([debutTexte, i]); profExpr--; debutTexte = i + 1; }
        i++; continue;
      }

      /* DEHORS : du code. On y compte les accolades pour savoir quand une
         expression se referme, et l'on y guette la balise suivante — car le
         JSX vit à l'intérieur des expressions (`{cond && (<p>…</p>)}`), et les
         sauter en bloc laissait « Votre Vulcan est unique » intact sur cinq
         pages. */
      if (!guillemet && commentaire()) continue;
      if (!chaine(c)) {
        if (c === "{") profExpr++;
        else if (c === "}") { profExpr--; if (profExpr === 0) { etat = TEXTE; debutTexte = i + 1; } }
        /*
           Deux formes se ressemblent et n'ont rien à voir : `<Look>` ouvre une
           balise, `useState<Look[]>` ouvre un type. La première suit un espace,
           une parenthèse ou une accolade ; la seconde colle à un identifiant.
           Et `<>` ouvre un fragment.
        */
        else if (c === "<" && /[A-Za-z/>]/.test(src[i + 1] ?? "") && !/[\w$]/.test(src[i - 1] ?? " ")) {
          etat = BALISE; guillemet = null; profTag = 0;
        }
      }
      i++;
    }

    let sortie = "", curseur = 0;
    for (const [a, b] of morceaux) {
      if (a < curseur || b <= a) continue;
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
