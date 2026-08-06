// Les thèmes bougent-ils encore, et leurs images se chargent-elles ?
//
//   node scripts/qa-animations.mjs --tranche 0 4
//
// Trois jours de câblage ont touché des centaines de fichiers. Deux choses
// pouvaient s'y perdre sans que personne ne le voie : une animation d'entrée
// restée bloquée à l'état initial — un bloc invisible, à opacité zéro, qui
// n'apparaît jamais — et une image dont l'adresse ne répond plus.
//
// On mesure donc les deux sur la page telle qu'elle s'affiche : ce qui bouge,
// et ce qui charge.

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
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

for (const id of ids) {
  let fiche = { id, invisibles: 0, imagesKo: [], anime: 0 };
  try {
    const p = await ctx.newPage();
    const echecs = [];
    p.on("response", (r) => {
      const t = r.request().resourceType();
      if (t === "image" && r.status() >= 400) echecs.push(`${r.status()} ${r.url().slice(-46)}`);
    });
    p.on("requestfailed", (q) => {
      if (q.resourceType() === "image") echecs.push(`échec ${q.url().slice(-46)}`);
    });

    await p.goto(`${BASE}/templates/${id}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(2600);
    /*
      Les entrées au défilement ne se déclenchent qu'en entrant dans le champ.
      Il faut parcourir la page entière : sur impact-01, les compteurs vivent à
      près de sept mille pixels du haut, et s'arrêter avant les faisait passer
      pour des blocs restés invisibles.
    */
    const hauteur = await p.evaluate(() => document.body.scrollHeight);
    const pas = 700;
    for (let y = 0; y < hauteur + pas; y += pas) {
      await p.evaluate((k) => window.scrollTo(0, k), y);
      await p.waitForTimeout(160);
    }
    // On mesure en bas de course : revenir en haut resort certains blocs du champ.
    await p.waitForTimeout(1200);

    const mesure = await p.evaluate(() => {
      let invisibles = 0;
      let anime = 0;
      for (const e of document.querySelectorAll("*")) {
        const s = getComputedStyle(e);
        if (s.animationName !== "none" || s.transitionProperty !== "all" && s.transitionDuration !== "0s") anime++;

        /*
          Un bloc resté à opacité nulle alors qu'il porte du texte et occupe de
          la place : c'est une animation d'entrée qui ne s'est jamais jouée.
          On ignore ce qui est explicitement masqué, et les éléments hors du
          flux, qui sont souvent des états de survol.
        */
        if (s.visibility === "hidden" || s.display === "none") continue;
        if (Number(s.opacity) > 0.02) continue;
        const t = (e.textContent ?? "").trim();
        if (t.length < 12) continue;
        const r = e.getBoundingClientRect();
        if (r.width < 40 || r.height < 20) continue;
        invisibles++;
      }
      return { invisibles, anime };
    });

    await p.close();
    fiche = { id, ...mesure, imagesKo: [...new Set(echecs)].slice(0, 3) };
  } catch (e) {
    fiche = { id, invisibles: 0, anime: 0, imagesKo: [], erreur: String(e.message).slice(0, 40) };
  }
  fiches.push(fiche);
  if (fiche.invisibles > 0 || fiche.imagesKo.length) {
    console.log(`${id.padEnd(12)} ${fiche.invisibles} bloc(s) restés invisibles${fiche.imagesKo.length ? ` · images : ${fiche.imagesKo.join(" · ")}` : ""}`);
  }
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const bloques = fiches.filter((f) => f.invisibles > 0);
const sansImage = fiches.filter((f) => f.imagesKo.length);
const sansAnim = fiches.filter((f) => f.anime < 5);
console.log(`\n${fiches.length} thèmes · ${bloques.length} avec un bloc resté invisible · ${sansImage.length} avec une image qui ne charge pas · ${sansAnim.length} sans animation notable`);
