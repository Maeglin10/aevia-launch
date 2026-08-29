/* L’adresse qui n’est pas celle du client.

   Des dizaines de thèmes écrivent `mailto:${fd?.email ?? "+33320000000"}`. Ils ne
   lisent donc QUE formData.phone. Or le numéro d'un client arrive presque
   toujours par son profil d'entreprise (businessProfile.contacts), que seul
   clientEmail() sait lire. Résultat : le client a bien donné son numéro, et
   son site compose celui de la démonstration.

   On n'enlève aucun repli : on ajoute la source manquante EN TÊTE de la
   chaîne. Remplacement ancré sur le texte exact de l'expression, jamais un
   motif gourmand.

     node scripts/poser-email-client.mjs --voir
     node scripts/poser-email-client.mjs
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

for (const d of fs.readdirSync(racine).filter((x) => /^impact-\d+$/.test(x)).sort()) {
  for (const nom of ["page.tsx", "layout.tsx"]) {
    const f = path.join(racine, d, nom);
    if (!fs.existsSync(f)) continue;
    let src = fs.readFileSync(f, "utf8");

    /* Les expressions à corriger : fd?.email en tête de chaîne, sans clientEmail. */
    /* Les deux styles de guillemets : le premier passage n'acceptait que les
       guillemets doubles et laissait passer toutes les chaînes en apostrophes. */
    const cibles = [...src.matchAll(/fd\?\.email\s*\?\?\s*("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g)]
      .filter((m) => {
        const contexte = src.slice(Math.max(0, m.index - 60), m.index);
        /* Refuser tout site DÉJÀ câblé, pas seulement par clientEmail : un
           motif mal échappé avait fait réécrire des sites de téléphone en
           adresses, produisant « clientPhone(s) ?? clientEmail(s) ?? … ». */
        return !contexte.includes("clientEmail") && !contexte.includes("clientPhone");
      });
    if (!cibles.length) continue;

    const s = nomSession(src);
    if (!s) { rapport.push([f, "PAS DE VARIABLE DE SESSION"]); continue; }

    if (voir) { rapport.push([f, `${cibles.length} × ${s}`]); continue; }

    /* Du dernier au premier : les index restent valables. */
    for (const m of [...cibles].reverse()) {
      const fin = m.index + m[0].length;
      /* Une adresse ne se nettoie pas — contrairement à un numéro, elle part
         telle quelle dans le lien. */
      const expr = `clientEmail(${s}) ?? fd?.email ?? ${m[1]}`;
      src = src.slice(0, m.index) + expr + src.slice(fin);
    }

    /* L'import, ajouté à la liste existante de clientContent. */
    if (!/\bclientEmail\b\s*,/.test(src.split("from \"@/lib/templates/clientContent\";")[0] ?? "")) {
      const im = /import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.exec(src);
      if (!im) { rapport.push([f, "PAS D'IMPORT clientContent"]); continue; }
      const noms = [...new Set([...im[1].split(",").map((x) => x.trim()).filter(Boolean), "clientEmail"])].sort();
      src = src.replace(im[0], `import {\n  ${noms.join(",\n  ")},\n} from "@/lib/templates/clientContent";`);
    }

    fs.writeFileSync(f, src);
    rapport.push([f, `${cibles.length} corrigé(s) · ${s}`]);
  }
}

for (const [f, msg] of rapport) console.log(`${f} : ${msg}`);
const total = rapport.reduce((n, [, m]) => n + (Number(m.split(" ")[0]) || 0), 0);
console.log(`\n${rapport.length} fichiers · ${total} appels · ${rapport.filter(([, m]) => /PAS D/.test(m)).length} en échec`);
