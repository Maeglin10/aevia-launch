// Deux textes se recouvrent-ils ?
//
//   node scripts/qa-chevauchements.mjs --tranche 0 4
//
// Sur impact-236, le titre du hero passait par-dessus le logo et le menu : deux
// textes au même endroit, illisibles tous les deux. La planche contact l'a
// montré ; il fallait un instrument pour le chercher sur les 373.
//
// On ne compare que des éléments qui portent eux-mêmes du texte visible, jamais
// un parent avec son enfant — un titre est toujours « dans » sa section, ce
// n'est pas un défaut. On exige aussi que le recouvrement soit franc : deux
// rectangles qui se frôlent ne gênent personne.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (ids.length === 0) ids = tous;

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 720 } });
const fiches = [];

for (const id of ids) {
  const p = await ctx.newPage();
  let fiche = { id, paires: [] };
  try {
    await p.goto(`${BASE}/templates/${id}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(2200);
    fiche = await p.evaluate((identifiant) => {
      /*
        Le bandeau cookies et l'en-tête sont posés SUR la page : ils recouvrent
        du contenu par construction, ce n'est pas un défaut de composition. Le
        titre passant sous l'en-tête est mesuré ailleurs, par son propre
        instrument.
      */
      const flottants = [...document.querySelectorAll("*")].filter((e) => {
        const s = getComputedStyle(e);
        return s.position === "fixed" || s.position === "sticky";
      });
      const flotte = (n) => flottants.some((e) => e.contains(n));

      const utiles = [];
      for (const e of document.querySelectorAll("*")) {
        if (flotte(e)) continue;
        if (e.children.length > 0) continue;
        const t = (e.innerText ?? "").trim();
        if (t.length < 2 || t.length > 90) continue;
        const s = getComputedStyle(e);
        if (s.visibility === "hidden" || s.display === "none") continue;
        if (Number(s.opacity) < 0.25) continue;
        /*
          Le rectangle d'un élément n'est pas son encre : sur impact-173, le
          titre occupe toute la largeur de la page alors que « SOLIDE. » s'arrête
          au tiers. Comparer les boîtes faisait voir un chevauchement là où deux
          textes ne se touchent pas. On mesure donc les lignes de texte
          elles-mêmes.
        */
        const plage = document.createRange();
        plage.selectNodeContents(e);
        for (const r of plage.getClientRects()) {
          // Seul le premier écran compte : c'est celui qu'on voit avant de défiler.
          if (r.width < 12 || r.height < 8 || r.top > 700 || r.bottom < 0) continue;
          utiles.push({ t, r: { x: r.left, y: r.top, w: r.width, h: r.height } });
        }
      }

      const paires = [];
      for (let i = 0; i < utiles.length; i++) {
        for (let j = i + 1; j < utiles.length; j++) {
          const a = utiles[i].r, c = utiles[j].r;
          const dx = Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x);
          const dy = Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y);
          if (dx <= 2 || dy <= 2) continue;
          const inter = dx * dy;
          const petit = Math.min(a.w * a.h, c.w * c.h);
          if (inter / petit < 0.45) continue;
          paires.push({
            a: utiles[i].t.slice(0, 24),
            b: utiles[j].t.slice(0, 24),
            part: Math.round((inter / petit) * 100),
          });
        }
      }
      return { id: identifiant, paires: paires.slice(0, 4) };
    }, id);
  } catch (e) {
    fiche = { id, paires: [], erreur: String(e.message).slice(0, 44) };
  }
  await p.close();
  fiches.push(fiche);
  if (fiche.paires.length) {
    console.log(`${id.padEnd(12)} ${fiche.paires.map((x) => `«${x.a}» × «${x.b}» (${x.part}%)`).join(" · ")}`);
  }
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ko = fiches.filter((f) => f.paires.length);
console.log(`\n${fiches.length} thèmes · ${ko.length} où deux textes se recouvrent`);
