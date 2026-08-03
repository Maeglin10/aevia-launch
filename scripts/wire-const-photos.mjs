// Branche les images rangées dans les constantes sur les photos du client.
//
//   node scripts/wire-const-photos.mjs [--dry]
//
// Le codemod des photos ne pouvait traiter que les positions évaluées au rendu —
// 69 sur près de 1500. Le reste vit dans des constantes de module, évaluées à
// l'import, quand aucune session n'existe : y écrire un appel n'aurait rien
// produit.
//
// La constante devient `X_DEMO`, et `X` un `let` de module réassigné pendant le
// rendu avec les photos du client à la place des images du thème — le même
// idiome que fd, c et bp. Chaque thème garde un compteur : deux sections ne
// réclament pas la même photo.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const IMG_KEYS = ["img", "image", "photo", "avatar", "bgImage", "cover", "src", "picture"];

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
let slots = 0;
const notes = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  const before = src;
  const assigns = [];
  let offset = 0;

  // Les constantes de module dont les lignes portent une image distante.
  const names = [...src.matchAll(/^const ([A-Z][A-Z0-9_]*)\s*(?::[^=]+)?=\s*\[/gm)].map((m) => m[1]);
  for (const name of new Set(names)) {
    if (src.includes(`${name}_DEMO`) || name.endsWith("_DEMO")) continue;
    const start = src.search(new RegExp(`^const ${name}\\b`, "m"));
    const eq = src.indexOf("=", start);
    const end = closeBracket(src, eq);
    if (end === -1) continue;
    const body = src.slice(eq, end);
    const key = IMG_KEYS.find((k) =>
      new RegExp(`["']?${k}["']?\\s*:\\s*["'\`]https?://[^"'\`]+\\.(?:jpe?g|png|webp|avif)|["']?${k}["']?\\s*:\\s*["'\`]https?://images\\.(?:unsplash|pexels)`).test(body),
    );
    if (!key) continue;
    const rows = (body.match(/["']?(?:img|image|photo|avatar|bgImage|cover|src|picture)["']?\s*:\s*["'`]https?:\/\//g) || []).length;
    if (rows === 0) continue;

    src = src.replace(
      new RegExp(`^const ${name}\\b`, "m"),
      `const ${name}_DEMO`,
    );
    const end2 = closeBracket(src, src.indexOf("=", src.indexOf(`const ${name}_DEMO`)));
    const eol = src.indexOf("\n", end2);
    if (eol === -1) continue;
    src = `${src.slice(0, eol + 1)}let ${name} = ${name}_DEMO;\n${src.slice(eol + 1)}`;

    assigns.push(
      `  ${name} = ${name}_DEMO.map((row, i) => ({\n` +
        `    ...row,\n` +
        `    ${key}: clientPhotos(SESSION_ARG)[${offset} + i] || row.${key},\n` +
        `  }));`,
    );
    offset += rows;
    slots += rows;
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
  const arg = src.includes("sessionData = session;") ? "sessionData" : "session";
  src = src.replace(anchor[0], `${anchor[0]}\n${assigns.join("\n").replaceAll("SESSION_ARG", arg)}`);

  if (!/\bclientPhotos\b/.test(before)) {
    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, b) => {
        const have = new Set(b.split("\n").map((l) => l.trim().replace(/,$/, "")).filter(Boolean));
        have.add("clientPhotos");
        return `import {\n${[...have].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
      });
    } else {
      const dir = /^("use client";|'use client';)\n/.exec(src);
      const at = dir ? dir[0].length : 0;
      src =
        src.slice(0, at) +
        `import { clientPhotos } from "@/lib/templates/clientContent";\n` +
        src.slice(at);
    }
  }

  if (src === before) continue;
  if (!dry) fs.writeFileSync(file, src);
  touched++;
}

for (const n of notes) console.log(n);
console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s), ${slots} image(s) de constante branchée(s)`);
