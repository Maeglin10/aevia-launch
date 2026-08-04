// Rend éditables les listes de libellés.
//
//   node scripts/wire-label-lists.mjs [--dry]
//
// Deux cent cinquante-six sections rendent une liste de mots sans structure : les
// valeurs d'une agence, le matériel d'un photographe, les étapes d'un sourcing,
// les récompenses d'un studio. Aucun champ du wizard ne leur correspond, et leur
// inventer un à chacune reviendrait à poser cent questions.
//
// Elles passent par le même mécanisme que les titres : une clé stable, une
// retouche depuis l'aperçu, et le thème garde sa liste tant que le client n'y
// touche pas.
//
// Sont écartées les listes qui ne sont pas du contenu : la navigation, les liens
// légaux du pied, les créneaux horaires, et tout ce qui pilote un filtre ou un
// onglet — les toucher changerait le fonctionnement du thème, pas son texte.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const NAV = /^(accueil|home|contact|about|à propos|apropos|portfolio|services|blog|journal|menu|carte|shop|boutique|panier|cart|login|connexion|faq|tarifs|pricing|équipe|equipe|team)$/i;
const LEGAL = /^(privacy|terms|security|cookies|mentions|mentions légales|cgv|cgu|confidentialité|legal|imprint|politique de confidentialité)$/i;
const HORAIRE = /^\d{1,2}[:h]\d{0,2}$/;

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
const refus = {};

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!/^let sessionData: any = null;/m.test(src)) { refus["pas de session"] = (refus["pas de session"] ?? 0) + 1; continue; }

  let n = 0;
  for (let tour = 0; tour < 40; tour++) {
    const tabou = [...src.matchAll(/resolveList(?:<[^>]*>)?\(|clientList\(/g)]
      .map((m) => [m.index, ferme(src, m.index + m[0].length - 1, "(", ")")]);
    let fait = false;

    for (const m of src.matchAll(/\[\s*("(?:[^"\\]|\\.){3,60}"|'(?:[^'\\]|\\.){3,60}')\s*,/g)) {
      const j = m.index;
      if (tabou.some(([a, b]) => a <= j && j <= b)) continue;
      const fin = ferme(src, j, "[", "]");
      if (fin === -1) continue;
      const corps = src.slice(j, fin + 1);
      if (corps.includes("{") || corps.length > 700) continue;
      const items = [...corps.matchAll(/["']((?:[^"'\\]|\\.){3,60})["']/g)].map((x) => x[1]);
      if (items.length < 3) continue;
      if (!/^\s*\.map\(/.test(src.slice(fin + 1, fin + 120))) continue;
      if (items.some((x) => NAV.test(x.trim()) || LEGAL.test(x.trim()) || HORAIRE.test(x.trim()))) continue;
      // Une liste qui pilote un onglet ou un filtre n'est pas du texte.
      if (/setActive|setFilter|\.filter\(|onClick|href/.test(src.slice(Math.max(0, j - 300), fin + 400))) continue;
      // Une liste dans une balise de navigation ou de pied non plus.
      const avant = src.slice(Math.max(0, j - 900), j);
      if (/<(nav|footer)\b(?![\s\S]*<\/\1>)/.test(avant)) continue;

      // La clé : la section qui contient la liste, puis le rang de la liste.
      const debSection = src.lastIndexOf("<section", j);
      const idSection = debSection === -1
        ? null
        : /\sid=["'`]([\w-]+)["'`]/.exec(src.slice(debSection, debSection + 400))?.[1];
      const cle = `${idSection ?? "bloc"}.liste${n + 1}`;

      src = src.slice(0, j) + `/* LISTE_LIBELLES */ (clientList(sessionData, "${cle}") ?? ${corps})` + src.slice(fin + 1);
      n++;
      fait = true;
      break;
    }
    if (!fait) break;
  }

  if (n === 0) continue;

  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
      const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      noms.add("clientList");
      return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
    });
  } else {
    const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
    const at = d ? d.index + d[0].length : 0;
    src = src.slice(0, at) + 'import { clientList } from "@/lib/templates/clientContent";\n' + src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} liste(s) rendues éditables sur ${touches.length} thème(s)`);
if (Object.keys(refus).length) console.log("laissées de côté :", Object.entries(refus).map(([k, v]) => `${k} ${v}`).join(", "));
