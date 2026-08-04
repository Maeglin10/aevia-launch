// Branche les listes déclarées dans le corps d'un composant.
//
//   node scripts/wire-local-lists.mjs [--dry] [impact-NN …]
//
// Les codemods précédents ne visaient que les constantes de module (« ^const »).
// Une bonne part du catalogue déclare ses listes à l'intérieur du composant, où
// la session est déjà en portée — il n'y a donc rien à remonter : on enveloppe
// le tableau sur place.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const CIBLES = process.argv.filter((a) => a.startsWith("impact-"));

const PROFILS = [
  {
    bloc: "avis", helper: "clientReviews", v: "r",
    exige: [["text", "quote", "texte"], ["name", "author", "auteur", "role"]],
    projette: (c) => {
      const t = ["text", "quote", "texte"].find((k) => c.includes(k));
      const a = ["name", "author", "auteur"].find((k) => c.includes(k));
      return a ? `${t}: r.text, ${a}: r.author` : `${t}: r.text`;
    },
  },
  {
    bloc: "equipe", helper: "clientTeam", v: "m",
    exige: [["name", "nom"], ["role", "poste", "fonction"]],
    interdit: ["quote", "texte", "price"],
    projette: (c) => `${["name","nom"].find(k=>c.includes(k))}: m.name, ${["role","poste","fonction"].find(k=>c.includes(k))}: m.role`,
  },
  {
    bloc: "chiffres", helper: "clientStats", v: "s",
    exige: [["value", "val", "num", "target"], ["label", "libelle", "suffix"]],
    projette: (c) => `${["value","val","num","target"].find(k=>c.includes(k))}: s.value, ${["label","libelle","suffix"].find(k=>c.includes(k))}: s.label`,
  },
  {
    bloc: "faq", helper: "clientFaq", v: "f",
    exige: [["q", "question"], ["a", "answer", "reponse"]],
    projette: (c) => `${["q","question"].find(k=>c.includes(k))}: f.q, ${["a","answer","reponse"].find(k=>c.includes(k))}: f.a`,
  },
  {
    bloc: "prestations", helper: "clientServices", v: "s",
    exige: [["title", "titre", "name", "nom", "label"], ["desc", "description", "text", "body", "sub", "subtitle", "price", "prix"]],
    interdit: ["href", "quote", "question", "number", "step"],
    projette: (c) => {
      const t = ["title","titre","name","nom","label"].find(k=>c.includes(k));
      const d = ["desc","description","text","body","sub","subtitle"].find(k=>c.includes(k));
      return d ? `${t}: s.title, ${d}: s.desc || ""` : `${t}: s.title`;
    },
  },
];

const EXCLUS = /^(nav|links|routes|pages|filters?|tabs?|categories|colors?|fonts?|slides?|words?|particles?|items)$/i;

let touched = 0;
const par = {};
const notes = [];

for (const id of CIBLES.length ? CIBLES : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  const avant = src;
  const helpers = new Set();
  let boucles = 0;

  for (;;) {
    if (boucles++ > 30) break;
    const decls = [...src.matchAll(/^([ \t]+)const ([a-zA-Z_][A-Za-z0-9_]*)\s*(?::[^=]+)?=\s*\[/gm)];
    let fait = false;
    for (const dm of decls) {
      const [, ind, nom] = dm;
      if (EXCLUS.test(nom)) continue;
      if (!new RegExp(`\\b${nom}\\.map\\(`).test(src)) continue;
      if (new RegExp(`const ${nom}[^=]*=\\s*resolveList`).test(src)) continue;

      // fin du tableau
      let i = src.indexOf("[", dm.index);
      let d = 0, fin = -1;
      for (let k = i; k < src.length; k++) {
        if (src[k] === "[") d++;
        else if (src[k] === "]") { d--; if (d === 0) { fin = k; break; } }
      }
      if (fin === -1) continue;
      const corps = src.slice(i, fin + 1);
      if (/=>/.test(corps)) continue;

      // première ligne, accolades imbriquées comprises
      const oq = corps.indexOf("{");
      if (oq === -1) continue;
      let p2 = 0, fq = -1;
      for (let k = oq; k < corps.length; k++) {
        if (corps[k] === "{") p2++;
        else if (corps[k] === "}") { p2--; if (p2 === 0) { fq = k; break; } }
      }
      if (fq === -1) continue;
      const cles = [...corps.slice(oq + 1, fq).replace(/<[^>]*>/g, "").replace(/\{[^{}]*\}/g, "")
        .matchAll(/["']?(\w+)["']?\s*:/g)].map((x) => x[1].toLowerCase());
      if ((corps.match(/\{/g) || []).length < 2) continue;

      // hooks dans le map de cette liste ?
      if (new RegExp(`\\b${nom}\\.map\\(\\s*\\(?[^)]{0,80}\\)?\\s*=>\\s*\\{[\\s\\S]{0,600}?use[A-Z]`).test(src)) {
        notes.push(`${id} ${nom} : hooks dans le .map`);
        continue;
      }

      const profil = PROFILS.find(
        (p) => p.exige.every((g) => g.some((k) => cles.includes(k))) &&
               !(p.interdit || []).some((k) => cles.includes(k)),
      );
      if (!profil) continue;

      const remp =
        `resolveList(\n${ind}  ${profil.helper}(SESSION)?.map((${profil.v}: any, i: number) => ({ ...(${corps})[i % (${corps}).length], ${profil.projette(cles)} })),\n` +
        `${ind}  ${corps},\n${ind})`;
      src = src.slice(0, i) + remp + src.slice(fin + 1);
      helpers.add(profil.helper);
      par[profil.bloc] = (par[profil.bloc] || 0) + 1;
      fait = true;
      break;
    }
    if (!fait) break;
  }

  if (helpers.size === 0) continue;
  /*
    La liste peut vivre dans un sous-composant, où la variable locale `session`
    n'existe pas. On préfère donc les variables de module, qui sont visibles
    partout dans le fichier.
  */
  const nomSession = /let sessionData: any = null;/.test(src)
    ? "sessionData"
    : /let bp: any = null;/.test(src)
      ? "{ formData: fd, businessProfile: bp }"
      : /let fd: any = null;/.test(src)
        ? "{ formData: fd }"
        : "session";
  src = src.replaceAll("SESSION", nomSession);

  if (!/from "@\/lib\/templates\/resolveList"/.test(src)) {
    const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = dir ? dir.index + dir[0].length : 0;
    src = src.slice(0, at) + `import { resolveList } from "@/lib/templates/resolveList";\n` + src.slice(at);
  }
  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (mm, b) => {
      const ont = new Set(b.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      helpers.forEach((h) => ont.add(h));
      return `import {\n${[...ont].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
    });
  } else {
    const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = dir ? dir.index + dir[0].length : 0;
    src = src.slice(0, at) + `import {\n${[...helpers].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";\n` + src.slice(at);
  }

  if (src === avant) continue;
  if (!dry) fs.writeFileSync(file, src);
  touched++;
}

for (const n of notes.slice(0, 8)) console.log(n);
console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s) —`, par);
