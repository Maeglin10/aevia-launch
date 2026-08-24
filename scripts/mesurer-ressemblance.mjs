/*
  Les thèmes se ressemblent-ils ? Mesure, pas impression.

  Le reproche est précis : à partir d'impact-328, les thèmes ajoutés se
  ressemblent tous. On ne juge pas sur le rendu — on lit ce qui fait qu'un
  thème a une allure : sa structure de sections, sa palette, ses polices, la
  forme de son en-tête et de son héros.

  Deux thèmes qui partagent la même empreinte sont le même thème repeint.
*/
import fs from "node:fs";
import path from "node:path";

const themes = fs.readdirSync("app/templates")
  .filter((d) => /^impact-\d+$/.test(d))
  .sort((a, b) => Number(a.slice(7)) - Number(b.slice(7)));

function empreinte(theme) {
  let src = "";
  for (const f of ["page.tsx", "shared.tsx", "layout.tsx"]) {
    const p = path.join("app/templates", theme, f);
    if (fs.existsSync(p)) src += fs.readFileSync(p, "utf8");
  }
  if (!src) return null;

  /* Les couleurs posées en dur : la palette du thème. */
  const couleurs = [...new Set([...src.matchAll(/#[0-9a-fA-F]{6}\b/g)].map((m) => m[0].toLowerCase()))].sort();
  /* Les polices déclarées. */
  const polices = [...new Set([...src.matchAll(/font-family:\s*['"]?([A-Za-z][\w \-]{2,30})/g)].map((m) => m[1].trim()))].sort();
  /* Les identifiants de section : la charpente de la page. */
  const sections = [...new Set([...src.matchAll(/id=["']([a-z][\w-]{2,24})["']/g)].map((m) => m[1]))].sort();
  /* Les composants importés de lucide : le vocabulaire visuel. */
  const icones = [...new Set([...src.matchAll(/from "lucide-react"/g)].map(() => 1))].length;
  /* La forme du code lui-même, dégrossie : longueur et nombre de blocs. */
  const lignes = src.split("\n").length;
  const sectionsJsx = (src.match(/<section/g) ?? []).length;

  return { theme, couleurs, polices, sections, icones, lignes, sectionsJsx, taille: src.length };
}

const emp = themes.map(empreinte).filter(Boolean);
const parNom = Object.fromEntries(emp.map((e) => [e.theme, e]));

/* Ressemblance : part des éléments partagés entre deux empreintes. */
const jaccard = (a, b) => {
  const A = new Set(a), B = new Set(b);
  if (!A.size && !B.size) return 1;
  const inter = [...A].filter((x) => B.has(x)).length;
  return inter / (A.size + B.size - inter);
};
function proximite(a, b) {
  const c = jaccard(a.couleurs, b.couleurs);
  const s = jaccard(a.sections, b.sections);
  const p = jaccard(a.polices, b.polices);
  /* La taille : deux thèmes de longueur très proche sont souvent le même. */
  const t = 1 - Math.abs(a.taille - b.taille) / Math.max(a.taille, b.taille);
  return 0.35 * c + 0.35 * s + 0.15 * p + 0.15 * t;
}

const RECENTS = emp.filter((e) => Number(e.theme.slice(7)) >= 326);
const ANCIENS = emp.filter((e) => Number(e.theme.slice(7)) < 326);

function moyenneInterne(groupe) {
  let somme = 0, n = 0;
  for (let i = 0; i < groupe.length; i++)
    for (let j = i + 1; j < groupe.length; j++) { somme += proximite(groupe[i], groupe[j]); n++; }
  return n ? somme / n : 0;
}

console.log(`${ANCIENS.length} thèmes avant 326 · ressemblance interne moyenne : ${(moyenneInterne(ANCIENS) * 100).toFixed(1)} %`);
console.log(`${RECENTS.length} thèmes depuis 326 · ressemblance interne moyenne : ${(moyenneInterne(RECENTS) * 100).toFixed(1)} %`);

/* Les paires trop proches parmi les récents. */
const paires = [];
for (let i = 0; i < RECENTS.length; i++)
  for (let j = i + 1; j < RECENTS.length; j++) {
    const s = proximite(RECENTS[i], RECENTS[j]);
    if (s >= 0.75) paires.push([RECENTS[i].theme, RECENTS[j].theme, s]);
  }
paires.sort((a, b) => b[2] - a[2]);
console.log(`\n${paires.length} paires à plus de 75 % de ressemblance parmi les récents :`);
for (const [a, b, s] of paires.slice(0, 15)) console.log(`  ${a} ≈ ${b}  ${(s * 100).toFixed(0)} %`);

/* Combien de thèmes récents ont au moins un quasi-jumeau ? */
const impliques = new Set(paires.flatMap(([a, b]) => [a, b]));
console.log(`\n${impliques.size} thèmes récents sur ${RECENTS.length} ont au moins un quasi-jumeau`);
fs.writeFileSync("/tmp/ressemblance.json", JSON.stringify({ paires, empreintes: parNom }, null, 1));
