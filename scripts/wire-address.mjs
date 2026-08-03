// Branche les adresses postales sur celle du client.
//
//   node scripts/wire-address.mjs [--dry]
//
// 67 thèmes affichent une adresse parisienne inventée. Sous le nom du client,
// c'est pire que pas d'adresse : un visiteur peut s'y rendre.
//
// L'adresse est saisie à l'étape légale (legal.companyAddress) et aucun thème
// ne la lisait. Celle du thème reste en repli, pour un client qui n'en donne
// pas — un site sans adresse vaut mieux qu'un site avec une fausse, mais la
// section du thème n'est pas supprimée pour autant, conformément à la règle.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const ADDR = /(\d{1,4}(?:,|\s)\s*(?:rue|avenue|boulevard|place|chemin|impasse|quai|allée|route)\s[^"'`<>{}\n]{3,70})/i;

let touched = 0;
let count = 0;

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  const before = src;
  let n = 0;

  // Texte JSX : >12 Rue de Paradis, Paris<
  src = src.replace(
    new RegExp(`>(\\s*)${ADDR.source}(\\s*)<`, "gi"),
    (m, a, addr, b) => {
      n++;
      return `>${a}{clientAddress(SESSION_ARG) ?? ${JSON.stringify(addr.trim())}}${b}<`;
    },
  );

  if (n === 0) continue;
  const hasSessionData = /sessionData = session;/.test(src);
  const hasFd = /\blet fd: any = null;/.test(src);
  if (!hasSessionData && !hasFd) continue;
  src = src.replaceAll("SESSION_ARG", hasSessionData ? "sessionData" : "{ businessProfile: bp }");

  if (!/\bclientAddress\b/.test(before)) {
    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, b) => {
        const have = new Set(b.split("\n").map((l) => l.trim().replace(/,$/, "")).filter(Boolean));
        have.add("clientAddress");
        return `import {\n${[...have].sort().map((h) => `  ${h},`).join("\n")}\n} from "@/lib/templates/clientContent";`;
      });
    } else {
      const dir = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
      const at = dir ? dir.index + dir[0].length : 0;
      src = src.slice(0, at) + `import { clientAddress } from "@/lib/templates/clientContent";\n` + src.slice(at);
    }
  }

  if (src === before) continue;
  if (!dry) fs.writeFileSync(file, src);
  touched++;
  count += n;
}

console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s), ${count} adresse(s) branchée(s)`);
