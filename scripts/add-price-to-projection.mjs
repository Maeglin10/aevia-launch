// Ajoute le prix du client aux listes de prestations déjà câblées.
//
//   node scripts/add-price-to-projection.mjs [--dry]
//
// Une même liste sert souvent de grille de prestations et de grille tarifaire.
// Les passes précédentes y ont écrit le titre et la description du client, mais
// pas son prix : la carte porte donc le nom de sa prestation au-dessus du tarif
// d'une entreprise imaginaire. C'est la pire des deux erreurs — un tarif faux
// est plus grave qu'un tarif générique.
//
// Le prix ne s'écrit que s'il existe. Le client qui n'a pas chiffré une
// prestation garde le tarif du thème plutôt qu'une case vide.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");
const PRIX = ["price", "prix", "tarif", "p", "montant", "amount", "cout"];

function ferme(s, i, o, c) {
  let n = 0;
  for (let x = i; x < s.length; x++) {
    if (s[x] === o) n++;
    else if (s[x] === c) { n--; if (n === 0) return x; }
  }
  return -1;
}

function decoupe(s, i) {
  const fin = ferme(s, i, "(", ")");
  if (fin === -1) return null;
  const inner = s.slice(i + 1, fin);
  let d = 0, parts = [], cur = "";
  for (const ch of inner) {
    if ("([{".includes(ch)) d++;
    else if (")]}".includes(ch)) d--;
    if (ch === "," && d === 0) { parts.push(cur); cur = ""; } else cur += ch;
  }
  parts.push(cur);
  return { parts: parts.map((x) => x.trim()).filter(Boolean), fin };
}

let faits = 0;
const touches = new Set();

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");

  for (let tour = 0; tour < 30; tour++) {
    let fait = false;
    for (const m of src.matchAll(/resolveList(<[^>]*>)?\(\s*clientServices\(/g)) {
      const a = decoupe(src, m.index + "resolveList".length + (m[1] ?? "").length);
      if (!a || a.parts.length < 2) continue;
      const [reel, demoExpr] = a.parts;
      if (!/\.map\(/.test(reel)) continue;                 // pas encore projeté
      if (/s\.price|\bprice:|\bprix:|\bp:\s*s\./.test(reel)) continue;   // prix déjà là

      let corps = null;
      if (demoExpr.startsWith("[")) corps = demoExpr;
      else if (/^[A-Za-z_]\w*$/.test(demoExpr)) {
        const d = new RegExp(`(?:const|let)\\s+${demoExpr}\\s*(?::[^=]+)?=\\s*\\[`).exec(src);
        if (d) {
          const j = src.indexOf("[", d.index + d[0].length - 1);
          corps = src.slice(j, ferme(src, j, "[", "]") + 1);
        }
      }
      if (!corps) continue;
      const o = corps.indexOf("{");
      if (o === -1) continue;
      const fq = ferme(corps, o, "{", "}");
      if (fq === -1) continue;
      const ligne = corps.slice(o + 1, fq).replace(/<[^>]*>/g, "");
      const cles = [...ligne.matchAll(/["']?(\w+)["']?\s*:/g)].map((x) => x[1]);
      const k = cles.find((x) => PRIX.includes(x.toLowerCase()));
      if (!k) continue;

      // L'objet projeté est celui qui suit la flèche du `map` : `clientServices({
      // formData: fd })` en contient un autre, et c'est celui-là que la première
      // version complétait — le prix atterrissait dans l'argument du contrat.
      const fleche = reel.indexOf("=>");
      if (fleche === -1) continue;
      const ouvObj = reel.indexOf("({", fleche);
      if (ouvObj === -1) continue;
      const finObj = ferme(reel, ouvObj + 1, "{", "}");
      if (finObj === -1) continue;
      const neuf =
        reel.slice(0, finObj) +
        `, ...(s.price ? { ${k}: s.price } : {})` +
        reel.slice(finObj);

      src = src.slice(0, m.index) + `resolveList${m[1] ?? ""}(${neuf}, ${demoExpr})` + src.slice(a.fin + 1);
      faits++;
      touches.add(id);
      fait = true;
      break;
    }
    if (!fait) break;
  }

  if (!dry) fs.writeFileSync(file, src);
}

console.log(`${dry ? "[à blanc] " : ""}${faits} projection(s) complétée(s) sur ${touches.size} thème(s)`);
console.log([...touches].join(" "));
