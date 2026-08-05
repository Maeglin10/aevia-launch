// Câble les emails de CONTACT affichés (footer, carte contact, mailto) sur
// l'email du client : `fd?.email ?? "<démo>"`. Ne touche PAS :
//  - la prose RGPD / légale (« écrivez à … pour exercer vos droits »)
//  - l'email volontaire du fondateur (valentinmilliand@…)
//  - les constantes de module sans `fd` en portée
// Deux formes traitées : texte JSX enfant `>email<`, et objet {label,href:mailto}.
// Lancer `--apply` pour écrire ; sans, dry-run.
import { readFileSync, writeFileSync } from 'fs';

const APPLY = process.argv.includes('--apply');

// (fichier, email, mode) — mode: 'jsx' | 'label' | 'session'
// `session` = fichier qui lit session?.formData au lieu de fd
const TARGETS = [
  ['app/templates/impact-281/page.tsx', 'contact@maisonceleste.fr', 'label'],
  ['app/templates/impact-246/page.tsx', 'contact@thermofix-pro.fr', 'label'],
  ['app/templates/impact-289/page.tsx', 'contact@schreiber-ec.fr', 'label'],
  ['app/templates/impact-239/page.tsx', 'contact@mda-avocats.fr', 'label'],
  ['app/templates/impact-280/page.tsx', 'contact@epousailles-alsace.fr', 'label'],
  ['app/templates/impact-262/page.tsx', 'studio@noirAbsolu.fr', 'label'],
  ['app/templates/impact-275/page.tsx', 'contact@cabinet-faure.fr', 'label'],
  ['app/templates/impact-36/layout.tsx', 'contact@exemple.fr', 'jsx'],
  ['app/templates/impact-73/contact/page.tsx', 'contact@exemple.fr', 'jsx'],
  ['app/templates/impact-104/contact/page.tsx', 'contact@lumieredoree.fr', 'jsx'],
  ['app/templates/impact-38/contact/page.tsx', 'contact@originroast.co', 'jsx'],
  ['app/templates/impact-38/layout.tsx', 'contact@exemple.fr', 'jsx'],
  ['app/templates/impact-71/contact/page.tsx', 'contact@exemple.fr', 'jsx'],
  ['app/templates/impact-63/contact/page.tsx', 'contact@exemple.fr', 'jsx'],
  ['app/templates/impact-72/contact/page.tsx', 'contact@exemple.fr', 'jsx'],
  ['app/templates/impact-29/contact/page.tsx', 'contact@exemple.fr', 'jsx'],
  ['app/templates/impact-69/about/page.tsx', 'contact@exemple.fr', 'jsx'],
  ['app/templates/impact-108/contact/page.tsx', 'contact@ledger-associes.fr', 'jsx'],
  ['app/templates/impact-16/propos/page.tsx', 'contact@obscura.fr', 'jsx'],
  ['app/templates/impact-53/layout.tsx', 'hello@meshwarp.studio', 'jsx'],
  ['app/templates/impact-56/contact/page.tsx', 'contact@exemple.fr', 'jsx'],
];

const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

let totalHits = 0;
const summary = [];

for (const [file, email, mode] of TARGETS) {
  let src;
  try { src = readFileSync(file, 'utf8'); } catch { summary.push(`SKIP (absent) ${file}`); continue; }
  const before = src;
  let hits = 0;

  if (mode === 'jsx') {
    // >  email  <   (texte enfant JSX, éventuels espaces)
    const re = new RegExp('>(\\s*)' + esc(email) + '(\\s*)<', 'g');
    src = src.replace(re, (_m, a, b) => { hits++; return `>${a}{fd?.email ?? "${email}"}${b}<`; });
  } else if (mode === 'label') {
    // label: 'email'  -> label: fd?.email ?? 'email'
    const reLabel = new RegExp("label:\\s*'" + esc(email) + "'", 'g');
    src = src.replace(reLabel, () => { hits++; return `label: fd?.email ?? '${email}'`; });
    // href: 'mailto:email' -> href: `mailto:${fd?.email ?? 'email'}`
    const reHref = new RegExp("href:\\s*'mailto:" + esc(email) + "'", 'g');
    src = src.replace(reHref, () => { hits++; return "href: `mailto:${fd?.email ?? '" + email + "'}`"; });
  }

  if (hits > 0) {
    totalHits += hits;
    summary.push(`${hits}×  ${file}  [${email}]`);
    // diff des lignes changées
    if (!APPLY) {
      const bl = before.split('\n'), al = src.split('\n');
      for (let i = 0; i < al.length; i++) if (bl[i] !== al[i]) console.log(`  ${file}:${i + 1}\n   - ${bl[i]?.trim()}\n   + ${al[i]?.trim()}`);
    }
    if (APPLY) writeFileSync(file, src);
  } else {
    summary.push(`0×  ${file}  [${email}]  ⚠️ AUCUN MATCH`);
  }
}

console.log('\n=== Résumé ===');
console.log(summary.join('\n'));
console.log(`\nTotal remplacements: ${totalHits}  (${APPLY ? 'ÉCRIT' : 'dry-run'})`);
