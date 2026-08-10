// La page carte : que vaut PHILOSOPHY au rendu, et la session arrive-t-elle ?
import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier", tagline: "x", template: "impact-99" } }) });
const { sessionId } = await r.json();
await fetch(`${BASE}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json" },
  body: JSON.stringify({ businessProfile: { services: [{ name: "Détartrage Vidal", description: "En moins d'une heure." }] } }) });
const b = await chromium.launch();
const p = await b.newPage();
const reqs = [];
p.on("response", (res) => { if (res.url().includes("/api/sessions")) reqs.push(res.status() + " " + res.url().slice(-60)); });
await p.goto(`${BASE}/templates/impact-99/carte?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
await p.waitForTimeout(3500);
console.log("requêtes session :", reqs.join(" | ") || "AUCUNE");
// La démonstration de PHILOSOPHY visible ?
const t = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
for (const mot of ["Elemental", "Mastery", "Détartrage"]) console.log(mot, ":", t.includes(mot) ? "OUI" : "non");
await b.close();
