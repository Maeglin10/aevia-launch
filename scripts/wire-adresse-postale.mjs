// L'adresse affichée est celle du client.
//
//   node scripts/wire-adresse-postale.mjs [--dry] [impact-01 …]
//
// « 123 Avenue de l'Automobile, 75000 Paris », « 8 Avenue Montaigne, 75008
// Paris » : les thèmes écrivent une adresse de démonstration en toutes lettres,
// et le site d'un plombier annécien envoyait ses visiteurs dans le huitième
// arrondissement. Le client saisit pourtant la sienne au wizard.
//
// Une chaîne qui porte un code postal et une ville est une adresse, et rien
// d'autre : elle devient `clientAddress(sessionData) ?? "…"`. Le repli reste
// celui du thème pour qui ne remplit pas cette partie du formulaire.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seulement = process.argv.slice(2).filter((a) => a.startsWith("impact-"));

// Une adresse : un code postal français suivi d'une ville, dans une chaîne.
/*
  La classe ne doit exclure que le guillemet ouvrant : écarter les deux sortes
  empêchait le motif de traverser « 123 Avenue de l'Automobile », et l'adresse la
  plus visible du lot passait entre les mailles.
*/
const ADRESSE = /(["'])((?:(?!\1)[^\\]|\\.){6,90}?\b\d{5}\s+[A-ZÉÈÀÂÎÔÛ][\wÀ-ÿ'-]+(?:[\s-][A-ZÉÈÀÂÎÔÛ][\wÀ-ÿ'-]+){0,2})\1/g;

let faits = 0;
const touches = [];

for (const id of seulement.length ? seulement : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.existsSync(dossier) || !fs.statSync(dossier).isDirectory()) continue;
  const fichiers = ["page.tsx", "layout.tsx", "shared.tsx"]
    .map((f) => path.join(dossier, f))
    .filter((f) => fs.existsSync(f));

  let n = 0;
  for (const f of fichiers) {
    let src = fs.readFileSync(f, "utf8");
    const partage = f.endsWith("shared.tsx");
    const arg = partage
      ? null
      : /^let sessionData: any = null;/m.test(src) ? "sessionData"
      : /__layoutSession/.test(src) ? "__layoutSession" : null;
    if (!partage && !arg) continue;

    const lignes = src.split("\n").map((ligne) => {
      if (/^\s*(import|\/\/|\*)/.test(ligne)) return ligne;
      // Les mentions légales portent l'adresse de l'éditeur, pas celle du site.
      if (/RCS|SIREN|Aevia|éditeur|editeur/i.test(ligne)) return ligne;
      if (/clientAddress\(/.test(ligne)) return ligne;
      return ligne.replace(ADRESSE, (m0, q, adresse, pos) => {
        // Un module partagé n'a pas de session à lui : on n'y touche pas.
        if (partage) return m0;
        n++;
        /*
          Dans un attribut JSX, l'expression se met entre accolades :
          `placeholder=(…)` ne compile pas, `placeholder={…}` oui.
        */
        const attribut = /=\s*$/.test(ligne.slice(0, pos));
        const corps = `clientAddress(${arg}) ?? ${q}${adresse}${q}`;
        return attribut ? `{${corps}}` : `(${corps})`;
      });
    });

    if (n === 0) continue;
    src = lignes.join("\n");
    if (!/import \{[^}]*\bclientAddress\b/.test(src)) {
      if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
        src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m0, g) => {
          const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
          noms.add("clientAddress");
          return "import {\n" + [...noms].sort().map((x) => `  ${x},\n`).join("") + '} from "@/lib/templates/clientContent";';
        });
      } else {
        const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
        const at = d ? d.index + d[0].length : 0;
        src = src.slice(0, at) + 'import { clientAddress } from "@/lib/templates/clientContent";\n' + src.slice(at);
      }
    }
    if (!dry) fs.writeFileSync(f, src);
  }

  if (n === 0) continue;
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} adresse(s) branchées sur celle du client, sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 16).join("  ·  "));
