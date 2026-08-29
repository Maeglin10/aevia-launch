/*
  Rendre paresseuses les données des modules partagés.

    node scripts/cabler-accesseurs-partages.mjs [--ecrire]

  Un `shared.tsx` n'a pas de variable de session : il lit celle que la page a
  mémorisée, par `clientNameOr`. Mais ses données sont des constantes de module,
  évaluées à l'import — c'est-à-dire avant que la page n'ait mémorisé quoi que
  ce soit. Le repli de la démonstration est donc figé pour toujours, et
  impact-108 affichait « Ledger & Associés nous accompagne depuis 10 ans » sous
  le nom du client.

  Un accesseur résout cela sans toucher aux consommateurs : `texte: \`…\`` devient
  `get texte() { return \`…\`; }`, lu au rendu et non à l'import. La propriété se
  lit exactement comme avant.
*/
import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");
const RACINE = "app/templates";
const LECTEURS = /\bclient[A-Za-z]+(?:Or|Ou)\(/;

function* partages() {
  for (const theme of fs.readdirSync(RACINE).filter((d) => /^impact-\d+$/.test(d))) {
    for (const nom of ["shared.tsx", "layout.tsx"]) {
      const f = path.join(RACINE, theme, nom);
      if (fs.existsSync(f)) yield f;
    }
  }
}

const rapport = [];
for (const p of partages()) {
  const src = fs.readFileSync(p, "utf8");
  if (!LECTEURS.test(src)) continue;

  const lignes = src.split("\n");
  let faits = 0;
  /* Profondeur d'accolades : une propriété d'objet de module vit au-delà de
     zéro, et l'on ne touche jamais à ce qui est déjà un accesseur. */
  for (let i = 0; i < lignes.length; i++) {
    const l = lignes[i];
    if (!LECTEURS.test(l)) continue;
    if (/\bget\s+[\w$]+\s*\(/.test(l)) continue;
    /* `nom: valeur,` sur une seule ligne, la valeur tenant sur cette ligne. */
    const m = l.match(/^(\s*)([\w$]+):\s*(.+?),\s*$/);
    if (!m) continue;
    const [, marge, cle, valeur] = m;
    /* Une valeur qui contient une accolade ouvrante non refermée déborderait. */
    const ouvertes = (valeur.match(/[({[]/g) ?? []).length;
    const fermees = (valeur.match(/[)}\]]/g) ?? []).length;
    if (ouvertes !== fermees) continue;
    lignes[i] = `${marge}get ${cle}() { return ${valeur}; },`;
    faits++;
  }

  if (!faits) continue;
  rapport.push({ fichier: p.slice(RACINE.length + 1), faits });
  if (ECRIRE) fs.writeFileSync(p, lignes.join("\n"));
}

for (const r of rapport) console.log(`${r.fichier.padEnd(34)} ×${r.faits}`);
console.log(`\n${rapport.length} fichiers · ${rapport.reduce((a, r) => a + r.faits, 0)} propriétés · ${ECRIRE ? "écrit" : "simulation (--ecrire)"}`);
