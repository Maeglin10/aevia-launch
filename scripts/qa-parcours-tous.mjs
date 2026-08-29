/*
  Le parcours client, pour les soixante-huit métiers du catalogue.

    node scripts/qa-parcours-tous.mjs [--depuis 0] [--jusqua 68]

  On ne vérifie plus des sessions fabriquées à la main : on suit /configure du
  premier écran jusqu'à l'aperçu, métier par métier, en remplissant comme un
  client. Puis on regarde ce qui s'affiche — le thème retenu, le nom du client,
  le nombre de sections, ce qui manque encore.
*/
import fs from "node:fs";
import { chromium } from "playwright";
import { parcours } from "./qa-parcours.mjs";

const arg = (n, d) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? Number(process.argv[i + 1]) : d; };
const metiers = fs.readFileSync("/tmp/metiers.txt", "utf8").trim().split("\n").map((l) => l.split("|"));
const debut = arg("depuis", 0), fin = arg("jusqua", metiers.length);

const nav = await chromium.launch();
const ctx = await nav.newContext({ viewport: { width: 1440, height: 950 } });
const fiches = [];
for (let i = debut; i < fin; i++) {
  const [domaine, secteur] = metiers[i];
  const page = await ctx.newPage();
  let f;
  try {
    const r = await parcours(page, { domaine, secteur });
    const ok = r.rendu?.cadre && r.rendu.nomVisible && !r.rendu.erreur;
    f = { metier: `${domaine} / ${secteur}`, theme: r.theme, ok: !!ok, ...r.rendu, journal: r.journal.at(-1) };
  } catch (e) {
    f = { metier: `${domaine} / ${secteur}`, ok: false, erreurJs: String(e).slice(0, 70) };
  }
  fiches.push(f);
  console.log(`${String(i + 1).padStart(2)}/${metiers.length} ${f.ok ? "✓" : "✗"} ${f.metier.padEnd(38)} ${f.theme ?? "—"} · ${f.sections ?? 0} sections · ${f.manques ?? "?"} manque(s)${f.ok ? "" : " · " + (f.journal ?? f.erreurJs ?? "")}`);
  await page.close();
}
await nav.close();
fs.writeFileSync("/tmp/parcours-tous.json", JSON.stringify(fiches, null, 1));
const ko = fiches.filter((f) => !f.ok);
console.log(`\n${fiches.length} métiers · ${ko.length} en défaut`);
