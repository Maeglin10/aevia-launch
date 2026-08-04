// Traduit les données du client dans le vocabulaire de chaque thème.
//
//   node scripts/project-raw-resolve.mjs [--dry]
//
// `resolveList(clientStats(session), STATS_DEMO)` ne marche que si le thème lit
// ses chiffres sous `value` et `label`. Beaucoup les lisent autrement :
//
//   { target: 147, suffix: "+", label: "Clients" }   → un compteur animé
//   { q: "…", n: "Claire M.", l: "Lyon" }            → un avis
//   { titre: "…", desc: "…" }                        → une prestation
//
// `resolveList` fusionne la ligne de démonstration sous celle du client ; les
// clés que le client n'apporte pas restent donc celles du thème, et le chiffre
// affiché reste celui de la démonstration. Le contrat publie déjà plusieurs
// alias, mais pas `target` ni `n` : on écrit ici la projection manquante.
//
// Le cas du compteur mérite mieux qu'un abandon : `target` est un nombre que le
// thème anime de zéro jusqu'à lui. « 2000+ » y devient `target: 2000` et
// `suffix: "+"`, ce qui garde l'animation et montre le chiffre du client.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

function ferme(s, i, o, c) {
  let n = 0;
  for (let x = i; x < s.length; x++) {
    if (s[x] === o) n++;
    else if (s[x] === c) { n--; if (n === 0) return x; }
  }
  return -1;
}

function arguments2(s, i) {
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

// Pour chaque champ du contrat, les noms sous lesquels un thème peut le lire.
const SYN = {
  clientServices: {
    title: ["title", "titre", "name", "nom", "t", "label", "heading", "intitule"],
    desc: ["desc", "description", "text", "body", "sub", "d", "detail", "blurb", "resume"],
    price: ["price", "prix", "p", "tarif", "amount"],
  },
  clientReviews: {
    text: ["text", "quote", "q", "texte", "content", "body", "avis", "citation"],
    author: ["author", "auteur", "prenom", "name", "nom", "n", "client", "who", "patient"],
    detail: ["role", "l", "poste", "fonction", "job", "handle", "org", "source", "location", "ville"],
    rating: ["rating", "stars", "note", "etoiles"],
  },
  clientStats: {
    value: ["value", "val", "v", "num", "number", "target", "count", "chiffre", "figure", "n"],
    label: ["label", "l", "libelle", "text", "title", "caption", "name", "legende"],
  },
  clientFaq: { q: ["q", "question"], a: ["a", "answer", "reponse", "r"] },
  clientTeam: {
    name: ["name", "prenom", "nom", "n"],
    role: ["role", "titre", "poste", "fonction", "sp", "f", "title", "job", "specialite"],
  },
};

// Ce que le contrat garantit sans projection : si le thème lit déjà sous ces
// noms-là, il n'y a rien à traduire.
const CANON = {
  clientServices: [["title", "name"], ["desc", "description"]],
  clientReviews: [["text", "quote"], ["author", "name"]],
  clientStats: [["value"], ["label"]],
  clientFaq: [["q"], ["a"]],
  clientTeam: [["name"], ["role"]],
};

let faits = 0;
const touches = new Set();
const notes = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const file = path.join(ROOT, id, "page.tsx");
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");

  for (let tour = 0; tour < 30; tour++) {
    let fait = false;
    // `resolveList<any>(…)` est aussi fréquent que `resolveList(…)` : la
    // parenthèse ouvrante n'est pas toujours collée au nom.
    for (const m of src.matchAll(/resolveList(<[^>]*>)?\(\s*(client[A-Z][a-zA-Z]*)\(/g)) {
      const helper = m[2];
      const generique = m[1] ?? "";
      if (!CANON[helper]) continue;
      const a = arguments2(src, m.index + "resolveList".length + generique.length);
      if (!a || a.parts.length < 2) continue;
      const [reel, demoExpr] = a.parts;
      if (/\.map\(/.test(reel)) continue;                       // déjà projeté

      // Le corps de la démonstration, écrit sur place ou nommé plus haut.
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
      if (o === -1) continue;                                    // tableau de chaînes
      const fq = ferme(corps, o, "{", "}");
      if (fq === -1) continue;
      const ligne = corps.slice(o + 1, fq);
      const paires = [...ligne.matchAll(/["']?(\w+)["']?\s*:\s*([^,\n]*)/g)]
        .map((x) => [x[1], x[2].trim()]);
      const cles = paires.map(([k]) => k.toLowerCase());
      if (CANON[helper].every((alts) => alts.some((x) => cles.includes(x)))) continue;

      // La projection : pour chaque champ du contrat, la clé que ce thème lit.
      const syn = SYN[helper];
      const pris = new Set();
      const proj = [];
      for (const [champ, noms] of Object.entries(syn)) {
        // Les synonymes sont ordonnés du plus explicite au plus ambigu : sur
        // une ligne { name, label }, `label` doit gagner pour le libellé et
        // `name` rester libre pour l'auteur.
        let p = null;
        for (const nom of noms) {
          p = paires.find(([k]) => k.toLowerCase() === nom && !pris.has(k));
          if (p) break;
        }
        if (!p) continue;
        pris.add(p[0]);
        const nombre = /^-?\d+(\.\d+)?$/.test(p[1]);
        if (champ === "value" && nombre) {
          proj.push(`${p[0]}: Number(String(r.value ?? "").replace(/[^\\d.]/g, "")) || 0`);
          const suf = paires.find(([k]) => /^(suffix|unit|unite|symbole)$/i.test(k));
          if (suf && !pris.has(suf[0])) {
            pris.add(suf[0]);
            proj.push(`${suf[0]}: String(r.value ?? "").replace(/[\\d.\\s]/g, "")`);
          }
        } else {
          proj.push(`${p[0]}: r.${champ}`);
        }
      }
      if (proj.length < 2) continue;

      const remp = `resolveList${generique}(${reel}?.map((r: any) => ({ ${proj.join(", ")} })), ${demoExpr}`;
      src = src.slice(0, m.index) + remp + src.slice(a.fin);
      faits++;
      touches.add(id);
      notes.push(`${id}  ${helper} → ${proj.map((p) => p.split(":")[0]).join(", ")}`);
      fait = true;
      break;
    }
    if (!fait) break;
  }

  if (!dry) fs.writeFileSync(file, src);
}

for (const n of notes.slice(0, 40)) console.log(n);
console.log(`\n${dry ? "[à blanc] " : ""}${faits} appel(s) projeté(s) sur ${touches.size} thème(s)`);
