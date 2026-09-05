// La liste câblée apparaît-elle après navigation interne ?
import { chromium } from "playwright";
const BASE = "http://localhost:3000";
const [theme, route, clic] = process.argv.slice(2);
const r = await fetch(`${BASE}/api/sessions`, { method: "POST", headers: { "content-type": "application/json" },
  body: JSON.stringify({ formData: { businessName: "Ateliers Vidal & Fils", city: "Annecy", businessType: "plombier", tagline: "x", template: theme } }) });
const { sessionId, editToken } = await r.json();
await fetch(`${BASE}/api/sessions?id=${sessionId}`, { method: "PATCH", headers: { "content-type": "application/json", "x-edit-token": editToken },
  body: JSON.stringify({ businessProfile: { services: [{ name: "Détartrage Vidal", description: "En moins d'une heure." }], faq: [{ q: "Intervenez-vous le dimanche ?", a: "Oui." }], team: [{ name: "Éloi Vidal", role: "Maître plombier" }] } }) });
const b = await chromium.launch();
const p = await b.newPage();
await p.goto(`${BASE}/templates/${theme}/${route}?session=${sessionId}`, { waitUntil: "domcontentloaded", timeout: 40000 });
await p.waitForTimeout(3000);
if (clic) { try { await p.click(`text=${clic}`, { timeout: 5000 }); await p.waitForTimeout(1500); } catch { console.log("clic raté sur", clic); } }
const t = (await p.evaluate(() => document.body.textContent ?? "")).replace(/\s+/g, " ");
console.log(theme + "/" + route, clic ? "après clic " + clic : "(vue d'ouverture)", "| Détartrage:", t.includes("Détartrage Vidal") ? "OUI" : "non", "| dimanche:", t.includes("Intervenez-vous") ? "OUI" : "non", "| Éloi:", t.includes("Éloi Vidal") ? "OUI" : "non");
await b.close();
