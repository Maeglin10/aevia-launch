// Le numéro SIRET inventé des pieds de page.
//
//   node scripts/wire-siret.mjs --dry
//
// Trente-huit thèmes signent leur pied de page « © 2026 <nom du client> ·
// SIRET 456 789 123 00078 ». Le nom vient du formulaire, le numéro de la
// démonstration : une entreprise réelle se retrouve donc publiée avec un
// identifiant qui n'est pas le sien, sur la page que ses propres clients
// lisent, et sur laquelle les mentions légales s'appuient.
//
// Le formulaire recueille déjà le SIRET à l'étape des informations légales. On
// l'affiche quand il existe, et l'on efface la mention entière quand il manque
// — mieux vaut pas de numéro qu'un faux.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seuls = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
const ids = seuls.length ? seuls : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-")).sort();

/*
  « SIRET 456 789 123 00078 » écrit en texte JSX, éventuellement précédé d'un
  séparateur. On garde le séparateur : sans SIRET, la ligne se referme
  proprement au lieu de laisser un point médian orphelin.
*/
const EN_DUR = /([ \t]*·[ \t]*|[ \t]*\|[ \t]*|[ \t]*—[ \t]*|[ \t]+)SIRET[ \t](\d[\d ]{8,20}\d)/g;

let faits = 0;
const touches = [];

for (const id of ids) {
  const f = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(f)) continue;
  let src = fs.readFileSync(f, "utf8");
  if (src.includes("clientSiret")) continue;

  let poses = 0;
  src = src.replace(EN_DUR, (m, sep, numero) => {
    poses++;
    const separateur = sep.trim() || "·";
    /*
      Trois cas, dans cet ordre : le numéro du client, puis rien du tout dès
      qu'il a donné son nom — le site est le sien, un faux identifiant y serait
      publié sous sa responsabilité —, et enfin le numéro d'exemple pour la
      démonstration du catalogue, qui n'engage personne.
    */
    return `{clientSiret(sessionData) ? \` ${separateur} SIRET \${clientSiret(sessionData)}\``
      + ` : clientName(sessionData) ? "" : "${sep}SIRET ${numero}"}`;
  });
  if (poses === 0) continue;

  if (!/^\s*clientSiret,/m.test(src)) {
    const marque = '} from "@/lib/templates/clientContent";';
    const fin = src.indexOf(marque);
    if (fin < 0) { console.log(`${id} : pas d'import du contrat`); continue; }
    const debut = src.lastIndexOf("import {", fin);
    const aAjouter = ["clientSiret", "clientName"]
      .filter((n) => !new RegExp(`^\\s*${n},`, "m").test(src))
      .map((n) => `\n  ${n},`)
      .join("");
    src = src.slice(0, debut + "import {".length) + aAjouter + src.slice(debut + "import {".length);
  }

  if (!dry) fs.writeFileSync(f, src);
  faits++;
  touches.push(`${id} (${poses})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} thème(s) où le SIRET vient du client`);
console.log(touches.join("  ·  "));
