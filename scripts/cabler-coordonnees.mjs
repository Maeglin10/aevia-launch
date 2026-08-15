/*
  Câbler les coordonnées écrites en dur dans le texte visible.

    node scripts/cabler-coordonnees.mjs [--ecrire]

  Le défaut se répète à l'identique dans une quarantaine de pages : le lien est
  correct — `href={`mailto:${fd?.email ?? "contact@exemple.fr"}`}` — mais
  l'étiquette qu'on lit à l'écran est une adresse écrite en dur juste à côté.
  Le client reçoit un bouton qui écrit à la bonne adresse, sous un texte qui en
  annonce une autre. Mesuré sur impact-16/propos (« contact@obscura.fr »), puis
  retrouvé sur trente-neuf pages par le balayage des coordonnées.

  On ne touche qu'au texte entre deux balises, jamais à l'intérieur d'une
  chaîne : c'est ce mélange qui avait cassé seize fichiers lors d'un passage
  précédent.
*/
import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");
const RACINE = "app/templates";
const COURRIEL = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

/* La variable qui porte la session, telle que le fichier la nomme. */
function variableSession(s) {
  for (const v of ["fd", "__session", "__layoutSession", "sessionData"]) {
    if (new RegExp(`\\b${v.replace("$", "\\$")}\\b`).test(s)) return v;
  }
  return null;
}

const rapport = [];
for (const p of parcourir(RACINE)) {
  const src = fs.readFileSync(p, "utf8");
  const v = variableSession(src);
  if (!v) continue;
  const lecture = v === "fd" ? "fd?.email" : `clientEmail(${v})`;

  let out = src;
  const faits = [];
  /*
     Le texte d'un élément : ce qui suit `>` et précède `<`. On exige que le
     morceau soit exactement une adresse (au bruit d'espaces près) — un
     paragraphe qui cite une adresse au milieu d'une phrase reste intact,
     faute de pouvoir garantir la grammaire du remplacement.
  */
  /* Les lettres accentuées comptent : « contact@kinéprosportlyon.com » avait
     échappé à un motif limité à l'alphabet nu, sur six thèmes. */
  out = out.replace(/>(\s*)([\p{L}0-9._%+-]+@[\p{L}0-9.-]+\.[\p{L}]{2,})(\s*)</gu, (m, a, adresse, b) => {
    faits.push(adresse);
    return `>${a}{${lecture} ?? "${adresse}"}${b}<`;
  });

  if (!faits.length) continue;
  /* `clientEmail` doit être importé si on vient de s'en servir. */
  if (lecture.startsWith("clientEmail") && !/\bclientEmail\b\s*,/.test(out) && !/import\s*\{[^}]*\bclientEmail\b/.test(out)) {
    const m = out.match(/import \{\n?([^}]*)\} from "@\/lib\/templates\/clientContent";/);
    if (m) out = out.replace(m[0], m[0].replace(m[1], `  clientEmail,\n${m[1]}`));
    else out = out.replace(/^("use client";\n)/, `$1import { clientEmail } from "@/lib/templates/clientContent";\n`);
  }
  rapport.push({ fichier: p.slice(RACINE.length + 1), adresses: [...new Set(faits)] });
  if (ECRIRE) fs.writeFileSync(p, out);
}

function* parcourir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const c = path.join(d, e.name);
    if (e.isDirectory()) yield* parcourir(c);
    else if (e.name.endsWith(".tsx")) yield c;
  }
}

for (const r of rapport) console.log(`${r.fichier.padEnd(40)} ${r.adresses.join(" · ")}`);
console.log(`\n${rapport.length} fichiers · ${ECRIRE ? "écrits" : "simulation (ajouter --ecrire)"}`);
