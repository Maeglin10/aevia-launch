// Câble les prestations sur les sous-pages qui les présentent.
//
//   node scripts/wire-subpage-services.mjs [--dry]
//
// Une sous-page /services, /prestations ou /tarifs porte l'offre du client — pas
// celle du thème. On ne touche que ces dossiers-là : ailleurs, une liste
// { titre, description } est aussi bien une question fréquente, un article de
// blog ou un article de mentions légales, et la même règle y ferait des dégâts.
//
// Les sous-pages ont reçu leur chargement de session à la passe précédente ;
// elles lisent donc `sessionData` comme les pages d'accueil.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const DOSSIERS = new Set([
  "services", "prestations", "tarifs", "pricing", "offres", "nos-services", "prestation",
]);

function ferme(s, i, o, c) {
  let n = 0;
  for (let x = i; x < s.length; x++) {
    if (s[x] === o) n++;
    else if (s[x] === c) { n--; if (n === 0) return x; }
  }
  return -1;
}

const TITRE = ["title", "titre", "name", "nom", "label", "heading"];
const DESC = ["desc", "description", "text", "texte", "body", "sub", "resume"];
const PRIX = ["price", "prix", "tarif", "p", "montant", "from"];

let faits = 0;
const touches = [];
const restants = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  for (const sous of fs.readdirSync(dossier)) {
    if (!DOSSIERS.has(sous)) continue;
    const file = path.join(dossier, sous, "page.tsx");
    if (!fs.existsSync(file)) continue;
    let src = fs.readFileSync(file, "utf8");
    if (src.includes("/* PRESTATIONS */")) continue;
    if (!/let sessionData: any = null;/.test(src)) { restants.push(`${id}/${sous} (pas de session)`); continue; }

    const tabou = [...src.matchAll(/resolveList(?:<[^>]*>)?\(/g)]
      .map((m) => [m.index, ferme(src, m.index + m[0].length - 1, "(", ")")]);
    const dedans = (i) => tabou.some(([a, b]) => a <= i && i <= b);

    let cible = null;
    for (const m of src.matchAll(/(?<![\w.])\[\s*\n?\s*\{/g)) {
      const j = m.index;
      if (dedans(j)) continue;
      const fin = ferme(src, j, "[", "]");
      if (fin === -1) continue;
      const oq = src.indexOf("{", j);
      const fq = ferme(src, oq, "{", "}");
      if (fq === -1 || fq > fin) continue;
      const ligne = src.slice(oq + 1, fq).replace(/<[^>]*>/g, "");
      const cles = [...ligne.matchAll(/["']?(\w+)["']?\s*:/g)].map((x) => x[1]);
      const bas = cles.map((k) => k.toLowerCase());
      const kT = TITRE.find((k) => bas.includes(k));
      const kD = DESC.find((k) => bas.includes(k));
      if (!kT || !kD || kT === kD) continue;
      // Une question fréquente porte une question, pas un titre de prestation.
      if (bas.includes("q") || bas.includes("question") || bas.includes("answer")) continue;
      if (/^\s*\.map\(\s*\(?[^)]{0,80}\)?\s*=>\s*[\s\S]{0,600}?use[A-Z]/.test(src.slice(fin + 1, fin + 700))) continue;
      const kP = PRIX.find((k) => bas.includes(k));
      cible = {
        j, fin,
        kT: cles.find((k) => k.toLowerCase() === kT),
        kD: cles.find((k) => k.toLowerCase() === kD),
        kP: kP ? cles.find((k) => k.toLowerCase() === kP) : null,
      };
      break;
    }
    if (!cible) { restants.push(`${id}/${sous} (aucune liste de prestations)`); continue; }

    const corps = src.slice(cible.j, cible.fin + 1);
    const prix = cible.kP ? `, ...(s.price ? { ${cible.kP}: s.price } : {})` : "";
    const remp =
      `/* PRESTATIONS */ resolveList(clientServices(sessionData)?.map((s: any) => ` +
      `({ ${cible.kT}: s.title, ${cible.kD}: s.desc || ""${prix} })), ${corps})`;
    src = src.slice(0, cible.j) + remp + src.slice(cible.fin + 1);

    if (!src.includes("templates/resolveList")) {
      const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = d ? d.index + d[0].length : 0;
      src = src.slice(0, at) + 'import { resolveList } from "@/lib/templates/resolveList";\n' + src.slice(at);
    }
    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
        const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
        noms.add("clientServices");
        return "import {\n" + [...noms].sort().map((n) => `  ${n},\n`).join("") + '} from "@/lib/templates/clientContent";';
      });
    } else {
      const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = d ? d.index + d[0].length : 0;
      src = src.slice(0, at) + 'import { clientServices } from "@/lib/templates/clientContent";\n' + src.slice(at);
    }

    if (!dry) fs.writeFileSync(file, src);
    faits++;
    touches.push(`${id}/${sous} (${cible.kT}/${cible.kD}${cible.kP ? "/" + cible.kP : ""})`);
  }
}

console.log(`${dry ? "[à blanc] " : ""}${faits} sous-page(s) câblée(s)`);
console.log(touches.join("  ·  "));
if (restants.length) console.log(`restants (${restants.length}) : ${restants.join(", ")}`);
