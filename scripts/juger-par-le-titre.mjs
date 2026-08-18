/*
  Le métier que le thème déclare dans son titre, contre celui auquel on le propose.

    node scripts/juger-par-le-titre.mjs

  Compter les mots de métier dans toute la page est un instrument mou : il a
  blanchi impact-180, un site de chauffagiste — « Thermotek Chauffage —
  Chauffagiste professionnel (Bordeaux) » — proposé aux coiffeurs.

  Or presque tous les thèmes portent, en tête de fichier, une ligne de titre qui
  nomme le métier en toutes lettres. On lit cette ligne, on y cherche le libellé
  du secteur auquel le thème est proposé, et l'on signale quand aucun ne s'y
  trouve. Le doute profite au thème : un titre muet ne prouve rien.
*/
import fs from "node:fs";
import path from "node:path";

const src = fs.readFileSync("lib/templates/sectors.ts", "utf8");

/* secteur → libellé, et secteur → thèmes proposés. */
const LIBELLE = {};
for (const m of src.matchAll(/id:\s*'([a-z_0-9]+)',\s*label:\s*'([^']+)'/g)) LIBELLE[m[1]] = m[2];
const PROPOSES = {};
const bloc = src.slice(src.indexOf("SECTOR_TEMPLATES"), src.indexOf("TEMPLATE_CITY_LABELS"));
for (const m of bloc.matchAll(/^\s*'?([a-z_0-9]+)'?:\s*\[([^\]]*)\]/gm)) {
  PROPOSES[m[1]] = [...m[2].matchAll(/'(impact-[\w-]+)'/g)].map((x) => x[1]);
}

/* Les mots du libellé qui portent le sens : « Coiffeur / Barbier » → coiffeur, barbier. */
const nu = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
const racines = (libelle) =>
  nu(libelle).split(/[^a-z0-9]+/).filter((w) => w.length >= 4).map((w) => w.replace(/(iste|eur|ien|erie|age|ier|es|s)$/, ""));

function titreDu(theme) {
  const p = path.join("app/templates", theme, "page.tsx");
  if (!fs.existsSync(p)) return "";
  /* La ligne de titre est dans les cent premières lignes du fichier. */
  const tete = fs.readFileSync(p, "utf8").split("\n").slice(0, 100).join("\n");
  const m = /clientName\(sessionData\)\s*\?\?\s*"[^"]*"\}([^\n]{10,200})/.exec(tete);
  return m ? nu(m[1]) : "";
}

const cache = {};
const rapport = [];
for (const [secteur, themes] of Object.entries(PROPOSES)) {
  const mots = racines(LIBELLE[secteur] ?? secteur);
  if (!mots.length) continue;
  for (const theme of themes) {
    const titre = (cache[theme] ??= titreDu(theme));
    if (titre.length < 15) continue;                      /* titre muet : on ne juge pas */
    if (mots.some((w) => titre.includes(w))) continue;    /* le métier est nommé : bon */
    /* Le titre nomme-t-il un AUTRE métier du catalogue ? Sinon il est neutre. */
    const autre = Object.entries(LIBELLE).find(([id, lib]) =>
      id !== secteur && racines(lib).some((w) => w.length >= 5 && titre.includes(w)));
    if (!autre) continue;
    rapport.push({ secteur, theme, dit: autre[1], titre: titre.slice(0, 70) });
  }
}

console.log(`${rapport.length} rattachements où le titre du thème nomme un autre métier\n`);
for (const r of rapport.slice(0, 30)) {
  console.log(`  ${r.theme.padEnd(12)} proposé à « ${(LIBELLE[r.secteur] ?? r.secteur).padEnd(24)} » mais son titre dit « ${r.dit} »`);
}
fs.writeFileSync("/tmp/catalogue-titres.json", JSON.stringify(rapport, null, 1));
