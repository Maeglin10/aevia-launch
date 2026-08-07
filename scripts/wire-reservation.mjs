// Le lien de réservation du client, sous ses boutons « Prendre rendez-vous ».
//
//   node scripts/wire-reservation.mjs --dry
//
// Cent cinquante et un thèmes affichent un bouton de réservation ; cinq
// seulement le relient au lien que le client a saisi. Un kinésithérapeute
// remplit son adresse Doctolib au formulaire, son site l'ignore et renvoie
// vers une ancre interne. Le champ est demandé pour rien.
//
// On remplace donc la destination du bouton par celle du client, en gardant la
// destination d'origine en repli — et l'on ouvre dans un nouvel onglet quand
// c'est un lien externe, jamais quand c'est une ancre.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seuls = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
const ids = seuls.length ? seuls : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-")).sort();

/*
  Le libellé qui fait d'un lien un bouton de réservation. On refuse « contact »,
  « devis » et « appeler » : ceux-là mènent au formulaire ou au téléphone, pas à
  l'agenda, et les détourner vers Doctolib serait une erreur.
*/
const LIBELLE = /(prendre\s+(un\s+)?(rendez-?vous|rdv)|réserver|reserver|book\s+(a|an|now|online)|prenez\s+rendez-?vous|réservation\s+en\s+ligne)/i;

let faits = 0;
const touches = [];
const restes = [];

for (const id of ids) {
  const f = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(f)) continue;
  let src = fs.readFileSync(f, "utf8");
  if (src.includes("bookingSystem") || src.includes("clientBookingUrl")) { restes.push(`${id} (déjà branché)`); continue; }

  let poses = 0;

  /*
    Chaque <a> dont le contenu porte un libellé de réservation. On lit la
    balise entière pour ne pas confondre le href du lien avec celui d'un
    enfant, et l'on saute les liens déjà dynamiques vers un agenda.
  */
  const balises = [...src.matchAll(/<a\b([^>]*?)>([\s\S]{0,300}?)<\/a>/g)];
  for (const m of balises.reverse()) {
    const [entier, attributs, contenu] = m;
    const texte = contenu.replace(/<[^>]*>/g, " ").replace(/\{[^}]*\}/g, " ");
    if (!LIBELLE.test(texte)) continue;

    const href = /href=(\{[^}]*\}|"[^"]*"|'[^']*')/.exec(attributs);
    if (!href) continue;
    // Un lien déjà bâti sur une donnée du client (téléphone, courriel) n'est
    // pas un bouton d'agenda : le détourner casserait l'appel d'urgence.
    if (/mailto:|tel:/.test(href[1])) continue;

    const origine = href[1];
    const neufAttributs = attributs.replace(
      href[0],
      `href={clientBookingUrl(sessionData) ?? ${origine.startsWith("{") ? origine.slice(1, -1) : origine}}`
        + ` {...(clientBookingUrl(sessionData) ? { target: "_blank", rel: "noopener noreferrer" } : {})}`,
    );
    src = src.slice(0, m.index) + `<a${neufAttributs}>${contenu}</a>` + src.slice(m.index + entier.length);
    poses++;
  }

  if (poses === 0) { restes.push(`${id} (pas de bouton de réservation en dur)`); continue; }

  /*
    Le nom s'insère juste après l'accolade ouvrante de l'import du contrat :
    reconstruire la liste a déjà cassé quatorze fichiers.
  */
  if (!/^\s*clientBookingUrl,/m.test(src)) {
    const marque = '} from "@/lib/templates/clientContent";';
    const fin = src.indexOf(marque);
    if (fin < 0) { restes.push(`${id} (pas d'import du contrat)`); continue; }
    const debut = src.lastIndexOf("import {", fin);
    src = src.slice(0, debut + "import {".length) + "\n  clientBookingUrl," + src.slice(debut + "import {".length);
  }

  if (!dry) fs.writeFileSync(f, src);
  faits++;
  touches.push(`${id} (${poses})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} thème(s), ${touches.reduce((n, t) => n + Number(/\((\d+)\)/.exec(t)[1]), 0)} bouton(s) reliés à l'agenda du client`);
console.log(touches.slice(0, 40).join("  ·  "));
const vraisRestes = restes.filter((r) => !r.includes("pas de bouton"));
if (vraisRestes.length) console.log(`\nlaissés tels quels (${vraisRestes.length}) :\n   ${vraisRestes.slice(0, 12).join("\n   ")}`);
console.log(`\nsans bouton de réservation en dur : ${restes.length - vraisRestes.length}`);
