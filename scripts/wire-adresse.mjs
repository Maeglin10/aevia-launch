// L'adresse du client, à la place de celle de la démonstration.
//
//   node scripts/wire-adresse.mjs --dry
//
// Dix-neuf thèmes composent une adresse à moitié : la ville vient du client, la
// rue et le code postal restent ceux du modèle. Un plombier annécien affiche
// donc « 12 rue de la Paix, 44000 Annecy » — une adresse qui n'existe pas, plus
// trompeuse qu'une adresse de démonstration assumée, parce qu'elle a l'air
// vraie.
//
// On remplace l'ensemble par ce que le client a saisi, en gardant la
// composition d'origine en repli : qui ne renseigne pas d'adresse voit
// exactement ce qu'il voyait avant.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seuls = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
const ids = seuls.length ? seuls : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-")).sort();

/* Un numéro, une voie, et de quoi la reconnaître. */
const VOIE = "(?:rue|avenue|av\\.|boulevard|bd|place|chemin|impasse|all[ée]e|quai|cours|route)";

let faits = 0;
const touches = [];
const restes = [];

for (const id of ids) {
  const f = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(f)) continue;
  let src = fs.readFileSync(f, "utf8");
  if (src.includes("clientAddress")) { continue; }

  let poses = 0;

  /*
    Première forme, la plus fréquente : une chaîne à gabarit dont la ville est
    déjà celle du client — `14 avenue Montaigne, 75008 ${clientCity(…)}`.
  */
  src = src.replace(
    // On lit jusqu'au guillemet oblique fermant : l'expression de la ville porte
    // ses propres accolades — `${clientCity({ formData: fd }) ?? "Bordeaux"}` —
    // et s'arrêter à la première les aurait coupées en deux.
    new RegExp("`(\\d{1,3}(?:\\s?bis|\\s?ter)?\\s+" + VOIE + "\\s[^`]{2,120}clientCity[^`]{0,80})`", "gi"),
    (m) => { poses++; return `(clientAddress(sessionData) ?? ${m})`; },
  );

  /*
    Deuxième forme : une concaténation — "12 rue du Pas Saint-Georges" suivie du
    code postal collé à la ville. On ne prend que le premier morceau, celui qui
    ne bouge jamais.
  */
  src = src.replace(
    new RegExp("([\"'])(\\d{1,3}(?:\\s?bis|\\s?ter)?\\s+" + VOIE + "\\s[^\"']{2,60})\\1", "gi"),
    (m, q, texte, position) => {
      /*
        Jamais dans un attribut JSX : `placeholder="12 rue…"` deviendrait une
        expression sans accolades, et le fichier ne compilerait plus. Un
        placeholder est de toute façon l'exemple que lit le visiteur avant
        d'écrire sa propre adresse — pas celle du gérant.
      */
      const avant = src.slice(Math.max(0, position - 24), position);
      if (/[\w-]+=\s*$/.test(avant)) return m;
      poses++;
      return `(clientAddress(sessionData) ?? ${q}${texte}${q})`;
    },
  );

  if (poses === 0) { restes.push(`${id} (pas d'adresse en dur reconnue)`); continue; }

  if (!/^\s*clientAddress,/m.test(src)) {
    const marque = '} from "@/lib/templates/clientContent";';
    const fin = src.indexOf(marque);
    if (fin < 0) { restes.push(`${id} (pas d'import du contrat)`); continue; }
    const debut = src.lastIndexOf("import {", fin);
    src = src.slice(0, debut + "import {".length) + "\n  clientAddress," + src.slice(debut + "import {".length);
  }

  if (!dry) fs.writeFileSync(f, src);
  faits++;
  touches.push(`${id} (${poses})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} thème(s), adresses rendues au client`);
console.log(touches.join("  ·  "));
const vrais = restes.filter((r) => !r.includes("pas d'adresse en dur"));
if (vrais.length) console.log(`\nlaissés tels quels :\n   ${vrais.join("\n   ")}`);
