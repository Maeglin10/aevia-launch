// Branche les listes écrites directement dans le rendu (avis, prestations).
//
//   node scripts/wire-inline-lists.mjs avis impact-06 impact-76 …
//   node scripts/wire-inline-lists.mjs prestations --dry
//
// Même principe que wire-inline-stats : ces thèmes n'ont pas de constante
// nommée, la liste est un tableau littéral dans le JSX. On l'extrait, la variable
// devient un `let` réassigné au rendu, et le rendu ne change que d'un nom.
//
// Les champs que le wizard ne demande pas — une icône, une photo, une note sur
// cinq — restent ceux du thème.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const bloc = process.argv[2];
const CIBLES = process.argv.filter((a) => a.startsWith("impact-"));

const PLANS = {
  avis: {
    helper: "clientReviews",
    nom: "AVIS_INLINE",
    texte: ["text", "quote", "texte", "avis", "content"],
    auteur: ["name", "author", "auteur", "nom", "client"],
    projette: (t, a) => `${t}: r.text, ${a}: r.author`,
    v: "r",
  },
  prestations: {
    helper: "clientServices",
    nom: "PRESTATIONS_INLINE",
    texte: ["title", "titre", "name", "nom", "label", "h"],
    auteur: ["desc", "description", "text", "body", "sub", "subtitle", "p"],
    projette: (t, d) => `${t}: s.title, ${d}: s.desc || ""`,
    v: "s",
  },
};
const plan = PLANS[bloc];
if (!plan) {
  console.error("usage: node scripts/wire-inline-lists.mjs avis|prestations [impact-NN …] [--dry]");
  process.exit(1);
}

let touched = 0;
const notes = [];

for (const id of CIBLES.length ? CIBLES : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (new RegExp(`${plan.helper}\\s*\\(`).test(src) || src.includes(plan.nom)) continue;

  const re = /\{\[\s*\n?\s*(\{[^[\]]{0,2000}?\})\s*,?\s*\n?\s*\]\.map\(/g;
  let m = null;
  let trouve = null;
  while ((m = re.exec(src))) {
    const corps = m[1];
    const cles = [...corps.matchAll(/["']?(\w+)["']?\s*:/g)].map((x) => x[1].toLowerCase());
    const a = plan.texte.find((k) => cles.includes(k));
    const b = plan.auteur.find((k) => cles.includes(k));
    const lignes = (corps.match(/\{/g) || []).length;
    if (a && b && lignes >= 2) {
      trouve = { debut: m.index, fin: re.lastIndex, corps, a, b };
      break;
    }
  }
  if (!trouve) {
    notes.push(`${id} : aucune liste ${bloc} dans le rendu`);
    continue;
  }

  const decl =
    `\n// ${bloc === "avis" ? "Les avis" : "Les prestations"}, jusqu'ici écrits dans le rendu :\n` +
    `// le client pouvait les saisir, le thème ne les lisait pas.\n` +
    `const ${plan.nom}_SOURCE = [\n  ${trouve.corps.trim()}\n];\n` +
    `let ${plan.nom} = ${plan.nom}_SOURCE;\n`;

  src = src.slice(0, trouve.debut) + `{${plan.nom}.map(` + src.slice(trouve.fin);

  const d = /\blet (?:fd|sessionData): any = null;/.exec(src);
  if (!d) {
    notes.push(`${id} : pas de variable de module`);
    continue;
  }
  src = src.slice(0, d.index + d[0].length) + "\n" + decl + src.slice(d.index + d[0].length);

  const anc = /\n(\s*)(sessionData = session;|fd = session\?\.formData;)/.exec(src);
  if (!anc) {
    notes.push(`${id} : aucun point d'assignation`);
    continue;
  }
  const arg = src.includes("sessionData = session;") ? "sessionData" : "session";
  const proj =
    `\n${anc[1]}${plan.nom} = resolveList(\n` +
    `${anc[1]}  ${plan.helper}(${arg})?.map((${plan.v}: any, i: number) => ({\n` +
    `${anc[1]}    ...${plan.nom}_SOURCE[i % ${plan.nom}_SOURCE.length],\n` +
    `${anc[1]}    ${plan.projette(trouve.a, trouve.b)},\n` +
    `${anc[1]}  })),\n${anc[1]}  ${plan.nom}_SOURCE,\n${anc[1]});`;
  src = src.slice(0, anc.index + anc[0].length) + proj + src.slice(anc.index + anc[0].length);

  if (!/from "@\/lib\/templates\/resolveList"/.test(src)) {
    const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = dir ? dir.index + dir[0].length : 0;
    src = src.slice(0, at) + `import { resolveList } from "@/lib/templates/resolveList";\n` + src.slice(at);
  }
  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (mm, b) => {
      const ont = new Set(b.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      ont.add(plan.helper);
      return `import {\n${[...ont].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
    });
  } else {
    const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = dir ? dir.index + dir[0].length : 0;
    src = src.slice(0, at) + `import { ${plan.helper} } from "@/lib/templates/clientContent";\n` + src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  touched++;
}

for (const n of notes) console.log(n);
console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s) — ${bloc} du rendu branché(s)`);
