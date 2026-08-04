// Fait lire la couleur du client aux thèmes qui l'ignorent.
//
//   node scripts/wire-brand-color.mjs [--dry]
//
// `BrandColorVar` pose `--brand` sur la racine du document depuis la couleur
// choisie au wizard, et 340 thèmes écrivent leurs accents `var(--brand, #hex)` :
// sans couleur choisie ils gardent la leur, avec elle ils se recolorent en
// entier. Vingt-cinq thèmes écrivent leur accent en dur et ne bougent donc
// jamais, quelle que soit la couleur demandée.
//
// L'accent d'un thème est sa teinte la plus répétée qui ne soit ni un gris, ni
// un presque-noir, ni un presque-blanc — les fonds et les textes ne sont pas des
// accents. Elle devient `var(--brand, #hex)` partout où elle est écrite.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

// Un gris, un presque-noir ou un presque-blanc n'est pas un accent.
function estNeutre(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 0xff, g = (n >> 8) & 0xff, b = n & 0xff;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max - min < 26) return true;              // gris
  if (max < 40) return true;                    // presque noir
  if (min > 225) return true;                   // presque blanc
  return false;
}

let faits = 0;
const touches = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  const fichiers = [path.join(dossier, "page.tsx"), path.join(dossier, "layout.tsx"), path.join(dossier, "shared.tsx")]
    .filter((f) => fs.existsSync(f));
  if (fichiers.length === 0) continue;

  const tout = fichiers.map((f) => fs.readFileSync(f, "utf8")).join("\n");
  /*
    Un seul `var(--brand)` ne suffit pas à dire qu'un thème suit la couleur du
    client : impact-02 en a un, sur une quarantaine d'accents écrits en dur, et
    ne bouge pas à l'œil. On compare donc le nombre de lectures de la variable au
    nombre d'écritures de la teinte.
  */
  const lectures = (tout.match(/var\(--brand/g) ?? []).length;

  const comptes = {};
  for (const m of tout.matchAll(/#[0-9a-fA-F]{6}\b/g)) {
    const hex = m[0].toLowerCase();
    if (estNeutre(hex)) continue;
    comptes[hex] = (comptes[hex] ?? 0) + 1;
  }
  const [accent, n] = Object.entries(comptes).sort((a, b) => b[1] - a[1])[0] ?? [];
  if (!accent || n < 3) continue;
  if (lectures >= n) continue;   // le thème lit déjà la couleur autant qu'il l'écrit

  let k = 0;
  for (const f of fichiers) {
    let src = fs.readFileSync(f, "utf8");
    const motif = new RegExp(`(["'\`])(${accent})\\1`, "gi");
    const neuf = src.replace(motif, (m0, q, hex, pos) => {
      // Une couleur écrite dans une adresse ou un identifiant n'en est pas une.
      const avant = src.slice(Math.max(0, pos - 60), pos);
      if (/https?:|url\(|#[0-9a-f]*$/i.test(avant)) return m0;
      k++;
      return `${q}var(--brand, ${hex})${q}`;
    });
    if (neuf === src) continue;
    if (!dry) fs.writeFileSync(f, neuf);
  }

  if (k === 0) continue;
  faits += k;
  touches.push(`${id} (${k}× ${accent})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} accent(s) branché(s) sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 14).join("  ·  "));
