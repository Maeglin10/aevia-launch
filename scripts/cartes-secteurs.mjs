/*
  Refaire les deux cartes dont la capture se sert, depuis le catalogue.

    node scripts/cartes-secteurs.mjs

  La capture éprouve chaque thème avec le métier auquel le formulaire le
  propose. Elle lit pour cela deux fichiers déposés dans /tmp — quel thème sert
  quel secteur, et quel domaine de client représente ce secteur.

  Ces fichiers avaient été écrits une fois, puis oubliés. Cinquante-deux thèmes
  ont changé de secteur depuis, et cinq secteurs entiers — ceux de « Tech &
  Agences » — n'y figuraient pas du tout : leurs thèmes retombaient sur le
  couvreur. impact-34, plateforme de podcast, montrait donc « Réfection complète
  de toiture » entre deux graphiques d'audience, et la mesure comptait cela
  comme un défaut du thème.

  On les régénère avant chaque balayage.
*/
import fs from "node:fs";

const src = fs.readFileSync("lib/templates/sectors.ts", "utf8");

/* SECTOR_TEMPLATES : quel secteur propose quels thèmes. */
const parTheme = {};
for (const m of src.matchAll(/^ {2}([a-z_0-9]+):\s*\[([^\]]*)\]/gm)) {
  for (const t of m[2].match(/impact-\d+/g) ?? []) (parTheme[t] ??= []).push(m[1]);
}

/* INDUSTRIES : quel domaine de client représente quel secteur. */
const domaineDuSecteur = {};
/* Les onze industries du catalogue, chacune vers sa fiche client. */
const DOMAINE = {
  tech: "Tech & Agences",
  sante: "Santé",
  services: "Services & Artisanat",
  droit_finance: "Droit & Finance",
  restauration: "Restauration",
  sport_coaching: "Sport & Coaching",
  art_creation: "Art & Création",
  evenementiel: "Événementiel",
  beaute: "Beauté",
  immobilier_architecture: "Immobilier & Architecture",
  hebergement: "Hôtellerie & Voyage",
};

let industrieCourante = null;
for (const ligne of src.split("\n")) {
  const industrie = /^\s{4}id:\s*'([a-z_0-9]+)',/.exec(ligne);
  if (industrie && DOMAINE[industrie[1]]) { industrieCourante = DOMAINE[industrie[1]]; continue; }
  if (industrie) { industrieCourante = null; continue; }
  const specialite = /\{\s*id:\s*'([a-z_0-9]+)'/.exec(ligne);
  if (specialite && industrieCourante) domaineDuSecteur[specialite[1]] = industrieCourante;
}

fs.writeFileSync("/tmp/theme-secteurs.json", JSON.stringify(parTheme));
fs.writeFileSync("/tmp/secteur-domaine.json", JSON.stringify(domaineDuSecteur));

const sans = Object.keys(parTheme).filter((t) => !(parTheme[t] ?? []).some((s) => domaineDuSecteur[s]));
console.log(`${Object.keys(parTheme).length} thèmes · ${Object.keys(domaineDuSecteur).length} secteurs cartographiés`);
console.log(`${sans.length} thèmes sans domaine de client : ${sans.join(" ") || "aucun"}`);
