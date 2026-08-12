// Quels emplacements photo manquent, et où sont-ils lus ?
//
//   node scripts/_diag-photos-manquantes.mjs impact-01 impact-08 …
//
// La campagne dit « 6 affichées sur 8 » ; elle ne dit pas lesquelles. Sans ce
// détail on corrige à l'aveugle. On relève donc les emplacements visibles sur
// toutes les pages du thème, puis on va chercher dans le code où les manquants
// sont lus — c'est là que se trouve la cause.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";
import { globSync } from "glob";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const IDS = ["7937300", "8005397", "6474471", "1216589", "3184465", "2422588", "1181671", "1449791"];
const URLS = IDS.map((i) => `https://images.pexels.com/photos/${i}/pexels-photo-${i}.jpeg?w=1200`);

const slots = {};
{
  const src = fs.readFileSync(path.join(process.cwd(), "lib/templates/photoSlots.ts"), "utf8");
  for (const m of src.matchAll(/"(impact-[\w-]+)":\s*\{\s*n:\s*(\d+)/g)) slots[m[1]] = Number(m[2]);
}

const LEGALES = new Set(["mentions", "mentions-legales", "cgu", "cgv", "confidentialite", "privacy", "legal"]);
const routes = (id) => {
  const base = path.join(process.cwd(), "app/templates", id);
  const out = [""];
  for (const e of fs.readdirSync(base, { withFileTypes: true })) {
    if (!e.isDirectory() || LEGALES.has(e.name) || e.name.startsWith("[")) continue;
    if (fs.existsSync(path.join(base, e.name, "page.tsx"))) out.push(e.name);
  }
  return out;
};

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });

for (const id of process.argv.slice(2)) {
  const demandes = Math.min(slots[id] ?? 1, URLS.length);
  const r = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: {
      businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
      tagline: "x", template: id, photoUrls: URLS.slice(0, demandes),
    } }),
  });
  const { sessionId } = await r.json();
  const vues = new Set();
  for (const route of routes(id)) {
    if (vues.size >= demandes) break;
    const p = await ctx.newPage();
    try {
      await p.goto(`${BASE}/templates/${id}${route ? "/" + route : ""}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
      await p.waitForTimeout(2600);
      await p.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
          window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 220));
        }
      });
      for (let k = 0; k < 8; k++) {
        const src = await p.evaluate(() => [...document.querySelectorAll("img")].map((e) => e.currentSrc || e.src)
          .concat([...document.querySelectorAll("*")].map((e) => (getComputedStyle(e).backgroundImage || "").match(/url\(["']?(.*?)["']?\)/)?.[1]).filter(Boolean)));
        for (const s of src) IDS.forEach((x, i) => { if (decodeURIComponent(s).includes(`photos/${x}/`)) vues.add(i); });
        if (vues.size >= demandes) break;
        await p.waitForTimeout(800);
      }
    } catch { /* une route qui échoue ne prouve rien */ }
    await p.close();
  }

  const manquants = [...Array(demandes).keys()].filter((i) => !vues.has(i));
  if (!manquants.length) { console.log(`${id} : tout s'affiche (${demandes})`); continue; }

  console.log(`\n${id} : ${vues.size}/${demandes} — manquent les emplacements ${manquants.map((i) => i + 1).join(", ")}`);
  /*
    Où l'emplacement manquant est-il lu ? La réponse dit la cause : lu nulle
    part (le formulaire en demande trop), lu dans une liste jamais rendue, ou
    lu dans une branche que la route n'affiche pas.
  */
  for (const i of manquants) {
    const lieux = [];
    for (const f of globSync(`app/templates/${id}/**/page.tsx`)) {
      const s = fs.readFileSync(f, "utf8");
      const re = new RegExp(`clientPhotos\\([^)]*\\)\\s*\\[\\s*${i}\\s*\\]|photoUrls\\s*\\??\\.?\\[\\s*${i}\\s*\\]|photo\\(\\s*${i}\\s*,`, "g");
      const n = (s.match(re) || []).length;
      if (n) lieux.push(`${f.replace(`app/templates/${id}/`, "").replace("/page.tsx", "") || "accueil"}×${n}`);
    }
    console.log(`   emplacement ${i + 1} : ${lieux.length ? "lu dans " + lieux.join(", ") : "JAMAIS LU — le formulaire en demande trop"}`);
  }
}

await b.close();
