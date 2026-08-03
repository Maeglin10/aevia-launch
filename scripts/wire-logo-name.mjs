// Fait porter au bloc logo le nom de l'entreprise du client.
//
//   node scripts/wire-logo-name.mjs [--dry]
//
// 59 thèmes ne montrent le nom du client nulle part où un visiteur regarde : 46
// ne le lisent que dans un attribut (alt, title) et 13 ne le lisent pas du tout.
// Leur en-tête suit pourtant partout la même forme — le logo téléversé s'il
// existe, sinon un texte de marque écrit en dur :
//
//   {fd?.logoBase64 ? <img alt={fd?.businessName ?? 'logo'} … /> : (<> … Horizon … </>)}
//
// C'est ce texte de repli qu'on branche. Le nom du thème reste affiché pour un
// client qui n'a pas renseigné le sien.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const ATTRIBUT = /(?:alt|title|aria-label|content|key|placeholder)\s*=\s*\{?$/;

let touched = 0;
let count = 0;
const restants = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  const original = fs.readFileSync(file, "utf8");

  // Le nom est-il déjà visible quelque part ?
  const occ = [...original.matchAll(/(?:fd\?\.businessName|clientName\([^)]*\))/g)];
  const visible = occ.some((m) => !ATTRIBUT.test(original.slice(Math.max(0, m.index - 60), m.index)));
  if (visible) continue;

  const decl = /\blet (?:fd|sessionData): any = null;/.exec(original);
  if (!decl) continue;
  const arg = /sessionData = session;/.test(original) ? "sessionData" : "{ formData: fd }";

  // La branche de repli du logo, puis son premier texte littéral.
  const logo = /fd\?\.logo(?:Base64|Url)\s*\?[\s\S]{0,1400}?\)\s*:\s*\(/.exec(original);
  if (!logo) {
    restants.push(id);
    continue;
  }
  const depart = logo.index + logo[0].length;
  const fenetre = original.slice(depart, depart + 2500);
  const texte = />(\s*)([A-Za-zÀ-ÿ][A-Za-zÀ-ÿ0-9&'’. -]{2,34})(\s*)</.exec(fenetre);
  if (!texte) {
    restants.push(id);
    continue;
  }

  const remplace =
    `>${texte[1]}{clientName(${arg}) ?? ${JSON.stringify(texte[2].trim())}}${texte[3]}<`;
  let src =
    original.slice(0, depart) +
    fenetre.slice(0, texte.index) +
    remplace +
    fenetre.slice(texte.index + texte[0].length) +
    original.slice(depart + 2500);

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
  count++;
}

console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s) branché(s), ${restants.length} sans bloc logo reconnaissable`);
if (restants.length) console.log("  à traiter à la main :", restants.join(" "));
