// Fait porter au repli du logo le nom de l'entreprise du client.
//
//   node scripts/wire-logo-fallback.mjs impact-02 impact-04 … [--dry]
//
// L'en-tête suit partout la même forme : le logo téléversé s'il existe, sinon
// un texte de marque écrit en dur. Une passe précédente ne savait remplacer que
// le premier littéral de ce repli, ce qui échoue dès que la marque est coupée
// par du balisage :
//
//   Elena<span className="font-black">Korr</span>
//
// Ici le repli n'est pas réécrit mais doublé : le nom du client s'affiche dans
// le premier élément du repli, avec ses classes et son style d'origine, et le
// texte du thème reste montré tel quel au client qui n'a pas donné de nom.
//
// Les thèmes à traiter sont passés en argument — ce sont ceux dont la mesure
// dit que le nom n'apparaît nulle part, pas ceux qu'une lecture du source
// suppose incomplets : `fd?.businessName` écrit après un `c?.aboutTitle` est
// visible dans le source et invisible à l'écran.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const ids = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
if (ids.length === 0) {
  console.error("usage: node scripts/wire-logo-fallback.mjs impact-02 [...] [--dry]");
  process.exit(1);
}

function ferme(s, i, o, c) {
  let n = 0;
  for (let x = i; x < s.length; x++) {
    if (s[x] === o) n++;
    else if (s[x] === c) {
      n--;
      if (n === 0) return x;
    }
  }
  return -1;
}

let faits = 0;
const restants = [];

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) { restants.push(`${id} (absent)`); continue; }
  let src = fs.readFileSync(file, "utf8");
  if (src.includes("/* NOM_LOGO */")) { restants.push(`${id} (déjà)`); continue; }

  const decl = /\blet (?:fd|sessionData): any = null;/.exec(src);
  const arg = /sessionData = session;/.test(src) ? "sessionData" : "{ formData: fd }";

  // Le repli du logo : la branche « : ( … ) » du ternaire sur logoBase64.
  const t = /fd\?\.logo(?:Base64|Url)\s*\?/.exec(src);
  if (!t) { restants.push(`${id} (pas de ternaire logo)`); continue; }
  const sep = src.indexOf(") : (", t.index);
  if (sep === -1 || sep - t.index > 1600) { restants.push(`${id} (repli introuvable)`); continue; }
  // La branche vraie du ternaire doit bien être le logo téléversé : sans ce
  // contrôle, `indexOf` attrape le `) : (` d'un ternaire plus bas et le nom du
  // client se retrouve dans le titre du hero.
  if (!/<img\b/.test(src.slice(t.index, sep))) { restants.push(`${id} (ternaire sans image)`); continue; }
  const deb = sep + 4;                       // sur la parenthèse ouvrante du repli
  const fin = ferme(src, deb, "(", ")");
  if (fin === -1) { restants.push(`${id} (repli non fermé)`); continue; }
  const repli = src.slice(deb + 1, fin);

  // Le nom du client prend la place de l'élément du repli qui porte le texte de
  // marque — pas forcément le plus extérieur. Beaucoup d'en-têtes posent un
  // pictogramme (un cercle en CSS, un svg) à côté du mot : remplacer le conteneur
  // ferait disparaître le dessin, remplacer le mot le garde.
  const DESSIN = /<svg\b|<img\b|border-?[Rr]adius|borderRadius|width:\s*\d|height:\s*\d/;
  const noeuds = [];
  {
    const pile = [];
    const re = /<(\/?)([a-zA-Z][\w.]*)|\/>/g;
    let m;
    while ((m = re.exec(repli))) {
      if (m[0] === "/>") { pile.pop(); continue; }
      if (m[1] === "/") {
        const ouvert = pile.pop();
        if (ouvert && ouvert.tag === m[2]) {
          ouvert.finEnfants = m.index;
          noeuds.push(ouvert);
        }
        continue;
      }
      let k = m.index + m[0].length, prof = 0, guil = null, auto = false;
      for (; k < repli.length; k++) {
        const ch = repli[k];
        if (guil) { if (ch === guil) guil = null; continue; }
        if (ch === '"' || ch === "'" || ch === "`") { guil = ch; continue; }
        if (ch === "{") prof++;
        else if (ch === "}") prof--;
        else if (ch === ">" && prof === 0) { auto = repli[k - 1] === "/"; break; }
      }
      if (k >= repli.length) break;
      re.lastIndex = k + 1;
      if (auto) continue;
      pile.push({
        tag: m[2],
        attrs: repli.slice(m.index + m[0].length, auto ? k - 1 : k).trim(),
        debEnfants: k + 1,
        prof: pile.length,
      });
    }
  }
  const texte = (t) => t
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, "")
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-z]+;/g, "x")
    .replace(/\s+/g, "")
    .trim();
  const bons = noeuds
    .filter((nd) => nd.tag !== "img" && nd.tag !== "svg")
    .filter((nd) => {
      const sous = repli.slice(nd.debEnfants, nd.finEnfants);
      return texte(sous).length >= 2 && !DESSIN.test(sous) && !DESSIN.test(nd.attrs);
    })
    .sort((a, b) => a.prof - b.prof || (b.finEnfants - b.debEnfants) - (a.finEnfants - a.debEnfants));
  if (bons.length === 0) { restants.push(`${id} (aucun texte de marque)`); continue; }

  // Le nom ne prend la place du texte de marque que s'il n'en laisse rien
  // d'inline dehors : une en-tête « Vulcan · Motor Group Modena » coupée en deux
  // spans afficherait sinon « Vulcan » suivi du nom du client.
  //
  // Quand le bloc de marque tient une seconde ligne — « Laurence Moreau /
  // Psychologue clinicienne », « Terre & Geste / Céramique artisanale ·
  // Bourg-en-Bresse » — c'est le bloc entier qui cède la place : cette ligne
  // décrit l'entreprise de démonstration, et la garder ferait cohabiter le nom
  // du client avec le métier et la ville de quelqu'un d'autre.
  const espace = (t) => t
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[a-z]+;/g, "x")
    .replace(/\s+/g, " ")
    .trim();
  const toutEspace = espace(repli);
  const cible = bons.find(
    (nd) => texte(repli.slice(nd.debEnfants, nd.finEnfants)) === texte(repli),
  );
  if (!cible) { restants.push(`${id} (marque en plusieurs morceaux)`); continue; }
  // Un repli déjà branché sur l'accroche n'est pas un bloc de marque.
  if (/heroHeadline|clientTagline/.test(repli)) { restants.push(`${id} (repli déjà câblé ailleurs)`); continue; }
  const tag = cible.tag;
  const attrs = cible.attrs;
  const marque = repli.slice(cible.debEnfants, cible.finEnfants);

  const nom = `clientName(${arg})`;
  const remp = `{/* NOM_LOGO */ ${nom} ?? (<>${marque}</>)}`;
  const avant = src.slice(0, deb + 1);
  src = avant + repli.slice(0, cible.debEnfants) + remp + repli.slice(cible.finEnfants) + src.slice(fin);

  if (!/clientName/.test(src.slice(0, src.indexOf("\n", src.indexOf("clientContent"))) + src)) {
    // rien à faire, l'import est traité juste après
  }
  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
      const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      noms.add("clientName");
      return "import {\n" + [...noms].sort().map((n) => `  ${n},\n`).join("") + '} from "@/lib/templates/clientContent";';
    });
  } else {
    const d = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = d ? d.index + d[0].length : 0;
    src = src.slice(0, at) + 'import { clientName } from "@/lib/templates/clientContent";\n' + src.slice(at);
  }
  if (!decl && arg === "{ formData: fd }" && !/\bconst fd\b/.test(src)) {
    restants.push(`${id} (pas de fd)`);
    continue;
  }

  if (!dry) fs.writeFileSync(file, src);
  faits++;
  console.log(`${id}  ${tag} « ${marque.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().slice(0, 40)} »`);
}

console.log(`\n${dry ? "[à blanc] " : ""}${faits} thème(s) câblé(s)`);
if (restants.length) console.log(`restants (${restants.length}) : ${restants.join(", ")}`);
