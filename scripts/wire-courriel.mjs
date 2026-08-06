// L'adresse électronique affichée est celle du client.
//
//   node scripts/wire-courriel.mjs [--dry]
//
// Treize pieds de page portaient encore l'adresse de la démonstration —
// « info@confluence-events.fr » sur le site d'un plombier annécien. Comme pour
// le numéro de téléphone, c'est une ligne qu'un visiteur utilise vraiment.
//
// L'adresse du thème reste en repli, pour qui n'a pas rempli cette partie.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

// Une adresse écrite en toutes lettres, pas une expression déjà branchée.
const ADRESSE = /[\w.+-]+@[\w-]+\.[\w.-]*[a-z]{2,}/;

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
    // Une ligne qui parle déjà du courriel est du code : on n'y touche pas.
    if (/clientEmail\s*\(|fd\?\.email|\bemail\b|mailto:/i.test(ligne)) return ligne;

    let neuve = ligne;
    // Le texte d'une balise.
    neuve = neuve.replace(new RegExp(`>(${ADRESSE.source})<`, "g"), (m0, adresse) => {
      n++;
      return `>{clientEmail(${arg}) ?? ${JSON.stringify(adresse)}}<`;
    });
    /*
      Le texte d'une ligne de pied de page, sans balise collée : « © 2025 {nom}
      · {ville} · info@confluence-events.fr ». L'adresse suit une expression ou
      un séparateur et n'est pas dans une chaîne.
    */
    neuve = neuve.replace(new RegExp(`([}·|—-]\\s*)(${ADRESSE.source})(?=[\\s<{]|$)`, "g"), (m0, avant, adresse) => {
      n++;
      return `${avant}{clientEmail(${arg}) ?? ${JSON.stringify(adresse)}}`;
    });

    // L'élément d'une liste ou la valeur d'une clé.
    neuve = neuve.replace(new RegExp(`([[,:]\\s*)"(${ADRESSE.source})"`, "g"), (m0, avant, adresse) => {
      n++;
      return `${avant}(clientEmail(${arg}) ?? ${JSON.stringify(adresse)})`;
    });
    return neuve;
  });
  if (n === 0) continue;

  src = lignes.join("\n");
  if (!/import \{[^}]*\bclientEmail\b/s.test(src)) {
    const imp = /import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.exec(src);
    if (imp) src = src.replace(imp[0], imp[0].replace("import {", "import {\n  clientEmail,"));
    else {
      const d0 = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = d0 ? d0.index + d0[0].length : 0;
      src = src.slice(0, at) + 'import { clientEmail } from "@/lib/templates/clientContent";\n' + src.slice(at);
    }
  }

  if (!dry) fs.writeFileSync(f, src);
  faits += n;
  touches.push(`${d}(${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} adresse(s) branchées sur le client, sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 16).join("  "));
