// Rend éditable le texte de chaque section.
//
//   node scripts/wire-section-text.mjs [--dry] [impact-01 …]
//
// Le wizard recueille la donnée structurée — prestations, tarifs, horaires,
// équipe. Reste la prose : le titre d'une section, sa phrase d'introduction. Un
// millier de sections n'ont aujourd'hui aucune entrée de ce côté-là : le client
// lit « Ready to build the future? » sur son site de plomberie et ne peut rien y
// faire.
//
// Chaque section reçoit une clé stable — son `id`, sinon son rang dans la page —
// et son titre devient `clientText(session, "contact.titre") ?? <texte d'origine>`.
// Sans retouche, le thème affiche exactement ce qu'il affichait.
//
// Le titre n'est pas réécrit s'il est déjà branché sur la donnée du client, s'il
// est construit par un composant d'animation ou par un `map` : y injecter une
// chaîne casserait le thème, et c'est le design qu'on ne touche pas.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seulement = process.argv.slice(2).filter((a) => a.startsWith("impact-"));

function finBalise(s, i) {
  let prof = 0, guil = null;
  for (let k = i; k < s.length; k++) {
    const ch = s[k];
    if (guil) { if (ch === guil) guil = null; continue; }
    if (ch === '"' || ch === "'" || ch === "`") { guil = ch; continue; }
    if (ch === "{") prof++;
    else if (ch === "}") prof--;
    else if (ch === ">" && prof === 0) return k;
  }
  return -1;
}

function fermeElement(s, i, tag) {
  const ouvre = new RegExp(`<${tag}\\b`, "g");
  const clot = new RegExp(`</${tag}\\s*>`, "g");
  let prof = 1, k = i;
  while (k < s.length) {
    ouvre.lastIndex = k; clot.lastIndex = k;
    const a = ouvre.exec(s), b = clot.exec(s);
    if (!b) return -1;
    if (a && a.index < b.index) { prof++; k = a.index + a[0].length; continue; }
    prof--; k = b.index + b[0].length;
    if (prof === 0) return b.index;
  }
  return -1;
}

function finSection(src, i) {
  let prof = 1, k = i;
  while (prof > 0) {
    const a = src.indexOf("<section", k), b = src.indexOf("</section>", k);
    if (b === -1) return -1;
    if (a !== -1 && a < b) { prof++; k = a + 8; continue; }
    prof--; k = b + 10;
  }
  return k;
}

let faits = 0;
const touches = [];
const refus = {};

const ids = seulement.length
  ? seulement
  : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");

  // Une seule forme partout, garantie par `ensure-session-var.mjs` : une section
  // rendue par un composant de module ne voit pas le `session` local de la page.
  const arg = /^let sessionData: any = null;/m.test(src) ? "sessionData" : null;
  if (!arg) { refus["pas de session"] = (refus["pas de session"] ?? 0) + 1; continue; }

  let n = 0;
  let rang = 0;
  // On repart de la fin : chaque réécriture décale ce qui suit.
  const debuts = [];
  for (let i = 0; ; ) {
    const d = src.indexOf("<section", i);
    if (d === -1) break;
    const f = finSection(src, d + 8);
    if (f === -1) break;
    debuts.push([d, f]);
    i = f;
  }

  for (let k = debuts.length - 1; k >= 0; k--) {
    const [d, f] = debuts[k];
    const bloc = src.slice(d, f);
    const cle =
      /\sid=["'`]([\w-]+)["'`]/.exec(bloc)?.[1] ?? `section-${k + 1}`;

    // Le premier titre de la section — ou, à défaut, son premier paragraphe :
    // quarante sections ne portent qu'un texte, un manifeste, une citation.
    let t =
      /<((?:motion|m)\.)?(h1|h2|h3)\b/.exec(bloc) ??
      (process.env.PARAGRAPHE ? /<((?:motion|m)\.)?(p)\b/.exec(bloc) : null);
    /*
      TEXTE_LONG : quarante-six sections portent un texte sans titre ni
      paragraphe — un manifeste dans un `div`, une citation dans un `span`. On
      prend alors l'élément qui porte le plus de texte : c'est celui que le
      client lit, donc celui qu'il voudra changer.
    */
    if (!t && process.env.TEXTE_LONG) {
      let meilleur = null;
      for (const m2 of bloc.matchAll(/<((?:motion|m)\.)?(div|span|p|blockquote)\b/g)) {
        const fo = finBalise(bloc, m2.index + m2[0].length);
        if (fo === -1 || bloc[fo - 1] === "/") continue;
        const ff = fermeElement(bloc, fo + 1, m2[0].slice(1).replace(".", "\\."));
        if (ff === -1) continue;
        const dedans = bloc.slice(fo + 1, ff);
        if (/<(?:motion\.|m\.)?(div|span|p|blockquote|h[1-6])\b/.test(dedans)) continue;
        const net = dedans.replace(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        if (net.length < 40) continue;
        if (!meilleur || net.length > meilleur.n) meilleur = { m: m2, n: net.length };
      }
      if (meilleur) t = meilleur.m;
    }
    if (!t) { refus["sans titre"] = (refus["sans titre"] ?? 0) + 1; continue; }
    const balise = t[0].slice(1);
    const finOuv = finBalise(bloc, t.index + t[0].length);
    if (finOuv === -1 || bloc[finOuv - 1] === "/") { refus["balise"] = (refus["balise"] ?? 0) + 1; continue; }
    const finFerm = fermeElement(bloc, finOuv + 1, balise.replace(".", "\\."));
    if (finFerm === -1) { refus["balise"] = (refus["balise"] ?? 0) + 1; continue; }
    const enfants = bloc.slice(finOuv + 1, finFerm);

    if (/clientText|clientTagline|clientName/.test(enfants)) { refus["déjà"] = (refus["déjà"] ?? 0) + 1; continue; }
    if (/\.map\(/.test(enfants)) { refus["map"] = (refus["map"] ?? 0) + 1; continue; }
    if (/<[A-Z]/.test(enfants)) { refus["composant"] = (refus["composant"] ?? 0) + 1; continue; }
    const litteral = enfants.replace(/\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, "").replace(/<[^>]*>/g, "").replace(/&[a-z]+;/g, "x").replace(/\s+/g, "").trim();
    if (litteral.length < 3) { refus["dynamique"] = (refus["dynamique"] ?? 0) + 1; continue; }
    // Un paragraphe très court est une légende ou une étiquette, pas un texte de
    // section : le retoucher n'apporte rien et brouille la liste des retouches.
    if (!/^(h1|h2|h3)$/.test(t[2]) && litteral.length < 40) { refus["trop court"] = (refus["trop court"] ?? 0) + 1; continue; }

    const champ = /^(h1|h2|h3)$/.test(t[2]) ? "titre" : "texte";
    const remp = `{/* TEXTE_SECTION */ clientText(${arg}, "${cle}.${champ}") ?? (<>${enfants}</>)}`;
    src = src.slice(0, d + finOuv + 1) + remp + src.slice(d + finFerm);
    n++;
    rang++;
  }

  if (n === 0) continue;

  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
      const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      noms.add("clientText");
      return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
    });
  } else {
    const dd = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
    const at = dd ? dd.index + dd[0].length : 0;
    src = src.slice(0, at) + 'import { clientText } from "@/lib/templates/clientContent";\n' + src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} titre(s) de section rendus éditables sur ${touches.length} thème(s)`);
console.log("laissés de côté :", Object.entries(refus).map(([k, v]) => `${k} ${v}`).join(", "));
