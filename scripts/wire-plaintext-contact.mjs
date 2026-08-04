// Branche les coordonnées écrites en clair, hors des liens.
//
//   node scripts/wire-plaintext-contact.mjs [--dry]
//
// `wire-contact.mjs` ne traite que `href="tel:…"` et `href="mailto:…"`, les
// seules positions sans ambiguïté. Restent 168 adresses e-mail et 18 numéros
// écrits comme du texte — « Écrivez-nous à contact@exemple.fr » — dont
// cinquante-deux fois l'adresse personnelle du fondateur, sur les pages de
// mentions légales de clients qui ne l'ont jamais rencontré.
//
// Le repli reste celui du thème : un client qui n'a pas donné d'adresse voit ce
// qu'il voyait avant.
//
// Les blocs `<LegalIdentity />` ne sont pas touchés : ils déclarent l'éditeur du
// site, et savoir qui doit y figurer — Aevia ou le client — est une décision, pas
// un câblage.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const MAIL = /(^|[\s>(:;,])([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(?=[\s<).,;:]|$)/g;
const TEL = /(^|[\s>(:;,])(0[1-9](?:[ .-]?\d{2}){4})(?=[\s<).,;:]|$)/g;

let mails = 0, tels = 0;
const touches = [];

// Vrai si la position tombe dans une chaîne : un e-mail écrit à l'intérieur
// d'un littéral — `{ t: "send-message --to contact@exemple.fr" }` — ne doit pas
// recevoir d'accolades JSX, elles y seraient du texte et casseraient le fichier.
function dansChaine(ligne, pos) {
  const seg = ligne.slice(0, pos);
  const impair = (re) => (seg.match(re) || []).length % 2 === 1;
  return impair(/(?<!\\)"/g) || impair(/(?<!\\)'/g) || impair(/(?<!\\)`/g);
}

function traite(src) {
  let n = { mail: 0, tel: 0 };
  // On ne travaille que dans le texte JSX : hors des attributs, hors du code.
  const lignes = src.split("\n").map((l) => {
    if (/^\s*(import|const|let|var|function|export|\/\/|\*)/.test(l)) return l;
    if (/href=|src=|alt=|LegalIdentity|placeholder=|content=/.test(l)) return l;
    if (/\$\{|clientEmail|fd\?\.email|fd\?\.phone/.test(l)) return l;
    let out = l.replace(MAIL, (m0, avant, adresse, pos) => {
      if (dansChaine(l, pos)) return m0;
      n.mail++;
      return `${avant}{fd?.email ?? "${adresse}"}`;
    });
    out = out.replace(TEL, (m0, avant, numero, pos) => {
      if (dansChaine(out, pos)) return m0;
      n.tel++;
      return `${avant}{fd?.phone ?? "${numero}"}`;
    });
    return out;
  });
  return { src: lignes.join("\n"), n };
}

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  const fichiers = [path.join(dossier, "page.tsx")];
  for (const sous of fs.readdirSync(dossier)) {
    const f = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(f)) fichiers.push(f);
  }
  for (const file of fichiers) {
    if (!fs.existsSync(file)) continue;
    const src = fs.readFileSync(file, "utf8");
    // Le repli lit `fd` : sans lui on écrirait une référence morte.
    if (!/\blet fd: any = null;/.test(src) && !/\bconst fd\b/.test(src)) continue;
    const { src: neuf, n } = traite(src);
    if (n.mail + n.tel === 0) continue;
    if (!dry) fs.writeFileSync(file, neuf);
    mails += n.mail;
    tels += n.tel;
    touches.push(file.replace(`${ROOT}/`, ""));
  }
}

console.log(`${dry ? "[à blanc] " : ""}${mails} adresse(s) et ${tels} numéro(s) branchés sur ${touches.length} fichier(s)`);
