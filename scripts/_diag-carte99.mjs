// La carte du client s'affiche-t-elle sur les pages d'impact-99 ?
import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "restaurant", tagline: "x", template: "impact-99" } }) });
const { sessionId, editToken } = await r.json();
await fetch(`${BASE}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
  body: JSON.stringify({ businessProfile: { menu: [
    { name: "Tarte Marquisats", category: "Desserts", price: "8 €", description: "Pommes du lac." },
    { name: "Féra du Léman", category: "Poissons", price: "26 €", description: "Beurre blanc." },
  ] } }) });
const b = await chromium.launch();
for (const route of ["carte", "about", "blog", "contact", "reservation"]) {
  const p = await b.newPage();
  await p.goto(`${BASE}/templates/impact-99/${route}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
  await p.waitForTimeout(3200);
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1000);
  const t = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
  console.log(`impact-99/${route}`.padEnd(24),
    "Tarte Marquisats:", t.includes("Tarte Marquisats") ? "OUI" : "non",
    "· Desserts:", t.includes("Desserts") ? "OUI" : "non",
    "| démo « Poulpe Braisé »:", t.includes("Poulpe Braisé") ? "reste" : "remplacée");
  await p.close();
}
await b.close();
