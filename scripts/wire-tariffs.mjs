// Branche les grilles tarifaires sur les prestations du client.
//
//   node scripts/wire-tariffs.mjs --dry
//   node scripts/wire-tariffs.mjs [impact-351 …]
//
// Le wizard demande le tarif à côté de la prestation depuis le 2026-08-03,
// parce que les deux se décident ensemble. Aucun thème ne l'affichait : 82
// portent une grille tarifaire, toutes en dur.
//
// La forme est d'une régularité inespérée — 61 thèmes sur 70 écrivent
// `{ a, p, n }` : a pour l'acte, p pour le prix, n pour la note. C'est
// exactement `{ title, price, desc }` du contrat.
//
// Les champs supplémentaires de quelques thèmes (mutuelle, CPF, ordonnance) sont
// conservés depuis la ligne de démonstration correspondante : le wizard ne les
// demande pas, donc les inventer serait plus faux que de garder l'exemple.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const NAMES = ["TARIFS", "PRICING", "FORMULES", "PACKAGES", "FULL_PRICES"];

const args = process.argv.slice(2);
const dry = args.includes("--dry");
const named = args.filter((a) => a.startsWith("impact-"));
const ids = named.length
  ? named
  : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));

let touched = 0;
let sections = 0;
const notes = [];

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  const before = src;
  const assigns = [];

  for (const name of NAMES) {
    const decl = new RegExp(`^const ${name}(\\s*:[^=]+)?\\s*=\\s*\\[`, "m");
    if (!decl.test(src) || src.includes(`${name}_DEMO`)) continue;

    // Les clés de cette grille, telles que le thème les écrit.
    const start = src.search(decl);
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
    const body = src.slice(eq, i);
    /*
      Quelques grilles sont imbriquées — { category, items: [{ name, price }] }.
      La première accolade rencontrée est alors la ligne intérieure, et on
      projetait les prestations du client sur la mauvaise couche. Ces grilles
      demandent une projection propre au thème : on les laisse.
    */
    if (/\{[^{}]*\[/.test(body)) {
      notes.push(`${id}  ${name} : grille imbriquée — à traiter à la main`);
      continue;
    }
    const firstRow = /\{([^}]*)\}/.exec(body);
    if (!firstRow) continue;
    const keys = [...firstRow[1].matchAll(/["']?(\w+)["']?\s*:/g)].map((m) => m[1]);

    // On ne traite que les grilles reconnaissables : un libellé et un prix.
    const label = keys.find((k) => ["a", "f", "name", "title", "acte", "nom"].includes(k));
    const price = keys.find((k) => ["p", "price", "prix", "tarif"].includes(k));
    if (!label || !price) {
      notes.push(`${id}  ${name} : forme non reconnue (${keys.join(",")})`);
      continue;
    }
    const note = keys.find((k) => ["n", "desc", "description", "detail"].includes(k));

    src = src.replace(decl, (m) => m.replace(`const ${name}`, `const ${name}_DEMO`));

    /*
      Il faut recompter les crochets après le renommage : les décalages changent
      de cinq caractères, et un indexOf("]") tombe sur le premier tableau
      imbriqué — une liste de « features » à l'intérieur d'une formule — ce qui
      posait le `let` au milieu de la déclaration.
    */
    const s2 = src.indexOf(`const ${name}_DEMO`);
    const eq2 = src.indexOf("=", s2);
    let j = src.indexOf("[", eq2);
    let d2 = 0;
    for (; j < src.length; j++) {
      if (src[j] === "[") d2++;
      else if (src[j] === "]") {
        d2--;
        if (d2 === 0) break;
      }
    }
    const eol = src.indexOf("\n", j);
    if (eol === -1) continue;
    src = `${src.slice(0, eol + 1)}let ${name} = ${name}_DEMO;\n${src.slice(eol + 1)}`;

    const fields = [
      `...${name}_DEMO[i % ${name}_DEMO.length]`,
      `${label}: s.title`,
      `${price}: s.price ?? ${name}_DEMO[i % ${name}_DEMO.length].${price}`,
      note ? `${note}: s.desc || ${name}_DEMO[i % ${name}_DEMO.length].${note}` : null,
    ].filter(Boolean);
    assigns.push(
      `  ${name} = resolveList(\n` +
        `    clientServices(SESSION_ARG)?.map((s, i) => ({ ${fields.join(", ")} })),\n` +
        `    ${name}_DEMO,\n` +
        `  );`,
    );
    sections++;
  }

  if (assigns.length === 0) continue;

  const anchor =
    /\n(\s*)(sessionData = session;)/.exec(src) ||
    /\n(\s*)(bp = session\?\.businessProfile;)/.exec(src) ||
    /\n(\s*)(fd = session\?\.formData;)/.exec(src);
  if (!anchor) {
    notes.push(`${id}  aucun point d'assignation — à traiter à la main`);
    continue;
  }
  const arg = src.includes("sessionData = session;") ? "sessionData" : "session";
  src = src.replace(anchor[0], `${anchor[0]}\n${assigns.join("\n").replaceAll("SESSION_ARG", arg)}`);

  if (!/from "@\/lib\/templates\/resolveList"/.test(src)) {
    notes.push(`${id}  pas de resolveList — à traiter à la main`);
    continue;
  }
  if (!/\bclientServices\b[^\n]*\n?[^\n]*clientContent/.test(src) && !src.includes("clientServices,")) {
    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(
        /import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/,
        (m, b) => {
          const have = new Set(
            b.split("\n").map((l) => l.trim().replace(/,$/, "")).filter(Boolean),
          );
          have.add("clientServices");
          return `import {\n${[...have].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
        },
      );
    } else {
      src = src.replace(
        /(import \{ resolveList \} from "@\/lib\/templates\/resolveList";?)/,
        `$1\nimport { clientServices } from "@/lib/templates/clientContent";`,
      );
    }
  }

  if (src === before) continue;
  if (!dry) fs.writeFileSync(file, src);
  touched++;
  notes.push(`${id}  grille tarifaire branchée`);
}

for (const n of notes) console.log(n);
console.log(
  `\n${dry ? "[à blanc] " : ""}${touched} thème(s), ${sections} grille(s) tarifaire(s) branchée(s)`,
);
