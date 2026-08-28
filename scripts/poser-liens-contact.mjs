/* Le lien qui trahit l'étiquette.

   Ces thèmes câblent bien l'étiquette — le visiteur lit le numéro de SON
   prestataire — mais figent le lien : href: 'tel:+33145000000'. On touche
   le bon numéro et on appelle un inconnu. Même chose pour les adresses :
   dix mailto: en dur, dont la boîte personnelle d'une vraie personne.

   Le repli reste le littéral d'origine : sans client, rien ne change. */
import fs from "node:fs";

const rapport = [];
const fichiers = new Set();

for (const f of fs.readdirSync("app/templates").filter((d) => /^impact-\d+$/.test(d)).flatMap((d) =>
  ["page.tsx", "layout.tsx", "shared.tsx"].map((n) => `app/templates/${d}/${n}`).filter((p) => fs.existsSync(p)))) {
  let src = fs.readFileSync(f, "utf8");
  const avant = src;
  const s = /\b__layoutSession\b/.test(src) ? "__layoutSession" : "sessionData";

  /* Les numéros d'urgence à trois chiffres (15, 112, 18) ne sont pas ceux
     d'un prestataire : on n'y touche pas. */
  src = src.replace(/href: (['"])tel:([+0-9][^'"]*)\1/g, (tout, q, num) =>
    num.replace(/\D/g, "").length <= 4
      ? tout
      : `href: \`tel:\${(clientPhone(${s}) ?? ${q}${num}${q}).replace(/[^+0-9]/g, "")}\``);

  src = src.replace(/(['"])mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+)\1/g,
    (tout, q, adr) => `\`mailto:\${clientEmail(${s}) ?? ${q}${adr}${q}}\``);

  if (src === avant) continue;
  if (!new RegExp(`\\b${s}\\b`).test(src)) { rapport.push([f, `PAS DE ${s}`]); continue; }

  for (const besoin of ["clientPhone", "clientEmail"]) {
    if (!src.includes(besoin)) continue;
    const tete = src.split("} from \"@/lib/templates/clientContent\";")[0] ?? "";
    if (new RegExp(`\\b${besoin}\\b`).test(tete)) continue;
    const im = /import \{([^}]*)\} from "@\/lib\/templates\/clientContent";/.exec(src);
    if (!im) { rapport.push([f, "PAS D'IMPORT clientContent"]); continue; }
    const noms = [...new Set([...im[1].split(",").map((x) => x.trim()).filter(Boolean), besoin])].sort();
    src = src.replace(im[0], `import {\n  ${noms.join(",\n  ")},\n} from "@/lib/templates/clientContent";`);
  }

  fs.writeFileSync(f, src);
  fichiers.add(f);
  rapport.push([f, "câblé"]);
}
for (const [f, m] of rapport) console.log(`${f} : ${m}`);
console.log(`\n${fichiers.size} fichiers câblés · ${rapport.filter(([, m]) => m !== "câblé").length} en échec`);
