/*
  Les logos écrits en deux morceaux.

    node scripts/cabler-logos-coupes.mjs [--ecrire]

  Beaucoup de thèmes composent leur logo en deux couleurs :

      QBit <span style={{ color: "var(--brand)" }}>Labs</span>

  Le nom de la démonstration est alors coupé entre deux éléments, et aucun
  remplacement portant sur « QBit Labs » ne peut le voir. Le nom du client
  s'affichait partout ailleurs sur la page, sauf dans l'en-tête et le pied —
  c'est-à-dire aux deux endroits qu'on regarde en premier.

  On garde le parti pris du thème : le premier mot d'un côté, le reste dans
  l'élément coloré. Seul le contenu change.
*/
import fs from "node:fs";
import path from "node:path";

const ECRIRE = process.argv.includes("--ecrire");
const MARQUES = JSON.parse(fs.readFileSync("/tmp/marques.json", "utf8"));
const RACINE = "app/templates";

function* parcourir(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const c = path.join(d, e.name);
    if (e.isDirectory()) yield* parcourir(c);
    else if (e.name.endsWith(".tsx")) yield c;
  }
}

function variableSession(s) {
  for (const v of ["sessionData", "__session", "__layoutSession"]) {
    if (new RegExp(`\\b${v}\\b`).test(s)) return v;
  }
  return null;
}

const rapport = [];
for (const p of parcourir(RACINE)) {
  const theme = p.slice(RACINE.length + 1).split("/")[0];
  const marque = MARQUES[theme];
  if (!marque || !marque.includes(" ")) continue;
  const v = variableSession(fs.readFileSync(p, "utf8"));
  if (!v) continue;

  let src = fs.readFileSync(p, "utf8");
  const lecture = `clientName(${v}) ?? "${marque}"`;
  const [tete, ...queue] = marque.split(/\s+/);
  const reste = queue.join(" ");
  let faits = 0;

  /*
     `>Tête <span …>Reste</span>` — la coupure peut tomber n'importe où dans le
     nom, on essaie donc chaque découpage possible plutôt que le seul premier
     mot : « Pétales & Co » se coupe après « Pétales & » dans un thème et après
     « Pétales » dans un autre.
  */
  const mots = marque.split(/\s+/);
  for (let k = 1; k < mots.length; k++) {
    const avant = mots.slice(0, k).join(" ");
    const apres = mots.slice(k).join(" ");
    const motif = new RegExp(
      `>(\\s*)(?:${formes(avant)})(\\s*)(<span[^>]*>)(\\s*)(?:${formes(apres)})(\\s*)(</span>)`,
      "g",
    );
    src = src.replace(motif, (tout, a, b, ouvre, c, d, ferme) => {
      faits++;
      return `>${a}{(${lecture}).split(" ").slice(0, ${k}).join(" ")}${b}${ouvre}${c}{(${lecture}).split(" ").slice(${k}).join(" ")}${d}${ferme}`;
    });
  }

  if (!faits) continue;
  if (!/import\s*\{[^}]*\bclientName\b/.test(src)) {
    const bloc = src.match(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/);
    if (bloc) {
      const noms = [...new Set([...bloc[1].matchAll(/client[A-Za-z]+/g)].map((x) => x[0]).concat("clientName"))].sort();
      src = src.replace(bloc[0], `import {\n${noms.map((n) => `  ${n},\n`).join("")}} from "@/lib/templates/clientContent";`);
    } else {
      const j = src.indexOf("\n", src.indexOf('"use client"')) + 1;
      src = src.slice(0, j) + 'import { clientName } from "@/lib/templates/clientContent";\n' + src.slice(j);
    }
  }
  rapport.push({ fichier: p.slice(RACINE.length + 1), marque, faits });
  if (ECRIRE) fs.writeFileSync(p, src);
}

/* Les trois écritures d'un morceau de marque : le catalogue relève ce que la
   feuille de style affiche (« STUDIO VERSA ») quand la source écrit
   « Studio </span>Versa ». */
function formes(s) {
  const titre = s.toLowerCase().replace(/(^|[\s'’-])(\p{L})/gu, (_, a, b) => a + b.toUpperCase());
  return [...new Set([s, titre, s.toUpperCase()])]
    .sort((a, b) => b.length - a.length)
    .map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|");
}

for (const r of rapport) console.log(`${r.fichier.padEnd(40)} « ${r.marque} » ×${r.faits}`);
console.log(`\n${rapport.length} fichiers · ${rapport.reduce((a, r) => a + r.faits, 0)} logos · ${ECRIRE ? "écrit" : "simulation (--ecrire)"}`);
