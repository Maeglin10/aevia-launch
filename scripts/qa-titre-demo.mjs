// Le titre du hero porte-t-il quelque chose du client ?
//
//   node scripts/qa-titre-demo.mjs --tranche 0 4
//
// Un thème peut n'avoir aucun collage et rester entièrement en démonstration :
// son titre ne mêle rien parce qu'il n'a rien reçu. Un plombier annécien lit
// alors « Neon Genesis » ou « La comptabilité, un outil de croissance ».
//
// On charge donc chaque thème avec un client dont le nom, le métier et la ville
// n'ont rien de commun avec la démonstration, et l'on regarde le premier titre
// du premier écran : s'il n'en porte aucune trace, la phrase du client ne se lit
// nulle part en haut de sa page.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const args = process.argv.slice(2);
const tous = fs.readdirSync(path.join(process.cwd(), "app/templates")).filter((d) => d.startsWith("impact-")).sort();
let ids = args.filter((a) => a.startsWith("impact-"));
if (args[0] === "--tranche") {
  const [k, n] = [Number(args[1]), Number(args[2])];
  ids = tous.filter((_, i) => i % n === k);
} else if (ids.length === 0) ids = tous;

/** Le premier titre du premier écran, hors bandeau fixe. */
const titreDuHero = () => {
  const flottants = [...document.querySelectorAll("*")]
    .filter((e) => ["fixed", "sticky"].includes(getComputedStyle(e).position));
  for (const h of document.querySelectorAll("h1, h2")) {
    if (flottants.some((f) => f.contains(h))) continue;
    const r = h.getBoundingClientRect();
    /*
      Le premier titre de la page, où qu'il soit. Le limiter au premier écran
      écartait dix-sept thèmes dont le hero s'ouvre sur une image pleine hauteur :
      leur titre, personnalisé, commence à onze cents pixels.
    */
    if (r.top > 2600 || r.height < 24 || r.width < 80) continue;
    const t = (h.textContent ?? "").replace(/\s+/g, " ").trim();
    if (t.length >= 3) return t;
  }
  return "";
};

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const fiches = [];

for (const id of ids) {
  let fiche = { id, porte: false, titre: "" };
  try {
    const formData = {
      businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
      tagline: "Votre plombier de confiance à Annecy depuis 1998",
      email: "contact@ateliers-vidal.fr", phone: "04 50 11 22 33", template: id,
    };
    const r = await fetch(`${BASE}/api/sessions`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ formData }),
    });
    const { sessionId } = await r.json();
    if (!sessionId) throw new Error("session non créée (limiteur de débit ? lancer next start avec SESSIONS_RATE_LIMIT=100000)");

    /*
      Deux lectures espacées : chaque thème va chercher la session de son côté,
      et la première mesure attrapait parfois la page avant son hydratation —
      un thème sain était alors compté en défaut.
    */
    const p = await ctx.newPage();
    await p.goto(`${BASE}/templates/${id}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
    await p.waitForTimeout(2600);
    /*
      Trois lectures, de plus en plus tard. Six navigateurs mesurent en même
      temps : sous cette charge, la page rend parfois son titre de démonstration
      avant que la session ne soit revenue, et un thème sain est compté en
      défaut. Une seule relecture ne suffisait pas.
    */
    let titre = await p.evaluate(titreDuHero);
    for (const attente of [2400, 3200]) {
      if (/plombier|annecy|vidal/i.test(titre)) break;
      await p.waitForTimeout(attente);
      titre = await p.evaluate(titreDuHero);
    }
    await p.close();

    fiche = { id, porte: /plombier|annecy|vidal/i.test(titre), titre: titre.slice(0, 70) };
  } catch (e) {
    fiche = { id, porte: true, titre: "", erreur: String(e.message).slice(0, 40) };
  }
  fiches.push(fiche);
  if (!fiche.porte) console.log(`${id.padEnd(12)} titre resté en démonstration : « ${fiche.titre} »`);
}

await b.close();
if (process.env.FICHES) fs.writeFileSync(process.env.FICHES, JSON.stringify(fiches, null, 1));
const ko = fiches.filter((f) => !f.porte);
console.log(`\n${fiches.length} thèmes · ${ko.length} dont le titre ne porte rien du client`);
