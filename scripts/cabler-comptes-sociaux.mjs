/*
  Les comptes sociaux écrits en dur.

    node scripts/cabler-comptes-sociaux.mjs [--ecrire]

  Le formulaire demande l'Instagram du client depuis toujours ; le contrat sait
  le lire depuis peu. Restaient les blocs de contact et les pieds de page, où le
  compte de la démonstration est une simple chaîne — « @lematindore »,
  « @terra.moreau », « @maravoss.ink ». Le client y invite ses visiteurs à
  suivre le compte d'une autre entreprise, juste sous sa propre adresse.

  On ne touche qu'aux lignes qui parlent explicitement d'un réseau : les
  pseudonymes des témoignages (« @priya_dev ») sont du contenu de démonstration,
  remplacé dès que le client fournit ses avis, et n'ont rien à faire ici.
*/
import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");
const RACINE = "app/templates";
const RESEAU = /instagram|tiktok|twitter|facebook|linkedin|social|réseaux/i;
const PSEUDO = /^@[\w.]{2,30}$/;

function* parcourir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const c = path.join(d, e.name);
    if (e.isDirectory()) yield* parcourir(c);
    else if (e.name.endsWith(".tsx")) yield c;
  }
}

function variableSession(s) {
  for (const v of ["sessionData", "__session", "__layoutSession"]) {
    if (new RegExp(`\\b${v}\\b`).test(s)) return v;
  }
  return null;
}

const rapport = [];
for (const p of parcourir(RACINE)) {
  let src = fs.readFileSync(p, "utf8");
  const v = variableSession(src);
  if (!v) continue;
  let faits = 0;

  src = src.split("\n").map((ligne) => {
    if (!RESEAU.test(ligne) || ligne.includes("clientInstagram")) return ligne;
    return ligne.replace(/(["'])(@[\w.]{2,30})\1/g, (tout, q, pseudo) => {
      if (!PSEUDO.test(pseudo)) return tout;
      faits++;
      return `"@" + (clientInstagram(${v}) ?? ${q}${pseudo.slice(1)}${q})`;
    });
  }).join("\n");

  if (!faits) continue;
  if (!/import\s*\{[^}]*\bclientInstagram\b/.test(src)) {
    const bloc = src.match(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/);
    if (bloc) {
      const noms = [...new Set([...bloc[1].matchAll(/client[A-Za-z]+/g)].map((x) => x[0]).concat("clientInstagram"))].sort();
      src = src.replace(bloc[0], `import {\n${noms.map((n) => `  ${n},\n`).join("")}} from "@/lib/templates/clientContent";`);
    } else {
      const j = src.indexOf("\n", src.indexOf('"use client"')) + 1;
      src = src.slice(0, j) + 'import { clientInstagram } from "@/lib/templates/clientContent";\n' + src.slice(j);
    }
  }
  rapport.push({ fichier: p.slice(RACINE.length + 1), faits });
  if (ECRIRE) fs.writeFileSync(p, src);
}

for (const r of rapport) console.log(`${r.fichier.padEnd(40)} ×${r.faits}`);
console.log(`\n${rapport.length} fichiers · ${rapport.reduce((a, r) => a + r.faits, 0)} comptes · ${ECRIRE ? "écrit" : "simulation (--ecrire)"}`);
