// Le titre passe-t-il sous l'en-tête ?
//
//   node scripts/qa-titre-sous-entete.mjs --tranche 0 5
//
// Sur impact-01, la première ligne du titre commence à soixante et un pixels du
// haut, l'en-tête en occupe quatre-vingt-treize : trente-deux pixels de lettres
// disparaissent derrière la barre de navigation. C'est la première chose qu'on
// voit d'un site, et elle est amputée.
//
// On mesure ici, pour chaque thème, le recouvrement entre le premier titre et
// l'en-tête — sans session, comme un visiteur qui découvre la démonstration.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
  ids = tous.filter((_, i) => i % n === k);
}
if (ids.length === 0) {
  const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
  ids = tous;
}

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
const fiches = [];

for (const id of ids) {
  const p = await ctx.newPage();
  let fiche = { id, recouvrement: 0 };
  try {
    await p.goto(`${BASE}/templates/${id}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(2200);
    fiche = await p.evaluate((identifiant) => {
      /*
        Le premier titre du document n'est pas toujours celui du hero : sur
        impact-324 et impact-325, c'est le logo, écrit en h1 à l'intérieur de
        l'en-tête. Un logo dans l'en-tête est recouvert par définition — le
        compter, c'était mesurer la barre contre elle-même.
      */
      const barres = [...document.querySelectorAll("header, nav, [class*='fixed'], [class*='sticky']")]
        .filter((e) => ["fixed", "sticky"].includes(getComputedStyle(e).position));
      const dansLaBarre = (n) => barres.some((e) => e.contains(n));
      const titre = [...document.querySelectorAll("h1, h2")].find((h) => {
        if (dansLaBarre(h)) return false;
        const r = h.getBoundingClientRect();
        return r.height >= 20 && r.top < 400;
      });
      if (!titre) return { id: identifiant, recouvrement: 0, sansTitre: true };
      const rt = titre.getBoundingClientRect();
      if (rt.top > 400 || rt.height < 20) return { id: identifiant, recouvrement: 0 };

      /*
        L'en-tête : le bandeau fixe ou collant du haut de page. Un en-tête qui
        défile avec la page ne masque rien — on ne retient que ceux qui restent.
      */
      let bas = 0;
      for (const e of barres) {
        const r = e.getBoundingClientRect();
        if (r.top > 40 || r.height < 24 || r.height > 200) continue;
        bas = Math.max(bas, r.bottom);
      }
      const recouvrement = Math.max(0, Math.round(bas - rt.top));
      return {
        id: identifiant,
        recouvrement,
        titre: (titre.innerText ?? "").replace(/\s+/g, " ").trim().slice(0, 32),
        hautTitre: Math.round(rt.top),
        basEntete: Math.round(bas),
      };
    }, id);
  } catch (e) {
    fiche = { id, recouvrement: 0, erreur: String(e.message).slice(0, 50) };
  }
  await p.close();
  fiches.push(fiche);
  if (fiche.recouvrement > 8) {
    console.log(`${id.padEnd(12)} ${fiche.recouvrement} px sous l'en-tête — «${fiche.titre}»`);
  }
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ko = fiches.filter((f) => f.recouvrement > 8);
console.log(`\n${fiches.length} thèmes · ${ko.length} dont le titre passe sous l'en-tête`);
