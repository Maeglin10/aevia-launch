// Branche les tableaux anonymes écrits dans le rendu.
//
//   node scripts/wire-anon-inline.mjs <bloc> [--dry] [impact-NN …]
//
// Dernier motif restant : « {[ { … }, { … } ].map(…) } » sans constante nommée,
// écrit directement dans le JSX. Les codemods précédents cherchaient une
// déclaration ; ici il n'y en a pas.
//
// Le tableau est extrait en constante de module, la variable prend le nom du
// bloc, et le rendu ne change que d'un identifiant.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const bloc = process.argv[2];
const CIBLES = process.argv.filter((a) => a.startsWith("impact-"));

const PROFILS = {
  avis: { helper: "clientReviews", v: "r", a: ["text", "quote", "texte"], b: ["name", "author", "auteur", "role"],
    proj: (t, n) => `${t}: r.text${n ? `, ${n}: r.author` : ""}` },
  prestations: { helper: "clientServices", v: "s", a: ["title", "titre", "name", "nom", "label"],
    b: ["desc", "description", "text", "body", "sub", "subtitle"],
    proj: (t, d) => `${t}: s.title${d ? `, ${d}: s.desc || ""` : ""}` },
  tarifs: { helper: "clientServices", v: "s", a: ["name", "title", "titre", "a", "label"], b: ["price", "prix", "p", "tarif"],
    proj: (t, p) => `${t}: s.title, ${p}: s.price ?? SRC[i % SRC.length].${p}` },
  chiffres: { helper: "clientStats", v: "s", a: ["value", "val", "num", "target"], b: ["label", "libelle", "suffix"],
    proj: (v, l) => `${v}: s.value, ${l}: s.label` },
  equipe: { helper: "clientTeam", v: "m", a: ["name", "nom"], b: ["role", "poste", "fonction"],
    proj: (n, r) => `${n}: m.name, ${r}: m.role` },
  faq: { helper: "clientFaq", v: "f", a: ["q", "question"], b: ["a", "answer", "reponse"],
    proj: (q, a) => `${q}: f.q, ${a}: f.a` },
};
const P = PROFILS[bloc];
if (!P) {
  console.error("usage: node scripts/wire-anon-inline.mjs avis|prestations|tarifs|chiffres|equipe|faq [--dry] [impact-NN …]");
  process.exit(1);
}

let touched = 0;
let n = 0;
const notes = [];

for (const id of CIBLES.length ? CIBLES : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (new RegExp(`${P.helper}\\s*\\(`).test(src)) continue;
  const nom = `${bloc.toUpperCase()}_ANON`;
  if (src.includes(nom)) continue;

  const re = /\{\s*\[\s*\n?\s*\{/g;
  let m = null;
  let choisi = null;
  while ((m = re.exec(src))) {
    const deb = src.indexOf("[", m.index);
    let d = 0;
    let fin = -1;
    for (let x = deb; x < src.length; x++) {
      if (src[x] === "[") d++;
      else if (src[x] === "]") {
        d--;
        if (d === 0) {
          fin = x;
          break;
        }
      }
    }
    if (fin === -1) continue;
    const corps = src.slice(deb, fin + 1);
    if (/=>|\$\{/.test(corps)) continue;
    /*
      Le tableau monte au niveau du module : s'il référence une constante
      déclarée plus bas — la palette « C », une icône — il la lirait avant sa
      déclaration. On le laisse alors où il est.
    */
    if (/\b[A-Z][A-Za-z0-9_]*\s*[.\[]/.test(corps)) continue;
    if ((corps.match(/\{/g) || []).length < 2) continue;
    // suivi d'un .map ?
    const apres = src.slice(fin + 1, fin + 12);
    if (!/^\s*\.map\(/.test(apres)) continue;
    // hooks dans ce map ?
    if (/^\s*\.map\(\s*\(?[^)]{0,80}\)?\s*=>\s*\{[\s\S]{0,600}?use[A-Z]/.test(apres + src.slice(fin + 12, fin + 700))) continue;

    const oq = corps.indexOf("{");
    let p2 = 0;
    let fq = -1;
    for (let x = oq; x < corps.length; x++) {
      if (corps[x] === "{") p2++;
      else if (corps[x] === "}") {
        p2--;
        if (p2 === 0) {
          fq = x;
          break;
        }
      }
    }
    const cles = [...corps.slice(oq + 1, fq).replace(/<[^>]*>/g, "").replace(/\{[^{}]*\}/g, "")
      .matchAll(/["']?(\w+)["']?\s*:/g)].map((x) => x[1].toLowerCase());
    const ka = P.a.find((k) => cles.includes(k));
    const kb = P.b.find((k) => cles.includes(k));
    if (!ka || !kb) continue;
    choisi = { deb, fin, corps, ka, kb };
    break;
  }
  if (!choisi) {
    notes.push(`${id} : aucun tableau anonyme ${bloc}`);
    continue;
  }

  const d = /\blet (?:fd|sessionData): any = null;/.exec(src);
  const anc = /\n(\s*)(sessionData = session;|fd = session\?\.formData;)/.exec(src);
  if (!d || !anc) {
    notes.push(`${id} : pas de portée module`);
    continue;
  }
  const arg = /let sessionData: any = null;/.test(src) ? "sessionData" : "{ formData: fd }";

  src = src.slice(0, choisi.deb) + nom + src.slice(choisi.fin + 1);
  const decl = `\n// ${bloc}, jusqu'ici écrit dans le rendu sans constante nommée.\nconst ${nom}_SOURCE = ${choisi.corps};\nlet ${nom} = ${nom}_SOURCE;\n`;
  src = src.slice(0, d.index + d[0].length) + decl + src.slice(d.index + d[0].length);

  const anc2 = /\n(\s*)(sessionData = session;|fd = session\?\.formData;)/.exec(src);
  const proj = P.proj(choisi.ka, choisi.kb).replaceAll("SRC", `${nom}_SOURCE`);
  src =
    src.slice(0, anc2.index + anc2[0].length) +
    `\n${anc2[1]}${nom} = resolveList(\n${anc2[1]}  ${P.helper}(${arg})?.map((${P.v}: any, i: number) => ({ ...${nom}_SOURCE[i % ${nom}_SOURCE.length], ${proj} })),\n${anc2[1]}  ${nom}_SOURCE,\n${anc2[1]});` +
    src.slice(anc2.index + anc2[0].length);

  if (!/from "@\/lib\/templates\/resolveList"/.test(src)) {
    const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = dir ? dir.index + dir[0].length : 0;
    src = src.slice(0, at) + `import { resolveList } from "@/lib/templates/resolveList";\n` + src.slice(at);
  }
  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (mm, b) => {
      const ont = new Set(b.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      ont.add(P.helper);
      return `import {\n${[...ont].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
    });
  } else {
    const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = dir ? dir.index + dir[0].length : 0;
    src = src.slice(0, at) + `import { ${P.helper} } from "@/lib/templates/clientContent";\n` + src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  touched++;
  n++;
}

for (const x of notes.slice(0, 6)) console.log(x);
console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s) — ${bloc} anonyme branché`);
