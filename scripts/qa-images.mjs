// Les images des thèmes se chargent-elles, et sont-elles différentes ?
//
//   node scripts/qa-images.mjs --tranche 0 4
//
// Trois questions, séparées parce qu'elles ont trois causes différentes :
//
//   1. combien d'images la page demande-t-elle, et combien échouent ? Une
//      photo cassée sur un site livré se voit immédiatement ;
//   2. les images d'un thème sont-elles distinctes les unes des autres, ou la
//      même répétée ? Une galerie de six vignettes identiques n'est pas une
//      galerie ;
//   3. les photos du client remplacent-elles bien celles du modèle ?
//
// On mesure sans session (l'état du catalogue, ce que voit un visiteur de la
// galerie) puis avec les photos d'un client.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";

/* Des photos reconnaissables entre mille, qui doivent chasser celles du modèle. */
const PHOTOS_CLIENT = [
  "https://images.pexels.com/photos/7937300/pexels-photo-7937300.jpeg?w=1200",
  "https://images.pexels.com/photos/8005397/pexels-photo-8005397.jpeg?w=1200",
  "https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?w=1200",
];

const tous = fs.readdirSync(path.join(process.cwd(), "app/templates"))
  .filter((d) => d.startsWith("impact-")).sort();
const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (!ids.length) ids = tous;

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

for (const id of ids) {
  let fiche = { id };
  try {
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData: {
        businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
        tagline: "Votre plombier de confiance à Annecy", template: id,
        photoUrls: PHOTOS_CLIENT,
      } }),
    });
    const { sessionId } = await r.json();
    if (!sessionId) throw new Error("session non créée (limiteur de débit ?)");

    const p = await ctx.newPage();
    /*
      On note chaque réponse d'image : c'est le seul moyen de distinguer une
      photo absente d'une photo simplement lente. Le DOM, lui, ne dit rien
      d'une image en 404 — l'élément existe, il est juste vide.
    */
    const echecs = [];
    const demandees = new Set();
    p.on("response", (res) => {
      const u = res.url();
      if (!/\.(jpe?g|png|webp|avif|gif|svg)(\?|$)|\/_next\/image/i.test(u)) return;
      demandees.add(u);
      if (res.status() >= 400) echecs.push(`${res.status()} ${u.slice(0, 70)}`);
    });
    p.on("requestfailed", (req) => {
      const u = req.url();
      if (/\.(jpe?g|png|webp|avif|gif)(\?|$)|\/_next\/image/i.test(u)) echecs.push(`échec ${u.slice(0, 70)}`);
    });

    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 45000 });
    await p.waitForTimeout(3200);
    // Les images sous la ligne de flottaison ne se chargent qu'au défilement.
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 260));
      }
    });
    await p.waitForTimeout(2200);

    const releve = await p.evaluate(() => {
      const sources = [];
      for (const e of document.querySelectorAll("img")) {
        const s = e.currentSrc || e.src;
        if (s) sources.push({ s, ok: e.complete && e.naturalWidth > 0, w: e.naturalWidth });
      }
      for (const e of document.querySelectorAll("*")) {
        const bg = getComputedStyle(e).backgroundImage;
        const m = bg && bg.match(/url\(["']?(.*?)["']?\)/);
        if (m && !m[1].startsWith("data:")) sources.push({ s: m[1], ok: true, w: -1 });
      }
      return sources;
    });
    await p.close();

    /*
      Une même photo peut apparaître sous plusieurs tailles : on compare le
      chemin, pas l'URL entière, sinon `?w=800` et `?w=1200` comptent pour deux.
    */
    const cle = (u) => {
      try {
        const d = new URL(u, BASE);
        const interne = d.searchParams.get("url");
        return (interne ? decodeURIComponent(interne) : d.pathname).replace(/\?.*$/, "");
      } catch { return u.replace(/\?.*$/, ""); }
    };
    const distinctes = new Set(releve.map((x) => cle(x.s)));
    const vides = releve.filter((x) => x.w === 0).length;
    const duClient = releve.filter((x) => /7937300|8005397|6474471/.test(x.s)).length;

    fiche = {
      id,
      images: releve.length,
      distinctes: distinctes.size,
      vides,
      echecs: echecs.length,
      duClient,
      exemples: echecs.slice(0, 2),
    };
  } catch (e) {
    fiche = { id, erreur: String(e.message).slice(0, 60) };
  }
  fiches.push(fiche);
  const souci = fiche.erreur || fiche.vides > 0 || fiche.echecs > 0 || (fiche.images > 3 && fiche.distinctes <= 2) || fiche.duClient === 0;
  if (souci) {
    console.log(`${fiche.id.padEnd(12)} ${fiche.erreur ?? `${fiche.images} images · ${fiche.distinctes} distinctes · ${fiche.vides} vides · ${fiche.echecs} en échec · ${fiche.duClient} du client`}`);
  }
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ok = fiches.filter((f) => !f.erreur);
console.log(`\n${fiches.length} thèmes · ${ok.filter((f) => f.echecs > 0).length} avec des images en échec`
  + ` · ${ok.filter((f) => f.vides > 0).length} avec des images vides`
  + ` · ${ok.filter((f) => f.duClient === 0).length} n'affichent aucune photo du client`
  + ` · ${ok.filter((f) => f.images > 3 && f.distinctes <= 2).length} répètent la même image`);
