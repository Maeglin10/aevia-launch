import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier", tagline: "x", template: "impact-99" } }) });
const { sessionId } = await r.json();
await fetch(`${BASE}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json" },
  body: JSON.stringify({ businessProfile: { services: [{ name: "Détartrage Vidal", description: "En moins d'une heure." }] } }) });
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(`${BASE}/templates/impact-99/carte?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
await p.waitForTimeout(3000);
// Le bouton d'en-tête, précisément — pas un lien de pied de page qui perdrait la session.
await p.evaluate(() => {
  const btn = [...document.querySelectorAll("nav button, header button")].find((b) => (b.textContent ?? "").trim() === "À propos");
  btn?.click();
});
await p.waitForTimeout(2000);
console.log("url après clic :", p.url().includes("session=") ? "session gardée" : "SESSION PERDUE — " + p.url());
const t = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
console.log("Détartrage:", t.includes("Détartrage Vidal") ? "OUI" : "non", "| Elemental:", t.includes("Elemental") ? "OUI" : "non");
await b.close();
