// Les listes des pages annexes lisent-elles la donnée du client ?
//
//   node scripts/wire-sous-pages-listes.mjs            # ce qui serait fait
//   node scripts/wire-sous-pages-listes.mjs --ecrire   # l'écrire
//
// Une page « boutique », « carte » ou « chambres » a été fabriquée en recopiant
// les constantes de la page d'accueil. L'accueil, lui, est câblé : sa liste
// passe par le contrat. La copie, non — le client remplit son catalogue et sa
// boutique continue d'afficher « Velvet Noir Coat ».
//
// On ne reclasse rien : la décision existe déjà sur la page d'accueil, prise
// liste par liste et vérifiée en rendu. On la reprend, à l'identique.

import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");
const RACINE = path.join(process.cwd(), "app/templates");

/* Le contrat, tel que les pages d'accueil l'appellent. */
const FONCTIONS = [
  "clientServices", "clientReviews", "clientTeam", "clientKeyStats",
  "clientCertifications", "clientFaq", "clientMenu", "clientProducts",
  "clientBeforeAfter", "clientListings",
];

/*
  Le corps du fichier sans ses imports : « clientTeam » dans une liste d'import
  n'est pas un appel, et le confondre avec un appel m'a fait compter 82 sections
  muettes qui n'existaient pas.
*/
const sansImports = (src) => src.replace(/^import[\s\S]*?from\s+"[^"]+";\s*$/gm, "");

/* Le tableau qui commence à `depart` (index du crochet ouvrant), accolades comprises. */
function finDuTableau(src, depart) {
  let d = 0;
  for (let i = depart; i < src.length; i++) {
    const ch = src[i];
    if (ch === "[" || ch === "{" || ch === "(") d++;
    else if (ch === "]" || ch === "}" || ch === ")") {
      d--;
      if (d === 0) return i;
    } else if (ch === '"' || ch === "'" || ch === "`") {
      // Une chaîne peut contenir un crochet : « 8 Avenue de la Paix [sic] ».
      const q = ch;
      i++;
      while (i < src.length && src[i] !== q) i += src[i] === "\\" ? 2 : 1;
    }
  }
  return -1;
}

/*
  Comment la page d'accueil câble une liste de ce nom : on récupère l'appel
  entier pour reprendre le même appariement de champs. Un thème qui écrit
  `name: m.name, role: m.role` continue de le faire sur sa page annexe.
*/
function cablageAccueil(accueil, nom) {
  const corps = sansImports(accueil);
  const re = new RegExp(`\\b${nom}\\b\\s*=\\s*resolveList\\(`, "g");
  for (const m of corps.matchAll(re)) {
    const ouvre = corps.indexOf("(", m.index + m[0].length - 1);
    const ferme = finDuTableau(corps, ouvre);
    if (ferme < 0) continue;
    const appel = corps.slice(ouvre + 1, ferme);
    const fn = FONCTIONS.find((f) => new RegExp(`\\b${f}\\s*\\(`).test(appel));
    if (!fn) continue;
    /*
      Le `.map(...)` du client, sans la liste de démonstration qui le suit.
      Couper à la dernière virgule prenait celle qui traîne en fin d'appel — la
      démonstration restait dans l'expression et `resolveList` recevait trois
      arguments. On coupe à la première virgule de premier niveau.
    */
    let d = 0, coupe = -1;
    for (let i = 0; i < appel.length; i++) {
      const ch = appel[i];
      if (ch === "(" || ch === "[" || ch === "{") d++;
      else if (ch === ")" || ch === "]" || ch === "}") d--;
      else if (ch === '"' || ch === "'" || ch === "`") {
        const q = ch;
        i++;
        while (i < appel.length && appel[i] !== q) i += appel[i] === "\\" ? 2 : 1;
      } else if (ch === "," && d === 0) { coupe = i; break; }
    }
    return { fn, expression: appel.slice(0, coupe > 0 ? coupe : undefined).trim() };
  }
  return null;
}

const rapport = [];
for (const theme of fs.readdirSync(RACINE).filter((d) => d.startsWith("impact-")).sort()) {
  const fichierAccueil = path.join(RACINE, theme, "page.tsx");
  if (!fs.existsSync(fichierAccueil)) continue;
  const accueil = fs.readFileSync(fichierAccueil, "utf8");

  for (const entree of fs.readdirSync(path.join(RACINE, theme), { withFileTypes: true })) {
    if (!entree.isDirectory()) continue;
    const fichier = path.join(RACINE, theme, entree.name, "page.tsx");
    if (!fs.existsSync(fichier)) continue;

    let src = fs.readFileSync(fichier, "utf8");
    const faits = [];

    /*
      De la dernière liste vers la première : chaque réécriture décale tout ce
      qui suit, et traiter dans l'ordre insérait la deuxième liste au milieu
      d'une chaîne de la première — huit fichiers ne compilaient plus.
    */
    for (const m of [...src.matchAll(/(?:^|\n)((?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*(?::[^=]+)?=\s*)\[\s*\{/g)].reverse()) {
      const nom = m[2];
      // Déjà câblée : ne pas la câbler deux fois.
      if (new RegExp(`function\\s+${nom}_LIVE\\b`).test(src)) continue;
      const cablage = cablageAccueil(accueil, nom);
      if (!cablage) continue;

      const ouvre = src.indexOf("[", m.index + m[0].indexOf("=") + 1);
      const ferme = finDuTableau(src, ouvre);
      if (ferme < 0) continue;

      const demo = src.slice(ouvre, ferme + 1);
      const nomDemo = `${nom}_DEMO_ANNEXE`;
      /*
        La page d'accueil nomme sa démonstration `X_DEMO` ; ici elle vit dans le
        fichier annexe sous un nom propre, sinon deux fichiers déclarent la même
        constante et le thème ne compile plus.
      */
      /*
        Les pages d'accueil ne nomment pas leur démonstration de la même façon :
        `X_DEMO`, `X_SOURCE`, `X_DEMO_SOURCE`. Ne remplacer que `_DEMO` laissait
        `techStack_SOURCE` dans l'expression — une constante qui n'existe pas
        dans le fichier annexe, donc la page entière qui tombe.
      */
      const expression = cablage.expression
        .replace(new RegExp(`\\b${nom}_[A-Z][A-Z_]*\\b`, "g"), nomDemo)
        .replace(/\bsession\b(?!Data)/g, "sessionData");
      // Une référence à la démonstration de l'accueil qui aurait survécu : on s'abstient.
      if (new RegExp(`\\b${nom}_[A-Z][A-Z_]*\\b`).test(expression.replaceAll(nomDemo, ""))) continue;

      /*
        Au chargement du module, la liste vaut sa démonstration — surtout ne pas
        appeler ${nom}_LIVE() ici : la fonction lit `sessionData`, déclaré plus
        bas dans certains fichiers, et l'appel à l'import tombait en
        « Cannot access before initialization » — cinq pages d'impact-99 en 500.
      */
      const remplacement =
        `\nconst ${nomDemo} = ${demo};\n`
        + `function ${nom}_LIVE() {\n  return resolveList(${expression}, ${nomDemo});\n}\n`
        + `let ${nom} = ${nomDemo};\n`;

      src = src.slice(0, m.index + (m[0].startsWith("\n") ? 1 : 0)) + remplacement.slice(1)
        + src.slice(ferme + 1).replace(/^;?/, "");
      faits.push({ nom, fn: cablage.fn });
    }

    if (!faits.length) continue;

    /* Les imports, une seule fois, et sans doubler ceux qui existent déjà. */
    const besoins = ["resolveList", ...new Set(faits.map((f) => f.fn))];
    const manquants = besoins.filter((b) => !new RegExp(`\\b${b}\\b`).test(src.slice(0, src.indexOf("\n\n") + 2000).split("\n").filter((l) => l.startsWith("import") || /^\s+\w+,?$/.test(l)).join("\n")));
    const lignes = [];
    if (manquants.includes("resolveList")) lignes.push(`import { resolveList } from "@/lib/templates/resolveList";`);
    const duContrat = manquants.filter((b) => b !== "resolveList");
    if (duContrat.length) lignes.push(`import { ${duContrat.join(", ")} } from "@/lib/templates/clientContent";`);
    if (lignes.length) {
      const apres = src.match(/^['"]use client['"];?\n/m);
      const at = apres ? apres.index + apres[0].length : 0;
      src = src.slice(0, at) + lignes.join("\n") + "\n" + src.slice(at);
    }

    /*
      La liste doit être recalculée une fois la session arrivée : les constantes
      de module sont figées à l'import, et une page qui ne les recalcule pas
      affiche la démonstration même correctement câblée.
    */
    /*
      Les pages n'affectent pas la session sous le même nom : `__session` sur
      vingt et une, `session` sur une seule — et celle-là gardait une liste
      figée à l'import, donc la démonstration quoi qu'il arrive.
    */
    const candidats = [
      src.match(/\n(\s*)c = \w+\?\.generatedContent;\n/),
      src.match(/\n(\s*)sessionData = \w+;\n/),
    ].filter(Boolean);
    /*
      Après la DERNIÈRE des deux affectations : impact-99/carte écrit `c` avant
      `sessionData`, et le recalcul posé entre les deux lisait la session du
      rendu précédent — la carte restait en démonstration.
    */
    const ancre = candidats.sort((a, b) => b.index - a.index)[0];
    if (ancre) {
      const recalcul = faits.map((f) => `${ancre[1]}${f.nom} = ${f.nom}_LIVE();`).join("\n");
      src = src.slice(0, ancre.index + ancre[0].length) + recalcul + "\n" + src.slice(ancre.index + ancre[0].length);
    }

    rapport.push({ fichier: fichier.replace(process.cwd() + "/", ""), listes: faits.map((f) => `${f.nom}←${f.fn}`) });
    if (ECRIRE) fs.writeFileSync(fichier, src);
  }
}

console.log(`${rapport.length} pages annexes · ${rapport.reduce((n, r) => n + r.listes.length, 0)} listes câblées`);
for (const r of rapport.slice(0, 30)) console.log("  ", r.fichier.replace("app/templates/", ""), "·", r.listes.join(" "));
if (!ECRIRE) console.log("\n(essai seulement — relancer avec --ecrire)");
