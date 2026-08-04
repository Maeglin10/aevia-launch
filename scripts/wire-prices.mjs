// Fait porter aux grilles tarifaires les prix du client.
//
//   node scripts/wire-prices.mjs impact-11 impact-17 … [--dry]
//
// Vingt-cinq thèmes affichent une grille de tarifs entièrement inventée. Le
// client a pourtant saisi ses prix en même temps que ses prestations — les deux
// vont ensemble, une prestation sans prix ne se vend pas.
//
// Le prix ne s'écrit pas s'il est absent : `{ ...(s.price ? { p: s.price } : {}) }`
// laisse alors `resolveList` rendre celui de la démonstration, plutôt que
// d'afficher une carte à prix vide. C'est la règle donnée pour tout le
// catalogue — ce que le client ne remplit pas, le thème le garde.
//
// Une liste déjà passée par `resolveList` n'est pas retouchée : c'est ce qui
// évite de câbler deux fois la même grille, une fois comme prestation et une
// fois comme tarif.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const ids = process.argv.slice(2).filter((a) => a.startsWith("impact-"));
if (ids.length === 0) {
  console.error("usage: node scripts/wire-prices.mjs impact-11 [...] [--dry]");
  process.exit(1);
}

const NOM = ["name", "nom", "title", "titre", "label", "tier", "offre", "formule", "a", "t", "f", "n"];
const PRIX = ["price", "prix", "tarif", "p", "montant", "amount", "cout"];

function ferme(s, i, o, c) {
  let n = 0;
  for (let x = i; x < s.length; x++) {
    if (s[x] === o) n++;
    else if (s[x] === c) { n--; if (n === 0) return x; }
  }
  return -1;
}

let faits = 0;
const restants = [];

for (const id of ids) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) { restants.push(`${id} (absent)`); continue; }
  let src = fs.readFileSync(file, "utf8");


  // Les zones déjà câblées, pour ne pas les reprendre.
  const tabou = [...src.matchAll(/resolveList(?:<[^>]*>)?\(/g)]
    .map((m) => [m.index, ferme(src, m.index + m[0].length - 1, "(", ")")]);
  const dedans = (i) => tabou.some(([a, b]) => a <= i && i <= b);

  // Un thème porte souvent deux listes à prix : le catalogue et les formules.
  // La grille tarifaire est celle qui porte les marques d'une carte de prix —
  // des avantages, un bouton, une période. impact-11 a reçu ses tarifs dans son
  // catalogue de cours, qui n'affiche aucun prix, tant que ce score n'existait
  // pas.
  const MARQUEURS = /\b(features|avantages|cta|period|periode|highlight|popular|recommande|mois|month|an|billing)\b/i;
  let cible = null, meilleur = -1;
  for (const m of src.matchAll(/(?<![\w.])\[\s*\n?\s*\{/g)) {
    const j = m.index;
    if (dedans(j)) continue;
    const fin = ferme(src, j, "[", "]");
    if (fin === -1) continue;
    const oq = src.indexOf("{", j);
    const fq = ferme(src, oq, "{", "}");
    if (fq === -1 || fq > fin) continue;
    const ligne = src.slice(oq + 1, fq).replace(/<[^>]*>/g, "");
    const cles = [...ligne.matchAll(/["']?(\w+)["']?\s*:/g)].map((x) => x[1]);
    const bas = cles.map((k) => k.toLowerCase());
    const kNom = NOM.find((k) => bas.includes(k));
    const kPrix = PRIX.find((k) => bas.includes(k));
    if (!kNom || !kPrix || kNom === kPrix) continue;
    // Le prix doit ressembler à un prix : un montant, pas un pourcentage isolé.
    const valPrix = /["']?[Pp]?["']?\s*:\s*(["'][^"']*["']|\d+)/.exec(
      ligne.slice(ligne.toLowerCase().indexOf(kPrix + ":")),
    );
    if (!valPrix) continue;
    // On ne refuse que le `map` qui appelle un hook : sa longueur changerait
    // avec celle de la liste du client, et React compte les hooks. La première
    // version regardait les sept cents caractères suivants sans exiger le `map`,
    // et rejetait toute liste écrite avant un `useState` — celle d'impact-11
    // entre autres.
    if (/^\s*\.map\(\s*\(?[^)]{0,80}\)?\s*=>\s*[\s\S]{0,600}?use[A-Z]/.test(src.slice(fin + 1, fin + 700))) continue;
    const score = (MARQUEURS.test(ligne) ? 2 : 0) + (cles.length <= 6 ? 1 : 0);
    if (score > meilleur) {
      meilleur = score;
      cible = { j, fin, kNom: cles.find((k) => k.toLowerCase() === kNom), kPrix: cles.find((k) => k.toLowerCase() === kPrix) };
    }
  }
  if (!cible) { restants.push(`${id} (aucune grille tarifaire)`); continue; }

  const arg = /let sessionData: any = null;/.test(src)
    ? "sessionData"
    : /let bp: any = null;/.test(src)
      ? "{ formData: fd, businessProfile: bp }"
      : "{ formData: fd }";
  const corps = src.slice(cible.j, cible.fin + 1);
  const remp =
    `/* TARIFS */ resolveList(clientServices(${arg})?.map((s: any) => ` +
    `({ ${cible.kNom}: s.title, ...(s.price ? { ${cible.kPrix}: s.price } : {}) })), ${corps})`;
  src = src.slice(0, cible.j) + remp + src.slice(cible.fin + 1);

  if (!src.includes("templates/resolveList")) {
    const d = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = d ? d.index + d[0].length : 0;
    src = src.slice(0, at) + 'import { resolveList } from "@/lib/templates/resolveList";\n' + src.slice(at);
  }
  if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
    src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
      const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
      noms.add("clientServices");
      return "import {\n" + [...noms].sort().map((n) => `  ${n},\n`).join("") + '} from "@/lib/templates/clientContent";';
    });
  } else {
    const d = /(^|\n)\s*("use client";|'use client';)[^\n]*\n/.exec(src);
    const at = d ? d.index + d[0].length : 0;
    src = src.slice(0, at) + 'import { clientServices } from "@/lib/templates/clientContent";\n' + src.slice(at);
  }

  if (!dry) fs.writeFileSync(file, src);
  faits++;
  console.log(`${id}  ${cible.kNom} / ${cible.kPrix}  L${src.slice(0, cible.j).split("\n").length}`);
}

console.log(`\n${dry ? "[à blanc] " : ""}${faits} grille(s) câblée(s)`);
if (restants.length) console.log(`restants (${restants.length}) : ${restants.join(", ")}`);
