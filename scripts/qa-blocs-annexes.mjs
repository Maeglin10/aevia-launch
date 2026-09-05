// Les blocs que seules les pages annexes affichent sont-ils bien rendus ?
//
//   node scripts/qa-blocs-annexes.mjs
//
// `capabilities.ts` a été complétée d'après les pages d'accueil. Or une page
// annexe peut afficher un bloc que l'accueil ignore : la boutique d'impact-08
// montre les produits du client, sa page d'accueil non. Le thème ne déclarait
// donc pas « produits », et le formulaire ne les demandait pas — la section
// existait sans que personne puisse la remplir.
//
// Avant d'ajouter ces blocs à la table, on vérifie qu'ils s'affichent
// vraiment. La table a été resserrée cinq fois pour avoir déclaré sur
// heuristique des sections qui n'existaient pas ; on ne recommence pas.

import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.AUDIT_BASE ?? "http://localhost:3000";
const manque = JSON.parse(fs.readFileSync("/tmp/manque-annexes.json", "utf8"));

const PROFIL = {
  services: [{ name: "Détartrage Vidal", description: "En moins d'une heure.", price: "45 €" }],
  products: [{ name: "Coffret Bellevaux", price: "24 €", description: "Six pièces." }],
  menu: [{ name: "Tarte Marquisats", category: "Desserts", price: "8 €" }],
  team: [{ name: "Éloi Vidal", role: "Maître plombier" }],
  certifications: ["Qualibat Marquisats", "RGE Bellevaux"],
  faq: [{ q: "Intervenez-vous le dimanche ?", a: "Oui, au tarif annoncé d'avance." }],
  keyStats: [{ value: "1 342", label: "Chantiers Vidal" }],
  beforeAfter: [{ caption: "Salle de bain Marquisats" }],
  reputation: { featuredReviews: [{ author: "Perrine Anselme", text: "Intervention nette, chantier laissé propre.", rating: 5 }] },
};

/* Ce qu'on cherche à l'écran pour chaque bloc. */
const PREUVE = {
  prestations: "Détartrage Vidal",
  produits: "Coffret Bellevaux",
  menu: "Tarte Marquisats",
  equipe: "Éloi Vidal",
  engagements: "Qualibat Marquisats",
  faq: "Intervenez-vous le dimanche",
  avis: "chantier laissé propre",
  chiffres: "Chantiers Vidal",
  realisations: "Salle de bain Marquisats",
};

const LEGALES = new Set(["mentions", "mentions-legales", "cgu", "cgv", "confidentialite", "privacy", "legal"]);
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
const prouves = {};
let manquants = 0;

for (const [theme, blocs] of Object.entries(manque)) {
  const routes = fs.readdirSync(path.join("app/templates", theme), { withFileTypes: true })
    .filter((e) => e.isDirectory() && !LEGALES.has(e.name)
      && fs.existsSync(path.join("app/templates", theme, e.name, "page.tsx")))
    .map((e) => e.name);

  const r = await fetch(`${BASE}/api/sessions`, {
    method: "POST", headers: { "content-type": "application/json" },
    body: JSON.stringify({ formData: {
      businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier",
      tagline: "Votre plombier de confiance à Annecy", template: theme,
    } }),
  });
  const { sessionId, editToken } = await r.json();
  if (!sessionId) throw new Error("session non créée (limiteur de débit ?)");
  await fetch(`${BASE}/api/sessions?id=${sessionId}`, {
    method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
    body: JSON.stringify({ businessProfile: PROFIL }),
  });

  const restants = new Set(blocs);
  for (const route of routes) {
    if (!restants.size) break;
    const p = await ctx.newPage();
    try {
      await p.goto(`${BASE}/templates/${theme}/${route}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
      await p.waitForTimeout(3200);
      await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await p.waitForTimeout(1000);
      const texte = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
      for (const bloc of [...restants]) {
        if (texte.includes(PREUVE[bloc])) {
          restants.delete(bloc);
          (prouves[theme] = prouves[theme] ?? []).push(bloc);
          console.log(`${theme}/${route}  ${bloc} : affiché`);
        }
      }
    } catch { /* une route qui échoue ne prouve rien : on continue */ }
    await p.close();
  }
  for (const bloc of restants) {
    manquants++;
    console.log(`${theme}  ${bloc} : JAMAIS AFFICHÉ sur ses ${routes.length} pages annexes`);
  }
}

await b.close();
fs.writeFileSync("/tmp/blocs-prouves.json", JSON.stringify(prouves, null, 1));
const n = Object.values(prouves).reduce((s, a) => s + a.length, 0);
console.log(`\n${n} blocs prouvés à l'écran · ${manquants} jamais affichés (non déclarés)`);
