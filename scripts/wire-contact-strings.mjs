// Les coordonnées écrites dans une chaîne de tableau.
//
//   node scripts/wire-contact-strings.mjs [--dry]
//
// Dernière forme des coordonnées de démonstration, celle que les deux passes
// précédentes ne pouvaient pas atteindre :
//
//   items: ['📍 Toulouse & agglomération', '📞 05 XX XX XX XX', '📧 contact@voltlux.fr']
//
// Ni lien, ni texte JSX : des chaînes dans un tableau, rendues telles quelles
// dans le pied de page. Elles deviennent des concaténations, ce qui suppose une
// évaluation au rendu — d'où l'enchaînement avec `unfreeze-module-calls.mjs`.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const MAIL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const TEL = /\b0[1-9](?:[ .X-]?[\dX]{2}){4}\b/;

// Vrai si le morceau se termine par une barre oblique inverse non neutralisée :
// la recoller à un guillemet fermant en ferait un guillemet échappé.
function finitParBarre(x) {
  const m = /\\+$/.exec(x);
  return Boolean(m) && m[0].length % 2 === 1;
}

let mails = 0, tels = 0;
const touches = [];

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
    const aFd = /let fd: any = null;|\bconst fd\b/.test(src);
    if (!aFd) continue;

    let n = 0;
    src = src.split("\n").map((ligne) => {
      if (/^\s*(import|export|\/\/|\*)/.test(ligne)) return ligne;
      if (/href=|mailto:|tel:|alt=|alt:|aria|placeholder|content=|@type|schema/.test(ligne)) return ligne;
      // Une chaîne en position de donnée : élément de tableau ou valeur de
      // propriété. Sans ce cadrage, la passe attrapait aussi les attributs JSX,
      // où une concaténation nue n'est pas valide — 937 substitutions au lieu
      // de la centaine attendue.
      // Le motif doit être propre au guillemet ouvrant : une apostrophe dans une
      // chaîne à guillemets doubles — « l'international » — arrêtait la lecture
      // au milieu et la chaîne n'était jamais reconnue.
      return ligne.replace(/"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/g, (m0, dbl, sgl, pos) => {
        const q = dbl !== undefined ? '"' : "'";
        const valeur = dbl !== undefined ? dbl : sgl;
        const avantChar = ligne.slice(0, pos).replace(/\s+$/, "").slice(-1);
        const apresChar = ligne.slice(pos + m0.length).replace(/^\s+/, "").slice(0, 1);
        if (!"[,:".includes(avantChar)) return m0;
        if (apresChar && !"],}".includes(apresChar)) return m0;
        if (valeur.includes("${") || valeur.includes("fd?.")) return m0;
        // Une chaîne qui contient une séquence d'échappement ne se coupe pas :
        // « "+33 1 42 65 15 16\nreserve@letoile.paris" » coupé devant l'adresse
        // laisse la barre oblique inverse coller au guillemet fermant, qui
        // devient alors un guillemet échappé et emporte la fin du fichier.
        if (valeur.includes("\\")) return m0;
        const mail = MAIL.exec(valeur);
        const tel = !mail && TEL.exec(valeur);
        const trouve = mail ?? tel;
        if (!trouve) return m0;
        const champ = mail ? "email" : "phone";
        if (mail) mails++; else tels++;
        n++;
        const avant = valeur.slice(0, trouve.index);
        const apres = valeur.slice(trouve.index + trouve[0].length);
        const morceaux = [];
        if (avant) morceaux.push(`${q}${avant}${q}`);
        morceaux.push(`(fd?.${champ} ?? ${q}${trouve[0]}${q})`);
        if (apres) morceaux.push(`${q}${apres}${q}`);
        return morceaux.join(" + ");
      });
    }).join("\n");

    if (n === 0) continue;
    if (!dry) fs.writeFileSync(file, src);
    touches.push(`${file.replace(`${ROOT}/`, "")} (${n})`);
  }
}

console.log(`${dry ? "[à blanc] " : ""}${mails} adresse(s) et ${tels} numéro(s) sur ${touches.length} fichier(s)`);
console.log(touches.slice(0, 12).join("  ·  "));
console.log("\nEnchaîner avec : node scripts/unfreeze-module-calls.mjs");
