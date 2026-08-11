// Le client remplit ses emplacements photo : combien s'affichent vraiment ?
//
//   node scripts/qa-photos-client.mjs --tranche 0 4
//
// La priorité n'est pas la suggestion de photos, c'est que celles du CLIENT
// s'affichent. Le formulaire demande autant de photos que le thème en déclare
// (`photoSlotsFor`) — de une à huit. On les remplit toutes, avec des images
// distinctes, et l'on compte combien de photos distinctes la page porte.
//
// Trois défauts possibles, et ils n'ont pas la même gravité :
//   — aucune photo du client : il a téléversé pour rien ;
//   — moins de photos que d'emplacements demandés : on lui en a réclamé qu'on
//     n'utilise pas ;
//   — une photo du modèle encore visible alors que tous les emplacements sont
//     remplis : la démonstration survit à la donnée du client.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

/*
  Une photo n'est pas perdue parce que la page d'accueil ne la montre pas :
  sur impact-13, les photos 4 et 5 vivent sur /montres. Mesurer le seul
  accueil comptait 2 pertes sur 5 là où le client voit tout. On parcourt donc
  toutes les pages du thème avant de conclure.
*/
const LEGALES = new Set(["mentions", "mentions-legales", "cgu", "cgv", "confidentialite", "privacy", "legal"]);
function routesDuTheme(id) {
  const base = path.join(process.cwd(), "app/templates", id);
  const out = [""];
  for (const e of fs.readdirSync(base, { withFileTypes: true })) {
    if (!e.isDirectory() || LEGALES.has(e.name) || e.name.startsWith("[")) continue;
    if (fs.existsSync(path.join(base, e.name, "page.tsx"))) out.push(e.name);
  }
  return out;
}

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";

/* Huit photos distinctes et reconnaissables, une par emplacement possible. */
const PHOTOS = [
  "https://images.pexels.com/photos/7937300/pexels-photo-7937300.jpeg?w=1200",
  "https://images.pexels.com/photos/8005397/pexels-photo-8005397.jpeg?w=1200",
  "https://images.pexels.com/photos/6474471/pexels-photo-6474471.jpeg?w=1200",
  "https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?w=1200",
  "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?w=1200",
  "https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg?w=1200",
  "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=1200",
  "https://images.pexels.com/photos/1449791/pexels-photo-1449791.jpeg?w=1200",
];
const IDENTIFIANTS = PHOTOS.map((u) => u.match(/photos\/(\d+)\//)[1]);

/* Combien d'emplacements chaque thème déclare — la même table que le wizard. */
const slots = {};
{
  const src = fs.readFileSync(path.join(process.cwd(), "lib/templates/photoSlots.ts"), "utf8");
  for (const m of src.matchAll(/"(impact-[\w-]+)":\s*\{\s*n:\s*(\d+),\s*total:\s*(\d+)/g)) {
    /*
      `n` est ce que le formulaire DEMANDE au client ; `total` est ce que le
      thème utilise en tout, et le formulaire le lui dit franchement (« les X
      dernières garderont celles du modèle »). Comparer à `total` reprocherait
      au produit une promesse qu'il ne fait pas.
    */
    slots[m[1]] = Number(m[2]);
  }
}

const tous = fs.readdirSync(path.join(process.cwd(), "app/templates"))
  .filter((d) => d.startsWith("impact-")).sort();
const args = process.argv.slice(2);
let ids = args.filter((a) => a.startsWith("impact-"));
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (!ids.length) ids = tous;
// Un thème sans emplacement ne demande rien au client : rien à vérifier ici.
ids = ids.filter((id) => (slots[id] ?? 0) > 0);

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

for (const id of ids) {
  const demandes = Math.min(slots[id], PHOTOS.length);
  let fiche = { id, demandes };
  try {
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData: {
        businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
        tagline: "Votre plombier de confiance à Annecy", template: id,
        photoUrls: PHOTOS.slice(0, demandes),
      } }),
    });
    const { sessionId } = await r.json();
    if (!sessionId) throw new Error("session non créée (limiteur de débit ?)");

    const vues = new Set();
    for (const route of routesDuTheme(id)) {
      const p = await ctx.newPage();
      try {
        await p.goto(`${BASE}/templates/${id}${route ? "/" + route : ""}?session=${sessionId}`,
          { waitUntil: "domcontentloaded", timeout: 45000 });
        await p.waitForTimeout(2600);
        await p.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 220));
          }
        });
        /*
          Le cumul dans le temps reste nécessaire sur l'accueil, où vivent les
          diaporamas ; ailleurs deux relevés suffisent.
        */
        const tours = route ? 2 : 8;
        for (let k = 0; k < tours; k++) {
          const src = await p.evaluate(() => {
            const out = [];
            for (const e of document.querySelectorAll("img")) {
              const s = e.currentSrc || e.src;
              if (s) out.push(s);
            }
            for (const e of document.querySelectorAll("*")) {
              const m = getComputedStyle(e).backgroundImage?.match(/url\(["']?(.*?)["']?\)/);
              if (m && !m[1].startsWith("data:")) out.push(m[1]);
            }
            return out;
          });
          for (const u of src) {
            const dec = decodeURIComponent(u);
            for (let i = 0; i < demandes; i++) if (dec.includes(`photos/${IDENTIFIANTS[i]}/`)) vues.add(i);
          }
          if (vues.size >= demandes) break;
          await p.waitForTimeout(900);
        }
      } catch { /* une route qui échoue ne prouve rien : les autres comptent */ }
      await p.close();
      if (vues.size >= demandes) break;
    }
    fiche = { id, demandes, affichees: vues.size };
  } catch (e) {
    fiche = { id, demandes, erreur: String(e.message).slice(0, 60) };
  }
  fiches.push(fiche);
  if (fiche.erreur) console.log(`${id.padEnd(12)} ERREUR ${fiche.erreur}`);
  else if (fiche.affichees === 0) console.log(`${id.padEnd(12)} ${demandes} photos demandées, AUCUNE affichée`);
  else if (fiche.affichees < demandes) console.log(`${id.padEnd(12)} ${demandes} demandées, ${fiche.affichees} affichées`);
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ok = fiches.filter((f) => !f.erreur);
console.log(`\n${fiches.length} thèmes qui demandent des photos`
  + ` · ${ok.filter((f) => f.affichees === 0).length} n'en affichent aucune`
  + ` · ${ok.filter((f) => f.affichees > 0 && f.affichees < f.demandes).length} en affichent moins que demandé`
  + ` · ${ok.filter((f) => f.affichees >= f.demandes).length} affichent tout`);
