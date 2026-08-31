/* Une même photo dans vingt-et-un thèmes.

   Mesuré au rendu : 186 photos servent dans plus d'un thème, et treize
   d'entre elles dans huit thèmes ou plus. Deux clients voisins peuvent donc
   avoir la même image de fond. On garde chaque photo dans UN thème — le
   premier de sa liste — et on la remplace ailleurs par une photo du métier
   du thème.

   On remplace l'identifiant dans l'URL, en gardant les paramètres du thème
   (largeur, qualité, recadrage) : la mise en page ne bouge pas, seul le
   sujet change. */
import fs from "node:fs";
import path from "node:path";

const plan = JSON.parse(fs.readFileSync("captures/contact/plan-repetition.json", "utf8"));
const trouvees = JSON.parse(fs.readFileSync("captures/contact/photos-repetition.json", "utf8"));

let remplaces = 0, manquants = 0;
const rapport = [];

for (const [theme, ids] of Object.entries(plan.aRemplacer)) {
  const lot = trouvees[theme] ?? [];
  if (!lot.length) { manquants += ids.length; continue; }
  const dossier = `app/templates/${theme}`;
  if (!fs.existsSync(dossier)) continue;

  const fichiers = [];
  (function scan(d) {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) scan(p); else if (e.name.endsWith(".tsx")) fichiers.push(p);
    }
  })(dossier);

  let n = 0;
  ids.forEach((id, k) => {
    const nouvelle = lot[k] ?? lot[lot.length - 1];
    if (!nouvelle) return;
    const ancien = id.replace(/^unsplash:/, "");
    for (const f of fichiers) {
      const src = fs.readFileSync(f, "utf8");
      if (!src.includes(ancien)) continue;
      /* L'URL entière est remplacée : la nouvelle photo vient d'une autre
         banque, ses paramètres ne sont pas ceux d'Unsplash. */
      const sortie = src.replace(
        new RegExp(`https://images\\.unsplash\\.com/photo-${ancien}[^"'\`\\s)]*`, "g"),
        nouvelle.url,
      );
      if (sortie !== src) { fs.writeFileSync(f, sortie); n++; remplaces++; }
    }
  });
  if (n) rapport.push(`${theme} : ${n} photo(s) diversifiée(s)`);
}
rapport.slice(0, 10).forEach((r) => console.log(r));
console.log(`\n${remplaces} photos remplacées · ${manquants} sans remplaçante trouvée`);
