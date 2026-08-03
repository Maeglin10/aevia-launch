// Branche le nom de marque du thème sur celui du client.
//
//   node scripts/wire-brand.mjs [--dry]
//
// 177 thèmes n'affichaient nulle part le nom de l'entreprise du client alors
// que 360 lisent `fd?.businessName` quelque part : ils le lisent dans un endroit
// (une balise title, un attribut alt) et gardent leur propre marque partout où
// le visiteur la voit — en-tête, pied de page, signature.
//
// Le registre connaît le nom de démonstration de chaque thème. C'est une cible
// exacte, contrairement à une devinette sur la casse ou la position : 1291
// occurrences sur 272 thèmes.
//
// Seules les positions de rendu sont réécrites, et seulement après la
// déclaration de `fd` : au-dessus, la constante est évaluée à l'import et
// l'appel ne produirait rien.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const reg = fs.readFileSync(path.join(process.cwd(), "lib/templates/registry.ts"), "utf8");
const NAMES = new Map();
for (const m of reg.matchAll(/id:\s*"(impact-\d+)",\s*\n\s*name:\s*"([^"]+)"/g)) {
  NAMES.set(m[1], m[2]);
}

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

let touched = 0;
let count = 0;

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  const nom = NAMES.get(id);
  if (!nom || nom.length < 4) continue;

  const original = fs.readFileSync(file, "utf8");
  const decl = /\blet (?:fd|sessionData): any = null;/.exec(original);
  if (!decl) continue;
  const cut = decl.index + decl[0].length;
  const tete = original.slice(0, cut);
  let src = original.slice(cut);
  let n = 0;

  // Les graphies du même nom : « Toits de Loire », « TOITS DE LOIRE », collé.
  const variantes = [...new Set([nom, nom.toUpperCase(), nom.replace(/\s+/g, ""), nom.toUpperCase().replace(/\s+/g, "")])]
    .sort((a, b) => b.length - a.length);

  for (const v of variantes) {
    // Texte JSX entier : >Toits de Loire<
    src = src.replace(new RegExp(`>(\\s*)${esc(v)}(\\s*)<`, "g"), (m, a, b) => {
      n++;
      return `>${a}{clientName(SESSION_ARG) ?? ${JSON.stringify(v)}}${b}<`;
    });
    // Chaîne dont c'est toute la valeur, hors attributs techniques.
    src = src.replace(
      new RegExp(`(?<!(?:href|src|id|className|key|alt)=)(["'])${esc(v)}\\1`, "g"),
      (m, q) => {
        n++;
        return `(clientName(SESSION_ARG) ?? ${JSON.stringify(v)})`;
      },
    );
  }

  if (n === 0) continue;
  src = tete + src;
  const hasSessionData = /sessionData = session;/.test(src);
  const hasFd = /\blet fd: any = null;/.test(src);
  if (!hasSessionData && !hasFd) continue;
  src = src.replaceAll("SESSION_ARG", hasSessionData ? "sessionData" : "{ formData: fd }");

  if (!/\bclientName\b/.test(original)) {
    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, b) => {
        const have = new Set(b.split("\n").map((l) => l.trim().replace(/,$/, "")).filter(Boolean));
        have.add("clientName");
        return `import {\n${[...have].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
      });
    } else {
      const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
      const at = dir ? dir.index + dir[0].length : 0;
      src = src.slice(0, at) + `import { clientName } from "@/lib/templates/clientContent";\n` + src.slice(at);
    }
  }

  if (src === original) continue;
  if (!dry) fs.writeFileSync(file, src);
  touched++;
  count += n;
}

console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s), ${count} mention(s) de marque branchée(s)`);
