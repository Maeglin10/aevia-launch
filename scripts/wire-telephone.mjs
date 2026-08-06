// Le numéro affiché est celui du client.
//
//   node scripts/wire-telephone.mjs [--dry]
//
// Mesuré sur les 373 : soixante-quatorze pieds de page portaient encore le
// numéro de la démonstration — « +33 1 42 68 90 00 » sur le site d'un plombier
// annécien. Le courriel et la ville, eux, étaient déjà branchés dans les mêmes
// listes de liens ; le téléphone était resté littéral.
//
// C'est la ligne qu'un visiteur compose. Le numéro du thème reste en repli, pour
// qui n'a pas rempli cette partie du wizard.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

/*
  Un numéro français écrit en toutes lettres : indicatif international ou zéro
  initial, puis huit à neuf chiffres séparés par des espaces, des points ou des
  tirets. On exige au moins deux séparateurs pour ne pas confondre avec un
  nombre — un prix, une année, un identifiant.
*/
const NUMERO = /"((?:\+33\s?|0)\d(?:[\s.\-]\d{2}){4})"/g;

let faits = 0;
const touches = [];

for (const d of fs.readdirSync(ROOT).filter((x) => x.startsWith("impact-"))) {
  const f = path.join(ROOT, d, "page.tsx");
  if (!fs.existsSync(f)) continue;
  let src = fs.readFileSync(f, "utf8");
  const arg = /^let sessionData: any = null;/m.test(src) ? "sessionData"
    : /\bfd\b/.test(src) ? "{ formData: fd }" : null;
  if (!arg) continue;

  let n = 0;
  const lignes = src.split("\n").map((ligne) => {
    if (/^\s*(import|\/\/|\*|\/\*)/.test(ligne.trim())) return ligne;
    /*
      Une ligne qui parle déjà du téléphone ne bouge pas : « const phoneDisplay =
      fd?.phone ?? … » est du code, pas du JSX, et y poser des accolades le
      casse. C'est ce qui a fait échouer cent quarante-six fichiers au premier
      essai.
    */
    if (/clientPhone\s*\(|fd\?\.phone|\bphone\b|tel:/.test(ligne)) return ligne;

    // Cas 1 : le numéro est le texte d'une balise.
    let neuve = ligne.replace(/>((?:\+33\s?|0)\d(?:[\s.\-]\d{2}){4})</g, (m0, numero) => {
      n++;
      return `>{clientPhone(${arg}) ?? ${JSON.stringify(numero)}}<`;
    });

    /*
      Cas 1 bis : le numéro est du texte JSX sans balise collée — « {ville} ·
      +33 1 00 00 00 00 ». Il suit une expression et finit la ligne.
    */
    neuve = neuve.replace(/(\}\s*[·|—-]?\s*)((?:\+33\s?|0)\d(?:[\s.\-]\d{2}){4})(\s*)$/g, (m0, avant, numero, apres) => {
      n++;
      return `${avant}{clientPhone(${arg}) ?? ${JSON.stringify(numero)}}${apres}`;
    });

    // Cas 2 : le numéro est un élément d'une liste ou la valeur d'une clé.
    neuve = neuve.replace(/([[,:]\s*)"((?:\+33\s?|0)\d(?:[\s.\-]\d{2}){4})"/g, (m0, avant, numero) => {
      n++;
      return `${avant}(clientPhone(${arg}) ?? ${JSON.stringify(numero)})`;
    });

    return neuve;
  });
  if (n === 0) continue;

  src = lignes.join("\n");

  if (!/import \{[^}]*\bclientPhone\b/s.test(src)) {
    const imp = /import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.exec(src);
    if (imp) src = src.replace(imp[0], imp[0].replace("import {", "import {\n  clientPhone,"));
    else {
      const d0 = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = d0 ? d0.index + d0[0].length : 0;
      src = src.slice(0, at) + 'import { clientPhone } from "@/lib/templates/clientContent";\n' + src.slice(at);
    }
  }

  if (!dry) fs.writeFileSync(f, src);
  faits += n;
  touches.push(`${d}(${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} numéro(s) branchés sur le client, sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 16).join("  "));
