/* Les emplacements photo à repli vide.

   Toute la série 328-383 câble des emplacements sur les photos du client —
   « photo(1, "") », « clientPhotos(s)[0] || "" ». Sans client, le repli est
   la chaîne vide : l'emplacement reste muet et le thème se montre sans
   aucune image. C'est un défaut que j'ai introduit en construisant ces
   thèmes, et qui ne se voit qu'au rendu.

   Le geste est minuscule et sans risque de mise en page : on donne au repli
   une photo de démonstration, du métier du thème. Celle du client passe
   toujours avant — elle est en tête de la chaîne. */
import fs from "node:fs";

const photos = JSON.parse(fs.readFileSync(process.argv[2], "utf8"));
const vide = /(photo\(\s*(\d+)\s*,\s*""\s*\)|\[\s*\d+\s*\]\s*\|\|\s*"")/g;
let poses = 0; const rapport = [];

for (const [theme, lot] of Object.entries(photos)) {
  const f = `app/templates/${theme}/page.tsx`;
  if (!fs.existsSync(f) || !lot.length) continue;
  let src = fs.readFileSync(f, "utf8");
  const L = src.split("\n");
  let n = 0;

  for (let i = 0; i < L.length && n < lot.length; i++) {
    if (!vide.test(L[i])) { vide.lastIndex = 0; continue; }
    vide.lastIndex = 0;
    /* On complète la CHAÎNE, on ne remplace rien : « … || "" » devient
       « … || "" || "<photo>" ». La photo du client reste prioritaire. */
    const avant = L[i];
    L[i] = L[i].replace(/;\s*$/, ` || "${lot[n].url}";`);
    if (L[i] === avant) continue;
    n++;
  }
  if (!n) { rapport.push([theme, "aucun emplacement complété"]); continue; }
  fs.writeFileSync(f, L.join("\n"));
  poses += n;
  rapport.push([theme, `${n} emplacement(s) pourvu(s)`]);
}
rapport.forEach(([t, m]) => console.log(`${t} : ${m}`));
console.log(`\n${poses} emplacements pourvus`);
