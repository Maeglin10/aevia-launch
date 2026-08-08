// La ville de démonstration, dans tous les fichiers d'un thème.
//
//   node scripts/wire-city-everywhere.mjs [--dry]
//
// Les passes précédentes déduisaient la ville d'exemple du seul `page.tsx` et ne
// visitaient ni les modules partagés ni certaines sous-pages. Cent vingt-neuf
// thèmes gardaient donc « Paris » ou « Bordeaux » quelque part sur le site d'un
// client annécien — le plus souvent dans une adresse de pied de page ou une
// légende de réalisation.
//
// Ici la ville se déduit de l'ensemble du dossier — page, layout, module
// partagé, sous-pages — et la substitution s'applique aux mêmes fichiers. Les
// lignes qui parlent du registre du commerce d'Aevia sont ignorées : sinon
// Bourg-en-Bresse gagne partout.
//
// Deux façons d'écrire selon l'endroit : `{clientCity(sessionData) ?? "Paris"}`
// dans le JSX d'une page, `clientCityOr("Paris")` dans un module partagé qui n'a
// pas de session à lui.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const VILLES = ["Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Nantes", "Lille", "Strasbourg",
  "Rennes", "Montpellier", "Nice", "Grenoble", "Annecy", "Villeurbanne", "Aix-en-Provence", "Rouen",
  "Reims", "Dijon", "Angers", "Toulon", "Brest", "Tours", "Nancy", "Metz", "Caen", "Avignon",
  "Poitiers", "La Rochelle", "Biarritz", "Bayonne", "Chambéry", "Genève", "Lausanne", "Bruxelles"];

function finitParBarre(x) {
  const m = /\\+$/.exec(x);
  return Boolean(m) && m[0].length % 2 === 1;
}

let faits = 0;
const touches = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;

  const fichiers = [path.join(dossier, "page.tsx"), path.join(dossier, "layout.tsx"), path.join(dossier, "shared.tsx")];
  for (const sous of fs.readdirSync(dossier)) {
    const f = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(f)) fichiers.push(f);
  }
  const presents = fichiers.filter((f) => fs.existsSync(f));
  if (presents.length === 0) continue;

  /*
    Toutes les villes du thème, pas seulement la dominante : un thème qui parle
    de « Nantes » dans son hero et de « Bordeaux » dans une réalisation en
    gardait une des deux, et le site du client citait encore une ville où il n'a
    jamais travaillé.
  */
  let ville = null;
  for (const f of presents) {
    const m = /clientCity\([^)]*\)\s*\?\?\s*"([^"]+)"/.exec(fs.readFileSync(f, "utf8"));
    if (m) { ville = m[1]; break; }
  }
  if (!ville) {
    const tout = presents.map((f) => fs.readFileSync(f, "utf8")).join("\n")
      .split("\n").filter((l) => !/RCS|Aevia|SIREN/.test(l)).join("\n");
    let meilleurN = 0;
    for (const v of VILLES) {
      const n = (tout.match(new RegExp(`\\b${v.replace(/-/g, "\\-")}\\b`, "g")) || []).length;
      if (n > meilleurN) { meilleurN = n; ville = v; }
    }
    /*
      Un seul passage suffit. Le seuil de deux laissait « Fait avec amour à
      Paris » sur le site d'un client annécien : la ville n'y est citée qu'une
      fois, dans le pied de page, à l'endroit le plus lu.
    */
    if (meilleurN < 1) ville = null;
  }
  if (!ville) continue;

  /*
    On répète l'opération pour chaque autre ville nommée au moins deux fois :
    une mention isolée dans un exemple reste l'exemple du thème, deux mentions
    forment un lieu, et un lieu doit être celui du client.
  */
  const toutLeDossier = presents.map((f) => fs.readFileSync(f, "utf8")).join("\n")
    .split("\n").filter((l) => !/RCS|Aevia|SIREN/.test(l)).join("\n");
  const autres = VILLES.filter((v) => {
    if (v === ville) return false;
    const n = (toutLeDossier.match(new RegExp(`\\b${v.replace(/-/g, "\\-")}\\b`, "g")) || []).length;
    return n >= 2;
  });

  /*
    La casse compte : « NEW YORK · LONDON · PARIS » et « BORDEAUX, FRANCE » sont
    écrits en capitales dans les pieds de page, et un motif sensible à la casse
    les laissait passer — soixante « Paris » et vingt-deux « Bordeaux » sur le
    site de clients savoyards. Le repli garde la graphie d'origine.
  */
  let n = 0;
  for (const nomVille of [ville, ...autres]) {
  const motCle = new RegExp(`\\b${nomVille.replace(/-/g, "\\-")}\\b`, "i");

  for (const f of presents) {
    let src = fs.readFileSync(f, "utf8");
    const partage = f.endsWith("shared.tsx");
    const arg = partage
      ? null
      : /^let sessionData: any = null;/m.test(src) ? "sessionData" : /__layoutSession/.test(src) ? "__layoutSession" : null;
    if (!partage && !arg) continue;

    let k = 0;
    const lignes = src.split("\n").map((ligne0) => {
      let ligne = ligne0;
      if (/^\s*(import|export type|\/\/|\*)/.test(ligne)) return ligne;
      if (/alt=|alt:|aria|href=|placeholder|content=|@type|schema/.test(ligne)) return ligne;
      /*
        La ligne du tampon de pied contient déjà `clientCity(...)`, et l'écarter
        entièrement laissait la ville de démonstration juste à côté : « © 2026
        KinéSport Élite · Paris 15e · Voiron ». On masque les appels existants le
        temps du remplacement, puis on les remet.
      */
      const masques = [];
      ligne = ligne.replace(/client(?:City|CityOr)\([^()]*(?:\([^()]*\)[^()]*)*\)(?:\s*\?\?\s*"[^"]*")?/g, (m0) => {
        masques.push(m0);
        return `\u0000${masques.length - 1}\u0000`;
      });
      const demasquer = (x) => x.replace(/\u0000(\d+)\u0000/g, (_, i) => masques[Number(i)]);
      // La ligne est masquée à ce stade : la rendre telle quelle y laisserait les
      // marqueurs, et le fichier ne compilerait plus.
      if (/RCS|Aevia|SIREN/.test(ligne)) return demasquer(ligne);

      // Les chaînes de données, propres au guillemet ouvrant.
      let out = ligne.replace(/"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/g, (m0, dbl, sgl, pos) => {
        const q = dbl !== undefined ? '"' : "'";
        const valeur = dbl !== undefined ? dbl : sgl;
        const avantChar = ligne.slice(0, pos).replace(/\s+$/, "").slice(-1);
        const apresChar = ligne.slice(pos + m0.length).replace(/^\s+/, "").slice(0, 1);
        /*
          La chaîne peut aussi être la valeur d'un attribut — `body="… Nantes …"`,
          `title: "Iron Club Lyon — …"` — et s'arrêter aux seules données laissait
          la ville de démonstration dans les phrases, là où elle se lit le plus.
        */
        /*
          Pas les attributs JSX : `title="… Lyon 2e"` ne se concatène pas avec des
          « + » sans accolades, et quatre fichiers ont cessé de compiler avant
          qu'on s'en aperçoive. Le gain — cinq mentions — ne valait pas le risque.
        */
        if (!"[,:(".includes(avantChar)) return m0;
        if (apresChar && !"],},)".includes(apresChar)) return m0;
        if (valeur.includes("${") || !motCle.test(valeur)) return m0;
        /*
          Une chaîne qui n'est QUE le nom de la ville en minuscules est une clé
          de recherche, pas un texte : `ROUTES = [["paris", "dubai"]]` sert à
          lire `HUBS["paris"]`, et la remplacer par la ville du client fait
          chercher une entrée qui n'existe pas — impact-207 plantait ainsi.
        */
        if (valeur.trim() === nomVille.toLowerCase()) return m0;
        const morceaux = valeur.split(new RegExp(motCle.source, "i"));
        if (morceaux.some(finitParBarre)) return m0;
        k++;
        const appel = partage ? `clientCityOr(${q}${nomVille}${q})` : `(clientCity(${arg}) ?? ${q}${nomVille}${q})`;
        return morceaux.map((x) => (x ? `${q}${x}${q}` : null))
          .reduce((acc, x, i) => { if (i > 0) acc.push(appel); if (x) acc.push(x); return acc; }, [])
          .join(" + ");
      });

      // Le texte JSX, seulement dans un fichier qui a une session.
      if (!partage) {
        out = out.replace(new RegExp(`(^|[\\s>(,·—–])(${nomVille})(?=[\\s<{.,;:!?·—–)]|$)`, "gi"), (m0, avant, v, pos) => {
          // Une clé d'objet n'est pas du texte : `paris: { x: 472 }` doit rester.
          if (/^\s*:/.test(out.slice(pos + m0.length))) return m0;
          const seg = out.slice(0, pos);
          const impair = (re) => (seg.match(re) || []).length % 2 === 1;
          /*
            L'apostrophe française n'ouvre pas une chaîne. La compter comme telle
            faisait croire à une chaîne béante dès qu'un texte disait
            « Cabinet dentaire d'excellence au cœur de Paris 8e » — et la passe
            s'abstenait sur tout ce qui portait une apostrophe, c'est-à-dire sur
            la moitié des phrases françaises.
          */
          if (impair(/(?<!\\)"/g) || impair(/(?<!\\)`/g)) return m0;
          k++;
          return `${avant}{clientCity(${arg}) ?? "${v}"}`;
        });
      }
      return demasquer(out);
    });

    if (k === 0) continue;
    src = lignes.join("\n");
    const besoin = partage ? "clientCityOr" : "clientCity";
    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
        const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
        noms.add(besoin);
        return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
      });
    } else {
      const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = d ? d.index + d[0].length : 0;
      src = src.slice(0, at) + `import { ${besoin} } from "@/lib/templates/clientContent";\n` + src.slice(at);
    }
    if (!dry) fs.writeFileSync(f, src);
    n += k;
  }
  }

  if (n === 0) continue;
  faits += n;
  touches.push(`${id} (${n}× ${ville})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} mention(s) de ville sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 12).join("  ·  "));
