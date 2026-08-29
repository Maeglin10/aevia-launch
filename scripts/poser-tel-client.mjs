/* Le bouton « Appeler » qui appelle un inconnu.

   Des dizaines de thèmes écrivent `tel:${fd?.phone ?? "+33320000000"}`. Ils ne
   lisent donc QUE formData.phone. Or le numéro d'un client arrive presque
   toujours par son profil d'entreprise (businessProfile.contacts), que seul
   clientPhone() sait lire. Résultat : le client a bien donné son numéro, et
   son site compose celui de la démonstration.

   On n'enlève aucun repli : on ajoute la source manquante EN TÊTE de la
   chaîne. Remplacement ancré sur le texte exact de l'expression, jamais un
   motif gourmand.

     node scripts/poser-tel-client.mjs --voir
     node scripts/poser-tel-client.mjs
*/
import fs from "node:fs";
import path from "node:path";

const voir = process.argv.includes("--voir");
const racine = "app/templates";
const rapport = [];

/* La variable de session porte deux noms selon le fichier. */
function nomSession(src) {
  if (/\b__layoutSession\b/.test(src)) return "__layoutSession";
  if (/\bsessionData\b/.test(src)) return "sessionData";
  return null;
}

/* Les SOUS-pages aussi. La première version ne regardait que la racine du
   thème : /contact, /devis, /tarifs affichaient donc encore le numéro de la
   démonstration. Mesuré après coup : 25 sites de téléphone et 171 d'adresse
   dans les seules sous-pages. */
function fichiersDuTheme(dossier) {
  const out = [];
  for (const e of fs.readdirSync(dossier, { withFileTypes: true })) {
    const p = path.join(dossier, e.name);
    if (e.isDirectory()) out.push(...fichiersDuTheme(p));
    else if (e.name.endsWith(".tsx")) out.push(p);
  }
  return out;
}

for (const d of fs.readdirSync(racine).filter((x) => /^impact-\d+$/.test(x)).sort()) {
  for (const f of fichiersDuTheme(path.join(racine, d))) {
    let src = fs.readFileSync(f, "utf8");

    /* Les expressions à corriger : fd?.phone en tête de chaîne, sans clientPhone. */
    /* Les deux styles de guillemets : le premier passage n'acceptait que les
       guillemets doubles et laissait passer toutes les chaînes en apostrophes. */
    const cibles = [...src.matchAll(/fd\?\.phone\s*\?\?\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g)]
      .filter((m) => !src.slice(Math.max(0, m.index - 60), m.index).includes("clientPhone"));
    if (!cibles.length) continue;

    const s = nomSession(src);
    if (!s) { rapport.push([f, "PAS DE VARIABLE DE SESSION"]); continue; }

    if (voir) { rapport.push([f, `${cibles.length} × ${s}`]); continue; }

    /* Du dernier au premier : les index restent valables. */
    for (const m of [...cibles].reverse()) {
      const fin = m.index + m[0].length;
      /* Dans un tel:, le numéro doit être nettoyé — « +33 4 78 » composé tel
         quel ne passe pas partout. À l'affichage, au contraire, on garde la
         mise en forme du client. Le code d'origine ne nettoyait rien : le
         défaut existait déjà avec fd?.phone. */
      const dansLien = /tel:\$\{$/.test(src.slice(Math.max(0, m.index - 6), m.index)) && src[fin] === "}";
      const expr = dansLien
        ? `(clientPhone(${s}) ?? fd?.phone ?? ${m[1]}).replace(/[^+0-9]/g, "")`
        : `clientPhone(${s}) ?? fd?.phone ?? ${m[1]}`;
      src = src.slice(0, m.index) + expr + src.slice(fin);
    }

    /* L'import, ajouté à la liste existante de clientContent. */
    if (!/\bclientPhone\b\s*,/.test(src.split("from \"@/lib/templates/clientContent\";")[0] ?? "")) {
      const im = /import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.exec(src);
      if (!im) { rapport.push([f, "PAS D'IMPORT clientContent"]); continue; }
      const noms = [...new Set([...im[1].split(",").map((x) => x.trim()).filter(Boolean), "clientPhone"])].sort();
      src = src.replace(im[0], `import {\n  ${noms.join(",\n  ")},\n} from "@/lib/templates/clientContent";`);
    }

    fs.writeFileSync(f, src);
    rapport.push([f, `${cibles.length} corrigé(s) · ${s}`]);
  }
}

for (const [f, msg] of rapport) console.log(`${f} : ${msg}`);
const total = rapport.reduce((n, [, m]) => n + (Number(m.split(" ")[0]) || 0), 0);
console.log(`\n${rapport.length} fichiers · ${total} appels · ${rapport.filter(([, m]) => /PAS D/.test(m)).length} en échec`);
