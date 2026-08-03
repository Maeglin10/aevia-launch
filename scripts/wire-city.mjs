// Branche la ville du client là où le thème affiche la sienne.
//
//   node scripts/wire-city.mjs [--dry]
//
// La ville est saisie dès la troisième étape du wizard et 361 thèmes sur 373 ne
// l'affichent nulle part : ils portent celle de leur démonstration. « Couvreur-
// zingueur · Angers » sur le site d'un couvreur lyonnais est le genre de détail
// qui décide un prospect à partir.
//
// On ne touche qu'aux positions où la ville est une mention de marque : après un
// séparateur (·, —, |), en fin d'adresse, ou comme valeur d'un champ ville. La
// prose est laissée intacte — « quinze ans entre Paris et Londres » raconte une
// histoire, ce n'est pas une adresse, et y substituer la ville du client
// produirait une phrase fausse.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const VILLES =
  "Paris|Lyon|Marseille|Bordeaux|Toulouse|Nantes|Lille|Nice|Angers|Rennes|Strasbourg|Montpellier|Reims|Rouen|Grenoble|Dijon|Tours|Annecy|Aix-en-Provence|Biarritz|Bayonne|Limoges|Metz|Nancy|Caen|Brest|Orléans|Avignon|Perpignan|Besançon|Toulon|Le Havre|Saint-Étienne|Clermont-Ferrand|Villeurbanne|Nîmes|Angoulême|La Rochelle|Chambéry|Pau";

let touched = 0;
let count = 0;

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  const original = fs.readFileSync(file, "utf8");
  const before = original;
  let n = 0;

  /*
    On ne substitue qu'après la déclaration de `fd` : les constantes de module
    situées plus haut sont évaluées à l'import, quand la session n'existe pas.
    Y écrire un appel ne produirait rien et, s'agissant de variables déclarées
    en `let` plus bas, le compilateur refuse le fichier.
  */
  const decl = /\blet (?:fd|sessionData): any = null;/.exec(original);
  const cut = decl ? decl.index + decl[0].length : 0;
  const tete = original.slice(0, cut);
  let src = original.slice(cut);

  const CITY = (arg) => `\${clientCity(${arg}) ?? "CITY"}`;

  // 1) Texte JSX se terminant par « · Ville » ou « — Ville » ou « | Ville ».
  src = src.replace(
    new RegExp(`([·—|]\\s*)(${VILLES})(\\s*)<`, "g"),
    (m, sep, ville, tail) => {
      n++;
      return `${sep}{clientCity(SESSION_ARG) ?? ${JSON.stringify(ville)}}${tail}<`;
    },
  );

  // 2) Chaîne dont la ville est la fin, après une virgule : « …, 75002 Paris ».
  /*
    Une valeur d'attribut JSX ne peut pas être un gabarit nu : « placeholder=`…` »
    ne compile pas, il faut « placeholder={`…`} ». On regarde donc ce qui précède
    le guillemet ouvrant pour savoir si l'on est dans un attribut.
  */
  src = src.replace(
    new RegExp(`(=?)(["'])([^"'\\n]{0,80}?,\\s*(?:\\d{5}\\s+)?)(${VILLES})\\2`, "g"),
    (m, eq, q, head, ville) => {
      if (head.includes("${")) return m;
      n++;
      const tpl = `\`${head}\${clientCity(SESSION_ARG) ?? ${JSON.stringify(ville)}}\``;
      return eq ? `={${tpl}}` : tpl;
    },
  );

  // 3) Valeur d'un champ explicitement nommé ville.
  src = src.replace(
    new RegExp(`((?:city|ville|town|localite)\\s*:\\s*)(["'])(${VILLES})\\2`, "gi"),
    (m, key, q, ville) => {
      n++;
      return `${key}(clientCity(SESSION_ARG) ?? ${JSON.stringify(ville)})`;
    },
  );

  if (n === 0) continue;
  src = tete + src;
  const hasSessionData = /sessionData = session;/.test(src);
  const hasFd = /\blet fd: any = null;/.test(src);
  if (!hasSessionData && !hasFd) continue;
  src = src.replaceAll("SESSION_ARG", hasSessionData ? "sessionData" : "{ formData: fd }");

  if (!/\bclientCity\b/.test(before)) {
    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, b) => {
        const have = new Set(b.split("\n").map((l) => l.trim().replace(/,$/, "")).filter(Boolean));
        have.add("clientCity");
        return `import {\n${[...have].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
      });
    } else {
      const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
      const at = dir ? dir.index + dir[0].length : 0;
      src = src.slice(0, at) + `import { clientCity } from "@/lib/templates/clientContent";\n` + src.slice(at);
    }
  }

  if (src === before) continue;
  if (!dry) fs.writeFileSync(file, src);
  touched++;
  count += n;
}

console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s), ${count} mention(s) de ville branchée(s)`);
