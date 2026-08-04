// Câble les galeries de réalisations sur celles du client.
//
//   node scripts/wire-works.mjs [--dry]
//
// Soixante-sept thèmes montrent une galerie de projets d'exemple — « ÉQUIPEMENT
// PUBLIC · BORDEAUX, 33 », « Château de Versailles » — sur le site d'un client
// qui n'a jamais travaillé là. Le wizard recueille pourtant ses réalisations,
// sous `beforeAfter` pour les métiers de chantier, `listings` pour l'immobilier,
// `products` pour les boutiques.
//
// La ligne d'exemple garde ses champs que le client ne remplit pas — la couleur
// d'accent, l'identifiant, la disposition — puisque `resolveList` la fusionne
// dessous. Seuls le titre, le détail et l'image changent.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const TITRE = ["title", "titre", "name", "nom", "project", "projet"];
const VISUEL = ["img", "image", "src", "photo", "cover", "visual"];
const DETAIL = ["location", "lieu", "ville", "city", "year", "annee", "année", "category", "categorie", "catégorie", "type", "client"];
const DESC = ["desc", "description", "text", "excerpt", "body", "result"];

function ferme(s, i, o, c) {
  let n = 0;
  for (let x = i; x < s.length; x++) {
    if (s[x] === o) n++;
    else if (s[x] === c) { n--; if (n === 0) return x; }
  }
  return -1;
}

let faits = 0;
const touches = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!/^let sessionData: any = null;/m.test(src)) continue;
  if (src.includes("/* REALISATIONS */")) continue;

  const tabou = [...src.matchAll(/resolveList(?:<[^>]*>)?\(/g)]
    .map((m) => [m.index, ferme(src, m.index + m[0].length - 1, "(", ")")]);

  let cible = null;
  for (const m of src.matchAll(/(?<![\w.])\[\s*\n?\s*\{/g)) {
    const j = m.index;
    if (tabou.some(([a, b]) => a <= j && j <= b)) continue;
    const fin = ferme(src, j, "[", "]");
    if (fin === -1) continue;
    const oq = src.indexOf("{", j);
    const fq = ferme(src, oq, "{", "}");
    if (fq === -1 || fq > fin) continue;
    const cles = [...src.slice(oq + 1, fq).replace(/<[^>]*>/g, "").matchAll(/["']?(\w+)["']?\s*:/g)].map((x) => x[1]);
    const bas = cles.map((k) => k.toLowerCase());
    const kT = TITRE.find((k) => bas.includes(k));
    const kV = VISUEL.find((k) => bas.includes(k));
    const kD = DETAIL.find((k) => bas.includes(k));
    if (!kT || !kV || !kD) continue;
    // Un article de blog n'est pas une réalisation : il a une date et un extrait.
    if (bas.includes("date") && bas.includes("excerpt")) continue;
    if (/^\s*\.map\(\s*\(?[^)]{0,80}\)?\s*=>\s*[\s\S]{0,600}?use[A-Z]/.test(src.slice(fin + 1, fin + 700))) continue;
    const kDesc = DESC.find((k) => bas.includes(k));
    cible = {
      j, fin,
      kT: cles.find((k) => k.toLowerCase() === kT),
      kV: cles.find((k) => k.toLowerCase() === kV),
      kD: cles.find((k) => k.toLowerCase() === kD),
      kDesc: kDesc ? cles.find((k) => k.toLowerCase() === kDesc) : null,
    };
    break;
  }
  if (!cible) continue;

  const corps = src.slice(cible.j, cible.fin + 1);
  const desc = cible.kDesc ? `, ${cible.kDesc}: o.desc || ""` : "";
  const remp =
    `/* REALISATIONS */ resolveList(clientWorks(sessionData)?.map((o: any) => ({ ` +
    `${cible.kT}: o.title, ${cible.kD}: o.detail || undefined, ` +
    `...(o.imageUrl ? { ${cible.kV}: o.imageUrl } : {})${desc} })), ${corps})`;
  src = src.slice(0, cible.j) + remp + src.slice(cible.fin + 1);

  if (!src.includes("templates/resolveList")) {
    const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
    const at = d ? d.index + d[0].length : 0;
    src = src.slice(0, at) + 'import { resolveList } from "@/lib/templates/resolveList";\n' + src.slice(at);
  }
  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
      const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      noms.add("clientWorks");
      return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
    });
  } else {
    const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
    const at = d ? d.index + d[0].length : 0;
    src = src.slice(0, at) + 'import { clientWorks } from "@/lib/templates/clientContent";\n' + src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  faits++;
  touches.push(`${id} (${cible.kT}/${cible.kD}/${cible.kV})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} galerie(s) de réalisations câblée(s)`);
console.log(touches.slice(0, 12).join("  ·  "));
