// La mention de copyright porte le nom du client.
//
//   node scripts/wire-copyright.mjs [--dry] [impact-01 …]
//
// Cent quatre-vingt-douze thèmes signent leur pied de page du nom de leur
// démonstration : « © 2026 Kéops Architecture », sur le site d'un client qui
// s'appelle Atelier Roux. C'est la dernière ligne que lit un visiteur, celle qui
// dit à qui appartient le site — et elle nommait quelqu'un d'autre.
//
// Le nom du thème reste en repli, pour qui n'a rien saisi.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seulement = process.argv.slice(2).filter((a) => a.startsWith("impact-"));

/*
  Le nom qui suit l'année : des lettres, des espaces, parfois une esperluette ou
  un point. On s'arrête au premier séparateur — « · », « — », « . » suivi d'une
  espace — pour ne pas emporter « Tous droits réservés ».
*/
const COPYRIGHT = /(©\s*\{?\s*(?:new Date\(\)\.getFullYear\(\)|\d{4})\s*\}?\s+)([A-ZÉÈÀÂÎÔÛ][\wÀ-ÿ&'’.-]*(?:\s+[A-ZÉÈÀÂÎÔÛ][\wÀ-ÿ&'’.-]*){0,3})/g;

let faits = 0;
const touches = [];

for (const id of seulement.length ? seulement : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.existsSync(dossier) || !fs.statSync(dossier).isDirectory()) continue;
  const fichiers = ["page.tsx", "layout.tsx", "shared.tsx"]
    .map((f) => path.join(dossier, f))
    .filter((f) => fs.existsSync(f));

  let n = 0;
  for (const f of fichiers) {
    let src = fs.readFileSync(f, "utf8");
    const partage = f.endsWith("shared.tsx");
    const arg = /^let sessionData: any = null;/m.test(src) ? "sessionData"
      : /__layoutSession/.test(src) ? "__layoutSession" : null;
    if (partage || !arg) continue;

    const lignes = src.split("\n").map((ligne) => {
      if (/^\s*(import|\/\/|\*)/.test(ligne)) return ligne;
      // La mention de l'éditeur du site, elle, ne bouge pas.
      if (/RCS|SIREN|Aevia|éditeur|editeur/i.test(ligne)) return ligne;
      if (/clientName\(/.test(ligne)) return ligne;
      return ligne.replace(COPYRIGHT, (m0, tete, nom) => {
        // « Tous droits réservés » n'est pas une raison sociale.
        if (/^(Tous|All|Todos|Alle)\b/i.test(nom)) return m0;
        n++;
        return `${tete}{clientName(${arg}) ?? ${JSON.stringify(nom)}}`;
      });
    });

    if (n === 0) continue;
    src = lignes.join("\n");
    if (!/import \{[^}]*\bclientName\b/.test(src)) {
      if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
        src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m0, g) => {
          const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
          noms.add("clientName");
          return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
        });
      } else {
        const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
        const at = d ? d.index + d[0].length : 0;
        src = src.slice(0, at) + 'import { clientName } from "@/lib/templates/clientContent";\n' + src.slice(at);
      }
    }
    if (!dry) fs.writeFileSync(f, src);
  }

  if (n === 0) continue;
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} mention(s) de copyright au nom du client, sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 14).join("  ·  "));
