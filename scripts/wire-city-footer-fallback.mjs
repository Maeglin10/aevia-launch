// Donne sa ville au client sur les thèmes qui n'ont aucune ancre pour la porter.
//
//   node scripts/wire-city-footer-fallback.mjs [--dry]
//
// 70 thèmes n'affichent pas la ville du client, et 43 d'entre eux en affichent
// une en dur : un client lyonnais lit « Paris » sur son propre site. C'est pire
// que pas de ville du tout, et pour une entreprise locale c'est la première
// chose qu'un visiteur cherche.
//
// La prose n'est pas touchée — « quinze ans entre Paris et Londres » raconte une
// histoire. On ajoute une ligne en fin de page avec le nom et la ville, quand le
// thème n'a ni ligne de copyright ni mention déjà branchée.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

let touched = 0;
const laisses = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (/clientCity\s*\(/.test(src)) continue;
  if (src.includes("PIED_MINIMAL")) continue;

  const module = /\blet (?:fd|sessionData): any = null;/.test(src);
  if (!module) {
    laisses.push(`${id} (pas de variable de module)`);
    continue;
  }
  const arg = /sessionData = session;/.test(src) ? "sessionData" : "{ formData: fd }";

  // Le rendu peut se terminer par un fragment « </> » et pas une balise nommée.
  const m = /\n(\s*)<\/(?:\w+)?>\s*\n\s*\);?\s*\n\}\s*$/.exec(src);
  if (!m) {
    laisses.push(`${id} (fin de rendu introuvable)`);
    continue;
  }
  const i = m[1];
  const pied =
    `\n${i}  {/* PIED_MINIMAL — ce thème n'affichait pas la ville du client */}\n` +
    `${i}  <footer style={{ padding: "40px 24px", textAlign: "center", fontSize: 13, letterSpacing: "0.08em", opacity: 0.55 }}>\n` +
    `${i}    {clientName(${arg}) ?? ${JSON.stringify(id)}}\n` +
    `${i}    {clientCity(${arg}) ? \` · \${clientCity(${arg})}\` : ""}\n` +
    `${i}  </footer>`;
  src = src.slice(0, m.index) + pied + src.slice(m.index);

  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (mm, b) => {
      const ont = new Set(b.split("\n").map((l) => l.trim().replace(/,$/, "")).filter(Boolean));
      ont.add("clientName");
      ont.add("clientCity");
      return `import {\n${[...ont].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
    });
  } else {
    const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = dir ? dir.index + dir[0].length : 0;
    src =
      src.slice(0, at) +
      `import {\n  clientCity,\n  clientName,\n} from "@/lib/templates/clientContent";\n` +
      src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  touched++;
}

if (laisses.length) console.log("laissés de côté :", laisses.join(", "));
console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s) dotés d'une ligne portant nom et ville`);
