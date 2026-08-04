// Fait porter au pied de page des layouts le nom et la ville du client.
//
//   node scripts/wire-layout-footer.mjs [--dry]
//
// Soixante-deux thèmes rendent leur pied dans un `layout.tsx` à eux, resté hors
// de portée des passes précédentes. On y lit « © 2026 Raphaël Genet · Paris,
// France » sur le site d'un client qui n'est ni Raphaël Genet ni parisien.
//
// La mention « Aevia WS — SIREN … » n'est pas touchée : c'est l'éditeur du site,
// et elle doit rester telle quelle.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const VILLES =
  /\b(Paris|Lyon|Marseille|Bordeaux|Toulouse|Nantes|Lille|Strasbourg|Rennes|Montpellier|Nice|Grenoble|Annecy|Genève|Lausanne|Bourg-en-Bresse|Bruxelles)\b/;

let nomsFaits = 0;
let villesFaites = 0;
const touches = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "layout.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  const avant = src;

  const arg = /__layoutSession/.test(src) ? "__layoutSession" : null;
  if (!arg) continue;

  // « © 2026 Marque … » : la marque va jusqu'au premier séparateur.
  src = src.replace(
    /(©\s*(?:20\d\d)\s+)([^<>{}·—|.]+?)(\s*(?:[·—|.]|<|\{|$))/g,
    (m0, tete, marque, queue) => {
      const propre = marque.trim();
      if (!propre || propre.length < 2) return m0;
      if (/^Aevia/i.test(propre)) return m0;           // l'éditeur du site
      if (/^\{/.test(propre)) return m0;
      nomsFaits++;
      return `${tete}{/* NOM_PIED */ clientName(${arg}) ?? "${propre.replace(/"/g, "&quot;")}"}${queue}`;
    },
  );

  // « · Paris, France » dans la même ligne de pied.
  src = src.replace(/(NOM_PIED[\s\S]{0,120}?[·,]\s*)([A-ZÉÈÀ][\wéèêàçô-]+)(,\s*France)?/g, (m0, tete, ville, pays) => {
    if (!VILLES.test(ville)) return m0;
    villesFaites++;
    return `${tete}{clientCity(${arg}) ?? "${ville}"}${pays ?? ""}`;
  });

  if (src === avant) continue;

  const besoin = ["clientName"];
  if (/clientCity\(/.test(src)) besoin.push("clientCity");
  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
      const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      for (const n of besoin) noms.add(n);
      return "import {\n" + [...noms].sort().map((n) => `  ${n},\n`).join("") + '} from "@/lib/templates/clientContent";';
    });
  } else {
    const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
    const at = d ? d.index + d[0].length : 0;
    src = src.slice(0, at) + `import { ${besoin.join(", ")} } from "@/lib/templates/clientContent";\n` + src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  touches.push(id);
}

console.log(`${dry ? "[à blanc] " : ""}${nomsFaits} nom(s) et ${villesFaites} ville(s) sur ${touches.length} layout(s)`);
console.log(touches.join(" "));
