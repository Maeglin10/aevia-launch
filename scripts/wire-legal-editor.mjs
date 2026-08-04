// Fait de l'acheteur l'éditeur de son site, et garde le crédit du créateur.
//
//   node scripts/wire-legal-editor.mjs [--dry]
//
// Deux mentions distinctes, souvent confondues dans le catalogue :
//
//   l'éditeur   — obligatoire, art. 6 III LCEN : celui qui répond du contenu,
//                 donc le client dès qu'il achète le thème ;
//   le créateur — mention libre : « Site réalisé par Aevia WS », qui reste.
//
// 58 pages annoncent « éditeur Aevia WS » et 27 « Aevia WS — Valentin Milliand »
// dans leur bloc ÉDITEUR : sur le site d'un client, c'est faux et ça met le
// fondateur en responsabilité pour du contenu qu'il n'écrit pas.
//
// Le SIREN était déjà celui du client — `<LegalIdentity />` lit la session — ce
// qui donnait des blocs mixtes : le nom d'Aevia au-dessus du numéro du client.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

let editeurs = 0, blocs = 0, copyrights = 0, rcs = 0;
const touches = new Set();

// Vrai si la position tombe dans une chaîne. Une mention légale écrite dans un
// littéral de données — `{ t: "SIREN … — RCS : Bourg-en-Bresse." }` — ne peut pas
// recevoir d'accolades JSX : elles y seraient du texte.
function dansChaine(ligne, pos) {
  const seg = ligne.slice(0, pos);
  const impair = (re) => (seg.match(re) || []).length % 2 === 1;
  return impair(/(?<!\\)"/g) || impair(/(?<!\\)'/g) || impair(/(?<!\\)`/g);
}

// Applique un remplacement ligne par ligne, hors chaînes.
function horsChaine(src, motif, rendu) {
  let n = 0;
  const out = src.split("\n").map((l) =>
    l.replace(motif, (...args) => {
      const pos = args[args.length - 2];
      if (dansChaine(l, pos)) return args[0];
      n++;
      return rendu(...args);
    }),
  );
  return { src: out.join("\n"), n };
}

function argSession(src) {
  if (/__layoutSession/.test(src)) return "__layoutSession";
  if (/let sessionData: any = null;/.test(src)) return "sessionData";
  if (/\bconst fd\b|let fd: any = null;/.test(src)) return "{ formData: fd }";
  return null;
}

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  const fichiers = [path.join(dossier, "page.tsx"), path.join(dossier, "layout.tsx")];
  for (const sous of fs.readdirSync(dossier)) {
    const f = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(f)) fichiers.push(f);
  }

  for (const file of fichiers) {
    if (!fs.existsSync(file)) continue;
    let src = fs.readFileSync(file, "utf8");
    const avant = src;
    const arg = argSession(src);
    if (!arg) continue;
    const nom = `clientName(${arg})`;
    let var_n = 0;

    // « éditeur Aevia WS » dans une ligne de pied.
    ({ src, n: var_n } = horsChaine(src, /(éditeur\s+)Aevia WS/g, (m0, tete) => `${tete}{${nom} ?? "Aevia WS"}`));
    editeurs += var_n;

    // Le même bloc, écrit avec une étiquette en gras : « <strong>Éditeur :</strong>
    // Aevia WS — Valentin Milliand ».
    ({ src, n: var_n } = horsChaine(
      src,
      /(<strong>\s*(?:Éditeur|Editeur|Publisher|Editor)\s*:?\s*<\/strong>\s*)Aevia WS — Valentin Milliand/g,
      (m0, tete) => `${tete}{${nom} ?? "Aevia WS — Valentin Milliand"}`,
    ));
    blocs += var_n;

    // Le registre du commerce d'Aevia n'a rien à faire sur le site d'un client :
    // on ne l'affiche plus dès qu'il y a un nom.
    ({ src, n: var_n } = horsChaine(src, /RCS\s*:?\s*Bourg-en-Bresse/g, () => `{${nom} ? "" : "RCS : Bourg-en-Bresse"}`));
    rcs += var_n;

    // Le bloc ÉDITEUR des mentions légales écrites en dur.
    const avantBloc = src;
    src = src.replace(/Aevia WS — Valentin Milliand<br \/>\n(\s*)Entrepreneur Individuel<br \/>/g, (m0, ind) =>
      `{${nom} ?? "Aevia WS — Valentin Milliand"}<br />\n${ind}{${nom} ? "" : "Entrepreneur Individuel"}<br />`);
    if (src !== avantBloc) blocs++;

    // « © 2026 Aevia WS — SIREN … » : le copyright appartient au client.
    ({ src, n: var_n } = horsChaine(src, /(©\s*20\d\d\s+)(Aevia WS|AEVIA WS)(\s*—)/g, (m0, tete, _marque, queue) => `${tete}{${nom} ?? "Aevia WS"}${queue}`));
    copyrights += var_n;

    if (src === avant) continue;

    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
        const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
        noms.add("clientName");
        return "import {\n" + [...noms].sort().map((n) => `  ${n},\n`).join("") + '} from "@/lib/templates/clientContent";';
      });
    } else {
      const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = d ? d.index + d[0].length : 0;
      src = src.slice(0, at) + 'import { clientName } from "@/lib/templates/clientContent";\n' + src.slice(at);
    }

    if (!dry) fs.writeFileSync(file, src);
    touches.add(file.replace(`${ROOT}/`, ""));
  }
}

console.log(
  `${dry ? "[à blanc] " : ""}${editeurs} mention(s) « éditeur », ${blocs} bloc(s) ÉDITEUR, ` +
    `${copyrights} copyright(s), ${rcs} registre(s) du commerce — ${touches.size} fichier(s)`,
);
