// Empêche un carrousel de lire au-delà de la liste du client.
//
//   node scripts/guard-carousel-index.mjs [--dry] [impact-01 …]
//
// Un carrousel garde son index dans un état, et sa rotation automatique vit
// dans un `useEffect(…, [])` : la liste y est celle du **premier** rendu, quand
// la session n'est pas encore arrivée — quatre témoignages de démonstration.
// L'index monte jusqu'à trois, la session arrive, la liste tombe au seul avis
// que le client a saisi, et la page plante sur `TESTIMONIALS[3].stars`.
//
// impact-10 et impact-200 tombaient ainsi ; dix-huit autres thèmes portent le
// même montage sans l'avoir encore payé. Chaque lecture `LISTE[index]` devient
// `LISTE[index % LISTE.length]` : l'index tourne au lieu de sortir, le
// carrousel garde son animation et sa mise en page.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const seulement = process.argv.slice(2).filter((a) => a.startsWith("impact-"));

let faits = 0;
const touches = [];
const ids = seulement.length ? seulement : fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"));

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");

  // Les listes que le client alimente, et les index gardés dans un état.
  const listes = new Set();
  for (const m of src.matchAll(/(?:const|let|var)?\s*(\w+)\s*=\s*(?:\/\*[^*]*\*\/\s*)?resolveList/g)) listes.add(m[1]);
  const etats = new Set();
  for (const m of src.matchAll(/const \[(\w+), set\w+\] = useState[^(]*\(\d+\)/g)) etats.add(m[1]);
  if (listes.size === 0 || etats.size === 0) continue;

  let n = 0;
  for (const L of listes) {
    for (const E of etats) {
      const motif = new RegExp(`\\b${L}\\[${E}\\]`, "g");
      const neuf = src.replace(motif, () => { n++; return `${L}[${E} % ${L}.length]`; });
      src = neuf;
    }
  }

  if (n === 0) continue;
  if (!dry) fs.writeFileSync(file, src);
  faits += n;
  touches.push(`${id} (${n})`);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} lecture(s) d'index bornées sur ${touches.length} thème(s)`);
console.log(touches.slice(0, 20).join("  ·  "));
