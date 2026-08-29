/*
  Chercher les noms de la démonstration dans le texte réellement affiché.

    node scripts/qa-marques-rendues.mjs

  Le balayage précédent concluait « zéro marque de démonstration » sur neuf cent
  trente pages. Il ne cherchait pourtant que deux cent soixante marques : cent
  treize thèmes n'avaient jamais été relevés, faute d'apparaître dans la carte.
  impact-34 affichait « growth with WaveForm » sans que rien ne le dise.

  La carte est reconstruite depuis les replis du nom d'entreprise, puis chaque
  thème est cherché dans le texte de sa propre capture — et dans celui de tous
  les autres, pour attraper les noms recopiés d'un thème à l'autre.

  On lit le texte de la capture, pas le code : c'est ce que le visiteur voit.
*/
import fs from "node:fs";

const CARTE = JSON.parse(fs.readFileSync("/tmp/marques-toutes.json", "utf8"));
const FICHES = JSON.parse(fs.readFileSync("/tmp/captures/fiches.json", "utf8"));

/*
  Les marques d'un seul mot courant — « Atlas », « Table », « Cabinet », « Vert »,
  « Aqua », « Atelier », « Pierre », « Pulse », « INK » — se rencontrent dans du
  texte ordinaire et produisent des faux positifs par centaines. On ne cherche
  que les noms d'au moins deux mots, ou d'un mot assez distinctif pour ne pas
  être un nom commun français ou anglais.
*/
const COMMUN = new Set([
  "atlas", "table", "cabinet", "vert", "aqua", "atelier", "pierre", "pulse", "ink",
  "apex", "terra", "bureau", "encre", "paw", "reveal", "kinetic", "obscura", "block",
  "zero", "terre", "forge", "pause", "signature", "maison", "studio", "clef", "sel",
]);

/* Notre propre signature n'est pas une fuite : elle est vendue avec le site. */
const NOTRES = ["Aevia WS", "Aevia", "AEVIA MATERIALS"];

function cherchable(marque) {
  const m = marque.trim();
  if (m.length < 4) return null;
  if (NOTRES.includes(m)) return null;
  if (m.split(/\s+/).length === 1 && COMMUN.has(m.toLowerCase())) return null;
  return m;
}

/*
  Une marque doit être trouvée entière.

  `texte.includes("FORGE")` répondait vrai sur « FORGEZ VOTRE CORPS », et
  `includes("Terre")` sur « Épicés & Terreux ». Les bornes de mot de JavaScript
  ne tiennent pas sur les accents — « é » n'est pas un caractère de mot, si bien
  que « Éclat » se coupe avant le « c » — alors on borne à la main sur les
  lettres, accents compris.
*/
const LETTRE = /[A-Za-zÀ-ÖØ-öø-ÿ0-9]/;
function trouver(texte, marque) {
  let i = -1;
  while ((i = texte.indexOf(marque, i + 1)) >= 0) {
    const avant = texte[i - 1] ?? " ";
    const apres = texte[i + marque.length] ?? " ";
    if (!LETTRE.test(avant) && !LETTRE.test(apres)) return i;
  }
  return -1;
}

const cibles = Object.entries(CARTE)
  .map(([theme, marque]) => [theme, cherchable(String(marque))])
  .filter(([, m]) => m);

const trouvailles = [];
for (const fiche of FICHES) {
  if (!fiche.texte) continue;
  const texte = fiche.texte;
  const client = fiche.client ?? "";
  for (const [theme, marque] of cibles) {
    const ou = trouver(texte, marque);
    if (ou < 0) continue;
    /* Une marque contenue dans le nom du client n'est pas une fuite. */
    if (client && client.includes(marque)) continue;
    trouvailles.push({
      page: fiche.theme,
      marque,
      venantDe: theme,
      sienne: theme === fiche.theme,
      extrait: texte.slice(Math.max(0, ou - 40), ou + marque.length + 40),
    });
  }
}

const siennes = trouvailles.filter((t) => t.sienne);
const etrangeres = trouvailles.filter((t) => !t.sienne);

console.log(`${cibles.length} marques cherchées dans ${FICHES.filter((f) => f.texte).length} pages`);
console.log(`\n${siennes.length} pages affichent la marque de leur propre démonstration :`);
for (const t of siennes) console.log(`  ${t.page.padEnd(12)} « ${t.marque} »  …${t.extrait.replace(/\s+/g, " ")}…`);
console.log(`\n${etrangeres.length} pages affichent la marque d'un AUTRE thème :`);
for (const t of etrangeres) console.log(`  ${t.page.padEnd(12)} « ${t.marque} » (de ${t.venantDe})  …${t.extrait.replace(/\s+/g, " ")}…`);
