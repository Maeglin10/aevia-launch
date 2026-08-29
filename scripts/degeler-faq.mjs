/* Dégeler les constantes de module qui lisent la session.

   Ces tableaux appellent clientPhone/clientCity dans leur initialiseur, donc
   à l'import, quand sessionData vaut encore null : le repli gagnait toujours.
   On reprend le motif déjà employé ailleurs dans le dépôt (WORKS_DEMO_LIVE) :
   la valeur devient une fonction, et la constante est réévaluée au rendu,
   juste après l'affectation de la session. */
import fs from "node:fs";

const cas = [
  ["impact-215", "FAQS_DEMO"],
  ["impact-30", "FAQS_DEMO"],
  ["impact-32", "FAQS_DEMO"],
  ["impact-75", "FAQ_INLINE_SOURCE"],
  ["impact-95", "FAQ_ITEMS_DEMO"],
];

for (const [theme, nom] of cas) {
  const f = `app/templates/${theme}/page.tsx`;
  const L = fs.readFileSync(f, "utf8").split("\n");

  const iDecl = L.findIndex((l) => new RegExp(`^(?:export\\s+)?const ${nom}(?:\\s*:[^=]+)?\\s*=\\s*\\[\\s*$`).test(l));
  if (iDecl < 0) { console.log(`${theme} : DÉCLARATION INTROUVABLE`); continue; }

  /* la fin du tableau : profondeur de crochets revenue à zéro */
  let p = 0, iFin = -1;
  for (let k = iDecl; k < L.length; k++) {
    p += (L[k].match(/[[{(]/g) ?? []).length - (L[k].match(/[\]})]/g) ?? []).length;
    if (p <= 0) { iFin = k; break; }
  }
  if (iFin < 0) { console.log(`${theme} : FIN DU TABLEAU INTROUVABLE`); continue; }

  /* le point de réévaluation : la ligne qui affecte la session */
  const iSession = L.findIndex((l) => /^\s*sessionData = session;\s*$/.test(l) || /^\s*__layoutSession = session;\s*$/.test(l));
  if (iSession < 0) { console.log(`${theme} : POINT D'AFFECTATION INTROUVABLE`); continue; }
  if (iSession < iFin) { console.log(`${theme} : AFFECTATION AVANT LE TABLEAU, à traiter à la main`); continue; }

  const apres = [...L];
  /* du bas vers le haut, pour ne pas décaler les index */
  apres.splice(iSession + 1, 0,
    `  /* Le tableau lit la session : il doit être reconstruit ICI, au rendu.`,
    `     Écrit en constante de module, il était évalué à l'import, quand la`,
    `     session valait encore null — le repli gagnait toujours. */`,
    `  ${nom} = ${nom}_VIVANT();`);
  apres[iFin] = apres[iFin].replace(/^(\s*)\]/, "$1]");
  apres.splice(iFin + 1, 0, `let ${nom} = ${nom}_VIVANT();`);
  apres[iDecl] = `function ${nom}_VIVANT() {\n  return [`;
  apres[iFin] = apres[iFin].replace(/\];?\s*$/, "];\n}");

  fs.writeFileSync(f, apres.join("\n"));
  console.log(`${theme} : ${nom} dégelé (déclaration l.${iDecl + 1}, fin l.${iFin + 1}, rendu l.${iSession + 1})`);
}
