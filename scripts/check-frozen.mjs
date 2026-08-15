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
/*
  Ce qui rend une donnée dépendante de la session : un lecteur du contrat, mais
  aussi les variables que les thèmes en tirent. `const channels = [{ value:
  fd?.email ?? "contact@exemple.fr" }]` est figé à l'import exactement comme un
  appel au contrat — et impact-29/contact affichait l'adresse de la
  démonstration pour cette seule raison, sans que rien ne le signale.
*/
const CONTRAT =
  /client[A-Z]\w*\s*\(|\b(?:fd|bp|sessionData)\s*\?\./;

// Une ligne de tête : ce qui commence en colonne zéro et ouvre quelque chose.
const TETE = /^(?:export\s+)?(?:default\s+)?(?:async\s+)?(?:function|class|const|let|var)\s+(\w+)/;

const gelés = [];

// Les sous-pages produisent les mêmes constantes gelées que les pages
// d'accueil : impact-16/services y déclarait ses prestations au niveau module,
// donc évaluées à l'import, donc toujours celles de la démonstration.
const FICHIERS = [];
for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  FICHIERS.push([id, path.join(dossier, "page.tsx")]);
  for (const sous of fs.readdirSync(dossier)) {
    const f = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(f)) FICHIERS.push([`${id}/${sous}`, f]);
  }
}

for (const [id, file] of FICHIERS) {
  if (!fs.existsSync(file)) continue;
  const lignes = fs.readFileSync(file, "utf8").split("\n");

  let tete = null;
  for (const l of lignes) {
    // Une accolade en colonne zéro ferme le bloc de tête : sans cette remise à
    // zéro, une constante de données garde la main sur tout le reste du fichier
    // et fait passer pour gelés des appels écrits dans les composants.
    // Toute ligne en colonne zéro ferme la déclaration précédente — le `];` d'un
    // tableau comme le `}` d'une fonction. Sans cette remise à zéro, une
    // constante de données garde la main sur tout le reste du fichier et fait
    // passer pour gelés les appels écrits dans les composants.
    const m = TETE.exec(l);
    if (!m && l.length > 0 && !/^\s/.test(l)) tete = null;
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
