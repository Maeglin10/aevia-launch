/*
  Trier les défauts mesurés : ce qui est un cul-de-sac, et ce qui n'en est pas.

    node scripts/qualifier-defauts.mjs /tmp/cat3-artisan/resultat.json …

  « prestation absente » n'est un défaut que si le thème DÉCLARE le bloc que le
  client a rempli. Un thème de restaurant qui n'affiche pas les prestations d'un
  couvreur est cohérent : le wizard ne les lui demande pas. Sans ce tri, on
  compte trente défauts là où il y en a un.
*/
import fs from "node:fs";

const cap = fs.readFileSync("lib/templates/capabilities.ts", "utf8");
const DECLARE = Object.fromEntries(
  [...cap.matchAll(/"(impact-\d+)":\s*\[([^\]]*)\]/g)].map((m) => [m[1], new Set([...m[2].matchAll(/"([a-z]+)"/g)].map((x) => x[1]))]),
);

/* Le bloc que chaque profil remplit, et qu'il est donc en droit de voir. */
const BLOC_DU_PROFIL = { artisan: "prestations", restaurant: "menu", commerce: "produits", minimal: null };

for (const fichier of process.argv.slice(2)) {
  const d = JSON.parse(fs.readFileSync(fichier, "utf8"));
  const profil = d.profil;
  const attendu = BLOC_DU_PROFIL[profil];

  const graves = [];
  const culsDeSac = [];
  const coherents = [];

  for (const f of d.casses) {
    const dur = f.defauts.filter((x) => /erreur JS|page vide|défile de côté|aucun titre|nom absent|ville absent/.test(x));
    if (dur.length) { graves.push(`${f.theme} — ${dur.join(" · ")}`); continue; }
    const donnee = f.defauts.filter((x) => x.endsWith(" absent"));
    const surPrestation = donnee.some((x) => x.startsWith("prestation"));
    if (surPrestation && attendu && DECLARE[f.theme]?.has(attendu)) culsDeSac.push(`${f.theme} — ${donnee.join(" · ")}`);
    else if (donnee.some((x) => /téléphone|courriel/.test(x))) culsDeSac.push(`${f.theme} — ${donnee.join(" · ")}`);
    else coherents.push(f.theme);
  }

  console.log(`\n═══ ${profil} · ${d.total} thèmes mesurés`);
  console.log(`  graves (page cassée, illisible, sans titre) : ${graves.length}`);
  graves.forEach((x) => console.log(`      ${x}`));
  console.log(`  culs-de-sac (le wizard demande, le thème n'affiche pas) : ${culsDeSac.length}`);
  culsDeSac.forEach((x) => console.log(`      ${x}`));
  console.log(`  cohérents (non demandé, donc non affiché) : ${coherents.length}`);
}
