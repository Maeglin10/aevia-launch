// Donne au contrat la session entière, pas seulement le formulaire.
//
//   node scripts/fix-partial-session.mjs [--dry]
//
// `clientServices({ formData: fd })` ne renvoie jamais rien : les prestations du
// client vivent sous `businessProfile.services`, ses avis sous
// `businessProfile.reputation.featuredReviews`, ses chiffres sous
// `businessProfile.keyStats`. Le formulaire seul ne porte que le nom, la ville
// et l'accroche.
//
// Vingt-sept thèmes appellent ainsi le contrat avec un tiers de la session et
// affichent leur démonstration en croyant afficher le client. Ils reçoivent
// maintenant les trois branches — le formulaire, la fiche d'entreprise et le
// contenu rédigé — via une variable de module alimentée au rendu, comme `fd`.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

// Les fonctions dont la donnée ne vient pas du formulaire.
const HORS_FORMULAIRE =
  /client(Services|Reviews|Stats|Faq|Team|Areas|Certifications|Tagline)\(\{ formData: fd \}\)/g;

let faits = 0;
const touches = [];
const restants = [];

// Le défaut se reproduit à chaque nouvelle passe de câblage : les layouts et les
// sous-pages en portent aussi.
const FICHIERS = [];
for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  FICHIERS.push([id, path.join(dossier, "page.tsx")], [id, path.join(dossier, "layout.tsx")]);
  for (const sous of fs.readdirSync(dossier)) {
    const f = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(f)) FICHIERS.push([`${id}/${sous}`, f]);
  }
}

for (const [id, file] of FICHIERS) {
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  const n = [...src.matchAll(HORS_FORMULAIRE)].length;
  if (n === 0) continue;

  // Les layouts et les sous-pages déclarent leur session autrement : on y écrit
  // l'objet complet directement, sans passer par des variables de module.
  if (!/^let fd: any = null;/m.test(src)) {
    if (/__layoutSession/.test(src)) {
      src = src.replace(HORS_FORMULAIRE, (m0, quoi) => `client${quoi}(__layoutSession)`);
    } else if (/let sessionData: any = null;/.test(src)) {
      src = src.replace(HORS_FORMULAIRE, (m0, quoi) => `client${quoi}(sessionData)`);
    } else {
      restants.push(`${id} (pas de variable de module)`);
      continue;
    }
    if (!dry) fs.writeFileSync(file, src);
    faits += n;
    touches.push(`${id} (${n})`);
    continue;
  }

  // `bp` manque presque partout : on le déclare à côté de `fd` et on l'alimente
  // là où `fd` l'est.
  if (!/^let bp: any = null;/m.test(src)) {
    src = src.replace(/^let fd: any = null;/m, "let bp: any = null;\nlet fd: any = null;");
    const a = /\n(\s*)fd = session\?\.formData;/.exec(src);
    if (!a) { restants.push(`${id} (pas de point de rendu)`); continue; }
    src = src.slice(0, a.index + a[0].length) + `\n${a[1]}bp = session?.businessProfile;` + src.slice(a.index + a[0].length);
  }
  if (!/^let c: any = null;/m.test(src)) {
    src = src.replace(/^let bp: any = null;/m, "let c: any = null;\nlet bp: any = null;");
    const a = /\n(\s*)bp = session\?\.businessProfile;/.exec(src);
    if (a) src = src.slice(0, a.index + a[0].length) + `\n${a[1]}c = session?.generatedContent;` + src.slice(a.index + a[0].length);
  }

  src = src.replace(HORS_FORMULAIRE, (m0, quoi) =>
    `client${quoi}({ formData: fd, businessProfile: bp, generatedContent: c })`);

  if (!dry) fs.writeFileSync(file, src);
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} appel(s) sur ${touches.length} thème(s)`);
console.log(touches.join(" "));
if (restants.length) console.log(`restants : ${restants.join(", ")}`);
