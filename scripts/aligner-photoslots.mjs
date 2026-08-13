/*
  Aligner les emplacements de photos sur ce que le thème place vraiment.

    node scripts/aligner-photoslots.mjs            # rapport seul
    node scripts/aligner-photoslots.mjs --ecrire   # met à jour photoSlots.ts

  `photo(i, …)` est le seul point où la photo du client remplace celle du
  thème : le nombre d'emplacements est donc le plus grand indice appelé, plus
  un. La réécriture des thèmes cachés a déplacé ces indices sans que le
  registre suive — impact-332 place deux photos et n'en demande qu'une (la
  seconde reste à jamais celle de la démonstration), impact-318 en demande sept
  pour une seule affichée (six questions sans effet).

  Le libellé vient de l'attribut `alt` posé juste après l'appel : c'est ce que
  le wizard montre au client pour qu'il sache quelle photo il fournit.
*/
import fs from "node:fs";
import path from "node:path";

const DOSSIER = path.join(process.cwd(), "app/templates");
const FICHIER = path.join(process.cwd(), "lib/templates/photoSlots.ts");
const ecrire = process.argv.includes("--ecrire");
const PORTEE = [...Array(68).keys()].map((k) => `impact-${316 + k}`);

const source = (id) => {
  const base = path.join(DOSSIER, id);
  if (!fs.existsSync(base)) return null;
  const bouts = [];
  const empiler = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) empiler(p);
      else if (e.name.endsWith(".tsx")) bouts.push(fs.readFileSync(p, "utf8"));
    }
  };
  empiler(base);
  return bouts.join("\n");
};

/* Le libellé de l'emplacement : l'alt le plus proche après l'appel. */
function libelles(src, combien) {
  const out = Array(combien).fill(null);
  for (const m of src.matchAll(/photo\(\s*(\d+)/g)) {
    const i = Number(m[1]);
    if (i >= combien || out[i]) continue;
    const suite = src.slice(m.index, m.index + 600);
    /* Le guillemet fermant doit être celui d'ouverture : « Pose d'un bloc-porte » se coupait à l'apostrophe. */
    const alt = /alt=(["'])([\s\S]{3,70}?)\1/.exec(suite);
    if (alt) out[i] = alt[2].replace(/\s+/g, " ").trim();
  }
  return out;
}

const texte = fs.readFileSync(FICHIER, "utf8");
let nouveau = texte;
const rapport = [];

for (const id of PORTEE) {
  const src = source(id);
  if (!src) continue;
  const indices = [...src.matchAll(/photo\(\s*(\d+)/g)].map((m) => Number(m[1]));
  const reel = indices.length ? Math.max(...indices) + 1 : 0;

  /* Deux écritures cohabitent : le bloc sur plusieurs lignes, et la forme courte « { n: 0, total: 0, labels: [] } ». */
  const bloc = new RegExp(`("${id}":\\s*\\{)([\\s\\S]*?)(\\n\\s*\\},|\\s*\\},)`);
  const trouve = bloc.exec(nouveau);
  if (!trouve) { rapport.push(`${id} absent du registre (${reel} emplacements)`); continue; }

  const actuelTotal = Number(/total:\s*(\d+)/.exec(trouve[2])?.[1] ?? -1);
  if (actuelTotal === reel) continue;

  const etiquettes = libelles(src, reel);
  const corps = reel === 0
    ? `\n  n: 0,\n  total: 0,\n  labels: [],`
    : `\n  n: ${reel},\n  total: ${reel},\n  labels: [\n${etiquettes.map((l) => `   ${l ? JSON.stringify(l) : "null"}`).join(",\n")}\n  ],`;
  nouveau = nouveau.replace(bloc, `$1${corps}$3`);
  rapport.push(`${id} · ${actuelTotal} → ${reel}`);
}

console.log(rapport.join("\n"));
console.log(`\n${rapport.length} thème(s) à corriger`);
if (ecrire) { fs.writeFileSync(FICHIER, nouveau); console.log("photoSlots.ts mis à jour"); }
