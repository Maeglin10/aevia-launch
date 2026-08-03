// Branche les chiffres clés et les garanties sur la donnée du client.
//
//   node scripts/wire-stats-guarantees.mjs --dry
//   node scripts/wire-stats-guarantees.mjs [impact-351 …]
//
// 158 thèmes affichent une section « chiffres clés » et 276 une section
// « garanties » ; aucun ne lisait la donnée du client. Le codemod précédent ne
// pouvait rien pour eux : il remplaçait des sources existantes, et ces sections
// n'en avaient aucune — leur contenu est une constante de module.
//
// Les formes coïncident déjà avec le contrat, ce qui rend l'opération mécanique :
//   const STATS = [{ value, label }, …]   ↔ clientStats(session)
//   const ENGAGEMENT = ["…", …]           ↔ clientCertifications(session)
//
// La constante est renommée en _DEMO et la variable d'origine devient un `let`
// de module réassigné pendant le rendu — le même idiome que `fd`, `c` et `bp`,
// pour que les sections extraites en sous-composants continuent d'y accéder
// sans qu'on ait à leur passer des props.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");

const TARGETS = [
  { names: ["STATS", "STATS_DATA", "ABOUT_STATS", "IMPACT_STATS"], helper: "clientStats" },
  {
    names: ["ENGAGEMENT", "ENGAGEMENTS", "CERTIFICATIONS", "CERTIFS", "GARANTIES"],
    helper: "clientCertifications",
  },
];

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const named = args.filter((a) => a.startsWith("impact-"));
const ids = named.length
  ? named
  : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));

let touched = 0;
const notes = [];
const counts = { clientStats: 0, clientCertifications: 0 };

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  const before = src;
  const used = new Set();
  const assigns = [];

  for (const { names, helper } of TARGETS) {
    for (const name of names) {
      const decl = new RegExp(`^const ${name}(\\s*:[^=]+)?\\s*=\\s*\\[`, "m");
      if (!decl.test(src)) continue;
      // Déjà traité, ou nom réutilisé ailleurs comme fonction : on passe.
      if (src.includes(`${name}_DEMO`)) continue;

      src = src.replace(decl, (m) => m.replace(`const ${name}`, `const ${name}_DEMO`));

      /*
        Le `let` doit venir après la fermeture réelle du tableau. Beaucoup de ces
        constantes tiennent sur une ligne, mais pas toutes : insérer après la
        première ligne coupait la déclaration en deux, silencieusement pour le
        script et bruyamment pour le compilateur.
      */
      const start = src.indexOf(`const ${name}_DEMO`);
      // Après le « = », pas après le nom : une annotation de type comme
      // « : Certification[] » porte ses propres crochets, et compter à partir de
      // là fermait le tableau sur le vide.
      const eq = src.indexOf("=", start);
      let i = src.indexOf("[", eq);
      let depth = 0;
      for (; i < src.length; i++) {
        if (src[i] === "[") depth++;
        else if (src[i] === "]") {
          depth--;
          if (depth === 0) break;
        }
      }
      const eol = src.indexOf("\n", i);
      if (eol === -1) continue;
      src = `${src.slice(0, eol + 1)}let ${name} = ${name}_DEMO;\n${src.slice(eol + 1)}`;
      assigns.push(`  ${name} = resolveList(${helper}(SESSION_ARG), ${name}_DEMO);`);
      used.add(helper);
      counts[helper]++;
    }
  }

  if (used.size === 0) continue;

  // Où assigner : là où le thème assigne déjà bp, sinon là où il assigne fd.
  const anchor =
    /\n(\s*)(sessionData = session;)/.exec(src) ||
    /\n(\s*)(bp = session\?\.businessProfile;)/.exec(src) ||
    /\n(\s*)(fd = session\?\.formData;)/.exec(src);
  if (!anchor) {
    notes.push(`${id}  aucun point d'assignation — à traiter à la main`);
    continue;
  }
  const arg = src.includes("sessionData = session;") ? "sessionData" : "session";
  const block = assigns.join("\n").replaceAll("SESSION_ARG", arg);
  src = src.replace(anchor[0], `${anchor[0]}\n${block}`);

  if (!/from "@\/lib\/templates\/resolveList"/.test(src)) {
    notes.push(`${id}  pas de resolveList — à traiter à la main`);
    continue;
  }

  const missing = [...used].filter((h) => !src.includes(`${h},`) && !src.includes(`${h}(`) === false);
  const needed = [...used].filter(
    (h) => !new RegExp(`\\b${h}\\b[^\\n]*from "@/lib/templates/clientContent"`).test(src),
  );
  if (needed.length) {
    if (/from "@\/lib\/templates\/clientContent"/.test(src)) {
      src = src.replace(
        // Ancré sur le bloc lui-même : « [\\s\\S]*? » partait du premier
        // « import { » du fichier et avalait les imports intermédiaires.
        /import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/,
        (m, body) => {
          const have = new Set(
            body
              .split("\n")
              .map((l) => l.trim().replace(/,$/, ""))
              .filter(Boolean),
          );
          needed.forEach((h) => have.add(h));
          return `import {\n${[...have].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
        },
      );
    } else {
      src = src.replace(
        /(import \{ resolveList \} from "@\/lib\/templates\/resolveList";)/,
        `$1\nimport {\n${needed.sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`,
      );
    }
  }

  if (src === before) continue;
  if (!dry) fs.writeFileSync(file, src);
  touched++;
  notes.push(`${id}  ${[...used].join(" ")}`);
}

for (const n of notes) console.log(n);
console.log(
  `\n${dry ? "[à blanc] " : ""}${touched} thème(s) — ${counts.clientStats} section(s) chiffres, ${counts.clientCertifications} section(s) garanties`,
);
