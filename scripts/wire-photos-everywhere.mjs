// Fait porter aux images du thème celles du client.
//
//   node scripts/wire-photos-everywhere.mjs [--dry]
//
// Le wizard demande jusqu'à huit photos, une par emplacement, avec le libellé du
// thème pour que le client sache quoi téléverser. Soixante-huit thèmes sur 373
// les lisent. Les 305 autres affichent leurs photos de démonstration — un client
// qui a fourni ses images et n'en voit aucune conclut, à juste titre, que le site
// n'est pas le sien.
//
// Chaque adresse d'image écrite en dur devient `clientPhotos(sessionData)[n] ||
// <adresse d'origine>`, dans l'ordre où elle apparaît. L'ordre est celui de
// `photoSlots.ts`, celui-là même que le wizard présente : la troisième photo
// téléversée va au troisième emplacement.
//
// Les logos, icônes et motifs ne sont pas touchés : ce sont des éléments de
// design, pas des photos d'entreprise.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

// Une photo de contenu, pas un élément de design.
const DESIGN = /logo|icon|pattern|texture|avatar|placeholder|favicon|noise|grain/i;

let faits = 0;
const touches = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!/^let sessionData: any = null;/m.test(src)) continue;

  let rang = 0;
  let n = 0;
  // Les adresses déjà branchées comptent dans l'ordre : sans quoi la photo n°1
  // du client irait à deux emplacements différents.
  const dejaBranchees = [...src.matchAll(/clientPhotos\(sessionData\)\[(\d+)/g)].map((m) => Number(m[1]));
  rang = dejaBranchees.length ? Math.max(...dejaBranchees) + 1 : 0;

  src = src.replace(
    /(["'`])(https:\/\/images\.unsplash\.com\/[^"'`]+|https:\/\/images\.pexels\.com\/[^"'`]+)\1/g,
    (m0, q, url, pos) => {
      if (DESIGN.test(url)) return m0;
      /*
        Une valeur d'attribut JSX veut des accolades : `src="…"` devient
        `src={…}`, pas `src=(…)`. La première version a écrit la parenthèse et
        cassé impact-10 — un `imgSrc=(…)` n'est pas du JSX valide.
      */
      const avant = src.slice(Math.max(0, pos - 40), pos);
      const attributJsx = /\s[\w-]+=$/.test(avant);
      n++;
      const k = rang++;
      const expr = `clientPhotos(sessionData)[${k}] || ${q}${url}${q}`;
      return attributJsx ? `{${expr}}` : `(${expr})`;
    },
  );

  if (n === 0) continue;

  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
      const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      noms.add("clientPhotos");
      return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
    });
  } else {
    const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
    const at = d ? d.index + d[0].length : 0;
    src = src.slice(0, at) + 'import { clientPhotos } from "@/lib/templates/clientContent";\n' + src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} image(s) branchée(s) sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 12).join("  ·  "));
