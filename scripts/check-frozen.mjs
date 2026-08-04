// Signale les appels au contrat évalués à l'import.
//
//   node scripts/check-frozen.mjs
//
// Une constante de module est évaluée quand le fichier est importé — avant que
// la moindre session existe. Un `clientServices(...)` écrit là renvoie
// `undefined` pour toujours, et le thème garde sa démonstration quoi que le
// client saisisse. C'est l'erreur la plus coûteuse du chantier : invisible à la
// compilation, invisible à la lecture du diff, visible seulement à la mesure.
//
// La détection ne cherche pas la fin de la déclaration. Deux tentatives s'y sont
// cassées : le point-virgule d'un commentaire coupe la lecture trop tôt, et
// l'apostrophe d'un texte JSX — « l'engagement » — passe pour une chaîne ouverte
// et emporte la lecture jusqu'au bout du fichier. On regarde en arrière : la
// dernière déclaration écrite en colonne zéro avant l'appel dit dans quoi il vit.
//
// À lancer après chaque passe de câblage. Sortie non nulle s'il en reste.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const CONTRAT =
  /client(?:Services|Reviews|Stats|Faq|Team|Areas|Certifications|Name|City|Tagline|Address|Photos)\s*\(/;

// Une ligne de tête : ce qui commence en colonne zéro et ouvre quelque chose.
const TETE = /^(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function|class|const|let|var)\s+(\w+)/;

const gelés = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  const lignes = fs.readFileSync(file, "utf8").split("\n");

  let tete = null;
  for (const l of lignes) {
    // Une accolade en colonne zéro ferme le bloc de tête : sans cette remise à
    // zéro, une constante de données garde la main sur tout le reste du fichier
    // et fait passer pour gelés des appels écrits dans les composants.
    if (/^[})\]]/.test(l)) tete = null;
    const m = TETE.exec(l);
    if (m) {
      const apresEgal = l.includes("=") ? l.slice(l.indexOf("=") + 1) : "";
      const fonction =
        /^(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function|class)\b/.test(l) ||
        /^\s*(?:async\s+)?(?:\([^()]*\)|[A-Za-z_$][\w$]*)\s*(?::[^=]*)?=>/.test(apresEgal) ||
        /^\s*(?:async\s+)?function\b/.test(apresEgal) ||
        /^\s*(?:React\.)?(?:memo|forwardRef)\s*\(/.test(apresEgal);
      tete = { nom: m[1], fonction };
    }
    if (!tete || tete.fonction) continue;
    if (CONTRAT.test(l)) {
      const cle = `${id}  ${tete.nom}`;
      if (!gelés.includes(cle)) gelés.push(cle);
    }
  }
}

if (gelés.length === 0) {
  console.log("aucun appel gelé à l'import");
} else {
  console.log(`${gelés.length} constante(s) de module appelant le contrat :`);
  console.log(gelés.join("\n"));
  process.exitCode = 1;
}
