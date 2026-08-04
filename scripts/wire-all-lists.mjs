// Branche toute liste rendue d'un thème sur la donnée correspondante du client.
//
//   node scripts/wire-all-lists.mjs [--dry] [impact-NN …]
//
// Les codemods précédents visaient un bloc à la fois, avec une liste de noms de
// constantes. Les thèmes en emploient trop — NODES, PILLARS, CREATIONS,
// EXPERIENCES, TREATMENTS… — pour que l'énumération tienne. Celui-ci ne regarde
// que deux choses : la forme des lignes, et le fait que la liste soit rendue.
//
// Ce qui n'est pas demandé au client reste au thème : icône, image, couleur,
// identifiant. Seuls les champs que le wizard collecte sont remplacés.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const CIBLES = process.argv.filter((a) => a.startsWith("impact-"));

// Ordre important : le premier profil qui correspond gagne. Les avis passent
// avant les prestations, car une ligne d'avis a souvent aussi un titre.
const PROFILS = [
  {
    bloc: "avis",
    helper: "clientReviews",
    v: "r",
    exige: [
      ["text", "quote", "texte", "avis", "temoignage"],
      ["name", "author", "auteur", "nom", "role", "poste"],
    ],
    projette: (c) => {
      const t = ["text", "quote", "texte", "avis", "temoignage"].find((k) => c.includes(k));
      const a = ["name", "author", "auteur", "nom"].find((k) => c.includes(k));
      return a ? `${t}: r.text, ${a}: r.author` : `${t}: r.text`;
    },
  },
  {
    bloc: "equipe",
    helper: "clientTeam",
    v: "m",
    exige: [["name", "nom"], ["role", "poste", "fonction"]],
    interdit: ["quote", "texte", "price", "prix"],
    projette: (c) => {
      const n = ["name", "nom"].find((k) => c.includes(k));
      const r = ["role", "poste", "fonction"].find((k) => c.includes(k));
      return `${n}: m.name, ${r}: m.role`;
    },
  },
  {
    bloc: "chiffres",
    helper: "clientStats",
    v: "s",
    exige: [["value", "val", "num", "target", "chiffre"], ["label", "libelle", "suffix"]],
    interdit: ["href", "icon_only"],
    projette: (c) => {
      const v = ["value", "val", "num", "target", "chiffre"].find((k) => c.includes(k));
      const l = ["label", "libelle", "suffix"].find((k) => c.includes(k));
      return `${v}: s.value, ${l}: s.label`;
    },
  },
  {
    bloc: "faq",
    helper: "clientFaq",
    v: "f",
    exige: [["q", "question"], ["a", "answer", "reponse"]],
    projette: (c) => {
      const q = ["q", "question"].find((k) => c.includes(k));
      const a = ["a", "answer", "reponse"].find((k) => c.includes(k));
      return `${q}: f.q, ${a}: f.a`;
    },
  },
  {
    bloc: "prestations",
    helper: "clientServices",
    v: "s",
    exige: [
      ["title", "titre", "name", "nom", "label", "h", "acte", "a"],
      ["desc", "description", "text", "body", "sub", "subtitle", "p", "n", "price", "prix", "tarif"],
    ],
    interdit: ["href", "quote", "question", "number", "num", "step", "etape", "n°", "index"],
    projette: (c) => {
      const t = ["title", "titre", "name", "nom", "label", "h", "acte", "a"].find((k) => c.includes(k));
      const d = ["desc", "description", "text", "body", "sub", "subtitle", "n"].find((k) => c.includes(k));
      const p = ["price", "prix", "tarif", "p"].find((k) => c.includes(k));
      const parts = [`${t}: s.title`];
      if (d) parts.push(`${d}: s.desc || ${JSON.stringify("")} || ""`);
      if (p) parts.push(`${p}: s.price ?? ${"SOURCE"}[i % ${"SOURCE"}.length].${p}`);
      return parts.join(", ");
    },
  },
];

// Noms qui ne désignent jamais du contenu client.
/*
  Ni navigation, ni méthode, ni journal : ces listes ont une place propre dans le
  thème et le wizard ne les demande pas. Y verser les prestations du client
  remplacerait « Découvrir / Concevoir / Livrer » par ses trois services.
*/
const EXCLUS = /^(nav|links|routes|pages|filters?|tabs?|categories|colors?|fonts?|slides?|words?|particles?|NAV|MENU_LINKS|LINKS|ROUTES|PAGES|COLORS|C|FONTS|EASE|BREAKPOINTS|SOCIALS?|ICONS?|PROCESS|PROCESSUS|ETAPES|STEPS|METHODE|METHOD|TIMELINE|JOURNAL|BLOG|POSTS|ARTICLES|PRESSE|PRESS|AWARDS|CAREERS|JOBS|FAQ_NAV)/i;

function ferme(src, depuis, ouvre = "[", clos = "]") {
  let i = src.indexOf(ouvre, depuis);
  if (i === -1) return -1;
  let d = 0;
  for (; i < src.length; i++) {
    if (src[i] === ouvre) d++;
    else if (src[i] === clos) {
      d--;
      if (d === 0) return i;
    }
  }
  return -1;
}

let touched = 0;
const par = {};
const notes = [];

for (const id of CIBLES.length ? CIBLES : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  const avant = src;
  const assigns = [];
  const helpers = new Set();

  /*
    Majuscules et minuscules. Une bonne partie des thèmes nomme ses listes
    « courses », « testimonials », « plans », « stats » ; ne viser que les
    constantes capitalisées en laissait trente-trois de côté.
  */
  const decls = [...src.matchAll(/^const ([A-Za-z_][A-Za-z0-9_]*)\s*(?::[^=]+)?=\s*\[/gm)];
  for (const dm of decls) {
    const nom = dm[1];
    if (EXCLUS.test(nom)) continue;
    if (nom.endsWith("_SOURCE")) continue;
    // rendue quelque part ?
    if (!new RegExp(`\\b${nom}\\.map\\(`).test(src)) continue;
    // déjà alimentée ?
    if (new RegExp(`\\b${nom}\\s*=\\s*resolveList`).test(src)) continue;
    if (new RegExp(`resolveList\\([^)]{0,200},\\s*${nom}\\b`, "s").test(src)) continue;

    /*
      Les positions viennent d'un balayage fait avant toute réécriture : dès la
      première, elles dérivent. On retrouve donc la déclaration par son nom à
      chaque tour, sinon les découpes se font au milieu d'une autre.
    */
    const decl = new RegExp(`^const ${nom}\\b\\s*(?::[^=]+)?=\\s*\\[`, "m");
    const pos = src.search(decl);
    if (pos === -1) continue;
    const fin = ferme(src, pos);
    if (fin === -1) continue;
    const corps = src.slice(pos, fin);
    if (/\$\{|=>/.test(corps)) continue; // évaluée à l'import : pas d'expression
    /*
      Grille imbriquée — { category, items: [{ name, price }] } — : la première
      accolade est la ligne intérieure, et projeter dessus verse les prestations
      du client dans la mauvaise couche.
    */
    if (/\{[^{}]*\[/.test(corps)) continue;
    /*
      La première ligne, accolades imbriquées comprises. Une ligne contenant
      « icon: <Monitor size={28} /> » se terminait à l'accolade de size, et seul
      « icon » était vu — d'où des listes de prestations jugées sans forme.
    */
    const oq = corps.indexOf("{");
    if (oq === -1) continue;
    let prof = 0;
    let fq = -1;
    for (let k = oq; k < corps.length; k++) {
      if (corps[k] === "{") prof++;
      else if (corps[k] === "}") {
        prof--;
        if (prof === 0) {
          fq = k;
          break;
        }
      }
    }
    if (fq === -1) continue;
    const ligne = corps.slice(oq + 1, fq);
    // Ne garder que les clés du premier niveau : celles d'un attribut JSX
    // imbriqué ne décrivent pas la ligne.
    const sansImbrique = ligne.replace(/<[^>]*>/g, "").replace(/\{[^{}]*\}/g, "");
    const cles = [...sansImbrique.matchAll(/["']?(\w+)["']?\s*:/g)].map((x) => x[1].toLowerCase());
    if ((corps.match(/\{/g) || []).length < 2) continue;

    // hooks dans le map de cette liste ?
    const rendu = new RegExp(`\\b${nom}\\.map\\(\\s*\\(?[^)]{0,80}\\)?\\s*=>\\s*\\{[\\s\\S]{0,600}?use[A-Z]`);
    if (rendu.test(src)) {
      notes.push(`${id} ${nom} : hooks dans le .map`);
      continue;
    }

    const profil = PROFILS.find(
      (p) =>
        p.exige.every((g) => g.some((k) => cles.includes(k))) &&
        !(p.interdit || []).some((k) => cles.includes(k)),
    );
    if (!profil) continue;

    const source = `${nom}_SOURCE`;
    src = src.slice(0, pos) + `const ${source}` + src.slice(pos + `const ${nom}`.length);
    const fin2 = ferme(src, src.indexOf(`const ${source}`));
    /*
      Un tableau figé par « as const » est en lecture seule : resolveList rend un
      tableau modifiable, et le compilateur refuse. On dégèle ce tableau-là.
    */
    if (src.startsWith("] as const", fin2)) {
      src = src.slice(0, fin2) + "];" + src.slice(fin2 + "] as const;".length);
    }
    const fin2b = ferme(src, src.indexOf(`const ${source}`));
    const eol = src.indexOf("\n", fin2b);
    src = `${src.slice(0, eol + 1)}let ${nom} = ${source};\n${src.slice(eol + 1)}`;

    const proj = profil.projette(cles).replaceAll("SOURCE", source);
    assigns.push(
      `  ${nom} = resolveList(\n` +
        `    ${profil.helper}(ARG)?.map((${profil.v}: any, i: number) => ({ ...${source}[i % ${source}.length], ${proj} })),\n` +
        `    ${source},\n  );`,
    );
    helpers.add(profil.helper);
    par[profil.bloc] = (par[profil.bloc] || 0) + 1;
  }

  if (assigns.length === 0) continue;

  const anc = /\n(\s*)(sessionData = session;|bp = session\?\.businessProfile;|fd = session\?\.formData;)/.exec(src);
  if (!anc) {
    notes.push(`${id} : aucun point d'assignation`);
    continue;
  }
  const arg = src.includes("sessionData = session;") ? "sessionData" : "session";
  src = src.replace(anc[0], `${anc[0]}\n${assigns.join("\n").replaceAll("ARG", arg)}`);

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
    src =
      src.slice(0, at) +
      `import {\n${[...helpers].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";\n` +
      src.slice(at);
  }

  if (src === avant) continue;
  if (!dry) fs.writeFileSync(file, src);
  touched++;
}

for (const n of notes.slice(0, 12)) console.log(n);
console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s) —`, par);
