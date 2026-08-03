// Branche FAQ, équipe et zones d'intervention sur la donnée du client.
//
//   node scripts/wire-sections.mjs [--dry]
//
// 94 thèmes affichent une FAQ, 62 une équipe, 18 une zone d'intervention. Le
// wizard demande les trois depuis ce matin ; 54, 37 et 1 les lisaient.
//
// Chaque thème nomme ses champs comme il veut — { q, a } ou
// { question, answer } ; { name, role } ou { n, r, d } ; { v, d } ou
// { ville, detail }. La projection est donc décrite ici, une fois par forme,
// plutôt que devinée.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const GROUPS = [
  {
    helper: "clientServices",
    names: ["SERVICES", "FEATURES", "PRESTATIONS", "SERVICE_DETAILS"],
    keys: [
      { match: ["title", "desc"], project: () => `title: s.title` },
      { match: ["titre", "desc"], project: () => `titre: s.title` },
      { match: ["title", "description"], project: () => `title: s.title` },
      { match: ["name", "description"], project: () => `name: s.title` },
    ],
  },
  {
    helper: "clientReviews",
    names: ["TESTIMONIALS", "AVIS", "REVIEWS"],
    keys: [
      { match: ["name", "role", "text"], project: () => `name: r.author, text: r.text` },
      { match: ["texte", "auteur"], project: () => `texte: r.text, auteur: r.author` },
      { match: ["quote", "name"], project: () => `quote: r.text, name: r.author` },
    ],
  },
  {
    helper: "clientFaq",
    names: ["FAQS", "FAQ", "FAQ_ITEMS", "FALLBACK_FAQS", "QUESTIONS"],
    keys: [
      { match: ["q", "a"], project: (D, i) => `q: r.q, a: r.a` },
      { match: ["question", "answer"], project: () => `question: r.q, answer: r.a` },
    ],
  },
  {
    helper: "clientTeam",
    names: ["TEAM", "EQUIPE", "ARTISTS", "TEAM_MEMBERS", "STAFF"],
    keys: [
      { match: ["name", "role"], project: () => `name: m.name, role: m.role` },
      { match: ["n", "r"], project: () => `n: m.name, r: m.role` },
    ],
  },
  {
    helper: "clientAreas",
    names: ["ZONES", "COMMUNES", "SECTEURS"],
    keys: [
      { match: ["v", "d"], project: () => `v: z` },
      { match: ["ville", "detail"], project: () => `ville: z` },
    ],
  },
];

const VAR = { clientFaq: "r", clientTeam: "m", clientAreas: "z", clientServices: "s", clientReviews: "r" };

function closeBracket(src, from) {
  let i = src.indexOf("[", from);
  let d = 0;
  for (; i < src.length; i++) {
    if (src[i] === "[") d++;
    else if (src[i] === "]") {
      d--;
      if (d === 0) return i;
    }
  }
  return -1;
}

let touched = 0;
const per = { clientFaq: 0, clientTeam: 0, clientAreas: 0 };
const notes = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  const before = src;
  const assigns = [];
  const used = new Set();

  for (const { helper, names, keys } of GROUPS) {
    for (const name of names) {
      const decl = new RegExp(`^const ${name}(\\s*:[^=]+)?\\s*=\\s*\\[`, "m");
      if (!decl.test(src) || src.includes(`${name}_DEMO`)) continue;

      const start = src.search(decl);
      const eq = src.indexOf("=", start);
      const end = closeBracket(src, eq);
      if (end === -1) continue;
      const body = src.slice(eq, end);
      // Grille imbriquée : la projection porterait sur la mauvaise couche.
      if (/\{[^{}]*\[/.test(body)) continue;
      const row = /\{([^}]*)\}/.exec(body);
      if (!row) continue;
      const present = [...row[1].matchAll(/["']?(\w+)["']?\s*:/g)].map((m) => m[1]);
      const shape = keys.find((k) => k.match.every((f) => present.includes(f)));
      if (!shape) continue;

      src = src.replace(decl, (m) => m.replace(`const ${name}`, `const ${name}_DEMO`));
      const end2 = closeBracket(src, src.indexOf("=", src.indexOf(`const ${name}_DEMO`)));
      const eol = src.indexOf("\n", end2);
      if (eol === -1) continue;
      src = `${src.slice(0, eol + 1)}let ${name} = ${name}_DEMO;\n${src.slice(eol + 1)}`;

      const v = VAR[helper];
      /*
        Le spread de la ligne de démonstration fournit déjà le repli champ par
        champ : on n'écrase que ce que le client a rempli, et clientX écarte les
        entrées vides en amont.
      */
      assigns.push(
        `  ${name} = resolveList(\n` +
          `    ${helper}(SESSION_ARG)?.map((${v}, i) => ({ ...${name}_DEMO[i % ${name}_DEMO.length], ${shape.project()} })),\n` +
          `    ${name}_DEMO,\n` +
          `  );`,
      );
      used.add(helper);
      per[helper]++;
    }
  }

  if (assigns.length === 0) continue;

  const anchor =
    /\n(\s*)(sessionData = session;)/.exec(src) ||
    /\n(\s*)(bp = session\?\.businessProfile;)/.exec(src) ||
    /\n(\s*)(fd = session\?\.formData;)/.exec(src);
  if (!anchor) {
    notes.push(`${id}  aucun point d'assignation`);
    continue;
  }
  /*
    Les thèmes qui ne portaient que le useEffect mort n'importent pas
    resolveList : c'est justement pourquoi ils n'ont jamais rien affiché du
    client. On le leur pose plutôt que de les écarter.
  */
  if (!/from "@\/lib\/templates\/resolveList"/.test(src)) {
    /*
      Après la directive « use client », jamais après « le premier import » :
      un import multiligne commence par une ligne qui ressemble à un import
      complet, et s'y insérer coupe la déclaration en deux.
    */
    const dir = /^("use client";|'use client';)\n/.exec(src);
    const at = dir ? dir[0].length : 0;
    src =
      src.slice(0, at) +
      `import { resolveList } from "@/lib/templates/resolveList";\n` +
      src.slice(at);
  }
  const arg = src.includes("sessionData = session;") ? "sessionData" : "session";
  src = src.replace(anchor[0], `${anchor[0]}\n${assigns.join("\n").replaceAll("SESSION_ARG", arg)}`);

  const needed = [...used].filter((h) => !new RegExp(`\\b${h}\\b`).test(before));
  if (needed.length) {
    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, b) => {
        const have = new Set(b.split("\n").map((l) => l.trim().replace(/,$/, "")).filter(Boolean));
        needed.forEach((h) => have.add(h));
        return `import {\n${[...have].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
      });
    } else {
      src = src.replace(
        /(import \{ resolveList \} from "@\/lib\/templates\/resolveList";?)/,
        `$1\nimport {\n${needed.sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`,
      );
    }
  }

  if (src === before) continue;
  if (!dry) fs.writeFileSync(file, src);
  touched++;
}

for (const n of notes) console.log(n);
console.log(
  `${dry ? "[à blanc] " : ""}${touched} thème(s) — ${per.clientFaq} FAQ, ${per.clientTeam} équipe(s), ${per.clientAreas} zone(s)`,
);
