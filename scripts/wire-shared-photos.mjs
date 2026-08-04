// Fait porter aux images des modules partagés celles du client.
//
//   node scripts/wire-shared-photos.mjs [--dry]
//
// Soixante et un thèmes rangent leurs images dans un `shared.tsx` importé par la
// page et ses sous-pages. Ce fichier n'a pas de session : il est évalué à
// l'import, et rien n'y donne accès à ce que le client a saisi. Ses images
// restaient donc celles de la démonstration.
//
// `clientPhotoAt(i, repli)` lit la session que la page a retenue au moment où
// elle l'a reçue. Le rang continue celui de la page, pour que deux emplacements
// ne se disputent pas la même photo.
//
// La page appelle `memoriserSession(sessionData)` là où elle alimente ses
// variables de module — sans cet appel, `clientPhotoAt` ne verrait rien.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const DESIGN = /logo|icon|pattern|texture|avatar|placeholder|favicon|noise|grain/i;

let imagesFaites = 0;
let pagesMarquees = 0;
const touches = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  const partage = path.join(dossier, "shared.tsx");
  const page = path.join(dossier, "page.tsx");
  if (!fs.existsSync(partage) || !fs.existsSync(page)) continue;

  // Le rang reprend là où la page s'est arrêtée.
  const srcPage = fs.readFileSync(page, "utf8");
  const rangs = [...srcPage.matchAll(/clientPhotos\(sessionData\)\[(\d+)/g)].map((m) => Number(m[1]));
  let rang = rangs.length ? Math.max(...rangs) + 1 : 0;

  let src = fs.readFileSync(partage, "utf8");
  let n = 0;
  src = src.replace(
    /(["'`])(https:\/\/images\.unsplash\.com\/[^"'`]+|https:\/\/images\.pexels\.com\/[^"'`]+)\1/g,
    (m0, q, url, pos) => {
      if (DESIGN.test(url)) return m0;
      const avant = src.slice(Math.max(0, pos - 40), pos);
      const attributJsx = /\s[\w-]+=$/.test(avant);
      n++;
      const expr = `clientPhotoAt(${rang++}, ${q}${url}${q})`;
      return attributJsx ? `{${expr}}` : expr;
    },
  );

  if (n > 0) {
    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
        const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
        noms.add("clientPhotoAt");
        return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
      });
    } else {
      const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = d ? d.index + d[0].length : 0;
      src = src.slice(0, at) + 'import { clientPhotoAt } from "@/lib/templates/clientContent";\n' + src.slice(at);
    }
    if (!dry) fs.writeFileSync(partage, src);
    imagesFaites += n;
    touches.push(`${id} (${n})`);
  }

  // La page retient la session pour que le module partagé puisse la lire.
  if (!srcPage.includes("memoriserSession(")) {
    const a = /\n(\s*)sessionData = session;/.exec(srcPage);
    if (a) {
      let neuf = srcPage.slice(0, a.index + a[0].length) + `\n${a[1]}memoriserSession(sessionData);` + srcPage.slice(a.index + a[0].length);
      neuf = neuf.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
        const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
        noms.add("memoriserSession");
        return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
      });
      if (!neuf.includes("memoriserSession,") && !neuf.includes("memoriserSession }")) {
        const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(neuf);
        const at = d ? d.index + d[0].length : 0;
        neuf = neuf.slice(0, at) + 'import { memoriserSession } from "@/lib/templates/clientContent";\n' + neuf.slice(at);
      }
      if (!dry) fs.writeFileSync(page, neuf);
      pagesMarquees++;
    }
  }
}

console.log(`${dry ? "[à blanc] " : ""}${imagesFaites} image(s) partagée(s) branchée(s), ${pagesMarquees} page(s) retiennent la session`);
console.log(touches.slice(0, 12).join("  ·  "));
