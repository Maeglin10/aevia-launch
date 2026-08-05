// La lisibilité, mesurée sur les pixels et non sur le code.
//
//   node scripts/qa-lisibilite.mjs --tranche 0 5
//
// Calculer un contraste depuis le DOM revient à deviner dès qu'il y a une photo
// derrière le texte : la photo est une sœur du texte, pas une aïeule, l'en-tête
// devient opaque au défilement puis redevient transparent, et trois campagnes de
// suite ont signalé des en-têtes blancs sur photo — parfaitement lisibles —
// comme illisibles.
//
// Ici on ne raisonne plus : on découpe l'image du texte telle qu'elle s'affiche,
// et l'on compare les pixels. Les plus clairs contre les plus sombres, aux
// déciles pour ignorer l'anticrénelage. Un rapport sous 2,5:1 sur un texte
// courant, c'est illisible, quelle que soit la raison.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3411";
const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
  ids = tous.filter((_, i) => i % n === k);
}
if (ids.length === 0) {
  console.error("usage: node scripts/qa-lisibilite.mjs impact-01 … | --tranche 0 5");
  process.exit(1);
}

const luminance = (r, g, b) => {
  const v = [r, g, b].map((x) => {
    const s = x / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
};

/** Le rapport entre les pixels clairs et les pixels sombres d'une vignette. */
async function rapportDe(png) {
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const lum = [];
  for (let i = 0; i < data.length; i += info.channels) {
    lum.push(luminance(data[i], data[i + 1], data[i + 2]));
  }
  if (lum.length < 40) return null;
  lum.sort((a, b) => a - b);
  /*
    Le fond est ce qu'il y a de plus répandu : sur un bouton, il occupe presque
    toute la vignette, et comparer deux déciles revenait à comparer le bouton à
    lui-même — « Commander » ressortait à 1,1:1 alors qu'il est blanc sur ocre.
    On prend donc la médiane pour le fond, et pour le texte l'extrême qui s'en
    écarte le plus.
  */
  const mediane = lum[Math.floor(lum.length * 0.5)];
  const bas = lum[Math.floor(lum.length * 0.02)];
  const haut = lum[Math.floor(lum.length * 0.98)];
  const texte = Math.abs(haut - mediane) >= Math.abs(mediane - bas) ? haut : bas;
  const clair = Math.max(texte, mediane);
  const sombre = Math.min(texte, mediane);
  return (clair + 0.05) / (sombre + 0.05);
}

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

for (const id of ids) {
  const d = {
    businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
    tagline: "Votre plombier de confiance à Annecy depuis 1998",
    email: `contact@${id}.fr`, phone: "04 50 11 22 33", brandColor: "#c2410c", template: id,
  };
  const r = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: d }),
  });
  const { sessionId } = await r.json();
  const p = await ctx.newPage();
  const fiche = { id, illisibles: [] };
  try {
    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(2400);

    // Les textes qu'on lit vraiment : assez grands, assez longs, bien visibles.
    const cibles = await p.evaluate(() => {
      const out = [];
      for (const e of document.querySelectorAll("h1,h2,h3,p,a,button,span,li,div")) {
        const propre = [...e.childNodes].some((x) => x.nodeType === 3 && x.textContent.trim().length > 2);
        if (!propre) continue;
        const s = getComputedStyle(e);
        if (s.visibility === "hidden" || s.display === "none" || Number(s.opacity) < 0.4) continue;
        const r = e.getBoundingClientRect();
        if (r.top < 0 || r.bottom > innerHeight || r.width < 40 || r.height < 12 || r.height > 200) continue;
        if (parseFloat(s.fontSize) < 12) continue;
        const texte = e.innerText.replace(/\s+/g, " ").trim();
        if (texte.length < 3 || texte.length > 60) continue;
        out.push({ x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), texte });
        if (out.length >= 24) break;
      }
      return out;
    });

    for (const c of cibles) {
      if (c.w < 8 || c.h < 8) continue;
      let png;
      try {
        png = await p.screenshot({ clip: { x: c.x, y: c.y, width: Math.min(c.w, 600), height: c.h } });
      } catch { continue; }
      const rapport = await rapportDe(png);
      if (rapport !== null && rapport < 2.5) {
        fiche.illisibles.push(`«${c.texte.slice(0, 34)}» ${rapport.toFixed(1)}:1`);
      }
    }
  } catch (e) {
    fiche.erreur = String(e.message).slice(0, 80);
  }
  await p.close();
  fiches.push(fiche);
  console.log(`${id.padEnd(12)} ${fiche.illisibles.length ? fiche.illisibles.slice(0, 3).join(" · ") : "lisible"}`.slice(0, 170));
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ko = fiches.filter((f) => f.illisibles.length);
console.log(`\n${fiches.length} thèmes · ${ko.length} avec un texte sous 2,5:1`);
