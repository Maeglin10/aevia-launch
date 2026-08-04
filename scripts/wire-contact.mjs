// Branche les liens de contact sur les coordonnées du client.
//
//   node scripts/wire-contact.mjs [--dry]
//
// 285 numéros de téléphone et 287 adresses e-mail sont écrits en dur dans les
// thèmes. C'est le défaut le plus coûteux du catalogue : un client qui met son
// site en ligne peut y afficher le numéro de quelqu'un d'autre, et il ne s'en
// aperçoit qu'au premier appel qu'il ne reçoit pas.
//
// On ne traite ici que les positions sans ambiguïté — href="tel:…" et
// href="mailto:…" — parce qu'elles sont toujours évaluées au rendu. Le numéro du
// thème reste en repli : un client qui n'a pas donné de téléphone voit ce qu'il
// voyait avant.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
// Les layouts portent l'en-tête et le pied de soixante-deux thèmes : c'est là
// que vivent leurs liens « appeler » et « écrire ».
const FICHIER = process.argv.includes("--layout") ? "layout.tsx" : "page.tsx";
// `--sous` parcourt les sous-pages — /contact, /services — où vivent la plupart
// des liens « appeler » et « écrire » du catalogue.
const SOUS = process.argv.includes("--sous");
const ids = fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));
const cibles = [];
for (const id of ids) {
  if (!SOUS) { cibles.push([id, path.join(ROOT, id, FICHIER)]); continue; }
  const dossier = path.join(ROOT, id);
  for (const sous of fs.readdirSync(dossier)) {
    const f = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(f)) cibles.push([`${id}/${sous}`, f]);
  }
}

let tel = 0, mail = 0, touched = 0;
const skipped = [];

for (const [id, file] of cibles) {
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  const before = src;

  src = src.replace(/href=(["'])tel:([^"']+)\1/g, (m, _q, v) => {
    if (v.includes("${")) return m;
    tel++;
    return `href={\`tel:\${fd?.phone ?? ${JSON.stringify(v)}}\`}`;
  });
  src = src.replace(/href=(["'])mailto:([^"']+)\1/g, (m, _q, v) => {
    if (v.includes("${")) return m;
    mail++;
    return `href={\`mailto:\${fd?.email ?? ${JSON.stringify(v)}}\`}`;
  });

  if (src === before) continue;
  // Le repli lit `fd` : sans lui on introduirait une référence morte. Les
  // layouts le déclarent en `const fd = __layoutSession?.formData;`.
  if (!/\blet fd: any = null;/.test(src) && !/\bconst fd = __layoutSession\?\.formData;/.test(src)) {
    skipped.push(id);
    continue;
  }
  if (!dry) fs.writeFileSync(file, src);
  touched++;
}

if (skipped.length) console.log(`sans fd, laissés de côté : ${skipped.join(" ")}`);
console.log(`${dry ? "[à blanc] " : ""}${touched} thème(s) — ${tel} lien(s) tel:, ${mail} lien(s) mailto:`);
