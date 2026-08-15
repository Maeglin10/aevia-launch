/* Diagnostic : où la marque échappe-t-elle au balayage ? (outil de travail) */
import fs from "node:fs";
const [fichier, marque] = process.argv.slice(2);
let src = fs.readFileSync(fichier, "utf8");
const re = new RegExp(`(?<![\\w])${marque.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w])`, "g");
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


  const lignes = src.split("\n");
  const offs = []; let o = 0;
  for (const l of lignes) { offs.push(o); o += l.length + 1; }
  let n = 0;
  for (const m of src.matchAll(re)) {
    if (morceaux.some(([a, b]) => a <= m.index && m.index < b)) continue;
    let k = 0; while (k + 1 < offs.length && offs[k + 1] <= m.index) k++;
    if (/\?\?/.test(lignes[k])) continue;
    n++; console.log(`  ligne ${k + 1} : ${lignes[k].trim().slice(0, 85)}`);
  }
  if (!n) console.log("  (rien hors segment)");
  console.log("  segments:", morceaux.length);
}
