// Le titre du client casse-t-il la mise en page du thème ?
//
//   node scripts/qa-hero.mjs --tranche 0 5
//
// Un gabarit compté en caractères ne prédit pas où un titre casse : à cent
// soixante-seize pixels, huit lettres tiennent sur deux lignes. La seule mesure
// honnête est la comparaison — le même thème, deux fois, avec et sans accroche
// saisie — et l'on ne retient comme régression que ce qui grandit.
//
// Trois relevés sur le titre du hero : sa hauteur, son débordement horizontal,
// et s'il recouvre l'en-tête. Un thème qui débordait déjà avec son propre texte
// n'est pas une régression : c'est son dessin.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3411";
const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  const tous = fs.readdirSync(path.join(process.cwd(), "app/templates"))
    .filter((d) => d.startsWith("impact-"))
    .filter((d) => fs.readFileSync(path.join(process.cwd(), "app/templates", d, "page.tsx"), "utf8").includes("clientHeroLine"))
    .sort();
  ids = tous.filter((_, i) => i % n === k);
}
if (ids.length === 0) {
  console.error("usage: node scripts/qa-hero.mjs impact-01 … | --tranche 0 5");
  process.exit(1);
}

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

async function mesurer(id, avecAccroche) {
  const formData = {
    businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
    template: id, brandColor: "#c2410c",
    ...(avecAccroche ? { tagline: "Votre plombier de confiance à Annecy depuis 1998" } : {}),
  };
  const r = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData }),
  });
  const { sessionId } = await r.json();
  const p = await ctx.newPage();
  try {
    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    await p.waitForTimeout(2400);
    const out = await p.evaluate(() => {
      const h = document.querySelector("h1") ?? document.querySelector("h2");
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return {
        hauteur: Math.round(r.height),
        bas: Math.round(r.bottom),
        deborde: h.scrollWidth > h.clientWidth + 2,
        page: document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
        texte: (h.innerText ?? "").replace(/\s+/g, " ").trim().slice(0, 60),
      };
    });
    await p.close();
    return out;
  } catch {
    await p.close();
    return null;
  }
}

for (const id of ids) {
  const sans = await mesurer(id, false);
  const avec = await mesurer(id, true);
  if (!sans || !avec) { console.log(`${id.padEnd(12)} pas de titre mesurable`); continue; }

  const griefs = [];
  // Un quart de hauteur en plus, c'est une ligne de titre gagnée : la mise en
  // page du thème ne l'avait pas prévue.
  if (avec.hauteur > sans.hauteur * 1.25 && avec.hauteur - sans.hauteur > 40) {
    griefs.push(`titre plus haut (${sans.hauteur} → ${avec.hauteur})`);
  }
  if (avec.deborde && !sans.deborde) griefs.push("le titre déborde de son cadre");
  if (avec.page && !sans.page) griefs.push("la page défile de côté");

  fiches.push({ id, sans, avec, griefs });
  console.log(`${id.padEnd(12)} ${griefs.length ? griefs.join(" | ") : "sans dommage"}  «${avec.texte.slice(0, 34)}»`);
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const casses = fiches.filter((f) => f.griefs.length);
console.log(`\n${fiches.length} titres mesurés, ${casses.length} régressions : ${casses.map((f) => f.id).join(" ") || "aucune"}`);
