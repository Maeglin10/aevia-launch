// Le travail est-il réellement en ligne ? On mesure la production, pas le HTML.
import { chromium } from "playwright";
const BASE = process.env.PROD ?? "https://launch.aevia.services";
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "restaurant",
    tagline: "Vérification de mise en ligne", template: "impact-99" } }) });
const { sessionId } = await r.json();
if (!sessionId) throw new Error("la production n'a pas créé de session");
await fetch(`${BASE}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json" },
  body: JSON.stringify({ businessProfile: {
    menu: [{ name: "Féra du Léman", category: "Poissons", price: "26 €", description: "Beurre blanc." }],
    team: [{ name: "Éloi Vidal", role: "Chef" }],
  } }) });
console.log("session créée en production :", sessionId.slice(0, 8), "…");

const p = await ctx.newPage();
await p.goto(`${BASE}/templates/impact-99/carte?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 60000 });
await p.waitForTimeout(5000);
const t1 = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
console.log("carte du client affichée      :", t1.includes("Féra du Léman") ? "OUI" : "non");
console.log("nom du client affiché         :", t1.includes("Ateliers Vidal") ? "OUI" : "non");
console.log("démonstration remplacée       :", t1.includes("Poulpe Braisé") ? "non — elle reste" : "OUI");

/* La correction de navigation : on clique, la session doit tenir. */
await p.evaluate(() => {
  const btn = [...document.querySelectorAll("nav button, header button")].find((b) => (b.textContent ?? "").trim() === "À propos");
  btn?.click();
});
await p.waitForTimeout(3000);
const t2 = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
console.log("après clic, le client tient   :", t2.includes("Ateliers Vidal") ? "OUI" : "non");

/* La zone tactile étendue. */
const tactile = await p.evaluate(() => document.querySelectorAll("[data-cible-agrandie]").length);
console.log("commandes tactiles agrandies  :", tactile);
console.log("la page défile horizontalement :", await p.evaluate(() => document.documentElement.scrollWidth > 392) ? "OUI (défaut)" : "non");
await b.close();
