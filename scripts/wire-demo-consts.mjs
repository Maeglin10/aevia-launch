// Câble les constantes déjà nommées « X_DEMO » par les auteurs des thèmes.
//
//   node scripts/wire-demo-consts.mjs [--dry]
//
// 98 thèmes importent clientServices ou clientReviews sans jamais les appeler :
// leur seul câblage vivait dans le useEffect mort, supprimé depuis. Beaucoup ont
// pourtant une liste nommée — SERVICES_DEMO, TESTIMONIALS_DEMO — que les
// codemods précédents sautaient, puisqu'ils cherchaient « const SERVICES » et
// refusaient tout nom finissant déjà par _DEMO.
//
// On garde le nom que le JSX emploie. La déclaration devient X_SOURCE, et X_DEMO
// un `let` réassigné au rendu : aucune ligne de rendu ne change.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const GROUPES = [
  {
    helper: "clientServices",
    bases: ["SERVICES", "PRESTATIONS", "PRODUCTS", "PRODUITS", "COLLECTIONS", "FEATURES", "OFFRES", "SOINS", "TREATMENTS"],
    v: "s",
    formes: [
      { cles: ["title", "desc"], proj: "title: s.title" },
      { cles: ["title", "description"], proj: "title: s.title" },
      { cles: ["titre", "desc"], proj: "titre: s.title" },
      { cles: ["name", "desc"], proj: "name: s.title" },
      { cles: ["name", "description"], proj: "name: s.title" },
      { cles: ["label", "desc"], proj: "label: s.title" },
    ],
  },
  {
    helper: "clientReviews",
    bases: ["TESTIMONIALS", "AVIS", "REVIEWS", "TEMOIGNAGES"],
    v: "r",
    formes: [
      { cles: ["name", "text"], proj: "name: r.author, text: r.text" },
      { cles: ["name", "quote"], proj: "name: r.author, quote: r.text" },
      { cles: ["auteur", "texte"], proj: "auteur: r.author, texte: r.text" },
      { cles: ["author", "quote"], proj: "author: r.author, quote: r.text" },
      { cles: ["author", "text"], proj: "author: r.author, text: r.text" },
    ],
  },
];

function ferme(src, depuis) {
  let i = src.indexOf("[", depuis);
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
const par = { clientServices: 0, clientReviews: 0 };

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  const avant = src;
  const assigns = [];

  for (const { helper, bases, v, formes } of GROUPES) {
    /*
      Le helper doit être disponible — importé ou ajoutable. On ne saute plus les
      thèmes qui l'appellent déjà ailleurs : une page peut avoir deux listes, une
      câblée et une autre restée sur la démonstration.
    */
    for (const base of bases) {
      /*
        Les deux graphies. Les auteurs ont nommé certaines listes X_DEMO dès
        l'origine ; les codemods précédents cherchaient « const X » et refusaient
        tout nom finissant par _DEMO, si bien que ces listes n'étaient jamais
        vues, ni sous un nom ni sous l'autre.
      */
      const nom = [`${base}_DEMO`, base].find((n) =>
        new RegExp(`^const ${n}(\\s*:[^=]+)?\\s*=\\s*\\[`, "m").test(src),
      );
      if (!nom) continue;
      const decl = new RegExp(`^const ${nom}(\\s*:[^=]+)?\\s*=\\s*\\[`, "m");
      if (src.includes(`${base}_SOURCE`)) continue;
      // Déjà alimentée au rendu : rien à faire.
      if (new RegExp(`\\b${nom}\\s*=\\s*resolveList`).test(src)) continue;
      /*
        Déjà le repli d'un câblage existant : la câbler une seconde fois
        remplirait la démonstration avec la donnée du client avant qu'elle ne
        serve de repli, ce qui la viderait de son rôle.
      */
      if (new RegExp(`resolveList\\([^)]*,\\s*${nom}\\b`, "s").test(src)) continue;

      const debut = src.search(decl);
      const eq = src.indexOf("=", debut);
      const fin = ferme(src, eq);
      if (fin === -1) continue;
      const corps = src.slice(eq, fin);
      if (/\{[^{}]*\[/.test(corps)) continue; // liste imbriquée
      const ligne = /\{([^}]*)\}/.exec(corps);
      if (!ligne) continue;
      const presentes = [...ligne[1].matchAll(/["']?(\w+)["']?\s*:/g)].map((m) => m[1].toLowerCase());
      const forme = formes.find((f) => f.cles.every((k) => presentes.includes(k)));
      if (!forme) continue;

      src = src.replace(decl, (m) => m.replace(`const ${nom}`, `const ${base}_SOURCE`));
      const fin2 = ferme(src, src.indexOf("=", src.indexOf(`const ${base}_SOURCE`)));
      const eol = src.indexOf("\n", fin2);
      if (eol === -1) continue;
      src = `${src.slice(0, eol + 1)}let ${nom} = ${base}_SOURCE;\n${src.slice(eol + 1)}`;

      assigns.push(
        `  ${nom} = resolveList(\n` +
          `    ${helper}(SESSION)?.map((${v}: any, i: number) => ({ ...${base}_SOURCE[i % ${base}_SOURCE.length], ${forme.proj} })),\n` +
          `    ${base}_SOURCE,\n` +
          `  );`,
      );
      par[helper]++;
    }
  }

  if (assigns.length === 0) continue;

  const ancre =
    /\n(\s*)(sessionData = session;)/.exec(src) ||
    /\n(\s*)(bp = session\?\.businessProfile;)/.exec(src) ||
    /\n(\s*)(fd = session\?\.formData;)/.exec(src);
  if (!ancre) continue;
  const arg = src.includes("sessionData = session;") ? "sessionData" : "session";
  src = src.replace(ancre[0], `${ancre[0]}\n${assigns.join("\n").replaceAll("SESSION", arg)}`);

  const besoins = [...new Set(assigns.map((a) => (a.includes("clientReviews") ? "clientReviews" : "clientServices")))];
  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, b) => {
      const ont = new Set(b.split("\n").map((l) => l.trim().replace(/,$/, "")).filter(Boolean));
      besoins.forEach((h) => ont.add(h));
      return `import {\n${[...ont].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
    });
  } else {
    const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = dir ? dir.index + dir[0].length : 0;
    src = src.slice(0, at) + `import {\n${besoins.sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";\n` + src.slice(at);
  }
  if (!/from "@\/lib\/templates\/resolveList"/.test(src)) {
    const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = dir ? dir.index + dir[0].length : 0;
    src = src.slice(0, at) + `import { resolveList } from "@/lib/templates/resolveList";\n` + src.slice(at);
  }

  if (src === avant) continue;
  if (!dry) fs.writeFileSync(file, src);
  touched++;
}

console.log(
  `${dry ? "[à blanc] " : ""}${touched} thème(s) — ${par.clientServices} prestation(s), ${par.clientReviews} avis`,
);
