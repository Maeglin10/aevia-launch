// Branche les listes de chiffres clés écrites directement dans le rendu.
//
//   node scripts/wire-inline-stats.mjs [--dry]
//
// Ces thèmes n'ont pas de constante nommée : la liste est écrite dans le JSX,
// « {[{ value: "3 500+", label: "Animaux soignés" }, …].map(…) } ». Les codemods
// précédents ne visaient que les constantes de module et les ont tous manqués.
//
// La liste est extraite en constante, la variable devient un `let` réassigné au
// rendu, et le JSX ne change que d'un nom. Ce qui n'est pas demandé au client —
// une icône, un suffixe — reste celui du thème.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const CIBLES = process.argv.filter((a) => a.startsWith("impact-"));

const VALEUR = ["value", "val", "num", "chiffre", "target"];
const LIBELLE = ["label", "libelle", "text", "sub", "title"];

let touched = 0;
const notes = [];

for (const id of CIBLES.length ? CIBLES : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (/clientStats\s*\(/.test(src) || src.includes("STATS_INLINE")) continue;

  // Un tableau littéral dans le rendu, suivi de .map, dont les lignes ont une
  // valeur et un libellé.
  /*
    Le tableau est presque toujours écrit sur plusieurs lignes, indenté sous le
    « {[ ». Exiger l'accolade collée ne trouvait que deux thèmes sur six.
  */
  const re = /\{\[\s*\n?\s*(\{[^[\]]{0,1400}?\})\s*,?\s*\n?\s*\]\.map\(/g;
  let m = null;
  let trouve = null;
  while ((m = re.exec(src))) {
    const corps = m[1];
    /*
      Une liste qui contient une interpolation ou un appel ne peut pas monter au
      niveau du module : elle y serait évaluée à l'import, quand la session
      n'existe pas. Un thème avait ainsi vu « ${clientCity(...)} » figé sur la
      ville de démonstration.
    */
    if (/\$\{|\w+\(/.test(corps)) continue;

    const cles = [...corps.matchAll(/["']?(\w+)["']?\s*:/g)].map((x) => x[1].toLowerCase());
    const v = VALEUR.find((k) => cles.includes(k));
    const l = LIBELLE.find((k) => cles.includes(k));
    const lignes = (corps.match(/\{/g) || []).length;
    if (v && l && lignes >= 3) {
      /*
        Un `.map` qui appelle des hooks dans son corps ne peut pas recevoir une
        liste de longueur variable : le nombre de hooks suivrait la longueur, qui
        change quand la session arrive, et React lève l'erreur #300 en emportant
        la page. Ce cas a été créé par ce codemod même sur un thème avant d'être
        vu. Il faut d'abord extraire un composant par élément.
      */
      const suite = src.slice(re.lastIndex, re.lastIndex + 700);
      if (/\buse[A-Z]\w*\s*\(/.test(suite)) {
        notes.push(`${id} : hooks dans le .map — extraire un composant d'abord`);
        continue;
      }
      trouve = { debut: m.index, fin: re.lastIndex, corps, v, l };
      break;
    }
  }
  if (!trouve) {
    notes.push(`${id} : aucune liste de chiffres dans le rendu`);
    continue;
  }

  const decl =
    `\n// Les chiffres clés, jusqu'ici écrits dans le rendu : le client pouvait les\n` +
    `// saisir, le thème ne les lisait pas.\n` +
    `const STATS_INLINE_SOURCE = [\n  ${trouve.corps.trim()}\n];\n` +
    `let STATS_INLINE = STATS_INLINE_SOURCE;\n`;

  src = src.slice(0, trouve.debut) + "{STATS_INLINE.map(" + src.slice(trouve.fin);

  const d = /\blet (?:fd|sessionData): any = null;/.exec(src);
  if (!d) {
    notes.push(`${id} : pas de variable de module`);
    continue;
  }
  src = src.slice(0, d.index + d[0].length) + "\n" + decl + src.slice(d.index + d[0].length);

  const a = /\n(\s*)(sessionData = session;|fd = session\?\.formData;)/.exec(src);
  if (!a) {
    notes.push(`${id} : aucun point d'assignation`);
    continue;
  }
  const arg = src.includes("sessionData = session;") ? "sessionData" : "session";
  const proj =
    `\n${a[1]}STATS_INLINE = resolveList(\n` +
    `${a[1]}  clientStats(${arg})?.map((s: any, i: number) => ({\n` +
    `${a[1]}    ...STATS_INLINE_SOURCE[i % STATS_INLINE_SOURCE.length],\n` +
    `${a[1]}    ${trouve.v}: s.value,\n` +
    `${a[1]}    ${trouve.l}: s.label,\n` +
    `${a[1]}  })),\n${a[1]}  STATS_INLINE_SOURCE,\n${a[1]});`;
  src = src.slice(0, a.index + a[0].length) + proj + src.slice(a.index + a[0].length);

  if (!/from "@\/lib\/templates\/resolveList"/.test(src)) {
    const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = dir ? dir.index + dir[0].length : 0;
    src = src.slice(0, at) + `import { resolveList } from "@/lib/templates/resolveList";\n` + src.slice(at);
  }
  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (mm, b) => {
      const ont = new Set(b.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      ont.add("clientStats");
      return `import {\n${[...ont].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
    });
  } else {
    const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = dir ? dir.index + dir[0].length : 0;
    src = src.slice(0, at) + `import { clientStats } from "@/lib/templates/clientContent";\n` + src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  touched++;
}

for (const n of notes) console.log(n);
console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s) — chiffres clés du rendu branchés`);
