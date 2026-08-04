// Fait porter aux grilles d'horaires celles du client.
//
//   node scripts/wire-hours.mjs [--dry]
//
// Cinquante-trois thèmes affichent une semaine d'ouverture écrite en dur —
// « Lun : fermé, Mar–Ven 19h30–23h ». Le wizard recueille pourtant les horaires
// jour par jour depuis l'étape service, et aucun thème ne les lisait : un salon
// ouvert sept jours sur sept héritait des horaires d'un restaurant.
//
// La grille garde sa forme : un libellé de jour, une plage en une seule chaîne.
// C'est ainsi que les thèmes l'écrivent tous, et c'est ce que le contrat rend.

import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(process.cwd(), "app/templates");
const dry = process.argv.includes("--dry");

const JOUR = ["day", "jour", "j", "label", "nom"];
const PLAGE = ["hours", "horaire", "horaires", "time", "heures", "h", "value", "open"];

function ferme(s, i, o, c) {
  let n = 0;
  for (let x = i; x < s.length; x++) {
    if (s[x] === o) n++;
    else if (s[x] === c) { n--; if (n === 0) return x; }
  }
  return -1;
}

let faits = 0;
const touches = [];
const restants = [];

for (const id of fs.readdirSync(ROOT).filter((d) => d.startsWith("impact-"))) {
  const dossier = path.join(ROOT, id);
  if (!fs.statSync(dossier).isDirectory()) continue;
  const fichiers = [path.join(dossier, "page.tsx"), path.join(dossier, "layout.tsx")];
  for (const sous of fs.readdirSync(dossier)) {
    const f = path.join(dossier, sous, "page.tsx");
    if (fs.existsSync(f)) fichiers.push(f);
  }

  for (const file of fichiers) {
    if (!fs.existsSync(file)) continue;
    let src = fs.readFileSync(file, "utf8");
    if (src.includes("/* HORAIRES */")) continue;

    const arg = /let sessionData: any = null;/.test(src)
      ? "sessionData"
      : /__layoutSession/.test(src)
        ? "__layoutSession"
        : /let fd: any = null;|\bconst fd\b/.test(src)
          ? "{ formData: fd, businessProfile: bp }"
          : null;
    if (!arg) continue;

    const tabou = [...src.matchAll(/resolveList(?:<[^>]*>)?\(/g)]
      .map((m) => [m.index, ferme(src, m.index + m[0].length - 1, "(", ")")]);
    const dedans = (i) => tabou.some(([a, b]) => a <= i && i <= b);

    let cible = null;
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
      const kJ = JOUR.find((k) => bas.includes(k));
      const kH = PLAGE.find((k) => bas.includes(k));
      if (!kJ || !kH || kJ === kH) continue;
      // La liste doit bien parler de jours de la semaine.
      const corps = src.slice(j, fin + 1);
      if (!/\b(Lun|Mar|Mer|Jeu|Ven|Sam|Dim|Mon|Tue|Wed|Thu|Fri|Sat|Sun|lundi|Lundi|Monday)\b/.test(corps)) continue;
      if (/^\s*\.map\(\s*\(?[^)]{0,80}\)?\s*=>\s*[\s\S]{0,600}?use[A-Z]/.test(src.slice(fin + 1, fin + 700))) continue;
      cible = {
        j, fin,
        kJ: cles.find((k) => k.toLowerCase() === kJ),
        kH: cles.find((k) => k.toLowerCase() === kH),
      };
      break;
    }
    if (!cible) { restants.push(`${id} (aucune grille d'horaires)`); continue; }

    const corps = src.slice(cible.j, cible.fin + 1);
    const remp =
      `/* HORAIRES */ resolveList(clientHours(${arg})?.map((h: any) => ` +
      `({ ${cible.kJ}: h.day, ${cible.kH}: h.hours })), ${corps})`;
    src = src.slice(0, cible.j) + remp + src.slice(cible.fin + 1);

    if (!src.includes("templates/resolveList")) {
      const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = d ? d.index + d[0].length : 0;
      src = src.slice(0, at) + 'import { resolveList } from "@/lib/templates/resolveList";\n' + src.slice(at);
    }
    if (/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.test(src)) {
      src = src.replace(/import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/, (m, g) => {
        const noms = new Set(g.split("\n").map((x) => x.trim().replace(/,$/, "")).filter(Boolean));
        noms.add("clientHours");
        return "import {\n" + [...noms].sort().map((n) => `  ${n},\n`).join("") + '} from "@/lib/templates/clientContent";';
      });
    } else {
      const d = /(^|\n)\s*("use client"|'use client')\s*;?[^\n]*\n/.exec(src);
      const at = d ? d.index + d[0].length : 0;
      src = src.slice(0, at) + 'import { clientHours } from "@/lib/templates/clientContent";\n' + src.slice(at);
    }

    if (!dry) fs.writeFileSync(file, src);
    faits++;
    touches.push(`${file.replace(`${ROOT}/`, "")} (${cible.kJ}/${cible.kH})`);
  }
}

console.log(`${dry ? "[à blanc] " : ""}${faits} grille(s) d'horaires câblée(s)`);
console.log(touches.slice(0, 15).join("  ·  "));
