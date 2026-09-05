import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const [theme, route] = process.argv.slice(2);
const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier", tagline: "x", template: theme } }) });
const { sessionId, editToken } = await r.json();
await fetch(`${BASE}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
  body: JSON.stringify({ businessProfile: { services: [{ name: "Détartrage Vidal", description: "En moins d'une heure." }] } }) });
const b = await chromium.launch();
const p = await b.newPage();
const erreurs = [];
p.on("console", (m) => { if (m.type() === "error") erreurs.push(m.text().slice(0, 120)); });
p.on("pageerror", (e) => erreurs.push(("PAGE: " + e.message).slice(0, 120)));
await p.goto(`${BASE}/templates/${theme}/${route}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
await p.waitForTimeout(3200);
const t = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
console.log(theme + "/" + route, "| Détartrage:", t.includes("Détartrage Vidal") ? "OUI" : "non", "| longueur:", t.length);
console.log("erreurs:", erreurs.length ? erreurs.slice(0, 4).join(" || ") : "aucune");
await b.close();
